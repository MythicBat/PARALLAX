"use client";

import {
    ArrowLeft,
    RotateCcw,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { FutureCanvas } from "@/components/futures/FutureCanvas";
import { AppShell } from "@/components/layout/AppShell";

export default function FuturesPage() {
    const router = useRouter();

    return (
        <AppShell>
            <div className="relative">
                <div className="absolute left-6 top-4 z-30 flex items-center gap-2">
                    <button
                        onClick={() => router.push("/")}
                        className="flex h-8 items-center gap-2 rounded-lg border border-white/[0.07] bg-[#080a0e]/80 px-3 text-[9px] text-white/35 backdrop-blur-xl transition hover:text-white"
                    >
                        <ArrowLeft size={12} />
                        Command
                    </button>

                    <button className="flex h-8 items-center gap-2 rounded-lg border border-white/[0.07] bg-[#080a0e]/80 px-3 text-[9px] text-white/35 backdrop-blur-xl transition hover:text-white">
                        <RotateCcw size={12} />
                        Re-run
                    </button>
                </div>

                <FutureCanvas />
            </div>
        </AppShell>
    );
}