"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CITY_DEPLOYMENTS,
  DATA_SNAPSHOT,
  FLEET_CLASS_COLORS,
  FLEET_COMPANIES,
  GLOBAL_SUMMARY,
  REVENUE_DISCLOSED,
  SOURCE_NOTE,
  fmtFleet,
  fmtUsdM,
  type FleetClass,
} from "@/data/last-mile-delivery-robotics-data";

type ClassFilter = FleetClass | "all";

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

export function LastMileDeliveryRoboticsDashboard() {
  const [classFilter, setClassFilter] = useState<ClassFilter>("all");

  const fleetChart = useMemo(() => {
    const rows = FLEET_COMPANIES.filter((c) => classFilter === "all" || c.fleetClass === classFilter)
      .sort((a, b) => b.fleet - a.fleet)
      .map((c) => ({
        name: c.name.length > 14 ? `${c.name.slice(0, 12)}…` : c.name,
        fullName: c.name,
        sidewalk: c.fleetClass === "sidewalk" ? c.fleet : 0,
        robovan: c.fleetClass === "robovan" ? c.fleet : 0,
        fleet: c.fleet,
        class: c.fleetClass,
      }));
    return rows;
  }, [classFilter]);

  const revenueChart = useMemo(
    () =>
      REVENUE_DISCLOSED.map((c) => ({
        name: c.name.length > 12 ? `${c.name.slice(0, 10)}…` : c.name,
        revenue: c.revenueUsdM ?? 0,
        note: c.revenueNote,
      })),
    [],
  );

  const cityChart = useMemo(
    () =>
      [...CITY_DEPLOYMENTS]
        .sort((a, b) => b.robots - a.robots)
        .slice(0, 10)
        .map((c) => ({
          city: c.city.length > 14 ? `${c.city.slice(0, 12)}…` : c.city,
          robots: c.robots,
          country: c.country,
        })),
    [],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tracked fleet</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{fmtFleet(GLOBAL_SUMMARY.totalFleet)}</p>
          <p className="mt-1 text-sm text-slate-500">Across {FLEET_COMPANIES.length} operators</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Chinese robovans</p>
          <p className="mt-2 text-3xl font-bold text-rose-900">{fmtFleet(GLOBAL_SUMMARY.robovanFleet)}</p>
          <p className="mt-1 text-sm text-rose-700">{GLOBAL_SUMMARY.robovanSharePct}% of tracked fleet</p>
        </div>
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Sidewalk class</p>
          <p className="mt-2 text-3xl font-bold text-cyan-900">{fmtFleet(GLOBAL_SUMMARY.sidewalkFleet)}</p>
          <p className="mt-1 text-sm text-cyan-700">Western + Korea + UAE</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-900 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Sector exits</p>
          <p className="mt-2 text-3xl font-bold text-white">{GLOBAL_SUMMARY.exitsCount}</p>
          <p className="mt-1 text-sm text-slate-400">Acquired, dead, or pivoted</p>
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>The headline:</strong> Neolix and Zelos alone operate roughly{" "}
        <strong>45,000 road-legal robovans</strong> — about six times the entire sidewalk-class fleet worldwide.
        Western coverage that ignores China is describing a different industry.
      </div>

      <ChartCard
        title="Fleet size by company"
        subtitle={`Deployed units, ${DATA_SNAPSHOT} · stacked by vehicle class`}
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {(["all", "robovan", "sidewalk"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setClassFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                classFilter === f
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f === "all" ? "All" : f === "robovan" ? "Robovan" : "Sidewalk"}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={fleetChart} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} angle={-35} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => fmtFleet(v)} />
            <Tooltip
              formatter={(value, name) => [
                fmtFleet(Number(value ?? 0)),
                name === "robovan" ? "Robovan" : "Sidewalk",
              ]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ""}
            />
            <Legend />
            <Bar dataKey="robovan" stackId="a" fill={FLEET_CLASS_COLORS.robovan} name="Robovan (200–500 kg)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="sidewalk" stackId="a" fill={FLEET_CLASS_COLORS.sidewalk} name="Sidewalk (10–30 kg)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Disclosed annual revenue" subtitle="Where companies publish audited or guided figures ($M)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueChart} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => fmtUsdM(v)} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} width={88} />
              <Tooltip formatter={(v) => fmtUsdM(Number(v ?? 0))} />
              <Bar dataKey="revenue" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Robots per city" subtitle="Top deployments where counts are documented or credibly estimated">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cityChart} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="city" tick={{ fontSize: 10, fill: "#64748b" }} angle={-30} textAnchor="end" height={56} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip
                formatter={(v) => [Number(v ?? 0).toLocaleString(), "Robots"]}
                labelFormatter={(_, items) => {
                  const row = items?.[0]?.payload;
                  return row ? `${row.city}, ${row.country}` : "";
                }}
              />
              <Bar dataKey="robots" radius={[4, 4, 0, 0]}>
                {cityChart.map((entry) => (
                  <Cell
                    key={entry.city}
                    fill={entry.country === "China" ? FLEET_CLASS_COLORS.robovan : FLEET_CLASS_COLORS.sidewalk}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Operator detail" subtitle="Fleet, HQ, revenue, and latest status">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="pb-3 pr-4">Company</th>
                <th className="pb-3 pr-4">Class</th>
                <th className="pb-3 pr-4 text-right">Fleet</th>
                <th className="pb-3 pr-4">HQ</th>
                <th className="pb-3 pr-4">Revenue</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {FLEET_COMPANIES.sort((a, b) => b.fleet - a.fleet).map((c) => (
                <tr key={c.name} className="border-b border-slate-100">
                  <td className="py-2.5 pr-4 font-medium text-slate-900">{c.name}</td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        c.fleetClass === "robovan"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-cyan-100 text-cyan-800"
                      }`}
                    >
                      {c.fleetClass}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-right tabular-nums text-slate-700">{c.fleet.toLocaleString()}</td>
                  <td className="py-2.5 pr-4 text-slate-600">{c.hq}</td>
                  <td className="py-2.5 pr-4 text-slate-600">
                    {c.revenueUsdM !== null ? `${fmtUsdM(c.revenueUsdM)} (${c.revenueNote})` : "Not disclosed"}
                  </td>
                  <td className="py-2.5 text-slate-600">{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
