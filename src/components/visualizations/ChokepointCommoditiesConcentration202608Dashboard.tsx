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
  PRICE_PATH,
  SMELTER_STRESS,
  SOURCE_NOTE,
  STAGE_FLIPS,
  STRESS_SHARE,
  TOP_K_LADDER,
  filterCommodities,
  fmtHhi,
  fmtPct,
  hhiBandCounts,
  producerScoreboard,
  sectorExposures,
  type Sector,
  type Stage,
  type StressBand,
} from "@/data/chokepoint-commodities-concentration-202608-data";

// viz-types: binding bars, stress×share scatter, mine→plant slopes, price path area+line, HHI donut, producer bars | layout: default

type ViewId = "binding" | "stress" | "flips" | "path";
type Metric = "top1" | "top3" | "binding";

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

export function ChokepointCommoditiesConcentration202608Dashboard() {
  const [view, setView] = useState<ViewId>("binding");
  const [metric, setMetric] = useState<Metric>("top1");
  const [stage, setStage] = useState<Stage | "all">("all");
  const [stress, setStress] = useState<StressBand | "all">("all");
  const [sector, setSector] = useState<Sector | "all">("all");
  const [showEqual, setShowEqual] = useState(true);
  const [minTip, setMinTip] = useState<"all" | "50" | "70">("all");

  const filtered = useMemo(
    () =>
      filterCommodities({
        stage,
        sector,
        stress,
        minTop1: minTip === "all" ? undefined : Number(minTip),
      }),
    [stage, sector, stress, minTip],
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
              : c.bindingScore,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filtered, metric]);

  const producers = useMemo(() => producerScoreboard(filtered), [filtered]);
  const sectors = useMemo(() => sectorExposures(filtered), [filtered]);
  const hhiDonut = useMemo(() => hhiBandCounts(filtered), [filtered]);

  const stressScatter = useMemo(() => {
    const ids = new Set(filtered.map((c) => c.id));
    return STRESS_SHARE.filter((s) => ids.has(s.id));
  }, [filtered]);

  const flipLines = useMemo(
    () =>
      STAGE_FLIPS.map((f) => ({
        metal: f.label,
        mine: f.mineTop1,
        plant: f.plantTop1,
        gap: f.gapPp,
        priceYoy: f.priceYoyPct,
        fill: f.fill,
      })),
    [],
  );

  const metricLabel =
    metric === "top1"
      ? "Top-1 share %"
      : metric === "top3"
        ? "Top-3 share %"
        : "Binding score";

  return (
    <div
      className="space-y-6"
      data-viz="chokepoint-commodities-concentration-202608"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300/90">
          Chokepoint commodities — Aug 202608 concentration lens
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
          Q3 share ladder held: avg refining (ex-REE) Top-1{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.avgRefineExReePct)}
          </span>
          , Top-3{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.avgRefineTop3Pct)}
          </span>
          . Pink Sheet Jul’26 overlays stress — tin{" "}
          <span className="font-semibold text-white">
            +{HEADLINE.tinYoyPct}%
          </span>{" "}
          YoY, copper{" "}
          <span className="font-semibold text-white">
            +{HEADLINE.cuPriceYoyPct}%
          </span>{" "}
          with smelt Top-1{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.cuSmeltTop1Pct)}
          </span>{" "}
          vs mine{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.cuMineTop1Pct)}
          </span>
          .{" "}
          <span className="font-semibold text-white">
            {HEADLINE.tip70Count}/{HEADLINE.tip70Of}
          </span>{" "}
          stages still clear ≥70% Top-1.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Avg refine Top-1
            </p>
            <p className="text-lg font-bold text-white">
              {fmtPct(HEADLINE.avgRefineExReePct)}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Top-1 ≥ 70%
            </p>
            <p className="text-lg font-bold text-white">
              {HEADLINE.tip70Count}/{HEADLINE.tip70Of}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Cu mine → smelt
            </p>
            <p className="text-lg font-bold text-white">
              {HEADLINE.cuMineTop1Pct}% → {HEADLINE.cuSmeltTop1Pct}%
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Spot Cu TC
            </p>
            <p className="text-lg font-bold text-white">
              ${HEADLINE.cuSpotTcUsd}/t
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
            { id: "binding", label: "Binding tip" },
            { id: "stress", label: "Stress × share" },
            { id: "flips", label: "Mine → plant" },
            { id: "path", label: "Price & HHI" },
          ]}
        />
        <div className="flex flex-wrap gap-3">
          <ToggleGroup
            label="Metric"
            value={metric}
            onChange={setMetric}
            options={[
              { id: "top1", label: "Top-1" },
              { id: "top3", label: "Top-3" },
              { id: "binding", label: "Binding" },
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
              { id: "smelter", label: "Smelter" },
              { id: "export", label: "Export" },
            ]}
          />
          <ToggleGroup
            label="Stress"
            value={stress}
            onChange={setStress}
            options={[
              { id: "all", label: "All" },
              { id: "extreme", label: "Extreme" },
              { id: "high", label: "High" },
              { id: "elevated", label: "Elevated" },
            ]}
          />
          <ToggleGroup
            label="Min Top-1"
            value={minTip}
            onChange={setMinTip}
            options={[
              { id: "all", label: "Any" },
              { id: "50", label: "≥50%" },
              { id: "70", label: "≥70%" },
            ]}
          />
        </div>
      </div>

      {view === "binding" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={`${metricLabel} — ranked tip`}
            subtitle="Q3 shares held; Binding = Top-1 × Aug stress weight"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ladderBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={
                      metric === "binding" ? [0, "auto"] : [0, 100]
                    }
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="shortLabel"
                    width={92}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [
                      typeof v === "number"
                        ? metric === "binding"
                          ? v.toFixed(1)
                          : fmtPct(v, 1)
                        : String(v),
                      metricLabel,
                    ]}
                  />
                  <Bar dataKey="value" radius={[0, 2, 2, 0]}>
                    {ladderBars.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Producer Top-1 seats"
            subtitle="How often each jurisdiction leads a tracked stage"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={producers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" name="Top-1 seats" radius={[4, 4, 0, 0]}>
                    {producers.map((p) => (
                      <Cell key={p.iso} fill={p.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {sectors.map((s) => (
                <div
                  key={s.sector}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    {s.sector}
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    med {fmtPct(s.medianTop1, 1)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {s.extremeCount} ≥70% · {s.hotPriceCount} hot $
                  </p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {view === "stress" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Pink Sheet YoY × Top-1 share"
            subtitle="Price stress overlay — only stages with Jul’26 prints"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="top1"
                    name="Top-1 %"
                    unit="%"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Top-1 share %",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="priceYoy"
                    name="YoY %"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Price YoY %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="binding" range={[60, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      typeof v === "number" ? v.toFixed(1) : String(v),
                      String(name),
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.shortLabel ?? ""
                    }
                  />
                  <Scatter data={stressScatter} name="Stages">
                    {stressScatter.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Hot intersect (Top-1 ≥50% and YoY ≥20%): {HEADLINE.hotIntersectCount}{" "}
              stages — copper, aluminum, tin, metals-index refine basket.
            </p>
          </ChartCard>

          <ChartCard
            title="Concentration curve (Top-1 mass)"
            subtitle="Cumulative Top-1 mass vs equal share — tip heaviness"
          >
            <div className="mb-2">
              <button
                type="button"
                onClick={() => setShowEqual((v) => !v)}
                className={`rounded-md border px-3 py-1 text-xs font-medium ${
                  showEqual
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {showEqual ? "Hide" : "Show"} equal line
              </button>
            </div>
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={CONCENTRATION_CURVE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="rankPct"
                    tick={{ fontSize: 11 }}
                    unit="%"
                  />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="cumTop1MassPct"
                    name="Cum. Top-1 mass"
                    fill={ROSE}
                    fillOpacity={0.2}
                    stroke={ROSE}
                    strokeWidth={2}
                  />
                  {showEqual && (
                    <Line
                      type="monotone"
                      dataKey="equalPct"
                      name="Equal"
                      stroke={SLATE}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "flips" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Mine → plant Top-1 slopes"
            subtitle="Stage concentration jumps — where midstream outruns the pit"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={flipLines}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="metal" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v, name) => [
                      typeof v === "number" ? fmtPct(v, 1) : String(v),
                      name === "mine" ? "Mine Top-1" : "Plant Top-1",
                    ]}
                  />
                  <Bar dataKey="mine" name="mine" fill={SKY} radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="plant"
                    name="plant"
                    fill={ROSE}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-slate-600">
              {STAGE_FLIPS.map((f) => (
                <li key={f.id}>
                  <span className="font-semibold text-slate-800">{f.label}:</span>{" "}
                  {f.mineLabel} {fmtPct(f.mineTop1, 1)} → {f.plantLabel}{" "}
                  {fmtPct(f.plantTop1, 1)} (gap {fmtPct(f.gapPp, 1)})
                  {f.priceYoyPct != null
                    ? ` · price +${f.priceYoyPct}% YoY`
                    : ""}
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title="Copper smelter stress meters"
            subtitle="Capacity share held; Aug fees and cut plan deepen the tip"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={SMELTER_STRESS}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={130}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v, _, item) => [
                      `${v}${item?.payload?.unit ?? ""}`,
                      "Value",
                    ]}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {SMELTER_STRESS.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Spot TC ~${HEADLINE.cuSpotTcUsd}/t vs $0/t 2026 settle; China cut plan{" "}
              {HEADLINE.chinaSmelterCutPct}% — custom smelters pay to process while
              cathode prints +{HEADLINE.cuPriceYoyPct}% YoY.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "path" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Pink Sheet path — copper & metals index"
            subtitle="2025 annual → 2026 Q1 → May peak → July print"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={PRICE_PATH}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11 }}
                    domain={["auto", "auto"]}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="copper"
                    name="Copper $/mt"
                    fill={AMBER}
                    fillOpacity={0.15}
                    stroke={AMBER}
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="metalsIdx"
                    name="Metals idx"
                    stroke={TEAL}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="nickel"
                    name="Nickel $/mt"
                    stroke={SKY}
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="HHI band mix"
            subtitle="How many stages land in each concentration band"
          >
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hhiDonut}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={88}
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
            <ul className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
              {hhiDonut.map((b) => (
                <li key={b.id} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: b.fill }}
                  />
                  {b.label}: {b.count}
                </li>
              ))}
            </ul>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {DOWNSTREAM_RISK.map((r) => (
                <div
                  key={r.id}
                  className="rounded-lg border border-slate-100 px-3 py-2"
                >
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">
                    {r.shortLabel} disruption
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    ${r.riskUsdBn >= 1000 ? `${r.riskUsdBn / 1000}T` : `${r.riskUsdBn}B`}
                  </p>
                  <p className="text-xs text-slate-500">
                    Top-1 {fmtPct(r.top1Pct)}
                  </p>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard
            title="Top-k clearance counts"
            subtitle="Stages clearing each tip threshold (full table)"
          >
            <div className="h-56 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    {
                      k: "Top-1 ≥50%",
                      n: TOP_K_LADDER.filter((t) => t.top1 >= 50).length,
                    },
                    {
                      k: "Top-1 ≥70%",
                      n: TOP_K_LADDER.filter((t) => t.top1 >= 70).length,
                    },
                    {
                      k: "Top-1 ≥85%",
                      n: TOP_K_LADDER.filter((t) => t.top1 >= 85).length,
                    },
                    {
                      k: "Top-3 ≥90%",
                      n: TOP_K_LADDER.filter((t) => t.top3 >= 90).length,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="k" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="n"
                    name="Stages"
                    stroke={ROSE}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
