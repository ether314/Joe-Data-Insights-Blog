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
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  CAPACITY_SCATTER,
  HEADLINE,
  SOURCE_NOTE,
  collectionComposed,
  dependencyScatter,
  euDeficitSeries,
  euOriginPie,
  fmtLitersM,
  fmtPct,
  intensityBars,
  regionHhi,
  regionPie,
} from "@/data/us-share-of-global-source-plasma-2026-data";

// viz-types: region donut, EU origin pie, collection area+line compose, intensity bars, dependency scatter, deficit area, capacity bubble | layout: default

type ViewId = "global" | "eu" | "intensity" | "capacity";
type IntensityFilter = "all" | "EU" | "compensated" | "vnr";
type PathMetric = "liters" | "share" | "centers";

const US = "#0f766e";
const EU = "#0369a1";
const MUTED = "#94a3b8";
const WARN = "#b45309";
const PIE_COLORS = ["#0f766e", "#0369a1", "#64748b", "#7c3aed", "#b45309", "#be123c"];

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
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
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

export function UsShareOfGlobalSourcePlasma2026Dashboard() {
  const [view, setView] = useState<ViewId>("global");
  const [intensityFilter, setIntensityFilter] =
    useState<IntensityFilter>("all");
  const [pathMetric, setPathMetric] = useState<PathMetric>("liters");
  const [showWorld, setShowWorld] = useState(true);

  const regions = useMemo(() => regionPie(), []);
  const euOrigin = useMemo(() => euOriginPie(), []);
  const path = useMemo(() => collectionComposed(), []);
  const intensity = useMemo(
    () => intensityBars(intensityFilter),
    [intensityFilter],
  );
  const dependency = useMemo(() => dependencyScatter(), []);
  const deficit = useMemo(() => euDeficitSeries(), []);
  const hhi = useMemo(() => regionHhi(), []);

  return (
    <div
      className="space-y-6"
      data-viz="us-share-of-global-source-plasma-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
          Source plasma · fractionation feedstock
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          US collects ~{fmtPct(HEADLINE.usGlobalSharePct, 0)} of global source
          plasma
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          Roughly {fmtLitersM(HEADLINE.usLiters2025M)} of US source plasma in
          2025 sits inside a ~{fmtLitersM(HEADLINE.worldLiters2025M, 0)} world
          pool. EU PDMP manufacturing still draws ~{fmtPct(HEADLINE.euUsImportSharePct, 0)}{" "}
          of its plasma from US donors — the same share as the entire EU-4
          commercial bloc.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "US global share",
              value: fmtPct(HEADLINE.usGlobalSharePct, 0),
            },
            {
              label: "US liters (2025)",
              value: fmtLitersM(HEADLINE.usLiters2025M),
            },
            {
              label: "EU feedstock from US",
              value: fmtPct(HEADLINE.euUsImportSharePct, 0),
            },
            {
              label: "US centers",
              value: HEADLINE.usCenters2025.toLocaleString(),
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-0.5 text-lg font-bold text-white">{k.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "global", label: "Global share" },
            { id: "eu", label: "EU dependence" },
            { id: "intensity", label: "Intensity" },
            { id: "capacity", label: "Capacity" },
          ]}
        />
        {view === "global" && (
          <ToggleGroup
            label="Path"
            value={pathMetric}
            onChange={setPathMetric}
            options={[
              { id: "liters", label: "Liters" },
              { id: "share", label: "US share %" },
              { id: "centers", label: "Centers" },
            ]}
          />
        )}
        {view === "global" && (
          <ToggleGroup
            label="World line"
            value={showWorld ? "on" : "off"}
            onChange={(v) => setShowWorld(v === "on")}
            options={[
              { id: "on", label: "Show world" },
              { id: "off", label: "US only" },
            ]}
          />
        )}
        {view === "intensity" && (
          <ToggleGroup
            label="Filter"
            value={intensityFilter}
            onChange={setIntensityFilter}
            options={[
              { id: "all", label: "All" },
              { id: "EU", label: "EU + US" },
              { id: "compensated", label: "Compensated" },
              { id: "vnr", label: "VNRD only" },
            ]}
          />
        )}
      </div>

      {view === "global" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Regional share of global source plasma"
            subtitle={`Desk buckets · analytical HHI ${hhi.toLocaleString()} (0–10,000)`}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regions}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {regions.map((_, i) => (
                      <Cell
                        key={i}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => fmtPct(Number(v), 0)}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="US collections vs world pool"
            subtitle="2017–2025 · liters and share path (estimated)"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={path}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11 }}
                    label={{
                      value:
                        pathMetric === "centers"
                          ? "Centers"
                          : pathMetric === "share"
                            ? "Share %"
                            : "Million L",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 11 },
                    }}
                  />
                  {pathMetric === "liters" && showWorld && (
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 11 }}
                      hide
                    />
                  )}
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  {pathMetric === "liters" && (
                    <>
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="usLitersM"
                        name="US liters (M)"
                        fill={US}
                        fillOpacity={0.25}
                        stroke={US}
                        strokeWidth={2}
                      />
                      {showWorld && (
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="worldLitersM"
                          name="World liters (M)"
                          stroke={MUTED}
                          strokeWidth={2}
                          dot={false}
                        />
                      )}
                    </>
                  )}
                  {pathMetric === "share" && (
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="usSharePct"
                      name="US share %"
                      fill={US}
                      fillOpacity={0.3}
                      stroke={US}
                      strokeWidth={2}
                    />
                  )}
                  {pathMetric === "centers" && (
                    <Bar
                      yAxisId="left"
                      dataKey="usCenters"
                      name="US centers"
                      fill={US}
                      radius={[4, 4, 0, 0]}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "eu" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Where EU PDMP plasma comes from"
            subtitle="PPTA / industry framing · US imports ≈ EU-4 commercial bloc"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={euOrigin}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={98}
                    paddingAngle={3}
                    label={({ percent }) =>
                      `${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    <Cell fill={EU} />
                    <Cell fill={US} />
                    <Cell fill={MUTED} />
                  </Pie>
                  <Tooltip
                    formatter={(v) => fmtPct(Number(v), 0)}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="EU structural deficit vs US cover share"
            subtitle="Liters short of Ig self-sufficiency framing · US cover ~38%"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={deficit}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="l"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Deficit M L",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 11 },
                    }}
                  />
                  <YAxis
                    yAxisId="r"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    domain={[0, 50]}
                    label={{
                      value: "US cover %",
                      angle: 90,
                      position: "insideRight",
                      style: { fontSize: 11 },
                    }}
                  />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area
                    yAxisId="l"
                    type="monotone"
                    dataKey="deficitML"
                    name="EU deficit (M L)"
                    fill={WARN}
                    fillOpacity={0.3}
                    stroke={WARN}
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="r"
                    type="monotone"
                    dataKey="usCoverSharePct"
                    name="US cover share %"
                    stroke={US}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "intensity" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Liters collected per 1,000 residents"
            subtitle="Anchor rates ~2017–2019 · compensated systems pull ahead"
          >
            <div className="h-[28rem]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={intensity} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="litersPer1k" name="L / 1,000" radius={[0, 4, 4, 0]}>
                    {intensity.map((r, i) => (
                      <Cell key={i} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Self-reliance vs US import share"
            subtitle="Immunoglobulin / PDMP feedstock framing by country"
          >
            <div className="h-[28rem]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 12, bottom: 12, left: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Self-reliance %"
                    domain={[0, 110]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Domestic self-reliance %",
                      position: "insideBottom",
                      offset: -4,
                      style: { fontSize: 11 },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="US import %"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "US import share %",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 11 },
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    contentStyle={{ fontSize: 12 }}
                    formatter={(v, name) => [
                      `${Number(v).toFixed(0)}%`,
                      name === "x" ? "Self-reliance" : name === "y" ? "US import" : String(name),
                    ]}
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.name ?? "")
                    }
                  />
                  <Scatter data={dependency} fill={EU}>
                    {dependency.map((d, i) => (
                      <Cell
                        key={i}
                        fill={d.name === "United States" ? US : EU}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "capacity" && (
        <div className="grid gap-6">
          <ChartCard
            title="Center fleets vs collection intensity"
            subtitle="Bubble size ≈ inverse self-reliance pressure · US outlier on both axes"
          >
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 16, right: 24, bottom: 16, left: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="centers"
                    name="Centers"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Collection centers (approx.)",
                      position: "insideBottom",
                      offset: -2,
                      style: { fontSize: 11 },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="litersPer1k"
                    name="L/1k"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "L / 1,000 residents",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 11 },
                    }}
                  />
                  <ZAxis
                    type="number"
                    dataKey="shareOfGlobalPct"
                    range={[80, 400]}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    contentStyle={{ fontSize: 12 }}
                    formatter={(v, name) => {
                      if (name === "centers") return [Number(v).toLocaleString(), "Centers"];
                      if (name === "litersPer1k") return [Number(v), "L / 1,000"];
                      if (name === "shareOfGlobalPct") return [fmtPct(Number(v), 1), "Global share"];
                      return [String(v), String(name)];
                    }}
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.label ?? "")
                    }
                  />
                  <Scatter data={CAPACITY_SCATTER}>
                    {CAPACITY_SCATTER.map((d, i) => (
                      <Cell
                        key={i}
                        fill={d.compensated ? US : MUTED}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
