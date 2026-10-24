
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

// ============================================================
// WORKSPACE TYPES
// ============================================================

export type WorkspacePanel =
  | "canvas"
  | "assumptions"
  | "blind-spots"
  | "stress"
  | "counterfactual"
  | "information"
  | "jury";

// ============================================================
// FAULT-TOLERANCE TYPES
// ============================================================

export interface FailedAgent {
  agent: string;
  error_type: string;
}

// ============================================================
// SIMULATION RESPONSE
// ============================================================

export interface SimulationResponse {
  status: "complete" | "partial";

  pipeline: string[];
  team: string[];

  architecture: unknown;
  specialists: unknown[];
  contrarian: unknown[];
  red_team: unknown;
  jury: JuryPayload;

  // Optional intelligence agents can fail independently.
  futures: FutureSimulationPayload | null;
  assumption_ledger: AssumptionLedgerPayload | null;
  blind_spots: BlindSpotPayload | null;
  stress_test: StressTestPayload | null;
  information_value: InformationValuePayload | null;
  counterfactual: CounterfactualPayload | null;

  final: unknown;

  observatory: ObservatoryPayload;

  // Fault-tolerance metadata
  failed_agents?: FailedAgent[];
  incomplete_intelligence?: boolean;
}

// ============================================================
// ZUSTAND STATE INTERFACE
// ============================================================

interface ParallaxState {
  // Simulation state
  simulation: SimulationResponse | null;

  simulationRunning: boolean;
  simulationError: string | null;

  // Future Canvas selection
  selectedFuture: FutureScenario | null;

  // Active intelligence workspace
  activeWorkspacePanel: WorkspacePanel;

  // Workspace actions
  setActiveWorkspacePanel: (
    panel: WorkspacePanel,
  ) => void;

  // Simulation actions
  setSimulation: (
    simulation: SimulationResponse | null,
  ) => void;

  setSimulationRunning: (
    running: boolean,
  ) => void;

  setSimulationError: (
    error: string | null,
  ) => void;

  // Future selection actions
  setSelectedFuture: (
    future: FutureScenario | null,
  ) => void;
}

// ============================================================
// PARALLAX GLOBAL STORE
// ============================================================

export const useParallaxStore = create<ParallaxState>(
  (set) => ({
    // --------------------------------------------------------
    // INITIAL STATE
    // --------------------------------------------------------

    simulation: null,

    simulationRunning: false,

    simulationError: null,

    selectedFuture: null,

    activeWorkspacePanel: "canvas",

    // --------------------------------------------------------
    // WORKSPACE NAVIGATION
    // --------------------------------------------------------

    setActiveWorkspacePanel: (activeWorkspacePanel) =>
      set((state) =>
        state.activeWorkspacePanel === activeWorkspacePanel
          ? state
          : { activeWorkspacePanel },
      ),

    // --------------------------------------------------------
    // SIMULATION MANAGEMENT
    // --------------------------------------------------------

    setSimulation: (simulation) =>
      set((state) =>
        state.simulation === simulation
          ? state
          : {
              simulation,
              selectedFuture: null,
            },
      ),

    // --------------------------------------------------------
    // SIMULATION LOADING STATE
    // --------------------------------------------------------

    setSimulationRunning: (simulationRunning) =>
      set((state) =>
        state.simulationRunning === simulationRunning
          ? state
          : { simulationRunning },
      ),

    // --------------------------------------------------------
    // SIMULATION ERROR STATE
    // --------------------------------------------------------

    setSimulationError: (simulationError) =>
      set((state) =>
        state.simulationError === simulationError
          ? state
          : { simulationError },
      ),

    // --------------------------------------------------------
    // FUTURE SELECTION
    // --------------------------------------------------------

    setSelectedFuture: (selectedFuture) =>
      set((state) =>
        state.selectedFuture === selectedFuture
          ? state
          : { selectedFuture },
      ),
  }),
);
