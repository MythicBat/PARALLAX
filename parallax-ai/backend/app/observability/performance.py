from typing import Any

def analyse_pipeline_performance(
        simulation: dict[str, Any],
) -> dict[str, Any]:
    """
    Analyze inference telemetry form a completed simulation.

    No LLM calls are made.
    """

    agents = []

    for name, payload in simulation.items():
        if not isinstance(payload, dict):
            continue

        inference = payload.get("inference")

        if not isinstance(inference, dict):
            continue

        usage = inference.get("usage") or {}

        agents.append({
            "agent": name,
            "model": inference.get("model", "unknown"),
            "tier": inference.get("tier", "unknown"),
            "latency_ms": inference.get("latency_ms", 0),
            "prompt_tokens": usage.get("prompt_tokens", 0),
            "completion_tokens": usage.get("completion_tokens", 0),
            "total_tokens": usage.get("total_tokens", 0),
        })

    return {
        "agents": agents,
        "total_calls": len(agents),
        "total_tokens": sum(item["total_tokens"] for item in agents),
        "total_latency_ms": sum(item["latency_ms"] for item in agents),
        "slowest_agent": (
            max(
                agents,
                key=lambda item: item["latency_ms"],
            )["agent"] if agents else None
        ),
    }

def analyse_token_usage(
    simulation: dict[str, Any],
) -> dict[str, Any]:
    """
    Rank available agent telemetry by token consumption.

    This is an offline analysis. No Nebius API calls.
    """
    performance = analyse_pipeline_performance(simulation)
    agents = performance["agents"]

    ranked = sorted(
        agents,
        key=lambda item: item["total_tokens"],
        reverse=True,
    )

    total_tokens = sum(
        item["total_tokens"] for item in ranked
    )

    breakdown = []

    for agent in ranked:
        tokens = agent["total_tokens"]

        breakdown.append({
            **agent,
            "token_share_percent": round(
                tokens / total_tokens * 100, 2
            ) if total_tokens else 0.0,
        })

    return {
        "total_tokens": total_tokens,
        "total_prompt_tokens": sum(
            item["prompt_tokens"] for item in ranked
        ),
        "total_completion_tokens": sum(
            item["completion_tokens"] for item in ranked
        ),
        "ranked_agents": breakdown,
        "highest_token_agent": (
            ranked[0]["agent"] if ranked else None
        ),
    }
