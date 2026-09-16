"use client";

import { FutureCanvas } from "./FutureCanvas";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

import { AssumptionLedger } from "../intelligence/AssumptionLedger";
import { BlindSpotRadar } from "../intelligence/BlindSpotRadar";
import { StressLab } from "../intelligence/StressLab";
import { AIJury } from "../intelligence/AIJury";
import { CounterfactualLab } from "../intelligence/CounterfactualLab";
import { InformationValue } from "../intelligence/InformationValue";

import { useParallaxStore } from "@/store/parallax-store";

export function FuturesWorkspace() {
    const active = useParallaxStore((state) => state.activeWorkspacePanel);

    return (
        <div className="relative h-[calc(100vh-72px)]">
            <WorkspaceSwitcher />

            {active === "canvas" && (
                <FutureCanvas />
            )}

            {active === "assumptions" && (
                <AssumptionLedger />
            )}

            {active === "blind-spots" && (
                <BlindSpotRadar />
            )}

            {active === "stress" && (
                <StressLab />
            )}

            {active === "counterfactual" && (
                <CounterfactualLab />
            )}

            {active === "information" && (
                <InformationValue />
            )}

            {active === "jury" && (
                <AIJury />
            )}
        </div>
    );
}