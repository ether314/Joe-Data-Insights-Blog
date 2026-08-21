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
  FOUNDRY_SHARES,
  HBM_SHARES,
  HEADLINE,
  REGION_HEADLINE,
  SHARE_TIGHTNESS,
  SOURCE_NOTE,
  STACK_LAYERS,
  STAGE_COLORS,
  TOP_K_LADDER,
  fmtHhi,
  fmtPct,
  type StackLayer,
} from "@/data/ai-supply-chain-concentration-2026-data";

// viz-types: concentration Lorenz area+line, layer top-1/top-3 bars, foundry dual bars, HBM donut, share×tightness scatter, regional bars + CoWoS composed | layout: default

type ViewId = "ladder" | "foundry" | "scatter" | "regions";
type LadderMetric = "top1Pct" | "top3CumPct" | "hhi";
type StageFilter = "all" | "upstream" | "midstream" | "downstream";

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

export function AiSupplyChainConcentrationDashboard() {
  const [view, setView] = useState<ViewId>("ladder");
  const [metric, setMetric] = useState<LadderMetric>("top1Pct");
  const [stage, setStage] = useState<StageFilter>("all");
  const [showEqual, setShowEqual] = useState(true);

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
      data-viz="ai-supply-chain-concentration-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-300">
          Semiconductor supply chain — concentration lens
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
          Top-1 clears{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.euvTop1Pct)} on EUV
          </span>
          ,{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.foundryLeadTop1Pct)} on leading-edge foundry
          </span>
          , and{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.gpuTop1Pct)} on AI GPUs
          </span>
          .{" "}
          <span className="font-semibold text-amber-300">
            {HEADLINE.layersTop1Ge70}/{HEADLINE.layersTracked}
          </span>{" "}
          tracked layers have top-1 ≥ 70%. Equipment geography still puts Asia-3 at{" "}
          <span className="font-semibold text-white">
            {fmtPct(REGION_HEADLINE.top3Pct, 1)}
          </span>{" "}
          of 2025 billings.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "ladder", label: "Layer ladder" },
            { id: "foundry", label: "Foundry / HBM" },
            { id: "scatter", label: "Share × tightness" },
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
          </>
        )}
        {view === "ladder" && (
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <input
              type="checkbox"
              checked={showEqual}
              onChange={(e) => setShowEqual(e.target.checked)}
              className="rounded border-slate-300"
            />
            Equal-share guide
          </label>
        )}
      </div>

      {view === "ladder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Stack concentration ladder"
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
                            Top-1: {row.top1Label} · {fmtPct(row.top1Pct)}
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
            title="Top-k share path across key layers"
            subtitle="How fast cumulative share saturates from top-1 → top-3"
          >
            <div className="h-[360px] w-full min-w-0">
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
            <p className="mt-1 text-center text-[11px] text-slate-500">
              Lorenz-style: cumulative top-1 mass vs equal layer shares
            </p>
          </ChartCard>
        </div>
      )}

      {view === "foundry" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Foundry: advanced-node vs overall share"
            subtitle="Leading-edge (<7 nm) concentration vs total foundry revenue"
          >
            <div className="h-[380px] w-full min-w-0">
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
                    maxBarSize={36}
                  />
                  <Bar
                    dataKey="overallSharePct"
                    name="Overall foundry"
                    fill="#94a3b8"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              TSMC ~{fmtPct(HEADLINE.foundryLeadTop1Pct)} of leading-edge vs ~62% overall —
              concentration sharpens at the AI-relevant node.
            </p>
          </ChartCard>

          <ChartCard
            title="HBM vendor donut + cumulative ladder"
            subtitle="Three-player market — top-1 SK Hynix, top-3 = 100%"
          >
            <div className="grid h-[380px] grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="min-h-[200px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={HBM_SHARES}
                      dataKey="sharePct"
                      nameKey="vendor"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
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
              <div className="min-h-[200px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={HBM_SHARES}
                    margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="vendor" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 105]} tick={{ fontSize: 10 }} unit="%" />
                    <Tooltip />
                    <Bar dataKey="sharePct" name="Share" fill="#a855f7" maxBarSize={40} />
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
          </ChartCard>
        </div>
      )}

      {view === "scatter" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Top-1 share × bottleneck tightness"
            subtitle="High share + high tightness = binding single points of failure"
          >
            <div className="h-[400px] w-full min-w-0">
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
                      value: "Top-1 share %",
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
                      value: "Tightness (1–10)",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="hhi" range={[80, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as (typeof SHARE_TIGHTNESS)[number];
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                          <p className="font-semibold text-slate-900">{row.short}</p>
                          <p>
                            Top-1 {fmtPct(row.top1Pct)} · Top-3 {fmtPct(row.top3CumPct)}
                          </p>
                          <p>
                            Tightness {row.tightness}/10 · HHI {fmtHhi(row.hhi)}
                          </p>
                          <p className="capitalize text-slate-500">{row.stage}</p>
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
          </ChartCard>

          <ChartCard
            title="Stage map — where concentration lives"
            subtitle="Upstream tools vs midstream packaging/memory vs downstream GPUs"
          >
            <div className="h-[400px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={STACK_LAYERS.map((l) => ({
                    short: l.short,
                    top1Pct: l.top1Pct,
                    stage: l.stage,
                    fill: STAGE_COLORS[l.stage],
                  }))}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 105]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Bar dataKey="top1Pct" name="Top-1 %" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {STACK_LAYERS.map((l) => (
                      <Cell key={l.id} fill={STAGE_COLORS[l.stage]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ background: STAGE_COLORS.upstream }}
                />
                Upstream
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ background: STAGE_COLORS.midstream }}
                />
                Midstream
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ background: STAGE_COLORS.downstream }}
                />
                Downstream
              </span>
            </div>
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
            title="CoWoS path — capacity vs NVIDIA reservation share"
            subtitle="Buyer concentration on the packaging gate that still binds ship schedules"
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
                    domain={[0, 60]}
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
                    maxBarSize={48}
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
