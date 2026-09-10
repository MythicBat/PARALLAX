import json
from typing import Any

from app.agents.base import BaseAgent


class RedTeamAgent(BaseAgent):

    name = "Red Team"

    role = """
Aggressively test the combined reasoning of PARALLAX.

Your responsibility is to discover:
- contradictions
- weak assumptions
- unsupported conclusions
- hidden dependencies
- ignored failure modes
- overconfidence
- misleading metrics

Do not attack for the sake of attacking.
Your goal is to improve reasoning quality.
"""

    complexity = 0.82

    def build_prompt(
        self,
        context: dict[str, Any],
    ) -> str:

        return f"""
Red-team the combined analyses below.

Identify:

1. Contradictions between agents
2. Weak assumptions
3. Unsupported conclusions
4. Missing scenarios
5. Information capable of changing the decision
6. Areas where agents are too confident
7. Which analyses should be recomputed

CONTEXT:

{json.dumps(context, indent=2)}
"""


red_team_agent = RedTeamAgent()