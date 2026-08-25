"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
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
  GAP_PEAK_ROWS,
  HEADLINE,
  METROS,
  NATIONAL_SERIES,
  RATE_PATH,
  REVERSAL_SCATTER,
  SOURCE_NOTE,
  metroSeries,
  type MetroId,
} from "@/data/investor-home-purchases-vs-first-time-buyers-2026-data";

type Panel =
  | "metro-paths"
  | "gap-ladder"
  | "reversal-scatter"
  | "national-rate"
  | "outbid-bars";

type SeriesMode = "both" | "investor" | "ftb" | "gap";

const COLORS = {
  investor: "#b45309",
  ftb: "#0e7490",
  gapPos: "#b45309",
  gapNeg: "#0e7490",
  rate: "#64748b",
  grid: "#e2e8f0",
  outbid: "#c2410c",
  reversed: "#15803d",
  held: "#a16207",
};

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "metro-paths": {
    title: "Investor % of closings vs first-time buyers",
    subtitle:
      "Metro deed-share paths, 2021–2025 — toggle series; rate rise overlays on dual axis",
  },
  "gap-ladder": {
    title: "Investor − FTB gap (percentage points)",
    subtitle:
      "Positive = investors outbid FTB share. Peak year vs 2025 for each Sun Belt metro",
  },
  "reversal-scatter": {
    title: "Peak investor share vs peak-to-2025 decline",
    subtitle:
      "Hottest 2021 markets shed the most investor share as 30-year rates reset",
  },
  "national-rate": {
    title: "National shares vs Freddie Mac 30-year rate",
    subtitle:
      "Investor share fell as PMMS rose; FTB share recovered only modestly from the trough",
  },
  "outbid-bars": {
    title: "Metros where investors outbid FTB at the peak",
    subtitle: `${HEADLINE.metrosInvestorOutbidCount} metros flipped positive on gap; ${HEADLINE.metrosGapReversedBy2025} reversed by 2025`,
  },
};

const fmtPct = (n: number) => `${n.toFixed(1)}%`;
const fmtPp = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)} pp`;

export function InvestorHomePurchasesVsFirstTimeBuyers2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("metro-paths");
  const [metroId, setMetroId] = useState<MetroId>(ANALYTICS.defaultMetroId);
  const [seriesMode, setSeriesMode] = useState<SeriesMode>("both");
  const [gapView, setGapView] = useState<"peak" | "2025" | "delta">("peak");

  const pathData = useMemo(() => metroSeries(metroId), [metroId]);
  const metroLabel = METROS.find((m) => m.id === metroId)?.label ?? metroId;

  const gapLadderData = useMemo(() => {
    return [...GAP_PEAK_ROWS]
      .sort((a, b) => b.gapAtPeak - a.gapAtPeak)
      .map((r) => ({
        label: r.label,
        value:
          gapView === "peak"
            ? r.gapAtPeak
            : gapView === "2025"
              ? r.gap2025
              : +(r.gap2025 - r.gapAtPeak).toFixed(1),
        outbid: r.outbidAtPeak,
        reversed: r.reversedBy2025,
      }));
  }, [gapView]);

  const outbidData = useMemo(
    () =>
      GAP_PEAK_ROWS.filter((r) => r.outbidAtPeak)
        .sort((a, b) => b.gapAtPeak - a.gapAtPeak)
        .map((r) => ({
          label: r.label,
          gapAtPeak: r.gapAtPeak,
          gap2025: r.gap2025,
          reversed: r.reversedBy2025,
        })),
    [],
  );

  const meta = PANEL_META[panel];

  return (
    <div
      data-viz="investor-home-purchases-vs-first-time-buyers-2026"
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-amber-800">
            Real Estate · Investor % of closings
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{meta.title}</h3>
          <p className="mt-0.5 text-sm text-slate-600">{meta.subtitle}</p>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-right text-sm">
          <p className="font-semibold text-amber-900">
            {fmtPct(HEADLINE.peakInvestorSharePct)} peak
          </p>
          <p className="text-xs text-slate-500">
            {HEADLINE.peakInvestorMetro} · {HEADLINE.peakInvestorYear}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["metro-paths", "Metro paths"],
            ["gap-ladder", "Gap ladder"],
            ["reversal-scatter", "Reversal scatter"],
            ["national-rate", "National + rates"],
            ["outbid-bars", "Outbid metros"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPanel(id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              panel === id
                ? "bg-amber-800 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {(panel === "metro-paths" || panel === "gap-ladder") && (
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3">
          {panel === "metro-paths" && (
            <>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                Metro
                <select
                  value={metroId}
                  onChange={(e) => setMetroId(e.target.value as MetroId)}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
                >
                  {METROS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex flex-wrap gap-1">
                {(
                  [
                    ["both", "Both"],
                    ["investor", "Investor"],
                    ["ftb", "FTB"],
                    ["gap", "Gap"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSeriesMode(id)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                      seriesMode === id
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
          {panel === "gap-ladder" && (
            <div className="flex flex-wrap gap-1">
              {(
                [
                  ["peak", "At peak"],
                  ["2025", "2025"],
                  ["delta", "Peak→2025 Δ"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setGapView(id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                    gapView === id
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="h-[380px] w-full sm:h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          {panel === "metro-paths" ? (
            <ComposedChart data={pathData} margin={{ top: 8, right: 48, left: 0, bottom: 8 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="share"
                tick={{ fontSize: 12 }}
                domain={[0, 32]}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                yAxisId="rate"
                orientation="right"
                tick={{ fontSize: 11 }}
                domain={[2, 8]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(value, name) => {
                  const n = Number(value);
                  const key = String(name);
                  if (key === "pmms30") return [`${n.toFixed(2)}%`, "PMMS 30y"];
                  if (key === "gap") return [fmtPp(n), "Investor − FTB"];
                  return [fmtPct(n), key === "investor" ? "Investor" : "FTB"];
                }}
                labelFormatter={(y) => `${metroLabel} · ${y}`}
              />
              <Legend />
              <Line
                yAxisId="rate"
                type="monotone"
                dataKey="pmms30"
                name="PMMS 30y"
                stroke={COLORS.rate}
                strokeDasharray="4 4"
                dot={false}
                strokeWidth={1.5}
              />
              {(seriesMode === "both" || seriesMode === "investor") && (
                <Line
                  yAxisId="share"
                  type="monotone"
                  dataKey="investor"
                  name="Investor %"
                  stroke={COLORS.investor}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              )}
              {(seriesMode === "both" || seriesMode === "ftb") && (
                <Line
                  yAxisId="share"
                  type="monotone"
                  dataKey="ftb"
                  name="FTB %"
                  stroke={COLORS.ftb}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              )}
              {seriesMode === "gap" && (
                <Bar
                  yAxisId="share"
                  dataKey="gap"
                  name="Gap (pp)"
                  fill={COLORS.investor}
                  radius={[4, 4, 0, 0]}
                />
              )}
              <ReferenceLine yAxisId="share" y={0} stroke="#94a3b8" />
            </ComposedChart>
          ) : panel === "gap-ladder" ? (
            <BarChart
              data={gapLadderData}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 88, bottom: 8 }}
            >
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => fmtPp(v)}
              />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(v) => [fmtPp(Number(v)), "Gap"]} />
              <ReferenceLine x={0} stroke="#64748b" />
              <Bar dataKey="value" name="Gap" radius={[0, 4, 4, 0]}>
                {gapLadderData.map((d) => (
                  <Cell
                    key={d.label}
                    fill={d.value >= 0 ? COLORS.gapPos : COLORS.gapNeg}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : panel === "reversal-scatter" ? (
            <ScatterChart margin={{ top: 12, right: 24, left: 8, bottom: 28 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="peakInvestor"
                name="Peak investor %"
                unit="%"
                domain={[14, 30]}
                tick={{ fontSize: 12 }}
                label={{
                  value: "Peak investor share of closings (%)",
                  position: "bottom",
                  offset: 8,
                  fontSize: 12,
                }}
              />
              <YAxis
                type="number"
                dataKey="declinePp"
                name="Decline"
                unit=" pp"
                domain={[4, 18]}
                tick={{ fontSize: 12 }}
                label={{
                  value: "Peak → 2025 decline (pp)",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 12,
                }}
              />
              <ZAxis range={[80, 80]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) => {
                  const n = Number(v);
                  return String(name) === "Peak investor %"
                    ? [fmtPct(n), String(name)]
                    : [`${n.toFixed(1)} pp`, "Decline"];
                }}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.label ?? ""
                }
              />
              <Scatter data={REVERSAL_SCATTER} name="Metros">
                {REVERSAL_SCATTER.map((p) => (
                  <Cell
                    key={p.id}
                    fill={
                      p.reversedBy2025
                        ? COLORS.reversed
                        : p.outbidAtPeak
                          ? COLORS.held
                          : COLORS.ftb
                    }
                  />
                ))}
              </Scatter>
            </ScatterChart>
          ) : panel === "national-rate" ? (
            <ComposedChart
              data={NATIONAL_SERIES}
              margin={{ top: 8, right: 48, left: 0, bottom: 8 }}
            >
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="share"
                tick={{ fontSize: 12 }}
                domain={[8, 32]}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                yAxisId="rate"
                orientation="right"
                tick={{ fontSize: 11 }}
                domain={[2, 8]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(value, name) => {
                  const n = Number(value);
                  const key = String(name);
                  if (key === "pmms30") return [`${n.toFixed(2)}%`, "PMMS 30y"];
                  return [fmtPct(n), key === "investor" ? "Investor" : "FTB"];
                }}
              />
              <Legend />
              <Line
                yAxisId="rate"
                type="monotone"
                dataKey="pmms30"
                name="PMMS 30y"
                stroke={COLORS.rate}
                strokeDasharray="4 4"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                yAxisId="share"
                type="monotone"
                dataKey="investor"
                name="Investor %"
                stroke={COLORS.investor}
                strokeWidth={2.5}
              />
              <Line
                yAxisId="share"
                type="monotone"
                dataKey="ftb"
                name="FTB %"
                stroke={COLORS.ftb}
                strokeWidth={2.5}
              />
            </ComposedChart>
          ) : (
            <BarChart
              data={outbidData}
              margin={{ top: 8, right: 16, left: 8, bottom: 48 }}
            >
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, angle: -28, textAnchor: "end" }}
                height={60}
                interval={0}
              />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => fmtPp(v)} />
              <Tooltip
                formatter={(v, name) => [
                  fmtPp(Number(v)),
                  String(name) === "gapAtPeak" ? "Gap at peak" : "Gap 2025",
                ]}
              />
              <Legend />
              <ReferenceLine y={0} stroke="#64748b" />
              <Bar dataKey="gapAtPeak" name="Gap at peak" fill={COLORS.outbid} radius={[4, 4, 0, 0]} />
              <Bar dataKey="gap2025" name="Gap 2025" fill={COLORS.reversed} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <p className="text-[11px] leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <p className="text-[11px] text-slate-400">
        Rate path:{" "}
        {RATE_PATH.map((r) => `${r.year} ${r.pmms30.toFixed(2)}%`).join(" · ")}
      </p>
    </div>
  );
}
