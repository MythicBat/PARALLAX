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
    if not isinstance(text, str) or not text.strip():
        raise ValueError("Model response is empty.")

    cleaned = clean_code_fence(text)

    # Attempt 1: Parse the complete response.
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Attempt 2: Find the first valid JSON object
    # or array embedded in the response.
    decoder = json.JSONDecoder()

    for index, character in enumerate(cleaned):
        if character not in "{[":
            continue

        try:
            parsed, _ = decoder.raw_decode(cleaned[index:])
        except json.JSONDecodeError:
            continue

        if isinstance(parsed, (dict, list)):
            return parsed

    raise ValueError(
        "Model response did not contain valid JSON."
    )