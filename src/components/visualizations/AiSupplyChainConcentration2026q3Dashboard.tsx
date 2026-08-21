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
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  CONCENTRATION_CURVE,
  COWOS_RESERVATION,
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
  STAGE_COLORS,
  TOP_K_LADDER,
  fmtDeltaPp,
  fmtHhi,
  fmtPct,
  type StackLayer,
} from "@/data/ai-supply-chain-concentration-2026q3-data";

// viz-types: vintage Δ dumbbells, Lorenz area+line, layer top-1/top-3 bars, HBM donut+prior slope, segment YoY bars, share×tightness scatter, regional bars + CoWoS composed | layout: default

type ViewId = "deltas" | "ladder" | "midstream" | "regions";
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

export function AiSupplyChainConcentration2026q3Dashboard() {
  const [view, setView] = useState<ViewId>("deltas");
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

  const xDomain =
    metric === "hhi" ? ([0, 10500] as [number, number]) : ([0, 105] as [number, number]);

  return (
    <div
      className="space-y-6"
      data-viz="ai-supply-chain-concentration-2026q3"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
          Vintage delta — mid-window concentration → Q3 / Mid-Year refresh
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
          Median top-1 eases{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.medianTop1PriorPct)} → {fmtPct(HEADLINE.medianTop1Pct)}
          </span>
          ; layers with top-1 ≥70% fall{" "}
          <span className="font-semibold text-amber-300">
            {HEADLINE.layersTop1Ge70Prior} → {HEADLINE.layersTop1Ge70}
          </span>
          . HBM tip firms to{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.hbmTop1Pct)} ({HEADLINE.hbmLabel})
          </span>
          ; CoWoS supply tip slips to{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.cowosTop1Pct)}
          </span>{" "}
          while NVIDIA buyer share stays{" "}
          <span className="font-semibold text-amber-300">
            {fmtPct(HEADLINE.cowosBuyerTop1Pct)}
          </span>{" "}
          at {HEADLINE.cowosCapacityWpm.toLocaleString("en-US")} wpm.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "deltas", label: "Vintage Δ" },
            { id: "ladder", label: "Layer ladder" },
            { id: "midstream", label: "Midstream / tools" },
            { id: "regions", label: "Regions / CoWoS" },
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
          </>
        )}
        {view === "deltas" && (
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <input
              type="checkbox"
              checked={showMoversOnly}
              onChange={(e) => setShowMoversOnly(e.target.checked)}
              className="rounded border-slate-300"
            />
            Movers only
          </label>
        )}
        {view === "midstream" && (
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

      {view === "deltas" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Top-1 share Δ — mid-window → Q3"
            subtitle="Dumbbells: prior (slate) → Q3 (color). Flat layers = structural ceiling."
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
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={72}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as (typeof LAYER_DELTAS)[number];
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                          <p className="font-semibold text-slate-900">{row.short}</p>
                          <p>
                            Prior {fmtPct(row.top1PriorPct)} → Q3 {fmtPct(row.top1Pct)} (
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
                    name="Prior top-1"
                    fill="#94a3b8"
                    opacity={0.45}
                    barSize={10}
                  />
                  <Bar
                    dataKey="top1Pct"
                    name="Q3 top-1"
                    fill="#0ea5e9"
                    barSize={10}
                  >
                    {deltaRows.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Stage average top-1 — prior vs Q3"
            subtitle="Midstream stays the concentrated manufacturing block; downstream tip eases 1 pp"
          >
            <div className="h-[400px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...STAGE_AVG]}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Bar
                    dataKey="top1AvgPriorPct"
                    name="Prior avg top-1"
                    fill="#94a3b8"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={36}
                  />
                  <Bar
                    dataKey="top1AvgPct"
                    name="Q3 avg top-1"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Stack HHI {fmtHhi(HEADLINE.stackHhiPrior)} → {fmtHhi(HEADLINE.stackHhi)} — slight
              deconcentration at the tip, not a regime change.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "ladder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Stack concentration ladder (Q3)"
            subtitle={
              metric === "hhi"
                ? "Approximate HHI from disclosed buckets + residual"
                : metric === "top3CumPct"
                  ? "Cumulative top-3 vendor share by layer"
                  : "Top-1 vendor share by chip-stack layer"
            }
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ladderBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={xDomain} tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={72}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const sorted = sortTooltipPayload(payload);
                      const row = sorted[0]?.payload as StackLayer & { value: number };
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                          <p className="font-semibold text-slate-900">{row.layer}</p>
                          <p className="text-slate-600">
                            Top-1: {row.top1Label} · {fmtPct(row.top1Pct)} (was{" "}
                            {fmtPct(row.top1PriorPct)})
                          </p>
                          <p className="text-slate-600">
                            Top-3 cum: {fmtPct(row.top3CumPct)} · HHI {fmtHhi(row.hhi)}
                          </p>
                          <p className="text-slate-500">{row.note}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={28}>
                    {ladderBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Top-k share path + Lorenz mass"
            subtitle="Saturation speed top-1 → top-3, then cumulative top-1 mass across layers"
          >
            <div className="h-[220px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={topKSeries}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 105]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Line type="monotone" dataKey="EUV" stroke="#ef4444" strokeWidth={2} dot />
                  <Line
                    type="monotone"
                    dataKey="Foundry LE"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot
                  />
                  <Line type="monotone" dataKey="AI GPU" stroke="#22c55e" strokeWidth={2} dot />
                  <Line type="monotone" dataKey="CoWoS" stroke="#f59e0b" strokeWidth={2} dot />
                  <Line type="monotone" dataKey="HBM" stroke="#a855f7" strokeWidth={2} dot />
                  <Line type="monotone" dataKey="WFE" stroke="#14b8a6" strokeWidth={2} dot />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 h-[160px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={CONCENTRATION_CURVE}
                  margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="rankShare"
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 10 }}
                    unit="%"
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="actualTop1Mass"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.2}
                    name="Top-1 mass"
                  />
                  {showEqual && (
                    <Line
                      type="monotone"
                      dataKey="equalPct"
                      stroke="#94a3b8"
                      strokeDasharray="4 4"
                      dot={false}
                      name="Equal guide"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "midstream" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="HBM shares — Q3 vs prior + foundry tip"
            subtitle="Three-player HBM set with a firmer SK Hynix tip; foundry advanced vs overall"
          >
            <div className="grid h-[200px] grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="min-h-[180px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={HBM_SHARES}
                      dataKey="sharePct"
                      nameKey="vendor"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={78}
                      paddingAngle={2}
                    >
                      {HBM_SHARES.map((s) => (
                        <Cell key={s.vendor} fill={s.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="min-h-[180px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={HBM_SHARES}
                    margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="vendor" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 105]} tick={{ fontSize: 10 }} unit="%" />
                    <Tooltip />
                    <Bar dataKey="priorPct" name="Prior" fill="#cbd5e1" maxBarSize={28} />
                    <Bar dataKey="sharePct" name="Q3" fill="#a855f7" maxBarSize={28} />
                    <Line
                      type="monotone"
                      dataKey="cumulativePct"
                      name="Cumulative"
                      stroke="#0f172a"
                      strokeWidth={2}
                      dot
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4 h-[180px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={FOUNDRY_SHARES}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Bar
                    dataKey="advancedSharePct"
                    name="Advanced <7 nm"
                    fill="#0ea5e9"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                  <Bar
                    dataKey="overallSharePct"
                    name="Overall foundry"
                    fill="#94a3b8"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Mid-Year equipment segments — growth vs level"
            subtitle="Assembly & packaging tools +9.6% YoY while test +31% — growth concentration explains sticky CoWoS gap"
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...EQUIPMENT_SEGMENTS]}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={
                      segmentMetric === "yoyPct" ? [0, 40] : [0, 160]
                    }
                    tick={{ fontSize: 11 }}
                    unit={segmentMetric === "yoyPct" ? "%" : undefined}
                  />
                  <Tooltip />
                  <Bar
                    dataKey={segmentMetric}
                    name={segmentMetric === "yoyPct" ? "YoY %" : "Level $B"}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={48}
                  >
                    {EQUIPMENT_SEGMENTS.map((s) => (
                      <Cell key={s.short} fill={s.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 h-[200px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="top1Pct"
                    name="Top-1 %"
                    domain={[0, 105]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Q3 top-1 %",
                      position: "insideBottom",
                      offset: -4,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="tightness"
                    name="Tightness"
                    domain={[0, 11]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Tightness",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="hhi" range={[60, 360]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as (typeof SHARE_TIGHTNESS)[number];
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                          <p className="font-semibold text-slate-900">{row.short}</p>
                          <p>
                            Top-1 {fmtPct(row.top1Pct)} ({fmtDeltaPp(row.deltaPp)}) · Tightness{" "}
                            {row.tightness}/10
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={SHARE_TIGHTNESS} name="Layers">
                    {SHARE_TIGHTNESS.map((p) => (
                      <Cell key={p.id} fill={p.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-1 text-center text-[11px] text-slate-500">
              Share × tightness scatter (bubble ∝ HHI) — CoWoS still upper-right
            </p>
          </ChartCard>
        </div>
      )}

      {view === "regions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Equipment billings geography (2025)"
            subtitle={`Asia-3 (CN+TW+KR) = ${fmtPct(REGION_HEADLINE.asia3Pct, 1)} of $${REGION_HEADLINE.totalBn2025}B SEMI WWSEMS`}
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={EQUIPMENT_REGIONS}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 40]} tick={{ fontSize: 11 }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="region"
                    width={80}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => {
                      const row = item?.payload as (typeof EQUIPMENT_REGIONS)[number];
                      return [`${fmtPct(Number(v), 1)} ($${row.billingsBn}B)`, "Share"];
                    }}
                  />
                  <Bar dataKey="share2025Pct" radius={[0, 4, 4, 0]} maxBarSize={26}>
                    {EQUIPMENT_REGIONS.map((r) => (
                      <Cell key={r.region} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="CoWoS path — capacity, buyer share, supply tip"
            subtitle="Capacity ↑ to 140k wpm; NVIDIA reserve sticky ~55%; TSMC supply tip eases to ~76%"
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={[...COWOS_RESERVATION]}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="vintage" tick={{ fontSize: 10 }} />
                  <YAxis
                    yAxisId="left"
                    domain={[100000, 150000]}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 90]}
                    tick={{ fontSize: 10 }}
                    unit="%"
                  />
                  <Tooltip />
                  <Bar
                    yAxisId="left"
                    dataKey="capacityWpm"
                    name="Capacity (wpm)"
                    fill="#0ea5e9"
                    opacity={0.85}
                    maxBarSize={44}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="nvidiaSharePct"
                    name="NVIDIA reserve %"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="tsmcSupplyPct"
                    name="TSMC supply %"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="gapPct"
                    name="Supply gap %"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot
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
