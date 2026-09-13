"use client";

import {
    GitBranch,
    Radar,
    ScrollText,
    ShieldAlert,
} from "lucide-react";

import {
    useParallaxStore,
    type WorkspacePanel,
} from "@/store/parallax-store";

const items: {
  id: WorkspacePanel;
  label: string;
  icon: React.ElementType;
}[] = [
  {
    id: "canvas",
    label: "Futures",
    icon: GitBranch,
  },
  {
    id: "assumptions",
    label: "Assumptions",
    icon: ScrollText,
  },
  {
    id: "blind-spots",
    label: "Blind Spots",
    icon: Radar,
  },
  {
    id: "stress",
    label: "Stress Lab",
    icon: ShieldAlert,
  },
];

export function WorkspaceSwitcher() {
    const active = useParallaxStore((state) => state.activeWorkspacePanel);

    const simulation = useParallaxStore((state) => state.simulation);

    const setActive = useParallaxStore((state) => state.setActiveWorkspacePanel);

    const counts = {
        assumptions: simulation?.assumption_ledger.ledger.items.length ?? 0,
        blindSpots: simulation?.blind_spots.report.blind_spots.length ?? 0,
        stress: simulation?.stress_test.stress_test.scenarios.length ?? 0,
    };

    return (
        <div className="pointer-events-auto absolute left-1/2 top-4 z-30 -translate-x-1/2">
            <div className="flex items-center gap-1 rounded-xl border border-white/[0.07] bg-[#080a0e]/85 p-1 backdrop-blur-xl">
                {items.map((item) => {
                    const Icon = item.icon;
                    
                    const isActive = active === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActive(item.id)}
                            className={[
                                "flex h-8 items-center gap-2 rounded-lg px-3 text-[9px] transition",
                                isActive ? "bg-white/[0.075] text-white" : "text-white/30 hover:bg-white/[0.035] hover:text-white/65",
                            ].join(" ")}
                        >
                            <Icon size={12} />

                            {item.label}
                            
                            {item.id === "assumptions" && (
                                <span className="text-[8px] text-white/20">{counts.assumptions}</span>
                            )}

                            {item.id === "blind-spots" && (
                                <span className="text-[8px] text-white/20">{counts.blindSpots}</span>
                            )}

                            {item.id === "stress" && (
                                <span className="text-[8px] text-white/20">{counts.stress}</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}