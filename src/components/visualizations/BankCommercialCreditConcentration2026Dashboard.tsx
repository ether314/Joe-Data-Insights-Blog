"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
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
  BANK_CONCENTRATION_CURVE,
  BANK_SHARES,
  CMBS_PROPERTIES,
  CRE_COHORTS,
  HEADLINE,
  LENS_COMPARE,
  LOAN_STRESS_SHARES,
  SOURCE_NOTE,
  SOURCES,
  VINTAGE_CHECKS,
  fmtPct,
} from "@/data/bank-commercial-credit-concentration-2026-data";

// viz-types: bank share bars, concentration curve area+line, CRE cohort composed, CMBS pie, stress scatter, loan dual bars | layout: default

type ViewId = "banks" | "cre" | "loanbook" | "cmbs";
type BankMetric = "depositSharePct" | "assetSharePct";
type CreMetric = "creCapitalPct" | "crePdnaPct" | "creStressSharePct";
type LoanMetric = "delinqSharePct" | "chargeSharePct";

const SKY = "#0ea5e9";
const ROSE = "#f43f5e";
const VIOLET = "#8b5cf6";
const AMBER = "#f59e0b";
const SLATE = "#64748b";

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

export function BankCommercialCreditConcentration2026Dashboard() {
  const [view, setView] = useState<ViewId>("banks");
  const [bankMetric, setBankMetric] = useState<BankMetric>("depositSharePct");
  const [creMetric, setCreMetric] = useState<CreMetric>("creCapitalPct");
  const [loanMetric, setLoanMetric] = useState<LoanMetric>("chargeSharePct");
  const [showRest, setShowRest] = useState(true);
  const [cmbsLens, setCmbsLens] = useState<"stressSharePct" | "delinqPct">(
    "stressSharePct",
  );

  const bankBars = useMemo(() => {
    const rows = BANK_SHARES.filter((b) => showRest || b.id !== "rest");
    return [...rows].sort((a, b) => b[bankMetric] - a[bankMetric]);
  }, [bankMetric, showRest]);

  const creBars = useMemo(() => {
    return [...CRE_COHORTS].sort((a, b) => b[creMetric] - a[creMetric]);
  }, [creMetric]);

  const creComposed = useMemo(
    () =>
      CRE_COHORTS.map((c) => ({
        short: c.short,
        capital: c.creCapitalPct,
        pdna: c.crePdnaPct,
        stock: c.creStockSharePct,
        stress: c.creStressSharePct,
      })),
    [],
  );

  const loanBars = useMemo(() => {
    return [...LOAN_STRESS_SHARES].sort(
      (a, b) => b[loanMetric] - a[loanMetric],
    );
  }, [loanMetric]);

  const cmbsPie = useMemo(
    () =>
      CMBS_PROPERTIES.map((p) => ({
        name: p.short,
        value: p[cmbsLens],
        fill: p.fill,
      })),
    [cmbsLens],
  );

  const lensScatter = useMemo(
    () =>
      LENS_COMPARE.filter((l) => l.id !== "cre-capital").map((l) => ({
        ...l,
        x: l.top1Pct,
        y: l.top3Pct,
        z: Math.max(10, l.top3Pct / 3),
      })),
    [],
  );

  const dualRate = useMemo(
    () =>
      LOAN_STRESS_SHARES.map((r) => ({
        short: r.short,
        delinquency: r.delinquencyPct,
        chargeOff: r.chargeOffPct,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="bank-commercial-credit-concentration-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Bank & commercial credit — concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Top-1 bank ~{HEADLINE.top1BankSharePct}% of deposits · Top-3 ~{" "}
          {HEADLINE.top3BankSharePct}%
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Firm-side banking is moderately concentrated (
          <span className="text-sky-300">
            {HEADLINE.top1BankLabel} ~{fmtPct(HEADLINE.top1BankSharePct)}
          </span>
          ; top-4 ~{fmtPct(HEADLINE.top4BankSharePct)}). CRE risk is{" "}
          <span className="text-amber-300">concentrated differently</span>: $1–10B
          banks print median CRE/capital at{" "}
          {fmtPct(HEADLINE.topCreCohortPct, 0)} vs industry{" "}
          {fmtPct(HEADLINE.industryCreMedianPct, 0)}, while mega banks hold ~{" "}
          {fmtPct(HEADLINE.largeBankCreStressSharePct, 0)} of CRE PDNA dollars.
          Loss realization still concentrates in cards (
          {fmtPct(HEADLINE.cardsChargeOffPct)} C/O); CMBS stress concentrates in
          office ({fmtPct(HEADLINE.cmbsOfficeDelinqPct)} delinq ·{" "}
          {fmtPct(HEADLINE.officeCmbsStressSharePct, 0)} of delinquent $).
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Top-1 deposits",
              value: fmtPct(HEADLINE.top1BankSharePct),
              sub: HEADLINE.top1BankLabel,
            },
            {
              label: "Top-3 deposits",
              value: fmtPct(HEADLINE.top3BankSharePct),
              sub: "JPM · BAC · WFC",
            },
            {
              label: "Peak CRE/capital",
              value: fmtPct(HEADLINE.topCreCohortPct, 0),
              sub: HEADLINE.topCreCohortLabel,
            },
            {
              label: "Office CMBS stress $",
              value: fmtPct(HEADLINE.officeCmbsStressSharePct, 0),
              sub: `delinq ${fmtPct(HEADLINE.cmbsOfficeDelinqPct)}`,
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-3"
            >
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-1 text-xl font-bold text-white">{k.value}</p>
              <p className="mt-0.5 text-xs text-slate-400">{k.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="View"
          value={view}
          options={[
            { id: "banks", label: "Bank shares" },
            { id: "cre", label: "CRE cohorts" },
            { id: "loanbook", label: "Loan-book stress" },
            { id: "cmbs", label: "CMBS property" },
          ]}
          onChange={setView}
        />
        {view === "banks" && (
          <>
            <ToggleGroup
              label="Metric"
              value={bankMetric}
              options={[
                { id: "depositSharePct", label: "Deposits" },
                { id: "assetSharePct", label: "Assets" },
              ]}
              onChange={setBankMetric}
            />
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={showRest}
                onChange={(e) => setShowRest(e.target.checked)}
                className="rounded border-slate-300"
              />
              Show long tail
            </label>
          </>
        )}
        {view === "cre" && (
          <ToggleGroup
            label="Sort"
            value={creMetric}
            options={[
              { id: "creCapitalPct", label: "CRE/capital" },
              { id: "crePdnaPct", label: "CRE PDNA %" },
              { id: "creStressSharePct", label: "Stress $ share" },
            ]}
            onChange={setCreMetric}
          />
        )}
        {view === "loanbook" && (
          <ToggleGroup
            label="Share"
            value={loanMetric}
            options={[
              { id: "chargeSharePct", label: "Charge-off $" },
              { id: "delinqSharePct", label: "Delinquency $" },
            ]}
            onChange={setLoanMetric}
          />
        )}
        {view === "cmbs" && (
          <ToggleGroup
            label="Pie"
            value={cmbsLens}
            options={[
              { id: "stressSharePct", label: "Delinquent $ share" },
              { id: "delinqPct", label: "Delinquency rate" },
            ]}
            onChange={setCmbsLens}
          />
        )}
      </div>

      {view === "banks" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Domestic bank market shares"
            subtitle={`Ranked by ${bankMetric === "depositSharePct" ? "deposits" : "assets"} — top-1 / top-3 / top-4 punchline`}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bankBars} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={44}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => fmtPct(Number(v))}
                    labelFormatter={(l) => String(l)}
                  />
                  <Bar dataKey={bankMetric} radius={[0, 4, 4, 0]}>
                    {bankBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Cumulative top-N deposit share"
            subtitle="Lorenz-style ladder: how fast share accumulates at the tip"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={[...BANK_CONCENTRATION_CURVE]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    domain={[0, 100]}
                    unit="%"
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Area
                    type="monotone"
                    dataKey="sharePct"
                    fill={SKY}
                    fillOpacity={0.15}
                    stroke="none"
                  />
                  <Line
                    type="monotone"
                    dataKey="sharePct"
                    stroke={SKY}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: SKY }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "cre" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="CRE concentration by bank-size cohort"
            subtitle="Median CRE / (T1 + ACL) vs PDNA rate — capital intensity ≠ loss rate"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={creComposed}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11 }}
                    unit="%"
                    domain={[0, 360]}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    unit="%"
                    domain={[0, 2.2]}
                  />
                  <Tooltip />
                  <Bar
                    yAxisId="left"
                    dataKey="capital"
                    name="CRE/capital %"
                    fill={AMBER}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="pdna"
                    name="CRE PDNA %"
                    stroke={ROSE}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Stock vs stress dollar shares"
            subtitle={`Sorted by ${creMetric === "creCapitalPct" ? "CRE/capital" : creMetric === "crePdnaPct" ? "PDNA %" : "stress $ share"}`}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={creBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v) => fmtPct(Number(v), 0)} />
                  <Bar
                    dataKey="creStockSharePct"
                    name="CRE stock $"
                    fill={SLATE}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="creStressSharePct"
                    name="CRE PDNA $"
                    fill={ROSE}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "loanbook" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Where loss dollars concentrate"
            subtitle="Estimated share of industry charge-off or delinquency dollars by product"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loanBars} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={72}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v), 0)} />
                  <Bar
                    dataKey={loanMetric}
                    fill={loanMetric === "chargeSharePct" ? ROSE : VIOLET}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Rate dual: delinquency vs charge-off"
            subtitle="CRE still past-due heavy (stock); cards realize losses now"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dualRate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Bar
                    dataKey="delinquency"
                    name="Delinquency %"
                    fill={VIOLET}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="chargeOff"
                    name="Charge-off %"
                    fill={ROSE}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "cmbs" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="CMBS stress by property type"
            subtitle={
              cmbsLens === "stressSharePct"
                ? "Share of delinquent balance (office leads)"
                : "Delinquency rate by property"
            }
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cmbsPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {cmbsPie.map((e) => (
                      <Cell key={e.name} fill={e.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) =>
                      cmbsLens === "stressSharePct"
                        ? fmtPct(Number(v), 0)
                        : fmtPct(Number(v))
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Cross-lens: top-1 vs thick top"
            subtitle="Deposit/asset firm shares vs stress-dollar concentration (ex CRE/capital scale)"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Top-1"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    domain={[0, 60]}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Top-3"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    domain={[0, 100]}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      fmtPct(Number(v), 0),
                      String(name),
                    ]}
                    labelFormatter={() => ""}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload as {
                        short: string;
                        top1Pct: number;
                        top3Pct: number;
                        unit: string;
                      };
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
                          <p className="font-semibold text-slate-900">
                            {d.short}
                          </p>
                          <p className="text-slate-600">
                            Top-1 {fmtPct(d.top1Pct, 0)} · Top-3{" "}
                            {fmtPct(d.top3Pct, 0)}
                          </p>
                          <p className="text-slate-400">{d.unit}</p>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={lensScatter}>
                    {lensScatter.map((p) => (
                      <Cell key={p.id} fill={p.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {VINTAGE_CHECKS.map((v) => (
          <div
            key={v.id}
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {v.label}
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">{v.value}</p>
            <p className="mt-0.5 text-xs text-slate-500">{v.note}</p>
          </div>
        ))}
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        {SOURCE_NOTE}{" "}
        {SOURCES.map((s, i) => (
          <span key={s.url}>
            {i > 0 && " · "}
            <a
              href={s.url}
              className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700"
              target={s.url.startsWith("http") ? "_blank" : undefined}
              rel={s.url.startsWith("http") ? "noreferrer" : undefined}
            >
              {s.label}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}
