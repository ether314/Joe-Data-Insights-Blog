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
  DEMAND_PATH,
  DUAL_LEDGER_PATH,
  GROWTH_CONCENTRATION_CURVE,
  GROWTH_SLICES,
  HEADLINE,
  LENS_COMPARE,
  LOCAL_INTENSITY,
  PACE_CLOCKS,
  PRICE_SHOCK,
  QUEUE_METERS,
  REGION_SHARES,
  SCOREBOARD,
  SOURCE_NOTE,
  SOURCES,
  STOCK_CONCENTRATION_CURVE,
  TOP_CLUSTERS,
  US_H1_SECTORS,
  US_QUEUE_TECH,
  US_SHARE_COMPARE,
  VINTAGE_DELTAS,
  fmtGw,
  fmtPct,
  fmtPp,
  fmtTwh,
  fmtYr,
} from "@/data/ai-power-grid-concentration-202608-data";

// viz-types: vintage delta bars, Lorenz area+line, US-share bars, growth donut, queue-tech pie, demand path line, H1 sector bars, price shock bars, dual-ledger line, cluster scatter, intensity bars, queue meters, pace clocks, lens scatter | layout: default

type ViewId = "scoreboard" | "perimeters" | "queues" | "pace";
type CurveLens = "stock" | "growth";
type ClusterMetric = "load" | "pipeline";
type QueueMetric = "gw" | "yoy";

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

export function AiPowerGridConcentration202608Dashboard() {
  const [view, setView] = useState<ViewId>("scoreboard");
  const [curveLens, setCurveLens] = useState<CurveLens>("stock");
  const [clusterMetric, setClusterMetric] = useState<ClusterMetric>("load");
  const [queueMetric, setQueueMetric] = useState<QueueMetric>("gw");
  const [showEqualLine, setShowEqualLine] = useState(true);

  const curve = useMemo(
    () =>
      curveLens === "growth"
        ? GROWTH_CONCENTRATION_CURVE
        : STOCK_CONCENTRATION_CURVE,
    [curveLens],
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

  const queuePie = useMemo(
    () =>
      US_QUEUE_TECH.filter((t) => t.id !== "other").map((t) => ({
        name: t.short,
        value: t.shareOfActivePct,
        fill: t.fill,
      })),
    [],
  );

  const queueBars = useMemo(
    () =>
      US_QUEUE_TECH.map((t) => ({
        ...t,
        value: queueMetric === "yoy" ? t.yoyPct : t.gw,
      })),
    [queueMetric],
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

  const vintageBars = useMemo(
    () =>
      VINTAGE_DELTAS.filter((v) => v.direction !== "scope").map((v) => ({
        ...v,
        label: v.metric.length > 20 ? `${v.metric.slice(0, 18)}…` : v.metric,
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

  const regionBars = useMemo(
    () => [...REGION_SHARES].sort((a, b) => b.sharePct - a.sharePct),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="ai-power-grid-concentration-202608"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">
          AI power & grid — late-Aug 202608 concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Top-1 still {fmtPct(HEADLINE.top1SharePct)} / Top-3 still{" "}
          {fmtPct(HEADLINE.top3SharePct)} — Aug moves the queue tip, not the
          stock ladder
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Stock and growth ladders stay carried. Mid-Year softens US demand to{" "}
          {fmtPct(HEADLINE.usYoy2026Pct, 1)} while services/DC stay the growth
          tip; LBNL restates US active interconnection at{" "}
          {fmtGw(HEADLINE.usActiveTotalGw)} (−
          {Math.abs(HEADLINE.usQueueYoyPct)}% y/y) with gas in queue{" "}
          {fmtPp(HEADLINE.usGasQueueYoyPct)} to {fmtGw(HEADLINE.usGasQueueGw)}.
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
              US active queue
            </p>
            <p className="mt-1 text-xl font-bold text-violet-300">
              {fmtGw(HEADLINE.usActiveTotalGw)}
            </p>
            <p className="text-xs text-slate-400">
              LBNL · {HEADLINE.usQueueYoyPct}% y/y
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-3 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Gas in queue
            </p>
            <p className="mt-1 text-xl font-bold text-rose-300">
              {fmtGw(HEADLINE.usGasQueueGw)}
            </p>
            <p className="text-xs text-slate-400">
              {fmtPp(HEADLINE.usGasQueueYoyPct)} y/y
            </p>
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
            { id: "queues", label: "Queues & tech" },
            { id: "pace", label: "Pace & local" },
          ]}
        />
      </div>

      {view === "scoreboard" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Vintage delta — Q3 → Aug"
            subtitle="Flat share ladders vs Mid-Year and LBNL path meters"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vintageBars} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="q3" name="Q3" fill="#94a3b8" radius={4} />
                  <Bar dataKey="aug" name="Aug" fill="#8b5cf6" radius={4} />
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
                    fill="#8b5cf633"
                    stroke="#8b5cf6"
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
            subtitle="Carried stock vs Aug LBNL queue-tech tip"
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
                        {row.id === "usQueue" ? "—" : fmtPp(row.deltaTop1Pp)}
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
            subtitle="Stock, growth, US queue-tech, and local intensity"
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
            title="Regional stock ladder"
            subtitle="Carried IEA DC electricity shares — Top-3 = 85%"
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
            title="Dual-ledger path (carried)"
            subtitle={`2030 gap still ~${fmtTwh(HEADLINE.dualLedgerGapTwh)} — path meter, not share rewrite`}
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
                    connectNulls
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gartner"
                    name="Gartner TWh"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    connectNulls
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "queues" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="US queue tech mix"
            subtitle={`Active ${fmtGw(HEADLINE.usActiveTotalGw)} — solar still Top-1, gas the only major riser`}
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={queuePie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {queuePie.map((t) => (
                      <Cell key={t.name} fill={t.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
              {US_QUEUE_TECH.filter((t) => t.id !== "other").map((t) => (
                <li key={t.id} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: t.fill }}
                  />
                  {t.short} {fmtPct(t.shareOfActivePct, 1)} · {fmtGw(t.gw)}
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title="Queue tech — GW vs YoY"
            subtitle="Toggle: stock concentration vs growth concentration inside the queue"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Metric"
                value={queueMetric}
                onChange={setQueueMetric}
                options={[
                  { id: "gw", label: "GW stock" },
                  { id: "yoy", label: "YoY %" },
                ]}
              />
            </div>
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={queueBars} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" name={queueMetric === "yoy" ? "YoY %" : "GW"} radius={4}>
                    {queueBars.map((t) => (
                      <Cell key={t.id} fill={t.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Queue stock meters"
            subtitle="US active + IA backlog + gas tip + worldwide stalled (carried)"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={QUEUE_METERS}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={96}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="gw" name="GW" radius={4}>
                    {QUEUE_METERS.map((q) => (
                      <Cell key={q.id} fill={q.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Mid-Year demand path"
            subtitle="World accelerates; US softens then re-accelerates — DC still the tip"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={DEMAND_PATH} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 5]}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="worldYoyPct"
                    name="World YoY"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="usYoyPct"
                    name="US YoY"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="US H1 2026 sector split"
            subtitle="Services (incl. DCs) +3% while residential −1.7% — growth concentration inside soft totals"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={US_H1_SECTORS}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[-3, 4]}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={88}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="yoyPct" name="H1 YoY %" radius={4}>
                    {US_H1_SECTORS.map((s) => (
                      <Cell key={s.id} fill={s.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Wholesale price geography (Q2)"
            subtitle="Hormuz shock concentrates price pain in EU/Japan — US flat"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PRICE_SHOCK} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip />
                  <Bar dataKey="q2YoyPct" name="Q2 YoY %" radius={4}>
                    {PRICE_SHOCK.map((p) => (
                      <Cell key={p.id} fill={p.fill} />
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
            subtitle={`Median IR→COD now ${fmtYr(HEADLINE.usMedianIrToCodYears)} (LBNL 2026)`}
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={PACE_CLOCKS}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}y`}
                    domain={[0, 8]}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={96}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="years" name="Years" radius={4}>
                    {PACE_CLOCKS.map((p) => (
                      <Cell
                        key={p.id}
                        fill={p.kind === "demand" ? "#0ea5e9" : "#f43f5e"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Local intensity"
            subtitle="Global ~1.5% coexists with Virginia 25% / Ireland 20%"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={intensityBars}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 30]}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={88}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="dcShareOfElectricityPct"
                    name="DC share %"
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

          <ChartCard
            title="Top clusters"
            subtitle="Toggle IT load share vs pipeline intensity"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Y-axis"
                value={clusterMetric}
                onChange={setClusterMetric}
                options={[
                  { id: "load", label: "Global load %" },
                  { id: "pipeline", label: "Pipeline %" },
                ]}
              />
            </div>
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: 8, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="IT load GW"
                    tick={{ fontSize: 11 }}
                    unit=" GW"
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name={
                      clusterMetric === "pipeline"
                        ? "Pipeline %"
                        : "Global share %"
                    }
                    tick={{ fontSize: 11 }}
                    unit="%"
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 360]} />
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
            title="Sources & confidence"
            subtitle="Disclosed Aug meters vs carried share ladders"
          >
            <p className="text-sm leading-relaxed text-slate-600">
              {SOURCE_NOTE}
            </p>
            <ul className="mt-4 space-y-1.5 text-sm">
              {SOURCES.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    className="text-violet-700 underline-offset-2 hover:underline"
                    target={s.url.startsWith("http") ? "_blank" : undefined}
                    rel={
                      s.url.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}
    </div>
  );
}
