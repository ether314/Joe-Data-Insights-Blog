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
  HEADLINE,
  SOURCE_NOTE,
  SOURCES,
  dualLensRows,
  gapScatter2019,
  irtadLadder2021,
  irtadMultiYear,
  regionMeans2021,
  spikePathRows,
  usSeriesWithPeerBands,
  type UnitMode,
} from "@/data/us-traffic-deaths-per-vmt-vs-peer-countries-2026-data";

// viz-types: peer ladder bars, US path+bands composed, spike bars, 2019 scatter, region pie, dual-lens bars | layout: default

type ViewId = "peers" | "path" | "spike" | "lens";

const ORANGE = "#ea580c";
const TEAL = "#0d9488";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const ROSE = "#e11d48";
const AMBER = "#d97706";

const REGION_FILL: Record<string, string> = {
  nordic: TEAL,
  europe: INDIGO,
  anglo: AMBER,
  asia: ROSE,
  us: ORANGE,
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

function unitLabel(unit: UnitMode) {
  return unit === "per100mVmt"
    ? "deaths / 100M VMT"
    : "deaths / billion vkm";
}

export function UsTrafficDeathsPerVmtVsPeerCountries2026Dashboard() {
  const [view, setView] = useState<ViewId>("peers");
  const [unit, setUnit] = useState<UnitMode>("per100mVmt");
  const [focus, setFocus] = useState<"all" | "core">("all");

  const ladder = useMemo(() => irtadLadder2021(unit), [unit]);
  const path = useMemo(() => usSeriesWithPeerBands(), []);
  const spike = useMemo(() => spikePathRows(), []);
  const scatter = useMemo(() => gapScatter2019(), []);
  const regions = useMemo(() => regionMeans2021(unit), [unit]);
  const multi = useMemo(() => irtadMultiYear(unit), [unit]);
  const dual = useMemo(() => dualLensRows(), []);

  const filteredLadder = useMemo(() => {
    if (focus === "all") return ladder;
    const keep = new Set([
      "united-states",
      "norway",
      "sweden",
      "denmark",
      "germany",
      "canada",
      "australia",
      "korea",
    ]);
    return ladder.filter((r) => keep.has(r.id));
  }, [ladder, focus]);

  const yLabel = unitLabel(unit);

  return (
    <div
      className="space-y-6"
      data-viz="us-traffic-deaths-per-vmt-vs-peer-countries-2026"
    >
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 text-white shadow-lg">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-300/90">
              US traffic deaths per VMT vs peer countries — road-safety lens
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {HEADLINE.usVsNorwayMultiple2021}× Norway&apos;s 2021 distance
              risk — and the 2020–22 spike only partly reversed
            </p>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              NHTSA put the US at{" "}
              <span className="font-semibold text-orange-200">
                {HEADLINE.usRate2024} deaths per 100M VMT
              </span>{" "}
              in 2024 — down from the {HEADLINE.usPeak2021} peak, but still{" "}
              {HEADLINE.us2024Vs2019Pct}% above 2019. IRTAD&apos;s 2021
              distance ladder still parks the US next to Korea and Czechia,
              not Germany or the Nordics.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-right sm:grid-cols-3">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                US 2024 rate
              </p>
              <p className="text-lg font-bold text-orange-300">
                {HEADLINE.usRate2024}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                2021 peak
              </p>
              <p className="text-lg font-bold text-rose-300">
                {HEADLINE.usPeak2021}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                vs Norway 2021
              </p>
              <p className="text-lg font-bold text-emerald-300">
                {HEADLINE.usVsNorwayMultiple2021}×
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "peers", label: "Peer ladder" },
            { id: "path", label: "US path" },
            { id: "spike", label: "Spike unwind" },
            { id: "lens", label: "VMT vs pop" },
          ]}
        />
        {(view === "peers" || view === "path") && (
          <ToggleGroup
            label="Units"
            value={unit}
            onChange={setUnit}
            options={[
              { id: "per100mVmt", label: "Per 100M VMT" },
              { id: "perBillionVkm", label: "Per billion vkm" },
            ]}
          />
        )}
        {view === "peers" && (
          <ToggleGroup
            label="Scope"
            value={focus}
            onChange={setFocus}
            options={[
              { id: "all", label: "Full IRTAD set" },
              { id: "core", label: "US + peers" },
            ]}
          />
        )}
      </div>

      {view === "peers" ? (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ChartCard
              title="IRTAD 2021 distance-risk ladder"
              subtitle={`${yLabel} — OECD/ITF countries with validated distance exposure`}
            >
              <div className="h-[420px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={filteredLadder}
                    layout="vertical"
                    margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="short"
                      width={36}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(v) => [
                        typeof v === "number" ? v.toFixed(2) : v,
                        yLabel,
                      ]}
                      labelFormatter={(_, payload) =>
                        String(payload?.[0]?.payload?.label ?? "")
                      }
                    />
                    <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                      {filteredLadder.map((r) => (
                        <Cell
                          key={r.id}
                          fill={
                            r.id === "united-states" ? ORANGE : r.color
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
          <div className="lg:col-span-2">
            <ChartCard
              title="Regional means, 2021"
              subtitle="Simple average of IRTAD ladder countries in each bucket"
            >
              <div className="h-[280px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regions}
                      dataKey="mean"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={2}
                    >
                      {regions.map((r) => (
                        <Cell
                          key={r.region}
                          fill={REGION_FILL[r.region] ?? SLATE}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [
                        typeof v === "number" ? v.toFixed(2) : v,
                        "Mean rate",
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 space-y-1 text-xs text-slate-600">
                {regions.map((r) => (
                  <li key={r.region} className="flex justify-between gap-2">
                    <span>
                      {r.label} (n={r.n})
                    </span>
                    <span className="font-semibold tabular-nums">
                      {r.mean.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </ChartCard>
          </div>
        </div>
      ) : null}

      {view === "path" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="US rate path with peer reference bands"
            subtitle="NHTSA per 100M VMT; Norway/Germany bands from IRTAD 2021 (converted)"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={path}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, "auto"]} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="peerAvg2019"
                    name="2019 peer avg (CDC)"
                    stroke={SLATE}
                    fill="#cbd5e1"
                    fillOpacity={0.25}
                    strokeDasharray="4 4"
                  />
                  <Line
                    type="monotone"
                    dataKey="norwayBand"
                    name="Norway 2021"
                    stroke={TEAL}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="germanyBand"
                    name="Germany 2021"
                    stroke={INDIGO}
                    strokeWidth={2}
                    strokeDasharray="6 3"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="us"
                    name="United States"
                    stroke={ORANGE}
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Selected peers across 2019–21"
            subtitle={`${yLabel} — IRTAD Table 4 panel`}
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={multi}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="norway"
                    name="Norway"
                    stroke="#34d399"
                    strokeWidth={2}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="germany"
                    name="Germany"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="canada"
                    name="Canada"
                    stroke="#fbbf24"
                    strokeWidth={2}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="france"
                    name="France"
                    stroke="#c084fc"
                    strokeWidth={2}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="united-states"
                    name="United States"
                    stroke={ORANGE}
                    strokeWidth={3}
                    connectNulls
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {view === "spike" ? (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ChartCard
              title="Did the 2020–22 spike reverse?"
              subtitle="US deaths per 100M VMT — partial unwind, still above 2019"
            >
              <div className="h-[360px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={spike}
                    margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(v, name) => [
                        typeof v === "number" ? v.toFixed(2) : v,
                        String(name),
                      ]}
                    />
                    <Bar
                      dataKey="rate"
                      name="Rate / 100M VMT"
                      fill={ORANGE}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                From the {HEADLINE.usPeak2021} peak, about{" "}
                <strong>{HEADLINE.spikeUnwindSharePct}%</strong> of the
                2019→2021 jump had unwound by 2024 — but the level remains{" "}
                <strong>{HEADLINE.us2024Vs2019Pct}%</strong> above the 2019
                baseline, and still roughly{" "}
                <strong>{spike[spike.length - 1]?.vsNorway2021}×</strong>{" "}
                Norway&apos;s 2021 distance risk.
              </p>
            </ChartCard>
          </div>
          <div className="lg:col-span-2">
            <ChartCard
              title="2019 gap scatter"
              subtitle="CDC MMWR distance rates — US vs high-income peers"
            >
              <div className="h-[360px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 12, right: 12, left: 8, bottom: 12 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      dataKey="rate"
                      name="Rate"
                      tick={{ fontSize: 11 }}
                      label={{
                        value: "Deaths / 100M VMT (2019)",
                        position: "insideBottom",
                        offset: -4,
                        style: { fontSize: 11, fill: SLATE },
                      }}
                    />
                    <YAxis
                      type="number"
                      dataKey="vsUs"
                      name="US multiple"
                      tick={{ fontSize: 11 }}
                      label={{
                        value: "US ÷ country",
                        angle: -90,
                        position: "insideLeft",
                        style: { fontSize: 11, fill: SLATE },
                      }}
                    />
                    <ZAxis range={[60, 60]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      formatter={(v, name) => [
                        typeof v === "number" ? v.toFixed(2) : v,
                        String(name),
                      ]}
                      labelFormatter={(_, p) =>
                        String(p?.[0]?.payload?.label ?? "")
                      }
                    />
                    <Scatter data={scatter} name="Countries">
                      {scatter.map((r) => (
                        <Cell
                          key={r.id}
                          fill={r.isUs ? ORANGE : TEAL}
                          fillOpacity={r.isUs ? 1 : 0.75}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      ) : null}

      {view === "lens" ? (
        <ChartCard
          title="Two lenses, same countries"
          subtitle="Population mortality (2022, IRTAD) vs distance risk (2019, CDC MMWR) — US outlier on both"
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dual}
                margin={{ top: 8, right: 12, left: 0, bottom: 48 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={60}
                />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="pop"
                  name="Deaths / 100k (2022)"
                  radius={[4, 4, 0, 0]}
                >
                  {dual.map((r) => (
                    <Cell
                      key={`pop-${r.id}`}
                      fill={r.isUs ? ROSE : INDIGO}
                    />
                  ))}
                </Bar>
                <Bar
                  yAxisId="right"
                  dataKey="vmt"
                  name="Deaths / 100M VMT (2019)"
                  radius={[4, 4, 0, 0]}
                >
                  {dual.map((r) => (
                    <Cell
                      key={`vmt-${r.id}`}
                      fill={r.isUs ? ORANGE : TEAL}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">
        {SOURCE_NOTE} Sources: {SOURCES.join("; ")}.
      </p>
    </div>
  );
}
