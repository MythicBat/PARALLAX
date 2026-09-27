"use client";

import {
  Activity,
  Clock3,
  Cpu,
  Gauge,
  Layers3,
  X,
} from "lucide-react";

import type {
  InferenceTrace,
} from "@/types/observability";


export function TraceInspector({
  trace,
  onClose,
}: {
  trace: InferenceTrace | null;
  onClose: () => void;
}) {
  if (!trace) {
    return null;
  }

  return (
    <aside className="fixed bottom-4 right-4 top-[88px] z-[80] w-[390px] overflow-y-auto rounded-[22px] border border-white/[0.09] bg-[#080a0e]/95 p-5 shadow-2xl backdrop-blur-2xl">

      <div className="flex items-start justify-between gap-4">

        <div>
          <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.16em] text-[var(--accent)]/50">
            <Activity size={11} />
            Inference trace
          </div>

          <h2 className="mt-2 text-[17px] font-light text-white/80">
            {trace.agent}
          </h2>

          <p className="mt-1 text-[9px] text-white/25">
            {trace.stage}
          </p>
        </div>

        <button
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] text-white/25 transition hover:bg-white/[0.04] hover:text-white"
        >
          <X size={13} />
        </button>
      </div>


      <div className="mt-6 rounded-xl border border-white/[0.065] bg-white/[0.018] p-4">

        <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.13em] text-white/20">
          <Cpu size={11} />
          NVIDIA model
        </div>

        <p className="mt-3 break-all text-[10px] leading-5 text-white/50">
          {trace.model}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <TierBadge
            tier={trace.tier}
          />

          <StatusBadge
            status={trace.status}
          />
        </div>
      </div>


      <div className="mt-3 grid grid-cols-2 gap-2">

        <Metric
          icon={Clock3}
          label="Latency"
          value={`${trace.latency_ms.toLocaleString()} ms`}
        />

        <Metric
          icon={Layers3}
          label="Tokens"
          value={
            trace.usage.total_tokens
              .toLocaleString()
          }
        />

      </div>


      <div className="mt-3 rounded-xl border border-white/[0.065] bg-white/[0.018] p-4">

        <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.13em] text-white/20">
          <Gauge size={11} />
          Token usage
        </div>

        <div className="mt-4 space-y-3">

          <TokenRow
            label="Prompt"
            value={
              trace.usage.prompt_tokens
            }
          />

          <TokenRow
            label="Completion"
            value={
              trace.usage
                .completion_tokens
            }
          />

          <TokenRow
            label="Total"
            value={
              trace.usage.total_tokens
            }
          />

        </div>
      </div>


      <div className="mt-3 rounded-xl border border-white/[0.065] bg-white/[0.018] p-4">

        <div className="text-[8px] uppercase tracking-[0.13em] text-white/20">
          Assignment
        </div>

        <p className="mt-3 whitespace-pre-line text-[9px] leading-5 text-white/40">
          {trace.role}
        </p>

        <div className="mt-4 border-t border-white/[0.05] pt-3">

          <span className="text-[8px] text-white/20">
            Stage
          </span>

          <div className="mt-1 text-[9px] text-white/40">
            {trace.stage}
          </div>

        </div>
      </div>


      {trace.escalated && (
        <div className="mt-3 rounded-xl border border-[var(--accent)]/15 bg-[var(--accent)]/[0.035] p-4">

          <div className="text-[8px] uppercase tracking-[0.13em] text-[var(--accent)]/55">
            Model escalation
          </div>

          <p className="mt-2 text-[9px] leading-5 text-white/38">
            {trace.escalation_reason ??
              "The router escalated this task to a deeper reasoning tier."}
          </p>

        </div>
      )}

    </aside>
  );
}


function TierBadge({
  tier,
}: {
  tier: string;
}) {
  return (
    <span className="rounded-md border border-[var(--accent)]/10 bg-[var(--accent)]/[0.035] px-2 py-1 text-[8px] uppercase tracking-[0.1em] text-[var(--accent)]/60">
      {tier}
    </span>
  );
}


function StatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[8px] capitalize text-white/30">
      {status}
    </span>
  );
}


function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.065] bg-white/[0.018] p-4">

      <Icon
        size={12}
        className="text-white/25"
      />

      <div className="mt-3 text-[8px] uppercase tracking-[0.12em] text-white/18">
        {label}
      </div>

      <div className="mt-1 text-[11px] text-white/50">
        {value}
      </div>

    </div>
  );
}


function TokenRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-[9px] text-white/25">
        {label}
      </span>

      <span className="text-[9px] text-white/50">
        {value.toLocaleString()}
      </span>

    </div>
  );
}