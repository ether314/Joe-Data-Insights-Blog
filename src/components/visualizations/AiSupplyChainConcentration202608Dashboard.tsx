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
  BACKEND_ASYMMETRY,
  CONCENTRATION_CURVE,
  COWOS_DUAL_TIP,
  EQUIPMENT_REGIONS,
  EQUIPMENT_SEGMENTS,
  FOUNDRY_SHARES,
  HBM_SHARES,
  HEADLINE,
  LAYER_DELTAS,
  REGION_HEADLINE,
  SHARE_TIGHTNESS,
  SOURCE_NOTE,
  STACK_LAYERS,
  STAGE_AVG,
  TOP_K_LADDER,
  fmtDeltaPp,
  fmtHhi,
  fmtPct,
  type StackLayer,
} from "@/data/ai-supply-chain-concentration-202608-data";

// viz-types: dual-tip composed (bars+lines), Lorenz area+line, layer top-1/top-3 bars, HBM donut, segment YoY bars, asymmetry bars, share×tightness scatter, regional bars | layout: default

type ViewId = "dual" | "ladder" | "growth" | "geo";
type LadderMetric = "top1Pct" | "top3CumPct" | "hhi";
type StageFilter = "all" | "upstream" | "midstream" | "downstream";
type SegmentMetric = "yoyPct" | "levelBn";

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
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              value === o.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function metricValue(layer: StackLayer, metric: LadderMetric): number {
  if (metric === "top1Pct") return layer.top1Pct;
  if (metric === "top3CumPct") return layer.top3CumPct;
  return layer.hhi;
}

export function AiSupplyChainConcentration202608Dashboard() {
  const [view, setView] = useState<ViewId>("dual");
  const [metric, setMetric] = useState<LadderMetric>("top1Pct");
  const [stage, setStage] = useState<StageFilter>("all");
  const [showEqual, setShowEqual] = useState(true);
  const [segmentMetric, setSegmentMetric] = useState<SegmentMetric>("yoyPct");
  const [showMoversOnly, setShowMoversOnly] = useState(false);

  const filteredLayers = useMemo(() => {
    const rows =
      stage === "all" ? STACK_LAYERS : STACK_LAYERS.filter((l) => l.stage === stage);
    return [...rows].sort((a, b) => metricValue(b, metric) - metricValue(a, metric));
  }, [metric, stage]);

  const ladderBars = useMemo(
    () =>
      filteredLayers.map((l) => ({
        ...l,
        value: metricValue(l, metric),
      })),
    [filteredLayers, metric],
  );

  const deltaRows = useMemo(() => {
    const rows = showMoversOnly
      ? LAYER_DELTAS.filter((d) => d.deltaPp !== 0)
      : [...LAYER_DELTAS];
    return rows.sort((a, b) => Math.abs(b.deltaPp) - Math.abs(a.deltaPp));
  }, [showMoversOnly]);

  const topKSeries = useMemo(() => {
    return TOP_K_LADDER.map((row) => ({
      label: row.label,
      EUV: row.euv,
      "Foundry LE": row.foundry,
      "AI GPU": row.gpu,
      CoWoS: row.cowos,
      HBM: row.hbm,
      WFE: row.wfe,
    }));
  }, []);

  const dualPath = useMemo(
    () =>
      COWOS_DUAL_TIP.map((r) => ({
        ...r,
        capacityKwpm: Math.round(r.capacityWpm / 1000),
      })),
    [],
  );

  const segmentBars = useMemo(
    () =>
      EQUIPMENT_SEGMENTS.map((s) => ({
        ...s,
        value: segmentMetric === "yoyPct" ? s.yoyPct : s.levelBn,
      })),
    [segmentMetric],
  );

  const xDomain =
    metric === "hhi" ? ([0, 10500] as [number, number]) : ([0, 105] as [number, number]);

  return (
    <div
      className="space-y-6"
      data-viz="ai-supply-chain-concentration-202608"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
          Semiconductor supply chain — August 202608 Mid-Year concentration lens
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
          Median top-1 eases{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.medianTop1PriorPct)} → {fmtPct(HEADLINE.medianTop1Pct, 1)}
          </span>
          . CoWoS dual tip: supply{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.cowosTop1Pct)}
          </span>{" "}
          / buyer{" "}
          <span className="font-semibold text-amber-300">
            {fmtPct(HEADLINE.cowosBuyerTop1Pct)}
          </span>
          . Back-end growth gap stays{" "}
          <span className="font-semibold text-white">
            {HEADLINE.backendAsymmetryPts} pts
          </span>{" "}
          (test +{HEADLINE.testEquipYoyPct}% vs A&amp;P +{HEADLINE.assemblyEquipYoyPct}%).
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "dual", label: "Dual tip" },
            { id: "ladder", label: "Layer ladder" },
            { id: "growth", label: "Growth conc." },
            { id: "geo", label: "Geo / gates" },
          ]}
        />
        {view === "ladder" && (
          <>
            <ToggleGroup
              label="Metric"
              value={metric}
              onChange={setMetric}
              options={[
                { id: "top1Pct", label: "Top-1 %" },
                { id: "top3CumPct", label: "Top-3 %" },
                { id: "hhi", label: "HHI" },
              ]}
            />
            <ToggleGroup
              label="Stage"
              value={stage}
              onChange={setStage}
              options={[
                { id: "all", label: "All" },
                { id: "upstream", label: "Upstream" },
                { id: "midstream", label: "Mid" },
                { id: "downstream", label: "Down" },
              ]}
            />
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={showEqual}
                onChange={(e) => setShowEqual(e.target.checked)}
                className="rounded border-slate-300"
              />
              Equal-share guide
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={showMoversOnly}
                onChange={(e) => setShowMoversOnly(e.target.checked)}
                className="rounded border-slate-300"
              />
              Movers only (Δ panel)
            </label>
          </>
        )}
        {view === "growth" && (
          <ToggleGroup
            label="Segment"
            value={segmentMetric}
            onChange={setSegmentMetric}
            options={[
              { id: "yoyPct", label: "YoY %" },
              { id: "levelBn", label: "Level $B" },
            ]}
          />
        )}
      </div>

      {view === "dual" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="CoWoS dual tip across vintages"
            subtitle="Capacity (k wpm bars) vs TSMC supply tip and NVIDIA buyer tip — dual concentration, not one share"
          >
            <div className="h-[400px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={dualPath}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="vintage" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="cap"
                    orientation="left"
                    tick={{ fontSize: 11 }}
                    domain={[100, 160]}
                    label={{
                      value: "k wpm",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 10, fill: "#64748b" },
                    }}
                  />
                  <YAxis
                    yAxisId="share"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    domain={[0, 100]}
                    unit="%"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as (typeof dualPath)[number];
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                          <p className="font-semibold text-slate-900">{row.vintage}</p>
                          <p>Capacity {row.capacityWpm.toLocaleString("en-US")} wpm</p>
                          <p>Supply tip {fmtPct(row.supplyTipPct)}</p>
                          <p>Buyer tip {fmtPct(row.buyerTipPct)}</p>
                          <p className="text-slate-500">Gap ~{fmtPct(row.gapPct)}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    yAxisId="cap"
                    dataKey="capacityKwpm"
                    name="Capacity (k wpm)"
                    fill="#94a3b8"
                    opacity={0.45}
                    barSize={28}
                  />
                  <Line
                    yAxisId="share"
                    type="monotone"
                    dataKey="supplyTipPct"
                    name="Supply tip %"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="share"
                    type="monotone"
                    dataKey="buyerTipPct"
                    name="Buyer tip %"
                    stroke="#22c55e"
                    strokeWidth={2.5}
                    strokeDasharray="4 3"
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Q3 → Aug Mid-Year top-1 Δ"
            subtitle="Dumbbells: Q3 (slate) → Aug (color). Flat = structural ceiling."
          >
            <div className="h-[400px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={deltaRows}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 105]} tick={{ fontSize: 11 }} unit="%" />
                  <YAxis type="category" dataKey="short" width={72} tick={{ fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as (typeof LAYER_DELTAS)[number];
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                          <p className="font-semibold text-slate-900">{row.short}</p>
                          <p>
                            Q3 {fmtPct(row.top1PriorPct)} → Aug {fmtPct(row.top1Pct)} (
                            {fmtDeltaPp(row.deltaPp)})
                          </p>
                          <p className="text-slate-500">
                            HHI {fmtHhi(row.hhiPrior)} → {fmtHhi(row.hhi)}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey="top1PriorPct"
                    name="Q3 top-1"
                    fill="#94a3b8"
                    opacity={0.45}
                    barSize={10}
                  />
                  <Bar dataKey="top1Pct" name="Aug top-1" fill="#0ea5e9" barSize={10}>
                    {deltaRows.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Stage average top-1 — Q3 vs Aug"
            subtitle="Midstream still the concentrated manufacturing block; downstream tip eases again"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...STAGE_AVG]}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Bar dataKey="top1AvgPriorPct" name="Q3 avg" fill="#94a3b8" barSize={22} />
                  <Bar dataKey="top1AvgPct" name="Aug avg" fill="#0ea5e9" barSize={22}>
                    {STAGE_AVG.map((s) => (
                      <Cell key={s.id} fill={s.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Share × tightness scatter"
            subtitle="Bubble size = HHI. CoWoS / EUV / foundry / GPU cluster upper-right."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="top1Pct"
                    name="Top-1 %"
                    domain={[0, 105]}
                    tick={{ fontSize: 11 }}
                    unit="%"
                  />
                  <YAxis
                    type="number"
                    dataKey="tightness"
                    name="Tightness"
                    domain={[0, 11]}
                    tick={{ fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="hhi" range={[60, 400]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as (typeof SHARE_TIGHTNESS)[number];
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                          <p className="font-semibold text-slate-900">{row.short}</p>
                          <p>
                            Top-1 {fmtPct(row.top1Pct)} · tightness {row.tightness}
                          </p>
                          <p className="text-slate-500">HHI {fmtHhi(row.hhi)}</p>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={SHARE_TIGHTNESS} fill="#0ea5e9">
                    {SHARE_TIGHTNESS.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "ladder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Layer concentration ladder"
            subtitle="Rank by top-1, top-3, or HHI — filter by stack stage"
          >
            <div className="h-[400px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ladderBars}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={xDomain} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="short" width={72} tick={{ fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as StackLayer & { value: number };
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                          <p className="font-semibold text-slate-900">{row.layer}</p>
                          <p>
                            {row.top1Label} {fmtPct(row.top1Pct)} · top-3{" "}
                            {fmtPct(row.top3CumPct)}
                          </p>
                          <p className="text-slate-500">HHI {fmtHhi(row.hhi)}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="value" name="Metric" barSize={14}>
                    {ladderBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Top-k saturation path"
            subtitle="How fast each layer saturates from top-1 → top-3"
          >
            <div className="h-[400px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={topKSeries}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 105]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Line type="monotone" dataKey="EUV" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="Foundry LE" stroke="#0ea5e9" strokeWidth={2} />
                  <Line type="monotone" dataKey="AI GPU" stroke="#22c55e" strokeWidth={2} />
                  <Line type="monotone" dataKey="CoWoS" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="HBM" stroke="#a855f7" strokeWidth={2} />
                  <Line type="monotone" dataKey="WFE" stroke="#14b8a6" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Cumulative top-1 mass vs equal share"
            subtitle="Lorenz-style: first layers carry most single-vendor risk mass"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={CONCENTRATION_CURVE}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="rankShare"
                    tick={{ fontSize: 11 }}
                    unit="%"
                    type="number"
                    domain={[0, 100]}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  {showEqual && (
                    <Line
                      type="monotone"
                      dataKey="equalPct"
                      name="Equal share"
                      stroke="#94a3b8"
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  )}
                  <Area
                    type="monotone"
                    dataKey="actualTop1Mass"
                    name="Top-1 mass"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.25}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Q3 → Aug movers (top-1 Δ)"
            subtitle={showMoversOnly ? "Non-zero Δ only" : "All layers — most are flat ceilings"}
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={deltaRows}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[-3, 3]} tick={{ fontSize: 11 }} unit=" pp" />
                  <YAxis type="category" dataKey="short" width={72} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="deltaPp" name="Δ pp" barSize={12}>
                    {deltaRows.map((r) => (
                      <Cell
                        key={r.id}
                        fill={r.deltaPp < 0 ? "#22c55e" : r.deltaPp > 0 ? "#ef4444" : "#94a3b8"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "growth" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Mid-Year equipment segment concentration"
            subtitle="Toggle YoY % vs level $B — packaging tools lag while DRAM/test race"
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={segmentBars}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    unit={segmentMetric === "yoyPct" ? "%" : ""}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as (typeof segmentBars)[number];
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                          <p className="font-semibold text-slate-900">{row.segment}</p>
                          <p>
                            {row.levelBn}B · +{row.yoyPct}% YoY
                          </p>
                          <p className="text-slate-500">2028 path ~{row.y2028Bn}B</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="value" name="Metric" barSize={28}>
                    {segmentBars.map((s) => (
                      <Cell key={s.short} fill={s.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Back-end growth asymmetry"
            subtitle="Test +31% vs assembly & packaging +9.6% = 21.4 pt gap that keeps CoWoS binding"
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...BACKEND_ASYMMETRY]}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="step" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 35]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="valuePct" name="Value" barSize={36}>
                    {BACKEND_ASYMMETRY.map((s) => (
                      <Cell key={s.step} fill={s.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="HBM vendor shares"
            subtitle="Closed three-player set — top-3 = 100%; tip holds at 55% SK Hynix"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[...HBM_SHARES]}
                    dataKey="sharePct"
                    nameKey="vendor"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {HBM_SHARES.map((h) => (
                      <Cell key={h.vendor} fill={h.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [`${v}%`, "Share"]}
                    contentStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Foundry: advanced tip vs overall census"
            subtitle="TSMC ~90% advanced-node vs ~62% overall — tip vs breadth"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...FOUNDRY_SHARES]}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Bar
                    dataKey="advancedSharePct"
                    name="Advanced <7nm"
                    fill="#0ea5e9"
                    barSize={16}
                  />
                  <Bar
                    dataKey="overallSharePct"
                    name="Overall foundry"
                    fill="#94a3b8"
                    barSize={16}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "geo" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="2025 equipment billings by install region"
            subtitle={`${REGION_HEADLINE.top3Label} = ${fmtPct(REGION_HEADLINE.top3Pct, 1)} of WWSEMS dollars`}
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...EQUIPMENT_REGIONS]}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 40]} tick={{ fontSize: 11 }} unit="%" />
                  <YAxis type="category" dataKey="region" width={88} tick={{ fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as (typeof EQUIPMENT_REGIONS)[number];
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                          <p className="font-semibold text-slate-900">{row.region}</p>
                          <p>
                            {fmtPct(row.share2025Pct, 1)} · ${row.billingsBn}B
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="share2025Pct" name="Share %" barSize={14}>
                    {EQUIPMENT_REGIONS.map((r) => (
                      <Cell key={r.region} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="CoWoS dual tip close-up"
            subtitle="Aug Mid-Year: supply 75% / buyer 52% at 140k wpm — gap still ~20%"
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={dualPath}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="vintage" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="supplyTipPct"
                    name="Supply tip"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="buyerTipPct"
                    name="Buyer tip"
                    stroke="#22c55e"
                    strokeWidth={2.5}
                    strokeDasharray="4 3"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gapPct"
                    name="Gap %"
                    stroke="#64748b"
                    strokeWidth={2}
                    strokeDasharray="2 2"
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
