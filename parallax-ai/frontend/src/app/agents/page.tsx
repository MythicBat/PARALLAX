"use client";

import {
  Activity,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Cpu,
  Network,
  TriangleAlert,
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
} from "@/types/observability";


export default function AgentsPage() {
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


  const uniqueAgents =
    useMemo(
      () =>
        new Set(
          traces.map(
            (trace) => trace.agent,
          ),
        ).size,
      [traces],
    );


  const failedCalls =
    traces.filter(
      (trace) =>
        trace.status === "failed",
    ).length;


  if (!simulation) {
    return (
      <AppShell>
        <EmptyState />
      </AppShell>
    );
  }


  return (
    <AppShell>

      <div className="h-[calc(100vh-72px)] overflow-y-auto p-8">

        <div className="mx-auto max-w-[1240px]">

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div>

              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/65">
                <Activity size={13} />
                Runtime intelligence
              </div>

              <h1 className="mt-3 text-[30px] font-light tracking-[-0.03em] text-white">
                Agent Observatory
              </h1>

              <p className="mt-3 max-w-[680px] text-[11px] leading-6 text-white/35">
                Inspect the reasoning agents
                deployed for this decision and
                the real model inference behind
                every stage.
              </p>

            </div>


            <div className="flex items-center gap-2 rounded-xl border border-white/[0.065] bg-white/[0.018] px-4 py-3">

              <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />

              <span className="text-[9px] text-white/35">
                Trace complete
              </span>

            </div>

          </div>


          <div className="mt-9 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">

            <Metric
              icon={BrainCircuit}
              value={uniqueAgents}
              label="Agents"
            />

            <Metric
              icon={Cpu}
              value={traces.length}
              label="Inference calls"
            />

            <Metric
              icon={Clock3}
              value={`${(
                simulation.observatory
                  .summary
                  .total_latency_ms /
                1000
              ).toFixed(1)}s`}
              label="Cumulative latency"
            />

            <Metric
              icon={Network}
              value={
                simulation.observatory
                  .summary
                  .total_tokens
                  .toLocaleString()
              }
              label="Tokens"
            />

            <Metric
              icon={
                failedCalls > 0
                  ? TriangleAlert
                  : CheckCircle2
              }
              value={failedCalls}
              label="Failed calls"
            />

          </div>


          <div className="mt-10 flex items-center justify-between">

            <div>
              <div className="text-[9px] uppercase tracking-[0.16em] text-white/22">
                Execution trace
              </div>

              <div className="mt-1 text-[9px] text-white/15">
                Click any inference call to inspect it.
              </div>
            </div>

            <div className="text-[8px] text-white/18">
              {traces.length} events
            </div>

          </div>


          <div className="mt-4 space-y-2">

            {traces.map(
              (trace, index) => (
                <TraceRow
                  key={trace.id}
                  trace={trace}
                  index={index}
                  onClick={() =>
                    setSelectedTrace(
                      trace,
                    )
                  }
                />
              ),
            )}

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


function TraceRow({
  trace,
  index,
  onClick,
}: {
  trace: InferenceTrace;
  index: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="grid w-full gap-4 rounded-[16px] border border-white/[0.065] bg-white/[0.018] p-4 text-left transition hover:border-white/[0.11] hover:bg-white/[0.03] lg:grid-cols-[40px_1.3fr_1fr_0.7fr_100px_100px] lg:items-center"
    >

      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-[8px] text-white/22">
        {String(index + 1).padStart(
          2,
          "0",
        )}
      </div>


      <div>
        <div className="text-[10px] font-medium text-white/65">
          {trace.agent}
        </div>

        <div className="mt-1 max-w-[300px] truncate text-[8px] text-white/20">
          {trace.role}
        </div>
      </div>


      <Cell
        label="Stage"
        value={trace.stage}
      />


      <div>
        <div className="text-[8px] uppercase tracking-[0.12em] text-white/17">
          Tier
        </div>

        <div className="mt-1.5 flex items-center gap-2">
          <TierDot
            tier={trace.tier}
          />

          <span className="text-[9px] capitalize text-white/40">
            {trace.tier}
          </span>
        </div>
      </div>


      <Cell
        label="Latency"
        value={`${trace.latency_ms} ms`}
      />

      <Cell
        label="Tokens"
        value={
          trace.usage
            .total_tokens
            .toLocaleString()
        }
      />

    </button>
  );
}


function Cell({
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

      <div className="mt-1.5 truncate text-[9px] text-white/38">
        {value}
      </div>

    </div>
  );
}


function TierDot({
  tier,
}: {
  tier: string;
}) {
  return (
    <div
      className={[
        "h-1.5 w-1.5 rounded-full",
        tier === "ultra"
          ? "bg-[var(--accent)]"
          : tier === "super"
            ? "bg-white/70"
            : tier === "nano"
              ? "bg-white/45"
              : "bg-white/25",
      ].join(" ")}
    />
  );
}


function Metric({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-[16px] border border-white/[0.065] bg-white/[0.018] p-4">

      <Icon
        size={13}
        className="text-white/25"
      />

      <div className="mt-4 text-[19px] font-light text-white/75">
        {value}
      </div>

      <div className="mt-1 text-[8px] uppercase tracking-[0.13em] text-white/18">
        {label}
      </div>

    </div>
  );
}


function EmptyState() {
  return (
    <div className="flex h-[calc(100vh-72px)] items-center justify-center">

      <div className="text-center">

        <BrainCircuit
          size={24}
          className="mx-auto text-white/15"
        />

        <div className="mt-4 text-[11px] text-white/40">
          No agent trace available
        </div>

        <div className="mt-2 text-[9px] text-white/20">
          Run a decision simulation first.
        </div>

      </div>

    </div>
  );
}