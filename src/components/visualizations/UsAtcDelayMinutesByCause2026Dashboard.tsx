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
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  ANNUAL_BY_CAUSE,
  BTS_CAUSE_MINUTES_2024,
  CAUSE_META,
  DUAL_LENS_2024,
  FACILITY_BUCKETS_2022_24,
  HEADLINE,
  SOURCE_NOTE,
  SOURCES,
  STAFFING_FACILITIES_2024,
  STAFFING_REST_MINUTES_2024,
  STAFFING_VS_OTHER,
  causeMinutesForYear,
  fmtMinutes,
  fmtPct,
  staffingConcentrationCurve,
  stackedShareSeries,
  type CauseId,
} from "@/data/us-atc-delay-minutes-by-cause-2026-data";

// viz-types: stacked-area shares, year donut, staffing bars+scatter, concentration line, dual-lens bars | layout: default

type View = "causes" | "staffing" | "dual";
type Metric = "share" | "minutes";

const CAUSE_ORDER: CauseId[] = [
  "weather",
  "volume",
  "runway",
  "other",
  "equipment",
];

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
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        ) : null}
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
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
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

export function UsAtcDelayMinutesByCause2026Dashboard() {
  const [view, setView] = useState<View>("causes");
  const [metric, setMetric] = useState<Metric>("share");
  const [year, setYear] = useState(2024);

  const shareSeries = useMemo(() => stackedShareSeries(), []);
  const minuteSeries = useMemo(
    () =>
      ANNUAL_BY_CAUSE.map((r) => ({
        year: r.year,
        weather: r.weatherMinutes,
        volume: r.volumeMinutes,
        runway: r.runwayMinutes,
        other: r.otherMinutes,
        equipment: r.equipmentMinutes,
      })),
    [],
  );
  const stackData = metric === "share" ? shareSeries : minuteSeries;
  const yearMix = useMemo(() => causeMinutesForYear(year), [year]);
  const concentration = useMemo(() => staffingConcentrationCurve(), []);

  const staffingBars = useMemo(
    () => [
      ...STAFFING_FACILITIES_2024.map((f) => ({
        id: f.id,
        label: f.id,
        name: f.name,
        minutes: f.minutes,
      })),
      {
        id: "REST",
        label: "Rest",
        name: "All other facilities",
        minutes: STAFFING_REST_MINUTES_2024,
      },
    ],
    [],
  );

  const scatterPoints = useMemo(
    () =>
      STAFFING_FACILITIES_2024.map((f) => ({
        id: f.id,
        name: f.name,
        x: f.fillRatePct,
        y: f.minutes,
      })),
    [],
  );

  return (
    <div
      data-viz="us-atc-delay-minutes-by-cause-2026"
      className="space-y-6"
    >
      <p className="sr-only">
        US ATC delay minutes by cause — aviation ops lens
      </p>

      <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 px-5 py-4 text-white">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
            FAA OPSNET · delay minutes
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Weather still takes {fmtPct(HEADLINE.weatherSharePct2024)} of NAS
            delay minutes
          </p>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            In 2024, OPSNET logged {fmtMinutes(HEADLINE.totalMinutes2024)}{" "}
            reportable delay minutes. Equipment + Other (including staffing)
            was {fmtPct(HEADLINE.equipPlusOtherSharePct2024)} — but staffing
            alone concentrated {fmtPct(HEADLINE.staffingTop7SharePct, 0)} of
            its minutes in seven facilities.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-right sm:grid-cols-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Staffing minutes
            </p>
            <p className="text-lg font-bold text-orange-300">
              {fmtMinutes(HEADLINE.staffingMinutes2024)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Staffing of total
            </p>
            <p className="text-lg font-bold text-orange-300">
              {fmtPct(HEADLINE.staffingSharePct2024)}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Core-30+ share
            </p>
            <p className="text-lg font-bold text-sky-300">
              {fmtPct(HEADLINE.core30MinutesSharePct)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "causes", label: "Cause mix" },
            { id: "staffing", label: "Staffing tail" },
            { id: "dual", label: "OPSNET vs BTS" },
          ]}
        />
        {view === "causes" ? (
          <>
            <ToggleGroup
              label="Stack"
              value={metric}
              onChange={setMetric}
              options={[
                { id: "share", label: "Share %" },
                { id: "minutes", label: "Minutes" },
              ]}
            />
            <ToggleGroup
              label="Donut year"
              value={String(year) as `${number}`}
              onChange={(v) => setYear(Number(v))}
              options={[2022, 2023, 2024].map((y) => ({
                id: String(y) as `${number}`,
                label: String(y),
              }))}
            />
          </>
        ) : null}
      </div>

      {view === "causes" ? (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ChartCard
              title="Cause share of delay minutes, 2015-2024"
              subtitle={
                metric === "share"
                  ? "Stacked percent of OPSNET System Impact delay minutes"
                  : "Stacked absolute OPSNET delay minutes"
              }
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stackData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) =>
                        metric === "share" ? `${v}%` : fmtMinutes(Number(v))
                      }
                      domain={metric === "share" ? [0, 100] : ["auto", "auto"]}
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        const n = Number(value);
                        const label =
                          CAUSE_META[name as CauseId]?.label ?? String(name);
                        return metric === "share"
                          ? [fmtPct(n), label]
                          : [fmtMinutes(n), label];
                      }}
                    />
                    <Legend />
                    {CAUSE_ORDER.map((id) => (
                      <Area
                        key={id}
                        type="monotone"
                        dataKey={id}
                        stackId="1"
                        stroke={CAUSE_META[id].color}
                        fill={CAUSE_META[id].color}
                        fillOpacity={0.85}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
          <div className="lg:col-span-2">
            <ChartCard
              title={`${year} minute mix`}
              subtitle="Donut of OPSNET primary causes"
            >
              <div className="h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={yearMix}
                      dataKey="minutes"
                      nameKey="id"
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={88}
                      paddingAngle={2}
                      label={(props) => {
                        const id = String(props.name ?? "");
                        const sharePct =
                          typeof props.payload?.sharePct === "number"
                            ? props.payload.sharePct
                            : 0;
                        const short =
                          CAUSE_META[id as CauseId]?.short ?? id;
                        return `${short} ${sharePct}%`;
                      }}
                    >
                      {yearMix.map((d) => (
                        <Cell key={d.id} fill={CAUSE_META[d.id].color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        fmtMinutes(Number(value)),
                        CAUSE_META[name as CauseId]?.label ?? String(name),
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 space-y-1 text-xs text-slate-600">
                {yearMix.map((d) => (
                  <li key={d.id} className="flex justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ background: CAUSE_META[d.id].color }}
                      />
                      {CAUSE_META[d.id].label}
                    </span>
                    <span className="font-semibold tabular-nums">
                      {fmtPct(d.sharePct)} · {fmtMinutes(d.minutes)}
                    </span>
                  </li>
                ))}
              </ul>
            </ChartCard>
          </div>
        </div>
      ) : null}

      {view === "staffing" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="2024 staffing delay minutes by facility"
            subtitle="Top seven facilities hold 86% of OPSNET staffing minutes"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={staffingBars}
                  layout="vertical"
                  margin={{ left: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => fmtMinutes(Number(v))}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={48}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      fmtMinutes(Number(value)),
                      "Staffing minutes",
                    ]}
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | (typeof staffingBars)[0]
                        | undefined;
                      return row ? `${row.id} — ${row.name}` : "";
                    }}
                  />
                  <Bar dataKey="minutes" radius={[0, 4, 4, 0]}>
                    {staffingBars.map((d) => (
                      <Cell
                        key={d.id}
                        fill={d.id === "REST" ? "#94a3b8" : "#f97316"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Fill rate vs staffing minutes"
            subtitle="Scatter of AFN staffing fill rate (x) against 2024 staffing delay minutes (y)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Fill %"
                    unit="%"
                    domain={[70, 140]}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Minutes"
                    tickFormatter={(v) => fmtMinutes(Number(v))}
                    tick={{ fontSize: 11 }}
                  />
                  <ZAxis range={[80, 80]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(value, name) =>
                      name === "y" || name === "Minutes"
                        ? [fmtMinutes(Number(value)), "Staffing minutes"]
                        : [`${value}%`, "Fill rate"]
                    }
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | (typeof scatterPoints)[0]
                        | undefined;
                      return row ? `${row.id} — ${row.name}` : "";
                    }}
                  />
                  <Scatter data={scatterPoints} fill="#f97316">
                    {scatterPoints.map((p) => (
                      <Cell
                        key={p.id}
                        fill={p.x >= 100 ? "#22c55e" : "#f97316"}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              PHL (130% fill) is the outlier — approach-control transition for
              Newark drove delays despite overstaffing on paper.
            </p>
          </ChartCard>

          <ChartCard
            title="Staffing concentration curve"
            subtitle="Cumulative share of 2024 staffing delay minutes"
          >
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={concentration}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="facilities" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v)), "Cumulative share"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="sharePct"
                    stroke="#ea580c"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Other-bucket → staffing takeover"
            subtitle="Staffing as % of Other delay minutes (secondary cause from mid-2022)"
          >
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...STAFFING_VS_OTHER]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 55]}
                  />
                  <Tooltip
                    formatter={(value) => [
                      fmtPct(Number(value)),
                      "Staffing share of Other",
                    ]}
                  />
                  <Bar
                    dataKey="staffingOfOtherPct"
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
              {FACILITY_BUCKETS_2022_24.filter((b) => b.id !== "all").map(
                (b) => (
                  <div key={b.id} className="rounded-lg bg-slate-50 px-2 py-2">
                    <p className="font-semibold text-slate-800">
                      {b.label.split(" ").slice(0, 2).join(" ")}
                    </p>
                    <p className="mt-1 tabular-nums text-slate-600">
                      {fmtMinutes(b.otherMinutes)} Other min
                    </p>
                  </div>
                ),
              )}
            </div>
          </ChartCard>
        </div>
      ) : null}

      {view === "dual" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Same year, different taxonomies"
            subtitle="2024 share of delay minutes — OPSNET primary vs BTS passenger OTP (approx.)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      label: "Weather / extreme WX",
                      OPSNET: DUAL_LENS_2024[0].weatherOrExtreme,
                      BTS: DUAL_LENS_2024[1].weatherOrExtreme,
                    },
                    {
                      label: "Volume / NAS",
                      OPSNET: DUAL_LENS_2024[0].volumeOrNas,
                      BTS: DUAL_LENS_2024[1].volumeOrNas,
                    },
                    {
                      label: "Runway + equipment",
                      OPSNET: DUAL_LENS_2024[0].runwayEquip,
                      BTS: DUAL_LENS_2024[1].runwayEquip,
                    },
                    {
                      label: "Other / carrier+late",
                      OPSNET: DUAL_LENS_2024[0].otherOrCarrierLate,
                      BTS: DUAL_LENS_2024[1].otherOrCarrierLate,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v)), "Share of minutes"]}
                  />
                  <Legend />
                  <Bar dataKey="OPSNET" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="BTS" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="BTS On-Time delay-minute mix (2024)"
            subtitle="Passenger-facing causes — Extreme Weather is a narrow residual"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[...BTS_CAUSE_MINUTES_2024]}
                    dataKey="minutesSharePct"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={(props) => {
                      const label = String(props.name ?? "");
                      const pct =
                        typeof props.payload?.minutesSharePct === "number"
                          ? props.payload.minutesSharePct
                          : typeof props.value === "number"
                            ? props.value
                            : 0;
                      return `${label.split(" ")[0]} ${pct}%`;
                    }}
                  >
                    {BTS_CAUSE_MINUTES_2024.map((d) => (
                      <Cell key={d.id} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v)), "Share"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Most convective weather that OPSNET codes as Weather lands inside
              BTS NAS — so the two “weather” labels are not comparable.
            </p>
          </ChartCard>
        </div>
      ) : null}

      <footer className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-medium text-slate-700">Sources</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="mt-2 italic">{SOURCE_NOTE}</p>
      </footer>
    </div>
  );
}
