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
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  HEADLINE,
  SOURCE_NOTE,
  WEIGHTED_GAP_PATH,
  binCounts,
  cohortMedianLadder,
  fmt1,
  fmtPct,
  fmtPp,
  plansByCohort,
  scatterPoints,
  typeSplitsForYear,
  weightedGapBars,
  type PlanCohort,
} from "@/data/local-police-fire-plan-underfunding-2026-data";

// viz-types: weighted gap bars, median ladder bars, funded-bin grouped bars, funded×liability scatter, type-path composed lines | layout: default

type ViewId = "gaps" | "medians" | "bins" | "scatter" | "path";
type SampleFilter = "all-public-safety" | "muni-public-safety" | "teacher" | "state-employee";
type YearId = 2023 | 2024;

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const INDIGO = "#4f46e5";
const SLATE = "#64748b";

const COHORT_COLORS: Record<string, string> = {
  "muni-public-safety": ROSE,
  "state-public-safety": AMBER,
  teacher: INDIGO,
  "state-employee": SLATE,
  "muni-civilian": TEAL,
  "all-public-safety": ROSE,
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
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        ) : null}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function ToggleGroup<T extends string | number>({
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
            key={String(o.id)}
            type="button"
            onClick={() => onChange(o.id)}
            className={
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors " +
              (value === o.id
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-50")
            }
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function LocalPoliceFirePlanUnderfunding2026Dashboard() {
  const [view, setView] = useState<ViewId>("gaps");
  const [year, setYear] = useState<YearId>(2024);
  const [sample, setSample] = useState<SampleFilter>("all-public-safety");

  const gapBars = useMemo(() => weightedGapBars(year), [year]);
  const typeRows = useMemo(() => typeSplitsForYear(year), [year]);
  const ladder = useMemo(() => cohortMedianLadder(), []);
  const sampleRows = useMemo(
    () => plansByCohort(sample as PlanCohort | "all-public-safety"),
    [sample],
  );
  const bins = useMemo(() => binCounts(sampleRows), [sampleRows]);
  const scatter = useMemo(
    () => scatterPoints(sample as PlanCohort | "all-public-safety"),
    [sample],
  );

  const teacherWeighted =
    typeRows.find((r) => r.cohort === "teacher")?.fundedPct ??
    HEADLINE.teacherWeightedPct;

  return (
    <div
      className="not-prose my-8 space-y-4"
      data-viz="local-police-fire-plan-underfunding-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
          Local police / fire · funded-ratio gap
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Median gap: public-safety sample {fmtPct(HEADLINE.samplePsMedianPct)}{" "}
          vs teachers {fmtPct(HEADLINE.sampleTeacherMedianPct)} (
          {fmtPp(HEADLINE.medianGapPsVsTeacherPp)})
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Equable liability-weighted averages nearly tie municipal public safety
          at {fmtPct(HEADLINE.muniPsWeightedPct)} against teachers at{" "}
          {fmtPct(HEADLINE.teacherWeightedPct)} ({fmtPp(HEADLINE.weightedGapMuniPsVsTeacherPp)}).
          Equal-weight medians in the desk sample flip the intuition harder: large
          public-safety plans sit {fmt1(HEADLINE.medianGapPsVsTeacherPp)} points
          above the teacher median — while Chicago fire and Dallas P&amp;F still
          anchor a brutal left tail.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={view}
          onChange={setView}
          options={[
            { id: "gaps", label: "Weighted gaps" },
            { id: "medians", label: "Median ladder" },
            { id: "bins", label: "Funded bins" },
            { id: "scatter", label: "Funded × size" },
            { id: "path", label: "Type path" },
          ]}
        />
        <div className="flex flex-wrap gap-3">
          <ToggleGroup
            label="Equable year"
            value={year}
            onChange={setYear}
            options={[
              { id: 2023 as YearId, label: "FY 2023" },
              { id: 2024 as YearId, label: "FY 2024" },
            ]}
          />
          <ToggleGroup
            label="Sample filter"
            value={sample}
            onChange={setSample}
            options={[
              { id: "all-public-safety", label: "All public safety" },
              { id: "muni-public-safety", label: "Muni P&F only" },
              { id: "teacher", label: "Teachers" },
              { id: "state-employee", label: "State employees" },
            ]}
          />
        </div>
      </div>

      {view === "gaps" ? (
        <ChartCard
          title={`Liability-weighted funded gap vs teachers (FY ${year})`}
          subtitle={`Teacher / school-employee systems = ${fmtPct(teacherWeighted)}. Positive bars = better funded than teachers.`}
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={gapBars}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: SLATE }}
                  unit=" pp"
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={160}
                  tick={{ fontSize: 11, fill: NAVY }}
                />
                <Tooltip
                  formatter={(v) => [fmtPp(Number(v)), "Gap vs teachers"]}
                  labelFormatter={(l) => String(l)}
                />
                <ReferenceLine x={0} stroke={NAVY} strokeWidth={1} />
                <Bar dataKey="gapVsTeacherPp" radius={[0, 4, 4, 0]}>
                  {gapBars.map((r) => (
                    <Cell
                      key={r.id}
                      fill={
                        r.gapVsTeacherPp >= 0
                          ? COHORT_COLORS[r.cohort] ?? TEAL
                          : ROSE
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "medians" ? (
        <ChartCard
          title="Equal-weight median funded ratio by cohort (desk sample)"
          subtitle="Medians treat each large plan equally — unlike Equable’s liability-weighted type averages."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ladder}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  domain={[0, 120]}
                  tick={{ fontSize: 11, fill: SLATE }}
                  unit="%"
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={150}
                  tick={{ fontSize: 11, fill: NAVY }}
                />
                <Tooltip
                  formatter={(v, name) => [
                    name === "medianPct" ? fmtPct(Number(v)) : String(v),
                    name === "medianPct" ? "Median funded" : String(name),
                  ]}
                />
                <ReferenceLine
                  x={HEADLINE.teacherWeightedPct}
                  stroke={INDIGO}
                  strokeDasharray="4 4"
                  label={{
                    value: "Equable teacher wtd",
                    position: "insideTopRight",
                    fill: INDIGO,
                    fontSize: 10,
                  }}
                />
                <Bar dataKey="medianPct" radius={[0, 4, 4, 0]}>
                  {ladder.map((r) => (
                    <Cell
                      key={r.id}
                      fill={COHORT_COLORS[r.id] ?? TEAL}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "bins" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Funded-ratio bins (selected sample)"
            subtitle={`${sampleRows.length} plans · share of count in each band`}
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bins} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: SLATE }} />
                  <YAxis tick={{ fontSize: 11, fill: SLATE }} unit="%" />
                  <Tooltip
                    formatter={(v) => [`${Number(v).toFixed(1)}%`, "Share"]}
                  />
                  <Bar dataKey="sharePct" fill={TEAL} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Plan roster (selected sample)"
            subtitle="Click Sample filter to swap cohorts"
          >
            <div className="max-h-[300px] overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-2 py-2">Plan</th>
                    <th className="px-2 py-2 text-right">Funded</th>
                    <th className="px-2 py-2">Band</th>
                  </tr>
                </thead>
                <tbody>
                  {[...sampleRows]
                    .sort((a, b) => b.fundedPct - a.fundedPct)
                    .map((p) => (
                      <tr key={p.id} className="border-t border-slate-100">
                        <td className="px-2 py-1.5 font-medium text-slate-800">
                          {p.label}
                        </td>
                        <td className="px-2 py-1.5 text-right tabular-nums">
                          {fmtPct(p.fundedPct)}
                        </td>
                        <td className="px-2 py-1.5 capitalize text-slate-500">
                          {p.band}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {view === "scatter" ? (
        <ChartCard
          title="Funded ratio vs approximate liabilities"
          subtitle="Bubble size scales with liability base — Chicago and large teacher systems dominate dollar risk even when ratios differ."
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="liabilitiesB"
                  name="Liabilities"
                  unit="B"
                  tick={{ fontSize: 11, fill: SLATE }}
                  label={{
                    value: "Approx. liabilities ($B)",
                    position: "insideBottom",
                    offset: -4,
                    fontSize: 11,
                    fill: SLATE,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="fundedPct"
                  name="Funded"
                  unit="%"
                  domain={[0, 130]}
                  tick={{ fontSize: 11, fill: SLATE }}
                />
                <ZAxis type="number" dataKey="liabilitiesB" range={[40, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => [
                    name === "fundedPct" || name === "Funded"
                      ? fmtPct(Number(v))
                      : `$${Number(v).toFixed(1)}B`,
                    String(name),
                  ]}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as
                      | { label?: string }
                      | undefined;
                    return p?.label ?? "";
                  }}
                />
                <ReferenceLine
                  y={60}
                  stroke={ROSE}
                  strokeDasharray="4 4"
                  label={{ value: "60% distressed", fill: ROSE, fontSize: 10 }}
                />
                <Scatter data={scatter} fill={TEAL}>
                  {scatter.map((p) => (
                    <Cell
                      key={p.id}
                      fill={COHORT_COLORS[p.cohort] ?? TEAL}
                      fillOpacity={0.85}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "path" ? (
        <ChartCard
          title="Liability-weighted funded ratios by plan type"
          subtitle="Equable SOP 2024 → SOP 2025 (FY 2023–2024). Statewide public safety jumped hardest."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={WEIGHTED_GAP_PATH}
                margin={{ top: 12, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: SLATE }}
                  allowDecimals={false}
                />
                <YAxis
                  domain={[55, 90]}
                  tick={{ fontSize: 11, fill: SLATE }}
                  unit="%"
                />
                <Tooltip
                  formatter={(v, name) => [fmtPct(Number(v)), String(name)]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="muniPsPct"
                  name="Muni public safety"
                  stroke={ROSE}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="statePsPct"
                  name="Statewide public safety"
                  stroke={AMBER}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="teacherPct"
                  name="Teachers"
                  stroke={INDIGO}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="stateEmpPct"
                  name="State employees"
                  stroke={SLATE}
                  strokeWidth={2.5}
                  strokeDasharray="5 4"
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
