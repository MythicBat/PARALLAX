import json
from typing import Any
import uuid
from app.schemas.simulation import AssumptionLedger
from app.simulation.validated_generation import generate_validated


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

SYSTEM_PROMPT += "\nFor EVERY generated item, include ALL required JSON fields shown above. Do not omit fields. If evidence is unknown, express uncertainty honestly rather than inventing facts. Return one complete JSON object.\n"

class AssumptionEngine:
    async def build(self, context: dict[str, Any]) -> dict[str, Any]:
        validated, result = await generate_validated(
            context=context,
            system_prompt=SYSTEM_PROMPT,
            schema=AssumptionLedger,
            task_type="assumption_detection",
            complexity=0.58,
            temperature=0.1,
            max_tokens=3000,
            agent="Assumption Auditor",
            role="evidence and assumption audit",
            stage="assumption-audit",
        )
        for item in validated.items:
            item.id = "asm_" + uuid.uuid4().hex[:10]
        return {
            "ledger": validated.model_dump(),
            "inference": {
                "tier": result["tier"],
                "model": result["model"],
                "latency_ms": result["latency_ms"],
                "usage": result["usage"],
            },
        }


assumption_engine = AssumptionEngine()
