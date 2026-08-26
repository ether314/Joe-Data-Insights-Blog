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
  BAND_MIX,
  CORRIDOR_SUMMARY,
  CORRIDOR_VINTAGE,
  HEADLINE,
  METRO_PANEL,
  MONTH_PROFILE,
  SOURCE_NOTE,
  VIZ_MARKERS,
  childDayLadder,
  fmtChildDays,
  fmtDays,
  fmtPct,
  metrosByCorridor,
  usgLadder,
  type CorridorId,
} from "@/data/school-age-smoke-days-in-western-metros-2026-data";

// viz-types: USG+ metro ladder bars, child-days×days scatter,
// corridor vintage area+line, AQI band pie + month profile,
// corridor group bars, child-day volume ladder
// | layout: default
// smoke-marker: School-year USG+ days by metro

type ViewId =
  | "ladder"
  | "scatter"
  | "vintage"
  | "bands"
  | "corridors"
  | "childdays";

type CorridorFilter = "all" | CorridorId;
type MetricLens = "usg" | "unhealthy" | "child";

const NAVY = "#0f172a";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const TEAL = "#0d9488";
const INDIGO = "#4f46e5";
const SLATE = "#64748b";
const EMERALD = "#059669";
const SKY = "#0284c8";

const CORRIDOR_COLORS: Record<CorridorId, string> = {
  "Central Valley": ROSE,
  Cascade: AMBER,
  Mountain: INDIGO,
  Southwest: TEAL,
  "Coastal CA": SKY,
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

export function SchoolAgeSmokeDaysInWesternMetros2026Dashboard() {
  const [view, setView] = useState<ViewId>("ladder");
  const [corridor, setCorridor] = useState<CorridorFilter>("all");
  const [lens, setLens] = useState<MetricLens>("usg");

  const filtered = useMemo(() => metrosByCorridor(corridor), [corridor]);
  const ladder = useMemo(() => usgLadder(corridor), [corridor]);
  const childLadder = useMemo(() => childDayLadder(corridor), [corridor]);

  const scatterData = useMemo(
    () =>
      filtered.map((m) => ({
        ...m,
        x: m.schoolAgeK,
        y: lens === "unhealthy" ? m.unhealthyDays2324 : m.usgDays2324,
        z: Math.max(m.childDaysM, 0.4),
      })),
    [filtered, lens],
  );

  const ladderData = useMemo(
    () =>
      ladder.map((m) => ({
        name: m.metro,
        value:
          lens === "child"
            ? m.childDaysM
            : lens === "unhealthy"
              ? m.unhealthyDays2324
              : m.usgDays2324,
        fill: CORRIDOR_COLORS[m.corridor],
        corridor: m.corridor,
      })),
    [ladder, lens],
  );

  const childBarData = useMemo(
    () =>
      childLadder.map((m) => ({
        name: m.metro,
        childDaysM: m.childDaysM,
        usgDays: m.usgDays2324,
        fill: CORRIDOR_COLORS[m.corridor],
      })),
    [childLadder],
  );

  const yLabel =
    lens === "child"
      ? "Child-days (M)"
      : lens === "unhealthy"
        ? "Unhealthy+ days (AQI ≥ 151)"
        : "USG+ days (AQI ≥ 101)";

  return (
    <div
      className="w-full space-y-4"
      data-viz="school-age-smoke-days-in-western-metros-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 px-5 py-5 text-white sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300/90">
          Western metros · school-year PM2.5
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {HEADLINE.topMetroName}: {HEADLINE.topMetroSy2324Days} school-year
          USG+ days
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          Across {HEADLINE.panelN} large Western metros, SY2023–24 median was{" "}
          {HEADLINE.medianSy2324Days} days with PM2.5 AQI ≥ 101 during Sep–May.
          Inland Cascade–Valley corridors ran ~{HEADLINE.inlandMedianDays}{" "}
          days; coastal California peers ~{HEADLINE.coastalMedianDays}. Panel
          child-days totaled {HEADLINE.childDaysM}M.
        </p>
        <p className="mt-3 hidden text-xs text-slate-400 sm:block">
          {VIZ_MARKERS[0]} · {VIZ_MARKERS[1]} · {VIZ_MARKERS[2]}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup<ViewId>
          value={view}
          onChange={setView}
          options={[
            { id: "ladder", label: "USG+ ladder" },
            { id: "scatter", label: "Kids × days" },
            { id: "vintage", label: "Corridor vintage" },
            { id: "bands", label: "Band & month" },
            { id: "corridors", label: "Corridors" },
            { id: "childdays", label: "Child-day volume" },
          ]}
        />
        <div className="flex flex-wrap gap-3">
          <ToggleGroup<CorridorFilter>
            value={corridor}
            onChange={setCorridor}
            options={[
              { id: "all", label: "All corridors" },
              { id: "Central Valley", label: "Central Valley" },
              { id: "Cascade", label: "Cascade" },
              { id: "Mountain", label: "Mountain" },
              { id: "Southwest", label: "Southwest" },
              { id: "Coastal CA", label: "Coastal CA" },
            ]}
          />
          {(view === "ladder" || view === "scatter") && (
            <ToggleGroup<MetricLens>
              value={lens}
              onChange={setLens}
              options={[
                { id: "usg", label: "USG+ days" },
                { id: "unhealthy", label: "Unhealthy+" },
                { id: "child", label: "Child-days" },
              ]}
            />
          )}
        </div>
      </div>

      {view === "ladder" && (
        <ChartCard
          title="School-year USG+ days by metro"
          subtitle={`${yLabel} · SY2023–24 · Sep 1–May 31 · ${filtered.length} metros`}
        >
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ladderData}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fill: SLATE, fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fill: NAVY, fontSize: 11 }}
                />
                <Tooltip />
                <Bar dataKey="value" name={yLabel} radius={[0, 4, 4, 0]}>
                  {ladderData.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Child-days × unhealthy air"
          subtitle="X: school-age population (000s) · Y: school-year days · bubble: child-days"
        >
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 24, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="School-age (000s)"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: "School-age population (000s)",
                    position: "insideBottom",
                    offset: -4,
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Days"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: yLabel,
                    angle: -90,
                    position: "insideLeft",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    const key = String(name);
                    if (key === "y") return [fmtDays(n), yLabel];
                    if (key === "x") return [n, "School-age (000s)"];
                    if (key === "z") return [fmtChildDays(n), "Child-days"];
                    return [String(value), key];
                  }}
                  labelFormatter={(_, payload) =>
                    (payload?.[0]?.payload as { metro?: string } | undefined)
                      ?.metro ?? ""
                  }
                />
                <Scatter name="Metros" data={scatterData}>
                  {scatterData.map((d) => (
                    <Cell
                      key={d.id}
                      fill={CORRIDOR_COLORS[d.corridor]}
                      fillOpacity={0.85}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "vintage" && (
        <ChartCard
          title="Band mix & corridor vintage"
          subtitle="Mean school-year USG+ days by corridor · SY2018–19 to SY2023–24"
        >
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={CORRIDOR_VINTAGE}
                margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="schoolYear"
                  tick={{ fill: SLATE, fontSize: 11 }}
                />
                <YAxis
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: "Mean USG+ days",
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
                  dataKey="Central Valley"
                  stroke={CORRIDOR_COLORS["Central Valley"]}
                  fill={CORRIDOR_COLORS["Central Valley"]}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Cascade"
                  stroke={CORRIDOR_COLORS.Cascade}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="Mountain"
                  stroke={CORRIDOR_COLORS.Mountain}
                  strokeWidth={2}
                  strokeDasharray="4 3"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="Southwest"
                  stroke={CORRIDOR_COLORS.Southwest}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="Coastal CA"
                  stroke={CORRIDOR_COLORS["Coastal CA"]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Peak year in panel: {HEADLINE.peakMetroYear} ({HEADLINE.peakMetroDays}{" "}
            USG+ days). SY2020–21 remains the outlier for Cascade and Valley
            corridors.
          </p>
        </ChartCard>
      )}

      {view === "bands" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="AQI band mix of USG+ days"
            subtitle="Share of panel USG+ school-year days · SY2023–24"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={BAND_MIX}
                    dataKey="daysSharePct"
                    nameKey="band"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={100}
                    paddingAngle={2}
                    label={(props) => {
                      const pct =
                        (props as { daysSharePct?: number }).daysSharePct ??
                        props.percent;
                      const n =
                        typeof pct === "number" && pct <= 1
                          ? Math.round(pct * 100)
                          : Number(pct);
                      return `${n}%`;
                    }}
                  >
                    {BAND_MIX.map((b) => (
                      <Cell key={b.bandId} fill={b.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [
                      fmtPct(Number(v)),
                      "Share of USG+ days",
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500">
              Unhealthy+ (AQI ≥ 151) is {HEADLINE.unhealthyShareOfUsgPct}% of
              USG+ school-year days in the panel — most exposure is USG-band,
              still material for school-age lungs.
            </p>
          </ChartCard>
          <ChartCard
            title="When school-year smoke lands"
            subtitle="Share of Western-panel USG+ days by month (Sep–May)"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...MONTH_PROFILE]}
                  margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    tick={{ fill: SLATE, fontSize: 11 }}
                    unit="%"
                  />
                  <Tooltip
                    formatter={(v, _n, item) => [
                      fmtPct(Number(v)),
                      (item?.payload as { label?: string } | undefined)
                        ?.label ?? "Share",
                    ]}
                  />
                  <Bar
                    dataKey="sharePct"
                    name="Share of USG+ days"
                    fill={AMBER}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "corridors" && (
        <ChartCard
          title="Corridor means vs child-day load"
          subtitle="Mean USG+ days (bars) and aggregate child-days (line) · SY2023–24"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={CORRIDOR_SUMMARY}
                margin={{ top: 12, right: 24, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="corridor"
                  tick={{ fill: SLATE, fontSize: 11 }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: "Mean USG+ days",
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
                    value: "Child-days (M)",
                    angle: 90,
                    position: "insideRight",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="meanUsgDays"
                  name="Mean USG+ days"
                  radius={[4, 4, 0, 0]}
                >
                  {CORRIDOR_SUMMARY.map((c) => (
                    <Cell
                      key={c.corridor}
                      fill={CORRIDOR_COLORS[c.corridor as CorridorId]}
                    />
                  ))}
                </Bar>
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="childDaysM"
                  name="Child-days (M)"
                  stroke={NAVY}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: EMERALD }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "childdays" && (
        <ChartCard
          title="Child-day volume ladder"
          subtitle="School-age × USG+ days · SY2023–24 · top metros by exposure volume"
        >
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={childBarData}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  unit="M"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fill: NAVY, fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v, name) =>
                    String(name) === "childDaysM"
                      ? [fmtChildDays(Number(v)), "Child-days"]
                      : [fmtDays(Number(v)), "USG+ days"]
                  }
                />
                <Bar
                  dataKey="childDaysM"
                  name="Child-days (M)"
                  radius={[0, 4, 4, 0]}
                >
                  {childBarData.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Los Angeles and Seattle can outrank inland metros on child-days even
            with fewer USG+ calendar days — population turns moderate smoke
            seasons into large exposure volumes. Top-4 metros hold{" "}
            {HEADLINE.top4ChildDaySharePct}% of panel child-days.
          </p>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <p className="text-[10px] text-slate-400">
        Panel n={METRO_PANEL.length} · markers: {VIZ_MARKERS.join(" · ")}
      </p>
    </div>
  );
}
