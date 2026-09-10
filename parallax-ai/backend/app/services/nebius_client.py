from openai import OpenAI

from app.core.config import settings

class NebiusClient:
    def __init__(self) -> None:
        self.client = OpenAI(
            api_key=settings.nebius_api_key,
            base_url=settings.nebius_base_url,
        )

    def list_models(self) -> list[str]:
        response = self.client.models.list()

        return sorted(
            model.id for model in response.data
        )

    def list_nvidia_models(self) -> list[str]:
        models = self.list_models()

        return [
            model for model in models if "nvidia" in model.lower() or "nemotron" in model.lower()
        ]

nebius_client = NebiusClient()
    