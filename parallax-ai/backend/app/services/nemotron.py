from app.core.config import settings
from app.services.nebius_client import nebius_client

class NemotronService:
    def __init__(self) -> None:
        self.client = nebius_client.client

    def super_chat(self, prompt:str, system_prompt: str = "You are an expert reasoning agent.") -> str:
        response = self.client.chat.completions.create(
            model=settings.nemotron_super_model,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.4,
        )

        return response.choices[0].message.content or ""

nemotron_service = NemotronService()