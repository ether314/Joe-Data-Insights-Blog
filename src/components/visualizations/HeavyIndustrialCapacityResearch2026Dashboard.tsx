"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  BUILD_VS_OWN,
  FAL_SITES,
  FORGE_SHOPS,
  HEADLINE,
  SECTOR_META,
  SHIP_SHARE_MILESTONES,
  SOURCE_NOTE,
  SOURCES,
  YARD_NODES,
  fmtPct,
  sharesForSector,
  type SectorId,
} from "@/data/heavy-industrial-capacity-research-2026-data";

// viz-types: sector share bars, build-vs-own scatter, ship milestone area, yard lollipop, FAL treemap, forge strip | layout: default

type Tab = "sectors" | "own" | "yards" | "aircraft" | "forges" | "path";
type OwnFilter = "all" | "shipping" | "aviation" | "steel";
type YardSort = "capacity" | "docks";

const SECTOR_OPTIONS: { id: SectorId; label: string }[] = [
  { id: "shipbuilding", label: "Shipyards" },
  { id: "aircraft-fal", label: "Aircraft FALs" },
  { id: "dry-docks", label: "Dry docks" },
  { id: "ultra-heavy-forge", label: "Heavy forges" },
  { id: "crude-steel", label: "Crude steel" },
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
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Horizontal share bars for selected sector */
function SectorSharePanel({ sector }: { sector: SectorId }) {
  const rows = useMemo(() => sharesForSector(sector).filter((r) => r.sharePct > 0), [sector]);
  const meta = SECTOR_META[sector];

  return (
    <div className="h-[380px] w-full min-h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 8, right: 28, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickFormatter={(v) => `${v}%`}
            domain={[0, "dataMax + 5"]}
          />
          <YAxis
            type="category"
            dataKey="short"
            width={78}
            tick={{ fontSize: 12, fill: "#334155", fontWeight: 600 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0]?.payload as (typeof rows)[0];
              return (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                  <p className="font-bold text-slate-900">{row.label}</p>
                  <p className="text-slate-600">
                    {fmtPct(row.sharePct)} of {meta.metric}
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="sharePct" radius={[0, 4, 4, 0]} maxBarSize={28}>
            {rows.map((r) => (
              <Cell key={r.region} fill={r.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-1 text-xs text-slate-500">
        {meta.label} · {meta.year} · {meta.metric}
      </p>
    </div>
  );
}

function BuildOwnScatter({ filter }: { filter: OwnFilter }) {
  const data = useMemo(
    () =>
      BUILD_VS_OWN.filter((d) => filter === "all" || d.sector === filter).map((d) => ({
        ...d,
        x: d.ownSharePct,
        y: d.buildSharePct,
      })),
    [filter],
  );

  return (
    <div className="h-[400px] w-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 16, right: 24, left: 8, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            dataKey="x"
            name="Own"
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickFormatter={(v) => `${v}%`}
            label={{
              value: "Ownership / demand share →",
              position: "insideBottom",
              offset: -12,
              style: { fontSize: 11, fill: "#64748b" },
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Build"
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickFormatter={(v) => `${v}%`}
            label={{
              value: "Build share ↑",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 11, fill: "#64748b" },
            }}
          />
          <ZAxis type="number" dataKey="buildSharePct" range={[80, 400]} />
          <ReferenceLine
            segment={[
              { x: 0, y: 0 },
              { x: 60, y: 60 },
            ]}
            stroke="#cbd5e1"
            strokeDasharray="4 4"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0]?.payload as (typeof data)[0];
              return (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                  <p className="font-bold text-slate-900">{row.label}</p>
                  <p className="text-slate-600">Build {fmtPct(row.buildSharePct)}</p>
                  <p className="text-slate-600">Own {fmtPct(row.ownSharePct)}</p>
                </div>
              );
            }}
          />
          <Scatter data={data}>
            {data.map((d) => (
              <Cell key={d.id} fill={d.color} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-500">
        Points above the dashed 1:1 line build more than they own; below are net buyers of
        fabrication.
      </p>
    </div>
  );
}

function ShipPathArea() {
  return (
    <div className="h-[360px] w-full min-h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={SHIP_SHARE_MILESTONES}
          margin={{ top: 12, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748b" }} />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 70]}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0]?.payload as (typeof SHIP_SHARE_MILESTONES)[0];
              return (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                  <p className="font-bold text-slate-900">{row.year}</p>
                  <p className="text-red-600">China {fmtPct(row.chinaShipPct)}</p>
                  <p className="text-blue-600">Korea {fmtPct(row.koreaShipPct)}</p>
                  <p className="text-teal-600">Japan {fmtPct(row.japanShipPct)}</p>
                  <p className="mt-1 text-xs text-slate-500">{row.note}</p>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="chinaShipPct"
            stackId="1"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.55}
            name="China"
          />
          <Area
            type="monotone"
            dataKey="koreaShipPct"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.55}
            name="Korea"
          />
          <Area
            type="monotone"
            dataKey="japanShipPct"
            stackId="1"
            stroke="#14b8a6"
            fill="#14b8a6"
            fillOpacity={0.55}
            name="Japan"
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-500">
        Milestone path (not a full annual series). Stacked Asia-trio GT delivery shares.
      </p>
    </div>
  );
}

function YardLollipop({ sort }: { sort: YardSort }) {
  const rows = useMemo(() => {
    const sorted = [...YARD_NODES].sort((a, b) =>
      sort === "capacity"
        ? b.capacityIndex - a.capacityIndex
        : b.largeDryDocks - a.largeDryDocks || b.capacityIndex - a.capacityIndex,
    );
    return sorted;
  }, [sort]);

  const max =
    sort === "capacity"
      ? Math.max(...rows.map((r) => r.capacityIndex))
      : Math.max(...rows.map((r) => r.largeDryDocks));

  return (
    <div className="space-y-2 min-h-[340px]">
      {rows.map((r) => {
        const val = sort === "capacity" ? r.capacityIndex : r.largeDryDocks;
        const w = (val / max) * 100;
        return (
          <div
            key={r.id}
            className="grid grid-cols-[7.5rem_1fr_3.5rem] items-center gap-2"
          >
            <span className="truncate text-sm font-semibold text-slate-800" title={r.name}>
              {r.short}
            </span>
            <div className="relative h-3 rounded-full bg-slate-100">
              <div
                className="absolute left-0 top-0 h-3 rounded-full"
                style={{ width: `${w}%`, backgroundColor: r.color, opacity: 0.35 }}
              />
              <div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white shadow"
                style={{ left: `calc(${w}% - 7px)`, backgroundColor: r.color }}
              />
            </div>
            <span className="text-right font-mono text-xs text-slate-600">
              {sort === "capacity" ? val : `${val} docks`}
            </span>
          </div>
        );
      })}
      <p className="pt-2 text-xs text-slate-500">
        Capacity index is relative within this tracked set — not absolute GT. Segment tags
        mix merchant, naval-specialist, offshore, and repair yards.
      </p>
    </div>
  );
}

function FalTreemap() {
  const total = FAL_SITES.reduce((s, r) => s + r.sharePct, 0);
  let x = 0;
  const cells = FAL_SITES.map((r) => {
    const w = (r.sharePct / total) * 100;
    const cell = { ...r, x, w };
    x += w;
    return cell;
  });

  return (
    <div className="space-y-3">
      <svg
        viewBox="0 0 100 30"
        className="h-32 w-full"
        role="img"
        aria-label="Large-jet FAL site share treemap"
      >
        {cells.map((c) => (
          <g key={c.id}>
            <rect
              x={c.x}
              y={0}
              width={Math.max(c.w - 0.15, 0)}
              height={30}
              fill={c.color}
              rx={0.4}
            />
            {c.w > 7 && (
              <>
                <text
                  x={c.x + c.w / 2}
                  y={12}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={3.2}
                  fontWeight={700}
                >
                  {c.short}
                </text>
                <text
                  x={c.x + c.w / 2}
                  y={19}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={2.8}
                  opacity={0.95}
                >
                  {fmtPct(c.sharePct)}
                </text>
              </>
            )}
          </g>
        ))}
      </svg>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={FAL_SITES}
            layout="vertical"
            margin={{ top: 4, right: 20, left: 4, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} />
            <YAxis
              type="category"
              dataKey="short"
              width={72}
              tick={{ fontSize: 12, fill: "#334155", fontWeight: 600 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0]?.payload as (typeof FAL_SITES)[0];
                return (
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                    <p className="font-bold text-slate-900">{row.site}</p>
                    <p className="text-slate-600">
                      {row.deliveries2025} aircraft · {fmtPct(row.sharePct)}
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="deliveries2025" radius={[0, 4, 4, 0]} maxBarSize={24}>
              {FAL_SITES.map((r) => (
                <Cell key={r.id} fill={r.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ForgeStrip() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FORGE_SHOPS.map((f) => (
          <div
            key={f.id}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            style={{ borderLeftWidth: 4, borderLeftColor: f.color }}
          >
            <p className="text-sm font-bold text-slate-900">{f.short}</p>
            <p className="text-xs text-slate-500">{f.country}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
              {f.capability}
            </p>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500">
        Only a handful of shops can still forge reactor-pressure-vessel-class and comparable
        ultra-heavy components. North America has no shop in this tracked RPV-class set.
      </p>
    </div>
  );
}

export function HeavyIndustrialCapacityResearch2026Dashboard() {
  const [tab, setTab] = useState<Tab>("sectors");
  const [sector, setSector] = useState<SectorId>("shipbuilding");
  const [ownFilter, setOwnFilter] = useState<OwnFilter>("all");
  const [yardSort, setYardSort] = useState<YardSort>("capacity");

  return (
    <div
      className="space-y-6"
      data-viz="heavy-industrial-capacity-research-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Heavy industrial capacity · 2026 research
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Yards, dry docks, and the forge base that still builds capital stock
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          China delivers {fmtPct(HEADLINE.chinaShipGtShare2024Pct)} of merchant GT and holds
          ~{HEADLINE.vlccDockChinaSharePct}% of tracked VLCC-capable docks — yet Renton alone
          finishes {fmtPct(HEADLINE.rentonLargeJetShare2025Pct)} of large-jet handovers, and
          only {HEADLINE.ultraHeavyForgeShops} ultra-heavy forge shops remain in the nuclear-class
          set. Builder geography is sector-specific.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <span className="block text-[10px] uppercase tracking-wide text-slate-400">
              China ship GT
            </span>
            <span className="font-bold">{fmtPct(HEADLINE.chinaShipGtShare2024Pct)}</span>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <span className="block text-[10px] uppercase tracking-wide text-slate-400">
              Asia trio ships
            </span>
            <span className="font-bold">{fmtPct(HEADLINE.asiaShipTrioShare2024Pct)}</span>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <span className="block text-[10px] uppercase tracking-wide text-slate-400">
              Top-3 FALs
            </span>
            <span className="font-bold">{fmtPct(HEADLINE.top3FalShare2025Pct)}</span>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <span className="block text-[10px] uppercase tracking-wide text-slate-400">
              RPV-class forges
            </span>
            <span className="font-bold">{HEADLINE.ultraHeavyForgeShops} shops</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["sectors", "Sector shares"],
            ["own", "Build vs own"],
            ["yards", "Yard / dock map"],
            ["aircraft", "Aircraft FALs"],
            ["forges", "Heavy forges"],
            ["path", "Ship share path"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              tab === id
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "sectors" && (
        <ChartCard
          title="Who holds the builder base — by sector"
          subtitle="Toggle sectors: the leader changes. Ships and docks skew East Asia; aircraft FALs still skew North America; ultra-heavy forges are a six-shop club."
        >
          <div className="mb-4">
            <ToggleGroup
              label="Sector"
              value={sector}
              options={SECTOR_OPTIONS}
              onChange={setSector}
            />
          </div>
          <SectorSharePanel sector={sector} />
        </ChartCard>
      )}

      {tab === "own" && (
        <ChartCard
          title="Build vs own — who fabricates vs who consumes"
          subtitle="Shipping ownership (UNCTAD), aviation fleet/demand proxies, and steel production vs apparent demand."
        >
          <div className="mb-4">
            <ToggleGroup
              label="Filter"
              value={ownFilter}
              options={[
                { id: "all", label: "All" },
                { id: "shipping", label: "Shipping" },
                { id: "aviation", label: "Aviation" },
                { id: "steel", label: "Steel" },
              ]}
              onChange={setOwnFilter}
            />
          </div>
          <BuildOwnScatter filter={ownFilter} />
        </ChartCard>
      )}

      {tab === "yards" && (
        <ChartCard
          title="Major yard & dry-dock complexes"
          subtitle="Relative capacity index and large-dock counts for a tracked set of merchant, naval, offshore, and repair yards."
        >
          <div className="mb-4">
            <ToggleGroup
              label="Sort"
              value={yardSort}
              options={[
                { id: "capacity", label: "Capacity index" },
                { id: "docks", label: "Large dry docks" },
              ]}
              onChange={setYardSort}
            />
          </div>
          <YardLollipop sort={yardSort} />
        </ChartCard>
      )}

      {tab === "aircraft" && (
        <ChartCard
          title="Large-jet final-assembly sites"
          subtitle={`Renton ${fmtPct(HEADLINE.rentonLargeJetShare2025Pct)} · top three ${fmtPct(HEADLINE.top3FalShare2025Pct)} · US campuses ${fmtPct(HEADLINE.usFalShare2025Pct)} of 2025 attributed handovers.`}
        >
          <FalTreemap />
        </ChartCard>
      )}

      {tab === "forges" && (
        <ChartCard
          title="Ultra-heavy forge shops (RPV-class tracked set)"
          subtitle="Facility inventory — equal-weight regional shares in the sector panel; names here are the actual shops."
        >
          <ForgeStrip />
        </ChartCard>
      )}

      {tab === "path" && (
        <ChartCard
          title="Merchant shipbuilding — Asia trio share path"
          subtitle="How the yard map migrated from Japan-dominant to China-dominant over four decades."
        >
          <ShipPathArea />
        </ChartCard>
      )}

      <details className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">
        <summary className="cursor-pointer font-semibold text-slate-800">
          Sources & methodology
        </summary>
        <p className="mt-3 leading-relaxed">{SOURCE_NOTE}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {SOURCES.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
