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
  BLOC_ADDS,
  HEADLINE,
  REGIONS_2024,
  RENEW_SHARE_PATH,
  SOLAR_LEADERS,
  SOURCE_NOTE,
  SOURCES,
  STOCK_SHARES,
  TECH_2024,
  TRIPLE_PATHS,
  fmtGw,
  fmtPct,
  fmtTw,
} from "@/data/irena-renewable-capacity-data";

// viz-types: ranked-bar, pie, composed line+area, scatter, custom share bars | layout: fullscreen

type Tab = "tech" | "map" | "solar" | "path";
type RankMode = "additions" | "stock";

const TEAL = "#0d9488";
const AMBER = "#f59e0b";
const SKY = "#0ea5e9";
const ROSE = "#f43f5e";
const VIOLET = "#8b5cf6";
const SLATE = "#64748b";
const TECH_COLORS = [AMBER, SKY, TEAL, VIOLET, ROSE, SLATE];

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
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              value === o.id
                ? "bg-amber-700 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function IrenaRenewableCapacityDashboard() {
  const [tab, setTab] = useState<Tab>("tech");
  const [rankMode, setRankMode] = useState<RankMode>("additions");

  const techBars = useMemo(() => {
    const rows = [...TECH_2024].filter((t) =>
      rankMode === "additions" ? t.addGw > 0 || t.tech === "Marine" : true,
    );
    return rows.sort((a, b) =>
      rankMode === "additions" ? b.addGw - a.addGw : b.stockGw - a.stockGw,
    );
  }, [rankMode]);

  const regionBars = useMemo(() => {
    const rows = [...REGIONS_2024];
    return rows.sort((a, b) =>
      rankMode === "additions" ? b.addGw - a.addGw : b.stockGw - a.stockGw,
    );
  }, [rankMode]);

  return (
    <div data-viz="irena-renewable-capacity" className="mx-auto w-full max-w-6xl space-y-6">
      <header className="rounded-xl border border-amber-900/20 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/90">
          Global renewable capacity — IRENA 2024
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {fmtGw(HEADLINE.additionsGw)} added — solar alone{" "}
          {fmtPct(HEADLINE.solarShareOfAddsPct, 0)} of new renewables
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          World renewable power capacity reached{" "}
          <strong className="text-white">{fmtGw(HEADLINE.stockGw)}</strong>{" "}
          (+{fmtPct(HEADLINE.growthPct)}). Of the{" "}
          <strong className="text-white">{fmtGw(HEADLINE.additionsGw)}</strong>{" "}
          net additions, solar was{" "}
          <strong className="text-white">{fmtGw(HEADLINE.solarAddGw)}</strong>{" "}
          and China alone accounted for{" "}
          <strong className="text-white">
            {fmtPct(HEADLINE.chinaShareOfAddsPct, 0)}
          </strong>{" "}
          of global renewable additions. Africa added{" "}
          {fmtGw(HEADLINE.africaAddGw, 1)} ({fmtPct(HEADLINE.africaShareOfAddsPct)}
          ).
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="View"
          value={tab}
          onChange={setTab}
          options={[
            { id: "tech", label: "By technology" },
            { id: "map", label: "By region" },
            { id: "solar", label: "Solar leaders" },
            { id: "path", label: "Share & 2030 path" },
          ]}
        />
        <ToggleGroup
          label="Rank"
          value={rankMode}
          onChange={setRankMode}
          options={[
            { id: "additions", label: "2024 additions" },
            { id: "stock", label: "End-2024 stock" },
          ]}
        />
      </div>

      {tab === "tech" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={
              rankMode === "additions"
                ? "2024 net additions by technology"
                : "End-2024 stock by technology"
            }
            subtitle="Highest → lowest. Solar + wind = 96.6% of 2024 renewable additions."
          >
            <div className="h-80 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <BarChart
                  data={techBars}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v} GW`}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={56}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value, _n, item) => {
                      const row = item?.payload as (typeof TECH_2024)[0];
                      return [
                        `${fmtGw(Number(value), 1)} · stock ${fmtGw(row.stockGw)}`,
                        row.tech,
                      ];
                    }}
                  />
                  <Bar
                    dataKey={rankMode === "additions" ? "addGw" : "stockGw"}
                    name="GW"
                    radius={[0, 6, 6, 0]}
                  >
                    {techBars.map((row, i) => (
                      <Cell
                        key={row.tech}
                        fill={TECH_COLORS[i % TECH_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="End-2024 renewable stock mix"
            subtitle="Solar is now the largest renewable stock (42%), ahead of hydro."
          >
            <div className="grid h-80 min-h-[280px] grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%" minHeight={220}>
                  <PieChart>
                    <Tooltip
                      formatter={(value, name) => [
                        `${fmtPct(Number(value), 0)}`,
                        String(name),
                      ]}
                    />
                    <Pie
                      data={STOCK_SHARES}
                      dataKey="pct"
                      nameKey="tech"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={88}
                      paddingAngle={2}
                    >
                      {STOCK_SHARES.map((row, i) => (
                        <Cell
                          key={row.tech}
                          fill={TECH_COLORS[i % TECH_COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="flex flex-col justify-center space-y-2 text-sm">
                {STOCK_SHARES.map((row, i) => (
                  <li
                    key={row.tech}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="flex items-center gap-2 text-slate-700">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{
                          background: TECH_COLORS[i % TECH_COLORS.length],
                        }}
                      />
                      {row.tech}
                    </span>
                    <span className="font-semibold tabular-nums text-slate-900">
                      {fmtPct(row.pct, 0)} · {fmtGw(row.gw)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "map" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={
              rankMode === "additions"
                ? "2024 additions by region"
                : "End-2024 stock by region"
            }
            subtitle="Asia took 72% of 2024 additions. Africa took 0.7%."
          >
            <div className="h-96 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <BarChart
                  data={regionBars}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v} GW`}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={88}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value, _n, item) => {
                      const row = item?.payload as (typeof REGIONS_2024)[0];
                      return [
                        `${fmtGw(Number(value), 1)} (${fmtPct(row.sharePct)} of stock)`,
                        row.region,
                      ];
                    }}
                  />
                  <Bar
                    dataKey={rankMode === "additions" ? "addGw" : "stockGw"}
                    name="GW"
                    fill={TEAL}
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="China vs everyone else (2024 additions)"
            subtitle="China alone = 63.9% of global renewable capacity additions."
          >
            <div className="h-96 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <BarChart
                  data={BLOC_ADDS}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v} GW`}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={120}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value, _n, item) => {
                      const row = item?.payload as (typeof BLOC_ADDS)[0];
                      return [
                        `${fmtGw(Number(value), 1)} (${fmtPct(row.shareOfGlobalAddsPct)} of adds)`,
                        row.label,
                      ];
                    }}
                  />
                  <Bar dataKey="addGw" name="Additions" radius={[0, 6, 6, 0]}>
                    {BLOC_ADDS.map((row) => (
                      <Cell
                        key={row.label}
                        fill={
                          row.label.startsWith("China") ? AMBER : TEAL
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "solar" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Solar PV additions — top countries 2024"
            subtitle="Bubble size = GW added. China is an outlier vs every other installer."
          >
            <div className="h-80 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <ScatterChart margin={{ top: 16, right: 24, bottom: 24, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="rank"
                    name="Rank"
                    domain={[0.5, 6.5]}
                    ticks={[1, 2, 3, 4, 5, 6]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Rank (1 = largest)",
                      position: "insideBottom",
                      offset: -10,
                      style: { fontSize: 11, fill: "#64748b" },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="addGw"
                    name="GW"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}`}
                    label={{
                      value: "Solar GW added",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 11, fill: "#64748b" },
                    }}
                  />
                  <ZAxis type="number" dataKey="addGw" range={[80, 800]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(value) => [fmtGw(Number(value), 1), "Solar added"]}
                    labelFormatter={(_l, payload) => {
                      const row = payload?.[0]?.payload as
                        | (typeof SOLAR_LEADERS)[0] & { rank: number }
                        | undefined;
                      return row?.country ?? "";
                    }}
                  />
                  <Scatter
                    name="Solar leaders"
                    data={SOLAR_LEADERS.map((r, i) => ({
                      ...r,
                      rank: i + 1,
                    }))}
                    fill={AMBER}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Solar vs wind vs everything else"
            subtitle="Custom share bars for 2024 renewable additions."
          >
            <div className="flex h-80 min-h-[280px] flex-col justify-center space-y-6 px-2">
              {[
                {
                  label: "Solar",
                  gw: HEADLINE.solarAddGw,
                  pct: HEADLINE.solarShareOfAddsPct,
                  color: AMBER,
                },
                {
                  label: "Wind",
                  gw: HEADLINE.windAddGw,
                  pct: (HEADLINE.windAddGw / HEADLINE.additionsGw) * 100,
                  color: SKY,
                },
                {
                  label: "Hydro + bio + geo + marine",
                  gw: HEADLINE.additionsGw - HEADLINE.solarAddGw - HEADLINE.windAddGw,
                  pct: 100 - HEADLINE.solarWindSharePct,
                  color: SLATE,
                },
              ].map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex justify-between text-sm font-semibold text-slate-800">
                    <span>{row.label}</span>
                    <span>
                      {fmtGw(row.gw, 1)} · {fmtPct(row.pct)}
                    </span>
                  </div>
                  <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, row.pct)}%`,
                        background: row.color,
                      }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs text-slate-500">
                Solar + wind together: {fmtPct(HEADLINE.solarWindSharePct)} of
                renewable additions.
              </p>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "path" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Renewables’ share of ALL power capacity expansion"
            subtitle="2023–24 disclosed (85.8% → 92.5%). Earlier years estimated trend anchors."
          >
            <div className="h-80 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <ComposedChart
                  data={RENEW_SHARE_PATH}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[50, 100]}
                  />
                  <Tooltip
                    formatter={(value) => [
                      fmtPct(Number(value)),
                      "Renewable share of expansion",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="renewSharePct"
                    name="Share band"
                    stroke="none"
                    fill={TEAL}
                    fillOpacity={0.2}
                  />
                  <Line
                    type="monotone"
                    dataKey="renewSharePct"
                    name="Renewable share"
                    stroke={TEAL}
                    strokeWidth={3}
                    dot={{ r: 5, fill: AMBER, stroke: TEAL }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="COP28 triple-renewables path — still short"
            subtitle="IRENA arithmetic: even repeating 2024’s 15.1% growth lands at ~10.4 TW by 2030 vs 11.2 TW target."
          >
            <div className="h-80 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <BarChart
                  data={TRIPLE_PATHS}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v} TW`}
                    domain={[0, 12]}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={140}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value, _n, item) => [
                      fmtTw(Number(value)),
                      (item?.payload as (typeof TRIPLE_PATHS)[0])?.label,
                    ]}
                  />
                  <Bar dataKey="tw" name="TW" radius={[0, 6, 6, 0]}>
                    {TRIPLE_PATHS.map((row) => (
                      <Cell
                        key={row.label}
                        fill={
                          row.label.includes("target")
                            ? ROSE
                            : row.label.includes("2024")
                              ? AMBER
                              : TEAL
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <footer className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs leading-relaxed text-slate-600">
        <p>{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                className="font-medium text-amber-800 underline-offset-2 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
