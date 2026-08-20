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
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  BOTTLENECK_DELTA,
  COWOS_PATH,
  EQUIPMENT_PACE,
  HEADLINE,
  PACE_CHECK,
  REGION_COLORS,
  REGIONAL_Q1,
  SOURCE_NOTE,
  SOURCES,
  bottleneckScatter,
  fmtBn,
  fmtPct,
  regionalDumbbell,
  regionalYoyBars,
  tightnessDelta,
  type RegionName,
} from "@/data/ai-supply-chain-update-2026-data";

// viz-types: YoY/QoQ delta bars, Q1 dumbbell, tightness Δ bars, dual-vintage scatter, CoWoS gap composed | layout: default
// viz-plan: regional Δ; prior→new Q1 levels; bottleneck score Δ; tightness×lead scatter; CoWoS capacity vs demand + gap

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

type GrowthMetric = "yoyPct" | "qoqPct";
type ScatterVintage = "prior" | "new" | "both";
type PanelMode = "regions" | "bottlenecks" | "cowos" | "pace";

const ALL_REGIONS = REGIONAL_Q1.map((r) => r.region);

export function AiSupplyChainUpdateDashboard() {
  const [activeRegions, setActiveRegions] = useState<RegionName[]>([...ALL_REGIONS]);
  const [growthMetric, setGrowthMetric] = useState<GrowthMetric>("yoyPct");
  const [scatterVintage, setScatterVintage] = useState<ScatterVintage>("both");
  const [panel, setPanel] = useState<PanelMode>("regions");

  const toggleRegion = (r: RegionName) => {
    setActiveRegions((prev) => {
      if (prev.includes(r)) {
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== r);
      }
      return [...prev, r];
    });
  };

  const growthBars = useMemo(() => {
    const rows = regionalYoyBars(activeRegions);
    return rows
      .map((r) => ({
        region: r.region,
        value: growthMetric === "yoyPct" ? r.yoyPct : r.qoqPct,
        fill: r.fill,
        q1: r.q1_2026,
      }))
      .sort((a, b) => b.value - a.value);
  }, [activeRegions, growthMetric]);

  const dumbbell = useMemo(() => regionalDumbbell(activeRegions), [activeRegions]);

  const tightnessBars = useMemo(
    () =>
      BOTTLENECK_DELTA.map((b) => ({
        label: b.label,
        delta: tightnessDelta(b),
        prior: b.priorTightness,
        neu: b.newTightness,
        fill: b.color,
      })).sort((a, b) => a.delta - b.delta),
    [],
  );

  const scatter = useMemo(() => bottleneckScatter(scatterVintage), [scatterVintage]);

  const cowosChart = useMemo(
    () =>
      COWOS_PATH.map((r) => ({
        ...r,
        periodShort: r.period.replace("\n", " "),
      })),
    [],
  );

  return (
    <div className="space-y-6" data-viz="ai-supply-chain-update-2026">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — Jul research → Aug 2026 WWSEMS Q1
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Q1 equipment {fmtBn(HEADLINE.q1_2026)} ({fmtPct(HEADLINE.q1YoyPct)} YoY) — Taiwan{" "}
          {fmtPct(HEADLINE.taiwanYoyPct)}, CoWoS gap {HEADLINE.cowosGapPriorPct}% →{" "}
          {HEADLINE.cowosGapNewPct}%
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Newest official billings print is {fmtBn(HEADLINE.q1_2026)} globally — {HEADLINE.q1ShareOfFyPct}% of
          the July Mid-Year {fmtBn(HEADLINE.fy2026Forecast)} FY26 forecast. Korea ({fmtBn(HEADLINE.koreaQ1)},{" "}
          {fmtPct(HEADLINE.koreaYoyPct)}) and Taiwan ({fmtBn(HEADLINE.taiwanQ1)}) still carry the AI signature;
          China stays #1 at {fmtBn(HEADLINE.chinaQ1)} but cooled {HEADLINE.chinaQoqPct}% QoQ.
        </p>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Panel</span>
            {(
              [
                ["regions", "Regions"],
                ["bottlenecks", "Bottlenecks"],
                ["cowos", "CoWoS path"],
                ["pace", "FY pace"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setPanel(id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  panel === id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {panel === "regions" && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Growth</span>
              {(
                [
                  ["yoyPct", "YoY %"],
                  ["qoqPct", "QoQ %"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setGrowthMetric(id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    growthMetric === id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {panel === "bottlenecks" && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Scatter</span>
              {(
                [
                  ["both", "Both vintages"],
                  ["prior", "Jul research"],
                  ["new", "Aug update"],
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
          )}
        </div>

        {panel === "regions" && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Regions</span>
            {ALL_REGIONS.map((r) => {
              const on = activeRegions.includes(r);
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggleRegion(r)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    on ? "text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                  style={on ? { backgroundColor: REGION_COLORS[r] } : undefined}
                >
                  {r}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {panel === "regions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Regional growth rates (Q1 2026)"
            subtitle={
              growthMetric === "yoyPct"
                ? "Year-over-year % vs Q1 2025 — Taiwan leads the AI install signature"
                : "Quarter-over-quarter % vs Q4 2025 — China cools after a hot finish"
            }
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={growthBars} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`}
                  />
                  <YAxis type="category" dataKey="region" width={88} tick={{ fill: "#475569", fontSize: 11 }} />
                  <Tooltip
                    formatter={(value) => [`${Number(value) > 0 ? "+" : ""}${value}%`, growthMetric === "yoyPct" ? "YoY" : "QoQ"]}
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
                  />
                  <ReferenceLine x={0} stroke="#94a3b8" />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {growthBars.map((d) => (
                      <Cell key={d.region} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Q1 levels — prior year → newest print"
            subtitle="Dumbbell: Q1 2025 → Q1 2026 billings ($B)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={dumbbell} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v) => `$${v}B`} />
                  <YAxis type="category" dataKey="region" width={88} tick={{ fill: "#475569", fontSize: 11 }} />
                  <Tooltip
                    formatter={(value, name) => [fmtBn(Number(value)), name === "prior" ? "Q1 2025" : "Q1 2026"]}
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
                  />
                  <Bar dataKey="prior" name="prior" fill="#cbd5e1" radius={[0, 4, 4, 0]} barSize={10} />
                  <Bar dataKey="neu" name="neu" radius={[0, 4, 4, 0]} barSize={10}>
                    {dumbbell.map((d) => (
                      <Cell key={d.region} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "bottlenecks" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Tightness score Δ (Jul → Aug)"
            subtitle="Negative = easing vs the July research print (editorial 1–10)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={tightnessBars} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[-2, 1]}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`}
                  />
                  <YAxis type="category" dataKey="label" width={120} tick={{ fill: "#475569", fontSize: 10 }} />
                  <Tooltip
                    formatter={(value, _n, item) => {
                      const p = item?.payload as { prior: number; neu: number };
                      return [`${p.prior} → ${p.neu} (${Number(value) > 0 ? "+" : ""}${value})`, "Tightness"];
                    }}
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
                  />
                  <ReferenceLine x={0} stroke="#94a3b8" />
                  <Bar dataKey="delta" radius={[0, 4, 4, 0]}>
                    {tightnessBars.map((d) => (
                      <Cell key={d.label} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Bottleneck scatter — tightness × lead time"
            subtitle="Bubble size ≈ supplier concentration; toggle Jul vs Aug vintage"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="tightness"
                    name="Tightness"
                    domain={[4, 11]}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    label={{ value: "Tightness (1–10)", position: "insideBottom", offset: -4, fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="leadWeeks"
                    name="Lead weeks"
                    domain={[20, 80]}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    label={{ value: "Lead (weeks)", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="concentrationPct" range={[60, 320]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(_, payload) => {
                      const p = payload?.[0]?.payload as { label?: string; vintage?: string };
                      return p?.label ? `${p.label} (${p.vintage})` : "";
                    }}
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
                  />
                  <Scatter data={scatter} name="Layers">
                    {scatter.map((d) => (
                      <Cell
                        key={d.id}
                        fill={d.color}
                        fillOpacity={d.vintage === "prior" ? 0.35 : 0.9}
                        stroke={d.color}
                        strokeWidth={d.vintage === "new" ? 2 : 1}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "cowos" && (
        <ChartCard
          title="CoWoS capacity vs demand — vintage revision"
          subtitle="Tracker midpoints (wafers/month). Gap narrows ~20% → ~10% by mid-2026 update."
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <ComposedChart data={cowosChart} margin={{ top: 12, right: 16, left: 8, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" tick={{ fill: "#475569", fontSize: 10 }} interval={0} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 30]}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "gapPct") return [`${value}%`, "Supply-demand gap"];
                    return [`${Number(value).toLocaleString()} wpm`, String(name)];
                  }}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="demand"
                  name="Demand"
                  fill="#fef3c7"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
                <Bar yAxisId="left" dataKey="capacity" name="Capacity" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="gapPct"
                  name="Gap %"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "pace" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Equipment cycle + Mid-Year FY path"
            subtitle="SEMI totals ($B). Q1 2026 is a billings print — not a revision of the $165.9B forecast."
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <ComposedChart data={EQUIPMENT_PACE} margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fill: "#475569", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v) => `$${v}B`} />
                  <Tooltip
                    formatter={(value) => [fmtBn(Number(value), 1), "Total equipment"]}
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
                  />
                  <Area type="monotone" dataKey="total" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth={2} />
                  <ReferenceLine
                    y={PACE_CHECK.q1Annualized}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    label={{ value: `Q1×4 ${fmtBn(PACE_CHECK.q1Annualized, 1)}`, fill: "#b45309", fontSize: 10 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Pace check vs July FY26 forecast"
            subtitle={PACE_CHECK.note}
          >
            <div className="flex h-80 flex-col justify-center gap-4 px-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Q1 2026 print</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{fmtBn(HEADLINE.q1_2026)}</p>
                  <p className="mt-1 text-sm text-slate-600">{fmtPct(HEADLINE.q1YoyPct)} YoY · {fmtPct(HEADLINE.q1QoqPct)} QoQ</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Share of FY forecast</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{HEADLINE.q1ShareOfFyPct}%</p>
                  <p className="mt-1 text-sm text-slate-600">of {fmtBn(HEADLINE.fy2026Forecast)} Mid-Year path</p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Naive Q1×4</p>
                  <p className="mt-1 text-2xl font-bold text-amber-950">{fmtBn(PACE_CHECK.q1Annualized, 1)}</p>
                  <p className="mt-1 text-sm text-amber-900">Illustrative only — H2 usually heavier</p>
                </div>
                <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Gap to forecast</p>
                  <p className="mt-1 text-2xl font-bold text-cyan-950">{fmtBn(PACE_CHECK.gapBn, 1)}</p>
                  <p className="mt-1 text-sm text-cyan-900">FY path still assumes 2H acceleration</p>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        {SOURCES.map((s) => (
          <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-700">
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}
