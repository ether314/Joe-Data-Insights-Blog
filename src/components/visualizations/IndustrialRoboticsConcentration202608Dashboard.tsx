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
  ReferenceLine,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  BINDING_METERS,
  COBOT_PATH,
  CONCENTRATION_CURVE_2024,
  CONCENTRATION_CURVE_2025,
  CONCENTRATION_PATH,
  DUAL_LEDGER_TIPS,
  HEADLINE,
  MARKET_SHARES,
  NA_BLOC_SHARES,
  NA_INDUSTRY_YOY,
  REGION_SHARES,
  SHARE_GROWTH_SCATTER,
  SOURCE_NOTE,
  TOP_K_LADDER,
  fmtPct,
  fmtUnits,
  type VintageKey,
} from "@/data/industrial-robotics-concentration-202608-data";

// viz-types: Lorenz area+line, ranked share bars, dual-ledger tip bars, path multi-line + NA overlay, NA bloc donut, industry YoY bars, cobot share bars, share×growth scatter, binding meters | layout: default

type ViewId = "ladder" | "dual" | "path" | "na-book";
type LadderMetric = "sharePct" | "units" | "cumulativeSharePct";
type NaLens = "bloc" | "yoy" | "cobot";

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

export function IndustrialRoboticsConcentration202608Dashboard() {
  const [view, setView] = useState<ViewId>("ladder");
  const [vintage, setVintage] = useState<VintageKey>("2025");
  const [ladderMetric, setLadderMetric] = useState<LadderMetric>("sharePct");
  const [showEqualLine, setShowEqualLine] = useState(true);
  const [naLens, setNaLens] = useState<NaLens>("bloc");
  const [yoyPeriod, setYoyPeriod] = useState<"q2" | "h1">("q2");

  const curve =
    vintage === "2025" ? CONCENTRATION_CURVE_2025 : CONCENTRATION_CURVE_2024;

  const ladderBars = useMemo(() => {
    return [...MARKET_SHARES]
      .map((m) => {
        const sharePct = vintage === "2025" ? m.share2025Pct : m.share2024Pct;
        const units = vintage === "2025" ? m.units2025 : m.units2024;
        const cumulativeSharePct =
          (vintage === "2025"
            ? CONCENTRATION_CURVE_2025
            : CONCENTRATION_CURVE_2024
          ).find((c) => c.rank === m.rank)?.cumulativeSharePct ?? sharePct;
        const value =
          ladderMetric === "sharePct"
            ? sharePct
            : ladderMetric === "units"
              ? units
              : cumulativeSharePct;
        return { ...m, value, sharePct, units };
      })
      .sort((a, b) => b.value - a.value);
  }, [ladderMetric, vintage]);

  const regionDonut = useMemo(
    () =>
      REGION_SHARES.map((r) => ({
        name: r.short,
        value: vintage === "2025" ? r.share2025Pct : r.share2024Pct,
        fill: r.fill,
      })),
    [vintage],
  );

  const topK = useMemo(
    () =>
      TOP_K_LADDER.map((row) => ({
        ...row,
        sharePct: vintage === "2025" ? row.share2025Pct : row.share2024Pct,
      })),
    [vintage],
  );

  const pathData = useMemo(
    () =>
      CONCENTRATION_PATH.map((p) => ({
        ...p,
        naNonAutoPct: p.naNonAutoPct ?? undefined,
      })),
    [],
  );

  const naYoyBars = useMemo(() => {
    return NA_INDUSTRY_YOY.map((row) => {
      const value = yoyPeriod === "q2" ? row.q2YoyPct : row.h1YoyPct;
      return { ...row, value: value ?? 0, missing: value == null };
    }).filter((r) => !r.missing);
  }, [yoyPeriod]);

  const scatterData = useMemo(
    () =>
      SHARE_GROWTH_SCATTER.map((p) => ({
        ...p,
        x: p.sharePct,
        y: p.yoyPct,
        z: Math.max(40, Math.sqrt(p.units) / 8),
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="industrial-robotics-concentration-202608"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300/90">
          Industrial robotics — Aug 202608 dual-ledger concentration
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
          IFR install tip still sits at Top-1{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.top1Share2025Pct, 1)}
          </span>{" "}
          / Top-3{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.top3Share2025Pct, 1)}
          </span>
          . A3&apos;s Aug NA order book flips the industry story: non-auto is{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.naNonAutoShareQ2Pct)}
          </span>{" "}
          of Q2 units — broadening bookings, still-concentrated installs.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {topK.map((row) => (
            <div
              key={row.k}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                Install {row.label}
              </p>
              <p className="text-xl font-bold tabular-nums text-white">
                {fmtPct(row.sharePct, row.sharePct % 1 === 0 ? 0 : 1)}
              </p>
              <p className="text-[11px] text-slate-400">{row.note}</p>
            </div>
          ))}
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              NA non-auto Q2
            </p>
            <p className="text-xl font-bold tabular-nums text-white">
              {fmtPct(HEADLINE.naNonAutoShareQ2Pct)}
            </p>
            <p className="text-[11px] text-slate-400">A3 order book</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "ladder", label: "Install ladder" },
            { id: "dual", label: "Dual ledger" },
            { id: "path", label: "Share path" },
            { id: "na-book", label: "NA order book" },
          ]}
        />
        {view === "ladder" && (
          <>
            <ToggleGroup
              label="Vintage"
              value={vintage}
              onChange={setVintage}
              options={[
                { id: "2024", label: "2024 WR" },
                { id: "2025", label: "2025 prelim" },
              ]}
            />
            <ToggleGroup
              label="Metric"
              value={ladderMetric}
              onChange={setLadderMetric}
              options={[
                { id: "sharePct", label: "Share %" },
                { id: "units", label: "Units" },
                { id: "cumulativeSharePct", label: "Cumulative %" },
              ]}
            />
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={showEqualLine}
                onChange={(e) => setShowEqualLine(e.target.checked)}
                className="rounded border-slate-300"
              />
              Equal-split line
            </label>
          </>
        )}
        {view === "na-book" && (
          <>
            <ToggleGroup
              label="NA lens"
              value={naLens}
              onChange={setNaLens}
              options={[
                { id: "bloc", label: "Auto vs non-auto" },
                { id: "yoy", label: "Industry YoY" },
                { id: "cobot", label: "Cobot share" },
              ]}
            />
            {naLens === "yoy" && (
              <ToggleGroup
                label="Period"
                value={yoyPeriod}
                onChange={setYoyPeriod}
                options={[
                  { id: "q2", label: "Q2 YoY" },
                  { id: "h1", label: "H1 YoY" },
                ]}
              />
            )}
          </>
        )}
      </div>

      {view === "ladder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Cumulative share vs equal split"
            subtitle={`Lorenz-style install curve — ${vintage} vintage`}
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={curve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="rank" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
                      String(name),
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.market
                        ? `Rank ${payload[0].payload.rank}: ${payload[0].payload.market}`
                        : ""
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativeSharePct"
                    name="Cumulative share"
                    fill={ROSE}
                    fillOpacity={0.15}
                    stroke={ROSE}
                    strokeWidth={2}
                  />
                  {showEqualLine && (
                    <Line
                      type="monotone"
                      dataKey="equalSharePct"
                      name="Equal split"
                      stroke={SLATE}
                      strokeDasharray="4 4"
                      dot={false}
                      strokeWidth={1.5}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Ranked market shares"
            subtitle={
              ladderMetric === "sharePct"
                ? `% of ${vintage} world installations`
                : ladderMetric === "units"
                  ? "Annual installations (units)"
                  : "Cumulative share through this rank"
            }
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ladderBars} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) =>
                      ladderMetric === "units" ? fmtUnits(v) : `${v}%`
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={64}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [
                      ladderMetric === "units"
                        ? fmtUnits(Number(v))
                        : fmtPct(Number(v), 1),
                      ladderMetric === "sharePct"
                        ? "Share"
                        : ladderMetric === "units"
                          ? "Units"
                          : "Cumulative",
                    ]}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {ladderBars.map((m) => (
                      <Cell key={m.market} fill={m.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "dual" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Dual-ledger tip comparison"
            subtitle="IFR install Top-1/Top-3 vs A3 NA auto / non-auto Q2 shares"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DUAL_LEDGER_TIPS} margin={{ left: 8, bottom: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="metric"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    domain={[0, 80]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, _n, props) => [
                      fmtPct(Number(v), 1),
                      props?.payload?.label ?? "Share",
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.ledger
                        ? String(payload[0].payload.ledger)
                        : ""
                    }
                  />
                  <Bar dataKey="valuePct" radius={[4, 4, 0, 0]}>
                    {DUAL_LEDGER_TIPS.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Binding tip meters"
            subtitle="Analytical score — install gravity vs NA order-book tip"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BINDING_METERS} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={110}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, props) => [
                      Number(v).toFixed(1),
                      props?.payload?.note ?? "Score",
                    ]}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {BINDING_METERS.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Install binding {HEADLINE.installBindingScore.toFixed(1)} vs NA
              order binding {HEADLINE.naOrderBindingScore.toFixed(1)} — same
              automation system, different concentration clocks.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "path" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Top-1 / Top-3 / Asia share path"
            subtitle="Install meters through WR → prelim; 2026Q2 holds tip + NA non-auto overlay"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pathData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[40, 85]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      v == null ? "—" : `${Number(v).toFixed(1)}%`,
                      String(name),
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="top1Pct"
                    name="Top-1 (China)"
                    stroke={ROSE}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="top3Pct"
                    name="Top-3"
                    stroke={AMBER}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="asiaPct"
                    name="Asia region"
                    stroke={SKY}
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="naNonAutoPct"
                    name="NA non-auto (A3)"
                    stroke={TEAL}
                    strokeWidth={2.5}
                    connectNulls={false}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Regional share donut"
            subtitle={`IFR regions — ${vintage === "2025" ? "2025 prelim" : "2024 WR"}`}
          >
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionDonut}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={95}
                    paddingAngle={2}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {regionDonut.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <ToggleGroup
                label="Donut vintage"
                value={vintage}
                onChange={setVintage}
                options={[
                  { id: "2024", label: "2024 WR" },
                  { id: "2025", label: "2025 prelim" },
                ]}
              />
            </div>
          </ChartCard>
        </div>
      )}

      {view === "na-book" && naLens === "bloc" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="NA Q2 order bloc shares"
            subtitle="Disclosed A3 auto vs non-automotive unit mix"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={NA_BLOC_SHARES.map((d) => ({
                      name: d.label,
                      value: d.sharePct,
                      fill: d.fill,
                      id: d.id,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={95}
                    paddingAngle={3}
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {NA_BLOC_SHARES.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Share × growth scatter (IFR installs)"
            subtitle="Market share vs YoY — China still the volume outlier"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Share %"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="YoY %"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} />
                  <ReferenceLine y={0} stroke={SLATE} strokeDasharray="3 3" />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
                      String(name),
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.short
                        ? String(payload[0].payload.short)
                        : ""
                    }
                  />
                  <Scatter data={scatterData}>
                    {scatterData.map((p) => (
                      <Cell key={p.short} fill={p.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "na-book" && naLens === "yoy" && (
        <div className="grid gap-6 lg:grid-cols-1">
          <ChartCard
            title={`NA industry ${yoyPeriod.toUpperCase()} YoY`}
            subtitle="A3 disclosed sector growth — semi/electro leads; auto OEM H1 deep negative"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={naYoyBars} margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <ReferenceLine y={0} stroke={SLATE} />
                  <Tooltip
                    formatter={(v) => [`${Number(v).toFixed(0)}%`, "YoY"]}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {naYoyBars.map((d) => (
                      <Cell key={d.industry} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "na-book" && naLens === "cobot" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Cobot unit vs value share path"
            subtitle="A3 NA collaborative robots — unit share cooling into Q2 2026"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={COBOT_PATH}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 25]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
                      String(name),
                    ]}
                  />
                  <Bar
                    dataKey="unitSharePct"
                    name="Unit share"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="valueSharePct"
                    name="Value share"
                    stroke={AMBER}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Cobot units by period"
            subtitle="Absolute collaborative units in the A3 NA book"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={COBOT_PATH}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => fmtUnits(v)}
                  />
                  <Tooltip
                    formatter={(v) => [fmtUnits(Number(v)), "Units"]}
                  />
                  <Bar dataKey="units" radius={[4, 4, 0, 0]}>
                    {COBOT_PATH.map((d) => (
                      <Cell key={d.period} fill={d.fill} />
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
