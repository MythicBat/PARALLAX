"use client";

import {
  Check,
  ShieldAlert,
  Skull,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import { useParallaxStore } from "@/store/parallax-store";

import type {
  StressImpact,
  StressScenario,
} from "@/types/simulation";


export function StressLab() {
  const simulation =
    useParallaxStore(
      (state) =>
        state.simulation,
    );

  const [selectedScenarioId, setSelectedScenarioId] =
    useState<string | null>(
      null,
    );

  const stressTest =
    simulation?.stress_test
      .stress_test;

  const selectedScenario =
    useMemo(() => {
      if (!stressTest) {
        return null;
      }

      const id =
        selectedScenarioId ??
        stressTest.scenarios[0]?.id;

      return (
        stressTest.scenarios.find(
          (scenario) =>
            scenario.id === id,
        ) ?? null
      );
    }, [
      stressTest,
      selectedScenarioId,
    ]);

  if (
    !simulation ||
    !stressTest
  ) {
    return null;
  }

  const impacts =
    selectedScenario
      ? stressTest.impacts.filter(
          (impact) =>
            impact.scenario_id ===
            selectedScenario.id,
        )
      : [];

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col justify-between gap-8 lg:flex-row">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/65">
              <ShieldAlert size={13} />

              Robustness analysis
            </div>

            <h2 className="mt-3 text-[28px] font-light tracking-[-0.025em] text-white">
              Stress Lab
            </h2>

            <p className="mt-3 max-w-[620px] text-[11px] leading-6 text-white/35">
              Test each option against adverse
              scenarios and identify which
              decision remains viable when the
              environment changes.
            </p>
          </div>

          {stressTest.most_resilient_option && (
            <div className="rounded-[18px] border border-[var(--accent)]/15 bg-[var(--accent)]/[0.04] px-5 py-4">
              <div className="text-[8px] uppercase tracking-[0.14em] text-[var(--accent)]/50">
                Most resilient
              </div>

              <div className="mt-2 text-[15px] font-light text-white/80">
                {
                  stressTest.most_resilient_option
                }
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-2">
            <div className="mb-4 text-[9px] uppercase tracking-[0.15em] text-white/20">
              Stress scenarios
            </div>

            {stressTest.scenarios.map(
              (scenario) => {
                const selected =
                  selectedScenario?.id ===
                  scenario.id;

                return (
                  <button
                    key={
                      scenario.id
                    }
                    onClick={() =>
                      setSelectedScenarioId(
                        scenario.id,
                      )
                    }
                    className={[
                      "w-full rounded-xl border p-4 text-left transition",
                      selected
                        ? "border-white/[0.14] bg-white/[0.05]"
                        : "border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.03]",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[10px] font-medium text-white/60">
                        {
                          scenario.name
                        }
                      </div>

                      <Severity
                        scenario={
                          scenario
                        }
                      />
                    </div>

                    <p className="mt-2 line-clamp-2 text-[9px] leading-4 text-white/25">
                      {
                        scenario.description
                      }
                    </p>
                  </button>
                );
              },
            )}
          </aside>

          <main>
            {selectedScenario && (
              <>
                <div className="rounded-[20px] border border-white/[0.07] bg-white/[0.018] p-5">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="text-[9px] uppercase tracking-[0.15em] text-white/20">
                        Active scenario
                      </div>

                      <h3 className="mt-2 text-[18px] font-light text-white/80">
                        {
                          selectedScenario.name
                        }
                      </h3>

                      <p className="mt-3 max-w-[700px] text-[10px] leading-5 text-white/35">
                        {
                          selectedScenario.description
                        }
                      </p>
                    </div>

                    <Severity
                      scenario={
                        selectedScenario
                      }
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {impacts.map(
                    (impact) => (
                      <ImpactCard
                        key={
                          `${impact.option}-${impact.scenario_id}`
                        }
                        impact={
                          impact
                        }
                      />
                    ),
                  )}
                </div>

                <div className="mt-4 rounded-[20px] border border-white/[0.07] bg-white/[0.018] p-5">
                  <div className="text-[9px] uppercase tracking-[0.15em] text-white/20">
                    Stress synthesis
                  </div>

                  <p className="mt-3 text-[10px] leading-6 text-white/35">
                    {
                      stressTest.explanation
                    }
                  </p>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}


function ImpactCard({
  impact,
}: {
  impact: StressImpact;
}) {
  return (
    <article className="rounded-[18px] border border-white/[0.07] bg-white/[0.018] p-5">
      <div className="flex items-center justify-between">
        <div className="text-[12px] font-medium text-white/70">
          {impact.option}
        </div>

        <div
          className={[
            "flex h-7 w-7 items-center justify-center rounded-lg border",
            impact.survives
              ? "border-[var(--accent)]/15 bg-[var(--accent)]/[0.05] text-[var(--accent)]"
              : "border-red-400/15 bg-red-400/[0.04] text-red-300/70",
          ].join(" ")}
        >
          {impact.survives ? (
            <Check size={13} />
          ) : (
            <X size={13} />
          )}
        </div>
      </div>

      <div className="mt-5">
        <div className="text-[8px] uppercase tracking-[0.13em] text-white/20">
          Impact
        </div>

        <div className="mt-1.5 text-[10px] text-white/45">
          {impact.impact.replaceAll(
            "_",
            " ",
          )}
        </div>
      </div>

      <p className="mt-4 text-[9px] leading-5 text-white/30">
        {
          impact.explanation
        }
      </p>

      <div className="mt-4 border-t border-white/[0.055] pt-3">
        <div className="flex items-center gap-2 text-[9px]">
          {impact.survives ? (
            <>
              <Check
                size={11}
                className="text-[var(--accent)]/70"
              />

              <span className="text-[var(--accent)]/50">
                Remains viable
              </span>
            </>
          ) : (
            <>
              <Skull
                size={11}
                className="text-red-300/60"
              />

              <span className="text-red-200/50">
                Fails stress condition
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}


function Severity({
  scenario,
}: {
  scenario: StressScenario;
}) {
  const className = {
    moderate:
      "text-yellow-200/50",

    severe:
      "text-orange-200/65",

    extreme:
      "text-red-300/70",
  }[
    scenario.severity
  ];

  return (
    <span
      className={`text-[8px] uppercase tracking-[0.13em] ${className}`}
    >
      {scenario.severity}
    </span>
  );
}