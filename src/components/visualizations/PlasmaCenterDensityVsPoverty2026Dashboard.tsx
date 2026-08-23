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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  CENTER_STOCK_PATH,
  HEADLINE,
  NEW_VS_STOCK_BANDS,
  OPENINGS_BY_COHORT,
  POVERTY_QUINTILES,
  SOURCE_NOTE,
  STATE_DENSITY,
  TRACT_CONTRAST,
  fmt1,
  fmtInt,
  statesByDensity,
} from "@/data/plasma-center-density-vs-poverty-2026-data";

// viz-types: quintile density bars, new-vs-stock grouped bars, state poverty×density scatter,
// stock path area+line, tract contrast bars, cohort density composed | layout: default

type ViewId = "density" | "openings" | "states" | "context";
type RegionFilter = "all" | "South" | "West" | "Midwest" | "Northeast";
type DensityMetric = "centersPer100k" | "locationIndex" | "centerSharePct";

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const SKY = "#0284c8";

const REGION_COLORS: Record<string, string> = {
  South: ROSE,
  West: TEAL,
  Midwest: INDIGO,
  Northeast: AMBER,
};

const Q_COLORS = [SKY, TEAL, SLATE, AMBER, ROSE];

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

export function PlasmaCenterDensityVsPoverty2026Dashboard() {
  const [view, setView] = useState<ViewId>("density");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [metric, setMetric] = useState<DensityMetric>("centersPer100k");

  const quintileBars = useMemo(() => {
    return POVERTY_QUINTILES.map((q, i) => ({
      name: q.label.replace(" poverty", ""),
      band: q.povertyBand,
      value:
        metric === "centersPer100k"
          ? q.centersPer100k
          : metric === "locationIndex"
            ? q.locationIndex
            : q.centerSharePct,
      fill: Q_COLORS[i],
      adultsM: q.adultsM,
      centers: q.centers,
    }));
  }, [metric]);

  const newVsStock = useMemo(
    () =>
      NEW_VS_STOCK_BANDS.map((b) => ({
        name: b.label,
        New: b.newSharePct,
        Stock: b.stockSharePct,
        Adults: b.adultSharePct,
        band: b.povertyBand,
      })),
    [],
  );

  const stateScatter = useMemo(() => {
    let rows = STATE_DENSITY;
    if (region !== "all") rows = rows.filter((r) => r.region === region);
    return rows.map((r) => ({
      ...r,
      x: r.povertyPct,
      y: r.centersPer100k,
      z: r.centers,
      fill: REGION_COLORS[r.region],
    }));
  }, [region]);

  const stateRank = useMemo(() => {
    let rows = statesByDensity();
    if (region !== "all") rows = rows.filter((r) => r.region === region);
    return rows.map((r) => ({
      name: r.abbr,
      value: r.centersPer100k,
      fill: REGION_COLORS[r.region],
      poverty: r.povertyPct,
    }));
  }, [region]);

  const stockPath = useMemo(
    () =>
      CENTER_STOCK_PATH.map((d) => ({
        year: d.year,
        centers: d.centers,
        collections: d.collectionsM ?? null,
      })),
    [],
  );

  const tractBars = useMemo(
    () =>
      TRACT_CONTRAST.filter((t) => t.metric.includes("poverty") || t.metric.includes("FPL")).map(
        (t) => ({
          name: t.metric.replace(" poverty", "").replace(" FPL)", ")"),
          Without: t.withoutCenterPct,
          With: t.withCenterPct,
        }),
      ),
    [],
  );

  const cohortBars = useMemo(
    () =>
      OPENINGS_BY_COHORT.map((c) => ({
        name: c.cohort.replace(" openings", "").replace(" stock", ""),
        High: c.highPovertyDensity,
        Low: c.lowPovertyDensity,
        share: c.highPovertySharePct,
      })),
    [],
  );

  const metricLabel =
    metric === "centersPer100k"
      ? "Centers per 100k adults"
      : metric === "locationIndex"
        ? "Location index (center share ÷ adult share)"
        : "Share of national center stock (%)";

  return (
    <div
      className="w-full space-y-6"
      data-viz="plasma-center-density-vs-poverty-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-300">
          Plasma · density vs poverty
        </p>
        <p className="mt-2 max-w-3xl text-2xl font-bold leading-snug sm:text-3xl">
          Highest-poverty ZCTAs host{" "}
          <span className="text-rose-300">
            {fmt1(HEADLINE.q5VsQ1DensityMultiple)}×
          </span>{" "}
          more centers per 100k adults than the lowest-poverty fifth
        </p>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          Desk FDA×ACS join on ~{fmtInt(HEADLINE.usCentersEnd2025)} active US
          collection sites. New openings still over-index on high-poverty ZIPs
          relative to adult population — even as the middle-class share of
          openings rises.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "US centers (end-2025)",
              value: fmtInt(HEADLINE.usCentersEnd2025),
            },
            {
              label: "Q5 density / 100k",
              value: fmt1(HEADLINE.highPovertyQ5CentersPer100k),
            },
            {
              label: "New sites in ≥15% poverty",
              value: `${HEADLINE.newCentersHighPovertySharePct}%`,
            },
            {
              label: "Adults in those ZCTAs",
              value: `${HEADLINE.adultPopHighPovertySharePct}%`,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                {s.label}
              </p>
              <p className="mt-0.5 text-lg font-bold tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "density", label: "Density" },
            { id: "openings", label: "Openings" },
            { id: "states", label: "States" },
            { id: "context", label: "Context" },
          ]}
        />
        {view === "density" && (
          <ToggleGroup
            label="Metric"
            value={metric}
            onChange={setMetric}
            options={[
              { id: "centersPer100k", label: "Per 100k" },
              { id: "locationIndex", label: "Index" },
              { id: "centerSharePct", label: "Share %" },
            ]}
          />
        )}
        {(view === "states") && (
          <ToggleGroup
            label="Region"
            value={region}
            onChange={setRegion}
            options={[
              { id: "all", label: "All" },
              { id: "South", label: "South" },
              { id: "Midwest", label: "Midwest" },
              { id: "West", label: "West" },
              { id: "Northeast", label: "Northeast" },
            ]}
          />
        )}
      </div>

      {view === "density" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={metricLabel}
            subtitle="Equal-adult ZCTA poverty quintiles · desk FDA×ACS"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quintileBars} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) =>
                      typeof v === "number" ? fmt1(v) : String(v)
                    }
                    labelFormatter={(_, payload) => {
                      const p = payload?.[0]?.payload as
                        | { band?: string; centers?: number }
                        | undefined;
                      return p?.band
                        ? `Poverty ${p.band} · ${fmtInt(p.centers ?? 0)} centers`
                        : "";
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {quintileBars.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Location index by quintile"
            subtitle="1.0 = centers proportional to adult population"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={POVERTY_QUINTILES.map((q, i) => ({
                    name: q.id.toUpperCase(),
                    index: q.locationIndex,
                    adults: q.adultSharePct,
                    fill: Q_COLORS[i],
                  }))}
                  margin={{ left: 8, right: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="idx"
                    domain={[0, 1.6]}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    yAxisId="pop"
                    orientation="right"
                    domain={[0, 30]}
                    tick={{ fontSize: 11 }}
                    hide
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="idx"
                    dataKey="index"
                    name="Location index"
                    radius={[4, 4, 0, 0]}
                  >
                    {POVERTY_QUINTILES.map((_, i) => (
                      <Cell key={i} fill={Q_COLORS[i]} />
                    ))}
                  </Bar>
                  <Line
                    yAxisId="idx"
                    type="monotone"
                    dataKey={() => 1}
                    name="Proportional (1.0)"
                    stroke={NAVY}
                    strokeDasharray="4 4"
                    dot={false}
                    legendType="none"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "openings" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="New openings vs existing stock"
            subtitle="% of sites by ZCTA poverty band · 2021–25 openings vs pre-2021 stock"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={newVsStock} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    unit="%"
                    domain={[0, 45]}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="New" fill={ROSE} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Stock" fill={SLATE} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Adults" fill={TEAL} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Density by opening cohort"
            subtitle="Centers per 100k adults in high- vs low-poverty ZCTAs"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={cohortBars} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="High"
                    name="High-poverty density"
                    fill={ROSE}
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="Low"
                    name="Low-poverty density"
                    fill={SKY}
                    radius={[3, 3, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="share"
                    name="High-poverty share %"
                    stroke={AMBER}
                    strokeWidth={2}
                    yAxisId={0}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "states" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Poverty rate × centers per 100k adults"
            subtitle="Selected states · bubble size = center count"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Poverty %"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    domain={[8, 20]}
                    label={{
                      value: "ACS poverty %",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Density"
                    tick={{ fontSize: 11 }}
                    domain={[0, 1.1]}
                    label={{
                      value: "Centers / 100k",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[40, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => {
                      if (name === "x") return [`${fmt1(Number(v))}%`, "Poverty"];
                      if (name === "y")
                        return [fmt1(Number(v)), "Per 100k adults"];
                      if (name === "z") return [fmtInt(Number(v)), "Centers"];
                      return [String(v), String(name)];
                    }}
                    labelFormatter={(_, payload) => {
                      const p = payload?.[0]?.payload as
                        | { abbr?: string; state?: string }
                        | undefined;
                      return p?.state ?? p?.abbr ?? "";
                    }}
                  />
                  <Scatter data={stateScatter} name="States">
                    {stateScatter.map((d) => (
                      <Cell key={d.abbr} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Centers per 100k adults by state"
            subtitle={
              region === "all" ? "All selected states" : `${region} only`
            }
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stateRank}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={36}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmt1(Number(v)), "Per 100k"]}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {stateRank.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "context" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="US plasma center stock"
            subtitle="FDA / industry published points · 2005–2025"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={stockPath} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) =>
                      typeof v === "number" ? fmtInt(v) : String(v)
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="centers"
                    fill={`${ROSE}33`}
                    stroke={ROSE}
                    strokeWidth={2}
                    name="Centers"
                  />
                  <Line
                    type="monotone"
                    dataKey="centers"
                    stroke={NAVY}
                    strokeWidth={0}
                    dot={{ r: 3, fill: NAVY }}
                    legendType="none"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Census tracts with vs without a center"
            subtitle="Means · May 2017 FDA set × ACS 2011–15 (Michigan study)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tractBars} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="Without"
                    name="No center"
                    fill={SLATE}
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="With"
                    name="Has center"
                    fill={ROSE}
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
