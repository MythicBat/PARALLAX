import json
import re
from typing import Any


def extract_json(text: str) -> dict[str, Any]:

    cleaned = text.strip()

    if cleaned.startswith("```"):
        cleaned = re.sub(
            r"^```(?:json)?\s*",
            "",
            cleaned,
        )

        cleaned = re.sub(
            r"\s*```$",
            "",
            cleaned,
        )

    try:
        return json.loads(cleaned)

    except json.JSONDecodeError:
        pass

    match = re.search(
        r"\{.*\}",
        cleaned,
        re.DOTALL,
    )

    if not match:
        raise ValueError(
            "Model response did not contain valid JSON."
        )

    return json.loads(match.group(0))