"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
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
  ALL_GEOGRAPHIES,
  COUNTRY_HUBS,
  GEO_SCATTER,
  HEADLINE,
  MIDSTREAM_GEOGRAPHIES,
  MINE_GEOGRAPHIES,
  MIX_REGIONS,
  REGION_FILL,
  REGION_TOP1_SEATS,
  SOURCE_NOTE,
  STAGE_FLIPS,
  VINTAGE_DELTAS,
  fmtPct,
  regionalMixRows,
} from "@/data/chokepoint-commodities-geography-2026q3-data";

// viz-types: regional stacked mix, vintage delta bars, mine→mid area+scatter, radar seats, hub stacks | layout: default

type ViewId = "mix" | "vintage" | "flips" | "radar" | "hubs";
type StageFilter = "mine" | "midstream" | "all";
type SectorFilter = "all" | "batteries" | "semiconductors" | "magnets" | "structural" | "fertilizers" | "recycling";

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

function RegionalMixPanel({ stage }: { stage: StageFilter }) {
  const catalog = useMemo(() => {
    if (stage === "mine") return MINE_GEOGRAPHIES;
    if (stage === "midstream") return MIDSTREAM_GEOGRAPHIES;
    return ALL_GEOGRAPHIES;
  }, [stage]);

  const rows = useMemo(() => regionalMixRows(catalog), [catalog]);

  return (
    <div className="h-[420px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#64748b" }}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={88}
            tick={{ fontSize: 11, fill: "#334155" }}
          />
          <Tooltip
            formatter={(value, name) => [fmtPct(Number(value), 1), String(name)]}
          />
          {MIX_REGIONS.map((region) => (
            <Bar
              key={region}
              dataKey={region}
              stackId="mix"
              fill={REGION_FILL[region]}
              name={region}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
        {MIX_REGIONS.slice(0, 6).map((r) => (
          <span key={r} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: REGION_FILL[r] }}
            />
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}

function VintageDeltaPanel({ sector }: { sector: SectorFilter }) {
  const rows = useMemo(() => {
    const base = [...VINTAGE_DELTAS].sort((a, b) => b.deltaPp - a.deltaPp);
    if (sector === "all") return base;
    const ids = new Set(
      ALL_GEOGRAPHIES.filter((g) => g.sector === sector).map((g) => g.id),
    );
    return base.filter((r) => ids.has(r.id));
  }, [sector]);

  return (
    <div className="h-[380px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v) => `${v > 0 ? "+" : ""}${v} pp`}
            tick={{ fontSize: 11, fill: "#64748b" }}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={100}
            tick={{ fontSize: 11, fill: "#334155" }}
          />
          <ReferenceLine x={0} stroke="#94a3b8" />
          <Tooltip
            formatter={(value) => [
              `${Number(value) > 0 ? "+" : ""}${Number(value).toFixed(1)} pp`,
              "Prior→Q3 Δ",
            ]}
            labelFormatter={(l) => String(l)}
          />
          <Bar dataKey="deltaPp" radius={[0, 4, 4, 0]} maxBarSize={26}>
            {rows.map((r) => (
              <Cell
                key={r.id}
                fill={
                  r.direction === "tighter"
                    ? "#f43f5e"
                    : r.direction === "easier"
                      ? "#14b8a6"
                      : "#94a3b8"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-2 text-center text-xs text-slate-500">
        Rose = Top-1 thickened vs geography-2026 · Teal = eased · Grey = flat
      </p>
    </div>
  );
}

function FlipAreaPanel() {
  const areaRows = STAGE_FLIPS.map((f) => ({
    metal: f.metal,
    mine: f.mineSharePct,
    mid: f.midSharePct,
    flipPp: f.flipPp,
    crossBorder: f.crossBorder,
  }));

  return (
    <div className="space-y-4">
      <div className="h-[280px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={areaRows} margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="metal" tick={{ fontSize: 11, fill: "#334155" }} />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <Tooltip
              formatter={(value, name) => [
                fmtPct(Number(value), 1),
                name === "mine" ? "Mine Top-1" : "Mid Top-1",
              ]}
            />
            <Area
              type="monotone"
              dataKey="mine"
              name="mine"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="mid"
              name="mid"
              stroke="#f43f5e"
              fill="#f43f5e"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="h-[280px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              dataKey="mineSharePct"
              name="Mine"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: "#64748b" }}
              label={{
                value: "Mine Top-1",
                position: "insideBottom",
                offset: -2,
                style: { fontSize: 11, fill: "#64748b" },
              }}
            />
            <YAxis
              type="number"
              dataKey="midSharePct"
              name="Mid"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <ZAxis range={[90, 90]} />
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
      </div>
      <p className="text-xs text-slate-500">
        Cross-border flips (cobalt, copper, lithium) move Top-1 country; outlined points keep
        China on both sides but still thicken at midstream. Cobalt remains the extreme
        continent flip: DRC ~{fmtPct(74.2, 0)} mine vs China ~{fmtPct(75, 0)} refine.
      </p>
    </div>
  );
}

function RadarSeatsPanel() {
  const data = REGION_TOP1_SEATS.filter(
    (r) => r.mineTop1Seats + r.midTop1Seats > 0,
  ).map((r) => ({
    region: r.region,
    mine: r.mineTop1Seats,
    mid: r.midTop1Seats,
    total: r.mineTop1Seats + r.midTop1Seats,
  }));

  return (
    <div className="h-[380px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="region" tick={{ fontSize: 11, fill: "#334155" }} />
          <Radar
            name="Mine Top-1 seats"
            dataKey="mine"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.35}
          />
          <Radar
            name="Mid Top-1 seats"
            dataKey="mid"
            stroke="#f43f5e"
            fill="#f43f5e"
            fillOpacity={0.3}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
      <p className="mt-1 text-center text-xs text-slate-500">
        Amber = mine seats · Rose = midstream/smelter/recycle seats — East Asia owns the plant
        ring
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
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
            <Tooltip />
            <Bar dataKey="mineTop1Count" name="Mine Top-1" stackId="a" fill="#f59e0b" />
            <Bar
              dataKey="midTop1Count"
              name="Mid/smelt/recycle Top-1"
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
          <Bar dataKey="midTop1Seats" name="Mid Top-1 seats" fill="#f43f5e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChokepointCommoditiesGeography2026q3Dashboard() {
  const [view, setView] = useState<ViewId>("mix");
  const [stageFilter, setStageFilter] = useState<StageFilter>("midstream");
  const [sectorFilter, setSectorFilter] = useState<SectorFilter>("all");
  const [hubMode, setHubMode] = useState<"seats" | "countries">("seats");

  return (
    <div
      className="space-y-4"
      data-viz="chokepoint-commodities-geography-2026q3"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950 px-5 py-5 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-200">
          Chokepoint commodities — Q3 2026 geography lens
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          China holds {HEADLINE.chinaTotalTop1Count} of {HEADLINE.commoditiesMapped}{" "}
          mapped Top-1 seats — copper refine thickens to ~
          {HEADLINE.copperRefineTop1Pct}%
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          IEA GCMO 2026 / MCS 2026 restatement vs the prior geography map. Pit geography stays
          plural; all {HEADLINE.eastAsiaMidstreamTop1Count} midstream/smelter/recycle Top-1
          seats sit in East Asia. Lithium chemicals +{HEADLINE.lithiumChemDeltaPp} pp; REE
          separation {HEADLINE.reeSeparateDeltaPp} pp.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "mix", label: "Regional mix" },
            { id: "vintage", label: "Prior → Q3 Δ" },
            { id: "flips", label: "Mine × mid flips" },
            { id: "radar", label: "Seat radar" },
            { id: "hubs", label: "Regional hubs" },
          ]}
        />
      </div>

      {view === "mix" && (
        <>
          <ToggleGroup
            label="Stage"
            value={stageFilter}
            onChange={setStageFilter}
            options={[
              { id: "mine", label: "Mine" },
              { id: "midstream", label: "Plant" },
              { id: "all", label: "All stages" },
            ]}
          />
          <ChartCard
            title="Regional production mix by commodity"
            subtitle="Stacked country shares re-bucketed into regions — East Asia dominates the plant stack"
          >
            <RegionalMixPanel stage={stageFilter} />
          </ChartCard>
        </>
      )}

      {view === "vintage" && (
        <>
          <ToggleGroup
            label="Sector"
            value={sectorFilter}
            onChange={setSectorFilter}
            options={[
              { id: "all", label: "All" },
              { id: "batteries", label: "Batteries" },
              { id: "structural", label: "Structural" },
              { id: "magnets", label: "Magnets" },
              { id: "semiconductors", label: "Semis" },
              { id: "recycling", label: "Recycling" },
            ]}
          />
          <ChartCard
            title="Prior geography-2026 → Q3 Top-1 share Δ"
            subtitle="Copper smelt / refine and lithium chemicals thickened; REE separation eased"
          >
            <VintageDeltaPanel sector={sectorFilter} />
          </ChartCard>
        </>
      )}

      {view === "flips" && (
        <ChartCard
          title="Mine Top-1 vs midstream Top-1"
          subtitle="Area ribbon + scatter — same five paired metals, Q3 midstream shares"
        >
          <FlipAreaPanel />
        </ChartCard>
      )}

      {view === "radar" && (
        <ChartCard
          title="Where Top-1 seats sit — radar"
          subtitle={`Counted across ${HEADLINE.commoditiesMapped} mine + mid/smelt/recycle ledgers`}
        >
          <RadarSeatsPanel />
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
            subtitle={`China alone stacks ${HEADLINE.chinaTotalTop1Count} of ${HEADLINE.commoditiesMapped} seats (${HEADLINE.chinaMineTop1Count} mine + ${HEADLINE.chinaMidstreamTop1Count} plant)`}
          >
            <HubsPanel mode={hubMode} />
          </ChartCard>
        </>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
