import json
import uuid
from typing import Any

from app.core.json_utils import extract_json
from app.schemas.simulation import AssumptionLedger
from app.services.model_router import model_router


SYSTEM_PROMPT = """
You are the Assumption Ledger Engine inside PARALLAX.

Audit all supplied information.

Classify relevant statements into:

known:
Explicitly supplied facts.

inferred:
Reasonable implications but not directly stated.

assumed:
Claims that must be assumed for reasoning to work.

unknown:
Important information that is missing.

For every item determine:

- confidence
- decision impact
- affected options
- source where possible
- validation question where useful

Never turn an inference into a fact.

Return JSON only:

{
  "items": [
    {
      "id": "temporary",
      "statement": "...",
      "category": "known",
      "source": "user context",
      "confidence": "high",
      "impact": "high",
      "affected_options": [],
      "validation_question": null
    }
  ]
}
"""


class AssumptionEngine:

    async def build(
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
            task_type="assumption_detection",
            complexity=0.58,
            temperature=0.1,
            max_tokens=3000,
        )

        parsed = extract_json(
            result["content"]
        )

        ledger = (
            AssumptionLedger.model_validate(
                parsed
            )
        )

        for item in ledger.items:
            item.id = (
                "asm_"
                + uuid.uuid4().hex[:10]
            )

        return {
            "ledger":
                ledger.model_dump(),

            "inference": {
                "tier": result["tier"],
                "model": result["model"],
                "latency_ms":
                    result["latency_ms"],
                "usage":
                    result["usage"],
            },
        }


assumption_engine = AssumptionEngine()