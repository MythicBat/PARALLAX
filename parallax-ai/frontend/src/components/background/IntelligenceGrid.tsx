export function IntelligenceGrid() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="grid-mask absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(255,255,255,0.045) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.045) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="absolute left-1/2 top-[-260px] h-[550px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-400/[0.035] blur-[120px]" />
    </div>
  );
}