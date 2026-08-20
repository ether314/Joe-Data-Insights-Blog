"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  COMPANIES,
  HEADLINE,
  SOURCE_NOTE,
  SOURCES,
  SUSTAINABILITY_BANDS,
  capexBridge,
  fmtBn,
  fmtPct,
  fmtPp,
  intensityPathFor,
  sustainabilityScatter,
  vintageDeltas,
  type CompanyId,
} from "@/data/ai-capex-intensity-update-2026-data";

// viz-types: delta bars, dumbbell pair, multi-line path, dual-vintage scatter | layout: default
// viz-plan: vintage Δ intensity; prior→new dumbbell; FY24→H1’26 path; intensity×FCF scatter with vintage toggle; company + metric + scatter controls

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

type MetricMode = "intensity" | "fcf";
type ScatterVintage = "prior" | "new" | "both";

export function AiCapexIntensityUpdateDashboard() {
  const [activeCompanies, setActiveCompanies] = useState<CompanyId[]>([...COMPANIES]);
  const [metric, setMetric] = useState<MetricMode>("intensity");
  const [scatterVintage, setScatterVintage] = useState<ScatterVintage>("both");

  const toggleCompany = (c: CompanyId) => {
    setActiveCompanies((prev) => {
      if (prev.includes(c)) {
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== c);
      }
      return [...prev, c];
    });
  };

  const deltas = useMemo(() => vintageDeltas(activeCompanies), [activeCompanies]);
  const path = useMemo(() => intensityPathFor(activeCompanies), [activeCompanies]);
  const scatter = useMemo(
    () => sustainabilityScatter(scatterVintage, activeCompanies),
    [scatterVintage, activeCompanies],
  );
  const bridge = useMemo(() => capexBridge(activeCompanies), [activeCompanies]);

  const deltaBars = useMemo(
    () =>
      deltas
        .map((d) => ({
          company: d.company,
          value: metric === "intensity" ? d.deltaPp : d.fcfDeltaPp,
          fill: d.fill,
        }))
        .sort((a, b) => b.value - a.value),
    [deltas, metric],
  );

  const dumbbell = useMemo(
    () =>
      deltas.map((d) => ({
        company: d.company,
        prior: metric === "intensity" ? d.priorIntensity : d.priorFcf,
        neu: metric === "intensity" ? d.newIntensity : d.newFcf,
        fill: d.fill,
        priorLabel: d.priorLabel,
        newLabel: d.newLabel,
      })),
    [deltas, metric],
  );

  return (
    <div className="space-y-6" data-viz="ai-capex-intensity-update-2026">
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — Jul research → Aug 2026 update
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Big-4 weighted intensity {fmtPct(HEADLINE.weightedPrior)} → {fmtPct(HEADLINE.weightedNew)} (
          {fmtPp(HEADLINE.weightedDeltaPp)})
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Microsoft FY26 prints {fmtPct(HEADLINE.msftFy26)} ({fmtPp(HEADLINE.msftDeltaPp)} vs FY25). Meta H1
          annualized hits {fmtPct(HEADLINE.metaNew)}. Oracle FY25 restates to {fmtPct(HEADLINE.oracleRestated)}{" "}
          from the prior estimate. Amazon&apos;s FCF cushion compresses to {fmtPct(HEADLINE.amazonFcfNew)}.
        </p>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Companies</span>
            {COMPANIES.map((c) => {
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
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Metric</span>
            {(
              [
                ["intensity", "Intensity Δ"],
                ["fcf", "FCF margin Δ"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMetric(id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  metric === id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Vintage change (percentage points)"
          subtitle={
            metric === "intensity"
              ? "New vintage intensity minus Jul 2026 research print"
              : "New vintage FCF margin minus prior print — negative = less cushion"
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
                  unit=" pp"
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
                    const row = sorted[0]?.payload as { company: string; value: number };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.company}</p>
                        <p className="text-slate-600">{fmtPp(row.value)}</p>
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
          title="Prior → new levels (dumbbell)"
          subtitle={
            metric === "intensity"
              ? "Hollow = prior vintage; solid = Aug 2026 update"
              : "FCF margin prior (hollow) vs new (solid)"
          }
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={dumbbell} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, "auto"]}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
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
                        <p className="text-slate-500">
                          {row.priorLabel}: {fmtPct(row.prior)}
                        </p>
                        <p className="text-slate-700">
                          {row.newLabel}: {fmtPct(row.neu)}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="prior" name="Prior" fill="#cbd5e1" radius={[0, 4, 4, 0]} maxBarSize={14} />
                <Bar dataKey="neu" name="New" radius={[0, 4, 4, 0]} maxBarSize={14}>
                  {dumbbell.map((d) => (
                    <Cell key={d.company} fill={d.fill} />
                  ))}
                </Bar>
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Intensity path — FY24 → FY25 → H1’26*"
        subtitle="H1’26* is Microsoft FY26 full year; calendar names are H1×2 annualized; Oracle H1’26* uses early FY26 guide (~41%)"
      >
        <div className="h-96 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <LineChart data={path} margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="period" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 45]}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const sorted = sortTooltipPayload(payload);
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                      <p className="mb-1 font-semibold text-slate-900">{label}</p>
                      {sorted.map((p) => (
                        <p key={String(p.dataKey)} style={{ color: p.color as string }}>
                          {p.name}: {typeof p.value === "number" ? fmtPct(p.value) : "—"}
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <ReferenceLine
                y={HEADLINE.telecomNorm}
                stroke="#64748b"
                strokeDasharray="4 4"
                label={{ value: "Telecom ~20%", fill: "#64748b", fontSize: 11 }}
              />
              <ReferenceLine
                y={HEADLINE.preAiCloud}
                stroke="#94a3b8"
                strokeDasharray="2 4"
                label={{ value: "Pre-AI cloud", fill: "#94a3b8", fontSize: 11 }}
              />
              {activeCompanies.map((c) => (
                <Line
                  key={c}
                  type="monotone"
                  dataKey={c}
                  name={c}
                  stroke={COMPANY_COLORS[c]}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  connectNulls
                />
              ))}
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Green band conceptually = historical cloud (0–{SUSTAINABILITY_BANDS.comfortable.high}%); yellow =
          elevated ({SUSTAINABILITY_BANDS.stretched.low}–{SUSTAINABILITY_BANDS.stretched.high}%); red = telecom /
          foundry territory.
        </p>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Sustainability scatter — intensity vs FCF"
          subtitle="X = capex/revenue; Y = FCF margin. Toggle prior / new / both vintages."
        >
          <div className="mb-3 flex flex-wrap gap-2">
            {(
              [
                ["both", "Both vintages"],
                ["prior", "Prior only"],
                ["new", "New only"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setScatterVintage(id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  scatterVintage === id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <ScatterChart margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="intensity"
                  name="Intensity"
                  unit="%"
                  domain={[10, 45]}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  label={{ value: "Capex / revenue", position: "insideBottom", offset: -2, fill: "#64748b" }}
                />
                <YAxis
                  type="number"
                  dataKey="fcfMargin"
                  name="FCF"
                  unit="%"
                  domain={[0, 30]}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  label={{ value: "FCF margin", angle: -90, position: "insideLeft", fill: "#64748b" }}
                />
                <ZAxis type="number" dataKey="capexBn" range={[60, 280]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as {
                      company: string;
                      intensity: number;
                      fcfMargin: number;
                      capexBn: number;
                      vintage: string;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">
                          {row.company}{" "}
                          <span className="font-normal text-slate-500">({row.vintage})</span>
                        </p>
                        <p>Intensity {fmtPct(row.intensity)}</p>
                        <p>FCF {fmtPct(row.fcfMargin)}</p>
                        <p>Capex {fmtBn(row.capexBn)}</p>
                      </div>
                    );
                  }}
                />
                <Scatter name="Firms" data={scatter}>
                  {scatter.map((p, i) => (
                    <Cell
                      key={`${p.company}-${p.vintage}-${i}`}
                      fill={p.fill}
                      fillOpacity={p.vintage === "prior" ? 0.35 : 0.95}
                      stroke={p.fill}
                      strokeWidth={p.vintage === "prior" ? 1 : 0}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Absolute capex bridge ($B)"
          subtitle="Prior vintage dollars → new vintage — the cash leaving the firm, not just the ratio"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={bridge} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="company" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v) => `$${v}B`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as {
                      prior: number;
                      neu: number;
                      delta: number;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{label}</p>
                        <p>Prior {fmtBn(row.prior)}</p>
                        <p>New {fmtBn(row.neu)}</p>
                        <p className="text-slate-500">Δ {fmtBn(row.delta)}</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="prior" name="Prior $B" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="neu" name="New $B" radius={[4, 4, 0, 0]}>
                  {bridge.map((d) => (
                    <Cell key={d.company} fill={d.fill} />
                  ))}
                </Bar>
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.label}>
              <a href={s.url} className="text-cyan-800 underline-offset-2 hover:underline">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
