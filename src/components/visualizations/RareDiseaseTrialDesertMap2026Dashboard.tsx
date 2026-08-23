"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  DESERT_SCATTER,
  HEADLINE,
  METRIC_OPTIONS,
  PHASE_MIX,
  REGION_ROWS,
  SOURCE_NOTE,
  SPONSOR_DOMICILE,
  THERAPY_AREA_SHARE,
  TREND_INDEX,
  VIZ_MARKER,
  fmtNum,
  rankedRegionsBy,
  type MetricKey,
  type WhoRegionId,
} from "@/data/rare-disease-trial-desert-map-2026-data";

// viz-types: density bars, mismatch bars+radar, patient×density scatter, phase+sponsor+trend | controls: view + metric + desert filter

type ViewId = "density" | "mismatch" | "scatter" | "pipeline";
type DesertFilter = "all" | "deserts" | "dense";

const TIER_COLOR: Record<string, string> = {
  dense: "#0ea5e9",
  mid: "#22c55e",
  thin: "#eab308",
  "deep desert": "#e11d48",
};

const REGION_COLORS: Record<WhoRegionId, string> = {
  EUR: "#0ea5e9",
  AMR: "#38bdf8",
  WPR: "#22c55e",
  SEAR: "#eab308",
  EMR: "#f97316",
  AFR: "#e11d48",
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

export function RareDiseaseTrialDesertMap2026Dashboard() {
  const [view, setView] = useState<ViewId>("density");
  const [metric, setMetric] = useState<MetricKey>("trialsPerMillion");
  const [desertFilter, setDesertFilter] = useState<DesertFilter>("all");

  const filteredRegions = useMemo(() => {
    let rows = REGION_ROWS;
    if (desertFilter === "deserts") {
      rows = rows.filter(
        (r) => r.desertTier === "deep desert" || r.desertTier === "thin",
      );
    } else if (desertFilter === "dense") {
      rows = rows.filter(
        (r) => r.desertTier === "dense" || r.desertTier === "mid",
      );
    }
    return rows;
  }, [desertFilter]);

  const densityBars = useMemo(() => {
    const ranked = rankedRegionsBy(metric).filter((r) =>
      filteredRegions.some((f) => f.id === r.id),
    );
    return ranked.map((r) => ({
      id: r.id,
      name: r.id,
      full: r.name,
      value: r[metric],
      tier: r.desertTier,
    }));
  }, [metric, filteredRegions]);

  const mismatchBars = useMemo(
    () =>
      [...filteredRegions]
        .sort((a, b) => b.mismatchPp - a.mismatchPp)
        .map((r) => ({
          id: r.id,
          name: r.id,
          full: r.name,
          mismatch: r.mismatchPp,
          trialShare: r.trialSharePct,
          patientShare: r.patientSharePct,
        })),
    [filteredRegions],
  );

  const radarRows = useMemo(() => {
    const keys: MetricKey[] = [
      "trialsPerMillion",
      "trialsPerMillionPatients",
      "trialCountryUses",
      "patientsMillions",
    ];
    return keys.map((k) => {
      const opt = METRIC_OPTIONS.find((m) => m.id === k)!;
      const row: Record<string, string | number> = { metric: opt.label };
      const max = Math.max(...REGION_ROWS.map((r) => Number(r[k])));
      for (const r of REGION_ROWS) {
        row[r.id] = max > 0 ? Math.round((Number(r[k]) / max) * 100) : 0;
      }
      return row;
    });
  }, []);

  const scatterData = useMemo(
    () =>
      DESERT_SCATTER.filter((d) =>
        filteredRegions.some((f) => f.id === d.id),
      ).map((d) => ({
        ...d,
        x: d.patientsMillions,
        y: d.trialsPerMillion,
        z: Math.max(40, Math.sqrt(d.trialCountryUses) * 3),
      })),
    [filteredRegions],
  );

  const trendLines = useMemo(() => TREND_INDEX, []);

  const metricLabel =
    METRIC_OPTIONS.find((m) => m.id === metric)?.label ?? metric;

  return (
    <div
      className="space-y-6"
      data-viz="rare-disease-trial-desert-map-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-4 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
          {VIZ_MARKER}
        </p>
        <p className="mt-1 text-lg font-bold sm:text-xl">
          Europe hosts {fmtNum(HEADLINE.eurTrialsPerMillion)} interventional
          rare-disease trial country-uses per million people — Africa{" "}
          {fmtNum(HEADLINE.afrTrialsPerMillion)} ({fmtNum(HEADLINE.eurOverAfrDensity, 1)}
          × gap)
        </p>
        <p className="mt-2 text-sm text-slate-300">
          AFR+EMR hold ~{HEADLINE.afrEmrPatientSharePct}% of constructed patient
          stock but only {HEADLINE.afrEmrTrialSharePct}% of regional country-uses.
          Americas+Europe take {HEADLINE.amrEurTrialSharePct}% of trial geography.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "density", label: "Density" },
            { id: "mismatch", label: "Mismatch" },
            { id: "scatter", label: "Scatter" },
            { id: "pipeline", label: "Pipeline" },
          ]}
        />
        <ToggleGroup
          label="Metric"
          value={metric}
          onChange={setMetric}
          options={METRIC_OPTIONS.map((m) => ({ id: m.id, label: m.label }))}
        />
        <ToggleGroup
          label="Filter"
          value={desertFilter}
          onChange={setDesertFilter}
          options={[
            { id: "all", label: "All regions" },
            { id: "deserts", label: "Deserts" },
            { id: "dense", label: "Dense / mid" },
          ]}
        />
      </div>

      {view === "density" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="WHO-region trial density"
            subtitle={`${metricLabel} — interventional rare-disease country-uses`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={densityBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={44}
                    tick={{ fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {densityBars.map((d) => (
                      <Cell
                        key={d.id}
                        fill={TIER_COLOR[d.tier] ?? "#64748b"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Therapy-area tilt"
            subtitle="Share of rare-disease interventional country-uses"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={THERAPY_AREA_SHARE}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" unit="%" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="area"
                    width={128}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip />
                  <Bar dataKey="sharePct" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "mismatch" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Patient share minus trial share"
            subtitle="Positive bars = under-represented in trial geography"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mismatchBars}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis
                    unit=" pp"
                    tick={{ fontSize: 11 }}
                    domain={[-30, 25]}
                  />
                  <Tooltip />
                  <Bar dataKey="mismatch" radius={[4, 4, 0, 0]}>
                    {mismatchBars.map((d) => (
                      <Cell
                        key={d.id}
                        fill={d.mismatch >= 0 ? "#e11d48" : "#0ea5e9"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Normalized regional radar"
            subtitle="Each spoke scaled 0–100 within metric (shape, not absolute)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarRows}>
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fontSize: 9, fill: "#475569" }}
                  />
                  {(
                    ["EUR", "AMR", "AFR", "SEAR"] as WhoRegionId[]
                  ).map((id) => (
                    <Radar
                      key={id}
                      name={id}
                      dataKey={id}
                      stroke={REGION_COLORS[id]}
                      fill={REGION_COLORS[id]}
                      fillOpacity={0.12}
                      strokeWidth={2}
                    />
                  ))}
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "scatter" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Patients vs trials per million"
            subtitle="Bubble size ∝ regional country-uses — deserts sit low-right"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Patients (M)"
                    unit=" M"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Est. rare-disease patients (M)",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Trials / M pop"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Trials / million pop.",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={scatterData}>
                    {scatterData.map((d) => (
                      <Cell
                        key={d.id}
                        fill={REGION_COLORS[d.id as WhoRegionId]}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Cadence index since 2019"
            subtitle="Regional country-use starts indexed to 2019 = 100"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={trendLines}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  {(
                    ["EUR", "AMR", "WPR", "SEAR", "EMR", "AFR"] as WhoRegionId[]
                  ).map((id) => (
                    <Line
                      key={id}
                      type="monotone"
                      dataKey={id}
                      stroke={REGION_COLORS[id]}
                      strokeWidth={id === "AFR" || id === "EMR" ? 2.5 : 1.75}
                      dot={false}
                    />
                  ))}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "pipeline" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Phase mix of unique protocols"
            subtitle={`~${HEADLINE.uniqueInterventionalTrials.toLocaleString()} interventional RD NCT IDs`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={PHASE_MIX}
                  margin={{ top: 8, right: 16, left: 8, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="phase"
                    interval={0}
                    angle={-28}
                    textAnchor="end"
                    tick={{ fontSize: 10 }}
                    height={60}
                  />
                  <YAxis unit="%" tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="sharePct" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Sponsor domicile"
            subtitle="Share of rare-disease interventional starts, 2023–25"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={SPONSOR_DOMICILE}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" unit="%" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="domicile"
                    width={140}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip />
                  <Bar dataKey="sharePct" fill="#f59e0b" radius={[0, 4, 4, 0]} />
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
