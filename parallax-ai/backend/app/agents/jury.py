import asyncio
import json
from typing import Any

from app.services.model_router import model_router


JURY_SYSTEM = """
You are an independent juror inside PARALLAX.

You must evaluate a decision independently.

Rules:

- Do not follow consensus automatically.
- Do not invent facts.
- Consider uncertainty.
- State which option currently appears strongest.
- You may abstain if evidence is insufficient.
- Explain what could reverse your judgment.

Return concise JSON only.

Format:

{
  "verdict": "option name or ABSTAIN",
  "confidence": "low | medium | high",
  "reason": "short explanation",
  "key_uncertainty": "most important uncertainty",
  "reversal_condition": "what could change your verdict"
}
"""


async def run_single_juror(
    number: int,
    context: dict[str, Any],
) -> dict[str, Any]:

    prompt = f"""
You are juror #{number}.

Evaluate this decision independently.

{json.dumps(context, indent=2)}
"""

    result = await model_router.generate(
        prompt=prompt,
        system_prompt=JURY_SYSTEM,
        task_type="reasoning",
        complexity=0.74,
        temperature=0.35,
        max_tokens=900,
    )

    return {
        "juror": number,
        "analysis": result["content"],
        "inference": {
            "tier": result["tier"],
            "model": result["model"],
            "latency_ms": result["latency_ms"],
            "usage": result["usage"],
        },
    }


async def convene_jury(
    context: dict[str, Any],
    juror_count: int = 5,
) -> list[dict[str, Any]]:

    tasks = [
        run_single_juror(
            number=i,
            context=context,
        )
        for i in range(1, juror_count + 1)
    ]

    return await asyncio.gather(*tasks)