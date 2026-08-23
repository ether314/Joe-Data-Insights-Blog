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
  ANALYTICS,
  ANNUAL_CADENCE,
  BLOC_MIX,
  HEADLINE,
  MASS_VS_CADENCE,
  OPERATOR_2025,
  OPERATOR_DELTA,
  SOURCE_NOTE,
  US_OPERATOR_MIX_2025,
  type OperatorRow,
} from "@/data/orbital-launch-cadence-by-operator-2026-data";

type Panel =
  | "share-path"
  | "operator-ladder"
  | "five-year-delta"
  | "mass-scatter"
  | "bloc-stack"
  | "us-mix";

type RegionFilter = "all" | "US" | "China" | "Russia" | "Europe" | "Other";
type DeltaMetric = "launches" | "share";

const COLORS = {
  spacex: "#38bdf8",
  china: "#f97316",
  russia: "#a855f7",
  rocketLab: "#14b8a6",
  rest: "#64748b",
  mass: "#eab308",
  accent: "#0ea5e9",
  muted: "#94a3b8",
  grid: "#e2e8f0",
  positive: "#0d9488",
  negative: "#c2410c",
};

const REGION_COLORS: Record<string, string> = {
  US: COLORS.spacex,
  China: COLORS.china,
  Russia: COLORS.russia,
  Europe: "#6366f1",
  Other: COLORS.rest,
};

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "share-path": {
    title: "Single-operator share crossed half the world manifest",
    subtitle:
      "SpaceX launch count (bars) vs worldwide share (line) — 2020–2025 orbital attempts",
  },
  "operator-ladder": {
    title: "2025 operator ladder",
    subtitle:
      "Orbital attempts by operator — SpaceX alone matches the rest of the planet combined",
  },
  "five-year-delta": {
    title: "Who gained and lost share, 2020 → 2025",
    subtitle:
      "Absolute launches rose for China and Rocket Lab, but share compressed under SpaceX’s cadence",
  },
  "mass-scatter": {
    title: "Cadence share vs mass-to-orbit share",
    subtitle:
      "Bubble size = 2025 launches — Starlink-heavy flights push SpaceX’s mass share well above its count share",
  },
  "bloc-stack": {
    title: "World cadence by operator bloc",
    subtitle: "Stacked orbital attempts — growth is concentrated, not evenly shared",
  },
  "us-mix": {
    title: "Inside the U.S. operator stack",
    subtitle:
      "SpaceX is ~86% of U.S.-counted orbital flights in 2025 (Rocket Lab includes Mahia)",
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

function filterOperators(region: RegionFilter): OperatorRow[] {
  const base =
    region === "all"
      ? OPERATOR_2025
      : OPERATOR_2025.filter((o) => o.region === region);
  return [...base].sort((a, b) => b.launches - a.launches);
}

export function OrbitalLaunchCadenceByOperator2026Dashboard({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const [panel, setPanel] = useState<Panel>("share-path");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [deltaMetric, setDeltaMetric] = useState<DeltaMetric>("share");

  const ladderRows = useMemo(() => filterOperators(region), [region]);
  const meta = PANEL_META[panel];

  const deltaChart = useMemo(() => {
    return OPERATOR_DELTA.map((d) => ({
      short: d.short,
      value2020: deltaMetric === "share" ? d.share2020Pct : d.launches2020,
      value2025: deltaMetric === "share" ? d.share2025Pct : d.launches2025,
      deltaPp: d.deltaPp,
    }));
  }, [deltaMetric]);

  return (
    <div
      data-viz="orbital-launch-cadence-by-operator-2026"
      className={embedded ? "space-y-4" : "mx-auto max-w-5xl space-y-4"}
    >
      <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 px-5 py-5 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
          Technology · Orbital launches & debris
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Operator launch share · {HEADLINE.spacexShare2025Pct}% in 2025
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          SpaceX flew {HEADLINE.spacexLaunches2025} of {HEADLINE.worldLaunches2025}{" "}
          worldwide orbital launches ({HEADLINE.spacexShare2025Pct}%), up from{" "}
          {HEADLINE.spacexShare2020Pct}% in 2020 — a {HEADLINE.shareDeltaPp} pp
          single-operator jump while world cadence rose{" "}
          {ANALYTICS.worldGrowthMultiple}×.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase text-slate-400">2025 share</p>
            <p className="text-lg font-semibold text-sky-300">
              {HEADLINE.spacexShare2025Pct}%
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase text-slate-400">2020 share</p>
            <p className="text-lg font-semibold">{HEADLINE.spacexShare2020Pct}%</p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase text-slate-400">Mass-to-orbit</p>
            <p className="text-lg font-semibold text-amber-300">
              ~{HEADLINE.spacexMassShare2025Pct}%
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase text-slate-400">Days / flight</p>
            <p className="text-lg font-semibold">
              {ANALYTICS.cadenceDaysPerLaunch2025}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["share-path", "Share path"],
            ["operator-ladder", "Operator ladder"],
            ["five-year-delta", "Five-year delta"],
            ["mass-scatter", "Mass vs cadence"],
            ["bloc-stack", "Bloc stack"],
            ["us-mix", "U.S. mix"],
          ] as const
        ).map(([id, label]) => (
          <ControlChip key={id} active={panel === id} onClick={() => setPanel(id)}>
            {label}
          </ControlChip>
        ))}
      </div>

      {panel === "operator-ladder" ? (
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "All regions"],
              ["US", "Region: U.S."],
              ["China", "Region: China"],
              ["Russia", "Region: Russia"],
              ["Europe", "Region: Europe"],
              ["Other", "Region: Other"],
            ] as const
          ).map(([id, label]) => (
            <ControlChip
              key={id}
              active={region === id}
              onClick={() => setRegion(id)}
            >
              {label}
            </ControlChip>
          ))}
        </div>
      ) : null}

      {panel === "five-year-delta" ? (
        <div className="flex flex-wrap gap-2">
          <ControlChip
            active={deltaMetric === "share"}
            onClick={() => setDeltaMetric("share")}
          >
            Share %
          </ControlChip>
          <ControlChip
            active={deltaMetric === "launches"}
            onClick={() => setDeltaMetric("launches")}
          >
            Launch count
          </ControlChip>
        </div>
      ) : null}

      <ChartCard title={meta.title} subtitle={meta.subtitle}>
        {panel === "share-path" ? (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={ANNUAL_CADENCE} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  label={{ value: "Launches", angle: -90, position: "insideLeft", fill: "#94a3b8" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 60]}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  label={{ value: "Share %", angle: 90, position: "insideRight", fill: "#94a3b8" }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="spacex"
                  name="SpaceX launches"
                  fill={COLORS.spacex}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="spacexSharePct"
                  name="SpaceX share %"
                  stroke={COLORS.accent}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "operator-ladder" ? (
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={ladderRows}
                margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={100}
                  tick={{ fill: "#334155", fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    name === "launches" ? `${value} launches` : `${value}%`,
                    name === "launches" ? "Launches" : "Share",
                  ]}
                />
                <Bar dataKey="launches" name="launches" radius={[0, 4, 4, 0]}>
                  {ladderRows.map((row) => (
                    <Cell
                      key={row.short}
                      fill={REGION_COLORS[row.region] ?? COLORS.rest}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "five-year-delta" ? (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deltaChart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="short" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="value2020"
                  name={deltaMetric === "share" ? "2020 share %" : "2020 launches"}
                  fill={COLORS.muted}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="value2025"
                  name={deltaMetric === "share" ? "2025 share %" : "2025 launches"}
                  fill={COLORS.spacex}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "mass-scatter" ? (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 12, left: 8, bottom: 12 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="launchSharePct"
                  name="Launch share %"
                  domain={[0, 60]}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  label={{
                    value: "Launch-count share %",
                    position: "insideBottom",
                    offset: -4,
                    fill: "#94a3b8",
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="massSharePct"
                  name="Mass share %"
                  domain={[0, 90]}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  label={{
                    value: "Mass-to-orbit share %",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#94a3b8",
                  }}
                />
                <ZAxis type="number" dataKey="launches" range={[80, 600]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={MASS_VS_CADENCE} fill={COLORS.mass}>
                  {MASS_VS_CADENCE.map((row) => (
                    <Cell
                      key={row.short}
                      fill={row.short === "SpaceX" ? COLORS.spacex : COLORS.china}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <p className="mt-2 text-center text-xs text-slate-500">
              Labels: {MASS_VS_CADENCE.map((r) => r.short).join(" · ")}
            </p>
          </div>
        ) : null}

        {panel === "bloc-stack" ? (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={BLOC_MIX} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="spacex"
                  stackId="1"
                  name="SpaceX"
                  fill={COLORS.spacex}
                  stroke={COLORS.spacex}
                />
                <Area
                  type="monotone"
                  dataKey="china"
                  stackId="1"
                  name="China"
                  fill={COLORS.china}
                  stroke={COLORS.china}
                />
                <Area
                  type="monotone"
                  dataKey="russia"
                  stackId="1"
                  name="Russia"
                  fill={COLORS.russia}
                  stroke={COLORS.russia}
                />
                <Area
                  type="monotone"
                  dataKey="rocketLab"
                  stackId="1"
                  name="Rocket Lab"
                  fill={COLORS.rocketLab}
                  stroke={COLORS.rocketLab}
                />
                <Area
                  type="monotone"
                  dataKey="rest"
                  stackId="1"
                  name="Rest of world"
                  fill={COLORS.rest}
                  stroke={COLORS.rest}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "us-mix" ? (
          <div className="flex h-[360px] w-full flex-col items-center gap-4 sm:flex-row">
            <div className="h-full w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={US_OPERATOR_MIX_2025}
                    dataKey="launches"
                    nameKey="operator"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={(props) => {
                      const name = String(props.name ?? "");
                      const pct = US_OPERATOR_MIX_2025.find(
                        (r) => r.operator === name,
                      )?.usSharePct;
                      return `${name.split(" ")[0]}${pct != null ? ` ${pct}%` : ""}`;
                    }}
                  >
                    {US_OPERATOR_MIX_2025.map((row, i) => (
                      <Cell
                        key={row.operator}
                        fill={
                          [
                            COLORS.spacex,
                            COLORS.rocketLab,
                            "#6366f1",
                            "#eab308",
                            COLORS.rest,
                          ][i] ?? COLORS.rest
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="w-full space-y-2 text-sm text-slate-700 sm:w-1/2">
              {US_OPERATOR_MIX_2025.map((row) => (
                <li
                  key={row.operator}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
                >
                  <span>{row.operator}</span>
                  <span className="font-semibold tabular-nums">
                    {row.launches} · {row.usSharePct}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </ChartCard>

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
