import json
from typing import Any

from app.agents.base import BaseAgent


def format_context(context: dict[str, Any]) -> str:
    return json.dumps(
        context,
        indent=2,
        ensure_ascii=False,
    )


class OptimistAgent(BaseAgent):
    name = "Optimist"
    role = """
Construct the strongest realistic upside case for every option.
Look for opportunity, growth, leverage, optionality and positive second-order effects.
Do not ignore risk and do not invent benefits.
"""

    def build_prompt(self, context: dict[str, Any]) -> str:
        return f"""
Analyze the following decision.

Construct the strongest credible upside scenario for EACH option.

Identify:
1. Upside drivers
2. Best-case outcomes
3. Conditions required
4. Positive second-order effects
5. Fragile assumptions

DECISION CONTEXT:
{format_context(context)}
"""


class PessimistAgent(BaseAgent):
    name = "Pessimist"
    role = """
Construct realistic downside cases.
Identify failure modes, hidden costs, fragility and negative second-order effects.
Avoid catastrophizing without evidence.
"""

    def build_prompt(self, context: dict[str, Any]) -> str:
        return f"""
Analyze the downside of every option.

Identify:
1. Failure modes
2. Worst credible outcomes
3. Hidden costs
4. Dependencies
5. Early warning signals

DECISION CONTEXT:
{format_context(context)}
"""


class RiskAgent(BaseAgent):
    name = "Risk Analyst"
    role = """
Evaluate uncertainty, downside exposure, reversibility and robustness.
Do not generate fake probabilities.
"""

    def build_prompt(self, context: dict[str, Any]) -> str:
        return f"""
Perform a risk analysis.

For each option evaluate:

- uncertainty
- downside magnitude
- reversibility
- dependency risk
- concentration risk
- information gaps
- resilience to adverse events

Use qualitative ratings such as:
low, medium, high, very high.

Do not invent numeric probabilities.

DECISION CONTEXT:
{format_context(context)}
"""


class FinancialAgent(BaseAgent):
    name = "Financial Analyst"
    role = """
Evaluate financial consequences while clearly separating known numbers
from assumptions and estimates.
"""

    def build_prompt(self, context: dict[str, Any]) -> str:
        return f"""
Evaluate the financial implications of each option.

Consider only dimensions relevant to the supplied decision.

Identify:

- known financial facts
- likely costs
- income implications
- opportunity cost
- cash-flow exposure
- financial uncertainty
- assumptions requiring validation

Do not fabricate monetary values.

DECISION CONTEXT:
{format_context(context)}
"""


class CareerAgent(BaseAgent):
    name = "Career Strategist"
    role = """
Analyze career capital, skills, trajectory, optionality,
network effects and long-term professional consequences.
"""

    def build_prompt(self, context: dict[str, Any]) -> str:
        return f"""
Evaluate each option through a career-development lens.

Analyze:

- skill development
- career capital
- future optionality
- marketability
- network exposure
- learning velocity
- long-term trajectory
- switching opportunities

DECISION CONTEXT:
{format_context(context)}
"""


class EvidenceAgent(BaseAgent):
    name = "Evidence Auditor"
    role = """
Audit the reasoning evidence.
Detect unsupported claims, assumptions and missing information.
"""

    task_type = "assumption_detection"
    complexity = 0.5

    def build_prompt(self, context: dict[str, Any]) -> str:
        return f"""
Audit this decision context.

Create four sections:

KNOWN:
Facts explicitly supplied.

INFERRED:
Reasonable implications, but not direct facts.

ASSUMED:
Claims that require assumptions.

UNKNOWN:
Important missing information.

Then identify the five most important evidence gaps.

DECISION CONTEXT:
{format_context(context)}
"""


class ContrarianAgent(BaseAgent):
    name = "Contrarian"
    role = """
Challenge consensus and framing.
Look for false dichotomies, ignored alternatives and misleading assumptions.
"""

    complexity = 0.75

    def build_prompt(self, context: dict[str, Any]) -> str:
        return f"""
Challenge the current decision framing.

Ask:

- Is this a false binary?
- Is there a third option?
- Which assumptions would reverse the conclusion?
- What would a skeptical expert challenge?
- What important factor may have been excluded?
- Is the user optimizing the wrong objective?

DECISION CONTEXT:
{format_context(context)}
"""