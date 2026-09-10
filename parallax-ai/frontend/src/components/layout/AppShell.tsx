import { IntelligenceGrid } from "@/components/background/IntelligenceGrid";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <IntelligenceGrid />

      <Sidebar />

      <div className="relative ml-[76px] min-h-screen">
        <TopBar />

        <main>{children}</main>
      </div>
    </div>
  );
}