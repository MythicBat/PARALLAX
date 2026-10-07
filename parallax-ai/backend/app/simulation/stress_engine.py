import json
import uuid
from typing import Any

from app.core.json_utils import extract_json
from app.schemas.simulation import (StressTestResult)
from app.services.model_router import model_router

SYSTEM_PROMPT = """
You are the Stress Test Engine inside PARALLAX.

Your goal is to test how robust decision options remain
under plausible adverse conditions.

Generate 4 to 6 stress scenarios relevant to THIS decision.

Do not use generic disasters unless they actually matter.

Examples might include:

- cost increases
- loss of income
- delayed promotion
- market downturn
- schedule pressure
- project failure
- reduced demand
- unexpected dependency failure

For every option and every scenario,
evaluate the impact.

Do not generate fake probabilities.

"survives" means the option remains reasonably viable,
not that the outcome is guaranteed.

Return JSON only:

{
  "scenarios": [
    {
      "id": "temporary",
      "name": "...",
      "description": "...",
      "severity": "severe"
    }
  ],
  "impacts": [
    {
      "option": "...",
      "scenario_id": "temporary",
      "impact": "major_damage",
      "explanation": "...",
      "survives": true
    }
  ],
  "most_resilient_option": "...",
  "explanation": "..."
}
"""

class StressEngine:

    async def run(self, context: dict[str, Any]) -> dict[str, Any]:

        custom_scenario = context.get("custom_stress_scenario")

        custom_instructions = ""

        if custom_scenario:
            custom_instructions = f"""
IMPORTANT CUSTOM STRESS SCENARIO:

The user specifically wants the decision tested against this scenario:
{custom_scenario}

You MUST include this exact hypothetical as one of the generated stress scenarios.

Treat it as an adverse hypothetical, not as a confirmed fact.

Evaluate EVERY decision option against it.

You may generate additional relevant stress scenarios as usual, but do not ignore or
replace the user's custom scenario.
"""
        prompt = f"""
{custom_instructions}

DECISION CONTEXT:
{json.dumps(
    context,
    indent=2,
    ensure_ascii=False,
)}
"""

        result = await model_router.generate(
            prompt=prompt,
            system_prompt=SYSTEM_PROMPT,
            task_type="reasoning",
            complexity=0.83,
            temperature=0.3,
            max_tokens=3800,
            agent="Stress Tester",
            role="adverse scenario testing",
            stage="stress-testing",
        )

        parsed = extract_json(result["content"])

        stress_test = (
            StressTestResult.model_validate(parsed)
        )

        id_mapping: dict[str, str] = {}

        for scenario in stress_test.scenarios:
            old_id = scenario.id

            new_id = (
                "stress_"
                + uuid.uuid4().hex[:10]
            )

            id_mapping[old_id] = new_id
            scenario.id = new_id

        for impact in stress_test.impacts:
            if (impact.scenario_id in id_mapping):
                impact.scenario_id = (
                    id_mapping[impact.scenario_id]
                )

        return {
            "stress_test": stress_test.model_dump(),
            "inference": {
                "tier": result["tier"],
                "model": result["model"],
                "latency_ms": result["latency_ms"],
                "usage": result["usage"],
            },
        }

stress_engine = StressEngine()