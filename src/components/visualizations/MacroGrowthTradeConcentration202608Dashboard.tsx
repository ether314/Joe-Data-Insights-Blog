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
  CPB_PATH,
  DUAL_INFLATION,
  EXPORT_CONCENTRATION_CURVE,
  EXPORT_VALUE_SHARES,
  GROWTH_CONCENTRATION_CURVE,
  GROWTH_CONTRIB_Q2_SENS,
  GROWTH_CONTRIB_SHARES,
  GROWTH_Q2_CONCENTRATION_CURVE,
  HARD_DATA_METERS,
  HEADLINE,
  LENS_COMPARE,
  PENDING_METERS,
  PPP_CONCENTRATION_CURVE,
  PPP_STOCK_SHARES,
  PRICE_COOLING_PATH,
  PRICE_LADDER,
  SCOREBOARD,
  SOURCE_NOTE,
  TRADE_CONCENTRATION_CURVE,
  TRADE_GROWTH_SHARES,
  VINTAGE_DELTAS,
  fmtPct,
  fmtPp,
  namedShares,
} from "@/data/macro-growth-trade-concentration-202608-data";

// viz-types: Q3→Aug vintage bars, Lorenz area+line, price-cooling paired bars, dual-inflation composed, trade donut, CPB line+pending, growth ladders, price scatter, lens scatter | layout: default

type ViewId = "scoreboard" | "prices" | "growth" | "trade";
type GrowthVintage = "base" | "q2";
type CurveLens = "ppp" | "growth" | "growth-q2" | "trade" | "exports";
type PricePanel = "cooling" | "dual";

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

export function MacroGrowthTradeConcentration202608Dashboard() {
  const [view, setView] = useState<ViewId>("scoreboard");
  const [growthVintage, setGrowthVintage] = useState<GrowthVintage>("base");
  const [curveLens, setCurveLens] = useState<CurveLens>("growth");
  const [showEqualLine, setShowEqualLine] = useState(true);
  const [pricePanel, setPricePanel] = useState<PricePanel>("cooling");

  const growthRows = useMemo(
    () =>
      namedShares(
        growthVintage === "q2" ? GROWTH_CONTRIB_Q2_SENS : GROWTH_CONTRIB_SHARES,
      ),
    [growthVintage],
  );

  const growthBars = useMemo(
    () => [...growthRows].sort((a, b) => b.sharePct - a.sharePct),
    [growthRows],
  );

  const pppBars = useMemo(
    () =>
      [...namedShares(PPP_STOCK_SHARES)].sort((a, b) => b.sharePct - a.sharePct),
    [],
  );

  const exportNamed = useMemo(() => namedShares(EXPORT_VALUE_SHARES), []);

  const curve = useMemo(() => {
    if (curveLens === "ppp") return PPP_CONCENTRATION_CURVE;
    if (curveLens === "growth-q2") return GROWTH_Q2_CONCENTRATION_CURVE;
    if (curveLens === "trade") return TRADE_CONCENTRATION_CURVE;
    if (curveLens === "exports") return EXPORT_CONCENTRATION_CURVE;
    return GROWTH_CONCENTRATION_CURVE;
  }, [curveLens]);

  const lensScatter = useMemo(
    () =>
      LENS_COMPARE.map((l) => ({
        ...l,
        x: l.top1Pct,
        y: l.top3Pct,
        z: Math.max(12, l.top3Pct / 2),
      })),
    [],
  );

  const priceScatter = useMemo(
    () =>
      PRICE_LADDER.map((p) => ({
        ...p,
        x: p.cpiYoy,
        y: p.gdp2025,
        z: Math.max(10, p.pppSharePct * 2),
      })),
    [],
  );

  const hardDumbbells = useMemo(
    () =>
      HARD_DATA_METERS.map((m) => ({
        ...m,
        gap: m.hardSignal - m.julyPath,
      })),
    [],
  );

  const tradePie = useMemo(
    () =>
      TRADE_GROWTH_SHARES.map((r) => ({
        name: r.short,
        value: r.sharePct,
        fill: r.fill,
      })),
    [],
  );

  const cpbChart = useMemo(
    () =>
      CPB_PATH.map((p) => ({
        ...p,
        momPlot: p.mom ?? 0,
        isPending: Boolean(p.pending),
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="macro-growth-trade-concentration-202608"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">
          Growth, trade & prices — August 2026 concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Share architecture still flat vs Q3 — Top-1 growth ~32% / Asia trade
          71% — while Aug CPI cools and two flow meters stay pending
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Stock, export, and trade-growth ladders are carried from the Q3
          concentration lens. August adds a price-cooling path (US CPI{" "}
          {fmtPct(HEADLINE.usCpiJulYoy, 1)}, PCE {fmtPct(HEADLINE.usPceJunYoy, 1)}
          ), a YoY-vs-SAAR dual meter, and explicit pending rows for CPB June and
          the BEA Q2 second estimate.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/10 px-3 py-3 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Growth Top-1
            </p>
            <p className="mt-1 text-xl font-bold text-amber-300">
              {fmtPct(HEADLINE.top1GrowthContribPct)}
            </p>
            <p className="text-xs text-slate-400">
              {HEADLINE.top1GrowthContribLabel}
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-3 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Trade-growth Top-1
            </p>
            <p className="mt-1 text-xl font-bold text-sky-300">
              {fmtPct(HEADLINE.top1TradeGrowthSharePct)}
            </p>
            <p className="text-xs text-slate-400">
              {HEADLINE.top1TradeGrowthLabel}
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-3 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              US CPI Jul
            </p>
            <p className="mt-1 text-xl font-bold text-violet-300">
              {fmtPct(HEADLINE.usCpiJulYoy, 1)}
            </p>
            <p className="text-xs text-slate-400">
              {fmtPp(HEADLINE.usCpiDeltaPp)} vs Jun
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-3 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Elevated-CPI GDP
            </p>
            <p className="mt-1 text-xl font-bold text-rose-300">
              {fmtPct(HEADLINE.elevatedCpiGdpSharePct)}
            </p>
            <p className="text-xs text-slate-400">≥~3.4% CPI band</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "scoreboard", label: "Scoreboard" },
            { id: "prices", label: "Prices" },
            { id: "growth", label: "Growth ladder" },
            { id: "trade", label: "Trade + pending" },
          ]}
        />
        <ToggleGroup
          label="Growth vintage"
          value={growthVintage}
          onChange={setGrowthVintage}
          options={[
            { id: "base", label: "2025 base" },
            { id: "q2", label: "Q2 sensitivity" },
          ]}
        />
      </div>

      {view === "scoreboard" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Q3 → Aug Top-1 / price restatement"
            subtitle="Share perimeters carried flat; Aug work is price meters + pending flags"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={VINTAGE_DELTAS}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 80]} tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={140}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      fmtPct(Number(v), 1),
                      name === "q3Pct" ? "Q3" : "Aug",
                    ]}
                  />
                  <Bar dataKey="q3Pct" name="q3Pct" fill="#94a3b8" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="augPct" name="augPct" radius={[0, 4, 4, 0]}>
                    {VINTAGE_DELTAS.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Perimeter scoreboard — Top-1 vs Top-3"
            subtitle="Cross-lens scatter; bubble size tracks Top-3"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Top-1"
                    unit="%"
                    domain={[0, 80]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Top-1 %",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Top-3"
                    unit="%"
                    domain={[20, 100]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Top-3 %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      typeof v === "number" ? fmtPct(Number(v), 0) : v,
                      name,
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.label ?? ""
                    }
                  />
                  <Scatter data={lensScatter}>
                    {lensScatter.map((l) => (
                      <Cell key={l.id} fill={l.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Cumulative share vs equal split"
            subtitle="Lorenz-style concentration curves by perimeter"
          >
            <div className="mb-3 flex flex-wrap gap-3">
              <ToggleGroup
                label="Curve"
                value={curveLens}
                onChange={setCurveLens}
                options={[
                  { id: "growth", label: "Growth" },
                  { id: "growth-q2", label: "Growth Q2" },
                  { id: "ppp", label: "PPP stock" },
                  { id: "trade", label: "Trade" },
                  { id: "exports", label: "Exports" },
                ]}
              />
              <ToggleGroup
                label="Equal split"
                value={showEqualLine ? "on" : "off"}
                onChange={(v) => setShowEqualLine(v === "on")}
                options={[
                  { id: "on", label: "Show" },
                  { id: "off", label: "Hide" },
                ]}
              />
            </div>
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={curve}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip
                    formatter={(v, name) => [
                      fmtPct(Number(v), 1),
                      name === "cumulativeSharePct"
                        ? "Cumulative"
                        : "Equal split",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativeSharePct"
                    fill="#8b5cf633"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                  />
                  {showEqualLine && (
                    <Line
                      type="monotone"
                      dataKey="equalSharePct"
                      stroke="#94a3b8"
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Hard-data vs July IMF path"
            subtitle="Context meters — Aug still split across cooler YoY and hotter SAAR"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={hardDumbbells}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={120}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
                      name === "julyPath" ? "July path" : "Hard signal",
                    ]}
                  />
                  <Bar
                    dataKey="julyPath"
                    name="julyPath"
                    fill="#cbd5e1"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="hardSignal"
                    name="hardSignal"
                    radius={[0, 4, 4, 0]}
                  >
                    {hardDumbbells.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "prices" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="CPI vs growth — price dispersion"
            subtitle="Bubble size = PPP stock share; China leads growth with near-zero CPI"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="CPI"
                    unit="%"
                    domain={[0, 5.5]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "CPI YoY %",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="GDP"
                    unit="%"
                    domain={[0, 8.5]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "GDP %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
                      name === "x" ? "CPI" : name === "y" ? "GDP" : name,
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.label ?? ""
                    }
                  />
                  <Scatter data={priceScatter}>
                    {priceScatter.map((p) => (
                      <Cell key={p.id} fill={p.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title={
              pricePanel === "cooling"
                ? "August price-cooling path"
                : "YoY vs SAAR / IMF dual meter"
            }
            subtitle={
              pricePanel === "cooling"
                ? "Prior month → latest YoY; US cools, EA edges hotter"
                : "Unit mismatch is the story — not a share rewrite"
            }
          >
            <div className="mb-3">
              <ToggleGroup
                label="Price panel"
                value={pricePanel}
                onChange={setPricePanel}
                options={[
                  { id: "cooling", label: "Cooling path" },
                  { id: "dual", label: "YoY vs SAAR" },
                ]}
              />
            </div>
            {pricePanel === "cooling" ? (
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={PRICE_COOLING_PATH}
                    margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip
                      formatter={(v, name) => [
                        `${Number(v).toFixed(1)}%`,
                        name === "priorYoy" ? "Prior" : "Latest",
                      ]}
                    />
                    <Bar dataKey="priorYoy" name="priorYoy" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="latestYoy" name="latestYoy" radius={[4, 4, 0, 0]}>
                      {PRICE_COOLING_PATH.map((d) => (
                        <Cell key={d.id} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={DUAL_INFLATION}
                    margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 9 }} interval={0} />
                    <YAxis tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip
                      formatter={(v, name) => [
                        `${Number(v).toFixed(1)}%`,
                        name === "yoy" ? "YoY" : "SAAR / IMF",
                      ]}
                    />
                    <Bar dataKey="yoy" name="yoy" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="saarOrImf" name="saarOrImf" radius={[4, 4, 0, 0]}>
                      {DUAL_INFLATION.map((d) => (
                        <Cell key={d.id} fill={d.fill} />
                      ))}
                    </Bar>
                    <Line
                      type="monotone"
                      dataKey="spreadPp"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Elevated-CPI economies still account for roughly{" "}
              {fmtPct(HEADLINE.elevatedCpiGdpSharePct)} of world PPP GDP. China (
              {fmtPct(HEADLINE.chinaCpi2025, 1)} CPI) leads growth contribution
              while contributing almost nothing to the global price impulse.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "growth" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={
              growthVintage === "q2"
                ? "Q2 sensitivity — world PPP growth contribution"
                : "World PPP growth contribution ladder"
            }
            subtitle={
              growthVintage === "q2"
                ? "Illustrative run-rate using China 4.3% YoY and US 1.5% SAAR"
                : "Carried 2025 weight × growth / world growth"
            }
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={growthBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 35]}
                    tick={{ fontSize: 11 }}
                    unit="%"
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={40}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [
                      fmtPct(Number(v), 1),
                      "Share of world growth",
                    ]}
                    labelFormatter={(_, p) => p?.[0]?.payload?.label ?? ""}
                  />
                  <Bar dataKey="sharePct" radius={[0, 4, 4, 0]}>
                    {growthBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="PPP GDP stock ladder"
            subtitle="Carried ~2025 weights — China · US · India = 42% Top-3"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pppBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 22]}
                    tick={{ fontSize: 11 }}
                    unit="%"
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={40}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [
                      fmtPct(Number(v), 1),
                      "PPP stock share",
                    ]}
                    labelFormatter={(_, p) => p?.[0]?.payload?.label ?? ""}
                  />
                  <Bar dataKey="sharePct" radius={[0, 4, 4, 0]}>
                    {pppBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "trade" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Merchandise trade-growth contribution"
            subtitle="WTO 2025 regional decomposition — Asia 71% / 3.2 pp"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tradePie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {tradePie.map((s) => (
                      <Cell key={s.name} fill={s.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [
                      fmtPct(Number(v), 0),
                      "Share of vol. growth",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="CPB merchandise volume — May held, June pending"
            subtitle="Mar–May MoM path; June due 25 Aug is a flow overlay, not a share re-rank"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={cpbChart}
                  margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" domain={[-3, 2]} />
                  <Tooltip
                    formatter={(v, _n, item) => {
                      const pending = item?.payload?.isPending;
                      if (pending) return ["pending 25 Aug", "CPB June"];
                      return [`${Number(v).toFixed(1)}% MoM`, "CPB"];
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="momPlot"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    connectNulls={false}
                    dot={{ r: 5, fill: "#0ea5e9" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Goods export value shares"
            subtitle="China · US · Germany = 29% Top-3 of ~$26.3T merch exports"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={exportNamed}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip
                    formatter={(v) => [
                      fmtPct(Number(v), 1),
                      "Export value share",
                    ]}
                    labelFormatter={(_, p) => p?.[0]?.payload?.label ?? ""}
                  />
                  <Bar dataKey="sharePct" radius={[4, 4, 0, 0]}>
                    {exportNamed.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Pending flow meters"
            subtitle="What Aug cannot yet restate on the concentration scoreboard"
          >
            <ul className="space-y-4 text-sm text-slate-600">
              {PENDING_METERS.map((m) => (
                <li
                  key={m.id}
                  className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-slate-800">{m.label}</p>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                      style={{ background: m.fill }}
                    >
                      {m.dueDate}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Held: {m.heldSignal} — {m.note}
                  </p>
                </li>
              ))}
              {SCOREBOARD.map((s) => (
                <li
                  key={s.id}
                  className="flex gap-3 border-b border-slate-100 pb-2"
                >
                  <span
                    className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: s.color }}
                  />
                  <div>
                    <p className="font-semibold text-slate-800">
                      {s.label}: Top-1 {fmtPct(s.top1Pct)} · Top-3{" "}
                      {fmtPct(s.top3Pct)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {s.confidence} — {s.note}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
