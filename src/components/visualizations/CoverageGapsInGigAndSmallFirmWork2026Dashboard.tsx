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
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  CONTRIBUTION_CONTRASTS,
  COVERAGE_CASCADE,
  HEADLINE,
  MEPS_ENROLLMENT_TREND,
  OFFER_GAPS,
  OFFER_LADDER,
  SHED_COVERAGE,
  SOURCE_NOTE,
  WORKER_CLASS_ACCESS,
  fmtPct,
  fmtPpt,
  type ShedGigSegment,
} from "@/data/coverage-gaps-in-gig-and-small-firm-work-2026-data";

// viz-types: offer ladder bars, MEPS composed (area+line), SHED radar,
// cascade horizontal bars, gap scatter, contribution grouped bars |
// layout: default | controls: view + gig segment + ladder focus

type ViewId = "offer" | "enrollment" | "gig" | "cascade";
type LadderFocus = "all" | "small" | "large";

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const SKY = "#0284c8";

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

export function CoverageGapsInGigAndSmallFirmWork2026Dashboard() {
  const [view, setView] = useState<ViewId>("offer");
  const [gigSegment, setGigSegment] = useState<ShedGigSegment>("any_gig");
  const [ladderFocus, setLadderFocus] = useState<LadderFocus>("all");

  const ladderBars = useMemo(() => {
    let rows = OFFER_LADDER;
    if (ladderFocus === "small") {
      rows = rows.filter((r) =>
        ["kff_10_24", "kff_25_49", "kff_50_199"].includes(r.bucket),
      );
    } else if (ladderFocus === "large") {
      rows = rows.filter((r) =>
        ["kff_200_999", "kff_1000_plus"].includes(r.bucket),
      );
    }
    return rows.map((r) => ({
      name: r.label.replace(" workers", ""),
      offer: r.offerPct,
      fill:
        r.offerPct >= 90 ? TEAL : r.offerPct >= 70 ? SKY : r.offerPct >= 60 ? AMBER : ROSE,
    }));
  }, [ladderFocus]);

  const gapScatter = useMemo(
    () =>
      OFFER_GAPS.map((g) => ({
        x: g.smallPct,
        y: g.largePct,
        gap: g.gapPpt,
        name: g.label,
        fill: g.source === "kff" ? INDIGO : TEAL,
      })),
    [],
  );

  const mepsTrend = useMemo(
    () =>
      MEPS_ENROLLMENT_TREND.map((r) => ({
        year: String(r.year),
        overall: r.overallPct,
        small: r.smallUnder50Pct,
        large: r.large50PlusPct,
        gap: r.large50PlusPct - r.smallUnder50Pct,
      })),
    [],
  );

  const shedRadar = useMemo(() => {
    const focus =
      SHED_COVERAGE.find((r) => r.segment === gigSegment) ?? SHED_COVERAGE[3];
    const baseline = SHED_COVERAGE.find((r) => r.segment === "non_gig")!;
    return [
      {
        metric: "Any insurance",
        focus: focus.anyInsurancePct,
        nonGig: baseline.anyInsurancePct,
      },
      {
        metric: "Employer-provided",
        focus: focus.employerProvidedPct,
        nonGig: baseline.employerProvidedPct,
      },
      {
        metric: "Medicaid/Medicare",
        focus: focus.medicaidMedicarePct,
        nonGig: baseline.medicaidMedicarePct,
      },
    ];
  }, [gigSegment]);

  const shedBars = useMemo(
    () =>
      SHED_COVERAGE.map((r) => ({
        name: r.label.replace(" activity", ""),
        any: r.anyInsurancePct,
        esi: r.employerProvidedPct,
        wish: r.wishHealthInsurancePct ?? null,
        active: r.segment === gigSegment,
      })),
    [gigSegment],
  );

  const cascadeBars = useMemo(
    () =>
      COVERAGE_CASCADE.map((r) => ({
        name: r.shortLabel,
        full: r.step,
        pct: r.pct,
        fill: r.pct >= 80 ? TEAL : r.pct >= 60 ? SKY : AMBER,
      })),
    [],
  );

  const contributionBars = useMemo(
    () =>
      CONTRIBUTION_CONTRASTS.map((r) => ({
        name:
          r.metric.length > 34 ? `${r.metric.slice(0, 32)}…` : r.metric,
        full: r.metric,
        small: r.smallFirmPct,
        large: r.largeFirmPct,
      })),
    [],
  );

  const classAccess = useMemo(
    () =>
      WORKER_CLASS_ACCESS.filter((r) =>
        ["gig_platform", "small_firm", "large_firm"].includes(r.classId),
      ).map((r) => ({
        name: r.label.split(" (")[0],
        esi: r.esiAccessProxyPct,
        fill:
          r.classId === "large_firm"
            ? TEAL
            : r.classId === "small_firm"
              ? AMBER
              : ROSE,
      })),
    [],
  );

  const focusShed = SHED_COVERAGE.find((r) => r.segment === gigSegment);

  return (
    <div
      className="w-full space-y-6"
      data-viz="coverage-gaps-in-gig-and-small-firm-work-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
          Offer-rate gap by firm type · gig vs payroll ESI
        </p>
        <p className="mt-2 max-w-3xl text-2xl font-bold leading-snug sm:text-3xl">
          Large firms offer at{" "}
          <span className="text-teal-300">{HEADLINE.largeFirmOfferPct}%</span>
          ; small firms at{" "}
          <span className="text-amber-300">{HEADLINE.smallFirmOfferPct}%</span>
          — a{" "}
          <span className="text-rose-300">
            {fmtPpt(HEADLINE.offerGapPpt)}
          </span>{" "}
          offer-rate gap (KFF 2025)
        </p>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          Micro firms (10–24) sit at {HEADLINE.microFirmOfferPct}%. MEPS-IC
          enrollment doubles from small (&lt;50) to large (50+) shops. SHED
          gig adults keep high any-insurance rates mainly via other jobs or
          spouses — not platform benefits.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Offer gap (KFF firm)",
              value: fmtPpt(HEADLINE.offerGapPpt),
            },
            {
              label: "MEPS small enroll",
              value: fmtPct(HEADLINE.mepsSmallEnrollPct, 1),
            },
            {
              label: "MEPS large enroll",
              value: fmtPct(HEADLINE.mepsLargeEnrollPct, 1),
            },
            {
              label: "Gig any insurance",
              value: fmtPct(HEADLINE.shedGigAnyInsurancePct),
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
            { id: "offer", label: "Offer gap" },
            { id: "enrollment", label: "Enrollment" },
            { id: "gig", label: "Gig SHED" },
            { id: "cascade", label: "Cascade" },
          ]}
        />
        {view === "offer" && (
          <ToggleGroup
            label="Ladder"
            value={ladderFocus}
            onChange={setLadderFocus}
            options={[
              { id: "all", label: "All sizes" },
              { id: "small", label: "Small cuts" },
              { id: "large", label: "Large cuts" },
            ]}
          />
        )}
        {view === "gig" && (
          <ToggleGroup
            label="Gig segment"
            value={gigSegment}
            onChange={setGigSegment}
            options={[
              { id: "any_gig", label: "Any gig" },
              { id: "platform_tasks", label: "Platform" },
              { id: "short_term_tasks", label: "Short-term" },
              { id: "selling_renting", label: "Sell/rent" },
              { id: "non_gig", label: "Non-gig" },
            ]}
          />
        )}
      </div>

      {view === "offer" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="KFF firm offer ladder"
            subtitle="2025 firm-weighted share offering health benefits to someone"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ladderBars} margin={{ left: 8, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip formatter={(v) => [`${v}%`, "Offer rate"]} />
                  <Bar dataKey="offer" radius={[6, 6, 0, 0]}>
                    {ladderBars.map((r) => (
                      <Cell key={r.name} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Small vs large access proxies"
            subtitle="Each point: small-side % (x) vs large-side % (y); bubble = gap"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Small"
                    domain={[20, 70]}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "Small-side %",
                      position: "insideBottom",
                      offset: -2,
                      fill: SLATE,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Large"
                    domain={[50, 100]}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "Large-side %",
                      angle: -90,
                      position: "insideLeft",
                      fill: SLATE,
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="gap" range={[80, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) =>
                      name === "gap" ? [`${v} ppt`, "Gap"] : [`${v}%`, name]
                    }
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.name ?? "")
                    }
                  />
                  <Scatter data={gapScatter}>
                    {gapScatter.map((r) => (
                      <Cell key={r.name} fill={r.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Archetype ESI access"
            subtitle="Platform ESI (SHED) vs own-employer enrollment (MEPS-IC)"
            >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={classAccess}
                  margin={{ left: 16, right: 16, top: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 70]}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fill: SLATE, fontSize: 11 }}
                  />
                  <Tooltip formatter={(v) => [`${v}%`, "ESI proxy"]} />
                  <Bar dataKey="esi" radius={[0, 6, 6, 0]}>
                    {classAccess.map((r) => (
                      <Cell key={r.name} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Headline gaps"
            subtitle="Percentage-point distance between small and large cuts"
          >
            <ul className="space-y-3">
              {OFFER_GAPS.map((g) => (
                <li
                  key={g.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {g.label}
                    </p>
                    <p className="text-xs text-slate-500">
                      {fmtPct(g.smallPct, g.smallPct % 1 ? 1 : 0)} →{" "}
                      {fmtPct(g.largePct, g.largePct % 1 ? 1 : 0)} · {g.unit}
                    </p>
                  </div>
                  <p className="text-xl font-bold tabular-nums text-rose-600">
                    +{fmtPpt(g.gapPpt, g.gapPpt % 1 ? 1 : 0)}
                  </p>
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      {view === "enrollment" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="MEPS-IC enrollment by firm size"
            subtitle="Private-sector employees covered by own employer · <50 vs 50+"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={mepsTrend} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    domain={[20, 60]}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip formatter={(v) => [`${Number(v).toFixed(1)}%`, ""]} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="overall"
                    name="Overall"
                    fill="#e0e7ff"
                    stroke={INDIGO}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="small"
                    name="<50 employees"
                    stroke={AMBER}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="large"
                    name="50+ employees"
                    stroke={TEAL}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Enrollment gap (large − small)"
            subtitle="Stable ~27–28 ppt gap across recent MEPS-IC vintages"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mepsTrend} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    domain={[20, 35]}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    tickFormatter={(v) => `${v}`}
                  />
                  <Tooltip
                    formatter={(v) => [`${Number(v).toFixed(1)} ppt`, "Gap"]}
                  />
                  <Bar dataKey="gap" fill={ROSE} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "gig" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Coverage mix vs non-gig adults"
            subtitle={
              focusShed
                ? `${focusShed.label} vs adults with no gig activity (SHED 2024)`
                : "SHED 2024"
            }
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={shedRadar}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: SLATE, fontSize: 11 }}
                  />
                  <Tooltip formatter={(v) => [`${v}%`, ""]} />
                  <Radar
                    name="Selected"
                    dataKey="focus"
                    stroke={ROSE}
                    fill={ROSE}
                    fillOpacity={0.35}
                  />
                  <Radar
                    name="Non-gig"
                    dataKey="nonGig"
                    stroke={TEAL}
                    fill={TEAL}
                    fillOpacity={0.15}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Insurance rates across gig segments"
            subtitle="Employer-provided includes another job or spouse’s plan"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shedBars} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: SLATE, fontSize: 10 }}
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip formatter={(v) => [`${v}%`, ""]} />
                  <Legend />
                  <Bar dataKey="any" name="Any insurance" fill={SKY} />
                  <Bar dataKey="esi" name="Employer-provided" fill={INDIGO} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {focusShed?.wishHealthInsurancePct != null && (
            <ChartCard
              title="Wish they had health insurance"
              subtitle="Share agreeing they wished gig work came with health insurance"
            >
              <div className="flex h-48 flex-col items-center justify-center gap-2">
                <p className="text-5xl font-bold tabular-nums text-rose-600">
                  {fmtPct(focusShed.wishHealthInsurancePct)}
                </p>
                <p className="max-w-sm text-center text-sm text-slate-600">
                  {focusShed.label}
                  {focusShed.hasNonGigMainJobPct != null
                    ? ` · ${fmtPct(focusShed.hasNonGigMainJobPct)} also hold a non-gig main job`
                    : ""}
                </p>
              </div>
            </ChartCard>
          )}
        </div>
      )}

      {view === "cascade" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="KFF coverage cascade"
            subtitle="From working at an offering firm to own-employer enrollment"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={cascadeBars}
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fill: SLATE, fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [`${v}%`, "Share"]}
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.full ?? "")
                    }
                  />
                  <Bar dataKey="pct" radius={[0, 6, 6, 0]}>
                    {cascadeBars.map((r) => (
                      <Cell key={r.name} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Small vs large offering firms"
            subtitle="Part-time offers and premium contribution pressure (KFF 2025)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contributionBars} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: SLATE, fontSize: 9 }}
                    interval={0}
                    angle={-12}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis
                    domain={[0, 40]}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v) => [`${v}%`, ""]}
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.full ?? "")
                    }
                  />
                  <Legend />
                  <Bar
                    dataKey="small"
                    name="Small (<200)"
                    fill={AMBER}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="large"
                    name="Large (200+)"
                    fill={TEAL}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">
        <span className="font-semibold text-slate-600">Sources. </span>
        {SOURCE_NOTE}
      </p>
      <p className="sr-only" style={{ color: NAVY }}>
        Interactive dashboard for coverage gaps across gig, small-firm, and
        large-firm work arrangements.
      </p>
    </div>
  );
}
