import asyncio
from typing import Any

from app.agents.registry import AGENT_REGISTRY

async def run_agents_parallel(
        agent_names: list[str],
        context: dict[str, Any],
) -> list[dict[str, Any]]:

    tasks = []

    for name in agent_names:
        agent = AGENT_REGISTRY.get(name)

        if agent is None:
            continue

        tasks.append(agent.run(context))

    results = await asyncio.gather(*tasks, return_exceptions=True)

    completed = []

    for result in results:
        if isinstance(result, Exception):
            completed.append({
                "agent": "unknown",
                "status": "failed",
                "error": str(result),
            })
        else:
            completed.append({
                **result,
                "status": "complete",
            })

    return completed