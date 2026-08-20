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
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  DUAL_SPEED,
  FLOW_DUMBBELL,
  GROWTH_REGIME,
  HEADLINE,
  MEXICO_H1_SERIES,
  MEXICO_MONTHLY_H1,
  PENSION_PATH,
  REBOUND_DECOMP,
  ROLE_COLORS,
  SCATTER_POINTS,
  SOURCE_NOTE,
  SOURCES,
  VINTAGE_TABLE,
  fmtBn,
  fmtPct,
  type ScatterPoint,
} from "@/data/demographic-cash-flows-update-2026q3-data";

// viz-types: H1 composed bars+YoY, monthly dual area, decomp YoY bars, growth-swing dumbbell, age×remit scatter, pension path | layout: default
// viz-plan: KPI strip; rebound H1; monthly path; ticket vs volume; vintage dumbbell; scatter shift; host pension grind

type Panel = "rebound" | "monthly" | "decomp" | "dumbbell" | "scatter" | "pensions";
type ScatterFilter = "all" | "prior" | "new";
type LedgerFocus = "all" | "hosts" | "origins";

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
                ? "bg-teal-900 text-white"
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

function GenericTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string; color?: string }>;
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  const sorted = sortTooltipPayload(payload);
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      {label != null && (
        <p className="mb-1 font-semibold text-slate-800">{label}</p>
      )}
      {sorted.map((p, i) => (
        <p key={i} className="text-slate-600" style={{ color: p.color }}>
          {p.name}:{" "}
          <span className="font-semibold text-slate-800">
            {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
          </span>
        </p>
      ))}
    </div>
  );
}

const REGIME_COLORS = {
  peak: "#64748b",
  decline: "#0f766e",
  rebound: "#ea580c",
} as const;

export function DemographicCashFlowsUpdate2026q3Dashboard() {
  const [panel, setPanel] = useState<Panel>("rebound");
  const [scatterFilter, setScatterFilter] = useState<ScatterFilter>("all");
  const [ledgerFocus, setLedgerFocus] = useState<LedgerFocus>("all");

  const h1Chart = useMemo(
    () =>
      MEXICO_H1_SERIES.map((r) => ({
        label: r.label,
        bn: r.bn,
        yoyPct: r.yoyPct,
      })),
    [],
  );

  const monthlyChart = useMemo(
    () =>
      MEXICO_MONTHLY_H1.map((r) => ({
        month: r.month,
        "H1 2025": r.bn2025,
        "H1 2026": r.bn2026,
        yoyPct: r.yoyPct,
      })),
    [],
  );

  const decompChart = useMemo(
    () =>
      REBOUND_DECOMP.map((r) => ({
        label: r.shortLabel,
        yoyPct: r.yoyPct,
        prior: r.prior,
        neu: r.neu,
      })),
    [],
  );

  const dumbbellChart = useMemo(
    () =>
      FLOW_DUMBBELL.map((r) => ({
        label: r.label,
        prior: r.priorVal,
        neu: r.newVal,
        delta: r.delta,
        unit: r.unit,
      })),
    [],
  );

  const scatterData = useMemo(() => {
    let pts: ScatterPoint[] = SCATTER_POINTS;
    if (scatterFilter === "prior")
      pts = pts.filter((p) => p.vintage === "prior" || !p.id.startsWith("mexico"));
    if (scatterFilter === "new") pts = pts.filter((p) => p.vintage === "new");
    if (ledgerFocus === "hosts")
      pts = pts.filter((p) => p.role === "aging-host" || p.role === "bridge");
    if (ledgerFocus === "origins")
      pts = pts.filter((p) => p.role === "remittance-origin");
    return pts;
  }, [scatterFilter, ledgerFocus]);

  const dualSpeed = useMemo(() => {
    if (ledgerFocus === "hosts")
      return DUAL_SPEED.filter(
        (r) => r.role === "aging-host" || r.role === "bridge",
      );
    if (ledgerFocus === "origins")
      return DUAL_SPEED.filter((r) => r.role === "remittance-origin");
    return DUAL_SPEED;
  }, [ledgerFocus]);

  const pensionChart = useMemo(
    () =>
      PENSION_PATH.map((p) => ({
        year: p.year,
        oecd32: p.oecd32,
        italy: p.italy,
        japan: p.japan,
        unitedStates: p.unitedStates,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="demographic-cash-flows-update-2026q3"
    >
      <div className="rounded-xl border border-teal-900/20 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-200/90">
          Q3 vintage delta — Aug Banxico 2025 update → Banxico June 2026
        </p>
        <p className="mt-2 text-lg font-bold leading-snug sm:text-xl">
          Mexico remittances rebound {fmtPct(HEADLINE.mexicoH1YoyPct)} in H1
          2026 to {fmtBn(HEADLINE.mexicoH1_2026Bn)} — after{" "}
          {fmtPct(HEADLINE.mexicoFy2025YoyPct)} full-year 2025
        </p>
        <p className="mt-2 max-w-3xl text-sm text-teal-100/85">
          Ticket size {fmtPct(HEADLINE.mexicoAvgTicketYoyPct)} to $
          {HEADLINE.mexicoAvgTicketH1_2026Usd} offsets {HEADLINE.mexicoTxnYoyPct}
          % fewer transactions. Host pensions still grind OECD-32 toward{" "}
          {HEADLINE.oecd32_2050Pct}% of GDP by 2050.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-teal-200/80">
              H1 YoY
            </p>
            <p className="text-lg font-bold">{fmtPct(HEADLINE.mexicoH1YoyPct)}</p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-teal-200/80">
              Growth swing
            </p>
            <p className="text-lg font-bold">
              +{HEADLINE.reboundVsDeclineSwingPp} pp
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-teal-200/80">
              June print
            </p>
            <p className="text-lg font-bold">
              {fmtBn(HEADLINE.mexicoJune2026Bn)}
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-teal-200/80">
              OECD-32 → 2050
            </p>
            <p className="text-lg font-bold">
              {HEADLINE.oecd32_2023_24Pct}%→{HEADLINE.oecd32_2050Pct}%
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={panel}
          onChange={setPanel}
          options={[
            { id: "rebound", label: "H1 rebound" },
            { id: "monthly", label: "Monthly path" },
            { id: "decomp", label: "Ticket vs volume" },
            { id: "dumbbell", label: "Vintage swing" },
            { id: "scatter", label: "Age × remit" },
            { id: "pensions", label: "Host pensions" },
          ]}
        />
        <div className="flex flex-wrap gap-3">
          <ToggleGroup
            label="Scatter vintage"
            value={scatterFilter}
            onChange={setScatterFilter}
            options={[
              { id: "all", label: "All" },
              { id: "prior", label: "FY25 MX" },
              { id: "new", label: "H1’26 MX" },
            ]}
          />
          <ToggleGroup
            label="Ledger"
            value={ledgerFocus}
            onChange={setLedgerFocus}
            options={[
              { id: "all", label: "Both" },
              { id: "hosts", label: "Hosts" },
              { id: "origins", label: "Origins" },
            ]}
          />
        </div>
      </div>

      {panel === "rebound" && (
        <ChartCard
          title="Mexico remittances: H1 rebound after FY 2025 decline"
          subtitle="H1 dollars (bars) with YoY % overlay — 2026 is 2nd-highest H1 on record behind 2024"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={h1Chart}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="bn"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}`}
                  width={44}
                />
                <YAxis
                  yAxisId="yoy"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  width={40}
                  domain={[-8, 8]}
                />
                <Tooltip content={<GenericTooltip />} />
                <ReferenceLine
                  yAxisId="yoy"
                  y={0}
                  stroke="#94a3b8"
                  strokeDasharray="3 3"
                />
                <Bar
                  yAxisId="bn"
                  dataKey="bn"
                  name="$B"
                  fill="#0f766e"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="yoy"
                  type="monotone"
                  dataKey="yoyPct"
                  name="YoY %"
                  stroke="#ea580c"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  connectNulls={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
            {GROWTH_REGIME.map((r) => (
              <span
                key={r.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-1"
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: REGIME_COLORS[r.regime] }}
                />
                {r.label}: {fmtPct(r.growthPct)} · {fmtBn(r.dollarsBn)}
              </span>
            ))}
          </div>
        </ChartCard>
      )}

      {panel === "monthly" && (
        <ChartCard
          title="H1 monthly path: 2025 vs 2026"
          subtitle="June 2026 disclosed at $5.47B (+4.2% YoY); other months constructed to Banxico H1 totals"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyChart}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}`}
                  width={44}
                  domain={[4, 6]}
                />
                <Tooltip content={<GenericTooltip />} />
                <Area
                  type="monotone"
                  dataKey="H1 2025"
                  name="H1 2025 $B"
                  fill="#94a3b833"
                  stroke="#64748b"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="H1 2026"
                  name="H1 2026 $B"
                  fill="#ea580c33"
                  stroke="#ea580c"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "decomp" && (
        <ChartCard
          title="What drove the rebound: larger tickets, fewer wires"
          subtitle="Average remittance +5% to $405; transaction count −1.8% — dollars still +3.1%"
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={decompChart}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  width={40}
                />
                <Tooltip content={<GenericTooltip />} />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Bar dataKey="yoyPct" name="YoY %" radius={[4, 4, 0, 0]}>
                  {decompChart.map((r) => (
                    <Cell
                      key={r.label}
                      fill={r.yoyPct < 0 ? "#0f766e" : "#ea580c"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Electronic transfers remain {HEADLINE.mexicoElectronicSharePct}% of
            inflows. US status-verification rules for money transfers (from{" "}
            {HEADLINE.usComplianceRuleMonth}) are a forward risk to the formal
            pipe — not yet in the H1 print.
          </p>
        </ChartCard>
      )}

      {panel === "dumbbell" && (
        <ChartCard
          title="Aug update → Q3 vintage swing"
          subtitle="Growth flips from −4.6% FY 2025 to +3.1% H1 2026; H1 dollars still below 2024 peak"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dumbbellChart}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={160}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip content={<GenericTooltip />} />
                <Bar
                  dataKey="prior"
                  name="Prior (Aug vintage)"
                  fill="#94a3b8"
                  radius={[0, 2, 2, 0]}
                />
                <Bar
                  dataKey="neu"
                  name="New (Q3 vintage)"
                  fill="#0f766e"
                  radius={[0, 2, 2, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "scatter" && (
        <ChartCard
          title="Age structure × remittance dependence"
          subtitle="Mexico nudges up on remit/GDP as H1 rebounds (3.4% → ~3.5% est.); aging hosts stay on the pension ledge"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="oldAgeDependency"
                  name="Old-age dependency"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Old-age dependency (65+ / 100 aged 15–64)",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 11,
                    fill: "#64748b",
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="remittanceGdpPct"
                  name="Remit/GDP %"
                  tick={{ fontSize: 11 }}
                  width={40}
                  label={{
                    value: "Remittances / GDP %",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                    fill: "#64748b",
                  }}
                />
                <ZAxis range={[80, 200]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const p = payload[0].payload as ScatterPoint;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                        <p className="font-semibold text-slate-800">{p.label}</p>
                        <p className="text-slate-600">
                          Dependency: {p.oldAgeDependency}
                        </p>
                        <p className="text-slate-600">
                          Remit/GDP: {p.remittanceGdpPct}%
                        </p>
                        <p className="text-slate-500">Vintage: {p.vintage}</p>
                      </div>
                    );
                  }}
                />
                <Scatter name="Economies" data={scatterData}>
                  {scatterData.map((p) => (
                    <Cell
                      key={p.id}
                      fill={ROLE_COLORS[p.role]}
                      fillOpacity={p.vintage === "prior" ? 0.45 : 0.9}
                      stroke={p.id.startsWith("mexico") ? "#0f172a" : undefined}
                      strokeWidth={p.id.startsWith("mexico") ? 1.5 : 0}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: ROLE_COLORS["aging-host"] }}
              />
              Aging host
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: ROLE_COLORS["remittance-origin"] }}
              />
              Remittance origin
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: ROLE_COLORS.bridge }}
              />
              Bridge
            </span>
          </div>
        </ChartCard>
      )}

      {panel === "pensions" && (
        <ChartCard
          title="Host ledger unchanged: public pensions still climb toward 10% of GDP"
          subtitle="OECD PaG 2025 path carried forward — no newer vintage between Aug and Q3 updates"
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={pensionChart}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  width={40}
                  domain={[5, 18]}
                />
                <Tooltip content={<GenericTooltip />} />
                <Area
                  type="monotone"
                  dataKey="oecd32"
                  name="OECD-32 %"
                  fill="#0f766e33"
                  stroke="#0f766e"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="italy"
                  name="Italy %"
                  stroke="#ea580c"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="japan"
                  name="Japan %"
                  stroke="#2563eb"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="unitedStates"
                  name="US %"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-3 font-semibold">Economy</th>
                  <th className="py-2 pr-3 font-semibold">Pension % GDP</th>
                  <th className="py-2 pr-3 font-semibold">Remit pulse %</th>
                  <th className="py-2 font-semibold">Old-age dep.</th>
                </tr>
              </thead>
              <tbody>
                {dualSpeed.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100">
                    <td className="py-2 pr-3 font-medium text-slate-800">
                      {r.label}
                    </td>
                    <td className="py-2 pr-3 text-slate-600">
                      {r.pensionGdpPct != null ? `${r.pensionGdpPct}%` : "—"}
                    </td>
                    <td className="py-2 pr-3 text-slate-600">
                      {r.remittancePulsePct != null
                        ? `${r.remittancePulsePct}%`
                        : "—"}
                    </td>
                    <td className="py-2 text-slate-600">
                      {r.oldAgeDependency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}

      <details className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <summary className="cursor-pointer font-semibold text-slate-800">
          Vintage table & sources
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-2 font-semibold">Metric</th>
                <th className="py-2 pr-2 font-semibold">Prior</th>
                <th className="py-2 pr-2 font-semibold">New</th>
                <th className="py-2 font-semibold">Δ</th>
              </tr>
            </thead>
            <tbody>
              {VINTAGE_TABLE.map((r) => (
                <tr key={r.id} className="border-b border-slate-100">
                  <td className="py-2 pr-2 font-medium text-slate-800">
                    {r.metric}
                  </td>
                  <td className="py-2 pr-2">{r.prior}</td>
                  <td className="py-2 pr-2">{r.neu}</td>
                  <td className="py-2 text-teal-800">{r.delta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          {SOURCE_NOTE}
        </p>
        <ul className="mt-2 list-inside list-disc text-xs text-teal-800">
          {SOURCES.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  s.href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="underline-offset-2 hover:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
