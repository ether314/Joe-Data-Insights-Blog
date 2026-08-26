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
  ANNUAL_EXITS,
  EXIT_REASON_COLORS,
  FY2023_DURATION_BUCKETS,
  GLANCE_VOLUMES,
  HEADLINE,
  MIX_FOCUS_OPTIONS,
  PERMANENCY_PACE,
  SOURCE_NOTE,
  SOURCES,
  VIZ_MARKERS,
  dualAxisSeries,
  fmtInt,
  fmtMonths,
  fmtPct,
  scatterExitVsMedian,
  stackedMixRows,
  type MixFocusId,
} from "@/data/afcars-exit-reasons-versus-median-time-in-care-2026-data";

// viz-types: dual-axis mix+median composed, stacked area exit mix, scatter mix vs median,
// duration horizontal bars, permanency pace bars | controls: panel, mix focus, year window

type PanelId = "dual" | "stack" | "scatter" | "duration" | "pace" | "volume";

const PANEL_OPTIONS: { id: PanelId; label: string }[] = [
  { id: "dual", label: "Mix vs median" },
  { id: "stack", label: "Exit mix stack" },
  { id: "scatter", label: "Scatter" },
  { id: "duration", label: "FY23 duration" },
  { id: "pace", label: "Permanency pace" },
  { id: "volume", label: "Volume ladder" },
];

type YearWindow = "all" | "post2019";

const YEAR_OPTIONS: { id: YearWindow; label: string }[] = [
  { id: "all", label: "FY2019–FY2023" },
  { id: "post2019", label: "After FY2019" },
];

const NAVY = "#0f172a";
const GRID = "#e2e8f0";

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

function yearsForWindow(window: YearWindow): number[] {
  if (window === "post2019") return [2020, 2021, 2022, 2023];
  return ANNUAL_EXITS.map((r) => r.fy);
}

export function AfcarsExitReasonsVersusMedianTimeInCare2026Dashboard() {
  const [panel, setPanel] = useState<PanelId>("dual");
  const [focus, setFocus] = useState<MixFocusId>("reunification");
  const [yearWindow, setYearWindow] = useState<YearWindow>("all");

  const years = useMemo(() => yearsForWindow(yearWindow), [yearWindow]);
  const focusLabel =
    MIX_FOCUS_OPTIONS.find((o) => o.id === focus)?.label ?? focus;

  const dualRows = useMemo(
    () => dualAxisSeries(focus).filter((r) => years.includes(r.fy)),
    [focus, years],
  );
  const stackRows = useMemo(() => stackedMixRows(years), [years]);
  const scatterRows = useMemo(
    () => scatterExitVsMedian(focus).filter((r) => years.includes(r.fy)),
    [focus, years],
  );
  const volumeRows = useMemo(
    () => GLANCE_VOLUMES.filter((r) => years.includes(r.fy)),
    [years],
  );

  return (
    <div
      className="space-y-4"
      data-viz="afcars-exit-reasons-versus-median-time-in-care-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 px-5 py-4 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/90">
          Exit mix vs median months
        </p>
        <p className="mt-1 text-lg font-semibold leading-snug sm:text-xl">
          Median exit stay {HEADLINE.fy2019MedianMonths}→
          {HEADLINE.fy2022MedianMonths} months (FY19–FY22) while reunification
          slipped {HEADLINE.reunificationShareFy2019Pct}%→
          {HEADLINE.reunificationShareFy2023Pct}%
        </p>
        <p className="mt-2 hidden text-sm text-slate-300 sm:block">
          {VIZ_MARKERS[1]} · Adoption share {HEADLINE.adoptionShareFy2019Pct}%→
          {HEADLINE.adoptionShareFy2023Pct}% · Exits down ~{HEADLINE.exitsDeclinePctApprox}%
          on the glance ladder
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
          label="Mix focus"
          value={focus}
          options={MIX_FOCUS_OPTIONS}
          onChange={setFocus}
        />
        <ToggleGroup
          label="Year window"
          value={yearWindow}
          options={YEAR_OPTIONS}
          onChange={setYearWindow}
        />
      </div>

      {panel === "dual" ? (
        <ChartCard
          title="Exit mix vs median months"
          subtitle={`${focusLabel} (left axis) against national median months in care at exit (right axis).`}
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dualRows} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 12 }} />
                <YAxis
                  yAxisId="mix"
                  tick={{ fill: "#475569", fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={["auto", "auto"]}
                />
                <YAxis
                  yAxisId="median"
                  orientation="right"
                  tick={{ fill: "#475569", fontSize: 12 }}
                  tickFormatter={(v) => `${v}`}
                  domain={[14, 19]}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = Number(value);
                    if (String(name).includes("median")) return [fmtMonths(n), "Median months"];
                    return [fmtPct(n), focusLabel];
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="mix"
                  dataKey="mixSharePct"
                  name={focusLabel}
                  fill={EXIT_REASON_COLORS[focus === "livingWithRelative" ? "livingWithRelative" : focus]}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                />
                <Line
                  yAxisId="median"
                  type="monotone"
                  dataKey="medianMonths"
                  name="Median months in care"
                  stroke="#f8fafc"
                  strokeWidth={0}
                  hide
                />
                <Line
                  yAxisId="median"
                  type="monotone"
                  dataKey="medianMonths"
                  name="Median months"
                  stroke="#e11d48"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#e11d48" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Marker: Median exit stay 15.5→17.5 months (FY19–FY22). FY2023 median is
            estimated from duration buckets.
          </p>
        </ChartCard>
      ) : null}

      {panel === "stack" ? (
        <ChartCard
          title="Stacked discharge-reason shares"
          subtitle="National exit mix by reason for discharge. Shares may not sum to 100 after rounding."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={stackRows} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "#475569", fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 100]}
                />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="reunification"
                  stackId="1"
                  name="Reunification"
                  fill={EXIT_REASON_COLORS.reunification}
                  stroke={EXIT_REASON_COLORS.reunification}
                />
                <Area
                  type="monotone"
                  dataKey="livingWithRelative"
                  stackId="1"
                  name="Living with relative(s)"
                  fill={EXIT_REASON_COLORS.livingWithRelative}
                  stroke={EXIT_REASON_COLORS.livingWithRelative}
                />
                <Area
                  type="monotone"
                  dataKey="adoption"
                  stackId="1"
                  name="Adoption"
                  fill={EXIT_REASON_COLORS.adoption}
                  stroke={EXIT_REASON_COLORS.adoption}
                />
                <Area
                  type="monotone"
                  dataKey="guardianship"
                  stackId="1"
                  name="Guardianship"
                  fill={EXIT_REASON_COLORS.guardianship}
                  stroke={EXIT_REASON_COLORS.guardianship}
                />
                <Area
                  type="monotone"
                  dataKey="emancipation"
                  stackId="1"
                  name="Emancipation"
                  fill={EXIT_REASON_COLORS.emancipation}
                  stroke={EXIT_REASON_COLORS.emancipation}
                />
                <Area
                  type="monotone"
                  dataKey="other"
                  stackId="1"
                  name="Other"
                  fill={EXIT_REASON_COLORS.other}
                  stroke={EXIT_REASON_COLORS.other}
                />
                <Line
                  type="monotone"
                  dataKey="medianMonths"
                  name="Median months (scale ×5 for overlay)"
                  stroke="#be123c"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  hide
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "scatter" ? (
        <ChartCard
          title="Mix share vs median scatter"
          subtitle={`Each fiscal year plotted as median months (x) against ${focusLabel.toLowerCase()} (y). Bubble size ≈ exit volume.`}
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 4, bottom: 12 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Median months"
                  unit=" mo"
                  domain={[15, 19]}
                  tick={{ fill: "#475569", fontSize: 12 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name={focusLabel}
                  unit="%"
                  tick={{ fill: "#475569", fontSize: 12 }}
                />
                <ZAxis type="number" dataKey="exits" range={[80, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    if (name === "x" || String(name).includes("Median"))
                      return [fmtMonths(Number(value)), "Median months"];
                    if (name === "y" || String(name).includes("%"))
                      return [fmtPct(Number(value)), focusLabel];
                    return [fmtInt(Number(value)), String(name)];
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as { label?: string } | undefined;
                    return p?.label ?? "";
                  }}
                />
                <Scatter name={focusLabel} data={scatterRows} fill="#0ea5e9">
                  {scatterRows.map((row) => (
                    <Cell
                      key={row.fy}
                      fill={row.regime === "afcars2020" ? "#f59e0b" : "#0ea5e9"}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Cyan = legacy AFCARS reporting years; amber = FY2023 AFCARS 2020 regime.
          </p>
        </ChartCard>
      ) : null}

      {panel === "duration" ? (
        <ChartCard
          title="FY2023 time-in-care buckets"
          subtitle="Share of children exiting in FFY 2023 by length of the exit episode (dashboard printable)."
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={FY2023_DURATION_BUCKETS}
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "#475569", fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={110}
                  tick={{ fill: "#475569", fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value, _n, item) => {
                    const n = (item?.payload as { n?: number } | undefined)?.n;
                    return [
                      `${fmtPct(Number(value))}${n != null ? ` (n=${fmtInt(n)})` : ""}`,
                      "Share of exits",
                    ];
                  }}
                />
                <Bar dataKey="pct" name="Share of exits" radius={[0, 4, 4, 0]} fill="#0891b2">
                  {FY2023_DURATION_BUCKETS.map((b) => (
                    <Cell
                      key={b.id}
                      fill={b.midMonths >= 18 ? "#be123c" : "#0891b2"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Rose bars mark buckets at or above ~1.5 years — the region that pulls the
            estimated national median near {fmtMonths(HEADLINE.fy2023MedianMonthsEst)}.
          </p>
        </ChartCard>
      ) : null}

      {panel === "pace" ? (
        <ChartCard
          title="Permanency pace by exit type"
          subtitle="Median months to permanent exit in a five-year follow-up of FY2015–2017 entries (Children's Bureau brief). Not the same statistic as the annual exit-cohort median."
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={PERMANENCY_PACE}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="exitType" tick={{ fill: "#475569", fontSize: 11 }} interval={0} angle={-12} textAnchor="end" height={60} />
                <YAxis tick={{ fill: "#475569", fontSize: 12 }} label={{ value: "Median months", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }} />
                <Tooltip
                  formatter={(value, name) => {
                    if (String(name).includes("share")) return [fmtPct(Number(value)), "Share of permanent exits"];
                    return [fmtMonths(Number(value)), "Median months"];
                  }}
                />
                <Legend />
                <Bar dataKey="medianMonths" name="Median months" fill="#7c3aed" radius={[4, 4, 0, 0]} maxBarSize={56} />
                <Bar dataKey="shareOfPermanentExitsPct" name="Share of permanent exits %" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={56} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "volume" ? (
        <ChartCard
          title="Entries, in-care stock, and exits"
          subtitle="Numbers at a Glance ladder from the FY2023 dashboard printable (resubmission vintage may differ from report-specific exit Ns)."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={volumeRows} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="fy" tick={{ fill: "#475569", fontSize: 12 }} />
                <YAxis tick={{ fill: "#475569", fontSize: 12 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <Tooltip formatter={(value) => fmtInt(Number(value))} />
                <Legend />
                <Bar dataKey="entered" name="Entered" fill="#38bdf8" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="exited" name="Exited" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Line
                  type="monotone"
                  dataKey="inCareSep30"
                  name="In care Sep 30"
                  stroke={NAVY}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      <details className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <summary className="cursor-pointer font-medium text-slate-800">
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
                className="text-cyan-800 underline-offset-2 hover:underline"
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
