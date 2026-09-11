"use client";

import {
  ArrowRight,
  BrainCircuit,
  GitBranch,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { DecisionComposer } from "@/components/command/DecisionComposer";
import { LaunchOverlay } from "@/components/command/LaunchOverlay";
import { useParallaxStore } from "@/store/parallax-store";

const capabilities = [
  {
    icon: GitBranch,
    title: "Future simulation",
    text: "Explore best, base and downside branches.",
  },
  {
    icon: BrainCircuit,
    title: "Agent society",
    text: "Independent specialists reason in parallel.",
  },
  {
    icon: ShieldCheck,
    title: "Adversarial review",
    text: "Stress tests, blind spots and red-team analysis.",
  },
];

export function CommandCenter() {
  const error =
    useParallaxStore(
      (state) =>
        state.simulationError,
    );

  const simulation =
    useParallaxStore(
      (state) => state.simulation,
    );
  
  const router = useRouter();

  return (
    <>
      <LaunchOverlay />

      <div className="mx-auto max-w-[1180px] px-8 pb-20 pt-14">
        <motion.section
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <div className="mb-3 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--accent)]/70">
            <Zap size={12} />

            Decision intelligence
          </div>

          <h1 className="max-w-[850px] text-[46px] font-light leading-[1.12] tracking-[-0.035em] text-white">
            Don&apos;t ask AI what to do.
            <br />

            <span className="text-gradient">
              See the futures first.
            </span>
          </h1>

          <p className="mt-5 max-w-[610px] text-[13px] leading-6 text-white/38">
            PARALLAX simulates competing
            outcomes, challenges assumptions,
            exposes blind spots and identifies
            what could change your decision.
          </p>
        </motion.section>

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
            duration: 0.55,
          }}
          className="mt-10"
        >
          <DecisionComposer />
        </motion.div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-400/15 bg-red-400/[0.05] px-4 py-3 text-[11px] text-red-200/70">
            {error}
          </div>
        )}

        {simulation && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-5 flex items-center justify-between rounded-xl border border-[var(--accent)]/15 bg-[var(--accent)]/[0.04] px-5 py-4"
          >
            <div>
              <div className="flex items-center gap-2 text-xs text-white/80">
                <Sparkles
                  size={14}
                  className="text-[var(--accent)]"
                />

                Simulation complete
              </div>

              <div className="mt-1 text-[10px] text-white/30">
                Your future map is ready.
              </div>
            </div>

            <button
              onClick={() => router.push("/futures")} 
              className="flex items-center gap-2 text-[11px] text-[var(--accent)]">
                Open Future Canvas
                <ArrowRight size={13} />
            </button>
          </motion.div>
        )}

        <section className="mt-16">
          <div className="mb-5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
            Inside every simulation
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {capabilities.map(
              (capability, index) => {
                const Icon =
                  capability.icon;

                return (
                  <motion.div
                    key={
                      capability.title
                    }
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        0.2 +
                        index * 0.08,
                    }}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.018] p-5 transition hover:border-white/[0.11] hover:bg-white/[0.03]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03]">
                      <Icon
                        size={15}
                        className="text-white/55"
                      />
                    </div>

                    <h3 className="mt-5 text-xs font-medium text-white/75">
                      {capability.title}
                    </h3>

                    <p className="mt-2 text-[10px] leading-5 text-white/30">
                      {capability.text}
                    </p>
                  </motion.div>
                );
              },
            )}
          </div>
        </section>
      </div>
    </>
  );
}