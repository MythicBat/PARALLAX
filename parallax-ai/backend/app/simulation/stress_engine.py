import json
from typing import Any
import uuid
from app.schemas.simulation import StressTestResult
from app.simulation.validated_generation import generate_validated


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

IMPORTANT: IMPACT ENUMERATION RULES

The "impact" field MUST be exactly one of:

- "benefits"
- "neutral"
- "minor_damage"
- "moderate_damage"
- "major_damage"
- "failure"
- "uncertain"

Do NOT output alternative values such as:

- "minor"
- "moderate"
- "major"
- "none"
- "low"
- "high"

Use the exact allowed strings.

If the impact is unclear or cannot be determined,
use "uncertain".

Use "neutral" when the scenario has no material
positive or negative impact on an option.

Use "uncertain" only when the impact cannot
reasonably be determined.

Use "minor_damage" only when a small negative
impact actually exists.

IMPORTANT: SEVERITY ENUMERATION RULES

The "severity" field MUST be exactly one of:

- "moderate"
- "severe"
- "extreme"

Use "moderate" for a meaningful but manageable
adverse condition.

Use "severe" for a serious adverse condition
that significantly threatens an option.

Use "extreme" for an exceptionally disruptive
condition that could make an option unviable.

Do NOT use:
- "low"
- "medium"
- "high"
- "critical"

Use only the exact allowed values.

Do not generate fake probabilities.

"survives" means the option remains reasonably viable,
not that the outcome is guaranteed.

SCENARIO ID RULES:

Every generated scenario MUST have a unique ID.

Use IDs such as:
- "scenario_1"
- "scenario_2"
- "scenario_3"

Every impact's "scenario_id" MUST match
the ID of an existing scenario.

For every generated scenario, include
exactly one impact for each decision option.

Do not reuse scenario IDs.

Return JSON only:

{
  "scenarios": [
    {
      "id": "scenario_1",
      "name": "...",
      "description": "...",
      "severity": "severe"
    }
  ],
  "impacts": [
    {
      "option": "...",
      "scenario_id": "scenario_1",
      "impact": "major_damage",
      "explanation": "...",
      "survives": true
    }
  ],
  "most_resilient_option": "...",
  "explanation": "..."
}
"""

SYSTEM_PROMPT += "\nFor EVERY generated item, include ALL required JSON fields shown above. Do not omit fields. If evidence is unknown, express uncertainty honestly rather than inventing facts. Return one complete JSON object.\n"

def normalize_stress_output(parsed: Any) -> Any:
    if not isinstance(parsed, dict):
        return parsed

    impact_aliases = {
        "minor": "minor_damage",
        "moderate": "moderate_damage",
        "major": "major_damage",
        "critical": "major_damage",
        "positive": "benefits",
        "benefit": "benefits",
        "unknown": "uncertain",
        "none": "neutral",
        "no_impact": "neutral",
        "no impact": "neutral",
        "unaffected": "neutral",
    }

    severity_aliases = {
        "low": "moderate",
        "medium": "moderate",
        "high": "severe",
        "critical": "extreme",
    }

    for impact in parsed.get("impacts", []):
        if not isinstance(impact, dict):
            continue

        value = impact.get("impact")

        if isinstance(value, str):
            normalized = value.lower().strip()
            impact["impact"] = impact_aliases.get(normalized, normalized)

    for scenario in parsed.get("scenarios", []):
        if not isinstance(scenario, dict):
            continue

        value = scenario.get("severity")

        if isinstance(value, str):
            normalized = value.lower().strip()
            scenario["severity"] = severity_aliases.get(normalized, normalized)

    return parsed

class StressEngine:
    async def run(self, context: dict[str, Any]) -> dict[str, Any]:
        custom_scenario = context.get("custom_stress_scenario")
        custom_instructions = ""
        if custom_scenario:
            custom_instructions = (
                "IMPORTANT CUSTOM STRESS SCENARIO (hypothetical, NOT a confirmed fact):\n"
                f"{custom_scenario}\n"
                "Include this exact hypothetical as one of the scenarios and evaluate "
                "EVERY decision option against it.\n"
            )
        prompt_text = custom_instructions + "DECISION CONTEXT:\n" + json.dumps(
            context, indent=2, ensure_ascii=False
        )
        validated, result = await generate_validated(
            context=context,
            system_prompt=SYSTEM_PROMPT,
            schema=StressTestResult,
            task_type="reasoning",
            complexity=0.83,
            temperature=0.3,
            max_tokens=3800,
            agent="Stress Tester",
            role="adverse scenario testing",
            stage="stress-testing",
            normalize=normalize_stress_output,
            prompt=prompt_text,
        )
        # Validate scenario references before replacing IDs.
        scenario_ids = [s.id for s in validated.scenarios]
        if len(set(scenario_ids)) != len(scenario_ids):
            raise ValueError("Stress Engine returned duplicate scenario IDs")
        unknown = {i.scenario_id for i in validated.impacts} - set(scenario_ids)
        if unknown:
            raise ValueError(f"Stress Engine returned unknown scenario IDs: {unknown}")
        id_mapping = {old: "stress_" + uuid.uuid4().hex[:10] for old in scenario_ids}
        for scenario in validated.scenarios:
            scenario.id = id_mapping[scenario.id]
        for impact in validated.impacts:
            impact.scenario_id = id_mapping[impact.scenario_id]
        return {
            "stress_test": validated.model_dump(),
            "inference": {
                "tier": result["tier"],
                "model": result["model"],
                "latency_ms": result["latency_ms"],
                "usage": result["usage"],
            },
        }


stress_engine = StressEngine()
