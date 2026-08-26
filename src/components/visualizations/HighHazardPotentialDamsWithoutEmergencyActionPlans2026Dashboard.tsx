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
  CONDITION_PREPAREDNESS,
  DIVISION_EAP_GAPS,
  EAP_COVERAGE_TREND,
  EAP_STATUS_SPLIT,
  HEADLINE,
  INVENTORY_VS_COVERAGE,
  OWNERSHIP_EAP_COMPARE,
  SOURCE_NOTE,
  VIZ_MARKERS,
  fmtCount,
  fmtPct,
  stateScatterRows,
  type CensusDivision,
} from "@/data/high-hazard-potential-dams-without-emergency-action-plans-2026-data";

// viz-types: donut status, area coverage trend, division gap bars, ownership composed,
// condition stacked, state scatter | layout: default
// smoke-marker: High-hazard dams lacking an EAP

type Panel =
  | "status"
  | "trend"
  | "divisions"
  | "ownership"
  | "condition"
  | "scatter";

type GapMetric = "withoutCount" | "withoutShare";

const NAVY = "#0f172a";
const ROSE = "#e11d48";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const SLATE = "#64748b";
const SKY = "#0284c7";
const GRID = "#e2e8f0";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  status: {
    title: "State-regulated high-hazard dams: EAP on file vs gap",
    subtitle:
      "ASCE 2025 frame — more than 11,000 with an EAP (~82%); ~2,415 still without (~18%)",
  },
  trend: {
    title: "EAP coverage climbed, then plateaued",
    subtitle:
      "State-regulated HHP with an EAP: 35% (1999) → 82% (2021–24); residual gap stuck near 18%",
  },
  divisions: {
    title: "Where the residual EAP gap concentrates",
    subtitle:
      "Census-division desk composites calibrated to the national ~18% without-EAP residual",
  },
  ownership: {
    title: "Federal vs state-regulated EAP coverage",
    subtitle:
      "CRS 2018 ownership split plus the 2024 state-regulated ASCE print",
  },
  condition: {
    title: "Condition assessment × EAP readiness",
    subtitle:
      "Illustrative overlay: ASCE’s ~15% poor/unsatisfactory HHP share crossed with EAP status",
  },
  scatter: {
    title: "Illustrative states: inventory size vs EAP gap rate",
    subtitle:
      "Bubble size = dams without an EAP; desk composites, not an official ASDSO dashboard reprint",
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

const DIVISIONS: Array<CensusDivision | "all"> = [
  "all",
  "New England",
  "Middle Atlantic",
  "East North Central",
  "West North Central",
  "South Atlantic",
  "East South Central",
  "West South Central",
  "Mountain",
  "Pacific",
];

export function HighHazardPotentialDamsWithoutEmergencyActionPlans2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("status");
  const [gapMetric, setGapMetric] = useState<GapMetric>("withoutShare");
  const [division, setDivision] = useState<CensusDivision | "all">("all");

  const divisionBars = useMemo(() => {
    const rows =
      division === "all"
        ? DIVISION_EAP_GAPS
        : DIVISION_EAP_GAPS.filter((d) => d.division === division);
    return [...rows].sort((a, b) =>
      gapMetric === "withoutShare"
        ? b.withoutSharePct - a.withoutSharePct
        : b.withoutEap - a.withoutEap,
    );
  }, [division, gapMetric]);

  const scatter = useMemo(() => stateScatterRows(division), [division]);

  const conditionStack = useMemo(() => {
    const poor = CONDITION_PREPAREDNESS.filter((r) =>
      r.condition.startsWith("Poor"),
    );
    const fair = CONDITION_PREPAREDNESS.filter((r) =>
      r.condition.startsWith("Fair"),
    );
    return [
      {
        band: "Poor / unsatisfactory",
        noEap: poor.find((r) => r.preparedness === "No EAP")?.dams ?? 0,
        withEap: poor.find((r) => r.preparedness === "EAP on file")?.dams ?? 0,
      },
      {
        band: "Other / not rated poor",
        noEap: fair.find((r) => r.preparedness === "No EAP")?.dams ?? 0,
        withEap: fair.find((r) => r.preparedness === "EAP on file")?.dams ?? 0,
      },
    ];
  }, []);

  const meta = PANEL_META[panel];

  return (
    <div
      className="space-y-4"
      data-viz="high-hazard-potential-dams-without-emergency-action-plans-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 px-5 py-5 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-200/90">
          {VIZ_MARKERS[0]}
        </p>
        <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {fmtPct(HEADLINE.withoutEapSharePct)}{" "}
          <span className="text-lg font-semibold text-cyan-100 sm:text-xl">
            of state-regulated high-hazard dams still lack an EAP
          </span>
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          {VIZ_MARKERS[1]} — about {fmtCount(HEADLINE.stateRegulatedWithoutEap)}{" "}
          structures in a {fmtCount(HEADLINE.stateRegulatedHhp)} state-regulated
          high-hazard inventory, against {fmtCount(HEADLINE.nidHighHazard)} NID
          high-hazard dams nationwide.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["status", "EAP status"],
            ["trend", "Coverage trend"],
            ["divisions", "Division gaps"],
            ["ownership", "Ownership compare"],
            ["condition", "Condition × EAP"],
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

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Gap metric
        </span>
        <ControlChip
          active={gapMetric === "withoutShare"}
          onClick={() => setGapMetric("withoutShare")}
        >
          Without-EAP share (%)
        </ControlChip>
        <ControlChip
          active={gapMetric === "withoutCount"}
          onClick={() => setGapMetric("withoutCount")}
        >
          Without-EAP count
        </ControlChip>
        <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Division
        </span>
        {DIVISIONS.map((d) => (
          <ControlChip
            key={d}
            active={division === d}
            onClick={() => setDivision(d)}
          >
            {d === "all" ? "All divisions" : d}
          </ControlChip>
        ))}
      </div>

      <ChartCard title={meta.title} subtitle={meta.subtitle}>
        {panel === "status" ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-80 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[...EAP_STATUS_SPLIT]}
                    dataKey="dams"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {EAP_STATUS_SPLIT.map((row) => (
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
            <div className="flex flex-col justify-center gap-4">
              {EAP_STATUS_SPLIT.map((row) => (
                <div
                  key={row.id}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <p className="text-sm font-medium text-slate-600">{row.label}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {fmtCount(row.dams)}{" "}
                    <span className="text-base font-semibold text-slate-500">
                      ({fmtPct(row.sharePct)})
                    </span>
                  </p>
                </div>
              ))}
              <p className="text-xs text-slate-500">
                Inventory context: {fmtCount(HEADLINE.nidHighHazard)} NID
                high-hazard dams; average dam age ~{HEADLINE.avgDamAgeYears}{" "}
                years; non-federal HHP rehab need ${HEADLINE.nonFederalHhpRehabNeedBb}
                B (ASDSO via ASCE).
              </p>
            </div>
          </div>
        ) : null}

        {panel === "trend" ? (
          <div className="h-96 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={EAP_COVERAGE_TREND}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: SLATE, fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value, name) => [
                    fmtPct(Number(value ?? 0)),
                    String(name),
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="withoutSharePct"
                  name="Without EAP"
                  fill={ROSE}
                  fillOpacity={0.18}
                  stroke={ROSE}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="eapSharePct"
                  name="With EAP"
                  stroke={TEAL}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: TEAL }}
                />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="mt-4 h-40 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={[...INVENTORY_VS_COVERAGE]}>
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: SLATE, fontSize: 11 }}
                    label={{
                      value: "HHP index",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: SLATE, fontSize: 11 },
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[60, 90]}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip />
                  <Bar
                    yAxisId="left"
                    dataKey="hhpIndex"
                    name="HHP inventory index (2012=100)"
                    fill={SKY}
                    opacity={0.75}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="eapSharePct"
                    name="EAP share"
                    stroke={AMBER}
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null}

        {panel === "divisions" ? (
          <div className="h-96 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={divisionBars}
                layout="vertical"
                margin={{ left: 24, right: 16 }}
              >
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  tickFormatter={(v) =>
                    gapMetric === "withoutShare" ? `${v}%` : fmtCount(v)
                  }
                />
                <YAxis
                  type="category"
                  dataKey="division"
                  width={130}
                  tick={{ fill: NAVY, fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value) =>
                    gapMetric === "withoutShare"
                      ? fmtPct(Number(value ?? 0))
                      : fmtCount(Number(value ?? 0))
                  }
                />
                <Bar
                  dataKey={
                    gapMetric === "withoutShare"
                      ? "withoutSharePct"
                      : "withoutEap"
                  }
                  name={
                    gapMetric === "withoutShare"
                      ? "Without-EAP share"
                      : "Dams without EAP"
                  }
                  radius={[0, 4, 4, 0]}
                >
                  {divisionBars.map((row) => (
                    <Cell
                      key={row.id}
                      fill={
                        row.withoutSharePct >= 25
                          ? ROSE
                          : row.withoutSharePct >= 18
                            ? AMBER
                            : TEAL
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "ownership" ? (
          <div className="h-80 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={OWNERSHIP_EAP_COMPARE}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis
                  dataKey="id"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  tickFormatter={(id: string) => {
                    const row = OWNERSHIP_EAP_COMPARE.find((r) => r.id === id);
                    return row ? `${row.regime.split(" ")[0]} ${row.year}` : id;
                  }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: SLATE, fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value, name) => [
                    fmtPct(Number(value ?? 0)),
                    String(name),
                  ]}
                  labelFormatter={(id) => {
                    const row = OWNERSHIP_EAP_COMPARE.find(
                      (r) => r.id === String(id),
                    );
                    return row
                      ? `${row.regime} (${row.year})`
                      : String(id);
                  }}
                />
                <Legend />
                <Bar
                  dataKey="eapSharePct"
                  name="With EAP"
                  fill={TEAL}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="withoutSharePct"
                  name="Without EAP"
                  fill={ROSE}
                  radius={[4, 4, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "condition" ? (
          <div className="h-80 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conditionStack}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="band" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis tick={{ fill: SLATE, fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => fmtCount(Number(value ?? 0))}
                />
                <Legend />
                <Bar
                  dataKey="noEap"
                  name="No EAP"
                  stackId="a"
                  fill={ROSE}
                />
                <Bar
                  dataKey="withEap"
                  name="EAP on file"
                  stackId="a"
                  fill={TEAL}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-3 text-xs text-slate-500">
              ASCE: ~{fmtPct(HEADLINE.poorOrUnsatisfactoryPct)} / more than{" "}
              {fmtCount(HEADLINE.poorOrUnsatisfactoryCount)} high-hazard dams
              assessed poor or unsatisfactory — hazard potential is not
              condition, and an EAP does not repair a deficient structure.
            </p>
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
                  name="HHP dams"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  label={{
                    value: "State-regulated HHP dams (illustrative)",
                    position: "insideBottom",
                    offset: -4,
                    style: { fill: SLATE, fontSize: 11 },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Without %"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  label={{
                    value: "Without-EAP share",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: SLATE, fontSize: 11 },
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    const n = Number(value ?? 0);
                    const label = String(name);
                    if (label === "y" || label === "Without %")
                      return [fmtPct(n), "Without-EAP share"];
                    if (label === "x" || label === "HHP dams")
                      return [fmtCount(n), "HHP dams"];
                    return [fmtCount(n), label];
                  }}
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as
                      | { abbr?: string; state?: string }
                      | undefined;
                    return row?.state
                      ? `${row.state} (${row.abbr})`
                      : "State";
                  }}
                />
                <Scatter name="States" data={scatter} fill={SKY}>
                  {scatter.map((row) => (
                    <Cell
                      key={row.abbr}
                      fill={
                        row.withoutSharePct >= 30
                          ? ROSE
                          : row.withoutSharePct >= 18
                            ? AMBER
                            : TEAL
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
    </div>
  );
}
