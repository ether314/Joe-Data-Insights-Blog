"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CHART_COLORS,
  REGION_COLORS,
  REGION_ORDER,
  REGIONS,
  SITES,
  STATUSES,
  STATS,
  annualKwhBillion,
  compareSites,
  costEstimateBillions,
  defaultSortDir,
  fmtBillionsUsd,
  formatCostDisplay,
  fmtKwh,
  fmtPower,
  buildPhaseFromStatus,
  regionTotals,
  type Region,
  type RegionFilter,
  type Site,
  type SortDir,
  type SortKey,
  type StatusFilter,
} from "@/data/ai-data-centers-data";

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

function SortHeader({
  label,
  sortKey,
  activeKey,
  dir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  dir: SortDir;
  onSort: (key: SortKey) => void;
}) {
  const active = activeKey === sortKey;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={`w-full whitespace-normal break-words text-left text-[10px] font-semibold leading-tight transition-colors ${
        active ? "text-cyan-700" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {label}
      {active ? (dir === "asc" ? " ↑" : " ↓") : ""}
    </button>
  );
}

function StatusPill({ status }: { status: Site["status"] }) {
  const styles =
    status === "Operational"
      ? "bg-emerald-100 text-emerald-800"
      : status === "Partially Live"
        ? "bg-sky-100 text-sky-800"
        : status === "Under Construction"
          ? "bg-amber-100 text-amber-800"
          : "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold ${styles}`}>
      {status}
    </span>
  );
}

function CostCell({ cost }: { cost: string }) {
  const d = formatCostDisplay(cost);
  const weakEst = d.note?.toLowerCase().includes("weak est");
  return (
    <div>
      <span
        className={
          d.sortBillions >= 0
            ? weakEst
              ? "font-medium text-amber-800"
              : "font-medium text-slate-800"
            : "text-slate-400"
        }
      >
        {d.label}
      </span>
      {d.note && (
        <span
          className={`mt-0.5 block text-[10px] leading-tight ${weakEst ? "text-amber-600" : "text-slate-400"}`}
        >
          {d.note}
        </span>
      )}
    </div>
  );
}

export function AiDataCentersDashboard() {
  const [region, setRegion] = useState<RegionFilter>("All");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [sortKey, setSortKey] = useState<SortKey>("powerMw");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(defaultSortDir(key));
    }
  }

  const filtered = useMemo(() => {
    return SITES.filter((s) => {
      if (region !== "All" && s.region !== region) return false;
      if (status !== "All" && s.status !== status) return false;
      return true;
    });
  }, [region, status]);

  const sorted = useMemo(() => {
    const sign = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => sign * compareSites(a, b, sortKey));
  }, [filtered, sortKey, sortDir]);

  const regionPie = useMemo(
    () =>
      REGION_ORDER.map((r) => {
        const t = regionTotals(r);
        return { name: r, value: t.mw, sites: t.count };
      }).filter((d) => d.value > 0),
    [],
  );

  const topByPower = useMemo(
    () => [...SITES].sort((a, b) => b.powerMw - a.powerMw).slice(0, 10),
    [],
  );

  const costRollup = useMemo(
    () =>
      SITES.reduce(
        (acc, s) => {
          const e = costEstimateBillions(s.costUsd);
          if (!e.known) {
            acc.unknown += 1;
            return acc;
          }
          acc.low += e.low;
          acc.base += e.base;
          acc.high += e.high;
          acc.known += 1;
          if (e.estimated) acc.estimated += 1;
          return acc;
        },
        { low: 0, base: 0, high: 0, known: 0, unknown: 0, estimated: 0 },
      ),
    [],
  );

  const selectClass =
    "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200";

  return (
    <div className="site-content w-full min-w-0 space-y-6">
      <p className="text-sm text-slate-500">
        {STATS.siteCount} publicly announced AI-focused sites · third pass June 2026 · BNEF tracks ~23
        GW under construction globally (831 sites)
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Tracked sites", value: String(STATS.siteCount), sub: "Major new AI builds", color: CHART_COLORS.primary },
          { label: "Build started", value: String(STATS.startedCount), sub: "UC / live / ops", color: CHART_COLORS.success },
          { label: "Not started", value: String(STATS.notStartedCount), sub: "Planned only", color: CHART_COLORS.warning },
          { label: "Combined IT load", value: STATS.totalPowerLabel, sub: "Planned peak MW/GW", color: CHART_COLORS.accent },
          { label: "Est. annual energy", value: STATS.totalEnergyLabel, sub: "90% capacity factor", color: CHART_COLORS.danger },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            style={{ borderLeft: `4px solid ${s.color}` }}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="mt-1 text-sm text-slate-500">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <label htmlFor="dc-region" className="mb-1 block text-sm font-medium text-slate-700">
            Region
          </label>
          <select
            id="dc-region"
            value={region}
            onChange={(e) => setRegion(e.target.value as RegionFilter)}
            className={`${selectClass} min-w-[160px]`}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="dc-status" className="mb-1 block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            id="dc-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className={`${selectClass} min-w-[160px]`}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Showing {sorted.length} of {STATS.siteCount} sites
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Planned IT load by region" subtitle="MW · tracked sites · June 2026">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={regionPie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={2}
              >
                {regionPie.map((entry) => (
                  <Cell key={entry.name} fill={REGION_COLORS[entry.name as Region]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  fmtPower(Number(value ?? 0)),
                  String(name ?? ""),
                ]}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top 10 sites by planned IT load" subtitle="MW · June 2026">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={topByPower.map((s) => ({
                name: s.site.length > 24 ? s.site.slice(0, 22) + "…" : s.site,
                mw: s.powerMw,
              }))}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v} MW`} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => [fmtPower(Number(v ?? 0)), "IT load"]} />
              <Bar dataKey="mw" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard
        title="Total cost estimate from tracked rows"
        subtitle={`Known + researched: ${costRollup.known} (${costRollup.estimated} estimated) · Excluded (TBD / program rows): ${costRollup.unknown}`}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Low case", value: fmtBillionsUsd(costRollup.low), color: CHART_COLORS.primary },
            { label: "Base case", value: fmtBillionsUsd(costRollup.base), color: CHART_COLORS.warning },
            { label: "High case", value: fmtBillionsUsd(costRollup.high), color: CHART_COLORS.danger },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              style={{ borderTop: `3px solid ${s.color}` }}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{s.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Sum of per-site disclosed figures (low / midpoint / high where ranges exist). Rows marked
          TBD or &ldquo;part of&rdquo; a larger program are excluded so national and umbrella budgets
          are not double-counted. Formerly undisclosed sites now show online-sourced estimates (amber
          notes = weak confidence). Not a market-wide total — many megaprojects lack public capex.
        </p>
      </ChartCard>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full min-w-[1100px] table-fixed text-[11px]">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50">
              <tr>
                {(
                  [
                    ["Site", "site"],
                    ["Country", "country"],
                    ["Region", "region"],
                    ["Developer", "developer"],
                    ["Est. cost", "cost"],
                    ["IT load", "powerMw"],
                    ["Annual energy", "energy"],
                    ["Completion", "completion"],
                    ["Build", "buildPhase"],
                    ["Status", "status"],
                  ] as const
                ).map(([label, key]) => (
                  <th key={key} className="px-2 py-2 align-top">
                    <SortHeader
                      label={label}
                      sortKey={key}
                      activeKey={sortKey}
                      dir={sortDir}
                      onSort={handleSort}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((s) => (
                <tr key={s.site} className="odd:bg-white even:bg-slate-50/50 hover:bg-cyan-50/30">
                  <td className="whitespace-normal break-words px-2 py-2 font-semibold text-slate-900">
                    {s.site}
                  </td>
                  <td className="px-2 py-2 text-slate-700">{s.country}</td>
                  <td className="px-2 py-2 text-slate-700">{s.region}</td>
                  <td className="whitespace-normal break-words px-2 py-2 text-slate-600">
                    {s.developer}
                  </td>
                  <td className="whitespace-normal break-words px-2 py-2 text-right">
                    <CostCell cost={s.costUsd} />
                  </td>
                  <td className="px-2 py-2 text-right font-medium text-slate-800">
                    {fmtPower(s.powerMw)}
                  </td>
                  <td className="px-2 py-2 text-right text-slate-600">
                    {fmtKwh(annualKwhBillion(s.powerMw))}
                  </td>
                  <td className="whitespace-normal break-words px-2 py-2 text-slate-600">
                    {s.completion}
                  </td>
                  <td className="px-2 py-2 text-slate-600">{buildPhaseFromStatus(s.status)}</td>
                  <td className="px-2 py-2">
                    <StatusPill status={s.status} />
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
            <strong>Annual energy:</strong> Peak IT load (MW/GW) from developer disclosures. Annual
            energy = MW × 8,760 hours × 90% capacity factor. Actual consumption varies with workload,
            PUE, and phased build-out.
          </p>
          <p>
            <strong>Est. cost column:</strong> All figures normalized to USD (EUR ×1.07, GBP ×1.27,
            CAD ×0.72; explicit (~$…) conversions preferred when disclosed). Sites within a larger
            program show the program budget with a note; sorting uses the same USD value. Rows
            formerly marked undisclosed include web-sourced estimates with source notes and confidence
            labels (weak = MW proxy or pro-rata program split; treat as directional only).
          </p>
          <p>
            <strong>Build phase:</strong> Not Started = announced or permitting only (Planned).
            Started = ground broken, commissioning, partially live, or operational.
          </p>
          <p>
            <strong>Industry scale:</strong> McKinsey/JLL estimate ~97–100 GW of new data center
            capacity by 2030 (~$7T spend). BNEF counted ~23.1 GW under construction across 831
            sites as of Sep 2025. Grid interconnection queues are now the binding constraint —
            driving behind-the-meter power and greenfield sites in Malaysia, India, and Poland.
          </p>
        </div>
      </details>

      <p className="text-center text-xs text-slate-400">
        Public announcements &amp; press · June 2026 · Not exhaustive of every colocation facility
      </p>
    </div>
  );
}
