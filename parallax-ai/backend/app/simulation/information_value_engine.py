import json
from typing import Any
from app.schemas.simulation import InformationValueResult
from app.simulation.validated_generation import generate_validated


SYSTEM_PROMPT = """
You are the Information Value Engine inside PARALLAX.

Find missing information that could materially alter the decision.

Rank information by:

1. potential decision impact
2. usefulness
3. practicality of obtaining it

Prefer specific answerable questions.

Bad:
"Learn more about the company."

Good:
"Ask what percentage of engineers move internally
within their first 24 months."

Return no more than 6 questions.

Return JSON only:

{
  "highest_value_question": "...",
  "items": [
    {
      "question": "...",
      "reason": "...",
      "decision_impact": "high",
      "effort_to_obtain": "low",
      "affected_options": []
    }
  ]
}
"""

SYSTEM_PROMPT += "\nFor EVERY generated item, include ALL required JSON fields shown above. Do not omit fields. If evidence is unknown, express uncertainty honestly rather than inventing facts. Return one complete JSON object.\n"

class InformationValueEngine:
    async def analyze(self, context: dict[str, Any]) -> dict[str, Any]:
        validated, result = await generate_validated(
            context=context,
            system_prompt=SYSTEM_PROMPT,
            schema=InformationValueResult,
            task_type="reasoning",
            complexity=0.72,
            temperature=0.2,
            max_tokens=2200,
            agent="Information Strategist",
            role="value-of-information analysis",
            stage="information-value",
        )
        return {
            "information_value": validated.model_dump(),
            "inference": {
                "tier": result["tier"],
                "model": result["model"],
                "latency_ms": result["latency_ms"],
                "usage": result["usage"],
            },
        }


information_value_engine = InformationValueEngine()
