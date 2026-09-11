"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Node,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import {
  useEffect,
  useMemo,
} from "react";

import { DecisionNode } from "@/components/futures/DecisionNode";
import { FutureInspector } from "@/components/futures/FutureInspector";
import { FutureNode } from "@/components/futures/FutureNode";
import { OptionNode } from "@/components/futures/OptionNode";

import { buildFutureGraph } from "@/lib/future-graph";

import { useParallaxStore } from "@/store/parallax-store";

import type {
  FutureScenario,
} from "@/types/simulation";


const nodeTypes = {
  decision: DecisionNode,
  option: OptionNode,
  future: FutureNode,
};


export function FutureCanvas() {
  const simulation =
    useParallaxStore(
      (state) => state.simulation,
    );

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

  const architecture =
    simulation?.architecture as
      | {
          architecture?: {
            core_question?: string;
          };
        }
      | undefined;

  const question =
    architecture
      ?.architecture
      ?.core_question ??
    "Current decision";

  const graph = useMemo(() => {
    if (!simulation) {
      return {
        nodes: [],
        edges: [],
      };
    }

    return buildFutureGraph(
      question,
      simulation.futures,
    );
  }, [
    simulation,
    question,
  ]);

  const [
    nodes,
    setNodes,
    onNodesChange,
  ] = useNodesState(graph.nodes);

  const [
    edges,
    setEdges,
    onEdgesChange,
  ] = useEdgesState(graph.edges);

  useEffect(() => {
    setNodes(graph.nodes);
    setEdges(graph.edges);
  }, [
    graph,
    setNodes,
    setEdges,
  ]);

  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (
          node.type !== "future"
        ) {
          return node;
        }

        const data =
          node.data as {
            future: FutureScenario;
          };

        return {
          ...node,
          data: {
            ...node.data,
            selected:
              selectedFuture?.id ===
              data.future.id,
          },
        };
      }),
    );
  }, [
    selectedFuture,
    setNodes,
  ]);

  if (!simulation) {
    return (
      <div className="flex h-[calc(100vh-72px)] items-center justify-center">
        <div className="text-center">
          <div className="text-sm text-white/55">
            No simulation loaded.
          </div>

          <div className="mt-2 text-[10px] text-white/25">
            Return to Command Center and
            simulate a decision first.
          </div>
        </div>
      </div>
    );
  }

  function handleNodeClick(
    _: React.MouseEvent,
    node: Node,
  ) {
    if (
      node.type !== "future"
    ) {
      return;
    }

    const data =
      node.data as {
        future: FutureScenario;
      };

    setSelectedFuture(
      data.future,
    );
  }

  return (
    <div className="relative h-[calc(100vh-72px)] w-full overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={
          onNodesChange
        }
        onEdgesChange={
          onEdgesChange
        }
        onNodeClick={
          handleNodeClick
        }
        fitView
        fitViewOptions={{
          padding: 0.22,
        }}
        minZoom={0.3}
        maxZoom={1.6}
        defaultEdgeOptions={{
          type: "bezier",
        }}
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Background
          variant={
            BackgroundVariant.Dots
          }
          gap={28}
          size={1}
          color="rgba(255,255,255,0.07)"
        />

        <Controls
          showInteractive={false}
          className="!border !border-white/[0.08] !bg-[#0a0c10]/90 !shadow-none [&>button]:!border-white/[0.06] [&>button]:!bg-transparent [&>button]:!fill-white/40"
        />

        <MiniMap
          pannable
          zoomable
          className="!border !border-white/[0.07] !bg-[#080a0e]/90"
          maskColor="rgba(0,0,0,0.60)"
          nodeColor="rgba(255,255,255,0.22)"
        />
      </ReactFlow>

      <CanvasHeader />

      <FutureInspector />
    </div>
  );
}


function CanvasHeader() {
  const simulation =
    useParallaxStore(
      (state) => state.simulation,
    );

  if (!simulation) return null;

  const futures =
    simulation.futures.simulation
      .simulations;

  const totalFutures =
    futures.reduce(
      (
        total,
        option,
      ) =>
        total +
        option.futures.length,
      0,
    );

  return (
    <div className="pointer-events-none absolute left-6 top-6 z-20">
      <div className="rounded-2xl border border-white/[0.07] bg-[#080a0e]/80 px-4 py-3 backdrop-blur-xl">
        <div className="text-[9px] uppercase tracking-[0.18em] text-white/25">
          Future Canvas
        </div>

        <div className="mt-2 flex items-center gap-4">
          <div>
            <div className="text-sm font-light text-white/75">
              {
                futures.length
              }{" "}
              paths
            </div>

            <div className="text-[9px] text-white/25">
              options
            </div>
          </div>

          <div className="h-7 w-px bg-white/[0.07]" />

          <div>
            <div className="text-sm font-light text-white/75">
              {
                totalFutures
              }
            </div>

            <div className="text-[9px] text-white/25">
              futures
            </div>
          </div>

          <div className="h-7 w-px bg-white/[0.07]" />

          <div>
            <div className="text-sm font-light text-[var(--accent)]">
              {
                simulation.team.length
              }
            </div>

            <div className="text-[9px] text-white/25">
              agents
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}