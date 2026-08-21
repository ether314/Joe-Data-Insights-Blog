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
  Legend,
  Line,
  LineChart,
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
  COMPANY_COLORS,
  HEADLINE,
  HYPERSCALERS,
  REVISION_PATH,
  SOURCE_NOTE,
  SOURCES,
  companyDeltas,
  deltaRank,
  fmtBn,
  fmtDelta,
  fmtPct,
  scenarioFan,
  slopeRows,
  waterfallSteps,
  yoyStacked,
  type Hyperscaler,
} from "@/data/ai-capex-spend-update-202608-data";

// viz-types: waterfall, slope, stacked area YoY, revision multi-line, delta rank bars, prior-vs-new scatter, scenario fan | layout: default
// viz-plan: Q3→Aug20 waterfall; slope; quad-2026 YoY stack; Jul→Aug20 revision path; Δ rank bars; scatter; house fan

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

type ViewMode = "dollars" | "ai";
type FanYear = "2026" | "2027";
type FocusSeries = "all" | "Big5" | "Street" | "Credit" | "GS IR";

export function AiCapexSpendUpdate202608Dashboard() {
  const [activeCompanies, setActiveCompanies] = useState<Hyperscaler[]>([...HYPERSCALERS]);
  const [view, setView] = useState<ViewMode>("dollars");
  const [fanYear, setFanYear] = useState<FanYear>("2026");
  const [focus, setFocus] = useState<FocusSeries>("all");

  const toggleCompany = (c: Hyperscaler) => {
    setActiveCompanies((prev) => {
      if (prev.includes(c)) {
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== c);
      }
      return [...prev, c];
    });
  };

  const factor = view === "ai" ? HEADLINE.aiShareOfGross : 1;

  const deltas = useMemo(() => companyDeltas(activeCompanies), [activeCompanies]);
  const slope = useMemo(() => slopeRows(activeCompanies), [activeCompanies]);
  const stack = useMemo(() => yoyStacked(view === "ai" ? "ai" : "gross"), [view]);
  const fan = useMemo(() => scenarioFan(fanYear), [fanYear]);
  const waterfall = useMemo(() => waterfallSteps(activeCompanies), [activeCompanies]);
  const ranks = useMemo(() => deltaRank(activeCompanies), [activeCompanies]);

  const waterfallBars = useMemo(
    () =>
      waterfall.steps.map((s) => ({
        name: s.name,
        base: Math.round(s.start * factor * 10) / 10,
        rise: Math.round((s.end - s.start) * factor * 10) / 10,
        delta: Math.round(s.delta * factor * 10) / 10,
        fill: s.fill,
        kind: s.kind,
      })),
    [waterfall, factor],
  );

  const slopeScaled = useMemo(
    () =>
      slope.map((d) => ({
        ...d,
        prior: Math.round(d.prior * factor * 10) / 10,
        neu: Math.round(d.neu * factor * 10) / 10,
        deltaBn: Math.round(d.deltaBn * factor * 10) / 10,
      })),
    [slope, factor],
  );

  const rankScaled = useMemo(
    () =>
      ranks.map((d) => ({
        ...d,
        deltaBn: Math.round(d.deltaBn * factor * 10) / 10,
      })),
    [ranks, factor],
  );

  const scatterScaled = useMemo(
    () =>
      slopeScaled.map((d) => ({
        company: d.company,
        prior: d.prior,
        neu: d.neu,
        fill: d.fill,
        deltaBn: d.deltaBn,
      })),
    [slopeScaled],
  );

  const fanBars = useMemo(
    () =>
      fan
        .filter((r) => r.neu != null || r.prior != null)
        .map((r) => ({
          house: r.house.replace("Goldman Sachs", "GS").replace("Investment Research", "IR"),
          prior: r.prior ?? 0,
          neu: r.neu ?? r.prior ?? 0,
          color: r.color,
          scope: r.scope,
        })),
    [fan],
  );

  const revisionScaled = useMemo(
    () =>
      REVISION_PATH.map((r) => ({
        vintage: r.vintage,
        Big5: Math.round(r.big5 * factor),
        Street: Math.round(r.street * factor),
        Credit: Math.round(r.credit * factor),
        "GS IR": Math.round(r.gsIr * factor),
        label: r.label,
      })),
    [factor],
  );

  const seriesOpacity = (key: FocusSeries) =>
    focus === "all" || focus === key ? 1 : 0.18;

  return (
    <div className="space-y-6" data-viz="ai-capex-spend-update-202608">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          202608 vintage delta — mid-Q3 → late-Aug Axis
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Big-5 midpoints {fmtBn(HEADLINE.priorBig5)} → {fmtBn(HEADLINE.newBig5)} (
          {fmtDelta(HEADLINE.deltaBn)} / {fmtPct(HEADLINE.deltaPct)})
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Versus July&apos;s {fmtBn(HEADLINE.julBig5)} research print, the cumulative raise is now{" "}
          {fmtDelta(HEADLINE.julToAug20DeltaBn)} ({fmtPct(HEADLINE.julToAug20DeltaPct)}). Amazon leads
          again at {fmtBn(240)}; Microsoft&apos;s accounting print stays {fmtBn(175)} while the
          economic stack sits nearer {fmtBn(HEADLINE.economicNewBig5)}. Toggle AI-attributed (~75%)
          to haircut the gross stack.
        </p>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Companies
            </span>
            {HYPERSCALERS.map((c) => {
              const on = activeCompanies.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCompany(c)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    on ? "text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                  style={on ? { backgroundColor: COMPANY_COLORS[c] } : undefined}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">View</span>
            {(
              [
                ["dollars", "Gross $B"],
                ["ai", "AI-attributed (~75%)"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  view === id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
            <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Scenario year
            </span>
            {(["2026", "2027"] as const).map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setFanYear(y)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  fanYear === y
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {y}
              </button>
            ))}
            <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Focus
            </span>
            {(["all", "Big5", "Street", "Credit", "GS IR"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFocus(f)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  focus === f
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f === "all" ? "All series" : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Q3 → Aug-20 vintage waterfall ($B)"
          subtitle={
            view === "ai"
              ? "Company contributions to the AI-attributed revision"
              : "Company contributions to the Big-5 midpoint revision"
          }
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={waterfallBars} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={56}
                />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v) => `$${v}B`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as {
                      name: string;
                      delta: number;
                      kind: string;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.name}</p>
                        <p className="text-slate-600">
                          {row.kind === "delta" ? fmtDelta(row.delta) : fmtBn(row.delta)}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="base" stackId="w" fill="transparent" legendType="none" />
                <Bar dataKey="rise" stackId="w" radius={[4, 4, 0, 0]} maxBarSize={36}>
                  {waterfallBars.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Δ contribution rank (Q3 → Aug-20)"
          subtitle="Horizontal ranking of absolute vintage deltas by company"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart
                data={rankScaled}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${v > 0 ? "+" : ""}$${v}B`}
                />
                <YAxis
                  type="category"
                  dataKey="company"
                  width={78}
                  tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as {
                      company: string;
                      deltaBn: number;
                      note: string;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.company}</p>
                        <p className="text-slate-600">{fmtDelta(row.deltaBn)}</p>
                        <p className="mt-1 text-xs text-slate-500">{row.note}</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="deltaBn" radius={[0, 4, 4, 0]} maxBarSize={28}>
                  {rankScaled.map((d) => (
                    <Cell key={d.company} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Prior → new slope (Q3 → Aug-20)"
          subtitle="Left = mid-Q3 midpoint; right = late-Aug 202608 midpoint"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <ComposedChart
                data={slopeScaled}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, "auto"]}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                />
                <YAxis
                  type="category"
                  dataKey="company"
                  width={78}
                  tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as {
                      company: string;
                      prior: number;
                      neu: number;
                      deltaBn: number;
                      priorLabel: string;
                      newLabel: string;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.company}</p>
                        <p className="text-slate-600">
                          {fmtBn(row.prior)} → {fmtBn(row.neu)} ({fmtDelta(row.deltaBn)})
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {row.priorLabel} · {row.newLabel}
                        </p>
                      </div>
                    );
                  }}
                />
                {slopeScaled.map((d) => (
                  <ReferenceLine
                    key={`seg-${d.company}`}
                    segment={[
                      { x: d.prior, y: d.company },
                      { x: d.neu, y: d.company },
                    ]}
                    stroke={d.fill}
                    strokeWidth={3}
                  />
                ))}
                <Line
                  dataKey="prior"
                  stroke="transparent"
                  dot={{ r: 6, strokeWidth: 2, fill: "#fff" }}
                  activeDot={false}
                  isAnimationActive={false}
                />
                <Line
                  dataKey="neu"
                  stroke="transparent"
                  dot={{ r: 7 }}
                  activeDot={false}
                  isAnimationActive={false}
                >
                  {slopeScaled.map((d) => (
                    <Cell key={d.company} fill={d.fill} stroke={d.fill} />
                  ))}
                </Line>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Hollow-ish left markers = Q3 vintage; filled right markers = Aug-20. Flat Microsoft /
            Oracle lines = hold, not a demand pause.
          </p>
        </ChartCard>

        <ChartCard
          title="Prior vs new scatter (identity line)"
          subtitle="Points above the diagonal raised since mid-Q3; on-diagonal = flat"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="prior"
                  name="Q3"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                  domain={["auto", "auto"]}
                />
                <YAxis
                  type="number"
                  dataKey="neu"
                  name="Aug-20"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                  domain={["auto", "auto"]}
                />
                <ZAxis range={[80, 80]} />
                <ReferenceLine
                  segment={[
                    { x: 160, y: 160 },
                    { x: 250, y: 250 },
                  ]}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as {
                      company: string;
                      prior: number;
                      neu: number;
                      deltaBn: number;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.company}</p>
                        <p className="text-slate-600">
                          Q3 {fmtBn(row.prior)} → Aug-20 {fmtBn(row.neu)} ({fmtDelta(row.deltaBn)})
                        </p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatterScaled} shape="circle">
                  {scatterScaled.map((d) => (
                    <Cell key={d.company} fill={d.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Hyperscaler stack — four 2026 vintages"
        subtitle="2024–25 actuals, Jul / Aug / Q3 / Aug-20 2026 guides, then 2027E consensus path"
      >
        <div className="h-96 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart data={stack} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v) => `$${v}B`} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const sorted = sortTooltipPayload(payload);
                  const total = sorted.reduce((s, p) => s + (Number(p.value) || 0), 0);
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                      <p className="font-semibold text-slate-900">{label}</p>
                      {sorted.map((p) => (
                        <p key={String(p.dataKey)} className="text-slate-600">
                          <span style={{ color: String(p.color) }}>●</span> {p.name}:{" "}
                          {fmtBn(Number(p.value))}
                        </p>
                      ))}
                      <p className="mt-1 border-t border-slate-100 pt-1 font-semibold text-slate-800">
                        Total {fmtBn(total)}
                      </p>
                    </div>
                  );
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="Amazon"
                stackId="1"
                stroke={COMPANY_COLORS.Amazon}
                fill={COMPANY_COLORS.Amazon}
                fillOpacity={0.85}
              />
              <Area
                type="monotone"
                dataKey="Microsoft"
                stackId="1"
                stroke={COMPANY_COLORS.Microsoft}
                fill={COMPANY_COLORS.Microsoft}
                fillOpacity={0.85}
              />
              <Area
                type="monotone"
                dataKey="Alphabet"
                stackId="1"
                stroke={COMPANY_COLORS.Alphabet}
                fill={COMPANY_COLORS.Alphabet}
                fillOpacity={0.85}
              />
              <Area
                type="monotone"
                dataKey="Meta"
                stackId="1"
                stroke={COMPANY_COLORS.Meta}
                fill={COMPANY_COLORS.Meta}
                fillOpacity={0.85}
              />
              <Area
                type="monotone"
                dataKey="Oracle"
                stackId="1"
                stroke={COMPANY_COLORS.Oracle}
                fill={COMPANY_COLORS.Oracle}
                fillOpacity={0.85}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Revision path — Jul → Aug → Q3 → Aug-20"
          subtitle="Four perimeters across four 2026 vintages (use Focus to isolate a series)"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={revisionScaled} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="vintage" tick={{ fill: "#64748b", fontSize: 10 }} interval={0} />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const sorted = sortTooltipPayload(payload);
                    const row = payload[0]?.payload as { label: string };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{label}</p>
                        <p className="mb-1 text-xs text-slate-500">{row.label}</p>
                        {sorted.map((p) => (
                          <p key={String(p.dataKey)} className="text-slate-600">
                            <span style={{ color: String(p.color) }}>●</span> {p.name}:{" "}
                            {fmtBn(Number(p.value))}
                          </p>
                        ))}
                      </div>
                    );
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Big5"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  strokeOpacity={seriesOpacity("Big5")}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Street"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeOpacity={seriesOpacity("Street")}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="Credit"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeOpacity={seriesOpacity("Credit")}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="GS IR"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeOpacity={seriesOpacity("GS IR")}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Research-house scenario fan"
          subtitle={
            fanYear === "2026"
              ? "Prior (mid-Q3) vs new (late-Aug) annual totals by house"
              : "2027 scenario levels (single vintage where houses publish)"
          }
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={fanBars} margin={{ top: 8, right: 16, left: 8, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="house"
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v) => `$${v}B`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as {
                      house: string;
                      prior: number;
                      neu: number;
                      scope: string;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.house}</p>
                        <p className="text-slate-600">
                          Prior {fmtBn(row.prior)} → New {fmtBn(row.neu)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{row.scope}</p>
                      </div>
                    );
                  }}
                />
                <Legend />
                <Bar dataKey="prior" name="Prior" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={22} />
                <Bar dataKey="neu" name="New" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} className="text-cyan-700 underline-offset-2 hover:underline">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          Active companies: {activeCompanies.join(", ")}. Deltas sum to{" "}
          {fmtDelta(Math.round(deltas.reduce((s, d) => s + d.deltaBn, 0) * factor * 10) / 10)} in{" "}
          {view === "ai" ? "AI-attributed" : "gross"} terms.
        </p>
      </div>
    </div>
  );
}
