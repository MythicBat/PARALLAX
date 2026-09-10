import json
from typing import Any

from app.core.json_utils import extract_json
from app.schemas.simulation import (
    InformationValueResult,
)
from app.services.model_router import model_router


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


class InformationValueEngine:

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
            complexity=0.72,
            temperature=0.2,
            max_tokens=2200,
        )

        parsed = extract_json(
            result["content"]
        )

        information = (
            InformationValueResult.model_validate(
                parsed
            )
        )

        return {
            "information_value":
                information.model_dump(),

            "inference": {
                "tier": result["tier"],
                "model": result["model"],
                "latency_ms":
                    result["latency_ms"],
                "usage":
                    result["usage"],
            },
        }


information_value_engine = (
    InformationValueEngine()
)