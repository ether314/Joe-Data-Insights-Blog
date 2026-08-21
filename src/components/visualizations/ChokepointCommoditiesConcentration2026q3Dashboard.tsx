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
  LineChart,
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
  DOWNSTREAM_RISK,
  HEADLINE,
  HHI_BANDS,
  INVESTMENT_CONTEXT,
  SMELTER_STRESS,
  SOURCE_NOTE,
  STAGE_FLIPS,
  TOP_K_LADDER,
  VINTAGE_DELTA,
  filterCommodities,
  fmtDelta,
  fmtHhi,
  fmtPct,
  hhiBand,
  producerScoreboard,
  sectorExposures,
  type Direction,
  type Sector,
  type Stage,
} from "@/data/chokepoint-commodities-concentration-2026q3-data";

// viz-types: vintage delta bars, Lorenz area+line, mine→plant slope, HHI donut, producer bars, risk×share scatter | layout: default

type ViewId = "delta" | "ladder" | "flips" | "risk";
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

export function ChokepointCommoditiesConcentration2026q3Dashboard() {
  const [view, setView] = useState<ViewId>("delta");
  const [metric, setMetric] = useState<Metric>("top1");
  const [stage, setStage] = useState<Stage | "all">("all");
  const [direction, setDirection] = useState<Direction | "all">("all");
  const [sector, setSector] = useState<Sector | "all">("all");
  const [showEqual, setShowEqual] = useState(true);

  const filtered = useMemo(
    () => filterCommodities({ stage, sector, direction }),
    [stage, sector, direction],
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

  const vintageBars = useMemo(() => {
    return VINTAGE_DELTA.filter((d) => {
      if (stage !== "all" && d.stage !== stage) return false;
      if (direction !== "all" && d.direction !== direction) return false;
      return true;
    }).slice(0, 12);
  }, [stage, direction]);

  const producers = useMemo(() => producerScoreboard(filtered), [filtered]);
  const sectors = useMemo(() => sectorExposures(filtered), [filtered]);

  const hhiDonut = useMemo(() => {
    return HHI_BANDS.map((b) => ({
      ...b,
      count: filtered.filter((c) => hhiBand(c.hhi).id === b.id).length,
    })).filter((b) => b.count > 0);
  }, [filtered]);

  const flipSeries = useMemo(
    () =>
      STAGE_FLIPS.flatMap((f) => [
        {
          metal: f.metal,
          point: "Mine",
          top1: f.mineTop1,
          leader: f.mineLabel,
        },
        {
          metal: f.metal,
          point: f.plantStage,
          top1: f.plantTop1,
          leader: f.plantLabel,
        },
      ]),
    [],
  );

  const riskScatter = useMemo(
    () =>
      filtered.map((c) => ({
        shortLabel: c.shortLabel,
        top1: c.top1SharePct,
        hhi: c.hhi,
        reliance: c.usNetImportReliancePct,
        fill: c.fill,
        z: Math.max(40, c.substitutionDifficulty * 30),
      })),
    [filtered],
  );

  const metricLabel =
    metric === "top1"
      ? "Top-1 share %"
      : metric === "top3"
        ? "Top-3 share %"
        : "HHI";

  return (
    <div
      className="space-y-6"
      data-viz="chokepoint-commodities-concentration-2026q3"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300/90">
          Chokepoint commodities — Q3 2026 concentration lens
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
          After IEA GCMO 2026 restated midstream shares, median Top-1 across{" "}
          <span className="font-semibold text-white">
            {HEADLINE.commoditiesTracked}
          </span>{" "}
          stages is{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.medianTop1Pct, 1)}
          </span>
          ;{" "}
          <span className="font-semibold text-white">
            {HEADLINE.extremeTop1Count}
          </span>{" "}
          stages clear ≥70% Top-1; avg refining (ex-REE) prints{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.avgRefineExReePct)}
          </span>{" "}
          (+{HEADLINE.avgRefineDeltaPp} pp). Gallium remains the extreme at{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.extremeTop1Pct)}
          </span>
          .
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Median Top-1
            </p>
            <p className="text-lg font-bold text-white">
              {fmtPct(HEADLINE.medianTop1Pct, 1)}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Top-1 ≥ 70%
            </p>
            <p className="text-lg font-bold text-white">
              {HEADLINE.extremeTop1Count}/{HEADLINE.commoditiesTracked}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Midstream median
            </p>
            <p className="text-lg font-bold text-white">
              {fmtPct(HEADLINE.midstreamMedianTop1Pct, 1)}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              China Top-1 seats
            </p>
            <p className="text-lg font-bold text-white">
              {HEADLINE.chinaTop1Count}
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
            { id: "delta", label: "Vintage delta" },
            { id: "ladder", label: "Ranked shares" },
            { id: "flips", label: "Mine→plant" },
            { id: "risk", label: "Risk & HHI" },
          ]}
        />
        <div className="flex flex-wrap gap-3">
          <ToggleGroup
            label="Stage"
            value={stage}
            onChange={setStage}
            options={[
              { id: "all", label: "All" },
              { id: "mine", label: "Mine" },
              { id: "midstream", label: "Midstream" },
              { id: "smelter", label: "Smelter" },
              { id: "recycle", label: "Recycle" },
            ]}
          />
          <ToggleGroup
            label="Δ direction"
            value={direction}
            onChange={setDirection}
            options={[
              { id: "all", label: "All" },
              { id: "tighter", label: "Tighter" },
              { id: "easier", label: "Easier" },
              { id: "flat", label: "Flat" },
            ]}
          />
        </div>
      </div>

      {view === "delta" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Prior → Q3 Top-1 restatement"
            subtitle="Largest absolute pp moves first (concentration-2026 carry → IEA/MCS Q3)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={vintageBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="shortLabel"
                    width={88}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      typeof v === "number" ? fmtPct(v, 1) : String(v),
                      name === "prior" ? "Prior Top-1" : "Q3 Top-1",
                    ]}
                  />
                  <Bar dataKey="prior" name="prior" fill={SLATE} radius={[0, 2, 2, 0]} />
                  <Bar dataKey="q3" name="q3" radius={[0, 2, 2, 0]}>
                    {vintageBars.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {HEADLINE.tighterCount} tighter · {HEADLINE.easierCount} easier ·{" "}
              {HEADLINE.flatCount} flat across the full table
            </p>
          </ChartCard>

          <ChartCard
            title="Top-k concentration thresholds"
            subtitle="Share of tracked stages clearing each tip test"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...TOP_K_LADDER]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v, name) => [
                      name === "sharePct" && typeof v === "number"
                        ? fmtPct(v)
                        : String(v),
                      name === "sharePct" ? "% of stages" : "Stage count",
                    ]}
                  />
                  <Bar dataKey="count" fill={ROSE} name="count" radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="sharePct"
                    fill={AMBER}
                    name="sharePct"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-slate-600">
              {TOP_K_LADDER.map((t) => (
                <li key={t.label}>
                  <span className="font-semibold text-slate-800">{t.label}:</span>{" "}
                  {t.count} stages ({fmtPct(t.sharePct)}) — {t.example}
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title="Cumulative Top-1 mass vs equal split"
            subtitle="Lorenz-style curve across ranked stages"
          >
            <div className="mb-2">
              <ToggleGroup
                label="Equal line"
                value={showEqual ? "on" : "off"}
                onChange={(v) => setShowEqual(v === "on")}
                options={[
                  { id: "on", label: "Show" },
                  { id: "off", label: "Hide" },
                ]}
              />
            </div>
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={CONCENTRATION_CURVE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="rankSharePct"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Rank share of stages %",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    domain={[0, 100]}
                    label={{
                      value: "Cum. Top-1 mass %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="cumTop1MassPct"
                    stroke={ROSE}
                    fill={ROSE}
                    fillOpacity={0.15}
                    name="Cumulative Top-1 mass"
                  />
                  {showEqual && (
                    <Line
                      type="monotone"
                      dataKey="equalPct"
                      stroke={SLATE}
                      strokeDasharray="4 4"
                      dot={false}
                      name="Equal split"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Sector exposure (median Top-1)"
            subtitle="Filtered set — batteries and recycle sit hottest"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectors}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="sector" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v, name) => [
                      typeof v === "number" && name === "medianTop1"
                        ? fmtPct(v, 1)
                        : String(v),
                      name === "medianTop1" ? "Median Top-1" : "Extreme count",
                    ]}
                  />
                  <Bar dataKey="medianTop1" fill={TEAL} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="extremeCount" fill={AMBER} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "ladder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Ranked market shares"
            subtitle={`Metric: ${metricLabel} · stage/sector/direction filters apply`}
          >
            <div className="mb-3">
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
            </div>
            <div className="mb-2">
              <ToggleGroup
                label="Sector"
                value={sector}
                onChange={setSector}
                options={[
                  { id: "all", label: "All" },
                  { id: "batteries", label: "Batteries" },
                  { id: "semiconductors", label: "Semis" },
                  { id: "magnets", label: "Magnets" },
                  { id: "structural", label: "Structural" },
                  { id: "recycling", label: "Recycling" },
                ]}
              />
            </div>
            <div className="h-[28rem] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ladderBars}
                  layout="vertical"
                  margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    domain={metric === "hhi" ? [0, "auto"] : [0, 100]}
                  />
                  <YAxis
                    type="category"
                    dataKey="shortLabel"
                    width={92}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      metric === "hhi" && typeof v === "number"
                        ? fmtHhi(v)
                        : typeof v === "number"
                          ? fmtPct(v, 1)
                          : String(v)
                    }
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload;
                      return row
                        ? `${row.label} · ${row.top1Label} · ${fmtDelta(row.deltaPp)}`
                        : "";
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                    {ladderBars.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Top-1 producer seats"
            subtitle="Count of stages where each country leads"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={producers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {producers.map((p) => (
                      <Cell key={p.iso} fill={p.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              China holds {HEADLINE.chinaTop1Count} of{" "}
              {HEADLINE.commoditiesTracked} Top-1 seats (
              {fmtPct(HEADLINE.chinaShareOfLeadersPct)} of leaders).
            </p>
          </ChartCard>
        </div>
      )}

      {view === "flips" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Mine → plant concentration slope"
            subtitle="Same metal, different stage — leaders often flip"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={flipSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="point" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v, _n, item) => [
                      typeof v === "number" ? fmtPct(v, 1) : String(v),
                      item?.payload?.leader ?? "Top-1",
                    ]}
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload;
                      return row ? `${row.metal}: ${row.point}` : "";
                    }}
                  />
                  {STAGE_FLIPS.map((f, i) => {
                    const colors = [ROSE, AMBER, SKY, TEAL, "#8b5cf6"];
                    const pts = flipSeries.filter((p) => p.metal === f.metal);
                    return (
                      <Line
                        key={f.metal}
                        type="monotone"
                        data={pts}
                        dataKey="top1"
                        name={f.metal}
                        stroke={colors[i % colors.length]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
              {STAGE_FLIPS.map((f) => (
                <li key={f.metal}>
                  <span className="font-semibold text-slate-800">{f.metal}:</span>{" "}
                  {f.mineLabel} {fmtPct(f.mineTop1, 1)} → {f.plantLabel}{" "}
                  {fmtPct(f.plantTop1, 1)} ({f.plantStage})
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title="Copper smelter stress meters"
            subtitle="Capacity share beside utilisation and 2026 TC/RC settle"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SMELTER_STRESS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v, _n, item) => {
                      const unit = item?.payload?.unit ?? "";
                      return [
                        typeof v === "number" ? `${v}${unit === "%" ? "%" : ` ${unit}`}` : String(v),
                        "Value",
                      ];
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {SMELTER_STRESS.map((s) => (
                      <Cell key={s.id} fill={s.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              2026 annual copper TC/RC settled at ${HEADLINE.cuTcRc2026UsdPerT}/t —
              custom smelters outside China lose fee cover while China capacity
              sits near {fmtPct(HEADLINE.cuSmeltPct)}.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "risk" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="HHI band mix"
            subtitle="Analytical country-share HHI on the filtered set"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hhiDonut}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {hhiDonut.map((b) => (
                      <Cell key={b.id} fill={b.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-xs text-slate-500">
              Median HHI {fmtHhi(HEADLINE.medianHhi)} ·{" "}
              {HEADLINE.highlyConcentratedHhiCount} stages ≥ 2,500
            </p>
          </ChartCard>

          <ChartCard
            title="Reliance × concentration scatter"
            subtitle="US net-import reliance vs Top-1; bubble = substitution difficulty"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 12, left: 4, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="reliance"
                    name="US reliance %"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="top1"
                    name="Top-1 %"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[40, 200]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      typeof v === "number" ? fmtPct(v, 1) : String(v),
                      String(name),
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.shortLabel ?? ""
                    }
                  />
                  <Scatter data={riskScatter}>
                    {riskScatter.map((d) => (
                      <Cell key={d.shortLabel} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Downstream disruption risk"
            subtitle="IEA dollar framing beside Top-1 share"
          >
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={DOWNSTREAM_RISK}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="shortLabel" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Risk $bn",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar
                    yAxisId="left"
                    dataKey="riskUsdBn"
                    name="Risk $bn"
                    radius={[4, 4, 0, 0]}
                  >
                    {DOWNSTREAM_RISK.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Bar>
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="top1Pct"
                    stroke={SLATE}
                    strokeWidth={2}
                    name="Top-1 %"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Graphite anode disruption ~${HEADLINE.graphiteDownstreamRiskUsdBn}
              B/yr outside China; REE full-chain path framed near $
              {HEADLINE.reeDownstreamRiskUsdTn}T.
            </p>
          </ChartCard>

          <ChartCard
            title="Investment YoY while the tip stays hot"
            subtitle="Capex pullback vs public-finance surge (IEA)"
          >
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={INVESTMENT_CONTEXT}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 9 }} interval={0} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) =>
                      typeof v === "number" ? `${v > 0 ? "+" : ""}${v}%` : String(v)
                    }
                  />
                  <Bar dataKey="yoyPct" radius={[4, 4, 0, 0]}>
                    {INVESTMENT_CONTEXT.map((d) => (
                      <Cell
                        key={d.id}
                        fill={d.yoyPct >= 0 ? TEAL : ROSE}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
