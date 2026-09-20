from __future__ import annotations

from contextvars import ContextVar
from dataclasses import asdict, dataclass
from typing import Any
from uuid import uuid4

@dataclass
class InferenceTrace:
    id: str
    agent: str
    role: str
    stage: str
    tier: str
    model: str
    latency_ms: int
    usage: dict[str, int]
    status: str
    escalated: bool = False
    escalation_reason: str | None = None

_trace_store: ContextVar[list[InferenceTrace] | None] = ContextVar(
    "parallax_trace_store",
    default=None,
)

def begin_trace_session() -> None:
    _trace_store.set([])

def record_trace(
    *,
    agent: str,
    role: str,
    stage: str,
    tier: str,
    model: str,
    latency_ms: int,
    usage: dict[str, int] | None = None,
    status: str = "complete",
    escalated: bool = False,
    escalation_reason: str | None = None,
) -> None:
    traces = _trace_store.get()

    if traces is None:
        traces = []
        _trace_store.set(traces)

    safe_usage = usage or {}

    traces.append(
        InferenceTrace(
            id=str(uuid4()),
            agent=agent,
            role=role,
            stage=stage,
            tier=tier,
            model=model,
            latency_ms=latency_ms,
            usage={
                "prompt_tokens": int(safe_usage.get("prompt_tokens", 0)),
                "completion_tokens": int(safe_usage.get("completion_tokens", 0)),
                "total_tokens": int(safe_usage.get("total_tokens", 0)),
            },
            status=status,
            escalated=escalated,
            escalation_reason=escalation_reason,
        )
    )

def build_observatory_payload() -> dict[str, Any]:
    traces = _trace_store.get() or []

    def calls_for(tier: str) -> int:
        return sum(
            1
            for trace in traces
            if trace.tier.lower() == tier
        )

    total_tokens = sum(
        trace.usage.get("total_tokens", 0)
        for trace in traces
    )

    total_latency = sum(
        trace.latency_ms
        for trace in traces
    )

    return {
        "provider": "Nebius Token Factory",
        "traces": [asdict(trace) for trace in traces],
        "summary": {
            "total_calls": len(traces),
            "total_tokens": total_tokens,
            "total_latency_ms": total_latency,
            "lightning_calls": calls_for("lightning"),
            "nano_calls": calls_for("nano"),
            "super_calls": calls_for("super"),
            "ultra_calls": calls_for("ultra"),
            "escalation_count": sum(1 for trace in traces if trace.escalated),
        },
    }