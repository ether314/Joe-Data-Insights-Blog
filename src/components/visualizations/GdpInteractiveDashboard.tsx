"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  buildIndiaChinaGapData,
  buildUsChinaGapData,
  GrowthGapLineChart,
} from "@/components/visualizations/GrowthGapLineChart";
import { COUNTRY_COMMENTARY } from "@/data/gdp-commentary";
import {
  CHART_COLORS,
  fmtPct,
  fmtT,
  fmtUsd,
  GDP_DATA,
  GDP_FIRST,
  GDP_LAST,
  type GdpYearRow,
} from "@/data/gdp-analysis-data";

function fmtPop(millions: number): string {
  if (millions >= 1000) return `${(millions / 1000).toFixed(2)} billion`;
  return `${millions.toFixed(0)} million`;
}

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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm w-full min-w-0">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function GdpTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 font-semibold text-slate-900">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: ${entry.value.toFixed(2)}T
        </p>
      ))}
    </div>
  );
}

function GrowthTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 font-semibold text-slate-900">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value >= 0 ? "+" : ""}{entry.value.toFixed(1)}%
        </p>
      ))}
    </div>
  );
}

function RatioTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-1 font-semibold text-slate-900">{label}</p>
      <p className="text-sm text-orange-600">China as % of US: {payload[0].value.toFixed(1)}%</p>
    </div>
  );
}

function YearExplorer({ row }: { row: GdpYearRow }) {
  const commentary = COUNTRY_COMMENTARY[row.year];

  const countries = [
    {
      label: "China",
      color: CHART_COLORS.china,
      gdp: row.chinaGdp,
      yoy: row.chinaYoY,
      pop: row.chinaPop,
      cap: row.chinaPerCap,
      text: commentary.china,
    },
    {
      label: "United States",
      color: CHART_COLORS.us,
      gdp: row.usGdp,
      yoy: row.usYoY,
      pop: row.usPop,
      cap: row.usPerCap,
      text: commentary.us,
    },
    {
      label: "India",
      color: CHART_COLORS.india,
      gdp: row.indiaGdp,
      yoy: row.indiaYoY,
      pop: row.indiaPop,
      cap: row.indiaPerCap,
      text: commentary.india,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Metric</th>
              <th className="px-4 py-3 text-right">China</th>
              <th className="px-4 py-3 text-right">United States</th>
              <th className="px-4 py-3 text-right">India</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3 font-medium text-slate-700">GDP (2025 USD)</td>
              <td className="px-4 py-3 text-right">{fmtT(row.chinaGdp)}</td>
              <td className="px-4 py-3 text-right">{fmtT(row.usGdp)}</td>
              <td className="px-4 py-3 text-right">{fmtT(row.indiaGdp)}</td>
            </tr>
            <tr className="bg-slate-50/50">
              <td className="px-4 py-3 font-medium text-slate-700">YoY growth</td>
              <td className="px-4 py-3 text-right">{fmtPct(row.chinaYoY)}</td>
              <td className="px-4 py-3 text-right">{fmtPct(row.usYoY)}</td>
              <td className="px-4 py-3 text-right">{fmtPct(row.indiaYoY)}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-slate-700">Population</td>
              <td className="px-4 py-3 text-right">{fmtPop(row.chinaPop)}</td>
              <td className="px-4 py-3 text-right">{fmtPop(row.usPop)}</td>
              <td className="px-4 py-3 text-right">{fmtPop(row.indiaPop)}</td>
            </tr>
            <tr className="bg-slate-50/50">
              <td className="px-4 py-3 font-medium text-slate-700">GDP per capita</td>
              <td className="px-4 py-3 text-right">{fmtUsd(row.chinaPerCap)}</td>
              <td className="px-4 py-3 text-right">{fmtUsd(row.usPerCap)}</td>
              <td className="px-4 py-3 text-right">{fmtUsd(row.indiaPerCap)}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-slate-700">China as % of US</td>
              <td className="px-4 py-3 text-right" colSpan={3}>
                {row.chinaUsRatio.toFixed(1)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {countries.map((c) => (
          <div
            key={c.label}
            className="rounded-lg border border-slate-200 bg-white p-4"
            style={{ borderTopColor: c.color, borderTopWidth: 3 }}
          >
            <p className="text-sm font-bold text-slate-900">{c.label}</p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">GDP</dt>
                <dd className="font-semibold text-slate-900">{fmtT(c.gdp)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Growth</dt>
                <dd className="font-medium text-slate-800">{fmtPct(c.yoy)} YoY</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Population</dt>
                <dd className="font-medium text-slate-800">{fmtPop(c.pop)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">GDP per capita</dt>
                <dd className="font-medium text-slate-800">{fmtUsd(c.cap)}</dd>
              </div>
            </dl>
            <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600">
              {c.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GdpInteractiveDashboard({ compact = false }: { compact?: boolean }) {
  const [selectedYear, setSelectedYear] = useState(GDP_LAST.year);
  const selected = GDP_DATA.find((d) => d.year === selectedYear) ?? GDP_LAST;

  const lineData = useMemo(
    () =>
      GDP_DATA.map((d) => ({
        year: d.year,
        US: d.usGdp / 1000,
        China: d.chinaGdp / 1000,
        India: d.indiaGdp / 1000,
      })),
    [],
  );

  const ratioData = useMemo(
    () => GDP_DATA.map((d) => ({ year: d.year, ratio: d.chinaUsRatio })),
    [],
  );

  const growthData = useMemo(
    () =>
      GDP_DATA.filter((d) => d.chinaYoY !== null).map((d) => ({
        year: d.year,
        China: d.chinaYoY ?? 0,
        US: d.usYoY ?? 0,
        India: d.indiaYoY ?? 0,
      })),
    [],
  );

  const usChinaGapData = useMemo(() => buildUsChinaGapData(GDP_DATA), []);
  const indiaChinaGapData = useMemo(() => buildIndiaChinaGapData(GDP_DATA), []);

  const perCapData = useMemo(
    () =>
      GDP_DATA.map((d) => ({
        year: d.year,
        US: Math.round(d.usPerCap),
        China: Math.round(d.chinaPerCap),
        India: Math.round(d.indiaPerCap),
      })),
    [],
  );

  const chinaGrowthTotal = ((GDP_LAST.chinaGdp - GDP_FIRST.chinaGdp) / GDP_FIRST.chinaGdp) * 100;
  const usGrowthTotal = ((GDP_LAST.usGdp - GDP_FIRST.usGdp) / GDP_FIRST.usGdp) * 100;
  const indiaGrowthTotal = ((GDP_LAST.indiaGdp - GDP_FIRST.indiaGdp) / GDP_FIRST.indiaGdp) * 100;

  return (
    <div className="site-content w-full min-w-0 space-y-6">
      {!compact && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "China GDP (2026)", value: fmtT(GDP_LAST.chinaGdp), sub: fmtPct(chinaGrowthTotal) + " since 1995", color: CHART_COLORS.china },
            { label: "US GDP (2026)", value: fmtT(GDP_LAST.usGdp), sub: fmtPct(usGrowthTotal) + " since 1995", color: CHART_COLORS.us },
            { label: "India GDP (2026)", value: fmtT(GDP_LAST.indiaGdp), sub: fmtPct(indiaGrowthTotal) + " since 1995", color: CHART_COLORS.india },
            { label: "China as % of US", value: `${GDP_LAST.chinaUsRatio.toFixed(1)}%`, sub: `Up from ${GDP_FIRST.chinaUsRatio.toFixed(1)}%`, color: "#f59e0b" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" style={{ borderLeft: `4px solid ${s.color}` }}>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500">{s.sub}</p>
            </div>
          ))}
        </div>
      )}

      <ChartCard title="The Great Divergence" subtitle="GDP in trillions of constant 2025 US dollars · Hover for values">
        <ResponsiveContainer width="100%" height={compact ? 280 : 380}>
          <LineChart data={lineData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} interval={4} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}T`} />
            <Tooltip content={<GdpTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="US" stroke={CHART_COLORS.us} strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} name="United States" />
            <Line type="monotone" dataKey="China" stroke={CHART_COLORS.china} strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} name="China" />
            <Line type="monotone" dataKey="India" stroke={CHART_COLORS.india} strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} name="India" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <GrowthGapLineChart
        title="US − China growth gap"
        subtitle="Percentage points · 2025 USD growth · hover for year commentary"
        data={usChinaGapData}
        gapName="US − China"
        gapColor={CHART_COLORS.us}
        compareName="United States"
        compareColor={CHART_COLORS.us}
        compare="us"
        footer="Year-over-year growth difference (US minus China), in percentage points. Orange line = even growth. Above zero = US grew faster."
      />

      <GrowthGapLineChart
        title="India − China growth gap"
        subtitle="Percentage points · 2025 USD growth · hover for year commentary"
        data={indiaChinaGapData}
        gapName="India − China"
        gapColor={CHART_COLORS.india}
        compareName="India"
        compareColor={CHART_COLORS.india}
        compare="india"
        footer="Year-over-year growth difference (India minus China), in percentage points. Orange line = even growth. Above zero = India grew faster."
      />

      <div className={`grid gap-6 ${compact ? "" : "lg:grid-cols-2"}`}>
        <ChartCard title="China Closing the Gap" subtitle="China GDP as % of United States">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={ratioData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} interval={4} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} domain={[0, 80]} />
              <Tooltip content={<RatioTooltip />} />
              <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="6 4" label={{ value: "50%", fill: "#f59e0b", fontSize: 11 }} />
              <Line type="monotone" dataKey="ratio" stroke={CHART_COLORS.china} strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} name="China % of US" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="GDP Per Capita" subtitle="Constant 2025 US dollars · Hover to compare">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={perCapData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} interval={4} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => fmtUsd(Number(v))} />
              <Legend />
              <Line type="monotone" dataKey="US" stroke={CHART_COLORS.us} strokeWidth={2} dot={false} name="United States" />
              <Line type="monotone" dataKey="China" stroke={CHART_COLORS.china} strokeWidth={2} dot={false} name="China" />
              <Line type="monotone" dataKey="India" stroke={CHART_COLORS.india} strokeWidth={2} dot={false} name="India" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Annual Growth Rates" subtitle="Year-over-year % change in constant 2025 USD · Hover any bar">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={growthData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} interval={3} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<GrowthTooltip />} />
            <Legend />
            <ReferenceLine y={0} stroke="#64748b" />
            <Bar dataKey="China" fill={CHART_COLORS.china} name="China" radius={[2, 2, 0, 0]} />
            <Bar dataKey="US" fill={CHART_COLORS.us} name="United States" radius={[2, 2, 0, 0]} />
            <Bar dataKey="India" fill={CHART_COLORS.india} name="India" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {!compact && (
        <ChartCard title="Explore a Year" subtitle="Select any year for GDP, population, per-capita income, and country-by-country commentary">
          <div className="mb-4">
            <label htmlFor="year-select" className="mr-3 text-sm font-medium text-slate-700">
              Year
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
            >
              {GDP_DATA.map((d) => (
                <option key={d.year} value={d.year}>
                  {d.year}{d.isEstimate ? " (est.)" : ""}
                </option>
              ))}
            </select>
            {selected.growthDiff !== null && (
              <p className="mt-3 text-sm text-slate-600">
                China−US growth diff: <strong>{fmtPct(selected.growthDiff)}</strong>
                {selected.growthDiff >= 0 ? " (China faster)" : " (US faster)"}
              </p>
            )}
          </div>
          <YearExplorer row={selected} />
        </ChartCard>
      )}

      <p className="text-center text-xs text-slate-400">
        Interactive charts · Source: World Bank WDI, US CPI, IMF WEO April 2026 · Constant 2025 US dollars
      </p>
    </div>
  );
}
