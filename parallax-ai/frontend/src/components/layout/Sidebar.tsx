"use client";

import {
  BrainCircuit,
  CircleGauge,
  GitBranch,
  History,
  Network,
  Radar,
  Settings,
  Sparkles,
} from "lucide-react";

import { Logo } from "@/components/shared/Logo";

import { usePathname, useRouter } from "next/navigation";
import { useParallaxStore } from "@/store/parallax-store";

const mainItems = [
  {
    icon: Sparkles,
    label: "Command",
    href: "/",
  },
  {
    icon: GitBranch,
    label: "Futures",
    href: "/futures",
  },
  {
    icon: Radar,
    label: "Stress Lab",
    href: "/futures",
    panel: "stress",
  },
  {
    icon: Network,
    label: "Agents",
    href: "/agents",
  },
  {
    icon: CircleGauge,
    label: "Models",
    href: "/models",
  },
  {
    icon: BrainCircuit,
    label: "Memory",
    href: "/memory",
  },
  {
    icon: History,
    label: "History",
    href: "/history",
  },
];

export function Sidebar() {
  const router = useRouter();

  const pathname = usePathname();

  const setActiveWorkspacePanel = useParallaxStore((state) => state.setActiveWorkspacePanel);

  return (
    <aside className="fixed bottom-0 left-0 top-0 z-40 flex w-[76px] flex-col items-center border-r border-white/[0.07] bg-black/25 py-5 backdrop-blur-xl">
      <Logo compact />

      <div className="mt-10 flex flex-1 flex-col gap-2">
        {mainItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              title={item.label}
              onClick={() => {
                if (item.panel === "stress") {
                  setActiveWorkspacePanel("stress");
                }

                router.push(item.href);
              }}
              className={[
                "group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all",
                pathname === item.href
                  ? "bg-white/[0.08] text-white"
                  : "text-white/35 hover:bg-white/[0.045] hover:text-white/75",
              ].join(" ")}
            >
              {pathname === item.href && (
                <div className="absolute -left-[17px] h-5 w-[2px] rounded-full bg-[var(--accent)]" />
              )}

              <Icon size={18} strokeWidth={1.7} />
            </button>
          );
        })}
      </div>

      <button className="flex h-11 w-11 items-center justify-center rounded-xl text-white/35 transition hover:bg-white/[0.045] hover:text-white">
        <Settings size={18} />
      </button>
    </aside>
  );
}