"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  GLASS_PARTICIPATION,
  GLOBAL_BSI_COMBOS,
  HEADLINE,
  METRIC_OPTIONS,
  PEAK_CELLS,
  REGION_SHORT,
  REGIONAL_BSI,
  SOURCE_NOTE,
  TREND_ROWS,
  US_COMPARATOR,
  VIZ_MARKER,
  fmtPct,
  rankedRegionsBy,
  type MetricKey,
} from "@/data/who-glass-bloodstream-resistance-2026-data";

// viz-types: peak bars, region bars+radar, trend scatter+lines, US dual bars | controls: view + metric/filter

type ViewId = "peaks" | "regions" | "trends" | "us";
type FilterId = "all" | "lastline" | "firstchoice";

const COLORS = [
  "#0ea5e9",
  "#f97316",
  "#a855f7",
  "#22c55e",
  "#e11d48",
  "#eab308",
  "#64748b",
];

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

export function WhoGlassBloodstreamResistance2026Dashboard() {
  const [view, setView] = useState<ViewId>("peaks");
  const [metric, setMetric] = useState<MetricKey>("aciCarb");
  const [filter, setFilter] = useState<FilterId>("all");

  const peakData = useMemo(() => {
    let rows = PEAK_CELLS;
    if (filter === "lastline") {
      rows = rows.filter((r) => /imipenem|carbapenem/i.test(r.drug));
    } else if (filter === "firstchoice") {
      rows = rows.filter((r) => /3GC|cefotaxime|methicillin/i.test(r.drug));
    }
    return rows.map((r) => ({
      name: `${r.pathogen.split(" ")[0]} · ${REGION_SHORT[r.geography as keyof typeof REGION_SHORT] ?? r.geography.replace(/ Region$/, "").slice(0, 12)}`,
      full: `${r.pathogen} · ${r.drug} · ${r.geography}`,
      pct: r.pct,
      rank: r.rank,
    }));
  }, [filter]);

  const regionBars = useMemo(() => rankedRegionsBy(metric), [metric]);

  const radarData = useMemo(() => {
    const keys: MetricKey[] = [
      "aciCarb",
      "kpneuCarb",
      "ecoliCarb",
      "kpneu3gc",
      "ecoli3gc",
      "mrsa",
    ];
    return keys.map((k) => {
      const opt = METRIC_OPTIONS.find((m) => m.id === k)!;
      const row: Record<string, string | number> = { metric: opt.label };
      for (const r of REGIONAL_BSI) {
        row[REGION_SHORT[r.region]] = r[k];
      }
      return row;
    });
  }, []);

  const trendScatter = useMemo(
    () =>
      TREND_ROWS.map((t) => ({
        name: `${t.pathogen.split(" ")[0]} · ${t.drug.split(" ")[0]}`,
        annual: t.annualPctChange,
        level: t.resistance2023,
        trend: t.trend,
      })),
    [],
  );

  const participation = useMemo(
    () =>
      [...GLASS_PARTICIPATION]
        .map((p) => ({
          short: REGION_SHORT[p.region],
          pct: p.reportedPct,
          n: `${p.reported}/${p.members}`,
        }))
        .sort((a, b) => b.pct - a.pct),
    [],
  );

  const globalCombos = useMemo(() => {
    let rows = GLOBAL_BSI_COMBOS;
    if (filter === "lastline") rows = rows.filter((r) => r.lastLine);
    if (filter === "firstchoice") rows = rows.filter((r) => !r.lastLine);
    return [...rows].sort((a, b) => b.pct - a.pct);
  }, [filter]);

  const usBars = useMemo(
    () =>
      US_COMPARATOR.filter((u) => !u.metric.startsWith("WHO")).map((u) => ({
        name: u.metric.replace("Invasive E. coli — ", "E. coli · "),
        label: u.value,
        // parse rough midpoint for viz
        pct: parseFloat(u.value.replace(/[~>%]/g, "")) || 0,
      })),
    [],
  );

  const metricLabel =
    METRIC_OPTIONS.find((m) => m.id === metric)?.label ?? metric;

  return (
    <div
      className="space-y-6"
      data-viz="who-glass-bloodstream-resistance-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 px-5 py-5 text-white sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300/90">
          {VIZ_MARKER}
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
          WHO GLASS 2023 bloodstream isolates: Acinetobacter carbapenem resistance{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.acinetobacterCarbPct)}
          </span>{" "}
          globally; African E. coli 3GC{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.ecoli3gcAfricaPct)}
          </span>
          ; SE Asia K. pneumoniae carbapenem{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.kpneuCarbSeAsiaPct)}
          </span>
          . Toggle peak cells, regional heat, trend slope, or US comparator.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup<ViewId>
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "peaks", label: "Peak cells" },
            { id: "regions", label: "Regions" },
            { id: "trends", label: "Trends" },
            { id: "us", label: "US vs GLASS" },
          ]}
        />
        {view === "regions" ? (
          <ToggleGroup<MetricKey>
            label="Metric"
            value={metric}
            onChange={setMetric}
            options={METRIC_OPTIONS.map((m) => ({
              id: m.id,
              label: m.lastLine ? `${m.label} ★` : m.label,
            }))}
          />
        ) : view === "peaks" || view === "trends" ? (
          <ToggleGroup<FilterId>
            label="Filter"
            value={filter}
            onChange={setFilter}
            options={[
              { id: "all", label: "All drugs" },
              { id: "lastline", label: "Last-line ★" },
              { id: "firstchoice", label: "First-choice" },
            ]}
          />
        ) : null}
      </div>

      {view === "peaks" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Highest resistant-isolate shares"
            subtitle="Pathogen × drug × WHO region peak cells (GLASS 2023)"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={peakData}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={118}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v)), "Resistant share"]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.full ?? ""
                    }
                  />
                  <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                    {peakData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Global BSI scoreboard"
            subtitle="Adjusted % resistant among bloodstream isolates"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={globalCombos}
                  margin={{ top: 8, right: 12, left: 0, bottom: 64 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    interval={0}
                    angle={-28}
                    textAnchor="end"
                    tick={{ fontSize: 10 }}
                    height={70}
                  />
                  <YAxis
                    domain={[0, 70]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, p) => [
                      `${fmtPct(Number(v))} (${p?.payload?.lo}–${p?.payload?.hi})`,
                      "Resistant",
                    ]}
                  />
                  <Bar dataKey="pct" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "regions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={`Regional ranking · ${metricLabel}`}
            subtitle="WHO region bloodstream % (★ = last-line carbapenem)"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={48}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v)), metricLabel]}
                    labelFormatter={(_, p) => p?.[0]?.payload?.region ?? ""}
                  />
                  <Bar dataKey="pct" fill="#f97316" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Multi-metric radar · six regions"
            subtitle="Same axes: carbapenems + 3GC + MRSA"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fontSize: 9, fill: "#475569" }}
                  />
                  <Radar
                    name="AFR"
                    dataKey="AFR"
                    stroke="#e11d48"
                    fill="#e11d48"
                    fillOpacity={0.15}
                  />
                  <Radar
                    name="SEAR"
                    dataKey="SEAR"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.12}
                  />
                  <Radar
                    name="EMR"
                    dataKey="EMR"
                    stroke="#a855f7"
                    fill="#a855f7"
                    fillOpacity={0.1}
                  />
                  <Radar
                    name="EUR"
                    dataKey="EUR"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.08}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-center text-xs text-slate-500">
              AFR · SEAR · EMR · EUR overlays — Americas / WPR omitted for
              readability
            </p>
          </ChartCard>
        </div>
      )}

      {view === "trends" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Slope vs level"
            subtitle="X = 2023 % resistant · Y = median annual % change 2018–2023"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="level"
                    name="2023 %"
                    unit="%"
                    domain={[0, 60]}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="annual"
                    name="Annual Δ"
                    unit="%"
                    domain={[-5, 20]}
                    tick={{ fontSize: 11 }}
                  />
                  <ZAxis range={[80, 80]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
                      name === "annual" ? "Annual change" : "2023 level",
                    ]}
                    labelFormatter={(_, p) => p?.[0]?.payload?.name ?? ""}
                  />
                  <Scatter data={trendScatter} fill="#0ea5e9">
                    {trendScatter.map((d, i) => (
                      <Cell
                        key={i}
                        fill={d.trend === "Increasing" ? "#e11d48" : "#64748b"}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Red = increasing trend · gray = stable. Carbapenem tips sit mid/low
              on level but high on slope.
            </p>
          </ChartCard>

          <ChartCard
            title="Annual change bars"
            subtitle="Population-weighted median annual % change"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={TREND_ROWS.filter((t) =>
                    filter === "lastline"
                      ? /Imipenem/i.test(t.drug)
                      : filter === "firstchoice"
                        ? !/Imipenem/i.test(t.drug)
                        : true,
                  )}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[-15, 20]} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="pathogen"
                    width={110}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v) => [
                      `${Number(v).toFixed(1)}%/yr`,
                      "Annual change",
                    ]}
                  />
                  <Bar
                    dataKey="annualPctChange"
                    fill="#a855f7"
                    radius={[0, 4, 4, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="resistance2023"
                    stroke="transparent"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "us" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="US invasive E. coli (CDC EIP)"
            subtitle="National comparator — different sampling frame than GLASS"
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={usBars}
                  margin={{ top: 8, right: 12, left: 0, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    tick={{ fontSize: 10 }}
                    height={56}
                  />
                  <YAxis domain={[0, 80]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v), 0), "Approx share"]}
                  />
                  <Bar dataKey="pct" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="GLASS reporting coverage 2023"
            subtitle="% of WHO Member States submitting AMR data"
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={participation}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis type="category" dataKey="short" width={48} />
                  <Tooltip
                    formatter={(v, _n, p) => [
                      `${fmtPct(Number(v))} (${p?.payload?.n})`,
                      "Reported",
                    ]}
                  />
                  <Bar dataKey="pct" fill="#eab308" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
