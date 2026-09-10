import json
from typing import Any

from app.core.json_utils import extract_json
from app.schemas.simulation import (
    CounterfactualResult,
)
from app.services.model_router import model_router


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


class CounterfactualEngine:

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
            task_type="deep_counterfactual",
            complexity=0.9,
            temperature=0.2,
            max_tokens=2200,
        )

        parsed = extract_json(
            result["content"]
        )

        counterfactual = (
            CounterfactualResult.model_validate(
                parsed
            )
        )

        return {
            "counterfactual":
                counterfactual.model_dump(),

            "inference": {
                "tier": result["tier"],
                "model": result["model"],
                "latency_ms":
                    result["latency_ms"],
                "usage":
                    result["usage"],
            },
        }


counterfactual_engine = (
    CounterfactualEngine()
)