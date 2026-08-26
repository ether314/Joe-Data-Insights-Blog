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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  ANALYTICS,
  DECADE_COMPARE,
  HEADLINE,
  METRO_SCATTER,
  PEAK_DAYS,
  SEVERITY_MIX,
  SOURCE_NOTE,
  STATE_LADDER,
  VINTAGE_PATH,
  VIZ_MARKERS,
  fmtM,
  metrosByRegion,
  regionSeasonSlice,
  statesByRegion,
  type RegionId,
} from "@/data/epa-pm2-5-smoke-days-versus-population-2026-data";

// viz-types: vintage stacked area+mean line, decade compare bars,
// state ladder bars, metro days scatter, peak-day stacked bars,
// severity mix dual bars, region season composed | layout: default
// smoke-marker: Person-days unhealthy AQI

type ViewId = "vintage" | "decade" | "states" | "metros" | "peaks" | "severity";
type RegionFilter = "all" | RegionId;
type StateMetric = "recent" | "y2023" | "delta";
type SeasonYear = 2018 | 2020 | 2023;

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const ORANGE = "#ea580c";
const RED = "#dc2626";
const PURPLE = "#7c3aed";
const HAZARD = "#7f1d1d";

const REGION_COLORS: Record<string, string> = {
  West: AMBER,
  Midwest: TEAL,
  South: ROSE,
  Northeast: INDIGO,
};

const BAND_COLORS = {
  usg: ORANGE,
  unhealthy: RED,
  veryUnhealthy: PURPLE,
  hazardous: HAZARD,
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
      <div className="border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        ) : null}
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  );
}

function ToggleRow<T extends string>({
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
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              value === o.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function EpaPm25SmokeDaysVersusPopulation2026Dashboard() {
  const [view, setView] = useState<ViewId>("vintage");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [stateMetric, setStateMetric] = useState<StateMetric>("recent");
  const [seasonYear, setSeasonYear] = useState<SeasonYear>(2023);

  const stateRows = useMemo(() => {
    const rows = [...statesByRegion(region)];
    rows.sort((a, b) => {
      if (stateMetric === "y2023") return b.y2023M - a.y2023M;
      if (stateMetric === "delta")
        return b.meanRecentM - b.mean2010sM - (a.meanRecentM - a.mean2010sM);
      return b.meanRecentM - a.meanRecentM;
    });
    return rows.slice(0, 12).map((r) => ({
      ...r,
      value:
        stateMetric === "y2023"
          ? r.y2023M
          : stateMetric === "delta"
            ? r.meanRecentM - r.mean2010sM
            : r.meanRecentM,
      label:
        stateMetric === "y2023"
          ? "2023 person-days"
          : stateMetric === "delta"
            ? "Recent − 2010s"
            : "Recent mean",
    }));
  }, [region, stateMetric]);

  const metroRows = useMemo(() => metrosByRegion(region), [region]);

  const regionSeason = useMemo(
    () => regionSeasonSlice(seasonYear),
    [seasonYear],
  );

  const vintageChart = useMemo(
    () =>
      VINTAGE_PATH.map((v) => ({
        year: String(v.year),
        USG: v.usgM,
        Unhealthy: v.unhealthyM,
        "Very unhealthy": v.veryUnhealthyM,
        Hazardous: v.hazardousM,
        meanPm25: v.meanPm25,
        total: v.personDaysM,
      })),
    [],
  );

  const severityChart = useMemo(
    () =>
      SEVERITY_MIX.map((s) => ({
        band: s.band,
        "2010s share": s.share2010sPct,
        "Recent share": s.shareRecentPct,
      })),
    [],
  );

  return (
    <div
      className="space-y-4"
      data-viz="epa-pm2-5-smoke-days-versus-population-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-4 text-white sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wider text-teal-300">
          {VIZ_MARKERS[0]}
        </p>
        <p className="mt-1 text-lg font-semibold leading-snug sm:text-xl">
          Recent seasons average {fmtM(HEADLINE.recentMeanM)} person-days above
          USG AQI — {HEADLINE.recentVs2010sMultiple}× the 2010s mean of{" "}
          {fmtM(HEADLINE.decade2010sMeanM)}
        </p>
        <p className="mt-2 max-w-3xl text-xs text-slate-300 sm:text-sm">
          Desk join of EPA AirNow/AQS daily PM2.5 (≥35 µg/m³) with NOAA HMS smoke
          and Census population. June–September seasons. Monitored areas cover ~
          {HEADLINE.monitoredPopSharePct}% of U.S. population.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-200">
          <span className="rounded bg-white/10 px-2 py-1">
            2023: {fmtM(HEADLINE.year2023M)} person-days
          </span>
          <span className="rounded bg-white/10 px-2 py-1">
            {VIZ_MARKERS[2]}: {HEADLINE.peakDayPopM}M above USG
          </span>
          <span className="rounded bg-white/10 px-2 py-1">
            {VIZ_MARKERS[1]}: {HEADLINE.recentVs2010sMultiple}×
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleRow
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "vintage", label: "Season path" },
            { id: "decade", label: "Decade gap" },
            { id: "states", label: "State ladder" },
            { id: "metros", label: "Metro scatter" },
            { id: "peaks", label: "Peak days" },
            { id: "severity", label: "Severity mix" },
          ]}
        />
        <ToggleRow
          label="Region"
          value={region}
          onChange={setRegion}
          options={[
            { id: "all", label: "All" },
            { id: "West", label: "West" },
            { id: "Midwest", label: "Midwest" },
            { id: "South", label: "South" },
            { id: "Northeast", label: "Northeast" },
          ]}
        />
      </div>

      {view === "vintage" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Person-days by AQI band (JJAS)"
            subtitle="Stacked millions of person-days ≥USG with HMS smoke; line = network mean PM2.5"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={vintageChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => fmtM(Number(v))}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    domain={[8, 16]}
                    unit=" µg"
                  />
                  <Tooltip />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="USG"
                    stackId="1"
                    fill={BAND_COLORS.usg}
                    stroke={BAND_COLORS.usg}
                    fillOpacity={0.85}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="Unhealthy"
                    stackId="1"
                    fill={BAND_COLORS.unhealthy}
                    stroke={BAND_COLORS.unhealthy}
                    fillOpacity={0.85}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="Very unhealthy"
                    stackId="1"
                    fill={BAND_COLORS.veryUnhealthy}
                    stroke={BAND_COLORS.veryUnhealthy}
                    fillOpacity={0.85}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="Hazardous"
                    stackId="1"
                    fill={BAND_COLORS.hazardous}
                    stroke={BAND_COLORS.hazardous}
                    fillOpacity={0.9}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="meanPm25"
                    name="Mean PM2.5"
                    stroke={TEAL}
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title={`Regional person-days · ${seasonYear}`}
            subtitle="West dominated 2018–2020; 2023 pulled Midwest & Northeast into the smoke ledger"
          >
            <ToggleRow
              label="Season"
              value={String(seasonYear) as `${SeasonYear}`}
              onChange={(v) => setSeasonYear(Number(v) as SeasonYear)}
              options={[
                { id: "2018", label: "2018" },
                { id: "2020", label: "2020" },
                { id: "2023", label: "2023" },
              ]}
            />
            <div className="mt-2 h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={regionSeason} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => fmtM(Number(v))}
                  />
                  <YAxis
                    type="category"
                    dataKey="region"
                    width={72}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="personDaysM" name="Person-days (M)" barSize={18}>
                    {regionSeason.map((r) => (
                      <Cell
                        key={r.region}
                        fill={REGION_COLORS[r.region] ?? SLATE}
                      />
                    ))}
                  </Bar>
                  <Line
                    type="monotone"
                    dataKey="peakDayPopM"
                    name="Peak-day pop (M)"
                    stroke={NAVY}
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {view === "decade" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title={VIZ_MARKERS[1]}
            subtitle="Mean annual person-days ≥USG — recent window vs 2010s"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DECADE_COMPARE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="decade" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => fmtM(Number(v))}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="meanPersonDaysM"
                    name="Mean person-days (M)"
                    fill={TEAL}
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="peakPersonDaysM"
                    name="Peak year (M)"
                    fill={ROSE}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="How the decades differ"
            subtitle="Same threshold (35 µg/m³); different geography and plume reach"
          >
            <ul className="space-y-3 text-sm text-slate-700">
              {DECADE_COMPARE.map((d) => (
                <li
                  key={d.decade}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <span className="font-semibold text-slate-900">
                    {d.decade}
                  </span>
                  <span className="mt-1 block text-xs text-slate-600">
                    Mean {fmtM(d.meanPersonDaysM)} · peak {d.peakYear} at{" "}
                    {fmtM(d.peakPersonDaysM)} · mean peak-day pop{" "}
                    {d.meanPeakDayPopM}M · very-unhealthy+ share{" "}
                    {d.shareVeryUnhealthyPlusPct}%
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              2020 and 2023 each exceeded the combined unhealthy population-weighted
              day stack of 2000–2019 in published federal-network exposure work —
              the desk person-day series mirrors that step-change.
            </p>
          </ChartCard>
        </div>
      ) : null}

      {view === "states" ? (
        <ChartCard
          title="State person-day ladder"
          subtitle="Filter by region; toggle recent mean, 2023, or decade delta"
        >
          <ToggleRow
            label="Metric"
            value={stateMetric}
            onChange={setStateMetric}
            options={[
              { id: "recent", label: "Recent mean" },
              { id: "y2023", label: "2023" },
              { id: "delta", label: "Recent − 2010s" },
            ]}
          />
          <div className="mt-2 h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateRows} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => fmtM(Number(v))}
                />
                <YAxis
                  type="category"
                  dataKey="abbr"
                  width={36}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Bar dataKey="value" name="Person-days (M)" radius={[0, 4, 4, 0]}>
                  {stateRows.map((r) => (
                    <Cell
                      key={r.abbr}
                      fill={REGION_COLORS[r.region] ?? SLATE}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "metros" ? (
        <ChartCard
          title="Metro smoke days vs population"
          subtitle="X = recent median JJAS days ≥USG; Y = 2010s days; bubble = 2023 person-days"
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="daysRecent"
                  name="Recent days"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Recent median smoke days ≥USG",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="days2010s"
                  name="2010s days"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "2010s days",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <ZAxis
                  type="number"
                  dataKey="personDays2023M"
                  range={[60, 400]}
                />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={metroRows} name="Metros">
                  {metroRows.map((m) => (
                    <Cell
                      key={m.metro}
                      fill={REGION_COLORS[m.region] ?? SLATE}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Western metros sit high on both axes (persistent local fire seasons).
            Large Eastern metros jumped on the x-axis in 2023 via Canadian transport
            even with low 2010s baselines. Full panel: {METRO_SCATTER.length} metros
            {region !== "all" ? ` · filter ${region}` : ""}.
          </p>
        </ChartCard>
      ) : null}

      {view === "peaks" ? (
        <ChartCard
          title={VIZ_MARKERS[2]}
          subtitle="Single-day population above USG AQI on landmark plume days"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PEAK_DAYS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}M`}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="usgM"
                  stackId="a"
                  name="USG"
                  fill={BAND_COLORS.usg}
                />
                <Bar
                  dataKey="unhealthyM"
                  stackId="a"
                  name="Unhealthy"
                  fill={BAND_COLORS.unhealthy}
                />
                <Bar
                  dataKey="veryUnhealthyM"
                  stackId="a"
                  name="Very unhealthy"
                  fill={BAND_COLORS.veryUnhealthy}
                />
                <Bar
                  dataKey="hazardousM"
                  stackId="a"
                  name="Hazardous"
                  fill={BAND_COLORS.hazardous}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {PEAK_DAYS.map((p) => (
              <li
                key={p.date}
                className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600"
              >
                <span className="font-semibold text-slate-900">
                  {p.label} · {p.totalAboveUsgM}M
                </span>
                <span className="mt-0.5 block">{p.note}</span>
              </li>
            ))}
          </ul>
        </ChartCard>
      ) : null}

      {view === "severity" ? (
        <ChartCard
          title="Severity mix of person-days"
          subtitle="Share of ≥USG person-days by AQI band — 2010s vs recent seasons"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="band" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="2010s share"
                  fill={SLATE}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Recent share"
                  fill={ROSE}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      <details className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
        <summary className="cursor-pointer font-medium text-slate-800">
          Sources & method
        </summary>
        <p className="mt-2 leading-relaxed">{SOURCE_NOTE}</p>
        <p className="mt-2 leading-relaxed">{ANALYTICS.method}</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          {ANALYTICS.caveats.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <p className="mt-2 text-slate-500">
          States in ladder: {STATE_LADDER.length}. Metros: {METRO_SCATTER.length}.
        </p>
      </details>
    </div>
  );
}
