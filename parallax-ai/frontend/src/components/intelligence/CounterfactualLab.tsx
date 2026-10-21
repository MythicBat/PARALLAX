
"use client";

import {
  ArrowRight,
  GitCompareArrows,
  Sparkles,
} from "lucide-react";

import { useParallaxStore } from "@/store/parallax-store";
import type { CounterfactualCondition } from "@/types/simulation";

export function CounterfactualLab() {
  const simulation = useParallaxStore((state) => state.simulation);

  if (!simulation) return null;

  const data = simulation.counterfactual?.counterfactual;

  if (!data) {
    return (
      <div className="p-8 text-sm text-white/40">
        Counterfactual analysis is unavailable.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="mx-auto max-w-[1180px]">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/65">
            <GitCompareArrows size={13} />
            Decision reversal analysis
          </div>

          <h2 className="mt-3 text-[28px] font-light tracking-[-0.025em] text-white">
            Counterfactual Lab
          </h2>

          <p className="mt-3 max-w-[660px] text-[11px] leading-6 text-white/35">
            Instead of assuming today&apos;s conclusion remains
            correct, PARALLAX identifies the conditions
            capable of changing the decision.
          </p>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-2">
          <div className="rounded-[18px] border border-white/[0.065] bg-white/[0.018] p-5">
            <div className="text-[9px] uppercase tracking-[0.15em] text-white/25">
              Current preference
            </div>

            <div className="mt-3 text-[17px] font-light text-white/75">
              {data.current_preference}
            </div>
          </div>

          <div className="rounded-[18px] border border-[var(--accent)]/15 bg-[var(--accent)]/[0.025] p-5">
            <div className="text-[9px] uppercase tracking-[0.15em] text-[var(--accent)]/55">
              Challenger
            </div>

            <div className="mt-3 text-[17px] font-light text-[var(--accent)]/80">
              {data.challenger}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[22px] border border-[var(--accent)]/15 bg-[var(--accent)]/[0.035] p-6">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-[var(--accent)]/55">
            <Sparkles size={12} />
            Counterfactual synthesis
          </div>

          <p className="mt-4 max-w-[850px] text-[12px] leading-6 text-white/55">
            {data.summary}
          </p>

          <div className="mt-5 inline-flex rounded-lg border border-white/[0.065] bg-white/[0.025] px-3 py-2 text-[9px] text-white/45">
            Reversal assessment: {data.plausible ? "Plausible" : "Not currently plausible"}
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 text-[9px] uppercase tracking-[0.16em] text-white/25">
            Decision-flipping conditions
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.conditions.map((condition, index) => (
              <ConditionCard
                key={`${condition.variable}-${index}`}
                condition={condition}
                challenger={data.challenger}
                index={index}
              />
            ))}
          </div>

          {data.conditions.length === 0 && (
            <div className="rounded-[18px] border border-white/[0.065] p-6 text-[11px] text-white/35">
              No specific reversal conditions were identified.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConditionCard({
  condition,
  challenger,
  index,
}: {
  condition: CounterfactualCondition;
  challenger: string;
  index: number;
}) {
  return (
    <article className="relative overflow-hidden rounded-[20px] border border-white/[0.07] bg-white/[0.018] p-5 transition hover:border-white/[0.13] hover:bg-white/[0.028]">
      <div className="absolute right-4 top-3 text-[34px] font-light text-white/[0.025]">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="text-[8px] uppercase tracking-[0.15em] text-white/25">
        Could favour
      </div>

      <div className="mt-2 text-[13px] font-medium text-[var(--accent)]/75">
        {challenger}
      </div>

      <div className="mt-5 text-[9px] uppercase tracking-[0.14em] text-white/25">
        {condition.variable}
      </div>

      <h3 className="mt-2 pr-6 text-[12px] font-medium leading-5 text-white/70">
        {condition.required_change}
      </h3>

      <p className="mt-3 text-[9px] leading-5 text-white/32">
        {condition.explanation}
      </p>

      <div className="mt-5 flex items-center gap-2 border-t border-white/[0.055] pt-4 text-[8px] text-white/25">
        <ArrowRight size={11} className="text-[var(--accent)]/50" />
        Condition required for decision reversal
      </div>
    </article>
  );
}