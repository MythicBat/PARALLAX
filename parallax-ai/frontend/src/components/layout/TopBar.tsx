"use client";

import {
  Bell,
  Command,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

import { getHealth } from "@/lib/api";

import { usePathname } from "next/navigation";

export function TopBar() {
  const [online, setOnline] =
    useState<boolean | null>(null);
  
  const pathname = usePathname();

  const page = pathname.startsWith("/futures") ? {
    title: "Future Canvas",
    subtitle: "Interactive decision simulation",
  } : {
    title: "Command Center",
    subtitle: "Decision intelligence workspace",
  };

  useEffect(() => {
    getHealth()
      .then(() => setOnline(true))
      .catch(() => setOnline(false));
  }, []);

  return (
    <header className="flex h-[72px] items-center justify-between border-b border-white/[0.06] px-8">
      <div className="flex items-center gap-4">
        <div>
          <div className="text-xs font-medium text-white/80">
            {page.title}
          </div>

          <div className="mt-1 text-[10px] text-white/30">
            {page.subtitle}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[10px] text-white/45 md:flex">
          <ShieldCheck
            size={13}
            className="text-[var(--accent)]"
          />
          Private workspace
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[10px] text-white/50">
          <span
            className={[
              "h-1.5 w-1.5 rounded-full",
              online === true
                ? "bg-[var(--accent)] shadow-[0_0_8px_rgba(140,255,181,0.7)]"
                : online === false
                  ? "bg-red-400"
                  : "bg-yellow-400",
            ].join(" ")}
          />

          {online === true
            ? "System online"
            : online === false
              ? "Backend offline"
              : "Checking"}
        </div>

        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] text-white/45 transition hover:bg-white/[0.05] hover:text-white">
          <Bell size={15} />
        </button>

        <button className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[10px] text-white/60 transition hover:bg-white/[0.07]">
          <Command size={13} />
          <span>⌘ K</span>
        </button>
      </div>
    </header>
  );
}