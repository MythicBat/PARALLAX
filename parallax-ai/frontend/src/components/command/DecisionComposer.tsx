"use client";

import {
  ArrowUp,
  FilePlus2,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { simulateDecision } from "@/lib/api";
import { useParallaxStore } from "@/store/parallax-store";
import type {
  DecisionOption,
  DecisionRequest,
} from "@/types/decision";

export function DecisionComposer() {
  const [question, setQuestion] =
    useState("");

  const [options, setOptions] =
    useState<DecisionOption[]>([
      {
        name: "",
        description: "",
      },
      {
        name: "",
        description: "",
      },
    ]);

  const [
    advancedOpen,
    setAdvancedOpen,
  ] = useState(false);

  const [goals, setGoals] = useState("");

  const [constraints, setConstraints] =
    useState("");

  const setSimulation =
    useParallaxStore(
      (state) => state.setSimulation,
    );

  const setRunning =
    useParallaxStore(
      (state) =>
        state.setSimulationRunning,
    );

  const setError =
    useParallaxStore(
      (state) =>
        state.setSimulationError,
    );

  function updateOption(
    index: number,
    field: keyof DecisionOption,
    value: string,
  ) {
    setOptions((current) =>
      current.map((option, i) =>
        i === index
          ? {
              ...option,
              [field]: value,
            }
          : option,
      ),
    );
  }

  function addOption() {
    if (options.length >= 8) return;

    setOptions((current) => [
      ...current,
      {
        name: "",
        description: "",
      },
    ]);
  }

  function removeOption(index: number) {
    if (options.length <= 2) return;

    setOptions((current) =>
      current.filter(
        (_, i) => i !== index,
      ),
    );
  }

  async function launchSimulation() {
    if (!question.trim()) {
      setError(
        "Describe the decision first.",
      );
      return;
    }

    const validOptions = options.filter(
      (option) => option.name.trim(),
    );

    if (validOptions.length < 2) {
      setError(
        "Add at least two decision options.",
      );
      return;
    }

    const payload: DecisionRequest = {
      question: question.trim(),

      options: validOptions,

      goals: goals
        .split("\n")
        .map((value) => value.trim())
        .filter(Boolean),

      constraints: constraints
        .split("\n")
        .map((value) => value.trim())
        .filter(Boolean),
    };

    try {
      setError(null);
      setRunning(true);

      const result =
        await simulateDecision(payload);

      setSimulation(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Simulation failed.",
      );
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="parallax-shadow glass overflow-hidden rounded-[22px]">
      <div className="border-b border-white/[0.065] p-6">
        <div className="mb-5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
          <Sparkles
            size={13}
            className="text-[var(--accent)]"
          />

          New simulation
        </div>

        <textarea
          value={question}
          onChange={(event) =>
            setQuestion(
              event.target.value,
            )
          }
          placeholder="What decision are we exploring?"
          rows={2}
          className="w-full resize-none bg-transparent text-[23px] font-light leading-8 text-white outline-none placeholder:text-white/20"
        />
      </div>

      <div className="space-y-3 p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/30">
            Decision paths
          </span>

          <span className="text-[10px] text-white/20">
            2–8 options
          </span>
        </div>

        {options.map(
          (option, index) => (
            <div
              key={index}
              className="group flex items-start gap-3 rounded-xl border border-white/[0.065] bg-black/20 p-3 transition focus-within:border-white/[0.16] focus-within:bg-white/[0.025]"
            >
              <div className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/[0.08] text-[9px] text-white/35">
                {String.fromCharCode(
                  65 + index,
                )}
              </div>

              <div className="flex-1">
                <input
                  value={option.name}
                  onChange={(event) =>
                    updateOption(
                      index,
                      "name",
                      event.target.value,
                    )
                  }
                  placeholder={`Option ${String.fromCharCode(
                    65 + index,
                  )}`}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                />

                <input
                  value={
                    option.description
                  }
                  onChange={(event) =>
                    updateOption(
                      index,
                      "description",
                      event.target.value,
                    )
                  }
                  placeholder="Optional context"
                  className="mt-1.5 w-full bg-transparent text-[11px] text-white/45 outline-none placeholder:text-white/15"
                />
              </div>

              {options.length > 2 && (
                <button
                  onClick={() =>
                    removeOption(index)
                  }
                  className="mt-1 opacity-0 text-white/25 transition hover:text-red-300 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ),
        )}

        <button
          onClick={addOption}
          disabled={options.length >= 8}
          className="flex items-center gap-2 px-2 py-2 text-[11px] text-white/35 transition hover:text-white/70 disabled:opacity-20"
        >
          <Plus size={13} />
          Add decision path
        </button>
      </div>

      <div className="border-t border-white/[0.06] px-6 py-4">
        <button
          onClick={() =>
            setAdvancedOpen(
              !advancedOpen,
            )
          }
          className="flex items-center gap-2 text-[11px] text-white/35 transition hover:text-white/70"
        >
          <SlidersHorizontal size={13} />

          Goals & constraints
        </button>

        {advancedOpen && (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <textarea
              value={goals}
              onChange={(event) =>
                setGoals(
                  event.target.value,
                )
              }
              placeholder={
                "Goals\nBuild AI expertise\nIncrease financial stability"
              }
              rows={4}
              className="rounded-xl border border-white/[0.065] bg-black/20 p-3 text-[11px] text-white/70 outline-none placeholder:text-white/20 focus:border-white/[0.15]"
            />

            <textarea
              value={constraints}
              onChange={(event) =>
                setConstraints(
                  event.target.value,
                )
              }
              placeholder={
                "Constraints\nMust remain in Melbourne\nCannot tolerate extended unemployment"
              }
              rows={4}
              className="rounded-xl border border-white/[0.065] bg-black/20 p-3 text-[11px] text-white/70 outline-none placeholder:text-white/20 focus:border-white/[0.15]"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.015] px-6 py-4">
        <div className="flex gap-2">
          <button className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.07] px-3 text-[10px] text-white/35 transition hover:bg-white/[0.04] hover:text-white/70">
            <FilePlus2 size={13} />
            Attach context
          </button>
        </div>

        <button
          onClick={launchSimulation}
          className="group flex h-10 items-center gap-3 rounded-xl bg-[var(--accent)] px-4 text-[11px] font-medium text-black transition hover:brightness-110"
        >
          Simulate futures

          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-black/10">
            <ArrowUp
              size={12}
              className="transition-transform group-hover:-translate-y-0.5"
            />
          </span>
        </button>
      </div>
    </div>
  );
}