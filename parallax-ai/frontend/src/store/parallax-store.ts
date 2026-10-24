import { create } from "zustand";

import type {
  AssumptionLedgerPayload,
  BlindSpotPayload,
  CounterfactualPayload,
  FutureScenario,
  FutureSimulationPayload,
  InformationValuePayload,
  JuryPayload,
  StressTestPayload,
} from "@/types/simulation";

import type { ObservatoryPayload } from "@/types/observability";

export type WorkspacePanel = 
  | "canvas"
  | "assumptions"
  | "blind-spots"
  | "stress"
  | "counterfactual"
  | "information"
  | "jury";

export interface FailedAgent {
  agent: string;
  error_type: string;
}

export interface SimulationResponse {
  status: "complete" | "partial";
  pipeline: string[];
  team: string[];

  architecture: unknown;
  specialists: unknown[];
  contrarian: unknown[];
  red_team: unknown;
  jury: JuryPayload;

  futures: FutureSimulationPayload | null;
  assumption_ledger: AssumptionLedgerPayload | null;
  blind_spots: BlindSpotPayload | null;
  stress_test: StressTestPayload | null;
  information_value: InformationValuePayload | null;

  final: unknown;
  counterfactual: CounterfactualPayload | null;
  observatory: ObservatoryPayload;

  // Fault-tolerance metadata
  failed_agents?: FailedAgent[];
  incomplete_intelligence?: boolean;
}


interface ParallaxState {
  simulation: SimulationResponse | null;

  simulationRunning: boolean;
  simulationError: string | null;

  selectedFuture: FutureScenario | null;

  activeWorkspacePanel: WorkspacePanel;

  setActiveWorkspacePanel: (panel: WorkspacePanel) => void; 

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

    activeWorkspacePanel: "canvas",

    setActiveWorkspacePanel: (activeWorkspacePanel) => set({activeWorkspacePanel}),

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