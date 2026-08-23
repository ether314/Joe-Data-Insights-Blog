"use client";

import { useMemo, useState } from "react";
import {
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
  ANNUAL_SERIES,
  DENSITY_BUCKETS,
  HEADLINE,
  INDUSTRY_CROSS_2024,
  SOURCE_NOTE,
  SECTOR_SHARE_2025,
  WORKERS_2023,
  fmtInt,
  fmtK,
  fmtPct,
  ownershipForYear,
  type IndustryBand,
} from "@/data/us-work-stoppage-idleness-versus-union-density-2026-data";

// viz-types: coverage×idle scatter, idle rank bars, annual composed, ownership bars, density buckets, 2025 sector share | layout: default

type ViewId = "scatter" | "rank" | "timeline" | "ownership";
type MetricId = "days" | "workers";
type BandFilter = "all" | IndustryBand;

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const SKY = "#0284c8";

const BAND_COLORS: Record<IndustryBand, string> = {
  goods: ROSE,
  services: INDIGO,
  infra: TEAL,
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

export function UsWorkStoppageIdlenessVersusUnionDensity2026Dashboard() {
  const [view, setView] = useState<ViewId>("scatter");
  const [metric, setMetric] = useState<MetricId>("days");
  const [band, setBand] = useState<BandFilter>("all");
  const [ownYear, setOwnYear] = useState<2024 | 2025>(2025);

  const filtered = useMemo(() => {
    if (band === "all") return INDUSTRY_CROSS_2024;
    return INDUSTRY_CROSS_2024.filter((r) => r.band === band);
  }, [band]);

  const scatterData = useMemo(
    () =>
      filtered.map((r) => ({
        ...r,
        x: r.coveragePct2025,
        y: metric === "days" ? r.daysIdle2024 : r.workers2024,
        z: Math.max(r.workers2024, 500),
      })),
    [filtered, metric],
  );

  const rankData = useMemo(() => {
    const key = metric === "days" ? "daysIdle2024" : "workers2024";
    return [...filtered]
      .sort((a, b) => b[key] - a[key])
      .map((r) => ({
        label: r.label,
        value: r[key],
        coverage: r.coveragePct2025,
        band: r.band,
      }));
  }, [filtered, metric]);

  const ownership = ownershipForYear(ownYear);

  const annual = ANNUAL_SERIES.map((r) => ({
    year: r.year,
    daysIdleM: Math.round((r.daysIdleK / 1000) * 100) / 100,
    stoppages: r.stoppagesBeginning,
    workersK: r.workersBeginningK,
  }));

  return (
    <div
      className="space-y-6"
      data-viz="us-work-stoppage-idleness-versus-union-density-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
          Organized labor · idle days vs coverage
        </p>
        <p className="mt-1 text-xs text-slate-400">Idle days vs coverage %</p>
        <p className="mt-2 text-lg font-semibold leading-snug sm:text-xl">
          Manufacturing logged {fmtK(HEADLINE.mfgDaysIdle2024)} major-stoppage
          idle days in 2024 at {fmtPct(HEADLINE.mfgMembership2025)} membership —
          utilities sat at {fmtPct(HEADLINE.utilitiesMembership2025)} with no
          2024 major-idle table entry.
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Education led workers idled ({fmtK(HEADLINE.eduWorkers2024)}) at{" "}
          {fmtPct(HEADLINE.eduMembership2025)} density. High coverage alone does
          not map to high idleness.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "scatter", label: "Scatter" },
            { id: "rank", label: "Rank" },
            { id: "timeline", label: "Timeline" },
            { id: "ownership", label: "Ownership" },
          ]}
        />
        <ToggleGroup
          label="Metric"
          value={metric}
          onChange={setMetric}
          options={[
            { id: "days", label: "Days idle" },
            { id: "workers", label: "Workers idled" },
          ]}
        />
        <ToggleGroup
          label="Band"
          value={band}
          onChange={setBand}
          options={[
            { id: "all", label: "All" },
            { id: "goods", label: "Goods" },
            { id: "services", label: "Services" },
            { id: "infra", label: "Infra" },
          ]}
        />
      </div>

      {view === "scatter" && (
        <ChartCard
          title="Coverage % vs major-stoppage idleness (2024)"
          subtitle="X = 2025 CPS representation rate; Y = 2024 BLS idle days or workers; bubble ≈ workers idled"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Coverage"
                  unit="%"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  label={{
                    value: "Union coverage % (2025)",
                    position: "insideBottom",
                    offset: -2,
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Idle"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  tickFormatter={(v: number) => fmtK(v)}
                  width={56}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload as (typeof scatterData)[0];
                    if (!d) return null;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{d.label}</p>
                        <p className="text-slate-600">
                          Coverage {fmtPct(d.coveragePct2025)} · Membership{" "}
                          {fmtPct(d.membershipPct2025)}
                        </p>
                        <p className="text-slate-600">
                          Days idle {fmtInt(d.daysIdle2024)} · Workers{" "}
                          {fmtInt(d.workers2024)}
                        </p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatterData} name="Industries">
                  {scatterData.map((d) => (
                    <Cell key={d.id} fill={BAND_COLORS[d.band]} fillOpacity={0.85} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
            {(Object.keys(BAND_COLORS) as IndustryBand[]).map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: BAND_COLORS[b] }}
                />
                {b}
              </span>
            ))}
          </div>
        </ChartCard>
      )}

      {view === "rank" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={
              metric === "days"
                ? "Days idle by industry (2024)"
                : "Workers idled by industry (2024)"
            }
            subtitle="Sorted descending · color = industry band"
          >
            <div className="h-[400px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={rankData}
                  layout="vertical"
                  margin={{ top: 4, right: 12, bottom: 4, left: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis
                    type="number"
                    tickFormatter={(v: number) => fmtK(v)}
                    tick={{ fill: SLATE, fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={118}
                    tick={{ fill: NAVY, fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => fmtInt(Number(v ?? 0))}
                    labelFormatter={(l) => String(l)}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {rankData.map((d) => (
                      <Cell key={d.label} fill={BAND_COLORS[d.band as IndustryBand]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Idle days by coverage bucket"
            subtitle="2024 idle days summed into 2025 coverage bands"
          >
            <div className="h-[400px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={DENSITY_BUCKETS}
                  margin={{ top: 8, right: 12, bottom: 8, left: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fill: SLATE, fontSize: 11 }} interval={0} />
                  <YAxis
                    tickFormatter={(v: number) => fmtK(v)}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    width={52}
                  />
                  <Tooltip
                    formatter={(v) => fmtInt(Number(v ?? 0))}
                    labelFormatter={(l) => String(l)}
                  />
                  <Bar
                    dataKey="totalDaysIdle2024"
                    name="Days idle"
                    fill={AMBER}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              The mid-coverage band (5–12%) holds manufacturing and information —
              together more idle days than the ≥12% band that includes education,
              transport, construction, and utilities.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "timeline" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Major stoppages & idle days (2016–2025)"
            subtitle="Bars = days idle (millions); line = stoppages beginning in year"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={annual} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: SLATE, fontSize: 11 }}
                    tickFormatter={(v: number) => `${v}M`}
                    width={40}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: SLATE, fontSize: 11 }}
                    width={36}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="daysIdleM"
                    name="Days idle (M)"
                    fill={SKY}
                    radius={[3, 3, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="stoppages"
                    name="Stoppages"
                    stroke={ROSE}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="2023 workers idled vs 2025 membership %"
            subtitle="Spike-year headcount by industry · membership rates are 2025 CPS"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={WORKERS_2023}
                  margin={{ top: 8, right: 12, bottom: 4, left: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: SLATE, fontSize: 9 }}
                    interval={0}
                    angle={-28}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(v: number) => fmtK(v)}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    width={48}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: SLATE, fontSize: 11 }}
                    unit="%"
                    width={40}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="workers"
                    name="Workers idled"
                    fill={INDIGO}
                    radius={[3, 3, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="membershipPct2025"
                    name="Membership %"
                    stroke={AMBER}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "ownership" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Private vs state/local government idleness"
            subtitle="Toggle year · membership rates from CPS public/private rows"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Year"
                value={String(ownYear) as "2024" | "2025"}
                onChange={(v) => setOwnYear(Number(v) as 2024 | 2025)}
                options={[
                  { id: "2024", label: "2024" },
                  { id: "2025", label: "2025" },
                ]}
              />
            </div>
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ownership} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(v: number) => fmtK(v)}
                    tick={{ fill: SLATE, fontSize: 11 }}
                    width={48}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: SLATE, fontSize: 11 }}
                    unit="%"
                    width={40}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="daysIdle"
                    name="Days idle"
                    fill={TEAL}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="membershipPct"
                    name="Membership %"
                    fill={AMBER}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="2025 workers idled by sector"
            subtitle="Service-providing industries accounted for 98% of workers beginning stoppages"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={SECTOR_SHARE_2025}
                  layout="vertical"
                  margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis
                    type="number"
                    tickFormatter={(v: number) => fmtK(v)}
                    tick={{ fill: SLATE, fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={130}
                    tick={{ fill: NAVY, fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => fmtInt(Number(v ?? 0))}
                    labelFormatter={(l) => String(l)}
                  />
                  <Bar dataKey="workers" fill={INDIGO} radius={[0, 4, 4, 0]} />
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
