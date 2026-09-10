from fastapi import APIRouter

from app.agents.decision_architect import (
    decision_architect,
)
from app.orchestration.orchestrator import (
    parallax_orchestrator,
)
from app.schemas.decision import (
    DecisionCreateRequest,
)
from app.simulation.future_engine import (
    future_engine,
)


router = APIRouter(
    prefix="/decisions",
    tags=["Decisions"],
)


@router.post("/architect")
async def architect_decision(
    payload: DecisionCreateRequest,
):
    return await decision_architect.run(
        payload
    )


@router.post("/simulate")
async def simulate_decision(
    payload: DecisionCreateRequest,
):
    return await parallax_orchestrator.simulate(
        payload
    )


@router.post("/futures")
async def generate_futures(
    payload: DecisionCreateRequest,
):

    architecture = (
        await decision_architect.run(
            payload
        )
    )

    return await future_engine.generate(
        {
            "decision":
                payload.model_dump(),

            "architecture":
                architecture[
                    "architecture"
                ],
        }
    )