"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  DUAL_CASH_PATH,
  HEADLINE,
  RETAIL_INST_SLOPE,
  SOURCE_NOTE,
  SOURCES,
  WEEKLY_SNAPSHOT_2026_07_29,
  YEAR_END_COMPOSITION,
  YIELD_GAP_PATH,
  fmtBn,
  fmtPct,
  fmtPp,
  fmtTn,
  latestCompositionRanked,
  rankedInvestorShares,
} from "@/data/money-market-funds-deposits-data";

// viz-types: dual-line area, stacked composition, yield-gap bars, retail-inst slope | layout: canvas

type Tab = "piles" | "mix" | "yield" | "investors";
type RangeMode = "full" | "hike";

const GOV = "#0ea5e9";
const PRIME = "#f59e0b";
const MUNI = "#a78bfa";
const DEPOSIT = "#64748b";
const MMF = "#14b8a6";
const GAP = "#f43f5e";

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
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              value === o.id
                ? "bg-teal-800 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MoneyMarketFundsDepositsDashboard() {
  const [tab, setTab] = useState<Tab>("piles");
  const [range, setRange] = useState<RangeMode>("full");

  const dualPath = useMemo(() => {
    const rows =
      range === "hike"
        ? DUAL_CASH_PATH.filter((d) => d.sortKey >= 2022)
        : DUAL_CASH_PATH;
    return rows;
  }, [range]);

  const yieldPath = useMemo(() => {
    const rows =
      range === "hike"
        ? YIELD_GAP_PATH.filter((d) => d.sortKey >= 2022)
        : YIELD_GAP_PATH;
    return rows.map((d) => ({
      ...d,
      gap: d.gapPp,
    }));
  }, [range]);

  const stackedMix = useMemo(() => {
    const rows =
      range === "hike"
        ? YEAR_END_COMPOSITION.filter((d) => d.year >= 2022)
        : YEAR_END_COMPOSITION;
    return rows.map((d) => ({
      year: String(d.year),
      Government: d.governmentTn,
      Prime: d.primeTn,
      "Tax-exempt": d.taxExemptTn,
    }));
  }, [range]);

  const compositionBars = useMemo(() => latestCompositionRanked(), []);
  const investorBars = useMemo(() => rankedInvestorShares(), []);

  const slopeRows = useMemo(
    () =>
      RETAIL_INST_SLOPE.map((s) => ({
        label: s.shortLabel,
        start: s.startTn,
        end: s.endTn,
        delta: s.endTn - s.startTn,
      })).sort((a, b) => b.end - a.end),
    [],
  );

  return (
    <div data-viz className="mx-auto w-full max-w-6xl space-y-6">
      <header className="rounded-xl border border-teal-900/20 bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300/90">
          Money market funds vs bank deposits — ICI + Fed
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {fmtTn(HEADLINE.mmfTotalTn)} in MMFs — still{" "}
          {fmtPp(HEADLINE.yieldGapPp)} above bank savings yields
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          As of {HEADLINE.mmfAsOf}, ICI puts US money market fund assets at{" "}
          <strong className="text-white">{fmtTn(HEADLINE.mmfTotalTn)}</strong>.
          Government funds are{" "}
          <strong className="text-white">
            {fmtPct(HEADLINE.governmentSharePct)}
          </strong>{" "}
          of the pile. YE 2025 taxable MMF yields averaged{" "}
          <strong className="text-white">{fmtPct(HEADLINE.mmfYieldPct)}</strong>{" "}
          versus{" "}
          <strong className="text-white">
            {fmtPct(HEADLINE.depositYieldPct)}
          </strong>{" "}
          on money-market deposit accounts — a{" "}
          {fmtPp(HEADLINE.yieldGapPp)} gap that helped pull cash out of banks
          during the hike cycle.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToggleGroup
          label="View"
          value={tab}
          onChange={setTab}
          options={[
            { id: "piles", label: "Cash piles" },
            { id: "mix", label: "Fund mix" },
            { id: "yield", label: "Yield gap" },
            { id: "investors", label: "Retail vs inst" },
          ]}
        />
        <ToggleGroup
          label="Range"
          value={range}
          onChange={setRange}
          options={[
            { id: "full", label: "2019–2026" },
            { id: "hike", label: "Hike era" },
          ]}
        />
      </div>

      {tab === "piles" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Two cash piles: MMFs vs bank deposits"
            subtitle="Deposits = domestically chartered banks excl. large time deposits (Fed H.8 / FEDS Note). May 2025 deposits disclosed; other deposit points estimated."
          >
            <div className="h-80 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <ComposedChart
                  data={dualPath}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}T`}
                    domain={[0, "auto"]}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      fmtTn(Number(value)),
                      String(name),
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="depositsTn"
                    name="Bank deposits"
                    fill={DEPOSIT}
                    fillOpacity={0.15}
                    stroke={DEPOSIT}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="mmfTn"
                    name="Money market funds"
                    stroke={MMF}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="MMF share of the combined cash pile"
            subtitle="MMF ÷ (MMF + deposits). The share jumped as deposits stalled and MMF AUM kept climbing."
          >
            <div className="h-80 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <AreaChart
                  data={dualPath}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[15, 40]}
                  />
                  <Tooltip
                    formatter={(value) => [fmtPct(Number(value)), "MMF share"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="mmfSharePct"
                    name="MMF share"
                    fill={MMF}
                    fillOpacity={0.35}
                    stroke={MMF}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "mix" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Composition over time: government dominates"
            subtitle="Stacked AUM ($T). Government funds absorbed most of the post-2022 inflow."
          >
            <div className="h-80 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <AreaChart
                  data={stackedMix}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}T`}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      fmtTn(Number(value)),
                      String(name),
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="Government"
                    stackId="1"
                    fill={GOV}
                    stroke={GOV}
                  />
                  <Area
                    type="monotone"
                    dataKey="Prime"
                    stackId="1"
                    fill={PRIME}
                    stroke={PRIME}
                  />
                  <Area
                    type="monotone"
                    dataKey="Tax-exempt"
                    stackId="1"
                    fill={MUNI}
                    stroke={MUNI}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Latest weekly mix (29 Jul 2026)"
            subtitle="Ranked highest → lowest. Government funds alone are $6.47T."
          >
            <div className="h-80 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <BarChart
                  data={compositionBars}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => fmtBn(v)}
                  />
                  <YAxis
                    type="category"
                    dataKey="type"
                    width={90}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value, name, item) => {
                      const share = item?.payload?.sharePct;
                      return [
                        `${fmtBn(Number(value))} (${fmtPct(Number(share))})`,
                        String(name),
                      ];
                    }}
                  />
                  <Bar dataKey="bn" name="Assets" radius={[0, 6, 6, 0]}>
                    {compositionBars.map((row) => (
                      <Cell
                        key={row.type}
                        fill={
                          row.type === "Government"
                            ? GOV
                            : row.type === "Prime"
                              ? PRIME
                              : MUNI
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "yield" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Yield paths: MMF vs money-market deposit accounts"
            subtitle="YE 2025 gap is disclosed by ICI Fact Book commentary (3.9% vs 0.6%). Earlier years estimated."
          >
            <div className="h-80 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <ComposedChart
                  data={yieldPath}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      fmtPct(Number(value)),
                      String(name),
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="mmfYieldPct"
                    name="Taxable MMF yield"
                    stroke={MMF}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="depositYieldPct"
                    name="MMDA / deposit yield"
                    stroke={DEPOSIT}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Yield gap (percentage points)"
            subtitle="Ranked by period. Gap peaked near the 2023 hike crest — deposits lagged policy rates."
          >
            <div className="h-80 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <BarChart
                  data={[...yieldPath].sort((a, b) => b.gap - a.gap)}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v} pp`}
                  />
                  <Tooltip
                    formatter={(value) => [fmtPp(Number(value)), "Yield gap"]}
                  />
                  <Bar dataKey="gap" name="Yield gap" radius={[6, 6, 0, 0]}>
                    {[...yieldPath]
                      .sort((a, b) => b.gap - a.gap)
                      .map((row) => (
                        <Cell key={row.period} fill={GAP} fillOpacity={0.85} />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "investors" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Retail vs institutional: 2019 → 2026 slope"
            subtitle="Both channels nearly doubled. Institutional remains the larger pile."
          >
            <div className="h-80 min-h-[280px] w-full space-y-6 px-2 py-4">
              {slopeRows.map((row) => (
                <div key={row.label} className="relative">
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-800">
                    <span>{row.label}</span>
                    <span className="text-teal-800">
                      {fmtTn(row.start)} → {fmtTn(row.end)} (+{fmtTn(row.delta)}
                      )
                    </span>
                  </div>
                  <div className="relative h-3 rounded-full bg-slate-100">
                    <div
                      className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-teal-600/40"
                      style={{
                        left: `${(row.start / 5) * 100}%`,
                        width: `${((row.end - row.start) / 5) * 100}%`,
                      }}
                    />
                    <div
                      className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-slate-400 shadow"
                      style={{ left: `calc(${(row.start / 5) * 100}% - 7px)` }}
                    />
                    <div
                      className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-teal-600 shadow"
                      style={{ left: `calc(${(row.end / 5) * 100}% - 7px)` }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs text-slate-500">
                Markers: gray = 2019 YE (ICI), teal = Jul 2026 weekly (ICI).
                Axis scaled to $5T.
              </p>
            </div>
          </ChartCard>

          <ChartCard
            title="Who holds the $7.85T today?"
            subtitle="Institutional share classes still outweigh retail — ranked highest → lowest."
          >
            <div className="h-80 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <BarChart
                  data={investorBars}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => fmtBn(v)}
                  />
                  <YAxis
                    type="category"
                    dataKey="type"
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value, name, item) => {
                      const share = item?.payload?.sharePct;
                      return [
                        `${fmtBn(Number(value))} (${fmtPct(Number(share))})`,
                        String(name),
                      ];
                    }}
                  />
                  <Bar dataKey="bn" name="Assets" radius={[0, 6, 6, 0]}>
                    {investorBars.map((row) => (
                      <Cell
                        key={row.type}
                        fill={row.type === "Institutional" ? MMF : PRIME}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <footer className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs leading-relaxed text-slate-600">
        <p>{SOURCE_NOTE}</p>
        <p className="mt-2">
          Snapshot: gov {fmtBn(WEEKLY_SNAPSHOT_2026_07_29.governmentBn)} · prime{" "}
          {fmtBn(WEEKLY_SNAPSHOT_2026_07_29.primeBn)} · tax-exempt{" "}
          {fmtBn(WEEKLY_SNAPSHOT_2026_07_29.taxExemptBn)}. Fed substitution β ≈{" "}
          {HEADLINE.substitutionBeta} (full sample weekly growth).
        </p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                className="font-medium text-teal-800 underline-offset-2 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
