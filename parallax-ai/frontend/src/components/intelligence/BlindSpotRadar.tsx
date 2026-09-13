"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  EyeOff,
  Radar,
} from "lucide-react";

import { useParallaxStore } from "@/store/parallax-store";

import type {
  BlindSpot,
} from "@/types/simulation";


export function BlindSpotRadar() {
  const simulation =
    useParallaxStore(
      (state) =>
        state.simulation,
    );

  if (!simulation) {
    return null;
  }

  const blindSpots =
    simulation.blind_spots
      .report.blind_spots;

  const critical =
    blindSpots.filter(
      (item) =>
        item.severity ===
        "critical",
    ).length;

  const high =
    blindSpots.filter(
      (item) =>
        item.severity ===
        "high",
    ).length;

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/65">
              <Radar size={13} />

              Adversarial discovery
            </div>

            <h2 className="mt-3 text-[28px] font-light tracking-[-0.025em] text-white">
              Blind Spot Radar
            </h2>

            <p className="mt-3 max-w-[640px] text-[11px] leading-6 text-white/35">
              Factors that may materially alter
              the decision but are easy to miss
              during normal analysis.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Metric
              value={
                blindSpots.length
              }
              label="detected"
            />

            <Metric
              value={high}
              label="high risk"
            />

            <Metric
              value={critical}
              label="critical"
            />
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {blindSpots.map(
            (
              blindSpot,
              index,
            ) => (
              <BlindSpotCard
                key={
                  blindSpot.id
                }
                blindSpot={
                  blindSpot
                }
                index={index}
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
}


function BlindSpotCard({
  blindSpot,
  index,
}: {
  blindSpot: BlindSpot;
  index: number;
}) {
  return (
    <article className="group relative overflow-hidden rounded-[20px] border border-white/[0.07] bg-white/[0.018] p-5 transition hover:border-white/[0.13] hover:bg-white/[0.028]">
      <div className="absolute right-4 top-3 text-[34px] font-light text-white/[0.025]">
        {String(
          index + 1,
        ).padStart(
          2,
          "0",
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
          {blindSpot.severity ===
          "critical" ? (
            <AlertTriangle
              size={14}
              className="text-red-300/60"
            />
          ) : (
            <EyeOff
              size={14}
              className="text-white/40"
            />
          )}
        </div>

        <SeverityBadge
          severity={
            blindSpot.severity
          }
        />
      </div>

      <h3 className="mt-5 pr-7 text-[13px] font-medium leading-5 text-white/75">
        {blindSpot.title}
      </h3>

      <p className="mt-3 text-[10px] leading-5 text-white/35">
        {
          blindSpot.explanation
        }
      </p>

      <div className="mt-5 border-t border-white/[0.055] pt-4">
        <div className="text-[8px] uppercase tracking-[0.13em] text-white/20">
          Why this matters
        </div>

        <p className="mt-2 text-[9px] leading-5 text-white/30">
          {
            blindSpot.why_it_matters
          }
        </p>
      </div>

      {!!blindSpot
        .affected_options
        .length && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {blindSpot
            .affected_options
            .map(
              (option) => (
                <span
                  key={option}
                  className="rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-1 text-[8px] text-white/25"
                >
                  {option}
                </span>
              ),
            )}
        </div>
      )}

      <button className="mt-5 flex items-center gap-2 text-[9px] text-[var(--accent)]/60 transition group-hover:text-[var(--accent)]">
        Investigate blind spot
        <ArrowUpRight size={11} />
      </button>

      <div className="mt-3 rounded-lg border border-white/[0.055] bg-black/15 p-3">
        <div className="text-[8px] uppercase tracking-[0.12em] text-white/20">
          Validation action
        </div>

        <p className="mt-1.5 text-[9px] leading-4 text-white/30">
          {
            blindSpot.validation_action
          }
        </p>
      </div>
    </article>
  );
}


function Metric({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="min-w-[90px] rounded-xl border border-white/[0.065] bg-white/[0.018] p-3">
      <div className="text-lg font-light text-white/75">
        {value}
      </div>

      <div className="mt-1 text-[8px] uppercase tracking-[0.12em] text-white/20">
        {label}
      </div>
    </div>
  );
}


function SeverityBadge({
  severity,
}: {
  severity: BlindSpot["severity"];
}) {
  const className = {
    low:
      "text-white/25",

    medium:
      "text-yellow-100/50",

    high:
      "text-orange-200/65",

    critical:
      "text-red-300/70",
  }[severity];

  return (
    <span
      className={`text-[8px] uppercase tracking-[0.13em] ${className}`}
    >
      {severity}
    </span>
  );
}