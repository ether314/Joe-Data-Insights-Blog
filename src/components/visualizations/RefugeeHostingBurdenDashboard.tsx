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
  DATA_YEAR,
  GLOBAL_SUMMARY,
  INCOME_COLORS,
  INCOME_HOSTING_SHARES,
  OPNIIP_HOSTS,
  REFUGEE_HOSTS,
  REGION_COLORS,
  SOURCE_NOTE,
  fmtCount,
  fmtOneInN,
  fmtPct,
  fmtPerThousand,
  incomeLabel,
  type IncomeLevel,
  type RefugeeHostRecord,
  type Region,
} from "@/data/refugee-hosting-burden-data";

type RegionFilter = Region | "All";
type IncomeFilter = IncomeLevel | "All";
type SortKey = "hostedCount" | "perCapitaHostedPct";
type SortDir = "asc" | "desc";
type HostSet = "opniip" | "all";

const REGIONS: Region[] = [
  "Middle East",
  "Asia-Pacific",
  "Africa",
  "Europe",
  "Americas",
];

const INCOME_LEVELS: IncomeLevel[] = ["low", "lower_middle", "upper_middle", "high"];

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

function CountTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; payload?: RefugeeHostRecord }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  if (!row) return null;
  return (
    <div className="max-w-xs rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 font-semibold text-slate-900">{label ?? row.country}</p>
      <p className="text-sm text-slate-700">
        Hosted: <strong>{fmtCount(row.hostedCount)}</strong>
      </p>
      <p className="text-sm text-slate-700">
        Per capita: <strong>{fmtPct(row.perCapitaHostedPct)}</strong> ({fmtOneInN(row.oneInNResidents)})
      </p>
      <p className="text-sm text-slate-700">
        Per 1,000 residents: <strong>{fmtPerThousand(row.refugeesPerThousandResidents)}</strong>
      </p>
      <p className="mt-2 border-t border-slate-100 pt-2 text-xs text-slate-500">
        Primary origin: {row.primaryOrigin}
      </p>
      <p className="text-xs text-slate-500">
        {incomeLabel(row.incomeLevel)} · {row.region}
      </p>
    </div>
  );
}

export function RefugeeHostingBurdenDashboard() {
  const [region, setRegion] = useState<RegionFilter>("All");
  const [income, setIncome] = useState<IncomeFilter>("All");
  const [hostSet, setHostSet] = useState<HostSet>("opniip");
  const [sortKey, setSortKey] = useState<SortKey>("hostedCount");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedIso, setSelectedIso] = useState("IRN");

  const baseHosts = useMemo(
    () => (hostSet === "opniip" ? OPNIIP_HOSTS : REFUGEE_HOSTS),
    [hostSet],
  );

  const filtered = useMemo(() => {
    return baseHosts.filter((r) => {
      if (region !== "All" && r.region !== region) return false;
      if (income !== "All" && r.incomeLevel !== income) return false;
      return true;
    });
  }, [baseHosts, region, income]);

  const sorted = useMemo(() => {
    const sign = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => sign * (a[sortKey] - b[sortKey]));
  }, [filtered, sortKey, sortDir]);

  const barData = useMemo(
    () =>
      sorted.map((r) => ({
        ...r,
        label: r.country.length > 16 ? `${r.country.slice(0, 14)}…` : r.country,
        fill: REGION_COLORS[r.region],
      })),
    [sorted],
  );

  const selected = useMemo(
    () => REFUGEE_HOSTS.find((r) => r.isoCode === selectedIso) ?? sorted[0] ?? REFUGEE_HOSTS[0],
    [selectedIso, sorted],
  );

  const incomePie = useMemo(
    () =>
      INCOME_HOSTING_SHARES.map((s) => ({
        name: s.label,
        value: s.sharePct,
        color: s.color,
      })),
    [],
  );

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "hostedCount" ? "desc" : "desc");
    }
  }

  const selectClass =
    "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200";

  const toggleClass = (active: boolean) =>
    `rounded-lg px-4 py-2 text-sm font-semibold transition ${
      active
        ? "bg-cyan-600 text-white shadow-sm"
        : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
    }`;

  const barMetric = sortKey === "hostedCount" ? "hostedCount" : "perCapitaHostedPct";

  return (
    <div className="site-content w-full min-w-0 space-y-6" data-viz="refugee-hosting-burden">
      <p className="text-sm text-slate-500">
        {REFUGEE_HOSTS.length} host countries · {DATA_YEAR} · {SOURCE_NOTE}
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "LMIC share",
            value: fmtPct(GLOBAL_SUMMARY.lowAndMiddleIncomeSharePct, 0),
            sub: "Low + middle-income hosts",
            color: INCOME_COLORS.upper_middle,
          },
          {
            label: "Neighbouring hosts",
            value: fmtPct(GLOBAL_SUMMARY.neighboringCountriesSharePct, 0),
            sub: "Next to country of origin",
            color: REGION_COLORS["Middle East"],
          },
          {
            label: "LDC share",
            value: fmtPct(GLOBAL_SUMMARY.leastDevelopedCountriesSharePct, 0),
            sub: "Least developed countries",
            color: INCOME_COLORS.low,
          },
          {
            label: "High-income share",
            value: fmtPct(GLOBAL_SUMMARY.highIncomeSharePct, 0),
            sub: "Germany, Poland, US, etc.",
            color: INCOME_COLORS.high,
          },
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

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="rhb-region" className="mb-1 block text-sm font-medium text-slate-700">
            Region
          </label>
          <select
            id="rhb-region"
            value={region}
            onChange={(e) => setRegion(e.target.value as RegionFilter)}
            className={`${selectClass} min-w-[160px]`}
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
          <label htmlFor="rhb-income" className="mb-1 block text-sm font-medium text-slate-700">
            Income level
          </label>
          <select
            id="rhb-income"
            value={income}
            onChange={(e) => setIncome(e.target.value as IncomeFilter)}
            className={`${selectClass} min-w-[180px]`}
          >
            <option value="All">All income levels</option>
            {INCOME_LEVELS.map((level) => (
              <option key={level} value={level}>
                {incomeLabel(level)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rhb-country" className="mb-1 block text-sm font-medium text-slate-700">
            Detail country
          </label>
          <select
            id="rhb-country"
            value={selectedIso}
            onChange={(e) => setSelectedIso(e.target.value)}
            className={`${selectClass} min-w-[180px]`}
          >
            {REFUGEE_HOSTS.map((r) => (
              <option key={r.isoCode} value={r.isoCode}>
                {r.country}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="mb-1 w-full text-sm font-medium text-slate-700">Host set</span>
          <button type="button" className={toggleClass(hostSet === "opniip")} onClick={() => setHostSet("opniip")}>
            UNHCR headline hosts
          </button>
          <button type="button" className={toggleClass(hostSet === "all")} onClick={() => setHostSet("all")}>
            All 25 countries
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="w-full text-sm font-medium text-slate-700">Sort by</span>
        {(
          [
            ["Total hosted", "hostedCount"],
            ["Per-capita burden", "perCapitaHostedPct"],
          ] as const
        ).map(([label, key]) => (
          <button
            key={key}
            type="button"
            onClick={() => handleSort(key)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              sortKey === key
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
            {sortKey === key ? (sortDir === "desc" ? " ↓" : " ↑") : ""}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard
            title="Hosting burden by country"
            subtitle={
              sortKey === "hostedCount"
                ? "Absolute refugees + OPNIIP stock (end-2024)"
                : "Hosted population as % of national population"
            }
          >
            <div className="h-[420px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) =>
                      sortKey === "hostedCount" ? fmtCount(v) : fmtPct(v, 1)
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={88}
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <Tooltip content={<CountTooltip />} />
                  <Bar
                    dataKey={barMetric}
                    radius={[0, 4, 4, 0]}
                    onClick={(_, index) => {
                      const row = barData[index];
                      if (row) setSelectedIso(row.isoCode);
                    }}
                    cursor="pointer"
                  >
                    {barData.map((entry) => (
                      <Cell key={entry.isoCode} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="space-y-6">
          <ChartCard
            title="Global share by income"
            subtitle="UNHCR Global Trends 2024 — all hosted populations"
          >
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomePie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={2}
                  >
                    {incomePie.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => fmtPct(Number(value), 0)}
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {selected && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Selected host
              </p>
              <h4 className="mt-1 text-xl font-bold text-slate-900">{selected.country}</h4>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Hosted</dt>
                  <dd className="font-semibold text-slate-900">{fmtCount(selected.hostedCount)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Per-capita</dt>
                  <dd className="font-semibold text-slate-900">{fmtPct(selected.perCapitaHostedPct)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Burden ratio</dt>
                  <dd className="font-semibold text-slate-900">{fmtOneInN(selected.oneInNResidents)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Per 1,000 residents</dt>
                  <dd className="font-semibold text-slate-900">
                    {fmtPerThousand(selected.refugeesPerThousandResidents)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Income level</dt>
                  <dd className="font-semibold text-slate-900">{incomeLabel(selected.incomeLevel)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Primary origin</dt>
                  <dd className="text-right font-medium text-slate-800">{selected.primaryOrigin}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Neighbouring host</dt>
                  <dd className="font-semibold text-slate-900">
                    {selected.neighborsMajority ? "Yes" : "No"}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>

      <ChartCard
        title="Country comparison table"
        subtitle={`${filtered.length} countries · click a bar to inspect`}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2">Country</th>
                <th className="px-3 py-2 text-right">Hosted</th>
                <th className="px-3 py-2 text-right">Per-capita</th>
                <th className="px-3 py-2 text-right">1 in N</th>
                <th className="px-3 py-2">Income</th>
                <th className="px-3 py-2">Origin</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr
                  key={r.isoCode}
                  className={`border-b border-slate-100 transition hover:bg-slate-50 ${
                    r.isoCode === selectedIso ? "bg-cyan-50" : ""
                  }`}
                  onClick={() => setSelectedIso(r.isoCode)}
                >
                  <td className="px-3 py-2 font-medium text-slate-900">{r.country}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-800">
                    {fmtCount(r.hostedCount)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-800">
                    {fmtPct(r.perCapitaHostedPct)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-600">
                    {fmtOneInN(r.oneInNResidents)}
                  </td>
                  <td className="px-3 py-2 text-slate-600">{incomeLabel(r.incomeLevel)}</td>
                  <td className="px-3 py-2 text-slate-600">{r.primaryOrigin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
