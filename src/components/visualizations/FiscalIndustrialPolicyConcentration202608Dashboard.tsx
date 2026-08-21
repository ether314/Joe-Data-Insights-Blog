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
  HEADLINE,
  HHI_BY_LENS,
  JUNE_FLOW,
  LENS_COMPARE,
  MONTHLY_FLOW_PATH,
  OWNERSHIP_CONCENTRATION_CURVE,
  OWNERSHIP_STAKES,
  PACKAGE_CONCENTRATION_CURVE_ALT,
  PACKAGE_CONCENTRATION_CURVE_CORE,
  PACKAGE_SHARES_ALT,
  PACKAGE_SHARES_CORE,
  SOURCE_NOTE,
  SOURCES,
  STOCK_CONCENTRATION_CURVE,
  STOCK_SHARES,
  STRATEGIC_INTENSITY,
  TOOLKIT_MIX,
  VINTAGE_SLOPE,
  fmtBn,
  fmtHhi,
  fmtInt,
  fmtM,
  fmtPct,
} from "@/data/fiscal-industrial-policy-concentration-202608-data";

// viz-types: HHI bars, Lorenz area+line, ownership ranked bars, monthly flow path, toolkit donut, lens scatter | layout: default

type ViewId = "radar" | "packages" | "ownership" | "flow";
type PackageUniverse = "core" | "alt";
type CurveLens = "packages" | "stock" | "ownership";
type LadderMetric = "sharePct" | "cumulative";
type SlopeMetric = "top3Pct" | "top1Pct";

const SKY = "#0ea5e9";
const ROSE = "#f43f5e";
const VIOLET = "#8b5cf6";
const SLATE = "#64748b";
const AMBER = "#f59e0b";
const EMERALD = "#10b981";

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

export function FiscalIndustrialPolicyConcentration202608Dashboard() {
  const [view, setView] = useState<ViewId>("radar");
  const [packageUniverse, setPackageUniverse] =
    useState<PackageUniverse>("core");
  const [curveLens, setCurveLens] = useState<CurveLens>("packages");
  const [ladderMetric, setLadderMetric] = useState<LadderMetric>("sharePct");
  const [showEqualLine, setShowEqualLine] = useState(true);
  const [slopeMetric, setSlopeMetric] = useState<SlopeMetric>("top3Pct");

  const packageShares =
    packageUniverse === "core" ? PACKAGE_SHARES_CORE : PACKAGE_SHARES_ALT;
  const packageCurve =
    packageUniverse === "core"
      ? PACKAGE_CONCENTRATION_CURVE_CORE
      : PACKAGE_CONCENTRATION_CURVE_ALT;

  const curve =
    curveLens === "stock"
      ? STOCK_CONCENTRATION_CURVE
      : curveLens === "ownership"
        ? OWNERSHIP_CONCENTRATION_CURVE
        : packageCurve;

  const hhiBars = useMemo(
    () => [...HHI_BY_LENS].sort((a, b) => b.hhi - a.hhi),
    [],
  );

  const stockBars = useMemo(() => {
    const rows = [...STOCK_SHARES];
    if (ladderMetric === "sharePct") {
      return rows.sort((a, b) => b.sharePct - a.sharePct);
    }
    return rows.sort((a, b) => b.cumulativeSharePct - a.cumulativeSharePct);
  }, [ladderMetric]);

  const packageBars = useMemo(
    () => [...packageShares].sort((a, b) => b.usdBn - a.usdBn),
    [packageShares],
  );

  const ownershipBars = useMemo(
    () => [...OWNERSHIP_STAKES].sort((a, b) => b.usdMillions - a.usdMillions),
    [],
  );

  const lensScatter = useMemo(
    () =>
      LENS_COMPARE.map((l) => ({
        ...l,
        x: l.top1Pct,
        y: l.top3Pct,
        z: Math.max(8, l.top3Pct / 4),
      })),
    [],
  );

  const toolkitPie = useMemo(
    () =>
      TOOLKIT_MIX.map((r) => ({
        name: r.short,
        value: r.sharePct,
        fill: r.fill,
      })),
    [],
  );

  const junePie = useMemo(
    () =>
      JUNE_FLOW.map((r) => ({
        name: r.short,
        value: r.sharePct,
        fill: r.fill,
        interventions: r.interventions,
      })),
    [],
  );

  const strategicBars = useMemo(
    () =>
      [...STRATEGIC_INTENSITY].sort((a, b) => b.latePct - a.latePct),
    [],
  );

  const pkgTop1 =
    packageUniverse === "core"
      ? HEADLINE.top1PackageSharePct
      : HEADLINE.altTop1SharePct;
  const pkgTop1Label =
    packageUniverse === "core"
      ? HEADLINE.top1PackageLabel
      : HEADLINE.altTop1Label;
  const pkgHhi =
    packageUniverse === "core" ? HEADLINE.packageHhi : HEADLINE.altPackageHhi;

  return (
    <div
      className="space-y-6"
      data-viz="fiscal-industrial-policy-concentration-202608"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Fiscal &amp; industrial policy — Aug 202608 concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Ownership top-1 {fmtPct(HEADLINE.ownershipTop1SharePct)} · Core package
          top-1 {fmtPct(HEADLINE.top1PackageSharePct)} · Stock top-3{" "}
          {fmtPct(HEADLINE.top3StockSharePct)}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          August distribution meter:{" "}
          <span className="text-rose-300">ownership stakes</span> print China
          subnational funds at ~{HEADLINE.ownershipTop1SharePct}% of the Jun–Jul
          equity tape.{" "}
          <span className="text-sky-300">Core war-chest dollars</span> still put
          the US at ~{HEADLINE.top1PackageSharePct}% (HHI ~
          {fmtHhi(HEADLINE.packageHhi)}) — until the Korea mega-plan sensitivity
          flips top-1.{" "}
          <span className="text-emerald-300">June flow</span> leaves{" "}
          {HEADLINE.juneRestSharePct}% to rest-of-world while July volume jumps{" "}
          {HEADLINE.julVsMayDeltaPct}% vs May.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Ownership top-1",
              value: fmtPct(HEADLINE.ownershipTop1SharePct),
              sub: HEADLINE.ownershipTop1Label,
            },
            {
              label: "Core package top-1",
              value: fmtPct(HEADLINE.top1PackageSharePct),
              sub: `HHI ${fmtHhi(HEADLINE.packageHhi)}`,
            },
            {
              label: "Stock top-3",
              value: fmtPct(HEADLINE.top3StockSharePct),
              sub: HEADLINE.top3StockLabel,
            },
            {
              label: "June RoW flow",
              value: fmtPct(HEADLINE.juneRestSharePct),
              sub: `Top-3 ${fmtPct(HEADLINE.juneTop3SharePct)}`,
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
            { id: "radar", label: "HHI radar" },
            { id: "packages", label: "Package ladders" },
            { id: "ownership", label: "Ownership stakes" },
            { id: "flow", label: "Flow path" },
          ]}
        />
      </div>

      {view === "radar" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="HHI by concentration lens"
            subtitle="Analytical Herfindahl on stated bucket shares (0–10,000)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={hhiBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={96}
                    tick={{ fill: SLATE, fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtHhi(Number(v)), "HHI"]}
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.lens ?? "")
                    }
                  />
                  <Bar dataKey="hhi" radius={[0, 6, 6, 0]}>
                    {hhiBars.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Top-1 vs top-3 scatter"
            subtitle="Each lens plotted by top-1 (x) and top-3 (y) share"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Top-1 %"
                    unit="%"
                    domain={[0, 100]}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    label={{
                      value: "Top-1 %",
                      position: "insideBottom",
                      offset: -2,
                      fill: SLATE,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Top-3 %"
                    unit="%"
                    domain={[0, 100]}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    label={{
                      value: "Top-3 %",
                      angle: -90,
                      position: "insideLeft",
                      fill: SLATE,
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      `${Number(v).toFixed(0)}%`,
                      name === "x"
                        ? "Top-1"
                        : name === "y"
                          ? "Top-3"
                          : String(name),
                    ]}
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.lens ?? "")
                    }
                  />
                  <Scatter data={lensScatter} fill={SKY}>
                    {lensScatter.map((r) => (
                      <Cell
                        key={r.short}
                        fill={
                          r.short === "Core packages"
                            ? SKY
                            : r.short === "Ownership"
                              ? ROSE
                              : r.short === "Alt packages"
                                ? AMBER
                                : r.short === "Stock counts"
                                  ? SLATE
                                  : r.short === "Jun flow"
                                    ? EMERALD
                                    : VIOLET
                        }
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="2025 distortive toolkit mix"
            subtitle="Teneo Fig.2 — barriers, subsidies, and finance controls nearly level"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={toolkitPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={90}
                    paddingAngle={2}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {toolkitPie.map((r) => (
                      <Cell key={r.name} fill={r.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Strategic / dual-use intensity"
            subtitle="Share of subsidy IP covering advanced tech — early vs late (ZG #88)"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={strategicBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    unit="%"
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={56}
                    tick={{ fill: SLATE, fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      `${v}%`,
                      name === "earlyPct" ? "Early" : "Late",
                    ]}
                  />
                  <Bar dataKey="earlyPct" fill="#94a3b8" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="latePct" radius={[0, 4, 4, 0]}>
                    {strategicBars.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "packages" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Cumulative share vs equal split"
            subtitle={`Active universe: ${packageUniverse === "core" ? "core war chest" : "core + Korea mega-plan"} · top-1 ${fmtPct(pkgTop1)} (${pkgTop1Label}) · HHI ~${fmtHhi(pkgHhi)}`}
          >
            <div className="mb-3 flex flex-wrap gap-3">
              <ToggleGroup
                label="Universe"
                value={packageUniverse}
                onChange={setPackageUniverse}
                options={[
                  { id: "core", label: "Core war chest" },
                  { id: "alt", label: "+ Korea mega-plan" },
                ]}
              />
              <ToggleGroup
                label="Curve"
                value={curveLens}
                onChange={setCurveLens}
                options={[
                  { id: "packages", label: "Package $" },
                  { id: "stock", label: "Stock counts" },
                  { id: "ownership", label: "Ownership" },
                ]}
              />
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
                  data={curve}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    unit="%"
                  />
                  <Tooltip formatter={(v) => [`${v}%`, ""]} />
                  <Area
                    type="monotone"
                    dataKey="sharePct"
                    fill={
                      curveLens === "packages"
                        ? `${SKY}33`
                        : curveLens === "ownership"
                          ? `${ROSE}33`
                          : `${AMBER}33`
                    }
                    stroke={
                      curveLens === "packages"
                        ? SKY
                        : curveLens === "ownership"
                          ? ROSE
                          : AMBER
                    }
                    strokeWidth={2}
                    name="Cumulative"
                  />
                  {showEqualLine && (
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
            title="Package jurisdiction ladder"
            subtitle={
              packageUniverse === "core"
                ? "Core CHIPS/IRA/EU/CN/JP/KR universe (~$626B)"
                : "Sensitivity: adds Korea mega-plan (~$951B) → flips top-1"
            }
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={packageBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={88}
                    tick={{ fill: SLATE, fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      name === "usdBn" ? fmtBn(Number(v)) : `${v}%`,
                      name === "usdBn" ? "USD" : "Share",
                    ]}
                  />
                  <Bar dataKey="usdBn" radius={[0, 6, 6, 0]}>
                    {packageBars.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Jurisdiction ladder (stock counts)"
            subtitle="Estimated shares summing to Teneo Big Three 63%"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Metric"
                value={ladderMetric}
                onChange={setLadderMetric}
                options={[
                  { id: "sharePct", label: "Share %" },
                  { id: "cumulative", label: "Cumulative" },
                ]}
              />
            </div>
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stockBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={56}
                    tick={{ fill: SLATE, fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [
                      `${v}%`,
                      ladderMetric === "sharePct" ? "Share" : "Cumulative",
                    ]}
                  />
                  <Bar
                    dataKey={
                      ladderMetric === "sharePct"
                        ? "sharePct"
                        : "cumulativeSharePct"
                    }
                    radius={[0, 6, 6, 0]}
                  >
                    {stockBars.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Vintage top-share slope"
            subtitle="Disclosed / estimated top shares across count vintages + June flow"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Metric"
                value={slopeMetric}
                onChange={setSlopeMetric}
                options={[
                  { id: "top3Pct", label: "Top-3 %" },
                  { id: "top1Pct", label: "Top-1 %" },
                ]}
              />
            </div>
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={VINTAGE_SLOPE}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    domain={[0, 80]}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    unit="%"
                  />
                  <Tooltip formatter={(v) => [`${v}%`, ""]} />
                  <Area
                    type="monotone"
                    dataKey={slopeMetric}
                    fill={`${VIOLET}22`}
                    stroke={VIOLET}
                    strokeWidth={2}
                    name={slopeMetric === "top3Pct" ? "Top-3" : "Top-1"}
                  />
                  <Line
                    type="monotone"
                    dataKey={slopeMetric}
                    stroke={VIOLET}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "ownership" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Ownership / equity stake ladder"
            subtitle="Jun–Jul Roundup equity LOIs and funds — ranked by USD"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ownershipBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={100}
                    tick={{ fill: SLATE, fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      name === "usdMillions"
                        ? fmtM(Number(v))
                        : `${Number(v).toFixed(1)}%`,
                      name === "usdMillions" ? "USD" : "Share",
                    ]}
                  />
                  <Bar dataKey="usdMillions" radius={[0, 6, 6, 0]}>
                    {ownershipBars.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Ownership concentration curve"
            subtitle={`Top-1 ${fmtPct(HEADLINE.ownershipTop1SharePct)} · Top-3 ${fmtPct(HEADLINE.ownershipTop3SharePct)} · HHI ~${fmtHhi(HEADLINE.ownershipHhi)}`}
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
                  data={OWNERSHIP_CONCENTRATION_CURVE}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    unit="%"
                  />
                  <Tooltip formatter={(v) => [`${v}%`, ""]} />
                  <Area
                    type="monotone"
                    dataKey="sharePct"
                    fill={`${ROSE}33`}
                    stroke={ROSE}
                    strokeWidth={2}
                    name="Cumulative"
                  />
                  {showEqualLine && (
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
        </div>
      )}

      {view === "flow" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="May→Jul monthly flow path"
            subtitle="GTA Roundup totals — volume rising even while June geography stays RoW-heavy"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={MONTHLY_FLOW_PATH}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis tick={{ fill: SLATE, fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) => [fmtInt(Number(v)), "Developments"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    fill={`${EMERALD}22`}
                    stroke={EMERALD}
                    strokeWidth={2}
                    name="Total"
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke={EMERALD}
                    strokeWidth={2}
                    dot={{ r: 5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="June 2026 geography"
            subtitle="Only month with full Big Three vs RoW split in the May–Jul window"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={junePie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={95}
                    paddingAngle={2}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {junePie.map((r) => (
                      <Cell key={r.name} fill={r.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${v}% (${fmtInt(Number(item?.payload?.interventions ?? 0))})`,
                      "Share",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        {SOURCES.map((s) => (
          <a
            key={s.url}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-slate-300 hover:text-slate-700"
          >
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}
