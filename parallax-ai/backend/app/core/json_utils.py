import json
import re
from typing import Any


def clean_code_fence(text: str) -> str:
    cleaned = text.strip()

    if cleaned.startswith("```"):
        cleaned = re.sub(
            r"^```(?:json)?\s*",
            "",
            cleaned,
            flags=re.IGNORECASE,
        )

        cleaned = re.sub(
            r"\s*```$",
            "",
            cleaned,
        )

    return cleaned.strip()


def extract_json(text: str) -> Any:
    cleaned = clean_code_fence(text)

    try:
        return json.loads(cleaned)

    except json.JSONDecodeError:
        pass

    object_match = re.search(
        r"\{.*\}",
        cleaned,
        re.DOTALL,
    )

    if object_match:
        try:
            return json.loads(
                object_match.group(0)
            )
        except json.JSONDecodeError:
            pass

    array_match = re.search(
        r"\[.*\]",
        cleaned,
        re.DOTALL,
    )

    if array_match:
        try:
            return json.loads(
                array_match.group(0)
            )
        except json.JSONDecodeError:
            pass

    raise ValueError(
        "Model response did not contain valid JSON."
    )