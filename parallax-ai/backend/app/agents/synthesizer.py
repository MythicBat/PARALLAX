import json
from typing import Any

from app.services.model_router import model_router


SYNTHESIS_SYSTEM = """
You are the Chief Synthesizer inside PARALLAX.

You receive:
- the decision architecture
- specialist agent reports
- red-team findings
- independent jury evaluations

Your job is to synthesize the decision.

You MUST NOT pretend to predict the future.

You must explain:

1. Which option currently appears most robust
2. Why
3. Strongest competing option
4. Main trade-offs
5. Critical assumptions
6. Biggest unknown
7. What information would most change the result
8. What conditions could reverse the recommendation
9. Overall confidence as LOW, MEDIUM, or HIGH

Never generate fake probabilities.

Return structured JSON only.

Format:

{
  "current_preference": "",
  "confidence": "LOW | MEDIUM | HIGH",
  "summary": "",
  "why": [],
  "strongest_alternative": "",
  "tradeoffs": [],
  "critical_assumptions": [],
  "biggest_unknown": "",
  "highest_value_information": "",
  "reversal_conditions": [],
  "caution": ""
}
"""


async def synthesize_decision(
    context: dict[str, Any],
) -> dict[str, Any]:

    result = await model_router.generate(
        prompt=json.dumps(
            context,
            indent=2,
        ),
        system_prompt=SYNTHESIS_SYSTEM,
        task_type="final_synthesis",
        complexity=0.96,
        temperature=0.15,
        max_tokens=2600,
    )

    return {
        "analysis": result["content"],
        "inference": {
            "tier": result["tier"],
            "model": result["model"],
            "latency_ms": result["latency_ms"],
            "usage": result["usage"],
        },
    }