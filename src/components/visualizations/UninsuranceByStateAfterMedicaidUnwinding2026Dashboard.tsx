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
  ANALYTICS,
  COHORTS,
  DESTINATIONS,
  HEADLINE,
  NATIONAL_PATH,
  REASON_MIX,
  SOURCE_NOTE,
  SLUG,
  VIZ_MARKERS,
  fmtK,
  fmtM,
  fmtPct,
  fmtPp,
  sortedByPp,
  statesByStatus,
  type ExpansionStatus,
} from "@/data/uninsurance-by-state-after-medicaid-unwinding-2026-data";

// viz-types: state pp-change bars, national composed path,
// destination pie, medicaid-loss vs pp scatter, cohort bars,
// reason stacked bars | layout: default
// smoke-marker: Uninsured-rate change after unwinding

type ViewId = "ladder" | "path" | "destinations" | "scatter" | "cohorts";
type StatusFilter = "all" | ExpansionStatus;
type LadderLens = "pp" | "uninsured2024" | "medicaid";

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const INDIGO = "#4f46e5";
const SKY = "#0284c8";
const SLATE = "#64748b";

const STATUS_COLORS: Record<string, string> = {
  "coverage-gap": ROSE,
  "non-expansion": AMBER,
  expansion: TEAL,
};

const DEST_COLORS = [TEAL, ROSE, INDIGO, SKY, AMBER, SLATE];

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
    <div
      className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      data-viz={SLUG}
    >
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

export function UninsuranceByStateAfterMedicaidUnwinding2026Dashboard() {
  const [view, setView] = useState<ViewId>("ladder");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [lens, setLens] = useState<LadderLens>("pp");

  const filtered = useMemo(() => statesByStatus(status), [status]);
  const ladder = useMemo(() => sortedByPp(filtered), [filtered]);

  const ladderData = useMemo(
    () =>
      ladder.map((s) => ({
        ...s,
        name: s.abbr,
        value:
          lens === "pp"
            ? s.ppChange
            : lens === "uninsured2024"
              ? s.uninsured2024
              : Math.abs(s.medicaidDeltaK),
      })),
    [ladder, lens],
  );

  const scatterData = useMemo(
    () =>
      filtered.map((s) => ({
        ...s,
        lossAbs: Math.abs(s.medicaidDeltaK),
        x: Math.abs(s.medicaidDeltaK),
        y: s.ppChange,
        z: Math.max(40, s.marketplaceDeltaK),
      })),
    [filtered],
  );

  const cohortBars = useMemo(
    () =>
      COHORTS.filter((c) => c.status !== "national").map((c) => ({
        ...c,
        name: c.cohort,
      })),
    [],
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          {VIZ_MARKERS[0]}
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          National under-65 uninsured {fmtPct(HEADLINE.nationalUninsured2022Pct)} →{" "}
          {fmtPct(HEADLINE.nationalUninsured2024Pct)} ({fmtPp(HEADLINE.nationalPpChange)})
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Medicaid/CHIP shed about {fmtM(HEADLINE.medicaidNetLossM)} net during redeterminations;
          Marketplace gained ~{fmtM(HEADLINE.marketplaceGainM)}. Coverage-gap states print the
          steepest rate climbs — {HEADLINE.topState} leads the desk panel at {fmtPp(HEADLINE.topStatePp)}.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
          <span>{VIZ_MARKERS[1]}: {fmtM(HEADLINE.medicaidNetLossM)}</span>
          <span>·</span>
          <span>{VIZ_MARKERS[2]}: Marketplace {HEADLINE.marketplaceGainM}M</span>
          <span>·</span>
          <span>
            {VIZ_MARKERS[3]}: gap states avg +{COHORTS[0].avgPpChange.toFixed(2)} pp
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup<ViewId>
          value={view}
          onChange={setView}
          options={[
            { id: "ladder", label: "State rate change" },
            { id: "path", label: "National path" },
            { id: "destinations", label: "Who absorbed churn" },
            { id: "scatter", label: "Loss vs rate rise" },
            { id: "cohorts", label: "Expansion cohorts" },
          ]}
        />
      </div>

      {(view === "ladder" || view === "scatter") && (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <ToggleGroup<StatusFilter>
            value={status}
            onChange={setStatus}
            options={[
              { id: "all", label: "All states" },
              { id: "coverage-gap", label: "Coverage-gap" },
              { id: "expansion", label: "Expansion" },
              { id: "non-expansion", label: "Non-expansion" },
            ]}
          />
          {view === "ladder" && (
            <ToggleGroup<LadderLens>
              value={lens}
              onChange={setLens}
              options={[
                { id: "pp", label: "pp change" },
                { id: "uninsured2024", label: "2024 rate" },
                { id: "medicaid", label: "|Medicaid Δ|" },
              ]}
            />
          )}
        </div>
      )}

      {view === "ladder" && (
        <ChartCard
          title="Uninsured-rate change by state"
          subtitle="ACS-style under-65 rates, 2022 trough → 2024 composite. Color = expansion status."
        >
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ladderData}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: SLATE }}
                  label={{
                    value:
                      lens === "pp"
                        ? "pp change"
                        : lens === "uninsured2024"
                          ? "Uninsured %"
                          : "Medicaid loss (thousands)",
                    position: "insideBottom",
                    offset: -2,
                    style: { fontSize: 11, fill: SLATE },
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={36}
                  tick={{ fontSize: 11, fill: NAVY }}
                />
                <Tooltip
                  formatter={(v, _n) => {
                    const num = typeof v === "number" ? v : Number(v);
                    if (lens === "pp") return [fmtPp(num), "Rate change"];
                    if (lens === "uninsured2024") return [fmtPct(num), "2024 uninsured"];
                    return [fmtK(-Math.abs(num)), "Medicaid Δ"];
                  }}
                  labelFormatter={(label) => {
                    const row = ladderData.find((r) => r.name === label);
                    return row ? `${row.state} (${row.status})` : String(label);
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={18}>
                  {ladderData.map((d) => (
                    <Cell
                      key={d.abbr}
                      fill={STATUS_COLORS[d.status] || TEAL}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {HEADLINE.statesGe1pp} panel states clear ≥1.0 pp; South holds ~
            {ANALYTICS.southShareOfGe1ppStatesPct}% of that set.
          </p>
        </ChartCard>
      )}

      {view === "path" && (
        <ChartCard
          title="Medicaid peak, Marketplace climb, uninsured rebound"
          subtitle="National enrollment (left) vs under-65 uninsured % (right). Unwinding begins 2023 Q2."
        >
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={NATIONAL_PATH}
                margin={{ top: 12, right: 20, left: 4, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: SLATE }} />
                <YAxis
                  yAxisId="enroll"
                  tick={{ fontSize: 11, fill: SLATE }}
                  domain={[70, 100]}
                  label={{
                    value: "Enrollment (M)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: SLATE },
                  }}
                />
                <YAxis
                  yAxisId="rate"
                  orientation="right"
                  tick={{ fontSize: 11, fill: SLATE }}
                  domain={[7.5, 9.5]}
                  label={{
                    value: "Uninsured %",
                    angle: 90,
                    position: "insideRight",
                    style: { fontSize: 11, fill: SLATE },
                  }}
                />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="enroll"
                  type="monotone"
                  dataKey="medicaidM"
                  name="Medicaid/CHIP (M)"
                  fill={TEAL}
                  fillOpacity={0.15}
                  stroke={TEAL}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="enroll"
                  type="monotone"
                  dataKey="marketplaceM"
                  name="Marketplace (M)"
                  stroke={INDIGO}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="rate"
                  type="monotone"
                  dataKey="uninsuredPct"
                  name="Uninsured %"
                  stroke={ROSE}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "destinations" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Who absorbed the churn"
            subtitle={`Shares of ~${fmtM(HEADLINE.medicaidNetLossM)} net Medicaid/CHIP exits`}
          >
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DESTINATIONS}
                    dataKey="sharePct"
                    nameKey="destination"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {DESTINATIONS.map((d, i) => (
                      <Cell key={d.destination} fill={DEST_COLORS[i % DEST_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, item) => {
                      const num = typeof v === "number" ? v : Number(v);
                      const millions = Number(item?.payload?.millions ?? 0);
                      return [
                        `${num}% (${fmtM(millions)})`,
                        String(item?.payload?.destination ?? ""),
                      ];
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Procedural vs eligibility exits"
            subtitle="Reason mix on sampled renewals (CMS/KFF composites)"
          >
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={REASON_MIX}
                  margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="cohort" tick={{ fontSize: 11, fill: SLATE }} />
                  <YAxis tick={{ fontSize: 11, fill: SLATE }} unit="%" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="procedural" stackId="a" fill={AMBER} name="Procedural" />
                  <Bar dataKey="eligibility" stackId="a" fill={TEAL} name="Eligibility" />
                  <Bar dataKey="other" stackId="a" fill={SLATE} name="Other" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              National procedural share ≈ {HEADLINE.proceduralSharePct}% — paperwork, not just
              income ineligibility, drove much of the churn tape.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Medicaid net loss vs uninsured-rate rise"
          subtitle={`Bubble size ∝ Marketplace gain. Desk r ≈ ${ANALYTICS.correlationMedicaidLossVsPp.toFixed(2)}.`}
        >
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Medicaid loss"
                  tick={{ fontSize: 11, fill: SLATE }}
                  label={{
                    value: "|Medicaid Δ| (thousands)",
                    position: "insideBottom",
                    offset: -4,
                    style: { fontSize: 11, fill: SLATE },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="pp change"
                  tick={{ fontSize: 11, fill: SLATE }}
                  label={{
                    value: "Uninsured pp change",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: SLATE },
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => {
                    const num = typeof v === "number" ? v : Number(v);
                    const n = String(name ?? "");
                    if (n === "pp change" || n === "y") return [fmtPp(num), "Rate rise"];
                    if (n === "Medicaid loss" || n === "x")
                      return [fmtK(-Math.abs(num)), "Medicaid Δ"];
                    return [String(v), n];
                  }}
                  labelFormatter={(_l, payload) => {
                    const row = payload?.[0]?.payload as { state?: string; status?: string } | undefined;
                    return row?.state ? `${row.state} (${row.status})` : "";
                  }}
                />
                <Scatter data={scatterData} name="States">
                  {scatterData.map((d) => (
                    <Cell key={d.abbr} fill={STATUS_COLORS[d.status] || TEAL} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "cohorts" && (
        <ChartCard
          title="Expansion vs coverage-gap"
          subtitle="Average pp rise and Marketplace absorption of Medicaid losses by cohort"
        >
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cohortBars}
                margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: SLATE }} />
                <YAxis yAxisId="pp" tick={{ fontSize: 11, fill: SLATE }} />
                <YAxis
                  yAxisId="abs"
                  orientation="right"
                  tick={{ fontSize: 11, fill: SLATE }}
                  unit="%"
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="pp"
                  dataKey="avgPpChange"
                  name="Avg pp rise"
                  fill={ROSE}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="abs"
                  dataKey="marketplaceAbsorbPct"
                  name="Marketplace absorb %"
                  fill={INDIGO}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Coverage-gap avg pp exceeds expansion by ~
            {ANALYTICS.coverageGapAvgPpOverExpansion.toFixed(2)} pp; Marketplace offsets only ~
            {ANALYTICS.marketplaceOffsetOfLossPct}% of national net exits.
          </p>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
