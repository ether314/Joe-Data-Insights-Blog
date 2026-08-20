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
  GEO_METRICS,
  HEADLINE,
  HUB_DELTAS,
  OWNER_COLORS,
  OWNER_IDS,
  PIPELINE_STATS,
  POWER_PATH,
  SOURCE_NOTE,
  SOURCES,
  TOKEN_VS_OWNERSHIP,
  fmtH100e,
  fmtMw,
  fmtPct,
  fmtPp,
  ownerDeltas,
  rankedHubDeltas,
  type OwnerId,
} from "@/data/ai-compute-demand-update-2026-data";

// viz-types: delta bars, dumbbell pair, hub delta bars, token×ownership scatter, power path | layout: default
// viz-plan: ownership Δ; prior→new H100e dumbbell; hub MW Δ; tokens vs ownership scatter; Gartner power path; owner + metric + region controls

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

type MetricMode = "share" | "h100e";
type RegionFilter = "all" | "United States" | "Europe" | "Middle East" | "China" | "Rest of Asia-Pacific";

const REGIONS: RegionFilter[] = [
  "all",
  "United States",
  "Europe",
  "Middle East",
  "China",
  "Rest of Asia-Pacific",
];

export function AiComputeDemandUpdateDashboard() {
  const [activeOwners, setActiveOwners] = useState<OwnerId[]>([...OWNER_IDS]);
  const [metric, setMetric] = useState<MetricMode>("share");
  const [region, setRegion] = useState<RegionFilter>("all");

  const toggleOwner = (id: OwnerId) => {
    setActiveOwners((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== id);
      }
      return [...prev, id];
    });
  };

  const deltas = useMemo(() => ownerDeltas(activeOwners), [activeOwners]);

  const deltaBars = useMemo(
    () =>
      [...deltas]
        .map((d) => ({
          label: d.label,
          value: metric === "share" ? d.deltaPp : d.deltaH100e,
          fill: d.fill,
        }))
        .sort((a, b) => b.value - a.value),
    [deltas, metric],
  );

  const dumbbell = useMemo(
    () =>
      deltas.map((d) => ({
        label: d.label,
        prior: metric === "share" ? d.priorShare : d.priorH100e,
        neu: metric === "share" ? d.newShare : d.newH100e,
        fill: d.fill,
      })),
    [deltas, metric],
  );

  const hubs = useMemo(() => rankedHubDeltas(region), [region]);

  const hubBars = useMemo(
    () =>
      hubs.map((h) => ({
        hub: h.hub.length > 28 ? `${h.hub.slice(0, 26)}…` : h.hub,
        full: h.hub,
        delta: h.deltaMw,
        prior: h.priorMw,
        neu: h.newMw,
        fill:
          h.deltaMw > 1000 ? "#0ea5e9" : h.deltaMw > 0 ? "#38bdf8" : h.deltaMw < 0 ? "#f43f5e" : "#94a3b8",
      })),
    [hubs],
  );

  const geoBars = useMemo(
    () =>
      [...GEO_METRICS]
        .map((g) => ({
          label: g.label.length > 36 ? `${g.label.slice(0, 34)}…` : g.label,
          full: g.label,
          value: g.deltaPp,
          fill: g.color,
        }))
        .sort((a, b) => Math.abs(b.value) - Math.abs(a.value)),
    [],
  );

  const powerData = useMemo(
    () =>
      POWER_PATH.map((p) => ({
        year: String(p.year),
        capacityGw: p.capacityGw,
        twh: p.twh,
        aiSharePct: p.aiSharePct,
      })),
    [],
  );

  return (
    <div className="space-y-6" data-viz="ai-compute-demand-update-2026">
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — Jul research → Aug 2026 update
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Microsoft +{HEADLINE.microsoftShareDeltaPp} pp ownership share — Big-5 still ~
          {HEADLINE.newBig5SharePct}% · US pipeline {HEADLINE.usPipelineGw} GW
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Epoch Chip Owners Explorer restates Microsoft to ~{fmtH100e(3.45)} (
          {fmtPp(HEADLINE.microsoftShareDeltaPp)} vs the July residual estimate). Amazon and Oracle
          revise down; Meta ticks up. Synergy&apos;s July site ledger adds ~{HEADLINE.usPipelineGw} GW
          of US IT pipeline and a +{HEADLINE.inlandPipelineDeltaPp} pp inland pipeline jump
          (TX + Midwest). Token meters still diverge from the ownership pie.
        </p>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Owners</span>
            {OWNER_IDS.map((id) => {
              const on = activeOwners.includes(id);
              const label = id.charAt(0).toUpperCase() + id.slice(1);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleOwner(id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    on ? "text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                  style={on ? { backgroundColor: OWNER_COLORS[id] } : undefined}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Metric</span>
            {(
              [
                ["share", "Share Δ (pp)"],
                ["h100e", "H100e Δ (M)"],
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
          title="Ownership vintage change"
          subtitle={
            metric === "share"
              ? "New explorer share minus Jul 2026 research residual / anchors"
              : "New H100e millions minus prior print"
          }
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={deltaBars} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) =>
                    metric === "share" ? `${v > 0 ? "+" : ""}${v}` : `${v > 0 ? "+" : ""}${v}`
                  }
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={78}
                  tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const sorted = sortTooltipPayload(payload);
                    const row = sorted[0]?.payload as { label: string; value: number };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.label}</p>
                        <p className="text-slate-600">
                          {metric === "share" ? fmtPp(row.value) : fmtH100e(row.value)}
                        </p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={28}>
                  {deltaBars.map((d) => (
                    <Cell key={d.label} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Prior → new ownership levels (dumbbell)"
          subtitle={
            metric === "share"
              ? "Hollow = Jul research; solid = Aug explorer restatement (% of world)"
              : "Hollow = prior H100e (M); solid = new explorer levels"
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
                  tickFormatter={(v) => (metric === "share" ? `${v}%` : `${v}M`)}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={78}
                  tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as {
                      label: string;
                      prior: number;
                      neu: number;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.label}</p>
                        <p className="text-slate-500">
                          Prior:{" "}
                          {metric === "share" ? fmtPct(row.prior, 1) : fmtH100e(row.prior)}
                        </p>
                        <p className="text-slate-700">
                          New: {metric === "share" ? fmtPct(row.neu, 1) : fmtH100e(row.neu)}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="prior" name="Prior" fill="#cbd5e1" radius={[0, 4, 4, 0]} maxBarSize={14} />
                <Bar dataKey="neu" name="New" radius={[0, 4, 4, 0]} maxBarSize={14}>
                  {dumbbell.map((d) => (
                    <Cell key={d.label} fill={d.fill} />
                  ))}
                </Bar>
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Hub IT-MW revisions (prior → new)"
        subtitle="Positive = upward revision vs Jul research panel — Synergy inland pipeline intensity"
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Region</span>
          {REGIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRegion(r)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                region === r
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {r === "all" ? "All hubs" : r}
            </button>
          ))}
        </div>
        <div className="h-96 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <BarChart data={hubBars} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`}
              />
              <YAxis
                type="category"
                dataKey="hub"
                width={140}
                tick={{ fill: "#334155", fontSize: 11, fontWeight: 600 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const row = payload[0]?.payload as {
                    full: string;
                    delta: number;
                    prior: number;
                    neu: number;
                  };
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                      <p className="font-semibold text-slate-900">{row.full}</p>
                      <p className="text-slate-500">
                        Prior {fmtMw(row.prior)} → New {fmtMw(row.neu)}
                      </p>
                      <p className="text-slate-700">
                        Δ {row.delta > 0 ? "+" : ""}
                        {fmtMw(row.delta)}
                      </p>
                    </div>
                  );
                }}
              />
              <ReferenceLine x={0} stroke="#94a3b8" />
              <Bar dataKey="delta" name="MW Δ" radius={[0, 4, 4, 0]} maxBarSize={22}>
                {hubBars.map((d) => (
                  <Cell key={d.full} fill={d.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Geography concentration deltas"
          subtitle="Synergy Jul 2026 / inland shift vs prior theme meters (pp change)"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={geoBars} layout="vertical" margin={{ top: 8, right: 16, left: 4, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={160}
                  tick={{ fill: "#334155", fontSize: 10, fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as { full: string; value: number };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.full}</p>
                        <p className="text-slate-600">{fmtPp(row.value, 0)}</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
                  {geoBars.map((d) => (
                    <Cell key={d.full} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Tokens vs ownership (scatter)"
          subtitle="Jun 2026 token share of tracked brands (x) vs Epoch ownership share (y) — usage ≠ ownership"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <ScatterChart margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="tokenSharePct"
                  name="Token share"
                  unit="%"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  domain={[0, 32]}
                  label={{ value: "Token share %", position: "insideBottom", offset: -2, fill: "#64748b", fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="ownerSharePct"
                  name="Owner share"
                  unit="%"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  domain={[0, 32]}
                  label={{ value: "Owner %", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }}
                />
                <ZAxis range={[80, 80]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as {
                      label: string;
                      tokenSharePct: number;
                      ownerSharePct: number;
                      note: string;
                    };
                    return (
                      <div className="max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.label}</p>
                        <p className="text-slate-600">Tokens {fmtPct(row.tokenSharePct, 0)}</p>
                        <p className="text-slate-600">Owns {fmtPct(row.ownerSharePct, 1)}</p>
                        <p className="mt-1 text-xs text-slate-500">{row.note}</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine
                  segment={[
                    { x: 0, y: 0 },
                    { x: 30, y: 30 },
                  ]}
                  stroke="#cbd5e1"
                  strokeDasharray="4 4"
                />
                <Scatter data={TOKEN_VS_OWNERSHIP} name="Brands">
                  {TOKEN_VS_OWNERSHIP.map((d) => (
                    <Cell key={d.id} fill={d.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Gartner power path — capacity GW & AI server share"
        subtitle="1Q26 forecast carried forward; 2027 is the year AI-optimised servers are set to surpass conventional"
      >
        <div className="h-80 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <LineChart data={powerData} margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis
                yAxisId="gw"
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(v) => `${v}`}
                domain={[0, 320]}
                label={{ value: "GW", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }}
              />
              <YAxis
                yAxisId="ai"
                orientation="right"
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 55]}
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
                          {p.name}: {p.value}
                          {String(p.dataKey).includes("Share") || String(p.dataKey) === "aiSharePct"
                            ? "%"
                            : String(p.dataKey) === "twh"
                              ? " TWh"
                              : " GW"}
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend />
              <Line
                yAxisId="gw"
                type="monotone"
                dataKey="capacityGw"
                name="DC capacity (GW)"
                stroke="#0ea5e9"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                yAxisId="ai"
                type="monotone"
                dataKey="aiSharePct"
                name="AI server share %"
                stroke="#f59e0b"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PIPELINE_STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold" style={{ color: s.color }}>
              {s.value.toLocaleString()}
              <span className="ml-1 text-sm font-semibold text-slate-500">{s.unit}</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-700">Sources</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} className="text-cyan-700 underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
