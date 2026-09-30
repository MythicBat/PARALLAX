"use client";

import {
  ArrowLeft,
  BrainCircuit,
  GitCompareArrows,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  AppShell,
} from "@/components/layout/AppShell";

import {
  simulateDecision,
} from "@/lib/api";

import {
  compareSimulations,
} from "@/lib/replay";

import {
  useHistoryStore,
} from "@/store/history-store";

import {
  useParallaxStore,
} from "@/store/parallax-store";

import type {
  SimulationResponse,
} from "@/store/parallax-store";


export default function ReplayPage() {
  const params =
    useParams<{
      id: string;
    }>();

  const router =
    useRouter();

  const items =
    useHistoryStore(
      (state) => state.items,
    );

  const saveSimulation =
    useHistoryStore(
      (state) =>
        state.saveSimulation,
    );

  const setSimulation =
    useParallaxStore(
      (state) =>
        state.setSimulation,
    );

  const item =
    useMemo(
      () =>
        items.find(
          (candidate) =>
            candidate.id ===
            params.id,
        ),
      [items, params.id],
    );

  const [changedContext, setChangedContext] =
    useState("");

  const [running, setRunning] =
    useState(false);

  const [error, setError] =
    useState<string | null>(
      null,
    );

  const [replayedSimulation, setReplayedSimulation] =
    useState<SimulationResponse | null>(
      null,
    );


  if (!item) {
    return (
      <AppShell>
        <div className="flex h-[calc(100vh-72px)] items-center justify-center">
          <div className="text-center">
            <div className="text-[11px] text-white/40">
              Decision not found
            </div>

            <button
              onClick={() =>
                router.push(
                  "/history",
                )
              }
              className="mt-4 text-[9px] text-[var(--accent)]/60"
            >
              Return to history
            </button>
          </div>
        </div>
      </AppShell>
    );
  }


  const comparison =
    replayedSimulation
      ? compareSimulations(
          item.simulation,
          replayedSimulation,
        )
      : null;


  async function runReplay() {
    if (!item?.request) {
      return;
    }

    setRunning(true);
    setError(null);

    try {
      const originalContext =
        item.request.context ??
        "";

      const replayContext = [
        originalContext,

        changedContext.trim()
          ? `NEW INFORMATION SINCE THE ORIGINAL SIMULATION:\n${changedContext.trim()}`
          : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      const request = {
        ...item.request,
        context:
          replayContext,
      };

      const result =
        await simulateDecision(
          request,
        );

      setReplayedSimulation(
        result,
      );

      setSimulation(
        result,
      );

      saveSimulation(
        result,
        request,
      );

    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Replay failed.",
      );
    } finally {
      setRunning(false);
    }
  }


  return (
    <AppShell>

      <div className="h-[calc(100vh-72px)] overflow-y-auto p-8">

        <div className="mx-auto max-w-[1180px]">

          <button
            onClick={() =>
              router.push(
                "/history",
              )
            }
            className="flex items-center gap-2 text-[8px] text-white/25 transition hover:text-white/50"
          >
            <ArrowLeft size={11} />
            Decision History
          </button>


          <div className="mt-8">

            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.17em] text-[var(--accent)]/60">
              <RotateCcw size={12} />
              Decision Replay
            </div>

            <h1 className="mt-3 max-w-[820px] text-[28px] font-light leading-[1.25] tracking-[-0.03em] text-white">
              {item.question}
            </h1>

            <p className="mt-3 max-w-[700px] text-[10px] leading-6 text-white/30">
              Introduce information that
              changed after the original
              simulation. PARALLAX will run
              the decision again and compare
              the resulting future landscape.
            </p>

          </div>


          <div className="mt-9 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">

            <section className="rounded-[20px] border border-white/[0.065] bg-white/[0.018] p-5">

              <div className="text-[8px] uppercase tracking-[0.14em] text-white/20">
                Original decision
              </div>

              <div className="mt-5 space-y-4">

                <Info
                  label="Question"
                  value={
                    item.request.question
                  }
                />

                <Info
                  label="Options"
                  value={
                    item.request.options
                      .map(
                        (option) =>
                          option.name,
                      )
                      .join(" · ")
                  }
                />

                <Info
                  label="Goals"
                  value={
                    item.request.goals
                      .join(" · ") ||
                    "None specified"
                  }
                />

                <Info
                  label="Constraints"
                  value={
                    item.request.constraints
                      .join(" · ") ||
                    "None specified"
                  }
                />

                <Info
                  label="Original context"
                  value={
                    item.request.context ||
                    "No additional context."
                  }
                />

              </div>

            </section>


            <section className="rounded-[20px] border border-[var(--accent)]/10 bg-[var(--accent)]/[0.018] p-5">

              <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.14em] text-[var(--accent)]/45">
                <Sparkles size={11} />
                What changed?
              </div>

              <textarea
                value={changedContext}
                onChange={(event) =>
                  setChangedContext(
                    event.target.value,
                  )
                }
                placeholder={`Examples:\n• I received a $20,000 scholarship.\n• The job is now fully remote.\n• My deadline moved forward by two months.\n• Option B increased its price by 30%.`}
                className="mt-5 min-h-[220px] w-full resize-none rounded-xl border border-white/[0.065] bg-black/20 p-4 text-[10px] leading-6 text-white/55 outline-none placeholder:text-white/16 focus:border-[var(--accent)]/20"
              />


              <div className="mt-4 flex items-center justify-between gap-4">

                <div className="max-w-[330px] text-[8px] leading-4 text-white/18">
                  Replay triggers a new
                  Nemotron simulation and
                  consumes inference credits.
                </div>

                <button
                  onClick={runReplay}
                  disabled={
                    running ||
                    !changedContext.trim()
                  }
                  className="flex items-center gap-2 rounded-xl border border-[var(--accent)]/15 bg-[var(--accent)]/[0.06] px-4 py-3 text-[9px] text-[var(--accent)]/70 transition hover:bg-[var(--accent)]/[0.1] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {running ? (
                    <BrainCircuit
                      size={12}
                      className="animate-pulse"
                    />
                  ) : (
                    <Play size={11} />
                  )}

                  {running
                    ? "Re-simulating..."
                    : "Re-simulate now"}
                </button>

              </div>


              {error && (
                <div className="mt-4 rounded-lg border border-red-400/10 bg-red-400/[0.03] p-3 text-[9px] text-red-300/60">
                  {error}
                </div>
              )}

            </section>

          </div>


          {comparison && (
            <Comparison
              comparison={
                comparison
              }
              onOpen={() =>
                router.push(
                  "/futures",
                )
              }
            />
          )}

        </div>

      </div>

    </AppShell>
  );
}


function Comparison({
  comparison,
  onOpen,
}: {
  comparison:
    ReturnType<
      typeof compareSimulations
    >;

  onOpen: () => void;
}) {
  return (
    <section className="mt-6 rounded-[22px] border border-white/[0.075] bg-white/[0.02] p-6">

      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

        <div>
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-[var(--accent)]/55">
            <GitCompareArrows
              size={12}
            />
            Replay comparison
          </div>

          <div className="mt-2 text-[10px] text-white/28">
            Original simulation vs
            updated future landscape
          </div>
        </div>

        <button
          onClick={onOpen}
          className="rounded-lg border border-[var(--accent)]/12 bg-[var(--accent)]/[0.04] px-3 py-2 text-[8px] text-[var(--accent)]/60"
        >
          Open new Future Canvas →
        </button>

      </div>


      <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-4">

        <ComparisonMetric
          label="Preference"
          before={
            comparison
              .previousPreference ??
            "Unknown"
          }
          after={
            comparison
              .newPreference ??
            "Unknown"
          }
          changed={
            comparison
              .preferenceChanged
          }
        />

        <ComparisonMetric
          label="Confidence"
          before={String(
            comparison
              .previousConfidence ??
              "Unknown",
          )}
          after={String(
            comparison
              .newConfidence ??
              "Unknown",
          )}
          changed={
            String(
              comparison
                .previousConfidence,
            ) !==
            String(
              comparison
                .newConfidence,
            )
          }
        />

        <ComparisonMetric
          label="Model calls"
          before={String(
            comparison
              .previousModelCalls,
          )}
          after={String(
            comparison
              .newModelCalls,
          )}
        />

        <ComparisonMetric
          label="Tokens"
          before={
            comparison
              .previousTokens
              .toLocaleString()
          }
          after={
            comparison
              .newTokens
              .toLocaleString()
          }
        />

      </div>


      <div className="mt-6 grid gap-3 lg:grid-cols-2">

        <ChangeList
          title="New assumptions"
          items={
            comparison
              .assumptionsAdded
          }
          empty="No new assumptions detected."
        />

        <ChangeList
          title="Assumptions no longer present"
          items={
            comparison
              .assumptionsRemoved
          }
          empty="No assumptions disappeared."
        />

        <ChangeList
          title="New blind spots"
          items={
            comparison
              .blindSpotsAdded
          }
          empty="No new blind spots detected."
        />

        <ChangeList
          title="Blind spots no longer present"
          items={
            comparison
              .blindSpotsRemoved
          }
          empty="No blind spots disappeared."
        />

      </div>

    </section>
  );
}


function ComparisonMetric({
  label,
  before,
  after,
  changed = false,
}: {
  label: string;
  before: string;
  after: string;
  changed?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/10 p-4">

      <div className="text-[8px] uppercase tracking-[0.12em] text-white/18">
        {label}
      </div>

      <div className="mt-4 text-[8px] text-white/18">
        Before
      </div>

      <div className="mt-1 truncate text-[10px] text-white/40">
        {before}
      </div>

      <div className="mt-3 text-[8px] text-white/18">
        After
      </div>

      <div
        className={[
          "mt-1 truncate text-[10px]",
          changed
            ? "text-[var(--accent)]/70"
            : "text-white/40",
        ].join(" ")}
      >
        {after}
      </div>

    </div>
  );
}


function ChangeList({
  title,
  items,
  empty,
}: {
  title: string;
  items: string[];
  empty: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.055] bg-black/10 p-4">

      <div className="text-[8px] uppercase tracking-[0.12em] text-white/20">
        {title}
      </div>

      {items.length === 0 ? (
        <div className="mt-3 text-[9px] text-white/15">
          {empty}
        </div>
      ) : (
        <div className="mt-3 space-y-2">

          {items
            .slice(0, 6)
            .map(
              (item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="text-[9px] leading-5 text-white/35"
                >
                  • {item}
                </div>
              ),
            )}

        </div>
      )}

    </div>
  );
}


function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <div className="text-[8px] uppercase tracking-[0.12em] text-white/17">
        {label}
      </div>

      <div className="mt-1.5 whitespace-pre-line text-[9px] leading-5 text-white/38">
        {value}
      </div>

    </div>
  );
}