import asyncio
from typing import Any

from app.agents.decision_architect import (
    decision_architect,
)
from app.agents.jury import convene_jury
from app.agents.red_team import red_team_agent
from app.agents.synthesizer import (
    synthesize_decision,
)

from app.orchestration.parallel_runner import (
    run_agents_parallel,
)
from app.orchestration.team_builder import (
    build_agent_team,
)

from app.schemas.decision import (
    DecisionCreateRequest,
)

from app.simulation.assumption_engine import (
    assumption_engine,
)
from app.simulation.blind_spot_engine import (
    blind_spot_engine,
)
from app.simulation.counterfactual_engine import (
    counterfactual_engine,
)
from app.simulation.future_engine import (
    future_engine,
)
from app.simulation.information_value_engine import (
    information_value_engine,
)
from app.simulation.stress_engine import (
    stress_engine,
)

from app.orchestration.safe_execution import run_optional_agent


class ParallaxOrchestrator:

    async def simulate(
        self,
        decision: DecisionCreateRequest,
    ) -> dict[str, Any]:

        #
        # STAGE 1
        # Decision Architecture
        #

        architecture_result = (
            await decision_architect.run(
                decision
            )
        )

        architecture = architecture_result[
            "architecture"
        ]

        team = build_agent_team(
            architecture["decision_type"]
        )

        base_context = {
            "decision":
                decision.model_dump(),

            "architecture":
                architecture,
        }

        #
        # STAGE 2
        # Parallel specialist reasoning
        #

        specialist_results = (
            await run_agents_parallel(
                agent_names=team,
                context=base_context,
            )
        )

        #
        # STAGE 3
        # Contrarian
        #

        contrarian_results = (
            await run_agents_parallel(
                agent_names=["contrarian"],
                context={
                    **base_context,

                    "specialist_reports":
                        specialist_results,
                },
            )
        )

        #
        # STAGE 4
        # Red Team
        #

        red_team_result = (
            await red_team_agent.run(
                {
                    **base_context,

                    "specialist_reports":
                        specialist_results,

                    "contrarian":
                        contrarian_results,
                }
            )
        )

        reasoning_context = {
            **base_context,

            "specialist_reports":
                specialist_results,

            "contrarian":
                contrarian_results,

            "red_team":
                red_team_result,
        }

        #
        # STAGE 5
        # Jury + Simulation Intelligence
        #
        # These jobs have no dependency on
        # one another, so run concurrently.
        #

        (
            jury_results,
            futures_outcome,
            assumption_outcome,
            blind_spots_outcome,
            stress_outcome,
            information_outcome,
        ) = await asyncio.gather(

            convene_jury(
                context=reasoning_context,
                juror_count=5,
            ),

            run_optional_agent(
                "future_simulation",
                future_engine.generate(reasoning_context)
            ),

            run_optional_agent(
                "assumption_ledger",
                assumption_engine.build(reasoning_context),
            ),

            run_optional_agent(
                "blind_spot_detection",
                blind_spot_engine.analyze(reasoning_context),
            ),

            run_optional_agent(
                "stress_testing",
                stress_engine.run(reasoning_context)
            ),

            run_optional_agent(
                "information_value",
                information_value_engine.analyze(reasoning_context)
            )
        )

        optional_outcomes = {
            "futures": futures_outcome,
            "assumption_ledger": assumption_outcome,
            "blind_spots": blind_spots_outcome,
            "stress_test": stress_outcome,
            "information_value": information_outcome,
        }

        failed_agents = [
            {
                "agent": outcome["agent"],
                "error_type": outcome["error"]["type"],
            }
            for outcome in optional_outcomes.values()
            if outcome["status"] == "failed"
        ]

        # Preserve the existing top-level response keys.
        # A failed optional agent has no fabricated result.
        futures = futures_outcome["result"]
        assumption_ledger = assumption_outcome["result"]
        blind_spots = blind_spots_outcome["result"]
        stress_test = stress_outcome["result"]
        information_value = information_outcome["result"]

        #
        # STAGE 6
        # Ultra synthesis
        #

        synthesis_context = {
            **reasoning_context,

            "jury":
                jury_results,

            "futures":
                futures,

            "assumption_ledger":
                assumption_ledger,

            "blind_spots":
                blind_spots,

            "stress_test":
                stress_test,

            "information_value":
                information_value,
        }

        final = await synthesize_decision(
            synthesis_context
        )

        if failed_agents:
            final["incomplete_intelligence"] = True
            final["unavailable_agents"] = [
                item["agent"] for item in failed_agents
            ]

        #
        # STAGE 7
        # Counterfactual analysis
        #

        counterfactual_outcome = await run_optional_agent(
            "counterfactual_analysis",
            counterfactual_engine.analyze(
                {
                    **synthesis_context,
                    "final": final,
                }
            ),
        )

        counterfactual = counterfactual_outcome["result"]

        if counterfactual_outcome["status"] == "failed":
            failed_agents.append({
                "agent": "counterfactual_analysis",
                "error_type": counterfactual_outcome["error"]["type"]
            })

        #
        # FINAL EXECUTION RECORD
        #

        return {
            "status": "partial" if failed_agents else "complete",

            "pipeline": [
                "decision_architect",
                "specialist_team",
                "contrarian",
                "red_team",
                "ai_jury",
                "future_simulation",
                "assumption_ledger",
                "blind_spot_detection",
                "stress_testing",
                "information_value",
                "ultra_synthesis",
                "counterfactual_analysis",
            ],

            "team":
                team,

            "architecture":
                architecture_result,

            "specialists":
                specialist_results,

            "contrarian":
                contrarian_results,

            "red_team":
                red_team_result,

            "jury":
                jury_results,

            "futures":
                futures,

            "assumption_ledger":
                assumption_ledger,

            "blind_spots":
                blind_spots,

            "stress_test":
                stress_test,

            "information_value":
                information_value,

            "final":
                final,

            "counterfactual":
                counterfactual,

            "failed_agents": failed_agents,
            "incomplete_intelligence": bool(failed_agents)
        }


parallax_orchestrator = (
    ParallaxOrchestrator()
)