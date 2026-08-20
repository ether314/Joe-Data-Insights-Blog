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
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  ETF_CHANNELS,
  HEADLINE,
  SOURCE_NOTE,
  SUPPLY_SHARE_SERIES,
  fmtBn,
  fmtPct,
  fmtPp,
  fundingChannelBars,
  newMetricBars,
  overflowScatter,
  ratingDumbbell,
  vintageDeltaBars,
} from "@/data/ai-financing-update-2026q3-data";

// viz-types: dual supply-share line, diverging delta bars, rating dumbbell scatter, funding bars, overflow scatter | layout: default
// viz-plan: IG/HY theme path; Aug→Q3 Δ; Meta/Amazon rating gap; funding channels; capacity×horizon; lens + focus controls

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

type Lens = "supply" | "ratings" | "overflow";
type Focus = "all" | "ig" | "hy" | "private";

const RATING_TICKS = [
  { v: 3, label: "BBB" },
  { v: 4, label: "A" },
  { v: 5, label: "AA" },
];

export function AiFinancingUpdate2026q3Dashboard() {
  const [lens, setLens] = useState<Lens>("supply");
  const [focus, setFocus] = useState<Focus>("all");

  const deltas = useMemo(() => {
    const all = vintageDeltaBars();
    if (focus === "ig") return all.filter((d) => d.id === "ig-supply-share");
    if (focus === "hy") return all.filter((d) => d.id === "hy-supply-share");
    if (focus === "private") return [];
    return all;
  }, [focus]);

  const newMetrics = useMemo(() => {
    const all = newMetricBars();
    if (focus === "private") return all.filter((d) => d.id === "private-dc");
    if (focus === "ig" || focus === "hy") return all.filter((d) => d.id === "ai-stock-share" || d.id === "big5-index");
    return all;
  }, [focus]);

  const sharePath = useMemo(() => SUPPLY_SHARE_SERIES, []);
  const ratings = useMemo(() => ratingDumbbell(), []);
  const channels = useMemo(() => {
    if (focus === "private") return fundingChannelBars("private");
    if (focus === "ig" || focus === "hy") return fundingChannelBars("public");
    return fundingChannelBars("all");
  }, [focus]);
  const overflow = useMemo(() => overflowScatter(), []);
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

  const ratingScatter = useMemo(() => {
    const points: {
      issuer: string;
      score: number;
      kind: string;
      fill: string;
      label: string;
      note: string;
    }[] = [];
    for (const r of ratings) {
      points.push({
        issuer: r.issuer,
        score: r.official,
        kind: "Official",
        fill: "#94a3b8",
        label: r.officialLabel,
        note: r.note,
      });
      points.push({
        issuer: r.issuer,
        score: r.market,
        kind: "Market",
        fill: r.fill,
        label: r.marketLabel,
        note: r.note,
      });
    }
    return points;
  }, [ratings]);

  return (
    <div className="space-y-6" data-viz="ai-financing-update-2026q3">
      <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — Aug mid-year → Q3 2026 update
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          AI share of USD IG supply {fmtPct(HEADLINE.aiIgSharePriorPct)} →{" "}
          {fmtPct(HEADLINE.aiIgShareNewPct)} ({fmtPp(HEADLINE.aiIgShareDeltaPp)})
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          HY theme share prints {fmtPct(HEADLINE.aiHySharePriorPct)} →{" "}
          {fmtPct(HEADLINE.aiHyShareNewPct)}. Private data-centre deals add ~{fmtBn(HEADLINE.privateDcBn)}{" "}
          since early 2025. AI-related YTD debt spine still ~{fmtBn(HEADLINE.aiRelatedDebtYtdBn)} with
          hyperscalers ~{fmtPct(HEADLINE.hyperscalerSharePct)} — the vintage move is{" "}
          <em>theme weight inside credit supply</em>, not a restated dollar perimeter.
        </p>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Lens</span>
            {(
              [
                ["supply", "Supply shares"],
                ["ratings", "Rating vs market"],
                ["overflow", "Funding overflow"],
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
                ["ig", "IG share"],
                ["hy", "HY share"],
                ["private", "Private DC"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFocus(id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  focus === id
                    ? "bg-violet-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {lens === "supply" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="AI theme share of US credit supply"
            subtitle="Desk path through Aug mid-year, then Q3 re-print — IG and HY together"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <LineChart data={sharePath} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 28]}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as {
                        period: string;
                        ig: number;
                        hy: number | null;
                        note: string;
                      };
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{row.period}</p>
                          <p className="text-slate-700">IG theme: {fmtPct(row.ig)}</p>
                          {row.hy != null && (
                            <p className="text-slate-700">HY theme: {fmtPct(row.hy)}</p>
                          )}
                          <p className="text-xs text-slate-500">{row.note}</p>
                        </div>
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ig"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#8b5cf6" }}
                    name="USD IG %"
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="hy"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    dot={{ r: 4, fill: "#ef4444" }}
                    name="US HY %"
                    connectNulls
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Vintage deltas that moved"
            subtitle={
              focus === "private"
                ? "Private DC is a new metric — see New Q3 disclosures panel"
                : "Q3 minus Aug (pp). Dollar perimeter held; theme weight rose."
            }
          >
            {focus === "private" ? (
              <div className="flex h-80 items-center justify-center text-sm text-slate-500">
                Private DC is newly disclosed — switch to New Q3 disclosures below, or Focus → All.
              </div>
            ) : deltas.length === 0 ? (
              <div className="flex h-80 items-center justify-center text-sm text-slate-500">
                No delta bars for this focus.
              </div>
            ) : (
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={deltas} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <ReferenceLine x={0} stroke="#94a3b8" />
                    <XAxis
                      type="number"
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`}
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      width={150}
                      tick={{ fill: "#334155", fontSize: 11, fontWeight: 600 }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const sorted = sortTooltipPayload(payload);
                        const row = sorted[0]?.payload as {
                          label: string;
                          delta: number;
                          prior: number;
                          neu: number;
                        };
                        return (
                          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                            <p className="font-semibold text-slate-900">{row.label}</p>
                            <p className="text-slate-600">
                              {row.prior}% → {row.neu}% ({fmtPp(row.delta)})
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
            title="New Q3 disclosures"
            subtitle="Metrics that did not appear in the Aug mid-year update"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={newMetrics} margin={{ top: 8, right: 16, left: 0, bottom: 48 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                    height={60}
                    tick={{ fill: "#334155", fontSize: 10, fontWeight: 600 }}
                  />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as {
                        label: string;
                        value: number;
                        unit: string;
                        note: string;
                      };
                      const display =
                        row.unit === "bn" ? fmtBn(row.value) : fmtPct(row.value);
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{row.label}</p>
                          <p className="text-slate-700">{display}</p>
                          <p className="text-xs text-slate-500">{row.note}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {newMetrics.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Equity channel (2025 ETF flows)"
            subtitle="Sentiment capacity carried from baseline — not issuer proceeds"
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
                      const row = payload[0]?.payload as { name: string; flows: number };
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

      {lens === "ratings" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Official rating vs market pricing"
            subtitle="Long-dated Meta / Amazon paper: supply technicals pull implied credit below AA"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <ScatterChart margin={{ top: 16, right: 24, left: 8, bottom: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="category"
                    dataKey="issuer"
                    allowDuplicatedCategory={false}
                    tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="score"
                    domain={[2.5, 5.5]}
                    ticks={RATING_TICKS.map((t) => t.v)}
                    tickFormatter={(v) => RATING_TICKS.find((t) => t.v === v)?.label ?? String(v)}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    label={{
                      value: "Credit strength (higher = stronger)",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#94a3b8",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis range={[120, 120]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as {
                        issuer: string;
                        kind: string;
                        label: string;
                        note: string;
                      };
                      return (
                        <div className="max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">
                            {row.issuer} — {row.kind}
                          </p>
                          <p className="text-slate-700">{row.label}</p>
                          <p className="mt-1 text-xs text-slate-500">{row.note}</p>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={ratingScatter} name="Rating gap">
                    {ratingScatter.map((p, i) => (
                      <Cell key={`${p.issuer}-${p.kind}-${i}`} fill={p.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-1 text-xs text-slate-500">
              {ratings.map((r) => (
                <li key={r.issuer}>
                  <span className="font-semibold text-slate-700">{r.issuer} {r.maturity}:</span>{" "}
                  {r.officialLabel} official → {r.marketLabel} market
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title="Why the gap matters for passive IG"
            subtitle="AI-tagged stock ~15% of US IG; Big-5 path toward >5% of major indices by YE2026"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart
                  data={[
                    {
                      label: "AI-tagged IG stock",
                      value: HEADLINE.aiTaggedStockPct,
                      fill: "#06b6d4",
                    },
                    {
                      label: "Big-5 YE26 path",
                      value: HEADLINE.big5IndexPathPct,
                      fill: "#10b981",
                    },
                    {
                      label: "IG theme flow (Q3)",
                      value: HEADLINE.aiIgShareNewPct,
                      fill: "#8b5cf6",
                    },
                  ]}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 28]}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={130}
                    tick={{ fill: "#334155", fontSize: 11, fontWeight: 600 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as { label: string; value: number };
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{row.label}</p>
                          <p className="text-slate-700">{fmtPct(row.value)}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={32}>
                    {[0, 1, 2].map((i) => (
                      <Cell
                        key={i}
                        fill={
                          i === 0 ? "#06b6d4" : i === 1 ? "#10b981" : "#8b5cf6"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Flow share (rightmost) is the Q3 vintage headline. Stock and index-path shares are
              outstanding / concentration lenses — do not sum them.
            </p>
          </ChartCard>
        </div>
      )}

      {lens === "overflow" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Funding channels (capacity map)"
            subtitle="Public AI debt YTD vs private DC deals vs absorb / project paths"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={channels} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={160}
                    tick={{ fill: "#334155", fontSize: 10, fontWeight: 600 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as {
                        label: string;
                        amount: number;
                        note: string;
                        channel: string;
                      };
                      return (
                        <div className="max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{row.label}</p>
                          <p className="text-slate-700">{fmtBn(row.amount)}</p>
                          <p className="text-xs text-slate-500">
                            {row.channel} — {row.note}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]} maxBarSize={28}>
                    {channels.map((c) => (
                      <Cell key={c.id} fill={c.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Overflow: capacity × horizon"
            subtitle="Private DC is now a measured flow — not only $4.5T dry-powder abstract"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <ScatterChart margin={{ top: 16, right: 24, left: 8, bottom: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="horizon"
                    name="Horizon"
                    unit="y"
                    domain={[0, 6]}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    label={{
                      value: "Horizon (years)",
                      position: "insideBottom",
                      offset: -4,
                      fill: "#94a3b8",
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="capacity"
                    name="Capacity"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => (v >= 1000 ? `$${v / 1000}T` : `$${v}B`)}
                  />
                  <ZAxis range={[80, 200]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as {
                        name: string;
                        capacity: number;
                        horizon: number;
                        note: string;
                      };
                      return (
                        <div className="max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{row.name}</p>
                          <p className="text-slate-700">
                            {row.capacity >= 1000
                              ? `$${(row.capacity / 1000).toFixed(1)}T`
                              : fmtBn(row.capacity)}{" "}
                            · {row.horizon}y
                          </p>
                          <p className="mt-1 text-xs text-slate-500">{row.note}</p>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={overflow} name="Overflow">
                    {overflow.map((o) => (
                      <Cell key={o.name} fill={o.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}
    </div>
  );
}
