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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ALTITUDE_BANDS,
  BAND_SCATTER,
  CATALOG_PATH,
  CLASS_MIX_2024,
  FRAGMENTATION_MILESTONES,
  GROWTH_INDEX,
  HEADLINE,
  REGIME_COMPOSITION,
  SOURCE_NOTE,
} from "@/data/catalogued-orbital-debris-growth-2026-data";

type Panel =
  | "catalog-path"
  | "altitude-density"
  | "regime-ladder"
  | "band-scatter"
  | "class-mix"
  | "growth-index";

type EraFilter = "all" | "pre-constellation" | "constellation";
type DensityMetric = "both" | "active" | "debris";

const COLORS = {
  catalog: "#38bdf8",
  active: "#14b8a6",
  debris: "#f97316",
  rocket: "#a855f7",
  inactive: "#64748b",
  accent: "#0ea5e9",
  muted: "#94a3b8",
  grid: "#e2e8f0",
};

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "catalog-path": {
    title: "Catalogue grew — but active sats grew faster",
    subtitle:
      "Stacked catalogued classes (bars) vs objects-per-active-satellite (line) — 2010–2025",
  },
  "altitude-density": {
    title: "Densest LEO shells sit near 500–600 km",
    subtitle:
      "MASTER-aligned density index (peak band = 100) for active payloads vs catalogued debris",
  },
  "regime-ladder": {
    title: "LEO holds the catalogue — crossings hold the debris share",
    subtitle:
      "October 2025 regime snapshot — total catalogued objects by orbital class",
  },
  "band-scatter": {
    title: "Active and debris densities converge in mid-LEO",
    subtitle:
      "Altitude mid-point vs density index — bubble size ≈ estimated catalogued objects",
  },
  "class-mix": {
    title: "End-2024 class mix: fragments still lead, actives close the gap",
    subtitle:
      "ESA-anchored ~40,000 tracked objects — active payloads ~11,000 (~28%)",
  },
  "growth-index": {
    title: "Indexed growth since 2015: actives outrun fragments",
    subtitle:
      "2015 = 100 — constellation era flipped the growth leader from debris to working sats",
  },
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
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function ControlChip({
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

export function CataloguedOrbitalDebrisGrowth2026Dashboard({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const [panel, setPanel] = useState<Panel>("catalog-path");
  const [era, setEra] = useState<EraFilter>("all");
  const [densityMetric, setDensityMetric] = useState<DensityMetric>("both");

  const meta = PANEL_META[panel];

  const pathRows = useMemo(() => {
    if (era === "pre-constellation") {
      return CATALOG_PATH.filter((r) => r.year <= 2018);
    }
    if (era === "constellation") {
      return CATALOG_PATH.filter((r) => r.year >= 2019);
    }
    return CATALOG_PATH;
  }, [era]);

  const growthRows = useMemo(() => {
    if (era === "pre-constellation") {
      return GROWTH_INDEX.filter((r) => r.year <= 2018);
    }
    if (era === "constellation") {
      return GROWTH_INDEX.filter((r) => r.year >= 2019);
    }
    return GROWTH_INDEX;
  }, [era]);

  const scatterRows = useMemo(() => {
    if (densityMetric === "both") return BAND_SCATTER;
    return BAND_SCATTER.filter((r) => r.series === densityMetric);
  }, [densityMetric]);

  const regimeRows = useMemo(
    () => [...REGIME_COMPOSITION].sort((a, b) => b.total - a.total),
    [],
  );

  return (
    <div
      data-viz="catalogued-orbital-debris-growth-2026"
      className={embedded ? "space-y-4" : "mx-auto max-w-5xl space-y-4"}
    >
      <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 px-5 py-5 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-orange-300">
          Technology · Orbital debris catalogue
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          ~{HEADLINE.cataloguedTrackedEnd2024.toLocaleString()} tracked objects ·{" "}
          {HEADLINE.catalogPerActiveEsa}× per active sat
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          ESA end-2024: ~{HEADLINE.cataloguedTrackedEnd2024.toLocaleString()}{" "}
          catalogued tracks vs ~{HEADLINE.activePayloadsEsaEnd2024.toLocaleString()}{" "}
          active payloads. Actives grew faster (~
          {HEADLINE.activeCagr2015to2024Pct}% CAGR) than the full catalogue (~
          {HEADLINE.catalogCagr2015to2024Pct}%), but the densest LEO shells still
          host debris and working sats at the same order of magnitude.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase text-slate-400">Tracked (end-2024)</p>
            <p className="text-lg font-semibold text-sky-300">
              ~{Math.round(HEADLINE.cataloguedTrackedEnd2024 / 1000)}k
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase text-slate-400">Active payloads</p>
            <p className="text-lg font-semibold text-teal-300">
              ~{Math.round(HEADLINE.activePayloadsEsaEnd2024 / 1000)}k
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase text-slate-400">Peak LEO shell</p>
            <p className="text-lg font-semibold text-orange-300">
              {HEADLINE.peakBandKm} km
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase text-slate-400">2024 new fragments</p>
            <p className="text-lg font-semibold">
              +{HEADLINE.newFragments2024.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["catalog-path", "Catalogue path"],
            ["altitude-density", "Altitude density"],
            ["regime-ladder", "Regime ladder"],
            ["band-scatter", "Band scatter"],
            ["class-mix", "Class mix"],
            ["growth-index", "Growth index"],
          ] as const
        ).map(([id, label]) => (
          <ControlChip key={id} active={panel === id} onClick={() => setPanel(id)}>
            {label}
          </ControlChip>
        ))}
      </div>

      {panel === "catalog-path" || panel === "growth-index" ? (
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "Full path"],
              ["pre-constellation", "Pre-constellation ≤2018"],
              ["constellation", "Constellation era ≥2019"],
            ] as const
          ).map(([id, label]) => (
            <ControlChip key={id} active={era === id} onClick={() => setEra(id)}>
              {label}
            </ControlChip>
          ))}
        </div>
      ) : null}

      {panel === "altitude-density" || panel === "band-scatter" ? (
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["both", "Active + debris"],
              ["active", "Active only"],
              ["debris", "Debris only"],
            ] as const
          ).map(([id, label]) => (
            <ControlChip
              key={id}
              active={densityMetric === id}
              onClick={() => setDensityMetric(id)}
            >
              {label}
            </ControlChip>
          ))}
        </div>
      ) : null}

      <ChartCard title={meta.title} subtitle={meta.subtitle}>
        {panel === "catalog-path" ? (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={pathRows} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  label={{
                    value: "Objects",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#94a3b8",
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 20]}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  label={{
                    value: "Per active",
                    angle: 90,
                    position: "insideRight",
                    fill: "#94a3b8",
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="activePayloads"
                  stackId="a"
                  fill={COLORS.active}
                  name="Active payloads"
                />
                <Bar
                  yAxisId="left"
                  dataKey="inactivePayloads"
                  stackId="a"
                  fill={COLORS.inactive}
                  name="Inactive payloads"
                />
                <Bar
                  yAxisId="left"
                  dataKey="debrisFragments"
                  stackId="a"
                  fill={COLORS.debris}
                  name="Fragmentation debris"
                />
                <Bar
                  yAxisId="left"
                  dataKey="rocketBodies"
                  stackId="a"
                  fill={COLORS.rocket}
                  name="Rocket bodies"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="catalogPerActive"
                  stroke={COLORS.catalog}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  name="Catalogued / active"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "altitude-density" ? (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ALTITUDE_BANDS}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="bandKm" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  label={{
                    value: "Density index",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#94a3b8",
                  }}
                />
                <Tooltip />
                <Legend />
                {densityMetric !== "debris" ? (
                  <Bar
                    dataKey="activeDensityIndex"
                    fill={COLORS.active}
                    name="Active density"
                    radius={[4, 4, 0, 0]}
                  />
                ) : null}
                {densityMetric !== "active" ? (
                  <Bar
                    dataKey="debrisDensityIndex"
                    fill={COLORS.debris}
                    name="Debris density"
                    radius={[4, 4, 0, 0]}
                  />
                ) : null}
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "regime-ladder" ? (
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={regimeRows}
                margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="code"
                  width={48}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    typeof value === "number"
                      ? value.toLocaleString()
                      : String(value ?? ""),
                    String(name ?? ""),
                  ]}
                  labelFormatter={(_, payload) =>
                    (payload?.[0]?.payload as { regime?: string } | undefined)
                      ?.regime ?? ""
                  }
                />
                <Legend />
                <Bar
                  dataKey="payloads"
                  stackId="r"
                  fill={COLORS.active}
                  name="Payloads"
                />
                <Bar
                  dataKey="rocketBodies"
                  stackId="r"
                  fill={COLORS.rocket}
                  name="Rocket bodies"
                />
                <Bar
                  dataKey="debrisAndUnidentified"
                  stackId="r"
                  fill={COLORS.debris}
                  name="Debris + unidentified"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "band-scatter" ? (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="midKm"
                  name="Altitude"
                  unit=" km"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  domain={[200, 1800]}
                />
                <YAxis
                  type="number"
                  dataKey="densityIndex"
                  name="Density index"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  domain={[0, 110]}
                />
                <ZAxis type="number" dataKey="objects" range={[60, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => [
                    typeof value === "number"
                      ? value.toLocaleString()
                      : String(value ?? ""),
                    String(name ?? ""),
                  ]}
                />
                <Legend />
                {densityMetric !== "debris" ? (
                  <Scatter
                    name="Active"
                    data={scatterRows.filter((r) => r.series === "active")}
                    fill={COLORS.active}
                  />
                ) : null}
                {densityMetric !== "active" ? (
                  <Scatter
                    name="Debris"
                    data={scatterRows.filter((r) => r.series === "debris")}
                    fill={COLORS.debris}
                  />
                ) : null}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "class-mix" ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[...CLASS_MIX_2024]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {CLASS_MIX_2024.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) =>
                      typeof value === "number"
                        ? value.toLocaleString()
                        : String(value ?? "")
                    }
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center space-y-3">
              <p className="text-sm font-semibold text-slate-800">
                Fragmentation milestones still matter
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                {FRAGMENTATION_MILESTONES.map((f) => (
                  <li
                    key={f.event}
                    className="flex items-baseline justify-between gap-3 border-b border-slate-100 pb-2"
                  >
                    <span>
                      <span className="font-medium text-slate-800">{f.year}</span>{" "}
                      {f.event}
                    </span>
                    <span className="shrink-0 font-mono text-orange-600">
                      +{f.cataloguedFragments.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-slate-500">
                ~{HEADLINE.modelledGt10cm.toLocaleString()}+ objects &gt;10 cm and ~
                {HEADLINE.modelled1to10cmMillions}M in the 1–10 cm class remain
                outside routine catalogue maintenance (ESA MASTER).
              </p>
            </div>
          </div>
        ) : null}

        {panel === "growth-index" ? (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={growthRows}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  label={{
                    value: "Index (2015=100)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#94a3b8",
                  }}
                />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="debrisIndex"
                  fill={COLORS.debris}
                  fillOpacity={0.15}
                  stroke={COLORS.debris}
                  strokeWidth={2}
                  name="Debris fragments"
                />
                <Line
                  type="monotone"
                  dataKey="catalogIndex"
                  stroke={COLORS.catalog}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  name="Full catalogue"
                />
                <Line
                  type="monotone"
                  dataKey="activeIndex"
                  stroke={COLORS.active}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  name="Active payloads"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </ChartCard>

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
