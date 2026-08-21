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
  EXPORT_CONCENTRATION_CURVE,
  EXPORT_VALUE_SHARES,
  GROWTH_CONCENTRATION_CURVE,
  GROWTH_CONTRIB_SHARES,
  HEADLINE,
  LENS_COMPARE,
  PPP_CONCENTRATION_CURVE,
  PPP_STOCK_SHARES,
  PRICE_LADDER,
  SOURCE_NOTE,
  TRADE_CONCENTRATION_CURVE,
  TRADE_GROWTH_SHARES,
  TRIAD_PATH,
  fmtPct,
  fmtPp,
  fmtTn,
  namedShares,
} from "@/data/macro-growth-trade-concentration-2026-data";

// viz-types: Lorenz area+line, ranked bars, export pie, lens scatter, price scatter, triad lines | layout: default

type ViewId = "ppp" | "growth" | "trade" | "exports";
type LadderMetric = "sharePct" | "secondary" | "cumulative";
type CurveLens = "ppp" | "growth" | "trade" | "exports";

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

export function MacroGrowthTradeConcentrationDashboard() {
  const [view, setView] = useState<ViewId>("growth");
  const [ladderMetric, setLadderMetric] = useState<LadderMetric>("sharePct");
  const [curveLens, setCurveLens] = useState<CurveLens>("growth");
  const [showEqualLine, setShowEqualLine] = useState(true);

  const pppNamed = useMemo(() => namedShares(PPP_STOCK_SHARES), []);
  const growthNamed = useMemo(() => namedShares(GROWTH_CONTRIB_SHARES), []);
  const exportNamed = useMemo(() => namedShares(EXPORT_VALUE_SHARES), []);

  const sortRows = <T extends { sharePct: number; cumulativeSharePct: number; secondary: number }>(
    rows: T[],
  ) => {
    const copy = [...rows];
    if (ladderMetric === "secondary") {
      return copy.sort((a, b) => b.secondary - a.secondary);
    }
    if (ladderMetric === "cumulative") {
      return copy.sort((a, b) => b.cumulativeSharePct - a.cumulativeSharePct);
    }
    return copy.sort((a, b) => b.sharePct - a.sharePct);
  };

  const pppBars = useMemo(() => sortRows(pppNamed), [pppNamed, ladderMetric]);
  const growthBars = useMemo(
    () => sortRows(growthNamed),
    [growthNamed, ladderMetric],
  );
  const exportBars = useMemo(
    () => sortRows(exportNamed),
    [exportNamed, ladderMetric],
  );

  const tradeBars = useMemo(() => {
    const rows = [...TRADE_GROWTH_SHARES];
    if (ladderMetric === "secondary") {
      return rows.sort((a, b) => b.merchImport2026f - a.merchImport2026f);
    }
    if (ladderMetric === "cumulative") {
      return rows.sort((a, b) => b.cumulativeSharePct - a.cumulativeSharePct);
    }
    return rows.sort((a, b) => b.sharePct - a.sharePct);
  }, [ladderMetric]);

  const curve = useMemo(() => {
    if (curveLens === "ppp") return PPP_CONCENTRATION_CURVE;
    if (curveLens === "trade") return TRADE_CONCENTRATION_CURVE;
    if (curveLens === "exports") return EXPORT_CONCENTRATION_CURVE;
    return GROWTH_CONCENTRATION_CURVE;
  }, [curveLens]);

  const exportPie = useMemo(
    () =>
      exportNamed.slice(0, 5).map((r) => ({
        name: r.short,
        value: r.sharePct,
        fill: r.fill,
        label: r.label,
      })),
    [exportNamed],
  );

  const lensScatter = useMemo(
    () =>
      LENS_COMPARE.map((l) => ({
        ...l,
        x: l.top1Pct,
        y: l.top3Pct,
        z: Math.max(14, l.top3Pct / 2.5),
      })),
    [],
  );

  const priceScatter = useMemo(
    () =>
      PRICE_LADDER.map((p) => ({
        ...p,
        x: p.cpiYoy,
        y: p.gdp2025,
        z: Math.max(10, p.pppSharePct * 2.5),
      })),
    [],
  );

  const barValue = (row: {
    sharePct: number;
    cumulativeSharePct: number;
    secondary?: number;
    merchImport2026f?: number;
  }) => {
    if (ladderMetric === "secondary") {
      return row.merchImport2026f ?? row.secondary ?? 0;
    }
    if (ladderMetric === "cumulative") return row.cumulativeSharePct;
    return row.sharePct;
  };

  const barLabel =
    ladderMetric === "secondary"
      ? view === "trade"
        ? "2026f import vol. %"
        : "GDP / volume %"
      : ladderMetric === "cumulative"
        ? "Cumulative %"
        : "Share %";

  return (
    <div
      className="space-y-6"
      data-viz="macro-growth-trade-concentration-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
          Growth, trade & prices — concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          China takes ~{HEADLINE.top1GrowthContribPct}% of world PPP growth;
          Asia alone is {HEADLINE.top1TradeGrowthSharePct}% of merchandise
          trade-volume growth
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Four market-share lenses on the same macro triad: PPP GDP stock,
          contribution to world growth, regional merchandise trade-volume
          growth, and goods-export value. Growth and trade concentrate far more
          than the stock of output — and China&apos;s near-zero CPI sits beside
          the thickest growth contribution.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/10 px-3 py-3 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Top-1 growth contrib.
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
              Top-3 growth contrib.
            </p>
            <p className="mt-1 text-xl font-bold text-sky-300">
              {fmtPct(HEADLINE.top3GrowthContribPct)}
            </p>
            <p className="text-xs text-slate-400">
              {HEADLINE.top3GrowthContribLabel}
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-3 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Asia trade-growth share
            </p>
            <p className="mt-1 text-xl font-bold text-rose-300">
              {fmtPct(HEADLINE.top1TradeGrowthSharePct)}
            </p>
            <p className="text-xs text-slate-400">
              {fmtPp(HEADLINE.top1TradeGrowthPp)} of {HEADLINE.merchVolume2025}%
              vol.
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-3 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Top-1 PPP stock
            </p>
            <p className="mt-1 text-xl font-bold text-emerald-300">
              {fmtPct(HEADLINE.top1PppSharePct)}
            </p>
            <p className="text-xs text-slate-400">{HEADLINE.top1PppLabel}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "growth", label: "Growth contribution" },
            { id: "ppp", label: "PPP stock" },
            { id: "trade", label: "Trade-growth regions" },
            { id: "exports", label: "Export value" },
          ]}
        />
        <ToggleGroup
          label="Metric"
          value={ladderMetric}
          onChange={setLadderMetric}
          options={[
            { id: "sharePct", label: "Share %" },
            {
              id: "secondary",
              label: view === "trade" ? "Import 2026f" : "GDP / volume",
            },
            { id: "cumulative", label: "Cumulative" },
          ]}
        />
      </div>

      {view === "growth" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="World PPP growth contribution ladder"
            subtitle={`Share of 2025 world PPP growth — ${barLabel}`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={growthBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={40}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      ladderMetric === "secondary"
                        ? `${Number(v).toFixed(1)}%`
                        : fmtPct(Number(v), 1)
                    }
                  />
                  <Bar dataKey={(r) => barValue(r)} radius={[0, 4, 4, 0]}>
                    {growthBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Price × growth scatter"
            subtitle="Bubble size ≈ PPP weight — China is fast growth, near-zero CPI"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="CPI YoY"
                    tick={{ fontSize: 11 }}
                    unit="%"
                    label={{
                      value: "CPI YoY %",
                      position: "insideBottom",
                      offset: -2,
                      style: { fontSize: 11, fill: SLATE },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="GDP %"
                    tick={{ fontSize: 11 }}
                    unit="%"
                    label={{
                      value: "GDP 2025 %",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 11, fill: SLATE },
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} />
                  <Tooltip
                    formatter={(_v, _n, p) => [
                      `CPI ${p.payload.cpiYoy}% · GDP ${p.payload.gdp2025}% · PPP ${p.payload.pppSharePct}%`,
                      p.payload.label,
                    ]}
                  />
                  <Scatter data={priceScatter}>
                    {priceScatter.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "ppp" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="World PPP GDP stock ladder"
            subtitle={`Share of world PPP GDP — ${barLabel}`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pppBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={40}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      ladderMetric === "secondary"
                        ? `${Number(v).toFixed(1)}%`
                        : fmtPct(Number(v), 1)
                    }
                  />
                  <Bar dataKey={(r) => barValue(r)} radius={[0, 4, 4, 0]}>
                    {pppBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="GDP · trade · CPI triad path"
            subtitle="World levels — concentration sits inside these aggregates"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={TRIAD_PATH}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="worldGdp"
                    name="World GDP PPP"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="merchVolume"
                    name="Merch volume"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="worldCpi"
                    name="World CPI"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "trade" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Regional merchandise trade-growth shares"
            subtitle={`WTO 2025 volume growth decomposition — ${barLabel}`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={tradeBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={64}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, p) => [
                      ladderMetric === "secondary"
                        ? `${Number(v).toFixed(1)}% import 2026f`
                        : `${fmtPct(Number(v), 0)} · ${fmtPp(p.payload.pp2025)}`,
                      p.payload.label,
                    ]}
                  />
                  <Bar
                    dataKey={(r) =>
                      ladderMetric === "secondary"
                        ? r.merchImport2026f
                        : ladderMetric === "cumulative"
                          ? r.cumulativeSharePct
                          : r.sharePct
                    }
                    radius={[0, 4, 4, 0]}
                  >
                    {tradeBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Top-1 / top-3 across lenses"
            subtitle="Trade-growth top-1 (Asia 71%) dwarfs PPP stock top-1 (China ~19%)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Top-1 %"
                    tick={{ fontSize: 11 }}
                    domain={[0, 80]}
                    label={{
                      value: "Top-1 share %",
                      position: "insideBottom",
                      offset: -2,
                      style: { fontSize: 11, fill: SLATE },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Top-3 %"
                    tick={{ fontSize: 11 }}
                    domain={[20, 100]}
                    label={{
                      value: "Top-3 share %",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 11, fill: SLATE },
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 360]} />
                  <Tooltip
                    formatter={(_v, _n, p) => [
                      `Top-1 ${p.payload.top1Pct}% (${p.payload.top1Name}) · Top-3 ${p.payload.top3Pct}%`,
                      p.payload.label,
                    ]}
                  />
                  <Scatter data={lensScatter}>
                    {lensScatter.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "exports" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Merchandise export value ladder"
            subtitle={`${fmtTn(HEADLINE.merchValueTn2025)} world merch exports — ${barLabel}`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={exportBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={40}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      ladderMetric === "secondary"
                        ? `${Number(v).toFixed(1)}%`
                        : fmtPct(Number(v), 1)
                    }
                  />
                  <Bar dataKey={(r) => barValue(r)} radius={[0, 4, 4, 0]}>
                    {exportBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Top-5 exporter pie"
            subtitle="China alone is ~14% of world merchandise export value"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={exportPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {exportPie.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, p) => [
                      fmtPct(Number(v), 1),
                      p.payload.label,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
              {exportPie.map((d) => (
                <span key={d.name} className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: d.fill }}
                  />
                  {d.name} {fmtPct(d.value, 1)}
                </span>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      <ChartCard
        title="Cumulative share vs equal split"
        subtitle="How fast top-k captures the distribution — growth and trade steepen faster than PPP stock"
      >
        <div className="mb-3 flex flex-wrap items-center gap-4">
          <ToggleGroup
            label="Curve"
            value={curveLens}
            onChange={setCurveLens}
            options={[
              { id: "growth", label: "Growth" },
              { id: "ppp", label: "PPP stock" },
              { id: "trade", label: "Trade growth" },
              { id: "exports", label: "Exports" },
            ]}
          />
          <button
            type="button"
            onClick={() => setShowEqualLine((v) => !v)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
              showEqualLine
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Equal split
          </button>
        </div>
        <div className="h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={curve}
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="cumulativeSharePct"
                name="Cumulative share"
                fill="#f59e0b33"
                stroke="#f59e0b"
                strokeWidth={2}
              />
              {showEqualLine && (
                <Line
                  type="monotone"
                  dataKey="equalSharePct"
                  name="Equal split"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
