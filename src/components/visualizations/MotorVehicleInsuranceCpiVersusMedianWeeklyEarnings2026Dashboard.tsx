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
  QUARTERS,
  SERIES_META,
  SOURCE_NOTE,
} from "@/data/motor-vehicle-insurance-cpi-versus-median-weekly-earnings-2026-data";

type Panel =
  | "index-race"
  | "premium-wedge"
  | "yoy-pulse"
  | "annual-gap"
  | "burden-path"
  | "scatter-45";

type Overlay = "full" | "ins-wages" | "ins-maint";
type Window = "full" | "post2022";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "index-race": {
    title: "Insurance, maintenance, wages, all-items (2019 = 100)",
    subtitle: `By ${HEADLINE.latestQuarter}, motor-vehicle insurance sits at ${HEADLINE.insuranceIndex} while median weekly earnings are at ${HEADLINE.wageIndex}`,
  },
  "premium-wedge": {
    title: "Insurance − wage index gap (percentage points)",
    subtitle: `Latest gap ${HEADLINE.insuranceWageGapPp} pp — peak ${HEADLINE.peakGapPp} pp in ${HEADLINE.peakGapLabel}`,
  },
  "yoy-pulse": {
    title: "Year-over-year % change (monthly)",
    subtitle: `Peak insurance YoY ${HEADLINE.peakYoyPct}% in ${HEADLINE.peakYoyLabel}`,
  },
  "annual-gap": {
    title: "Calendar-year average insurance − wage gap",
    subtitle: "Positive bars mean the insurance index ran ahead of the wage index that year",
  },
  "burden-path": {
    title: "Insurance wage-burden index (insurance ÷ wages × 100)",
    subtitle: `Burden ${HEADLINE.insuranceBurden} — a 2019 “week of pay” covers less insurance basket than in ${HEADLINE.latestQuarter}`,
  },
  "scatter-45": {
    title: "Quarterly insurance index vs wage index",
    subtitle: "Points above the 45° line mean insurance outran wages that quarter",
  },
};

const fmt = (n: number) => n.toFixed(1);

export function MotorVehicleInsuranceCpiVersusMedianWeeklyEarnings2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("index-race");
  const [overlay, setOverlay] = useState<Overlay>("full");
  const [window, setWindow] = useState<Window>("full");

  const qData = useMemo(() => {
    const rows = QUARTERS.filter((r) => r.wages != null);
    return window === "post2022" ? rows.filter((r) => r.year >= 2022) : rows;
  }, [window]);

  const yoyData = useMemo(() => {
    const rows = MONTHLY.filter((r) => r.yoyInsurance != null);
    return window === "post2022" ? rows.filter((r) => r.year >= 2022) : rows;
  }, [window]);

  const annualData = useMemo(
    () => (window === "post2022" ? ANNUAL.filter((r) => r.year >= 2022) : ANNUAL),
    [window],
  );

  const scatterPts = useMemo(
    () =>
      qData.map((r) => ({
        wages: r.wages!,
        insurance: r.insurance,
        label: r.label,
        gap: r.insuranceGap,
      })),
    [qData],
  );

  const meta = PANEL_META[panel];

  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white"
      data-viz="motor-vehicle-insurance-cpi-versus-median-weekly-earnings-2026"
    >
      <div className="border-b border-slate-200 bg-slate-900 px-4 py-3 text-slate-100 sm:px-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-orange-300">
          {ANALYTICS.categoryLabel} · {ANALYTICS.smokeMarker}
        </p>
        <h3 className="mt-1 text-base font-semibold leading-snug sm:text-lg">
          Motor-vehicle insurance CPI has outrun median weekly earnings
        </h3>
        <p className="mt-1 text-sm text-slate-300">
          {HEADLINE.latestQuarter}: insurance {fmt(HEADLINE.insuranceIndex)} vs wages{" "}
          {fmt(HEADLINE.wageIndex)} (gap {fmt(HEADLINE.insuranceWageGapPp)} pp) · 2019 = 100
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 px-4 py-3 sm:px-5">
        {(
          [
            ["index-race", "Index race"],
            ["premium-wedge", "Premium wedge"],
            ["yoy-pulse", "YoY pulse"],
            ["annual-gap", "Annual gap"],
            ["burden-path", "Burden path"],
            ["scatter-45", "45° scatter"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPanel(id)}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
              panel === id
                ? "bg-orange-700 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-2.5 text-xs sm:px-5">
        <label className="flex items-center gap-1.5 text-slate-600">
          <span className="font-medium text-slate-800">Overlay</span>
          <select
            value={overlay}
            onChange={(e) => setOverlay(e.target.value as Overlay)}
            className="rounded border border-slate-300 bg-white px-2 py-1"
          >
            <option value="full">All four series</option>
            <option value="ins-wages">Insurance + wages</option>
            <option value="ins-maint">Insurance + maintenance</option>
          </select>
        </label>
        <label className="flex items-center gap-1.5 text-slate-600">
          <span className="font-medium text-slate-800">Window</span>
          <select
            value={window}
            onChange={(e) => setWindow(e.target.value as Window)}
            className="rounded border border-slate-300 bg-white px-2 py-1"
          >
            <option value="full">2019 → latest</option>
            <option value="post2022">2022 → latest</option>
          </select>
        </label>
      </div>

      <div className="px-4 pt-4 sm:px-5">
        <h4 className="text-sm font-semibold text-slate-900">{meta.title}</h4>
        <p className="mt-0.5 text-xs text-slate-500">{meta.subtitle}</p>
      </div>

      <div className="h-[360px] w-full px-2 pb-2 pt-3 sm:px-4">
        <ResponsiveContainer width="100%" height="100%">
          {panel === "index-race" ? (
            <ComposedChart data={qData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(v, name) => [fmt(Number(v)), String(name)]}
                contentStyle={{ fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="4 4" />
              {(overlay === "full" || overlay === "ins-wages" || overlay === "ins-maint") && (
                <Line
                  type="monotone"
                  dataKey="insurance"
                  name={SERIES_META.insurance.short}
                  stroke={SERIES_META.insurance.color}
                  strokeWidth={2.4}
                  dot={false}
                />
              )}
              {(overlay === "full" || overlay === "ins-wages") && (
                <Line
                  type="monotone"
                  dataKey="wages"
                  name={SERIES_META.wages.short}
                  stroke={SERIES_META.wages.color}
                  strokeWidth={2.2}
                  dot={false}
                />
              )}
              {(overlay === "full" || overlay === "ins-maint") && (
                <Line
                  type="monotone"
                  dataKey="maintenance"
                  name={SERIES_META.maintenance.short}
                  stroke={SERIES_META.maintenance.color}
                  strokeWidth={1.8}
                  strokeDasharray="5 3"
                  dot={false}
                />
              )}
              {overlay === "full" && (
                <Line
                  type="monotone"
                  dataKey="allItems"
                  name={SERIES_META.allItems.short}
                  stroke={SERIES_META.allItems.color}
                  strokeWidth={1.6}
                  dot={false}
                />
              )}
            </ComposedChart>
          ) : panel === "premium-wedge" ? (
            <ComposedChart data={qData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(v, name) => [`${fmt(Number(v))} pp`, String(name)]}
                contentStyle={{ fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={0} stroke="#334155" />
              <Area
                type="monotone"
                dataKey="insuranceGap"
                name="Ins − wages"
                stroke="#c2410c"
                fill="#fdba74"
                fillOpacity={0.55}
              />
              {overlay !== "ins-wages" && (
                <Line
                  type="monotone"
                  dataKey="maintenanceGap"
                  name="Maint. − wages"
                  stroke="#a16207"
                  strokeWidth={1.8}
                  dot={false}
                />
              )}
            </ComposedChart>
          ) : panel === "yoy-pulse" ? (
            <ComposedChart data={yoyData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 9 }} interval={5} angle={-30} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 10 }} unit="%" />
              <Tooltip
                formatter={(v, name) => [`${fmt(Number(v))}%`, String(name)]}
                contentStyle={{ fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={0} stroke="#64748b" />
              <Bar dataKey="yoyInsurance" name="Insurance YoY" fill="#c2410c" opacity={0.85} />
              {(overlay === "full" || overlay === "ins-maint") && (
                <Line
                  type="monotone"
                  dataKey="yoyMaintenance"
                  name="Maint. YoY"
                  stroke="#a16207"
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {(overlay === "full" || overlay === "ins-wages") && (
                <Line
                  type="monotone"
                  dataKey="yoyAllItems"
                  name="All-items YoY"
                  stroke="#64748b"
                  strokeWidth={1.6}
                  dot={false}
                />
              )}
            </ComposedChart>
          ) : panel === "annual-gap" ? (
            <BarChart
              data={annualData}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 8, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} unit=" pp" />
              <YAxis type="category" dataKey="year" tick={{ fontSize: 11 }} width={44} />
              <Tooltip
                formatter={(v) => [`${fmt(Number(v))} pp`, "Ins − wages"]}
                contentStyle={{ fontSize: 12 }}
              />
              <ReferenceLine x={0} stroke="#334155" />
              <Bar dataKey="insuranceGap" name="Annual gap" radius={[0, 4, 4, 0]}>
                {annualData.map((r) => (
                  <Cell
                    key={r.year}
                    fill={r.insuranceGap >= 0 ? "#c2410c" : "#0f766e"}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : panel === "burden-path" ? (
            <LineChart data={qData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(v) => [fmt(Number(v)), "Burden index"]}
                contentStyle={{ fontSize: 12 }}
              />
              <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="insuranceBurden"
                name="Burden (ins ÷ wages × 100)"
                stroke="#9a3412"
                strokeWidth={2.4}
                dot={{ r: 2.5, fill: "#c2410c" }}
              />
            </LineChart>
          ) : (
            <ScatterChart margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="wages"
                name="Wages"
                tick={{ fontSize: 10 }}
                domain={["auto", "auto"]}
                label={{ value: "Wage index", position: "insideBottom", offset: -2, fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="insurance"
                name="Insurance"
                tick={{ fontSize: 10 }}
                domain={["auto", "auto"]}
                label={{ value: "Insurance index", angle: -90, position: "insideLeft", fontSize: 11 }}
              />
              <ZAxis range={[40, 40]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) => [fmt(Number(v)), String(name)]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.label ? String(payload[0].payload.label) : ""
                }
                contentStyle={{ fontSize: 12 }}
              />
              <ReferenceLine
                segment={[
                  { x: 90, y: 90 },
                  { x: 160, y: 160 },
                ]}
                stroke="#94a3b8"
                strokeDasharray="4 4"
              />
              <Scatter name="Quarters" data={scatterPts} fill="#c2410c">
                {scatterPts.map((p) => (
                  <Cell
                    key={p.label}
                    fill={(p.gap ?? 0) >= 0 ? "#c2410c" : "#0f766e"}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="grid gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 sm:grid-cols-3 sm:px-5">
        <div>
          <span className="font-semibold text-slate-800">Insurance since 2019</span>
          <p>+{fmt(HEADLINE.insurancePctSince2019)}% (index {fmt(HEADLINE.insuranceIndex)})</p>
        </div>
        <div>
          <span className="font-semibold text-slate-800">Wages since 2019</span>
          <p>
            +{fmt(HEADLINE.wagePctSince2019)}% · ${HEADLINE.latestWageUsd}/wk median
          </p>
        </div>
        <div>
          <span className="font-semibold text-slate-800">Maintenance twin</span>
          <p>
            +{fmt(HEADLINE.maintenancePctSince2019)}% · index{" "}
            {fmt(HEADLINE.maintenanceIndex)}
          </p>
        </div>
      </div>

      <p className="border-t border-slate-100 px-4 py-2 text-[10px] leading-relaxed text-slate-400 sm:px-5">
        {SOURCE_NOTE} Monthly series shown in YoY panel; quarterly averages elsewhere. Overlay and
        window controls filter visible series and date span.
      </p>
    </div>
  );
}
