"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
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
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  DUAL_LEDGER_PATH,
  GROWTH_CONCENTRATION_CURVE,
  GROWTH_SLICES,
  HEADLINE,
  LENS_COMPARE,
  LOCAL_INTENSITY,
  PACE_CLOCKS,
  QUEUE_METERS,
  REGION_SHARES,
  SCOREBOARD,
  SOURCE_NOTE,
  SOURCES,
  STOCK_CONCENTRATION_CURVE,
  TOP_CLUSTERS,
  US_SHARE_COMPARE,
  VINTAGE_DELTAS,
  fmtGw,
  fmtPct,
  fmtPp,
  fmtTwh,
} from "@/data/ai-power-grid-concentration-2026q3-data";

// viz-types: vintage delta bars, Lorenz area+line, US-share compare bars, growth donut, dual-ledger line, cluster scatter, intensity lollipops, queue meters, pace clocks, lens scatter | layout: default

type ViewId = "scoreboard" | "perimeters" | "clusters" | "pace";
type CurveLens = "stock" | "growth";
type ClusterMetric = "load" | "pipeline";

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

function ToggleGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="inline-flex flex-wrap rounded-lg border border-slate-200 bg-white p-0.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              value === o.id
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AiPowerGridConcentration2026q3Dashboard() {
  const [view, setView] = useState<ViewId>("scoreboard");
  const [curveLens, setCurveLens] = useState<CurveLens>("stock");
  const [clusterMetric, setClusterMetric] = useState<ClusterMetric>("load");
  const [showEqualLine, setShowEqualLine] = useState(true);

  const curve = useMemo(
    () =>
      curveLens === "growth"
        ? GROWTH_CONCENTRATION_CURVE
        : STOCK_CONCENTRATION_CURVE,
    [curveLens],
  );

  const regionBars = useMemo(
    () => [...REGION_SHARES].sort((a, b) => b.sharePct - a.sharePct),
    [],
  );

  const growthPie = useMemo(
    () =>
      GROWTH_SLICES.map((g) => ({
        name: g.short,
        value: g.shareOfGrowthPct,
        fill: g.fill,
      })),
    [],
  );

  const clusterScatter = useMemo(
    () =>
      TOP_CLUSTERS.map((c) => ({
        ...c,
        x: c.itLoadGw,
        y:
          clusterMetric === "pipeline"
            ? (c.pipelineSharePct ?? 0)
            : c.shareOfGlobalPct,
        z: Math.max(40, c.itLoadGw * 18),
      })),
    [clusterMetric],
  );

  const lensScatter = useMemo(
    () =>
      LENS_COMPARE.map((l) => ({
        ...l,
        x: l.top1Pct,
        y: l.top3Pct,
        z: Math.max(12, l.top3Pct / 2),
      })),
    [],
  );

  const intensityBars = useMemo(
    () =>
      [...LOCAL_INTENSITY].sort(
        (a, b) => b.dcShareOfElectricityPct - a.dcShareOfElectricityPct,
      ),
    [],
  );

  const queueBars = useMemo(
    () => QUEUE_METERS.filter((q) => q.kind !== "risk"),
    [],
  );

  const vintageBars = useMemo(
    () =>
      VINTAGE_DELTAS.filter((v) => v.direction !== "scope").map((v) => ({
        ...v,
        label: v.metric.length > 22 ? `${v.metric.slice(0, 20)}…` : v.metric,
      })),
    [],
  );

  const dualLedger = useMemo(
    () =>
      DUAL_LEDGER_PATH.map((d) => ({
        ...d,
        iea: d.ieaTwh,
        gartner: d.gartnerTwh,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="ai-power-grid-concentration-2026q3"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-300">
          AI power & grid — Q3 2026 concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Top-1 still 45% / Top-3 still 85% — Gartner&apos;s 36% US cut is a
          different perimeter, not a rewrite
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Stock and growth ladders are carried from the prior concentration
          print. The Q3 desk adds a Gartner composition cut (
          {fmtTwh(HEADLINE.gartnerWorldTwh2026)} world / US{" "}
          {fmtPct(HEADLINE.gartnerUsShare2026Pct)}), a dual-ledger 2030 gap (
          {fmtTwh(HEADLINE.dualLedgerGapTwh)}), and Electricity 2026 queue stock
          (&gt;{fmtGw(HEADLINE.globalQueueStalledGw)} stalled).
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/10 px-3 py-3 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Top-1 stock
            </p>
            <p className="mt-1 text-xl font-bold text-sky-300">
              {fmtPct(HEADLINE.top1SharePct)}
            </p>
            <p className="text-xs text-slate-400">{HEADLINE.top1Label}</p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-3 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Top-3 stock
            </p>
            <p className="mt-1 text-xl font-bold text-amber-300">
              {fmtPct(HEADLINE.top3SharePct)}
            </p>
            <p className="text-xs text-slate-400">{HEADLINE.top3Label}</p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-3 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Gartner US 2026
            </p>
            <p className="mt-1 text-xl font-bold text-orange-300">
              {fmtPct(HEADLINE.gartnerUsShare2026Pct)}
            </p>
            <p className="text-xs text-slate-400">
              {fmtTwh(HEADLINE.gartnerUsTwh2026)} of world DC
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-3 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Stalled queues
            </p>
            <p className="mt-1 text-xl font-bold text-rose-300">
              &gt;{fmtGw(HEADLINE.globalQueueStalledGw)}
            </p>
            <p className="text-xs text-slate-400">Electricity 2026</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "scoreboard", label: "Scoreboard" },
            { id: "perimeters", label: "Perimeters" },
            { id: "clusters", label: "Clusters" },
            { id: "pace", label: "Pace & queues" },
          ]}
        />
      </div>

      {view === "scoreboard" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Vintage delta — what moved"
            subtitle="Flat share ladders vs rising path and queue meters"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vintageBars} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="prior" name="Prior" fill="#94a3b8" radius={4} />
                  <Bar dataKey="q3" name="Q3" fill="#0ea5e9" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Concentration curve"
            subtitle="Cumulative share vs equal-split diagonal"
          >
            <div className="mb-3 flex flex-wrap gap-3">
              <ToggleGroup
                label="Lens"
                value={curveLens}
                onChange={setCurveLens}
                options={[
                  { id: "stock", label: "Stock" },
                  { id: "growth", label: "Growth Δ" },
                ]}
              />
              <ToggleGroup
                label="Equal line"
                value={showEqualLine ? "on" : "off"}
                onChange={(v) => setShowEqualLine(v === "on")}
                options={[
                  { id: "on", label: "On" },
                  { id: "off", label: "Off" },
                ]}
              />
            </div>
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={curve} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="sharePct"
                    name="Cumulative"
                    fill="#0ea5e933"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                  />
                  {showEqualLine && (
                    <Line
                      type="monotone"
                      dataKey="equalPct"
                      name="Equal split"
                      stroke="#94a3b8"
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Scoreboard — Top-1 / Top-3 by perimeter"
            subtitle="Carried stock vs disclosed Q3 composition and queues"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3">Perimeter</th>
                    <th className="py-2 pr-3">Top-1</th>
                    <th className="py-2 pr-3">Top-3</th>
                    <th className="py-2 pr-3">Δ Top-1</th>
                    <th className="py-2">Extra</th>
                  </tr>
                </thead>
                <tbody>
                  {SCOREBOARD.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="py-2.5 pr-3 font-medium text-slate-800">
                        <span
                          className="mr-2 inline-block h-2 w-2 rounded-full"
                          style={{ background: row.color }}
                        />
                        {row.label}
                      </td>
                      <td className="py-2.5 pr-3 text-slate-700">
                        {row.top1Pct > 0
                          ? `${fmtPct(row.top1Pct)} ${row.top1Label}`
                          : row.top1Label}
                      </td>
                      <td className="py-2.5 pr-3 text-slate-700">
                        {row.top3Pct > 0
                          ? `${fmtPct(row.top3Pct)}`
                          : row.top3Labels}
                      </td>
                      <td className="py-2.5 pr-3 text-slate-600">
                        {row.id === "queues"
                          ? "—"
                          : fmtPp(row.deltaTop1Pp)}
                      </td>
                      <td className="py-2.5 text-slate-600">
                        <span className="text-xs text-slate-400">
                          {row.extraMetric}:{" "}
                        </span>
                        {row.extraValue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>

          <ChartCard
            title="Lens scatter — Top-1 vs Top-3"
            subtitle="Stock, growth, cluster, and local intensity geometries"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: 8, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Top-1"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    domain={[0, 50]}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Top-3"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    domain={[0, 100]}
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 400]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={lensScatter} name="Lenses">
                    {lensScatter.map((l) => (
                      <Cell key={l.id} fill={l.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "perimeters" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="US share across perimeters"
            subtitle="IEA stock ≠ Gartner composition ≠ US demand-growth attribution"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={US_SHARE_COMPARE}
                  layout="vertical"
                  margin={{ left: 12, right: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 55]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={88}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="usSharePct" name="US share" radius={4}>
                    {US_SHARE_COMPARE.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Who captures growth to 2030"
            subtitle={`US + China ~${fmtPct(HEADLINE.usChinaGrowthSharePct)} of incremental TWh`}
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={growthPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {growthPie.map((g) => (
                      <Cell key={g.name} fill={g.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
              {GROWTH_SLICES.map((g) => (
                <li key={g.short} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: g.fill }}
                  />
                  {g.short} {fmtPct(g.shareOfGrowthPct, 1)} ·{" "}
                  {fmtTwh(g.deltaTwh)}
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title="IEA regional stock ladder"
            subtitle="Carried 2024 shares — Top-1 45%, Top-3 85%"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionBars} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip />
                  <Bar dataKey="sharePct" name="Share %" radius={4}>
                    {regionBars.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Dual-ledger demand path"
            subtitle="IEA central vs Gartner — do not average into one forecast"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dualLedger} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="iea"
                    name="IEA TWh"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    connectNulls={false}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gartner"
                    name="Gartner TWh"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    connectNulls={false}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "clusters" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Cluster scatter — load vs intensity"
            subtitle="Northern Virginia still anchors the global map"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Y-axis"
                value={clusterMetric}
                onChange={setClusterMetric}
                options={[
                  { id: "load", label: "Global capacity %" },
                  { id: "pipeline", label: "Pipeline intensity" },
                ]}
              />
            </div>
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: 8, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="IT load"
                    unit=" GW"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name={
                      clusterMetric === "pipeline"
                        ? "Pipeline %"
                        : "Global %"
                    }
                    unit="%"
                    tick={{ fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={clusterScatter} name="Clusters">
                    {clusterScatter.map((c) => (
                      <Cell key={c.short} fill={c.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Local intensity lollipops"
            subtitle="Virginia ~25%, Ireland ~20% vs 1.5% world average"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={intensityBars}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 30]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={90}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="dcShareOfElectricityPct"
                    name="DC share of electricity"
                    radius={4}
                  >
                    {intensityBars.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "pace" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Pace clocks — demand vs grid"
            subtitle="Campus ~2.5y vs queue median ~5y / transmission ~6y"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PACE_CLOCKS} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}y`}
                  />
                  <Tooltip />
                  <Bar dataKey="years" name="Years" radius={4}>
                    {PACE_CLOCKS.map((p) => (
                      <Cell
                        key={p.id}
                        fill={p.kind === "demand" ? "#f59e0b" : "#8b5cf6"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Queue stock & unlock band"
            subtitle={`>${fmtGw(HEADLINE.globalQueueStalledGw)} stalled; unlock ${fmtGw(HEADLINE.unlockTotalGwLow)}–${fmtGw(HEADLINE.unlockTotalGwHigh)}`}
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={queueBars} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="gw" name="GW" radius={4}>
                    {queueBars.map((q) => (
                      <Cell key={q.id} fill={q.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Delay-risk share remains ~{fmtPct(HEADLINE.delayRiskPct)} of
              planned DC projects unless grid risks are addressed (carried IEA
              meter).
            </p>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        {SOURCES.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
