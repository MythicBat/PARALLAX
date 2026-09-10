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
            futures,
            assumption_ledger,
            blind_spots,
            stress_test,
            information_value,
        ) = await asyncio.gather(

            convene_jury(
                context=reasoning_context,
                juror_count=5,
            ),

            future_engine.generate(
                reasoning_context
            ),

            assumption_engine.build(
                reasoning_context
            ),

            blind_spot_engine.analyze(
                reasoning_context
            ),

            stress_engine.run(
                reasoning_context
            ),

            information_value_engine.analyze(
                reasoning_context
            ),
        )

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

        #
        # STAGE 7
        # Counterfactual analysis
        #

        counterfactual = (
            await counterfactual_engine.analyze(
                {
                    **synthesis_context,
                    "final":
                        final,
                }
            )
        )

        #
        # FINAL EXECUTION RECORD
        #

        return {
            "status": "complete",

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
        }


parallax_orchestrator = (
    ParallaxOrchestrator()
)