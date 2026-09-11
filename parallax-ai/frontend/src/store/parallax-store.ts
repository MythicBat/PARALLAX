import { create } from "zustand";

import type {
  FutureScenario,
  FutureSimulationPayload,
} from "@/types/simulation";


export interface SimulationResponse {
  status: string;
  pipeline: string[];
  team: string[];

  architecture: unknown;
  specialists: unknown[];
  contrarian: unknown[];
  red_team: unknown;
  jury: unknown[];

  futures: FutureSimulationPayload;

  assumption_ledger: unknown;
  blind_spots: unknown;
  stress_test: unknown;
  information_value: unknown;
  final: unknown;
  counterfactual: unknown;
}


interface ParallaxState {
  simulation: SimulationResponse | null;

  simulationRunning: boolean;
  simulationError: string | null;

  selectedFuture: FutureScenario | null;

  setSimulation: (
    simulation: SimulationResponse | null,
  ) => void;

  setSimulationRunning: (
    running: boolean,
  ) => void;

  setSimulationError: (
    error: string | null,
  ) => void;

  setSelectedFuture: (
    future: FutureScenario | null,
  ) => void;
}


export const useParallaxStore =
  create<ParallaxState>((set) => ({
    simulation: null,

    simulationRunning: false,

    simulationError: null,

    selectedFuture: null,

    setSimulation: (simulation) =>
      set({
        simulation,
      }),

    setSimulationRunning: (
      simulationRunning,
    ) =>
      set({
        simulationRunning,
      }),

    setSimulationError: (
      simulationError,
    ) =>
      set({
        simulationError,
      }),

    setSelectedFuture: (
      selectedFuture,
    ) =>
      set({
        selectedFuture,
      }),
  }));