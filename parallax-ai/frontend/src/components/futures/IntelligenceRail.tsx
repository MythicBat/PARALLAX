"use client";

import {
    AlertTriangle,
    Search,
    ShieldCheck,
} from "lucide-react";

import { useParallaxStore } from "@/store/parallax-store";

export function IntelligenceRail() {
    const simulation = useParallaxStore((state) => state.simulation);

    const setPanel = useParallaxStore((state) => state.setActiveWorkspacePanel);

    if (!simulation) {
        return null;
    }

    const criticalAssumptions = simulation.assumption_ledger.ledger.items.filter((item) => 
        item.impact === "critical").length;

    const seriousBlindSpots = simulation.blind_spots.report.blind_spots.filter((item) => 
        item.severity === "critical" || item.severity === "high").length;

    const resilient = simulation.stress_test.stress_test.most_resilient_option;

    return (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-white/[0.07] bg-[#080a0e]/85 p-1 backdrop-blur-xl">
            <button
                onClick={() => setPanel("assumptions")}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-[8px] text-white/30 transition hover:bg-white/[0.04] hover:text-white/60"
            >
                <AlertTriangle size={11} />

                {criticalAssumptions} critical assumptions
            </button>

            <div className="h-5 w-px bg-white/[0.06]" />

            <button
                onClick={() => setPanel("blind-spots")}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-[8px] text-white/30 transition hover:bg-white/[0.04] hover:text-white/60"
            >
                <Search size={11} />

                {seriousBlindSpots} major blind spots
            </button>

            {resilient && (
                <>
                    <div className="h-5 w-px bg-white/[0.06]" />

                    <button
                        onClick={() => setPanel("stress")}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-[8px] text-white/30 transition hover:bg-white/[0.04] hover:text-white/60"
                    >
                        <ShieldCheck
                            size={11}
                            className="text-[var(--accent)]/50"
                        />

                        Most resilient:{" "}
                        <span className="text-white/55">
                            {resilient}
                        </span>
                    </button>
                </>
            )}
        </div>
    );
}