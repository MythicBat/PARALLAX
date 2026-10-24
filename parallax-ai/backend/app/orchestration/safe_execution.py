
import asyncio
import logging
from typing import Any, Awaitable

logger = logging.getLogger(__name__)


async def run_optional_agent(
    name: str,
    operation: Awaitable[Any],
) -> dict[str, Any]:
    """
    Run an optional intelligence operation.

    Return a structured execution outcome.
    Never invent agent analysis.
    """
    try:
        result = await operation

        return {
            "agent": name,
            "status": "complete",
            "result": result,
            "error": None,
        }

    except asyncio.CancelledError:
        raise

    except Exception as exc:
        logger.exception(
            "Optional PARALLAX agent failed: %s",
            name,
        )

        return {
            "agent": name,
            "status": "failed",
            "result": None,
            "error": {
                "type": type(exc).__name__,
                "message": str(exc),
            },
        }
