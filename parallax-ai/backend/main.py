from fastapi import FastAPI

from app.services.nebius_client import nebius_client

app = FastAPI(
    title="PARALLAX API",
    description="Decision intelligence and future simulation engine.",
    version="0.1.0",
)

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