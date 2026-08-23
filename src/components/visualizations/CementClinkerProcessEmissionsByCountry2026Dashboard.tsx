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
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  CLINKER_RATIO_PATH,
  HEADLINE,
  INTENSITY_VS_VOLUME,
  REGION_PROCESS,
  SHARE_LADDER,
  SOURCE_NOTE,
  fmtMt,
  fmtPct,
  processHhi,
  rankedCountries,
  scatterPoints,
  type RankLens,
  type RegionFilter,
} from "@/data/cement-clinker-process-emissions-by-country-2026-data";

// viz-types: process rank bars, share ladder bars, intensity-vs-volume composed, region donut, process-intensity scatter, clinker-ratio line | layout: default

type ViewId = "rank" | "swamp" | "regions" | "scatter";

const CLINKER = "#c2410c";
const NAVY = "#0f172a";
const TEAL = "#0f766e";
const SLATE = "#64748b";
const AMBER = "#d97706";
const PIE_COLORS = ["#c2410c", "#0f766e", "#0369a1", "#64748b"];

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

export function CementClinkerProcessEmissionsByCountry2026Dashboard() {
  const [view, setView] = useState<ViewId>("rank");
  const [lens, setLens] = useState<RankLens>("process");
  const [region, setRegion] = useState<RegionFilter>("all");

  const ranked = useMemo(() => rankedCountries(lens, region), [lens, region]);
  const barData = useMemo(
    () =>
      ranked.slice(0, 12).map((r) => ({
        name: r.label,
        value:
          lens === "process"
            ? r.processMt
            : lens === "cement"
              ? r.cementMt
              : r.intensityKgPerTCement,
        fill: r.id === "china" || r.id === "india" || r.id === "vietnam" ? CLINKER : TEAL,
      })),
    [ranked, lens],
  );

  const scatter = useMemo(() => scatterPoints(), []);
  const hhi = processHhi();
  const yLabel =
    lens === "process"
      ? "Process CO₂ (Mt)"
      : lens === "cement"
        ? "Cement (Mt)"
        : "kg CO₂ / t cement (process)";

  return (
    <div
      className="space-y-6"
      data-viz="cement-clinker-process-emissions-by-country-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-200/90">
          Heavy materials · clinker process CO₂
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Top-3 process CO₂ share: {fmtPct(HEADLINE.top3SharePct)}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
          China, India, and Vietnam — the USGS-order top cement producers —
          hold about {fmtMt(HEADLINE.top3ProcessMt)} of an estimated{" "}
          {fmtMt(HEADLINE.globalProcessMt)} global calcination CO₂ in 2023e (
          {fmtPct(HEADLINE.top3SharePct)}). GCCA GNR intensity is down ~
          {HEADLINE.gccaIntensityCutPctSince1990}% since 1990, but cement
          volume still swamps the absolute process ledger outside China’s
          recent property-led cutback.
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <dt className="text-[11px] uppercase tracking-wide text-slate-300">
              China process
            </dt>
            <dd className="text-lg font-semibold">{fmtMt(HEADLINE.chinaProcessMt)}</dd>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <dt className="text-[11px] uppercase tracking-wide text-slate-300">
              Top-3 share
            </dt>
            <dd className="text-lg font-semibold">{fmtPct(HEADLINE.top3SharePct)}</dd>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <dt className="text-[11px] uppercase tracking-wide text-slate-300">
              Intensity vs 1990
            </dt>
            <dd className="text-lg font-semibold">
              −{HEADLINE.gccaIntensityCutPctSince1990}%
            </dd>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <dt className="text-[11px] uppercase tracking-wide text-slate-300">
              Process HHI
            </dt>
            <dd className="text-lg font-semibold">{hhi}</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup<ViewId>
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "rank", label: "Rank & ladder" },
            { id: "swamp", label: "Intensity vs volume" },
            { id: "regions", label: "Regions" },
            { id: "scatter", label: "Scatter" },
          ]}
        />
        {view === "rank" && (
          <>
            <ToggleGroup<RankLens>
              label="Rank by"
              value={lens}
              onChange={setLens}
              options={[
                { id: "process", label: "Process Mt" },
                { id: "cement", label: "Cement Mt" },
                { id: "intensity", label: "Intensity" },
              ]}
            />
            <ToggleGroup<RegionFilter>
              label="Region"
              value={region}
              onChange={setRegion}
              options={[
                { id: "all", label: "All" },
                { id: "asia", label: "Asia" },
                { id: "emea", label: "EMEA" },
                { id: "americas", label: "Americas" },
              ]}
            />
          </>
        )}
      </div>

      {view === "rank" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Country ranking"
            subtitle={`${yLabel} · top-3 producers highlighted`}
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={barData}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={88}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" name={yLabel} radius={[0, 4, 4, 0]}>
                    {barData.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Concentration ladder"
            subtitle="Cumulative share of global process CO₂"
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...SHARE_LADDER]}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    unit="%"
                  />
                  <Tooltip />
                  <Bar
                    dataKey="sharePct"
                    name="Share %"
                    fill={NAVY}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "swamp" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Did intensity fall — or did volume swamp it?"
            subtitle="Indices, 1990 = 100 · GCCA-style intensity vs USGS-order volume"
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={[...INTENSITY_VS_VOLUME]}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="volumeIndex"
                    name="Cement volume index"
                    fill={AMBER}
                    fillOpacity={0.25}
                    stroke={AMBER}
                  />
                  <Line
                    type="monotone"
                    dataKey="intensityIndex"
                    name="CO₂ intensity index"
                    stroke={TEAL}
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="processMtIndex"
                    name="Process Mt index"
                    stroke={CLINKER}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Clinker-to-cementitious path"
            subtitle="GCCA GNR-style ratio · ~10.7% relative improvement vs 1990"
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={[...CLINKER_RATIO_PATH]}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[70, 86]}
                    tick={{ fontSize: 11 }}
                    unit="%"
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="ratioPct"
                    name="Clinker ratio %"
                    fill={TEAL}
                    fillOpacity={0.2}
                    stroke={TEAL}
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "regions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Regional process CO₂"
            subtitle="Asia-Pacific holds ~two-thirds of calcination emissions"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[...REGION_PROCESS]}
                    dataKey="processMt"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {REGION_PROCESS.map((r, i) => (
                      <Cell
                        key={r.id}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Region Mt bars"
            subtitle="Same ledger as the donut — absolute process tonnes"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...REGION_PROCESS]}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="processMt" name="Process Mt" radius={[4, 4, 0, 0]}>
                    {REGION_PROCESS.map((r, i) => (
                      <Cell
                        key={r.id}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Process tonnes vs process intensity"
          subtitle="Bubble size ≈ cement Mt · Vietnam sits with mid-pack intensity but top-3 producer volume"
        >
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 20, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="processMt"
                  name="Process Mt"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Process CO₂ (Mt)",
                    position: "insideBottom",
                    offset: -4,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="intensityKgPerTCement"
                  name="Intensity"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "kg CO₂ / t cement",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="cementMt" range={[60, 400]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Producers" data={scatter} fill={CLINKER}>
                  {scatter.map((p) => (
                    <Cell
                      key={p.id}
                      fill={
                        p.id === "china" ||
                        p.id === "india" ||
                        p.id === "vietnam"
                          ? CLINKER
                          : SLATE
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
