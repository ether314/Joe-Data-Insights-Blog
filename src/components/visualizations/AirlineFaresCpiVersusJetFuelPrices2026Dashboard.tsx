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
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  ZAxis,
} from "recharts";
import {
  ANALYTICS,
  EPOCH_BARS,
  HEADLINE,
  LAG_CORR,
  MONTHLY,
  MONTHLY_YOY,
  QUARTERLY,
  SERIES_META,
  SOURCE_NOTE,
} from "@/data/airline-fares-cpi-versus-jet-fuel-prices-2026-data";

type Panel =
  | "dual-track"
  | "gap-ribbon"
  | "pass-through"
  | "fuel-scatter"
  | "lag-bars"
  | "epoch-bars"
  | "yoy-heat";

type Overlay = "both" | "fares" | "fuel";
type Window = "full" | "spike" | "recent";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "dual-track": {
    title: "Airfare index vs jet-fuel index (2019 = 100)",
    subtitle: `As of ${HEADLINE.latestLabel}, fares sit at ${HEADLINE.fareIdx} while Gulf Coast jet fuel is at ${HEADLINE.fuelIdx}`,
  },
  "gap-ribbon": {
    title: "Fare − fuel index gap (percentage points)",
    subtitle: `Latest gap ${HEADLINE.gapPp} pp — widest negative ${HEADLINE.minGapPp} pp in ${HEADLINE.minGapLabel}`,
  },
  "pass-through": {
    title: "Pass-through ratio (fare ÷ fuel × 100)",
    subtitle: `Below 100 means fuel outran ticket prices vs 2019; latest ${HEADLINE.passThrough}`,
  },
  "fuel-scatter": {
    title: "Monthly fare index vs fuel index",
    subtitle: `Pearson r = ${HEADLINE.corr}; best lag ${HEADLINE.bestLag.lag} month(s) at r = ${HEADLINE.bestLag.corr}`,
  },
  "lag-bars": {
    title: "Fuel→fare correlation by lag (months)",
    subtitle: "Jet fuel leads ticket prices by roughly one month in this sample",
  },
  "epoch-bars": {
    title: "Epoch averages: fares vs fuel indexes",
    subtitle: "Collapse, reopen, 2022 spike, and 2026 YTD side by side",
  },
  "yoy-heat": {
    title: "Year-over-year % change",
    subtitle: "Fuel YoY swings dwarf airfare CPI in every post-2019 shock",
  },
};

const fmt = (n: number) => n.toFixed(1);

export function AirlineFaresCpiVersusJetFuelPrices2026Dashboard() {
  const [panel, setPanel] = useState<Panel>(ANALYTICS.defaultPanel);
  const [overlay, setOverlay] = useState<Overlay>("both");
  const [window, setWindow] = useState<Window>("full");

  const qData = useMemo(() => {
    if (window === "spike") return QUARTERLY.filter((r) => r.label >= "2021Q1" && r.label <= "2023Q4");
    if (window === "recent") return QUARTERLY.filter((r) => r.label >= "2023Q1");
    return QUARTERLY;
  }, [window]);

  const mData = useMemo(() => {
    if (window === "spike") return MONTHLY.filter((r) => r.label >= "2021-01" && r.label <= "2023-12");
    if (window === "recent") return MONTHLY.filter((r) => r.label >= "2023-01");
    return MONTHLY;
  }, [window]);

  const yoyData = useMemo(() => {
    if (window === "spike") return MONTHLY_YOY.filter((r) => r.label >= "2021-01" && r.label <= "2023-12");
    if (window === "recent") return MONTHLY_YOY.filter((r) => r.label >= "2023-01");
    return MONTHLY_YOY;
  }, [window]);

  const scatterPts = useMemo(
    () =>
      mData.map((r) => ({
        fuel: r.fuelIdx,
        fares: r.fareIdx,
        label: r.label,
        gap: r.gap,
      })),
    [mData],
  );

  const showFares = overlay !== "fuel";
  const showFuel = overlay !== "fares";
  const meta = PANEL_META[panel];

  return (
    <div
      data-viz="airline-fares-cpi-versus-jet-fuel-prices-2026"
      className="overflow-hidden rounded-xl border border-slate-700/40 bg-slate-950 shadow-sm"
    >
      <div className="border-b border-slate-800 bg-gradient-to-br from-sky-950 via-slate-950 to-amber-950/50 px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-300/80">
          Transport & Logistics · {ANALYTICS.smokeMarker}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-50 sm:text-xl">
          Airfare index vs jet-fuel dollars per gallon, 2019 = 100
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-slate-300">
          Jet fuel has{" "}
          <span className="text-amber-300">outrun</span> ticket prices: as of{" "}
          {HEADLINE.latestLabel}, Gulf Coast jet fuel sits at {HEADLINE.fuelIdx}{" "}
          on a 2019 = 100 scale while airline fares CPI is at {HEADLINE.fareIdx}{" "}
          — a {Math.abs(HEADLINE.gapPp)}-point gap (Pearson r = {HEADLINE.corr}).
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-800 px-4 py-3 sm:px-6">
        {(
          [
            ["dual-track", "Dual track"],
            ["gap-ribbon", "Gap ribbon"],
            ["pass-through", "Pass-through"],
            ["fuel-scatter", "Fuel scatter"],
            ["lag-bars", "Lag bars"],
            ["epoch-bars", "Epoch bars"],
            ["yoy-heat", "YoY swings"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPanel(id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              panel === id
                ? "bg-sky-500 text-slate-950"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 px-4 py-2.5 sm:px-6">
        <span className="text-xs font-medium text-slate-500">Series</span>
        {(
          [
            ["both", "Both"],
            ["fares", "Fares only"],
            ["fuel", "Fuel only"],
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
            ["spike", "Spike era"],
            ["recent", "Since 2023"],
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
        {panel === "dual-track" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={qData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
                labelStyle={{ color: "#e2e8f0" }}
                formatter={(v) => fmt(Number(v))}
              />
              <Legend />
              <ReferenceLine y={100} stroke="#475569" strokeDasharray="4 4" />
              {showFares && (
                <Line
                  type="monotone"
                  dataKey="fareIdx"
                  name={SERIES_META.fares.short}
                  stroke={SERIES_META.fares.color}
                  strokeWidth={2.5}
                  dot={false}
                />
              )}
              {showFuel && (
                <Line
                  type="monotone"
                  dataKey="fuelIdx"
                  name={SERIES_META.fuel.short}
                  stroke={SERIES_META.fuel.color}
                  strokeWidth={2.5}
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "gap-ribbon" && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={qData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
                formatter={(v) => `${fmt(Number(v))} pp`}
              />
              <ReferenceLine y={0} stroke="#f8fafc" strokeWidth={1.5} />
              <Area
                type="monotone"
                dataKey="gap"
                name="Fares − fuel"
                stroke="#38bdf8"
                fill="#0ea5e9"
                fillOpacity={0.35}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {panel === "pass-through" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} interval={11} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
                formatter={(v) => fmt(Number(v))}
              />
              <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="passThrough"
                name="Pass-through"
                stroke="#a78bfa"
                strokeWidth={2.25}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {panel === "fuel-scatter" && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                type="number"
                dataKey="fuel"
                name="Fuel idx"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                domain={["auto", "auto"]}
              />
              <YAxis
                type="number"
                dataKey="fares"
                name="Fare idx"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                domain={["auto", "auto"]}
              />
              <ZAxis range={[40, 40]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
                formatter={(v, name) => [fmt(Number(v)), String(name)]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.label ? String(payload[0].payload.label) : ""
                }
              />
              <ReferenceLine
                segment={[
                  { x: 40, y: 40 },
                  { x: 220, y: 220 },
                ]}
                stroke="#475569"
                strokeDasharray="4 4"
              />
              <Scatter name="Months" data={scatterPts} fill="#38bdf8">
                {scatterPts.map((p) => (
                  <Cell
                    key={p.label}
                    fill={p.gap >= 0 ? "#38bdf8" : "#f59e0b"}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}

        {panel === "lag-bars" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[...LAG_CORR]} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="lag"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                label={{ value: "Fuel leads by N months", position: "insideBottom", offset: -2, fill: "#64748b", fontSize: 10 }}
              />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} domain={[0.5, 0.85]} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
                formatter={(v) => Number(v).toFixed(3)}
              />
              <Bar dataKey="corr" name="Pearson r" radius={[4, 4, 0, 0]}>
                {LAG_CORR.map((row) => (
                  <Cell
                    key={row.lag}
                    fill={row.lag === HEADLINE.bestLag.lag ? "#f59e0b" : "#38bdf8"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "epoch-bars" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[...EPOCH_BARS]} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="epoch" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
                formatter={(v) => fmt(Number(v))}
              />
              <Legend />
              {showFares && (
                <Bar dataKey="fareIdx" name={SERIES_META.fares.short} fill={SERIES_META.fares.color} radius={[3, 3, 0, 0]} />
              )}
              {showFuel && (
                <Bar dataKey="fuelIdx" name={SERIES_META.fuel.short} fill={SERIES_META.fuel.color} radius={[3, 3, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "yoy-heat" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={yoyData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} interval={11} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} unit="%" />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
                formatter={(v) => `${fmt(Number(v))}%`}
              />
              <Legend />
              <ReferenceLine y={0} stroke="#64748b" />
              {showFares && (
                <Line
                  type="monotone"
                  dataKey="fareYoy"
                  name="Fares YoY"
                  stroke={SERIES_META.fares.color}
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {showFuel && (
                <Line
                  type="monotone"
                  dataKey="fuelYoy"
                  name="Fuel YoY"
                  stroke={SERIES_META.fuel.color}
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="border-t border-slate-800 px-4 py-2 text-[11px] leading-relaxed text-slate-500 sm:px-6">
        {SOURCE_NOTE}
      </p>
    </div>
  );
}
