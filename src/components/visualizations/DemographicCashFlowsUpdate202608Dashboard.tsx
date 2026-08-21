"use client";

import { useMemo, useState } from "react";
import {
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
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  DUAL_SPEED,
  FLOW_DUMBBELL,
  GROWTH_REGIME,
  HEADLINE,
  MEXICO_T12M_SERIES,
  NOMINAL_VS_REAL,
  PAYOUT_MIX,
  PENSION_PATH,
  ROLE_COLORS,
  SCATTER_POINTS,
  SOURCE_NOTE,
  SOURCES,
  STATE_LEADERS,
  VINTAGE_TABLE,
  fmtBn,
  fmtPct,
  type ScatterPoint,
} from "@/data/demographic-cash-flows-update-202608-data";

// viz-types: T12M composed bars+YoY, nominal-vs-real bars, state horizontal bars, payout donut, vintage dumbbell, age×remit scatter, pension path | layout: default
// viz-plan: KPI strip; T12M soft; real vs nominal; states; payout mix; Q3→Aug dumbbell; scatter; host pensions

type Panel =
  | "t12m"
  | "real"
  | "states"
  | "payout"
  | "dumbbell"
  | "scatter"
  | "pensions";
type ScatterFilter = "all" | "prior" | "new";
type LedgerFocus = "all" | "hosts" | "origins";
type RealFilter = "all" | "nominal" | "real" | "sa";

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
  soft: "#ca8a04",
} as const;

const PAYOUT_COLORS = {
  deposit: "#0f766e",
  cash: "#ea580c",
} as const;

const KIND_COLORS = {
  nominal: "#0f766e",
  real: "#c2410c",
  sa: "#2563eb",
} as const;

export function DemographicCashFlowsUpdate202608Dashboard() {
  const [panel, setPanel] = useState<Panel>("t12m");
  const [scatterFilter, setScatterFilter] = useState<ScatterFilter>("all");
  const [ledgerFocus, setLedgerFocus] = useState<LedgerFocus>("all");
  const [realFilter, setRealFilter] = useState<RealFilter>("all");

  const t12mChart = useMemo(
    () =>
      MEXICO_T12M_SERIES.map((r) => ({
        label: r.label,
        bn: r.bn,
        yoyPct: r.yoyPct,
      })),
    [],
  );

  const regimeChart = useMemo(
    () =>
      GROWTH_REGIME.map((r) => ({
        label: r.label,
        growthPct: r.growthPct,
        dollarsBn: r.dollarsBn,
        fill: REGIME_COLORS[r.regime],
      })),
    [],
  );

  const realChart = useMemo(() => {
    let rows = NOMINAL_VS_REAL;
    if (realFilter !== "all") rows = rows.filter((r) => r.kind === realFilter);
    return rows.map((r) => ({
      label: r.shortLabel,
      pct: r.pct,
      fill: KIND_COLORS[r.kind],
    }));
  }, [realFilter]);

  const stateChart = useMemo(
    () =>
      [...STATE_LEADERS]
        .sort((a, b) => b.bn - a.bn)
        .map((r) => ({
          label: r.label,
          bn: r.bn,
          yoyPct: r.yoyPct,
        })),
    [],
  );

  const payoutChart = useMemo(
    () =>
      PAYOUT_MIX.map((r) => ({
        name: r.label,
        value: r.bn,
        share: r.sharePct,
        fill: PAYOUT_COLORS[r.id as keyof typeof PAYOUT_COLORS],
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
      data-viz="demographic-cash-flows-update-202608"
    >
      <div className="rounded-xl border border-teal-900/20 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-200/90">
          Aug 202608 vintage delta — Q3 H1 rebound → T12M soft + real −8.3%
        </p>
        <p className="mt-2 text-lg font-bold leading-snug sm:text-xl">
          Trailing-twelve remittances still {fmtPct(HEADLINE.mexicoT12mYoyPct)}{" "}
          at {fmtBn(HEADLINE.mexicoT12mBn)} — even after H1{" "}
          {fmtPct(HEADLINE.mexicoH1YoyPct)}
        </p>
        <p className="mt-2 max-w-3xl text-sm text-teal-100/85">
          June nominal {fmtPct(HEADLINE.mexicoJuneYoyPct)} masks real household
          purchasing power {fmtPct(HEADLINE.mexicoRealJuneYoyPct)} (BBVA). SA
          MoM faded {HEADLINE.mexicoJuneSaMomPct}%. Host pensions still grind
          OECD-32 toward {HEADLINE.oecd32_2050Pct}% of GDP by 2050.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-teal-200/80">
              T12M YoY
            </p>
            <p className="text-lg font-bold">
              {fmtPct(HEADLINE.mexicoT12mYoyPct)}
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-teal-200/80">
              Real June
            </p>
            <p className="text-lg font-bold">
              {fmtPct(HEADLINE.mexicoRealJuneYoyPct)}
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-teal-200/80">
              YoY streak
            </p>
            <p className="text-lg font-bold">
              {HEADLINE.consecutiveYoYGrowthMonths} mo
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
            { id: "t12m", label: "T12M soft" },
            { id: "real", label: "Nominal vs real" },
            { id: "states", label: "State leaders" },
            { id: "payout", label: "Cash vs deposit" },
            { id: "dumbbell", label: "Q3 → Aug swing" },
            { id: "scatter", label: "Age × remit" },
            { id: "pensions", label: "Host pensions" },
          ]}
        />
        <div className="flex flex-wrap gap-3">
          <ToggleGroup
            label="Real lens"
            value={realFilter}
            onChange={setRealFilter}
            options={[
              { id: "all", label: "All" },
              { id: "nominal", label: "Nominal" },
              { id: "real", label: "Real" },
              { id: "sa", label: "SA" },
            ]}
          />
          <ToggleGroup
            label="Scatter vintage"
            value={scatterFilter}
            onChange={setScatterFilter}
            options={[
              { id: "all", label: "All" },
              { id: "prior", label: "H1 lens" },
              { id: "new", label: "T12M soft" },
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

      {panel === "t12m" && (
        <ChartCard
          title="Mexico remittances: T12M still soft after H1 rebound"
          subtitle="Trailing-twelve dollars (bars) with YoY % where disclosed — Jun’26 T12M −0.1% despite H1 +3.1%"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={t12mChart} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="bn"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                />
                <YAxis
                  yAxisId="yoy"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<GenericTooltip />} />
                <ReferenceLine yAxisId="yoy" y={0} stroke="#94a3b8" />
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
          <div className="mt-4 h-[220px] w-full min-w-0">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Growth regime: peak → decline → H1 rebound → T12M soft
            </p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regimeChart} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<GenericTooltip />} />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Bar dataKey="growthPct" name="Growth %" radius={[4, 4, 0, 0]}>
                  {regimeChart.map((r) => (
                    <Cell key={r.label} fill={r.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "real" && (
        <ChartCard
          title="Nominal rebound vs real purchasing-power erosion"
          subtitle="Banxico June +4.2% YoY vs BBVA real −8.3%; SA MoM −2.4% — filter by lens"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={realChart} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<GenericTooltip />} />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Bar dataKey="pct" name="%" radius={[4, 4, 0, 0]}>
                  {realChart.map((r) => (
                    <Cell key={r.label} fill={r.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Nominal H1 {fmtPct(HEADLINE.mexicoH1YoyPct)} and June{" "}
            {fmtPct(HEADLINE.mexicoJuneYoyPct)} coexist with real June{" "}
            {fmtPct(HEADLINE.mexicoRealJuneYoyPct)} — a{" "}
            {HEADLINE.nominalVsRealSwingPp} pp swing between desks that quote
            dollars and households that spend pesos.
          </p>
        </ChartCard>
      )}

      {panel === "states" && (
        <ChartCard
          title="State remittance leaders — Guanajuato leads; CDMX growth outlier"
          subtitle="H1 2026 dollar inflows (horizontal). Guanajuato and CDMX growth are Banxico/BBVA disclosed; peers constructed."
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={stateChart}
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={110}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip content={<GenericTooltip />} />
                <Bar
                  dataKey="bn"
                  name="$B"
                  fill="#0f766e"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Guanajuato {fmtBn(HEADLINE.guanajuatoH1Bn)} leads reception.
            Mexico City printed the sharpest disclosed growth (
            {fmtPct(HEADLINE.cdmxH1GrowthPct)}) — migration geography still
            concentrates the private pipe even when the national T12M is soft.
          </p>
        </ChartCard>
      )}

      {panel === "payout" && (
        <ChartCard
          title="How remittances are claimed — deposit share edges cash"
          subtitle={`H1 2026 Banxico: deposits ${HEADLINE.mexicoDepositShareH1Pct}% (${fmtBn(HEADLINE.mexicoDepositH1Bn)}) vs cash ${HEADLINE.mexicoCashShareH1Pct}% (${fmtBn(HEADLINE.mexicoCashH1Bn)})`}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={payoutChart}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {payoutChart.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<GenericTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center gap-3">
              {payoutChart.map((d) => (
                <div
                  key={d.name}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: d.fill }}
                    />
                    <span className="text-sm font-medium text-slate-800">
                      {d.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {d.share}% · {fmtBn(d.value)}
                  </span>
                </div>
              ))}
              <p className="text-sm text-slate-600">
                Electronic transfers remain ~99% of the pipe; the cash/deposit
                split is about last-mile claim method — relevant if US
                compliance friction (Sep 2026) raises formal KYC costs.
              </p>
            </div>
          </div>
        </ChartCard>
      )}

      {panel === "dumbbell" && (
        <ChartCard
          title="Q3 → Aug 202608 vintage swing"
          subtitle="H1 rebound lens vs T12M soft / real erosion — prior (teal) → new (orange)"
        >
          <div className="space-y-5 py-2">
            {dumbbellChart.map((r) => {
              const lo = Math.min(r.prior, r.neu);
              const hi = Math.max(r.prior, r.neu);
              const span = hi - lo || 1;
              const priorPct = ((r.prior - lo) / span) * 100;
              const newPct = ((r.neu - lo) / span) * 100;
              const left = Math.min(priorPct, newPct);
              const width = Math.abs(newPct - priorPct);
              const fmt =
                r.unit === "bn"
                  ? (n: number) => fmtBn(n, 2)
                  : r.unit === "pp"
                    ? (n: number) => `${n.toFixed(1)} pp`
                    : (n: number) => fmtPct(n);
              return (
                <div key={r.label}>
                  <div className="mb-1 flex justify-between text-xs text-slate-600">
                    <span className="font-medium text-slate-800">{r.label}</span>
                    <span>
                      {fmt(r.prior)} → {fmt(r.neu)}
                    </span>
                  </div>
                  <div className="relative h-3 rounded-full bg-slate-100">
                    <div
                      className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-slate-300"
                      style={{ left: `${left}%`, width: `${width}%` }}
                    />
                    <div
                      className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-teal-800 bg-teal-600"
                      style={{ left: `${priorPct}%` }}
                      title={`Prior: ${fmt(r.prior)}`}
                    />
                    <div
                      className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-orange-700 bg-orange-500"
                      style={{ left: `${newPct}%` }}
                      title={`New: ${fmt(r.neu)}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-3">Metric</th>
                  <th className="py-2 pr-3">Q3 frame</th>
                  <th className="py-2 pr-3">Aug print</th>
                  <th className="py-2">Δ</th>
                </tr>
              </thead>
              <tbody>
                {VINTAGE_TABLE.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100">
                    <td className="py-2 pr-3 font-medium text-slate-800">
                      {row.metric}
                    </td>
                    <td className="py-2 pr-3 text-slate-600">{row.prior}</td>
                    <td className="py-2 pr-3 text-slate-800">{row.neu}</td>
                    <td className="py-2 text-teal-800">{row.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}

      {panel === "scatter" && (
        <ChartCard
          title="Age structure × remittance dependence"
          subtitle="Old-age dependency vs remittance/GDP — Mexico nudges slightly left under T12M soft lens"
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="oldAgeDependency"
                  name="Old-age dep."
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Old-age dependency",
                    position: "insideBottom",
                    offset: -4,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="remittanceGdpPct"
                  name="Remit/GDP %"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Remit / GDP %",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <ZAxis range={[60, 60]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as ScatterPoint;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                        <p className="font-semibold text-slate-800">{d.label}</p>
                        <p className="text-slate-600">
                          Dependency: {d.oldAgeDependency}
                        </p>
                        <p className="text-slate-600">
                          Remit/GDP: {d.remittanceGdpPct}%
                        </p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatterData} name="Economies">
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
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {dualSpeed.map((r) => (
              <div
                key={r.id}
                className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs"
              >
                <p className="font-semibold text-slate-800">{r.label}</p>
                <p className="text-slate-600">
                  Dep {r.oldAgeDependency}
                  {r.pensionGdpPct != null
                    ? ` · pension ${r.pensionGdpPct}% GDP`
                    : ""}
                  {r.remittancePulsePct != null
                    ? ` · remit ~${r.remittancePulsePct}%`
                    : ""}
                </p>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {panel === "pensions" && (
        <ChartCard
          title="Host ledger unchanged: public pensions still climb toward 10% of GDP"
          subtitle="OECD-32 path from Pensions at a Glance 2025 — no newer vintage between Q3 and Aug 202608"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={pensionChart}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[6, 18]}
                />
                <Tooltip content={<GenericTooltip />} />
                <Line
                  type="monotone"
                  dataKey="oecd32"
                  name="OECD-32"
                  stroke="#0f766e"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="italy"
                  name="Italy"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="japan"
                  name="Japan"
                  stroke="#2563eb"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="unitedStates"
                  name="US"
                  stroke="#ea580c"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-700">Sources</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                className="text-teal-800 underline-offset-2 hover:underline"
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noreferrer" : undefined}
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
