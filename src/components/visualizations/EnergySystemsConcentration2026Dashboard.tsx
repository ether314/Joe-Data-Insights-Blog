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
  CONCENTRATION_CURVE,
  DEMAND_LADDER,
  FUEL_EXPORT_STACK,
  HEADLINE,
  HHI_BANDS,
  IMPORT_EXPOSURE,
  LENS_LABELS,
  SOURCE_NOTE,
  filterRows,
  fmtHhi,
  fmtPct,
  hhiBand,
  lensExposures,
  sortedByMetric,
  type Lens,
} from "@/data/energy-systems-concentration-2026-data";

// viz-types: Top-k ladder bars, Lorenz area+line, fuel export stacks, HHI donut, import×fossil scatter, lens avg bars | layout: default

type ViewId = "ladder" | "demand" | "exports" | "exposure";
type Metric = "top1" | "top3" | "hhi";

const ROSE = "#f43f5e";
const AMBER = "#f59e0b";
const SKY = "#0ea5e9";
const TEAL = "#14b8a6";
const SLATE = "#64748b";

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

export function EnergySystemsConcentration2026Dashboard() {
  const [view, setView] = useState<ViewId>("ladder");
  const [metric, setMetric] = useState<Metric>("top1");
  const [lens, setLens] = useState<Lens | "all">("all");
  const [showEqual, setShowEqual] = useState(true);
  const [minTop1, setMinTop1] = useState(0);

  const filtered = useMemo(
    () => filterRows({ lens, minTop1 }),
    [lens, minTop1],
  );

  const ladderBars = useMemo(
    () => sortedByMetric(filtered, metric),
    [filtered, metric],
  );

  const hhiDonut = useMemo(() => {
    return HHI_BANDS.map((b) => ({
      ...b,
      count: filtered.filter((c) => hhiBand(c.hhi).id === b.id).length,
    })).filter((b) => b.count > 0);
  }, [filtered]);

  const lensBars = useMemo(() => lensExposures(filtered), [filtered]);

  const exportStack = useMemo(
    () =>
      FUEL_EXPORT_STACK.map((f) => ({
        fuel: f.fuel,
        top1: f.top1SharePct,
        top2: f.top2SharePct,
        top3: f.top3SharePct,
        rest: Math.max(0, 100 - f.top3BlocPct),
        bloc: f.top3BlocPct,
        fill: f.fill,
        labels: `${f.top1Label} / ${f.top2Label} / ${f.top3Label}`,
      })),
    [],
  );

  const exposureScatter = useMemo(
    () =>
      IMPORT_EXPOSURE.map((r) => ({
        ...r,
        x: r.importDependencePct,
        y: r.fossilPrimaryPct,
        z: Math.max(40, Math.sqrt(Math.abs(r.primaryEj)) * 18),
      })),
    [],
  );

  const demandBars = useMemo(
    () => DEMAND_LADDER.filter((d) => d.label !== "Rest of world"),
    [],
  );

  const metricLabel =
    metric === "top1"
      ? "Top-1 share %"
      : metric === "top3"
        ? "Top-3 share %"
        : "HHI";

  const metricValue = (row: (typeof ladderBars)[0]) =>
    metric === "top1"
      ? row.top1SharePct
      : metric === "top3"
        ? row.top3SharePct
        : row.hhi;

  return (
    <div
      className="space-y-6"
      data-viz="energy-systems-concentration-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Energy systems — concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Top-1 demand {HEADLINE.demandTop1Pct}% · Top-3{" "}
          {HEADLINE.demandTop3Pct}%
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          China alone is{" "}
          <span className="text-rose-300">
            ~{HEADLINE.demandTop1Pct}% of world primary energy
          </span>
          ; China + US + India clear{" "}
          <span className="text-amber-300">~{HEADLINE.demandTop3Pct}%</span>.
          Fuel export markets concentrate harder still — coal top-3 at{" "}
          {HEADLINE.coalExportTop3Pct}%, LNG at {HEADLINE.lngTop3Pct}% — while
          solar module manufacturing hits{" "}
          <span className="text-teal-300">
            ~{HEADLINE.solarModuleTop1Pct}% China
          </span>
          .
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "TPES Top-1",
              value: fmtPct(HEADLINE.demandTop1Pct, 1),
              sub: HEADLINE.demandTop1Label,
            },
            {
              label: "TPES Top-3",
              value: fmtPct(HEADLINE.demandTop3Pct, 1),
              sub: HEADLINE.demandTop3Labels,
            },
            {
              label: "Coal export Top-3",
              value: fmtPct(HEADLINE.coalExportTop3Pct),
              sub: "ID · AU · RU",
            },
            {
              label: "Solar modules Top-1",
              value: fmtPct(HEADLINE.solarModuleTop1Pct),
              sub: "China capacity",
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-3"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums">{k.value}</p>
              <p className="mt-0.5 text-xs text-slate-400">{k.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={view}
          options={[
            { id: "ladder", label: "Top-k ladder" },
            { id: "demand", label: "Demand curve" },
            { id: "exports", label: "Fuel exports" },
            { id: "exposure", label: "Import risk" },
          ]}
          onChange={setView}
        />
        <div className="flex flex-wrap items-center gap-3">
          <ToggleGroup
            label="Metric"
            value={metric}
            options={[
              { id: "top1", label: "Top-1" },
              { id: "top3", label: "Top-3" },
              { id: "hhi", label: "HHI" },
            ]}
            onChange={setMetric}
          />
          <ToggleGroup
            label="Lens"
            value={lens}
            options={[
              { id: "all", label: "All" },
              { id: "demand", label: "Demand" },
              { id: "export", label: "Export" },
              { id: "production", label: "Produce" },
              { id: "manufacturing", label: "Mfg" },
            ]}
            onChange={setLens}
          />
          <ToggleGroup
            label="Floor"
            value={String(minTop1) as "0" | "20" | "40"}
            options={[
              { id: "0", label: "Any" },
              { id: "20", label: "≥20%" },
              { id: "40", label: "≥40%" },
            ]}
            onChange={(v) => setMinTop1(Number(v))}
          />
        </div>
      </div>

      {view === "ladder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={`${metricLabel} by market`}
            subtitle={`${filtered.length} lenses · sorted descending`}
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ladderBars.map((r) => ({
                    ...r,
                    value: metricValue(r),
                    name: r.shortLabel,
                  }))}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    domain={
                      metric === "hhi" ? [0, "auto"] : [0, 100]
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      metric === "hhi" ? fmtHhi(Number(v ?? 0)) : fmtPct(Number(v ?? 0), 1)
                    }
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {ladderBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="HHI band mix"
            subtitle="How many filtered markets sit in each concentration band"
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hhiDonut}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {hhiDonut.map((b) => (
                      <Cell key={b.id} fill={b.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
              {hhiDonut.map((b) => (
                <li key={b.id} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: b.fill }}
                  />
                  {b.label}: {b.count}
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title="Average Top-1 by lens"
            subtitle="Demand vs export vs production vs manufacturing"
            >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={lensBars.map((l) => ({
                    ...l,
                    name: LENS_LABELS[l.lens],
                  }))}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    domain={[0, 100]}
                    unit="%"
                  />
                  <Tooltip
                    formatter={(v, name) =>
                      name === "avgTop1"
                        ? [fmtPct(Number(v ?? 0), 1), "Avg Top-1"]
                        : [fmtPct(Number(v ?? 0)), "Max Top-1"]
                    }
                  />
                  <Bar dataKey="avgTop1" fill={SKY} name="avgTop1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="maxTop1" fill={ROSE} name="maxTop1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Leader roster"
            subtitle="Top-1 country for each filtered market"
          >
            <div className="max-h-[280px] overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-white text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-2 pr-2">Market</th>
                    <th className="py-2 pr-2">Top-1</th>
                    <th className="py-2 text-right">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {ladderBars.map((r) => (
                    <tr key={r.id} className="border-t border-slate-100">
                      <td className="py-2 pr-2 font-medium text-slate-800">
                        {r.shortLabel}
                      </td>
                      <td className="py-2 pr-2 text-slate-600">
                        {r.top1Label}
                      </td>
                      <td className="py-2 text-right tabular-nums text-slate-900">
                        {fmtPct(r.top1SharePct, 1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "demand" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="World TPES concentration curve"
            subtitle="Cumulative share of primary energy demand vs equal-share line"
          >
            <div className="mb-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEqual((v) => !v)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  showEqual
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 text-slate-600"
                }`}
              >
                {showEqual ? "Hide equal line" : "Show equal line"}
              </button>
            </div>
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={CONCENTRATION_CURVE}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                  />
                  <Tooltip
                    formatter={(v) => fmtPct(Number(v ?? 0), 1)}
                  />
                  <Area
                    type="monotone"
                    dataKey="sharePct"
                    fill={AMBER}
                    fillOpacity={0.25}
                    stroke={AMBER}
                    strokeWidth={2}
                    name="Cumulative"
                  />
                  {showEqual && (
                    <Line
                      type="monotone"
                      dataKey="equalPct"
                      stroke={SLATE}
                      strokeDasharray="6 4"
                      dot={false}
                      name="Equal"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Top demand countries"
            subtitle="Share of world TPES (EJ) — Rest of world excluded"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={demandBars}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                  />
                  <Tooltip
                    formatter={(v, name) =>
                      name === "sharePct"
                        ? [fmtPct(Number(v ?? 0), 1), "Share"]
                        : [v, "EJ"]
                    }
                  />
                  <Bar dataKey="sharePct" name="sharePct" radius={[4, 4, 0, 0]}>
                    {demandBars.map((d) => (
                      <Cell key={d.label} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Cumulative vs rank"
            subtitle="How fast the top of the distribution accumulates"
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={DEMAND_LADDER}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <Tooltip />
                  <Bar
                    yAxisId="left"
                    dataKey="sharePct"
                    fill={SKY}
                    name="Share %"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="cumulativePct"
                    stroke={ROSE}
                    strokeWidth={2}
                    name="Cumulative %"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Headline meters"
            subtitle="Demand concentration vs clean-tech manufacturing"
          >
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["TPES Top-1", fmtPct(HEADLINE.demandTop1Pct, 1)],
                ["TPES Top-3", fmtPct(HEADLINE.demandTop3Pct, 1)],
                ["Demand HHI", fmtHhi(HEADLINE.demandHhi)],
                ["Solar modules Top-1", fmtPct(HEADLINE.solarModuleTop1Pct)],
                ["Battery cells Top-1", fmtPct(HEADLINE.batteryCellTop1Pct)],
                ["Lenses tracked", String(HEADLINE.lensesTracked)],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3"
                >
                  <dt className="text-xs uppercase tracking-wide text-slate-500">
                    {k}
                  </dt>
                  <dd className="mt-1 text-lg font-bold tabular-nums text-slate-900">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </ChartCard>
        </div>
      )}

      {view === "exports" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Fuel export Top-1 / Top-2 / Top-3 stack"
            subtitle="Share of global export volumes by fuel market"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={exportStack}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="fuel"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                  />
                  <Tooltip />
                  <Bar dataKey="top1" stackId="a" fill={ROSE} name="Top-1" />
                  <Bar dataKey="top2" stackId="a" fill={AMBER} name="Top-2" />
                  <Bar dataKey="top3" stackId="a" fill={SKY} name="Top-3" />
                  <Bar
                    dataKey="rest"
                    stackId="a"
                    fill={SLATE}
                    name="Rest"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Top-3 bloc by fuel"
            subtitle="How concentrated is the export triopoly?"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={exportStack}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="fuel"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                  <Bar dataKey="bloc" name="Top-3 bloc" radius={[4, 4, 0, 0]}>
                    {exportStack.map((e) => (
                      <Cell key={e.fuel} fill={e.fill} />
                    ))}
                  </Bar>
                  <Line
                    type="monotone"
                    dataKey="top1"
                    stroke={ROSE}
                    strokeWidth={2}
                    name="Top-1 only"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Exporter labels"
            subtitle="Who sits in each fuel’s top three"
          >
            <ul className="space-y-3 text-sm">
              {FUEL_EXPORT_STACK.map((f) => (
                <li
                  key={f.id}
                  className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-3"
                >
                  <span className="font-semibold text-slate-900">{f.fuel}</span>
                  <span className="text-slate-600">
                    {f.top1Label} ({fmtPct(f.top1SharePct)}) · {f.top2Label} ·{" "}
                    {f.top3Label}
                  </span>
                  <span className="w-full text-xs text-slate-500">
                    Top-3 bloc {fmtPct(f.top3BlocPct)}
                  </span>
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title="Export vs manufacturing contrast"
            subtitle="Seaborne fuels are oligopolies; clean hardware is near-monopoly"
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      name: "Coal export",
                      top1: 35,
                      top3: 72,
                    },
                    { name: "LNG export", top1: 22, top3: 61 },
                    { name: "Oil export", top1: 15, top3: 38 },
                    {
                      name: "Solar modules",
                      top1: HEADLINE.solarModuleTop1Pct,
                      top3: 92,
                    },
                    {
                      name: "Battery cells",
                      top1: HEADLINE.batteryCellTop1Pct,
                      top3: 92,
                    },
                  ]}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={56}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                  <Bar dataKey="top1" fill={ROSE} name="Top-1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="top3" fill={TEAL} name="Top-3" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "exposure" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Import dependence × fossil primary share"
            subtitle="Bubble size ∝ √primary EJ — who is exposed at the top"
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 12, right: 16, left: 8, bottom: 12 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Import dep."
                    unit="%"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    label={{
                      value: "Import dependence %",
                      position: "insideBottom",
                      offset: -4,
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Fossil primary"
                    unit="%"
                    domain={[60, 100]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    label={{
                      value: "Fossil primary %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => {
                      if (name === "x" || name === "Import dep.")
                        return [fmtPct(Number(v ?? 0)), "Import dep."];
                      if (name === "y" || name === "Fossil primary")
                        return [fmtPct(Number(v ?? 0)), "Fossil primary"];
                      return [v, name];
                    }}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.shortLabel ?? ""
                    }
                  />
                  <Scatter data={exposureScatter}>
                    {exposureScatter.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Import dependence ranking"
            subtitle="Net exporters print negative; Japan / Korea sit at the top"
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...IMPORT_EXPOSURE].sort(
                    (a, b) => b.importDependencePct - a.importDependencePct,
                  )}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                  />
                  <YAxis
                    type="category"
                    dataKey="shortLabel"
                    width={72}
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                  <Bar dataKey="importDependencePct" radius={[0, 4, 4, 0]}>
                    {[...IMPORT_EXPOSURE]
                      .sort(
                        (a, b) =>
                          b.importDependencePct - a.importDependencePct,
                      )
                      .map((r) => (
                        <Cell
                          key={r.id}
                          fill={
                            r.importDependencePct < 0 ? TEAL : ROSE
                          }
                        />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Exposure callouts"
            subtitle="Headline importers vs surplus exporters"
          >
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Japan import dep.", fmtPct(HEADLINE.japanImportDepPct)],
                ["EU-27 import dep.", fmtPct(HEADLINE.euImportDepPct)],
                ["Coal export Top-1", "Indonesia 35%"],
                ["LNG export Top-1", "United States 22%"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3"
                >
                  <dt className="text-xs uppercase tracking-wide text-slate-500">
                    {k}
                  </dt>
                  <dd className="mt-1 text-base font-bold text-slate-900">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              High import dependence with high fossil primary share is the
              stress quadrant. Japan and Korea sit there; Australia and Saudi
              sit in the opposite corner as surplus exporters.
            </p>
          </ChartCard>

          <ChartCard
            title="Stance mix"
            subtitle="Count of tracked systems by trade stance"
          >
            <div className="h-[240px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Net importer",
                        value: IMPORT_EXPOSURE.filter(
                          (r) => r.tradeStance === "net-importer",
                        ).length,
                        fill: ROSE,
                      },
                      {
                        name: "Net exporter",
                        value: IMPORT_EXPOSURE.filter(
                          (r) => r.tradeStance === "net-exporter",
                        ).length,
                        fill: TEAL,
                      },
                      {
                        name: "Balanced",
                        value: IMPORT_EXPOSURE.filter(
                          (r) => r.tradeStance === "balanced",
                        ).length,
                        fill: SLATE,
                      },
                    ].filter((d) => d.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                  >
                    {[
                      ROSE,
                      TEAL,
                      SLATE,
                    ].map((c, i) => (
                      <Cell key={i} fill={c} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
