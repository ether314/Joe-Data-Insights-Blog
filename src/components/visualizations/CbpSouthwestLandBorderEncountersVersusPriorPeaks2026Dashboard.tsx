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
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  FY_TOTALS,
  HEADLINE,
  METRIC_OPTIONS,
  PEAK_MIX,
  PEAK_MIX_PIE,
  PHASE_COLORS,
  SAME_MONTH_LADDER,
  SOURCE_NOTE,
  SOURCES,
  VIZ_MARKERS,
  WINDOW_OPTIONS,
  calendarOverlay,
  dualPeakSeries,
  fmtInt,
  fmtPct,
  shareOfPeak,
  type MetricId,
  type WindowId,
} from "@/data/cbp-southwest-land-border-encounters-versus-prior-peaks-2026-data";

// viz-types: dual peak-ratio composed, same-month ladder bars, USBP/OFO pie,
// FY stack bars, calendar overlay lines, share-of-peak area
// | controls: panel, window, metric

type PanelId = "dual" | "ladder" | "mix" | "fy" | "overlay" | "ribbon";

const PANEL_OPTIONS: { id: PanelId; label: string }[] = [
  { id: "dual", label: "Peak path" },
  { id: "ribbon", label: "Peak-ratio ribbon" },
  { id: "ladder", label: "Same-month ladder" },
  { id: "mix", label: "USBP vs OFO mix" },
  { id: "fy", label: "Fiscal-year stack" },
  { id: "overlay", label: "Calendar overlay" },
];

const GRID = "#e2e8f0";
const NAVY = "#0f172a";
const TEAL = "#0f766e";
const RED = "#b91c1c";

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

export function CbpSouthwestLandBorderEncountersVersusPriorPeaks2026Dashboard() {
  const [panel, setPanel] = useState<PanelId>("dual");
  const [windowId, setWindowId] = useState<WindowId>("all");
  const [metric, setMetric] = useState<MetricId>("usbp");

  const dual = useMemo(() => dualPeakSeries(windowId), [windowId]);
  const overlay = useMemo(() => calendarOverlay(), []);
  const ladder = useMemo(
    () =>
      SAME_MONTH_LADDER.filter((r) => r.y2022 != null || r.y2023 != null).map((r) => ({
        ...r,
        y2022K: r.y2022 != null ? Math.round(r.y2022 / 1000) : null,
        y2023K: r.y2023 != null ? Math.round(r.y2023 / 1000) : null,
        latestK: r.latest != null ? Math.round(r.latest / 1000) : null,
      })),
    [],
  );
  const mixBars = useMemo(
    () =>
      PEAK_MIX.map((r) => ({
        label: r.label,
        usbpK: Math.round(r.usbp / 1000),
        ofoK: r.ofo != null ? Math.round(r.ofo / 1000) : 0,
        hasOfo: r.ofo != null,
      })),
    [],
  );
  const fyBars = useMemo(
    () =>
      FY_TOTALS.map((r) => ({
        fy: r.fy,
        usbpM: Math.round((r.usbp / 1_000_000) * 100) / 100,
        usbp: r.usbp,
        complete: r.complete,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="cbp-southwest-land-border-encounters-versus-prior-peaks-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-200/90">
          {VIZ_MARKERS[0]}
        </p>
        <p className="mt-2 max-w-3xl text-2xl font-bold leading-snug sm:text-3xl">
          July 2026 USBP encounters were {fmtPct(HEADLINE.latestShareOfPeakPct)} of the
          December 2023 peak
        </p>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          {fmtInt(HEADLINE.latestUsbp)} in {HEADLINE.latestLabel} versus{" "}
          {fmtInt(HEADLINE.peakUsbp)} in {HEADLINE.peakUsbpLabel} — a{" "}
          {fmtPct(HEADLINE.dropFromPeakPct)} drop on the continuous Border Patrol series.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Dec 2023 peak</p>
            <p className="text-lg font-semibold tabular-nums">{fmtInt(HEADLINE.peakUsbp)}</p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Jul 2026</p>
            <p className="text-lg font-semibold tabular-nums">{fmtInt(HEADLINE.latestUsbp)}</p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Share of peak</p>
            <p className="text-lg font-semibold tabular-nums">
              {fmtPct(HEADLINE.latestShareOfPeakPct)}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">FY2025 USBP</p>
            <p className="text-lg font-semibold tabular-nums">{fmtInt(HEADLINE.fy2025Usbp)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <ToggleGroup label="Panel" value={panel} options={PANEL_OPTIONS} onChange={setPanel} />
        <ToggleGroup
          label="Window"
          value={windowId}
          options={WINDOW_OPTIONS}
          onChange={setWindowId}
        />
        <ToggleGroup label="Metric" value={metric} options={METRIC_OPTIONS} onChange={setMetric} />
      </div>

      {panel === "dual" ? (
        <ChartCard
          title="Monthly SW border encounters vs prior peak"
          subtitle="USBP southwest land-border encounters; optional OFO-inclusive totals where published"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dual} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  domain={[0, 110]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip />
                <Legend />
                {metric === "total" ? (
                  <Bar
                    yAxisId="left"
                    dataKey="total"
                    name="USBP + OFO"
                    fill="#38bdf8"
                    opacity={0.55}
                  />
                ) : null}
                <Bar yAxisId="left" dataKey="usbp" name="USBP" fill={NAVY} radius={[2, 2, 0, 0]}>
                  {dual.map((d) => (
                    <Cell key={d.date} fill={d.fill} />
                  ))}
                </Bar>
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="shareOfPeakPct"
                  name="% of Dec 2023 peak"
                  stroke={TEAL}
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "ribbon" ? (
        <ChartCard
          title="Peak-ratio ribbon"
          subtitle="Each month as a share of the December 2023 USBP peak (249,740)"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dual} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 110]} tickFormatter={(v) => `${v}%`} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="shareOfPeakPct"
                  name="Share of peak"
                  stroke={TEAL}
                  fill="#99f6e4"
                  fillOpacity={0.55}
                />
                <Line
                  type="monotone"
                  dataKey={() => 100}
                  name="Peak = 100%"
                  stroke={RED}
                  strokeDasharray="4 4"
                  dot={false}
                  legendType="none"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Latest month ({HEADLINE.latestLabel}): {fmtPct(shareOfPeak(HEADLINE.latestUsbp))} of
            peak.
          </p>
        </ChartCard>
      ) : null}

      {panel === "ladder" ? (
        <ChartCard
          title="Same-month ladder"
          subtitle="2022 and 2023 USBP months versus the latest available same calendar month"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ladder} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}k`} />
                <Tooltip />
                <Legend />
                <Bar dataKey="y2022K" name="2022 (k)" fill="#94a3b8" />
                <Bar dataKey="y2023K" name="2023 (k)" fill={RED} />
                <Bar dataKey="latestK" name="Latest (k)" fill={TEAL} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "mix" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="USBP vs OFO peak mix"
            subtitle="Full CBP southwest land-border encounters at selected peaks"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mixBars} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}k`} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="usbpK" name="USBP (k)" stackId="a" fill={NAVY} />
                  <Bar dataKey="ofoK" name="OFO (k)" stackId="a" fill="#38bdf8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Jul 2026 shows USBP only on the FY2026 nationwide table (*).
            </p>
          </ChartCard>
          <ChartCard
            title="December 2023 composition"
            subtitle="Share of the ~302k full-encounter peak"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[...PEAK_MIX_PIE]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, percent }) =>
                      `${(name ?? "").split(" ")[0]} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {PEAK_MIX_PIE.map((e) => (
                      <Cell key={e.name} fill={e.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {panel === "fy" ? (
        <ChartCard
          title="Fiscal-year stack"
          subtitle="USBP southwest land-border encounters by federal fiscal year"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fyBars} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="fy" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}M`} />
                <Tooltip
                  formatter={(value, _n, item) => {
                    const row = item?.payload as { usbp?: number };
                    return row?.usbp != null ? fmtInt(row.usbp) : String(value);
                  }}
                />
                <Bar dataKey="usbpM" name="USBP (millions)" radius={[4, 4, 0, 0]}>
                  {fyBars.map((r) => (
                    <Cell key={r.fy} fill={r.complete ? NAVY : TEAL} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
            {FY_TOTALS.map((r) => (
              <li key={r.fy}>
                <span className="font-semibold text-slate-800">{r.fy}:</span> {r.note}
              </li>
            ))}
          </ul>
        </ChartCard>
      ) : null}

      {panel === "overlay" ? (
        <ChartCard
          title="Calendar-month overlay"
          subtitle="Seasonal shape of 2022 and 2023 versus 2026 YTD months"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overlay} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="y2022"
                  name="2022"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="y2023"
                  name="2023"
                  stroke={RED}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="y2026"
                  name="2026"
                  stroke={TEAL}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
        <p className="font-semibold text-slate-800">Sources & caveats</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                className="text-teal-800 underline-offset-2 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] text-slate-400">
          Phase colors: buildup {PHASE_COLORS.buildup}, peak {PHASE_COLORS.peak}, easing{" "}
          {PHASE_COLORS.easing}, collapse {PHASE_COLORS.collapse}, floor {PHASE_COLORS.floor}.
        </p>
      </div>
    </div>
  );
}
