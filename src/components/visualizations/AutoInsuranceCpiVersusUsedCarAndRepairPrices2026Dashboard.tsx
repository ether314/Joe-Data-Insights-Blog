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
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ANALYTICS,
  EPOCH_BARS,
  HEADLINE,
  LAG_CORR,
  MONTHLY,
  QUARTERLY,
  SERIES_META,
  SOURCE_NOTE,
} from "@/data/auto-insurance-cpi-versus-used-car-and-repair-prices-2026-data";

type Panel =
  | "triple-track"
  | "decoupling-ribbon"
  | "repair-wedge"
  | "used-scatter"
  | "lag-bars"
  | "epoch-bars"
  | "yoy-pulse";

type Overlay = "all" | "insurance" | "usedCars" | "bodyWork";
type Window = "full" | "spike" | "recent";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "triple-track": {
    title: "Insurance, used-car, and body-work indexes (2019 = 100)",
    subtitle: `As of ${HEADLINE.latestLabel}, insurance sits at ${HEADLINE.insuranceIdx} while used cars are at ${HEADLINE.usedCarsIdx}`,
  },
  "decoupling-ribbon": {
    title: "Insurance − used-car index gap (percentage points)",
    subtitle: `Latest gap ${HEADLINE.insUsedGapPp} pp — peak ${HEADLINE.peakInsUsedGapPp} pp in ${HEADLINE.peakInsUsedGapLabel}`,
  },
  "repair-wedge": {
    title: "Insurance − body-work index gap",
    subtitle: `Repair costs cooled faster than premiums; latest wedge ${HEADLINE.insBodyGapPp ?? "—"} pp`,
  },
  "used-scatter": {
    title: "Monthly insurance index vs used-car index",
    subtitle: `Pearson r = ${HEADLINE.corr}; best lag ${HEADLINE.bestLag.lag} month(s) at r = ${HEADLINE.bestLag.corr}`,
  },
  "lag-bars": {
    title: "Used-car → insurance correlation by lag (months)",
    subtitle: "Used-vehicle prices tend to lead insurance repricing in this sample",
  },
  "epoch-bars": {
    title: "Epoch averages across the three indexes",
    subtitle: "Insurance kept climbing after the 2021–22 used-car spike faded",
  },
  "yoy-pulse": {
    title: "Year-over-year % change by series",
    subtitle: `Peak insurance YoY ${HEADLINE.peakYoyInsurancePct}% in ${HEADLINE.peakYoyInsuranceLabel}`,
  },
};

const fmt = (n: number) => n.toFixed(1);

export function AutoInsuranceCpiVersusUsedCarAndRepairPrices2026Dashboard() {
  const [panel, setPanel] = useState<Panel>(ANALYTICS.defaultPanel);
  const [overlay, setOverlay] = useState<Overlay>("all");
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

  const scatterPts = useMemo(
    () =>
      mData
        .filter((r) => r.insuranceIdx != null && r.usedCarsIdx != null)
        .map((r) => ({
          used: r.usedCarsIdx!,
          insurance: r.insuranceIdx!,
          label: r.label,
          gap: r.insUsedGap!,
        })),
    [mData],
  );

  const showInsurance = overlay === "all" || overlay === "insurance";
  const showUsed = overlay === "all" || overlay === "usedCars";
  const showBody = overlay === "all" || overlay === "bodyWork";
  const meta = PANEL_META[panel];

  return (
    <div
      data-viz="auto-insurance-cpi-versus-used-car-and-repair-prices-2026"
      className="overflow-hidden rounded-xl border border-slate-700/40 bg-slate-950 shadow-sm"
    >
      <div className="border-b border-slate-800 bg-gradient-to-br from-orange-950 via-slate-950 to-violet-950/50 px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-orange-300/80">
          Economics · {ANALYTICS.smokeMarker}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-50 sm:text-xl">
          Auto insurance vs used-car and repair CPI, 2019 = 100
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-slate-300">
          Used-car inflation has{" "}
          <span className="text-sky-300">cooled</span> to index{" "}
          {HEADLINE.usedCarsIdx}, but motor-vehicle insurance still prints{" "}
          {HEADLINE.insuranceIdx} — a{" "}
          <span className="text-orange-300">{HEADLINE.insUsedGapPp}-point</span>{" "}
          wedge (Pearson r = {HEADLINE.corr}).
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-800 px-4 py-3 sm:px-6">
        {(
          [
            ["triple-track", "Triple track"],
            ["decoupling-ribbon", "Decoupling"],
            ["repair-wedge", "Repair wedge"],
            ["used-scatter", "Used scatter"],
            ["lag-bars", "Lag bars"],
            ["epoch-bars", "Epoch bars"],
            ["yoy-pulse", "YoY pulse"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPanel(id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              panel === id
                ? "bg-orange-500 text-slate-950"
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
            ["all", "All three"],
            ["insurance", "Insurance"],
            ["usedCars", "Used cars"],
            ["bodyWork", "Body work"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setOverlay(id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              overlay === id
                ? "bg-violet-600 text-white"
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
        {panel === "triple-track" && (
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
              {showInsurance && (
                <Line
                  type="monotone"
                  dataKey="insuranceIdx"
                  name={SERIES_META.insurance.short}
                  stroke={SERIES_META.insurance.color}
                  strokeWidth={2.5}
                  dot={false}
                  connectNulls
                />
              )}
              {showUsed && (
                <Line
                  type="monotone"
                  dataKey="usedCarsIdx"
                  name={SERIES_META.usedCars.short}
                  stroke={SERIES_META.usedCars.color}
                  strokeWidth={2.5}
                  dot={false}
                  connectNulls
                />
              )}
              {showBody && (
                <Line
                  type="monotone"
                  dataKey="bodyWorkIdx"
                  name={SERIES_META.bodyWork.short}
                  stroke={SERIES_META.bodyWork.color}
                  strokeWidth={2.5}
                  dot={false}
                  connectNulls
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "decoupling-ribbon" && (
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
                dataKey="insUsedGap"
                name="Insurance − used cars"
                stroke="#ea580c"
                fill="#ea580c"
                fillOpacity={0.35}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {panel === "repair-wedge" && (
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
                dataKey="insBodyGap"
                name="Insurance − body work"
                stroke="#a855f7"
                fill="#a855f7"
                fillOpacity={0.35}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {panel === "used-scatter" && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                type="number"
                dataKey="used"
                name="Used-car idx"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                domain={["auto", "auto"]}
              />
              <YAxis
                type="number"
                dataKey="insurance"
                name="Insurance idx"
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
                  { x: 80, y: 80 },
                  { x: 200, y: 200 },
                ]}
                stroke="#475569"
                strokeDasharray="4 4"
              />
              <Scatter name="Months" data={scatterPts} fill="#0284c7">
                {scatterPts.map((p) => (
                  <Cell key={p.label} fill={p.gap >= 0 ? "#ea580c" : "#0284c7"} />
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
                label={{
                  value: "Used cars lead by N months",
                  position: "insideBottom",
                  offset: -2,
                  fill: "#64748b",
                  fontSize: 10,
                }}
              />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} domain={[0, 0.75]} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
                formatter={(v) => Number(v).toFixed(3)}
              />
              <Bar dataKey="corr" name="Pearson r" radius={[4, 4, 0, 0]}>
                {LAG_CORR.map((row) => (
                  <Cell
                    key={row.lag}
                    fill={row.lag === HEADLINE.bestLag.lag ? "#ea580c" : "#0284c7"}
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
              {showInsurance && (
                <Bar
                  dataKey="insuranceIdx"
                  name={SERIES_META.insurance.short}
                  fill={SERIES_META.insurance.color}
                  radius={[3, 3, 0, 0]}
                />
              )}
              {showUsed && (
                <Bar
                  dataKey="usedCarsIdx"
                  name={SERIES_META.usedCars.short}
                  fill={SERIES_META.usedCars.color}
                  radius={[3, 3, 0, 0]}
                />
              )}
              {showBody && (
                <Bar
                  dataKey="bodyWorkIdx"
                  name={SERIES_META.bodyWork.short}
                  fill={SERIES_META.bodyWork.color}
                  radius={[3, 3, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "yoy-pulse" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={mData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} interval={11} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} unit="%" />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
                formatter={(v) => `${fmt(Number(v))}%`}
              />
              <Legend />
              <ReferenceLine y={0} stroke="#64748b" />
              {showInsurance && (
                <Line
                  type="monotone"
                  dataKey="yoyInsurance"
                  name="Insurance YoY"
                  stroke={SERIES_META.insurance.color}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              )}
              {showUsed && (
                <Line
                  type="monotone"
                  dataKey="yoyUsedCars"
                  name="Used cars YoY"
                  stroke={SERIES_META.usedCars.color}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              )}
              {showBody && (
                <Line
                  type="monotone"
                  dataKey="yoyBodyWork"
                  name="Body work YoY"
                  stroke={SERIES_META.bodyWork.color}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
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
