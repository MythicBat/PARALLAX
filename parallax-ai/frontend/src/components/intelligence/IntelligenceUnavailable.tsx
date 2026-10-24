
"use client";

import { AlertTriangle } from "lucide-react";

interface IntelligenceUnavailableProps {
  title: string;
  description?: string;
}

export function IntelligenceUnavailable({
  title,
  description = "This intelligence result is unavailable for the current simulation.",
}: IntelligenceUnavailableProps) {
  return (
    <div className="flex h-full min-h-[350px] items-center justify-center p-8">
      <div className="w-full max-w-md rounded-[20px] border border-white/[0.07] bg-white/[0.018] p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
          <AlertTriangle
            size={20}
            className="text-[var(--accent)]/60"
          />
        </div>

        <h2 className="mt-5 text-lg font-light text-white/80">
          {title}
        </h2>

        <p className="mt-3 text-[11px] leading-6 text-white/35">
          {description}
        </p>

        <div className="mt-5 text-[9px] uppercase tracking-[0.14em] text-white/20">
          Partial intelligence result
        </div>
      </div>
    </div>
  );
}
