import json

from app.core.json_utils import extract_json
from app.schemas.decision import (
    DecisionArchitecture,
    DecisionCreateRequest,
)
from app.services.model_router import model_router


SYSTEM_PROMPT = """
You are the Decision Architect inside PARALLAX.

PARALLAX is a decision simulation system.

Your job is NOT to make the final decision.

Your job is to transform a user's decision into a rigorous
simulation specification.

Identify:

1. The real underlying decision.
2. Important decision factors.
3. Known facts.
4. Assumptions.
5. Unknown information.
6. Potential blind spots.
7. Which specialist agents should investigate it.
8. Which dimensions future scenarios should simulate.

Never fabricate facts.

Clearly separate supplied facts from assumptions.

Importance values must be between 0 and 1.

Return ONLY valid JSON.

Required format:

{
  "title": "Short decision title",
  "decision_type": "career | finance | business | education | technology | purchase | life | other",
  "core_question": "Precise decision question",
  "factors": [
    {
      "name": "Factor name",
      "description": "What it represents",
      "importance": 0.85,
      "reason": "Why it matters"
    }
  ],
  "known_facts": [],
  "assumptions": [],
  "unknowns": [],
  "potential_blind_spots": [],
  "recommended_agents": [],
  "simulation_dimensions": []
}
"""


class DecisionArchitectAgent:

    name = "Decision Architect"

    async def run(
        self,
        decision: DecisionCreateRequest,
    ) -> dict:

        decision_data = decision.model_dump()

        prompt = f"""
Construct a simulation architecture for this decision.

USER DECISION:

{json.dumps(decision_data, indent=2)}

Remember:
- do not choose a winner
- do not invent evidence
- expose uncertainty
- return JSON only
"""

        complexity = self._estimate_complexity(decision)

        result = await model_router.generate(
            prompt=prompt,
            system_prompt=SYSTEM_PROMPT,
            task_type="decision_architecture",
            complexity=complexity,
            temperature=0.2,
            max_tokens=2400,
        )

        raw = extract_json(result["content"])

        architecture = DecisionArchitecture.model_validate(
            raw
        )

        return {
            "agent": self.name,
            "architecture": architecture.model_dump(),
            "inference": {
                "tier": result["tier"],
                "model": result["model"],
                "latency_ms": result["latency_ms"],
                "usage": result["usage"],
            },
        }

    def _estimate_complexity(
        self,
        decision: DecisionCreateRequest,
    ) -> float:

        score = 0.45

        score += min(
            len(decision.options) * 0.04,
            0.16,
        )

        score += min(
            len(decision.goals) * 0.025,
            0.10,
        )

        score += min(
            len(decision.constraints) * 0.025,
            0.10,
        )

        if decision.context:
            if len(decision.context) > 1000:
                score += 0.08

            if len(decision.context) > 3000:
                score += 0.08

        return min(score, 1.0)


decision_architect = DecisionArchitectAgent()