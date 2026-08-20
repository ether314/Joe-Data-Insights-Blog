"use client";

import { useMemo, useState } from "react";
import {
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
  CHINA_SUPPLIER_SHARE,
  COBOT_SERIES,
  DECADE_INDUSTRY_SHARE,
  DENSITY_LEADERS,
  FLOW_VS_STOCK,
  HEADLINE,
  REGION_YOY,
  SOURCE_NOTE,
  SOURCES,
  deltasFor,
  fmtPct,
  fmtPp,
  fmtUnits,
  fmtYoy,
  marketsFor,
  type DeltaBarRow,
  type MarketYoy,
} from "@/data/industrial-robotics-update-2026-data";

// viz-types: diverging-yoy-bar, decade-dumbbell, dual-axis flow×stock, cobot line, density×yoy scatter | layout: default
// viz-plan: YoY Δ bars; 2014→2024 industry dumbbell; install vs stock dual axis; cobot path; scatter; region + delta-group controls

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

type RegionFilter = MarketYoy["region"] | "All";
type DeltaGroup = DeltaBarRow["group"] | "All";

const COLORS = {
  prior: "#94a3b8",
  neu: "#0f766e",
  up: "#be123c",
  down: "#0369a1",
  stock: "#7c3aed",
  flow: "#0ea5e9",
  cobot: "#ea580c",
  asia: "#f59e0b",
  europe: "#8b5cf6",
  americas: "#0ea5e9",
};

export function IndustrialRoboticsUpdateDashboard() {
  const [region, setRegion] = useState<RegionFilter>("All");
  const [deltaGroup, setDeltaGroup] = useState<DeltaGroup>("All");

  const markets = useMemo(() => marketsFor(region), [region]);
  const deltas = useMemo(() => deltasFor(deltaGroup), [deltaGroup]);

  const marketYoyBars = useMemo(
    () =>
      [...markets]
        .map((m) => ({
          id: m.market,
          label: m.shortLabel,
          value: m.yoyPct,
          fill: m.yoyPct >= 0 ? COLORS.up : COLORS.down,
          units: m.units2024,
          region: m.region,
        }))
        .sort((a, b) => b.value - a.value),
    [markets],
  );

  const deltaBars = useMemo(
    () =>
      [...deltas]
        .map((d) => ({
          id: d.id,
          label: d.label,
          value: d.delta,
          fill: d.delta >= 0 ? COLORS.up : COLORS.down,
          priorValue: d.priorValue,
          newValue: d.newValue,
          priorLabel: d.priorLabel,
          newLabel: d.newLabel,
          unit: d.unit,
        }))
        .sort((a, b) => b.value - a.value),
    [deltas],
  );

  const decadeDumbbell = useMemo(
    () =>
      DECADE_INDUSTRY_SHARE.map((r) => ({
        label: r.shortLabel,
        prior: r.share2014,
        neu: r.share2024,
        delta: r.share2024 - r.share2014,
      })),
    [],
  );

  const flowStock = useMemo(
    () =>
      FLOW_VS_STOCK.map((r) => ({
        year: String(r.year) + (r.forecast ? "f" : ""),
        installations: r.installations,
        stockM: r.stockM,
        installYoy: r.installYoyPct,
        stockYoy: r.stockYoyPct,
      })),
    [],
  );

  const cobotLine = useMemo(
    () =>
      COBOT_SERIES.map((r) => ({
        year: String(r.year),
        units: r.units,
        share: r.sharePct,
      })),
    [],
  );

  const scatter = useMemo(() => {
    return MARKET_YOY_SCATTER();
  }, []);

  const densityBars = useMemo(
    () =>
      DENSITY_LEADERS.map((d) => ({
        label: d.shortLabel,
        density: d.density2024,
        fill:
          d.region === "Asia"
            ? COLORS.asia
            : d.region === "Europe"
              ? COLORS.europe
              : COLORS.americas,
      })),
    [],
  );

  const chinaSupplier = useMemo(
    () => CHINA_SUPPLIER_SHARE.map((r) => ({ year: String(r.year), domestic: r.domesticPct })),
    [],
  );

  return (
    <div className="space-y-6" data-viz="industrial-robotics-update-2026">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — research print (IFR WR 2025 levels) → YoY / density / cobot refresh
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Industrial robot installations — IFR World Robotics 2025 update
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          World flow held near flat ({fmtUnits(HEADLINE.worldUnits2024)}; {fmtYoy(HEADLINE.worldYoyPct, 1)})
          while operational stock rose {fmtYoy(HEADLINE.worldStockYoyPct)}. Asia installations{" "}
          {fmtYoy(HEADLINE.asiaYoyPct)}; Europe {fmtYoy(HEADLINE.europeYoyPct)}; Americas{" "}
          {fmtYoy(HEADLINE.americasYoyPct)}. Cobots {fmtYoy(HEADLINE.cobotsYoyPct)} to{" "}
          {fmtUnits(HEADLINE.cobots2024)} ({HEADLINE.cobotSharePct2024}% of installs).
        </p>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Market region
            </span>
            {(
              [
                ["All", "All"],
                ["Asia", "Asia"],
                ["Europe", "Europe"],
                ["Americas", "Americas"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setRegion(id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  region === id
                    ? "bg-amber-800 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Delta group
            </span>
            {(
              [
                ["All", "All Δ"],
                ["Markets", "Markets"],
                ["Regions", "Regions"],
                ["Structure", "Structure"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setDeltaGroup(id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  deltaGroup === id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Market YoY installations (2023→2024)"
          subtitle="Diverging % change — filter with Market region"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart
                data={marketYoyBars}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={100}
                  tick={{ fill: "#334155", fontSize: 10, fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as (typeof marketYoyBars)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.label}</p>
                        <p className="text-slate-500">{row.region}</p>
                        <p className="text-slate-700">2024 units: {fmtUnits(row.units)}</p>
                        <p className="font-medium text-slate-900">YoY {fmtYoy(row.value)}</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={26}>
                  {marketYoyBars.map((d) => (
                    <Cell key={d.id} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Vintage change bars"
          subtitle="Filter Delta group — markets, regions, or structure"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart
                data={deltaBars}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={148}
                  tick={{ fill: "#334155", fontSize: 10, fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as (typeof deltaBars)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.label}</p>
                        <p className="text-slate-500">
                          {row.priorLabel}: {row.priorValue}
                          {row.unit === "units" ? "" : row.unit === "pp" ? "%" : "%"}
                        </p>
                        <p className="text-slate-700">
                          {row.newLabel}: {row.newValue}
                          {row.unit === "units" ? "" : "%"}
                        </p>
                        <p className="font-medium text-slate-900">
                          Δ {row.value > 0 ? "+" : ""}
                          {row.value}
                          {row.unit === "pp" ? " pp" : "%"}
                        </p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
                  {deltaBars.map((d) => (
                    <Cell key={d.id} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Decade industry mix: 2014 → 2024"
          subtitle="General industries absorb automotive’s lost share"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart
                data={decadeDumbbell}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 60]}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={100}
                  tick={{ fill: "#334155", fontSize: 11, fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as (typeof decadeDumbbell)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.label}</p>
                        <p className="text-slate-500">2014: {fmtPct(row.prior)}</p>
                        <p className="text-teal-800">2024: {fmtPct(row.neu)}</p>
                        <p className="font-medium">{fmtPp(row.delta)}</p>
                      </div>
                    );
                  }}
                />
                <Legend />
                <Bar dataKey="prior" name="2014" fill={COLORS.prior} radius={[0, 4, 4, 0]} maxBarSize={14} />
                <Bar dataKey="neu" name="2024" fill={COLORS.neu} radius={[0, 4, 4, 0]} maxBarSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Flow plateau vs stock compounding"
          subtitle="Annual installations (bars) vs operational stock millions (line)"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <ComposedChart data={flowStock} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fill: "#334155", fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => fmtUnits(Number(v))}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${v}M`}
                  domain={[3, 5.5]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as (typeof flowStock)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.year}</p>
                        <p>Installs: {fmtUnits(row.installations)}</p>
                        <p>Stock: {row.stockM}M</p>
                        {row.installYoy != null && <p>Install YoY: {fmtYoy(row.installYoy, 1)}</p>}
                        {row.stockYoy != null && <p>Stock YoY: {fmtYoy(row.stockYoy)}</p>}
                      </div>
                    );
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="installations"
                  name="Installations"
                  fill={COLORS.flow}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="stockM"
                  name="Stock (M)"
                  stroke={COLORS.stock}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Collaborative robots path"
          subtitle="Cobot units rose +12% in 2024 to 64,500 (~12% of all installs)"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <ComposedChart data={cobotLine} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fill: "#334155", fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => fmtUnits(Number(v))}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 20]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as (typeof cobotLine)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold">{row.year}</p>
                        <p>Cobots: {fmtUnits(row.units)}</p>
                        {row.share != null && <p>Share of installs: {fmtPct(row.share)}</p>}
                      </div>
                    );
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="units"
                  name="Cobot units"
                  fill={COLORS.cobot}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="share"
                  name="Share %"
                  stroke="#9a3412"
                  strokeWidth={2}
                  connectNulls={false}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Robot density leaders (per 10k workers)"
          subtitle={`World average ${HEADLINE.densityWorld2024}; Asia ${HEADLINE.densityAsia2024}, Europe ${HEADLINE.densityEurope2024}, Americas ${HEADLINE.densityAmericas2024}`}
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={densityBars} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fill: "#334155", fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [`${Number(value).toLocaleString()} / 10k`, "Density"]}
                  contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }}
                />
                <ReferenceLine
                  y={HEADLINE.densityWorld2024}
                  stroke="#64748b"
                  strokeDasharray="4 4"
                  label={{ value: "World avg", fill: "#64748b", fontSize: 10 }}
                />
                <Bar dataKey="density" radius={[4, 4, 0, 0]} maxBarSize={36}>
                  {densityBars.map((d) => (
                    <Cell key={d.label} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Installations × YoY scatter"
          subtitle="Bubble size ≈ 2024 units — growth vs contraction by market"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="units"
                  name="2024 units"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => fmtUnits(Number(v))}
                  scale="log"
                  domain={["auto", "auto"]}
                />
                <YAxis
                  type="number"
                  dataKey="yoy"
                  name="YoY %"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as {
                      name: string;
                      units: number;
                      yoy: number;
                      region: string;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold">{row.name}</p>
                        <p className="text-slate-500">{row.region}</p>
                        <p>{fmtUnits(row.units)} units · {fmtYoy(row.yoy)}</p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatter} fill={COLORS.neu}>
                  {scatter.map((d) => (
                    <Cell
                      key={d.name}
                      fill={
                        d.region === "Asia"
                          ? COLORS.asia
                          : d.region === "Europe"
                            ? COLORS.europe
                            : COLORS.americas
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="China domestic supplier share"
          subtitle="Home-market share of Chinese robot makers — 28% (2014) → 57% (2024)"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <ComposedChart data={chinaSupplier} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fill: "#334155", fontSize: 12 }} />
                <YAxis
                  domain={[0, 70]}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value) => fmtPct(Number(value))}
                  contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }}
                />
                <ReferenceLine y={50} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: "50%", fill: "#64748b", fontSize: 10 }} />
                <Bar dataKey="domestic" name="Domestic %" fill={COLORS.asia} radius={[4, 4, 0, 0]} maxBarSize={44} />
                <Line type="monotone" dataKey="domestic" stroke="#b45309" strokeWidth={2} dot={{ r: 4 }} legendType="none" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Regional snapshot (2024)</p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-3">
          {REGION_YOY.map((r) => (
            <li key={r.region} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <span className="font-semibold" style={{ color: r.color }}>
                {r.shortLabel}
              </span>
              <span className="block text-slate-700">
                {fmtUnits(r.units2024)} · {fmtPct(r.sharePct)} · {fmtYoy(r.yoyPct)}
              </span>
              <span className="block text-xs text-slate-500">
                Density {r.density2024}/10k · CAGR {fmtYoy(r.densityCagr2019_24)} (2019–24)
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          Sources:{" "}
          {SOURCES.map((s, i) => (
            <span key={s.url}>
              {i > 0 && " · "}
              <a href={s.url} className="underline hover:text-slate-800" target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

function MARKET_YOY_SCATTER() {
  return marketsFor("All").map((m) => ({
    name: m.shortLabel,
    units: m.units2024,
    yoy: m.yoyPct,
    z: Math.max(40, Math.sqrt(m.units2024)),
    region: m.region,
  }));
}
