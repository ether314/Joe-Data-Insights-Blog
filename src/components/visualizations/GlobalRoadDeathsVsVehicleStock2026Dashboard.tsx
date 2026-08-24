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
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  COUNTRY_PANEL,
  GLOBAL_PATH,
  HEADLINE,
  INCOME_AGG,
  MOTORIZATION_PATHS,
  REGION_AGG,
  SOURCE_NOTE,
  USER_MIX,
  archetypeLabel,
  fmtInt,
  fmtRate,
  type Confidence,
  type SafetyArchetype,
  type WhoRegion,
} from "@/data/global-road-deaths-vs-vehicle-stock-2026-data";

// viz-types: deaths×fleet scatter, vehicle-risk ladder bars, global path area+line, region stacks, motorization multi-line, income pie | layout: default

type ViewId = "scatter" | "ladder" | "globalPath" | "regions" | "paths" | "income";
type RegionFilter = "all" | WhoRegion;
type MetricMode = "perPop" | "perVehicle";

const NAVY = "#0f172a";
const TEAL = "#0f766e";
const ROSE = "#be123c";
const AMBER = "#d97706";
const SKY = "#0284c7";
const SLATE = "#64748b";
const VIOLET = "#7c3aed";

const ARCH_COLORS: Record<SafetyArchetype, string> = {
  "safe-motorized": TEAL,
  "unsafe-motorized": AMBER,
  "unsafe-low-fleet": ROSE,
  transitioning: SKY,
  "outlier-high-rate": VIOLET,
};

const PATH_COLORS: Record<string, string> = {
  SWE: TEAL,
  JPN: "#059669",
  IND: SKY,
  THA: VIOLET,
  VNM: "#0891b2",
  KEN: ROSE,
  USA: AMBER,
  NGA: "#9f1239",
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
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ConfidenceChip({ c }: { c: Confidence }) {
  const tone =
    c === "disclosed"
      ? "bg-emerald-50 text-emerald-800"
      : c === "estimated"
        ? "bg-amber-50 text-amber-800"
        : "bg-slate-100 text-slate-600";
  return (
    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${tone}`}>
      {c}
    </span>
  );
}

export function GlobalRoadDeathsVsVehicleStock2026Dashboard() {
  const [view, setView] = useState<ViewId>("scatter");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [metric, setMetric] = useState<MetricMode>("perVehicle");

  const panel = useMemo(() => {
    if (region === "all") return COUNTRY_PANEL;
    return COUNTRY_PANEL.filter((r) => r.region === region);
  }, [region]);

  const ladder = useMemo(() => {
    const key = metric === "perVehicle" ? "deathsPer100kVehicles" : "deathsPer100kPop";
    return [...panel]
      .sort((a, b) => b[key] - a[key])
      .slice(0, 14)
      .map((r) => ({
        ...r,
        value: r[key],
        short: r.country.length > 14 ? r.iso3 : r.country,
      }));
  }, [panel, metric]);

  const pathCountries = useMemo(() => {
    const ids = ["SWE", "JPN", "IND", "THA", "VNM", "KEN", "USA", "NGA"];
    return ids.filter((id) =>
      region === "all"
        ? true
        : COUNTRY_PANEL.find((c) => c.iso3 === id)?.region === region,
    );
  }, [region]);

  const pathSeries = useMemo(() => {
    return pathCountries.map((iso3) => ({
      iso3,
      name: MOTORIZATION_PATHS.find((p) => p.iso3 === iso3)?.country ?? iso3,
      data: MOTORIZATION_PATHS.filter((p) => p.iso3 === iso3),
    }));
  }, [pathCountries]);

  const regionStacks = useMemo(
    () =>
      REGION_AGG.map((r) => ({
        region: r.region.replace("Eastern Mediterranean", "E. Med."),
        deathsPer100k: r.deathsPer100kPop2021,
        deathChange: r.deathsChangePct2010,
        fleetGrowth: r.fleetIndex2021 - 100,
      })),
    [],
  );

  return (
    <div
      className="mx-auto flex w-full max-w-5xl flex-col gap-4"
      data-viz="global-road-deaths-vs-vehicle-stock-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 px-5 py-4 text-white sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-rose-200/90">
          Deaths per 100k vs vehicles
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-200 sm:text-base">
          Global deaths per 100k vehicles fell {HEADLINE.globalDeathsPer100kVehiclesDropPct}%
          ({HEADLINE.globalDeathsPer100kVehicles2010} →{" "}
          {HEADLINE.globalDeathsPer100kVehicles2021}) while the fleet grew ~
          {HEADLINE.globalFleetGrowthPctSince2010}% — yet Kenya still prints{" "}
          {fmtRate(HEADLINE.kenyaDeathsPer100kVehicles)} and Nigeria{" "}
          {fmtRate(HEADLINE.nigeriaDeathsPer100kVehicles)} deaths per 100k vehicles
          versus Sweden&apos;s {fmtRate(HEADLINE.swedenDeathsPer100kVehicles)}.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={view}
          onChange={setView}
          options={[
            { id: "scatter", label: "Scatter" },
            { id: "ladder", label: "Risk ladder" },
            { id: "globalPath", label: "Global path" },
            { id: "regions", label: "Regions" },
            { id: "paths", label: "Motorization paths" },
            { id: "income", label: "Income mix" },
          ]}
        />
        <ToggleGroup
          label="Region"
          value={region}
          onChange={setRegion}
          options={[
            { id: "all", label: "All" },
            { id: "Africa", label: "Africa" },
            { id: "South-East Asia", label: "SE Asia" },
            { id: "Western Pacific", label: "W. Pacific" },
            { id: "Americas", label: "Americas" },
            { id: "Europe", label: "Europe" },
            { id: "Eastern Mediterranean", label: "E. Med." },
          ]}
        />
      </div>

      {view === "scatter" ? (
        <ChartCard
          title="Deaths per 100k population vs vehicles per 1,000"
          subtitle="WHO 2021 rates × registered stock density — bubble size scales with deaths per 100k vehicles"
        >
          <div className="mb-3 flex flex-wrap gap-2 text-xs text-slate-600">
            {(Object.keys(ARCH_COLORS) as SafetyArchetype[]).map((a) => (
              <span key={a} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: ARCH_COLORS[a] }}
                />
                {archetypeLabel(a)}
              </span>
            ))}
          </div>
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 4, bottom: 28 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="vehiclesPer1000"
                  name="Vehicles / 1k"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Vehicles per 1,000 people",
                    position: "insideBottom",
                    offset: -14,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="deathsPer100kPop"
                  name="Deaths / 100k"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Deaths per 100k pop",
                    angle: -90,
                    position: "insideLeft",
                    offset: 8,
                    fontSize: 11,
                  }}
                />
                <ZAxis
                  type="number"
                  dataKey="deathsPer100kVehicles"
                  range={[60, 400]}
                  name="Deaths / 100k veh"
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    const n = Number(value);
                    if (name === "vehiclesPer1000") return [fmtRate(n, 0), "Vehicles / 1k"];
                    if (name === "deathsPer100kPop") return [fmtRate(n), "Deaths / 100k pop"];
                    if (name === "deathsPer100kVehicles")
                      return [fmtRate(n), "Deaths / 100k vehicles"];
                    return [String(value), String(name)];
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as { country?: string } | undefined;
                    return p?.country ?? "";
                  }}
                />
                {(Object.keys(ARCH_COLORS) as SafetyArchetype[]).map((arch) => {
                  const data = panel.filter((r) => r.archetype === arch);
                  if (!data.length) return null;
                  return (
                    <Scatter
                      key={arch}
                      name={archetypeLabel(arch)}
                      data={data}
                      fill={ARCH_COLORS[arch]}
                    />
                  );
                })}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {panel.length} countries in filter ·{" "}
            <ConfidenceChip c="disclosed" /> rates/stocks · desk vehicle-risk ratios
          </p>
        </ChartCard>
      ) : null}

      {view === "ladder" ? (
        <ChartCard
          title={
            metric === "perVehicle"
              ? "Deaths per 100,000 registered vehicles"
              : "Deaths per 100,000 population"
          }
          subtitle="Top of the filtered panel — low-fleet African states dominate the vehicle-risk ladder"
        >
          <ToggleGroup
            label="Metric"
            value={metric}
            onChange={setMetric}
            options={[
              { id: "perVehicle", label: "Per 100k vehicles" },
              { id: "perPop", label: "Per 100k people" },
            ]}
          />
          <div className="mt-4 h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ladder}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={88}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value) => [fmtRate(Number(value)), metric === "perVehicle" ? "Per 100k veh" : "Per 100k pop"]}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as { country?: string } | undefined;
                    return p?.country ?? "";
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {ladder.map((r) => (
                    <Cell key={r.iso3} fill={ARCH_COLORS[r.archetype]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "globalPath" ? (
        <ChartCard
          title="Global fleet boom vs falling deaths per vehicle"
          subtitle="WHO anchors at 2010 and 2021; intervening years are carried interpolations"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={GLOBAL_PATH} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Deaths / 100k vehicles",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Fleet index (2010=100)",
                    angle: 90,
                    position: "insideRight",
                    fontSize: 11,
                  }}
                />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="fleetIndex"
                  name="Fleet index"
                  fill={SKY}
                  fillOpacity={0.15}
                  stroke={SKY}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="deathsPer100kVehicles"
                  name="Deaths / 100k vehicles"
                  stroke={ROSE}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "regions" ? (
        <ChartCard
          title="WHO regions — fatality rate, decade death change, fleet growth"
          subtitle="Africa uniquely combines rising absolute deaths with the highest population rate"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionStacks} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={56} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="deathsPer100k" name="Deaths / 100k pop" fill={ROSE} radius={[3, 3, 0, 0]} />
                <Bar dataKey="deathChange" name="Deaths Δ % since 2010" fill={AMBER} radius={[3, 3, 0, 0]} />
                <Bar dataKey="fleetGrowth" name="Fleet growth % (index−100)" fill={TEAL} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "paths" ? (
        <ChartCard
          title="Motorization paths — vehicles rising, rates falling (or not)"
          subtitle="Sweden/Japan: safer as stock grows. Kenya/Nigeria: stock rises, population rates stay high. Thailand: high rate despite dense fleet."
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart margin={{ top: 8, right: 12, left: 0, bottom: 28 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="vehiclesPer1000"
                  domain={["dataMin - 20", "dataMax + 20"]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Vehicles per 1,000 people",
                    position: "insideBottom",
                    offset: -14,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="deathsPer100kPop"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Deaths per 100k pop",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    fmtRate(Number(value)),
                    name === "deathsPer100kPop" ? "Deaths / 100k" : "Vehicles / 1k",
                  ]}
                />
                <Legend />
                {pathSeries.map((s) => (
                  <Line
                    key={s.iso3}
                    data={s.data}
                    type="monotone"
                    dataKey="deathsPer100kPop"
                    name={s.name}
                    stroke={PATH_COLORS[s.iso3] ?? SLATE}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          {pathSeries.length === 0 ? (
            <p className="text-sm text-slate-500">No path countries in this region filter.</p>
          ) : null}
        </ChartCard>
      ) : null}

      {view === "income" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Deaths vs vehicle share by income"
            subtitle="Low-income countries: ~1% of vehicles, 13% of deaths (WHO)"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={INCOME_AGG} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="shareOfDeathsPct" name="% of deaths" fill={ROSE} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="shareOfVehiclesPct" name="% of vehicles" fill={TEAL} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Global user-type mix of fatalities"
            subtitle="2/3-wheeler rider share up ~30% vs GSRRS 2013 comparison"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={USER_MIX}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                  <YAxis type="category" dataKey="user" width={110} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => [`${fmtRate(Number(v), 0)}%`, "Share"]} />
                  <Bar dataKey="sharePct2021" fill={NAVY} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <p className="text-[11px] text-slate-400">
        Panel n={fmtInt(COUNTRY_PANEL.length)} · filter n={fmtInt(panel.length)}
      </p>
    </div>
  );
}
