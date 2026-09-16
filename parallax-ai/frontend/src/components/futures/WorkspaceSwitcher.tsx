"use client";

import {
  FlaskConical,
  GitBranch,
  GitCompareArrows,
  Radar,
  Scale,
  ScrollText,
  Search,
} from "lucide-react";

import {
  useParallaxStore,
  type WorkspacePanel,
} from "@/store/parallax-store";


const items: {
  id: WorkspacePanel;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}[] = [
  {
    id: "canvas",
    label: "Future Canvas",
    shortLabel: "Futures",
    icon: GitBranch,
  },
  {
    id: "assumptions",
    label: "Assumption Ledger",
    shortLabel: "Assumptions",
    icon: ScrollText,
  },
  {
    id: "blind-spots",
    label: "Blind Spot Radar",
    shortLabel: "Blind Spots",
    icon: Radar,
  },
  {
    id: "stress",
    label: "Stress Lab",
    shortLabel: "Stress",
    icon: FlaskConical,
  },
  {
    id: "counterfactual",
    label: "Counterfactual Lab",
    shortLabel: "Counterfactual",
    icon: GitCompareArrows,
  },
  {
    id: "information",
    label: "Information Value",
    shortLabel: "Next Info",
    icon: Search,
  },
  {
    id: "jury",
    label: "AI Jury",
    shortLabel: "Jury",
    icon: Scale,
  },
];


export function WorkspaceSwitcher() {
  const active =
    useParallaxStore(
      (state) =>
        state.activeWorkspacePanel,
    );

  const setActive =
    useParallaxStore(
      (state) =>
        state.setActiveWorkspacePanel,
    );

  const simulation =
    useParallaxStore(
      (state) =>
        state.simulation,
    );

  const getCount = (
    id: WorkspacePanel,
  ) => {
    if (!simulation) {
      return null;
    }

    switch (id) {
      case "assumptions":
        return (
          simulation
            .assumption_ledger
            .ledger.items.length
        );

      case "blind-spots":
        return (
          simulation
            .blind_spots
            .report
            .blind_spots.length
        );

      case "stress":
        return (
          simulation
            .stress_test
            .stress_test
            .scenarios.length
        );

      case "counterfactual":
        return (
          simulation
            .counterfactual
            .counterfactual
            .conditions.length
        );

      case "information":
        return (
          simulation
            .information_value
            .analysis.items.length
        );

      case "jury":
        return (
          simulation
            .jury
            .jury.votes.length
        );

      default:
        return null;
    }
  };


  return (
    <div className="pointer-events-auto absolute left-1/2 top-4 z-40 -translate-x-1/2">

      <div className="flex items-center gap-1 rounded-[14px] border border-white/[0.07] bg-[#080a0e]/90 p-1 shadow-xl backdrop-blur-2xl">

        {items.map((item) => {
          const Icon =
            item.icon;

          const isActive =
            active === item.id;

          const count =
            getCount(item.id);

          return (
            <button
              key={item.id}
              title={item.label}
              onClick={() =>
                setActive(item.id)
              }
              className={[
                "flex h-8 items-center gap-1.5 rounded-[9px] px-2.5 text-[9px] transition",
                isActive
                  ? "bg-white/[0.08] text-white"
                  : "text-white/28 hover:bg-white/[0.035] hover:text-white/60",
              ].join(" ")}
            >
              <Icon size={11} />

              <span className="hidden xl:inline">
                {item.shortLabel}
              </span>

              {count !== null &&
                count > 0 && (
                  <span className="rounded-md bg-white/[0.04] px-1 text-[7px] text-white/20">
                    {count}
                  </span>
                )}
            </button>
          );
        })}
      </div>
    </div>
  );
}