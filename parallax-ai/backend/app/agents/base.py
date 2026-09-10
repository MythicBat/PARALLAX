from abc import ABC, abstractmethod
from typing import Any

from app.services.model_router import model_router

class BaseAgent(ABC):
    name: str = "Base Agent"
    role: str = "General Reasoning Agent"
    task_type: str = "reasoning"
    complexity: float = 0.65

    @property
    def system_prompt(self) -> str:
        return f"""
You are {self.name}, a specialist agent inside PARALLAX.

ROLE:
{self.role}

PARALLAX is a decision simulation engine.

Rules:
- Do not fabricate facts.
- Distinguish facts from assumptions.
- Expose uncertainty.
- Do not pretend a simulated outcome is certain.
- Challenge weak reasoning.
- Return concise, structured analysis.
"""
    @abstractmethod
    def build_prompt(self, context: dict[str, Any]) -> str:
        ...

    async def run(self, context: dict[str, Any]) -> dict[str, Any]:
        result = await model_router.generate(
            prompt=self.build_prompt(context),
            system_prompt=self.system_prompt,
            task_type=self.task_type,
            complexity=self.complexity,
            temperature=0.25,
            max_tokens=1800,
        )

        return {
            "agent": self.name,
            "role": self.role,
            "analysis": result["content"],
            "inference": {
                "tier": result["tier"],
                "model": result["model"],
                "latency_ms": result["latency_ms"],
                "usage": result["usage"],
            },
        }