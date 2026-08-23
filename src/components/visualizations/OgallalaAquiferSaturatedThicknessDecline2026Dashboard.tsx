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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  DECLINE_ERA_SERIES,
  HEADLINE,
  SOURCE_NOTE,
  SAT_THICKNESS_LOSS_BANDS,
  fmtFt,
  gmdLifetimeBars,
  miningScatter,
  sortedCounties,
  stateDeclineBars,
  type RegionFilter,
  type SortMode,
} from "@/data/ogallala-aquifer-saturated-thickness-decline-2026-data";

// viz-types: county decline bars, years-to-floor bars, mining scatter, state decline bars, era cumulative line, GMD remaining, sat-loss bands | layout: default

type ViewId = "counties" | "years" | "scatter" | "states" | "eras";

const SLUG = "ogallala-aquifer-saturated-thickness-decline-2026";
const DRAIN = "#b45309";
const DEEP = "#0e7490";
const ALERT = "#be123c";
const TEAL = "#0f766e";
const REGION_COLORS: Record<string, string> = {
  "Southern High Plains": "#be123c",
  "Central High Plains": "#b45309",
  "Northern High Plains": "#0e7490",
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

export function OgallalaAquiferSaturatedThicknessDecline2026Dashboard() {
  const [view, setView] = useState<ViewId>("counties");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [sort, setSort] = useState<SortMode>("decline");

  const counties = useMemo(
    () => sortedCounties(region, sort),
    [region, sort],
  );
  const states = useMemo(() => stateDeclineBars(), []);
  const gmds = useMemo(() => gmdLifetimeBars(), []);
  const scatter = useMemo(() => miningScatter(region), [region]);
  const eras = useMemo(() => DECLINE_ERA_SERIES, []);
  const bands = useMemo(() => SAT_THICKNESS_LOSS_BANDS, []);

  const fastest = counties[0];

  return (
    <div className="space-y-6" data-viz={SLUG}>
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
          High Plains · saturated-thickness change
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Saturated-thickness change
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Area-weighted High Plains water levels are down{" "}
          <span className="font-semibold text-white">
            {HEADLINE.areaWeightedDeclineFtPredevTo2019} ft
          </span>{" "}
          since predevelopment — but Texas averages{" "}
          <span className="font-semibold text-amber-300">
            {HEADLINE.texasAreaWeightedDeclineFt} ft
          </span>
          . In the mining panel, {HEADLINE.fastestCountyLabel} is declining ~
          {HEADLINE.fastestDeclineFtPerYr} ft/yr with roughly{" "}
          <span className="font-semibold text-rose-300">
            {HEADLINE.fastestYearsToFloor} years
          </span>{" "}
          to a 30-ft high-capacity floor.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-xs text-slate-400">TX area-weighted</div>
            <div className="font-semibold text-amber-300">
              -{HEADLINE.texasAreaWeightedDeclineFt} ft
            </div>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-xs text-slate-400">Storage since predev</div>
            <div className="font-semibold">
              -{HEADLINE.storageDeclinePredevMacreFt} Macre-ft
            </div>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-xs text-slate-400">Fast panel floor</div>
            <div className="font-semibold text-rose-300">
              ~{HEADLINE.fastestYearsToFloor} yr · {HEADLINE.fastestCountyLabel}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={view}
          onChange={setView}
          options={[
            { id: "counties", label: "County decline" },
            { id: "years", label: "Years to floor" },
            { id: "scatter", label: "Mining scatter" },
            { id: "states", label: "State ledger" },
            { id: "eras", label: "Era path" },
          ]}
        />
        <ToggleGroup
          label="Region"
          value={region}
          onChange={setRegion}
          options={[
            { id: "all", label: "All regions" },
            { id: "Southern High Plains", label: "Southern" },
            { id: "Central High Plains", label: "Central" },
            { id: "Northern High Plains", label: "Northern" },
          ]}
        />
        {(view === "counties" || view === "years") && (
          <ToggleGroup
            label="Sort"
            value={sort}
            onChange={setSort}
            options={[
              { id: "decline", label: "By decline" },
              { id: "years", label: "By years left" },
              { id: "acres", label: "By irrigated ac" },
            ]}
          />
        )}
      </div>

      {view === "counties" && (
        <ChartCard
          title="County decline rates (ft/yr)"
          subtitle={`Composite recent rates · ${counties.length} counties${fastest ? ` · top: ${fastest.label} at ${fmtFt(fastest.declineFtPerYr)}/yr` : ""}`}
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={counties}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" unit=" ft/yr" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={110}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Bar dataKey="declineFtPerYr" name="Decline" radius={[0, 4, 4, 0]}>
                  {counties.map((c) => (
                    <Cell
                      key={c.id}
                      fill={REGION_COLORS[c.region] ?? DRAIN}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "years" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Years to 30-ft high-capacity floor"
            subtitle="(remaining sat - 30) / decline rate · null = near-stable"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={counties.filter((c) => c.yearsToFloor !== null)}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" unit=" yr" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={110}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="yearsToFloor" name="Years" radius={[0, 4, 4, 0]}>
                    {counties
                      .filter((c) => c.yearsToFloor !== null)
                      .map((c) => (
                        <Cell
                          key={c.id}
                          fill={
                            (c.yearsToFloor ?? 99) < 25
                              ? ALERT
                              : (c.yearsToFloor ?? 99) < 50
                                ? DRAIN
                                : TEAL
                          }
                        />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Kansas GMD remaining stack"
            subtitle="KGS TS 25 averages · years to 30-ft floor at 1996-2022 rates"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={gmds}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="sat" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="yr"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="sat"
                    dataKey="remainingSatFt"
                    name="Remaining sat (ft)"
                    fill={DEEP}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="yr"
                    type="monotone"
                    dataKey="yearsToFloor"
                    name="Years to floor"
                    stroke={ALERT}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Decline rate vs years to floor"
          subtitle="Bubble size ~ irrigated acres (thousands) · color by High Plains region"
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 20, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Decline"
                  unit=" ft/yr"
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Years"
                  tick={{ fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                {(
                  [
                    "Southern High Plains",
                    "Central High Plains",
                    "Northern High Plains",
                  ] as const
                ).map((reg) => (
                  <Scatter
                    key={reg}
                    name={reg.replace(" High Plains", "")}
                    data={scatter.filter((d) => d.region === reg)}
                    fill={REGION_COLORS[reg]}
                  />
                ))}
                <Legend />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "states" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Area-weighted water-level change"
            subtitle="Predevelopment (~1950) to 2019 · USGS SIR 2023-5143"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={states}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="declineFt" name="Decline" stackId="a" fill={ALERT} />
                  <Bar dataKey="riseFt" name="Rise" stackId="a" fill={TEAL} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Saturated-thickness loss share of aquifer area"
            subtitle="% of High Plains area by thickness-change band"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bands}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" unit="%" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={150}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="pctOfAquiferArea"
                    name="% of area"
                    fill={DEEP}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "eras" && (
        <ChartCard
          title="Cumulative area-weighted decline path"
          subtitle="Illustrative era milestones · 2019 endpoint = USGS -16.5 ft"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={eras}
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar
                  dataKey="areaWeightedDeclineFtCumulative"
                  name="Cumulative decline"
                  fill={DRAIN}
                  opacity={0.35}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="areaWeightedDeclineFtCumulative"
                  name="Path"
                  stroke={ALERT}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: ALERT }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
