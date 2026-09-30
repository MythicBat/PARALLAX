import type {
  SimulationResponse,
} from "@/store/parallax-store";

import type {
  ReplayComparison,
} from "@/types/replay";


function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null
  );
}


function getFinal(
  simulation: SimulationResponse,
): Record<string, unknown> | null {
  if (!isRecord(simulation.final)) {
    return null;
  }

  const synthesis =
    simulation.final["synthesis"];

  if (isRecord(synthesis)) {
    return synthesis;
  }

  const result =
    simulation.final["result"];

  if (isRecord(result)) {
    return result;
  }

  return simulation.final;
}


function getPreference(
  simulation: SimulationResponse,
): string | null {
  const final =
    getFinal(simulation);

  if (!final) {
    return null;
  }

  const candidates = [
    final["current_preference"],
    final["preferred_option"],
    final["recommendation"],
  ];

  for (const value of candidates) {
    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value;
    }
  }

  return null;
}


function getConfidence(
  simulation: SimulationResponse,
): string | number | null {
  const final =
    getFinal(simulation);

  if (!final) {
    return null;
  }

  const value =
    final["confidence"];

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return value;
  }

  return null;
}


function getAssumptions(
  simulation: SimulationResponse,
): string[] {
  const ledger =
    simulation.assumption_ledger;

  if (!isRecord(ledger)) {
    return [];
  }

  const possibleLedger =
    isRecord(ledger["ledger"])
      ? ledger["ledger"]
      : ledger;

  const items =
    possibleLedger["items"];

  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      if (!isRecord(item)) {
        return null;
      }

      const statement =
        item["statement"];

      return typeof statement ===
        "string"
        ? statement
        : null;
    })
    .filter(
      (value): value is string =>
        Boolean(value),
    );
}


function getBlindSpots(
  simulation: SimulationResponse,
): string[] {
  const payload =
    simulation.blind_spots;

  if (!isRecord(payload)) {
    return [];
  }

  const report =
    isRecord(payload["report"])
      ? payload["report"]
      : payload;

  const spots =
    report["blind_spots"];

  if (!Array.isArray(spots)) {
    return [];
  }

  return spots
    .map((spot) => {
      if (!isRecord(spot)) {
        return null;
      }

      const title =
        spot["title"];

      return typeof title ===
        "string"
        ? title
        : null;
    })
    .filter(
      (value): value is string =>
        Boolean(value),
    );
}


function normalize(
  value: string,
) {
  return value
    .trim()
    .toLowerCase();
}


function difference(
  left: string[],
  right: string[],
) {
  const rightSet =
    new Set(
      right.map(normalize),
    );

  return left.filter(
    (item) =>
      !rightSet.has(
        normalize(item),
      ),
  );
}


export function compareSimulations(
  previous:
    SimulationResponse,

  current:
    SimulationResponse,
): ReplayComparison {
  const previousPreference =
    getPreference(previous);

  const newPreference =
    getPreference(current);

  const previousAssumptions =
    getAssumptions(previous);

  const newAssumptions =
    getAssumptions(current);

  const previousBlindSpots =
    getBlindSpots(previous);

  const newBlindSpots =
    getBlindSpots(current);

  return {
    preferenceChanged:
      Boolean(
        previousPreference &&
        newPreference &&
        normalize(
          previousPreference,
        ) !==
          normalize(
            newPreference,
          ),
      ),

    previousPreference,
    newPreference,

    previousConfidence:
      getConfidence(previous),

    newConfidence:
      getConfidence(current),

    assumptionsAdded:
      difference(
        newAssumptions,
        previousAssumptions,
      ),

    assumptionsRemoved:
      difference(
        previousAssumptions,
        newAssumptions,
      ),

    blindSpotsAdded:
      difference(
        newBlindSpots,
        previousBlindSpots,
      ),

    blindSpotsRemoved:
      difference(
        previousBlindSpots,
        newBlindSpots,
      ),

    previousModelCalls:
      previous.observatory
        ?.summary
        ?.total_calls ?? 0,

    newModelCalls:
      current.observatory
        ?.summary
        ?.total_calls ?? 0,

    previousTokens:
      previous.observatory
        ?.summary
        ?.total_tokens ?? 0,

    newTokens:
      current.observatory
        ?.summary
        ?.total_tokens ?? 0,
  };
}