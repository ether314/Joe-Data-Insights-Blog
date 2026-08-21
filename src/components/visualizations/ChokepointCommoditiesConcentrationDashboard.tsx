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
  HEADLINE,
  HHI_BANDS,
  RELIANCE_SCATTER,
  SOURCE_NOTE,
  STAGE_SPLITS,
  TOP_K_LADDER,
  filterCommodities,
  fmtHhi,
  fmtPct,
  producerScoreboard,
  sectorExposures,
  type Sector,
  type Stage,
} from "@/data/chokepoint-commodities-concentration-2026-data";

// viz-types: Lorenz area+line, ranked top1/top3 bars, mine→midstream slope, HHI donut, producer bars, reliance×concentration scatter | layout: default

type ViewId = "ladder" | "lorenz" | "stages" | "hhi" | "producers" | "scatter";
type Metric = "top1" | "top3" | "hhi";

const ROSE = "#f43f5e";
const AMBER = "#f59e0b";
const SKY = "#0ea5e9";
const TEAL = "#14b8a6";
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

export function ChokepointCommoditiesConcentrationDashboard() {
  const [view, setView] = useState<ViewId>("ladder");
  const [metric, setMetric] = useState<Metric>("top1");
  const [stage, setStage] = useState<Stage | "all">("all");
  const [sector, setSector] = useState<Sector | "all">("all");

  const filtered = useMemo(
    () => filterCommodities({ stage, sector }),
    [stage, sector],
  );

  const ladderBars = useMemo(() => {
    return [...filtered]
      .map((c) => ({
        ...c,
        value:
          metric === "top1"
            ? c.top1SharePct
            : metric === "top3"
              ? c.top3SharePct
              : c.hhi,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filtered, metric]);

  const producers = useMemo(() => producerScoreboard(), []);
  const sectors = useMemo(() => sectorExposures(), []);

  const stageSlope = useMemo(
    () =>
      STAGE_SPLITS.flatMap((s) => [
        {
          family: s.family,
          point: "Mine",
          top1: s.mineTop1Pct,
          leader: s.mineLeader,
          flip: s.flip,
        },
        {
          family: s.family,
          point: "Midstream",
          top1: s.midstreamTop1Pct,
          leader: s.midstreamLeader,
          flip: s.flip,
        },
      ]),
    [],
  );

  const metricLabel =
    metric === "top1" ? "Top-1 share %" : metric === "top3" ? "Top-3 share %" : "HHI";

  return (
    <div
      className="space-y-6"
      data-viz="chokepoint-commodities-concentration-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300/90">
          Chokepoint commodities — concentration lens
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
          Across{" "}
          <span className="font-semibold text-white">
            {HEADLINE.commoditiesTracked}
          </span>{" "}
          mine, midstream, and export stages, median Top-1 share is{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.medianTop1Pct)}
          </span>
          ;{" "}
          <span className="font-semibold text-white">
            {HEADLINE.extremeTop1Count}
          </span>{" "}
          stages clear 70% Top-1; China leads{" "}
          <span className="font-semibold text-white">
            {HEADLINE.chinaTop1Count}
          </span>{" "}
          of {HEADLINE.commoditiesTracked}. Extreme: gallium refined at{" "}
          {fmtPct(HEADLINE.extremeTop1Pct)}.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TOP_K_LADDER.map((row) => (
            <div
              key={String(row.k)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {row.label}
              </p>
              <p className="text-xl font-bold tabular-nums text-white">
                {row.count}/{HEADLINE.commoditiesTracked}
              </p>
              <p className="text-xs text-slate-400">{row.sharePct}% of stages</p>
            </div>
          ))}
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              China Top-1 count
            </p>
            <p className="text-xl font-bold tabular-nums text-white">
              {HEADLINE.chinaTop1Count}
            </p>
            <p className="text-xs text-slate-400">
              {HEADLINE.chinaShareOfLeadersPct}% of tracked stages
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "ladder", label: "Ladder" },
            { id: "lorenz", label: "Lorenz" },
            { id: "stages", label: "Stages" },
            { id: "hhi", label: "HHI" },
            { id: "producers", label: "Producers" },
            { id: "scatter", label: "Scatter" },
          ]}
        />
        <ToggleGroup
          label="Metric"
          value={metric}
          onChange={setMetric}
          options={[
            { id: "top1", label: "Top-1" },
            { id: "top3", label: "Top-3" },
            { id: "hhi", label: "HHI" },
          ]}
        />
        <ToggleGroup
          label="Stage"
          value={stage}
          onChange={setStage}
          options={[
            { id: "all", label: "All" },
            { id: "mine", label: "Mine" },
            { id: "midstream", label: "Midstream" },
            { id: "export", label: "Export" },
          ]}
        />
        <ToggleGroup
          label="Sector"
          value={sector}
          onChange={setSector}
          options={[
            { id: "all", label: "All" },
            { id: "batteries", label: "Batteries" },
            { id: "semiconductors", label: "Semis" },
            { id: "magnets", label: "Magnets" },
            { id: "fertilizers", label: "Fertilizer" },
            { id: "structural", label: "Structural" },
          ]}
        />
      </div>

      {view === "ladder" && (
        <ChartCard
          title="Ranked market shares"
          subtitle={`${metricLabel} by commodity stage — filter with Stage / Sector`}
        >
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ladderBars}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: SLATE }}
                  domain={metric === "hhi" ? [0, "auto"] : [0, 100]}
                />
                <YAxis
                  type="category"
                  dataKey="shortLabel"
                  width={88}
                  tick={{ fontSize: 11, fill: SLATE }}
                />
                <Tooltip
                  formatter={(v) =>
                    metric === "hhi"
                      ? fmtHhi(Number(v))
                      : fmtPct(Number(v), 1)
                  }
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {ladderBars.map((d) => (
                    <Cell key={d.id} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "lorenz" && (
        <ChartCard
          title="Cumulative share vs equal split"
          subtitle="Lorenz-style: commodities ranked by Top-1; cumulative concentration mass vs equal line"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={CONCENTRATION_CURVE}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="rank"
                  tick={{ fontSize: 11, fill: SLATE }}
                  label={{
                    value: "Commodity rank (by Top-1)",
                    position: "insideBottom",
                    offset: -2,
                    style: { fontSize: 11, fill: SLATE },
                  }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: SLATE }}
                  domain={[0, 100]}
                  unit="%"
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="cumulativeMassPct"
                  fill={ROSE}
                  fillOpacity={0.15}
                  stroke={ROSE}
                  strokeWidth={2}
                  name="Cumulative Top-1 mass"
                />
                <Line
                  type="monotone"
                  dataKey="equalLinePct"
                  stroke={SLATE}
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                  name="Equal split"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Top 4 stages (gallium, graphite anode, REE separate, tungsten) already
            hold a disproportionate share of total Top-1 mass across the ledger.
          </p>
        </ChartCard>
      )}

      {view === "stages" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Mine → midstream Top-1"
            subtitle="Slope: same family, different stage — flips marked when leader changes"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={STAGE_SPLITS}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="family" tick={{ fontSize: 11, fill: SLATE }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: SLATE }}
                    domain={[0, 100]}
                    unit="%"
                  />
                  <Tooltip />
                  <Bar
                    dataKey="mineTop1Pct"
                    fill={SKY}
                    name="Mine Top-1"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="midstreamTop1Pct"
                    fill={ROSE}
                    name="Midstream Top-1"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="deltaPp"
                    stroke={AMBER}
                    strokeWidth={2}
                    name="Δ pp"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-slate-600">
              {STAGE_SPLITS.filter((s) => s.flip).map((s) => (
                <li key={s.family}>
                  <span className="font-semibold text-slate-800">{s.family}</span>
                  : {s.mineLeader} mine → {s.midstreamLeader} midstream (+
                  {s.deltaPp} pp Top-1)
                </li>
              ))}
            </ul>
          </ChartCard>
          <ChartCard
            title="Sector median Top-1"
            subtitle="Which end-markets sit on the most concentrated inputs"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sectors}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: SLATE }}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={120}
                    tick={{ fontSize: 11, fill: SLATE }}
                  />
                  <Tooltip
                    formatter={(v) => fmtPct(Number(v))}
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | (typeof sectors)[0]
                        | undefined;
                      return row
                        ? `${row.label} · max ${row.maxLabel} ${fmtPct(row.maxTop1Pct)}`
                        : "";
                    }}
                  />
                  <Bar dataKey="medianTop1Pct" radius={[0, 4, 4, 0]}>
                    {sectors.map((s) => (
                      <Cell key={s.sector} fill={s.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <div className="lg:col-span-2">
            <ChartCard
              title="Stage pair detail"
              subtitle="Mine vs midstream observations for slope families"
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                      <th className="py-2 pr-3">Family</th>
                      <th className="py-2 pr-3">Point</th>
                      <th className="py-2 pr-3">Top-1 %</th>
                      <th className="py-2">Leader</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stageSlope.map((r) => (
                      <tr
                        key={`${r.family}-${r.point}`}
                        className="border-b border-slate-100"
                      >
                        <td className="py-2 pr-3 font-medium text-slate-800">
                          {r.family}
                          {r.flip && (
                            <span className="ml-2 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                              flip
                            </span>
                          )}
                        </td>
                        <td className="py-2 pr-3 text-slate-600">{r.point}</td>
                        <td className="py-2 pr-3 tabular-nums text-slate-800">
                          {fmtPct(r.top1, 1)}
                        </td>
                        <td className="py-2 text-slate-600">{r.leader}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {view === "hhi" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="HHI band distribution"
            subtitle="Country-share Herfindahl bands across tracked stages"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={HHI_BANDS}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {HHI_BANDS.map((b) => (
                      <Cell key={b.id} fill={b.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
              {HHI_BANDS.map((b) => (
                <li key={b.id} className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: b.fill }}
                  />
                  {b.label}: {b.count}
                </li>
              ))}
            </ul>
          </ChartCard>
          <ChartCard
            title="Mine vs midstream median Top-1"
            subtitle="Processing stages concentrate harder than pits on this ledger"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      stage: "Mine",
                      medianTop1: HEADLINE.mineMedianTop1Pct,
                      fill: SKY,
                    },
                    {
                      stage: "Midstream",
                      medianTop1: HEADLINE.midstreamMedianTop1Pct,
                      fill: ROSE,
                    },
                  ]}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="stage" tick={{ fontSize: 12, fill: SLATE }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: SLATE }}
                    unit="%"
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Bar dataKey="medianTop1" radius={[6, 6, 0, 0]}>
                    <Cell fill={SKY} />
                    <Cell fill={ROSE} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Mine median Top-1 {fmtPct(HEADLINE.mineMedianTop1Pct)} vs midstream{" "}
              {fmtPct(HEADLINE.midstreamMedianTop1Pct)} — the processing step is
              where many “diversified” ores become single-country chemicals.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "producers" && (
        <ChartCard
          title="Who holds the Top-1 seats"
          subtitle="Count of stages where each country is the leading producer/processor"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={producers}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="country" tick={{ fontSize: 11, fill: SLATE }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: SLATE }}
                  allowDecimals={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: SLATE }}
                  domain={[0, 100]}
                  unit="%"
                />
                <Tooltip />
                <Bar
                  yAxisId="left"
                  dataKey="top1Count"
                  name="Top-1 seats"
                  radius={[4, 4, 0, 0]}
                >
                  {producers.map((p) => (
                    <Cell key={p.iso} fill={p.fill} />
                  ))}
                </Bar>
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgTop1SharePct"
                  stroke={AMBER}
                  strokeWidth={2}
                  name="Avg Top-1 %"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Top-1 share × US net import reliance"
          subtitle="Bubble size ≈ √HHI — upper-right is thin supply + import-exposed"
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Top-1 %"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: SLATE }}
                  unit="%"
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="US reliance %"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: SLATE }}
                  unit="%"
                />
                <ZAxis type="number" dataKey="z" range={[40, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) =>
                    name === "z" ? String(v) : fmtPct(Number(v), 1)
                  }
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as
                      | (typeof RELIANCE_SCATTER)[0]
                      | undefined;
                    return row
                      ? `${row.shortLabel} (${row.top1Label}) · HHI ${fmtHhi(row.hhi)}`
                      : "";
                  }}
                />
                <Scatter data={RELIANCE_SCATTER}>
                  {RELIANCE_SCATTER.map((p) => (
                    <Cell key={p.id} fill={p.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Gallium, graphite anode, and natural graphite sit near 100% US
            reliance with Top-1 above 79%. Copper mine is plural at the pit but
            still import-exposed; helium is US-led with near-zero reliance.
          </p>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <p className="sr-only">
        Area chart Lorenz cumulative, vertical bars ranked shares, composed mine
        midstream slope, pie HHI bands, scatter reliance concentration, line
        producer averages. Controls: View Metric Stage Sector. Teal accent{" "}
        {TEAL}.
      </p>
    </div>
  );
}
