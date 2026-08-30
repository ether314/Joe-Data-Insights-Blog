"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
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
  AGENCY_GAP,
  ANNUAL,
  ERA_COMPARE,
  HEADLINE,
  HOT_TERCILES,
  ROLLING_5YR,
  SOURCE_NOTE,
  VIZ_MARKERS,
  filterAnnual,
} from "@/data/cdc-heat-related-deaths-versus-noaa-extreme-heat-days-2026-data";

// viz-types: dual-axis composed (deaths + hot footprint), scatter,
// rolling-mean areas, era radar, agency-gap bars, tercile bars
// | layout: default
// smoke-marker: Heat deaths vs CONUS hot-summer footprint

type ViewId = "dual" | "scatter" | "rolling" | "era" | "agency" | "tercile";

const NAVY = "#0f172a";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const TEAL = "#0d9488";
const SLATE = "#64748b";
const SKY = "#0284c7";

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
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            value === o.id
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function CdcHeatRelatedDeathsVersusNoaaExtremeHeatDays2026Dashboard() {
  const [view, setView] = useState<ViewId>("dual");
  const [yearMin, setYearMin] = useState(1999);
  const [showNights, setShowNights] = useState(true);
  const [deathMetric, setDeathMetric] = useState<"cdc" | "nws">("cdc");

  const rows = useMemo(
    () => filterAnnual(yearMin, 2023),
    [yearMin],
  );

  const dualData = useMemo(
    () =>
      rows.map((r) => ({
        year: r.year,
        deaths: deathMetric === "cdc" ? r.heatDeaths : r.nwsHeatFatalities,
        hotHigh: r.hotHighPct,
        hotLow: r.hotLowPct,
        anom: r.summerTmaxAnomF,
      })),
    [rows, deathMetric],
  );

  const scatterData = useMemo(
    () =>
      rows.map((r) => ({
        x: r.hotHighPct,
        y: r.heatDeaths,
        year: r.year,
        z: Math.max(40, Math.min(220, 40 + r.hotLowPct * 2)),
        post: r.year >= 2016,
      })),
    [rows],
  );

  const rollingData = useMemo(
    () => ROLLING_5YR.filter((r) => r.endYear >= yearMin),
    [yearMin],
  );

  const eraRadar = useMemo(
    () => [
      {
        metric: "Mean deaths (idx)",
        pre: Math.round((ERA_COMPARE[0].meanDeaths / HEADLINE.post2016MeanDeaths) * 100),
        post: 100,
      },
      {
        metric: "Hot highs % (idx)",
        pre: Math.round(
          (ERA_COMPARE[0].meanHotHighPct / ERA_COMPARE[1].meanHotHighPct) * 100,
        ),
        post: 100,
      },
      {
        metric: "Hot nights % (idx)",
        pre: Math.round(
          (ERA_COMPARE[0].meanHotLowPct / ERA_COMPARE[1].meanHotLowPct) * 100,
        ),
        post: 100,
      },
      {
        metric: "Tmax anom (idx)",
        pre: Math.round(
          (ERA_COMPARE[0].meanTmaxAnomF / ERA_COMPARE[1].meanTmaxAnomF) * 100,
        ),
        post: 100,
      },
      {
        metric: "NWS fatalities (idx)",
        pre: Math.round(
          (ERA_COMPARE[0].meanNwsFatalities / ERA_COMPARE[1].meanNwsFatalities) *
            100,
        ),
        post: 100,
      },
    ],
    [],
  );

  const agencyData = useMemo(
    () =>
      AGENCY_GAP.filter((r) => r.year >= yearMin).map((r) => ({
        year: String(r.year),
        cdc: r.cdcDeaths,
        nws: r.nwsFatalities,
        gap: r.gap,
      })),
    [yearMin],
  );

  const tercileData = useMemo(
    () =>
      HOT_TERCILES.map((t) => ({
        name: t.label,
        deaths: t.meanDeaths,
        hot: t.meanHotHighPct,
      })),
    [],
  );

  return (
    <div
      className="w-full space-y-4"
      data-viz="cdc-heat-related-deaths-versus-noaa-extreme-heat-days-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
        <p className="text-sm font-semibold text-slate-900">
          {VIZ_MARKERS[0]} — {HEADLINE.peakDeaths.toLocaleString()} CDC-coded
          heat deaths in {HEADLINE.peakYear} (+{HEADLINE.peakVsStartPct}% vs{" "}
          {HEADLINE.startYear}); post-{HEADLINE.joinpointYear} mean deaths{" "}
          {HEADLINE.post2016MeanDeaths} vs {HEADLINE.pre2016MeanDeaths} earlier
        </p>
        <p className="mt-1 text-xs text-slate-500">{SOURCE_NOTE}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          options={[
            { id: "dual", label: "Deaths vs footprint" },
            { id: "scatter", label: "Scatter" },
            { id: "rolling", label: "5-yr means" },
            { id: "era", label: "Era radar" },
            { id: "agency", label: "CDC vs NWS" },
            { id: "tercile", label: "Hot terciles" },
          ]}
          value={view}
          onChange={setView}
        />
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            From
            <select
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm"
              value={yearMin}
              onChange={(e) => setYearMin(Number(e.target.value))}
            >
              {[1999, 2005, 2010, 2016].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          {view === "dual" && (
            <>
              <ToggleGroup
                options={[
                  { id: "cdc", label: "CDC deaths" },
                  { id: "nws", label: "NWS fatalities" },
                ]}
                value={deathMetric}
                onChange={setDeathMetric}
              />
              <button
                type="button"
                onClick={() => setShowNights((v) => !v)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  showNights
                    ? "bg-sky-700 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {showNights ? "Hot nights on" : "Hot nights off"}
              </button>
            </>
          )}
        </div>
      </div>

      {view === "dual" && (
        <ChartCard
          title="Heat deaths and Contiguous U.S. extreme-heat footprint"
          subtitle="Bars: mortality tally · Lines: % of CONUS with unusually hot summer highs (and nights)"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dualData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  label={{ value: deathMetric === "cdc" ? "Deaths" : "NWS fatalities", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  unit="%"
                  label={{ value: "% CONUS", angle: 90, position: "insideRight", style: { fontSize: 11 } }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="deaths"
                  name={deathMetric === "cdc" ? "CDC heat deaths" : "NWS heat fatalities"}
                  fill={deathMetric === "cdc" ? ROSE : AMBER}
                  opacity={0.85}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="hotHigh"
                  name="Unusually hot summer highs %"
                  stroke={NAVY}
                  strokeWidth={2.5}
                  dot={false}
                />
                {showNights && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="hotLow"
                    name="Unusually hot summer nights %"
                    stroke={SKY}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Do hotter footprints coincide with more heat deaths?"
          subtitle="X: % CONUS unusually hot summer highs · Y: CDC heat deaths · Bubble size: hot-night footprint · Rose = post-2016"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Hot highs %"
                  unit="%"
                  tick={{ fontSize: 11 }}
                  label={{ value: "Hot summer highs % of CONUS", position: "insideBottom", offset: -2, style: { fontSize: 11 } }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Deaths"
                  tick={{ fontSize: 11 }}
                  label={{ value: "CDC heat deaths", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
                />
                <ZAxis type="number" dataKey="z" range={[40, 220]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Year" data={scatterData}>
                  {scatterData.map((d) => (
                    <Cell
                      key={d.year}
                      fill={d.post ? ROSE : TEAL}
                      fillOpacity={0.75}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "rolling" && (
        <ChartCard
          title="Five-year trailing means"
          subtitle="Smooths single-year heat-wave spikes while preserving the post-2016 lift in deaths and hot nights"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={rollingData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="endYear" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} unit="%" />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="deaths5yr"
                  name="5-yr mean CDC deaths"
                  fill={ROSE}
                  fillOpacity={0.25}
                  stroke={ROSE}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="hotHigh5yr"
                  name="5-yr mean hot highs %"
                  stroke={NAVY}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="hotLow5yr"
                  name="5-yr mean hot nights %"
                  stroke={SKY}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "era" && (
        <ChartCard
          title="Pre- vs post-2016 joinpoint (indexed)"
          subtitle="Post-2016 era = 100 on each axis. Hot nights and CDC deaths rise together more than hot daytime highs alone."
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={eraRadar}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Radar
                  name="1999–2015"
                  dataKey="pre"
                  stroke={TEAL}
                  fill={TEAL}
                  fillOpacity={0.25}
                />
                <Radar
                  name="2016–2023"
                  dataKey="post"
                  stroke={ROSE}
                  fill={ROSE}
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "agency" && (
        <ChartCard
          title="CDC vital-statistics heat deaths vs NWS Storm Data fatalities"
          subtitle="Same hazard language, different capture — NVSS multiple-cause coding runs far above operational Storm Data counts"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={agencyData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="cdc" name="CDC heat deaths" fill={ROSE} />
                <Bar dataKey="nws" name="NWS heat fatalities" fill={AMBER} />
                <Line
                  type="monotone"
                  dataKey="gap"
                  name="Gap (CDC − NWS)"
                  stroke={SLATE}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "tercile" && (
        <ChartCard
          title="Mean CDC heat deaths by extreme-heat footprint tercile"
          subtitle="Years grouped by unusually-hot summer highs share of CONUS — hotter footprints average higher mortality"
        >
          <div className="h-[340px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={tercileData} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="deaths" name="Mean CDC deaths" fill={ROSE} barSize={22} />
                <Bar dataKey="hot" name="Mean hot-highs %" fill={NAVY} barSize={14} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Window sample: {ANNUAL.length} years · Pearson r (hot highs % vs deaths) ≈{" "}
            {HEADLINE.pearsonHotDeaths}
          </p>
        </ChartCard>
      )}
    </div>
  );
}
