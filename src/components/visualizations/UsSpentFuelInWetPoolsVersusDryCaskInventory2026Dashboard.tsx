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
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  ReferenceLine,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  HEADLINE,
  MODE_HISTORY,
  MODE_SPLIT,
  NRC_REGIONS,
  SITE_GROUPS,
  SOURCE_NOTE,
  filterStates,
  fmtMtihm,
  fmtPct,
  type ModeFilter,
  type RegionFilter,
  type SortKey,
} from "@/data/us-spent-fuel-in-wet-pools-versus-dry-cask-inventory-2026-data";

// viz-types: dual-area mode history, state stacked bars, NRC region stacks,
// site-group scatter, national pie split
// | layout: default
// smoke-marker: Pool 42,037 vs dry 48,926 MTiHM

type ViewId = "crossover" | "states" | "regions" | "groups" | "split";

const POOL = "#0ea5e9";
const DRY = "#f59e0b";
const SLATE = "#64748b";
const EMERALD = "#059669";

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "crossover", label: "Crossover path" },
  { id: "states", label: "State split" },
  { id: "regions", label: "NRC regions" },
  { id: "groups", label: "Site groups" },
  { id: "split", label: "National share" },
];

const REGION_OPTS: { id: RegionFilter; label: string }[] = [
  { id: "all", label: "All regions" },
  { id: "1", label: "Region I" },
  { id: "2", label: "Region II" },
  { id: "3", label: "Region III" },
  { id: "4", label: "Region IV" },
];

const MODE_OPTS: { id: ModeFilter; label: string }[] = [
  { id: "all", label: "Pool + dry" },
  { id: "pool", label: "Pool only" },
  { id: "dry", label: "Dry only" },
];

const SORT_OPTS: { id: SortKey; label: string }[] = [
  { id: "total", label: "Sort: total MTiHM" },
  { id: "dryShare", label: "Sort: dry share" },
  { id: "pool", label: "Sort: pool mass" },
  { id: "dry", label: "Sort: dry mass" },
];

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
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {subtitle ? (
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      ) : null}
      <div className="mt-3 h-72 w-full min-w-0">{children}</div>
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
      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

export function UsSpentFuelInWetPoolsVersusDryCaskInventory2026Dashboard() {
  const [view, setView] = useState<ViewId>("crossover");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [mode, setMode] = useState<ModeFilter>("all");
  const [sort, setSort] = useState<SortKey>("total");

  const stateRows = useMemo(
    () => filterStates(region, mode, sort, 14),
    [region, mode, sort],
  );

  const historyChart = useMemo(
    () =>
      MODE_HISTORY.map((r) => ({
        year: String(r.year),
        pool: r.poolMtihm,
        dry: r.dryMtihm,
        dryShare: Math.round((1000 * r.dryMtihm) / r.totalMtihm) / 10,
      })),
    [],
  );

  const regionChart = useMemo(
    () =>
      NRC_REGIONS.map((r) => ({
        name: `R${r.id}`,
        pool: r.poolMtihm,
        dry: r.dryMtihm,
        dryShare:
          Math.round((1000 * r.dryMtihm) / (r.poolMtihm + r.dryMtihm)) / 10,
      })),
    [],
  );

  const groupScatter = useMemo(
    () =>
      SITE_GROUPS.filter((g) => g.dryMtihm + g.poolMtihm > 0).map((g) => ({
        id: g.id,
        name: g.label,
        pool: g.poolMtihm,
        dry: g.dryMtihm,
        casks: Math.max(g.casks, 8),
      })),
    [],
  );

  const pieData = useMemo(
    () =>
      MODE_SPLIT.map((m) => ({
        name: m.label,
        value: m.mtihm,
        fill: m.id === "pool" ? POOL : DRY,
      })),
    [],
  );

  return (
    <div className="not-prose space-y-4">
      <div className="rounded-xl border border-amber-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 p-5 text-white shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-300/90">
          Commercial SNF · MTiHM as of 31 Dec 2022
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Pool 42,037 vs dry 48,926 MTiHM
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Dry cask ISFSIs hold {fmtPct(HEADLINE.drySharePct)} of commercial
          spent-fuel mass — a {fmtMtihm(HEADLINE.dryLeadMtihm)} MTiHM lead over
          wet pools after the 2021 crossover. {fmtMtihm(HEADLINE.totalMtihm)}{" "}
          MTiHM total across {HEADLINE.totalAssemblies.toLocaleString()}{" "}
          assemblies and {HEADLINE.dryCasks.toLocaleString()} loaded casks.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-300">
          <span className="rounded-md bg-white/10 px-2 py-1">
            Dry share {fmtPct(HEADLINE.drySharePct)}
          </span>
          <span className="rounded-md bg-white/10 px-2 py-1">
            Crossover year {HEADLINE.crossoverYear}
          </span>
          <span className="rounded-md bg-white/10 px-2 py-1">
            Group C still {fmtMtihm(HEADLINE.groupCPoolMtihm)} MTiHM in pools
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {VIEWS.map((v) => (
          <Chip key={v.id} active={view === v.id} onClick={() => setView(v.id)}>
            {v.label}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
          Filters
        </span>
        <select
          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800"
          value={region}
          onChange={(e) => setRegion(e.target.value as RegionFilter)}
          aria-label="NRC region filter"
        >
          {REGION_OPTS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800"
          value={mode}
          onChange={(e) => setMode(e.target.value as ModeFilter)}
          aria-label="Storage mode filter"
        >
          {MODE_OPTS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort states"
        >
          {SORT_OPTS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {view === "crossover" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Pool vs dry inventory path"
            subtitle="MTiHM by storage mode · desk points before 2020; reported 2021–22"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyChart} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${fmtMtihm(Number(value))} MTiHM`,
                    name === "pool" ? "Wet pool" : "Dry cask",
                  ]}
                />
                <Legend />
                <ReferenceLine
                  x="2021"
                  stroke={EMERALD}
                  strokeDasharray="4 4"
                  label={{ value: "Crossover", fill: EMERALD, fontSize: 10 }}
                />
                <Area
                  type="monotone"
                  dataKey="pool"
                  name="Wet pool"
                  stroke={POOL}
                  fill={POOL}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="dry"
                  name="Dry cask"
                  stroke={DRY}
                  fill={DRY}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Dry share of commercial SNF mass"
            subtitle="Percent of MTiHM in dry ISFSI storage"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={historyChart} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  domain={[0, 70]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toFixed(1)}%`,
                    "Dry share",
                  ]}
                />
                <ReferenceLine y={50} stroke={SLATE} strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="dryShare"
                  name="Dry share"
                  stroke={DRY}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      {view === "states" ? (
        <ChartCard
          title="State pool vs dry MTiHM"
          subtitle="Stacked bars · filters and sort apply · top rows by current sort"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stateRows}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
              />
              <YAxis type="category" dataKey="abbr" width={36} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value, name) => [
                  `${fmtMtihm(Number(value))} MTiHM`,
                  name === "poolMtihm" ? "Wet pool" : "Dry cask",
                ]}
              />
              <Legend />
              {(mode === "all" || mode === "pool") && (
                <Bar dataKey="poolMtihm" name="Wet pool" stackId="a" fill={POOL} />
              )}
              {(mode === "all" || mode === "dry") && (
                <Bar dataKey="dryMtihm" name="Dry cask" stackId="a" fill={DRY} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "regions" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="NRC region stacked inventory"
            subtitle="End-2022 MTiHM · Table E.2"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionChart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${fmtMtihm(Number(value))} MTiHM`,
                    name === "pool" ? "Wet pool" : "Dry cask",
                  ]}
                />
                <Legend />
                <Bar dataKey="pool" name="Wet pool" stackId="r" fill={POOL} />
                <Bar dataKey="dry" name="Dry cask" stackId="r" fill={DRY} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Dry share by NRC region"
            subtitle="Percent of regional MTiHM in dry storage"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionChart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis
                  domain={[0, 70]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toFixed(1)}%`,
                    "Dry share",
                  ]}
                />
                <ReferenceLine y={50} stroke={SLATE} strokeDasharray="3 3" />
                <Bar dataKey="dryShare" name="Dry share" radius={[4, 4, 0, 0]}>
                  {regionChart.map((r) => (
                    <Cell key={r.name} fill={r.dryShare >= 50 ? DRY : POOL} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      {view === "groups" ? (
        <ChartCard
          title="Site-group pool vs dry scatter"
          subtitle="Bubble size ~ loaded casks · Group C still pool-heavy; Group A nearly dry-only"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="pool"
                name="Pool"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
              />
              <YAxis
                type="number"
                dataKey="dry"
                name="Dry"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
              />
              <ZAxis type="number" dataKey="casks" range={[60, 400]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={groupScatter} fill={DRY}>
                {groupScatter.map((g) => (
                  <Cell
                    key={g.id}
                    fill={g.pool > g.dry ? POOL : DRY}
                    fillOpacity={0.85}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "split" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="National mass share"
            subtitle={`${fmtMtihm(HEADLINE.totalMtihm)} MTiHM commercial LWR inventory`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {pieData.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `${fmtMtihm(Number(value))} MTiHM`,
                    "Mass",
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Assemblies vs mass"
            subtitle="Dry leads on both assemblies and MTiHM"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    metric: "Assemblies",
                    pool: HEADLINE.poolAssemblies / 1000,
                    dry: HEADLINE.dryAssemblies / 1000,
                  },
                  {
                    metric: "MTiHM",
                    pool: HEADLINE.poolMtihm / 1000,
                    dry: HEADLINE.dryMtihm / 1000,
                  },
                ]}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}k`} />
                <Tooltip
                  formatter={(value, name) => [
                    `${Number(value).toFixed(1)}k`,
                    name === "pool" ? "Wet pool" : "Dry cask",
                  ]}
                />
                <Legend />
                <Bar dataKey="pool" name="Wet pool" fill={POOL} radius={[4, 4, 0, 0]} />
                <Bar dataKey="dry" name="Dry cask" fill={DRY} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      <p className="text-[11px] leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
