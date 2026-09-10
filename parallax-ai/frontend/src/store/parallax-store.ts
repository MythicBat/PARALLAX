import { create } from "zustand";

export interface SimulationResponse {
  status: string;
  pipeline: string[];
  team: string[];

  architecture: unknown;
  specialists: unknown[];
  contrarian: unknown[];
  red_team: unknown;
  jury: unknown[];
  futures: unknown;
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

  setSimulation: (
    simulation: SimulationResponse | null,
  ) => void;

  setSimulationRunning: (
    running: boolean,
  ) => void;

  setSimulationError: (
    error: string | null,
  ) => void;
}

export const useParallaxStore =
  create<ParallaxState>((set) => ({
    simulation: null,

    simulationRunning: false,

    simulationError: null,

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
  }));