import json
from typing import Any
import uuid
from app.schemas.simulation import SimulationResult
from app.simulation.validated_generation import generate_validated


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

SYSTEM_PROMPT += "\nFor EVERY generated item, include ALL required JSON fields shown above. Do not omit fields. If evidence is unknown, express uncertainty honestly rather than inventing facts. Return one complete JSON object.\n"

def normalize_future_output(data):
    """
    Repair missing presentation-only fields in future scenarios.

    Do not fabricate outcomes, probabilities, scores, or other substantive simulation data.
    """

    if not isinstance(data, dict):
        return data

    simulations = data.get("simulations")

    if not isinstance(simulations, list):
        return data

    for option_index, option in enumerate(simulations):
        if not isinstance(option, dict):
            continue

        option_name = option.get("option") or f"Option {option_index + 1}"
        futures = option.get("futures")

        if not isinstance(futures, list):
            continue

        for future_index, future in enumerate(futures):
            if not isinstance(future, dict):
                continue

            title = future.get("title")

            if not isinstance(title, str) or not title.strip():
                scenario_type = future.get("scenario_type")

                scenario_labels = {
                    "best_case": "Best-case future",
                    "base_case": "Base-case future",
                    "worst_case": "Worst-case future",
                }

                label = scenario_labels.get(
                    scenario_type,
                    f"Future {future_index + 1}",
                )

                future["title"] = f"{option_name} — {label}"
    return data      

class FutureEngine:
    async def generate(self, context: dict[str, Any]) -> dict[str, Any]:
        validated, result = await generate_validated(
            context=context,
            system_prompt=SYSTEM_PROMPT,
            schema=SimulationResult,
            normalize=normalize_future_output,
            task_type="simulation",
            complexity=0.82,
            temperature=0.35,
            max_tokens=5000,
            agent="Future Simulator",
            role="scenario simulation",
            stage="future-simulation",
        )
        for option in validated.simulations:
            for future in option.futures:
                future.id = "future_" + uuid.uuid4().hex[:12]
        return {
            "simulation": validated.model_dump(),
            "inference": {
                "tier": result["tier"],
                "model": result["model"],
                "latency_ms": result["latency_ms"],
                "usage": result["usage"],
            },
        }


future_engine = FutureEngine()
