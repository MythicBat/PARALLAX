from fastapi import APIRouter
from pydantic import BaseModel

from app.services.model_router import model_router


router = APIRouter(
    prefix="/router",
    tags=["Model Router"],
)


class RouterTestRequest(BaseModel):
    prompt: str
    task_type: str = "reasoning"
    complexity: float = 0.5


@router.post("/test")
async def router_test(payload: RouterTestRequest):

    result = await model_router.generate(
        prompt=payload.prompt,
        system_prompt=(
            "You are an NVIDIA Nemotron model working inside "
            "PARALLAX, an AI decision simulation engine."
        ),
        task_type=payload.task_type,
        complexity=payload.complexity,
    )

    return result


@router.get("/telemetry")
async def router_telemetry():
    return model_router.get_telemetry()