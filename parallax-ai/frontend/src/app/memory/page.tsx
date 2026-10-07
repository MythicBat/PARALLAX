"use client";

import {
  Brain,
  CircleAlert,
  Database,
  GitBranch,
  Layers3,
} from "lucide-react";

import {
  useMemo,
} from "react";

import {
  AppShell,
} from "@/components/layout/AppShell";

import {
  useHistoryStore,
} from "@/store/history-store";


export default function MemoryPage() {
  const items =
    useHistoryStore(
      (state) => state.items,
    );


  const stats =
    useMemo(() => {
      const options =
        items.flatMap(
          (item) =>
            item.optionNames,
        );

      const preferences =
        items
          .map(
            (item) =>
              item.preferredOption,
          )
          .filter(
            (
              value,
            ): value is string =>
              Boolean(value),
          );

      const tokens =
        items.reduce(
          (total, item) =>
            total +
            (
              item.simulation
                .observatory
                ?.summary
                ?.total_tokens ??
              0
            ),
          0,
        );

      return {
        decisions:
          items.length,

        options:
          options.length,

        preferences:
          preferences.length,

        tokens,
      };
    }, [items]);


  const recurring =
    useMemo(() => {
      const map =
        new Map<
          string,
          {
            label: string;
            count: number;
          }
        >();

      for (const item of items) {
        const assumptions =
          extractAssumptions(
            item.simulation,
          );

        for (const assumption of assumptions) {
          const key =
            normalize(
              assumption,
            );

          const current =
            map.get(key);

          if (current) {
            current.count += 1;
          } else {
            map.set(key, {
              label:
                assumption,
              count: 1,
            });
          }
        }
      }

      return [
        ...map.values(),
      ]
        .filter(
          (item) =>
            item.count > 1,
        )
        .sort(
          (a, b) =>
            b.count -
            a.count,
        )
        .slice(0, 10);
    }, [items]);


  return (
    <AppShell>

      <div className="h-[calc(100vh-72px)] overflow-y-auto p-8">

        <div className="mx-auto max-w-[1180px]">

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/65">
            <Brain size={13} />
            Longitudinal intelligence
          </div>

          <h1 className="mt-3 text-[30px] font-light tracking-[-0.03em] text-white">
            Decision Memory
          </h1>

          <p className="mt-3 max-w-[700px] text-[11px] leading-6 text-white/35">
            Patterns preserved across your
            decision simulations. Memory is
            derived from archived PARALLAX
            runs rather than generated from
            hidden profile assumptions.
          </p>


          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <Metric
              icon={Database}
              label="Saved decisions"
              value={
                stats.decisions
              }
            />

            <Metric
              icon={GitBranch}
              label="Options simulated"
              value={
                stats.options
              }
            />

            <Metric
              icon={Layers3}
              label="Preferences recorded"
              value={
                stats.preferences
              }
            />

            <Metric
              icon={Brain}
              label="Archived tokens"
              value={
                stats.tokens
                  .toLocaleString()
              }
            />

          </div>


          <section className="mt-10 rounded-[20px] border border-white/[0.065] bg-white/[0.018] p-6">

            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-white/22">
              <CircleAlert
                size={11}
              />
              Recurring assumptions
            </div>

            <p className="mt-2 text-[9px] leading-5 text-white/18">
              Exact or near-identical
              assumptions that have appeared
              repeatedly in archived
              simulations.
            </p>


            {recurring.length ===
            0 ? (
              <div className="mt-8 rounded-xl border border-white/[0.045] bg-black/10 p-5 text-[9px] text-white/18">
                No recurring assumptions
                detected yet. More saved
                decisions will make this
                memory layer richer.
              </div>
            ) : (
              <div className="mt-6 grid gap-2 md:grid-cols-2">

                {recurring.map(
                  (item) => (
                    <div
                      key={
                        item.label
                      }
                      className="rounded-xl border border-white/[0.055] bg-black/10 p-4"
                    >

                      <div className="text-[9px] leading-5 text-white/38">
                        {
                          item.label
                        }
                      </div>

                      <div className="mt-3 text-[8px] text-[var(--accent)]/40">
                        Appeared in{" "}
                        {
                          item.count
                        }{" "}
                        simulations
                      </div>

                    </div>
                  ),
                )}

              </div>
            )}

          </section>

        </div>

      </div>

    </AppShell>
  );
}


function normalize(
  value: string,
) {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /[^\w\s]/g,
      "",
    )
    .replace(
      /\s+/g,
      " ",
    );
}


function extractAssumptions(
  simulation: unknown,
): string[] {
  if (
    typeof simulation !==
      "object" ||
    simulation === null
  ) {
    return [];
  }

  const root =
    simulation as Record<
      string,
      unknown
    >;

  const assumptionPayload =
    root[
      "assumption_ledger"
    ];

  if (
    typeof assumptionPayload !==
      "object" ||
    assumptionPayload === null
  ) {
    return [];
  }

  const payload =
    assumptionPayload as Record<
      string,
      unknown
    >;

  const ledger =
    typeof payload["ledger"] ===
      "object" &&
    payload["ledger"] !== null
      ? (
          payload[
            "ledger"
          ] as Record<
            string,
            unknown
          >
        )
      : payload;

  const items =
    ledger["items"];

  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      if (
        typeof item !==
          "object" ||
        item === null
      ) {
        return null;
      }

      const statement =
        (
          item as Record<
            string,
            unknown
          >
        )["statement"];

      return typeof statement ===
        "string"
        ? statement
        : null;
    })
    .filter(
      (
        value,
      ): value is string =>
        Boolean(value),
    );
}


function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[16px] border border-white/[0.065] bg-white/[0.018] p-4">

      <Icon
        size={13}
        className="text-white/25"
      />

      <div className="mt-4 text-[19px] font-light text-white/70">
        {value}
      </div>

      <div className="mt-1 text-[8px] uppercase tracking-[0.12em] text-white/18">
        {label}
      </div>

    </div>
  );
}