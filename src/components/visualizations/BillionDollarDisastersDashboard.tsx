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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  ANNUAL_RECENT,
  COMPOSITION_2024,
  COST_ACCELERATION,
  DECADES,
  HAZARD_COLORS,
  HAZARD_COST_LEADERS,
  HEADLINE,
  SOURCE_NOTE,
  SOURCES,
  TOP_EVENTS_2024,
  fmtBn,
  fmtPct,
  fmtTn,
  rollingAnnual,
} from "@/data/billion-dollar-disasters-data";

// viz-types: area-rolling, scatter-bubble, acceleration-lollipop, hazard-bar | layout: fullscreen

type Metric = "cost" | "events" | "gdp";
type WindowSize = 5 | 10;

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

function ToggleGroup<T extends string | number>({
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
            key={String(o.id)}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
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

export function BillionDollarDisastersDashboard() {
  const [metric, setMetric] = useState<Metric>("cost");
  const [windowSize, setWindowSize] = useState<WindowSize>(5);

  const rolling = useMemo(() => rollingAnnual(windowSize), [windowSize]);

  const areaData = useMemo(() => {
    return rolling.map((r) => ({
      year: r.year,
      value:
        metric === "cost"
          ? r.costBn
          : metric === "events"
            ? r.events
            : r.costShareGdpPct,
    }));
  }, [rolling, metric]);

  const scatterData = useMemo(
    () =>
      ANNUAL_RECENT.map((r) => ({
        year: r.year,
        events: r.events,
        costBn: r.costBn,
        size: Math.max(80, r.costBn),
      })),
    [],
  );

  const accelBars = useMemo(
    () => [...COST_ACCELERATION].sort((a, b) => b.deltaCostPerYearBn - a.deltaCostPerYearBn),
    [],
  );

  const decadeSlope = useMemo(
    () =>
      DECADES.map((d) => ({
        period: d.period,
        costPerYearBn: d.costPerYearBn,
        eventsPerYear: d.eventsPerYear,
        gdpShare: d.costShareGdpPct,
      })),
    [],
  );

  const metricLabel =
    metric === "cost"
      ? "CPI cost ($B / yr)"
      : metric === "events"
        ? "Events / yr"
        : "Cost share of GDP (%)";

  const areaFmt = (v: number) =>
    metric === "cost" ? fmtBn(v) : metric === "events" ? `${v.toFixed(1)} /yr` : fmtPct(v);

  return (
    <div className="space-y-6" data-viz="billion-dollar-disasters">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 p-5 text-white sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
          Adaptation economics — CPI-adjusted disaster ledger
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {fmtBn(HEADLINE.fiveYearCostPerYearBn)} / year now vs{" "}
          {fmtBn(HEADLINE.costPerYear1980sBn, 0)} in the 1980s
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Inflation-adjusted annual cost jumped ~{HEADLINE.costMultipleVs1980s}× while event
          frequency jumped ~{HEADLINE.frequencyMultipleVs1980s}×. Decade-to-decade{" "}
          <em>increments</em> in cost/year keep widening — the acceleration signal, not just the
          level.
        </p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        {SOURCE_NOTE}
      </div>

      <div className="flex flex-wrap gap-4">
        <ToggleGroup
          label="Rolling metric"
          value={metric}
          onChange={setMetric}
          options={[
            { id: "cost", label: "CPI $ / year" },
            { id: "events", label: "Events / year" },
            { id: "gdp", label: "% of GDP" },
          ]}
        />
        <ToggleGroup
          label="Window"
          value={windowSize}
          onChange={setWindowSize}
          options={[
            { id: 5, label: "5-year average" },
            { id: 10, label: "10-year average" },
          ]}
        />
      </div>

      <ChartCard
        title={`Rolling ${windowSize}-year average — ${metricLabel}`}
        subtitle="Toggle metric and window above. CPI dollars show the clearest acceleration; GDP share rises more modestly."
      >
        <div className="h-80 min-h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%" minHeight={280}>
            <AreaChart data={areaData} margin={{ top: 8, right: 16, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="bddFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) =>
                  metric === "cost" ? `$${v}` : metric === "gdp" ? `${v}%` : String(v)
                }
              />
              <Tooltip formatter={(v) => areaFmt(Number(v ?? 0))} />
              <Area
                type="monotone"
                dataKey="value"
                name={metricLabel}
                stroke="#0284c7"
                strokeWidth={2.5}
                fill="url(#bddFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Acceleration: change in cost/year between decades"
          subtitle="Each bar is the increment vs the prior decade — first differences keep growing"
        >
          <div className="h-72 min-h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={280}>
              <BarChart
                data={accelBars}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `+$${v}B`} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="step" width={110} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `+${fmtBn(Number(v ?? 0))} /yr`} />
                <Bar dataKey="deltaCostPerYearBn" name="Δ cost / year" radius={[0, 4, 4, 0]}>
                  {accelBars.map((r) => (
                    <Cell
                      key={r.step}
                      fill={r.deltaCostPerYearBn >= 40 ? "#e11d48" : "#f59e0b"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Events vs cost (2014–2024)"
          subtitle="Bubble size scales with CPI cost — 2017 is the cost outlier; 2023 leads on count"
        >
          <div className="h-72 min-h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={280}>
              <ScatterChart margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="events"
                  name="Events"
                  tick={{ fontSize: 11 }}
                  label={{ value: "Events", position: "insideBottom", offset: -2, fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="costBn"
                  name="Cost"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                />
                <ZAxis type="number" dataKey="size" range={[60, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) =>
                    name === "costBn" || name === "Cost"
                      ? fmtBn(Number(v ?? 0))
                      : String(v ?? "")
                  }
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as { year?: number } | undefined;
                    return p?.year ? `Year ${p.year}` : "";
                  }}
                />
                <Scatter name="Year" data={scatterData} fill="#0ea5e9" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Decade path: cost/year and events/year"
        subtitle="Composed view — bars = events/yr, line = CPI cost/yr (2020–24 is a partial decade)"
      >
        <div className="h-80 min-h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%" minHeight={280}>
            <ComposedChart data={decadeSlope} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(v) => `$${v}B`}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(v, name) =>
                  String(name).includes("cost") || String(name).includes("Cost")
                    ? fmtBn(Number(v ?? 0))
                    : `${Number(v ?? 0)} /yr`
                }
              />
              <Bar
                yAxisId="left"
                dataKey="eventsPerYear"
                name="Events / year"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="costPerYearBn"
                name="Cost / year"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          GDP share of annual cost: {fmtPct(HEADLINE.gdpShare1980s)} (1980s) →{" "}
          {fmtPct(HEADLINE.gdpShare2020s)} (2020–24) — slower climb than CPI dollars.
        </p>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Cost leaders by hazard (1980–2024)"
          subtitle="Hurricanes win dollars; severe storms win the count"
        >
          <div className="h-72 min-h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={280}>
              <BarChart
                data={HAZARD_COST_LEADERS}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `$${v}B`} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="shortLabel" width={100} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => fmtBn(Number(v ?? 0))} />
                <Bar dataKey="costBn" name="Cumulative cost" radius={[0, 4, 4, 0]}>
                  {HAZARD_COST_LEADERS.map((h) => (
                    <Cell key={h.shortLabel} fill={HAZARD_COLORS[h.shortLabel] ?? "#94a3b8"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="2024 event mix" subtitle="27 disasters — severe storms dominate the count">
          <div className="space-y-2.5">
            {[...COMPOSITION_2024]
              .sort((a, b) => b.count - a.count)
              .map((c) => (
                <div key={c.category} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 text-xs font-medium text-slate-700 sm:w-40">
                    {c.category}
                  </span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(c.count / HEADLINE.events2024) * 100}%`,
                        background: c.fill,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs font-semibold text-slate-800">
                    {c.count}
                  </span>
                </div>
              ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Helene + Milton alone exceeded $100B across the Southeast in two weeks.
          </p>
        </ChartCard>
      </div>

      <ChartCard title="Costliest 2024 events" subtitle="Disclosed Climate.gov / NCEI event costs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4">Event</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Cost</th>
                <th className="py-2">Deaths</th>
              </tr>
            </thead>
            <tbody>
              {TOP_EVENTS_2024.map((e) => (
                <tr key={e.name} className="border-b border-slate-100">
                  <td className="py-2.5 pr-4 font-medium text-slate-900">{e.name}</td>
                  <td className="py-2.5 pr-4 text-slate-600">{e.category}</td>
                  <td className="py-2.5 pr-4 font-semibold text-rose-700">{fmtBn(e.costBn)}</td>
                  <td className="py-2.5 text-slate-700">{e.deaths}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Cumulative since 1980: {HEADLINE.cumulativeEvents} events · {fmtTn(HEADLINE.cumulativeCostTn)}
        </p>
      </ChartCard>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          {SOURCES.map((s) => (
            <li key={s.label}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-800 underline underline-offset-2"
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
