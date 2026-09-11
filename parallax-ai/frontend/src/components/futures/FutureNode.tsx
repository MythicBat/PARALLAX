"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";

import type {
  FutureScenario,
} from "@/types/simulation";


type FutureNodeData = {
  future: FutureScenario;
  selected?: boolean;
};


function getScenarioLabel(
  type: FutureScenario["scenario_type"],
) {
  switch (type) {
    case "best_case":
      return "BEST CASE";

    case "base_case":
      return "BASE CASE";

    case "worst_case":
      return "WORST CASE";
  }
}


function ScenarioIcon({
  type,
}: {
  type: FutureScenario["scenario_type"];
}) {
  switch (type) {
    case "best_case":
      return <Sparkles size={13} className="text-white/55" />;

    case "base_case":
      return <ShieldCheck size={13} className="text-white/55" />;

    case "worst_case":
      return <AlertTriangle size={13} className="text-white/55" />;
  }
}


export function FutureNode({
  data,
}: NodeProps) {
  const nodeData =
    data as unknown as FutureNodeData;

  const future = nodeData.future;

  return (
    <div
      className={[
        "w-[260px] rounded-[18px] border bg-[#090b0f]/95 p-4 backdrop-blur-2xl transition-all",
        nodeData.selected
          ? "border-[var(--accent)]/45 shadow-[0_0_40px_rgba(140,255,181,0.08)]"
          : "border-white/[0.09] hover:border-white/[0.18]",
      ].join(" ")}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-0 !bg-white/20"
      />

      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-0 !bg-[var(--accent)]/40"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03]">
            <ScenarioIcon type={future.scenario_type} />
          </div>

          <span className="text-[9px] font-medium tracking-[0.16em] text-white/30">
            {getScenarioLabel(
              future.scenario_type,
            )}
          </span>
        </div>

        <ArrowUpRight
          size={13}
          className="text-white/20"
        />
      </div>

      <h3 className="mt-4 text-[13px] font-medium leading-5 text-white/85">
        {future.title}
      </h3>

      <p className="mt-2 line-clamp-3 text-[10px] leading-5 text-white/35">
        {future.narrative}
      </p>

      <div className="mt-4 flex items-end justify-between border-t border-white/[0.055] pt-3">
        <div>
          <div className="text-[8px] uppercase tracking-[0.13em] text-white/20">
            Robustness
          </div>

          <div className="mt-1 text-lg font-light text-white">
            {Math.round(
              future.robustness_score,
            )}
          </div>
        </div>

        <div className="w-[110px]">
          <div className="h-1 overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className="h-full rounded-full bg-[var(--accent)]"
              style={{
                width: `${future.robustness_score}%`,
              }}
            />
          </div>

          <div className="mt-2 text-right text-[8px] text-white/20">
            / 100
          </div>
        </div>
      </div>
    </div>
  );
}