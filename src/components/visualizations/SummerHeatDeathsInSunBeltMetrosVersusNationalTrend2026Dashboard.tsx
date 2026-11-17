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
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ANALYTICS,
  BELT_STACK,
  HEADLINE,
  NATIONAL_SERIES,
  SOURCE_NOTE,
  VIZ_MARKERS,
  filterMetros,
  sortMetros,
  type MetroFilter,
  type SortMode,
} from "@/data/summer-heat-deaths-in-sun-belt-metros-versus-national-trend-2026-data";

type Panel = "share" | "trend" | "scatter" | "stack" | "table";

const COLORS = {
  phoenix: "#c2410c",
  vegas: "#b45309",
  desert: "#ea580c",
  humid: "#0e7490",
  other: "#64748b",
  national: "#1e3a5f",
  sunBelt: "#dc2626",
  rest: "#94a3b8",
  grid: "#e2e8f0",
  ink: "#0f172a",
};

const PANEL_LABELS: { id: Panel; label: string }[] = [
  { id: "share", label: "Metro share" },
  { id: "trend", label: "National trend" },
  { id: "scatter", label: "Rate vs heat" },
  { id: "stack", label: "Sun Belt stack" },
  { id: "table", label: "Detail table" },
];

const FILTER_LABELS: { id: MetroFilter; label: string }[] = [
  { id: "all", label: "All metros" },
  { id: "large", label: "Large only" },
  { id: "sun-belt", label: "Sun Belt" },
  { id: "desert", label: "Desert 100F+" },
];

const SORT_LABELS: { id: SortMode; label: string }[] = [
  { id: "deaths", label: "By deaths" },
  { id: "share", label: "By share" },
  { id: "rate", label: "By rate" },
];

function metroColor(id: string, state: string, summerHighF: number) {
  if (id === "phoenix") return COLORS.phoenix;
  if (id === "las-vegas") return COLORS.vegas;
  if (summerHighF >= 100) return COLORS.desert;
  if (["TX", "FL", "GA"].includes(state)) return COLORS.humid;
  return COLORS.other;
}

function fmtPct(n: number, digits = 1) {
  return `${n.toFixed(digits)}%`;
}

export function SummerHeatDeathsInSunBeltMetrosVersusNationalTrend2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("share");
  const [metroFilter, setMetroFilter] = useState<MetroFilter>("large");
  const [sortMode, setSortMode] = useState<SortMode>("deaths");

  const metros = useMemo(
    () => sortMetros(sortMode, filterMetros(metroFilter)),
    [metroFilter, sortMode],
  );

  const trendData = useMemo(
    () =>
      NATIONAL_SERIES.map((r) => ({
        year: r.year,
        deaths: r.deaths,
        aamr: r.aamrPer100k,
      })),
    [],
  );

  const scatterData = useMemo(
    () =>
      metros.map((m) => ({
        ...m,
        x: m.summerHighF,
        y: m.ratePer100kWindow,
        z: Math.max(40, Math.sqrt(m.deaths) * 8),
      })),
    [metros],
  );

  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      data-viz="summer-heat-deaths-in-sun-belt-metros-versus-national-trend-2026"
    >
      <div className="border-b border-slate-200 bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 px-4 py-5 text-white sm:px-6">
        <p className="text-xs font-medium uppercase tracking-wider text-orange-200/90">
          CDC heat-coded deaths · {HEADLINE.window}
        </p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
          {VIZ_MARKERS[0]}
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200">
          Phoenix and Las Vegas together account for{" "}
          <span className="font-semibold text-orange-200">
            {fmtPct(HEADLINE.top2SharePct)}
          </span>{" "}
          of U.S. heat-coded deaths in the window, while national counts rose
          from {HEADLINE.national2018.toLocaleString()} in 2018 to{" "}
          {HEADLINE.national2023.toLocaleString()} in 2023 (
          {HEADLINE.nationalRisePct}% ).
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat
            label="Phoenix share"
            value={fmtPct(HEADLINE.phoenixSharePct)}
          />
          <Stat
            label="Las Vegas share"
            value={fmtPct(HEADLINE.lasVegasSharePct)}
          />
          <Stat
            label="5-metro Sun Belt core"
            value={fmtPct(HEADLINE.coreSunBeltSharePct)}
          />
          <Stat
            label="U.S. 2023 deaths"
            value={HEADLINE.national2023.toLocaleString()}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3 sm:px-6">
        {PANEL_LABELS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPanel(p.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              panel === p.id
                ? "bg-orange-700 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {(panel === "share" || panel === "scatter" || panel === "table") && (
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3 sm:px-6">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Filter
          </span>
          {FILTER_LABELS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setMetroFilter(f.id)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                metroFilter === f.id
                  ? "bg-slate-800 text-white"
                  : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Sort
          </span>
          {SORT_LABELS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSortMode(s.id)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                sortMode === s.id
                  ? "bg-orange-100 text-orange-900 ring-1 ring-orange-300"
                  : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="px-4 py-5 sm:px-6">
        {panel === "share" && (
          <div>
            <h4 className="mb-1 text-sm font-semibold text-slate-800">
              {VIZ_MARKERS[0]}
            </h4>
            <p className="mb-4 text-xs text-slate-500">
              Horizontal bars: metro share of national {HEADLINE.window}{" "}
              heat-coded deaths ({HEADLINE.nationalPeriodDeaths.toLocaleString()}{" "}
              total).
            </p>
            <div className="h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metros}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    unit="%"
                    domain={[0, "auto"]}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={88}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, name) => {
                      const n = typeof v === "number" ? v : Number(v);
                      const label = String(name ?? "");
                      if (label === "shareOfNationalPct")
                        return [fmtPct(n, 2), "Share of U.S."];
                      if (label === "deaths") return [n, "Deaths"];
                      return [n, label];
                    }}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar
                    dataKey="shareOfNationalPct"
                    name="shareOfNationalPct"
                    radius={[0, 4, 4, 0]}
                  >
                    {metros.map((m) => (
                      <Cell
                        key={m.id}
                        fill={metroColor(m.id, m.state, m.summerHighF)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {panel === "trend" && (
          <div>
            <h4 className="mb-1 text-sm font-semibold text-slate-800">
              {VIZ_MARKERS[1]}
            </h4>
            <p className="mb-4 text-xs text-slate-500">
              Bars: annual heat-coded deaths. Line: age-adjusted rate per
              100,000.
            </p>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={trendData}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Deaths",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 11 },
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    domain={[0, 0.8]}
                  />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="deaths"
                    name="Heat-coded deaths"
                    fill={COLORS.national}
                    radius={[3, 3, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="aamr"
                    name="AAMR / 100k"
                    stroke={COLORS.phoenix}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {panel === "scatter" && (
          <div>
            <h4 className="mb-1 text-sm font-semibold text-slate-800">
              {VIZ_MARKERS[2]}
            </h4>
            <p className="mb-4 text-xs text-slate-500">
              X: NOAA summer daily high (°F). Y: crude heat-death rate per
              100k over the window. Bubble size ∝ deaths.
            </p>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 12, right: 20, left: 8, bottom: 12 }}
                >
                  <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Summer high"
                    unit="°F"
                    domain={[75, 112]}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Rate"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Rate / 100k (window)",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 11 },
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                          <div className="font-semibold">{d.short}</div>
                          <div>
                            {d.deaths} deaths · {fmtPct(d.shareOfNationalPct, 2)}{" "}
                            of U.S.
                          </div>
                          <div>
                            Rate {d.y.toFixed(2)} · summer high {d.x}°F
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={scatterData} name="Metros">
                    {scatterData.map((m) => (
                      <Cell
                        key={m.id}
                        fill={metroColor(m.id, m.state, m.summerHighF)}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {panel === "stack" && (
          <div>
            <h4 className="mb-1 text-sm font-semibold text-slate-800">
              {VIZ_MARKERS[3]}
            </h4>
            <p className="mb-4 text-xs text-slate-500">
              Attribution of national annual totals using the fixed period
              share of five large Sun Belt cores (Phoenix, Las Vegas, Tucson,
              Dallas–FW, Houston) — ~{fmtPct(HEADLINE.coreSunBeltSharePct)} of
              coded deaths.
            </p>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={BELT_STACK}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="sunBeltCore"
                    name="Sun Belt core (attrib.)"
                    stackId="1"
                    fill={COLORS.sunBelt}
                    stroke={COLORS.sunBelt}
                    fillOpacity={0.85}
                  />
                  <Area
                    type="monotone"
                    dataKey="restOfUs"
                    name="Rest of U.S."
                    stackId="1"
                    fill={COLORS.rest}
                    stroke={COLORS.rest}
                    fillOpacity={0.75}
                  />
                  <Line
                    type="monotone"
                    dataKey="national"
                    name="National total"
                    stroke={COLORS.ink}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {panel === "table" && (
          <div className="overflow-x-auto">
            <h4 className="mb-3 text-sm font-semibold text-slate-800">
              Metro detail · {HEADLINE.window}
            </h4>
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-3 font-medium">Metro</th>
                  <th className="py-2 pr-3 font-medium">Deaths</th>
                  <th className="py-2 pr-3 font-medium">Share</th>
                  <th className="py-2 pr-3 font-medium">Rate/100k</th>
                  <th className="py-2 pr-3 font-medium">Summer high</th>
                  <th className="py-2 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {metros.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-slate-100 text-slate-700"
                  >
                    <td className="py-2 pr-3 font-medium text-slate-900">
                      {m.metro}
                    </td>
                    <td className="py-2 pr-3 tabular-nums">{m.deaths}</td>
                    <td className="py-2 pr-3 tabular-nums">
                      {fmtPct(m.shareOfNationalPct, 2)}
                    </td>
                    <td className="py-2 pr-3 tabular-nums">
                      {m.ratePer100kWindow.toFixed(2)}
                    </td>
                    <td className="py-2 pr-3 tabular-nums">{m.summerHighF}°F</td>
                    <td className="py-2 text-xs text-slate-500">
                      {m.geographyNote}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="space-y-2 border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500 sm:px-6">
        <p>{SOURCE_NOTE}</p>
        <p>{ANALYTICS.caveatLocalMe}</p>
        <p>{ANALYTICS.caveatUndercount}</p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/10 px-3 py-2 backdrop-blur-sm">
      <div className="text-[10px] uppercase tracking-wide text-orange-100/80">
        {label}
      </div>
      <div className="mt-0.5 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}
