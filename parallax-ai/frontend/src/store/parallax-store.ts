import { create } from "zustand";

interface ParallaxState {
  simulation: unknown | null;

  simulationRunning: boolean;

  simulationError: string | null;

  setSimulation: (
    simulation: unknown | null,
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