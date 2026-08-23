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
  HEADLINE,
  HHI_BANDS,
  METRO_PANEL,
  RESIDUALS,
  SERVICE_LINES,
  SOURCE_NOTE,
  TOP_SYSTEMS,
  VINTAGE_PATH,
  fmtInt,
  fmtPct,
  metrosByRegion,
  type RegionId,
} from "@/data/hospital-system-clout-vs-commercial-prices-2026-data";

// viz-types: HHI-band bars, metro HHI×ratio scatter, vintage area+line,
// service-line bars, top-system ladder, residual bars | layout: default

type ViewId = "bands" | "metros" | "services" | "path";
type RegionFilter = "all" | RegionId;
type ScatterMetric = "ratio" | "top1" | "top2";

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const SKY = "#0284c8";

const REGION_COLORS: Record<string, string> = {
  Northeast: INDIGO,
  Midwest: TEAL,
  South: ROSE,
  West: AMBER,
};

const BAND_COLORS = [SKY, TEAL, AMBER, ROSE];

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

export function HospitalSystemCloutVsCommercialPrices2026Dashboard() {
  const [view, setView] = useState<ViewId>("bands");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [scatterMetric, setScatterMetric] = useState<ScatterMetric>("ratio");

  const bandBars = useMemo(
    () =>
      HHI_BANDS.map((b, i) => ({
        name: b.label,
        range: b.hhiRange,
        mean: b.meanRatioPct,
        p25: b.p25RatioPct,
        p75: b.p75RatioPct,
        top1: b.meanTop1SharePct,
        fill: BAND_COLORS[i],
        cbsas: b.cbsaCount,
      })),
    [],
  );

  const scatter = useMemo(() => {
    return metrosByRegion(region).map((m) => ({
      ...m,
      x: m.hhi,
      y:
        scatterMetric === "ratio"
          ? m.ratioPct
          : scatterMetric === "top1"
            ? m.top1SharePct
            : m.top2SharePct,
      z: Math.max(80, m.employerLivesK / 8),
      fill: REGION_COLORS[m.region],
    }));
  }, [region, scatterMetric]);

  const serviceBars = useMemo(
    () =>
      SERVICE_LINES.map((s) => ({
        name: s.label,
        ratio: s.ratioPct,
        spend: s.spendSharePct,
        slope: s.hhiSlopePpPer1000,
      })),
    [],
  );

  const vintage = useMemo(
    () =>
      VINTAGE_PATH.map((v) => ({
        year: String(v.year),
        ratio: v.nationalRatioPct,
        hhi: v.meanHhi / 100,
        highShare: v.highSharePct,
      })),
    [],
  );

  const systems = useMemo(() => {
    let rows = TOP_SYSTEMS;
    if (region !== "all") rows = rows.filter((r) => r.region === region);
    return [...rows].sort((a, b) => b.admissionSharePct - a.admissionSharePct);
  }, [region]);

  const residuals = useMemo(
    () => [...RESIDUALS].sort((a, b) => b.residualPp - a.residualPp),
    [],
  );

  const yLabel =
    scatterMetric === "ratio"
      ? "Commercial / Medicare %"
      : scatterMetric === "top1"
        ? "Top-1 admission share %"
        : "Top-2 admission share %";

  return (
    <div className="w-full space-y-6" data-viz="hospital-system-clout-vs-commercial-prices-2026">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">
          Hospital clout · commercial prices
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Commercial-to-Medicare {fmtPct(HEADLINE.nationalCommercialToMedicarePct)} nationally —
          very-high-HHI markets average {fmtPct(HEADLINE.veryHighHhiMeanRatioPct)}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Highly concentrated CBSAs (HHI ≥ 2,500) print a mean ratio of{" "}
          {fmtPct(HEADLINE.highHhiMeanRatioPct)} versus {fmtPct(HEADLINE.lowHhiMeanRatioPct)} in
          unconcentrated markets — a {HEADLINE.highVsLowGapPp} pp gap. About{" "}
          {fmtPct(HEADLINE.highlyConcentratedSharePct)} of the mapped panel sits in the high band;
          {` `}
          {fmtPct(HEADLINE.top2HalfAdmissionsSharePct)} have a top-two systems controlling half of
          admissions.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
          <span>{HEADLINE.mappedCbsas} CBSAs</span>
          <span>·</span>
          <span>Median top-1 share {fmtPct(HEADLINE.medianTop1AdmissionSharePct)}</span>
          <span>·</span>
          <span>
            IP {fmtPct(HEADLINE.inpatientRatioPct)} / OP {fmtPct(HEADLINE.outpatientRatioPct)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "bands", label: "HHI bands" },
            { id: "metros", label: "Metros" },
            { id: "services", label: "Services" },
            { id: "path", label: "Path" },
          ]}
        />
        <ToggleGroup
          label="Region"
          value={region}
          onChange={setRegion}
          options={[
            { id: "all", label: "All" },
            { id: "Northeast", label: "Northeast" },
            { id: "Midwest", label: "Midwest" },
            { id: "South", label: "South" },
            { id: "West", label: "West" },
          ]}
        />
      </div>

      {view === "bands" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Commercial / Medicare by admissions HHI band"
            subtitle="Desk join of RAND metro ratios to AHA-derived HHI bands"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={bandBars} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    domain={[180, 360]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v) => [`${Number(v)}%`, "Mean ratio"]}
                    labelFormatter={(l) => String(l)}
                  />
                  <Bar dataKey="mean" name="Mean ratio" radius={[6, 6, 0, 0]}>
                    {bandBars.map((b) => (
                      <Cell key={b.name} fill={b.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="IQR envelope + top-1 admission share"
            subtitle="Bars = mean ratio; line = mean top-1 system share"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <ComposedChart data={bandBars} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    domain={[180, 360]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    domain={[0, 70]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="p25"
                    name="P25 ratio"
                    fill={SLATE}
                    opacity={0.35}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="p75"
                    name="P75 ratio"
                    fill={TEAL}
                    opacity={0.55}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="top1"
                    name="Top-1 share"
                    stroke={NAVY}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "metros" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="HHI × price (or system share)"
            subtitle="Bubble size ≈ employer lives in claims footprint"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Y metric"
                value={scatterMetric}
                onChange={setScatterMetric}
                options={[
                  { id: "ratio", label: "Price ratio" },
                  { id: "top1", label: "Top-1 share" },
                  { id: "top2", label: "Top-2 share" },
                ]}
              />
            </div>
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="HHI"
                    tick={{ fontSize: 11 }}
                    domain={[800, 6000]}
                    label={{ value: "Admissions HHI", position: "insideBottom", offset: -2, fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Y"
                    tick={{ fontSize: 11 }}
                    label={{ value: yLabel, angle: -90, position: "insideLeft", fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 320]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    labelFormatter={() => ""}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload as (typeof scatter)[0];
                      if (!d) return null;
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
                          <p className="font-semibold text-slate-900">{d.metro}</p>
                          <p className="text-slate-600">HHI {fmtInt(d.hhi)}</p>
                          <p className="text-slate-600">Ratio {fmtPct(d.ratioPct)}</p>
                          <p className="text-slate-600">
                            Top-1 / Top-2 {fmtPct(d.top1SharePct)} / {fmtPct(d.top2SharePct)}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={scatter} name="Metros">
                    {scatter.map((m) => (
                      <Cell key={m.id} fill={m.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="High-clout tip systems"
            subtitle="Admission share vs commercial/Medicare in tip metros"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart
                  data={systems}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 70]} tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="metro"
                    width={100}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      `${Number(v)}%`,
                      name === "admissionSharePct" ? "Admission share" : "Price ratio",
                    ]}
                  />
                  <Legend />
                  <Bar
                    dataKey="admissionSharePct"
                    name="Admission share"
                    fill={INDIGO}
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="ratioPct"
                    name="Price ratio"
                    fill={AMBER}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "services" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Service-line commercial / Medicare"
            subtitle="Outpatient and ancillaries print hotter than inpatient"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <ComposedChart data={serviceBars} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-18} textAnchor="end" height={60} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    domain={[200, 340]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    domain={[0, 50]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="ratio" name="Price ratio" fill={TEAL} radius={[6, 6, 0, 0]} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="spend"
                    name="Spend share"
                    stroke={ROSE}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="HHI slope by service (pp per +1,000 HHI)"
            subtitle="Desk slopes — ED and imaging move faster with concentration"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={serviceBars} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-18} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 28]} />
                  <Tooltip formatter={(v) => [`${Number(v)} pp`, "Slope"]} />
                  <Bar dataKey="slope" name="pp / +1k HHI" fill={AMBER} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "path" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="National ratio + mean HHI path"
            subtitle="Ratio (area) vs mean CBSA HHI / 100 (line)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <ComposedChart data={vintage} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    domain={[200, 280]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    domain={[28, 42]}
                  />
                  <Tooltip />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="ratio"
                    name="Nat'l ratio %"
                    fill={TEAL}
                    fillOpacity={0.25}
                    stroke={TEAL}
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="hhi"
                    name="Mean HHI / 100"
                    stroke={NAVY}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Residuals vs HHI-implied price"
            subtitle="Positive = expensive for concentration; Salt Lake is the soft tip"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart
                  data={residuals}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[-50, 60]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) => {
                      const n = Number(v);
                      return [`${n > 0 ? "+" : ""}${n} pp`, "Residual"];
                    }}
                  />
                  <Bar dataKey="residualPp" name="Residual pp" radius={[0, 4, 4, 0]}>
                    {residuals.map((r) => (
                      <Cell key={r.id} fill={r.residualPp >= 0 ? ROSE : TEAL} />
                    ))}
                  </Bar>
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
