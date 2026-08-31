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
  CONDITION_SPLIT,
  COUNT_VS_ADT,
  FUNCTIONAL_CLASS,
  HEADLINE,
  HIGHWAY_SYSTEM,
  POOR_TREND,
  RURAL_URBAN_POOR_ADT,
  SOURCE_NOTE,
  VIZ_MARKERS,
  fmtAdt,
  fmtCount,
  fmtPct,
  functionalClassFiltered,
  stateScatterRows,
  type StateRow,
} from "@/data/structurally-deficient-bridges-versus-daily-traffic-2026-data";

// viz-types: donut condition, stacked count-vs-ADT, FC grouped bars, area+line trend,
// highway system bars, rural/urban donut, state scatter | layout: default
// smoke-marker: Structurally deficient bridges versus daily traffic

type Panel =
  | "condition"
  | "mismatch"
  | "functional"
  | "trend"
  | "system"
  | "scatter";

type FcSetting = "All" | "Rural" | "Urban";
type RegionFilter = "All" | StateRow["region"];
type FcMetric = "poorAdtSharePct" | "poorCountSharePct" | "poorAdt";

const ROSE = "#e11d48";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const SKY = "#0284c7";
const SLATE = "#64748b";
const GRID = "#e2e8f0";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  condition: {
    title: "NBI inventory: Good, Fair, Poor",
    subtitle:
      "FHWA 2024 final — Poor is the post-2018 successor to “structurally deficient”",
  },
  mismatch: {
    title: "Poor share of count vs ADT vs deck area",
    subtitle:
      "6.8% of spans are Poor, but only 3.4% of inventory ADT still crosses them — yet that is still 168.6M ADT",
  },
  functional: {
    title: "Poor intensity by functional class",
    subtitle:
      "Collectors and locals show higher Poor count shares; Interstates keep Poor ADT shares near 2–3%",
  },
  trend: {
    title: "Poor share fell; residual ADT exposure remains",
    subtitle:
      "National Poor count share ~9.8% (2010) → 6.8% (2024); paired ADT share ~5.2% → 3.4%",
  },
  system: {
    title: "NHS vs non-NHS Poor intensity",
    subtitle:
      "NHS Poor share 3.0% vs non-NHS 7.9% — traffic-critical corridors are cleaner on count share",
  },
  scatter: {
    title: "States: Poor share vs ADT still on Poor spans",
    subtitle:
      "Bubble size ≈ Poor bridge count; Iowa leads share, California leads Poor ADT volume",
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

export function StructurallyDeficientBridgesVersusDailyTraffic2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("mismatch");
  const [fcSetting, setFcSetting] = useState<FcSetting>("All");
  const [fcMetric, setFcMetric] = useState<FcMetric>("poorAdtSharePct");
  const [region, setRegion] = useState<RegionFilter>("All");

  const fcRows = useMemo(() => {
    const rows = functionalClassFiltered(fcSetting).map((r) => ({
      ...r,
      shortLabel: r.label.replace("Rural ", "R ").replace("Urban ", "U "),
    }));
    return [...rows].sort((a, b) => {
      if (fcMetric === "poorAdt") return b.poorAdt - a.poorAdt;
      if (fcMetric === "poorCountSharePct")
        return b.poorCountSharePct - a.poorCountSharePct;
      return b.poorAdtSharePct - a.poorAdtSharePct;
    });
  }, [fcSetting, fcMetric]);

  const scatter = useMemo(() => stateScatterRows(region), [region]);

  const trendRows = useMemo(
    () =>
      POOR_TREND.map((r) => ({
        ...r,
        adtShare: r.poorAdtSharePct ?? undefined,
      })),
    [],
  );

  const mismatchStack = useMemo(
    () =>
      COUNT_VS_ADT.map((r) => ({
        metric: r.metric,
        Poor: r.poorPct,
        "Not poor": r.nonPoorPct,
      })),
    [],
  );

  const meta = PANEL_META[panel];

  return (
    <div
      className="space-y-4"
      data-viz="structurally-deficient-bridges-versus-daily-traffic-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 px-5 py-5 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-rose-200/90">
          {VIZ_MARKERS[0]}
        </p>
        <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {fmtAdt(HEADLINE.poorAdt)}{" "}
          <span className="text-lg font-semibold text-rose-100 sm:text-xl">
            ADT still crosses Poor / structurally deficient spans
          </span>
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          {fmtCount(HEADLINE.poorBridges)} of {fmtCount(HEADLINE.totalBridges)}{" "}
          NBI bridges ({fmtPct(HEADLINE.poorSharePct)}) are Poor — {fmtPct(
            HEADLINE.poorAdtSharePct,
          )}{" "}
          of inventory ADT, against a {fmtPct(HEADLINE.poorDeckSharePct)} share
          of deck area.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["mismatch", "Count vs ADT"],
            ["condition", "Condition mix"],
            ["functional", "Functional class"],
            ["trend", "Decade path"],
            ["system", "NHS vs non-NHS"],
            ["scatter", "State scatter"],
          ] as const
        ).map(([id, label]) => (
          <ControlChip
            key={id}
            active={panel === id}
            onClick={() => setPanel(id)}
          >
            {label}
          </ControlChip>
        ))}
      </div>

      {(panel === "functional" || panel === "scatter") && (
        <div className="flex flex-wrap items-center gap-2">
          {panel === "functional" ? (
            <>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Setting
              </span>
              {(["All", "Rural", "Urban"] as const).map((s) => (
                <ControlChip
                  key={s}
                  active={fcSetting === s}
                  onClick={() => setFcSetting(s)}
                >
                  {s}
                </ControlChip>
              ))}
              <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Metric
              </span>
              <ControlChip
                active={fcMetric === "poorAdtSharePct"}
                onClick={() => setFcMetric("poorAdtSharePct")}
              >
                Poor ADT share (%)
              </ControlChip>
              <ControlChip
                active={fcMetric === "poorCountSharePct"}
                onClick={() => setFcMetric("poorCountSharePct")}
              >
                Poor count share (%)
              </ControlChip>
              <ControlChip
                active={fcMetric === "poorAdt"}
                onClick={() => setFcMetric("poorAdt")}
              >
                Poor ADT volume
              </ControlChip>
            </>
          ) : (
            <>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Region
              </span>
              {(
                [
                  "All",
                  "Northeast",
                  "Midwest",
                  "South",
                  "West",
                  "Territory",
                ] as const
              ).map((r) => (
                <ControlChip
                  key={r}
                  active={region === r}
                  onClick={() => setRegion(r)}
                >
                  {r === "All" ? "All regions" : r}
                </ControlChip>
              ))}
            </>
          )}
        </div>
      )}

      <ChartCard title={meta.title} subtitle={meta.subtitle}>
        {panel === "condition" ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-80 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[...CONDITION_SPLIT]}
                    dataKey="bridges"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {CONDITION_SPLIT.map((row) => (
                      <Cell key={row.id} fill={row.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      fmtCount(Number(value ?? 0)),
                      String(name),
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center gap-3">
              {CONDITION_SPLIT.map((row) => (
                <div
                  key={row.id}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <p className="text-sm font-medium text-slate-600">{row.label}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {fmtCount(row.bridges)}{" "}
                    <span className="text-base font-semibold text-slate-500">
                      ({fmtPct(row.sharePct)})
                    </span>
                  </p>
                </div>
              ))}
              <div className="h-40 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[...RURAL_URBAN_POOR_ADT]}
                      dataKey="adt"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={58}
                    >
                      {RURAL_URBAN_POOR_ADT.map((row) => (
                        <Cell key={row.id} fill={row.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        fmtAdt(Number(value ?? 0)),
                        "Poor ADT",
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-500">
                Urban spans carry {fmtPct(HEADLINE.urbanPoorAdtShareOfPoorPct, 0)}{" "}
                of Poor ADT even though most Poor bridges sit in rural counties.
              </p>
            </div>
          </div>
        ) : null}

        {panel === "mismatch" ? (
          <div className="h-96 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mismatchStack} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="metric" width={150} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name) => [
                    fmtPct(Number(value ?? 0)),
                    String(name),
                  ]}
                />
                <Legend />
                <Bar dataKey="Poor" stackId="a" fill={ROSE} name="Poor / deficient" />
                <Bar
                  dataKey="Not poor"
                  stackId="a"
                  fill={SLATE}
                  name="Good + Fair"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "functional" ? (
          <div className="h-[420px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={fcRows}
                margin={{ bottom: 72, left: 8 }}
              >
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis
                  dataKey="shortLabel"
                  interval={0}
                  angle={-32}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  tickFormatter={(v) =>
                    fcMetric === "poorAdt" ? fmtAdt(Number(v)) : `${v}%`
                  }
                />
                <Tooltip
                  formatter={(value) =>
                    fcMetric === "poorAdt"
                      ? [fmtAdt(Number(value ?? 0)), "Poor ADT"]
                      : [fmtPct(Number(value ?? 0)), "Share"]
                  }
                  labelFormatter={(label) => String(label)}
                />
                <Bar
                  dataKey={fcMetric}
                  name={
                    fcMetric === "poorAdt"
                      ? "Poor ADT"
                      : fcMetric === "poorCountSharePct"
                        ? "Poor count share"
                        : "Poor ADT share"
                  }
                  radius={[4, 4, 0, 0]}
                >
                  {fcRows.map((row) => (
                    <Cell
                      key={row.id}
                      fill={row.setting === "Urban" ? ROSE : SKY}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "trend" ? (
          <div className="h-96 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendRows}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis
                  yAxisId="left"
                  domain={[0, 12]}
                  tickFormatter={(v) => `${v}%`}
                  label={{
                    value: "Poor share of count",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: SLATE },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 8]}
                  tickFormatter={(v) => `${v}%`}
                  label={{
                    value: "Poor share of ADT",
                    angle: 90,
                    position: "insideRight",
                    style: { fontSize: 11, fill: SLATE },
                  }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    value == null ? "n/a" : fmtPct(Number(value)),
                    String(name),
                  ]}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="poorSharePct"
                  name="Poor count share"
                  fill={ROSE}
                  fillOpacity={0.15}
                  stroke={ROSE}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="adtShare"
                  name="Poor ADT share"
                  stroke={TEAL}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  connectNulls={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "system" ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-80 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...HIGHWAY_SYSTEM]}>
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} />
                  <YAxis tickFormatter={(v) => `${v}%`} domain={[0, 10]} />
                  <Tooltip
                    formatter={(value) => [fmtPct(Number(value ?? 0)), "Poor share"]}
                  />
                  <Bar dataKey="poorSharePct" name="Poor share of bridges" radius={[4, 4, 0, 0]}>
                    {HIGHWAY_SYSTEM.map((row) => (
                      <Cell
                        key={row.id}
                        fill={
                          row.id === "nhs"
                            ? TEAL
                            : row.id === "non-nhs"
                              ? ROSE
                              : AMBER
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center gap-3">
              {HIGHWAY_SYSTEM.map((row) => (
                <div
                  key={row.id}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <p className="text-sm font-medium text-slate-600">{row.label}</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {fmtCount(row.poor)} Poor / {fmtCount(row.bridges)}{" "}
                    <span className="text-base font-semibold text-slate-500">
                      ({fmtPct(row.poorSharePct)})
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {panel === "scatter" ? (
          <div className="h-96 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ bottom: 12, left: 8, right: 12 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Poor share"
                  unit="%"
                  tickFormatter={(v) => `${v}%`}
                  label={{
                    value: "Poor share of state bridges",
                    position: "insideBottom",
                    offset: -4,
                    style: { fontSize: 11, fill: SLATE },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Poor ADT"
                  tickFormatter={(v) => `${v}M`}
                  label={{
                    value: "Poor ADT (millions)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: SLATE },
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    if (name === "Poor share") return [fmtPct(Number(value)), name];
                    if (name === "Poor ADT")
                      return [`${Number(value).toFixed(1)}M`, name];
                    return [String(value), String(name)];
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as
                      | { state?: string; poor?: number }
                      | undefined;
                    return p?.state
                      ? `${p.state} (${fmtCount(p.poor ?? 0)} Poor)`
                      : "";
                  }}
                />
                <Scatter data={scatter} fill={ROSE}>
                  {scatter.map((row) => (
                    <Cell
                      key={row.abbr}
                      fill={
                        row.region === "Northeast"
                          ? ROSE
                          : row.region === "Midwest"
                            ? AMBER
                            : row.region === "South"
                              ? SKY
                              : row.region === "West"
                                ? TEAL
                                : SLATE
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </ChartCard>

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <p className="sr-only">
        Structurally deficient bridges versus daily traffic — interactive FHWA
        NBI Poor condition and ADT dashboard.
      </p>
    </div>
  );
}
