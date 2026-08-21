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
  HHI_BANDS,
  LAYER_SHARES,
  LEVERAGE_SCATTER,
  LENS_COMPARE,
  SOURCE_NOTE,
  TE_FAMILY_STACK,
  TRUST_CROSSOVER,
  curveForLens,
  fmtBn,
  fmtHhi,
  fmtPct,
  fmtTn,
  hhiBand,
  sharesForLens,
  type LensId,
} from "@/data/fiscal-plumbing-concentration-2026-data";

// viz-types: Lens ladder bars, Lorenz area+line, trust-fund crossover stacks, HHI donut, leverage scatter, TE family bars | layout: default

type ViewId = "ladder" | "curve" | "crossover" | "leverage";
type Metric = "top1" | "top3" | "hhi";

const SKY = "#0ea5e9";
const ROSE = "#f43f5e";
const AMBER = "#f59e0b";
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

export function FiscalPlumbingConcentration2026Dashboard() {
  const [view, setView] = useState<ViewId>("ladder");
  const [metric, setMetric] = useState<Metric>("top3");
  const [lens, setLens] = useState<LensId>("tax-exp");
  const [showEqual, setShowEqual] = useState(true);
  const [crossoverMode, setCrossoverMode] = useState<"flow" | "gap">("flow");

  const ladderBars = useMemo(() => {
    return [...LENS_COMPARE].sort((a, b) => {
      const av =
        metric === "top1" ? a.top1Pct : metric === "top3" ? a.top3Pct : a.hhi;
      const bv =
        metric === "top1" ? b.top1Pct : metric === "top3" ? b.top3Pct : b.hhi;
      return bv - av;
    });
  }, [metric]);

  const shareRows = useMemo(() => {
    const rows = sharesForLens(lens);
    return rows.filter((r) => !r.id.startsWith("rest"));
  }, [lens]);

  const curve = useMemo(() => curveForLens(lens), [lens]);

  const hhiDonut = useMemo(() => {
    const counts = { Unconcentrated: 0, Moderate: 0, High: 0 };
    for (const row of LENS_COMPARE) {
      counts[hhiBand(row.hhi) as keyof typeof counts] += 1;
    }
    return HHI_BANDS.map((b) => ({
      ...b,
      label: b.band,
      count: counts[b.band as keyof typeof counts] ?? 0,
    })).filter((b) => b.count > 0);
  }, []);

  const crossoverData = useMemo(
    () =>
      TRUST_CROSSOVER.map((t) => ({
        ...t,
        cost: t.annualCostBn,
        rev: t.dedicatedRevBn,
        gap: t.gapBn,
      })),
    [],
  );

  const scatter = useMemo(
    () =>
      LEVERAGE_SCATTER.map((r) => ({
        ...r,
        x: r.budgetVisibility,
        y: r.policyLeverage,
        z: Math.max(60, Math.sqrt(r.stockTn) * 55),
      })),
    [],
  );

  const metricLabel =
    metric === "top1"
      ? "Top-1 share %"
      : metric === "top3"
        ? "Top-3 share %"
        : "HHI";

  const metricValue = (row: (typeof ladderBars)[0]) =>
    metric === "top1"
      ? row.top1Pct
      : metric === "top3"
        ? row.top3Pct
        : row.hhi;

  const lensTitle =
    LENS_COMPARE.find((l) => l.lens === lens)?.label ?? "Selected lens";

  return (
    <div
      className="space-y-6"
      data-viz="fiscal-plumbing-concentration-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Fiscal plumbing — concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Top-1 tax expenditure {HEADLINE.teTop1Pct}% · Top-3{" "}
          {HEADLINE.teTop3Pct}%
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Inside JCT&apos;s ~${HEADLINE.teUniverseTn}T FY2026 tax-expenditure
          universe, pensions alone are{" "}
          <span className="text-sky-300">~{HEADLINE.teTop1Pct}%</span> and the
          top three clear{" "}
          <span className="text-amber-300">~{HEADLINE.teTop3Pct}%</span>. Trust
          outlays concentrate harder — OASI is ~{HEADLINE.trustTop1Pct}% of the
          dedicated-cost spine — while off-balance credit stocks put FDIC + GSE
          MBS near {HEADLINE.offTop3Pct - 9}% of a ~{fmtTn(HEADLINE.offStockTn)}{" "}
          backstop map.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "TE Top-1",
              value: fmtPct(HEADLINE.teTop1Pct),
              sub: HEADLINE.teTop1Label,
            },
            {
              label: "TE Top-3",
              value: fmtPct(HEADLINE.teTop3Pct),
              sub: fmtBn(HEADLINE.teTop3Bn),
            },
            {
              label: "Trust Top-1",
              value: fmtPct(HEADLINE.trustTop1Pct),
              sub: HEADLINE.trustTop1Label,
            },
            {
              label: "Off-balance Top-3",
              value: fmtPct(HEADLINE.offTop3Pct),
              sub: "FDIC · GSE · FHA/VA",
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
              <p className="mt-0.5 text-xs text-slate-400">{k.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={view}
          options={[
            { id: "ladder", label: "Lens ladder" },
            { id: "curve", label: "Concentration curve" },
            { id: "crossover", label: "Trust crossovers" },
            { id: "leverage", label: "Off-balance leverage" },
          ]}
          onChange={setView}
        />
        <div className="flex flex-wrap items-center gap-3">
          <ToggleGroup
            label="Metric"
            value={metric}
            options={[
              { id: "top1", label: "Top-1" },
              { id: "top3", label: "Top-3" },
              { id: "hhi", label: "HHI" },
            ]}
            onChange={setMetric}
          />
          <ToggleGroup
            label="Lens"
            value={lens}
            options={[
              { id: "tax-exp", label: "Tax exp." },
              { id: "trust", label: "Trust funds" },
              { id: "off-balance", label: "Off-balance" },
              { id: "layers", label: "Layers" },
            ]}
            onChange={setLens}
          />
        </div>
      </div>

      {view === "ladder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={`${metricLabel} across plumbing lenses`}
            subtitle="Four systems · sorted descending · not one shared denominator"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ladderBars.map((r) => ({
                    ...r,
                    value: metricValue(r),
                    name: r.label,
                  }))}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    domain={metric === "hhi" ? [0, "auto"] : [0, 100]}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      metric === "hhi"
                        ? fmtHhi(Number(v ?? 0))
                        : fmtPct(Number(v ?? 0))
                    }
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {ladderBars.map((r) => (
                      <Cell key={r.lens} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="HHI band mix"
            subtitle="How many of the four lenses sit in each concentration band"
          >
            <div className="h-[280px] w-full min-w-0">
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
                      <Cell key={b.band} fill={b.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
              {hhiDonut.map((b) => (
                <li key={b.band} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: b.fill }}
                  />
                  {b.band}: {b.count}
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title={`${lensTitle} — ranked shares`}
            subtitle="Toggle Lens above · residual omitted for readability"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={shareRows.map((r) => ({
                    name: r.short,
                    share: r.sharePct,
                    fill: r.fill,
                  }))}
                  margin={{ top: 8, right: 12, left: 0, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    angle={-28}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    domain={[0, "auto"]}
                    unit="%"
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                  <Bar dataKey="share" radius={[4, 4, 0, 0]}>
                    {shareRows.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Tax-expenditure families inside top-10"
            subtitle="Health + capital + retirement dominate disclosed JCT top-10 dollars"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={TE_FAMILY_STACK}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis
                    type="category"
                    dataKey="family"
                    width={130}
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <Tooltip formatter={(v) => fmtBn(Number(v ?? 0))} />
                  <Bar dataKey="bn" radius={[0, 4, 4, 0]}>
                    {TE_FAMILY_STACK.map((r) => (
                      <Cell key={r.family} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "curve" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={`${lensTitle} concentration curve`}
            subtitle="Cumulative top-k share vs equal-share reference"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Equal line"
                value={showEqual ? "on" : "off"}
                options={[
                  { id: "on", label: "Show" },
                  { id: "off", label: "Hide" },
                ]}
                onChange={(v) => setShowEqual(v === "on")}
              />
            </div>
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={curve}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                  <Area
                    type="monotone"
                    dataKey="sharePct"
                    fill={`${SKY}33`}
                    stroke={SKY}
                    strokeWidth={2}
                    name="Cumulative share"
                  />
                  {showEqual && (
                    <Line
                      type="monotone"
                      dataKey="equalPct"
                      stroke={SLATE}
                      strokeDasharray="4 4"
                      dot={false}
                      name="Equal share"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Plumbing-layer composition"
            subtitle="Editorial annual-flow map — tax code vs trust vs discretionary"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={LAYER_SHARES}
                    dataKey="sharePct"
                    nameKey="short"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={(props) => {
                      const name = String(props.name ?? "");
                      const value = Number(props.value ?? 0);
                      return `${name} ${fmtPct(value, 0)}`;
                    }}
                  >
                    {LAYER_SHARES.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, item) => [
                      fmtPct(Number(v ?? 0)),
                      String(
                        (item as { payload?: { label?: string } })?.payload
                          ?.label ?? "",
                      ),
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "crossover" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Trust-fund revenue vs cost"
            subtitle="Dedicated revenue against annual cost — negative gap drains reserves"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Mode"
                value={crossoverMode}
                options={[
                  { id: "flow", label: "Rev · Cost" },
                  { id: "gap", label: "Gap only" },
                ]}
                onChange={setCrossoverMode}
              />
            </div>
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                {crossoverMode === "flow" ? (
                  <BarChart
                    data={crossoverData}
                    margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="short"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Tooltip formatter={(v) => fmtBn(Number(v ?? 0))} />
                    <Bar
                      dataKey="rev"
                      name="Dedicated revenue"
                      fill={SKY}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="cost"
                      name="Annual cost"
                      fill={ROSE}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <BarChart
                    data={crossoverData}
                    margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="short"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Tooltip formatter={(v) => fmtBn(Number(v ?? 0))} />
                    <Bar dataKey="gap" name="Revenue − cost" radius={[4, 4, 0, 0]}>
                      {crossoverData.map((r) => (
                        <Cell
                          key={r.id}
                          fill={r.gap >= 0 ? SKY : ROSE}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Depletion clocks"
            subtitle={`Combined OASDI ~${HEADLINE.oasdiDepletionYear} · HI ~${HEADLINE.hiDepletionYear} (Trustees mid-2020s vintage)`}
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={crossoverData.filter((t) => t.depletionYear != null)}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="short"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    domain={[2025, 2105]}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <Tooltip />
                  <Bar
                    yAxisId="right"
                    dataKey="reservesTn"
                    name="Reserves ($T)"
                    fill={`${AMBER}99`}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="depletionYear"
                    name="Depletion year"
                    stroke={ROSE}
                    strokeWidth={2}
                    dot={{ r: 5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "leverage" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Budget visibility × policy leverage"
            subtitle="Bubble size ∝ outstanding stock · high leverage often hides off the annual scorecard"
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 12, right: 16, left: 8, bottom: 12 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Budget visibility"
                    domain={[0, 50]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    label={{
                      value: "Budget visibility (0–100)",
                      position: "insideBottom",
                      offset: -4,
                      fill: "#64748b",
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Policy leverage"
                    domain={[40, 100]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    label={{
                      value: "Policy leverage",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#64748b",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => {
                      if (name === "Budget visibility" || name === "x")
                        return [Number(v), "Visibility"];
                      if (name === "Policy leverage" || name === "y")
                        return [Number(v), "Leverage"];
                      return [v, name];
                    }}
                    labelFormatter={(_, payload) => {
                      const p = payload?.[0]?.payload as
                        | { short?: string; stockTn?: number }
                        | undefined;
                      return p
                        ? `${p.short} · ${fmtTn(p.stockTn ?? 0)}`
                        : "";
                    }}
                  />
                  <Scatter data={scatter} name="Vehicles">
                    {scatter.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Off-balance stock ladder"
            subtitle={`Universe ~${fmtTn(HEADLINE.offStockTn)} · Top-3 ${fmtPct(HEADLINE.offTop3Pct)}`}
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sharesForLens("off-balance").map((r) => ({
                    name: r.short,
                    tn: r.value,
                    fill: r.fill,
                  }))}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <Tooltip formatter={(v) => fmtTn(Number(v ?? 0))} />
                  <Bar dataKey="tn" radius={[0, 4, 4, 0]}>
                    {sharesForLens("off-balance").map((r) => (
                      <Cell key={r.id} fill={r.fill} />
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
