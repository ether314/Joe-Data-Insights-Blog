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
  EXPORT_CONCENTRATION_CURVE,
  EXPORT_VALUE_SHARES,
  GROWTH_CONCENTRATION_CURVE,
  GROWTH_CONTRIB_Q2_SENS,
  GROWTH_CONTRIB_SHARES,
  GROWTH_Q2_CONCENTRATION_CURVE,
  HARD_DATA_METERS,
  HEADLINE,
  LENS_COMPARE,
  PPP_CONCENTRATION_CURVE,
  PPP_STOCK_SHARES,
  PRICE_LADDER,
  SCOREBOARD,
  SOURCE_NOTE,
  TRADE_CONCENTRATION_CURVE,
  TRADE_GROWTH_SHARES,
  VINTAGE_DELTAS,
  fmtPct,
  fmtPp,
  namedShares,
} from "@/data/macro-growth-trade-concentration-2026q3-data";

// viz-types: vintage delta bars, Lorenz area+line, growth base/Q2 bars, CPB rebound line, trade donut, hard-data dumbbells, price scatter, lens scatter | layout: default

type ViewId = "scoreboard" | "growth" | "trade" | "prices";
type GrowthVintage = "base" | "q2";
type CurveLens = "ppp" | "growth" | "growth-q2" | "trade" | "exports";

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

export function MacroGrowthTradeConcentration2026q3Dashboard() {
  const [view, setView] = useState<ViewId>("scoreboard");
  const [growthVintage, setGrowthVintage] = useState<GrowthVintage>("base");
  const [curveLens, setCurveLens] = useState<CurveLens>("growth");
  const [showEqualLine, setShowEqualLine] = useState(true);

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

  return (
    <div
      className="space-y-6"
      data-viz="macro-growth-trade-concentration-2026q3"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
          Growth, trade & prices — Q3 2026 concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Top-1 growth still ~32% China — Q2 sensitivity only clips it to ~29%,
          while Asia still owns 71% of merchandise trade-growth
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Stock and export ladders are carried from the prior concentration
          print. The Q3 desk adds a hard-data growth sensitivity (China Q2{" "}
          {HEADLINE.chinaGdpQ2Yoy}% YoY, US {HEADLINE.usGdpQ2Saar}% SAAR), a CPB
          May rebound overlay, and Aug CPI/PCE price geometry.
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
              Q2 sens. Top-1
            </p>
            <p className="mt-1 text-xl font-bold text-orange-300">
              {fmtPct(HEADLINE.q2SensTop1GrowthPct)}
            </p>
            <p className="text-xs text-slate-400">
              {fmtPp(HEADLINE.q2SensTop1DeltaPp, 0)}
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
              PPP Top-3
            </p>
            <p className="mt-1 text-xl font-bold text-rose-300">
              {fmtPct(HEADLINE.top3PppSharePct)}
            </p>
            <p className="text-xs text-slate-400">{HEADLINE.top3PppLabel}</p>
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
            { id: "growth", label: "Growth ladder" },
            { id: "trade", label: "Trade + CPB" },
            { id: "prices", label: "Prices" },
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
            title="Prior → Q3 Top-1 restatement"
            subtitle="Most perimeters carried flat; only the Q2 growth sensitivity moves"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={VINTAGE_DELTAS}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 80]}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={130}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      fmtPct(Number(v), 0),
                      name === "priorPct" ? "Prior" : "Q3",
                    ]}
                  />
                  <Bar
                    dataKey="priorPct"
                    name="priorPct"
                    fill="#94a3b8"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar dataKey="q3Pct" name="q3Pct" radius={[0, 4, 4, 0]}>
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
                    fill="#f59e0b33"
                    stroke="#f59e0b"
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
            title="Q3 hard-data vs July IMF path"
            subtitle="Context meters — soft landing still split across trade, growth, prices"
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
            title="CPB merchandise volume rebound"
            subtitle="Mar–May MoM path — flow overlay, not a re-rank of 2025 shares"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={CPB_PATH}
                  margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" domain={[-3, 2]} />
                  <Tooltip
                    formatter={(v) => [
                      `${Number(v).toFixed(1)}% MoM`,
                      "CPB",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="mom"
                    stroke="#0ea5e9"
                    strokeWidth={3}
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
            title="Scoreboard notes"
            subtitle="Confidence by perimeter"
          >
            <ul className="space-y-3 text-sm text-slate-600">
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
            title="Aug price meters"
            subtitle="YoY cooling vs SAAR heat — geometry unchanged"
          >
            <div className="space-y-4 text-sm text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase text-slate-500">
                    US CPI Jul YoY
                  </p>
                  <p className="text-2xl font-bold text-sky-700">
                    {fmtPct(HEADLINE.usCpiJulYoy, 1)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase text-slate-500">
                    US PCE Jun YoY
                  </p>
                  <p className="text-2xl font-bold text-violet-700">
                    {fmtPct(HEADLINE.usPceJunYoy, 1)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase text-slate-500">
                    US PCE Q2 SAAR
                  </p>
                  <p className="text-2xl font-bold text-rose-700">
                    {fmtPct(HEADLINE.usPceQ2Saar, 1)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase text-slate-500">EA HICP Jul</p>
                  <p className="text-2xl font-bold text-indigo-700">
                    {fmtPct(HEADLINE.eaHicpJulYoy, 1)}
                  </p>
                </div>
              </div>
              <p className="leading-relaxed text-slate-600">
                Elevated-CPI economies still account for roughly{" "}
                {fmtPct(HEADLINE.elevatedCpiGdpSharePct)} of world PPP GDP.
                China ({fmtPct(HEADLINE.chinaCpi2025, 1)} CPI) leads growth
                contribution while contributing almost nothing to the global
                price impulse — the soft-landing geometry the concentration lens
                is built to show.
              </p>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
