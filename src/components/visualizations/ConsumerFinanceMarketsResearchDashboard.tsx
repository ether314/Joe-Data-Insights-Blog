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
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  APR_GAP_PATH,
  DEBT_STOCK_PATH,
  DELINQUENCY_PATH,
  HEADLINE,
  LIQUID_CASH,
  SAVING_RATE_PATH,
  SOURCE_NOTE,
  SOURCES,
  WEALTH_ALLOCATION,
  debtStockTotalPath,
  fmtPct,
  fmtPp,
  fmtTn,
  latestDebtProductShares,
} from "@/data/consumer-finance-markets-research-2026-data";

// viz-types: stacked debt area, saving line, delinquency multi-line, wealth donut, APR composed, liquid cash bars | layout: canvas

type Panel = "debt" | "saving" | "stress" | "wealth" | "rates" | "cash";
type RangeMode = "full" | "postCovid";
type DelinqProduct = "all" | "creditCard" | "auto" | "mortgage" | "student";

const MORTGAGE = "#0ea5e9";
const CARD = "#f43f5e";
const AUTO = "#f59e0b";
const STUDENT = "#a78bfa";
const HELOC = "#64748b";
const OTHER = "#94a3b8";
const SAVE = "#14b8a6";
const FUNDS = "#38bdf8";
const GAP = "#fb7185";
const WEALTH_COLORS = [
  "#0ea5e9",
  "#14b8a6",
  "#a78bfa",
  "#f59e0b",
  "#f43f5e",
  "#64748b",
  "#94a3b8",
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
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              value === o.id
                ? "bg-cyan-900 text-white"
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

function GenericTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string; dataKey?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const sorted = sortTooltipPayload(payload);
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      {label != null && <p className="mb-1 font-semibold text-slate-800">{label}</p>}
      {sorted.map((p, i) => (
        <p key={i} className="text-slate-600">
          <span style={{ color: p.color }}>{p.name ?? p.dataKey}</span>:{" "}
          {typeof p.value === "number" ? p.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : p.value}
        </p>
      ))}
    </div>
  );
}

export function ConsumerFinanceMarketsResearchDashboard() {
  const [panel, setPanel] = useState<Panel>("debt");
  const [range, setRange] = useState<RangeMode>("full");
  const [delinqProduct, setDelinqProduct] = useState<DelinqProduct>("all");

  const yearFloor = range === "postCovid" ? 2022 : 2019;

  const debtStack = useMemo(
    () =>
      DEBT_STOCK_PATH.filter((d) => d.year >= yearFloor).map((d) => ({
        label: d.label,
        Mortgage: d.mortgageTn,
        "Credit cards": d.creditCardTn,
        Auto: d.autoTn,
        Student: d.studentTn,
        HELOC: d.helocTn,
        Other: d.otherTn,
        total: d.totalTn,
      })),
    [yearFloor],
  );

  const debtTotals = useMemo(
    () => debtStockTotalPath().filter((d) => d.year >= yearFloor),
    [yearFloor],
  );

  const productShares = useMemo(() => latestDebtProductShares(), []);

  const savingPath = useMemo(
    () => SAVING_RATE_PATH.filter((d) => d.sortKey >= yearFloor),
    [yearFloor],
  );

  const delinqPath = useMemo(
    () => DELINQUENCY_PATH.filter((d) => d.year >= yearFloor),
    [yearFloor],
  );

  const aprPath = useMemo(
    () => APR_GAP_PATH.filter((d) => d.year >= yearFloor),
    [yearFloor],
  );

  const wealthPie = useMemo(
    () =>
      WEALTH_ALLOCATION.map((w) => ({
        name: w.shortLabel,
        value: w.sharePct,
        tn: w.tn,
      })),
    [],
  );

  const cashBars = useMemo(
    () =>
      LIQUID_CASH.map((c) => ({
        name: c.label.replace(" (ex-large time)", "").replace(" (est.)", ""),
        tn: c.tn,
        yieldPct: c.yieldPct,
      })),
    [],
  );

  return (
    <div data-viz data-viz-dashboard className="mx-auto w-full max-w-6xl space-y-6">
      <header className="rounded-xl border border-cyan-900/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/90">
          Consumer finance &amp; household balance sheets — BEA · NY Fed · Z.1
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {fmtTn(HEADLINE.totalHouseholdDebtTn)} in household debt — cards
          delinquent at {fmtPct(HEADLINE.cardDelinq90Pct)} while mortgages stay
          near {fmtPct(HEADLINE.mortgageDelinq90Pct)}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          As of {HEADLINE.asOfDebt}, mortgages still dominate (~
          {fmtPct(HEADLINE.mortgageSharePct)} of balances), but stress is
          concentrated in revolving credit. The personal saving rate sits near{" "}
          {fmtPct(HEADLINE.personalSavingRatePct)} — far below the{" "}
          {fmtPct(HEADLINE.peakSavingRate2021Pct)} stimulus peak — while card
          APRs hover near {fmtPct(HEADLINE.cardAprPct)}, a {fmtPp(HEADLINE.aprGapPp)}{" "}
          wedge over fed funds.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-cyan-100/90">
          <span className="rounded-md bg-white/10 px-2.5 py-1">
            Net worth ~{fmtTn(HEADLINE.householdNetWorthTn, 0)}
          </span>
          <span className="rounded-md bg-white/10 px-2.5 py-1">
            Equities {fmtPct(HEADLINE.equityWealthSharePct)} · Housing{" "}
            {fmtPct(HEADLINE.housingWealthSharePct)}
          </span>
          <span className="rounded-md bg-white/10 px-2.5 py-1">
            MMFs {fmtTn(HEADLINE.mmfCashTn)} vs deposits {fmtTn(HEADLINE.depositsCashTn, 1)}
          </span>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToggleGroup
          label="Panel"
          value={panel}
          onChange={setPanel}
          options={[
            { id: "debt", label: "Debt stack" },
            { id: "saving", label: "Saving rate" },
            { id: "stress", label: "Delinquency" },
            { id: "wealth", label: "Wealth mix" },
            { id: "rates", label: "APR gap" },
            { id: "cash", label: "Liquid cash" },
          ]}
        />
        <ToggleGroup
          label="Range"
          value={range}
          onChange={setRange}
          options={[
            { id: "full", label: "2019–2026" },
            { id: "postCovid", label: "Post-COVID" },
          ]}
        />
      </div>

      {panel === "debt" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Household debt by product"
              subtitle="Stacked balances ($ trillions) — NY Fed report anchors"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={debtStack}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} unit="T" />
                    <Tooltip content={<GenericTooltip />} />
                    <Area type="monotone" dataKey="Mortgage" stackId="1" stroke={MORTGAGE} fill={MORTGAGE} fillOpacity={0.85} />
                    <Area type="monotone" dataKey="Student" stackId="1" stroke={STUDENT} fill={STUDENT} fillOpacity={0.85} />
                    <Area type="monotone" dataKey="Auto" stackId="1" stroke={AUTO} fill={AUTO} fillOpacity={0.85} />
                    <Area type="monotone" dataKey="Credit cards" stackId="1" stroke={CARD} fill={CARD} fillOpacity={0.85} />
                    <Area type="monotone" dataKey="HELOC" stackId="1" stroke={HELOC} fill={HELOC} fillOpacity={0.85} />
                    <Area type="monotone" dataKey="Other" stackId="1" stroke={OTHER} fill={OTHER} fillOpacity={0.85} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard
              title="Latest product shares"
              subtitle={`${fmtTn(HEADLINE.totalHouseholdDebtTn)} total`}
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productShares}
                    layout="vertical"
                    margin={{ left: 8, right: 12 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                    <YAxis type="category" dataKey="shortLabel" width={72} tick={{ fontSize: 11 }} />
                    <Tooltip content={<GenericTooltip />} />
                    <Bar dataKey="sharePct" name="Share %" radius={[0, 4, 4, 0]}>
                      {productShares.map((p) => (
                        <Cell
                          key={p.id}
                          fill={
                            p.id === "mortgage"
                              ? MORTGAGE
                              : p.id === "card"
                                ? CARD
                                : p.id === "auto"
                                  ? AUTO
                                  : p.id === "student"
                                    ? STUDENT
                                    : HELOC
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
          <ChartCard
            title="Total debt path"
            subtitle="Mortgage vs revolving vs installment aggregates"
          >
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={debtTotals}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="T" />
                  <Tooltip content={<GenericTooltip />} />
                  <Bar dataKey="mortgageTn" name="Mortgage" fill={MORTGAGE} stackId="a" />
                  <Bar dataKey="revolvingTn" name="Revolving" fill={CARD} stackId="a" />
                  <Bar dataKey="installmentTn" name="Installment" fill={AUTO} stackId="a" />
                  <Line type="monotone" dataKey="totalTn" name="Total" stroke="#0f172a" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "saving" && (
        <ChartCard
          title="Personal saving rate"
          subtitle="BEA NIPA Table 2.1 — seasonally adjusted annual rate"
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingPath}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, "auto"]} />
                <Tooltip content={<GenericTooltip />} />
                <Area
                  type="monotone"
                  dataKey="savingRatePct"
                  name="Saving rate %"
                  stroke={SAVE}
                  fill={SAVE}
                  fillOpacity={0.25}
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Stimulus-era spike to {fmtPct(HEADLINE.peakSavingRate2021Pct)} (2021 Q2) collapsed
            into a low-single-digit regime; recent points labeled estimated where mid-path
            quarters are interpolated.
          </p>
        </ChartCard>
      )}

      {panel === "stress" && (
        <div className="space-y-4">
          <ToggleGroup
            label="Highlight"
            value={delinqProduct}
            onChange={setDelinqProduct}
            options={[
              { id: "all", label: "All products" },
              { id: "creditCard", label: "Cards" },
              { id: "auto", label: "Auto" },
              { id: "mortgage", label: "Mortgage" },
              { id: "student", label: "Student" },
            ]}
          />
          <ChartCard
            title="90+ day delinquency transition rates"
            subtitle="Share of balance newly 90+ days past due — NY Fed style"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={delinqPath}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip content={<GenericTooltip />} />
                  {(delinqProduct === "all" || delinqProduct === "creditCard") && (
                    <Line
                      type="monotone"
                      dataKey="creditCard"
                      name="Credit cards"
                      stroke={CARD}
                      strokeWidth={delinqProduct === "creditCard" ? 3 : 2}
                      dot={{ r: 3 }}
                    />
                  )}
                  {(delinqProduct === "all" || delinqProduct === "auto") && (
                    <Line
                      type="monotone"
                      dataKey="auto"
                      name="Auto"
                      stroke={AUTO}
                      strokeWidth={delinqProduct === "auto" ? 3 : 2}
                      dot={{ r: 3 }}
                    />
                  )}
                  {(delinqProduct === "all" || delinqProduct === "student") && (
                    <Line
                      type="monotone"
                      dataKey="student"
                      name="Student"
                      stroke={STUDENT}
                      strokeWidth={delinqProduct === "student" ? 3 : 2}
                      dot={{ r: 3 }}
                    />
                  )}
                  {(delinqProduct === "all" || delinqProduct === "mortgage") && (
                    <Line
                      type="monotone"
                      dataKey="mortgage"
                      name="Mortgage"
                      stroke={MORTGAGE}
                      strokeWidth={delinqProduct === "mortgage" ? 3 : 2}
                      dot={{ r: 3 }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "wealth" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Household asset allocation"
            subtitle={`Z.1-style shares of ~${fmtTn(HEADLINE.householdNetWorthTn, 0)} net worth`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wealthPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {wealthPie.map((_, i) => (
                      <Cell key={i} fill={WEALTH_COLORS[i % WEALTH_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<GenericTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard title="Share ranking" subtitle="Percent of household assets">
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={wealthPie}
                  layout="vertical"
                  margin={{ left: 8, right: 12 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                  <YAxis type="category" dataKey="name" width={88} tick={{ fontSize: 11 }} />
                  <Tooltip content={<GenericTooltip />} />
                  <Bar dataKey="value" name="Share %" radius={[0, 4, 4, 0]}>
                    {wealthPie.map((_, i) => (
                      <Cell key={i} fill={WEALTH_COLORS[i % WEALTH_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "rates" && (
        <ChartCard
          title="Credit-card APR vs fed funds"
          subtitle="Commercial bank card APR and effective federal funds — gap in percentage points"
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={aprPath}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} unit="%" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} unit=" pp" />
                <Tooltip content={<GenericTooltip />} />
                <Bar yAxisId="right" dataKey="gapPp" name="APR − funds (pp)" fill={GAP} fillOpacity={0.45} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="cardAprPct"
                  name="Card APR"
                  stroke={CARD}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="fedFundsPct"
                  name="Fed funds"
                  stroke={FUNDS}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "cash" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Where liquid cash sits"
            subtitle="Deposits, MMFs, and estimated short Treasuries ($T)"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashBars} margin={{ bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-18} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11 }} unit="T" />
                  <Tooltip content={<GenericTooltip />} />
                  <Bar dataKey="tn" name="$ trillions" radius={[4, 4, 0, 0]}>
                    <Cell fill={HELOC} />
                    <Cell fill={SAVE} />
                    <Cell fill={FUNDS} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard title="Indicative yields" subtitle="Approximate retail / fund yields (%)">
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashBars} layout="vertical" margin={{ left: 8, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} />
                  <Tooltip content={<GenericTooltip />} />
                  <Bar dataKey="yieldPct" name="Yield %" fill={SAVE} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <footer className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs leading-relaxed text-slate-600">
        <p className="font-semibold text-slate-800">Sources &amp; caveats</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-800 underline-offset-2 hover:underline"
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
