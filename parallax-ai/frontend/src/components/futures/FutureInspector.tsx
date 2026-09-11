"use client";

import {
  AlertTriangle,
  GitBranch,
  Lightbulb,
  RotateCcw,
  Shield,
  X,
} from "lucide-react";

import { useParallaxStore } from "@/store/parallax-store";


export function FutureInspector() {
  const selectedFuture =
    useParallaxStore(
      (state) =>
        state.selectedFuture,
    );

  const setSelectedFuture =
    useParallaxStore(
      (state) =>
        state.setSelectedFuture,
    );

  if (!selectedFuture) {
    return null;
  }

  return (
    <aside className="absolute bottom-4 right-4 top-4 z-30 w-[390px] overflow-y-auto rounded-[22px] border border-white/[0.09] bg-[#080a0e]/95 shadow-2xl backdrop-blur-2xl">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-[#080a0e]/90 px-5 py-4 backdrop-blur-xl">
        <div>
          <div className="text-[9px] uppercase tracking-[0.16em] text-white/25">
            Future Inspector
          </div>

          <div className="mt-1 text-[11px] text-white/55">
            {selectedFuture.option}
          </div>
        </div>

        <button
          onClick={() =>
            setSelectedFuture(null)
          }
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] text-white/30 transition hover:bg-white/[0.04] hover:text-white"
        >
          <X size={14} />
        </button>
      </div>

      <div className="p-5">
        <div className="text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--accent)]/65">
          {selectedFuture.scenario_type.replaceAll(
            "_",
            " ",
          )}
        </div>

        <h2 className="mt-3 text-[21px] font-light leading-7 text-white">
          {selectedFuture.title}
        </h2>

        <p className="mt-4 text-[11px] leading-6 text-white/40">
          {selectedFuture.narrative}
        </p>

        <div className="mt-6 rounded-xl border border-white/[0.065] bg-white/[0.02] p-4">
          <div className="flex items-center justify-between">
            <div className="text-[9px] uppercase tracking-[0.14em] text-white/25">
              Robustness
            </div>

            <div className="text-xl font-light text-white">
              {Math.round(
                selectedFuture.robustness_score,
              )}
              <span className="ml-1 text-[10px] text-white/20">
                /100
              </span>
            </div>
          </div>

          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className="h-full bg-[var(--accent)]"
              style={{
                width:
                  `${selectedFuture.robustness_score}%`,
              }}
            />
          </div>

          <div className="mt-3 flex justify-between text-[9px] text-white/25">
            <span>
              Uncertainty{" "}
              {selectedFuture.uncertainty}
            </span>

            <span>
              Reversibility{" "}
              {selectedFuture.reversibility}
            </span>
          </div>
        </div>

        <Section
          icon={Lightbulb}
          title="Key drivers"
          items={
            selectedFuture.key_drivers
          }
        />

        <Section
          icon={Shield}
          title="Required assumptions"
          items={
            selectedFuture.assumptions_required
          }
        />

        <Section
          icon={AlertTriangle}
          title="Warning signals"
          items={
            selectedFuture.warning_signals
          }
        />

        <div className="mt-7">
          <div className="mb-3 text-[9px] uppercase tracking-[0.15em] text-white/25">
            Outcome dimensions
          </div>

          <div className="space-y-2">
            {selectedFuture.outcome_dimensions.map(
              (dimension) => (
                <div
                  key={
                    dimension.name
                  }
                  className="rounded-xl border border-white/[0.06] bg-white/[0.018] p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-medium text-white/60">
                      {dimension.name}
                    </div>

                    <div className="text-[8px] uppercase tracking-[0.12em] text-white/25">
                      {dimension.direction.replaceAll(
                        "_",
                        " ",
                      )}
                    </div>
                  </div>

                  <p className="mt-2 text-[9px] leading-5 text-white/30">
                    {
                      dimension.explanation
                    }
                  </p>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2">
          <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] text-[10px] text-white/45 transition hover:bg-white/[0.05] hover:text-white">
            <RotateCcw size={13} />
            Stress this future
          </button>

          <button className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-[10px] font-medium text-black transition hover:brightness-110">
            <GitBranch size={13} />
            Branch from here
          </button>
        </div>
      </div>
    </aside>
  );
}


function Section({
  icon: Icon,
  title,
  items,
}: {
  icon: React.ElementType;
  title: string;
  items: string[];
}) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="mt-7">
      <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-white/25">
        <Icon size={12} />

        {title}
      </div>

      <div className="mt-3 space-y-2">
        {items.map(
          (item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex gap-3 text-[10px] leading-5 text-white/38"
            >
              <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-white/25" />

              {item}
            </div>
          ),
        )}
      </div>
    </div>
  );
}