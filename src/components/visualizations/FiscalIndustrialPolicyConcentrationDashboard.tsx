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
  IMPORT_BARRIER_SHARES,
  JUNE_FLOW,
  LENS_COMPARE,
  PACKAGE_CONCENTRATION_CURVE,
  PACKAGE_SHARES,
  SOURCE_NOTE,
  SOURCES,
  STOCK_CONCENTRATION_CURVE,
  STOCK_SHARES,
  STRATEGIC_INTENSITY,
  VINTAGE_CHECKS,
  fmtBn,
  fmtPct,
} from "@/data/fiscal-industrial-policy-concentration-2026-data";

// viz-types: Lorenz area+line, ranked share bars, package pie, strategic dumbbell, lens scatter, flow donut | layout: default

type ViewId = "ladder" | "packages" | "strategic" | "flow";
type LadderMetric = "sharePct" | "cumulative";
type PackageMetric = "usdBn" | "sharePct";

const SKY = "#0ea5e9";
const ROSE = "#f43f5e";
const VIOLET = "#8b5cf6";
const SLATE = "#64748b";
const AMBER = "#f59e0b";

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

export function FiscalIndustrialPolicyConcentrationDashboard() {
  const [view, setView] = useState<ViewId>("ladder");
  const [ladderMetric, setLadderMetric] = useState<LadderMetric>("sharePct");
  const [packageMetric, setPackageMetric] = useState<PackageMetric>("usdBn");
  const [showEqualLine, setShowEqualLine] = useState(true);
  const [curveLens, setCurveLens] = useState<"stock" | "packages">("stock");

  const curve =
    curveLens === "stock" ? STOCK_CONCENTRATION_CURVE : PACKAGE_CONCENTRATION_CURVE;

  const stockBars = useMemo(() => {
    const rows = [...STOCK_SHARES];
    if (ladderMetric === "sharePct") {
      return rows.sort((a, b) => b.sharePct - a.sharePct);
    }
    return rows.sort((a, b) => b.cumulativeSharePct - a.cumulativeSharePct);
  }, [ladderMetric]);

  const packageBars = useMemo(() => {
    const rows = [...PACKAGE_SHARES];
    if (packageMetric === "usdBn") {
      return rows.sort((a, b) => b.usdBn - a.usdBn);
    }
    return rows.sort((a, b) => b.sharePct - a.sharePct);
  }, [packageMetric]);

  const strategicDumbbell = useMemo(
    () =>
      STRATEGIC_INTENSITY.map((r) => ({
        ...r,
        range: [r.earlyPct, r.latePct],
      })).sort((a, b) => b.latePct - a.latePct),
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

  return (
    <div
      className="space-y-6"
      data-viz="fiscal-industrial-policy-concentration-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Fiscal &amp; industrial policy — concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Top-1 holds {HEADLINE.top1StockSharePct}% of the stock · Top-3 holds{" "}
          {HEADLINE.top3StockSharePct}%
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          On intervention <span className="text-amber-200">counts</span>, China,
          the EU, and the US still own about{" "}
          <span className="text-sky-300">
            {HEADLINE.top3StockSharePct}% of the cumulative ledger
          </span>
          . On major fiscal-package <span className="text-amber-200">dollars</span>,
          the United States alone is{" "}
          <span className="text-rose-300">
            ~{HEADLINE.top1PackageSharePct}%
          </span>{" "}
          — and the same Big Three clear{" "}
          <span className="text-violet-300">
            ~{HEADLINE.top3PackageSharePct}%
          </span>
          . Monthly flow is flatter: rest-of-world still prints{" "}
          {HEADLINE.juneRestSharePct}% of the June tape.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Top-1 stock",
              value: fmtPct(HEADLINE.top1StockSharePct),
              sub: HEADLINE.top1StockLabel,
            },
            {
              label: "Top-3 stock",
              value: fmtPct(HEADLINE.top3StockSharePct),
              sub: HEADLINE.top3StockLabel,
            },
            {
              label: "Top-1 packages",
              value: fmtPct(HEADLINE.top1PackageSharePct),
              sub: HEADLINE.top1PackageLabel,
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
            { id: "ladder", label: "Concentration ladder" },
            { id: "packages", label: "Package dollars" },
            { id: "strategic", label: "Strategic intensity" },
            { id: "flow", label: "Monthly flow" },
          ]}
        />
      </div>

      {view === "ladder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Cumulative share vs equal split"
            subtitle="How fast the top of the distribution accumulates industrial-policy activity"
          >
            <div className="mb-3 flex flex-wrap gap-3">
              <ToggleGroup
                label="Lens"
                value={curveLens}
                onChange={setCurveLens}
                options={[
                  { id: "stock", label: "Stock counts" },
                  { id: "packages", label: "Package $" },
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
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
                      name === "sharePct" ? "Actual cumulative" : "Equal split",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="sharePct"
                    fill={curveLens === "stock" ? AMBER : SKY}
                    fillOpacity={0.25}
                    stroke={curveLens === "stock" ? AMBER : SKY}
                    strokeWidth={2.5}
                    name="sharePct"
                  />
                  {showEqualLine && (
                    <Line
                      type="monotone"
                      dataKey="equalPct"
                      stroke={SLATE}
                      strokeDasharray="6 4"
                      strokeWidth={1.5}
                      dot={false}
                      name="equalPct"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {curveLens === "stock"
                ? `Top-1 ${fmtPct(HEADLINE.top1StockSharePct)} · Top-3 ${fmtPct(HEADLINE.top3StockSharePct)} (Teneo Big Three).`
                : `Top-1 ${fmtPct(HEADLINE.top1PackageSharePct)} · Top-3 ${fmtPct(HEADLINE.top3PackageSharePct)} of major package headlines.`}
            </p>
          </ChartCard>

          <ChartCard
            title="Jurisdiction ladder (stock counts)"
            subtitle="Toggle between share of stock and cumulative share at each rank"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Metric"
                value={ladderMetric}
                onChange={setLadderMetric}
                options={[
                  { id: "sharePct", label: "Share of stock" },
                  { id: "cumulative", label: "Cumulative" },
                ]}
              />
            </div>
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stockBars}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={56}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [`${Number(v).toFixed(0)}%`, "Value"]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.jurisdiction ?? ""
                    }
                  />
                  <Bar
                    dataKey={
                      ladderMetric === "sharePct"
                        ? "sharePct"
                        : "cumulativeSharePct"
                    }
                    radius={[0, 4, 4, 0]}
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
            title="Top-1 vs top-3 across lenses"
            subtitle="Each point is a different measurement universe — dollars concentrate harder than monthly counts"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Top-1"
                    domain={[0, 80]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "Top-1 share",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Top-3"
                    domain={[30, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "Top-3",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      `${Number(v).toFixed(0)}%`,
                      name === "x" ? "Top-1" : name === "y" ? "Top-3" : name,
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.short ?? ""
                    }
                  />
                  <Scatter data={lensScatter} fill={AMBER}>
                    {lensScatter.map((p) => (
                      <Cell
                        key={p.short}
                        fill={
                          p.short === "Package $"
                            ? ROSE
                            : p.short === "Jun flow"
                              ? VIOLET
                              : SKY
                        }
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              {LENS_COMPARE.map((l) => (
                <li key={l.short}>
                  <span className="font-medium text-slate-700">{l.short}</span>
                  : {fmtPct(l.top1Pct)} / {fmtPct(l.top3Pct)}
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title="Vintage top-3 checks"
            subtitle="Disclosed Big Three shares across IMF and Teneo ledgers"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={VINTAGE_CHECKS}
                  margin={{ top: 8, right: 12, left: 0, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="vintage"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                    height={56}
                  />
                  <YAxis
                    domain={[0, 80]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v) => [`${Number(v)}%`, "Top-3 share"]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.metric ?? ""
                    }
                  />
                  <Bar dataKey="top3Pct" fill={VIOLET} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "packages" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="War-chest share by jurisdiction"
            subtitle="CHIPS, IRA, EU Chips/IPCEI, Big Fund III, JP/KR semiconductor envelopes"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Metric"
                value={packageMetric}
                onChange={setPackageMetric}
                options={[
                  { id: "usdBn", label: "USD billions" },
                  { id: "sharePct", label: "Share of universe" },
                ]}
              />
            </div>
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={packageBars}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) =>
                      packageMetric === "sharePct" ? `${v}%` : `$${v}B`
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={56}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [
                      packageMetric === "sharePct"
                        ? `${Number(v).toFixed(1)}%`
                        : fmtBn(Number(v)),
                      packageMetric === "sharePct" ? "Share" : "Envelope",
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.packages ?? ""
                    }
                  />
                  <Bar
                    dataKey={packageMetric === "usdBn" ? "usdBn" : "sharePct"}
                    radius={[0, 4, 4, 0]}
                  >
                    {packageBars.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Package dollar pie"
            subtitle={`Universe ≈ ${fmtBn(HEADLINE.packageUniverseUsdBn)} across five jurisdictions`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PACKAGE_SHARES}
                    dataKey="sharePct"
                    nameKey="short"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {PACKAGE_SHARES.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${Number(v).toFixed(1)}% · ${fmtBn(item?.payload?.usdBn ?? 0)}`,
                      item?.payload?.jurisdiction ?? "Share",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-600">
              {PACKAGE_SHARES.map((r) => (
                <li key={r.short} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: r.fill }}
                  />
                  {r.short} {fmtPct(r.sharePct, 1)}
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title="Package concentration curve"
            subtitle="Dollar top-1 / top-3 sit far above an equal five-jurisdiction split"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={PACKAGE_CONCENTRATION_CURVE}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
                      name === "sharePct" ? "Actual" : "Equal",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="sharePct"
                    fill={SKY}
                    fillOpacity={0.3}
                    stroke={SKY}
                    strokeWidth={2.5}
                    name="sharePct"
                  />
                  <Line
                    type="monotone"
                    dataKey="equalPct"
                    stroke={SLATE}
                    strokeDasharray="6 4"
                    strokeWidth={1.5}
                    dot={false}
                    name="equalPct"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Import-barrier concentration (2025)"
            subtitle="US share of global import-barrier actions inside the distortive toolkit"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={IMPORT_BARRIER_SHARES}
                    dataKey="sharePct"
                    nameKey="short"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={95}
                  >
                    {IMPORT_BARRIER_SHARES.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${Number(v)}%`,
                      item?.payload?.actor ?? "Share",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Import barriers were ~{HEADLINE.importBarrierShareOfToolkitPct}% of
              the 2025 distortive toolkit; the US alone was ~
              {HEADLINE.usImportBarrierSharePct}% of those barrier actions.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "strategic" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Strategic subsidy intensity (early → late)"
            subtitle="Share of Big Three subsidy IP covering dual-use / advanced tech (ZG #88)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={strategicDumbbell}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={56}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      `${Number(v)}%`,
                      name === "earlyPct"
                        ? "2009–16"
                        : name === "latePct"
                          ? "2025–26"
                          : String(name),
                    ]}
                  />
                  <Bar
                    dataKey="earlyPct"
                    fill="#cbd5e1"
                    barSize={10}
                    radius={[0, 4, 4, 0]}
                    name="earlyPct"
                  />
                  <Bar
                    dataKey="latePct"
                    barSize={14}
                    radius={[0, 4, 4, 0]}
                    name="latePct"
                  >
                    {strategicDumbbell.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Grey = 2009–16 window; colour = 2025–26. US catch-up (+
              {STRATEGIC_INTENSITY.find((s) => s.short === "US")?.deltaPp} pp) is
              the steepest path; China never left the high-nineties.
            </p>
          </ChartCard>

          <ChartCard
            title="Catch-up deltas (pp)"
            subtitle="Percentage-point rise in strategic targeting inside each bloc"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...STRATEGIC_INTENSITY].sort(
                    (a, b) => b.deltaPp - a.deltaPp,
                  )}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v} pp`}
                  />
                  <Tooltip
                    formatter={(v) => [`+${Number(v)} pp`, "Catch-up"]}
                  />
                  <Bar dataKey="deltaPp" radius={[4, 4, 0, 0]}>
                    {[...STRATEGIC_INTENSITY]
                      .sort((a, b) => b.deltaPp - a.deltaPp)
                      .map((r) => (
                        <Cell key={r.short} fill={r.fill} />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "flow" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="June 2026 monthly geography"
            subtitle={`${HEADLINE.juneTotal} GTA-documented developments — Big Three headlines, RoW counts`}
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
                    innerRadius={55}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {junePie.map((r) => (
                      <Cell key={r.name} fill={r.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${Number(v)}% · ${item?.payload?.interventions ?? ""} actions`,
                      item?.payload?.name ?? "Share",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-600">
              {JUNE_FLOW.map((r) => (
                <li key={r.short} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: r.fill }}
                  />
                  {r.short} {r.interventions} ({fmtPct(r.sharePct)})
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title="June flow bars"
            subtitle="Top-1 is the US at 20%; top-3 only 38% — rest-of-world still dominates the tape"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...JUNE_FLOW].sort((a, b) => b.sharePct - a.sharePct)}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 70]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={48}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${Number(v)}% · ${item?.payload?.interventions} actions`,
                      item?.payload?.bloc ?? "Share",
                    ]}
                  />
                  <Bar dataKey="sharePct" radius={[0, 4, 4, 0]}>
                    {[...JUNE_FLOW]
                      .sort((a, b) => b.sharePct - a.sharePct)
                      .map((r) => (
                        <Cell key={r.short} fill={r.fill} />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs leading-relaxed text-slate-600">
        <p className="font-semibold text-slate-800">Sources &amp; notes</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-700 underline-offset-2 hover:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
