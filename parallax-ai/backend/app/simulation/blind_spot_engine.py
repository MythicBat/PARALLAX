import json
import uuid
from typing import Any

from app.core.json_utils import extract_json
from app.schemas.simulation import BlindSpotReport
from app.services.model_router import model_router


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


class BlindSpotEngine:

    async def analyze(
        self,
        context: dict[str, Any],
    ) -> dict[str, Any]:

        result = await model_router.generate(
            prompt=json.dumps(
                context,
                indent=2,
                ensure_ascii=False,
            ),
            system_prompt=SYSTEM_PROMPT,
            task_type="reasoning",
            complexity=0.78,
            temperature=0.3,
            max_tokens=2200,
        )

        parsed = extract_json(
            result["content"]
        )

        report = (
            BlindSpotReport.model_validate(
                parsed
            )
        )

        for blind_spot in report.blind_spots:
            blind_spot.id = (
                "blind_"
                + uuid.uuid4().hex[:10]
            )

        return {
            "report":
                report.model_dump(),

            "inference": {
                "tier": result["tier"],
                "model": result["model"],
                "latency_ms":
                    result["latency_ms"],
                "usage":
                    result["usage"],
            },
        }


blind_spot_engine = BlindSpotEngine()