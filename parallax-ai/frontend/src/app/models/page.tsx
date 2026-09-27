"use client";

import {
  Activity,
  Cpu,
  Gauge,
  Layers3,
  Network,
  Zap,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import { AppShell } from "@/components/layout/AppShell";
import { TraceInspector } from "@/components/observatory/TraceInspector";

import { useParallaxStore } from "@/store/parallax-store";

import type {
  InferenceTrace,
  ModelTier,
} from "@/types/observability";


const tierDefinitions = [
  {
    id: "lightning",
    title: "Nemotron 3.5 Lightning",
    subtitle: "Fast orchestration",
    description:
      "Lightweight routing, classification and short-form operations.",
    icon: Zap,
  },
  {
    id: "nano",
    title: "Nemotron 3 Nano",
    subtitle: "Structured intelligence",
    description:
      "Extraction, assumption detection and structured worker tasks.",
    icon: Gauge,
  },
  {
    id: "super",
    title: "Nemotron 3 Super",
    subtitle: "Agentic reasoning",
    description:
      "Primary specialist, adversarial and simulation reasoning tier.",
    icon: Layers3,
  },
  {
    id: "ultra",
    title: "Nemotron 3 Ultra",
    subtitle: "Deep synthesis",
    description:
      "High-complexity synthesis, adjudication and counterfactual reasoning.",
    icon: Cpu,
  },
] satisfies {
  id: ModelTier;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
}[];


export default function ModelsPage() {
  const simulation =
    useParallaxStore(
      (state) => state.simulation,
    );

  const [selectedTrace, setSelectedTrace] =
    useState<InferenceTrace | null>(
      null,
    );

  const traces =
    simulation?.observatory
      ?.traces ?? [];


  const modelsUsed =
    useMemo(
      () =>
        new Set(
          traces.map(
            (trace) =>
              trace.model,
          ),
        ).size,
      [traces],
    );


  if (!simulation) {
    return (
      <AppShell>
        <EmptyState />
      </AppShell>
    );
  }


  const summary =
    simulation.observatory
      .summary;


  return (
    <AppShell>

      <div className="h-[calc(100vh-72px)] overflow-y-auto p-8">

        <div className="mx-auto max-w-[1180px]">

          <div>

            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/65">
              <Network size={13} />
              Inference architecture
            </div>

            <h1 className="mt-3 text-[30px] font-light tracking-[-0.03em] text-white">
              NVIDIA Model Observatory
            </h1>

            <p className="mt-3 max-w-[720px] text-[11px] leading-6 text-white/35">
              Inspect how PARALLAX distributes
              decision intelligence across NVIDIA
              Nemotron reasoning tiers served
              through Nebius Token Factory.
            </p>

          </div>


          <div className="mt-7 flex flex-wrap gap-2">

            <Pill>
              {simulation.observatory.provider}
            </Pill>

            <Pill>
              {summary.total_calls} inference calls
            </Pill>

            <Pill>
              {modelsUsed} models used
            </Pill>

            <Pill>
              {summary.total_tokens.toLocaleString()} tokens
            </Pill>

          </div>


          <div className="mt-12">

            <div className="mb-5 flex items-center justify-between">

              <div>
                <div className="text-[9px] uppercase tracking-[0.16em] text-white/22">
                  Model routing architecture
                </div>

                <div className="mt-1 text-[9px] text-white/15">
                  Complexity-aware inference selection
                </div>
              </div>

              <div className="flex items-center gap-2 text-[8px] text-white/18">
                <Activity size={10} />
                Actual run telemetry
              </div>

            </div>


            <div className="grid gap-3 lg:grid-cols-4">

              {tierDefinitions.map(
                (tier) => {
                  const tierTraces =
                    traces.filter(
                      (trace) =>
                        trace.tier ===
                        tier.id,
                    );

                  return (
                    <TierCard
                      key={tier.id}
                      definition={tier}
                      traces={tierTraces}
                      onTraceClick={
                        setSelectedTrace
                      }
                    />
                  );
                },
              )}

            </div>

          </div>


          <div className="mt-10 rounded-[22px] border border-white/[0.065] bg-white/[0.018] p-6">

            <div className="text-[9px] uppercase tracking-[0.16em] text-white/22">
              Routing principle
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">

              <Principle
                number="01"
                title="Match depth to task"
                text="Routine structured work does not need the most expensive reasoning tier."
              />

              <Principle
                number="02"
                title="Parallelize specialists"
                text="Independent agents can reason concurrently while preserving separate perspectives."
              />

              <Principle
                number="03"
                title="Reserve depth"
                text="Ultra is concentrated on high-complexity synthesis and counterfactual analysis."
              />

            </div>

          </div>

        </div>

      </div>


      <TraceInspector
        trace={selectedTrace}
        onClose={() =>
          setSelectedTrace(null)
        }
      />

    </AppShell>
  );
}


function TierCard({
  definition,
  traces,
  onTraceClick,
}: {
  definition:
    typeof tierDefinitions[number];

  traces: InferenceTrace[];

  onTraceClick:
    (trace: InferenceTrace) => void;
}) {
  const Icon =
    definition.icon;

  const totalTokens =
    traces.reduce(
      (total, trace) =>
        total +
        trace.usage.total_tokens,
      0,
    );

  const totalLatency =
    traces.reduce(
      (total, trace) =>
        total +
        trace.latency_ms,
      0,
    );


  return (
    <article className="flex min-h-[390px] flex-col rounded-[20px] border border-white/[0.07] bg-white/[0.018] p-5">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">

        <Icon
          size={15}
          className={
            definition.id ===
            "ultra"
              ? "text-[var(--accent)]/70"
              : "text-white/35"
          }
        />

      </div>


      <div className="mt-5">

        <div className="text-[12px] font-medium text-white/65">
          {definition.title}
        </div>

        <div className="mt-1 text-[8px] uppercase tracking-[0.12em] text-white/20">
          {definition.subtitle}
        </div>

        <p className="mt-3 text-[9px] leading-5 text-white/28">
          {definition.description}
        </p>

      </div>


      <div className="mt-5 grid grid-cols-3 gap-2">

        <MiniMetric
          value={traces.length}
          label="calls"
        />

        <MiniMetric
          value={
            totalTokens.toLocaleString()
          }
          label="tokens"
        />

        <MiniMetric
          value={`${(
            totalLatency / 1000
          ).toFixed(1)}s`}
          label="latency"
        />

      </div>


      <div className="mt-5 border-t border-white/[0.05] pt-4">

        <div className="text-[8px] uppercase tracking-[0.12em] text-white/17">
          Assigned agents
        </div>


        {traces.length === 0 ? (
          <div className="mt-3 text-[9px] text-white/15">
            Not used in this simulation.
          </div>
        ) : (
          <div className="mt-3 space-y-1.5">

            {traces.map(
              (trace) => (
                <button
                  key={trace.id}
                  onClick={() =>
                    onTraceClick(trace)
                  }
                  className="flex w-full items-center justify-between rounded-lg border border-white/[0.045] bg-black/10 px-2.5 py-2 text-left transition hover:border-white/[0.09] hover:bg-white/[0.025]"
                >

                  <span className="max-w-[130px] truncate text-[8px] text-white/30">
                    {trace.agent}
                  </span>

                  <span className="text-[7px] text-white/15">
                    {trace.latency_ms}ms
                  </span>

                </button>
              ),
            )}

          </div>
        )}

      </div>

    </article>
  );
}


function MiniMetric({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-white/[0.05] bg-black/10 p-2.5">

      <div className="text-[10px] text-white/45">
        {value}
      </div>

      <div className="mt-1 text-[7px] uppercase tracking-[0.1em] text-white/15">
        {label}
      </div>

    </div>
  );
}


function Principle({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div>

      <div className="text-[8px] text-[var(--accent)]/40">
        {number}
      </div>

      <div className="mt-2 text-[10px] text-white/50">
        {title}
      </div>

      <p className="mt-2 text-[9px] leading-5 text-white/25">
        {text}
      </p>

    </div>
  );
}


function Pill({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[8px] text-white/28">
      {children}
    </span>
  );
}


function EmptyState() {
  return (
    <div className="flex h-[calc(100vh-72px)] items-center justify-center">

      <div className="text-center">

        <Cpu
          size={24}
          className="mx-auto text-white/15"
        />

        <div className="mt-4 text-[11px] text-white/40">
          No inference telemetry available
        </div>

        <div className="mt-2 text-[9px] text-white/20">
          Run a decision simulation first.
        </div>

      </div>

    </div>
  );
}