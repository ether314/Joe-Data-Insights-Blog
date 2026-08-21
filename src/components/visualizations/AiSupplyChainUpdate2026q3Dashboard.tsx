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
  AI_INSTALL_REGIONS,
  BOTTLENECK_DELTA,
  HEADLINE,
  RESERVATION_SPLIT,
  SEGMENT_PATH,
  SOURCE_NOTE,
  STACK_FLOW,
  bottleneckScatter,
  cowosPath,
  fmtBn,
  fmtPct,
  fmtWpm,
  installRegions,
  segmentBars,
  tightnessDelta,
  type RegionName,
  type SegmentId,
} from "@/data/ai-supply-chain-update-2026q3-data";

// viz-types: segment YoY bars, CoWoS capacity/demand composed, reservation share bars, tightness Δ + dual-vintage scatter, stack-flow bars | layout: default
// viz-plan: Mid-Year segment growth; gap re-widens on Q3 tracker; NVIDIA >50% lock; bottleneck re-tighten; upstream $ → downstream gate

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

type PanelMode = "segments" | "cowos" | "bottlenecks" | "stack";
type ScatterVintage = "prior" | "q3" | "both";

const ALL_SEGMENTS = SEGMENT_PATH.map((s) => s.id);
const ALL_REGIONS = AI_INSTALL_REGIONS.map((r) => r.region);

export function AiSupplyChainUpdate2026q3Dashboard() {
  const [panel, setPanel] = useState<PanelMode>("cowos");
  const [activeSegments, setActiveSegments] = useState<SegmentId[]>([...ALL_SEGMENTS]);
  const [scatterVintage, setScatterVintage] = useState<ScatterVintage>("both");
  const [activeRegions, setActiveRegions] = useState<RegionName[]>([...ALL_REGIONS]);

  const toggleSegment = (id: SegmentId) => {
    setActiveSegments((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== id);
      }
      return [...prev, id];
    });
  };

  const toggleRegion = (r: RegionName) => {
    setActiveRegions((prev) => {
      if (prev.includes(r)) {
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== r);
      }
      return [...prev, r];
    });
  };

  const segments = useMemo(() => segmentBars(activeSegments), [activeSegments]);
  const cowos = useMemo(() => cowosPath("all"), []);
  const scatter = useMemo(() => bottleneckScatter(scatterVintage), [scatterVintage]);
  const tightnessBars = useMemo(
    () =>
      BOTTLENECK_DELTA.map((b) => ({
        label: b.label,
        delta: tightnessDelta(b),
        prior: b.priorTightness,
        q3: b.q3Tightness,
        fill: b.color,
      })).sort((a, b) => a.delta - b.delta),
    [],
  );
  const regions = useMemo(() => installRegions(activeRegions), [activeRegions]);
  const reservation = useMemo(
    () =>
      RESERVATION_SPLIT.map((r) => ({
        ...r,
        wafersK: Math.round(r.wafers / 1000),
      })),
    [],
  );

  return (
    <div className="space-y-6" data-viz="ai-supply-chain-update-2026q3">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — Aug WWSEMS Q1 update → Q3 CoWoS tracker
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          CoWoS YE {fmtWpm(HEADLINE.cowosCapQ3Ye)} wpm — gap {HEADLINE.cowosGapPriorPct}% →{" "}
          {HEADLINE.cowosGapQ3Pct}%; NVIDIA locks &gt;{HEADLINE.nvidiaSharePct}%
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Capacity rises from the prior mid-print ({fmtWpm(HEADLINE.cowosCapPriorMid)}) to a Q3 YE
          tracker near {fmtWpm(HEADLINE.cowosCapQ3Ye)}, but demand re-acceleration reprints a ~{" "}
          {HEADLINE.cowosGapQ3Pct}% gap. Equipment path is still SEMI Mid-Year {fmtBn(HEADLINE.fy2026Forecast)}{" "}
          ({fmtPct(HEADLINE.fy2026YoyPct)}); DRAM tools {fmtPct(HEADLINE.dramYoyPct)} to{" "}
          {fmtBn(HEADLINE.dram2026)}. Q1 billings {fmtBn(HEADLINE.q1_2026, 2)} remain the pace check.
        </p>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Panel</span>
            {(
              [
                ["cowos", "CoWoS / lock"],
                ["segments", "Equipment $"],
                ["bottlenecks", "Bottlenecks"],
                ["stack", "Stack flow"],
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

          {panel === "segments" && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Segments
              </span>
              {SEGMENT_PATH.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSegment(s.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    activeSegments.includes(s.id)
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {s.label.replace(" equipment", "")}
                </button>
              ))}
            </div>
          )}

          {panel === "bottlenecks" && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Scatter
              </span>
              {(
                [
                  ["both", "Both"],
                  ["prior", "Prior"],
                  ["q3", "Q3"],
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

          {panel === "stack" && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Q1 regions
              </span>
              {AI_INSTALL_REGIONS.map((r) => (
                <button
                  key={r.region}
                  type="button"
                  onClick={() => toggleRegion(r.region)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    activeRegions.includes(r.region)
                      ? "text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  style={
                    activeRegions.includes(r.region) ? { backgroundColor: r.color } : undefined
                  }
                >
                  {r.region}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {panel === "cowos" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="CoWoS capacity vs demand — vintage revision"
            subtitle="Jul research → Aug mid-print (~10% gap) → Q3 tracker (~20% gap on higher demand)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={cowos} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="periodShort" tick={{ fontSize: 11 }} interval={0} />
                  <YAxis
                    yAxisId="wpm"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
                  />
                  <YAxis
                    yAxisId="gap"
                    orientation="right"
                    domain={[0, 30]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      const n = Number(value);
                      if (name === "Gap %" || name === "gapPct") return [`${n}%`, "Gap"];
                      return [`${fmtWpm(n)} wpm`, String(name)];
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="wpm"
                    type="monotone"
                    dataKey="demand"
                    name="Demand"
                    fill="#fef3c7"
                    stroke="#f59e0b"
                    strokeWidth={2}
                  />
                  <Bar
                    yAxisId="wpm"
                    dataKey="capacity"
                    name="Capacity"
                    fill="#0ea5e9"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="gap"
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

          <ChartCard
            title="2026 CoWoS reservation split"
            subtitle={`NVIDIA ${HEADLINE.nvidiaReservedLow / 1000}–${HEADLINE.nvidiaReservedHigh / 1000}k wafers; midpoint shown`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reservation}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={120}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value, _name, item) => {
                      const row = item?.payload as { sharePct?: number; note?: string };
                      return [
                        `${value}k wafers (${row?.sharePct ?? ""}%)`,
                        row?.note ?? "Wafers",
                      ];
                    }}
                  />
                  <Bar dataKey="wafersK" name="Annual wafers (k)" radius={[0, 4, 4, 0]}>
                    {reservation.map((r) => (
                      <Cell key={r.id} fill={r.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "segments" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Equipment dollars — 2025 actual → 2026 Mid-Year"
            subtitle="SEMI OEM perspective; DRAM leads YoY growth"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={segments} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}B`} />
                  <Tooltip formatter={(v) => [fmtBn(Number(v)), ""]} />
                  <Legend />
                  <Bar dataKey="y2025" name="2025" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="y2026" name="2026 Mid-Year" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="2026 YoY growth by segment"
            subtitle="DRAM equipment +39% is the AI memory signature inside the Mid-Year print"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...segments].sort((a, b) => b.yoyPct - a.yoyPct)}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="label" width={130} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [fmtPct(Number(v)), "YoY"]} />
                  <ReferenceLine x={0} stroke="#94a3b8" />
                  <Bar dataKey="yoyPct" name="YoY %" radius={[0, 4, 4, 0]}>
                    {segments.map((s) => (
                      <Cell key={s.id} fill={s.fill} />
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
            title="Tightness score Δ (Aug mid-print → Q3)"
            subtitle="Negative = easing; CoWoS and OSAT re-tighten on demand / outsourcing"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={tightnessBars}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[-2, 2]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="label" width={130} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value, _n, item) => {
                      const n = Number(value ?? 0);
                      const row = item?.payload as { prior?: number; q3?: number };
                      return [
                        `${n > 0 ? "+" : ""}${n} (prior ${row?.prior} → Q3 ${row?.q3})`,
                        "Δ tightness",
                      ];
                    }}
                  />
                  <ReferenceLine x={0} stroke="#64748b" />
                  <Bar dataKey="delta" name="Δ tightness" radius={[0, 4, 4, 0]}>
                    {tightnessBars.map((r) => (
                      <Cell
                        key={r.label}
                        fill={r.delta > 0 ? "#ef4444" : r.delta < 0 ? "#22c55e" : "#94a3b8"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Bottleneck scatter — tightness × lead time"
            subtitle="Bubble size ≈ supplier concentration; toggle prior vs Q3 vintage"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="leadWeeks"
                    name="Lead weeks"
                    tick={{ fontSize: 11 }}
                    label={{ value: "Lead weeks", position: "insideBottom", offset: -2, fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="tightness"
                    name="Tightness"
                    domain={[4, 11]}
                    tick={{ fontSize: 11 }}
                    label={{ value: "Tightness", angle: -90, position: "insideLeft", fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="concentrationPct" range={[60, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(value, name) => [value, String(name)]}
                    labelFormatter={(_, payload) => {
                      const p = payload?.[0]?.payload as { label?: string; vintage?: string };
                      return `${p?.label ?? ""} (${p?.vintage ?? ""})`;
                    }}
                  />
                  <Scatter data={scatter} name="Layers">
                    {scatter.map((p) => (
                      <Cell
                        key={p.id}
                        fill={p.color}
                        fillOpacity={p.vintage === "q3" ? 0.95 : 0.45}
                        stroke={p.color}
                        strokeWidth={p.vintage === "q3" ? 2 : 1}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "stack" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Upstream dollars → downstream gate"
            subtitle="Equipment boom funds the stack; CoWoS / HBM still pace GPU shipments"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...STACK_FLOW]}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(_v, _n, item) => {
                      const row = item?.payload as {
                        valueLabel?: string;
                        metric?: string;
                        status?: string;
                      };
                      return [`${row?.valueLabel} · ${row?.metric}`, row?.status ?? "Stage"];
                    }}
                  />
                  <Bar dataKey="value" name="Index" radius={[4, 4, 0, 0]}>
                    {STACK_FLOW.map((s) => (
                      <Cell key={s.stage} fill={s.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Q1 AI-install regional signature"
            subtitle="Taiwan + Korea still carry the AI tool print inside WWSEMS Q1"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={regions} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="bn"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <YAxis
                    yAxisId="pct"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="bn"
                    dataKey="q1_2026"
                    name="Q1 2026 $B"
                    radius={[4, 4, 0, 0]}
                  >
                    {regions.map((r) => (
                      <Cell key={r.region} fill={r.color} />
                    ))}
                  </Bar>
                  <Line
                    yAxisId="pct"
                    type="monotone"
                    dataKey="yoyPct"
                    name="YoY %"
                    stroke="#0f172a"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs text-slate-500">
        Sources:{" "}
        {SOURCE_NOTE.slice(0, 0)}
        SEMI Mid-Year OEM Forecast; SEMI WWSEMS Q1 2026; TrendForce Aug 2026 CoWoS notes; TSMC Aug
        2026 packaging disclosures. See post footnotes for links.
      </p>
    </div>
  );
}
