export function Logo({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-9 w-9 items-center justify-center">
        <div className="absolute inset-0 rotate-45 rounded-[10px] border border-white/20" />

        <div className="absolute h-4 w-4 rotate-45 rounded-[4px] bg-[var(--accent)] shadow-[0_0_28px_rgba(140,255,181,0.35)]" />

        <div className="absolute h-1.5 w-1.5 rounded-full bg-black" />
      </div>

      {!compact && (
        <div>
          <div className="text-[13px] font-semibold tracking-[0.24em] text-white">
            PARALLAX
          </div>

          <div className="mt-0.5 text-[9px] tracking-[0.16em] text-white/35">
            DECISION INTELLIGENCE
          </div>
        </div>
      )}
    </div>
  );
}