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
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ANALYTICS,
  ANNUAL_METERS,
  FUNDING_MIX_ILLUSTRATION,
  HEADLINE,
  INSURED_SHARE_BANDS,
  NAIC_CYBER_MARKET,
  REPORTING_GAP,
  SECTOR_PRESSURE,
  SIZE_SHARE_SCATTER,
  SOPHOS_STACK_PATH,
  SOURCE_NOTE,
} from "@/data/ransomware-payments-vs-uninsured-losses-2026-data";

type Panel =
  | "meters"
  | "insured-share"
  | "funding-mix"
  | "cost-stack"
  | "size-scatter"
  | "sector-pressure";

type MeterMode = "payments" | "gap";
type StackMode = "dollars" | "shares";

const COLORS = {
  insured: "#0d9488",
  cash: "#c2410c",
  chainalysis: "#38bdf8",
  ic3: "#a855f7",
  ransom: "#f97316",
  recovery: "#6366f1",
  naic: "#eab308",
  muted: "#94a3b8",
  grid: "#e2e8f0",
  accent: "#0ea5e9",
};

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  meters: {
    title: "Two meters of ransomware money",
    subtitle:
      "Chainalysis on-chain receipts vs FBI IC3 adjusted losses — the complaint ledger is not the economy",
  },
  "insured-share": {
    title: "Insured share of incident cost by firm size",
    subtitle:
      "NetDiligence Cyber Claims Study 2025 — carrier payout ÷ total incident cost (incl. SIR)",
  },
  "funding-mix": {
    title: "Who funds a ransomware incident dollar?",
    subtitle:
      "All-organization blend: ~32% insurer payout · ~68% cash / SIR / uncovered residual",
  },
  "cost-stack": {
    title: "Paying-victim stack: ransom vs recovery",
    subtitle:
      "Sophos State of Ransomware — median payment vs mean recovery cost excluding ransom",
  },
  "size-scatter": {
    title: "Size vs insured recovery share",
    subtitle:
      "Bubble weight ≈ claim count share — large firms drive dollars but recover less of total cost",
  },
  "sector-pressure": {
    title: "Where BI pushes cash residual higher",
    subtitle:
      "Relative severity index (estimated) — BI-heavy sectors leave more uninsured operating-cash exposure",
  },
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
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function ControlChip({
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

const currencyTip = (v: number) =>
  v >= 1000 ? `$${(v / 1000).toFixed(2)}B` : `$${v.toFixed(v < 20 ? 1 : 0)}M`;

export function RansomwarePaymentsVsUninsuredLosses2026Dashboard({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const [panel, setPanel] = useState<Panel>("insured-share");
  const [meterMode, setMeterMode] = useState<MeterMode>("payments");
  const [stackMode, setStackMode] = useState<StackMode>("dollars");

  const meta = PANEL_META[panel];

  const meterRows = useMemo(
    () =>
      ANNUAL_METERS.map((r) => ({
        year: r.year,
        chainalysis: r.chainalysisPaymentsUsdM,
        ic3: r.ic3LossesUsdM,
      })),
    [],
  );

  const gapRows = useMemo(() => REPORTING_GAP, []);

  const stackRows = useMemo(() => {
    return SOPHOS_STACK_PATH.map((r) =>
      stackMode === "dollars"
        ? {
            year: String(r.year),
            ransom: r.medianRansomUsdM,
            recovery: r.recoveryExRansomUsdM,
          }
        : {
            year: String(r.year),
            ransom: r.ransomSharePct,
            recovery: Number((100 - r.ransomSharePct).toFixed(1)),
          },
    );
  }, [stackMode]);

  const naicRows = useMemo(
    () =>
      NAIC_CYBER_MARKET.map((r) => ({
        year: r.year,
        dwp: r.domesticDwpUsdB,
        lossRatio: r.lossRatioPct,
      })),
    [],
  );

  return (
    <div
      data-viz="ransomware-payments-vs-uninsured-losses-2026"
      className={embedded ? "space-y-4" : "mx-auto max-w-5xl space-y-4"}
    >
      <div className="rounded-xl border border-teal-200 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 px-5 py-5 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
          Finance · Cyber risk markets
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Insured share of ransomware loss
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">
          On insured books, carriers pay about{" "}
          <span className="font-semibold text-teal-300">
            {HEADLINE.insuredShareOfIncidentCostPct}%
          </span>{" "}
          of total ransomware incident cost — leaving roughly{" "}
          <span className="font-semibold text-orange-300">
            {HEADLINE.cashFundedSharePct}%
          </span>{" "}
          on operating cash, SIRs, and uncovered residuals. SME books recover{" "}
          {HEADLINE.smeInsuredSharePct}%; large-company books only{" "}
          {HEADLINE.largeInsuredSharePct}%.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-xs text-slate-400">Insured share (all orgs)</div>
            <div className="text-lg font-bold text-teal-300">
              {ANALYTICS.insuredShareOfIncidentCostPct}%
            </div>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-xs text-slate-400">Cash / SIR residual</div>
            <div className="text-lg font-bold text-orange-300">
              {ANALYTICS.cashFundedSharePct}%
            </div>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-xs text-slate-400">SME vs large gap</div>
            <div className="text-lg font-bold text-sky-300">
              {ANALYTICS.smeVsLargeInsuredGapPp} pp
            </div>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-xs text-slate-400">Chainalysis 2023 peak</div>
            <div className="text-lg font-bold text-sky-200">
              ${ANALYTICS.chainalysisPeakUsdB}B
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["insured-share", "Insured share"],
            ["funding-mix", "Funding mix"],
            ["meters", "Payment meters"],
            ["cost-stack", "Cost stack"],
            ["size-scatter", "Size scatter"],
            ["sector-pressure", "Sector pressure"],
          ] as const
        ).map(([id, label]) => (
          <ControlChip key={id} active={panel === id} onClick={() => setPanel(id)}>
            {label}
          </ControlChip>
        ))}
      </div>

      {panel === "meters" ? (
        <div className="flex flex-wrap gap-2">
          <ControlChip
            active={meterMode === "payments"}
            onClick={() => setMeterMode("payments")}
          >
            Payments path
          </ControlChip>
          <ControlChip active={meterMode === "gap"} onClick={() => setMeterMode("gap")}>
            IC3 gap multiple
          </ControlChip>
        </div>
      ) : null}

      {panel === "cost-stack" ? (
        <div className="flex flex-wrap gap-2">
          <ControlChip
            active={stackMode === "dollars"}
            onClick={() => setStackMode("dollars")}
          >
            Dollars
          </ControlChip>
          <ControlChip
            active={stackMode === "shares"}
            onClick={() => setStackMode("shares")}
          >
            Share %
          </ControlChip>
        </div>
      ) : null}

      <ChartCard title={meta.title} subtitle={meta.subtitle}>
        {panel === "meters" && meterMode === "payments" ? (
          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart data={meterRows} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis
                yAxisId="left"
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(v) => `$${v}`}
                label={{
                  value: "USD millions",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#94a3b8",
                  fontSize: 11,
                }}
              />
              <Tooltip
                formatter={(value, name) => [
                  value == null ? "—" : currencyTip(Number(value)),
                  name === "chainalysis" ? "Chainalysis payments" : "IC3 losses",
                ]}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="chainalysis"
                name="Chainalysis"
                fill={COLORS.chainalysis}
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="ic3"
                name="IC3"
                stroke={COLORS.ic3}
                strokeWidth={3}
                dot={{ r: 4 }}
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : null}

        {panel === "meters" && meterMode === "gap" ? (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={gapRows} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`${value}×`, "Chainalysis ÷ IC3"]}
                labelFormatter={(y) => `Year ${y}`}
              />
              <Bar dataKey="gapMultiple" name="Gap multiple" fill={COLORS.accent} radius={[4, 4, 0, 0]}>
                {gapRows.map((r) => (
                  <Cell
                    key={r.year}
                    fill={r.year === 2023 ? COLORS.ransom : COLORS.accent}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : null}

        {panel === "insured-share" ? (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart
              layout="vertical"
              data={INSURED_SHARE_BANDS}
              margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
            >
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "#64748b", fontSize: 12 }}
                unit="%"
              />
              <YAxis
                type="category"
                dataKey="short"
                width={72}
                tick={{ fill: "#334155", fontSize: 12 }}
              />
              <Tooltip
                formatter={(value, name) => [
                  `${value}%`,
                  name === "insuredPayoutSharePct" ? "Insured payout" : "Cash residual",
                ]}
              />
              <Legend />
              <Bar
                dataKey="insuredPayoutSharePct"
                name="Insured payout"
                stackId="a"
                fill={COLORS.insured}
              />
              <Bar
                dataKey="cashResidualSharePct"
                name="Cash / SIR residual"
                stackId="a"
                fill={COLORS.cash}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : null}

        {panel === "funding-mix" ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={FUNDING_MIX_ILLUSTRATION}
                  dataKey="sharePct"
                  nameKey="short"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={100}
                  paddingAngle={2}
                  label={(props) => {
                    const short = String(
                      (props as { short?: string }).short ??
                        props.name ??
                        "",
                    );
                    const sharePct = Number(
                      (props as { sharePct?: number }).sharePct ??
                        props.value ??
                        0,
                    );
                    return `${short} ${sharePct}%`;
                  }}
                >
                  {FUNDING_MIX_ILLUSTRATION.map((s) => (
                    <Cell
                      key={s.short}
                      fill={s.short === "Insured" ? COLORS.insured : COLORS.cash}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, "Share of incident cost"]} />
              </PieChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={naicRows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(v) => `$${v}B`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 80]}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="dwp"
                  name="Domestic DWP ($B)"
                  fill={COLORS.naic}
                  stroke={COLORS.naic}
                  fillOpacity={0.25}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="lossRatio"
                  name="Loss+DCC %"
                  stroke={COLORS.cash}
                  strokeWidth={2}
                  connectNulls={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "cost-stack" ? (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={stackRows} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(v) =>
                  stackMode === "dollars" ? `$${v}M` : `${v}%`
                }
              />
              <Tooltip
                formatter={(value, name) => [
                  stackMode === "dollars"
                    ? `$${Number(value).toFixed(2)}M`
                    : `${value}%`,
                  name === "ransom" ? "Median ransom" : "Recovery excl. ransom",
                ]}
              />
              <Legend />
              <Bar
                dataKey="ransom"
                name="Ransom"
                stackId="s"
                fill={COLORS.ransom}
              />
              <Bar
                dataKey="recovery"
                name="Recovery"
                stackId="s"
                fill={COLORS.recovery}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : null}

        {panel === "size-scatter" ? (
          <ResponsiveContainer width="100%" height={360}>
            <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="revenueProxyUsdB"
                name="Revenue proxy"
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(v) => `$${v}B`}
                label={{
                  value: "Avg revenue proxy ($B)",
                  position: "insideBottom",
                  offset: -4,
                  fill: "#94a3b8",
                  fontSize: 11,
                }}
              />
              <YAxis
                type="number"
                dataKey="insuredSharePct"
                name="Insured share"
                domain={[0, 80]}
                tick={{ fill: "#64748b", fontSize: 12 }}
                unit="%"
                label={{
                  value: "Insured payout share",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#94a3b8",
                  fontSize: 11,
                }}
              />
              <ZAxis type="number" dataKey="claimWeightPct" range={[80, 400]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name) => {
                  if (name === "Insured share") return [`${value}%`, name];
                  if (name === "Revenue proxy") return [`$${value}B`, name];
                  return [value, name];
                }}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.label ?? "Band"
                }
              />
              <Scatter name="Size bands" data={SIZE_SHARE_SCATTER} fill={COLORS.insured}>
                {SIZE_SHARE_SCATTER.map((p) => (
                  <Cell
                    key={p.label}
                    fill={
                      p.label.startsWith("SME")
                        ? COLORS.insured
                        : p.label.startsWith("Large")
                          ? COLORS.cash
                          : COLORS.accent
                    }
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        ) : null}

        {panel === "sector-pressure" ? (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart
              data={SECTOR_PRESSURE}
              margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="short" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                domain={[0, 1.6]}
                tickFormatter={(v) => `${v.toFixed(1)}×`}
              />
              <Tooltip
                formatter={(value, _n, item) => [
                  `${Number(value).toFixed(2)}× relative severity`,
                  item.payload.biHeavy ? "BI-heavy" : "Lower BI weight",
                ]}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.sector ?? ""}
              />
              <Bar dataKey="relativeSeverity" name="Relative severity" radius={[4, 4, 0, 0]}>
                {SECTOR_PRESSURE.map((s) => (
                  <Cell
                    key={s.sector}
                    fill={s.biHeavy ? COLORS.cash : COLORS.insured}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : null}
      </ChartCard>

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
