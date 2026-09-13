"use client";

import {
  CircleHelp,
  CircleCheck,
  Lightbulb,
  ShieldQuestion,
} from "lucide-react";

import { useParallaxStore } from "@/store/parallax-store";

import type {
  AssumptionItem,
  EvidenceCategory,
} from "@/types/simulation";


const categoryConfig: Record<
  EvidenceCategory,
  {
    label: string;
    icon: React.ElementType;
  }
> = {
  known: {
    label: "Known",
    icon: CircleCheck,
  },

  inferred: {
    label: "Inferred",
    icon: Lightbulb,
  },

  assumed: {
    label: "Assumed",
    icon: ShieldQuestion,
  },

  unknown: {
    label: "Unknown",
    icon: CircleHelp,
  },
};


export function AssumptionLedger() {
  const simulation =
    useParallaxStore(
      (state) =>
        state.simulation,
    );

  if (!simulation) {
    return null;
  }

  const items =
    simulation.assumption_ledger
      .ledger.items;

  const groups =
    Object.keys(
      categoryConfig,
    ) as EvidenceCategory[];

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="mx-auto max-w-[1180px]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/65">
            Evidence integrity
          </div>

          <h2 className="mt-3 text-[28px] font-light tracking-[-0.025em] text-white">
            Assumption Ledger
          </h2>

          <p className="mt-3 max-w-[650px] text-[11px] leading-6 text-white/35">
            PARALLAX separates what is known,
            inferred, assumed and still unknown
            before treating any conclusion as
            reliable.
          </p>
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-4">
          {groups.map(
            (category) => {
              const config =
                categoryConfig[
                  category
                ];

              const Icon =
                config.icon;

              const categoryItems =
                items.filter(
                  (item) =>
                    item.category ===
                    category,
                );

              return (
                <section
                  key={category}
                  className="rounded-[20px] border border-white/[0.07] bg-white/[0.018] p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025]">
                        <Icon
                          size={14}
                          className="text-white/45"
                        />
                      </div>

                      <div>
                        <div className="text-[10px] font-medium text-white/65">
                          {config.label}
                        </div>

                        <div className="mt-0.5 text-[8px] text-white/20">
                          {
                            categoryItems.length
                          }{" "}
                          items
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {categoryItems.map(
                      (item) => (
                        <AssumptionCard
                          key={item.id}
                          item={item}
                        />
                      ),
                    )}

                    {!categoryItems.length && (
                      <div className="rounded-xl border border-dashed border-white/[0.06] p-4 text-center text-[9px] text-white/20">
                        No items detected
                      </div>
                    )}
                  </div>
                </section>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}


function AssumptionCard({
  item,
}: {
  item: AssumptionItem;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] leading-5 text-white/55">
          {item.statement}
        </p>

        <ImpactBadge
          impact={item.impact}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge>
          confidence{" "}
          {item.confidence}
        </Badge>

        {item.source && (
          <Badge>
            {item.source}
          </Badge>
        )}
      </div>

      {!!item.affected_options
        .length && (
        <div className="mt-3">
          <div className="text-[8px] uppercase tracking-[0.13em] text-white/18">
            Affects
          </div>

          <div className="mt-1.5 flex flex-wrap gap-1">
            {item.affected_options.map(
              (option) => (
                <Badge key={option}>
                  {option}
                </Badge>
              ),
            )}
          </div>
        </div>
      )}

      {item.validation_question && (
        <div className="mt-3 border-t border-white/[0.055] pt-3">
          <div className="text-[8px] uppercase tracking-[0.13em] text-[var(--accent)]/45">
            Validate
          </div>

          <p className="mt-1.5 text-[9px] leading-4 text-white/30">
            {
              item.validation_question
            }
          </p>
        </div>
      )}
    </div>
  );
}


function Badge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-1 text-[8px] text-white/25">
      {children}
    </span>
  );
}


function ImpactBadge({
  impact,
}: {
  impact:
    | "low"
    | "medium"
    | "high"
    | "critical";
}) {
  const styles = {
    low:
      "text-white/25",

    medium:
      "text-yellow-200/55",

    high:
      "text-orange-200/65",

    critical:
      "text-red-200/70",
  };

  return (
    <span
      className={[
        "shrink-0 text-[8px] uppercase tracking-[0.12em]",
        styles[impact],
      ].join(" ")}
    >
      {impact}
    </span>
  );
}