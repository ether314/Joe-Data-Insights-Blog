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
  GS_GI_LAYERS,
  HEADLINE,
  HYPERSCALERS,
  Q2_ABSORPTION,
  SOURCE_NOTE,
  SOURCES,
  companyDeltas,
  dumbbellRows,
  fmtBn,
  fmtDelta,
  fmtPct,
  scenarioFan,
  yoyStacked,
  type Hyperscaler,
} from "@/data/ai-capex-spend-update-2026-data";

// viz-types: delta bars, dumbbell, stacked area YoY, scenario fan, absorption scatter | layout: default
// viz-plan: $B vintage Δ; prior→new dumbbell; dual-2026 YoY stack; house fan prior vs new; Q2 OCF absorption scatter; company + view + year controls

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

export function AiCapexSpendUpdateDashboard() {
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
  const dumbbell = useMemo(() => dumbbellRows(activeCompanies), [activeCompanies]);
  const stack = useMemo(() => yoyStacked(view === "ai" ? "ai" : "gross"), [view]);
  const fan = useMemo(() => scenarioFan(fanYear), [fanYear]);

  const deltaBars = useMemo(
    () =>
      deltas
        .map((d) => ({
          company: d.company,
          value: Math.round(d.deltaBn * factor * 10) / 10,
          fill: d.fill,
          note: d.note,
        }))
        .sort((a, b) => b.value - a.value),
    [deltas, factor],
  );

  const dumbbellScaled = useMemo(
    () =>
      dumbbell.map((d) => ({
        ...d,
        prior: Math.round(d.prior * factor * 10) / 10,
        neu: Math.round(d.neu * factor * 10) / 10,
      })),
    [dumbbell, factor],
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

  const absorptionScatter = useMemo(
    () =>
      Q2_ABSORPTION.map((r) => ({
        company: r.company,
        ocf: r.ocfBn,
        capex: r.capexBn,
        absorption: r.absorptionPct,
        fill: r.fill,
        z: r.capexBn,
      })),
    [],
  );

  return (
    <div className="space-y-6" data-viz="ai-capex-spend-update-2026">
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — Jul research → Aug 2026 update
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Big-5 midpoints {fmtBn(HEADLINE.priorBig5)} → {fmtBn(HEADLINE.newBig5)} (
          {fmtDelta(HEADLINE.deltaBn)} / {fmtPct(HEADLINE.deltaPct)})
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Amazon leads the raise at {fmtBn(220)}. Microsoft&apos;s headline slips to {fmtBn(175)} on lease
          reclass — economic stack closer to {fmtBn(HEADLINE.economicNewBig5)}. Q2 Big-4 absorption prints{" "}
          {HEADLINE.q2AbsorptionPct}% of operating cash flow. Toggle AI-attributed (~75%) to haircut the
          gross stack.
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
          title="Company vintage change ($B)"
          subtitle={
            view === "ai"
              ? "New minus Jul research print, AI-attributed (~75%)"
              : "New guidance midpoint minus Jul research print"
          }
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={deltaBars} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`}
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
                    const sorted = sortTooltipPayload(payload);
                    const row = sorted[0]?.payload as {
                      company: string;
                      value: number;
                      note: string;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.company}</p>
                        <p className="text-slate-600">{fmtDelta(row.value)}</p>
                        <p className="mt-1 max-w-xs text-xs text-slate-500">{row.note}</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={28}>
                  {deltaBars.map((d) => (
                    <Cell key={d.company} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Prior → new guidance (dumbbell)"
          subtitle="Hollow = Jul research vintage; solid = Aug 2026 update"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <ComposedChart
                data={dumbbellScaled}
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
                      priorLabel: string;
                      newLabel: string;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.company}</p>
                        <p className="text-slate-600">
                          Prior {fmtBn(row.prior)} → New {fmtBn(row.neu)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {row.priorLabel} · {row.newLabel}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="neu" barSize={2} radius={0}>
                  {dumbbellScaled.map((d) => (
                    <Cell key={`line-${d.company}`} fill={d.fill} fillOpacity={0.35} />
                  ))}
                </Bar>
                <Scatter dataKey="prior" fill="#fff">
                  {dumbbellScaled.map((d) => (
                    <Cell key={`p-${d.company}`} stroke={d.fill} strokeWidth={2} fill="#fff" />
                  ))}
                </Scatter>
                <Scatter dataKey="neu">
                  {dumbbellScaled.map((d) => (
                    <Cell key={`n-${d.company}`} fill={d.fill} />
                  ))}
                </Scatter>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Hyperscaler stack — dual 2026 vintages"
        subtitle={
          view === "ai"
            ? "AI-attributed (~75%) path with prior vs new 2026 guides side by side"
            : "Gross company capex: 2024–25 actuals, dual 2026 guides, 2027E consensus"
        }
      >
        <div className="h-96 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart data={stack} margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
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
                          <span style={{ color: String(p.color) }}>●</span> {String(p.dataKey)}:{" "}
                          {fmtBn(Number(p.value))}
                        </p>
                      ))}
                      <p className="mt-1 font-medium text-slate-800">Total {fmtBn(total)}</p>
                    </div>
                  );
                }}
              />
              <Legend />
              {HYPERSCALERS.filter((c) => activeCompanies.includes(c)).map((c) => (
                <Area
                  key={c}
                  type="monotone"
                  dataKey={c}
                  stackId="1"
                  stroke={COMPANY_COLORS[c]}
                  fill={COMPANY_COLORS[c]}
                  fillOpacity={0.75}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Research-house scenario fan"
          subtitle={
            fanYear === "2026"
              ? "Prior vs new 2026 prints — scopes differ; do not mix labels"
              : "2027 paths (unchanged bases where houses have not re-cut)"
          }
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={fanBars} margin={{ top: 8, right: 12, left: 0, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="house"
                  interval={0}
                  angle={-28}
                  textAnchor="end"
                  height={70}
                  tick={{ fill: "#64748b", fontSize: 10 }}
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
                        <p className="text-xs text-slate-500">{row.scope}</p>
                        {fanYear === "2026" ? (
                          <>
                            <p className="text-slate-600">Prior {fmtBn(row.prior)}</p>
                            <p className="text-slate-600">New {fmtBn(row.neu)}</p>
                          </>
                        ) : (
                          <p className="text-slate-600">{fmtBn(row.neu)}</p>
                        )}
                      </div>
                    );
                  }}
                />
                <Legend />
                {fanYear === "2026" && (
                  <Bar dataKey="prior" name="Prior vintage" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                )}
                <Bar dataKey="neu" name={fanYear === "2026" ? "New vintage" : "2027 path"} radius={[4, 4, 0, 0]}>
                  {fanBars.map((d) => (
                    <Cell key={d.house} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Q2’26 cash absorption — capex vs OCF"
          subtitle="Big-4 cohort: points above the 100% line spent more than they generated that quarter"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <ScatterChart margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="ocf"
                  name="OCF"
                  unit="B"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                  label={{ value: "Operating cash flow ($B)", position: "insideBottom", offset: -2, fill: "#64748b", fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="capex"
                  name="Capex"
                  unit="B"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                  label={{ value: "Capex ($B)", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="z" range={[80, 280]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as {
                      company: string;
                      ocf: number;
                      capex: number;
                      absorption: number;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.company}</p>
                        <p className="text-slate-600">
                          Capex {fmtBn(row.capex)} · OCF {fmtBn(row.ocf)}
                        </p>
                        <p className="text-slate-600">Absorption {row.absorption.toFixed(1)}%</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine
                  segment={[
                    { x: 30, y: 30 },
                    { x: 60, y: 60 },
                  ]}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  ifOverflow="extendDomain"
                />
                <Scatter data={absorptionScatter}>
                  {absorptionScatter.map((d) => (
                    <Cell key={d.company} fill={d.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-center text-xs text-slate-500">
            Cohort sum: {fmtBn(HEADLINE.q2CapexBn)} capex / {fmtBn(HEADLINE.q2OcfBn)} OCF ={" "}
            {HEADLINE.q2AbsorptionPct}% absorption
          </p>
        </ChartCard>
      </div>

      <ChartCard
        title="GS Global Institute layers (unchanged baseline)"
        subtitle="All-in AI infra path — compute + data centers + power; sensitivity framework, not IR forecast"
      >
        <div className="h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart data={[...GS_GI_LAYERS]} margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v) => `$${v}B`} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const sorted = sortTooltipPayload(payload);
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                      <p className="font-semibold text-slate-900">{label}</p>
                      {sorted.map((p) => (
                        <p key={String(p.dataKey)} className="text-slate-600">
                          {String(p.dataKey)}: {fmtBn(Number(p.value))}
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="compute" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.8} />
              <Area
                type="monotone"
                dataKey="dataCenters"
                stackId="1"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.8}
              />
              <Area type="monotone" dataKey="power" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.8} />
              <Line type="monotone" dataKey="total" stroke="#0f172a" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} className="text-cyan-700 underline hover:text-cyan-900">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
