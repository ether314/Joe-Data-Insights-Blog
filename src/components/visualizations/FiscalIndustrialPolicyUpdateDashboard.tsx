"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  ACTIVITY_SCATTER,
  EU_VS_WEST_GREEN_SUBSIDY,
  GREEN_INSTRUMENT_MIX,
  HEADLINE,
  H1_ACTIVITY,
  SOURCE_NOTE,
  SOURCES,
  deltasFor,
  fmtInt,
  fmtPct,
  fmtPp,
  motiveRowsFor,
  type DeltaBarRow,
  type MotiveVintageRow,
} from "@/data/fiscal-industrial-policy-update-2026-data";

// viz-types: diverging-delta-bar, motive-dumbbell, stacked-instrument, dual-line-h1, activity-scatter | layout: default
// viz-plan: vintage Δ bars; prior→new motive dumbbell; green instrument stack; H1 total vs green lines; scatter; geography + delta-group controls

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

type GeoFilter = MotiveVintageRow["geography"] | "All";
type DeltaGroup = DeltaBarRow["group"] | "All";

const COLORS = {
  prior: "#94a3b8",
  neu: "#0f766e",
  up: "#be123c",
  down: "#0369a1",
  subsidy: "#4f46e5",
  importBar: "#dc2626",
  other: "#64748b",
  total: "#0f766e",
  green: "#ca8a04",
  eu: "#2563eb",
  west: "#9333ea",
};

export function FiscalIndustrialPolicyUpdateDashboard() {
  const [geo, setGeo] = useState<GeoFilter>("G7+KR+AU");
  const [deltaGroup, setDeltaGroup] = useState<DeltaGroup>("All");

  const motives = useMemo(() => motiveRowsFor(geo), [geo]);
  const deltas = useMemo(() => deltasFor(deltaGroup), [deltaGroup]);

  const deltaBars = useMemo(
    () =>
      [...deltas]
        .map((d) => ({
          id: d.id,
          label: d.label,
          value: d.delta,
          fill: d.delta >= 0 ? COLORS.up : COLORS.down,
          priorValue: d.priorValue,
          newValue: d.newValue,
          priorLabel: d.priorLabel,
          newLabel: d.newLabel,
          unit: d.unit,
        }))
        .sort((a, b) => b.value - a.value),
    [deltas]
  );

  const dumbbell = useMemo(
    () =>
      motives.map((m) => ({
        key: `${m.geography}-${m.shortLabel}`,
        label: `${m.shortLabel} (${m.geography})`,
        prior: m.priorPct,
        neu: m.newPct,
        geography: m.geography,
      })),
    [motives]
  );

  const instrumentChart = useMemo(
    () =>
      GREEN_INSTRUMENT_MIX.map((r) => ({
        instrument: r.shortLabel,
        prior: r.priorPct,
        neu: r.newPct,
      })),
    []
  );

  const h1Lines = useMemo(
    () =>
      H1_ACTIVITY.map((r) => ({
        year: String(r.year),
        total: r.totalMeasures,
        green: r.greenMeasures,
        greenShare: r.greenSharePct,
      })),
    []
  );

  const euWest = useMemo(
    () =>
      EU_VS_WEST_GREEN_SUBSIDY.map((r) => ({
        vintage: r.vintage,
        EU: r.euSubsidyPct,
        West: r.westGreenSubsidyPct,
      })),
    []
  );

  return (
    <div className="space-y-6" data-viz="fiscal-industrial-policy-update-2026">
      <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — Jul research (H-NIPO/2023 NIPO) → GTA 2025 NIPO print
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          G7+KR+AU security motives {fmtPct(HEADLINE.westSecurityMotivePriorPct)} →{" "}
          {fmtPct(HEADLINE.westSecurityMotiveNewPct)} ({fmtPp(HEADLINE.westSecurityMotiveDeltaPp)})
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Climate justifications fall {fmtPp(HEADLINE.westClimateMotiveDeltaPp)}. Inside Western{" "}
          <em>green</em> measures, import barriers jump from under {fmtPct(HEADLINE.greenImportBarrierPriorPct)}{" "}
          to {fmtPct(HEADLINE.greenImportBarrierNewPct)} while subsidy share halves. H1 green counts drop{" "}
          {fmtInt(HEADLINE.h1GreenMeasures2024)} → {fmtInt(HEADLINE.h1GreenMeasures2025)} even as total
          industrial-policy activity stays near prior-year levels.
        </p>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Motive geography
            </span>
            {(
              [
                ["G7+KR+AU", "G7+KR+AU"],
                ["EU", "EU"],
                ["Western (H1)", "West H1"],
                ["Non-Western", "Non-West"],
                ["All", "All"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setGeo(id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  geo === id
                    ? "bg-teal-800 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Delta group
            </span>
            {(
              [
                ["All", "All Δ"],
                ["motive", "Motives"],
                ["instrument", "Instruments"],
                ["activity", "Activity"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setDeltaGroup(id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  deltaGroup === id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Vintage change (percentage points / counts)"
          subtitle="New GTA 2025 print minus prior window — filter with Delta group"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart
                data={deltaBars}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={148}
                  tick={{ fill: "#334155", fontSize: 10, fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as (typeof deltaBars)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.label}</p>
                        <p className="text-slate-500">
                          {row.priorLabel}: {row.priorValue}
                          {row.unit === "count" ? "" : "%"}
                        </p>
                        <p className="text-slate-700">
                          {row.newLabel}: {row.newValue}
                          {row.unit === "count" ? "" : "%"}
                        </p>
                        <p className="font-medium text-slate-900">
                          Δ {row.value > 0 ? "+" : ""}
                          {row.value}
                          {row.unit === "count" ? "" : " pp"}
                        </p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={26}>
                  {deltaBars.map((d) => (
                    <Cell key={d.id} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Motive shares: prior → 2025 (dumbbell)"
          subtitle="Hollow-style prior vs solid new — toggle Motive geography"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart
                data={dumbbell}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 70]}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={132}
                  tick={{ fill: "#334155", fontSize: 10, fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as (typeof dumbbell)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.label}</p>
                        <p className="text-slate-500">Prior: {fmtPct(row.prior)}</p>
                        <p className="text-teal-800">2025: {fmtPct(row.neu)}</p>
                      </div>
                    );
                  }}
                />
                <Legend />
                <Bar dataKey="prior" name="Prior window" fill={COLORS.prior} radius={[0, 4, 4, 0]} maxBarSize={12} />
                <Bar dataKey="neu" name="2025 print" fill={COLORS.neu} radius={[0, 4, 4, 0]} maxBarSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Green IP toolkit: subsidies vs import barriers"
          subtitle="Share of Western green industrial measures — ZG #70"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={instrumentChart} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="instrument" tick={{ fill: "#334155", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 80]}
                />
                <Tooltip
                  formatter={(value) => fmtPct(Number(value))}
                  contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }}
                />
                <Legend />
                <Bar dataKey="prior" name="2023–24" fill={COLORS.prior} radius={[4, 4, 0, 0]} />
                <Bar dataKey="neu" name="2025" fill={COLORS.importBar} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="EU still subsidises green IP — West average does not"
          subtitle="Subsidy share of green measures: EU vs Western average"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={euWest} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="vintage" tick={{ fill: "#334155", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 100]}
                />
                <Tooltip
                  formatter={(value) => fmtPct(Number(value))}
                  contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }}
                />
                <Legend />
                <Bar dataKey="EU" fill={COLORS.eu} radius={[4, 4, 0, 0]} />
                <Bar dataKey="West" fill={COLORS.west} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="H1 activity: total IP vs green subset"
          subtitle="Jan–Jun windows — total activity holds; green counts collapse (ZG #67)"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={h1Lines} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fill: "#334155", fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  domain={[0, 900]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  domain={[0, 80]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as (typeof h1Lines)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">H1 {row.year}</p>
                        <p className="text-teal-800">Total: {fmtInt(row.total)}</p>
                        <p className="text-amber-700">Green: {fmtInt(row.green)}</p>
                        <p className="text-slate-500">Green share: {fmtPct(row.greenShare, 1)}</p>
                      </div>
                    );
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="total"
                  name="Total measures"
                  stroke={COLORS.total}
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="green"
                  name="Green measures"
                  stroke={COLORS.green}
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Composition shift: total vs green (scatter)"
          subtitle="Bubble size ≈ green share of H1 interventions"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <ScatterChart margin={{ top: 12, right: 24, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="totalMeasures"
                  name="Total H1 measures"
                  domain={[700, 850]}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  label={{ value: "Total H1 measures", position: "insideBottom", offset: -4, fill: "#64748b", fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="greenMeasures"
                  name="Green measures"
                  domain={[20, 80]}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  label={{ value: "Green", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="greenMeasures" range={[120, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as (typeof ACTIVITY_SCATTER)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.label}</p>
                        <p className="text-slate-600">Total: {fmtInt(row.totalMeasures)}</p>
                        <p className="text-amber-700">Green: {fmtInt(row.greenMeasures)}</p>
                      </div>
                    );
                  }}
                />
                <Scatter name="H1 windows" data={ACTIVITY_SCATTER} fill={COLORS.neu}>
                  {ACTIVITY_SCATTER.map((p) => (
                    <Cell
                      key={p.label}
                      fill={p.year === 2025 ? COLORS.up : COLORS.neu}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} className="text-teal-800 underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
