"""Parse complete or embedded JSON without greedy regular expressions."""
import json
import re
from typing import Any


def clean_code_fence(text: str) -> str:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"\s*```$", "", cleaned)
    return cleaned.strip()


def extract_json(text: str) -> Any:
    if not isinstance(text, str) or not text.strip():
        raise ValueError("Model response is empty.")

    cleaned = clean_code_fence(text)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    decoder = json.JSONDecoder()
    candidates = []

    for i, char in enumerate(cleaned):
        if char not in "{[":
            continue

        try:
            value, end = decoder.raw_decode(cleaned[i:])
        except json.JSONDecodeError:
            continue

        if isinstance(value, (dict, list)):
            candidates.append((value, end))

    if not candidates:
        raise ValueError(
            "Model response did not contain valid JSON."
        )

    # Prefer the largest complete JSON structure,
    # rather than the first nested object.
    return max(candidates, key=lambda item: item[1])[0]