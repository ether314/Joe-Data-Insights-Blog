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
  EP_BREAKDOWN,
  FY_COMPLETIONS,
  HEADLINE,
  MIX_AUG_2026,
  MIX_COLORS,
  PACE_FOCUS_OPTIONS,
  PHASE_COLORS,
  SOURCE_NOTE,
  SOURCES,
  VIZ_MARKERS,
  WINDOW_OPTIONS,
  dualAxisSeries,
  filterSnapshots,
  fmtDays,
  fmtInt,
  fmtPct,
  mixCompareRows,
  scatterPendingVsAdc,
  type PaceFocusId,
  type WindowId,
} from "@/data/va-disability-claims-pending-versus-average-days-to-complete-2026-data";

// viz-types: dual-axis pending+ADC composed, backlog-share area, pending-vs-ADC scatter,
// EP peak/latest bars, mix pie, FY completions | controls: panel, window, ADC metric

type PanelId = "dual" | "share" | "scatter" | "ep" | "mix" | "fy";

const PANEL_OPTIONS: { id: PanelId; label: string }[] = [
  { id: "dual", label: "Pending vs ADC" },
  { id: "share", label: "Backlog share" },
  { id: "scatter", label: "Scatter" },
  { id: "ep", label: "EP ladder" },
  { id: "mix", label: "Claim mix" },
  { id: "fy", label: "FY completions" },
];

type AdcMetric = "adcFytd" | "adcMtd";

const ADC_OPTIONS: { id: AdcMetric; label: string }[] = [
  { id: "adcFytd", label: "ADC FYTD" },
  { id: "adcMtd", label: "ADC MTD" },
];

const GRID = "#e2e8f0";
const NAVY = "#0f172a";

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
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = opt.id === value;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={
                active
                  ? "rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white"
                  : "rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function VaDisabilityClaimsPendingVersusAverageDaysToComplete2026Dashboard() {
  const [panel, setPanel] = useState<PanelId>("dual");
  const [windowId, setWindowId] = useState<WindowId>("all");
  const [adcMetric, setAdcMetric] = useState<AdcMetric>("adcFytd");
  const [paceFocus, setPaceFocus] = useState<PaceFocusId>("pending");

  const dualRows = useMemo(() => dualAxisSeries(windowId), [windowId]);
  const scatterRows = useMemo(() => scatterPendingVsAdc(windowId), [windowId]);
  const shareRows = useMemo(
    () =>
      filterSnapshots(windowId).map((s) => ({
        label: s.label,
        backlogSharePct: s.backlogSharePct,
        backlogK: Math.round(s.backlog / 1000),
      })),
    [windowId],
  );
  const epRows = useMemo(
    () =>
      EP_BREAKDOWN.map((e) => ({
        label: e.shortLabel,
        peakK: Math.round(e.pendingPeak / 1000),
        latestK: Math.round(e.pendingLatest / 1000),
        peakBacklogShare: e.backlogSharePeakPct,
        latestBacklogShare: e.backlogShareLatestPct,
      })),
    [],
  );
  const mixRows = useMemo(() => mixCompareRows(), []);
  const pieData = useMemo(
    () =>
      MIX_AUG_2026.map((m) => ({
        name: m.label,
        value: m.pending,
        fill: MIX_COLORS[m.id] ?? "#94a3b8",
      })),
    [],
  );

  const adcKey = adcMetric;
  const adcLabel = adcMetric === "adcFytd" ? "ADC FYTD" : "ADC MTD";

  return (
    <div
      className="space-y-4"
      data-viz="va-disability-claims-pending-versus-average-days-to-complete-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 px-5 py-4 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-200/90">
          {VIZ_MARKERS[0]}
        </p>
        <p className="mt-1 text-lg font-semibold leading-snug sm:text-xl">
          Pending fell {HEADLINE.pendingDropFromPeakPct}% from the Oct 2023 peak
          of {fmtInt(HEADLINE.peakPending)}; backlog is down{" "}
          {HEADLINE.backlogDropFromPeakPct}% from its Jan 2024 crest
        </p>
        <p className="mt-2 hidden text-sm text-slate-300 sm:block">
          {VIZ_MARKERS[1]} · {VIZ_MARKERS[2]} · {VIZ_MARKERS[3]}
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <ToggleGroup
          label="Panel"
          value={panel}
          options={PANEL_OPTIONS}
          onChange={setPanel}
        />
        <ToggleGroup
          label="Window"
          value={windowId}
          options={WINDOW_OPTIONS}
          onChange={setWindowId}
        />
        <ToggleGroup
          label="ADC metric"
          value={adcMetric}
          options={ADC_OPTIONS}
          onChange={setAdcMetric}
        />
        {panel === "dual" ? (
          <ToggleGroup
            label="Left series"
            value={paceFocus}
            options={PACE_FOCUS_OPTIONS.filter(
              (o) => o.id === "pending" || o.id === "backlog",
            )}
            onChange={setPaceFocus}
          />
        ) : null}
      </div>

      {panel === "dual" ? (
        <ChartCard
          title="Rating-bundle inventory vs average days to complete"
          subtitle={`Bars = ${paceFocus === "pending" ? "pending inventory" : "backlog >125 days"} (thousands). Line = ${adcLabel}.`}
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={dualRows}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#475569", fontSize: 11 }}
                  interval={0}
                  angle={-28}
                  textAnchor="end"
                  height={70}
                />
                <YAxis
                  yAxisId="inv"
                  tick={{ fill: "#475569", fontSize: 12 }}
                  tickFormatter={(v) => `${v}k`}
                />
                <YAxis
                  yAxisId="adc"
                  orientation="right"
                  tick={{ fill: "#475569", fontSize: 12 }}
                  tickFormatter={(v) => `${v}d`}
                  domain={[50, 170]}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = Number(value);
                    if (String(name).includes("ADC") || String(name).includes("ADP"))
                      return [fmtDays(n), String(name)];
                    return [`${fmtInt(n * 1000)}`, String(name)];
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="inv"
                  dataKey={paceFocus === "pending" ? "pendingK" : "backlogK"}
                  name={paceFocus === "pending" ? "Pending (000s)" : "Backlog (000s)"}
                  fill={paceFocus === "pending" ? "#0ea5e9" : "#f43f5e"}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                />
                <Line
                  yAxisId="adc"
                  type="monotone"
                  dataKey={adcKey}
                  name={adcLabel}
                  stroke="#e11d48"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: "#e11d48" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Marker: {VIZ_MARKERS[1]}. Early-month ADC MTD can spike when few claims
            have completed; FYTD is stabler across fiscal resets.
          </p>
        </ChartCard>
      ) : null}

      {panel === "share" ? (
        <ChartCard
          title="Backlog share of pending inventory"
          subtitle="Percent of rating-bundle claims pending more than 125 days (VBA’s backlog definition)."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={shareRows}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#475569", fontSize: 11 }}
                  interval={0}
                  angle={-28}
                  textAnchor="end"
                  height={70}
                />
                <YAxis
                  tick={{ fill: "#475569", fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 45]}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = Number(value);
                    if (String(name).includes("share")) return [fmtPct(n), "Backlog share"];
                    return [`${fmtInt(n)}k`, "Backlog"];
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="backlogSharePct"
                  name="Backlog share %"
                  fill="#fda4af"
                  stroke="#e11d48"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="backlogK"
                  name="Backlog (000s)"
                  stroke={NAVY}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Share peaked near {fmtPct(39.8)} in Jan 2024 even as inventory edged down
            from the Oct 2023 pending peak — aging claims, not new filings alone.
          </p>
        </ChartCard>
      ) : null}

      {panel === "scatter" ? (
        <ChartCard
          title="Pending inventory vs ADC FYTD"
          subtitle="Each MMWR snapshot as pending (x, thousands) against fiscal-year average days to complete (y). Color = phase."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 4, bottom: 12 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="pendingK"
                  name="Pending (000s)"
                  tick={{ fill: "#475569", fontSize: 12 }}
                  unit="k"
                />
                <YAxis
                  type="number"
                  dataKey="adc"
                  name="ADC FYTD"
                  tick={{ fill: "#475569", fontSize: 12 }}
                  unit="d"
                  domain={[70, 160]}
                />
                <ZAxis type="number" dataKey="backlogSharePct" range={[60, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    const n = Number(value);
                    if (String(name) === "adc") return [fmtDays(n), "ADC FYTD"];
                    if (String(name) === "pendingK") return [`${fmtInt(n)}k`, "Pending"];
                    return [fmtPct(n), "Backlog share"];
                  }}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.label
                      ? String(payload[0].payload.label)
                      : ""
                  }
                />
                <Scatter name="Snapshots" data={scatterRows}>
                  {scatterRows.map((row) => (
                    <Cell
                      key={row.label}
                      fill={PHASE_COLORS[row.phase as keyof typeof PHASE_COLORS]}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Recovery and post-recovery points cluster lower-left: fewer pending claims
            and shorter FYTD completion times after the PACT Act surge.
          </p>
        </ChartCard>
      ) : null}

      {panel === "ep" ? (
        <ChartCard
          title="End-product pending: peak vs latest"
          subtitle="Major rating-bundle end products — Oct 28, 2023 peak week vs Aug 22, 2026 (thousands pending)."
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={epRows}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tick={{ fill: "#475569", fontSize: 12 }}
                  tickFormatter={(v) => `${v}k`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={150}
                  tick={{ fill: "#475569", fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${fmtInt(Number(value) * 1000)}`,
                    String(name),
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="peakK"
                  name="Oct 2023 peak"
                  fill="#f43f5e"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="latestK"
                  name="Aug 2026"
                  fill="#0ea5e9"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            EP 020 (increases) still dominates volume; EP 010 complex originals keep the
            highest backlog share even after the drawdown.
          </p>
        </ChartCard>
      ) : null}

      {panel === "mix" ? (
        <ChartCard
          title="Original vs supplemental mix"
          subtitle="Left: Aug 2026 pending mix. Right: peak vs latest pending by entitlement class (000s)."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${String(name).split(" ")[0]} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [fmtInt(Number(value)), "Pending"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mixRows}
                  margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                >
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 11 }} />
                  <YAxis
                    tick={{ fill: "#475569", fontSize: 12 }}
                    tickFormatter={(v) => `${v}k`}
                  />
                  <Tooltip
                    formatter={(value) => [`${fmtInt(Number(value) * 1000)}`, ""]}
                  />
                  <Legend />
                  <Bar dataKey="peakPendingK" name="Oct 2023" fill="#fb7185" />
                  <Bar dataKey="latestPendingK" name="Aug 2026" fill="#38bdf8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartCard>
      ) : null}

      {panel === "fy" ? (
        <ChartCard
          title="Fiscal-year completions"
          subtitle="Compensation and pension claims completed per fiscal year (millions). FY2023 carried from VA remarks; FY2024–25 from VA press."
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={FY_COMPLETIONS}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "#475569", fontSize: 12 }}
                  tickFormatter={(v) => `${v}M`}
                />
                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toFixed(2)}M`,
                    "Completions",
                  ]}
                />
                <Bar
                  dataKey="completionsM"
                  name="Completions (millions)"
                  fill="#0369a1"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={72}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Throughput rose from ~1.9M (FY2023) to a record 3.00M in FY2025 — the
            production engine behind the inventory and ADC drawdown.
          </p>
        </ChartCard>
      ) : null}

      <details className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <summary className="cursor-pointer font-semibold text-slate-800">
          Sources & caveats
        </summary>
        <p className="mt-2 leading-relaxed">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-700 underline-offset-2 hover:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
