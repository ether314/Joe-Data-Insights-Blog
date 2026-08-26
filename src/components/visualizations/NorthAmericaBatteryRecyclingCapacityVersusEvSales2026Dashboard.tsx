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
  COUNTRY_SUMMARY,
  FEEDSTOCK_MIX,
  GAP_BARS,
  HEADLINE,
  SALES_CAPACITY_PATH,
  SOURCE_NOTE,
  TECH_MIX,
  coverageForLens,
  fmtKt,
  fmtM,
  fmtPct,
  pathCoveragePct,
  plantsFiltered,
  type CountryFilter,
  type GapLens,
  type StatusFilter,
  type TechFilter,
} from "@/data/north-america-battery-recycling-capacity-versus-ev-sales-2026-data";

// viz-types: gap bars, coverage area+line, plant ladder,
// feedstock pie, country scatter, tech stacked bars
// | layout: split-rail
// smoke-marker: Recycling tons vs pack tons

type ViewId = "gap" | "path" | "plants" | "feedstock" | "countries" | "tech";

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const SKY = "#0284c8";
const EMERALD = "#059669";

const GAP_COLORS: Record<string, string> = {
  pack: ROSE,
  operating: TEAL,
  plusUc: EMERALD,
  pretreatment: SKY,
};

const FEED_COLORS = [AMBER, INDIGO, TEAL, SLATE, ROSE];

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
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            value === o.id
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function NorthAmericaBatteryRecyclingCapacityVersusEvSales2026Dashboard() {
  const [view, setView] = useState<ViewId>("gap");
  const [lens, setLens] = useState<GapLens>("operating");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [tech, setTech] = useState<TechFilter>("all");
  const [country, setCountry] = useState<CountryFilter>("all");

  const cover = useMemo(() => coverageForLens(lens), [lens]);

  const pathData = useMemo(
    () =>
      SALES_CAPACITY_PATH.map((r) => ({
        ...r,
        coveragePct: pathCoveragePct(
          r,
          lens === "pretreatment" ? "plusUc" : lens,
        ),
        supplyKt: lens === "operating" ? r.operatingKt : r.plusUcKt,
      })),
    [lens],
  );

  const plantRows = useMemo(
    () => plantsFiltered(status, tech, country).slice(0, 12),
    [status, tech, country],
  );

  const scatterData = useMemo(
    () =>
      COUNTRY_SUMMARY.map((c) => ({
        ...c,
        x: c.packKt,
        y: lens === "operating" ? c.operatingKt : c.plusUcKt,
        z: Math.max(80, c.evSalesM * 180),
        fill:
          c.id === "usa" ? INDIGO : c.id === "canada" ? TEAL : AMBER,
      })),
    [lens],
  );

  const techBars = useMemo(
    () =>
      TECH_MIX.filter((t) => t.tech !== "pyromet").map((t) => ({
        ...t,
        total: t.operatingKt + t.ucKt,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="north-america-battery-recycling-capacity-versus-ev-sales-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">
          Recycling tons vs pack tons
        </p>
        <p className="mt-2 max-w-3xl text-2xl font-bold leading-snug sm:text-3xl">
          Operating NA recovery covers only{" "}
          <span className="text-teal-300">
            {fmtPct(HEADLINE.coverageOperatingPct)}
          </span>{" "}
          of pack mass implied by annual EV sales
        </p>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          {fmtM(HEADLINE.naEvSalesM)} light EVs × ~{HEADLINE.avgPackKg} kg
          average pack ≈ {fmtKt(HEADLINE.packTonsFromSalesKt)} of pack mass.
          Desk book of operating hydromet/hybrid recovery:{" "}
          {fmtKt(HEADLINE.operatingRecoveryKt)}. With under-construction
          nameplate: {fmtKt(HEADLINE.operatingPlusUcKt)} (
          {fmtPct(HEADLINE.coveragePlusUcPct)} coverage).
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Pack from sales
            </p>
            <p className="text-lg font-bold">{fmtKt(HEADLINE.packTonsFromSalesKt)}</p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Operating recovery
            </p>
            <p className="text-lg font-bold">
              {fmtKt(HEADLINE.operatingRecoveryKt)}
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Op + UC
            </p>
            <p className="text-lg font-bold">
              {fmtKt(HEADLINE.operatingPlusUcKt)}
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Gap (operating)
            </p>
            <p className="text-lg font-bold text-rose-300">
              {fmtKt(HEADLINE.gapOperatingKt)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup<ViewId>
          value={view}
          onChange={setView}
          options={[
            { id: "gap", label: "Capacity gap" },
            { id: "path", label: "Coverage path" },
            { id: "plants", label: "Plant book" },
            { id: "feedstock", label: "Feedstock mix" },
            { id: "countries", label: "By country" },
            { id: "tech", label: "Tech routes" },
          ]}
        />
        <ToggleGroup<GapLens>
          value={lens}
          onChange={setLens}
          options={[
            { id: "operating", label: "Operating" },
            { id: "plusUc", label: "Op + UC" },
            { id: "pretreatment", label: "Pretreatment" },
          ]}
        />
      </div>

      {view === "gap" && (
        <ChartCard
          title="Nameplate supply versus pack tons from EV sales"
          subtitle={`Selected lens covers ${fmtPct(cover.coveragePct)} of ${fmtKt(cover.packKt)} pack mass (${fmtKt(cover.gapKt)} shortfall).`}
        >
          <div className="h-[360px] w-full">
            <ResponsiveContainer>
              <BarChart
                data={GAP_BARS}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" unit=" kt" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={200}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v) => fmtKt(Number(v))}
                  labelFormatter={(l) => String(l)}
                />
                <Bar dataKey="kt" radius={[0, 6, 6, 0]}>
                  {GAP_BARS.map((r) => (
                    <Cell
                      key={r.id}
                      fill={GAP_COLORS[r.id] || SLATE}
                      opacity={
                        r.kind === "demand" || r.id === lens ? 1 : 0.45
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "path" && (
        <ChartCard
          title="Pack tons from sales vs recycling capacity build-out"
          subtitle="Area = pack mass implied by NA EV sales; lines = operating and operating+UC recovery nameplate."
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer>
              <ComposedChart
                data={pathData}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="kt"
                  tick={{ fontSize: 12 }}
                  unit=" kt"
                  width={48}
                />
                <YAxis
                  yAxisId="pct"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  unit="%"
                  width={40}
                />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="kt"
                  type="monotone"
                  dataKey="packKt"
                  name="Pack from sales"
                  fill="#fda4af"
                  stroke={ROSE}
                  fillOpacity={0.35}
                />
                <Line
                  yAxisId="kt"
                  type="monotone"
                  dataKey="operatingKt"
                  name="Operating recovery"
                  stroke={TEAL}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="kt"
                  type="monotone"
                  dataKey="plusUcKt"
                  name="Op + UC"
                  stroke={EMERALD}
                  strokeWidth={2.5}
                  strokeDasharray="5 4"
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="pct"
                  type="monotone"
                  dataKey="coveragePct"
                  name="Coverage % (lens)"
                  stroke={INDIGO}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "plants" && (
        <ChartCard
          title="Recovery plant nameplate ladder"
          subtitle="Hydromet / hybrid recovery only — pretreatment spokes excluded to avoid double-counting hubs."
        >
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ToggleGroup<StatusFilter>
              value={status}
              onChange={setStatus}
              options={[
                { id: "all", label: "All status" },
                { id: "operating", label: "Operating" },
                { id: "under_construction", label: "Under construction" },
                { id: "announced", label: "Announced" },
              ]}
            />
            <ToggleGroup<TechFilter>
              value={tech}
              onChange={setTech}
              options={[
                { id: "all", label: "All tech" },
                { id: "hydromet", label: "Hydromet" },
                { id: "hybrid", label: "Hybrid" },
              ]}
            />
            <ToggleGroup<CountryFilter>
              value={country}
              onChange={setCountry}
              options={[
                { id: "all", label: "NA" },
                { id: "usa", label: "USA" },
                { id: "canada", label: "Canada" },
                { id: "mexico", label: "Mexico" },
              ]}
            />
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer>
              <BarChart
                data={plantRows}
                layout="vertical"
                margin={{ top: 4, right: 20, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" unit=" kt" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={160}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  formatter={(v) => fmtKt(Number(v))}
                  labelFormatter={(l) => String(l)}
                />
                <Bar dataKey="capacityKt" radius={[0, 6, 6, 0]}>
                  {plantRows.map((p) => (
                    <Cell
                      key={p.id}
                      fill={
                        p.status === "operating"
                          ? TEAL
                          : p.status === "under_construction"
                            ? AMBER
                            : SLATE
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "feedstock" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="What fills lines today"
            subtitle="Manufacturing scrap still dominates commercial feedstock while EV EOL packs remain a minority share."
          >
            <div className="h-[320px] w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={FEEDSTOCK_MIX}
                    dataKey="sharePct"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {FEEDSTOCK_MIX.map((_, i) => (
                      <Cell key={i} fill={FEED_COLORS[i % FEED_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${Number(v).toFixed(0)}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Feedstock shares at operating scale"
            subtitle={`Indexed to ~${fmtKt(HEADLINE.operatingRecoveryKt)} operating recovery.`}
          >
            <div className="h-[320px] w-full">
              <ResponsiveContainer>
                <BarChart
                  data={FEEDSTOCK_MIX}
                  margin={{ top: 8, right: 12, left: 0, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-28}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} unit=" kt" />
                  <Tooltip formatter={(v) => fmtKt(Number(v))} />
                  <Bar dataKey="ktAtOperating" fill={NAVY} radius={[6, 6, 0, 0]}>
                    {FEEDSTOCK_MIX.map((_, i) => (
                      <Cell
                        key={i}
                        fill={FEED_COLORS[i % FEED_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "countries" && (
        <ChartCard
          title="Country pack tons vs recovery capacity"
          subtitle="Bubble size ≈ EV sales. Diagonal would be 1:1 coverage — every country sits well below it."
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Pack kt"
                  unit=" kt"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Pack tons from sales (kt)",
                    position: "insideBottom",
                    offset: -4,
                    style: { fontSize: 11, fill: SLATE },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Capacity"
                  unit=" kt"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Recovery capacity (kt)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: SLATE },
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[80, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => [
                    typeof v === "number" ? fmtKt(v) : String(v),
                    String(name),
                  ]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.label ?? ""
                  }
                />
                <Scatter data={scatterData}>
                  {scatterData.map((d) => (
                    <Cell key={d.id} fill={d.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2 pr-4">Country</th>
                  <th className="py-2 pr-4">EV sales</th>
                  <th className="py-2 pr-4">Pack kt</th>
                  <th className="py-2 pr-4">Op kt</th>
                  <th className="py-2 pr-4">Op+UC kt</th>
                  <th className="py-2">Op coverage</th>
                </tr>
              </thead>
              <tbody>
                {COUNTRY_SUMMARY.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100">
                    <td className="py-2 pr-4 font-medium">{c.label}</td>
                    <td className="py-2 pr-4">{fmtM(c.evSalesM)}</td>
                    <td className="py-2 pr-4">{c.packKt}</td>
                    <td className="py-2 pr-4">{c.operatingKt}</td>
                    <td className="py-2 pr-4">{c.plusUcKt}</td>
                    <td className="py-2">{fmtPct(c.coverageOpPct)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}

      {view === "tech" && (
        <ChartCard
          title="Technology route capacity (operating vs UC)"
          subtitle="North America recovery build is overwhelmingly hydromet / hybrid; pyromet-led nameplate is negligible in this book."
        >
          <div className="h-[360px] w-full">
            <ResponsiveContainer>
              <BarChart
                data={techBars}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} unit=" kt" />
                <Tooltip formatter={(v) => fmtKt(Number(v))} />
                <Legend />
                <Bar
                  dataKey="operatingKt"
                  name="Operating"
                  stackId="a"
                  fill={TEAL}
                />
                <Bar
                  dataKey="ucKt"
                  name="Under construction"
                  stackId="a"
                  fill={AMBER}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
