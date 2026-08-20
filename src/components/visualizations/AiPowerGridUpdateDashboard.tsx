"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
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
  BOTTLENECK_ROWS,
  CLUSTER_COLORS,
  DENSITY_PATH,
  DEMAND_PATH,
  EMISSIONS_PATH,
  GARTNER_PATH,
  HEADLINE,
  MOMENTUM,
  PACE_SCATTER,
  SCENARIO_SHIFT,
  SOURCE_NOTE,
  YOY_GROWTH,
  demandDumbbell,
  type PacePoint,
} from "@/data/ai-power-grid-update-2026-data";

// viz-types: YoY bars, demand dumbbell, bottleneck Δ bars, density+emissions composed, pace scatter, Gartner dual-axis | layout: default
// viz-plan: vintage delta first; panel + pace-cluster + path-metric controls; no KPI+bar clone

type Panel =
  | "yoy"
  | "demand"
  | "bottlenecks"
  | "density"
  | "pace"
  | "gartner";

type PathMetric = "emissions" | "density";
type PaceFilter = "all" | PacePoint["cluster"];

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

const PANEL_LABELS: Record<Panel, string> = {
  yoy: "YoY growth",
  demand: "Demand path",
  bottlenecks: "Bottlenecks",
  density: "Density / CO₂",
  pace: "Pace mismatch",
  gartner: "Gartner GW",
};

export function AiPowerGridUpdateDashboard() {
  const [panel, setPanel] = useState<Panel>("yoy");
  const [paceFilter, setPaceFilter] = useState<PaceFilter>("all");
  const [pathMetric, setPathMetric] = useState<PathMetric>("density");

  const dumbbell = useMemo(() => demandDumbbell(), []);
  const yoyBars = useMemo(
    () =>
      YOY_GROWTH.map((g) => ({
        label: g.label,
        yoyPct: g.yoyPct,
        fill:
          g.id === "ai-focused"
            ? "#22d3ee"
            : g.id === "all-dc"
              ? "#6366f1"
              : "#94a3b8",
      })),
    [],
  );

  const bottleneckBars = useMemo(
    () =>
      BOTTLENECK_ROWS.filter((r) => r.valueNew !== r.valuePrior || r.id === "onsite-gas" || r.id === "dc-batteries" || r.id === "turbine-orders")
        .map((r) => ({
          metric: r.metric.replace(" by 2030", "").replace(" (2025)", ""),
          delta: r.valueNew - r.valuePrior,
          fill: r.valueNew - r.valuePrior > 0 ? "#f59e0b" : "#64748b",
        }))
        .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)),
    [],
  );

  const pacePoints = useMemo(() => {
    if (paceFilter === "all") return PACE_SCATTER;
    return PACE_SCATTER.filter((p) => p.cluster === paceFilter);
  }, [paceFilter]);

  const densityEmissions = useMemo(
    () =>
      [2020, 2024, 2025, 2027, 2030, 2035].map((year) => {
        const dens = DENSITY_PATH.find((d) => d.year === year);
        const em = EMISSIONS_PATH.find((e) => e.year === year);
        return {
          year: String(year),
          densityIndex: dens?.index ?? null,
          households: dens?.householdsEquiv ?? null,
          priorMt: em?.priorMt ?? null,
          newMt: em?.newMt ?? null,
        };
      }),
    [],
  );

  const gartnerSeries = useMemo(
    () =>
      GARTNER_PATH.map((g) => ({
        year: String(g.year),
        capacityGw: g.capacityGw,
        electricityTwh: g.electricityTwh,
        aiShare: g.aiServerSharePct,
      })),
    [],
  );

  const scenarioBars = useMemo(
    () =>
      SCENARIO_SHIFT.map((s) => ({
        horizon: s.horizon.split(" ")[0],
        full: s.horizon,
        score: s.score,
        fill:
          s.direction === "up"
            ? "#22d3ee"
            : s.direction === "down"
              ? "#f97316"
              : "#94a3b8",
      })),
    [],
  );

  return (
    <div className="space-y-6" data-viz="ai-power-grid-update-2026">
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — Energy and AI research → Key Questions 2026
        </p>
        <p className="mt-2 text-sm text-slate-700">
          Central 2030 path moves only{" "}
          <span className="font-semibold text-slate-900">
            {HEADLINE.priorBase2030Twh} → {HEADLINE.newCentral2030Twh} TWh
          </span>{" "}
          (+{HEADLINE.base2030DeltaTwh}), but the composition story rewrote:
          AI-focused load{" "}
          <span className="font-semibold text-cyan-700">
            +{HEADLINE.aiFocusedYoy2025Pct}% in 2025
          </span>{" "}
          and triples to 2030; near-term aggressive upside downshifts while
          post-2030 upside rises; onsite gas{" "}
          <span className="font-semibold">
            {HEADLINE.onsiteGasGwLow}–{HEADLINE.onsiteGasGwHigh} GW
          </span>{" "}
          and DC batteries{" "}
          <span className="font-semibold">
            {HEADLINE.dcBatteryGwLow}–{HEADLINE.dcBatteryGwHigh} GW
          </span>{" "}
          enter as grid-response meters.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {MOMENTUM.map((m) => (
            <span
              key={m.id}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
            >
              {m.label}: <strong>{m.value}</strong>
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Panel
        </span>
        {(Object.keys(PANEL_LABELS) as Panel[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPanel(p)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              panel === p
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {PANEL_LABELS[p]}
          </button>
        ))}
      </div>

      {panel === "yoy" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="2025 YoY electricity growth"
            subtitle="All data centres +17% vs AI-focused +50% (IEA Key Questions)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yoyBars} layout="vertical" margin={{ left: 16, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" unit="%" tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={140}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="yoyPct" name="YoY %" radius={[0, 4, 4, 0]}>
                    {yoyBars.map((d) => (
                      <Cell key={d.label} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Scenario stance shift"
            subtitle="Near-term aggressive upside down; AI composition and post-2030 upside up"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scenarioBars} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="horizon" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[-3, 4]} />
                  <Tooltip />
                  <ReferenceLine y={0} stroke="#94a3b8" />
                  <Bar dataKey="score" name="Stance score" radius={[4, 4, 0, 0]}>
                    {scenarioBars.map((d) => (
                      <Cell key={d.full} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-slate-600">
              {SCENARIO_SHIFT.map((s) => (
                <li key={s.horizon}>
                  <strong>{s.horizon}:</strong> {s.priorStance} → {s.newStance} (
                  {s.deltaLabel})
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      {panel === "demand" && (
        <ChartCard
          title="Prior → new demand path (dumbbell)"
          subtitle="Research Base Case vs Key Questions central (TWh)"
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dumbbell} layout="vertical" margin={{ left: 8, right: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} unit=" TWh" />
                <YAxis type="category" dataKey="year" width={48} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="prior" name="Prior Base" fill="#94a3b8" barSize={10} />
                <Bar dataKey="neu" name="New central" fill="#22d3ee" barSize={10} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            2030 delta is only +{HEADLINE.base2030DeltaTwh} TWh; 2035 new central is
            estimated higher to reflect the report&apos;s post-2030 upside language
            (not a restated Base Case endpoint). Mid-path 2027 is interpolated.
          </p>
        </ChartCard>
      )}

      {panel === "bottlenecks" && (
        <ChartCard
          title="New grid-response meters (Δ vs research narrative)"
          subtitle="Onsite gas, DC batteries, and turbine-order surge enter the ledger"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bottleneckBars} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="metric"
                  width={180}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip />
                <Bar dataKey="delta" name="Δ (new − prior)" radius={[0, 4, 4, 0]}>
                  {bottleneckBars.map((d) => (
                    <Cell key={d.metric} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-xs text-slate-700">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-3 font-semibold">Metric</th>
                  <th className="py-2 pr-3 font-semibold">Prior</th>
                  <th className="py-2 pr-3 font-semibold">New</th>
                  <th className="py-2 font-semibold">Δ</th>
                </tr>
              </thead>
              <tbody>
                {BOTTLENECK_ROWS.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100">
                    <td className="py-2 pr-3">{r.metric}</td>
                    <td className="py-2 pr-3">{r.prior}</td>
                    <td className="py-2 pr-3">{r.neu}</td>
                    <td className="py-2">{r.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}

      {panel === "density" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Path metric
            </span>
            {(
              [
                ["density", "AI server density index"],
                ["emissions", "DC generation CO₂"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setPathMetric(id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  pathMetric === id
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <ChartCard
            title={
              pathMetric === "density"
                ? "AI server power-density index"
                : "Emissions path — prior peak vs new 2035 print"
            }
            subtitle={
              pathMetric === "density"
                ? `11× from 2020→2025; further ~4× by 2027 (~${HEADLINE.rackHouseholds2027} households per rack peak)`
                : `Prior CO₂ peak ~${HEADLINE.priorCo2PeakMt} Mt (2030) → new ~${HEADLINE.emissions2035Mt} Mt by 2035`
            }
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={densityEmissions} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  {pathMetric === "density" ? (
                    <Line
                      type="monotone"
                      dataKey="densityIndex"
                      name="Density index"
                      stroke="#6366f1"
                      strokeWidth={2}
                      connectNulls
                      dot={{ r: 4 }}
                    />
                  ) : (
                    <>
                      <Line
                        type="monotone"
                        dataKey="priorMt"
                        name="Prior path (Mt)"
                        stroke="#94a3b8"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="newMt"
                        name="New path (Mt)"
                        stroke="#f97316"
                        strokeWidth={2}
                        connectNulls
                      />
                    </>
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "pace" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Cluster
            </span>
            {(
              [
                ["all", "All"],
                ["campus", "Campus"],
                ["wires", "Wires"],
                ["fuel", "Fuel / flex"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setPaceFilter(id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  paceFilter === id
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <ChartCard
            title="Pace mismatch scatter"
            subtitle="Campus clocks (~2–3 yr) vs interconnection / fuel clocks (years)"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="campusYears"
                    name="Campus / project years"
                    unit=" yr"
                    tick={{ fontSize: 11 }}
                    domain={[0, 10]}
                  />
                  <YAxis
                    type="number"
                    dataKey="interconnectYears"
                    name="Grid / fuel years"
                    unit=" yr"
                    tick={{ fontSize: 11 }}
                    domain={[0, 10]}
                  />
                  <ZAxis range={[80, 200]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <ReferenceLine
                    segment={[
                      { x: 0, y: 0 },
                      { x: 10, y: 10 },
                    ]}
                    stroke="#cbd5e1"
                    strokeDasharray="4 4"
                  />
                  {(["campus", "wires", "fuel"] as const).map((cluster) => {
                    const pts = pacePoints.filter((p) => p.cluster === cluster);
                    if (!pts.length) return null;
                    return (
                      <Scatter
                        key={cluster}
                        name={cluster}
                        data={pts}
                        fill={CLUSTER_COLORS[cluster]}
                      />
                    );
                  })}
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Points above the diagonal take longer on the grid/fuel axis than the
              campus build clock — the binding constraint the research post named,
              restated with Key Questions onsite-gas and battery workarounds.
            </p>
          </ChartCard>
        </div>
      )}

      {panel === "gartner" && (
        <ChartCard
          title="Companion capacity path (Gartner 1Q26)"
          subtitle="GW interconnection constraint vs TWh energy bill — AI servers surpass conventional ~2027"
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={gartnerSeries} margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="gw"
                  tick={{ fontSize: 12 }}
                  label={{ value: "GW", angle: -90, position: "insideLeft", fontSize: 11 }}
                />
                <YAxis
                  yAxisId="twh"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  label={{ value: "TWh", angle: 90, position: "insideRight", fontSize: 11 }}
                />
                <Tooltip />
                <Bar
                  yAxisId="gw"
                  dataKey="capacityGw"
                  name="Capacity GW"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="twh"
                  type="monotone"
                  dataKey="electricityTwh"
                  name="Electricity TWh"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  connectNulls
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {HEADLINE.gartnerGw2025} → {HEADLINE.gartnerGw2026} → ~
            {HEADLINE.gartnerGw2027} → {HEADLINE.gartnerGw2030} GW; electricity{" "}
            {HEADLINE.gartnerTwh2026} TWh (2026) → {HEADLINE.gartnerTwh2027} TWh
            (2027). AI-optimised servers take {HEADLINE.aiServerShare2026Pct}% of
            DC power in 2026 and are on track to surpass conventional in 2027.
            Separate meter from IEA TWh — do not average.
          </p>
        </ChartCard>
      )}

      <p className="text-xs text-slate-500">
        Path points:{" "}
        {DEMAND_PATH.map((d) => `${d.year} (${d.confidence})`).join(" · ")}. Delay
        risk remains ~{HEADLINE.delayRiskPct}%; US queue generation{" "}
        {HEADLINE.usQueueGenGw2025.toLocaleString("en-US")} GW; median IR→COD &gt;
        {HEADLINE.queueMedianYears} years.
      </p>
    </div>
  );
}
