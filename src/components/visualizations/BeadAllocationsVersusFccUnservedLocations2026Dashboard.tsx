"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  FORMULA,
  HEADLINE,
  JURISDICTIONS,
  REGION_AVG,
  SOURCE_NOTE,
  VIZ_MARKERS,
  filterJurisdictions,
  sortByMetric,
  type JurisdictionRow,
  type RegionFilter,
} from "@/data/bead-allocations-versus-fcc-unserved-locations-2026-data";

// viz-types: horizontal rank bars, unserved×BEAD scatter, stacked baseline split,
// regional grouped bars, distribution histogram | layout: default
// smoke-marker: BEAD dollars per unserved location by state

type ViewId = "rank" | "scatter" | "stack" | "regions" | "distribution";

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SKY = "#0284c7";
const VIOLET = "#7c3aed";
const SLATE = "#64748b";
const REGION_COLORS: Record<string, string> = {
  Northeast: SKY,
  South: ROSE,
  Midwest: AMBER,
  West: TEAL,
  Territories: VIOLET,
};

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
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            value === o.id
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function dpuColor(dpu: number) {
  if (dpu > 50000) return ROSE;
  if (dpu > 15000) return AMBER;
  if (dpu > 8000) return VIOLET;
  return TEAL;
}

function formatK(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(n);
}

export function BeadAllocationsVersusFccUnservedLocations2026Dashboard() {
  const [view, setView] = useState<ViewId>("rank");
  const [region, setRegion] = useState<RegionFilter>("All");
  const [includeTerritories, setIncludeTerritories] = useState(false);
  const [descending, setDescending] = useState(true);
  const [topN, setTopN] = useState(20);

  const rows = useMemo(
    () =>
      sortByMetric(
        filterJurisdictions(region, includeTerritories, 0),
        "dollarsPerUnserved",
        descending,
      ),
    [region, includeTerritories, descending],
  );

  const rankData = useMemo(
    () =>
      rows.slice(0, topN).map((r) => ({
        label: r.abbr,
        name: r.name,
        dpu: r.dollarsPerUnserved,
        dpuK: +(r.dollarsPerUnserved / 1000).toFixed(1),
        region: r.region,
      })),
    [rows, topN],
  );

  const scatterData = useMemo(
    () =>
      rows
        .filter((r) => r.region !== "Territories" || includeTerritories)
        .map((r) => ({
          x: r.unservedLocations,
          y: r.beadAllocationM,
          abbr: r.abbr,
          dpu: r.dollarsPerUnserved,
          z: Math.max(40, Math.min(280, r.beadAllocationM / 8)),
          region: r.region,
        })),
    [rows, includeTerritories],
  );

  const stackData = useMemo(
    () =>
      sortByMetric(rows, "beadAllocationM", true)
        .slice(0, 12)
        .map((r) => ({
          abbr: r.abbr,
          baseline: r.baselineM,
          variable: r.variableM,
        })),
    [rows],
  );

  const regionData = useMemo(
    () =>
      REGION_AVG.map((r) => ({
        region: r.region,
        avgDpuK: +(r.avgDpu / 1000).toFixed(1),
        beadB: r.beadB,
        unservedK: Math.round(r.unserved / 1000),
      })),
    [],
  );

  const distData = useMemo(() => {
    const bins = [
      { bin: "<$5K", min: 0, max: 5000 },
      { bin: "$5–8K", min: 5000, max: 8000 },
      { bin: "$8–12K", min: 8000, max: 12000 },
      { bin: "$12–20K", min: 12000, max: 20000 },
      { bin: ">$20K", min: 20000, max: Infinity },
    ];
    const states = rows.filter((r) => r.region !== "Territories");
    return bins.map((b) => ({
      bin: b.bin,
      count: states.filter(
        (j) => j.dollarsPerUnserved >= b.min && j.dollarsPerUnserved < b.max,
      ).length,
    }));
  }, [rows]);

  const tableRows: JurisdictionRow[] = useMemo(
    () => sortByMetric(rows, "dollarsPerUnserved", true).slice(0, 10),
    [rows],
  );

  return (
    <div
      className="w-full space-y-4"
      data-viz="bead-allocations-versus-fcc-unserved-locations-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
        <p className="text-sm font-semibold text-slate-900">
          {VIZ_MARKERS[0]} — {HEADLINE.peakDpuName} peaks at $
          {formatK(HEADLINE.peakDpu)} per unserved location; Texas draws $
          {HEADLINE.texasBeadB}B but only ~${formatK(HEADLINE.texasDpu)} per
          unserved BSL
        </p>
        <p className="mt-1 text-xs text-slate-500">{SOURCE_NOTE}</p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
        <ToggleGroup
          options={[
            { id: "rank", label: "$/unserved rank" },
            { id: "scatter", label: "Unserved × BEAD $" },
            { id: "stack", label: "Baseline split" },
            { id: "regions", label: "Regional avg" },
            { id: "distribution", label: "$/unserved bins" },
          ]}
          value={view}
          onChange={setView}
        />
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            Region
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as RegionFilter)}
              className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
            >
              {["All", "Northeast", "South", "Midwest", "West", "Territories"].map(
                (r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ),
              )}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            Show
            <select
              value={topN}
              onChange={(e) => setTopN(Number(e.target.value))}
              className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
            >
              {[12, 20, 30, 51].map((n) => (
                <option key={n} value={n}>
                  Top {n}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={includeTerritories}
              onChange={(e) => setIncludeTerritories(e.target.checked)}
              className="rounded border-slate-300"
            />
            Include territories
          </label>
          <button
            type="button"
            onClick={() => setDescending((d) => !d)}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Sort {descending ? "high→low" : "low→high"}
          </button>
        </div>
      </div>

      {view === "rank" && (
        <ChartCard
          title="BEAD dollars per FCC unserved location"
          subtitle="Total June 2023 allocation divided by unserved BSLs at the map vintage NTIA used. Floor states cluster at the top."
        >
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rankData}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}K`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={36}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v) => [
                    `$${(Number(v) * 1000).toLocaleString()}`,
                    "$/unserved",
                  ]}
                  labelFormatter={(_, p) => {
                    const row = p?.[0]?.payload as { name?: string; region?: string };
                    return `${row?.name} (${row?.region})`;
                  }}
                />
                <Bar dataKey="dpuK" name="$/unserved ($K)" radius={[0, 4, 4, 0]}>
                  {rankData.map((d) => (
                    <Cell key={d.label} fill={dpuColor(d.dpu)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "scatter" && (
        <ChartCard
          title="More unserved locations, more BEAD — but not proportionally"
          subtitle="X = unserved BSLs on FCC fabric. Y = total BEAD allocation ($M). Bubble size scales with allocation."
        >
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Unserved"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => formatK(v)}
                  label={{
                    value: "Unserved locations (FCC fabric)",
                    position: "insideBottom",
                    offset: -2,
                    style: { fontSize: 11 },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="BEAD $M"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "BEAD allocation ($M)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11 },
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[50, 320]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    if (name === "x") return [Number(value).toLocaleString(), "Unserved"];
                    if (name === "y") return [`$${value}M`, "BEAD"];
                    return [value, String(name)];
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as { abbr?: string; dpu?: number };
                    return p?.abbr
                      ? `${p.abbr} · $${p.dpu?.toLocaleString() ?? "—"}/unserved`
                      : "";
                  }}
                />
                <Scatter data={scatterData}>
                  {scatterData.map((d) => (
                    <Cell key={d.abbr} fill={REGION_COLORS[d.region] ?? SLATE} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "stack" && (
        <ChartCard
          title="Statutory $100M floor vs variable allocation"
          subtitle="Every state starts at $100M (territories $25M). Remaining dollars track unserved + high-cost shares."
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stackData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="abbr" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} label={{ value: "$M", angle: -90, position: "insideLeft", style: { fontSize: 11 } }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="baseline" stackId="a" name="Baseline ($100M)" fill={SLATE} />
                <Bar dataKey="variable" stackId="a" name="Variable share" fill={TEAL} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "regions" && (
        <ChartCard
          title="Regional average BEAD intensity"
          subtitle="Mean $/unserved across states in each census region (territories excluded)."
        >
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}K`} />
                <Tooltip
                  formatter={(v, name) => {
                    if (name === "avgDpuK")
                      return [`$${(Number(v) * 1000).toLocaleString()}`, "Avg $/unserved"];
                    return [v, String(name)];
                  }}
                />
                <Bar dataKey="avgDpuK" name="Avg $/unserved ($K)" radius={[4, 4, 0, 0]}>
                  {regionData.map((d) => (
                    <Cell key={d.region} fill={REGION_COLORS[d.region] ?? NAVY} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "distribution" && (
        <ChartCard
          title="How many states land in each $/unserved band?"
          subtitle={`National median ~$${HEADLINE.medianDpu.toLocaleString()}/unserved among the 50 states + DC.`}
        >
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="bin" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="States" fill={SKY} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Allocation formula (IIJA / NTIA)"
          subtitle="Three buckets determine each state's BEAD notice — not a flat per-location check."
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[280px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-3 font-medium">Component</th>
                  <th className="py-2 font-medium">Pool</th>
                </tr>
              </thead>
              <tbody className="text-slate-800">
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-3">Baseline</td>
                  <td className="py-2">${FORMULA.baselineStatesM}M per state · ${FORMULA.baselineTerritoriesM}M territories</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-3">High-cost unserved</td>
                  <td className="py-2">${FORMULA.highCostPoolB}B (10% of program)</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-3">Remaining unserved share</td>
                  <td className="py-2">${FORMULA.remainingPoolB}B</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">Map vintage</td>
                  <td className="py-2">~{FORMULA.nationalUnservedUsed.toLocaleString()} unserved BSLs nationally</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ChartCard>

        <ChartCard title="Highest $/unserved jurisdictions" subtitle="Filtered view — statutory floors dominate when unserved counts are tiny.">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-2 font-medium">St</th>
                  <th className="py-2 pr-2 font-medium">BEAD $M</th>
                  <th className="py-2 pr-2 font-medium">Unserved</th>
                  <th className="py-2 font-medium">$/unserved</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r) => (
                  <tr key={r.abbr} className="border-b border-slate-50">
                    <td className="py-1.5 pr-2 font-medium">{r.abbr}</td>
                    <td className="py-1.5 pr-2">{r.beadAllocationM.toFixed(0)}</td>
                    <td className="py-1.5 pr-2">{r.unservedLocations.toLocaleString()}</td>
                    <td className="py-1.5">${r.dollarsPerUnserved.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
