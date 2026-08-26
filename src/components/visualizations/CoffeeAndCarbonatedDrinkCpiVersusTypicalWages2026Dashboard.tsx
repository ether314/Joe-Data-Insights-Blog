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
  ANNUAL,
  HEADLINE,
  MONTHLY_YOY,
  QUARTERLY,
  SERIES_META,
  SOURCE_NOTE,
} from "@/data/coffee-and-carbonated-drink-cpi-versus-typical-wages-2026-data";

type Panel =
  | "index-race"
  | "gap-fan"
  | "wage-burden"
  | "yoy-heat"
  | "latest-ladder"
  | "annual-bars";

type Focus = "both" | "coffee" | "soda";
type Window = "full" | "post22";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "index-race": {
    title: "Coffee, soda, wages, and all-items CPI (2019 = 100)",
    subtitle: `By ${HEADLINE.latestQuarter}, coffee sits at ${HEADLINE.coffeeIndex} while median weekly earnings are at ${HEADLINE.wageIndex}`,
  },
  "gap-fan": {
    title: "Beverage − wage index gap",
    subtitle: `Coffee leads wages by ${HEADLINE.coffeeWageGapPp} pp; soda trails by ${Math.abs(HEADLINE.sodaWageGapPp)} pp`,
  },
  "wage-burden": {
    title: "Wage-burden index (beverage ÷ wages × 100)",
    subtitle: `Coffee burden ${HEADLINE.coffeeBurden} vs soda ${HEADLINE.sodaBurden} — minutes of work relative to 2019`,
  },
  "yoy-heat": {
    title: "12-month % change — coffee vs carbonated drinks",
    subtitle: `Coffee YoY peaked at +${HEADLINE.coffeePeakYoyPct}% in ${HEADLINE.coffeePeakYoyLabel}`,
  },
  "latest-ladder": {
    title: `Latest levels (${HEADLINE.latestQuarter})`,
    subtitle: "Same 2019 = 100 scale — coffee alone clears wages and all-items",
  },
  "annual-bars": {
    title: "Annual average indexes",
    subtitle: "Coffee re-accelerated in 2025–26 after tracking wages through 2024",
  },
};

const fmtIdx = (n: number) => n.toFixed(1);
const tipIdx = (v: unknown) =>
  typeof v === "number" ? fmtIdx(v) : String(v ?? "");

function heatColor(v: number): string {
  if (v >= 12) return "#7c2d12";
  if (v >= 6) return "#c2410c";
  if (v >= 2) return "#fdba74";
  if (v >= -2) return "#e2e8f0";
  return "#67e8f9";
}

export function CoffeeAndCarbonatedDrinkCpiVersusTypicalWages2026Dashboard() {
  const [panel, setPanel] = useState<Panel>(ANALYTICS.defaultPanel);
  const [focus, setFocus] = useState<Focus>("both");
  const [window, setWindow] = useState<Window>("full");

  const qData = useMemo(() => {
    const rows = QUARTERLY;
    return window === "post22" ? rows.filter((r) => r.year >= 2022) : rows;
  }, [window]);

  const yoyData = useMemo(() => {
    const rows = MONTHLY_YOY;
    return window === "post22" ? rows.filter((r) => r.label >= "2022-01") : rows;
  }, [window]);

  const showCoffee = focus !== "soda";
  const showSoda = focus !== "coffee";

  const ladder = [
    { key: "coffee", label: SERIES_META.coffee.short, value: HEADLINE.coffeeIndex, color: SERIES_META.coffee.color },
    { key: "wages", label: SERIES_META.wages.short, value: HEADLINE.wageIndex, color: SERIES_META.wages.color },
    { key: "allItems", label: SERIES_META.allItems.short, value: HEADLINE.allItemsIndex, color: SERIES_META.allItems.color },
    { key: "soda", label: SERIES_META.soda.short, value: HEADLINE.sodaIndex, color: SERIES_META.soda.color },
  ].sort((a, b) => b.value - a.value);

  const heatYears = useMemo(() => {
    const labels = yoyData.map((r) => r.label);
    const years = [...new Set(labels.map((l) => l.slice(0, 4)))];
    return years.slice(-5);
  }, [yoyData]);

  const heatMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

  const meta = PANEL_META[panel];

  return (
    <div
      data-viz="coffee-and-carbonated-drink-cpi-versus-typical-wages-2026"
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 bg-gradient-to-br from-amber-50 via-white to-slate-50 px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-900/70">
          Food &amp; Agriculture · {ANALYTICS.smokeMarker}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
          Coffee and soda CPI vs wage index, 2019 = 100
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          Coffee has run {HEADLINE.coffeeWageGapPp} index points ahead of median
          weekly earnings; carbonated drinks sit {Math.abs(HEADLINE.sodaWageGapPp)}{" "}
          points behind.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3 sm:px-6">
        {(
          [
            ["index-race", "Index race"],
            ["gap-fan", "Wage gaps"],
            ["wage-burden", "Wage burden"],
            ["yoy-heat", "YoY heat"],
            ["latest-ladder", "Latest ladder"],
            ["annual-bars", "Annual bars"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPanel(id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              panel === id
                ? "bg-amber-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-2.5 sm:px-6">
        <span className="text-xs font-medium text-slate-500">Focus</span>
        {(
          [
            ["both", "Coffee + soda"],
            ["coffee", "Coffee only"],
            ["soda", "Soda only"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFocus(id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              focus === id
                ? "bg-cyan-800 text-white"
                : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-2 text-xs font-medium text-slate-500">Window</span>
        {(
          [
            ["full", "Since 2019"],
            ["post22", "Since 2022"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setWindow(id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              window === id
                ? "bg-slate-800 text-white"
                : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 sm:px-6">
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-slate-800">{meta.title}</h4>
          <p className="text-xs text-slate-500">{meta.subtitle}</p>
        </div>

        {panel === "index-race" && (
          <div className="h-[340px] w-full">
            <ResponsiveContainer>
              <ComposedChart data={qData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => tipIdx(v)} />
                <Legend />
                <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="4 4" />
                {showCoffee && (
                  <Line
                    type="monotone"
                    dataKey="coffee"
                    name={SERIES_META.coffee.label}
                    stroke={SERIES_META.coffee.color}
                    strokeWidth={2.5}
                    dot={false}
                  />
                )}
                {showSoda && (
                  <Line
                    type="monotone"
                    dataKey="soda"
                    name={SERIES_META.soda.label}
                    stroke={SERIES_META.soda.color}
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="wages"
                  name={SERIES_META.wages.label}
                  stroke={SERIES_META.wages.color}
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="allItems"
                  name={SERIES_META.allItems.label}
                  stroke={SERIES_META.allItems.color}
                  strokeWidth={1.5}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "gap-fan" && (
          <div className="h-[340px] w-full">
            <ResponsiveContainer>
              <AreaChart data={qData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => `${tipIdx(v)} pp`} />
                <Legend />
                <ReferenceLine y={0} stroke="#64748b" />
                {showCoffee && (
                  <Area
                    type="monotone"
                    dataKey="coffeeGap"
                    name="Coffee − wages"
                    stroke={SERIES_META.coffee.color}
                    fill={SERIES_META.coffee.color}
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                )}
                {showSoda && (
                  <Area
                    type="monotone"
                    dataKey="sodaGap"
                    name="Soda − wages"
                    stroke={SERIES_META.soda.color}
                    fill={SERIES_META.soda.color}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "wage-burden" && (
          <div className="h-[340px] w-full">
            <ResponsiveContainer>
              <ComposedChart data={qData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis domain={[80, "auto"]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => tipIdx(v)} />
                <Legend />
                <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="4 4" label="2019" />
                {showCoffee && (
                  <Line
                    type="monotone"
                    dataKey="coffeeBurden"
                    name="Coffee burden"
                    stroke={SERIES_META.coffee.color}
                    strokeWidth={2.5}
                    dot={false}
                  />
                )}
                {showSoda && (
                  <Line
                    type="monotone"
                    dataKey="sodaBurden"
                    name="Soda burden"
                    stroke={SERIES_META.soda.color}
                    strokeWidth={2}
                    dot={false}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "yoy-heat" && (
          <div className="overflow-x-auto">
            <p className="mb-2 text-xs text-slate-500">
              Showing {focus === "soda" ? "carbonated drinks" : focus === "coffee" ? "coffee" : "coffee (cells)"} YoY % —
              darker amber = hotter price growth
            </p>
            <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `64px repeat(${heatMonths.length}, minmax(28px, 1fr))` }}>
              <div />
              {heatMonths.map((mo) => (
                <div key={mo} className="text-center text-[10px] text-slate-400">
                  {mo}
                </div>
              ))}
              {heatYears.map((year) => (
                <div key={year} className="contents">
                  <div className="pr-2 text-right text-[11px] font-medium text-slate-600">
                    {year}
                  </div>
                  {heatMonths.map((mo) => {
                    const label = `${year}-${mo}`;
                    const row = yoyData.find((r) => r.label === label);
                    const v = focus === "soda" ? row?.sodaYoY : row?.coffeeYoY;
                    const bg = v == null ? "#f8fafc" : heatColor(v);
                    return (
                      <div
                        key={label}
                        title={row ? `${label}: coffee ${row.coffeeYoY}% · soda ${row.sodaYoY}%` : label}
                        className="flex h-7 items-center justify-center rounded-sm text-[9px] font-medium text-slate-800"
                        style={{ backgroundColor: bg }}
                      >
                        {v == null ? "—" : v.toFixed(0)}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            {focus === "both" && (
              <div className="mt-4 h-[200px] w-full">
                <ResponsiveContainer>
                  <ComposedChart data={yoyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 9 }} interval={11} />
                    <YAxis tick={{ fontSize: 10 }} unit="%" />
                    <Tooltip formatter={(v) => `${tipIdx(v)}%`} />
                    <Legend />
                    <ReferenceLine y={0} stroke="#94a3b8" />
                    <Line type="monotone" dataKey="coffeeYoY" name="Coffee YoY" stroke={SERIES_META.coffee.color} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="sodaYoY" name="Soda YoY" stroke={SERIES_META.soda.color} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="allYoY" name="All-items YoY" stroke={SERIES_META.allItems.color} strokeWidth={1.5} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {panel === "latest-ladder" && (
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <BarChart data={ladder} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" domain={[100, "auto"]} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="label" width={72} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => tipIdx(v)} />
                <ReferenceLine x={100} stroke="#94a3b8" strokeDasharray="4 4" />
                <Bar dataKey="value" name="Index" radius={[0, 4, 4, 0]}>
                  {ladder.map((d) => (
                    <Cell key={d.key} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "annual-bars" && (
          <div className="h-[340px] w-full">
            <ResponsiveContainer>
              <BarChart
                data={ANNUAL.filter((r) => (window === "post22" ? r.year >= 2022 : true))}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => tipIdx(v)} />
                <Legend />
                <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="4 4" />
                {showCoffee && (
                  <Bar dataKey="coffee" name="Coffee" fill={SERIES_META.coffee.color} />
                )}
                {showSoda && (
                  <Bar dataKey="soda" name="Soda" fill={SERIES_META.soda.color} />
                )}
                <Bar dataKey="wages" name="Wages" fill={SERIES_META.wages.color} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>

      <p className="border-t border-slate-100 px-4 py-3 text-[11px] leading-relaxed text-slate-500 sm:px-6">
        {SOURCE_NOTE}
      </p>
    </div>
  );
}
