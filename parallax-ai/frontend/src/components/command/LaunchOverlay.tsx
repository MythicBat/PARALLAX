"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  GitBranch,
  Network,
  Radar,
  Scale,
  Sparkles,
} from "lucide-react";

import { useParallaxStore } from "@/store/parallax-store";

const stages = [
  {
    icon: BrainCircuit,
    label: "Architecting decision",
  },
  {
    icon: Network,
    label: "Deploying agent society",
  },
  {
    icon: Radar,
    label: "Stress-testing assumptions",
  },
  {
    icon: Scale,
    label: "Convening AI jury",
  },
  {
    icon: GitBranch,
    label: "Simulating futures",
  },
];

export function LaunchOverlay() {
  const running =
    useParallaxStore(
      (state) =>
        state.simulationRunning,
    );

  if (!running) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050608]/90 backdrop-blur-2xl"
    >
      <div className="relative w-full max-w-[520px] px-8">
        <motion.div
          initial={{
            scale: 0.85,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            duration: 0.45,
          }}
          className="mx-auto mb-10 flex h-16 w-16 items-center justify-center rounded-[20px] border border-[var(--accent)]/20 bg-[var(--accent)]/[0.07]"
        >
          <Sparkles
            size={24}
            className="text-[var(--accent)]"
          />
        </motion.div>

        <div className="text-center">
          <h2 className="text-2xl font-light text-white">
            Simulation in progress
          </h2>

          <p className="mt-2 text-xs text-white/35">
            PARALLAX is constructing competing
            futures.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {stages.map(
            (stage, index) => {
              const Icon = stage.icon;

              return (
                <motion.div
                  key={stage.label}
                  initial={{
                    opacity: 0,
                    x: -12,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay:
                      0.25 +
                      index * 0.16,
                  }}
                  className="flex items-center gap-4 rounded-xl border border-white/[0.055] bg-white/[0.02] px-4 py-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-white/45">
                    <Icon size={14} />
                  </div>

                  <span className="text-[11px] text-white/55">
                    {stage.label}
                  </span>

                  <motion.div
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
                    animate={{
                      opacity: [
                        0.25,
                        1,
                        0.25,
                      ],
                    }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      delay:
                        index * 0.2,
                    }}
                  />
                </motion.div>
              );
            },
          )}
        </div>

        <div className="mt-8 overflow-hidden rounded-full bg-white/[0.04]">
          <motion.div
            className="h-[2px] bg-[var(--accent)]"
            initial={{
              width: "2%",
            }}
            animate={{
              width: [
                "5%",
                "38%",
                "67%",
                "88%",
              ],
            }}
            transition={{
              duration: 14,
              ease: "easeOut",
            }}
          />
        </div>

        <p className="mt-4 text-center text-[9px] tracking-[0.14em] text-white/20">
          NVIDIA NEMOTRON × NEBIUS TOKEN FACTORY
        </p>
      </div>
    </motion.div>
  );
}