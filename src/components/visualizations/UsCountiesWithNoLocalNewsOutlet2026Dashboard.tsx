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
  ACCESS_STACK_2025,
  DESERT_RURAL_SPLIT,
  DUAL_METRIC_COMPARE,
  HEADLINE,
  NEWSPAPER_STRUCTURE,
  OUTLET_MIX_2025,
  PUBLIC_REACH,
  RISK_FUNNEL,
  SOURCE_NOTE,
  desertSeries,
  dualMetricBars,
  fmtInt,
  fmtM,
  fmtPct,
  statesByRegion,
  type AccessMetric,
  type RegionFilter,
} from "@/data/us-counties-with-no-local-news-outlet-2026-data";

// viz-types: desert area+line, state horiz bars, risk funnel, public-reach composed, rural pie, density×owners scatter | layout: default

type ViewId = "deserts" | "states" | "risk" | "ecosystem";

const NAVY = "#0f172a";
const AMBER = "#d97706";
const TEAL = "#0f766e";
const ROSE = "#be123c";
const SLATE = "#64748b";
const INDIGO = "#4338ca";
const EMERALD = "#059669";

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

export function UsCountiesWithNoLocalNewsOutlet2026Dashboard() {
  const [view, setView] = useState<ViewId>("deserts");
  const [metric, setMetric] = useState<AccessMetric>("allOutlets");
  const [region, setRegion] = useState<RegionFilter>("all");

  const path = useMemo(() => desertSeries(), []);
  const dual = useMemo(() => dualMetricBars(metric), [metric]);
  const states = useMemo(
    () =>
      [...statesByRegion(region)]
        .map((s) => ({ state: s.state, popM: s.limitedAccessPopM }))
        .sort((a, b) => b.popM - a.popM),
    [region],
  );
  const funnel = useMemo(
    () =>
      RISK_FUNNEL.map((r) => ({
        stage: r.stage
          .replace("Watch list (>40% desert risk / 10y)", "Watch list")
          .replace("Zero outlets now", "Zero now"),
        counties: r.counties,
      })),
    [],
  );
  const reach = useMemo(
    () =>
      PUBLIC_REACH.map((p) => ({
        metric: p.metric,
        primary: p.primaryPct,
        repeaters: p.withRepeatersPct,
      })),
    [],
  );
  const ruralPie = useMemo(
    () => DESERT_RURAL_SPLIT.map((d) => ({ name: d.label, value: d.sharePct })),
    [],
  );
  const stack = useMemo(
    () => ACCESS_STACK_2025.map((a) => ({ band: a.band, counties: a.counties })),
    [],
  );
  const structureScatter = useMemo(
    () =>
      NEWSPAPER_STRUCTURE.map((n) => ({
        year: n.year,
        papersPer100k: n.papersPer100k,
        owners: n.uniqueOwners / 1000,
        circ: n.circulationM,
      })),
    [],
  );
  const outletMix = useMemo(
    () =>
      OUTLET_MIX_2025.map((o) => ({
        type: o.type.replace(" / foreign-language", ""),
        count: o.count,
      })),
    [],
  );
  const dualCompare = useMemo(
    () =>
      DUAL_METRIC_COMPARE.map((d) => ({
        short: d.metric
          .replace("Zero-outlet counties (all sources)", "Zero-outlet")
          .replace("People in 0–1 newspaper counties", "0–1 paper pop")
          .replace("Newspapers per 100k residents", "Papers/100k")
          .replace("Unique newspaper owners", "Owners"),
        y2005: d.year2005,
        y2025: d.year2025,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="us-counties-with-no-local-news-outlet-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-300">
          Local information · Medill 2025
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Counties with 0–1 local news outlets
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">
          Medill counts{" "}
          <span className="font-semibold text-white">
            {fmtInt(HEADLINE.zeroOutletCounties2025)}
          </span>{" "}
          U.S. counties with zero locally based news sources and{" "}
          <span className="font-semibold text-white">
            {fmtInt(HEADLINE.oneOutletCounties2025)}
          </span>{" "}
          with only one — about{" "}
          <span className="font-semibold text-amber-200">
            {fmtM(HEADLINE.limitedAccessPopM, 0)}
          </span>{" "}
          people with limited or no local news.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Zero-outlet
            </p>
            <p className="text-xl font-bold tabular-nums">
              {fmtInt(HEADLINE.zeroOutletCounties2025)}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              One outlet
            </p>
            <p className="text-xl font-bold tabular-nums">
              {fmtInt(HEADLINE.oneOutletCounties2025)}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Watch list
            </p>
            <p className="text-xl font-bold tabular-nums">
              {fmtInt(HEADLINE.watchListCounties)}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Rural deserts
            </p>
            <p className="text-xl font-bold tabular-nums">
              {fmtPct(HEADLINE.ruralShareOfDesertsPct)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={view}
          options={[
            { id: "deserts", label: "Desert path" },
            { id: "states", label: "State exposure" },
            { id: "risk", label: "Risk funnel" },
            { id: "ecosystem", label: "Ecosystem" },
          ]}
          onChange={setView}
        />
        <div className="flex flex-wrap gap-3">
          <ToggleGroup
            label="Metric"
            value={metric}
            options={[
              { id: "allOutlets", label: "All outlets" },
              { id: "newspaperOnly", label: "Newspaper 0–1" },
            ]}
            onChange={setMetric}
          />
          <ToggleGroup
            label="Region"
            value={region}
            options={[
              { id: "all", label: "All" },
              { id: "south", label: "South" },
              { id: "midwest", label: "Midwest" },
              { id: "west", label: "West" },
              { id: "northeast", label: "Northeast" },
            ]}
            onChange={setRegion}
          />
        </div>
      </div>

      {view === "deserts" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Zero-outlet counties since 2005"
            subtitle="Medill disclosed annual points; mid-path estimated/carried"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={path}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="zero"
                    name="Zero outlets"
                    fill={ROSE}
                    fillOpacity={0.15}
                    stroke={ROSE}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="limited"
                    name="0+1 (when known)"
                    stroke={AMBER}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    connectNulls={false}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title={
              metric === "allOutlets"
                ? "Desert counties: 2005 vs 2025"
                : "People in 0–1 newspaper counties"
            }
            subtitle="Toggle Metric control above"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dual}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    name={dual[0]?.label ?? "Value"}
                    radius={[6, 6, 0, 0]}
                  >
                    {dual.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? SLATE : ROSE} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="2025 county access stack"
            subtitle="Share of U.S. counties by outlet count"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stack} layout="vertical" margin={{ left: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="band"
                    width={130}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="counties" name="Counties" radius={[0, 6, 6, 0]}>
                    {stack.map((_, i) => (
                      <Cell key={i} fill={[ROSE, AMBER, TEAL][i] ?? NAVY} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Deserts are mostly rural"
            subtitle="USDA predominantly rural share of zero-outlet counties"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ruralPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {ruralPie.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? AMBER : INDIGO} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "states" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="People in zero- or one-source counties"
            subtitle={`Region filter: ${region}. GA/TX/NC disclosed; others estimated.`}
          >
            <div className="h-[28rem] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={states} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} unit="M" />
                  <YAxis
                    type="category"
                    dataKey="state"
                    width={100}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="popM"
                    name="Limited-access pop (M)"
                    fill={TEAL}
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Dual twenty-year comparison"
            subtitle="Medill disclosed endpoints for deserts, newspaper access, density, owners"
          >
            <div className="h-[28rem] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dualCompare}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="y2005"
                    name="2005"
                    fill={SLATE}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="y2025"
                    name="2025"
                    fill={ROSE}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "risk" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="From all counties to deserts"
            subtitle="Watch list: >40% modeled chance of becoming a desert within 10 years"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnel}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="stage" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="counties" name="Counties" radius={[6, 6, 0, 0]}>
                    {funnel.map((_, i) => (
                      <Cell
                        key={i}
                        fill={[SLATE, AMBER, ROSE, NAVY][i] ?? TEAL}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Public broadcast reach into thin-news counties"
            subtitle="Primary stations vs including repeaters (Medill signal contours)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={reach}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <YAxis unit="%" tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="primary"
                    name="Primary %"
                    fill={INDIGO}
                    radius={[6, 6, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="repeaters"
                    name="With repeaters %"
                    stroke={EMERALD}
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "ecosystem" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Local news outlet mix (2025)"
            subtitle="Medill census of newspapers, digital, ethnic, and public outlets"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={outletMix}
                  layout="vertical"
                  margin={{ left: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="type"
                    width={110}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    name="Outlets"
                    fill={TEAL}
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Density vs ownership collapse"
            subtitle="Bubble size ≈ circulation (M). X = papers/100k, Y = owners (thousands)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="papersPer100k"
                    name="Papers/100k"
                    tick={{ fontSize: 12 }}
                    domain={[1, 3.5]}
                  />
                  <YAxis
                    type="number"
                    dataKey="owners"
                    name="Owners (k)"
                    tick={{ fontSize: 12 }}
                    unit="k"
                  />
                  <ZAxis type="number" dataKey="circ" range={[80, 400]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter
                    name="Structure"
                    data={structureScatter}
                    fill={ROSE}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Papers per 100k over two decades"
            subtitle="From 3.0 (2005) to 1.6 (2025)"
          >
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={NEWSPAPER_STRUCTURE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 4]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="papersPer100k"
                    name="Papers / 100k"
                    stroke={NAVY}
                    strokeWidth={3}
                    dot={{ r: 5, fill: AMBER }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
