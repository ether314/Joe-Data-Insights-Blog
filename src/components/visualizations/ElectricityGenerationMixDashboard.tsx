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
  ELECTRICITY_MIX,
  MIX_COLORS,
  MIX_SOURCE_ORDER,
  REGIONS,
  SOURCE_NOTE,
  WORLD_GENERATION_TWH,
  fmtPct,
  fmtTwh,
  type ElectricityMixRecord,
  type MixSource,
  type Region,
} from "@/data/electricity-generation-mix-data";

type RegionFilter = Region | "All";
type SortKey = "generationTwh" | "coalSharePct" | "renewablesSharePct" | "fossilSharePct";
type SortDir = "asc" | "desc";
type ChartView = "stacked" | "fossil-split";

const SOURCE_LABELS: Record<MixSource, string> = {
  coal: "Coal",
  gas: "Gas",
  oil: "Oil",
  hydro: "Hydro",
  nuclear: "Nuclear",
  solar: "Solar",
  wind: "Wind",
};

function sourceTwh(record: ElectricityMixRecord, source: MixSource): number {
  const key = `${source}SharePct` as keyof ElectricityMixRecord;
  const share = record[key];
  return typeof share === "number" ? (record.generationTwh * share) / 100 : 0;
}

function stackRow(record: ElectricityMixRecord) {
  const row: Record<string, string | number> = {
    country: record.country,
    generationTwh: record.generationTwh,
    fossilSharePct: record.fossilSharePct,
    renewablesSharePct: record.renewablesSharePct,
    coalSharePct: record.coalSharePct,
  };
  for (const src of MIX_SOURCE_ORDER) {
    row[src] = sourceTwh(record, src);
  }
  return row;
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
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function MixTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, e) => s + (e.value ?? 0), 0);
  return (
    <div className="max-w-xs rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 font-semibold text-slate-900">{label}</p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm text-slate-700">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span>
              {entry.name}: <strong>{fmtTwh(entry.value)}</strong>
              {total > 0 && (
                <span className="text-slate-400"> ({fmtPct((entry.value / total) * 100)})</span>
              )}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-2 border-t border-slate-100 pt-2 text-xs text-slate-500">
        Total: {fmtTwh(total)}
      </p>
    </div>
  );
}

export function ElectricityGenerationMixDashboard() {
  const [region, setRegion] = useState<RegionFilter>("All");
  const [sortKey, setSortKey] = useState<SortKey>("generationTwh");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [chartView, setChartView] = useState<ChartView>("stacked");
  const [selectedIso, setSelectedIso] = useState("CHN");

  const countries = useMemo(
    () => ELECTRICITY_MIX.filter((r) => r.isoCode !== "WLD"),
    [],
  );

  const filtered = useMemo(() => {
    return countries.filter((r) => region === "All" || r.region === region);
  }, [countries, region]);

  const sorted = useMemo(() => {
    const sign = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => sign * (a[sortKey] - b[sortKey]));
  }, [filtered, sortKey, sortDir]);

  const stackData = useMemo(() => sorted.map(stackRow), [sorted]);

  const fossilSplitData = useMemo(
    () =>
      sorted.map((r) => ({
        country: r.country.length > 14 ? r.country.slice(0, 12) + "…" : r.country,
        fossil: (r.generationTwh * r.fossilSharePct) / 100,
        lowCarbon: (r.generationTwh * r.lowCarbonSharePct) / 100,
      })),
    [sorted],
  );

  const selected = useMemo(
    () => ELECTRICITY_MIX.find((r) => r.isoCode === selectedIso) ?? countries[0],
    [selectedIso, countries],
  );

  const selectedPie = useMemo(() => {
    if (!selected) return [];
    return MIX_SOURCE_ORDER.map((src) => ({
      name: SOURCE_LABELS[src],
      value: sourceTwh(selected, src),
      color: MIX_COLORS[src],
    })).filter((d) => d.value > 0);
  }, [selected]);

  const stats = useMemo(() => {
    const world = ELECTRICITY_MIX.find((r) => r.isoCode === "WLD");
    const avgFossil =
      filtered.reduce((s, r) => s + r.fossilSharePct, 0) / Math.max(filtered.length, 1);
    const totalGen = filtered.reduce((s, r) => s + r.generationTwh, 0);
    return {
      worldCoal: world?.coalSharePct ?? 0,
      worldLowCarbon: world?.lowCarbonSharePct ?? 0,
      avgFossil,
      totalGen,
      count: filtered.length,
    };
  }, [filtered]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "generationTwh" ? "desc" : "asc");
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

  return (
    <div className="site-content w-full min-w-0 space-y-6" data-viz="electricity-generation-mix">
      <p className="text-sm text-slate-500">
        {countries.length} major economies · {DATA_YEAR} · {SOURCE_NOTE}
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "World generation",
            value: fmtTwh(WORLD_GENERATION_TWH),
            sub: `${DATA_YEAR} total`,
            color: MIX_COLORS.hydro,
          },
          {
            label: "Global coal share",
            value: fmtPct(stats.worldCoal),
            sub: "Still #1 fuel worldwide",
            color: MIX_COLORS.coal,
          },
          {
            label: "Global low-carbon",
            value: fmtPct(stats.worldLowCarbon),
            sub: "Hydro + nuclear + renewables",
            color: MIX_COLORS.wind,
          },
          {
            label: "Filtered total",
            value: fmtTwh(stats.totalGen),
            sub: `${stats.count} countries shown`,
            color: MIX_COLORS.solar,
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
          <label htmlFor="egm-region" className="mb-1 block text-sm font-medium text-slate-700">
            Region
          </label>
          <select
            id="egm-region"
            value={region}
            onChange={(e) => setRegion(e.target.value as RegionFilter)}
            className={`${selectClass} min-w-[160px]`}
          >
            <option value="All">All regions</option>
            {REGIONS.filter((r) => r !== "Global").map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="egm-country" className="mb-1 block text-sm font-medium text-slate-700">
            Detail country
          </label>
          <select
            id="egm-country"
            value={selectedIso}
            onChange={(e) => setSelectedIso(e.target.value)}
            className={`${selectClass} min-w-[180px]`}
          >
            {countries.map((r) => (
              <option key={r.isoCode} value={r.isoCode}>
                {r.country}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="mb-1 w-full text-sm font-medium text-slate-700">Chart view</span>
          <button type="button" className={toggleClass(chartView === "stacked")} onClick={() => setChartView("stacked")}>
            Source mix
          </button>
          <button
            type="button"
            className={toggleClass(chartView === "fossil-split")}
            onClick={() => setChartView("fossil-split")}
          >
            Fossil vs low-carbon
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="w-full text-sm font-medium text-slate-700">Sort by</span>
        {(
          [
            ["Total generation", "generationTwh"],
            ["Coal share", "coalSharePct"],
            ["Renewables share", "renewablesSharePct"],
            ["Fossil share", "fossilSharePct"],
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
            {sortKey === key ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-500">
        Showing {sorted.length} countries · avg fossil share {fmtPct(stats.avgFossil)}
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {chartView === "stacked" ? (
            <ChartCard
              title="Generation mix by source"
              subtitle={`${DATA_YEAR} · TWh per fuel · sorted by ${sortKey}`}
            >
              <ResponsiveContainer width="100%" height={Math.max(320, sorted.length * 28)}>
                <BarChart
                  data={stackData}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v} TWh`} />
                  <YAxis type="category" dataKey="country" width={100} tick={{ fontSize: 10 }} />
                  <Tooltip content={<MixTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {MIX_SOURCE_ORDER.map((src) => (
                    <Bar
                      key={src}
                      dataKey={src}
                      name={SOURCE_LABELS[src]}
                      stackId="mix"
                      fill={MIX_COLORS[src]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          ) : (
            <ChartCard
              title="Fossil vs low-carbon generation"
              subtitle={`${DATA_YEAR} · absolute TWh`}
            >
              <ResponsiveContainer width="100%" height={Math.max(320, sorted.length * 28)}>
                <BarChart
                  data={fossilSplitData}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v} TWh`} />
                  <YAxis type="category" dataKey="country" width={100} tick={{ fontSize: 10 }} />
                  <Tooltip
                    formatter={(value, name) => [
                      fmtTwh(Number(value ?? 0)),
                      name === "fossil" ? "Fossil" : "Low-carbon",
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="fossil" name="Fossil" fill={MIX_COLORS.coal} radius={[0, 4, 4, 0]} />
                  <Bar
                    dataKey="lowCarbon"
                    name="Low-carbon"
                    fill={MIX_COLORS.wind}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>

        <ChartCard
          title={selected?.country ?? "Country detail"}
          subtitle={`${DATA_YEAR} source breakdown · ${fmtTwh(selected?.generationTwh ?? 0)} total`}
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={selectedPie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
              >
                {selectedPie.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v, name) => [fmtTwh(Number(v ?? 0)), String(name ?? "")]} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
          {selected && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded bg-slate-50 p-2">
                <p className="text-slate-500">Fossil</p>
                <p className="font-bold text-slate-900">{fmtPct(selected.fossilSharePct)}</p>
              </div>
              <div className="rounded bg-slate-50 p-2">
                <p className="text-slate-500">Low-carbon</p>
                <p className="font-bold text-slate-900">{fmtPct(selected.lowCarbonSharePct)}</p>
              </div>
              <div className="rounded bg-slate-50 p-2">
                <p className="text-slate-500">Coal</p>
                <p className="font-bold text-slate-900">{fmtPct(selected.coalSharePct)}</p>
              </div>
              <div className="rounded bg-slate-50 p-2">
                <p className="text-slate-500">Wind + solar</p>
                <p className="font-bold text-slate-900">
                  {fmtPct(selected.windSharePct + selected.solarSharePct)}
                </p>
              </div>
            </div>
          )}
        </ChartCard>
      </div>

      <details className="rounded border border-sky-200 bg-sky-50 text-xs text-sky-900">
        <summary className="cursor-pointer px-3 py-2 font-semibold text-sky-800">
          Methodology &amp; context
        </summary>
        <div className="space-y-2 border-t border-sky-200 px-3 py-2 leading-relaxed text-sky-800">
          <p>
            <strong>Source shares:</strong> OWID reports each fuel as a percent of national
            generation. Absolute TWh per source = total generation × share / 100.
          </p>
          <p>
            <strong>Renewables:</strong> OWID aggregate includes hydro, solar, wind, and biofuels.
            Low-carbon = 100% − fossil share per OWID.
          </p>
          <p>
            <strong>Regions:</strong> Assigned for dashboard grouping — not an official OWID
            taxonomy. World row is the global aggregate, excluded from country charts.
          </p>
        </div>
      </details>

      <p className="text-center text-xs text-slate-400">
        Our World in Data · Ember &amp; Energy Institute · {DATA_YEAR}
      </p>
    </div>
  );
}

export default ElectricityGenerationMixDashboard;
