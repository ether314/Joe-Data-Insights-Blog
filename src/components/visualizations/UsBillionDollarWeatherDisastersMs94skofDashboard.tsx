"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  ANNUAL_RECENT,
  COST_WATERFALL,
  FIVE_YEAR_AVG_COST_BN,
  HAZARD_COLORS,
  HAZARD_COST_LEADERS,
  HEADLINE,
  LONG_RUN_AVG_COST_BN,
  NORMALIZATION_SERIES,
  SOURCE_NOTE,
  SOURCES,
  STATE_COST_LEADERS,
  TOP_EVENTS_2024,
  fmtBn,
  fmtPct,
  fmtTn,
} from "@/data/us-billion-dollar-weather-disasters-ms94skof-data";

// viz-types: waterfall-steps, dual-index-line, annual-band-reference, hazard-donut | layout: fullscreen

type NormalizeMode = "cpi" | "index" | "gdp";
type AnnualMetric = "cost" | "events" | "multiple";

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

/** Bridge waterfall: invisible pedestal + visible step */
function buildWaterfallBars() {
  let pedestal = 0;
  return COST_WATERFALL.map((row) => {
    if (row.type === "base" || row.type === "total") {
      const out = {
        step: row.step,
        pedestal: 0,
        rise: row.value,
        fill:
          row.type === "total"
            ? "#e11d48"
            : "#0ea5e9",
      };
      pedestal = row.running;
      return out;
    }
    const out = {
      step: row.step,
      pedestal,
      rise: row.value,
      fill: "#f59e0b",
    };
    pedestal = row.running;
    return out;
  });
}

export function UsBillionDollarWeatherDisastersMs94skofDashboard() {
  const [normalize, setNormalize] = useState<NormalizeMode>("cpi");
  const [annualMetric, setAnnualMetric] = useState<AnnualMetric>("cost");

  const waterfall = useMemo(() => buildWaterfallBars(), []);

  const dualIndex = useMemo(() => {
    if (normalize === "cpi") {
      return NORMALIZATION_SERIES.map((d) => ({
        period: d.period,
        primary: d.costPerYearBn,
        secondary: d.costShareGdpPct,
        primaryName: "CPI cost / yr ($B)",
        secondaryName: "GDP share (%)",
      }));
    }
    if (normalize === "index") {
      return NORMALIZATION_SERIES.map((d) => ({
        period: d.period,
        primary: d.cpiCostIndex,
        secondary: d.gdpShareIndex,
        primaryName: "CPI cost index (1980s=100)",
        secondaryName: "GDP-share index (1980s=100)",
      }));
    }
    return NORMALIZATION_SERIES.map((d) => ({
      period: d.period,
      primary: d.costShareGdpPct,
      secondary: d.costPerYearBn / 100,
      primaryName: "Cost share of GDP (%)",
      secondaryName: "CPI cost / yr ($100B)",
    }));
  }, [normalize]);

  const annualBand = useMemo(() => {
    return ANNUAL_RECENT.map((r) => {
      const value =
        annualMetric === "cost"
          ? r.costBn
          : annualMetric === "events"
            ? r.events
            : r.vsLongRunMultiple;
      return {
        year: r.year,
        value,
        longRun:
          annualMetric === "cost"
            ? LONG_RUN_AVG_COST_BN
            : annualMetric === "events"
              ? HEADLINE.fortyFiveYearEventsPerYear
              : 1,
        fiveYear:
          annualMetric === "cost"
            ? FIVE_YEAR_AVG_COST_BN
            : annualMetric === "events"
              ? HEADLINE.fiveYearEventsPerYear
              : FIVE_YEAR_AVG_COST_BN / LONG_RUN_AVG_COST_BN,
      };
    });
  }, [annualMetric]);

  const annualLabel =
    annualMetric === "cost"
      ? "CPI cost ($B)"
      : annualMetric === "events"
        ? "Events"
        : "× long-run avg cost";

  const hazardPie = useMemo(
    () =>
      HAZARD_COST_LEADERS.map((h) => ({
        name: h.shortLabel,
        value: h.costBn,
        fill: HAZARD_COLORS[h.shortLabel] ?? "#94a3b8",
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="us-billion-dollar-weather-disasters-ms94skof"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 text-white sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
          Adaptation economics — inflation-adjusted annual total
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {fmtBn(HEADLINE.fiveYearCostPerYearBn)} / year — and the decade
          increments keep widening
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          NOAA&apos;s CPI ledger puts 2020–24 at ~{HEADLINE.costMultipleVs1980s}×
          the 1980s annual total. The waterfall below shows first differences —
          each decade&apos;s added cost/year is larger than the last.
        </p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        {SOURCE_NOTE}
      </div>

      <div className="flex flex-wrap gap-4">
        <ToggleGroup
          label="Normalize"
          value={normalize}
          onChange={setNormalize}
          options={[
            { id: "cpi", label: "CPI $ / year" },
            { id: "index", label: "Index (1980s=100)" },
            { id: "gdp", label: "% of GDP" },
          ]}
        />
        <ToggleGroup
          label="Annual band"
          value={annualMetric}
          onChange={setAnnualMetric}
          options={[
            { id: "cost", label: "Cost $" },
            { id: "events", label: "Events" },
            { id: "multiple", label: "vs long-run" },
          ]}
        />
      </div>

      <ChartCard
        title="Acceleration waterfall: building the $149B / year average"
        subtitle="Invisible pedestal + amber rises = first differences. Each increment is larger than the prior decade."
      >
        <div className="h-80 min-h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%" minHeight={280}>
            <BarChart data={waterfall} margin={{ top: 8, right: 16, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="step" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `$${v}B`}
              />
              <Tooltip
                formatter={(v, name) =>
                  name === "rise" || name === "Rise"
                    ? fmtBn(Number(v ?? 0))
                    : null
                }
              />
              <Bar dataKey="pedestal" stackId="w" fill="transparent" name="Base" />
              <Bar dataKey="rise" stackId="w" name="Rise" radius={[4, 4, 0, 0]}>
                {waterfall.map((r) => (
                  <Cell key={r.step} fill={r.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Latest step: +{fmtBn(HEADLINE.accelerationLatestDeltaBn)} / year from
          the 2010s to 2020–24 — the steepest decade increment in the CPI series.
        </p>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="CPI dollars vs GDP share — same decades, two normalizations"
          subtitle="Toggle Normalize above. CPI index hits ~679 (1980s=100); GDP-share index rises far more slowly."
        >
          <div className="h-72 min-h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={280}>
              <LineChart data={dualIndex} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="primary"
                  name={dualIndex[0]?.primaryName ?? "Primary"}
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="secondary"
                  name={dualIndex[0]?.secondaryName ?? "Secondary"}
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  strokeDasharray="5 4"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Hazard cost share (1980–2024)"
          subtitle="Donut of cumulative CPI cost — hurricanes write ~53% of the ledger"
        >
          <div className="h-72 min-h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={280}>
              <PieChart>
                <Pie
                  data={hazardPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {hazardPie.map((h) => (
                    <Cell key={h.name} fill={h.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => fmtBn(Number(v ?? 0))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title={`Annual band — ${annualLabel} vs long-run and 5-year averages`}
        subtitle="Shaded path is the year print. Reference lines: 45-year average and 2020–24 average."
      >
        <div className="h-80 min-h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%" minHeight={280}>
            <ComposedChart data={annualBand} margin={{ top: 8, right: 16, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) =>
                  annualMetric === "cost"
                    ? `$${v}`
                    : annualMetric === "multiple"
                      ? `${v}×`
                      : String(v)
                }
              />
              <Tooltip
                formatter={(v, name) => {
                  const n = Number(v ?? 0);
                  if (String(name).toLowerCase().includes("value") || name === annualLabel) {
                    if (annualMetric === "cost") return fmtBn(n);
                    if (annualMetric === "multiple") return `${n.toFixed(2)}×`;
                    return String(n);
                  }
                  return annualMetric === "cost" ? fmtBn(n) : String(n);
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                name={annualLabel}
                stroke="#0284c7"
                fill="#0ea5e9"
                fillOpacity={0.2}
                strokeWidth={2.5}
              />
              <ReferenceLine
                y={annualBand[0]?.longRun}
                stroke="#64748b"
                strokeDasharray="4 4"
                label={{ value: "45-yr avg", position: "insideTopRight", fontSize: 11 }}
              />
              <ReferenceLine
                y={annualBand[0]?.fiveYear}
                stroke="#e11d48"
                strokeDasharray="4 4"
                label={{ value: "5-yr avg", position: "insideTopLeft", fontSize: 11 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="State cost concentration"
          subtitle="Climate.gov cumulative CPI costs — Florida, Texas, Louisiana lead"
        >
          <div className="h-64 min-h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={240}>
              <BarChart
                data={STATE_COST_LEADERS}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `$${v}B`} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="state" width={80} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `~${fmtBn(Number(v ?? 0), 0)}`} />
                <Bar dataKey="costBn" name="Cumulative cost" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

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
                    <td className="py-2.5 pr-4 font-semibold text-rose-700">
                      {fmtBn(e.costBn)}
                    </td>
                    <td className="py-2.5 text-slate-700">{e.deaths}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Cumulative since 1980: {HEADLINE.cumulativeEvents} events ·{" "}
            {fmtTn(HEADLINE.cumulativeCostTn)} · GDP share {fmtPct(HEADLINE.gdpShare1980s)} →{" "}
            {fmtPct(HEADLINE.gdpShare2020s)}
          </p>
        </ChartCard>
      </div>

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
