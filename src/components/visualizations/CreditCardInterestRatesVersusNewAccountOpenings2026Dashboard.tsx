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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  ANNUAL,
  HEADLINE,
  QUARTERLY,
  REGIMES,
  SCATTER,
  SOURCE_NOTE,
  VIZ_MARKERS,
  filterFromYear,
  fmtBn,
  fmtM,
  fmtPct,
  type QuarterRow,
} from "@/data/credit-card-interest-rates-versus-new-account-openings-2026-data";

// viz-types: dual-axis composed, APR×accounts scatter, annual bars, underwriting dual-line, regime comparison bars
// | layout: default
// smoke-marker: All-accounts APR 20.94%

type ViewId = "path" | "scatter" | "annual" | "underwriting" | "regimes";
type AprMode = "all" | "assessed";
type FromYear = "2019" | "2021" | "2022";

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const SKY = "#0284c8";

const ERA_COLORS: Record<string, string> = {
  "pre-hike": SKY,
  tightening: AMBER,
  elevated: ROSE,
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

function pathRows(fromYear: number, aprMode: AprMode) {
  return filterFromYear(QUARTERLY, fromYear).map((r: QuarterRow) => ({
    quarter: r.quarter,
    short: r.quarter.replace("20", ""),
    apr: aprMode === "all" ? r.aprAllPct : r.aprAssessedPct,
    accounts: r.newAccountsM,
    limits: r.limitOrigBn,
    carried: r.confidence === "carried",
  }));
}

export function CreditCardInterestRatesVersusNewAccountOpenings2026Dashboard() {
  const [view, setView] = useState<ViewId>("path");
  const [aprMode, setAprMode] = useState<AprMode>("all");
  const [fromYear, setFromYear] = useState<FromYear>("2021");
  const fromYearN = Number(fromYear);

  const pathData = useMemo(
    () => pathRows(fromYearN, aprMode),
    [fromYearN, aprMode],
  );

  const scatterData = useMemo(
    () => SCATTER.filter((p) => p.year >= fromYearN),
    [fromYearN],
  );

  const annualData = useMemo(
    () => ANNUAL.filter((a) => a.year >= fromYearN),
    [fromYearN],
  );

  const underwritingData = useMemo(
    () =>
      filterFromYear(QUARTERLY, fromYearN)
        .filter((r) => r.confidence === "disclosed")
        .map((r) => ({
          quarter: r.quarter,
          short: r.quarter.replace("20", ""),
          sub660: r.sub660Pct,
          avgLimit: r.avgLimitK,
        })),
    [fromYearN],
  );

  const aprLabel =
    aprMode === "all" ? "All-accounts APR" : "Assessed-interest APR";

  return (
    <div
      className="space-y-6"
      data-viz="credit-card-interest-rates-versus-new-account-openings-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">
          Consumer finance · G.19 × Y-14M
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Average card APR vs new revolving accounts
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Commercial-bank all-accounts APRs print at{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.latestAprAllPct)}
          </span>{" "}
          (May 2026) — still{" "}
          <span className="font-semibold text-white">
            {HEADLINE.aprLiftPp.toFixed(2)} pp
          </span>{" "}
          above the 2021 trough — while large-bank new accounts in 2026 Q1 sit{" "}
          <span className="font-semibold text-white">
            {HEADLINE.accountsBelowPeakPct}%
          </span>{" "}
          below the 2022 quarterly peak.
        </p>
        <ul className="mt-4 flex flex-wrap gap-3 text-xs text-slate-300">
          {VIZ_MARKERS.map((m) => (
            <li
              key={m}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1"
            >
              {m}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          value={view}
          onChange={setView}
          options={[
            { id: "path", label: "APR vs openings path" },
            { id: "scatter", label: "APR × accounts" },
            { id: "annual", label: "Annual openings" },
            { id: "underwriting", label: "Underwriting mix" },
            { id: "regimes", label: "Rate regimes" },
          ]}
        />
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
              APR series
            </p>
            <ToggleGroup
              value={aprMode}
              onChange={setAprMode}
              options={[
                { id: "all", label: "All accounts" },
                { id: "assessed", label: "Assessed interest" },
              ]}
            />
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
              From year
            </p>
            <ToggleGroup
              value={fromYear}
              onChange={setFromYear}
              options={[
                { id: "2019", label: "2019+" },
                { id: "2021", label: "2021+" },
                { id: "2022", label: "2022+" },
              ]}
            />
          </div>
        </div>
      </div>

      {view === "path" && (
        <ChartCard
          title={`${aprLabel} versus large-bank new accounts`}
          subtitle="Left axis: G.19 commercial-bank APR (%). Right axis: Philadelphia Fed Y-14M new accounts (millions)."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={pathData}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="short"
                  tick={{ fontSize: 11, fill: SLATE }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  yAxisId="apr"
                  tick={{ fontSize: 11, fill: SLATE }}
                  domain={[12, 24]}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  yAxisId="acct"
                  orientation="right"
                  tick={{ fontSize: 11, fill: SLATE }}
                  domain={[8, 22]}
                  tickFormatter={(v) => `${v}M`}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = Number(value);
                    if (name === "apr") return [fmtPct(n), aprLabel];
                    if (name === "accounts") return [fmtM(n), "New accounts"];
                    return [String(value), String(name)];
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="acct"
                  dataKey="accounts"
                  name="accounts"
                  fill={TEAL}
                  opacity={0.55}
                  radius={[3, 3, 0, 0]}
                />
                <Line
                  yAxisId="apr"
                  type="monotone"
                  dataKey="apr"
                  name="apr"
                  stroke={ROSE}
                  strokeWidth={2.5}
                  dot={false}
                  connectNulls
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Where quarters land: APR versus new-account volume"
          subtitle="Each point is one disclosed quarter. Color marks pre-hike, tightening, and elevated-APR eras."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="aprAllPct"
                  name="APR"
                  unit="%"
                  domain={[14, 22]}
                  tick={{ fontSize: 11, fill: SLATE }}
                  label={{
                    value: "All-accounts APR (%)",
                    position: "insideBottom",
                    offset: -2,
                    style: { fill: SLATE, fontSize: 11 },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="newAccountsM"
                  name="Accounts"
                  unit="M"
                  domain={[8, 22]}
                  tick={{ fontSize: 11, fill: SLATE }}
                  label={{
                    value: "New accounts (M)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: SLATE, fontSize: 11 },
                  }}
                />
                <ZAxis
                  type="number"
                  dataKey="limitOrigBn"
                  range={[40, 200]}
                  name="Limit $"
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    const n = Number(value);
                    if (name === "APR") return [fmtPct(n), "All-accounts APR"];
                    if (name === "Accounts") return [fmtM(n), "New accounts"];
                    if (name === "Limit $") return [fmtBn(n), "Limit originations"];
                    return [String(value), String(name)];
                  }}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.quarter ?? ""
                  }
                />
                {(["pre-hike", "tightening", "elevated"] as const).map((era) => (
                  <Scatter
                    key={era}
                    name={era}
                    data={scatterData.filter((d) => d.era === era)}
                    fill={ERA_COLORS[era]}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "annual" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Calendar-year new accounts"
            subtitle="Sum of quarterly Y-14M RCCCONUMACT prints."
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={annualData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: SLATE }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: SLATE }}
                    tickFormatter={(v) => `${v}M`}
                  />
                  <Tooltip
                    formatter={(v) => [fmtM(Number(v)), "New accounts"]}
                  />
                  <Bar dataKey="newAccountsM" radius={[4, 4, 0, 0]}>
                    {annualData.map((row) => (
                      <Cell
                        key={row.year}
                        fill={row.year >= 2024 ? AMBER : TEAL}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Calendar-year credit-limit originations"
            subtitle="Sum of quarterly RCCCOORG original limits ($B)."
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={annualData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: SLATE }} />
                  <YAxis
                    yAxisId="lim"
                    tick={{ fontSize: 11, fill: SLATE }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <YAxis
                    yAxisId="apr"
                    orientation="right"
                    tick={{ fontSize: 11, fill: SLATE }}
                    domain={[14, 22]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip />
                  <Legend />
                  <Area
                    yAxisId="lim"
                    type="monotone"
                    dataKey="limitOrigBn"
                    name="Limit originations"
                    fill={INDIGO}
                    fillOpacity={0.25}
                    stroke={INDIGO}
                  />
                  <Line
                    yAxisId="apr"
                    type="monotone"
                    dataKey="avgAprAllPct"
                    name="Avg all-accounts APR"
                    stroke={ROSE}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "underwriting" && (
        <ChartCard
          title="Sub-660 share versus average original limit"
          subtitle="Tighter underwriting compressed the sub-660 share even as average assigned limits rose."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={underwritingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="short"
                  tick={{ fontSize: 11, fill: SLATE }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  yAxisId="share"
                  tick={{ fontSize: 11, fill: SLATE }}
                  domain={[14, 28]}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  yAxisId="lim"
                  orientation="right"
                  tick={{ fontSize: 11, fill: SLATE }}
                  domain={[3, 7]}
                  tickFormatter={(v) => `$${v}k`}
                />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="share"
                  type="monotone"
                  dataKey="sub660"
                  name="Sub-660 share"
                  stroke={AMBER}
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  yAxisId="lim"
                  type="monotone"
                  dataKey="avgLimit"
                  name="Avg original limit"
                  stroke={NAVY}
                  strokeWidth={2.5}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "regimes" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Average APR by rate regime"
            subtitle="Simple mean of disclosed quarterly all-accounts prints in each window."
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REGIMES} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[12, 22]}
                    tick={{ fontSize: 11, fill: SLATE }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={120}
                    tick={{ fontSize: 11, fill: SLATE }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v)), "Avg APR"]}
                  />
                  <Bar dataKey="avgAprPct" radius={[0, 4, 4, 0]}>
                    {REGIMES.map((r) => (
                      <Cell
                        key={r.id}
                        fill={
                          r.id === "elevated"
                            ? ROSE
                            : r.id === "hike"
                              ? AMBER
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
            title="Average new accounts by regime"
            subtitle="Same windows — openings cooled after the APR ascent completed."
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REGIMES} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[14, 21]}
                    tick={{ fontSize: 11, fill: SLATE }}
                    tickFormatter={(v) => `${v}M`}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={120}
                    tick={{ fontSize: 11, fill: SLATE }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtM(Number(v)), "Avg new accounts"]}
                  />
                  <Bar dataKey="avgAccountsM" fill={TEAL} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {REGIMES.map((r) => (
                <li key={r.id}>
                  <span className="font-semibold text-slate-800">{r.label}</span>{" "}
                  ({r.start}–{r.end}): {r.note}
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
