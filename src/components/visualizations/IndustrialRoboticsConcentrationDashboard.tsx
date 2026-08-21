"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
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
  CHINA_SUPPLIER_SERIES,
  CONCENTRATION_CURVE,
  HEADLINE,
  INDUSTRY_SHARES,
  MARKET_SHARES,
  REGION_SHARES,
  SHARE_GROWTH_SCATTER,
  SOURCE_NOTE,
  STOCK_SHARES,
  TOP_K_LADDER,
  VINTAGE_BRIDGE,
  fmtPct,
  fmtUnits,
} from "@/data/industrial-robotics-concentration-2026-data";

// viz-types: Lorenz area+line, ranked share bars, region donut, supplier stacked area, industry bars, share×growth scatter | layout: default

type ViewId = "ladder" | "regions" | "suppliers" | "industry";
type LadderMetric = "sharePct" | "units2024" | "cumulativeSharePct";

const ROSE = "#f43f5e";
const AMBER = "#f59e0b";
const SKY = "#0ea5e9";
const VIOLET = "#8b5cf6";
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

export function IndustrialRoboticsConcentrationDashboard() {
  const [view, setView] = useState<ViewId>("ladder");
  const [ladderMetric, setLadderMetric] = useState<LadderMetric>("sharePct");
  const [showEqualLine, setShowEqualLine] = useState(true);
  const [industryLens, setIndustryLens] = useState<"global" | "china">("global");

  const ladderBars = useMemo(() => {
    return [...MARKET_SHARES]
      .map((m) => ({
        ...m,
        value:
          ladderMetric === "sharePct"
            ? m.sharePct
            : ladderMetric === "units2024"
              ? m.units2024
              : m.cumulativeSharePct,
      }))
      .sort((a, b) => b.value - a.value);
  }, [ladderMetric]);

  const regionDonut = useMemo(
    () =>
      REGION_SHARES.map((r) => ({
        name: r.short,
        value: r.share2024Pct,
        fill: r.fill,
      })),
    [],
  );

  const industryBars = useMemo(() => {
    return INDUSTRY_SHARES.filter((i) => i.short !== "Other").map((i) => ({
      ...i,
      value:
        industryLens === "global"
          ? i.sharePct
          : (i.chinaGlobalSharePct ?? 0),
      label:
        industryLens === "global"
          ? `${i.sharePct}% of world`
          : i.chinaGlobalSharePct != null
            ? `China ${i.chinaGlobalSharePct}% of global ${i.short.toLowerCase()}`
            : "n/a",
    }));
  }, [industryLens]);

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
      data-viz="industrial-robotics-concentration-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300/90">
          Industrial robotics — concentration lens
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
          Top-1 China holds{" "}
          <span className="font-semibold text-white">
            {HEADLINE.top1SharePct}%
          </span>{" "}
          of 2024 factory robot installations; Top-3 reaches{" "}
          <span className="font-semibold text-white">
            {HEADLINE.top3SharePct}%
          </span>
          ; Top-5{" "}
          <span className="font-semibold text-white">
            {HEADLINE.top5SharePct}%
          </span>
          . Asia&apos;s regional share rose from{" "}
          {HEADLINE.asiaShare2024Pct}% (WR 2025) to{" "}
          {HEADLINE.asiaShare2025PrelimPct}% (2025 prelim).
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TOP_K_LADDER.map((row) => (
            <div
              key={row.k}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {row.label}
              </p>
              <p className="text-xl font-bold tabular-nums text-white">
                {fmtPct(row.sharePct)}
              </p>
              <p className="text-[11px] text-slate-400">{row.note}</p>
            </div>
          ))}
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              CN domestic
            </p>
            <p className="text-xl font-bold tabular-nums text-white">
              {fmtPct(HEADLINE.chinaDomesticSupplierPct)}
            </p>
            <p className="text-[11px] text-slate-400">
              up from {HEADLINE.chinaDomesticPriorPct}%
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "ladder", label: "Concentration ladder" },
            { id: "regions", label: "Regions" },
            { id: "suppliers", label: "China suppliers" },
            { id: "industry", label: "Industry mix" },
          ]}
        />
        {view === "ladder" && (
          <>
            <ToggleGroup
              label="Metric"
              value={ladderMetric}
              onChange={setLadderMetric}
              options={[
                { id: "sharePct", label: "Share %" },
                { id: "units2024", label: "Units" },
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
        {view === "industry" && (
          <ToggleGroup
            label="Lens"
            value={industryLens}
            onChange={setIndustryLens}
            options={[
              { id: "global", label: "Global share" },
              { id: "china", label: "China of global" },
            ]}
          />
        )}
      </div>

      {view === "ladder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Cumulative share vs equal split"
            subtitle="Lorenz-style curve — how fast share piles up by market rank"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={CONCENTRATION_CURVE}>
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
                ? "% of 2024 world installations"
                : ladderMetric === "units2024"
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
                      ladderMetric === "units2024" ? fmtUnits(v) : `${v}%`
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
                      ladderMetric === "units2024"
                        ? fmtUnits(Number(v))
                        : fmtPct(Number(v), 1),
                      ladderMetric === "sharePct"
                        ? "Share"
                        : ladderMetric === "units2024"
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

      {view === "regions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="2024 regional install share"
            subtitle="Asia 74% — three continents, one gravity well"
          >
            <div className="h-72 w-full min-w-0">
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
          </ChartCard>

          <ChartCard
            title="WR 2025 → 2025 prelim bridge"
            subtitle="Concentration tightened further as Asia rose to 79%"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={VINTAGE_BRIDGE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="meter" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v, _n, item) => {
                      const unit = item?.payload?.unit;
                      return [
                        unit === "pct" ? `${v}%` : fmtUnits(Number(v)),
                        String(_n),
                      ];
                    }}
                  />
                  <Bar dataKey="wr2024" name="WR 2024" fill={SLATE} radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="prelim2025"
                    name="2025 prelim"
                    fill={AMBER}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Operational stock concentration"
            subtitle="China holds 43% of the world’s factory robot stock"
          >
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={STOCK_SHARES}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${Number(v).toFixed(1)}% · ${fmtUnits(item?.payload?.stock2024 ?? 0)}`,
                      "Stock share",
                    ]}
                  />
                  <Bar dataKey="sharePct" radius={[4, 4, 0, 0]}>
                    {STOCK_SHARES.map((s) => (
                      <Cell key={s.market} fill={s.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Share × growth scatter"
            subtitle="Who is large and still adding? Bubble ∝ 2024 units"
          >
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Share %"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "Install share %",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="YoY %"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <ZAxis type="number" dataKey="z" range={[40, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
                      String(name),
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.market ?? ""
                    }
                  />
                  <Scatter data={scatterData} name="Markets">
                    {scatterData.map((p) => (
                      <Cell key={p.market} fill={p.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "suppliers" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="China domestic vs foreign supplier share"
            subtitle="First domestic majority in 2024 — 57% vs 47% prior year"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHINA_SUPPLIER_SERIES}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, name) => [`${v}%`, String(name)]}
                  />
                  <Area
                    type="monotone"
                    dataKey="domesticPct"
                    name="Domestic"
                    stackId="1"
                    stroke={ROSE}
                    fill={ROSE}
                    fillOpacity={0.7}
                  />
                  <Area
                    type="monotone"
                    dataKey="foreignPct"
                    name="Foreign"
                    stackId="1"
                    stroke={SKY}
                    fill={SKY}
                    fillOpacity={0.55}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="What crossed in 2024"
            subtitle="Install demand stayed China-heavy while ownership of that demand flipped local"
          >
            <ul className="space-y-3 text-sm leading-relaxed text-slate-700">
              <li>
                <span className="font-semibold text-slate-900">Demand share:</span>{" "}
                China alone is {HEADLINE.top1SharePct}% of world installs (
                {fmtUnits(HEADLINE.top1Units)} units) — larger than the next
                nine named markets combined on a share basis.
              </li>
              <li>
                <span className="font-semibold text-slate-900">
                  Supplier share:
                </span>{" "}
                Domestic makers jumped {HEADLINE.chinaDomesticPriorPct}→
                {HEADLINE.chinaDomesticSupplierPct}% — the first year local
                brands outsold foreign brands at home.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Stock share:</span>{" "}
                China&apos;s operational stock is {HEADLINE.chinaStockSharePct}% of
                the world total (~2.03M of {fmtUnits(HEADLINE.worldUnits2024)}{" "}
                annual flow, 4.66M stock).
              </li>
              <li className="text-slate-500">
                Toggle other views for the regional donut, industry dual lens,
                and share×growth scatter.
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium text-white"
                style={{ backgroundColor: ROSE }}
              >
                Domestic {HEADLINE.chinaDomesticSupplierPct}%
              </span>
              <span
                className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium text-white"
                style={{ backgroundColor: SKY }}
              >
                Foreign {100 - HEADLINE.chinaDomesticSupplierPct}%
              </span>
              <span
                className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium text-white"
                style={{ backgroundColor: AMBER }}
              >
                Asia region {HEADLINE.asiaShare2024Pct}%
              </span>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "industry" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={
              industryLens === "global"
                ? "Customer industry share of world installs"
                : "China’s share of global industry installs"
            }
            subtitle={
              industryLens === "global"
                ? `Top-2 industries (electronics + auto) = ${HEADLINE.top2IndustrySharePct}%`
                : "China supplies 64% of global electronics robot installs"
            }
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={industryBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${v}%`,
                      item?.payload?.label ?? "Share",
                    ]}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {industryBars.map((i) => (
                      <Cell key={i.industry} fill={i.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Industry concentration read"
            subtitle="Customer mix is less concentrated than geography — but China still dominates the lead verticals"
          >
            <div className="space-y-4 text-sm leading-relaxed text-slate-700">
              <p>
                Electronics ({HEADLINE.electronicsSharePct}%) edged automotive (
                {HEADLINE.automotiveSharePct}%) as the largest customer class in
                2024. Together they are under half of world installs — a{" "}
                <span className="font-semibold text-slate-900">
                  flatter industry HHI
                </span>{" "}
                than the geography ladder, where Top-1 alone is{" "}
                {HEADLINE.top1SharePct}%.
              </p>
              <p>
                Switch to <span className="font-medium">China of global</span>:
                China accounts for ~64% of electronics robot installs and ~45% of
                automotive — concentration inside the lead industries, not just
                across countries.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <p className="text-[11px] uppercase text-slate-500">
                    Top-2 industries
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {fmtPct(HEADLINE.top2IndustrySharePct)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <p className="text-[11px] uppercase text-slate-500">
                    Approx. market HHI
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {HEADLINE.marketHhi2024.toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Colors: electronics {SKY}, automotive {ROSE}, metal {AMBER},
                plastic {VIOLET}, food {TEAL}.
              </p>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
