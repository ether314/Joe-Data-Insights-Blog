"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  ERA_SNAPSHOTS,
  HEADLINE,
  PRODUCT_COMPARE,
  RANGE_OPTIONS,
  SOURCE_NOTE,
  VIZ_MARKERS,
  filterQuarters,
  fmtBn,
  fmtPct,
  type RangeId,
} from "@/data/credit-card-90-day-delinquency-versus-revolving-balances-2026-data";

// viz-types: dual-axis line/area, indexed divergence ribbon, product bars, scatter
// layout: default
// smoke-marker: Card 90+ vs revolving balances

type ViewId = "dual" | "index" | "products" | "scatter";

const SLUG = "credit-card-90-day-delinquency-versus-revolving-balances-2026";
const STRESS = "#c2410c";
const STOCK = "#0f766e";
const MUTED = "#64748b";
const GRID = "#e2e8f0";

const VIEWS: { id: ViewId; label: string; marker: string }[] = [
  { id: "dual", label: "Stress vs stock", marker: VIZ_MARKERS[0] },
  { id: "index", label: "Indexed gap", marker: VIZ_MARKERS[1] },
  { id: "products", label: "Product ladder", marker: VIZ_MARKERS[2] },
  { id: "scatter", label: "Balance scatter", marker: VIZ_MARKERS[3] },
];

export function CreditCard90DayDelinquencyVersusRevolvingBalances2026Dashboard() {
  const [view, setView] = useState<ViewId>("dual");
  const [range, setRange] = useState<RangeId>("full");
  const [showAuto, setShowAuto] = useState(false);
  const [showCcp, setShowCcp] = useState(false);

  const series = useMemo(() => {
    return filterQuarters(range).map((q) => ({
      ...q,
      ccpCardBn: Math.round(q.ccpCardTn * 1000),
      auto90Index: Math.round((q.auto90Flow / 2.36) * 1000) / 10,
    }));
  }, [range]);

  const scatterData = useMemo(
    () =>
      series.map((q) => ({
        ...q,
        x: q.revolvingBn,
        y: q.card90Flow,
        z: Math.max(40, q.ccpCardTn * 80),
      })),
    [series],
  );

  const latest = series.at(-1) ?? series[0];

  return (
    <figure
      className="not-prose my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      data-viz={SLUG}
      data-smoke="Card 90+ vs revolving balances"
    >
      <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-orange-900">
          Card 90+ vs revolving balances · NY Fed CCP × Fed G.19 ·{" "}
          {HEADLINE.latestLabel}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
          Card serious delinquency versus revolving credit stock
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          Annualized transitions into 90+ day card delinquency sit near cycle
          highs while G.19 revolving outstanding keeps climbing — a stock-and-stress
          pairing, not a single meter.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-orange-50/90 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-orange-800">
              Card 90+ flow
            </p>
            <p className="text-2xl font-semibold tabular-nums text-orange-950">
              {fmtPct(HEADLINE.card90FlowPct)}
            </p>
          </div>
          <div className="rounded-xl bg-teal-50/90 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-teal-800">
              G.19 revolving
            </p>
            <p className="text-2xl font-semibold tabular-nums text-teal-950">
              {fmtBn(HEADLINE.revolvingBn, 0)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-100/90 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-600">
              Rise from trough
            </p>
            <p className="text-2xl font-semibold tabular-nums text-slate-900">
              +{HEADLINE.riseFromTroughPp.toFixed(2)} pp
            </p>
          </div>
          <div className="rounded-xl bg-slate-100/90 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-600">
              Combined elevation
            </p>
            <p className="text-2xl font-semibold tabular-nums text-slate-900">
              +{HEADLINE.divergenceGap.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3 sm:px-6">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setView(v.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              view === v.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            aria-pressed={view === v.id}
          >
            {v.label}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-sm text-slate-600">
          <span className="hidden sm:inline">Range</span>
          <select
            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm"
            value={range}
            onChange={(e) => setRange(e.target.value as RangeId)}
            aria-label="Time range"
          >
            {RANGE_OPTIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {(view === "dual" || view === "index") && (
        <div className="flex flex-wrap gap-4 border-b border-slate-50 px-4 py-2 text-sm text-slate-600 sm:px-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showAuto}
              onChange={(e) => setShowAuto(e.target.checked)}
            />
            Show auto 90+ flow
          </label>
          {view === "dual" && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showCcp}
                onChange={(e) => setShowCcp(e.target.checked)}
              />
              Show CCP card $T
            </label>
          )}
        </div>
      )}

      <div className="px-2 py-4 sm:px-4">
        {view === "dual" && (
          <div>
            <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              {VIZ_MARKERS[0]}
            </p>
            <div className="h-[340px] w-full sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={series}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: MUTED, fontSize: 11 }}
                    interval="preserveStartEnd"
                    minTickGap={28}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: STRESS, fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 8]}
                    width={44}
                    label={{
                      value: "90+ flow %",
                      angle: -90,
                      position: "insideLeft",
                      fill: STRESS,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: STOCK, fontSize: 11 }}
                    tickFormatter={(v) => `$${v}`}
                    domain={[900, 1400]}
                    width={52}
                    label={{
                      value: "G.19 $B",
                      angle: 90,
                      position: "insideRight",
                      fill: STOCK,
                      fontSize: 11,
                    }}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      const n = Number(value);
                      if (String(name).includes("revolving") || String(name).includes("G.19"))
                        return [fmtBn(n, 1), String(name)];
                      if (String(name).includes("CCP"))
                        return [`$${n.toFixed(2)}T`, String(name)];
                      return [fmtPct(n), String(name)];
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="revolvingBn"
                    name="G.19 revolving $B"
                    fill="#99f6e4"
                    stroke={STOCK}
                    strokeWidth={2}
                    fillOpacity={0.35}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="card90Flow"
                    name="Card 90+ flow %"
                    stroke={STRESS}
                    strokeWidth={2.5}
                    dot={false}
                  />
                  {showAuto && (
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="auto90Flow"
                      name="Auto 90+ flow %"
                      stroke="#0369a1"
                      strokeWidth={1.5}
                      strokeDasharray="4 3"
                      dot={false}
                    />
                  )}
                  {showCcp && (
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="ccpCardBn"
                      name="CCP cards ($B equiv)"
                      stroke="#7c3aed"
                      strokeWidth={1.5}
                      strokeDasharray="2 2"
                      dot={false}
                    />
                  )}
                  <ReferenceLine
                    yAxisId="left"
                    y={HEADLINE.card90PrePandemicPct}
                    stroke={MUTED}
                    strokeDasharray="3 3"
                    label={{
                      value: "2019Q4 card",
                      fill: MUTED,
                      fontSize: 10,
                      position: "insideTopLeft",
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {view === "index" && (
          <div>
            <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              {VIZ_MARKERS[1]} · 2019Q4 = 100
            </p>
            <div className="h-[340px] w-full sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={series}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: MUTED, fontSize: 11 }}
                    interval="preserveStartEnd"
                    minTickGap={28}
                  />
                  <YAxis
                    tick={{ fill: MUTED, fontSize: 11 }}
                    domain={[40, 160]}
                    width={40}
                  />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="divergenceGap"
                    name="Combined elevation"
                    fill="#fed7aa"
                    stroke="#ea580c"
                    strokeWidth={1.5}
                    fillOpacity={0.45}
                  />
                  <Line
                    type="monotone"
                    dataKey="revolvingIndex"
                    name="Revolving index"
                    stroke={STOCK}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="card90Index"
                    name="Card 90+ index"
                    stroke={STRESS}
                    strokeWidth={2}
                    dot={false}
                  />
                  {showAuto && (
                    <Line
                      type="monotone"
                      dataKey="auto90Index"
                      name="Auto 90+ index"
                      stroke="#0369a1"
                      strokeWidth={1.5}
                      strokeDasharray="4 3"
                      dot={false}
                    />
                  )}
                  <ReferenceLine y={100} stroke={MUTED} strokeDasharray="3 3" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-1 px-2 text-xs text-slate-500">
              Combined elevation = (revolving index − 100) + (card 90+ index − 100).
              Latest: +{latest?.divergenceGap.toFixed(1)} vs 2019Q4.
            </p>
          </div>
        )}

        {view === "products" && (
          <div>
            <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              {VIZ_MARKERS[2]} · {HEADLINE.latestLabel} annualized flow into 90+
            </p>
            <div className="h-[320px] w-full sm:h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={PRODUCT_COMPARE}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: MUTED, fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 8]}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    tick={{ fill: MUTED, fontSize: 12 }}
                    width={72}
                  />
                  <Tooltip formatter={(v) => [fmtPct(Number(v)), "90+ flow"]} />
                  <Bar dataKey="flow90" name="90+ flow %" radius={[0, 6, 6, 0]}>
                    {PRODUCT_COMPARE.map((p) => (
                      <Cell key={p.product} fill={p.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid gap-2 px-2 sm:grid-cols-4">
              {ERA_SNAPSHOTS.map((e) => (
                <div
                  key={e.era}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {e.era}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {fmtPct(e.card90)} · {fmtBn(e.revolvingBn, 0)}
                  </p>
                  <p className="text-[11px] text-slate-500">{e.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "scatter" && (
          <div>
            <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              {VIZ_MARKERS[3]} · bubble = CCP card stock
            </p>
            <div className="h-[340px] w-full sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Revolving"
                    tick={{ fill: MUTED, fontSize: 11 }}
                    tickFormatter={(v) => `$${v}`}
                    domain={["dataMin - 20", "dataMax + 20"]}
                    label={{
                      value: "G.19 revolving $B",
                      position: "insideBottom",
                      offset: -2,
                      fill: MUTED,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Card 90+"
                    tick={{ fill: MUTED, fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[2.5, 7.5]}
                    label={{
                      value: "Card 90+ flow %",
                      angle: -90,
                      position: "insideLeft",
                      fill: MUTED,
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[40, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(value, name) => {
                      if (name === "Revolving") return [fmtBn(Number(value), 1), "G.19"];
                      if (name === "Card 90+") return [fmtPct(Number(value)), "Card 90+"];
                      return [String(value), String(name)];
                    }}
                    labelFormatter={(_, payload) => {
                      const p = payload?.[0]?.payload;
                      return p?.label ?? "";
                    }}
                  />
                  <Scatter name="Quarters" data={scatterData} fill={STRESS}>
                    {scatterData.map((d) => (
                      <Cell
                        key={d.label}
                        fill={
                          d.label === HEADLINE.latestLabel
                            ? "#9a3412"
                            : d.year >= 2024
                              ? STRESS
                              : d.year >= 2021 && d.year <= 2022
                                ? STOCK
                                : MUTED
                        }
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      <figcaption className="border-t border-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-500 sm:px-6">
        {SOURCE_NOTE}
      </figcaption>
    </figure>
  );
}
