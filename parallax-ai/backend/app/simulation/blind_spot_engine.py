import json
from typing import Any
import uuid
from app.schemas.simulation import BlindSpotReport
from app.simulation.validated_generation import generate_validated


SYSTEM_PROMPT = """
You are the Blind Spot Detection Engine inside PARALLAX.

Your job is to discover important considerations that the user,
specialist agents, or simulations may be overlooking.

A valid blind spot must:

- be relevant to the decision
- plausibly affect the decision
- not merely repeat an existing assumption
- include a way to investigate or validate it

Prioritize quality over quantity.

Return no more than 8 blind spots.

Return JSON only:

{
  "blind_spots": [
    {
      "id": "temporary",
      "title": "...",
      "explanation": "...",
      "severity": "high",
      "affected_options": [],
      "why_it_matters": "...",
      "validation_action": "..."
    }
  ]
}
"""

SYSTEM_PROMPT += "\nFor EVERY generated item, include ALL required JSON fields shown above. Do not omit fields. If evidence is unknown, express uncertainty honestly rather than inventing facts. Return one complete JSON object.\n"

class BlindSpotEngine:
    async def analyze(self, context: dict[str, Any]) -> dict[str, Any]:
        validated, result = await generate_validated(
            context=context,
            system_prompt=SYSTEM_PROMPT,
            schema=BlindSpotReport,
            task_type="reasoning",
            complexity=0.78,
            temperature=0.3,
            max_tokens=2200,
            agent="Blind Spot Analyst",
            role="hidden-risk discovery",
            stage="blind-spot-detection",
        )
        for item in validated.blind_spots:
            item.id = "blind_" + uuid.uuid4().hex[:10]
        return {
            "report": validated.model_dump(),
            "inference": {
                "tier": result["tier"],
                "model": result["model"],
                "latency_ms": result["latency_ms"],
                "usage": result["usage"],
            },
        }


blind_spot_engine = BlindSpotEngine()