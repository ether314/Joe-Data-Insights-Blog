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
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ARRANGEMENT_MIX,
  CORRIDORS,
  DOMESTIC_RAILS,
  HEADLINE,
  RAIL_MIX_SERIES,
  REGION_MIX,
  SOURCE_NOTE,
  SPEED_COST,
} from "@/data/instant-domestic-rails-vs-swift-for-retail-2026-data";

type Panel =
  | "rail-mix"
  | "corridor"
  | "region"
  | "speed-cost"
  | "capability"
  | "domestic";
type MetricMode = "value" | "cost" | "speed";
type RegionFilter =
  | "all"
  | "Asia-Pacific"
  | "Europe"
  | "Americas"
  | "Africa-ME";

const C = {
  correspondent: "#1e3a5f",
  fps: "#0d9488",
  closed: "#d97706",
  other: "#94a3b8",
  accent: "#dc2626",
  grid: "#e2e8f0",
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

function Chip({
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
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

export function InstantDomesticRailsVsSwiftForRetail2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("rail-mix");
  const [metricMode, setMetricMode] = useState<MetricMode>("value");
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all");
  const [systemLens, setSystemLens] = useState<"FPS" | "RTGS" | "both">("FPS");

  const mixSeries = useMemo(
    () =>
      RAIL_MIX_SERIES.map((r) => ({
        year: r.year,
        Correspondent: r.correspondent,
        "FPS interlink": r.fps_interlink,
        "Closed-loop": r.closed_loop,
        Other: r.other,
      })),
    [],
  );

  const corridors = useMemo(() => {
    const rows =
      regionFilter === "all"
        ? CORRIDORS
        : CORRIDORS.filter((c) => c.region === regionFilter);
    return rows.map((c) => ({
      ...c,
      short: c.corridor.replace(" → ", "→").replace(" ↔ ", "↔"),
      metric:
        metricMode === "value"
          ? c.correspondentPct
          : metricMode === "cost"
            ? c.avgCostPct
            : c.correspondentHours,
      fpsMetric:
        metricMode === "value"
          ? c.fpsPct
          : metricMode === "cost"
            ? Math.max(0.8, c.avgCostPct * 0.55)
            : c.fpsMinutes != null
              ? c.fpsMinutes / 60
              : null,
    }));
  }, [regionFilter, metricMode]);

  const regionBars = useMemo(
    () =>
      REGION_MIX.map((r) => ({
        region: r.short,
        Correspondent: r.correspondentPct,
        "FPS interlink": r.fpsPct,
        "Closed-loop": r.closedLoopPct,
        Other: r.otherPct,
        capable: r.fpsCapableSystemsPct,
      })),
    [],
  );

  const scatter = useMemo(() => {
    if (regionFilter === "all") return SPEED_COST;
    return SPEED_COST.filter((p) => p.region === regionFilter);
  }, [regionFilter]);

  const arrangement = useMemo(() => {
    const rows =
      systemLens === "both"
        ? ARRANGEMENT_MIX
        : ARRANGEMENT_MIX.filter((a) => a.system === systemLens);
    return rows.map((a) => ({
      name: a.label,
      value: a.sharePct,
      system: a.system,
    }));
  }, [systemLens]);

  const pieColors = [C.fps, C.correspondent, C.closed, C.other, "#64748b"];

  const domestic = useMemo(
    () =>
      DOMESTIC_RAILS.map((d) => ({
        ...d,
        statusLabel:
          d.xbStatus === "live_link"
            ? "Live XB link"
            : d.xbStatus === "pilot"
              ? "XB pilot"
              : d.xbStatus === "corr_overlay"
                ? "Corr overlay"
                : "Domestic only",
      })),
    [],
  );

  const metricAxis =
    metricMode === "value"
      ? "% of corridor value"
      : metricMode === "cost"
        ? "Cost (% of send)"
        : "Hours to credit";

  return (
    <div
      className="space-y-4"
      data-viz="instant-domestic-rails-vs-swift-for-retail-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Headline — rail share of retail FX
        </p>
        <p className="mt-1 text-sm text-slate-700 sm:text-base">
          Desk estimate:{" "}
          <span className="font-bold text-slate-900">
            {HEADLINE.correspondentValueSharePct}%
          </span>{" "}
          of global retail cross-border <em>value</em> still clears on
          correspondent / SWIFT messaging vs{" "}
          <span className="font-bold text-teal-700">
            {HEADLINE.instantRailValueSharePct}%
          </span>{" "}
          on FPS interlinks. CPMI: {HEADLINE.fpsCrossBorderCapablePct}% of FPS and{" "}
          {HEADLINE.rtgsCrossBorderCapablePct}% of RTGS can process XB legs —
          capability is not value share.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip active={panel === "rail-mix"} onClick={() => setPanel("rail-mix")}>
          Rail mix timeline
        </Chip>
        <Chip active={panel === "corridor"} onClick={() => setPanel("corridor")}>
          Corridor share
        </Chip>
        <Chip active={panel === "region"} onClick={() => setPanel("region")}>
          Regional stack
        </Chip>
        <Chip
          active={panel === "speed-cost"}
          onClick={() => setPanel("speed-cost")}
        >
          Speed vs cost
        </Chip>
        <Chip
          active={panel === "capability"}
          onClick={() => setPanel("capability")}
        >
          System arrangements
        </Chip>
        <Chip active={panel === "domestic"} onClick={() => setPanel("domestic")}>
          Domestic FPS lens
        </Chip>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase text-slate-500">Metric</span>
        <Chip
          active={metricMode === "value"}
          onClick={() => setMetricMode("value")}
        >
          Value share
        </Chip>
        <Chip active={metricMode === "cost"} onClick={() => setMetricMode("cost")}>
          Cost
        </Chip>
        <Chip
          active={metricMode === "speed"}
          onClick={() => setMetricMode("speed")}
        >
          Speed
        </Chip>
        <span className="ml-2 text-xs font-medium uppercase text-slate-500">
          Region
        </span>
        {(
          ["all", "Asia-Pacific", "Europe", "Americas", "Africa-ME"] as const
        ).map((r) => (
          <Chip
            key={r}
            active={regionFilter === r}
            onClick={() => setRegionFilter(r)}
          >
            {r === "all" ? "All regions" : r}
          </Chip>
        ))}
      </div>

      {panel === "rail-mix" ? (
        <ChartCard
          title="Retail cross-border value by rail"
          subtitle="Stacked share of global retail CB value (desk estimated). Correspondent still majority through 2027 carry."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={mixSeries}>
                <CartesianGrid stroke={C.grid} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="Correspondent"
                  stackId="1"
                  fill={C.correspondent}
                  stroke={C.correspondent}
                />
                <Area
                  type="monotone"
                  dataKey="FPS interlink"
                  stackId="1"
                  fill={C.fps}
                  stroke={C.fps}
                />
                <Area
                  type="monotone"
                  dataKey="Closed-loop"
                  stackId="1"
                  fill={C.closed}
                  stroke={C.closed}
                />
                <Area
                  type="monotone"
                  dataKey="Other"
                  stackId="1"
                  fill={C.other}
                  stroke={C.other}
                />
                <Line
                  type="monotone"
                  dataKey="Correspondent"
                  stroke={C.accent}
                  strokeWidth={2}
                  dot={false}
                  legendType="none"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "corridor" ? (
        <ChartCard
          title="Corridor rail share"
          subtitle={`Grouped bars · metric: ${metricAxis}. Toggle Metric and Region above.`}
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={corridors}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid stroke={C.grid} strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={128}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="metric"
                  name={
                    metricMode === "value"
                      ? "Correspondent %"
                      : metricMode === "cost"
                        ? "Corridor avg cost %"
                        : "Corr hours"
                  }
                  fill={C.correspondent}
                />
                <Bar
                  dataKey="fpsMetric"
                  name={
                    metricMode === "value"
                      ? "FPS %"
                      : metricMode === "cost"
                        ? "FPS path cost %"
                        : "FPS hours"
                  }
                  fill={C.fps}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "region" ? (
        <ChartCard
          title="Regional value stack"
          subtitle="Desk-estimated retail CB value mix by region, with FPS XB-capable system share (line)."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={regionBars}>
                <CartesianGrid stroke={C.grid} strokeDasharray="3 3" />
                <XAxis dataKey="region" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="Correspondent"
                  stackId="a"
                  fill={C.correspondent}
                />
                <Bar
                  yAxisId="left"
                  dataKey="FPS interlink"
                  stackId="a"
                  fill={C.fps}
                />
                <Bar
                  yAxisId="left"
                  dataKey="Closed-loop"
                  stackId="a"
                  fill={C.closed}
                />
                <Bar yAxisId="left" dataKey="Other" stackId="a" fill={C.other} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="capable"
                  name="FPS XB-capable %"
                  stroke={C.accent}
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "speed-cost" ? (
        <ChartCard
          title="Speed vs cost by rail path"
          subtitle="Scatter of corridor paths. Bubble size ∝ value-share proxy. FPS links sit lower-left when live."
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                <CartesianGrid stroke={C.grid} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="hoursToCredit"
                  name="Hours"
                  tick={{ fontSize: 11 }}
                  scale="log"
                  domain={["auto", "auto"]}
                />
                <YAxis
                  type="number"
                  dataKey="costPct"
                  name="Cost %"
                  tick={{ fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="valueShareProxy" range={[40, 280]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Paths" data={scatter}>
                  {scatter.map((p) => (
                    <Cell
                      key={p.id}
                      fill={
                        p.rail === "fps"
                          ? C.fps
                          : p.rail === "correspondent"
                            ? C.correspondent
                            : C.closed
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "capability" ? (
        <ChartCard
          title="How XB-capable systems arrange the leg"
          subtitle="CPMI arrangement lens among systems that already process cross-border — not global value share."
        >
          <div className="mb-3 flex flex-wrap gap-2">
            <Chip
              active={systemLens === "FPS"}
              onClick={() => setSystemLens("FPS")}
            >
              FPS arrangements
            </Chip>
            <Chip
              active={systemLens === "RTGS"}
              onClick={() => setSystemLens("RTGS")}
            >
              RTGS arrangements
            </Chip>
            <Chip
              active={systemLens === "both"}
              onClick={() => setSystemLens("both")}
            >
              Both
            </Chip>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={arrangement}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(props) => {
                      const name = String(props.name ?? "");
                      const pct = Number(props.percent ?? 0) * 100;
                      return `${name.slice(0, 18)} ${pct.toFixed(0)}%`;
                    }}
                  >
                    {arrangement.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={arrangement} layout="vertical">
                  <CartesianGrid stroke={C.grid} strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={140}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" name="Share %" fill={C.fps}>
                    {arrangement.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartCard>
      ) : null}

      {panel === "domestic" ? (
        <ChartCard
          title="Domestic instant rails vs outbound touch"
          subtitle="Volume index (2021=100) vs estimated share of outbound retail remittances that touch the FPS."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={domestic}>
                <CartesianGrid stroke={C.grid} strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="volumeIndex2025"
                  name="Volume index 2025"
                  fill={C.correspondent}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="outboundTouchPct"
                  name="Outbound touch %"
                  stroke={C.fps}
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
            {domestic.map((d) => (
              <li key={d.id}>
                <span className="font-semibold text-slate-800">{d.name}</span>
                {" — "}
                {d.statusLabel} · launched {d.launched}
              </li>
            ))}
          </ul>
        </ChartCard>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
