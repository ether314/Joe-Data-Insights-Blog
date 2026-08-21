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
  LineChart,
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
  COMMITMENT_UNIVERSE,
  ETF_CONCENTRATION_CURVE,
  ETF_FLOW_SHARES,
  HEADLINE,
  ISSUER_CONCENTRATION_CURVE,
  ISSUER_SHARE_PATH,
  ISSUER_SHARES,
  LENS_COMPARE,
  SENIORITY_BUCKETS,
  SOURCE_NOTE,
  STRESS_INCIDENCE,
  THEME_CREDIT_SHARES,
  fmtBn,
  fmtPct,
} from "@/data/ai-financing-concentration-202608-data";

// viz-types: Lorenz area+line, ranked bars, donut, supply path, commitment pie, seniority bars, stress scatter, lens scatter | layout: default

type ViewId = "channels" | "issuers" | "commitment" | "etf";
type LadderMetric = "sharePct" | "cumulative" | "amountBn";
type CurveLens = "channels" | "issuers" | "etf";

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

export function AiFinancingConcentration202608Dashboard() {
  const [view, setView] = useState<ViewId>("channels");
  const [ladderMetric, setLadderMetric] = useState<LadderMetric>("sharePct");
  const [showEqualLine, setShowEqualLine] = useState(true);
  const [curveLens, setCurveLens] = useState<CurveLens>("channels");
  const [channelMetric, setChannelMetric] = useState<"sharePct" | "amountBn">(
    "sharePct",
  );
  const [etfMetric, setEtfMetric] = useState<"sharePct" | "flowsBn">("sharePct");
  const [stressBand, setStressBand] = useState<"low" | "high">("high");

  const curve = useMemo(() => {
    if (curveLens === "issuers") return ISSUER_CONCENTRATION_CURVE;
    if (curveLens === "etf") return ETF_CONCENTRATION_CURVE;
    return CHANNEL_CONCENTRATION_CURVE;
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

  const commitmentPie = useMemo(
    () =>
      COMMITMENT_UNIVERSE.map((s) => ({
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
        xLabel: r.year === 2026.5 ? "2026 Q3" : String(Math.floor(r.year)),
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

  const stressScatter = useMemo(
    () =>
      STRESS_INCIDENCE.map((s) => ({
        ...s,
        x: s.fundedSharePct,
        y: stressBand === "high" ? s.lossShareHighPct : s.lossShareLowPct,
        z: Math.max(12, s.stressWeight * 40),
      })),
    [stressBand],
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
      data-viz="ai-financing-concentration-202608"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
          AI financing — Aug 202608 concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Top-1 channel holds {HEADLINE.top1ChannelSharePct}% · Top-3 holds{" "}
          {HEADLINE.top3ChannelSharePct}%
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Booth/Hepp funded stock (~{fmtBn(HEADLINE.fundedStockBn)}):{" "}
          <span className="text-violet-200">{HEADLINE.top1ChannelLabel}</span>{" "}
          alone is about{" "}
          <span className="text-sky-300">
            {fmtPct(HEADLINE.top1ChannelSharePct)}
          </span>{" "}
          ({fmtBn(HEADLINE.hsSeniorStockBn)}). Top-3 channels clear{" "}
          <span className="text-amber-200">
            {fmtPct(HEADLINE.top3ChannelSharePct)}
          </span>
          . Uncommenced leases add ~{fmtBn(HEADLINE.uncommencedLeasesBn)}{" "}
          off-balance — {fmtPct(HEADLINE.leaseShareOfTotalCommitmentPct)} of
          total commitment. Issuer ladder still prints Amazon at{" "}
          {fmtPct(HEADLINE.top1IssuerSharePct)} / top-3{" "}
          {fmtPct(HEADLINE.top3IssuerSharePct)} inside ~{fmtBn(HEADLINE.issuerUniverseBn)}.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Top-1 channel",
              value: fmtPct(HEADLINE.top1ChannelSharePct),
              sub: HEADLINE.top1ChannelLabel,
            },
            {
              label: "Top-3 channels",
              value: fmtPct(HEADLINE.top3ChannelSharePct),
              sub: HEADLINE.top3ChannelLabel,
            },
            {
              label: "Lease overhang",
              value: fmtBn(HEADLINE.uncommencedLeasesBn),
              sub: `${fmtPct(HEADLINE.leaseShareOfTotalCommitmentPct)} of commitment`,
            },
            {
              label: "Top-1 issuer",
              value: fmtPct(HEADLINE.top1IssuerSharePct),
              sub: HEADLINE.top1IssuerLabel,
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
            { id: "channels", label: "Credit channels" },
            { id: "issuers", label: "Issuer ladder" },
            { id: "commitment", label: "Commitment + stress" },
            { id: "etf", label: "ETF + lenses" },
          ]}
        />
      </div>

      {view === "channels" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Cumulative share vs equal split"
            subtitle="How fast the top of the channel / issuer / ETF distribution accumulates"
          >
            <div className="mb-3 flex flex-wrap gap-3">
              <ToggleGroup
                label="Lens"
                value={curveLens}
                onChange={setCurveLens}
                options={[
                  { id: "channels", label: "Channels" },
                  { id: "issuers", label: "HS issuers" },
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
                      curveLens === "channels"
                        ? VIOLET
                        : curveLens === "issuers"
                          ? AMBER
                          : SKY
                    }
                    fillOpacity={0.25}
                    stroke={
                      curveLens === "channels"
                        ? VIOLET
                        : curveLens === "issuers"
                          ? AMBER
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
              {curveLens === "channels"
                ? `Top-1 ${fmtPct(HEADLINE.top1ChannelSharePct)} · Top-3 ${fmtPct(HEADLINE.top3ChannelSharePct)} of funded credit stock.`
                : curveLens === "issuers"
                  ? `Top-1 ${fmtPct(HEADLINE.top1IssuerSharePct)} · Top-3 ${fmtPct(HEADLINE.top3IssuerSharePct)} of hyperscaler IG YTD.`
                  : `Top-1 ${fmtPct(HEADLINE.top1EtfSharePct)} · Top-3 ~75% of thematic ETF inflows.`}
            </p>
          </ChartCard>

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
                      channelMetric === "amountBn" ? [0, "auto"] : [0, 55]
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
              Approximate channel HHI ~{HEADLINE.channelHhi.toLocaleString()} on
              five buckets. {HEADLINE.top1ChannelLabel} leads at{" "}
              {fmtPct(HEADLINE.top1ChannelSharePct)} (
              {fmtBn(HEADLINE.hsSeniorStockBn)}).
            </p>
          </ChartCard>

          <ChartCard
            title="Seniority mix inside funded stock"
            subtitle="Senior vs hybrid vs junior — where first-loss risk sits"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...SENIORITY_BUCKETS]}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 60]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${fmtPct(Number(v))} · ${fmtBn(item.payload.amountBn)}`,
                      item.payload.label,
                    ]}
                  />
                  <Bar dataKey="sharePct" radius={[4, 4, 0, 0]}>
                    {SENIORITY_BUCKETS.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Senior sleeves hold {fmtPct(SENIORITY_BUCKETS[0].sharePct)} of
              funded stock; junior (private + GPU) is only{" "}
              {fmtPct(SENIORITY_BUCKETS[2].sharePct)} but absorbs more of the
              stress tip.
            </p>
          </ChartCard>

          <ChartCard
            title="AI debt theme stack"
            subtitle={`~${fmtBn(HEADLINE.aiDebtUniverseBn)} flow perimeter — hyperscalers vs ecosystem`}
          >
            <div className="h-72 w-full min-w-0">
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
              Five-name bloc is {fmtPct(HEADLINE.hsShareOfAiDebtPct)} of the
              flow perimeter — concentrated internally, minority of the broader
              tape.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "issuers" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Hyperscaler IG issuer ladder"
            subtitle={`Five-name universe ≈ ${fmtBn(HEADLINE.issuerUniverseBn)} YTD (carried)`}
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
                      ladderMetric === "amountBn" ? [0, "auto"] : [0, 100]
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
              Approximate HHI ~{HEADLINE.issuerHhi.toLocaleString()}.{" "}
              {issuerBars[0]?.issuer} leads at{" "}
              {fmtPct(issuerBars[0]?.sharePct ?? 0)} (
              {fmtBn(issuerBars[0]?.amountBn ?? 0)}).
            </p>
          </ChartCard>

          <ChartCard
            title="Aug → Q3 → FY top-share path"
            subtitle="Top-1 / top-3 issuer shares as the YTD spine grows toward ~$250B FY"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[...ISSUER_SHARE_PATH]}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[30, 80]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      `${Number(v).toFixed(0)}%`,
                      name === "top1Pct" ? "Top-1 share" : "Top-3 share",
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.vintage ?? ""
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="top1Pct"
                    stroke={AMBER}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    name="top1Pct"
                  />
                  <Line
                    type="monotone"
                    dataKey="top3Pct"
                    stroke={VIOLET}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    name="top3Pct"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Stock-map vintage keeps the Aug flow ladder as the issuer
              baseline; Q3 peer prints ease top-1 toward{" "}
              {fmtPct(ISSUER_SHARE_PATH[1].top1Pct)}.
            </p>
          </ChartCard>

          <ChartCard
            title="Theme weight of USD credit supply"
            subtitle="AI-related share of US IG gross issuance"
          >
            <div className="h-64 w-full min-w-0">
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
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 h-36 w-full min-w-0">
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
          </ChartCard>
        </div>
      )}

      {view === "commitment" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Funded stock vs lease overhang"
            subtitle={`Total commitment ≈ ${fmtBn(HEADLINE.fundedPlusOverhangBn)}`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={commitmentPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {commitmentPie.map((s) => (
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
              Leases are excluded from funded Top-1/Top-3 shares but are{" "}
              {fmtPct(HEADLINE.leaseShareOfTotalCommitmentPct)} of total
              commitment — a second concentration meter.
            </p>
          </ChartCard>

          <ChartCard
            title="Stress incidence vs funded share"
            subtitle="Illustrative first-loss weights — junior sleeves punch above stock share"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Stress band"
                value={stressBand}
                onChange={setStressBand}
                options={[
                  { id: "low", label: `Low (~${fmtBn(HEADLINE.stressLossLowBn)})` },
                  {
                    id: "high",
                    label: `High (~${fmtBn(HEADLINE.stressLossHighBn)})`,
                  },
                ]}
              />
            </div>
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Funded share"
                    domain={[0, 60]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "Funded share %",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Loss share"
                    domain={[0, 70]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "Loss share %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      `${Number(v).toFixed(0)}%`,
                      name === "x" ? "Funded share" : "Loss share",
                    ]}
                    labelFormatter={(_, p) => p?.[0]?.payload?.sleeve ?? ""}
                  />
                  <Scatter data={stressScatter}>
                    {stressScatter.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Booth stress band ~{fmtBn(HEADLINE.stressLossLowBn)}–
              {fmtBn(HEADLINE.stressLossHighBn)}. Points above the diagonal
              take more loss than their funded weight — junior sleeves in this
              editorial mix.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "etf" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Thematic ETF inflow concentration"
            subtitle={`FactSet 2025 sleeve ≈ ${fmtBn(HEADLINE.thematicEtfFlowsBn)}`}
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
                      outerRadius={72}
                      paddingAngle={2}
                    >
                      {etfPie.map((s) => (
                        <Cell key={s.name} fill={s.fill} />
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
              {HEADLINE.top1EtfLabel} alone is {fmtPct(HEADLINE.top1EtfSharePct)}{" "}
              of thematic inflows — equity-side concentration that rhymes with
              credit-side issuer tips.
            </p>
          </ChartCard>

          <ChartCard
            title="Cross-lens Top-1 vs Top-3"
            subtitle="Same concentration question, six denominators"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Top-1"
                    domain={[0, 55]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "Top-1 %",
                      position: "insideBottom",
                      offset: -2,
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
                      value: "Top-3 %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 360]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      `${Number(v).toFixed(0)}%`,
                      name === "x" ? "Top-1" : "Top-3",
                    ]}
                    labelFormatter={(_, p) => p?.[0]?.payload?.lens ?? ""}
                  />
                  <Scatter data={lensScatter}>
                    {lensScatter.map((r) => (
                      <Cell
                        key={r.short}
                        fill={
                          r.short === "Channels"
                            ? VIOLET
                            : r.short === "HS issuers"
                              ? AMBER
                              : r.short === "ETF flows"
                                ? SKY
                                : r.short === "Commitment"
                                  ? ROSE
                                  : EMERALD
                        }
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Channel stock sits upper-right (Top-1 {fmtPct(HEADLINE.top1ChannelSharePct)}{" "}
              / Top-3 {fmtPct(HEADLINE.top3ChannelSharePct)}). Lease
              &quot;Top-1&quot; is a different meter — overhang share of total
              commitment.
            </p>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
