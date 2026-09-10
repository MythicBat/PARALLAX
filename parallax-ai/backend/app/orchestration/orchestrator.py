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


class ParallaxOrchestrator:

    async def simulate(
        self,
        decision: DecisionCreateRequest,
    ) -> dict[str, Any]:

        #
        # Stage 1 — Architect decision
        #

        architecture_result = (
            await decision_architect.run(
                decision
            )
        )

        architecture = architecture_result[
            "architecture"
        ]

        #
        # Stage 2 — Build specialist team
        #

        team = build_agent_team(
            architecture["decision_type"]
        )

        base_context = {
            "decision": decision.model_dump(),
            "architecture": architecture,
        }

        #
        # Stage 3 — Parallel specialist analysis
        #

        specialist_results = (
            await run_agents_parallel(
                agent_names=team,
                context=base_context,
            )
        )

        #
        # Stage 4 — Contrarian
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
        # Stage 5 — Red team
        #

        red_team_result = await red_team_agent.run(
            {
                **base_context,
                "specialist_reports":
                    specialist_results,
                "contrarian":
                    contrarian_results,
            }
        )

        #
        # Stage 6 — Independent AI jury
        #

        jury_context = {
            **base_context,
            "specialist_reports":
                specialist_results,
            "contrarian":
                contrarian_results,
            "red_team":
                red_team_result,
        }

        jury_results = await convene_jury(
            context=jury_context,
            juror_count=5,
        )

        #
        # Stage 7 — Ultra synthesis
        #

        synthesis_context = {
            **jury_context,
            "jury":
                jury_results,
        }

        final = await synthesize_decision(
            synthesis_context
        )

        #
        # Complete execution record
        #

        return {
            "status": "complete",

            "pipeline": [
                "decision_architect",
                "specialist_team",
                "contrarian",
                "red_team",
                "ai_jury",
                "ultra_synthesis",
            ],

            "team": team,

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

            "final":
                final,
        }


parallax_orchestrator = ParallaxOrchestrator()