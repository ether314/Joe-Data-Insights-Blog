"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  EMANCIPATION_SERIES,
  GAP_METRIC_OPTIONS,
  HEADLINE,
  NYTD_CUMULATIVE_HOMELESS,
  NYTD_OUTCOMES,
  SOURCE_NOTE,
  SOURCES,
  VIZ_MARKERS,
  fmtInt,
  fmtPct,
  housingRiskExposureSeries,
  housingVsWorkSeries,
  nytdMetricPct,
  outcomeProfile,
  type GapMetricId,
  type NytdAge,
} from "@/data/aging-out-counts-versus-young-adult-housing-instability-2026-data";

// viz-types: dual-axis emancipation volume+share, dual-line housing vs work, radar NYTD profile,
// area exposure ladder, horizontal gap bars, outcomes table | controls: panel, age wave, year window

type PanelId =
  | "volume"
  | "housingWork"
  | "profile"
  | "exposure"
  | "gaps"
  | "table";

const PANEL_OPTIONS: { id: PanelId; label: string }[] = [
  { id: "volume", label: "Emancipation volume" },
  { id: "housingWork", label: "Housing vs work" },
  { id: "profile", label: "NYTD profile radar" },
  { id: "exposure", label: "Housing-risk exposure" },
  { id: "gaps", label: "Outcome gaps" },
  { id: "table", label: "Outcomes table" },
];

type YearWindow = "all" | "recent";

const YEAR_OPTIONS: { id: YearWindow; label: string }[] = [
  { id: "all", label: "FY2019–FY2024" },
  { id: "recent", label: "FY2022–FY2024" },
];

const AGE_OPTIONS: { id: NytdAge; label: string }[] = [
  { id: 17, label: "Age 17" },
  { id: 19, label: "Age 19" },
  { id: 21, label: "Age 21" },
];

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const ROSE = "#e11d48";
const AMBER = "#d97706";
const GRID = "#e2e8f0";

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

function ControlRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function ToggleBtn({
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

export function AgingOutCountsVersusYoungAdultHousingInstability2026Dashboard() {
  const [panel, setPanel] = useState<PanelId>("volume");
  const [yearWindow, setYearWindow] = useState<YearWindow>("all");
  const [ageWave, setAgeWave] = useState<NytdAge>(21);
  const [gapMetric, setGapMetric] = useState<GapMetricId>("homeless");

  const volumeRows = useMemo(() => {
    const series =
      yearWindow === "recent"
        ? EMANCIPATION_SERIES.filter((r) => r.fy >= 2022)
        : EMANCIPATION_SERIES;
    return series.map((r) => ({
      label: r.label,
      emancipationN: r.emancipationN,
      emancipationPct: r.emancipationPct,
      exitsTotal: r.exitsTotal,
    }));
  }, [yearWindow]);

  const housingWork = useMemo(() => housingVsWorkSeries(), []);
  const profile = useMemo(() => outcomeProfile(ageWave), [ageWave]);
  const exposure = useMemo(() => {
    const series = housingRiskExposureSeries();
    return yearWindow === "recent"
      ? series.filter((r) => r.fy >= 2022)
      : series;
  }, [yearWindow]);

  const gapBars = useMemo(() => {
    return NYTD_OUTCOMES.map((r) => {
      const v = nytdMetricPct(r, gapMetric);
      return {
        label: r.label,
        value: v ?? 0,
        missing: v === null,
      };
    });
  }, [gapMetric]);

  const homelessWindowNote =
    ageWave === 17
      ? "Homelessness at age 17 is lifetime prevalence."
      : "Homelessness at ages 19 and 21 is past-two-years.";

  return (
    <div
      className="space-y-6"
      data-viz="aging-out-counts-versus-young-adult-housing-instability-2026"
      data-viz-root={VIZ_MARKERS.root}
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-5 text-white sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-200/90">
          AFCARS emancipation × NYTD Cohort 3
        </p>
        <p className="mt-2 text-lg font-bold leading-snug sm:text-xl">
          Headline — {fmtInt(HEADLINE.emancipationFy2024)} aged out in FY2024;
          {` `}
          {fmtPct(HEADLINE.nytdHomelessAge21Past2YrsPct)} of NYTD 21-year-olds
          reported homelessness in the prior two years
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Emancipation exits fell about {HEADLINE.emancipationDropPctApprox}% from
          FY2019 ({fmtInt(HEADLINE.emancipationFy2019)}) to FY2024, yet still
          account for roughly {fmtPct(HEADLINE.emancipationShareFy2024Pct)} of all
          exits. Among Cohort 3 youth who completed all three survey waves,{" "}
          {fmtPct(NYTD_CUMULATIVE_HOMELESS.anyHomelessBy21Pct)} reported a homeless
          experience by age 21.
        </p>
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <ControlRow label="Panel">
          {PANEL_OPTIONS.map((opt) => (
            <ToggleBtn
              key={opt.id}
              active={panel === opt.id}
              onClick={() => setPanel(opt.id)}
            >
              {opt.label}
            </ToggleBtn>
          ))}
        </ControlRow>
        <ControlRow label="Years">
          {YEAR_OPTIONS.map((opt) => (
            <ToggleBtn
              key={opt.id}
              active={yearWindow === opt.id}
              onClick={() => setYearWindow(opt.id)}
            >
              {opt.label}
            </ToggleBtn>
          ))}
        </ControlRow>
        <ControlRow label="NYTD age">
          {AGE_OPTIONS.map((opt) => (
            <ToggleBtn
              key={opt.id}
              active={ageWave === opt.id}
              onClick={() => setAgeWave(opt.id)}
            >
              {opt.label}
            </ToggleBtn>
          ))}
        </ControlRow>
      </div>

      {panel === "volume" ? (
        <ChartCard
          title="Emancipation volume"
          subtitle="Annual aging-out discharges (bars) versus share of all exits (line)"
        >
          <div className="h-[360px] w-full" data-panel={VIZ_MARKERS.emancipationPanel}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={volumeRows} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: NAVY, fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: NAVY, fontSize: 11 }}
                  tickFormatter={(v) => fmtInt(Number(v))}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 12]}
                  tick={{ fill: TEAL, fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = Number(value);
                    if (name === "Share of exits") return [fmtPct(n), name];
                    return [fmtInt(n), String(name)];
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="emancipationN"
                  name="Emancipation exits"
                  fill={NAVY}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="emancipationPct"
                  name="Share of exits"
                  stroke={TEAL}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: TEAL }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "housingWork" ? (
        <ChartCard
          title="Housing vs work"
          subtitle="NYTD Cohort 3: employment and homelessness rates across survey waves"
        >
          <div className="h-[360px] w-full" data-panel={VIZ_MARKERS.housingWorkPanel}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={housingWork} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: NAVY, fontSize: 12 }} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: NAVY, fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip formatter={(v) => fmtPct(Number(v))} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="employed"
                  name="Employed F/T or P/T"
                  stroke={TEAL}
                  strokeWidth={2.5}
                  dot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="homeless"
                  name="Homeless experience"
                  stroke={ROSE}
                  strokeWidth={2.5}
                  dot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="notInCare"
                  name="No longer in care"
                  stroke={AMBER}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Age-17 homelessness is lifetime; ages 19 and 21 are past-two-years. By
            age 21, {fmtPct(HEADLINE.nytdNotInCareAge21Pct)} of respondents were no longer in foster care.
          </p>
        </ChartCard>
      ) : null}

      {panel === "profile" ? (
        <ChartCard
          title="NYTD profile radar"
          subtitle={`${AGE_OPTIONS.find((a) => a.id === ageWave)?.label} outcome mix (weighted %)`}
        >
          <div className="h-[380px] w-full" data-panel={VIZ_MARKERS.profilePanel}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={profile} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke={GRID} />
                <PolarAngleAxis dataKey="metric" tick={{ fill: NAVY, fontSize: 11 }} />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: "#64748b", fontSize: 10 }}
                />
                <Radar
                  name="Share"
                  dataKey="value"
                  stroke={TEAL}
                  fill={TEAL}
                  fillOpacity={0.35}
                />
                <Tooltip formatter={(v) => fmtPct(Number(v))} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {homelessWindowNote} † Public assistance asked only of respondents not
            in care (shown as 0 at age 17).
          </p>
        </ChartCard>
      ) : null}

      {panel === "exposure" ? (
        <ChartCard
          title="Housing-risk exposure"
          subtitle="Illustrative: emancipation exits × age-21 past-2yr homeless rate (26%) — not a matched cohort"
        >
          <div className="h-[360px] w-full" data-panel={VIZ_MARKERS.exposurePanel}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={exposure} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: NAVY, fontSize: 12 }} />
                <YAxis tick={{ fill: NAVY, fontSize: 11 }} tickFormatter={(v) => fmtInt(Number(v))} />
                <Tooltip formatter={(v) => fmtInt(Number(v))} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="illustrativeAtRisk"
                  name="Illustrative housing-risk exposure"
                  stroke={ROSE}
                  fill={ROSE}
                  fillOpacity={0.25}
                />
                <Bar
                  dataKey="emancipationN"
                  name="Emancipation exits"
                  fill={NAVY}
                  opacity={0.85}
                  radius={[4, 4, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "gaps" ? (
        <ChartCard
          title="Outcome gaps"
          subtitle="Select a metric to compare Cohort 3 waves side by side"
        >
          <ControlRow label="Metric">
            {GAP_METRIC_OPTIONS.map((opt) => (
              <ToggleBtn
                key={opt.id}
                active={gapMetric === opt.id}
                onClick={() => setGapMetric(opt.id)}
              >
                {opt.label}
              </ToggleBtn>
            ))}
          </ControlRow>
          <div className="mt-4 h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={gapBars}
                margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
              >
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: NAVY, fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={72}
                  tick={{ fill: NAVY, fontSize: 12 }}
                />
                <Tooltip
                  formatter={(v, _n, item) => {
                    const missing = (item?.payload as { missing?: boolean })?.missing;
                    if (missing) return ["N/A (in care)", "Share"];
                    return [fmtPct(Number(v)), "Share"];
                  }}
                />
                <Bar dataKey="value" name="Share" fill={TEAL} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "table" ? (
        <ChartCard
          title="Outcomes table"
          subtitle="NYTD Cohort 3 weighted percentages by survey wave"
        >
          <div className="overflow-x-auto" data-panel={VIZ_MARKERS.gapTable}>
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-4 font-semibold">Outcome</th>
                  {NYTD_OUTCOMES.map((r) => (
                    <th key={r.age} className="py-2 px-3 font-semibold">
                      {r.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-slate-800">
                {(
                  [
                    ["Employed F/T or P/T", "employedFullOrPartPct"],
                    ["Any employment-related", "employmentRelatedAnyPct"],
                    ["HS diploma / GED+", "hsDiplomaOrGedPct"],
                    ["Enrolled & attending", "enrolledAttendingPct"],
                    ["Adult connection", "adultConnectionPct"],
                    ["Homeless experience", "homelessPct"],
                    ["No longer in care", "notInCarePct"],
                  ] as const
                ).map(([label, key]) => (
                  <tr key={key} className="border-b border-slate-100">
                    <td className="py-2.5 pr-4 font-medium">{label}</td>
                    {NYTD_OUTCOMES.map((r) => (
                      <td key={r.age} className="px-3 py-2.5 tabular-nums">
                        {fmtPct(r[key])}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-b border-slate-100">
                  <td className="py-2.5 pr-4 font-medium">
                    Public assistance (not in care)
                  </td>
                  {NYTD_OUTCOMES.map((r) => (
                    <td key={r.age} className="px-3 py-2.5 tabular-nums">
                      {r.publicAssistanceNotInCarePct == null
                        ? "—"
                        : fmtPct(r.publicAssistanceNotInCarePct)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium">Respondents (n)</td>
                  {NYTD_OUTCOMES.map((r) => (
                    <td key={r.age} className="px-3 py-2.5 tabular-nums">
                      {fmtInt(r.nRespondents)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Cumulative homelessness among {fmtInt(NYTD_CUMULATIVE_HOMELESS.completedAllWavesN)}{" "}
            youth completing all three waves:{" "}
            {fmtPct(NYTD_CUMULATIVE_HOMELESS.anyHomelessBy21Pct)}.
          </p>
        </ChartCard>
      ) : null}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
        <p>{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-800 underline-offset-2 hover:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
