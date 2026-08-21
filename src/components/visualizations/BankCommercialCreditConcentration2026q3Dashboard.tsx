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
  BANK_CONCENTRATION_CURVE,
  BANK_SHARES,
  CMBS_PROPERTIES,
  CRE_COHORTS,
  DEPOSIT_LORENZ,
  HEADLINE,
  HHI_LENSES,
  LENS_COMPARE,
  LOAN_STRESS_SHARES,
  SLOOS_ROWS,
  SOURCE_NOTE,
  SOURCES,
  VINTAGE_CHECKS,
  VINTAGE_RESTATE,
  fmtNet,
  fmtNum,
  fmtPct,
} from "@/data/bank-commercial-credit-concentration-2026q3-data";

// viz-types: vintage restatement bars, deposit Lorenz area+line, bank share bars, CRE composed, HHI bars, SLOOS net bars, CMBS MoM dual, stress scatter, CMBS pie | layout: default

type ViewId = "scoreboard" | "banks" | "cre" | "stress" | "supply";
type BankMetric = "depositSharePct" | "assetSharePct";
type CreMetric = "creCapitalPct" | "crePdnaPct" | "creStressSharePct";
type StressMetric = "chargeSharePct" | "delinqSharePct";
type CmbsLens = "stressSharePct" | "delinqPct" | "deltaPp";

const SKY = "#0ea5e9";
const ROSE = "#f43f5e";
const VIOLET = "#8b5cf6";
const AMBER = "#f59e0b";
const SLATE = "#64748b";
const TEAL = "#14b8a6";

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

export function BankCommercialCreditConcentration2026q3Dashboard() {
  const [view, setView] = useState<ViewId>("scoreboard");
  const [bankMetric, setBankMetric] = useState<BankMetric>("depositSharePct");
  const [creMetric, setCreMetric] = useState<CreMetric>("creCapitalPct");
  const [stressMetric, setStressMetric] =
    useState<StressMetric>("chargeSharePct");
  const [showRest, setShowRest] = useState(true);
  const [cmbsLens, setCmbsLens] = useState<CmbsLens>("stressSharePct");
  const [sloosMode, setSloosMode] = useState<"netPct" | "deltaVsPrior">(
    "netPct",
  );

  const bankBars = useMemo(() => {
    const rows = BANK_SHARES.filter((b) => showRest || b.id !== "rest");
    return [...rows].sort((a, b) => b[bankMetric] - a[bankMetric]);
  }, [bankMetric, showRest]);

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

  const creBars = useMemo(() => {
    return [...CRE_COHORTS].sort((a, b) => b[creMetric] - a[creMetric]);
  }, [creMetric]);

  const loanBars = useMemo(() => {
    return [...LOAN_STRESS_SHARES].sort(
      (a, b) => b[stressMetric] - a[stressMetric],
    );
  }, [stressMetric]);

  const cmbsPie = useMemo(
    () =>
      CMBS_PROPERTIES.map((p) => ({
        name: p.short,
        value: p[cmbsLens],
        fill: p.fill,
      })),
    [cmbsLens],
  );

  const cmbsMom = useMemo(
    () =>
      CMBS_PROPERTIES.map((p) => ({
        short: p.short,
        prior: p.priorDelinqPct,
        q3: p.delinqPct,
        delta: p.deltaPp,
        fill: p.fill,
      })),
    [],
  );

  const lensScatter = useMemo(
    () =>
      LENS_COMPARE.filter((l) => l.id !== "cre-capital").map((l) => ({
        ...l,
        x: l.top1Pct,
        y: l.top3Pct,
        z: Math.max(10, l.hhi / 40),
      })),
    [],
  );

  const vintageBars = useMemo(
    () =>
      VINTAGE_RESTATE.filter((r) => r.unit === "pct" || r.unit === "netPct").map(
        (r) => ({
          short: r.label.replace(" share", "").replace(" deposit", " dep."),
          prior: r.prior,
          q3: r.q3,
          delta: r.q3 - r.prior,
          unit: r.unit,
        }),
      ),
    [],
  );

  const sloosBars = useMemo(() => {
    return [...SLOOS_ROWS].sort(
      (a, b) => Math.abs(b[sloosMode]) - Math.abs(a[sloosMode]),
    );
  }, [sloosMode]);

  const hhiBars = useMemo(
    () => [...HHI_LENSES].sort((a, b) => b.hhi - a.hhi),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="bank-commercial-credit-concentration-2026q3"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Bank & commercial credit — Q3 concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Top-1 bank ~{HEADLINE.top1BankSharePct}% of deposits · Top-3 ~{" "}
          {HEADLINE.top3BankSharePct}%
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Firm-side tip is{" "}
          <span className="text-sky-300">carried and sticky</span> (
          {HEADLINE.top1BankLabel} ~{fmtPct(HEADLINE.top1BankSharePct)}; top-4 ~
          {fmtPct(HEADLINE.top4BankSharePct)}). Q3 adds the{" "}
          <span className="text-amber-300">process overlay</span>: Trepp July
          CMBS overall {fmtPct(HEADLINE.cmbsOverallDelinqPct)} (+
          {HEADLINE.cmbsOverallMomBp} bp MoM), multifamily +
          {HEADLINE.cmbsMfDeltaPp} pp fastest, and July SLOOS CRE NFNR at{" "}
          {fmtNet(HEADLINE.sloosCreNfnrNet)} net easing while cards still{" "}
          {fmtNet(HEADLINE.sloosCardsTightenNet)} net tight. Stress dollars
          remain tip-heavy — cards ~{fmtPct(48, 0)} of charge-offs, office ~
          {fmtPct(HEADLINE.officeCmbsStressSharePct, 0)} of CMBS delinquent $,
          mega banks ~{fmtPct(HEADLINE.largeBankCreStressSharePct, 0)} of CRE
          PDNA $.
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
              label: "CMBS overall",
              value: fmtPct(HEADLINE.cmbsOverallDelinqPct),
              sub: `+${HEADLINE.cmbsOverallMomBp} bp MoM`,
            },
            {
              label: "SLOOS CRE NFNR",
              value: fmtNet(HEADLINE.sloosCreNfnrNet),
              sub: "July net (easing)",
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
            { id: "scoreboard", label: "Scoreboard" },
            { id: "banks", label: "Bank shares" },
            { id: "cre", label: "CRE cohorts" },
            { id: "stress", label: "Stress + HHI" },
            { id: "supply", label: "Supply + CMBS" },
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
        {view === "stress" && (
          <ToggleGroup
            label="Share"
            value={stressMetric}
            options={[
              { id: "chargeSharePct", label: "Charge-off $" },
              { id: "delinqSharePct", label: "Delinquency $" },
            ]}
            onChange={setStressMetric}
          />
        )}
        {view === "supply" && (
          <>
            <ToggleGroup
              label="SLOOS"
              value={sloosMode}
              options={[
                { id: "netPct", label: "July net %" },
                { id: "deltaVsPrior", label: "Δ vs prior est." },
              ]}
              onChange={setSloosMode}
            />
            <ToggleGroup
              label="CMBS pie"
              value={cmbsLens}
              options={[
                { id: "stressSharePct", label: "Delinq $ share" },
                { id: "delinqPct", label: "Delinq rate" },
                { id: "deltaPp", label: "MoM Δ pp" },
              ]}
              onChange={setCmbsLens}
            />
          </>
        )}
      </div>

      {view === "scoreboard" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Q3 vs prior concentration restatement"
            subtitle="Firm tip flat; CMBS rates and SLOOS supply flip — share architecture vs process overlay"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vintageBars} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={120}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="prior"
                    name="Prior"
                    fill={SLATE}
                    radius={[0, 2, 2, 0]}
                  />
                  <Bar
                    dataKey="q3"
                    name="Q3"
                    fill={SKY}
                    radius={[0, 2, 2, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Cross-lens: top-1 vs thick top"
            subtitle="Bubble size ∝ HHI — stress lenses sit farther out than deposit firm shares"
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
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload as {
                        short: string;
                        top1Pct: number;
                        top3Pct: number;
                        hhi: number;
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
                          <p className="text-slate-400">
                            HHI {fmtNum(d.hhi)} · {d.unit}
                          </p>
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

      {view === "banks" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Domestic bank market shares"
            subtitle={`Ranked by ${bankMetric === "depositSharePct" ? "deposits" : "assets"} — top-1 / top-3 punchline`}
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
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
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
            title="Deposit Lorenz vs equal share"
            subtitle="Cumulative deposit share against a 45° equal-bank diagonal (bucketed tip)"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={[...DEPOSIT_LORENZ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="popSharePct"
                    tick={{ fontSize: 11 }}
                    unit="%"
                    label={{
                      value: "Cum. bank count share",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 10,
                    }}
                  />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Area
                    type="monotone"
                    dataKey="depositSharePct"
                    fill={SKY}
                    fillOpacity={0.12}
                    stroke="none"
                  />
                  <Line
                    type="monotone"
                    dataKey="equalPct"
                    name="Equal share"
                    stroke={SLATE}
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="depositSharePct"
                    name="Deposits"
                    stroke={SKY}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: SKY }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Cumulative top-N deposit share"
            subtitle="How fast share accumulates: top-3 ~33%, top-10 ~54%"
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={[...BANK_CONCENTRATION_CURVE]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Area
                    type="monotone"
                    dataKey="sharePct"
                    fill={VIOLET}
                    fillOpacity={0.15}
                    stroke="none"
                  />
                  <Line
                    type="monotone"
                    dataKey="sharePct"
                    stroke={VIOLET}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: VIOLET }}
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

      {view === "stress" && (
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
                    dataKey={stressMetric}
                    fill={stressMetric === "chargeSharePct" ? ROSE : VIOLET}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="HHI by concentration lens"
            subtitle="Analytical HHI on stated share buckets (0–10,000) — stress >> firm deposits"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hhiBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 4000]} />
                  <Tooltip
                    formatter={(v) => fmtNum(Number(v))}
                    labelFormatter={(l) => String(l)}
                  />
                  <Bar dataKey="hhi" radius={[4, 4, 0, 0]}>
                    {hhiBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "supply" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="July SLOOS supply asymmetry"
            subtitle={
              sloosMode === "netPct"
                ? "Net % tightening (− = easing). CRE eases; cards still tighten."
                : "Δ vs prior estimated tighten — CRE NFNR flip is the Q3 hinge"
            }
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sloosBars} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={64}
                    tick={{ fontSize: 11 }}
                  />
                  <ReferenceLine x={0} stroke={SLATE} />
                  <Tooltip
                    formatter={(v) => fmtNet(Number(v))}
                  />
                  <Bar dataKey={sloosMode} radius={[0, 4, 4, 0]}>
                    {sloosBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="CMBS delinquency: prior vs July"
            subtitle="Multifamily +1.05 pp fastest MoM; office still highest rate"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cmbsMom}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Bar
                    dataKey="prior"
                    name="Prior"
                    fill={SLATE}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="q3"
                    name="July"
                    fill={TEAL}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="CMBS stress pie"
            subtitle={
              cmbsLens === "stressSharePct"
                ? "Share of delinquent balance (office ~42%)"
                : cmbsLens === "delinqPct"
                  ? "Delinquency rate by property"
                  : "MoM Δ percentage points"
            }
          >
            <div className="h-72">
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
                      cmbsLens === "deltaPp"
                        ? fmtNet(Number(v), 2)
                        : cmbsLens === "stressSharePct"
                          ? fmtPct(Number(v), 0)
                          : fmtPct(Number(v))
                    }
                  />
                </PieChart>
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
