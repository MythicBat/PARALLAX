import type {
  Edge,
  Node,
} from "@xyflow/react";

import type {
  FutureSimulationPayload,
} from "@/types/simulation";


export function buildFutureGraph(
  question: string,
  futures: FutureSimulationPayload,
) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const rootId = "decision-root";

  nodes.push({
    id: rootId,
    type: "decision",
    position: {
      x: 0,
      y: 300,
    },
    data: {
      question,
    },
  });

  const optionSpacing = 420;
  const futureSpacing = 210;

  futures.simulation.simulations.forEach(
    (optionSimulation, optionIndex) => {
      const optionId =
        `option-${optionIndex}`;

      const optionY =
        optionIndex * optionSpacing;

      nodes.push({
        id: optionId,
        type: "option",
        position: {
          x: 430,
          y: optionY + 160,
        },
        data: {
          label: optionSimulation.option,
          index: optionIndex,
        },
      });

      edges.push({
        id: `${rootId}-${optionId}`,
        source: rootId,
        target: optionId,
        animated: true,
        style: {
          stroke:
            "rgba(255,255,255,0.13)",
          strokeWidth: 1.2,
        },
      });

      optionSimulation.futures.forEach(
        (future, futureIndex) => {
          const nodeId = future.id;

          nodes.push({
            id: nodeId,
            type: "future",
            position: {
              x: 820,
              y:
                optionY +
                futureIndex *
                  futureSpacing,
            },
            data: {
              future,
            },
          });

          edges.push({
            id:
              `${optionId}-${nodeId}`,

            source:
              optionId,

            target:
              nodeId,

            animated:
              future.scenario_type ===
              "base_case",

            style: {
              stroke:
                future.scenario_type ===
                "best_case"
                  ? "rgba(140,255,181,0.26)"
                  : future.scenario_type ===
                      "worst_case"
                    ? "rgba(255,120,120,0.20)"
                    : "rgba(255,255,255,0.14)",

              strokeWidth:
                future.scenario_type ===
                "base_case"
                  ? 1.5
                  : 1,
            },
          });
        },
      );
    },
  );

  return {
    nodes,
    edges,
  };
}