"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  AI_DEBT_STACK,
  ETF_CHANNELS,
  HEADLINE,
  OVERFLOW_CHANNELS,
  SOURCE_NOTE,
  debtStackPie,
  durationRankChange,
  fmtBn,
  fmtPct,
  fmtPp,
  spreadDumbbell,
  supplyShareSeries,
  vintageDeltaBars,
} from "@/data/ai-financing-update-2026-data";

// viz-types: stacked pie, delta bars, supply-share line, spread dumbbell, overflow scatter | layout: default
// viz-plan: AI debt stack pie; vintage Δ bars; IG supply-share path; spread tight→wide; overflow capacity; lens + focus controls

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

type Lens = "stack" | "spreads" | "overflow";
type Focus = "all" | "supply" | "fx" | "duration";

export function AiFinancingUpdateDashboard() {
  const [lens, setLens] = useState<Lens>("stack");
  const [focus, setFocus] = useState<Focus>("all");

  const deltas = useMemo(() => {
    const all = vintageDeltaBars();
    if (focus === "supply") return all.filter((d) => d.id === "ig-supply-share");
    if (focus === "fx") return all.filter((d) => d.id === "non-usd");
    if (focus === "duration") return [];
    return all;
  }, [focus]);

  const sharePath = useMemo(() => supplyShareSeries(), []);
  const stack = useMemo(() => debtStackPie(), []);
  const spreads = useMemo(() => spreadDumbbell(), []);
  const ranks = useMemo(() => durationRankChange(), []);
  const overflow = useMemo(
    () =>
      OVERFLOW_CHANNELS.map((c) => ({
        name: c.label,
        capacity: c.sortValue,
        fill: c.color,
        note: c.note,
        capacityLabel: c.capacityLabel,
      })),
    [],
  );
  const etfBars = useMemo(
    () =>
      ETF_CHANNELS.map((e) => ({
        ticker: e.ticker,
        flows: e.flows2025Bn,
        fill: e.color,
        name: e.name,
      })),
    [],
  );

  return (
    <div className="space-y-6" data-viz="ai-financing-update-2026">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — Jul research → Aug 2026 update
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          AI-related debt {fmtBn(HEADLINE.aiRelatedDebtYtdBn)} YTD — hyperscalers only{" "}
          {fmtPct(HEADLINE.hyperscalerSharePct)}
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          US IG supply share for the AI theme jumps {fmtPct(HEADLINE.aiIgSupplySharePriorPct)} →{" "}
          {fmtPct(HEADLINE.aiIgSupplySharePct)} ({fmtPp(HEADLINE.aiIgSupplyShareDeltaPp)}). Non-USD
          hyperscaler mix rises to {fmtPct(HEADLINE.nonUsdSharePct)} (+
          {HEADLINE.nonUsdDeltaPp} pp). Hyperscaler FY path still {fmtBn(HEADLINE.hyperscalerYtdBn)}{" "}
          YTD / ~{fmtBn(250)} full-year.
        </p>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Lens</span>
            {(
              [
                ["stack", "Debt stack"],
                ["spreads", "Spreads & ranks"],
                ["overflow", "Overflow channels"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setLens(id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  lens === id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Focus</span>
            {(
              [
                ["all", "All deltas"],
                ["supply", "IG supply share"],
                ["fx", "Non-USD mix"],
                ["duration", "Duration ranks"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFocus(id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  focus === id
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {lens === "stack" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="AI-related debt stack (mid-2026)"
            subtitle="Hyperscalers ~40% — the Jul post’s $194B is now a slice, not the whole wall"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={stack}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {stack.map((s) => (
                      <Cell key={s.name} fill={s.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as {
                        name: string;
                        value: number;
                        note: string;
                      };
                      return (
                        <div className="max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{row.name}</p>
                          <p className="text-slate-700">{fmtBn(row.value)}</p>
                          <p className="mt-1 text-xs text-slate-500">{row.note}</p>
                        </div>
                      );
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-1 text-xs text-slate-500">
              {AI_DEBT_STACK.map((s) => (
                <li key={s.id}>
                  <span className="font-semibold text-slate-700">{s.label}:</span> {fmtBn(s.amountBn)} —{" "}
                  {s.note}
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title="Vintage deltas that moved"
            subtitle={
              focus === "duration"
                ? "Switch focus off Duration to see numeric deltas — ranks live in Spreads lens"
                : "New minus prior (pp or $B). Unchanged hyperscaler YTD omitted."
            }
          >
            {focus === "duration" ? (
              <div className="flex h-80 items-center justify-center text-sm text-slate-500">
                Duration ranks are under the Spreads & ranks lens.
              </div>
            ) : (
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={deltas} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`}
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      width={140}
                      tick={{ fill: "#334155", fontSize: 11, fontWeight: 600 }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const sorted = sortTooltipPayload(payload);
                        const row = sorted[0]?.payload as {
                          label: string;
                          delta: number;
                          unit: string;
                          prior: number;
                          neu: number;
                        };
                        const unit = row.unit === "pct" || row.unit === "pp" ? " pp" : "B $";
                        return (
                          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                            <p className="font-semibold text-slate-900">{row.label}</p>
                            <p className="text-slate-600">
                              {row.prior} → {row.neu} ({row.delta > 0 ? "+" : ""}
                              {row.delta}
                              {unit})
                            </p>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="delta" radius={[0, 4, 4, 0]} maxBarSize={28}>
                      {deltas.map((d) => (
                        <Cell key={d.id} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>

          <ChartCard
            title="AI share of US IG supply"
            subtitle="Desk path: 1% (2024) → 7% (2025) → ~18% (2026 YTD)"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <LineChart data={sharePath} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 24]}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as {
                        year: string;
                        share: number;
                        label: string;
                      };
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{row.year}</p>
                          <p className="text-slate-700">{fmtPct(row.share)} of US IG supply</p>
                          <p className="text-xs text-slate-500">{row.label}</p>
                        </div>
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="share"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#8b5cf6" }}
                    name="AI share %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Equity channel (2025 ETF flows)"
            subtitle="Public-market capacity still concentrated in broad proxies — carried from baseline"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={etfBars} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="ticker" tick={{ fill: "#334155", fontSize: 11, fontWeight: 600 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v) => `$${v}B`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as {
                        name: string;
                        flows: number;
                      };
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{row.name}</p>
                          <p className="text-slate-700">{fmtBn(row.flows)} net flows (2025)</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="flows" radius={[4, 4, 0, 0]} maxBarSize={36}>
                    {etfBars.map((e) => (
                      <Cell key={e.ticker} fill={e.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {lens === "spreads" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Spreads: tight → wide"
            subtitle="AI leader basket nearly doubled; new-issue medians still grinding wider"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={spreads} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => `${v} bp`}
                  />
                  <YAxis
                    type="category"
                    dataKey="series"
                    width={150}
                    tick={{ fill: "#334155", fontSize: 10, fontWeight: 600 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as {
                        series: string;
                        tight: number;
                        wide: number;
                        note: string;
                      };
                      return (
                        <div className="max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{row.series}</p>
                          <p className="text-slate-600">
                            {row.tight} → {row.wide} bp
                          </p>
                          <p className="mt-1 text-xs text-slate-500">{row.note}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="tight" name="Tight / 2025" fill="#cbd5e1" radius={[0, 4, 4, 0]} maxBarSize={12} />
                  <Bar dataKey="wide" name="Wide / 2026" radius={[0, 4, 4, 0]} maxBarSize={12}>
                    {spreads.map((s) => (
                      <Cell key={s.series} fill={s.fill} />
                    ))}
                  </Bar>
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Duration weight rank (US IG index)"
            subtitle="Lower rank = heavier duration weight. Amazon #20 → #1; Alphabet #86 → #18"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={ranks} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="issuer" tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }} />
                  <YAxis
                    reversed
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    label={{ value: "Rank (1 = heaviest)", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 11 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as {
                        issuer: string;
                        prior: number;
                        neu: number;
                        improvement: number;
                      };
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{row.issuer}</p>
                          <p className="text-slate-600">
                            Rank #{row.prior} → #{row.neu} (↑{row.improvement} places)
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="prior" name="2025 rank" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="neu" name="2026 rank" radius={[4, 4, 0, 0]} maxBarSize={28}>
                    {ranks.map((r) => (
                      <Cell key={r.issuer} fill={r.fill} />
                    ))}
                  </Bar>
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {lens === "overflow" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Overflow capacity (when US IG saturates)"
            subtitle="Private markets dwarf bank-comparable IG room; project finance is the 2027 additive"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="capacity"
                    name="Capacity"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => (v >= 1000 ? `$${v / 1000}T` : `$${v}B`)}
                    scale="log"
                    domain={["auto", "auto"]}
                  />
                  <YAxis
                    type="number"
                    dataKey="capacity"
                    name="Same"
                    hide
                    domain={["auto", "auto"]}
                  />
                  <ZAxis range={[120, 400]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as {
                        name: string;
                        capacityLabel: string;
                        note: string;
                      };
                      return (
                        <div className="max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{row.name}</p>
                          <p className="text-slate-700">{row.capacityLabel}</p>
                          <p className="mt-1 text-xs text-slate-500">{row.note}</p>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={overflow} fill="#6366f1">
                    {overflow.map((o) => (
                      <Cell key={o.name} fill={o.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 grid gap-1 text-xs text-slate-500 sm:grid-cols-2">
              {OVERFLOW_CHANNELS.map((c) => (
                <li key={c.id}>
                  <span className="font-semibold text-slate-700">{c.label}:</span> {c.capacityLabel}
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title="Overflow ranked (log-scaled dollars)"
            subtitle="Same channels as bars — private powder at $4.5T dominates the scale"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart
                  data={[...overflow].sort((a, b) => b.capacity - a.capacity)}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => (v >= 1000 ? `$${v / 1000}T` : `$${v}B`)}
                    scale="log"
                    domain={["auto", "auto"]}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={150}
                    tick={{ fill: "#334155", fontSize: 10, fontWeight: 600 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as {
                        name: string;
                        capacityLabel: string;
                        note: string;
                      };
                      return (
                        <div className="max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{row.name}</p>
                          <p className="text-slate-700">{row.capacityLabel}</p>
                          <p className="mt-1 text-xs text-slate-500">{row.note}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="capacity" radius={[0, 4, 4, 0]} maxBarSize={28}>
                    {overflow.map((o) => (
                      <Cell key={o.name} fill={o.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}
    </div>
  );
}
