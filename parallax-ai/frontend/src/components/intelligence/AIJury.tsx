"use client";

import {
  BrainCircuit,
  MessageSquareWarning,
  Scale,
  Users,
} from "lucide-react";

import { useParallaxStore } from "@/store/parallax-store";

import type {
  JuryVote,
} from "@/types/simulation";


export function AIJury() {
  const simulation =
    useParallaxStore(
      (state) => state.simulation,
    );

  if (!simulation) {
    return null;
  }

  const jury =
    simulation.jury.jury;

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="mx-auto max-w-[1180px]">

        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/65">
              <Scale size={13} />

              Independent deliberation
            </div>

            <h2 className="mt-3 text-[28px] font-light tracking-[-0.025em] text-white">
              AI Jury
            </h2>

            <p className="mt-3 max-w-[650px] text-[11px] leading-6 text-white/35">
              Independent reasoning agents evaluate the
              same decision separately so disagreement
              remains visible instead of being averaged
              away.
            </p>
          </div>


          <div className="grid grid-cols-2 gap-2">
            <Metric
              icon={Users}
              value={jury.votes.length}
              label="jurors"
            />

            <Metric
              icon={BrainCircuit}
              value={`${Math.round(
                jury.agreement_score,
              )}%`}
              label="agreement"
            />
          </div>
        </div>


        <div className="mt-9 grid gap-4 lg:grid-cols-[1fr_300px]">

          <div className="grid gap-4 md:grid-cols-2">
            {jury.votes.map(
              (vote, index) => (
                <JuryCard
                  key={`${vote.agent}-${index}`}
                  vote={vote}
                  index={index}
                />
              ),
            )}
          </div>


          <aside className="space-y-4">

            {jury.consensus_option && (
              <div className="rounded-[20px] border border-[var(--accent)]/15 bg-[var(--accent)]/[0.035] p-5">
                <div className="text-[8px] uppercase tracking-[0.14em] text-[var(--accent)]/50">
                  Jury consensus
                </div>

                <div className="mt-3 text-[18px] font-light text-white/80">
                  {jury.consensus_option}
                </div>

                <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="h-full rounded-full bg-[var(--accent)]"
                    style={{
                      width:
                        `${jury.agreement_score}%`,
                    }}
                  />
                </div>

                <div className="mt-2 text-[8px] text-white/20">
                  {Math.round(
                    jury.agreement_score,
                  )}
                  % agreement
                </div>
              </div>
            )}


            <div className="rounded-[20px] border border-white/[0.07] bg-white/[0.018] p-5">
              <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.14em] text-white/20">
                <MessageSquareWarning size={11} />
                Disagreement
              </div>

              <p className="mt-3 text-[9px] leading-5 text-white/35">
                {jury.disagreement_summary}
              </p>
            </div>


            {jury.minority_report && (
              <div className="rounded-[20px] border border-white/[0.07] bg-white/[0.018] p-5">
                <div className="text-[8px] uppercase tracking-[0.14em] text-white/20">
                  Minority report
                </div>

                <p className="mt-3 text-[9px] leading-5 text-white/35">
                  {jury.minority_report}
                </p>
              </div>
            )}

          </aside>
        </div>
      </div>
    </div>
  );
}


function JuryCard({
  vote,
  index,
}: {
  vote: JuryVote;
  index: number;
}) {
  return (
    <article className="rounded-[20px] border border-white/[0.07] bg-white/[0.018] p-5">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-[9px] text-white/35">
            {String(index + 1).padStart(
              2,
              "0",
            )}
          </div>

          <div>
            <div className="text-[10px] font-medium text-white/60">
              {vote.agent}
            </div>

            <div className="mt-1 text-[8px] text-white/20">
              Independent juror
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[8px] uppercase tracking-[0.12em] text-white/20">
            confidence
          </div>

          <div className="mt-1 text-[11px] text-white/55">
            {Math.round(
              vote.confidence,
            )}
            %
          </div>
        </div>
      </div>


      <div className="mt-5 rounded-xl border border-white/[0.055] bg-black/15 p-3">
        <div className="text-[8px] uppercase tracking-[0.13em] text-white/18">
          Supports
        </div>

        <div className="mt-1.5 text-[12px] text-[var(--accent)]/65">
          {vote.preferred_option}
        </div>
      </div>


      <p className="mt-4 text-[9px] leading-5 text-white/35">
        {vote.rationale}
      </p>


      <div className="mt-5 grid gap-2">
        <Reason
          title="Strongest argument"
          text={
            vote.strongest_argument
          }
        />

        <Reason
          title="Biggest concern"
          text={
            vote.biggest_concern
          }
        />
      </div>
    </article>
  );
}


function Reason({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="border-t border-white/[0.05] pt-3">
      <div className="text-[8px] uppercase tracking-[0.12em] text-white/18">
        {title}
      </div>

      <p className="mt-1.5 text-[9px] leading-4 text-white/28">
        {text}
      </p>
    </div>
  );
}


function Metric({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
}) {
  return (
    <div className="min-w-[105px] rounded-xl border border-white/[0.065] bg-white/[0.018] p-3">
      <Icon
        size={12}
        className="text-white/25"
      />

      <div className="mt-3 text-lg font-light text-white/75">
        {value}
      </div>

      <div className="mt-1 text-[8px] uppercase tracking-[0.12em] text-white/20">
        {label}
      </div>
    </div>
  );
}