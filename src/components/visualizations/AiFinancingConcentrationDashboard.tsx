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
  AI_DEBT_STACK,
  AI_IG_SUPPLY_PATH,
  CHANNEL_CONCENTRATION_CURVE,
  CHANNEL_STOCK_SHARES,
  ETF_CONCENTRATION_CURVE,
  ETF_FLOW_SHARES,
  HEADLINE,
  ISSUER_CONCENTRATION_CURVE,
  ISSUER_SHARES,
  LENS_COMPARE,
  SOURCE_NOTE,
  THEME_CREDIT_SHARES,
  fmtBn,
  fmtPct,
} from "@/data/ai-financing-concentration-2026-data";

// viz-types: Lorenz area+line, ranked bars, stack donut, supply path, channel bars, ETF pie, lens scatter | layout: default

type ViewId = "issuers" | "theme" | "channels" | "etf";
type LadderMetric = "sharePct" | "cumulative" | "amountBn";
type CurveLens = "issuers" | "channels" | "etf";

const SKY = "#0ea5e9";
const ROSE = "#f43f5e";
const VIOLET = "#8b5cf6";
const SLATE = "#64748b";
const EMERALD = "#10b981";
const AMBER = "#f59e0b";

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

export function AiFinancingConcentrationDashboard() {
  const [view, setView] = useState<ViewId>("issuers");
  const [ladderMetric, setLadderMetric] = useState<LadderMetric>("sharePct");
  const [showEqualLine, setShowEqualLine] = useState(true);
  const [curveLens, setCurveLens] = useState<CurveLens>("issuers");
  const [channelMetric, setChannelMetric] = useState<"sharePct" | "amountBn">(
    "sharePct",
  );
  const [etfMetric, setEtfMetric] = useState<"sharePct" | "flowsBn">("sharePct");

  const curve = useMemo(() => {
    if (curveLens === "channels") return CHANNEL_CONCENTRATION_CURVE;
    if (curveLens === "etf") return ETF_CONCENTRATION_CURVE;
    return ISSUER_CONCENTRATION_CURVE;
  }, [curveLens]);

  const issuerBars = useMemo(() => {
    const rows = [...ISSUER_SHARES];
    if (ladderMetric === "amountBn") {
      return rows.sort((a, b) => b.amountBn - a.amountBn);
    }
    if (ladderMetric === "cumulative") {
      return rows.sort((a, b) => b.cumulativeSharePct - a.cumulativeSharePct);
    }
    return rows.sort((a, b) => b.sharePct - a.sharePct);
  }, [ladderMetric]);

  const channelBars = useMemo(() => {
    const rows = [...CHANNEL_STOCK_SHARES];
    if (channelMetric === "amountBn") {
      return rows.sort((a, b) => b.amountBn - a.amountBn);
    }
    return rows.sort((a, b) => b.sharePct - a.sharePct);
  }, [channelMetric]);

  const etfBars = useMemo(() => {
    const rows = [...ETF_FLOW_SHARES];
    if (etfMetric === "flowsBn") {
      return rows.sort((a, b) => b.flowsBn - a.flowsBn);
    }
    return rows.sort((a, b) => b.sharePct - a.sharePct);
  }, [etfMetric]);

  const stackPie = useMemo(
    () =>
      AI_DEBT_STACK.map((s) => ({
        name: s.short,
        value: s.sharePct,
        fill: s.fill,
        amountBn: s.amountBn,
        label: s.label,
      })),
    [],
  );

  const etfPie = useMemo(
    () =>
      ETF_FLOW_SHARES.map((e) => ({
        name: e.ticker,
        value: e.sharePct,
        fill: e.fill,
        flowsBn: e.flowsBn,
        label: e.name,
      })),
    [],
  );

  const supplyPath = useMemo(
    () =>
      AI_IG_SUPPLY_PATH.map((r) => ({
        ...r,
        xLabel:
          r.year === 2026.5 ? "2026 Q3" : String(Math.floor(r.year)),
      })),
    [],
  );

  const lensScatter = useMemo(
    () =>
      LENS_COMPARE.map((l) => ({
        ...l,
        x: l.top1Pct,
        y: l.top3Pct,
        z: Math.max(10, l.top3Pct / 3),
      })),
    [],
  );

  const creditDumbbell = useMemo(
    () =>
      THEME_CREDIT_SHARES.map((r) => ({
        ...r,
        range: [r.priorPct, r.sharePct],
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="ai-financing-concentration-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
          AI financing — concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Top-1 issuer holds {HEADLINE.top1IssuerSharePct}% of hyperscaler IG ·
          Top-3 holds {HEADLINE.top3IssuerSharePct}%
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Inside the five-name YTD spine (~{fmtBn(HEADLINE.issuerUniverseBn)}),{" "}
          <span className="text-amber-200">{HEADLINE.top1IssuerLabel}</span> alone
          is about{" "}
          <span className="text-sky-300">
            {fmtPct(HEADLINE.top1IssuerSharePct)}
          </span>
          . The same three names clear{" "}
          <span className="text-violet-300">
            {fmtPct(HEADLINE.top3IssuerSharePct)}
          </span>
          . Zoom out: hyperscalers are still only{" "}
          <span className="text-emerald-300">
            {fmtPct(HEADLINE.hsShareOfAiDebtPct)}
          </span>{" "}
          of the ~{fmtBn(HEADLINE.aiDebtUniverseBn)} AI debt perimeter — while{" "}
          {HEADLINE.top1EtfLabel} takes{" "}
          <span className="text-cyan-300">
            ~{fmtPct(HEADLINE.top1EtfSharePct)}
          </span>{" "}
          of thematic ETF inflows.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Top-1 issuer",
              value: fmtPct(HEADLINE.top1IssuerSharePct),
              sub: HEADLINE.top1IssuerLabel,
            },
            {
              label: "Top-3 issuers",
              value: fmtPct(HEADLINE.top3IssuerSharePct),
              sub: HEADLINE.top3IssuerLabel,
            },
            {
              label: "HS of AI debt",
              value: fmtPct(HEADLINE.hsShareOfAiDebtPct),
              sub: `${fmtBn(HEADLINE.hsDebtBn)} of ${fmtBn(HEADLINE.aiDebtUniverseBn)}`,
            },
            {
              label: "QQQ of thematic",
              value: fmtPct(HEADLINE.top1EtfSharePct),
              sub: `${fmtBn(HEADLINE.qqqFlowsBn)} of ${fmtBn(HEADLINE.thematicEtfFlowsBn)}`,
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-3"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums">{k.value}</p>
              <p className="text-xs text-slate-400">{k.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "issuers", label: "Issuer ladder" },
            { id: "theme", label: "Theme stack" },
            { id: "channels", label: "Credit channels" },
            { id: "etf", label: "ETF + lenses" },
          ]}
        />
      </div>

      {view === "issuers" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Cumulative share vs equal split"
            subtitle="How fast the top of the issuer / channel / ETF distribution accumulates"
          >
            <div className="mb-3 flex flex-wrap gap-3">
              <ToggleGroup
                label="Lens"
                value={curveLens}
                onChange={setCurveLens}
                options={[
                  { id: "issuers", label: "HS issuers" },
                  { id: "channels", label: "Channels" },
                  { id: "etf", label: "ETF flows" },
                ]}
              />
              <ToggleGroup
                label="Equal line"
                value={showEqualLine ? "on" : "off"}
                onChange={(v) => setShowEqualLine(v === "on")}
                options={[
                  { id: "on", label: "Show" },
                  { id: "off", label: "Hide" },
                ]}
              />
            </div>
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={curve}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
                      name === "sharePct" ? "Actual cumulative" : "Equal split",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="sharePct"
                    fill={
                      curveLens === "issuers"
                        ? AMBER
                        : curveLens === "channels"
                          ? VIOLET
                          : SKY
                    }
                    fillOpacity={0.25}
                    stroke={
                      curveLens === "issuers"
                        ? AMBER
                        : curveLens === "channels"
                          ? VIOLET
                          : SKY
                    }
                    strokeWidth={2.5}
                    name="sharePct"
                  />
                  {showEqualLine && (
                    <Line
                      type="monotone"
                      dataKey="equalPct"
                      stroke={SLATE}
                      strokeDasharray="6 4"
                      strokeWidth={1.5}
                      dot={false}
                      name="equalPct"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {curveLens === "issuers"
                ? `Top-1 ${fmtPct(HEADLINE.top1IssuerSharePct)} · Top-3 ${fmtPct(HEADLINE.top3IssuerSharePct)} of hyperscaler IG YTD.`
                : curveLens === "channels"
                  ? `Top-1 ${fmtPct(HEADLINE.top1ChannelSharePct)} · Top-3 ${fmtPct(HEADLINE.top3ChannelSharePct)} of funded credit stock.`
                  : `Top-1 ${fmtPct(HEADLINE.top1EtfSharePct)} · Top-3 ~75% of thematic ETF inflows.`}
            </p>
          </ChartCard>

          <ChartCard
            title="Hyperscaler IG issuer ladder"
            subtitle={`Five-name universe ≈ ${fmtBn(HEADLINE.issuerUniverseBn)} YTD`}
          >
            <div className="mb-3">
              <ToggleGroup
                label="Metric"
                value={ladderMetric}
                onChange={setLadderMetric}
                options={[
                  { id: "sharePct", label: "Share %" },
                  { id: "amountBn", label: "$ billions" },
                  { id: "cumulative", label: "Cumulative" },
                ]}
              />
            </div>
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={issuerBars}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={
                      ladderMetric === "amountBn"
                        ? [0, "auto"]
                        : [0, 100]
                    }
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) =>
                      ladderMetric === "amountBn" ? `$${v}B` : `${v}%`
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={56}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [
                      ladderMetric === "amountBn"
                        ? fmtBn(Number(v))
                        : fmtPct(Number(v)),
                      ladderMetric === "amountBn"
                        ? "Issuance"
                        : ladderMetric === "cumulative"
                          ? "Cumulative"
                          : "Share",
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.issuer ?? ""
                    }
                  />
                  <Bar
                    dataKey={
                      ladderMetric === "amountBn"
                        ? "amountBn"
                        : ladderMetric === "cumulative"
                          ? "cumulativeSharePct"
                          : "sharePct"
                    }
                    radius={[0, 4, 4, 0]}
                  >
                    {issuerBars.map((r) => (
                      <Cell key={r.issuer} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Approximate HHI ~{HEADLINE.issuerHhi.toLocaleString()} on five
              buckets (0–10,000). {issuerBars[0]?.issuer} leads at{" "}
              {fmtPct(issuerBars[0]?.sharePct ?? 0)} (
              {fmtBn(issuerBars[0]?.amountBn ?? 0)}).
            </p>
          </ChartCard>
        </div>
      )}

      {view === "theme" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="AI debt theme stack"
            subtitle={`~${fmtBn(HEADLINE.aiDebtUniverseBn)} mid-year perimeter — hyperscalers vs ecosystem`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stackPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {stackPie.map((s) => (
                      <Cell key={s.name} fill={s.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${fmtPct(Number(v))} · ${fmtBn(item.payload.amountBn)}`,
                      item.payload.label,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              The five-name bloc is concentrated <em>internally</em> (top-1{" "}
              {fmtPct(HEADLINE.top1IssuerSharePct)}) but is still a minority of
              the broader AI debt tape ({fmtPct(HEADLINE.hsShareOfAiDebtPct)}).
            </p>
          </ChartCard>

          <ChartCard
            title="Theme weight of USD credit supply"
            subtitle="AI-related share of US IG gross issuance — rising calendar concentration"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={supplyPath}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="xLabel" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 28]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v)), "AI share of US IG"]}
                    labelFormatter={(_, p) => p?.[0]?.payload?.label ?? ""}
                  />
                  <Area
                    type="monotone"
                    dataKey="aiShareOfUsIgPct"
                    fill={EMERALD}
                    fillOpacity={0.2}
                    stroke={EMERALD}
                    strokeWidth={2.5}
                  />
                  <Line
                    type="monotone"
                    dataKey="aiShareOfUsIgPct"
                    stroke={EMERALD}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 h-40 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={creditDumbbell}
                  margin={{ top: 4, right: 12, left: 0, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 30]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      fmtPct(Number(v)),
                      name === "priorPct" ? "Aug prior" : "Q3 print",
                    ]}
                  />
                  <Bar dataKey="priorPct" fill="#94a3b8" name="priorPct" />
                  <Bar dataKey="sharePct" name="sharePct">
                    {creditDumbbell.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              IG theme share {fmtPct(HEADLINE.aiIgShare2024Pct)} →{" "}
              {fmtPct(HEADLINE.aiIgSupplySharePct)} (+
              {HEADLINE.aiIgSupplySharePct - HEADLINE.aiIgShare2024Pct} pp since
              2024). HY at {fmtPct(HEADLINE.aiHySupplySharePct)}.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "channels" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Funded credit-channel ladder"
            subtitle={`Booth/Hepp stock map ≈ ${fmtBn(HEADLINE.fundedStockBn)} funded`}
          >
            <div className="mb-3">
              <ToggleGroup
                label="Metric"
                value={channelMetric}
                onChange={setChannelMetric}
                options={[
                  { id: "sharePct", label: "Share %" },
                  { id: "amountBn", label: "$ billions" },
                ]}
              />
            </div>
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={channelBars}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={
                      channelMetric === "amountBn" ? [0, "auto"] : [0, 100]
                    }
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) =>
                      channelMetric === "amountBn" ? `$${v}B` : `${v}%`
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={64}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [
                      channelMetric === "amountBn"
                        ? fmtBn(Number(v))
                        : fmtPct(Number(v)),
                      channelMetric === "amountBn" ? "Stock" : "Share",
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.label ?? ""
                    }
                  />
                  <Bar
                    dataKey={
                      channelMetric === "amountBn" ? "amountBn" : "sharePct"
                    }
                    radius={[0, 4, 4, 0]}
                  >
                    {channelBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {HEADLINE.top1ChannelLabel} alone is{" "}
              {fmtPct(HEADLINE.top1ChannelSharePct)} (
              {fmtBn(HEADLINE.hsSeniorStockBn)}). Top-3 channels clear{" "}
              {fmtPct(HEADLINE.top3ChannelSharePct)}.
            </p>
          </ChartCard>

          <ChartCard
            title="Channel concentration curve"
            subtitle="Cumulative share of funded AI-infra credit stock"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Equal line"
                value={showEqualLine ? "on" : "off"}
                onChange={(v) => setShowEqualLine(v === "on")}
                options={[
                  { id: "on", label: "Show" },
                  { id: "off", label: "Hide" },
                ]}
              />
            </div>
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={CHANNEL_CONCENTRATION_CURVE}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
                      name === "sharePct" ? "Actual cumulative" : "Equal split",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="sharePct"
                    fill={VIOLET}
                    fillOpacity={0.25}
                    stroke={VIOLET}
                    strokeWidth={2.5}
                    name="sharePct"
                  />
                  {showEqualLine && (
                    <Line
                      type="monotone"
                      dataKey="equalPct"
                      stroke={SLATE}
                      strokeDasharray="6 4"
                      strokeWidth={1.5}
                      dot={false}
                      name="equalPct"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Excludes S&amp;P uncommenced lease overhang (~$675B) — a parallel
              concentration story outside funded stock.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "etf" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Thematic ETF inflow concentration"
            subtitle={`2025 US thematic sleeve ≈ ${fmtBn(HEADLINE.thematicEtfFlowsBn)}`}
          >
            <div className="mb-3">
              <ToggleGroup
                label="Metric"
                value={etfMetric}
                onChange={setEtfMetric}
                options={[
                  { id: "sharePct", label: "Share %" },
                  { id: "flowsBn", label: "$ billions" },
                ]}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={etfPie}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={75}
                      paddingAngle={2}
                    >
                      {etfPie.map((e) => (
                        <Cell key={e.name} fill={e.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v, _n, item) => [
                        `${fmtPct(Number(v))} · ${fmtBn(item.payload.flowsBn)}`,
                        item.payload.label,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={etfBars}
                    layout="vertical"
                    margin={{ top: 4, right: 8, left: 4, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      domain={
                        etfMetric === "flowsBn" ? [0, "auto"] : [0, 100]
                      }
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) =>
                        etfMetric === "flowsBn" ? `$${v}B` : `${v}%`
                      }
                    />
                    <YAxis
                      type="category"
                      dataKey="ticker"
                      width={72}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip
                      formatter={(v) => [
                        etfMetric === "flowsBn"
                          ? fmtBn(Number(v))
                          : fmtPct(Number(v)),
                        etfMetric === "flowsBn" ? "Flows" : "Share",
                      ]}
                    />
                    <Bar
                      dataKey={
                        etfMetric === "flowsBn" ? "flowsBn" : "sharePct"
                      }
                      radius={[0, 4, 4, 0]}
                    >
                      {etfBars.map((r) => (
                        <Cell key={r.ticker} fill={r.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Equity-side concentration: {HEADLINE.top1EtfLabel} alone absorbs
              half of thematic creations — a sentiment-capacity meter, not
              issuer proceeds.
            </p>
          </ChartCard>

          <ChartCard
            title="Cross-lens concentration map"
            subtitle="Top-1 vs top-3 share across issuer, stack, channel, ETF, and calendar lenses"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 12, right: 16, left: 8, bottom: 12 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Top-1"
                    domain={[0, 60]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "Top-1 share",
                      position: "insideBottom",
                      offset: -4,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Top-3"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "Top-3 share",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      fmtPct(Number(v)),
                      name === "x" ? "Top-1" : name === "y" ? "Top-3" : name,
                    ]}
                    labelFormatter={(_, p) => p?.[0]?.payload?.short ?? ""}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
                          <p className="font-semibold text-slate-900">
                            {d.lens}
                          </p>
                          <p className="text-slate-600">
                            Top-1 {fmtPct(d.top1Pct)} ({d.top1Label})
                          </p>
                          <p className="text-slate-600">
                            Top-3 {fmtPct(d.top3Pct)}
                          </p>
                          <p className="mt-1 text-slate-400">{d.note}</p>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={lensScatter} fill={ROSE}>
                    {lensScatter.map((l) => (
                      <Cell
                        key={l.short}
                        fill={
                          l.short === "HS issuers"
                            ? AMBER
                            : l.short === "Channels"
                              ? VIOLET
                              : l.short === "ETF flows"
                                ? SKY
                                : l.short === "AI debt"
                                  ? EMERALD
                                  : ROSE
                        }
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Issuer and channel lenses sit high on both axes; the AI-debt bloc
              and IG-calendar lenses are high on top-1 but lack a meaningful
              top-3 ladder (single bloc / theme prints).
            </p>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
