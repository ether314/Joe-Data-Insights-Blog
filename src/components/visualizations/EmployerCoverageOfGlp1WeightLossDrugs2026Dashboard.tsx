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
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  COST_IMPACT,
  COVERAGE_BY_YEAR,
  HEADLINE,
  INDICATION_CONTRAST,
  PHARMACY_TREND,
  SIZE_LADDER,
  SOURCE_NOTE,
  SPEND_INCREASE_SPLIT,
  fmt1,
  fmtPct,
  type FirmSizeBucket,
} from "@/data/employer-coverage-of-glp-1-weight-loss-drugs-2026-data";

// viz-types: size ladder bars, coverage YoY grouped bars, pharmacy composed
// (area+line), cost-impact horizontal bars, indication contrast + pie |
// layout: default | controls: view + survey + size bucket

type ViewId = "coverage" | "pharmacy" | "cost" | "indication";
type SurveyFilter = "all" | "kff" | "mercer";

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const SKY = "#0284c8";

const BUCKET_OPTIONS: { id: FirmSizeBucket; label: string }[] = [
  { id: "kff_200_plus", label: "KFF 200+" },
  { id: "kff_5000_plus", label: "KFF 5k+" },
  { id: "mercer_500_plus", label: "Mercer 500+" },
  { id: "mercer_20000_plus", label: "Mercer 20k+" },
];

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

export function EmployerCoverageOfGlp1WeightLossDrugs2026Dashboard() {
  const [view, setView] = useState<ViewId>("coverage");
  const [survey, setSurvey] = useState<SurveyFilter>("all");
  const [bucket, setBucket] = useState<FirmSizeBucket>("kff_5000_plus");

  const sizeLadder = useMemo(() => {
    let rows = SIZE_LADDER;
    if (survey === "kff") rows = rows.filter((r) => r.survey === "kff");
    if (survey === "mercer") rows = rows.filter((r) => r.survey === "mercer");
    return rows.map((r) => ({
      name: `${r.workers}`,
      full: r.label,
      cover: r.coverPct,
      year: r.year,
      fill: r.survey === "kff" ? TEAL : INDIGO,
      note: r.note,
    }));
  }, [survey]);

  const yoyBars = useMemo(() => {
    const rows = COVERAGE_BY_YEAR.filter((r) => r.bucket === bucket);
    return rows.map((r) => ({
      year: String(r.year),
      cover: r.coverPct,
      doNot: r.doNotCoverPct ?? null,
      unsure: r.unsurePct ?? null,
      label: r.label,
    }));
  }, [bucket]);

  const pharmacyComposed = useMemo(
    () =>
      PHARMACY_TREND.map((r) => ({
        year: String(r.year),
        totalTrend: r.totalDrugTrendPct,
        glp1Trend: r.glp1WeightLossNetTrendPct,
        shareTotal: r.weightMgmtShareOfTotalPct,
      })),
    [],
  );

  const costBars = useMemo(() => {
    return COST_IMPACT.filter((c) => c.year === 2025 || c.id.includes("2024")).map(
      (c) => ({
        name: c.label.length > 28 ? `${c.label.slice(0, 26)}…` : c.label,
        full: c.label,
        pct: c.pct,
        size: c.firmSize,
        fill:
          c.metric === "very_likely_add"
            ? SLATE
            : c.metric === "conditions"
              ? AMBER
              : ROSE,
      }),
    );
  }, []);

  const indicationBars = useMemo(
    () =>
      INDICATION_CONTRAST.map((r) => ({
        name: r.label.replace("GLP-1 ", "").replace("Obesity meds · ", ""),
        cover: r.coverPct,
        note: r.note,
        fill: r.id === "diabetes" ? TEAL : r.id.includes("kff") ? SKY : INDIGO,
      })),
    [],
  );

  const pieData = useMemo(
    () =>
      SPEND_INCREASE_SPLIT.map((s) => ({
        name: s.label,
        value: s.pct,
        fill: s.fill,
      })),
    [],
  );

  return (
    <div
      className="w-full space-y-6"
      data-viz="employer-coverage-of-glp-1-weight-loss-drugs-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">
          GLP-1 employer coverage · Rx spend tilt
        </p>
        <p className="mt-2 max-w-3xl text-2xl font-bold leading-snug sm:text-3xl">
          Jumbo firms covering GLP-1s for weight loss:{" "}
          <span className="text-teal-300">{HEADLINE.kff5kCover2024}%</span> →{" "}
          <span className="text-amber-300">{HEADLINE.kff5kCover2025}%</span>{" "}
          (KFF 5,000+), while weight-mgmt drugs took{" "}
          <span className="text-rose-300">
            {fmt1(HEADLINE.weightMgmtShareOfIncrease2024)}%
          </span>{" "}
          of the 2024 pharmacy spend increase
        </p>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          KFF EHBS + Mercer national survey coverage shares meet Evernorth /
          Express Scripts commercial trend. Firm-size cuts differ — toggle
          survey and bucket before comparing.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "KFF 200+ cover (2025)",
              value: fmtPct(HEADLINE.kff200PlusCover2025),
            },
            {
              label: "KFF 5k+ cover (2025)",
              value: fmtPct(HEADLINE.kff5kCover2025),
            },
            {
              label: "Mercer 20k+ (2024)",
              value: fmtPct(HEADLINE.mercer20k2024),
            },
            {
              label: "Weight-mgmt % of total Rx",
              value: `${fmt1(HEADLINE.weightMgmtShareOfTotal2024)}%`,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                {s.label}
              </p>
              <p className="mt-0.5 text-lg font-bold tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "coverage", label: "Coverage" },
            { id: "pharmacy", label: "Pharmacy" },
            { id: "cost", label: "Cost shock" },
            { id: "indication", label: "Indication" },
          ]}
        />
        {view === "coverage" && (
          <>
            <ToggleGroup
              label="Survey"
              value={survey}
              onChange={setSurvey}
              options={[
                { id: "all", label: "All" },
                { id: "kff", label: "KFF" },
                { id: "mercer", label: "Mercer" },
              ]}
            />
            <ToggleGroup
              label="YoY bucket"
              value={bucket}
              onChange={setBucket}
              options={BUCKET_OPTIONS}
            />
          </>
        )}
      </div>

      {view === "coverage" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Coverage rises with firm size"
            subtitle="Latest disclosed cut per survey — not a pooled sample"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sizeLadder} margin={{ left: 8, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    domain={[0, 80]}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v) => [`${v}%`, "Cover"]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.full ?? ""
                    }
                  />
                  <Bar dataKey="cover" radius={[6, 6, 0, 0]}>
                    {sizeLadder.map((d) => (
                      <Cell key={d.name + d.year} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Year-over-year coverage"
            subtitle={BUCKET_OPTIONS.find((b) => b.id === bucket)?.label}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yoyBars} margin={{ left: 8, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 12 }} />
                  <YAxis
                    domain={[0, 80]}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip formatter={(v) => [`${v}%`, ""]} />
                  <Legend />
                  <Bar
                    dataKey="cover"
                    name="Cover"
                    fill={TEAL}
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="doNot"
                    name="Do not cover"
                    fill={ROSE}
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="unsure"
                    name="Unsure"
                    fill={SLATE}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "pharmacy" && (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ChartCard
              title="Commercial drug trend vs GLP-1 weight-loss net trend"
              subtitle="Evernorth Pharmacy in Focus — total trend on left scale; GLP-1 net trend on right"
            >
              <div className="h-96 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={pharmacyComposed}
                    margin={{ left: 8, right: 12, top: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 12 }} />
                    <YAxis
                      yAxisId="left"
                      domain={[0, 12]}
                      tick={{ fill: SLATE, fontSize: 11 }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 240]}
                      tick={{ fill: ROSE, fontSize: 11 }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      formatter={(v, name) => [
                        v == null ? "—" : `${v}%`,
                        String(name),
                      ]}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="totalTrend"
                      name="Total drug trend"
                      fill={SKY}
                      fillOpacity={0.25}
                      stroke={SKY}
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="glp1Trend"
                      name="GLP-1 WL net trend"
                      stroke={ROSE}
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: ROSE }}
                      connectNulls={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
          <div className="lg:col-span-2">
            <ChartCard
              title="2024 spend-increase split"
              subtitle={`${fmt1(HEADLINE.weightMgmtShareOfIncrease2024)}% of the increase from weight-mgmt`}
            >
              <div className="h-96 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={3}
                      label={({ value }) => `${value}%`}
                    >
                      {pieData.map((d) => (
                        <Cell key={d.name} fill={d.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, "Share of increase"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-center text-xs text-slate-500">
                Weight-mgmt also = {fmt1(HEADLINE.weightMgmtShareOfTotal2024)}%
                of total commercial drug costs in 2024
              </p>
            </ChartCard>
          </div>
        </div>
      )}

      {view === "cost" && (
        <ChartCard
          title="Cost shock among covering (and non-covering) firms"
          subtitle="KFF 2025 focus — share of firms reporting each signal"
        >
          <div className="h-[28rem] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={costBars}
                margin={{ left: 12, right: 24, top: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  domain={[0, 80]}
                  tick={{ fill: SLATE, fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={160}
                  tick={{ fill: NAVY, fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v) => [`${v}%`, "Share"]}
                  labelFormatter={(_, payload) =>
                    `${payload?.[0]?.payload?.full ?? ""} · ${payload?.[0]?.payload?.size ?? ""}`
                  }
                />
                <Bar dataKey="pct" radius={[0, 6, 6, 0]}>
                  {costBars.map((d) => (
                    <Cell key={d.full} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "indication" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Diabetes indication vs obesity / weight-loss coverage"
            subtitle="Near-universal diabetes cover vs partial obesity cover"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={indicationBars}
                  margin={{ left: 8, right: 8, top: 8, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                    height={60}
                    tick={{ fill: SLATE, fontSize: 10 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v) => [`${v}%`, "Cover"]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.note ?? ""
                    }
                  />
                  <Bar dataKey="cover" radius={[6, 6, 0, 0]}>
                    {indicationBars.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Reading rules"
            subtitle="What the surveys do and do not measure"
          >
            <ul className="space-y-3 text-sm leading-relaxed text-slate-700">
              <li>
                <span className="font-semibold text-slate-900">KFF</span> asks
                firms with 200+ workers whether the{" "}
                <em>largest plan</em> covers GLP-1 agonists used primarily for
                weight loss — not diabetes-only use.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Mercer</span>{" "}
                reports obesity / weight-loss medication coverage among 500+
                (and 20,000+) employers — a different cut and wording.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Evernorth</span>{" "}
                trend rates are commercial-book net trend for GLP-1 weight-loss
                therapies; they are not the same as employer survey coverage
                shares.
              </li>
              <li className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-950">
                Non-coverers are not rushing in: only{" "}
                <strong>1%</strong> of large non-covering firms say they are
                “very likely” to add weight-loss GLP-1 coverage next year (KFF
                2025).
              </li>
            </ul>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
