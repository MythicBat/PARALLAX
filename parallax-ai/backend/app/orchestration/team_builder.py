from app.agents.registry import DEFAULT_AGENT_TEAM

def build_agent_team(decision_type: str) -> list[str]:

    team = list(DEFAULT_AGENT_TEAM)
    decsion_type = decision_type.lower()

    if decsion_type == "career":
        team.extend([
            "career",
            "financial",
        ])
    elif decsion_type == "finance":
        team.append("financial")
    elif decsion_type in {
        "business",
        "purchase",
        "life",
        "education",
    }:
        team.append("financial")

    # Remove duplicates while preserving order
    return list(dict.fromkeys(team))