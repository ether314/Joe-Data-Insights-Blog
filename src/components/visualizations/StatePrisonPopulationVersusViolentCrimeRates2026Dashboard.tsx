"use client";

import { useMemo, useState } from "react";
import {
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
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ANALYTICS,
  HEADLINE,
  NATIONAL_SERIES,
  PATH_COUNTS,
  PATH_LABELS,
  PATH_OPTIONS,
  REGION_AGGS,
  REGION_OPTIONS,
  SOURCE_NOTE,
  TOP_ALIGNED_DOWN,
  TOP_DECOUPLE,
  filterStates,
  type PathFilter,
  type RegionFilter,
} from "@/data/state-prison-population-versus-violent-crime-rates-2026-data";

type Panel =
  | "national-dual"
  | "path-buckets"
  | "delta-scatter"
  | "region-means"
  | "ratio-bars"
  | "decouple-leaders";

type AxisMode = "deltas" | "levels2022" | "ratios";

const COLORS = {
  prison: "#1e3a5f",
  violent: "#b45309",
  bothDown: "#0f766e",
  decouple: "#9f1239",
  bothUp: "#7c2d12",
  other: "#64748b",
  grid: "#e2e8f0",
  ref: "#94a3b8",
};

const PANEL_LABELS: { id: Panel; label: string }[] = [
  { id: "national-dual", label: "National dual path" },
  { id: "path-buckets", label: "Path buckets" },
  { id: "delta-scatter", label: "Δ scatter" },
  { id: "region-means", label: "Region means" },
  { id: "ratio-bars", label: "Custody intensity" },
  { id: "decouple-leaders", label: "Decouple leaders" },
];

const AXIS_LABELS: { id: AxisMode; label: string }[] = [
  { id: "deltas", label: "2010→2022 %Δ" },
  { id: "levels2022", label: "2022 levels" },
  { id: "ratios", label: "Prison÷violent" },
];

const PATH_COLOR: Record<string, string> = {
  both_down: COLORS.bothDown,
  prison_down_crime_up: COLORS.decouple,
  both_up: COLORS.bothUp,
  prison_up_crime_down: "#1d4ed8",
  prison_down_crime_flat: "#64748b",
  crime_down_prison_flat: "#0e7490",
  prison_up_crime_flat: "#a16207",
  crime_up_prison_flat: "#c2410c",
  both_flat: "#94a3b8",
};

function fmtPct(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

function fmtRate(n: number) {
  return n.toFixed(0);
}

export function StatePrisonPopulationVersusViolentCrimeRates2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("national-dual");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [path, setPath] = useState<PathFilter>("all");
  const [axisMode, setAxisMode] = useState<AxisMode>("deltas");
  const [showDecoupleOnly, setShowDecoupleOnly] = useState(false);

  const states = useMemo(() => {
    const p: PathFilter = showDecoupleOnly ? "prison_down_crime_up" : path;
    return filterStates(region, p);
  }, [region, path, showDecoupleOnly]);

  const scatterRows = useMemo(
    () =>
      states.map((r) => ({
        abbr: r.abbr,
        state: r.state,
        x:
          axisMode === "deltas"
            ? r.prisonDeltaPct
            : axisMode === "levels2022"
              ? r.prison2022
              : r.ratio2022,
        y:
          axisMode === "deltas"
            ? r.violentDeltaPct
            : axisMode === "levels2022"
              ? r.violent2022
              : r.ratio2010,
        path: r.path,
        z: Math.max(40, Math.abs(r.prisonDeltaPct) + Math.abs(r.violentDeltaPct)),
        prisonDeltaPct: r.prisonDeltaPct,
        violentDeltaPct: r.violentDeltaPct,
      })),
    [states, axisMode],
  );

  const ratioRows = useMemo(
    () =>
      [...states]
        .sort((a, b) => b.ratio2022 - a.ratio2022)
        .slice(0, 15)
        .map((r) => ({
          abbr: r.abbr,
          ratio2010: r.ratio2010,
          ratio2022: r.ratio2022,
          path: r.path,
        })),
    [states],
  );

  const pathBars = useMemo(
    () =>
      PATH_COUNTS.map((p) => ({
        ...p,
        short: PATH_LABELS[p.path].replace(" / ", "/"),
        fill: PATH_COLOR[p.path] ?? COLORS.other,
      })).sort((a, b) => b.count - a.count),
    [],
  );

  const regionBars = useMemo(
    () =>
      REGION_AGGS.map((r) => ({
        region: r.region,
        prison: r.meanPrisonDeltaPct,
        violent: r.meanViolentDeltaPct,
        decouple: r.prisonDownCrimeUp,
      })),
    [],
  );

  const leaderRows = useMemo(() => {
    const src = showDecoupleOnly || path === "prison_down_crime_up"
      ? TOP_DECOUPLE
      : path === "both_down"
        ? TOP_ALIGNED_DOWN
        : TOP_DECOUPLE;
    return src
      .filter((r) => region === "all" || r.region === region)
      .map((r) => ({
        abbr: r.abbr,
        prison: r.prisonDeltaPct,
        violent: r.violentDeltaPct,
      }));
  }, [region, path, showDecoupleOnly]);

  const xLabel =
    axisMode === "deltas"
      ? "Prison rate %Δ 2010→2022"
      : axisMode === "levels2022"
        ? "Prison rate 2022 (per 100k)"
        : "Prison÷violent 2022";
  const yLabel =
    axisMode === "deltas"
      ? "Violent rate %Δ 2010→2022"
      : axisMode === "levels2022"
        ? "Violent rate 2022 (per 100k)"
        : "Prison÷violent 2010";

  return (
    <figure
      className="not-prose my-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      data-viz="state-prison-population-versus-violent-crime-rates-2026"
    >
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {ANALYTICS.smokeMarker}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-900 sm:text-base">
          National prison rate {HEADLINE.nationalPrisonDeltaPct}% (500→355 per 100k) while
          violent crime {HEADLINE.nationalViolentDeltaPct}% —{" "}
          {HEADLINE.statesPrisonDownCrimeUp} states cut custody as violence rose
        </p>
        <p className="mt-1 text-xs text-slate-600">
          Median state prison Δ {fmtPct(HEADLINE.medianStatePrisonDeltaPct)}; median violent Δ{" "}
          {fmtPct(HEADLINE.medianStateViolentDeltaPct)}. Flat band ±{HEADLINE.flatBandPct}%.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">
        {PANEL_LABELS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPanel(p.id)}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
              panel === p.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-2.5 sm:px-5">
        {REGION_OPTIONS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRegion(r.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              region === r.id
                ? "bg-teal-800 text-white"
                : "bg-teal-50 text-teal-900 hover:bg-teal-100"
            }`}
          >
            {r.label}
          </button>
        ))}
        {PATH_OPTIONS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setPath(p.id);
              setShowDecoupleOnly(false);
            }}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              !showDecoupleOnly && path === p.id
                ? "bg-amber-800 text-white"
                : "bg-amber-50 text-amber-900 hover:bg-amber-100"
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowDecoupleOnly((v) => !v)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
            showDecoupleOnly
              ? "bg-rose-800 text-white"
              : "bg-rose-50 text-rose-900 hover:bg-rose-100"
          }`}
        >
          Decouple only
        </button>
        {AXIS_LABELS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setAxisMode(a.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              axisMode === a.id
                ? "bg-indigo-800 text-white"
                : "bg-indigo-50 text-indigo-900 hover:bg-indigo-100"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="px-2 py-4 sm:px-4">
        <div className="h-[360px] w-full sm:h-[420px]">
          {panel === "national-dual" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={NATIONAL_SERIES} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="prison"
                  tick={{ fontSize: 11 }}
                  domain={[320, 520]}
                  label={{ value: "Prison /100k", angle: -90, position: "insideLeft", fontSize: 11 }}
                />
                <YAxis
                  yAxisId="violent"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  domain={[340, 420]}
                  label={{ value: "Violent /100k", angle: 90, position: "insideRight", fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v) => [fmtRate(Number(v)), ""]}
                  labelFormatter={(y) => `Year ${y}`}
                />
                <Legend />
                <Line
                  yAxisId="prison"
                  type="monotone"
                  dataKey="prisonRate"
                  name="Imprisonment rate"
                  stroke={COLORS.prison}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="violent"
                  type="monotone"
                  dataKey="violentRate"
                  name="Violent crime rate"
                  stroke={COLORS.violent}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {panel === "path-buckets" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pathBars} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="short" width={140} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => [`${Number(v)} states`, "Count"]} />
                <Bar dataKey="count" name="States" radius={[0, 4, 4, 0]}>
                  {pathBars.map((p) => (
                    <Cell key={p.path} fill={p.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {panel === "delta-scatter" && (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="x"
                  tick={{ fontSize: 11 }}
                  label={{ value: xLabel, position: "insideBottom", offset: -4, fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="y"
                  tick={{ fontSize: 11 }}
                  label={{ value: yLabel, angle: -90, position: "insideLeft", fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="z" range={[40, 180]} />
                {axisMode === "deltas" && (
                  <>
                    <ReferenceLine x={0} stroke={COLORS.ref} strokeDasharray="4 4" />
                    <ReferenceLine y={0} stroke={COLORS.ref} strokeDasharray="4 4" />
                  </>
                )}
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => [
                    axisMode === "deltas" ? fmtPct(Number(v)) : Number(v).toFixed(2),
                    name === "x" ? xLabel : yLabel,
                  ]}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as
                      | { state?: string; path?: keyof typeof PATH_LABELS }
                      | undefined;
                    return p?.state
                      ? `${p.state} (${PATH_LABELS[p.path!]})`
                      : "";
                  }}
                />
                <Scatter data={scatterRows} name="States">
                  {scatterRows.map((r) => (
                    <Cell key={r.abbr} fill={PATH_COLOR[r.path] ?? COLORS.other} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          )}

          {panel === "region-means" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionBars} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <ReferenceLine y={0} stroke={COLORS.ref} />
                <Tooltip
                  formatter={(v, name) =>
                    name === "decouple"
                      ? [`${Number(v)} states`, "Prison↓/crime↑"]
                      : [fmtPct(Number(v)), String(name)]
                  }
                />
                <Legend />
                <Bar dataKey="prison" name="Mean prison %Δ" fill={COLORS.prison} radius={[4, 4, 0, 0]} />
                <Bar dataKey="violent" name="Mean violent %Δ" fill={COLORS.violent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {panel === "ratio-bars" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratioRows} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="abbr" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v, name) => [Number(v).toFixed(2), String(name)]} />
                <Legend />
                <Bar dataKey="ratio2010" name="Prison÷violent 2010" fill={COLORS.other} radius={[4, 4, 0, 0]} />
                <Bar dataKey="ratio2022" name="Prison÷violent 2022" fill={COLORS.prison} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {panel === "decouple-leaders" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leaderRows} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="abbr" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <ReferenceLine y={0} stroke={COLORS.ref} />
                <Tooltip formatter={(v, name) => [fmtPct(Number(v)), String(name)]} />
                <Legend />
                <Bar dataKey="prison" name="Prison %Δ" fill={COLORS.prison} radius={[4, 4, 0, 0]} />
                <Bar dataKey="violent" name="Violent %Δ" fill={COLORS.decouple} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <figcaption className="border-t border-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-500 sm:px-5">
        {SOURCE_NOTE} Showing {states.length} of {HEADLINE.panelStates} states
        {region !== "all" ? ` · ${region}` : ""}
        {showDecoupleOnly || path !== "all"
          ? ` · ${showDecoupleOnly ? "Prison↓ / crime↑" : PATH_OPTIONS.find((p) => p.id === path)?.label}`
          : ""}
        .
      </figcaption>
    </figure>
  );
}
