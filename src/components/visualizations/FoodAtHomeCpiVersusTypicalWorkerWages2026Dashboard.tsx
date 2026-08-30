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
  APU_BASKET,
  CATEGORY_LATEST,
  CATEGORY_MONTHLY,
  EPOCH_BARS,
  HEADLINE,
  MONTHLY,
  MONTHLY_YOY,
  QUARTERS,
  SERIES_META,
  SOURCE_NOTE,
} from "@/data/food-at-home-cpi-versus-typical-worker-wages-2026-data";

type Panel =
  | "dual-track"
  | "gap-ribbon"
  | "shelf-ladder"
  | "carton-path"
  | "home-vs-away"
  | "epoch-bars"
  | "wage-scatter";

type Overlay = "core" | "plus-away" | "plus-all";
type Window = "full" | "spike" | "recent";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "dual-track": {
    title: "Food-at-home index vs wage index (2019 = 100)",
    subtitle: `As of ${HEADLINE.latestQuarter}, food sits at ${HEADLINE.foodIdx} while median weekly earnings are at ${HEADLINE.wageIdx}`,
  },
  "gap-ribbon": {
    title: "Food − wage index gap (percentage points)",
    subtitle: `Latest gap ${HEADLINE.gapPp} pp — peak food lead ${HEADLINE.peakGapPp} pp in ${HEADLINE.peakGapLabel}`,
  },
  "shelf-ladder": {
    title: "Food-at-home sub-indexes vs 2019",
    subtitle: `Meats/eggs lead at ${HEADLINE.meatsIdx}; dairy lags at ${HEADLINE.dairyIdx}`,
  },
  "carton-path": {
    title: "Average price indexes: eggs, milk, bread",
    subtitle: `Eggs peaked at $${HEADLINE.eggsPeakUsd}/dozen in ${HEADLINE.eggsPeakLabel}; July 2026 carton is $${HEADLINE.eggsLatestUsd}`,
  },
  "home-vs-away": {
    title: "Food at home vs food away from home",
    subtitle: `Away-from-home (${HEADLINE.awayIdx}) has outrun groceries (${HEADLINE.foodIdx}) on the same 2019 = 100 scale`,
  },
  "epoch-bars": {
    title: "Epoch averages: food, wages, and away",
    subtitle: "Pre-spike, reopen, 2022–23 spike, and 2024–26 wage catch-up",
  },
  "wage-scatter": {
    title: "Quarterly food index vs wage index",
    subtitle: "Points above the diagonal mean grocery CPI outran typical pay that quarter",
  },
};

const fmt = (n: number) => n.toFixed(1);

export function FoodAtHomeCpiVersusTypicalWorkerWages2026Dashboard() {
  const [panel, setPanel] = useState<Panel>(ANALYTICS.defaultPanel);
  const [overlay, setOverlay] = useState<Overlay>("core");
  const [window, setWindow] = useState<Window>("full");

  const qData = useMemo(() => {
    if (window === "spike")
      return QUARTERS.filter((r) => r.label >= "2021Q1" && r.label <= "2023Q4");
    if (window === "recent") return QUARTERS.filter((r) => r.label >= "2023Q1");
    return QUARTERS;
  }, [window]);

  const mData = useMemo(() => {
    if (window === "spike")
      return MONTHLY.filter((r) => r.label >= "2021-01" && r.label <= "2023-12");
    if (window === "recent") return MONTHLY.filter((r) => r.label >= "2023-01");
    return MONTHLY;
  }, [window]);

  const yoyData = useMemo(() => {
    if (window === "spike")
      return MONTHLY_YOY.filter((r) => r.label >= "2021-01" && r.label <= "2023-12");
    if (window === "recent")
      return MONTHLY_YOY.filter((r) => r.label >= "2023-01");
    return MONTHLY_YOY;
  }, [window]);

  const cartonSeries = useMemo(() => {
    return mData.map((r) => ({
      label: r.label,
      eggs: r.eggsIdx,
      milk: r.milkIdx,
      bread: r.breadIdx,
    }));
  }, [mData]);

  const categoryPaths = useMemo(() => {
    const labels = CATEGORY_MONTHLY.meats
      .filter((r) => {
        if (window === "spike") return r.label >= "2021-01" && r.label <= "2023-12";
        if (window === "recent") return r.label >= "2023-01";
        return true;
      })
      .map((r) => r.label);
    return labels.map((label) => {
      const row: Record<string, string | number | null> = { label };
      for (const c of CATEGORY_LATEST) {
        const hit = CATEGORY_MONTHLY[c.id as keyof typeof CATEGORY_MONTHLY]?.find(
          (x) => x.label === label,
        );
        row[c.id] = hit?.idx ?? null;
      }
      return row;
    });
  }, [window]);

  const scatterPts = useMemo(
    () =>
      qData.map((r) => ({
        wages: r.wageIdx,
        food: r.foodIdx,
        label: r.label,
        gap: r.gapPp,
      })),
    [qData],
  );

  const meta = PANEL_META[panel];
  const showAway = overlay === "plus-away" || overlay === "plus-all";
  const showAll = overlay === "plus-all";

  return (
    <div
      data-viz="food-at-home-cpi-versus-typical-worker-wages-2026"
      className="overflow-hidden rounded-xl border border-slate-700/40 bg-slate-950 shadow-sm"
    >
      <div className="border-b border-slate-800 bg-gradient-to-br from-orange-950 via-slate-950 to-teal-950/60 px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-orange-300/85">
          Economics · {ANALYTICS.smokeMarker}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-50 sm:text-xl">
          Food-at-home index vs wage index, 2019 = 100
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-slate-300">
          Groceries briefly{" "}
          <span className="text-orange-300">outran</span> typical pay in
          2022–23 (peak gap +{HEADLINE.peakGapPp} pp in {HEADLINE.peakGapLabel}
          ). By {HEADLINE.latestQuarter}, median weekly earnings (
          {HEADLINE.wageIdx}) sit ahead of food-at-home ({HEADLINE.foodIdx}) —
          a {Math.abs(HEADLINE.gapPp)}-point wage lead.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-800 px-4 py-3 sm:px-6">
        {(
          [
            ["dual-track", "Dual track"],
            ["gap-ribbon", "Gap ribbon"],
            ["shelf-ladder", "Shelf ladder"],
            ["carton-path", "Carton path"],
            ["home-vs-away", "Home vs away"],
            ["epoch-bars", "Epoch bars"],
            ["wage-scatter", "Wage scatter"],
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
        <span className="text-xs font-medium text-slate-500">Overlay</span>
        {(
          [
            ["core", "Food + wages"],
            ["plus-away", "+ Away"],
            ["plus-all", "+ All items"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setOverlay(id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              overlay === id
                ? "bg-teal-600 text-white"
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
              <XAxis
                dataKey="label"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "#e2e8f0" }}
                formatter={(v) => fmt(Number(v))}
              />
              <Legend />
              <ReferenceLine y={100} stroke="#475569" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="foodIdx"
                name={SERIES_META.food.short}
                stroke={SERIES_META.food.color}
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="wageIdx"
                name={SERIES_META.wages.short}
                stroke={SERIES_META.wages.color}
                strokeWidth={2.5}
                dot={false}
              />
              {showAway && (
                <Line
                  type="monotone"
                  dataKey="awayIdx"
                  name={SERIES_META.away.short}
                  stroke={SERIES_META.away.color}
                  strokeWidth={1.75}
                  strokeDasharray="4 3"
                  dot={false}
                />
              )}
              {showAll && (
                <Line
                  type="monotone"
                  dataKey="allIdx"
                  name={SERIES_META.allItems.short}
                  stroke={SERIES_META.allItems.color}
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
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
              <XAxis
                dataKey="label"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 8,
                }}
                formatter={(v) => `${fmt(Number(v))} pp`}
              />
              <ReferenceLine y={0} stroke="#f8fafc" strokeWidth={1.5} />
              <Area
                type="monotone"
                dataKey="gapPp"
                name="Food − wages"
                stroke="#fb923c"
                fill="#ea580c"
                fillOpacity={0.35}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {panel === "shelf-ladder" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={[...CATEGORY_LATEST].sort((a, b) => b.idx - a.idx)}
              margin={{ top: 8, right: 24, left: 8, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                domain={[100, "auto"]}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={150}
                tick={{ fill: "#94a3b8", fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 8,
                }}
                formatter={(v) => fmt(Number(v))}
              />
              <ReferenceLine x={100} stroke="#475569" strokeDasharray="4 4" />
              <Bar dataKey="idx" name="Index (2019=100)" radius={[0, 4, 4, 0]}>
                {[...CATEGORY_LATEST]
                  .sort((a, b) => b.idx - a.idx)
                  .map((c) => (
                    <Cell key={c.id} fill={c.color} />
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "carton-path" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cartonSeries} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="label"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                interval={11}
              />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} domain={[80, "auto"]} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 8,
                }}
                formatter={(v) => fmt(Number(v))}
              />
              <Legend />
              <ReferenceLine y={100} stroke="#475569" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="eggs"
                name="Eggs"
                stroke={APU_BASKET[0].color}
                strokeWidth={2.25}
                dot={false}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="milk"
                name="Milk"
                stroke={APU_BASKET[1].color}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="bread"
                name="Bread"
                stroke={APU_BASKET[2].color}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {panel === "home-vs-away" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={mData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="label"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                interval={11}
              />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 8,
                }}
                formatter={(v) => fmt(Number(v))}
              />
              <Legend />
              <ReferenceLine y={100} stroke="#475569" strokeDasharray="4 4" />
              <Area
                type="monotone"
                dataKey="foodIdx"
                name="Food at home"
                stroke={SERIES_META.food.color}
                fill={SERIES_META.food.color}
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="awayIdx"
                name="Food away"
                stroke={SERIES_META.away.color}
                strokeWidth={2.5}
                dot={false}
              />
              {showAll && (
                <Line
                  type="monotone"
                  dataKey="allIdx"
                  name="All items"
                  stroke={SERIES_META.allItems.color}
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "epoch-bars" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={EPOCH_BARS} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} domain={[95, "auto"]} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 8,
                }}
                formatter={(v) => fmt(Number(v))}
              />
              <Legend />
              <Bar dataKey="foodIdx" name="Food at home" fill={SERIES_META.food.color} />
              <Bar dataKey="wageIdx" name="Wages" fill={SERIES_META.wages.color} />
              <Bar dataKey="awayIdx" name="Food away" fill={SERIES_META.away.color} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "wage-scatter" && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                type="number"
                dataKey="wages"
                name="Wages"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                domain={["auto", "auto"]}
                label={{
                  value: "Wage index",
                  position: "insideBottom",
                  offset: -2,
                  fill: "#64748b",
                  fontSize: 11,
                }}
              />
              <YAxis
                type="number"
                dataKey="food"
                name="Food"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                domain={["auto", "auto"]}
                label={{
                  value: "Food index",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#64748b",
                  fontSize: 11,
                }}
              />
              <ZAxis range={[40, 40]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 8,
                }}
                formatter={(v, name) => [fmt(Number(v)), String(name)]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.label
                    ? String(payload[0].payload.label)
                    : ""
                }
              />
              <ReferenceLine
                segment={[
                  { x: 95, y: 95 },
                  { x: 140, y: 140 },
                ]}
                stroke="#475569"
                strokeDasharray="4 4"
              />
              <Scatter name="Quarters" data={scatterPts} fill="#fb923c" />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>

      {panel === "shelf-ladder" && categoryPaths.length > 0 ? (
        <p className="px-4 pb-1 text-[11px] text-slate-500 sm:px-6">
          YoY food-at-home peak {HEADLINE.peakYoyPct}% in {HEADLINE.peakYoyLabel} ·
          sample months in view: {yoyData.length}
        </p>
      ) : null}

      <p className="border-t border-slate-800 px-4 py-2.5 text-[11px] leading-relaxed text-slate-500 sm:px-6">
        {SOURCE_NOTE}
      </p>
    </div>
  );
}
