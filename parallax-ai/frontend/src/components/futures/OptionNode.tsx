"use client";

import {
  Route,
} from "lucide-react";

import {
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";


type OptionNodeData = {
  label: string;
  index: number;
};


export function OptionNode({
  data,
}: NodeProps) {
  const nodeData =
    data as unknown as OptionNodeData;

  return (
    <div className="w-[220px] rounded-[16px] border border-white/[0.09] bg-[#080a0e]/95 p-4 backdrop-blur-xl">
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-0 !bg-white/25"
      />

      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-0 !bg-white/25"
      />

      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-[9px] text-white/35">
          {String.fromCharCode(
            65 + nodeData.index,
          )}
        </div>

        <Route
          size={13}
          className="text-white/30"
        />
      </div>

      <div className="mt-4 text-[12px] font-medium text-white/75">
        {nodeData.label}
      </div>

      <div className="mt-2 text-[9px] text-white/25">
        3 simulated futures
      </div>
    </div>
  );
}