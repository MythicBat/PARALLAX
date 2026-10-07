from fastapi import APIRouter
from time import perf_counter

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
from app.observability import (
    begin_trace_session,
    build_observatory_payload,
)

from app.simulation.stress_engine import (
    stress_engine,
)

from app.schemas.simulation import (
    CustomStressRequest,
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
    begin_trace_session()

    started = perf_counter()

    result = await parallax_orchestrator.simulate(payload)

    duration_ms = (perf_counter() - started) * 1000

    observatory = (build_observatory_payload())

    observatory["summary"]["simulation_duration_ms"] = round(duration_ms, 2)

    result["observatory"] = (observatory)

    return result


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

@router.post("/stress")
async def stress_decision(payload: CustomStressRequest):
    begin_trace_session()

    context = {
        "decision": payload.decision,
        "architecture": payload.architecture,
        "custom_stress_scenario": payload.scenario,
    }

    result = await stress_engine.generate(context)

    return {
        "result": result,
        "observatory": build_observatory_payload(),
    }