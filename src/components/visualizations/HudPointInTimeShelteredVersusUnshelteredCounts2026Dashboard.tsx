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
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  CHANGE_FOCUS_OPTIONS,
  DECLINE_SHARE_2025,
  HEADLINE,
  HOUSEHOLD_MIX_2024,
  INCREASE_SHARE,
  INCREASE_WATERFALL,
  METRIC_OPTIONS,
  SHELTER_SPLIT_2024,
  SOURCE_NOTE,
  SOURCES,
  VIZ_MARKERS,
  WINDOW_OPTIONS,
  fmtInt,
  fmtPct,
  shareSeries,
  stackSeries,
  stateSorted,
  yoyDeltaSeries,
  type ChangeFocus,
  type MetricId,
  type WindowId,
} from "@/data/hud-point-in-time-sheltered-versus-unsheltered-counts-2026-data";

// viz-types: stacked area, waterfall bars, donut, state mix bars, ES/TH pie, household grouped
// | controls: panel, window, metric/focus

type PanelId = "stack" | "waterfall" | "donut" | "states" | "split" | "households";

const PANEL_OPTIONS: { id: PanelId; label: string }[] = [
  { id: "stack", label: "Sheltered vs unsheltered stack" },
  { id: "waterfall", label: "Increase waterfall" },
  { id: "donut", label: "Increase share donut" },
  { id: "states", label: "State shelter mix" },
  { id: "split", label: "ES / TH / street split" },
  { id: "households", label: "Household-type mix" },
];

const GRID = "#e2e8f0";
const SHELTERED = "#0f766e";
const UNSHELTERED = "#b45309";
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

function waterfallBars() {
  const steps = INCREASE_WATERFALL;
  let running = 0;
  return steps.map((step) => {
    if (step.kind === "base") {
      running = step.value;
      return {
        label: step.label,
        display: step.value,
        base: 0,
        rise: step.value,
        fill: NAVY,
      };
    }
    if (step.kind === "add") {
      const base = running;
      running += step.value;
      return {
        label: step.label,
        display: step.value,
        base,
        rise: step.value,
        fill: step.id === "sheltered" ? SHELTERED : UNSHELTERED,
      };
    }
    return {
      label: step.label,
      display: step.value,
      base: 0,
      rise: step.value,
      fill: "#334155",
    };
  });
}

export function HudPointInTimeShelteredVersusUnshelteredCounts2026Dashboard() {
  const [panel, setPanel] = useState<PanelId>("stack");
  const [windowId, setWindowId] = useState<WindowId>("post2015");
  const [metric, setMetric] = useState<MetricId>("levels");
  const [focus, setFocus] = useState<ChangeFocus>("jump2024");

  const stack = useMemo(() => stackSeries(windowId), [windowId]);
  const shares = useMemo(() => shareSeries(windowId), [windowId]);
  const deltas = useMemo(() => yoyDeltaSeries(windowId), [windowId]);
  const waterfall = useMemo(() => waterfallBars(), []);
  const donut = focus === "jump2024" ? INCREASE_SHARE : DECLINE_SHARE_2025;
  const states = useMemo(() => stateSorted("unshelteredShare"), []);
  const households = useMemo(
    () =>
      HOUSEHOLD_MIX_2024.map((r) => ({
        ...r,
        total: r.sheltered + r.unsheltered,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="hud-point-in-time-sheltered-versus-unsheltered-counts-2026"
    >
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-[#0b1220] text-white">
        <div className="grid gap-0 lg:grid-cols-[1.35fr_1fr]">
          <div className="border-b border-white/10 px-5 py-6 sm:px-8 lg:border-b-0 lg:border-r">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-200/90">
              {VIZ_MARKERS[0]}
            </p>
            <p className="mt-3 max-w-xl text-2xl font-bold leading-snug sm:text-3xl">
              {fmtPct(HEADLINE.shelteredShareOfIncreasePct)} of the 2023→2024 PIT jump was
              sheltered people
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
              Of the {fmtInt(HEADLINE.increase2023to2024)} additional people counted on a single
              January night in 2024, {fmtInt(HEADLINE.shelteredDelta2023to2024)} were in emergency
              shelter, transitional housing, or safe havens — versus{" "}
              {fmtInt(HEADLINE.unshelteredDelta2023to2024)} unsheltered.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-4 bg-gradient-to-br from-teal-950/80 to-amber-950/40 px-5 py-6 sm:px-8">
            <div className="flex items-end justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  Sheltered Δ 2023–24
                </p>
                <p className="text-2xl font-semibold tabular-nums text-teal-200">
                  +{fmtInt(HEADLINE.shelteredDelta2023to2024)}
                </p>
              </div>
              <p className="text-sm text-teal-100/80">{fmtPct(HEADLINE.shelteredPctChange2023to2024)}</p>
            </div>
            <div className="flex items-end justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  Unsheltered Δ 2023–24
                </p>
                <p className="text-2xl font-semibold tabular-nums text-amber-200">
                  +{fmtInt(HEADLINE.unshelteredDelta2023to2024)}
                </p>
              </div>
              <p className="text-sm text-amber-100/80">
                {fmtPct(HEADLINE.unshelteredPctChange2023to2024)}
              </p>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  2025 pullback (total)
                </p>
                <p className="text-2xl font-semibold tabular-nums">
                  −{fmtInt(HEADLINE.decrease2024to2025)}
                </p>
              </div>
              <p className="text-sm text-slate-300">first drop since 2016</p>
            </div>
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
        {panel === "stack" ? (
          <ToggleGroup
            label="Metric"
            value={metric}
            options={METRIC_OPTIONS}
            onChange={setMetric}
          />
        ) : null}
        {panel === "donut" || panel === "waterfall" ? (
          <ToggleGroup
            label="Change focus"
            value={focus}
            options={CHANGE_FOCUS_OPTIONS}
            onChange={setFocus}
          />
        ) : null}
      </div>

      {panel === "stack" && metric === "levels" ? (
        <ChartCard
          title="Sheltered vs unsheltered stack"
          subtitle="National January PIT counts; 2021 unsheltered omitted (COVID)"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={stack} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="sheltered"
                  name="Sheltered"
                  stackId="1"
                  stroke={SHELTERED}
                  fill={SHELTERED}
                  fillOpacity={0.85}
                />
                <Area
                  type="monotone"
                  dataKey="unsheltered"
                  name="Unsheltered"
                  stackId="1"
                  stroke={UNSHELTERED}
                  fill={UNSHELTERED}
                  fillOpacity={0.85}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "stack" && metric === "share" ? (
        <ChartCard
          title="Unsheltered share of the PIT"
          subtitle="Percent of people counted outside shelter / transitional housing"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={shares} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  domain={[20, 45]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="unshelteredSharePct"
                  name="Unsheltered %"
                  stroke={UNSHELTERED}
                  fill={UNSHELTERED}
                  fillOpacity={0.25}
                />
                <Line
                  type="monotone"
                  dataKey="unshelteredSharePct"
                  stroke={UNSHELTERED}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <ReferenceLine
                  y={HEADLINE.year2024UnshelteredSharePct}
                  stroke="#64748b"
                  strokeDasharray="3 3"
                  label={{ value: "2024", position: "insideTopRight", fontSize: 11 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "stack" && metric === "delta" ? (
        <ChartCard
          title="Year-over-year change by shelter status"
          subtitle="Positive bars enlarge the national PIT; negative bars shrink it"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deltas} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip />
                <Legend />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Bar
                  dataKey="shelteredDelta"
                  name="Sheltered Δ"
                  fill={SHELTERED}
                  stackId="d"
                />
                <Bar
                  dataKey="unshelteredDelta"
                  name="Unsheltered Δ"
                  fill={UNSHELTERED}
                  stackId="d"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "waterfall" ? (
        <ChartCard
          title={
            focus === "jump2024"
              ? "Increase waterfall"
              : "2025 decline composition"
          }
          subtitle={
            focus === "jump2024"
              ? "How the 2023 total rebuilt into the 2024 record count"
              : "Sheltered beds accounted for most of the 2024→2025 pullback"
          }
        >
          {focus === "jump2024" ? (
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterfall} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip />
                  <Bar dataKey="base" stackId="w" fill="transparent" />
                  <Bar dataKey="rise" stackId="w" name="People" radius={[4, 4, 0, 0]}>
                    {waterfall.map((d) => (
                      <Cell key={d.label} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      label: "Sheltered Δ",
                      value: HEADLINE.shelteredDelta2024to2025,
                    },
                    {
                      label: "Unsheltered Δ",
                      value: HEADLINE.unshelteredDelta2024to2025,
                    },
                    {
                      label: "Total Δ",
                      value: -HEADLINE.decrease2024to2025,
                    },
                  ]}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip />
                  <ReferenceLine y={0} stroke="#94a3b8" />
                  <Bar dataKey="value" name="Change" radius={[4, 4, 0, 0]}>
                    <Cell fill={SHELTERED} />
                    <Cell fill={UNSHELTERED} />
                    <Cell fill="#334155" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      ) : null}

      {panel === "donut" ? (
        <ChartCard
          title="Increase share donut"
          subtitle={
            focus === "jump2024"
              ? "Composition of the +118,376 national PIT increase"
              : "Composition of the −25,828 national PIT decline"
          }
        >
          <div className="grid gap-6 md:grid-cols-[1fr_220px] md:items-center">
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[...donut]}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {donut.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-3 text-sm text-slate-700">
              {donut.map((d) => (
                <li key={d.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <p className="font-semibold text-slate-900">{d.label}</p>
                  <p className="tabular-nums text-slate-600">
                    {fmtInt(d.value)} · {fmtPct(d.sharePct)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </ChartCard>
      ) : null}

      {panel === "states" ? (
        <ChartCard
          title="State shelter mix"
          subtitle="Selected large-count states, sorted by 2024 unsheltered share"
        >
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={states}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                <YAxis
                  type="category"
                  dataKey="abbr"
                  width={36}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="sheltered" name="Sheltered" stackId="s" fill={SHELTERED} />
                <Bar
                  dataKey="unsheltered"
                  name="Unsheltered"
                  stackId="s"
                  fill={UNSHELTERED}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "split" ? (
        <ChartCard
          title="ES / TH / street split"
          subtitle="January 2024 persons by emergency shelter, transitional housing, or unsheltered"
        >
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SHELTER_SPLIT_2024}
                    dataKey="people"
                    nameKey="label"
                    outerRadius={110}
                    label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {SHELTER_SPLIT_2024.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={SHELTER_SPLIT_2024}
                  margin={{ top: 8, right: 8, left: 0, bottom: 40 }}
                >
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} angle={-18} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip />
                  <Bar dataKey="people" name="People" radius={[4, 4, 0, 0]}>
                    {SHELTER_SPLIT_2024.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartCard>
      ) : null}

      {panel === "households" ? (
        <ChartCard
          title="Household-type mix"
          subtitle="2024 persons: families, individuals, and child-only households by shelter status"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={households} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="group" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip />
                <Legend />
                <Bar dataKey="sheltered" name="Sheltered" fill={SHELTERED} radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="unsheltered"
                  name="Unsheltered"
                  fill={UNSHELTERED}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <p className="text-xs text-slate-500">
        Sources:{" "}
        {SOURCES.map((s, i) => (
          <span key={s.url}>
            {i > 0 ? " · " : ""}
            <a className="underline hover:text-slate-700" href={s.url} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}
