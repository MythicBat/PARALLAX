"""Validate structured LLM responses with one bounded, schema-guided retry."""
import json
from typing import Any, Callable, TypeVar

from pydantic import BaseModel, ValidationError

from app.core.json_utils import extract_json
from app.services.model_router import model_router

T = TypeVar("T", bound=BaseModel)


async def generate_validated(
    *,
    context: dict[str, Any],
    system_prompt: str,
    schema: type[T],
    task_type: str,
    complexity: float,
    temperature: float,
    max_tokens: int,
    agent: str,
    role: str,
    stage: str,
    normalize: Callable[[Any], Any] | None = None,
    prompt: str | None = None,
) -> tuple[T, dict[str, Any]]:
    original_prompt = prompt if prompt is not None else json.dumps(
        context, indent=2, ensure_ascii=False
    )
    next_prompt = original_prompt
    last_error: Exception | None = None

    for attempt in range(2):
        result = await model_router.generate(
            prompt=next_prompt,
            system_prompt=system_prompt,
            task_type=task_type,
            complexity=complexity,
            temperature=temperature if attempt == 0 else 0.0,
            max_tokens=max_tokens if attempt == 0 else int(max_tokens * 1.25),
            agent=agent,
            role=role,
            stage=stage if attempt == 0 else f"{stage}-retry",
        )
        try:
            parsed = extract_json(result.get("content") or "")
            if normalize is not None:
                parsed = normalize(parsed)
            validated = schema.model_validate(parsed)
            return validated, result
        except (ValueError, ValidationError) as exc:
            last_error = exc
            if attempt == 1:
                break
            if isinstance(exc, ValidationError):
                issues = exc.errors(include_url=False, include_input=False)
                problem = json.dumps(issues, ensure_ascii=False, default=str)[:5000]
            else:
                problem = str(exc)
            # Keep the original context; don't send an arbitrary malformed output
            # back as evidence. The schema supplies required fields/enums.
            next_prompt = (
                f"{original_prompt}\n\n"
                "Your previous output could not be validated. "
                "Regenerate the complete answer as a SINGLE JSON object, "
                "with no markdown or commentary. Every required field must "
                "be present for EVERY item. Do not invent facts.\n"
                f"Validation problem: {problem}\n"
                f"Required JSON schema: {json.dumps(schema.model_json_schema(), ensure_ascii=False)}"
            )

    raise ValueError(
        f"{agent} returned invalid {schema.__name__} after two attempts: {last_error}"
    ) from last_error
