from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router_test import router as model_router_api
from app.services.nebius_client import nebius_client


app = FastAPI(
    title="PARALLAX API",
    description=(
        "Multi-agent decision intelligence and "
        "future simulation engine."
    ),
    version="0.2.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(model_router_api)


@app.get("/")
async def root():
    return {
        "product": "PARALLAX",
        "tagline": "See what happens before you decide.",
        "status": "online",
        "version": "0.2.0",
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
    }


@app.get("/models/nvidia")
async def nvidia_models():

    models = await nebius_client.list_nvidia_models()

    return {
        "provider": "Nebius Token Factory",
        "count": len(models),
        "models": models,
    }