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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  CWNS_CATEGORIES,
  DUAL_AXIS,
  HEADLINE,
  NATIONAL_TIMELINE,
  REGION_COMMUNITIES,
  SCATTER_POINTS,
  SOURCE_NOTE,
  STATE_BENCHMARKS,
  VOLUME_SCENARIOS,
  type RegionId,
  type VolumeScenarioId,
} from "@/data/cso-communities-versus-remaining-overflow-volume-2026-data";

type Panel =
  | "dual-axis"
  | "scatter"
  | "timeline"
  | "cwns"
  | "scenarios"
  | "state-bench";

type MetricMode = "volume" | "needs";

const COLORS = {
  communities: "#0e7490",
  volume: "#ea580c",
  needs: "#7c3aed",
  cso: "#dc2626",
  other: "#94a3b8",
  area: "#0891b2",
  grid: "#e2e8f0",
  maine: "#059669",
  national: "#1e293b",
};

const REGION_COLORS: Record<RegionId, string> = {
  northeast: "#0e7490",
  "great-lakes": "#0369a1",
  "midwest-other": "#0284c7",
  "mid-atlantic": "#6366f1",
  south: "#f59e0b",
  west: "#14b8a6",
};

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "dual-axis": {
    title: "Communities versus attributed residual volume",
    subtitle:
      "Bars = CSO communities by region; line = share of the 850 BG (2004) national volume benchmark",
  },
  scatter: {
    title: "Community count vs volume proxy",
    subtitle:
      "Bubble size ≈ CWNS Category V needs share — regions plotted against residual volume attribution",
  },
  timeline: {
    title: "Community count across program milestones",
    subtitle:
      "Sparse national frame: ~772 early-2000s → ~700 today; volume only disclosed for 2004",
  },
  cwns: {
    title: "CWNS 2022 capital needs by category",
    subtitle:
      "Category V CSO correction = $36.5B inside a $630.1B clean-water needs stack",
  },
  scenarios: {
    title: "Volume scenarios if national cuts tracked state-style progress",
    subtitle:
      "Only the 850 BG row is an EPA disclosure — other fans are illustrative",
  },
  "state-bench": {
    title: "Disclosed state and basin benchmarks",
    subtitle:
      "Great Lakes communities, NY CSS permits, Maine volume collapse since 1989",
  },
};

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
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function ControlChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-cyan-800 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

export function CsoCommunitiesVersusRemainingOverflowVolume2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("dual-axis");
  const [metricMode, setMetricMode] = useState<MetricMode>("volume");
  const [regionFocus, setRegionFocus] = useState<RegionId | "all">("all");
  const [scenarioFocus, setScenarioFocus] = useState<VolumeScenarioId | "all">(
    "all",
  );

  const dualData = useMemo(() => {
    if (regionFocus === "all") return DUAL_AXIS;
    return DUAL_AXIS.filter(
      (_, i) => REGION_COMMUNITIES[i].id === regionFocus,
    );
  }, [regionFocus]);

  const scatterData = useMemo(() => {
    let pts = SCATTER_POINTS;
    if (regionFocus !== "all") {
      pts = pts.filter(
        (p) => p.id === regionFocus || p.kind !== "region",
      );
    }
    return pts;
  }, [regionFocus]);

  const scenarioData = useMemo(() => {
    if (scenarioFocus === "all") return VOLUME_SCENARIOS;
    return VOLUME_SCENARIOS.filter((s) => s.id === scenarioFocus);
  }, [scenarioFocus]);

  const timelineData = useMemo(
    () =>
      NATIONAL_TIMELINE.map((r) => ({
        ...r,
        communitiesPlot: r.communities ?? undefined,
        volumePlot: r.volumeBgY ?? undefined,
      })),
    [],
  );

  const meta = PANEL_META[panel];

  return (
    <div className="w-full space-y-4" data-viz="cso-communities-versus-remaining-overflow-volume-2026">
      <div className="rounded-xl border border-cyan-900/20 bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 px-5 py-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300/90">
          Combined sewer overflows · communities vs volume
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          ~{HEADLINE.communitiesRemaining} communities ·{" "}
          {HEADLINE.nationalVolumeBgY} BG/yr (2004) · $
          {HEADLINE.cwnsCsoNeedsBb}B Cat. V needs
        </p>
        <p className="mt-2 max-w-3xl text-sm text-cyan-100/80">
          EPA still counts roughly seven hundred combined-sewer communities. The
          last national overflow volume estimate — 850 billion gallons in a
          typical year — dates to 2004. CWNS 2022 still books $
          {HEADLINE.cwnsCsoNeedsBb} billion for CSO correction.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["dual-axis", "Dual axis"],
            ["scatter", "Scatter"],
            ["timeline", "Timeline"],
            ["cwns", "CWNS needs"],
            ["scenarios", "Volume scenarios"],
            ["state-bench", "State benches"],
          ] as const
        ).map(([id, label]) => (
          <ControlChip
            key={id}
            active={panel === id}
            onClick={() => setPanel(id)}
          >
            {label}
          </ControlChip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Region
        </span>
        <ControlChip
          active={regionFocus === "all"}
          onClick={() => setRegionFocus("all")}
        >
          All regions
        </ControlChip>
        {REGION_COMMUNITIES.map((r) => (
          <ControlChip
            key={r.id}
            active={regionFocus === r.id}
            onClick={() => setRegionFocus(r.id)}
          >
            {r.label}
          </ControlChip>
        ))}
      </div>

      {(panel === "dual-axis" || panel === "scatter") && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Secondary metric
          </span>
          <ControlChip
            active={metricMode === "volume"}
            onClick={() => setMetricMode("volume")}
          >
            Residual volume (BG)
          </ControlChip>
          <ControlChip
            active={metricMode === "needs"}
            onClick={() => setMetricMode("needs")}
          >
            Illustrative Cat. V needs ($B)
          </ControlChip>
        </div>
      )}

      {panel === "scenarios" && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Scenario
          </span>
          <ControlChip
            active={scenarioFocus === "all"}
            onClick={() => setScenarioFocus("all")}
          >
            All scenarios
          </ControlChip>
          {VOLUME_SCENARIOS.map((s) => (
            <ControlChip
              key={s.id}
              active={scenarioFocus === s.id}
              onClick={() => setScenarioFocus(s.id)}
            >
              {s.label}
            </ControlChip>
          ))}
        </div>
      )}

      <ChartCard title={meta.title} subtitle={meta.subtitle}>
        {panel === "dual-axis" && (
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={dualData}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis
                  dataKey="region"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  label={{
                    value: "Communities",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#64748b", fontSize: 11 },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  label={{
                    value:
                      metricMode === "volume" ? "Volume (BG)" : "Needs ($B)",
                    angle: 90,
                    position: "insideRight",
                    style: { fill: "#64748b", fontSize: 11 },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="communities"
                  name="Communities"
                  fill={COLORS.communities}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey={
                    metricMode === "volume"
                      ? "residualVolumeBg"
                      : "needsIllustrativeBb"
                  }
                  name={
                    metricMode === "volume"
                      ? "Residual volume (BG)"
                      : "Illustrative needs ($B)"
                  }
                  stroke={
                    metricMode === "volume" ? COLORS.volume : COLORS.needs
                  }
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "scatter" && (
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="communities"
                  name="Communities"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  label={{
                    value: "Communities",
                    position: "insideBottom",
                    offset: -2,
                    style: { fill: "#64748b", fontSize: 11 },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="volumeOrProxyBg"
                  name="Volume (BG)"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  label={{
                    value: "Volume proxy (BG)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#64748b", fontSize: 11 },
                  }}
                />
                <ZAxis
                  type="number"
                  dataKey="needsBb"
                  range={[60, 400]}
                  name="Needs ($B)"
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                  formatter={(value, name) => [
                    typeof value === "number" ? value.toLocaleString() : String(value ?? ""),
                    String(name ?? ""),
                  ]}
                  labelFormatter={(_, payload) =>
                    (payload?.[0]?.payload as { label?: string } | undefined)?.label ?? ""
                  }
                />
                <Scatter name="CSO geography" data={scatterData}>
                  {scatterData.map((p) => (
                    <Cell
                      key={p.id}
                      fill={
                        p.kind === "state"
                          ? COLORS.maine
                          : p.kind === "scenario"
                            ? COLORS.national
                            : REGION_COLORS[p.id as RegionId] ??
                              COLORS.communities
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "timeline" && (
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={timelineData}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  domain={[500, 1200]}
                  label={{
                    value: "Communities",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#64748b", fontSize: 11 },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  domain={[0, 1000]}
                  label={{
                    value: "Volume (BG)",
                    angle: 90,
                    position: "insideRight",
                    style: { fill: "#64748b", fontSize: 11 },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="communitiesPlot"
                  name="Communities"
                  stroke={COLORS.area}
                  fill={COLORS.area}
                  fillOpacity={0.25}
                  connectNulls={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="volumePlot"
                  name="Volume BG (disclosed only)"
                  stroke={COLORS.volume}
                  strokeWidth={2.5}
                  connectNulls={false}
                  dot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "cwns" && (
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={[...CWNS_CATEGORIES].sort(
                  (a, b) => b.needsBb - a.needsBb,
                )}
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  unit="B"
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={160}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                  formatter={(v) => [`$${v}B`, "Needs"]}
                />
                <Bar dataKey="needsBb" name="Needs ($B)" radius={[0, 4, 4, 0]}>
                  {[...CWNS_CATEGORIES]
                    .sort((a, b) => b.needsBb - a.needsBb)
                    .map((row) => (
                      <Cell
                        key={row.id}
                        fill={row.isCso ? COLORS.cso : COLORS.other}
                      />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "scenarios" && (
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={scenarioData}
                margin={{ top: 8, right: 16, left: 0, bottom: 48 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  interval={0}
                  angle={-22}
                  textAnchor="end"
                  height={70}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  label={{
                    value: "Volume (BG/yr)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#64748b", fontSize: 11 },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  label={{
                    value: "Communities",
                    angle: 90,
                    position: "insideRight",
                    style: { fill: "#64748b", fontSize: 11 },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="volumeBgY"
                  name="Annual volume (BG)"
                  fill={COLORS.volume}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="communities"
                  name="Communities"
                  stroke={COLORS.communities}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "state-bench" && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STATE_BENCHMARKS.map((b) => (
              <div
                key={b.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {b.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {b.value}
                  <span className="ml-1 text-sm font-medium text-slate-500">
                    {b.unit}
                  </span>
                </p>
                <p className="mt-1 text-sm text-slate-600">{b.metric}</p>
                {b.compareValue != null && b.compareLabel ? (
                  <p className="mt-2 text-xs text-cyan-800">
                    vs {b.compareValue} {b.compareLabel}
                  </p>
                ) : null}
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  {b.note}
                </p>
              </div>
            ))}
          </div>
        )}
      </ChartCard>

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
