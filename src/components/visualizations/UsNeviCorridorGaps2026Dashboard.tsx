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
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ANALYTICS,
  BUILDOUT_PATH,
  COVERAGE_MIX,
  FAILURE_MODES,
  GAP_BUCKETS,
  HEADLINE,
  REGION_ROLLUP,
  SOURCE_NOTE,
  filterByRegion,
  topGapStates,
  type RegionId,
} from "@/data/us-nevi-corridor-gaps-2026-data";

type Panel =
  | "coverage"
  | "state-gaps"
  | "buildout"
  | "failure"
  | "scatter"
  | "buckets";

type SortKey = "gapMiles" | "gapSharePct" | "afcMiles";
type RegionFilter = RegionId | "all";

const C = {
  qualified: "#0f766e",
  gap: "#c2410c",
  afc: "#1e3a5f",
  ready: "#2563eb",
  pending: "#94a3b8",
  sites: "#7c3aed",
  radar: "#ea580c",
  pie: ["#0f766e", "#c2410c"],
  region: {
    Northeast: "#2563eb",
    Midwest: "#0f766e",
    South: "#c2410c",
    West: "#7c3aed",
  } as Record<RegionId, string>,
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
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        ) : null}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function fmtMiles(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export function UsNeviCorridorGaps2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("coverage");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("gapMiles");
  const [topN, setTopN] = useState<8 | 12 | 20>(12);

  const filtered = useMemo(() => filterByRegion(region), [region]);

  const stateBars = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => b[sortKey] - a[sortKey]);
    return sorted.slice(0, topN).map((s) => ({
      abbr: s.abbr,
      gapMiles: s.gapMiles,
      gapSharePct: s.gapSharePct,
      afcMiles: s.afcMiles,
      qualifiedMiles: s.qualifiedMiles,
      region: s.region,
    }));
  }, [filtered, sortKey, topN]);

  const scatter = useMemo(
    () =>
      filtered.map((s) => ({
        abbr: s.abbr,
        gapSharePct: s.gapSharePct,
        gapMiles: s.gapMiles,
        ports: s.afdcDcFastPorts,
        region: s.region,
      })),
    [filtered],
  );

  const regionFilteredRollup = useMemo(() => {
    if (region === "all") return REGION_ROLLUP;
    return REGION_ROLLUP.filter((r) => r.region === region);
  }, [region]);

  const filterGapShare = useMemo(() => {
    const afc = filtered.reduce((a, r) => a + r.afcMiles, 0);
    const gap = filtered.reduce((a, r) => a + r.gapMiles, 0);
    return afc ? Math.round((gap / afc) * 1000) / 10 : 0;
  }, [filtered]);

  const coveragePie =
    region === "all"
      ? COVERAGE_MIX.map((c) => ({ name: c.label, value: c.miles }))
      : [
          {
            name: "NEVI-creditable coverage",
            value: filtered.reduce((a, r) => a + r.qualifiedMiles, 0),
          },
          {
            name: "Unqualified AFC miles",
            value: filtered.reduce((a, r) => a + r.gapMiles, 0),
          },
        ];

  return (
    <div
      className="space-y-6"
      data-viz="us-nevi-corridor-gaps-2026"
      data-smoke="us-nevi-corridor-gaps-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">
          Unqualified AFC miles
        </p>
        <p className="mt-2 text-3xl font-bold tabular-nums sm:text-4xl">
          {HEADLINE.unqualifiedSharePct}%
          <span className="ml-2 text-lg font-medium text-slate-300">
            of designated EV AFC mileage
          </span>
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Desk overlay of AFDC NEVI-class DC-fast pairs on{" "}
          {HEADLINE.afcMilesNational.toLocaleString()} FHWA Alternative Fuel
          Corridor miles — {HEADLINE.unqualifiedMiles.toLocaleString()} miles
          still lack a qualifying pair under the 50-mile / 1-mile benchmark.
          Top-5 states hold {HEADLINE.top5GapSharePct}% of national gap miles.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-lg bg-white/10 px-3 py-1.5">
            Gap miles: {fmtMiles(HEADLINE.unqualifiedMiles)}
          </span>
          <span className="rounded-lg bg-white/10 px-3 py-1.5">
            Filter gap share: {filterGapShare}%
          </span>
          <span className="rounded-lg bg-white/10 px-3 py-1.5">
            West gap: {ANALYTICS.westGapSharePct}%
          </span>
          <span className="rounded-lg bg-white/10 px-3 py-1.5">
            FBO states: {ANALYTICS.fboCertified}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Panel
        </span>
        {(
          [
            ["coverage", "Coverage mix"],
            ["state-gaps", "State gaps"],
            ["buildout", "Build-out path"],
            ["failure", "Failure modes"],
            ["scatter", "Ports vs gaps"],
            ["buckets", "Gap bands"],
          ] as const
        ).map(([id, label]) => (
          <Chip key={id} active={panel === id} onClick={() => setPanel(id)}>
            {label}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Region
        </span>
        {(
          [
            ["all", "All"],
            ["West", "West"],
            ["South", "South"],
            ["Midwest", "Midwest"],
            ["Northeast", "Northeast"],
          ] as const
        ).map(([id, label]) => (
          <Chip
            key={id}
            active={region === id}
            onClick={() => setRegion(id)}
          >
            {label}
          </Chip>
        ))}
        {panel === "state-gaps" ? (
          <>
            <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Sort
            </span>
            {(
              [
                ["gapMiles", "Gap miles"],
                ["gapSharePct", "Gap %"],
                ["afcMiles", "AFC miles"],
              ] as const
            ).map(([id, label]) => (
              <Chip
                key={id}
                active={sortKey === id}
                onClick={() => setSortKey(id)}
              >
                {label}
              </Chip>
            ))}
            <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Top
            </span>
            {([8, 12, 20] as const).map((n) => (
              <Chip key={n} active={topN === n} onClick={() => setTopN(n)}>
                {n}
              </Chip>
            ))}
          </>
        ) : null}
      </div>

      {panel === "coverage" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Qualified vs unqualified AFC miles"
            subtitle="NEVI-creditable pair coverage under the 50-mile benchmark"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={coveragePie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={2}
                    label={({ name, percent }) =>
                      `${String(name).split(" ")[0]} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {coveragePie.map((_, i) => (
                      <Cell key={i} fill={C.pie[i % C.pie.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) =>
                      `${Number(v).toLocaleString()} miles`
                    }
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Regional gap intensity"
            subtitle="Unqualified share of regional AFC mileage"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionFilteredRollup}
                  layout="vertical"
                  margin={{ left: 24, right: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" unit="%" />
                  <YAxis type="category" dataKey="region" width={80} />
                  <Tooltip
                    formatter={(v, name) =>
                      name === "gapSharePct"
                        ? [`${v}%`, "Gap share"]
                        : [Number(v).toLocaleString(), String(name)]
                    }
                  />
                  <Bar dataKey="gapSharePct" name="Gap share" radius={[0, 4, 4, 0]}>
                    {regionFilteredRollup.map((r) => (
                      <Cell key={r.region} fill={C.region[r.region]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {panel === "state-gaps" ? (
        <ChartCard
          title="States dominating remaining AFC gaps"
          subtitle={`Sorted by ${sortKey}; region filter: ${region}`}
        >
          <div className="h-[28rem]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stateBars}
                layout="vertical"
                margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="abbr" width={36} />
                <Tooltip
                  formatter={(v, name) => [
                    name === "gapSharePct"
                      ? `${v}%`
                      : Number(v).toLocaleString(),
                    String(name),
                  ]}
                />
                <Legend />
                {sortKey === "gapSharePct" ? (
                  <Bar
                    dataKey="gapSharePct"
                    name="Gap %"
                    fill={C.gap}
                    radius={[0, 4, 4, 0]}
                  />
                ) : (
                  <>
                    <Bar
                      dataKey="qualifiedMiles"
                      name="Qualified mi"
                      stackId="a"
                      fill={C.qualified}
                    />
                    <Bar
                      dataKey="gapMiles"
                      name="Gap mi"
                      stackId="a"
                      fill={C.gap}
                      radius={[0, 4, 4, 0]}
                    />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Top absolute gaps:{" "}
            {topGapStates(5)
              .map((s) => `${s.abbr} (${fmtMiles(s.gapMiles)} mi)`)
              .join(" · ")}
          </p>
        </ChartCard>
      ) : null}

      {panel === "buildout" ? (
        <ChartCard
          title="AFC designation vs NEVI-creditable coverage"
          subtitle="Corridor miles grew faster than qualifying pairs — gap share stays sticky"
        >
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={BUILDOUT_PATH} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="stage" />
                <YAxis
                  yAxisId="mi"
                  tickFormatter={(v) => fmtMiles(Number(v))}
                />
                <YAxis
                  yAxisId="sites"
                  orientation="right"
                  tickFormatter={(v) => String(v)}
                />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="mi"
                  type="monotone"
                  dataKey="afcMiles"
                  name="AFC miles"
                  fill={C.afc}
                  fillOpacity={0.15}
                  stroke={C.afc}
                />
                <Area
                  yAxisId="mi"
                  type="monotone"
                  dataKey="qualifiedMiles"
                  name="Qualified miles"
                  fill={C.qualified}
                  fillOpacity={0.25}
                  stroke={C.qualified}
                />
                <Line
                  yAxisId="sites"
                  type="monotone"
                  dataKey="neviSitesOpen"
                  name="NEVI sites open"
                  stroke={C.sites}
                  strokeWidth={2}
                  dot
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "failure" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Why corridor miles fail the pair test"
            subtitle="Desk attribution of unqualified segment-miles"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...FAILURE_MODES]}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" unit="%" />
                  <YAxis type="category" dataKey="mode" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v}%`, "Share of gap miles"]} />
                  <Bar dataKey="sharePct" fill={C.gap} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Failure-mode radar"
            subtitle="Same attribution as a profile"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={[...FAILURE_MODES]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="mode" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 40]} />
                  <Radar
                    name="Share %"
                    dataKey="sharePct"
                    stroke={C.radar}
                    fill={C.radar}
                    fillOpacity={0.35}
                  />
                  <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {panel === "scatter" ? (
        <ChartCard
          title="AFDC DC-fast ports vs AFC gap share"
          subtitle="Dense port stock does not guarantee NEVI-creditable corridor pairs"
        >
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="ports"
                  name="AFDC DC Fast ports"
                  tickFormatter={(v) => fmtMiles(Number(v))}
                  label={{
                    value: "AFDC DC Fast ports",
                    position: "insideBottom",
                    offset: -2,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="gapSharePct"
                  name="Gap %"
                  unit="%"
                  domain={[0, 100]}
                />
                <ZAxis type="number" dataKey="gapMiles" range={[40, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => [
                    name === "gapSharePct"
                      ? `${v}%`
                      : Number(v).toLocaleString(),
                    String(name),
                  ]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.abbr ?? ""
                  }
                />
                <Scatter data={scatter} name="States">
                  {scatter.map((s) => (
                    <Cell key={s.abbr} fill={C.region[s.region]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "buckets" ? (
        <ChartCard
          title="States by gap-share band"
          subtitle="How many states sit in each unqualified-share bucket"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GAP_BUCKETS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="bucket" />
                <YAxis yAxisId="st" />
                <YAxis
                  yAxisId="mi"
                  orientation="right"
                  tickFormatter={(v) => fmtMiles(Number(v))}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="st"
                  dataKey="states"
                  name="States"
                  fill={C.afc}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="mi"
                  dataKey="gapMiles"
                  name="Gap miles"
                  fill={C.gap}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
