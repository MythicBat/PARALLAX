from openai import AsyncOpenAI

from app.core.config import settings


class NebiusClient:
    def __init__(self) -> None:
        self.client = AsyncOpenAI(
            api_key=settings.nebius_api_key,
            base_url=settings.nebius_base_url,
            timeout=120.0,
        )

    async def list_models(self) -> list[str]:
        response = await self.client.models.list()

        return sorted(model.id for model in response.data)

    async def list_nvidia_models(self) -> list[str]:
        models = await self.list_models()

        return [
            model
            for model in models
            if "nvidia" in model.lower()
            or "nemotron" in model.lower()
        ]


nebius_client = NebiusClient()