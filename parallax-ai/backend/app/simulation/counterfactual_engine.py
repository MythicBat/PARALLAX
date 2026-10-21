import json
from typing import Any
from app.schemas.simulation import CounterfactualResult
from app.simulation.validated_generation import generate_validated


SYSTEM_PROMPT = """
You are the Counterfactual Engine inside PARALLAX.

You are given a current preference and competing option.

Determine:

"What would have to become true for the challenger
to become the stronger decision?"

Only propose meaningful decision variables.

Do not simply say "if it becomes better."

Examples of useful counterfactual variables:

- compensation
- time commitment
- promotion opportunity
- switching cost
- probability-independent risk exposure
- location constraints
- learning opportunity
- reversibility
- evidence quality

Do not invent current facts.

Return JSON only:

{
  "current_preference": "...",
  "challenger": "...",
  "conditions": [
    {
      "variable": "...",
      "required_change": "...",
      "explanation": "..."
    }
  ],
  "plausible": true,
  "summary": "..."
}
"""

SYSTEM_PROMPT += "\nFor EVERY generated item, include ALL required JSON fields shown above. Do not omit fields. If evidence is unknown, express uncertainty honestly rather than inventing facts. Return one complete JSON object.\n"

class CounterfactualEngine:
    async def analyze(self, context: dict[str, Any]) -> dict[str, Any]:
        validated, result = await generate_validated(
            context=context,
            system_prompt=SYSTEM_PROMPT,
            schema=CounterfactualResult,
            task_type="deep_counterfactual",
            complexity=0.9,
            temperature=0.2,
            max_tokens=2200,
            agent="Counterfactual Analyst",
            role="decision reversal analysis",
            stage="counterfactual-analysis",
        )
        return {
            "counterfactual": validated.model_dump(),
            "inference": {
                "tier": result["tier"],
                "model": result["model"],
                "latency_ms": result["latency_ms"],
                "usage": result["usage"],
            },
        }


counterfactual_engine = CounterfactualEngine()