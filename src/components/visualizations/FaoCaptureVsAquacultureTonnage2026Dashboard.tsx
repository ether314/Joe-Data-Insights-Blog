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
  AQUA_GROWTH_MIX,
  COLORS,
  HEADLINE,
  REGION_AQUA_SHARE_PATH,
  REGION_ROWS,
  SOURCE_NOTE,
  WORLD_AQUA_SHARE_PATH,
  aquaShareCompare,
  fmtMt,
  fmtPct,
  habitatStacked,
  producerScatter,
  regimeLabel,
  stackedRegionBars,
  type RegionId,
} from "@/data/fao-capture-vs-aquaculture-tonnage-2026-data";

// viz-types: stacked capture|aqua bars, world share area+line, region share multi-line, habitat stacked, producer scatter, growth pie, 2022→2032 delta bars | layout: default

type ViewId = "regions" | "paths" | "habitat" | "producers";
type UnitLens = "tonnes" | "share";
type PathLens = "world" | "continents";
type RegionFilter = "all" | RegionId;

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
      <div className="flex flex-wrap gap-1">
        {options.map((o) => {
          const active = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MeterStrip() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[
        {
          k: "World aqua share",
          v: fmtPct(HEADLINE.worldAquaSharePct),
          s: `${fmtMt(HEADLINE.worldAquaMt)} farmed vs ${fmtMt(HEADLINE.worldCaptureMt)} wild`,
        },
        {
          k: "Edible aqua share",
          v: fmtPct(HEADLINE.edibleAquaSharePct),
          s: "Of volume destined for human food",
        },
        {
          k: "Asia aqua share",
          v: fmtPct(HEADLINE.asiaAquaSharePct),
          s: "Only aqua-majority continent",
        },
        {
          k: "N. America aqua share",
          v: fmtPct(HEADLINE.northernAmericaAquaSharePct),
          s: "Lowest major-region farm share",
        },
      ].map((m) => (
        <div
          key={m.k}
          className="rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-cyan-50/40 px-4 py-3"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {m.k}
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
            {m.v}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">{m.s}</p>
        </div>
      ))}
    </div>
  );
}

export function FaoCaptureVsAquacultureTonnage2026Dashboard() {
  const [view, setView] = useState<ViewId>("regions");
  const [unit, setUnit] = useState<UnitLens>("tonnes");
  const [pathLens, setPathLens] = useState<PathLens>("world");
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all");

  const regionBars = useMemo(() => {
    const rows =
      regionFilter === "all"
        ? REGION_ROWS
        : REGION_ROWS.filter((r) => r.id === regionFilter);
    return stackedRegionBars(rows);
  }, [regionFilter]);

  const shareCompare = useMemo(
    () => aquaShareCompare(REGION_ROWS, true),
    [],
  );

  const habitat = useMemo(() => habitatStacked(), []);
  const scatter = useMemo(() => producerScatter(), []);
  const growthPie = useMemo(
    () =>
      AQUA_GROWTH_MIX.map((s) => ({
        name: s.label,
        value: s.shareOfAquaGrowthPct,
        fill: s.fill,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="fao-capture-vs-aquaculture-tonnage-2026"
    >
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700">
          Capture fisheries · FAO SOFIA 2024
        </p>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          FAO capture vs aquaculture tonnage
        </h2>
        <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
          Where wild capture still dominates edible aquatic-animal supply — and
          where aquaculture has already taken the majority. World farm share
          crossed {fmtPct(HEADLINE.worldAquaSharePct)} in{" "}
          {HEADLINE.crossoverYear}; Asia alone sits at{" "}
          {fmtPct(HEADLINE.asiaAquaSharePct)}.
        </p>
      </header>

      <MeterStrip />

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "regions", label: "Regions" },
            { id: "paths", label: "Share paths" },
            { id: "habitat", label: "Habitat" },
            { id: "producers", label: "Producers" },
          ]}
        />
        {view === "regions" && (
          <>
            <ToggleGroup
              label="Units"
              value={unit}
              onChange={setUnit}
              options={[
                { id: "tonnes", label: "Million tonnes" },
                { id: "share", label: "Aqua share %" },
              ]}
            />
            <ToggleGroup
              label="Region"
              value={regionFilter}
              onChange={setRegionFilter}
              options={[
                { id: "all", label: "All" },
                { id: "asia", label: "Asia" },
                { id: "africa", label: "Africa" },
                { id: "europe", label: "Europe" },
                { id: "lac", label: "LAC" },
                { id: "northern-america", label: "N. America" },
                { id: "oceania", label: "Oceania" },
              ]}
            />
          </>
        )}
        {view === "paths" && (
          <ToggleGroup
            label="Path"
            value={pathLens}
            onChange={setPathLens}
            options={[
              { id: "world", label: "World path" },
              { id: "continents", label: "By continent" },
            ]}
          />
        )}
      </div>

      {view === "regions" && unit === "tonnes" && (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ChartCard
              title="Capture vs aquaculture by region"
              subtitle="2022 aquatic animals, live-weight Mt · stacked"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionBars} margin={{ left: 8, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      label={{
                        value: "Mt",
                        angle: -90,
                        position: "insideLeft",
                        style: { fontSize: 11, fill: "#64748b" },
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="captureMt"
                      name="Capture"
                      stackId="a"
                      fill={COLORS.capture}
                    />
                    <Bar
                      dataKey="aquaMt"
                      name="Aquaculture"
                      stackId="a"
                      fill={COLORS.aqua}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
          <div className="lg:col-span-2">
          <ChartCard
            title="Regime map"
            subtitle="Majority source of regional tonnage"
          >
            <ul className="space-y-3">
              {(regionFilter === "all"
                ? REGION_ROWS
                : REGION_ROWS.filter((r) => r.id === regionFilter)
              ).map((r) => (
                <li
                  key={r.id}
                  className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2 last:border-0"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{r.label}</p>
                    <p className="text-xs text-slate-500">
                      {regimeLabel(r.regime)} · {fmtMt(r.totalMt)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-md px-2 py-1 text-xs font-bold tabular-nums ${
                      r.regime === "aqua-majority"
                        ? "bg-cyan-100 text-cyan-900"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {fmtPct(r.aquaSharePct)} aqua
                  </span>
                </li>
              ))}
            </ul>
          </ChartCard>
          </div>
        </div>
      )}

      {view === "regions" && unit === "share" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Aquaculture share of production"
            subtitle="2022 vs FAO 2032 outlook (percentage points)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={shareCompare} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 80]}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="aquaShare2022"
                    name="2022"
                    fill={COLORS.aqua}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="aquaShare2032"
                    name="2032 outlook"
                    stroke={COLORS.capture}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="2022 → 2032 delta"
            subtitle="Percentage-point change in aquaculture share"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={shareCompare}
                  layout="vertical"
                  margin={{ left: 72, right: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} unit=" pp" />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={68}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar dataKey="deltaPp" name="Δ pp" radius={[0, 4, 4, 0]}>
                    {shareCompare.map((d) => (
                      <Cell
                        key={d.id}
                        fill={d.deltaPp > 0 ? COLORS.aqua : "#94a3b8"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "paths" && pathLens === "world" && (
        <ChartCard
          title="World aquaculture share path"
          subtitle="SOFIA milestones · 1950–2032 (projected after 2022)"
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={WORLD_AQUA_SHARE_PATH}
                margin={{ left: 8, right: 16, top: 8 }}
              >
                <defs>
                  <linearGradient id="aquaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.aqua} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={COLORS.aqua} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  domain={[0, 60]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="aquaSharePct"
                  name="Aqua share %"
                  stroke={COLORS.aqua}
                  fill="url(#aquaFill)"
                  strokeWidth={2.5}
                />
                <Line
                  type="monotone"
                  dataKey="aquaSharePct"
                  stroke="transparent"
                  legendType="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Horizontal reference: 50% majority line crossed in{" "}
            {HEADLINE.crossoverYear}. 2032 point is FAO outlook (
            {fmtPct(HEADLINE.outlook2032AquaSharePct)}).
          </p>
        </ChartCard>
      )}

      {view === "paths" && pathLens === "continents" && (
        <ChartCard
          title="Aquaculture share by continent"
          subtitle="2000 → 2010 → 2022 → 2032 outlook"
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChartCompat data={REGION_AQUA_SHARE_PATH} />
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "habitat" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Marine vs inland ledgers"
            subtitle="Where capture still rules the water column"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={habitat} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="captureMt"
                    name="Capture Mt"
                    stackId="h"
                    fill={COLORS.capture}
                  />
                  <Bar
                    dataKey="aquaMt"
                    name="Aquaculture Mt"
                    stackId="h"
                    fill={COLORS.aqua}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="What drove recent aqua growth"
            subtitle="Share of 2020→2022 farmed-animal increase by group"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={growthPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {growthPie.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "producers" && (
        <ChartCard
          title="Producer map: world share × aquaculture share"
          subtitle="Bubble size ≈ world tonnage share · top producers"
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="worldSharePct"
                  name="World share"
                  unit="%"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Share of world aquatic animals (%)",
                    position: "insideBottom",
                    offset: -2,
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="aquaSharePct"
                  name="Aqua share"
                  unit="%"
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Aquaculture share of national output (%)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Producers" data={scatter}>
                  {scatter.map((d) => (
                    <Cell key={d.id} fill={d.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {scatter.map((d) => (
              <li
                key={d.id}
                className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700"
              >
                <span
                  className="mr-1.5 inline-block h-2 w-2 rounded-full"
                  style={{ background: d.fill }}
                />
                {d.country}: {fmtPct(d.aquaSharePct)} aqua ·{" "}
                {fmtPct(d.worldSharePct, 1)} world
              </li>
            ))}
          </ul>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}

function LineChartCompat({
  data,
}: {
  data: typeof REGION_AQUA_SHARE_PATH;
}) {
  return (
    <ComposedChart data={data} margin={{ left: 8, right: 16 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
      <XAxis dataKey="year" tick={{ fontSize: 12 }} />
      <YAxis
        domain={[0, 80]}
        tick={{ fontSize: 12 }}
        tickFormatter={(v) => `${v}%`}
      />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="asia"
        name="Asia"
        stroke={COLORS.asia}
        strokeWidth={2.5}
        dot={{ r: 3 }}
      />
      <Line
        type="monotone"
        dataKey="lac"
        name="LAC"
        stroke={COLORS.lac}
        strokeWidth={2}
        dot={{ r: 3 }}
      />
      <Line
        type="monotone"
        dataKey="europe"
        name="Europe"
        stroke={COLORS.europe}
        strokeWidth={2}
        dot={{ r: 3 }}
      />
      <Line
        type="monotone"
        dataKey="africa"
        name="Africa"
        stroke={COLORS.africa}
        strokeWidth={2}
        dot={{ r: 3 }}
      />
      <Line
        type="monotone"
        dataKey="oceania"
        name="Oceania"
        stroke={COLORS.oceania}
        strokeWidth={2}
        dot={{ r: 3 }}
      />
      <Line
        type="monotone"
        dataKey="northernAmerica"
        name="N. America"
        stroke={COLORS.northernAmerica}
        strokeWidth={2}
        strokeDasharray="4 4"
        dot={{ r: 3 }}
      />
    </ComposedChart>
  );
}
