from enum import Enum
from time import perf_counter
from typing import Any

from app.core.config import settings
from app.services.nebius_client import nebius_client


class ModelTier(str, Enum):
    LIGHTNING = "lightning"
    NANO = "nano"
    SUPER = "super"
    ULTRA = "ultra"


MODEL_MAP = {
    ModelTier.LIGHTNING: settings.nemotron_lightning_model,
    ModelTier.NANO: settings.nemotron_nano_model,
    ModelTier.SUPER: settings.nemotron_super_model,
    ModelTier.ULTRA: settings.nemotron_ultra_model,
}


class ModelRouter:
    def __init__(self) -> None:
        self.client = nebius_client.client

        self.telemetry = {
            tier.value: {
                "calls": 0,
                "prompt_tokens": 0,
                "completion_tokens": 0,
                "total_tokens": 0,
                "total_latency_ms": 0.0,
            }
            for tier in ModelTier
        }

    def choose_model(
        self,
        task_type: str,
        complexity: float = 0.5,
    ) -> ModelTier:

        task_type = task_type.lower()

        # Instant / lightweight operations
        if task_type in {
            "classification",
            "routing",
            "short_summary",
            "ui",
            "label",
        }:
            return ModelTier.LIGHTNING

        # Structured worker jobs
        if task_type in {
            "extraction",
            "memory",
            "assumption_detection",
            "document_analysis",
            "scoring",
        }:
            return ModelTier.NANO

        # Deep/final reasoning
        if task_type in {
            "final_synthesis",
            "adjudication",
            "deep_counterfactual",
            "conflict_resolution",
        }:
            return ModelTier.ULTRA

        # Escalate difficult generic work
        if complexity >= 0.88:
            return ModelTier.ULTRA

        # Main agentic reasoning tier
        return ModelTier.SUPER

    async def generate(
        self,
        prompt: str,
        system_prompt: str,
        task_type: str = "reasoning",
        complexity: float = 0.5,
        temperature: float = 0.3,
        max_tokens: int = 1800,
    ) -> dict[str, Any]:

        tier = self.choose_model(
            task_type=task_type,
            complexity=complexity,
        )

        model = MODEL_MAP[tier]

        started = perf_counter()

        response = await self.client.chat.completions.create(
            model=model,
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
            temperature=temperature,
            max_tokens=max_tokens,
        )

        latency_ms = (perf_counter() - started) * 1000

        message = response.choices[0].message.content or ""

        usage = response.usage

        prompt_tokens = (
            usage.prompt_tokens
            if usage and usage.prompt_tokens
            else 0
        )

        completion_tokens = (
            usage.completion_tokens
            if usage and usage.completion_tokens
            else 0
        )

        total_tokens = (
            usage.total_tokens
            if usage and usage.total_tokens
            else prompt_tokens + completion_tokens
        )

        stats = self.telemetry[tier.value]

        stats["calls"] += 1
        stats["prompt_tokens"] += prompt_tokens
        stats["completion_tokens"] += completion_tokens
        stats["total_tokens"] += total_tokens
        stats["total_latency_ms"] += latency_ms

        return {
            "content": message,
            "tier": tier.value,
            "model": model,
            "latency_ms": round(latency_ms, 2),
            "usage": {
                "prompt_tokens": prompt_tokens,
                "completion_tokens": completion_tokens,
                "total_tokens": total_tokens,
            },
        }

    def get_telemetry(self) -> dict[str, Any]:
        output = {}

        for tier, stats in self.telemetry.items():
            calls = stats["calls"]

            average_latency = (
                stats["total_latency_ms"] / calls
                if calls
                else 0
            )

            output[tier] = {
                **stats,
                "average_latency_ms": round(
                    average_latency,
                    2,
                ),
            }

        return output


model_router = ModelRouter()