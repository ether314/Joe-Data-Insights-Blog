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
  ANNUAL_COHORT_SERIES,
  CITY_PANEL,
  DECREE_ERA_SUMMARY,
  HEADLINE,
  OUTCOME_MIX,
  SOURCE_NOTE,
  VIZ_MARKERS,
  YEARS_SINCE_DECREE_CURVE,
  citiesByRegion,
  cityScatterRows,
  dualMetricRows,
  fmtCount,
  fmtPct,
  type Region,
} from "@/data/combined-sewer-overflow-events-after-epa-consent-decrees-2026-data";

// viz-types: outcome donut, years-since dual line, city cut bars, annual composed,
// era summary bars, rain-vs-cut scatter | layout: default
// smoke-marker: Overflow events vs decree baseline

type Panel =
  | "outcomes"
  | "trajectory"
  | "cities"
  | "annual"
  | "eras"
  | "scatter";

type Metric = "events" | "perInch";

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const SKY = "#0284c7";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const GRID = "#e2e8f0";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  outcomes: {
    title: "How deep did event cuts go?",
    subtitle: `${HEADLINE.citiesInPanel}-city panel — median event cut ${HEADLINE.medianEventCutPct}%; rain-normalized median only ${HEADLINE.medianRainNormCutPct}%`,
  },
  trajectory: {
    title: "Years since decree: events fall faster than rain-normalized rates",
    subtitle:
      "Cohort median index (decree baseline = 100) — tunnels cut activations; wet weather still sets the floor",
  },
  cities: {
    title: "City-by-city: baseline vs recent overflow events",
    subtitle:
      "Toggle raw events vs events per inch of annual precipitation",
  },
  annual: {
    title: "2018–19 wet years erased a decade of quiet progress",
    subtitle:
      "Panel median event index vs precipitation anomaly (inches vs 1991–2020 normal)",
  },
  eras: {
    title: "Older decrees show deeper cuts — newer ones are still building",
    subtitle:
      "Median event and rain-normalized cuts by decree-entry cohort",
  },
  scatter: {
    title: "Did wetter recent windows erase the cut?",
    subtitle:
      "X = change in mean precip (″); Y = event change % — bubble = baseline events",
  },
};

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
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function ControlChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

const REGIONS: Array<Region | "all"> = [
  "all",
  "Great Lakes",
  "Ohio Valley",
  "Mid-Atlantic",
  "Northeast",
  "Southeast",
];

const PANEL_BUTTONS: Array<{ id: Panel; label: string }> = [
  { id: "outcomes", label: "Outcome mix" },
  { id: "trajectory", label: "Years since decree" },
  { id: "cities", label: "City cuts" },
  { id: "annual", label: "Annual wet years" },
  { id: "eras", label: "Decree eras" },
  { id: "scatter", label: "Rain vs cut" },
];

export function CombinedSewerOverflowEventsAfterEpaConsentDecrees2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("outcomes");
  const [region, setRegion] = useState<Region | "all">("all");
  const [metric, setMetric] = useState<Metric>("events");

  const meta = PANEL_META[panel];

  const cityBars = useMemo(() => {
    const rows = citiesByRegion(region);
    if (metric === "events") {
      return rows.map((c) => ({
        city: c.city,
        baseline: c.baselineEvents,
        recent: c.recentEvents,
        changePct: c.eventChangePct,
      }));
    }
    return rows.map((c) => ({
      city: c.city,
      baseline: +c.baselineEventsPerIn.toFixed(2),
      recent: +c.recentEventsPerIn.toFixed(2),
      changePct: c.rainNormChangePct,
    }));
  }, [region, metric]);

  const scatter = useMemo(() => cityScatterRows(region), [region]);

  const dual = useMemo(() => dualMetricRows(metric), [metric]);

  return (
    <div
      className="w-full space-y-4"
      data-viz="combined-sewer-overflow-events-after-epa-consent-decrees-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-slate-900 px-5 py-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
          {VIZ_MARKERS[0]}
        </p>
        <p className="mt-1 text-lg font-bold sm:text-xl">
          Median city cut overflow events {HEADLINE.medianEventCutPct}% from
          decree baseline — rain-normalized rate only {HEADLINE.medianRainNormCutPct}%
        </p>
        <p className="mt-2 text-sm text-slate-300">
          {VIZ_MARKERS[1]} · {HEADLINE.wetYearReboundSharePct}% of the panel saw a
          recent wet year still above the decree-era annual mean · index now{" "}
          {HEADLINE.recentIndexVsBaseline} vs baseline 100
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PANEL_BUTTONS.map((b) => (
          <ControlChip
            key={b.id}
            active={panel === b.id}
            onClick={() => setPanel(b.id)}
          >
            {b.label}
          </ControlChip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Region
        </span>
        {REGIONS.map((r) => (
          <ControlChip
            key={r}
            active={region === r}
            onClick={() => setRegion(r)}
          >
            {r === "all" ? "All regions" : r}
          </ControlChip>
        ))}
      </div>

      {(panel === "cities" || panel === "scatter") && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Metric
          </span>
          <ControlChip
            active={metric === "events"}
            onClick={() => setMetric("events")}
          >
            Raw events
          </ControlChip>
          <ControlChip
            active={metric === "perInch"}
            onClick={() => setMetric("perInch")}
          >
            Events per inch
          </ControlChip>
        </div>
      )}

      <ChartCard title={meta.title} subtitle={meta.subtitle}>
        {panel === "outcomes" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[...OUTCOME_MIX]}
                    dataKey="cities"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {OUTCOME_MIX.map((d) => (
                      <Cell key={d.id} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, p) => [
                      `${Number(v)} cities (${(p?.payload as { sharePct?: number })?.sharePct ?? 0}%)`,
                      "Count",
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex flex-col justify-center space-y-3 text-sm text-slate-700">
              {OUTCOME_MIX.map((d) => (
                <li key={d.id} className="flex items-start gap-3">
                  <span
                    className="mt-1 inline-block h-3 w-3 shrink-0 rounded-sm"
                    style={{ background: d.color }}
                  />
                  <span>
                    <strong>{d.label}</strong> — {d.cities} of{" "}
                    {HEADLINE.citiesInPanel} ({d.sharePct}%)
                  </span>
                </li>
              ))}
              <li className="pt-2 text-slate-500">
                Deep cuts cluster in the earliest decree cities (Atlanta, DC,
                Louisville) where tunnels have been online longest.
              </li>
            </ul>
          </div>
        )}

        {panel === "trajectory" && (
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={[...YEARS_SINCE_DECREE_CURVE]}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis
                  domain={[60, 105]}
                  tick={{ fill: SLATE, fontSize: 12 }}
                  label={{
                    value: "Index (baseline=100)",
                    angle: -90,
                    position: "insideLeft",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="eventIndex"
                  name="Event index"
                  fill={TEAL}
                  fillOpacity={0.15}
                  stroke={TEAL}
                  strokeWidth={2.5}
                />
                <Line
                  type="monotone"
                  dataKey="rainNormIndex"
                  name="Events / inch index"
                  stroke={AMBER}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "cities" && (
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cityBars}
                layout="vertical"
                margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
              >
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fill: SLATE, fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="city"
                  width={100}
                  tick={{ fill: NAVY, fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v, name) => [
                    metric === "events"
                      ? fmtCount(Number(v))
                      : Number(v).toFixed(2),
                    String(name),
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="baseline"
                  name={metric === "events" ? "Baseline events" : "Baseline / in"}
                  fill={SLATE}
                  radius={[0, 2, 2, 0]}
                />
                <Bar
                  dataKey="recent"
                  name={metric === "events" ? "Recent events" : "Recent / in"}
                  fill={TEAL}
                  radius={[0, 2, 2, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-2 text-xs text-slate-500">
              Showing {cityBars.length} cities
              {region !== "all" ? ` in ${region}` : ""}. Change % range:{" "}
              {cityBars.length
                ? `${fmtPct(Math.min(...cityBars.map((c) => c.changePct)))} to ${fmtPct(Math.max(...cityBars.map((c) => c.changePct)))}`
                : "—"}
              . Dual-metric helper rows: {dual.length}.
            </p>
          </div>
        )}

        {panel === "annual" && (
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={[...ANNUAL_COHORT_SERIES]}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  domain={[60, 110]}
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: "Event index",
                    angle: -90,
                    position: "insideLeft",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: "Precip anomaly (″)",
                    angle: 90,
                    position: "insideRight",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="right"
                  dataKey="precipAnomalyIn"
                  name="Precip anomaly (″)"
                  fill={SKY}
                  opacity={0.45}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="eventIndex"
                  name="Median event index"
                  stroke={ROSE}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "eras" && (
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...DECREE_ERA_SUMMARY]}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="era" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis
                  tick={{ fill: SLATE, fontSize: 12 }}
                  label={{
                    value: "Median cut %",
                    angle: -90,
                    position: "insideLeft",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  formatter={(v, name) => [fmtPct(Number(v)), String(name)]}
                />
                <Legend />
                <Bar
                  dataKey="medianEventCutPct"
                  name="Event cut %"
                  fill={TEAL}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="medianRainNormCutPct"
                  name="Rain-norm cut %"
                  fill={AMBER}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "scatter" && (
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="precipDeltaIn"
                  name="Precip Δ"
                  unit="″"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: "Recent − baseline precip (″)",
                    position: "insideBottom",
                    offset: -2,
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey={
                    metric === "events" ? "eventChangePct" : "rainNormChangePct"
                  }
                  name="Change %"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: metric === "events" ? "Event change %" : "Rain-norm change %",
                    angle: -90,
                    position: "insideLeft",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <ZAxis
                  type="number"
                  dataKey="baselineEvents"
                  range={[60, 280]}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => {
                    const n = String(name);
                    if (n.includes("Change") || n.includes("change"))
                      return [fmtPct(Number(v)), n];
                    if (n.includes("Precip") || n.includes("precip"))
                      return [`${v}″`, n];
                    return [v as number | string, n];
                  }}
                  labelFormatter={(_, payload) =>
                    (payload?.[0]?.payload as { city?: string })?.city ?? ""
                  }
                />
                <Scatter name="Cities" data={scatter} fill={TEAL}>
                  {scatter.map((row) => (
                    <Cell
                      key={row.city}
                      fill={row.tunnelOrTankOnline ? TEAL : AMBER}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <p className="mt-2 text-xs text-slate-500">
              Teal = major tunnel/tank online; amber = still largely surface /
              green-infra phase. Panel n={CITY_PANEL.length}.
            </p>
          </div>
        )}
      </ChartCard>

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
