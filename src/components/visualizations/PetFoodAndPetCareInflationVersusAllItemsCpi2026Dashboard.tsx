"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
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
  ANNUAL,
  EPOCHS,
  HEADLINE,
  MONTHLY,
  MONTHLY_YOY,
  SERIES_META,
  SOURCE_NOTE,
} from "@/data/pet-food-and-pet-care-inflation-versus-all-items-cpi-2026-data";

type Panel =
  | "triple-track"
  | "gap-ribbons"
  | "yoy-pace"
  | "epoch-levels"
  | "scatter-pace"
  | "burden-ratio";

type Overlay = "all-three" | "food-vs-all" | "care-vs-all";
type Window = "full" | "spike" | "recent";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "triple-track": {
    title: "Pet food, pet care, and all-items (Jan 2019 = 100)",
    subtitle: `July 2026: food ${HEADLINE.foodIdx}, care ${HEADLINE.careIdx}, all-items ${HEADLINE.allIdx}`,
  },
  "gap-ribbons": {
    title: "Lead over all-items CPI (percentage points)",
    subtitle: `Food lead ${HEADLINE.foodGapPp} pp · care lead ${HEADLINE.careGapPp} pp (latest)`,
  },
  "yoy-pace": {
    title: "Year-over-year % change",
    subtitle: `Peak food YoY ${HEADLINE.peakFoodYoy}% (${HEADLINE.peakFoodYoyLabel}); peak care ${HEADLINE.peakCareYoy}% (${HEADLINE.peakCareYoyLabel})`,
  },
  "epoch-levels": {
    title: "Epoch-average indexes",
    subtitle: "Pre-pandemic, pandemic, 2022–23 spike, and 2024–26 averages",
  },
  "scatter-pace": {
    title: "Monthly pet indexes vs all-items",
    subtitle: "Points above the diagonal outran the broad CPI from the same 2019 base",
  },
  "burden-ratio": {
    title: "Relative pace (series ÷ all-items × 100)",
    subtitle: "2019 = 100 by construction; above 100 means the pet series pulled ahead",
  },
};

const fmt1 = (n: number) => n.toFixed(1);

export function PetFoodAndPetCareInflationVersusAllItemsCpi2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("triple-track");
  const [overlay, setOverlay] = useState<Overlay>("all-three");
  const [window, setWindow] = useState<Window>("full");

  const mData = useMemo(() => {
    if (window === "spike")
      return MONTHLY.filter((r) => r.period >= "2021-01" && r.period <= "2023-12");
    if (window === "recent") return MONTHLY.filter((r) => r.period >= "2023-01");
    return MONTHLY;
  }, [window]);

  const yoyData = useMemo(() => {
    if (window === "spike")
      return MONTHLY_YOY.filter(
        (r) => r.period >= "2021-01" && r.period <= "2023-12",
      );
    if (window === "recent")
      return MONTHLY_YOY.filter((r) => r.period >= "2023-01");
    return MONTHLY_YOY;
  }, [window]);

  const showFood = overlay !== "care-vs-all";
  const showCare = overlay !== "food-vs-all";
  const meta = PANEL_META[panel];

  const tickEvery = mData.length > 48 ? 12 : mData.length > 24 ? 6 : 3;

  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      data-viz="pet-food-and-pet-care-inflation-versus-all-items-cpi-2026"
    >
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Pet-food and pet-care indexes vs all-items · BLS NSA · Jan 2019 = 100
        </p>
        <h3 className="mt-1 text-base font-semibold text-slate-900 sm:text-lg">
          {meta.title}
        </h3>
        <p className="mt-0.5 text-sm text-slate-600">{meta.subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">
        {(
          [
            ["triple-track", "Triple track"],
            ["gap-ribbons", "Gap ribbons"],
            ["yoy-pace", "YoY pace"],
            ["epoch-levels", "Epoch bars"],
            ["scatter-pace", "Scatter"],
            ["burden-ratio", "Burden ratio"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPanel(id)}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
              panel === id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 px-4 py-2.5 sm:px-5">
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <span className="font-medium text-slate-700">Window</span>
          <select
            value={window}
            onChange={(e) => setWindow(e.target.value as Window)}
            className="rounded border border-slate-200 bg-white px-2 py-1 text-xs"
          >
            <option value="full">Full sample</option>
            <option value="spike">2021–2023 spike</option>
            <option value="recent">2023 onward</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <span className="font-medium text-slate-700">Series</span>
          <select
            value={overlay}
            onChange={(e) => setOverlay(e.target.value as Overlay)}
            className="rounded border border-slate-200 bg-white px-2 py-1 text-xs"
          >
            <option value="all-three">All three</option>
            <option value="food-vs-all">Pet food vs all-items</option>
            <option value="care-vs-all">Pet care vs all-items</option>
          </select>
        </label>
        <p className="text-xs text-slate-500">
          Food +{HEADLINE.foodPctSince2019}% · care +{HEADLINE.carePctSince2019}% ·
          all-items +{HEADLINE.allPctSince2019}% since Jan 2019
        </p>
      </div>

      <div className="h-[380px] w-full p-3 sm:p-4">
        <ResponsiveContainer width="100%" height="100%">
          {panel === "triple-track" ? (
            <LineChart data={mData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 10, fill: "#64748b" }}
                interval={tickEvery}
                minTickGap={28}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#64748b" }}
                domain={["auto", "auto"]}
                width={42}
              />
              <Tooltip
                formatter={(v, name) => [fmt1(Number(v)), String(name)]}
                labelStyle={{ fontWeight: 600 }}
              />
              <Legend />
              <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="all"
                name={SERIES_META.all.short}
                stroke={SERIES_META.all.color}
                strokeWidth={2}
                dot={false}
              />
              {showFood && (
                <Line
                  type="monotone"
                  dataKey="food"
                  name={SERIES_META.food.short}
                  stroke={SERIES_META.food.color}
                  strokeWidth={2.25}
                  dot={false}
                />
              )}
              {showCare && (
                <Line
                  type="monotone"
                  dataKey="care"
                  name={SERIES_META.care.short}
                  stroke={SERIES_META.care.color}
                  strokeWidth={2.25}
                  dot={false}
                />
              )}
            </LineChart>
          ) : panel === "gap-ribbons" ? (
            <AreaChart data={mData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 10, fill: "#64748b" }}
                interval={tickEvery}
                minTickGap={28}
              />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} width={42} />
              <Tooltip
                formatter={(v, name) => [`${fmt1(Number(v))} pp`, String(name)]}
              />
              <Legend />
              <ReferenceLine y={0} stroke="#94a3b8" />
              {showFood && (
                <Area
                  type="monotone"
                  dataKey="foodGap"
                  name="Food − all-items"
                  stroke={SERIES_META.food.color}
                  fill={SERIES_META.food.color}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              )}
              {showCare && (
                <Area
                  type="monotone"
                  dataKey="careGap"
                  name="Care − all-items"
                  stroke={SERIES_META.care.color}
                  fill={SERIES_META.care.color}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          ) : panel === "yoy-pace" ? (
            <ComposedChart
              data={yoyData}
              margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 10, fill: "#64748b" }}
                interval={Math.max(2, Math.floor(yoyData.length / 10))}
                minTickGap={28}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#64748b" }}
                width={42}
                unit="%"
              />
              <Tooltip
                formatter={(v, name) => [`${fmt1(Number(v))}%`, String(name)]}
              />
              <Legend />
              <ReferenceLine y={0} stroke="#94a3b8" />
              <Bar
                dataKey="all"
                name={SERIES_META.all.short}
                fill={SERIES_META.all.color}
                opacity={0.55}
              />
              {showFood && (
                <Line
                  type="monotone"
                  dataKey="food"
                  name={SERIES_META.food.short}
                  stroke={SERIES_META.food.color}
                  strokeWidth={2.25}
                  dot={false}
                />
              )}
              {showCare && (
                <Line
                  type="monotone"
                  dataKey="care"
                  name={SERIES_META.care.short}
                  stroke={SERIES_META.care.color}
                  strokeWidth={2.25}
                  dot={false}
                />
              )}
            </ComposedChart>
          ) : panel === "epoch-levels" ? (
            <BarChart
              data={EPOCHS}
              margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#64748b" }}
                interval={0}
              />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} width={42} />
              <Tooltip formatter={(v, name) => [fmt1(Number(v)), String(name)]} />
              <Legend />
              <Bar
                dataKey="all"
                name={SERIES_META.all.short}
                fill={SERIES_META.all.color}
              />
              {showFood && (
                <Bar
                  dataKey="food"
                  name={SERIES_META.food.short}
                  fill={SERIES_META.food.color}
                />
              )}
              {showCare && (
                <Bar
                  dataKey="care"
                  name={SERIES_META.care.short}
                  fill={SERIES_META.care.color}
                />
              )}
            </BarChart>
          ) : panel === "scatter-pace" ? (
            <ScatterChart margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="all"
                name="All-items"
                tick={{ fontSize: 10, fill: "#64748b" }}
                domain={[95, "auto"]}
                label={{
                  value: "All-items index",
                  position: "insideBottom",
                  offset: -2,
                  fontSize: 11,
                  fill: "#64748b",
                }}
              />
              <YAxis
                type="number"
                dataKey="value"
                name="Pet index"
                tick={{ fontSize: 10, fill: "#64748b" }}
                domain={[95, "auto"]}
                width={42}
                label={{
                  value: "Pet index",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 11,
                  fill: "#64748b",
                }}
              />
              <ZAxis range={[40, 40]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) => [fmt1(Number(v)), String(name)]}
              />
              <Legend />
              <ReferenceLine
                segment={[
                  { x: 95, y: 95 },
                  { x: 150, y: 150 },
                ]}
                stroke="#94a3b8"
                strokeDasharray="4 4"
              />
              {showFood && (
                <Scatter
                  name="Pet food"
                  data={mData.map((r) => ({
                    all: r.all,
                    value: r.food,
                    period: r.period,
                  }))}
                  fill={SERIES_META.food.color}
                  fillOpacity={0.7}
                />
              )}
              {showCare && (
                <Scatter
                  name="Pet care"
                  data={mData.map((r) => ({
                    all: r.all,
                    value: r.care,
                    period: r.period,
                  }))}
                  fill={SERIES_META.care.color}
                  fillOpacity={0.65}
                />
              )}
            </ScatterChart>
          ) : (
            <LineChart data={mData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 10, fill: "#64748b" }}
                interval={tickEvery}
                minTickGap={28}
              />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} width={42} />
              <Tooltip
                formatter={(v, name) => [fmt1(Number(v)), String(name)]}
              />
              <Legend />
              <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="4 4" />
              {showFood && (
                <Line
                  type="monotone"
                  dataKey="foodBurden"
                  name="Food ÷ all-items × 100"
                  stroke={SERIES_META.food.color}
                  strokeWidth={2.25}
                  dot={false}
                />
              )}
              {showCare && (
                <Line
                  type="monotone"
                  dataKey="careBurden"
                  name="Care ÷ all-items × 100"
                  stroke={SERIES_META.care.color}
                  strokeWidth={2.25}
                  dot={false}
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="grid gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-600 sm:grid-cols-3 sm:px-5">
        <p>
          <span className="font-semibold text-slate-800">Annual peek · </span>
          {ANNUAL.filter((a) => a.year >= 2022)
            .map(
              (a) =>
                `${a.year}: food ${fmt1(a.food)} / care ${fmt1(a.care)} / all ${fmt1(a.all)}`,
            )
            .join(" · ")}
        </p>
        <p className="sm:col-span-2">{SOURCE_NOTE}</p>
      </div>
    </div>
  );
}
