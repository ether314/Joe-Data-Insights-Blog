"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  ALL_GEOGRAPHIES,
  COUNTRY_HUBS,
  GEO_SCATTER,
  HEADLINE,
  MIDSTREAM_GEOGRAPHIES,
  MINE_GEOGRAPHIES,
  REGION_TOP1_SEATS,
  SOURCE_NOTE,
  STAGE_FLIPS,
  fmtPct,
  getCommodityById,
  regionShares,
  type CommodityGeo,
  type Stage,
} from "@/data/chokepoint-commodities-geography-2026-data";

// viz-types: country share bars, regional pie, mine→mid flip dumbbell, mine×mid scatter, regional Top-1 seats | layout: default

type ViewId = "shares" | "flips" | "scatter" | "hubs";
type StageFilter = "all" | Stage;

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
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CountrySharePanel({ geo }: { geo: CommodityGeo }) {
  const rows = useMemo(
    () =>
      [...geo.countries]
        .filter((c) => c.iso !== "XX")
        .sort((a, b) => b.sharePct - a.sharePct),
    [geo],
  );

  return (
    <div className="h-[340px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, "dataMax"]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#64748b" }}
          />
          <YAxis
            type="category"
            dataKey="country"
            width={120}
            tick={{ fontSize: 11, fill: "#334155" }}
          />
          <Tooltip
            formatter={(value) => [fmtPct(Number(value), 1), "Share"]}
            labelFormatter={(l) => String(l)}
          />
          <Bar dataKey="sharePct" radius={[0, 4, 4, 0]} maxBarSize={28}>
            {rows.map((r) => (
              <Cell key={r.iso} fill={r.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function RegionalPiePanel({ geo }: { geo: CommodityGeo }) {
  const rows = useMemo(() => regionShares(geo), [geo]);

  return (
    <div className="h-[340px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={rows}
            dataKey="sharePct"
            nameKey="region"
            cx="50%"
            cy="50%"
            innerRadius={58}
            outerRadius={110}
            paddingAngle={2}
          >
            {rows.map((r) => (
              <Cell key={r.region} fill={r.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [fmtPct(Number(value), 1), "Regional share"]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
        {rows.map((r) => (
          <span key={r.region} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: r.fill }}
            />
            {r.region} ({fmtPct(r.sharePct, 0)})
          </span>
        ))}
      </div>
    </div>
  );
}

function FlipDumbbellPanel() {
  const maxPct = Math.max(
    ...STAGE_FLIPS.flatMap((f) => [f.mineSharePct, f.midSharePct]),
    1,
  );

  return (
    <div className="space-y-4 min-h-[320px]">
      <div className="mb-1 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
          Mine Top-1 share
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500" />
          Midstream Top-1 share
        </span>
      </div>
      {STAGE_FLIPS.map((f) => {
        const mineLeft = (f.mineSharePct / maxPct) * 100;
        const midLeft = (f.midSharePct / maxPct) * 100;
        const left = Math.min(mineLeft, midLeft);
        const width = Math.abs(midLeft - mineLeft);
        return (
          <div key={f.id} className="grid grid-cols-[100px_1fr_72px] items-center gap-2">
            <div className="text-right text-xs font-semibold text-slate-800">
              {f.metal}
            </div>
            <div className="relative h-8 rounded-md bg-slate-50">
              <div
                className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-slate-300"
                style={{ left: `${left}%`, width: `${width}%` }}
              />
              <div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-amber-500 shadow"
                style={{ left: `${mineLeft}%` }}
                title={`${f.mineTop1}: ${fmtPct(f.mineSharePct, 0)}`}
              />
              <div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-rose-500 shadow"
                style={{ left: `${midLeft}%` }}
                title={`${f.midTop1}: ${fmtPct(f.midSharePct, 0)}`}
              />
            </div>
            <div className="text-xs font-medium text-slate-500">
              Δ {fmtPct(f.flipPp, 0)}
            </div>
          </div>
        );
      })}
      <p className="pt-2 text-xs text-slate-500">
        Cobalt is the extreme geographic flip: DRC holds ~74% of mine output while China
        holds ~76% of refined metal — a {HEADLINE.largestMineToMidFlipPp} pp Top-1 seat change
        across the stage boundary.
      </p>
    </div>
  );
}

function ScatterPanel() {
  return (
    <div className="h-[360px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 16, right: 24, left: 8, bottom: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            dataKey="mineSharePct"
            name="Mine Top-1"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#64748b" }}
            label={{
              value: "Mine Top-1 share",
              position: "insideBottom",
              offset: -4,
              style: { fontSize: 11, fill: "#64748b" },
            }}
          />
          <YAxis
            type="number"
            dataKey="midSharePct"
            name="Mid Top-1"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#64748b" }}
            label={{
              value: "Midstream Top-1",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 11, fill: "#64748b" },
            }}
          />
          <ZAxis range={[80, 80]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value, name) => [
              fmtPct(Number(value), 1),
              name === "mineSharePct" ? "Mine Top-1" : "Mid Top-1",
            ]}
            labelFormatter={(_, payload) => {
              const p = payload?.[0]?.payload as { metal?: string } | undefined;
              return p?.metal ?? "";
            }}
          />
          <Scatter data={GEO_SCATTER} name="Metals">
            {GEO_SCATTER.map((p) => (
              <Cell
                key={p.metal}
                fill={p.fill}
                stroke={p.sameTop1 ? "#0f172a" : "#fff"}
                strokeWidth={p.sameTop1 ? 2 : 1}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <p className="mt-2 text-center text-xs text-slate-500">
        Points above the diagonal are midstream-heavier at Top-1. Outlined points keep the
        same Top-1 country across stages (China mine + China midstream).
      </p>
    </div>
  );
}

function HubsPanel({ mode }: { mode: "seats" | "countries" }) {
  if (mode === "countries") {
    const rows = [...COUNTRY_HUBS].sort((a, b) => b.totalTop1Count - a.totalTop1Count);
    return (
      <div className="h-[340px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 8, right: 16, left: 8, bottom: 48 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="country"
              interval={0}
              angle={-28}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 10, fill: "#334155" }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
              label={{
                value: "Top-1 seats",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fill: "#64748b" },
              }}
            />
            <Tooltip />
            <Bar dataKey="mineTop1Count" name="Mine Top-1" stackId="a" fill="#f59e0b" />
            <Bar
              dataKey="midTop1Count"
              name="Midstream Top-1"
              stackId="a"
              fill="#f43f5e"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  const rows = REGION_TOP1_SEATS.filter(
    (r) => r.mineTop1Seats + r.midTop1Seats > 0,
  );
  return (
    <div className="h-[340px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="region" tick={{ fontSize: 11, fill: "#334155" }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
          <Tooltip />
          <Bar dataKey="mineTop1Seats" name="Mine Top-1 seats" fill="#f59e0b" />
          <Bar dataKey="midTop1Seats" name="Midstream Top-1 seats" fill="#f43f5e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChokepointCommoditiesGeography2026Dashboard() {
  const [view, setView] = useState<ViewId>("shares");
  const [stageFilter, setStageFilter] = useState<StageFilter>("mine");
  const [commodityId, setCommodityId] = useState("cobalt-mine");
  const [hubMode, setHubMode] = useState<"seats" | "countries">("seats");
  const [shareLens, setShareLens] = useState<"country" | "region">("country");

  const catalog = useMemo(() => {
    if (stageFilter === "mine") return MINE_GEOGRAPHIES;
    if (stageFilter === "midstream") return MIDSTREAM_GEOGRAPHIES;
    return ALL_GEOGRAPHIES;
  }, [stageFilter]);

  const activeGeo = useMemo(() => {
    const hit = getCommodityById(commodityId);
    if (hit && catalog.some((c) => c.id === hit.id)) return hit;
    return catalog[0];
  }, [commodityId, catalog]);

  return (
    <div
      className="space-y-4"
      data-viz="chokepoint-commodities-geography-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 px-5 py-5 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-rose-200">
          Chokepoint commodities — geography lens
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          China holds {HEADLINE.chinaTotalTop1Count} of {HEADLINE.commoditiesMapped}{" "}
          mapped Top-1 seats — cobalt flips {HEADLINE.largestMineToMidFlipPp} pp from DRC
          mine to China refine
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Country and regional shares across {HEADLINE.commoditiesMapped} mapped
          mine/midstream ledgers. Pit geography is plural (Africa, Oceania, Latin America);
          all {HEADLINE.chinaMidstreamTop1Count} midstream Top-1 seats sit in East Asia.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "shares", label: "Country / region shares" },
            { id: "flips", label: "Mine → mid flips" },
            { id: "scatter", label: "Mine × mid scatter" },
            { id: "hubs", label: "Regional hubs" },
          ]}
        />
      </div>

      {view === "shares" && (
        <>
          <div className="flex flex-wrap items-center gap-4">
            <ToggleGroup
              label="Stage"
              value={stageFilter}
              onChange={(v) => {
                setStageFilter(v);
                const next =
                  v === "midstream"
                    ? MIDSTREAM_GEOGRAPHIES[0]
                    : v === "mine"
                      ? MINE_GEOGRAPHIES[0]
                      : ALL_GEOGRAPHIES[0];
                setCommodityId(next.id);
              }}
              options={[
                { id: "mine", label: "Mine" },
                { id: "midstream", label: "Midstream" },
                { id: "all", label: "All stages" },
              ]}
            />
            <ToggleGroup
              label="Lens"
              value={shareLens}
              onChange={setShareLens}
              options={[
                { id: "country", label: "Country bars" },
                { id: "region", label: "Regional pie" },
              ]}
            />
            <label className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Commodity
              <select
                className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold normal-case text-slate-800"
                value={activeGeo.id}
                onChange={(e) => setCommodityId(e.target.value)}
              >
                {catalog.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <ChartCard
            title={
              shareLens === "country"
                ? `Country shares — ${activeGeo.label}`
                : `Regional shares — ${activeGeo.label}`
            }
            subtitle={`${activeGeo.top1Label} Top-1 at ${fmtPct(activeGeo.top1SharePct, 1)} · ${activeGeo.top1Region} · ${activeGeo.confidence}`}
          >
            {shareLens === "country" ? (
              <CountrySharePanel geo={activeGeo} />
            ) : (
              <RegionalPiePanel geo={activeGeo} />
            )}
          </ChartCard>
        </>
      )}

      {view === "flips" && (
        <ChartCard
          title="Mine → midstream geographic flips"
          subtitle="Same metal, different stage Top-1 — Δ is the Top-1 share gap across the stage boundary"
        >
          <FlipDumbbellPanel />
        </ChartCard>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Mine Top-1 × midstream Top-1"
          subtitle="Five paired metals — midstream sits higher and more China-led than the pit"
        >
          <ScatterPanel />
        </ChartCard>
      )}

      {view === "hubs" && (
        <>
          <ToggleGroup
            label="Hub meter"
            value={hubMode}
            onChange={setHubMode}
            options={[
              { id: "seats", label: "Regional Top-1 seats" },
              { id: "countries", label: "Country hub stack" },
            ]}
          />
          <ChartCard
            title={
              hubMode === "seats"
                ? "Where Top-1 seats sit by region"
                : "Which countries hold Top-1 seats"
            }
            subtitle="Counted across the 8 mine + 6 midstream ledgers in this geography map"
          >
            <HubsPanel mode={hubMode} />
          </ChartCard>
        </>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
