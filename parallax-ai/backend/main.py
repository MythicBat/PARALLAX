from fastapi import FastAPI
from pydantic import BaseModel

from app.services.nebius_client import nebius_client
from app.services.nemotron import nemotron_service

app = FastAPI(
    title="PARALLAX API",
    description="Decision intelligence and future simulation engine.",
    version="0.1.0",
)

class TestPrompt(BaseModel):
    prompt: str

@app.get("/")
async def root():
    return {
        "product": "PARALLAX",
        "status": "online",
        "version": "0.1.0",
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
    }

@app.get("/models/nvidia")
async def nvidia_models():
    models = nebius_client.list_nvidia_models()

    return {
        "provider": "Nebius Token Factory",
        "count": len(models),
        "models": models,
    }

@app.post("/models/nemotron/test")
async def test_nemotron(payload: TestPrompt):

    response = nemotron_service.super_chat(
        prompt=payload.prompt,
        system_prompt=(
            "You are PARALLAX, an AI decision intelligence engine. "
            "Answer concisely."
        ),
    )

    return {
        "model": "Nemotron Super",
        "response": response,
    }