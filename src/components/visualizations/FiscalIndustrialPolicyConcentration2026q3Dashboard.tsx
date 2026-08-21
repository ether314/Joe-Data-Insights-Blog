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
  PACKAGE_CONCENTRATION_CURVE,
  PACKAGE_SHARES,
  SOURCE_NOTE,
  SOURCES,
  STOCK_CONCENTRATION_CURVE,
  STOCK_SHARES,
  STRATEGIC_INTENSITY,
  TOOLKIT_MIX,
  US_SECTOR_PACKAGES,
  VINTAGE_SLOPE,
  fmtBn,
  fmtHhi,
  fmtPct,
} from "@/data/fiscal-industrial-policy-concentration-2026q3-data";

// viz-types: HHI bars, Lorenz area+line, sectoral stacked bars, vintage slope, toolkit donut, lens scatter | layout: default

type ViewId = "hhi" | "ladder" | "sectors" | "vintage";
type LadderMetric = "sharePct" | "cumulative";
type CurveLens = "stock" | "packages";
type SectorMetric = "usdBn" | "shareOfUniversePct";

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

export function FiscalIndustrialPolicyConcentration2026q3Dashboard() {
  const [view, setView] = useState<ViewId>("hhi");
  const [ladderMetric, setLadderMetric] = useState<LadderMetric>("sharePct");
  const [curveLens, setCurveLens] = useState<CurveLens>("packages");
  const [sectorMetric, setSectorMetric] = useState<SectorMetric>("usdBn");
  const [showEqualLine, setShowEqualLine] = useState(true);
  const [slopeMetric, setSlopeMetric] = useState<"top3Pct" | "top1Pct">(
    "top3Pct",
  );

  const curve =
    curveLens === "stock"
      ? STOCK_CONCENTRATION_CURVE
      : PACKAGE_CONCENTRATION_CURVE;

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
    () => [...PACKAGE_SHARES].sort((a, b) => b.usdBn - a.usdBn),
    [],
  );

  const sectorBars = useMemo(() => {
    const rows = [...US_SECTOR_PACKAGES];
    if (sectorMetric === "usdBn") {
      return rows.sort((a, b) => b.usdBn - a.usdBn);
    }
    return rows.sort((a, b) => b.shareOfUniversePct - a.shareOfUniversePct);
  }, [sectorMetric]);

  const sectorStack = useMemo(
    () => [
      {
        name: "US war chest",
        ira: US_SECTOR_PACKAGES[0].usdBn,
        chips: US_SECTOR_PACKAGES[1].usdBn,
      },
    ],
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

  const strategicDumbbell = useMemo(
    () =>
      STRATEGIC_INTENSITY.map((r) => ({
        ...r,
        range: [r.earlyPct, r.latePct],
      })).sort((a, b) => b.latePct - a.latePct),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="fiscal-industrial-policy-concentration-2026q3"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Fiscal &amp; industrial policy — Q3 concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Package HHI ~{fmtHhi(HEADLINE.packageHhi)} · Top-1 dollars{" "}
          {fmtPct(HEADLINE.top1PackageSharePct)} · Stock top-3{" "}
          {fmtPct(HEADLINE.top3StockSharePct)}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Q3 distribution meter:{" "}
          <span className="text-amber-200">war-chest dollars</span> are extreme
          (US ~{HEADLINE.top1PackageSharePct}%, top-3 ~{HEADLINE.top3PackageSharePct}
          %, HHI ~{fmtHhi(HEADLINE.packageHhi)}).{" "}
          <span className="text-sky-300">Intervention counts</span> are thick but
          not monopolistic (top-3 {HEADLINE.top3StockSharePct}%, HHI ~
          {fmtHhi(HEADLINE.stockHhi)}). Inside the US rollup,{" "}
          <span className="text-emerald-300">IRA TE alone is ~{HEADLINE.usIraShareOfUsPct}%</span>{" "}
          of US package dollars — and June flow still leaves{" "}
          {HEADLINE.juneRestSharePct}% to the rest of the world.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Package HHI",
              value: fmtHhi(HEADLINE.packageHhi),
              sub: `Top-1 ${fmtPct(HEADLINE.top1PackageSharePct)}`,
            },
            {
              label: "Stock top-3",
              value: fmtPct(HEADLINE.top3StockSharePct),
              sub: HEADLINE.top3StockLabel,
            },
            {
              label: "IRA share of US $",
              value: fmtPct(HEADLINE.usIraShareOfUsPct),
              sub: fmtBn(HEADLINE.usIraUsdBn),
            },
            {
              label: "June top-3 flow",
              value: fmtPct(HEADLINE.juneTop3SharePct),
              sub: `RoW ${fmtPct(HEADLINE.juneRestSharePct)}`,
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
            { id: "hhi", label: "HHI radar" },
            { id: "ladder", label: "Share ladders" },
            { id: "sectors", label: "Sectoral packages" },
            { id: "vintage", label: "Vintage slope" },
          ]}
        />
      </div>

      {view === "hhi" && (
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
                    width={88}
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
                      name === "x" ? "Top-1" : name === "y" ? "Top-3" : String(name),
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
                          r.short === "Package $"
                            ? SKY
                            : r.short === "US sectors"
                              ? EMERALD
                              : r.short === "Stock counts"
                                ? ROSE
                                : r.short === "Jun flow"
                                  ? AMBER
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
            title="Distortive toolkit mix"
            subtitle="Approximate instrument shares in the 2025-style tape"
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
                  data={strategicDumbbell}
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
                    {strategicDumbbell.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "ladder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Cumulative share vs equal split"
            subtitle="Lorenz-style concentration curve"
          >
            <div className="mb-3 flex flex-wrap gap-3">
              <ToggleGroup
                label="Curve"
                value={curveLens}
                onChange={setCurveLens}
                options={[
                  { id: "packages", label: "Package dollars" },
                  { id: "stock", label: "Stock counts" },
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
                    fill={curveLens === "packages" ? `${SKY}33` : `${ROSE}33`}
                    stroke={curveLens === "packages" ? SKY : ROSE}
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
            <div className="h-80 w-full min-w-0">
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
                      fmtPct(Number(v), 0),
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
            title="Package dollar ranks"
            subtitle={`Universe ~${fmtBn(HEADLINE.packageUniverseUsdBn)} across major headlines`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={packageBars}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis tick={{ fill: SLATE, fontSize: 11 }} />
                  <Tooltip
                    formatter={(v, name) => [
                      name === "usdBn" ? fmtBn(Number(v)) : fmtPct(Number(v), 1),
                      name === "usdBn" ? "USD bn" : "Share",
                    ]}
                  />
                  <Bar dataKey="usdBn" radius={[6, 6, 0, 0]}>
                    {packageBars.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="June 2026 monthly flow"
            subtitle="GTA Roundup geography — flatter than stock or packages"
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
                    innerRadius={50}
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
                      `${v}% (${item?.payload?.interventions ?? ""} actions)`,
                      "Share",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "sectors" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="US sectoral stack — IRA TE vs CHIPS"
            subtitle="Inside the ~$447B US package rollup"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sectorStack}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fill: SLATE, fontSize: 11 }}
                  />
                  <Tooltip formatter={(v) => [fmtBn(Number(v)), ""]} />
                  <Bar dataKey="ira" stackId="a" fill={EMERALD} name="IRA TE" />
                  <Bar
                    dataKey="chips"
                    stackId="a"
                    fill={SKY}
                    name="CHIPS"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Sector slices vs universe"
            subtitle="IRA alone is ~59% of the five-jurisdiction package universe"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Metric"
                value={sectorMetric}
                onChange={setSectorMetric}
                options={[
                  { id: "usdBn", label: "USD billions" },
                  { id: "shareOfUniversePct", label: "% of universe" },
                ]}
              />
            </div>
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sectorBars}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis tick={{ fill: SLATE, fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) => [
                      sectorMetric === "usdBn"
                        ? fmtBn(Number(v))
                        : fmtPct(Number(v), 1),
                      sectorMetric === "usdBn" ? "USD bn" : "Universe share",
                    ]}
                  />
                  <Bar dataKey={sectorMetric} radius={[6, 6, 0, 0]}>
                    {sectorBars.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Jurisdiction package pie"
            subtitle="US ~71% · Big Three ~93% of tracked war chests"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={packageBars.map((r) => ({
                      name: r.short,
                      value: r.sharePct,
                      fill: r.fill,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name} ${Number(value).toFixed(0)}%`}
                  >
                    {packageBars.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${Number(v).toFixed(1)}%`, "Share"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Sector notes"
            subtitle="Why IRA TE dominates the fiscal capacity story"
          >
            <ul className="space-y-3 text-sm text-slate-600">
              {US_SECTOR_PACKAGES.map((s) => (
                <li
                  key={s.short}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-slate-900">{s.short}</span>
                    <span className="tabular-nums text-slate-700">
                      {fmtBn(s.usdBn)} · {fmtPct(s.shareOfUsPct, 0)} of US
                    </span>
                  </div>
                  <p className="mt-1 text-slate-500">{s.note}</p>
                </li>
              ))}
              <li className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-amber-900">
                HHI on the two-slice US rollup ≈ {fmtHhi(7130)} — more concentrated
                than the five-jurisdiction package universe (
                {fmtHhi(HEADLINE.packageHhi)}).
              </li>
            </ul>
          </ChartCard>
        </div>
      )}

      {view === "vintage" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Vintage slope of top shares"
            subtitle="Top-3 (and estimated top-1) across H-NIPO → census → Teneo → June flow"
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
            <div className="h-80 w-full min-w-0">
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
                  <Tooltip
                    formatter={(v) => [`${v}%`, slopeMetric === "top3Pct" ? "Top-3" : "Top-1"]}
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.vintage ?? "")
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey={slopeMetric}
                    fill={`${AMBER}33`}
                    stroke={AMBER}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey={slopeMetric}
                    stroke={ROSE}
                    strokeWidth={2}
                    dot={{ r: 5, fill: ROSE }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Cross-check table"
            subtitle="Disclosed top-3 anchors vs estimated top-1 splits"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[320px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3">Vintage</th>
                    <th className="py-2 pr-3 text-right">Top-1</th>
                    <th className="py-2 text-right">Top-3</th>
                  </tr>
                </thead>
                <tbody>
                  {VINTAGE_SLOPE.map((r) => (
                    <tr key={r.short} className="border-b border-slate-100">
                      <td className="py-2.5 pr-3 font-medium text-slate-800">
                        {r.short}
                        <div className="text-xs font-normal text-slate-400">
                          {r.source}
                        </div>
                      </td>
                      <td className="py-2.5 pr-3 text-right tabular-nums text-slate-700">
                        {fmtPct(r.top1Pct)}
                      </td>
                      <td className="py-2.5 text-right tabular-nums font-semibold text-slate-900">
                        {fmtPct(r.top3Pct)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
