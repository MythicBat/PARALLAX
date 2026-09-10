import json
import uuid
from typing import Any

from app.core.json_utils import extract_json
from app.schemas.simulation import SimulationResult
from app.services.model_router import model_router

SYSTEM_PROMPT = """
You are the Future Simulation Engine inside PARALLAX.

You do not predict the future.

You construct plausible decision scenarios from supplied evidence,
assumptions, uncertainty, and specialist analysis.

For EACH decision option, generate exactly:

1. best_case
2. base_case
3. worst_case

The scenarios must be plausible, meaningfully different,
and grounded in the supplied information.

A robustness_score is NOT a probability.
It is a comparative score from 0 to 100 representing how well that scenario
holds up against uncertainty and downside exposure.

Do not invent facts.

Return JSON only.

Required structure:

{
  "simulations": [
    {
      "option": "Option name",
      "futures": [
        {
          "id": "temporary",
          "option": "Option name",
          "scenario_type": "best_case",
          "title": "Short title",
          "narrative": "Scenario explanation",
          "outcome_dimensions": [
            {
              "name": "career growth",
              "direction": "positive",
              "explanation": "..."
            }
          ],
          "key_drivers": [],
          "assumptions_required": [],
          "warning_signals": [],
          "reversibility": "medium",
          "uncertainty": "medium",
          "robustness_score": 72
        }
      ]
    }
  ]
}
"""

class FutureEngine:

    async def generate(self, context: dict[str, Any]) -> dict[str, Any]:

        result = await model_router.generate(
            prompt=json.dumps(
                context,
                indent=2,
                ensure_ascii=False,
            ),
            system_prompt=SYSTEM_PROMPT,
            task_type="simulation",
            complexity=0.82,
            temperature=0.35,
            max_tokens=5000,
        )

        parsed = extract_json(result["content"])

        simulation = (
            SimulationResult.model_validate(parsed)
        )

        # Replace any LLM-generated IDs with application-controlled IDs.
        for option in simulation.simulations:
            for future in option.futures:
                future.id = (
                    "future_"
                    + uuid.uuid4().hex[:12]
                )

        return {
            "simulation": simulation.model_dump(),
            "inference": {
                "tier": result["tier"],
                "model": result["model"],
                "latency_ms": result["latency_ms"],
                "usage": result["usage"],
            },
        }

future_engine = FutureEngine()