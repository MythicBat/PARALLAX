
"use client";

import dynamic from "next/dynamic";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

import { useParallaxStore } from "@/store/parallax-store";

// Shared loading fallback
function WorkspaceLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-[var(--accent)]" />

        <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">
          Loading workspace
        </p>
      </div>
    </div>
  );
}

// Lazy-loaded workspaces
const FutureCanvas = dynamic(
  () =>
    import("./FutureCanvas").then(
      (mod) => mod.FutureCanvas,
    ),
  { loading: () => <WorkspaceLoading /> },
);

const AssumptionLedger = dynamic(
  () =>
    import("../intelligence/AssumptionLedger").then(
      (mod) => mod.AssumptionLedger,
    ),
  { loading: () => <WorkspaceLoading /> },
);

const BlindSpotRadar = dynamic(
  () =>
    import("../intelligence/BlindSpotRadar").then(
      (mod) => mod.BlindSpotRadar,
    ),
  { loading: () => <WorkspaceLoading /> },
);

const StressLab = dynamic(
  () =>
    import("../intelligence/StressLab").then(
      (mod) => mod.StressLab,
    ),
  { loading: () => <WorkspaceLoading /> },
);

const AIJury = dynamic(
  () =>
    import("../intelligence/AIJury").then(
      (mod) => mod.AIJury,
    ),
  { loading: () => <WorkspaceLoading /> },
);

const CounterfactualLab = dynamic(
  () =>
    import("../intelligence/CounterfactualLab").then(
      (mod) => mod.CounterfactualLab,
    ),
  { loading: () => <WorkspaceLoading /> },
);

const InformationValue = dynamic(
  () =>
    import("../intelligence/InformationValue").then(
      (mod) => mod.InformationValue,
    ),
  { loading: () => <WorkspaceLoading /> },
);

export function FuturesWorkspace() {
  const active = useParallaxStore(
    (state) => state.activeWorkspacePanel,
  );

  return (
    <div className="relative h-[calc(100vh-72px)]">
      <WorkspaceSwitcher />

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="h-full"
        >
          {active === "canvas" && <FutureCanvas />}

          {active === "assumptions" && <AssumptionLedger />}

          {active === "blind-spots" && <BlindSpotRadar />}

          {active === "stress" && <StressLab />}

          {active === "counterfactual" && <CounterfactualLab />}

          {active === "information" && <InformationValue />}

          {active === "jury" && <AIJury />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}