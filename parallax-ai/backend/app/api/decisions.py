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