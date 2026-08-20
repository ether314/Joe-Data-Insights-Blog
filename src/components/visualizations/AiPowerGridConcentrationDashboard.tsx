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
  CONCENTRATION_CURVE,
  GROWTH_SLICES,
  HEADLINE,
  LOCAL_INTENSITY,
  PACE_CLOCKS,
  REGION_SHARES,
  SOURCE_NOTE,
  SOURCES,
  TOP_CLUSTERS,
  fmtGw,
  fmtPct,
  fmtTwh,
} from "@/data/ai-power-grid-concentration-2026-data";

// viz-types: concentration Lorenz area+line, ranked share bars, growth donut, cluster scatter, intensity lollipops, pace clocks | layout: default

type ViewId = "ladder" | "clusters" | "local" | "pace";
type ShareMetric = "share2024Pct" | "twh2024" | "deltaTwh";
type ClusterAxis = "load" | "pipeline";

const TEAL = "#0d9488";
const AMBER = "#f59e0b";
const SKY = "#0ea5e9";
const VIOLET = "#8b5cf6";
const ROSE = "#f43f5e";
const SLATE = "#64748b";

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
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              value === o.id
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AiPowerGridConcentrationDashboard() {
  const [view, setView] = useState<ViewId>("ladder");
  const [shareMetric, setShareMetric] = useState<ShareMetric>("share2024Pct");
  const [clusterAxis, setClusterAxis] = useState<ClusterAxis>("load");
  const [showEqualLine, setShowEqualLine] = useState(true);

  const regionBars = useMemo(() => {
    return [...REGION_SHARES]
      .map((r) => ({
        ...r,
        value:
          shareMetric === "share2024Pct"
            ? r.share2024Pct
            : shareMetric === "twh2024"
              ? r.twh2024
              : r.deltaTwh,
      }))
      .sort((a, b) => b.value - a.value);
  }, [shareMetric]);

  const clusterScatter = useMemo(
    () =>
      TOP_CLUSTERS.map((c) => ({
        ...c,
        x: c.itLoadGw,
        y: c.pipelineSharePct ?? 0,
        z: c.shareOfGlobalPct,
      })),
    [],
  );

  const clusterBars = useMemo(() => {
    const rows = [...TOP_CLUSTERS];
    if (clusterAxis === "load") {
      return rows.sort((a, b) => b.itLoadGw - a.itLoadGw);
    }
    return rows
      .filter((c) => c.pipelineSharePct != null)
      .sort((a, b) => (b.pipelineSharePct ?? 0) - (a.pipelineSharePct ?? 0));
  }, [clusterAxis]);

  const intensitySorted = useMemo(
    () =>
      [...LOCAL_INTENSITY].sort(
        (a, b) => b.dcShareOfElectricityPct - a.dcShareOfElectricityPct,
      ),
    [],
  );

  const paceSorted = useMemo(
    () => [...PACE_CLOCKS].sort((a, b) => b.years - a.years),
    [],
  );

  const shareUnit =
    shareMetric === "share2024Pct"
      ? "%"
      : shareMetric === "twh2024"
        ? " TWh"
        : " ΔTWh";

  return (
    <div
      className="space-y-6"
      data-viz="ai-power-grid-concentration-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
          AI power &amp; grid — concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Top-1 holds {HEADLINE.top1Share2024Pct}% · Top-3 holds{" "}
          {HEADLINE.top3Share2024Pct}%
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Global data-centre electricity is only ~{HEADLINE.dcShare2024Pct}% of
          world demand — but the{" "}
          <span className="text-sky-300">United States alone is {HEADLINE.top1Share2024Pct}%</span>{" "}
          of the sector, and{" "}
          <span className="text-rose-300">
            US + China capture ~{HEADLINE.usChinaGrowthSharePct}% of growth to 2030
          </span>
          . Local grids feel it harder still: Virginia ~{HEADLINE.virginiaDcSharePct}%,
          Ireland ~{HEADLINE.irelandDcSharePct}%.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Top-1 share",
              value: fmtPct(HEADLINE.top1Share2024Pct),
              sub: HEADLINE.top1Label,
            },
            {
              label: "Top-3 share",
              value: fmtPct(HEADLINE.top3Share2024Pct),
              sub: "US · China · Europe",
            },
            {
              label: "Regional HHI",
              value: HEADLINE.regionalHhi2024.toLocaleString(),
              sub: "Five-bucket approx.",
            },
            {
              label: "Delay risk",
              value: fmtPct(HEADLINE.projectsAtDelayRiskPct),
              sub: "Projects if grids stall",
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-3"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums">{k.value}</p>
              <p className="text-xs text-slate-400">{k.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "ladder", label: "Concentration ladder" },
            { id: "clusters", label: "Clusters" },
            { id: "local", label: "Local intensity" },
            { id: "pace", label: "Grid pace" },
          ]}
        />
      </div>

      {view === "ladder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Cumulative share vs equal split"
            subtitle="How fast the top of the distribution accumulates global DC electricity"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Equal line"
                value={showEqualLine ? "on" : "off"}
                onChange={(v) => setShowEqualLine(v === "on")}
                options={[
                  { id: "on", label: "Show" },
                  { id: "off", label: "Hide" },
                ]}
              />
            </div>
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={CONCENTRATION_CURVE}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
                      name === "sharePct" ? "Actual cumulative" : "Equal split",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="sharePct"
                    fill={SKY}
                    fillOpacity={0.25}
                    stroke={SKY}
                    strokeWidth={2.5}
                    name="sharePct"
                  />
                  {showEqualLine && (
                    <Line
                      type="monotone"
                      dataKey="equalPct"
                      stroke={SLATE}
                      strokeDasharray="6 4"
                      strokeWidth={1.5}
                      dot={false}
                      name="equalPct"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Top-1 {fmtPct(HEADLINE.top1Share2024Pct)} · Top-2 70% · Top-3{" "}
              {fmtPct(HEADLINE.top3Share2024Pct)}. Equal line assumes five equal
              buckets.
            </p>
          </ChartCard>

          <ChartCard
            title="Regional distribution"
            subtitle="Toggle between 2024 share, absolute TWh, and growth to 2030"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Metric"
                value={shareMetric}
                onChange={setShareMetric}
                options={[
                  { id: "share2024Pct", label: "2024 share" },
                  { id: "twh2024", label: "2024 TWh" },
                  { id: "deltaTwh", label: "Growth to 2030" },
                ]}
              />
            </div>
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionBars}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) =>
                      shareMetric === "share2024Pct" ? `${v}%` : String(v)
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={56}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [
                      `${Number(v).toLocaleString()}${shareUnit}`,
                      "Value",
                    ]}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {regionBars.map((r) => (
                      <Cell key={r.region} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Who captures growth to 2030"
            subtitle="US + China ≈ 80% of incremental data-centre TWh (Base Case)"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={GROWTH_SLICES}
                    dataKey="deltaTwh"
                    nameKey="short"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {GROWTH_SLICES.map((s) => (
                      <Cell key={s.region} fill={s.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, props) => [
                      `${fmtTwh(Number(v))} (${fmtPct(props.payload.shareOfGrowthPct, 1)})`,
                      props.payload.region,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-1 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
              {GROWTH_SLICES.map((s) => (
                <li key={s.region} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: s.fill }}
                  />
                  {s.short} {fmtTwh(s.deltaTwh)}
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title="Stock vs growth concentration"
            subtitle="2024 share of stock versus share of incremental demand"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="share2024Pct"
                    name="2024 share"
                    unit="%"
                    domain={[0, 50]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "2024 stock share %",
                      position: "insideBottom",
                      offset: -4,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="growthShare"
                    name="Growth share"
                    unit="%"
                    domain={[0, 50]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Growth share %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis range={[80, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
                      String(name),
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.region ?? ""
                    }
                  />
                  <Scatter
                    data={REGION_SHARES.filter((r) => r.short !== "RoW").map(
                      (r) => ({
                        ...r,
                        growthShare:
                          GROWTH_SLICES.find((g) => g.short === r.short)
                            ?.shareOfGrowthPct ??
                          (r.deltaTwh / 530) * 100,
                      }),
                    )}
                    fill={VIOLET}
                  >
                    {REGION_SHARES.filter((r) => r.short !== "RoW").map((r) => (
                      <Cell key={r.region} fill={r.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "clusters" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Top clusters — IT load vs pipeline intensity"
            subtitle="Bubble size ≈ share of global operational capacity; y = estimated pipeline share"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 20, left: 8, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="IT load"
                    unit=" GW"
                    domain={[0, 5.5]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Operating IT load (GW)",
                      position: "insideBottom",
                      offset: -6,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Pipeline"
                    unit="%"
                    domain={[0, 70]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Pipeline intensity %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => {
                      if (name === "IT load") return [fmtGw(Number(v)), name];
                      if (name === "Pipeline")
                        return [fmtPct(Number(v)), "Pipeline share"];
                      return [String(v), String(name)];
                    }}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.cluster ?? ""
                    }
                  />
                  <Scatter data={clusterScatter}>
                    {clusterScatter.map((c) => (
                      <Cell key={c.cluster} fill={c.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Northern Virginia ~{fmtGw(HEADLINE.novaItLoadGw)} and ~
              {fmtPct(HEADLINE.novaGlobalCapacitySharePct)} of global capacity
              (Cushman / JLARC). Other cluster GW values are estimated ranks.
            </p>
          </ChartCard>

          <ChartCard
            title="Cluster ranking"
            subtitle="Switch between operating load and estimated pipeline intensity"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Rank by"
                value={clusterAxis}
                onChange={setClusterAxis}
                options={[
                  { id: "load", label: "IT load (GW)" },
                  { id: "pipeline", label: "Pipeline %" },
                ]}
              />
            </div>
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={clusterBars}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) =>
                      clusterAxis === "load" ? `${v}` : `${v}%`
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={72}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v) => [
                      clusterAxis === "load"
                        ? fmtGw(Number(v))
                        : fmtPct(Number(v)),
                      clusterAxis === "load" ? "IT load" : "Pipeline",
                    ]}
                  />
                  <Bar
                    dataKey={
                      clusterAxis === "load" ? "itLoadGw" : "pipelineSharePct"
                    }
                    radius={[0, 4, 4, 0]}
                  >
                    {clusterBars.map((c) => (
                      <Cell key={c.cluster} fill={c.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              ~{fmtPct(HEADLINE.usFiveClusterSharePct)} of US capacity sits in
              five regional clusters; ~{fmtPct(HEADLINE.usPipelineInClustersPct)}{" "}
              of US development remains inside existing large hubs.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "local" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Local grid intensity"
            subtitle="Data-centre share of electricity where clusters land — vs 1.5% global average"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={intensitySorted}
                  layout="vertical"
                  margin={{ top: 8, right: 20, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 30]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={80}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v)), "DC share of electricity"]}
                  />
                  <Bar dataKey="dcShareOfElectricityPct" radius={[0, 4, 4, 0]}>
                    {intensitySorted.map((r) => (
                      <Cell key={r.market} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Why local beats global"
            subtitle="Same sector, different denominators"
          >
            <div className="space-y-4 p-2">
              {[
                {
                  title: "Global comfort statistic",
                  body: `${fmtTwh(HEADLINE.dcTwh2024)} is only ${fmtPct(HEADLINE.dcShare2024Pct)} of world electricity — and still ~${fmtPct(HEADLINE.dcShare2030Pct)} in 2030 Base Case.`,
                  color: SLATE,
                },
                {
                  title: "Country concentration",
                  body: `Top-1 ${fmtPct(HEADLINE.top1Share2024Pct)} (US) and top-3 ${fmtPct(HEADLINE.top3Share2024Pct)} mean the build-out is not evenly spread across grids.`,
                  color: SKY,
                },
                {
                  title: "Cluster + state intensity",
                  body: `Northern Virginia alone is ~${fmtPct(HEADLINE.novaGlobalCapacitySharePct)} of global capacity. Virginia’s grid already sees DCs at ~${fmtPct(HEADLINE.virginiaDcSharePct)} of state electricity; Ireland ~${fmtPct(HEADLINE.irelandDcSharePct)}.`,
                  color: ROSE,
                },
                {
                  title: "Development geography",
                  body: `About half of US capacity — and half of the US pipeline — remains tied to existing large clusters, compounding local congestion risk.`,
                  color: AMBER,
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                  style={{ borderLeftWidth: 4, borderLeftColor: card.color }}
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {card.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {view === "pace" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Demand clocks vs grid clocks"
            subtitle="Years to deliver — AI campuses race interconnection and transmission"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={paceSorted}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 8]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}y`}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={88}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, props) => [
                      `${Number(v)} years`,
                      props.payload.kind === "demand"
                        ? "Demand-side clock"
                        : "Grid-side clock",
                    ]}
                  />
                  <Bar dataKey="years" radius={[0, 4, 4, 0]}>
                    {paceSorted.map((r) => (
                      <Cell
                        key={r.id}
                        fill={r.kind === "demand" ? TEAL : ROSE}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: TEAL }}
                />
                Demand-side
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: ROSE }}
                />
                Grid-side
              </span>
            </div>
          </ChartCard>

          <ChartCard
            title="Can build-out keep pace?"
            subtitle="Concentration raises the cost of every year of grid delay"
          >
            <div className="space-y-4 p-2 text-sm leading-relaxed text-slate-700">
              <p>
                IEA estimates ~{fmtPct(HEADLINE.projectsAtDelayRiskPct)} of
                planned data-centre projects sit at delay risk unless grid risks
                are addressed. New transmission in advanced economies typically
                takes {HEADLINE.transmissionYearsMin}–
                {HEADLINE.transmissionYearsMax} years; US median
                interconnection from request to commercial operation exceeds{" "}
                {HEADLINE.queueMedianYears} years for recent builds.
              </p>
              <p>
                Because ~{fmtPct(HEADLINE.usFiveClusterSharePct)} of US capacity
                already packs into five clusters — and half the pipeline stays
                there — each year of queue delay hits the same substations and
                transformers, not a diversified national grid.
              </p>
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-rose-900">
                Emerging and developing economies outside China hold ~{" "}
                {fmtPct(HEADLINE.emergingExChinaInternetUsersPct)} of internet
                users but under {fmtPct(HEADLINE.emergingExChinaDcCapacityPct)}{" "}
                of data-centre capacity — concentration is also a geography of
                exclusion.
              </p>
            </div>
          </ChartCard>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
        <p className="font-semibold text-slate-700">Sources &amp; notes</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-700 underline-offset-2 hover:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
