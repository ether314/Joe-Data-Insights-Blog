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
  FED_PULSE,
  GROWTH_SCATTER,
  HEADLINE,
  NATIONAL_PATH,
  REGION_OPTIONS,
  REGION_YIELDS_2025,
  SOURCE_NOTE,
  STATE_PANEL,
  filterStates,
  sortStates,
  type RegionFilter,
} from "@/data/cash-rents-versus-land-prices-by-state-2026-data";

type Panel =
  | "yield-path"
  | "compression-ladder"
  | "growth-scatter"
  | "region-yields"
  | "fed-pulse";

type SortKey = "compressionPp" | "yield2025Pct" | "valueGrowthPct" | "rentGrowthPct";

const COLORS = {
  value: "#0f766e",
  rent: "#b45309",
  yield: "#1d4ed8",
  compress: "#9f1239",
  muted: "#94a3b8",
  navy: "#1e3a5f",
  accent: "#0e7490",
  fedValue: "#166534",
  fedRent: "#c2410c",
};

const PANEL_LABELS: { id: Panel; label: string }[] = [
  { id: "yield-path", label: "Yield path" },
  { id: "compression-ladder", label: "Compression ladder" },
  { id: "growth-scatter", label: "Growth scatter" },
  { id: "region-yields", label: "Region yields" },
  { id: "fed-pulse", label: "Fed pulse" },
];

const SORT_LABELS: { id: SortKey; label: string }[] = [
  { id: "compressionPp", label: "Compression" },
  { id: "yield2025Pct", label: "2025 yield" },
  { id: "valueGrowthPct", label: "Value growth" },
  { id: "rentGrowthPct", label: "Rent growth" },
];

function fmtPct(n: number, digits = 2) {
  return `${n.toFixed(digits)}%`;
}

function fmtPp(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)} pp`;
}

function fmtDollar(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

export function CashRentsVersusLandPricesByState2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("yield-path");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("compressionPp");
  const [disclosedOnly, setDisclosedOnly] = useState(false);

  const ladderRows = useMemo(() => {
    let rows = filterStates(region);
    if (disclosedOnly) rows = rows.filter((r) => r.confidence === "disclosed");
    return sortStates(rows, sortKey).slice(0, 16);
  }, [region, sortKey, disclosedOnly]);

  const scatterRows = useMemo(() => {
    let rows = GROWTH_SCATTER;
    if (region !== "all") {
      rows = rows.filter(
        (r) => STATE_PANEL.find((s) => s.abbr === r.abbr)?.regionId === region,
      );
    }
    if (disclosedOnly) rows = rows.filter((r) => r.confidence === "disclosed");
    return rows;
  }, [region, disclosedOnly]);

  const regionBars = useMemo(
    () =>
      REGION_YIELDS_2025.filter((r) => r.regionId !== "united-states").sort(
        (a, b) => a.yieldPct - b.yieldPct,
      ),
    [],
  );

  return (
    <figure
      className="my-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      data-viz="cash-rents-versus-land-prices-by-state-2026"
    >
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
          Interactive — rent yield compression
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900">
          Headline — U.S. cropland yield {HEADLINE.usYield2021Pct}% →{" "}
          {HEADLINE.usYield2025Pct}% (−{HEADLINE.usYieldCompressionPp} pp)
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Cash rent rose {HEADLINE.usRentSince2021Pct}% while cropland values rose{" "}
          {HEADLINE.usValueSince2021Pct}% (2021–2025).{" "}
          {ANALYTICS.maxCompressionState} led state compression at{" "}
          {fmtPp(ANALYTICS.maxCompressionPp)}.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">
        {PANEL_LABELS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPanel(p.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              panel === p.id
                ? "bg-teal-800 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {(panel === "compression-ladder" || panel === "growth-scatter") && (
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Region
          </span>
          {REGION_OPTIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRegion(r.id)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                region === r.id
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {r.label}
            </button>
          ))}
          <span className="ml-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Sort
          </span>
          {SORT_LABELS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSortKey(s.id)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                sortKey === s.id
                  ? "bg-rose-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setDisclosedOnly((v) => !v)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              disclosedOnly
                ? "bg-amber-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {disclosedOnly ? "Disclosed only" : "Include estimates"}
          </button>
        </div>
      )}

      <div className="px-2 py-4 sm:px-4">
        {panel === "yield-path" && (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={NATIONAL_PATH}
                margin={{ top: 12, right: 48, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="dollar"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}`}
                  width={56}
                />
                <YAxis
                  yAxisId="yield"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[2.4, 3.6]}
                  width={44}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = Number(value);
                    if (name === "yieldPct") return [fmtPct(n), "Rent yield"];
                    if (name === "cashRent") return [fmtDollar(n), "Cash rent"];
                    return [fmtDollar(n), "Cropland value"];
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="dollar"
                  dataKey="croplandValue"
                  name="Cropland $/acre"
                  fill={COLORS.value}
                  opacity={0.85}
                />
                <Line
                  yAxisId="dollar"
                  type="monotone"
                  dataKey="cashRent"
                  name="Cash rent $/acre"
                  stroke={COLORS.rent}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="yield"
                  type="monotone"
                  dataKey="yieldPct"
                  name="Rent yield %"
                  stroke={COLORS.yield}
                  strokeWidth={2.5}
                  strokeDasharray="4 3"
                  dot={{ r: 3 }}
                />
                <ReferenceLine
                  yAxisId="yield"
                  y={HEADLINE.usYield2025Pct}
                  stroke={COLORS.muted}
                  strokeDasharray="2 2"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "compression-ladder" && (
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ladderRows}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v} pp`}
                />
                <YAxis
                  type="category"
                  dataKey="abbr"
                  width={36}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = Number(value);
                    if (name === "compressionPp") return [fmtPp(n), "Yield compression"];
                    return [fmtPct(n), String(name)];
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload;
                    return p ? `${p.state} (${p.region})` : "";
                  }}
                />
                <Bar dataKey="compressionPp" name="compressionPp" radius={[0, 4, 4, 0]}>
                  {ladderRows.map((r) => (
                    <Cell
                      key={r.abbr}
                      fill={r.compressionPp >= 0.5 ? COLORS.compress : COLORS.accent}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "growth-scatter" && (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 24, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="rentGrowthPct"
                  name="Rent growth"
                  unit="%"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Cash rent growth 2021→2025 (%)",
                    position: "insideBottom",
                    offset: -4,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="valueGrowthPct"
                  name="Value growth"
                  unit="%"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Cropland value growth (%)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="compressionPp" range={[60, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    const n = Number(value);
                    if (name === "compressionPp") return [fmtPp(n), "Compression"];
                    return [`${n.toFixed(1)}%`, String(name)];
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload;
                    return p ? `${p.state}` : "";
                  }}
                />
                <ReferenceLine
                  segment={[
                    { x: 0, y: 0 },
                    { x: 60, y: 60 },
                  ]}
                  stroke={COLORS.muted}
                  strokeDasharray="4 4"
                />
                <Scatter name="States" data={scatterRows} fill={COLORS.navy}>
                  {scatterRows.map((r) => (
                    <Cell
                      key={r.abbr}
                      fill={
                        r.compressionPp >= HEADLINE.usYieldCompressionPp
                          ? COLORS.compress
                          : COLORS.value
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <p className="mt-1 px-2 text-center text-xs text-slate-500">
              Points above the 45° line: land appreciated faster than cash rents (yield
              compression). Bubble size ≈ compression.
            </p>
          </div>
        )}

        {panel === "region-yields" && (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={regionBars}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 4.2]}
                />
                <YAxis
                  type="category"
                  dataKey="region"
                  width={110}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = Number(value);
                    if (name === "yieldPct") return [fmtPct(n), "2025 rent yield"];
                    return [fmtDollar(n), String(name)];
                  }}
                />
                <ReferenceLine
                  x={HEADLINE.usYield2025Pct}
                  stroke={COLORS.yield}
                  strokeDasharray="3 3"
                  label={{ value: "U.S. 2.76%", fill: COLORS.yield, fontSize: 11 }}
                />
                <Bar dataKey="yieldPct" name="yieldPct" fill={COLORS.accent} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "fed-pulse" && (
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={FED_PULSE.map((f) => ({
                  ...f,
                  label: `${f.period}`,
                  rent: f.rentYoyPct ?? 0,
                }))}
                margin={{ top: 12, right: 16, left: 8, bottom: 48 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[-3, 3]}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${Number(value).toFixed(1)}%`,
                    name === "valueYoyPct" ? "Land value YoY" : "Cash rent YoY",
                  ]}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload;
                    return p ? `${p.district} — ${p.note}` : "";
                  }}
                />
                <Legend />
                <Bar
                  dataKey="valueYoyPct"
                  name="Land value YoY"
                  fill={COLORS.fedValue}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="rent"
                  name="Cash rent YoY"
                  stroke={COLORS.fedRent}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <ReferenceLine y={0} stroke={COLORS.muted} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <figcaption className="border-t border-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-500 sm:px-5">
        {SOURCE_NOTE}
      </figcaption>
    </figure>
  );
}
