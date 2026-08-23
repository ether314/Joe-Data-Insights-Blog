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
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ANNUAL_TAPE,
  CLASS_ROWS,
  COHORT_PATH,
  EXIT_REASONS,
  HEADLINE,
  LAG_SCATTER,
  ROOT_CAUSES,
  SOURCE_NOTE,
  indexForSegment,
  medianMfrForSegment,
  type SegmentId,
} from "@/data/generic-price-declines-versus-manufacturer-exits-2026-data";

type Panel = "tape" | "lag" | "classes" | "structure";
type EraFilter = "all" | "pre-erosion" | "steep-decline" | "trough" | "stabilizing";

const COLORS = {
  oral: "#0ea5e9",
  inj: "#8b5cf6",
  combined: "#2563eb",
  exit: "#dc2626",
  shortage: "#f59e0b",
  mfr: "#059669",
  muted: "#64748b",
  pre: "#64748b",
  steep: "#ea580c",
  trough: "#dc2626",
  stabilizing: "#2563eb",
};

const ERA_COLOR: Record<string, string> = {
  "pre-erosion": COLORS.pre,
  "steep-decline": COLORS.steep,
  trough: COLORS.trough,
  stabilizing: COLORS.stabilizing,
};

const PIE_COLORS = ["#0ea5e9", "#dc2626", "#f59e0b", "#8b5cf6", "#059669"];

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

function segmentLabel(s: SegmentId): string {
  if (s === "oral-solid") return "Oral solids";
  if (s === "injectable") return "Sterile injectables";
  return "Combined multi-source";
}

export function GenericPriceDeclinesVersusManufacturerExits2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("tape");
  const [segment, setSegment] = useState<SegmentId>("oral-solid");
  const [eraFilter, setEraFilter] = useState<EraFilter>("all");

  const tapeData = useMemo(
    () =>
      ANNUAL_TAPE.map((r) => ({
        year: r.year,
        priceIndex: indexForSegment(r, segment),
        exits: r.exits,
        shortagesActive: r.shortagesActive,
        shortagesNew: r.shortagesNew,
        medianMfr: medianMfrForSegment(r, segment),
      })),
    [segment],
  );

  const lagData = useMemo(() => {
    if (eraFilter === "all") return LAG_SCATTER;
    return LAG_SCATTER.filter((p) => p.era === eraFilter);
  }, [eraFilter]);

  const classBars = useMemo(
    () =>
      [...CLASS_ROWS].map((c) => ({
        ...c,
        shortLabel: c.label.length > 18 ? `${c.label.slice(0, 16)}…` : c.label,
      })),
    [],
  );

  const rootPie = useMemo(
    () => ROOT_CAUSES.map((r) => ({ name: r.label, value: r.sharePct })),
    [],
  );

  const exitPie = useMemo(
    () => EXIT_REASONS.map((r) => ({ name: r.label, value: r.sharePct })),
    [],
  );

  const priceColor =
    segment === "oral-solid" ? COLORS.oral : segment === "injectable" ? COLORS.inj : COLORS.combined;

  return (
    <div
      className="space-y-6"
      data-viz="generic-price-declines-versus-manufacturer-exits-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
          Price decline vs exit lag
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Oral-solid generics fell ~{HEADLINE.oralSolidDropPct}% peak-to-trough; exits peaked ~
          {HEADLINE.lagQuarters} quarters later
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          SSR indexes · FDA exits · shortage tape — {HEADLINE.exitsPeakCount.toLocaleString()}{" "}
          manufacturer exits in {HEADLINE.exitsPeakYear} versus {HEADLINE.exits2015.toLocaleString()}{" "}
          in 2015; economic root causes ~{HEADLINE.economicRootSharePct}% of shortage attributions.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Panel
          <select
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            value={panel}
            onChange={(e) => setPanel(e.target.value as Panel)}
          >
            <option value="tape">Price × exits × shortages</option>
            <option value="lag">Lag scatter</option>
            <option value="classes">Therapeutic classes</option>
            <option value="structure">Survivors & root causes</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Segment
          <select
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            value={segment}
            onChange={(e) => setSegment(e.target.value as SegmentId)}
          >
            <option value="oral-solid">Oral solids</option>
            <option value="injectable">Sterile injectables</option>
            <option value="combined">Combined</option>
          </select>
        </label>
        {panel === "lag" ? (
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
            Era filter
            <select
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              value={eraFilter}
              onChange={(e) => setEraFilter(e.target.value as EraFilter)}
            >
              <option value="all">All eras</option>
              <option value="pre-erosion">Pre-erosion</option>
              <option value="steep-decline">Steep decline</option>
              <option value="trough">Trough</option>
              <option value="stabilizing">Stabilizing</option>
            </select>
          </label>
        ) : null}
      </div>

      {panel === "tape" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={`${segmentLabel(segment)} price vs manufacturer exits`}
            subtitle="Index 2012=100 (left); annual exits (right)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={tapeData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="idx"
                    tick={{ fontSize: 11 }}
                    domain={[0, "auto"]}
                    label={{ value: "Index", angle: -90, position: "insideLeft", fontSize: 11 }}
                  />
                  <YAxis
                    yAxisId="ex"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    domain={[0, "auto"]}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="ex" dataKey="exits" name="Manufacturer exits" fill={COLORS.exit} opacity={0.75} />
                  <Line
                    yAxisId="idx"
                    type="monotone"
                    dataKey="priceIndex"
                    name="Price index"
                    stroke={priceColor}
                    strokeWidth={2.5}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Shortage tape and manufacturer depth"
            subtitle="Active FDA shortage listings; median ANDA holders per multi-source family"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={tapeData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="sh" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="mfr" orientation="right" tick={{ fontSize: 11 }} domain={[0, 6]} />
                  <Tooltip />
                  <Legend />
                  <Area
                    yAxisId="sh"
                    type="monotone"
                    dataKey="shortagesActive"
                    name="Active shortages"
                    fill={COLORS.shortage}
                    stroke={COLORS.shortage}
                    fillOpacity={0.25}
                  />
                  <Bar
                    yAxisId="sh"
                    dataKey="shortagesNew"
                    name="New shortage reports"
                    fill="#fb923c"
                    opacity={0.85}
                  />
                  <Line
                    yAxisId="mfr"
                    type="monotone"
                    dataKey="medianMfr"
                    name="Median manufacturers"
                    stroke={COLORS.mfr}
                    strokeWidth={2.5}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {panel === "lag" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Price at t vs exits at t+~7Q"
            subtitle="Each point: combined index in year t against exits ~6–8 quarters later"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="priceIndex"
                    name="Price index"
                    tick={{ fontSize: 11 }}
                    domain={[40, 110]}
                    label={{ value: "Price index (t)", position: "insideBottom", offset: -2, fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="exitsLagged"
                    name="Lagged exits"
                    tick={{ fontSize: 11 }}
                    label={{ value: "Exits (t+lag)", angle: -90, position: "insideLeft", fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="year" range={[60, 160]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="Year cohorts" data={lagData}>
                    {lagData.map((p) => (
                      <Cell key={p.year} fill={ERA_COLOR[p.era] ?? COLORS.muted} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="YoY price change vs lagged exit intensity"
            subtitle="Steeper declines map to higher subsequent exits"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={lagData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="yoy" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="ex" orientation="right" tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="yoy" dataKey="priceYoY" name="Price YoY %" fill={COLORS.oral} opacity={0.8} />
                  <Line
                    yAxisId="ex"
                    type="monotone"
                    dataKey="exitsLagged"
                    name="Lagged exits"
                    stroke={COLORS.exit}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {panel === "classes" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Price drop vs exit and shortage intensity by class"
            subtitle="Indexes: 100 = multi-source average; oncology supportive & anesthetics lead shortages"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={classBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="shortLabel" width={110} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="priceDropPct" name="Price drop %" fill={COLORS.oral} />
                  <Bar dataKey="exitIndex" name="Exit intensity" fill={COLORS.exit} />
                  <Bar dataKey="shortageIndex" name="Shortage intensity" fill={COLORS.shortage} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Exit lag and remaining manufacturers by class"
            subtitle="Shorter lag + thinner manufacturer bench → shortage risk"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="lagQuarters"
                    name="Lag quarters"
                    domain={[4, 9]}
                    tick={{ fontSize: 11 }}
                    label={{ value: "Lag (quarters)", position: "insideBottom", offset: -2, fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="medianMfr2026"
                    name="Median mfrs"
                    domain={[1, 4]}
                    tick={{ fontSize: 11 }}
                    label={{ value: "Median mfrs 2026", angle: -90, position: "insideLeft", fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="shortageIndex" range={[80, 400]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="Classes" data={classBars} fill={COLORS.inj}>
                    {classBars.map((c) => (
                      <Cell
                        key={c.id}
                        fill={c.shortageIndex > 140 ? COLORS.exit : c.shortageIndex > 100 ? COLORS.shortage : COLORS.oral}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {panel === "structure" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Survivor cohort and volume concentration"
            subtitle="% of 2014 ANDA holders still active; top-5 volume share"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={COHORT_PATH} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="oralSolidSurvivorsPct"
                    name="Oral-solid survivors %"
                    stroke={COLORS.oral}
                    fill={COLORS.oral}
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="injectableSurvivorsPct"
                    name="Injectable survivors %"
                    stroke={COLORS.inj}
                    fill={COLORS.inj}
                    fillOpacity={0.2}
                  />
                  <Line
                    type="monotone"
                    dataKey="top5InjVolPct"
                    name="Top-5 injectable vol %"
                    stroke={COLORS.exit}
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <div className="grid gap-6">
            <ChartCard
              title="FDA shortage root-cause shares"
              subtitle="Quality leads; economic (price/margin) close second"
            >
              <div className="h-56 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={rootPie}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {rootPie.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Stated reasons among manufacturer exits" subtitle="Desk composite of exit attributions">
              <div className="h-56 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={exitPie} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} angle={-25} textAnchor="end" />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" name="Share %" fill={COLORS.combined}>
                      {exitPie.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
