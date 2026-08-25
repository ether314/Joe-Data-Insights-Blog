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
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ANALYTICS,
  CUMULATIVE_FAN,
  HEADLINE,
  HEAT_QUARTERS,
  NOMINAL_YOY,
  QUINTILES,
  QUARTERS,
  REAL_YOY,
  SOURCE_NOTE,
  SPREAD_SERIES,
  CES_AHE_YOY,
  type QuintileId,
  type Quarter,
} from "@/data/real-wage-growth-by-wage-quintile-2026-data";

type Panel =
  | "cumulative-fan"
  | "spread-path"
  | "latest-ladder"
  | "nom-vs-real"
  | "real-heat"
  | "ces-crosscheck";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "cumulative-fan": {
    title: "Cumulative real wage growth since 2019Q4",
    subtitle:
      "Q1 holds a +7.2 pp lead path; Q5 only barely back above zero by 2026Q2",
  },
  "spread-path": {
    title: "Q1 − Q5 cumulative real spread",
    subtitle: `Peaked at +${HEADLINE.q1MinusQ5PeakPp} pp in ${HEADLINE.peakQuarter}; tightened to +${HEADLINE.q1MinusQ5LatestPp} pp`,
  },
  "latest-ladder": {
    title: "Latest cumulative real by quintile",
    subtitle: "Three quintiles clear +1 pp; Q4/Q5 sit near flat",
  },
  "nom-vs-real": {
    title: "Nominal vs real YoY for selected quintile",
    subtitle: "CPI subtracts purchasing power — 2022 peak erased most nominal heat",
  },
  "real-heat": {
    title: "Real YoY heat — quintile × quarter",
    subtitle: "Deep red in 2022 across the ladder; teal returns first at the bottom",
  },
  "ces-crosscheck": {
    title: "CES AHE vs Tracker median (aggregate)",
    subtitle: "Payroll average ≠ distributional median — use as pace check only",
  },
};

const fmtPp = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)} pp`;
const tipPp = (v: unknown) => fmtPp(typeof v === "number" ? v : Number(v));

function heatColor(v: number): string {
  if (v >= 2) return "#0f766e";
  if (v >= 0.5) return "#5eead4";
  if (v >= -0.5) return "#cbd5e1";
  if (v >= -2) return "#fdba74";
  return "#9f1239";
}

export function RealWageGrowthByWageQuintile2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("cumulative-fan");
  const [quintile, setQuintile] = useState<QuintileId>(ANALYTICS.defaultQuintile);
  const [quarter, setQuarter] = useState<Quarter>(ANALYTICS.defaultView === "cumulative" ? "2026Q2" : ANALYTICS.defaultView as Quarter);

  const meta = PANEL_META[panel];
  const qMeta = QUINTILES.find((q) => q.id === quintile)!;

  const nomRealData = useMemo(
    () =>
      QUARTERS.map((q) => ({
        quarter: q,
        nominal: NOMINAL_YOY[q][quintile],
        real: REAL_YOY[q][quintile],
      })),
    [quintile],
  );

  const heatRows = useMemo(() => {
    return QUINTILES.map((qm) => ({
      id: qm.id,
      label: qm.shortLabel,
      cells: HEAT_QUARTERS.map((q) => ({
        quarter: q,
        value: REAL_YOY[q][qm.id],
      })),
    }));
  }, []);

  const snapshotAtQuarter = useMemo(() => {
    const q = quarter;
    return QUINTILES.map((qm) => {
      const cum =
        CUMULATIVE_FAN.find((r) => r.quarter === q)?.[qm.id] ?? 0;
      return {
        id: qm.id,
        label: qm.shortLabel,
        cumReal: cum,
        color: qm.color,
      };
    });
  }, [quarter]);

  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      data-viz="real-wage-growth-by-wage-quintile-2026"
    >
      <div className="border-b border-slate-200 bg-slate-950 px-4 py-4 text-white sm:px-6">
        <p className="text-xs font-medium uppercase tracking-wider text-teal-300/90">
          Labor & Skills · Quintile real growth spread
        </p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
          Real wage growth by wage quintile
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-slate-300">
          Since 2019Q4, Q1 cumulative real is +{HEADLINE.q1CumRealPp} pp vs Q5 at +
          {HEADLINE.q5CumRealPp} pp — a {HEADLINE.q1MinusQ5LatestPp} pp spread, down{" "}
          {HEADLINE.leadTighteningPp} pp from the {HEADLINE.peakQuarter} peak.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              Q1 cumulative real
            </div>
            <div className="font-semibold text-teal-300">
              {fmtPp(HEADLINE.q1CumRealPp)}
            </div>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              Q1 − Q5 spread
            </div>
            <div className="font-semibold text-amber-200">
              {fmtPp(HEADLINE.q1MinusQ5LatestPp)}
            </div>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              Peak spread ({HEADLINE.peakQuarter})
            </div>
            <div className="font-semibold text-rose-200">
              {fmtPp(HEADLINE.q1MinusQ5PeakPp)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-6">
        {(
          [
            ["cumulative-fan", "Cumulative fan"],
            ["spread-path", "Q1−Q5 spread"],
            ["latest-ladder", "Latest ladder"],
            ["nom-vs-real", "Nom vs real"],
            ["real-heat", "Real heat"],
            ["ces-crosscheck", "CES cross-check"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPanel(id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              panel === id
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3 sm:px-6">
        <span className="text-xs font-medium text-slate-500">Quintile</span>
        {QUINTILES.map((q) => (
          <button
            key={q.id}
            type="button"
            onClick={() => setQuintile(q.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              quintile === q.id
                ? "bg-teal-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {q.shortLabel}
          </button>
        ))}
        <span className="ml-2 text-xs font-medium text-slate-500">Snapshot</span>
        {(["2022Q4", "2023Q2", "2024Q4", "2026Q2"] as Quarter[]).map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => setQuarter(q)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              quarter === q
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {q}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 sm:px-6">
        <h4 className="text-sm font-semibold text-slate-900">{meta.title}</h4>
        <p className="mt-0.5 text-xs text-slate-500">{meta.subtitle}</p>

        <div className="mt-4 h-[340px] w-full">
          {panel === "cumulative-fan" && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CUMULATIVE_FAN}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}`}
                  label={{
                    value: "pp vs 2019Q4",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11 },
                  }}
                />
                <Tooltip
                  formatter={tipPp}
                  contentStyle={{ fontSize: 12 }}
                />
                <Legend />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Area
                  type="monotone"
                  dataKey="q1"
                  name="Q1"
                  stroke="#0f766e"
                  fill="#0f766e33"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="q2"
                  name="Q2"
                  stroke="#14b8a6"
                  fill="#14b8a622"
                  strokeWidth={1.5}
                />
                <Area
                  type="monotone"
                  dataKey="q3"
                  name="Q3"
                  stroke="#64748b"
                  fill="transparent"
                  strokeWidth={1.5}
                />
                <Area
                  type="monotone"
                  dataKey="q4"
                  name="Q4"
                  stroke="#c2410c"
                  fill="transparent"
                  strokeWidth={1.5}
                />
                <Area
                  type="monotone"
                  dataKey="q5"
                  name="Q5"
                  stroke="#9f1239"
                  fill="#9f123922"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {panel === "spread-path" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={SPREAD_SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={tipPp}
                  contentStyle={{ fontSize: 12 }}
                />
                <Legend />
                <ReferenceLine
                  y={HEADLINE.q1MinusQ5PeakPp}
                  stroke="#9f1239"
                  strokeDasharray="4 4"
                  label={{ value: "Peak", fontSize: 10 }}
                />
                <Bar dataKey="spread" name="Q1−Q5 spread" fill="#0f766e" radius={[4, 4, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="q1"
                  name="Q1 cum"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="q5"
                  name="Q5 cum"
                  stroke="#9f1239"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {panel === "latest-ladder" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={snapshotAtQuarter}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={40}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={tipPp}
                  contentStyle={{ fontSize: 12 }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar
                  dataKey="cumReal"
                  name={`Cum real @ ${quarter}`}
                  radius={[0, 4, 4, 0]}
                >
                  {snapshotAtQuarter.map((r) => (
                    <Cell key={r.id} fill={r.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {panel === "nom-vs-real" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={nomRealData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Bar dataKey="nominal" name={`${qMeta.shortLabel} nominal`} fill="#94a3b8" />
                <Line
                  type="monotone"
                  dataKey="real"
                  name={`${qMeta.shortLabel} real`}
                  stroke={qMeta.color}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {panel === "real-heat" && (
            <div className="flex h-full flex-col justify-center gap-2 overflow-x-auto">
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `56px repeat(${HEAT_QUARTERS.length}, minmax(56px, 1fr))`,
                }}
              >
                <div />
                {HEAT_QUARTERS.map((q) => (
                  <div
                    key={q}
                    className="text-center text-[10px] font-medium text-slate-500"
                  >
                    {q.replace("20", "")}
                  </div>
                ))}
                {heatRows.map((row) => (
                  <div key={row.id} className="contents">
                    <div className="flex items-center text-xs font-semibold text-slate-700">
                      {row.label}
                    </div>
                    {row.cells.map((c) => (
                      <div
                        key={`${row.id}-${c.quarter}`}
                        className="flex h-9 items-center justify-center rounded text-[11px] font-medium text-white"
                        style={{ backgroundColor: heatColor(c.value) }}
                        title={`${row.label} ${c.quarter}: ${c.value}%`}
                      >
                        {c.value > 0 ? "+" : ""}
                        {c.value}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                Cell = real YoY approx (nominal − CPI). Highlighted quintile:{" "}
                {qMeta.shortLabel}.
              </p>
            </div>
          )}

          {panel === "ces-crosscheck" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={CES_AHE_YOY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend />
                <Bar dataKey="ahe" name="CES AHE YoY" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="medianWgt"
                  name="WGT overall median"
                  stroke="#0f766e"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <p className="border-t border-slate-100 px-4 py-3 text-[11px] leading-relaxed text-slate-500 sm:px-6">
        {SOURCE_NOTE}
      </p>
    </div>
  );
}
