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
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  COMPANY_COLORS,
  GS_GI_LAYERS,
  HEADLINE,
  HYPERSCALERS,
  REVISION_PATH,
  SOURCE_NOTE,
  SOURCES,
  companyDeltas,
  compositionShare,
  fmtBn,
  fmtDelta,
  fmtPct,
  scenarioFan,
  slopeRows,
  waterfallSteps,
  yoyStacked,
  type Hyperscaler,
} from "@/data/ai-capex-spend-update-2026q3-data";

// viz-types: waterfall, slope, stacked area YoY, revision multi-line, pie composition, scenario fan | layout: default
// viz-plan: Aug→Q3 waterfall Δ; prior→new slope; triple-2026 YoY stack; Jul/Aug/Q3 revision path; share pie; house fan

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

export function AiCapexSpendUpdate2026q3Dashboard() {
  const [activeCompanies, setActiveCompanies] = useState<Hyperscaler[]>([...HYPERSCALERS]);
  const [view, setView] = useState<ViewMode>("dollars");
  const [fanYear, setFanYear] = useState<FanYear>("2026");

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
  const pie = useMemo(() => compositionShare(activeCompanies), [activeCompanies]);
  const waterfall = useMemo(() => waterfallSteps(activeCompanies), [activeCompanies]);

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

  const pieScaled = useMemo(
    () =>
      pie.map((p) => ({
        ...p,
        value: Math.round(p.value * factor * 10) / 10,
      })),
    [pie, factor],
  );

  const giLayers = useMemo(
    () =>
      GS_GI_LAYERS.map((r) => ({
        year: r.year,
        Compute: r.compute,
        "Data centers": r.dataCenters,
        Power: r.power,
        total: r.total,
      })),
    [],
  );

  return (
    <div className="space-y-6" data-viz="ai-capex-spend-update-2026q3">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Q3 vintage delta — Aug post-Q2 → mid-Q3 desk
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Big-5 midpoints {fmtBn(HEADLINE.priorBig5)} → {fmtBn(HEADLINE.newBig5)} (
          {fmtDelta(HEADLINE.deltaBn)} / {fmtPct(HEADLINE.deltaPct)})
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Versus July&apos;s {fmtBn(HEADLINE.julBig5)} research print, the cumulative raise is now{" "}
          {fmtDelta(HEADLINE.julToQ3DeltaBn)} ({fmtPct(HEADLINE.julToQ3DeltaPct)}). Amazon leads again at{" "}
          {fmtBn(230)}; Microsoft&apos;s accounting print stays {fmtBn(175)} while the economic stack sits nearer{" "}
          {fmtBn(HEADLINE.economicNewBig5)}. Toggle AI-attributed (~75%) to haircut the gross stack.
        </p>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Companies</span>
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
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Aug → Q3 vintage waterfall ($B)"
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
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={56} />
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
          title="Prior → new slope (Aug → Q3)"
          subtitle="Left = Aug post-Q2 midpoint; right = mid-Q3 desk midpoint"
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
            Hollow-ish left markers = Aug vintage; filled right markers = Q3. Flat Microsoft line = lease
            accounting hold, not a demand pause.
          </p>
        </ChartCard>
      </div>

      <ChartCard
        title="Hyperscaler stack — triple 2026 vintages"
        subtitle="2024–25 actuals, Jul / Aug / Q3 2026 guides, then 2027E consensus path"
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
              <Area type="monotone" dataKey="Amazon" stackId="1" stroke={COMPANY_COLORS.Amazon} fill={COMPANY_COLORS.Amazon} fillOpacity={0.85} />
              <Area type="monotone" dataKey="Microsoft" stackId="1" stroke={COMPANY_COLORS.Microsoft} fill={COMPANY_COLORS.Microsoft} fillOpacity={0.85} />
              <Area type="monotone" dataKey="Alphabet" stackId="1" stroke={COMPANY_COLORS.Alphabet} fill={COMPANY_COLORS.Alphabet} fillOpacity={0.85} />
              <Area type="monotone" dataKey="Meta" stackId="1" stroke={COMPANY_COLORS.Meta} fill={COMPANY_COLORS.Meta} fillOpacity={0.85} />
              <Area type="monotone" dataKey="Oracle" stackId="1" stroke={COMPANY_COLORS.Oracle} fill={COMPANY_COLORS.Oracle} fillOpacity={0.85} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Revision path — Jul → Aug → Q3"
          subtitle="Four perimeters tracked across the three 2026 vintages"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={revisionScaled} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="vintage" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis domain={["auto", "auto"]} tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v) => `$${v}B`} />
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
                <Line type="monotone" dataKey="Big5" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Street" stroke="#64748b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Credit" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="GS IR" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Q3 Big-5 composition"
          subtitle="Share of the mid-Q3 midpoint stack by company"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={pieScaled}
                  dataKey="value"
                  nameKey="company"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={96}
                  paddingAngle={2}
                >
                  {pieScaled.map((d) => (
                    <Cell key={d.company} fill={d.fill} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as {
                      company: string;
                      value: number;
                      pct: number;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.company}</p>
                        <p className="text-slate-600">
                          {fmtBn(row.value)} · {row.pct}%
                        </p>
                      </div>
                    );
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Research-house scenario fan"
          subtitle={
            fanYear === "2026"
              ? "Prior (Aug) vs new (mid-Q3) annual totals by house"
              : "2027 scenario levels (single vintage where houses publish)"
          }
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={fanBars} margin={{ top: 8, right: 16, left: 8, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="house" tick={{ fill: "#64748b", fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={60} />
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

        <ChartCard
          title="GS GI all-in layers (unchanged path)"
          subtitle="Compute + data centers + power — Tracking Trillions perimeter"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={giLayers} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v) => `$${v}B`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const sorted = sortTooltipPayload(payload);
                    const total = (payload[0]?.payload as { total: number })?.total;
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
                <Area type="monotone" dataKey="Compute" stackId="g" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.85} />
                <Area type="monotone" dataKey="Data centers" stackId="g" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.85} />
                <Area type="monotone" dataKey="Power" stackId="g" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.85} />
              </AreaChart>
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
