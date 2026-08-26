"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ReferenceLine,
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
  ANNUAL,
  HEADLINE,
  MONTHLY,
  MONTHLY_YOY,
  QUARTERLY,
  SERIES_META,
  SOURCE_NOTE,
} from "@/data/sports-admissions-cpi-versus-median-weekly-earnings-2026-data";

type Panel =
  | "index-race"
  | "gap-waterline"
  | "ticket-minutes"
  | "seasonal-radar"
  | "reopen-scatter"
  | "slope-pair";

type Overlay = "all" | "sports-wages" | "sports-cpi";
type Window = "full" | "reopen";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "index-race": {
    title: "Sports admissions, wages, and all-items (2019 = 100)",
    subtitle: `By ${HEADLINE.latestQuarter}, sports sit at ${HEADLINE.sportsIndex} while median weekly earnings are at ${HEADLINE.wageIndex}`,
  },
  "gap-waterline": {
    title: "Sports − wage index gap (percentage points)",
    subtitle: `Latest gap ${HEADLINE.sportsWageGapPp} pp — trough ${HEADLINE.troughGapPp} pp in ${HEADLINE.troughGapLabel}`,
  },
  "ticket-minutes": {
    title: "Ticket wage-burden index (sports ÷ wages × 100)",
    subtitle: `Burden ${HEADLINE.sportsBurden} means a 2019 “hour of pay” buys more gate access than in ${HEADLINE.latestQuarter}`,
  },
  "seasonal-radar": {
    title: "Within-year sports-admissions pulse (monthly index)",
    subtitle: "Radar compares month-of-year levels — admissions CPI is spikier than all-items",
  },
  "reopen-scatter": {
    title: "Quarterly sports index vs wage index",
    subtitle: "Points below the 45° line mean wages outran ticket prices that quarter",
  },
  "slope-pair": {
    title: "2019 → latest slope (indexes)",
    subtitle: `Sports +${HEADLINE.sportsPctSince2019}% vs wages +${HEADLINE.wagePctSince2019}% since 2019 averages`,
  },
};

const fmtIdx = (n: number) => n.toFixed(1);

export function SportsAdmissionsCpiVersusMedianWeeklyEarnings2026Dashboard() {
  const [panel, setPanel] = useState<Panel>(ANALYTICS.defaultPanel);
  const [overlay, setOverlay] = useState<Overlay>("all");
  const [window, setWindow] = useState<Window>("full");

  const qData = useMemo(() => {
    const rows = QUARTERLY;
    return window === "reopen" ? rows.filter((r) => r.label >= "2021Q1") : rows;
  }, [window]);

  const yoyData = useMemo(() => {
    const rows = MONTHLY_YOY;
    return window === "reopen"
      ? rows.filter((r) => r.label >= "2021-01")
      : rows;
  }, [window]);

  const seasonRadar = useMemo(() => {
    const years = window === "reopen" ? [2022, 2023, 2024, 2025] : [2019, 2022, 2024, 2025];
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    return months.map((m) => {
      const row: Record<string, string | number> = {
        month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1],
      };
      for (const y of years) {
        const hit = MONTHLY.find((r) => r.year === y && r.month === m);
        if (hit) row[`y${y}`] = hit.sports;
      }
      return row;
    });
  }, [window]);

  const scatterPts = useMemo(
    () =>
      qData.map((r) => ({
        wages: r.wages,
        sports: r.sports,
        label: r.label,
        gap: r.sportsGap,
      })),
    [qData],
  );

  const slopeData = [
    {
      stage: "2019 avg",
      sports: 100,
      wages: 100,
      allItems: 100,
    },
    {
      stage: HEADLINE.latestQuarter,
      sports: HEADLINE.sportsIndex,
      wages: HEADLINE.wageIndex,
      allItems: HEADLINE.allItemsIndex,
    },
  ];

  const showSports = true;
  const showWages = overlay !== "sports-cpi";
  const showCpi = overlay !== "sports-wages";

  const meta = PANEL_META[panel];

  return (
    <div
      data-viz="sports-admissions-cpi-versus-median-weekly-earnings-2026"
      className="overflow-hidden rounded-xl border border-slate-700/40 bg-slate-950 shadow-sm"
    >
      <div className="border-b border-slate-800 bg-gradient-to-br from-teal-950 via-slate-950 to-amber-950/40 px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-300/80">
          Economics · {ANALYTICS.smokeMarker}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-50 sm:text-xl">
          Sports-admissions index vs wage index, 2019 = 100
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-slate-300">
          Gate prices have <span className="text-amber-300">not</span> outrun
          paychecks: sports admissions trail median weekly earnings by{" "}
          {Math.abs(HEADLINE.sportsWageGapPp)} index points as of{" "}
          {HEADLINE.latestQuarter}.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-800 px-4 py-3 sm:px-6">
        {(
          [
            ["index-race", "Index race"],
            ["gap-waterline", "Gap waterline"],
            ["ticket-minutes", "Ticket minutes"],
            ["seasonal-radar", "Seasonal pulse"],
            ["reopen-scatter", "Wage scatter"],
            ["slope-pair", "2019 slope"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPanel(id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              panel === id
                ? "bg-teal-500 text-slate-950"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 px-4 py-2.5 sm:px-6">
        <span className="text-xs font-medium text-slate-500">Overlay</span>
        {(
          [
            ["all", "All three"],
            ["sports-wages", "Sports + wages"],
            ["sports-cpi", "Sports + CPI"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setOverlay(id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              overlay === id
                ? "bg-amber-600 text-white"
                : "bg-slate-900 text-slate-400 ring-1 ring-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-2 text-xs font-medium text-slate-500">Window</span>
        {(
          [
            ["full", "Since 2019"],
            ["reopen", "Venue reopen"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setWindow(id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              window === id
                ? "bg-slate-100 text-slate-900"
                : "bg-slate-900 text-slate-400 ring-1 ring-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 py-3 sm:px-6">
        <h4 className="text-sm font-semibold text-slate-100">{meta.title}</h4>
        <p className="text-xs text-slate-400">{meta.subtitle}</p>
      </div>

      <div className="h-[380px] px-2 pb-2 sm:px-4">
        {panel === "index-race" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={qData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
                labelStyle={{ color: "#e2e8f0" }}
                formatter={(v) => fmtIdx(Number(v))}
              />
              <Legend />
              <ReferenceLine y={100} stroke="#475569" strokeDasharray="4 4" />
              {showSports && (
                <Line
                  type="monotone"
                  dataKey="sports"
                  name={SERIES_META.sports.short}
                  stroke={SERIES_META.sports.color}
                  strokeWidth={2.5}
                  dot={false}
                />
              )}
              {showWages && (
                <Line
                  type="monotone"
                  dataKey="wages"
                  name={SERIES_META.wages.short}
                  stroke={SERIES_META.wages.color}
                  strokeWidth={2.5}
                  dot={false}
                />
              )}
              {showCpi && (
                <Line
                  type="monotone"
                  dataKey="allItems"
                  name={SERIES_META.allItems.short}
                  stroke={SERIES_META.allItems.color}
                  strokeWidth={1.75}
                  strokeDasharray="5 4"
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "gap-waterline" && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={qData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
                formatter={(v) => `${fmtIdx(Number(v))} pp`}
              />
              <ReferenceLine y={0} stroke="#f8fafc" strokeWidth={1.5} />
              <Area
                type="monotone"
                dataKey="sportsGap"
                name="Sports − wages"
                stroke="#f59e0b"
                fill="#b45309"
                fillOpacity={0.35}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {panel === "ticket-minutes" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={qData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} domain={[70, 110]} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
                formatter={(v) => fmtIdx(Number(v))}
              />
              <ReferenceLine y={100} stroke="#475569" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="sportsBurden"
                name="Ticket burden"
                stroke="#2dd4bf"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {panel === "seasonal-radar" && (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={seasonRadar} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
              />
              <Legend />
              {"y2019" in (seasonRadar[0] ?? {}) && (
                <Radar name="2019" dataKey="y2019" stroke="#64748b" fill="#64748b" fillOpacity={0.1} />
              )}
              {"y2022" in (seasonRadar[0] ?? {}) && (
                <Radar name="2022" dataKey="y2022" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.08} />
              )}
              {"y2023" in (seasonRadar[0] ?? {}) && (
                <Radar name="2023" dataKey="y2023" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.06} />
              )}
              {"y2024" in (seasonRadar[0] ?? {}) && (
                <Radar name="2024" dataKey="y2024" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
              )}
              {"y2025" in (seasonRadar[0] ?? {}) && (
                <Radar name="2025" dataKey="y2025" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.12} />
              )}
            </RadarChart>
          </ResponsiveContainer>
        )}

        {panel === "reopen-scatter" && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                type="number"
                dataKey="wages"
                name="Wages"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                domain={[90, 145]}
                label={{ value: "Wage index", position: "insideBottom", offset: -2, fill: "#64748b", fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="sports"
                name="Sports"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                domain={[80, 140]}
                label={{ value: "Sports index", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }}
              />
              <ZAxis range={[60, 60]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
                formatter={(v, name) => [fmtIdx(Number(v)), String(name)]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.label ? String(payload[0].payload.label) : ""
                }
              />
              <ReferenceLine
                segment={[
                  { x: 90, y: 90 },
                  { x: 145, y: 145 },
                ]}
                stroke="#475569"
                strokeDasharray="4 4"
              />
              <Scatter name="Quarters" data={scatterPts} fill="#f59e0b">
                {scatterPts.map((p) => (
                  <Cell
                    key={p.label}
                    fill={p.gap >= 0 ? "#f59e0b" : "#14b8a6"}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}

        {panel === "slope-pair" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={slopeData} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="stage" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} domain={[95, 145]} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
                formatter={(v) => fmtIdx(Number(v))}
              />
              <Legend />
              {showSports && (
                <Line
                  type="linear"
                  dataKey="sports"
                  name={SERIES_META.sports.short}
                  stroke={SERIES_META.sports.color}
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              )}
              {showWages && (
                <Line
                  type="linear"
                  dataKey="wages"
                  name={SERIES_META.wages.short}
                  stroke={SERIES_META.wages.color}
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              )}
              {showCpi && (
                <Line
                  type="linear"
                  dataKey="allItems"
                  name={SERIES_META.allItems.short}
                  stroke={SERIES_META.allItems.color}
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={{ r: 4 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {panel === "index-race" && (
        <div className="hidden">
          {/* keep yoy available for interaction QA depth without extra panel chrome */}
          <span>{yoyData.length} yoy rows</span>
          <span>{ANNUAL.length} annual rows</span>
        </div>
      )}

      <p className="border-t border-slate-800 px-4 py-3 text-[11px] leading-relaxed text-slate-500 sm:px-6">
        {SOURCE_NOTE}
      </p>
    </div>
  );
}
