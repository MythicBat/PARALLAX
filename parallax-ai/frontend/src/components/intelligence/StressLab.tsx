"use client";

import {
  Check,
  ShieldAlert,
  FlaskConical,
  Skull,
  Play,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import { useParallaxStore } from "@/store/parallax-store";
import { runCustomStress } from "@/lib/api";

import type {
  CustomStressResponse,
  StressImpact,
  StressScenario,
} from "@/types/simulation";
import { IntelligenceUnavailable } from "./IntelligenceUnavailable";


export function StressLab() {
  const simulation =
    useParallaxStore(
      (state) =>
        state.simulation,
    );
  
  const [customScenario, setCustomScenario] = useState("");
  
  const [runningCustom, setRunningCustom] = useState(false);

  const [customResult, setCustomResult] = useState<CustomStressResponse | null>(null);

  const [customError, setCustomError] = useState<string | null>(null);

  const [selectedScenarioId, setSelectedScenarioId] =
    useState<string | null>(
      null,
    );

  const stressTest = simulation?.stress_test?.stress_test;

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
    !simulation
  ) {
    return null;
  }

  const impacts =
    selectedScenario && stressTest
      ? stressTest.impacts.filter(
          (impact) =>
            impact.scenario_id ===
            selectedScenario.id,
        )
      : [];
  
  async function runScenario() {
    if (!simulation || !customScenario.trim()) {
      return;
    }

    setRunningCustom(true);
    setCustomError(null);

    try {
      const architecture = simulation.architecture as Record<string, unknown>;

      const architectureBody = (architecture["architecture"] as Record<string, unknown>) ?? architecture;

      const architectureOptions = architectureBody["options"];

      const futureOptions = simulation.futures?.simulation?.simulations?.map(
        (item) => ({ name: item.option }),
      );

      const options = futureOptions ?? (
        Array.isArray(architectureOptions) ? architectureOptions.map((item: unknown) => {
          if (typeof item === "string") {
            return { name: item };
          }

          if (item && typeof item === "object" && "name" in item && typeof item.name === "string") {
            return { name: item.name };
          }

          return null;
        }).filter((item): item is { name: string } => item !== null)
        : []
      );

      if (options.length === 0) {
        throw new Error("Decision options are not available for custom stress testing.");
      }

      const decision = {
        question: (architectureBody["core_question"] as string) ?? "Current decision",
        options,
      }

      const result = await runCustomStress({
        decision,
        architecture: architectureBody,
        scenario: customScenario.trim(),
      });

      setCustomResult(result);
    } catch (cause) {
      setCustomError(
        cause instanceof Error ? cause.message : "An unknown error occurred.",
      );
    } finally {
      setRunningCustom(false);
    }
  }

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

          <section className="mb-6 rounded-[18px] border border-[(--accent)]/10 bg-[var(--accent)]/[0.018] p-5">
            <div className="flex items-start justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.14em] text-[var(--accent)]/50">
                  <FlaskConical size={11} />
                  Scenario Lab
                </div>

                <div className="mt-2 text-[10px] text-white/40">
                  Introduce an adverse hypothetical and test every option against it.
                </div>
              </div>

              <div className="rounded-md border border-white/[0.05] px-2 py-1 text-[7px] uppercase tracking-[0.1em] text-white/16">
                Targeted inference
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 lg:flex-row">
              <input
                value={customScenario}
                onChange={(event) => setCustomScenario(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !runningCustom) {
                    void runScenario();
                  }
                }}
                placeholder="What if Option B becomes 30% more expensive?"
                className="min-w-0 flex-1 rounded-xl border border-white/[0.065] bg-black/20 px-4 py-3 text-[10px] text-white/55 outline-none placeholder:text-white/16 focus:border-[var(--accent)]/20"
              />

              <button
                onClick={() => void runScenario()}
                disabled={runningCustom || !customScenario.trim()}
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[var(--accent)]/15 bg-[var(--accent)]/[0.055] px-4 py-3 text-[9px] text-[var(--accent)]/65 transition hover:bg-[var(--accent)]/[0.09] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Play size={10} />

                {runningCustom ? "Running..." : "Run scenario"}
              </button>
            </div>

            <div className="mt-3 text-[8px] text-white/16">
            Runs only the Stress Agent and not the complete PARALLAX simulation.
            </div>

            {customError && (
              <div className="mt-4 rounded-lg border border-red-400/10 bg-red-400/[0.025] p-3 text-[9px] text-red-300/60">
                {customError}
              </div>
            )}
          </section>

          {customResult && (
            <CustomStressResult
              payload={customResult}
            />
          )}

          {stressTest?.most_resilient_option && (
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

        {stressTest ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-2">
            <div className="mb-4 text-[9px] uppercase tracking-[0.15em] text-white/20">
              Stress scenarios
            </div>

            {stressTest?.scenarios.map(
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
                      stressTest?.explanation
                    }
                  </p>
                </div>
              </>
            )}
          </main>
        </div>) : (
          <IntelligenceUnavailable
            title="Automated Stress Analysis unavailable"
            description="The automatic stress analysis could not complete. You can still enter and run a custom scenario above."
          />
        )}
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

function CustomStressResult({
  payload,
}: {
  payload: CustomStressResponse;
}) {
  const wrapper =
    payload.result;

  const stress =
    wrapper.stress_test;

  const scenarios =
    stress.scenarios;

  const impacts =
    stress.impacts;


  return (
    <section className="mb-6 rounded-[18px] border border-white/[0.07] bg-white/[0.02] p-5">

      {/* HEADER */}

      <div className="flex items-center justify-between gap-4">

        <div>

          <div className="text-[8px] uppercase tracking-[0.14em] text-[var(--accent)]/50">
            Custom stress result
          </div>

          <div className="mt-2 text-[9px] text-white/25">
            Isolated targeted analysis
          </div>

        </div>


        <div className="text-right">

          <div className="text-[8px] capitalize text-white/30">
            {wrapper.inference.tier} tier
          </div>

          <div className="mt-1 text-[7px] text-white/15">
            {
              wrapper.inference
                .usage
                .total_tokens
            }{" "}
            tokens
          </div>

        </div>

      </div>


      {/* SCENARIOS */}

      <div className="mt-5 space-y-3">

        {scenarios.map(
          (scenario) => {
            const scenarioImpacts =
              impacts.filter(
                (
                  impact:
                    StressImpact,
                ) =>
                  impact.scenario_id ===
                  scenario.id,
              );


            return (
              <div
                key={scenario.id}
                className="rounded-xl border border-white/[0.055] bg-black/10 p-4"
              >

                {/* SCENARIO HEADER */}

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <div className="text-[10px] text-white/50">
                      {
                        scenario.name
                      }
                    </div>

                    <div className="mt-2 text-[9px] leading-5 text-white/25">
                      {
                        scenario.description
                      }
                    </div>

                  </div>


                  <span className="rounded-md border border-white/[0.05] px-2 py-1 text-[7px] uppercase text-white/20">
                    {
                      scenario.severity
                    }
                  </span>

                </div>


                {/* OPTION IMPACTS */}

                <div className="mt-4 grid gap-2 md:grid-cols-2">

                  {scenarioImpacts.map(
                    (
                      impact,
                      index,
                    ) => (
                      <div
                        key={`${impact.option}-${index}`}
                        className="rounded-lg border border-white/[0.045] bg-white/[0.012] p-3"
                      >

                        <div className="flex items-center justify-between gap-3">

                          <span className="text-[9px] text-white/40">
                            {
                              impact.option
                            }
                          </span>


                          <span
                            className={
                              impact.survives
                                ? "text-[8px] text-[var(--accent)]/55"
                                : "text-[8px] text-red-300/50"
                            }
                          >

                            {impact.survives
                              ? "SURVIVES"
                              : "FAILS"}

                          </span>

                        </div>


                        <div className="mt-2 text-[8px] uppercase tracking-[0.1em] text-white/18">
                          {
                            impact.impact
                          }
                        </div>


                        <div className="mt-2 text-[8px] leading-4 text-white/24">
                          {
                            impact.explanation
                          }
                        </div>

                      </div>
                    ),
                  )}

                </div>

              </div>
            );
          },
        )}

      </div>


      {/* MOST RESILIENT */}

      {stress.most_resilient_option && (
        <div className="mt-5 border-t border-white/[0.05] pt-4">

          <div className="text-[8px] uppercase tracking-[0.12em] text-white/17">
            Most resilient
          </div>

          <div className="mt-2 text-[11px] text-[var(--accent)]/60">
            {
              stress.most_resilient_option
            }
          </div>


          {stress.explanation && (
            <p className="mt-2 text-[9px] leading-5 text-white/25">
              {
                stress.explanation
              }
            </p>
          )}

        </div>
      )}

    </section>
  );
}