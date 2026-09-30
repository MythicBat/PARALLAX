"use client";

import {
  create,
} from "zustand";

import {
  createJSONStorage,
  persist,
} from "zustand/middleware";

import type {
  DecisionHistoryItem,
} from "@/types/history";

import type {
  SimulationResponse,
} from "@/store/parallax-store";

import type {
  DecisionRequest,
} from "@/types/decision";


interface HistoryState {
  items: DecisionHistoryItem[];

  saveSimulation: (
    simulation: SimulationResponse,
    request: DecisionRequest,
  ) => DecisionHistoryItem;

  deleteItem: (
    id: string,
  ) => void;

  clearHistory: () => void;
}


function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null
  );
}


function getArchitecture(
  simulation: SimulationResponse,
): Record<string, unknown> | null {
  if (
    !isRecord(
      simulation.architecture,
    )
  ) {
    return null;
  }

  const nested =
    simulation.architecture[
      "architecture"
    ];

  if (isRecord(nested)) {
    return nested;
  }

  return simulation.architecture;
}


function getQuestion(
  simulation: SimulationResponse,
): string {
  const architecture =
    getArchitecture(simulation);

  if (!architecture) {
    return "Untitled decision";
  }

  const value =
    architecture[
      "core_question"
    ];

  return typeof value === "string" &&
    value.trim()
    ? value
    : "Untitled decision";
}


function getOptionNames(
  simulation: SimulationResponse,
): string[] {
  const simulations =
    simulation.futures
      ?.simulation
      ?.simulations;

  if (!Array.isArray(simulations)) {
    return [];
  }

  return simulations
    .map(
      (item) => item.option,
    )
    .filter(Boolean);
}


function getFinalObject(
  simulation: SimulationResponse,
): Record<string, unknown> | null {
  if (!isRecord(simulation.final)) {
    return null;
  }

  const nested =
    simulation.final["synthesis"];

  if (isRecord(nested)) {
    return nested;
  }

  const result =
    simulation.final["result"];

  if (isRecord(result)) {
    return result;
  }

  return simulation.final;
}


function getPreferredOption(
  simulation: SimulationResponse,
): string | null {
  const final =
    getFinalObject(simulation);

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
    getFinalObject(simulation);

  if (!final) {
    return null;
  }

  const confidence =
    final["confidence"];

  if (
    typeof confidence === "string" ||
    typeof confidence === "number"
  ) {
    return confidence;
  }

  return null;
}


function makeTitle(
  question: string,
): string {
  const clean =
    question.trim();

  if (clean.length <= 64) {
    return clean;
  }

  return `${clean.slice(0, 61)}...`;
}


export const useHistoryStore =
  create<HistoryState>()(
    persist(
      (set) => ({
        items: [],

        saveSimulation: (
          simulation,
          request,
        ) => {
          const now =
            new Date().toISOString();

          const question =
            getQuestion(simulation);
          
          const signature = JSON.stringify({
            question,
            options: getOptionNames(simulation),
            pipeline: simulation.pipeline,
          });

          const item:
            DecisionHistoryItem = {
              id:
                crypto.randomUUID(),

              title:
                makeTitle(question),

              createdAt: now,
              updatedAt: now,

              question,

              optionNames:
                getOptionNames(
                  simulation,
                ),

              preferredOption:
                getPreferredOption(
                  simulation,
                ),

              confidence:
                getConfidence(
                  simulation,
                ),

              simulation,
              request,
            };

          set((state) => {
            const newest = state.items[0];

            if (newest) {
              const newestSignature = JSON.stringify({
                question: newest.question,
                options: newest.optionNames,
                pipeline: newest.simulation.pipeline,
              });

              const age = Date.now() - new Date(newest.createdAt).getTime();

              if (signature === newestSignature && age < 10_000) {
                return state;
              }
            }

            return {
              items: [
                item,
                ...state.items,
              ],
            };
          });

          return item;
        },

        deleteItem: (id) =>
          set((state) => ({
            items:
              state.items.filter(
                (item) =>
                  item.id !== id,
              ),
          })),

        clearHistory: () =>
          set({
            items: [],
          }),
      }),
      {
        name:
          "parallax-decision-history",

        storage:
          createJSONStorage(
            () => localStorage,
          ),
      },
    ),
  );