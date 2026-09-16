"use client";

import {
    ArrowUpRight,
    CircleDollarSign,
    Search,
    Sparkles,
} from "lucide-react";

import { useParallaxStore } from "@/store/parallax-store";

import type { InformationItem } from "@/types/simulation";

export function InformationValue() {
    const simulation = useParallaxStore((state) => state.simulation);

    if (!simulation) {
        return null;
    }

    const analysis = simulation.information_value.analysis;

    return (
        <div className="h-full overflow-y-auto p-8">
            <div className="mx-auto max-w-[1180px]">
                <div>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/65">
                        <Search size={13} />

                        Value of information
                    </div>

                    <h2 className="mt-3 text-[28px] font-light leading-6 text-white">
                        What should you learn next?
                    </h2>

                    <p className="mt-3 max-w-[680px] text-[11px] leading-6 text-white/35">
                        Not every unknown deserves more research.
                        PARALLAX identifies which missing information
                        has the greatest potential to change the decision.
                    </p>
                </div>

                {analysis.highest_value_question && (
                    <div className="mt-9 rounded-[22px] border border-[var(--accent)]/15 bg-[var(--accent)]/[0.035] p-6">
                        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-[var(--accent)]/55">
                            <Sparkles size={12} />

                            Highest-value question
                        </div>

                        <div className="mt-4 max-w-[800px] text-[18px] font-light leading-7 text-white/80">
                            {analysis.highest_value_question}
                        </div>
                    </div>
                )}

                <div className="mt-8 grid gap-4 lg:grid-cols-2">
                    {analysis.items.map((item, index) => (
                        <InformationCard
                            key={item.id}
                            item={item}
                            index={index}
                        />
                    ),)}
                </div>

                <div className="mt-6 rounded-[18px] border border-white/[0.065] bg-white/[0.018] p-5">
                    <div className="text-[9px] uppercase tracking-[0.15em] text-white/20">
                        Research strategy
                    </div>

                    <p className="mt-3 text-[10px] leading-6 text-white/35">{analysis.summary}</p>
                </div>
            </div>
        </div>
    );
}

function InformationCard({
  item,
  index,
}: {
  item: InformationItem;
  index: number;
}) {
  return (
    <article className="rounded-[20px] border border-white/[0.07] bg-white/[0.018] p-5">

      <div className="flex items-center justify-between">
        <span className="text-[9px] text-white/20">
          Q{String(index + 1).padStart(2, "0")}
        </span>

        <ValueBadge
          value={item.information_value}
        />
      </div>

      <h3 className="mt-4 text-[13px] font-medium leading-5 text-white/70">
        {item.question}
      </h3>

      <p className="mt-3 text-[9px] leading-5 text-white/32">
        {item.why_it_matters}
      </p>


      <div className="mt-5 flex items-center gap-3 border-t border-white/[0.055] pt-4">

        <div className="flex items-center gap-2 text-[8px] text-white/25">
          <CircleDollarSign size={11} />
          Effort: {item.effort}
        </div>

        <div className="ml-auto flex flex-wrap justify-end gap-1">
          {item.affected_options.map(
            (option) => (
              <span
                key={option}
                className="rounded-md border border-white/[0.055] bg-white/[0.02] px-2 py-1 text-[8px] text-white/22"
              >
                {option}
              </span>
            ),
          )}
        </div>
      </div>


      <button className="mt-5 flex w-full items-center justify-between rounded-xl border border-white/[0.065] bg-white/[0.02] px-3 py-3 text-left transition hover:bg-white/[0.04]">

        <div>
          <div className="text-[8px] uppercase tracking-[0.12em] text-white/18">
            Suggested next action
          </div>

          <div className="mt-1 text-[9px] text-white/40">
            {item.suggested_action}
          </div>
        </div>

        <ArrowUpRight
          size={12}
          className="shrink-0 text-[var(--accent)]/50"
        />
      </button>
    </article>
  );
}


function ValueBadge({
  value,
}: {
  value: InformationItem["information_value"];
}) {
  const style = {
    low: "text-white/25",
    medium: "text-yellow-100/50",
    high: "text-[var(--accent)]/60",
    critical: "text-[var(--accent)]",
  }[value];

  return (
    <span
      className={`text-[8px] uppercase tracking-[0.14em] ${style}`}
    >
      {value} value
    </span>
  );
}