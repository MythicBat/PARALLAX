"use client";

import { GitBranch } from "lucide-react";
import {
    Handle,
    Position,
    type NodeProps
} from "@xyflow/react";

type DecisionNodeData = {
    question: string;
};

export function DecisionNode({
    data,
}: NodeProps) {
    const nodeData = data as unknown as DecisionNodeData;

    return (
        <div className="w-[280px] rounded-[20px] border border-[var(--accent)]/25 bg-[var(--accent)]/[0.055] p-5 shadow-[0_0_50px_rgba(140,255,181,0.05)] backdrop-blur-xl">
            <Handle
                type="source"
                position={Position.Right}
                className="!h-2.5 !w-2.5 !border-0 !bg-[var(--accent)]"
            />

            <div className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]/70">
                <GitBranch size={13} />
                Decision origin
            </div>

            <div className="mt-4 text-[15px] font-light leading-6 text-white/90">
                {nodeData.question}
            </div>

            <div className="mt-5 border-t border-white/[0.07] pt-3 text-[9px] text-white/25">
                Branching from current context
            </div>
        </div>
    );
}