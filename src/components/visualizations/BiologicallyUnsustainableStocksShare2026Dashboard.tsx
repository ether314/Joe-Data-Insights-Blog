"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
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
  AREA_ROWS,
  BENCHMARK_ROWS,
  CENSUS_CONTRAST,
  COLORS,
  COMPOSITION_2021,
  HEADLINE,
  SOURCE_NOTE,
  VIZ_MARKERS,
  WEIGHT_LENS,
  areasForBasin,
  fmtPct,
  fmtPp,
  pathForMetric,
  sortedAreas,
  type OceanBasin,
} from "@/data/biologically-unsustainable-stocks-share-2026-data";

// viz-types: path area+line, area ladder bars, composition pie, weight dual-area, benchmark bars, census scatter

type ViewId = "path" | "areas" | "composition" | "benchmarks";
type MetricLens = "unsustainable" | "sustainable";
type SortMode = "unsustainable-desc" | "sustainable-desc" | "code";

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
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        ) : null}
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
      <div className="flex flex-wrap gap-1">
        {options.map((o) => {
          const active = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MeterStrip() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[
        {
          k: "Unsustainable stock %",
          v: fmtPct(HEADLINE.unsustainablePct2021),
          s: `2021 equal-stock share (was ${fmtPct(HEADLINE.unsustainablePct2019)} in 2019)`,
        },
        {
          k: "Since 1974",
          v: fmtPp(HEADLINE.deltaPp1974to2021),
          s: `From ${fmtPct(HEADLINE.unsustainablePct1974, 0)} overfished in 1974`,
        },
        {
          k: "Landings-weighted sustainable",
          v: fmtPct(HEADLINE.landingsWeightedSustainablePct2021),
          s: "Larger stocks pull this above the 62.3% stock-count print",
        },
        {
          k: "2019→2021 move",
          v: fmtPp(HEADLINE.deltaPp2019to2021),
          s: "Still rising on the SOFIA panel",
        },
      ].map((m) => (
        <div
          key={m.k}
          className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white px-4 py-3"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {m.k}
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
            {m.v}
          </p>
          <p className="mt-1 text-xs text-slate-500">{m.s}</p>
        </div>
      ))}
    </div>
  );
}

function PathPanel({ metric }: { metric: MetricLens }) {
  const data = useMemo(() => pathForMetric(metric), [metric]);
  const stroke =
    metric === "unsustainable" ? COLORS.unsustainable : COLORS.sustainable;
  const fill =
    metric === "unsustainable"
      ? "rgba(220,38,38,0.18)"
      : "rgba(14,165,233,0.18)";

  return (
    <ChartCard
      title="Stock-count path"
      subtitle={`${
        metric === "unsustainable" ? "Unsustainable" : "Sustainable"
      } share of assessed marine stocks, 1974–2021 (SOFIA panel)`}
    >
      <div className="h-[340px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              formatter={(value) => [
                fmtPct(Number(value)),
                metric === "unsustainable" ? "Unsustainable" : "Sustainable",
              ]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill={fill}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={stroke}
              strokeWidth={2.5}
              dot={{ r: 3, fill: stroke }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Early decades include chart-approximate midpoints; 2013–2021 prints are
        SOFIA-disclosed.
      </p>
    </ChartCard>
  );
}

function AreasPanel({
  basin,
  metric,
  sortMode,
}: {
  basin: OceanBasin;
  metric: MetricLens;
  sortMode: SortMode;
}) {
  const rows = useMemo(() => {
    const base = areasForBasin(basin);
    if (sortMode === "code") {
      return [...base].sort((a, b) => a.areaCode - b.areaCode);
    }
    if (sortMode === "sustainable-desc") {
      return sortedAreas(base, "sustainable", "desc");
    }
    return sortedAreas(base, "unsustainable", "desc");
  }, [basin, sortMode]);

  const chartData = rows.map((r) => ({
    name: r.shortLabel,
    value: metric === "unsustainable" ? r.unsustainablePct : r.sustainablePct,
    fill:
      metric === "unsustainable"
        ? r.unsustainablePct >= 50
          ? COLORS.unsustainable
          : "#f87171"
        : r.sustainablePct >= 70
          ? COLORS.sustainable
          : "#7dd3fc",
  }));

  return (
    <ChartCard
      title="Area ladder"
      subtitle={`FAO Major Fishing Areas, 2021 — ${
        metric === "unsustainable" ? "unsustainable" : "sustainable"
      } stock share`}
    >
      <div className="h-[420px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
          >
            <CartesianGrid
              stroke={COLORS.grid}
              strokeDasharray="3 3"
              horizontal={false}
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={118}
              tick={{ fontSize: 10 }}
            />
            <Tooltip formatter={(value) => [fmtPct(Number(value)), "Share"]} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive={false}>
              {chartData.map((d) => (
                <Cell key={d.name} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Showing {rows.length} of {AREA_ROWS.length} assessed areas
        {basin !== "all" ? ` (${basin})` : ""}.
      </p>
    </ChartCard>
  );
}

function CompositionPanel() {
  const weightPath = useMemo(() => {
    const years = [2017, 2019, 2021];
    return years.map((year) => {
      const sc = WEIGHT_LENS.find(
        (w) => w.year === year && w.lens === "stock-count",
      )!;
      const lw = WEIGHT_LENS.find(
        (w) => w.year === year && w.lens === "landings-weighted",
      )!;
      return {
        year,
        stockCountUnsustainable: sc.unsustainablePct,
        landingsWeightedUnsustainable: lw.unsustainablePct,
      };
    });
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard
        title="Composition split"
        subtitle="2021 assessed stocks: overfished vs maximally fished vs underfished"
      >
        <div className="h-[300px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={COMPOSITION_2021}
                dataKey="pct"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={96}
                paddingAngle={2}
                isAnimationActive={false}
              >
                {COMPOSITION_2021.map((s) => (
                  <Cell key={s.id} fill={s.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => fmtPct(Number(value))} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
      <ChartCard
        title="Weight dual path"
        subtitle="Unsustainable % — equal-stock count vs landings-weighted"
      >
        <div className="h-[300px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={weightPath}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis
                domain={[0, 45]}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(value, name) => [
                  fmtPct(Number(value)),
                  name === "stockCountUnsustainable"
                    ? "Stock-count"
                    : "Landings-weighted",
                ]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="stockCountUnsustainable"
                name="Stock-count"
                stroke={COLORS.unsustainable}
                fill="rgba(220,38,38,0.12)"
                strokeWidth={2}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="landingsWeightedUnsustainable"
                name="Landings-weighted"
                stroke={COLORS.landings}
                fill="rgba(5,150,105,0.12)"
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}

function BenchmarksPanel() {
  const scatterData = CENSUS_CONTRAST.map((c) => ({
    name: c.label,
    unsustainable: c.unsustainablePct,
    landingsWeightedSustainable: c.landingsWeightedSustainablePct,
    size: typeof c.stocksAssessed === "number" ? c.stocksAssessed / 40 : 12,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard
        title="Management contrast"
        subtitle="Sustainable stock share — world vs managed cohorts (2021)"
      >
        <div className="h-[320px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={BENCHMARK_ROWS}
              margin={{ top: 8, right: 8, left: 0, bottom: 48 }}
            >
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                interval={0}
                angle={-18}
                textAnchor="end"
                tick={{ fontSize: 10 }}
                height={60}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(value) => [fmtPct(Number(value)), "Sustainable"]}
              />
              <Bar
                dataKey="sustainablePct"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              >
                {BENCHMARK_ROWS.map((r) => (
                  <Cell key={r.id} fill={r.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
      <ChartCard
        title="Census scatter"
        subtitle="SOFIA panel vs 2025 Review — do not splice as one time series"
      >
        <div className="h-[320px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 12, left: 4, bottom: 8 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="unsustainable"
                name="Unsustainable %"
                domain={[30, 42]}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                type="number"
                dataKey="landingsWeightedSustainable"
                name="Landings-weighted sustainable %"
                domain={[74, 80]}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
              />
              <ZAxis type="number" dataKey="size" range={[120, 400]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name) => [
                  fmtPct(Number(value)),
                  String(name),
                ]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.name ?? ""
                }
              />
              <Scatter
                data={scatterData}
                fill={COLORS.sustainable}
                isAnimationActive={false}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}

export function BiologicallyUnsustainableStocksShare2026Dashboard() {
  const [view, setView] = useState<ViewId>("path");
  const [metric, setMetric] = useState<MetricLens>("unsustainable");
  const [basin, setBasin] = useState<OceanBasin>("all");
  const [sortMode, setSortMode] = useState<SortMode>("unsustainable-desc");

  return (
    <div
      className="space-y-4"
      data-viz="biologically-unsustainable-stocks-share-2026"
    >
      <p className="text-sm font-semibold text-slate-800">
        Unsustainable stock %
      </p>
      <p className="sr-only">{VIZ_MARKERS.join(" · ")}</p>
      <MeterStrip />

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Panel
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900"
              value={view}
              onChange={(e) => setView(e.target.value as ViewId)}
            >
              <option value="path">Stock-count path</option>
              <option value="areas">Area ladder</option>
              <option value="composition">Composition split</option>
              <option value="benchmarks">Management contrast</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Metric lens
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900"
              value={metric}
              onChange={(e) => setMetric(e.target.value as MetricLens)}
            >
              <option value="unsustainable">Unsustainable %</option>
              <option value="sustainable">Sustainable %</option>
            </select>
          </label>
          {view === "areas" ? (
            <>
              <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ocean basin
                <select
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900"
                  value={basin}
                  onChange={(e) => setBasin(e.target.value as OceanBasin)}
                >
                  <option value="all">All areas</option>
                  <option value="atlantic">Atlantic</option>
                  <option value="pacific">Pacific</option>
                  <option value="indian">Indian</option>
                  <option value="mediterranean">Med + Black Sea</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Sort
                <select
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900"
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                >
                  <option value="unsustainable-desc">Unsustainable ↓</option>
                  <option value="sustainable-desc">Sustainable ↓</option>
                  <option value="code">FAO area code</option>
                </select>
              </label>
            </>
          ) : null}
        </div>
        <ToggleGroup
          label="Quick metric"
          value={metric}
          options={[
            { id: "unsustainable", label: "Unsustainable" },
            { id: "sustainable", label: "Sustainable" },
          ]}
          onChange={setMetric}
        />
      </div>

      {view === "path" ? <PathPanel metric={metric} /> : null}
      {view === "areas" ? (
        <AreasPanel basin={basin} metric={metric} sortMode={sortMode} />
      ) : null}
      {view === "composition" ? <CompositionPanel /> : null}
      {view === "benchmarks" ? <BenchmarksPanel /> : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
