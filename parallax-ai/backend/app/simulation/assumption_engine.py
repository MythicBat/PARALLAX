import json
import uuid
from typing import Any
from pydantic import ValidationError

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
            agent="Assumption Auditor",
            role="evidence and assumption audit",
            stage="assumption-audit"
        )

        ledger = None

        for attempt in range(2):
            content = result.get("content") or ""

            try:
                parsed = extract_json(content)
                ledger = AssumptionLedger.model_validate(parsed)
                break
            except (ValueError, ValidationError) as exc:
                print(
                    f"Assumption Engine validation failed "
                    f"(attempt {attempt + 1}/2): "
                    f"{type(exc).__name__}"
                )

                print("Model:", result.get("model"))
                print("Tier:", result.get("tier"))
                print("Response length:", len(content))
                print("Usage:", result.get("usage"))

                if attempt == 1:
                    raise

                result = await model_router.generate(
                    prompt=(
                        "Generate a valid Assumption Ledger "
                        "for the following decision context.\n\n"
                        "Return ONLY a complete JSON object "
                        "matching the required schema.\n"
                        "Do not include markdown or commentary.\n"
                        "Use the exact allowed enumeration values.\n\n"
                        f"{json.dumps(context, ensure_ascii=False)}"
                    ),
                    system_prompt=SYSTEM_PROMPT,
                    task_type="assumption_detection",
                    complexity=0.58,
                    temperature=0.0,
                    max_tokens=3800,
                    agent="Assumption Auditor",
                    role="evidence and assumption audit retry",
                    stage="assumption-audit-retry",
                )

        if ledger is None:
            raise RuntimeError("Assumption Engine did not produce a valid ledger")

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