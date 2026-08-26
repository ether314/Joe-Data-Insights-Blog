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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  COMMODITY_MIX,
  HEADLINE,
  SOURCE_NOTE,
  SYSTEM_SERIES,
  WINTER_CLOSURES_2025,
  exposureConcentration,
  filterByWaterway,
  fmtH,
  sortedLocks,
  waterwayRollup,
  type SortMetric,
  type WaterwayFilter,
} from "@/data/usace-lock-unavailability-versus-barge-tonnage-2026-data";

// viz-types: stacked unavail bars, tons×hours scatter, system dual-line, commodity stacked, waterway exposure bars, exposure concentration cumulative | layout: default

type ViewId =
  | "unavail-stack"
  | "scatter"
  | "system"
  | "commodity"
  | "waterways"
  | "concentration";

const SLUG = "usace-lock-unavailability-versus-barge-tonnage-2026";
const SCHED = "#0e7490";
const UNSCHED = "#b45309";
const TONS = "#1d4ed8";
const EXPOSE = "#be123c";
const GRAIN = "#ca8a04";
const COAL = "#334155";
const PETRO = "#7c3aed";
const CHEM = "#db2777";
const OTHER = "#64748b";

const WATERWAY_COLORS: Record<string, string> = {
  "Upper Mississippi": "#0e7490",
  Ohio: "#b45309",
  Illinois: "#ca8a04",
  Tennessee: "#7c3aed",
  "Columbia-Snake": "#1d4ed8",
  "Gulf Intracoastal": "#64748b",
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
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
              value === o.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const VIEW_OPTIONS: { id: ViewId; label: string }[] = [
  { id: "unavail-stack", label: "Unavail stack" },
  { id: "scatter", label: "Tons × hours" },
  { id: "system", label: "System path" },
  { id: "commodity", label: "Commodity mix" },
  { id: "waterways", label: "Waterway exposure" },
  { id: "concentration", label: "Exposure stack" },
];

const SORT_OPTIONS: { id: SortMetric; label: string }[] = [
  { id: "unavail", label: "Total hours" },
  { id: "exposure", label: "Ton-hour exposure" },
  { id: "tons", label: "Tonnage" },
  { id: "hours-per-mt", label: "Hours / Mt" },
  { id: "unscheduled", label: "Unscheduled" },
  { id: "age", label: "Age" },
];

const WATERWAY_OPTIONS: { id: WaterwayFilter; label: string }[] = [
  { id: "All", label: "All rivers" },
  { id: "Upper Mississippi", label: "Upper Miss." },
  { id: "Ohio", label: "Ohio" },
  { id: "Illinois", label: "Illinois" },
  { id: "Tennessee", label: "Tennessee" },
  { id: "Columbia-Snake", label: "Columbia" },
];

export function UsaceLockUnavailabilityVersusBargeTonnage2026Dashboard() {
  const [view, setView] = useState<ViewId>("unavail-stack");
  const [sort, setSort] = useState<SortMetric>("unavail");
  const [waterway, setWaterway] = useState<WaterwayFilter>("All");

  const locks = useMemo(
    () => sortedLocks(sort, waterway).slice(0, 12),
    [sort, waterway],
  );

  const scatterData = useMemo(
    () =>
      filterByWaterway(
        sortedLocks("exposure", "All"),
        waterway,
      ).map((r) => ({
        ...r,
        x: r.tonsM,
        y: r.unavailH,
        z: Math.max(80, r.exposureB * 4),
      })),
    [waterway],
  );

  const rollup = useMemo(() => waterwayRollup(), []);
  const concentration = useMemo(() => exposureConcentration(), []);

  const commodityData = useMemo(
    () =>
      COMMODITY_MIX.map((c) => ({
        lock: c.lock,
        Grain: c.grainPct,
        Coal: c.coalPct,
        Petroleum: c.petroleumPct,
        Chemicals: c.chemicalsPct,
        Other: c.otherPct,
      })),
    [],
  );

  return (
    <div
      className="mx-auto flex w-full max-w-6xl flex-col gap-5"
      data-viz={SLUG}
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300/90">
          USACE LPMS · lock hours vs barge tons
        </p>
        <h2 className="mt-2 text-2xl font-bold leading-snug sm:text-3xl">
          Unavailability hours vs tons
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Locks 27 loses about{" "}
          <span className="font-semibold text-white">
            {fmtH(HEADLINE.topUnavailHours)} hours
          </span>{" "}
          behind{" "}
          <span className="font-semibold text-white">
            {HEADLINE.topUnavailTonsM}M tons
          </span>
          . Melvin Price published{" "}
          <span className="font-semibold text-white">
            {HEADLINE.melvinPriceTonsM}M tons
          </span>{" "}
          in 2024 — with a {HEADLINE.melvinPriceWinterDays}-day winter main-chamber
          window ({fmtH(HEADLINE.melvinPriceWinterHours)} scheduled hours) already
          on the books.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-300">
          <span className="rounded-md bg-white/10 px-2.5 py-1">
            Panel: {HEADLINE.panelLocks} locks · {HEADLINE.panelTonsM}M tons
          </span>
          <span className="rounded-md bg-white/10 px-2.5 py-1">
            {fmtH(HEADLINE.panelUnavailHours)} unavail hours ·{" "}
            {HEADLINE.panelScheduledSharePct}% scheduled
          </span>
          <span className="rounded-md bg-white/10 px-2.5 py-1">
            Top-4 exposure share {HEADLINE.top4ExposureSharePct}%
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <ToggleGroup
          label="Panel"
          value={view}
          options={VIEW_OPTIONS}
          onChange={setView}
        />
        {(view === "unavail-stack" || view === "scatter") && (
          <div className="grid gap-4 sm:grid-cols-2">
            <ToggleGroup
              label="Sort / size"
              value={sort}
              options={SORT_OPTIONS}
              onChange={setSort}
            />
            <ToggleGroup
              label="Waterway"
              value={waterway}
              options={WATERWAY_OPTIONS}
              onChange={setWaterway}
            />
          </div>
        )}
      </div>

      {view === "unavail-stack" && (
        <ChartCard
          title="Scheduled vs unscheduled unavailability hours"
          subtitle="LPMS-style chamber-unavailable hours for the 2024 reference panel (top 12 after filters)"
        >
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={locks}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="shortName"
                  width={110}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="scheduledH"
                  name="Scheduled"
                  stackId="a"
                  fill={SCHED}
                />
                <Bar
                  dataKey="unscheduledH"
                  name="Unscheduled"
                  stackId="a"
                  fill={UNSCHED}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Tonnage versus unavailability hours"
          subtitle="Bubble size scales with ton-hour exposure (tons × hours). Upper-right = high freight behind long outages."
        >
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Tons (M)"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Locked tons (millions)",
                    position: "insideBottom",
                    offset: -4,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Hours"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Unavail hours",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    const label = String(name ?? "");
                    if (label === "x" || label === "Tons (M)")
                      return [`${n.toFixed(1)}M`, "Tons"];
                    if (label === "y" || label === "Hours")
                      return [fmtH(n), "Unavail hours"];
                    return [value as string | number, label];
                  }}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.shortName ?? ""
                  }
                />
                <Scatter data={scatterData} name="Locks">
                  {scatterData.map((d) => (
                    <Cell
                      key={d.id}
                      fill={WATERWAY_COLORS[d.waterway] ?? EXPOSE}
                      fillOpacity={0.85}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "system" && (
        <ChartCard
          title="System path: unavailability vs inland tonnage indexes"
          subtitle="2016 = 100. Unavail index rises into the low-water / deferred-maintenance years; tonnage softens then partially recovers."
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={SYSTEM_SERIES}
                margin={{ top: 12, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  domain={[80, 160]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  domain={[50, 90]}
                />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="unavailIndex"
                  name="Unavail index"
                  fill={UNSCHED}
                  fillOpacity={0.15}
                  stroke={UNSCHED}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="tonsIndex"
                  name="Tons index"
                  stroke={TONS}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="scheduledSharePct"
                  name="Scheduled share %"
                  stroke={SCHED}
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-xs text-slate-600">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-4 font-semibold">Winter 2025 notice</th>
                  <th className="py-2 pr-4 font-semibold">Days</th>
                  <th className="py-2 pr-4 font-semibold">Hours</th>
                  <th className="py-2 font-semibold">Work</th>
                </tr>
              </thead>
              <tbody>
                {WINTER_CLOSURES_2025.map((w) => (
                  <tr key={w.lock} className="border-b border-slate-100">
                    <td className="py-2 pr-4 font-medium text-slate-800">
                      {w.lock}
                    </td>
                    <td className="py-2 pr-4">{w.days}</td>
                    <td className="py-2 pr-4">{fmtH(w.hours)}</td>
                    <td className="py-2">{w.work}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}

      {view === "commodity" && (
        <ChartCard
          title="What sits behind the outage"
          subtitle="Approximate commodity share of locked tons at high-exposure structures"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={commodityData}
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="lock" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  domain={[0, 100]}
                  unit="%"
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="Grain" stackId="a" fill={GRAIN} />
                <Bar dataKey="Coal" stackId="a" fill={COAL} />
                <Bar dataKey="Petroleum" stackId="a" fill={PETRO} />
                <Bar dataKey="Chemicals" stackId="a" fill={CHEM} />
                <Bar
                  dataKey="Other"
                  stackId="a"
                  fill={OTHER}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "waterways" && (
        <ChartCard
          title="Waterway exposure rollup"
          subtitle="Million ton-hours = panel tons × unavailability hours, summed by river system"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rollup}
                margin={{ top: 8, right: 16, left: 8, bottom: 48 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="waterway"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="exposureTonHoursB"
                  name="Ton-hour exposure (B)"
                  radius={[4, 4, 0, 0]}
                >
                  {rollup.map((r) => (
                    <Cell
                      key={r.waterway}
                      fill={WATERWAY_COLORS[r.waterway] ?? EXPOSE}
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="unavailH"
                  name="Unavail hours"
                  fill="#94a3b8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "concentration" && (
        <ChartCard
          title="Exposure concentration curve"
          subtitle="Cumulative share of panel ton-hour exposure when locks are ranked by exposure"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={concentration}
                margin={{ top: 12, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="rank" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  domain={[0, 100]}
                  unit="%"
                />
                <Tooltip
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.lock
                      ? `#${payload[0].payload.rank} ${payload[0].payload.lock}`
                      : ""
                  }
                />
                <Area
                  type="monotone"
                  dataKey="cumSharePct"
                  name="Cumulative exposure %"
                  stroke={EXPOSE}
                  fill={EXPOSE}
                  fillOpacity={0.2}
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
