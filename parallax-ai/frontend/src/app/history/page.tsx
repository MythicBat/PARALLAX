"use client";

import {
  Clock3,
  GitBranch,
  History,
  RotateCcw,
  Search,
  Trash2,
  Play,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  AppShell,
} from "@/components/layout/AppShell";

import {
  useHistoryStore,
} from "@/store/history-store";

import {
  useParallaxStore,
} from "@/store/parallax-store";


export default function HistoryPage() {
  const router =
    useRouter();

  const items =
    useHistoryStore(
      (state) => state.items,
    );

  const deleteItem =
    useHistoryStore(
      (state) =>
        state.deleteItem,
    );

  const clearHistory =
    useHistoryStore(
      (state) =>
        state.clearHistory,
    );

  const setSimulation =
    useParallaxStore(
      (state) =>
        state.setSimulation,
    );

  const setWorkspace =
    useParallaxStore(
      (state) =>
        state
          .setActiveWorkspacePanel,
    );

  const [query, setQuery] =
    useState("");


  const filtered =
    useMemo(() => {
      const normalized =
        query
          .trim()
          .toLowerCase();

      if (!normalized) {
        return items;
      }

      return items.filter(
        (item) => {
          const searchable = [
            item.question,
            ...item.optionNames,
            item.preferredOption ??
              "",
          ]
            .join(" ")
            .toLowerCase();

          return searchable.includes(
            normalized,
          );
        },
      );
    }, [items, query]);


  function openDecision(
    id: string,
  ) {
    const item =
      items.find(
        (candidate) =>
          candidate.id === id,
      );

    if (!item) {
      return;
    }

    setSimulation(
      item.simulation,
    );

    setWorkspace("canvas");

    router.push(
      "/futures",
    );
  }


  return (
    <AppShell>

      <div className="h-[calc(100vh-72px)] overflow-y-auto p-8">

        <div className="mx-auto max-w-[1180px]">

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div>

              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/65">
                <History size={13} />
                Decision archive
              </div>

              <h1 className="mt-3 text-[30px] font-light tracking-[-0.03em] text-white">
                History
              </h1>

              <p className="mt-3 max-w-[650px] text-[11px] leading-6 text-white/35">
                Reopen previous PARALLAX
                simulations without rerunning
                inference.
              </p>

            </div>


            {items.length > 0 && (
              <button
                onClick={
                  clearHistory
                }
                className="flex items-center gap-2 rounded-lg border border-white/[0.06] px-3 py-2 text-[8px] text-white/22 transition hover:border-red-400/20 hover:text-red-300/60"
              >
                <Trash2 size={11} />
                Clear history
              </button>
            )}

          </div>


          <div className="relative mt-8 max-w-[440px]">

            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20"
            />

            <input
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target.value,
                )
              }
              placeholder="Search decisions or options..."
              className="w-full rounded-xl border border-white/[0.065] bg-white/[0.018] py-3 pl-9 pr-4 text-[10px] text-white/60 outline-none placeholder:text-white/18 focus:border-white/[0.12]"
            />

          </div>


          {items.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="mt-8 space-y-3">

              {filtered.map(
                (item) => (
                  <article
                    key={item.id}
                    className="group rounded-[18px] border border-white/[0.065] bg-white/[0.018] p-5 transition hover:border-white/[0.11] hover:bg-white/[0.026]"
                  >

                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-2 text-[8px] text-white/18">
                          <Clock3
                            size={10}
                          />

                          {formatDate(
                            item.createdAt,
                          )}
                        </div>


                        <h2 className="mt-3 max-w-[700px] truncate text-[13px] font-medium text-white/65">
                          {item.title}
                        </h2>


                        <div className="mt-3 flex flex-wrap gap-1.5">

                          {item.optionNames.map(
                            (
                              option,
                              index,
                            ) => (
                              <span
                                key={`${option}-${index}`}
                                className="rounded-md border border-white/[0.05] bg-black/10 px-2 py-1 text-[8px] text-white/24"
                              >
                                {option}
                              </span>
                            ),
                          )}

                        </div>


                        {item.preferredOption && (
                          <div className="mt-4 flex items-center gap-2">

                            <GitBranch
                              size={10}
                              className="text-[var(--accent)]/40"
                            />

                            <span className="text-[8px] text-white/20">
                              Current preference
                            </span>

                            <span className="text-[9px] text-[var(--accent)]/55">
                              {
                                item.preferredOption
                              }
                            </span>

                          </div>
                        )}

                      </div>


                      <div className="flex shrink-0 items-center gap-2">

                        {item.request && (
                          <button
                            onClick={() => router.push(`/history/${item.id}`)}
                            className="flex items-center gap-2 rounded-lg border border-white/[0.065] bg-white/[0.018] px-3 py-2 text-[8px] text-white/35 transition hover:border-[var(--accent)]/15 hover:text-[var(--accent)]/60"
                          >
                            <Play size={10} />
                            Replay
                          </button> 
                        )}

                        <button
                          onClick={() =>
                            openDecision(
                              item.id,
                            )
                          }
                          className="flex items-center gap-2 rounded-lg border border-[var(--accent)]/10 bg-[var(--accent)]/[0.035] px-3 py-2 text-[8px] text-[var(--accent)]/60 transition hover:bg-[var(--accent)]/[0.06]"
                        >
                          <RotateCcw
                            size={11}
                          />

                          Open simulation
                        </button>


                        <button
                          onClick={() =>
                            deleteItem(
                              item.id,
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.055] text-white/18 transition hover:border-red-400/20 hover:text-red-300/60"
                          aria-label="Delete history item"
                        >
                          <Trash2
                            size={11}
                          />
                        </button>

                      </div>

                    </div>

                  </article>
                ),
              )}

            </div>
          )}


          {items.length > 0 &&
            filtered.length ===
              0 && (
              <div className="mt-16 text-center text-[10px] text-white/20">
                No decisions match
                &quot;{query}&quot;.
              </div>
            )}

        </div>

      </div>

    </AppShell>
  );
}


function formatDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(
    new Date(value),
  );
}


function EmptyState() {
  return (
    <div className="mt-20 text-center">

      <History
        size={25}
        className="mx-auto text-white/12"
      />

      <div className="mt-4 text-[11px] text-white/38">
        No decisions yet
      </div>

      <div className="mt-2 text-[9px] text-white/18">
        Completed simulations will
        appear here automatically.
      </div>

    </div>
  );
}