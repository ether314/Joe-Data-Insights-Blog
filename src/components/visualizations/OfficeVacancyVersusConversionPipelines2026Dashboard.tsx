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
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ANALYTICS,
  COST_STACK,
  HEADLINE,
  METRO_ROWS,
  PIPELINE_PATH,
  REGION_MIX,
  REUSE_SOURCE_MIX,
  SCATTER_POINTS,
  SOURCE_NOTE,
  type Quadrant,
} from "@/data/office-vacancy-versus-conversion-pipelines-2026-data";

type Panel = "ladder" | "scatter" | "path" | "costs" | "mix";
type RegionFilter = "all" | "Northeast" | "South" | "Midwest" | "West";
type IncentiveFilter = "all" | "with" | "without";

const COLORS = {
  intensity: "#0f766e",
  vacancy: "#c2410c",
  pipeline: "#1d4ed8",
  stranded: "#b91c1c",
  active: "#0f766e",
  balanced: "#ca8a04",
  tight: "#64748b",
  cost: "#334155",
  ground: "#94a3b8",
  pie: ["#0f766e", "#1d4ed8", "#c2410c", "#64748b"],
};

const QUAD_COLOR: Record<Quadrant, string> = {
  "active-conversion": COLORS.active,
  balanced: COLORS.balanced,
  "vacancy-stranded": COLORS.stranded,
  "tight-market": COLORS.tight,
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

export function OfficeVacancyVersusConversionPipelines2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("ladder");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [incentive, setIncentive] = useState<IncentiveFilter>("all");

  const filteredMetros = useMemo(() => {
    return METRO_ROWS.filter((m) => {
      if (region !== "all" && m.region !== region) return false;
      if (incentive === "with" && !m.incentive) return false;
      if (incentive === "without" && m.incentive) return false;
      return true;
    });
  }, [region, incentive]);

  const ladderData = useMemo(
    () =>
      [...filteredMetros]
        .sort((a, b) => b.unitsPerMVacantSf - a.unitsPerMVacantSf)
        .map((m) => ({
          metro: m.metro,
          unitsPerMVacantSf: m.unitsPerMVacantSf,
          vacancyPct: m.vacancyPct,
          pipelineUnits: m.pipelineUnits,
          quadrant: m.quadrant,
        })),
    [filteredMetros],
  );

  const scatterData = useMemo(() => {
    const ids = new Set(filteredMetros.map((m) => m.id));
    return SCATTER_POINTS.filter((p) => ids.has(p.id));
  }, [filteredMetros]);

  const pathData = useMemo(
    () =>
      PIPELINE_PATH.map((r) => ({
        year: String(r.year),
        units: r.units,
        vacancyPct: r.nationalVacancyPct,
      })),
    [],
  );

  const costData = useMemo(
    () =>
      COST_STACK.map((c) => ({
        metro: c.metro.replace("Washington, D.C.", "D.C."),
        conversion: c.costPerUnitK,
        groundUp: c.groundUpPerUnitK,
        gap: c.groundUpPerUnitK - c.costPerUnitK,
        incentiveScore: c.incentiveScore,
      })),
    [],
  );

  const pieData = useMemo(
    () => REUSE_SOURCE_MIX.map((r) => ({ name: r.source, value: r.sharePct })),
    [],
  );

  return (
    <div
      className="not-prose my-8 w-full space-y-4"
      data-viz="office-vacancy-versus-conversion-pipelines-2026"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
            Converted units per vacant sq ft
          </p>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Vacancy × pipeline metro ladder
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            New York clears {HEADLINE.nycUnitsPerMVacantSf} units per million
            vacant SF; Houston&apos;s ~26% vacancy pairs with only{" "}
            {HEADLINE.houstonUnitsPerMVacantSf} — a{" "}
            {HEADLINE.nycVsHoustonIntensityRatio}× intensity gap. National
            pipeline: {HEADLINE.nationalPipelineUnits.toLocaleString()} units (+
            {HEADLINE.nationalPipelineYoyPct}% YoY).
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
            Focus panel
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              value={panel}
              onChange={(e) => setPanel(e.target.value as Panel)}
              aria-label="Focus panel"
            >
              <option value="ladder">Intensity ladder</option>
              <option value="scatter">Vacancy × intensity</option>
              <option value="path">Pipeline path</option>
              <option value="costs">Cost stacks</option>
              <option value="mix">Reuse + region mix</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
            Region
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              value={region}
              onChange={(e) => setRegion(e.target.value as RegionFilter)}
              aria-label="Region filter"
            >
              <option value="all">All regions</option>
              <option value="Northeast">Northeast</option>
              <option value="South">South</option>
              <option value="Midwest">Midwest</option>
              <option value="West">West</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
            Incentive program
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              value={incentive}
              onChange={(e) => setIncentive(e.target.value as IncentiveFilter)}
              aria-label="Incentive filter"
            >
              <option value="all">All metros</option>
              <option value="with">With city incentives</option>
              <option value="without">No named incentives</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-teal-100 bg-teal-50/60 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-teal-800">
            NYC intensity
          </p>
          <p className="text-2xl font-bold text-teal-950">
            {HEADLINE.nycUnitsPerMVacantSf}
            <span className="text-sm font-medium text-teal-700"> /M vac SF</span>
          </p>
        </div>
        <div className="rounded-lg border border-orange-100 bg-orange-50/60 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-orange-800">
            Houston intensity
          </p>
          <p className="text-2xl font-bold text-orange-950">
            {HEADLINE.houstonUnitsPerMVacantSf}
            <span className="text-sm font-medium text-orange-700"> /M vac SF</span>
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
            Incentive vs none (avg)
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {ANALYTICS.incentiveAvgIntensity}
            <span className="text-sm font-medium text-slate-500">
              {" "}
              vs {ANALYTICS.noIncentiveAvgIntensity}
            </span>
          </p>
        </div>
      </div>

      {panel === "ladder" ? (
        <ChartCard
          title="Units per million vacant square feet"
          subtitle="Higher bars = more conversion activity relative to empty office stock · filters apply"
        >
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={ladderData}
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="metro"
                  width={120}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v) => [
                    typeof v === "number" ? v.toFixed(1) : String(v ?? ""),
                    "Units / M vacant SF",
                  ]}
                />
                <Bar
                  dataKey="unitsPerMVacantSf"
                  name="Units / M vacant SF"
                  radius={[0, 4, 4, 0]}
                >
                  {ladderData.map((d) => (
                    <Cell key={d.metro} fill={QUAD_COLOR[d.quadrant]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: COLORS.active }}
              />
              Active conversion
            </span>
            <span className="inline-flex items-center gap-1">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: COLORS.balanced }}
              />
              Balanced
            </span>
            <span className="inline-flex items-center gap-1">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: COLORS.stranded }}
              />
              Vacancy-stranded
            </span>
            <span className="inline-flex items-center gap-1">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: COLORS.tight }}
              />
              Tight market
            </span>
          </div>
        </ChartCard>
      ) : null}

      {panel === "scatter" ? (
        <ChartCard
          title="Vacancy rate × conversion intensity"
          subtitle={`Bubble size ∝ pipeline units · panel corr vacancy↔intensity ≈ ${ANALYTICS.vacancyPipelineCorr}`}
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 4, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="vacancyPct"
                  name="Vacancy"
                  unit="%"
                  domain={[12, 28]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Office vacancy %",
                    position: "insideBottom",
                    offset: -4,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="unitsPerMVacantSf"
                  name="Intensity"
                  domain={[0, 240]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Units / M vacant SF",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="pipelineUnits" range={[60, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => [
                    typeof v === "number" ? v.toLocaleString() : String(v ?? ""),
                    String(name ?? ""),
                  ]}
                  labelFormatter={(_, payload) =>
                    (payload?.[0]?.payload as { metro?: string } | undefined)?.metro ?? ""
                  }
                />
                <Scatter name="Metros" data={scatterData}>
                  {scatterData.map((p) => (
                    <Cell key={p.id} fill={QUAD_COLOR[p.quadrant]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Upper-left = conversions without extreme vacancy · lower-right =
            vacant stock without a pipeline (stranded).
          </p>
        </ChartCard>
      ) : null}

      {panel === "path" ? (
        <ChartCard
          title="National pipeline path vs vacancy"
          subtitle="Start-of-year conversion units (left) against national vacancy % (right)"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={pathData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="units"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                />
                <YAxis
                  yAxisId="vac"
                  orientation="right"
                  domain={[14, 22]}
                  tick={{ fontSize: 11 }}
                  unit="%"
                />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="units"
                  type="monotone"
                  dataKey="units"
                  name="Pipeline units"
                  fill={COLORS.pipeline}
                  fillOpacity={0.2}
                  stroke={COLORS.pipeline}
                  strokeWidth={2.5}
                />
                <Line
                  yAxisId="vac"
                  type="monotone"
                  dataKey="vacancyPct"
                  name="National vacancy %"
                  stroke={COLORS.vacancy}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "costs" ? (
        <ChartCard
          title="Conversion vs ground-up cost per unit"
          subtitle="Estimated soft+hard midpoints ($k) · gap is the conversion discount before incentives"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="metro"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-28}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 11 }} unit="k" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="conversion"
                  name="Conversion $/unit (k)"
                  fill={COLORS.cost}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="groundUp"
                  name="Ground-up $/unit (k)"
                  fill={COLORS.ground}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "mix" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Adaptive-reuse source mix"
            subtitle="Share of future reuse projects by origin building type (start-2026)"
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {pieData.map((d, i) => (
                      <Cell key={d.name} fill={COLORS.pie[i % COLORS.pie.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v ?? ""}%`, "Share"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Regional pipeline share"
            subtitle="National conversion units by Census region · bars = share %"
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REGION_MIX} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="pipelineSharePct"
                    name="Pipeline share %"
                    stroke={COLORS.intensity}
                    fill={COLORS.intensity}
                    fillOpacity={0.35}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgVacancyPct"
                    name="Avg vacancy %"
                    stroke={COLORS.vacancy}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
