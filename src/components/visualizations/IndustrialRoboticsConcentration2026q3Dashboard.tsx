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
  CONCENTRATION_CURVE_2024,
  CONCENTRATION_CURVE_2025,
  CONCENTRATION_PATH,
  DELTA_CAPTURE,
  HEADLINE,
  INDUSTRY_SHARES,
  MARKET_SHARES,
  REGION_SHARES,
  SHARE_GROWTH_SCATTER,
  SOURCE_NOTE,
  TOP_K_LADDER,
  fmtPct,
  fmtSigned,
  fmtUnits,
  type VintageKey,
} from "@/data/industrial-robotics-concentration-2026q3-data";

// viz-types: Lorenz area+line, ranked share bars, delta capture bars, path multi-line, region donut, share×growth scatter | layout: default

type ViewId = "ladder" | "delta" | "path" | "industry";
type LadderMetric = "sharePct" | "units" | "cumulativeSharePct";

const ROSE = "#f43f5e";
const AMBER = "#f59e0b";
const SKY = "#0ea5e9";
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

export function IndustrialRoboticsConcentration2026q3Dashboard() {
  const [view, setView] = useState<ViewId>("ladder");
  const [vintage, setVintage] = useState<VintageKey>("2025");
  const [ladderMetric, setLadderMetric] = useState<LadderMetric>("sharePct");
  const [showEqualLine, setShowEqualLine] = useState(true);
  const [industryLens, setIndustryLens] = useState<"share" | "yoy">("share");

  const curve = vintage === "2025" ? CONCENTRATION_CURVE_2025 : CONCENTRATION_CURVE_2024;

  const ladderBars = useMemo(() => {
    return [...MARKET_SHARES]
      .map((m) => {
        const sharePct = vintage === "2025" ? m.share2025Pct : m.share2024Pct;
        const units = vintage === "2025" ? m.units2025 : m.units2024;
        const cumulativeSharePct =
          (vintage === "2025" ? CONCENTRATION_CURVE_2025 : CONCENTRATION_CURVE_2024).find(
            (c) => c.rank === m.rank,
          )?.cumulativeSharePct ?? sharePct;
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

  const industryBars = useMemo(() => {
    return INDUSTRY_SHARES.filter((i) => i.short !== "Other").map((i) => ({
      ...i,
      value: industryLens === "share" ? i.share2025Pct : i.yoyPct,
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

  const deltaSorted = useMemo(
    () => [...DELTA_CAPTURE].sort((a, b) => b.deltaUnits - a.deltaUnits),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="industrial-robotics-concentration-2026q3"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300/90">
          Industrial robotics — Q3 concentration lens
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
          On the 2025 prelim install ledger, Top-1 China rises to{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.top1Share2025Pct, 1)}
          </span>{" "}
          (from {fmtPct(HEADLINE.top1Share2024Pct)} in 2024); Top-3 reaches{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.top3Share2025Pct, 1)}
          </span>
          . China&apos;s estimated +85k units is{" "}
          <span className="font-semibold text-white">
            {HEADLINE.top1DeltaVsWorldPct}%
          </span>{" "}
          of the world net add — concentration tightened as the cycle re-accelerated.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {topK.map((row) => (
            <div
              key={row.k}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {row.label} ({vintage})
              </p>
              <p className="text-xl font-bold tabular-nums text-white">
                {fmtPct(row.sharePct, row.sharePct % 1 === 0 ? 0 : 1)}
              </p>
              <p className="text-[11px] text-slate-400">{row.note}</p>
            </div>
          ))}
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              HHI ({vintage})
            </p>
            <p className="text-xl font-bold tabular-nums text-white">
              {vintage === "2025" ? HEADLINE.marketHhi2025 : HEADLINE.marketHhi2024}
            </p>
            <p className="text-[11px] text-slate-400">
              {vintage === "2025" ? "up from 3,120" : "2024 WR ladder"}
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
            { id: "delta", label: "Delta capture" },
            { id: "path", label: "Multi-year path" },
            { id: "industry", label: "Industry mix" },
          ]}
        />
        {(view === "ladder" || view === "path") && (
          <ToggleGroup
            label="Vintage"
            value={vintage}
            onChange={setVintage}
            options={[
              { id: "2024", label: "2024 WR" },
              { id: "2025", label: "2025 prelim" },
            ]}
          />
        )}
        {view === "ladder" && (
          <>
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
        {view === "industry" && (
          <ToggleGroup
            label="Bars"
            value={industryLens}
            onChange={setIndustryLens}
            options={[
              { id: "share", label: "2025 share %" },
              { id: "yoy", label: "2025 YoY %" },
            ]}
          />
        )}
      </div>

      {view === "ladder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Cumulative share vs equal split"
            subtitle={`Lorenz-style curve — ${vintage} vintage how fast share piles up by rank`}
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

      {view === "delta" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Who captured the world net add"
            subtitle={`World +${fmtUnits(HEADLINE.worldDelta)} units (2024→2025p) — China alone ~${HEADLINE.top1DeltaVsWorldPct}% of the delta`}
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deltaSorted} margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => fmtUnits(v)}
                  />
                  <Tooltip
                    formatter={(v) => [fmtSigned(Number(v)), "Δ units"]}
                  />
                  <ReferenceLine y={0} stroke={SLATE} />
                  <Bar dataKey="deltaUnits" radius={[4, 4, 0, 0]}>
                    {deltaSorted.map((d) => (
                      <Cell key={d.market} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Regional share — 2024 vs 2025 prelim"
            subtitle="Asia +5pp; Europe −3pp; Americas flat at 9%"
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

      {view === "path" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Top-1 / Top-3 / Asia share path"
            subtitle="Concentration meters across the WR → prelim bridge"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CONCENTRATION_PATH}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[45, 85]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
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
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="HHI bridge"
            subtitle="Market HHI from top-5 + residual bucket (0–10,000 scale)"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      label: "2024 WR",
                      hhi: HEADLINE.marketHhi2024,
                      fill: SLATE,
                    },
                    {
                      label: "2025 prelim",
                      hhi: HEADLINE.marketHhi2025,
                      fill: ROSE,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 5000]} />
                  <Tooltip formatter={(v) => [Number(v).toLocaleString(), "HHI"]} />
                  <Bar dataKey="hhi" radius={[4, 4, 0, 0]}>
                    <Cell fill={SLATE} />
                    <Cell fill={ROSE} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "industry" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Industry concentration"
            subtitle={
              industryLens === "share"
                ? "Estimated 2025 share of world installs"
                : "Disclosed 2025 YoY — electronics leads the rebound"
            }
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={industryBars} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={88}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [
                      fmtPct(Number(v), 1),
                      industryLens === "share" ? "Share" : "YoY",
                    ]}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {industryBars.map((i) => (
                      <Cell key={i.industry} fill={i.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Share × growth scatter"
            subtitle="2025 prelim share vs YoY — who is large and still scaling"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Share"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    domain={[0, 70]}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="YoY"
                    unit="%"
                    tick={{ fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => {
                      if (name === "Share" || name === "x")
                        return [fmtPct(Number(v), 1), "Share"];
                      if (name === "YoY" || name === "y")
                        return [`${Number(v)}%`, "YoY"];
                      return [String(v), String(name)];
                    }}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.short ?? ""
                    }
                  />
                  <ReferenceLine y={0} stroke={SLATE} strokeDasharray="4 4" />
                  <Scatter data={scatterData} name="Markets">
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

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
