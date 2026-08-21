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
  BACKEND_VS_GAP,
  BOTTLENECK_DELTA,
  HEADLINE,
  PACE_LADDER,
  SEGMENT_PATH,
  SOURCE_NOTE,
  STACK_FLOW,
  bottleneckScatter,
  fmtBn,
  fmtPct,
  installRegions,
  segmentBars,
  tightnessDelta,
  yoyRankBars,
  type RegionName,
  type SegmentId,
} from "@/data/ai-supply-chain-update-202608-data";

// viz-types: YoY rank bars, backend $ vs CoWoS gap composed, tightness Δ + dual-vintage scatter, pace ladder + regional composed | layout: default
// viz-plan: Mid-Year test +31% vs packaging +9.6%; gap still ~20%; Q1 pace vs FY path; bottleneck re-score

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

type PanelMode = "backend" | "segments" | "bottlenecks" | "pace";
type ScatterVintage = "q3" | "aug" | "both";

const ALL_SEGMENTS = SEGMENT_PATH.map((s) => s.id);
const ALL_REGIONS = AI_INSTALL_REGIONS.map((r) => r.region);

export function AiSupplyChainUpdate202608Dashboard() {
  const [panel, setPanel] = useState<PanelMode>("backend");
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
  const yoyRank = useMemo(() => yoyRankBars(activeSegments), [activeSegments]);
  const scatter = useMemo(() => bottleneckScatter(scatterVintage), [scatterVintage]);
  const tightnessBars = useMemo(
    () =>
      BOTTLENECK_DELTA.map((b) => ({
        label: b.label,
        delta: tightnessDelta(b),
        q3: b.q3Tightness,
        aug: b.augTightness,
        fill: b.color,
      })).sort((a, b) => a.delta - b.delta),
    [],
  );
  const regions = useMemo(() => installRegions(activeRegions), [activeRegions]);
  const backendGap = useMemo(
    () =>
      BACKEND_VS_GAP.map((r) => ({
        ...r,
        periodShort: r.period,
      })),
    [],
  );

  return (
    <div className="space-y-6" data-viz="ai-supply-chain-update-202608">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — Q3 CoWoS tracker → Aug Mid-Year back-end cut
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Test tools {fmtPct(HEADLINE.testYoyPct)} vs packaging tools{" "}
          {fmtPct(HEADLINE.packagingYoyPct, 1)} — CoWoS gap still ~
          {HEADLINE.cowosGapQ3Pct}%
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Official SEMI Mid-Year puts test equipment at {fmtBn(HEADLINE.test2026)} (
          {fmtPct(HEADLINE.testYoyPct)}) while assembly &amp; packaging only reaches{" "}
          {fmtBn(HEADLINE.packaging2026)} ({fmtPct(HEADLINE.packagingYoyPct, 1)}). That{" "}
          {HEADLINE.backendAsymmetryPts.toFixed(0)}-point YoY gap sits under a still-binding CoWoS
          shortage (~{HEADLINE.cowosGapQ3Pct}%, NVIDIA &gt;{HEADLINE.nvidiaSharePct}%). Total path{" "}
          {fmtBn(HEADLINE.fy2026Forecast)} ({fmtPct(HEADLINE.fy2026YoyPct, 1)}); Q1 billings{" "}
          {fmtBn(HEADLINE.q1_2026, 2)} remain the pace check.
        </p>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Panel
            </span>
            {(
              [
                ["backend", "Back-end vs gap"],
                ["segments", "Equipment $"],
                ["bottlenecks", "Bottlenecks"],
                ["pace", "Pace / regions"],
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
                  {s.label.replace(" equipment", "").replace("Assembly & ", "A&")}
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
                  ["q3", "Q3"],
                  ["aug", "Aug"],
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

          {panel === "pace" && (
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

      {panel === "backend" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Back-end tool $ vs CoWoS gap"
            subtitle="Official Mid-Year test / packaging dollars sit under a gap that still reprints ~20%"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={backendGap} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="periodShort" tick={{ fontSize: 11 }} interval={0} />
                  <YAxis
                    yAxisId="bn"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
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
                      if (String(name).includes("Gap") || name === "cowosGapPct")
                        return [`${n}%`, "CoWoS gap"];
                      return [fmtBn(n), String(name)];
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="bn"
                    type="monotone"
                    dataKey="testBn"
                    name="Test $B"
                    fill="#ffedd5"
                    stroke="#f97316"
                    strokeWidth={2}
                  />
                  <Bar
                    yAxisId="bn"
                    dataKey="packagingBn"
                    name="Packaging $B"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="gap"
                    type="monotone"
                    dataKey="cowosGapPct"
                    name="CoWoS gap %"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Upstream dollars → downstream gate"
            subtitle="Test eases on tool $; packaging tools lag; CoWoS / NVIDIA still gate ships"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...STACK_FLOW]} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="stage" tick={{ fontSize: 10 }} interval={0} angle={-12} textAnchor="end" height={56} />
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
        </div>
      )}

      {panel === "segments" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Equipment dollars — 2025 actual → 2026 Mid-Year"
            subtitle="Toggle segments; DRAM and test lead the level jump"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={segments} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                    height={70}
                  />
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
            title="2026 YoY growth ranking"
            subtitle="Packaging +9.6% is the slowest major segment — the asymmetry under CoWoS rationing"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={yoyRank}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="label" width={140} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [fmtPct(Number(v), 1), "YoY"]} />
                  <ReferenceLine x={0} stroke="#94a3b8" />
                  <Bar dataKey="yoyPct" name="YoY %" radius={[0, 4, 4, 0]}>
                    {yoyRank.map((s) => (
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
            title="Tightness score Δ (Q3 → Aug Mid-Year cut)"
            subtitle="Test eases on tool dollars; packaging-equipment layer tightens on slow YoY"
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
                  <YAxis type="category" dataKey="label" width={140} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value, _n, item) => {
                      const n = Number(value ?? 0);
                      const row = item?.payload as { q3?: number; aug?: number };
                      return [
                        `${n > 0 ? "+" : ""}${n} (Q3 ${row?.q3} → Aug ${row?.aug})`,
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
            subtitle="Bubble size ≈ supplier concentration; toggle Q3 vs Aug vintage"
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
                        fillOpacity={p.vintage === "aug" ? 0.95 : 0.45}
                        stroke={p.color}
                        strokeWidth={p.vintage === "aug" ? 2 : 1}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "pace" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Pace ladder — Q1 stamp → FY Mid-Year"
            subtitle="2×Q1 is an editorial H1 run-rate, not an official Q2 WWSEMS print"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={[...PACE_LADDER]} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="stage" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis
                    yAxisId="bn"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <YAxis
                    yAxisId="pct"
                    orientation="right"
                    domain={[0, 110]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(value, name, item) => {
                      const row = item?.payload as { note?: string };
                      if (String(name).includes("share") || name === "sharePct")
                        return [`${Number(value).toFixed(1)}% of FY`, row?.note ?? "Share"];
                      return [fmtBn(Number(value), 2), row?.note ?? "Billings"];
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="bn" dataKey="value" name="USD bn" radius={[4, 4, 0, 0]}>
                    {PACE_LADDER.map((s) => (
                      <Cell key={s.stage} fill={s.color} />
                    ))}
                  </Bar>
                  <Line
                    yAxisId="pct"
                    type="monotone"
                    dataKey="sharePct"
                    name="% of Mid-Year FY"
                    stroke="#0f172a"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
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
                  <Bar yAxisId="bn" dataKey="q1_2026" name="Q1 2026 $B" radius={[4, 4, 0, 0]}>
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
        Sources: SEMI Mid-Year OEM Forecast (July 14, 2026); SEMI WWSEMS Q1 2026 billings; prior Q3
        CoWoS tracker for gap / NVIDIA meters. See post footnotes for links.
      </p>
    </div>
  );
}
