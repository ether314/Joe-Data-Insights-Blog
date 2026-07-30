"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  DATA_YEAR,
  DEFLATIONARY_GROWTH,
  GLOBAL_SUMMARY,
  REGION_COLORS,
  SOURCE_NOTE,
  STATS,
  STRATEGY_LABELS,
  fmtPct,
  fmtUsdBn,
  type DeflationaryGrowthRecord,
  type GrowthStrategy,
} from "@/data/deflationary-growth-2025-data";

type RegionFilter = string | "All";
type StrategyFilter = GrowthStrategy | "All";

const REGIONS = [...new Set(DEFLATIONARY_GROWTH.map((r) => r.region))].sort();

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

function SourcePill({ sourceType }: { sourceType: DeflationaryGrowthRecord["sourceType"] }) {
  const styles =
    sourceType === "disclosed"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-amber-100 text-amber-800";
  return (
    <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold ${styles}`}>
      {sourceType === "disclosed" ? "Disclosed" : "Estimated"}
    </span>
  );
}

function ScatterTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: DeflationaryGrowthRecord & { fill: string } }>;
}) {
  if (!active || !payload?.length) return null;
  const r = payload[0].payload;
  return (
    <div className="max-w-xs rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-lg">
      <p className="font-bold text-slate-900">{r.economy}</p>
      <p className="mt-1 text-slate-600">
        GDP {fmtPct(r.gdpGrowthPct2025)} · CPI {fmtPct(r.cpiYoYPct2025)}
      </p>
      <p className="text-slate-500">
        Exports {fmtPct(r.exportSharePct, 0)} of GDP · {STRATEGY_LABELS[r.strategy]}
      </p>
      {r.notes && <p className="mt-1 text-slate-400">{r.notes}</p>}
    </div>
  );
}

export function DeflationaryGrowth2025Dashboard() {
  const [region, setRegion] = useState<RegionFilter>("All");
  const [strategy, setStrategy] = useState<StrategyFilter>("All");

  const filtered = useMemo(() => {
    return DEFLATIONARY_GROWTH.filter((r) => {
      if (region !== "All" && r.region !== region) return false;
      if (strategy !== "All" && r.strategy !== strategy) return false;
      return true;
    });
  }, [region, strategy]);

  const scatterData = useMemo(
    () =>
      filtered.map((r) => ({
        ...r,
        fill: REGION_COLORS[r.region] ?? "#64748b",
      })),
    [filtered],
  );

  const gdpBars = useMemo(
    () =>
      [...filtered]
        .sort((a, b) => b.gdpGrowthPct2025 - a.gdpGrowthPct2025)
        .map((r) => ({
          name: r.economy.length > 12 ? r.iso3 : r.economy,
          gdp: r.gdpGrowthPct2025,
          fill: REGION_COLORS[r.region] ?? "#64748b",
        })),
    [filtered],
  );

  const cpiBars = useMemo(
    () =>
      [...filtered]
        .sort((a, b) => a.cpiYoYPct2025 - b.cpiYoYPct2025)
        .map((r) => ({
          name: r.economy.length > 12 ? r.iso3 : r.economy,
          cpi: r.cpiYoYPct2025,
          fill: REGION_COLORS[r.region] ?? "#64748b",
        })),
    [filtered],
  );

  const selectClass =
    "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200";

  return (
    <div className="site-content w-full min-w-0 space-y-6" data-viz="deflationary-growth-2025">
      <p className="text-sm text-slate-400">
        {STATS.recordCount} economy records · {DATA_YEAR} primary · GDP &gt; 0 and CPI &lt; 0 ·{" "}
        {SOURCE_NOTE}
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Economies tracked",
            value: String(GLOBAL_SUMMARY.economyCount),
            sub: `${GLOBAL_SUMMARY.exportHeavyCount} export-heavy (≥50% GDP)`,
            color: "#22c55e",
          },
          {
            label: "Avg GDP growth",
            value: STATS.avgGdpLabel,
            sub: `${DATA_YEAR} real GDP YoY`,
            color: "#6366f1",
          },
          {
            label: "Avg CPI YoY",
            value: STATS.avgCpiLabel,
            sub: "Headline deflation across sample",
            color: "#0891b2",
          },
          {
            label: "Fastest GDP",
            value: GLOBAL_SUMMARY.fastestGdp.economy,
            sub: fmtPct(GLOBAL_SUMMARY.fastestGdp.gdpGrowthPct2025),
            color: "#14b8a6",
          },
          {
            label: "Deepest deflation",
            value: GLOBAL_SUMMARY.deepestDeflation.economy,
            sub: fmtPct(GLOBAL_SUMMARY.deepestDeflation.cpiYoYPct2025),
            color: "#ec4899",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            style={{ borderLeft: `4px solid ${s.color}` }}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="mt-1 text-sm text-slate-600">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <label htmlFor="deflation-region" className="mb-1 block text-sm font-medium text-slate-700">
            Region
          </label>
          <select
            id="deflation-region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={`${selectClass} min-w-[180px]`}
          >
            <option value="All">All regions</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="deflation-strategy" className="mb-1 block text-sm font-medium text-slate-700">
            Growth strategy
          </label>
          <select
            id="deflation-strategy"
            value={strategy}
            onChange={(e) => setStrategy(e.target.value as StrategyFilter)}
            className={`${selectClass} min-w-[220px]`}
          >
            <option value="All">All strategies</option>
            {(Object.keys(STRATEGY_LABELS) as GrowthStrategy[]).map((s) => (
              <option key={s} value={s}>
                {STRATEGY_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-slate-500" id="deflation-record-count">
        Showing {filtered.length} of {STATS.recordCount} records
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="GDP growth vs CPI deflation"
          subtitle="Bubble size = export share of GDP · quadrant: growth + falling prices"
        >
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="gdpGrowthPct2025"
                name="GDP growth"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => fmtPct(Number(v))}
                label={{ value: "Real GDP growth %", position: "bottom", fontSize: 11, fill: "#64748b" }}
              />
              <YAxis
                type="number"
                dataKey="cpiYoYPct2025"
                name="CPI YoY"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => fmtPct(Number(v))}
                label={{ value: "CPI YoY %", angle: -90, position: "insideLeft", fontSize: 11, fill: "#64748b" }}
              />
              <ZAxis type="number" dataKey="exportSharePct" range={[80, 400]} />
              <Tooltip content={<ScatterTooltip />} />
              <Scatter data={scatterData} name="Economies">
                {scatterData.map((entry) => (
                  <Cell key={entry.id} fill={entry.fill} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="GDP growth ranking" subtitle={`${DATA_YEAR} real GDP YoY · sorted high to low`}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={gdpBars}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => fmtPct(Number(v))} />
              <YAxis type="category" dataKey="name" width={48} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => [fmtPct(Number(v ?? 0)), "GDP growth"]} />
              <Bar dataKey="gdp" radius={[0, 4, 4, 0]}>
                {gdpBars.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="CPI deflation depth" subtitle="Most negative CPI YoY first">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={cpiBars}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => fmtPct(Number(v))} />
              <YAxis type="category" dataKey="name" width={48} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => [fmtPct(Number(v ?? 0)), "CPI YoY"]} />
              <Bar dataKey="cpi" radius={[0, 4, 4, 0]}>
                {cpiBars.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Region legend" subtitle="Color key for scatter and bar charts">
          <div className="flex flex-wrap gap-3">
            {REGIONS.map((r) => (
              <div key={r} className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: REGION_COLORS[r] ?? "#64748b" }}
                />
                <span className="text-sm text-slate-700">{r}</span>
                <span className="text-xs text-slate-400">
                  ({DEFLATIONARY_GROWTH.filter((e) => e.region === r).length})
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-500">
            {GLOBAL_SUMMARY.disclosedCount} disclosed · {GLOBAL_SUMMARY.estimatedCount} estimated ·
            avg export share {fmtPct(GLOBAL_SUMMARY.avgExportSharePct, 0)}
          </p>
        </ChartCard>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full min-w-[960px] table-fixed text-[11px]">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50">
              <tr>
                {[
                  "Economy",
                  "Region",
                  "GDP 2025",
                  "CPI YoY",
                  "GDP (USD Bn)",
                  "Export share",
                  "Strategy",
                  "Type",
                  "Source",
                ].map((h) => (
                  <th
                    key={h}
                    className="whitespace-normal break-words px-2 py-2 text-left text-[10px] font-semibold text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="odd:bg-white even:bg-slate-50/50 hover:bg-cyan-50/30">
                  <td className="whitespace-normal break-words px-2 py-2 font-semibold text-slate-900">
                    {r.economy}
                  </td>
                  <td className="px-2 py-2">
                    <span
                      className="inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold text-white"
                      style={{ backgroundColor: REGION_COLORS[r.region] ?? "#64748b" }}
                    >
                      {r.region}
                    </span>
                  </td>
                  <td className="px-2 py-2 font-medium text-emerald-700">
                    {fmtPct(r.gdpGrowthPct2025)}
                  </td>
                  <td className="px-2 py-2 font-medium text-sky-700">{fmtPct(r.cpiYoYPct2025)}</td>
                  <td className="px-2 py-2 text-slate-600">{fmtUsdBn(r.gdpUsdBn2025)}</td>
                  <td className="px-2 py-2 text-slate-600">{fmtPct(r.exportSharePct, 0)}</td>
                  <td className="whitespace-normal break-words px-2 py-2 text-slate-600">
                    {STRATEGY_LABELS[r.strategy]}
                  </td>
                  <td className="px-2 py-2">
                    <SourcePill sourceType={r.sourceType} />
                  </td>
                  <td className="whitespace-normal break-words px-2 py-2 text-slate-500">
                    {r.source}
                    {r.notes && (
                      <span className="mt-0.5 block text-[10px] text-slate-400">{r.notes}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <details className="rounded border border-sky-200 bg-sky-50 text-xs text-sky-900">
        <summary className="cursor-pointer px-3 py-2 font-semibold text-sky-800">
          Methodology &amp; context
        </summary>
        <div className="space-y-2 border-t border-sky-200 px-3 py-2 leading-relaxed text-sky-800">
          <p>
            <strong>Inclusion:</strong> Real GDP growth &gt; 0 and headline CPI YoY &lt; 0 in {DATA_YEAR}.
            This is not demand-collapse deflation — output expanded while prices fell.
          </p>
          <p>
            <strong>Counter-narrative:</strong> {GLOBAL_SUMMARY.exportHeavyCount} of{" "}
            {GLOBAL_SUMMARY.economyCount} economies export ≥50% of GDP. Deflation was often a{" "}
            <em>competitive weapon</em> — export pricing, imported disinflation, and base-effect
            normalization rather than recession.
          </p>
          <p>
            <strong>Fastest / deepest:</strong> {GLOBAL_SUMMARY.fastestGdp.economy} led GDP at{" "}
            {fmtPct(GLOBAL_SUMMARY.fastestGdp.gdpGrowthPct2025)};{" "}
            {GLOBAL_SUMMARY.deepestDeflation.economy} posted deepest CPI at{" "}
            {fmtPct(GLOBAL_SUMMARY.deepestDeflation.cpiYoYPct2025)}.
          </p>
        </div>
      </details>

      <p className="text-center text-xs text-slate-400">
        IMF WEO Oct 2025 · World Bank GEP 2025 · OECD · National statistics offices · {DATA_YEAR}
      </p>
    </div>
  );
}
