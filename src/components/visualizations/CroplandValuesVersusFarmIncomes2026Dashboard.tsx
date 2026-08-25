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
  CROPLAND_BY_REGION,
  DECOUPLE_SCATTER,
  HEADLINE,
  NATIONAL_PATH,
  RATE_BANDS,
  REGION_OPTIONS,
  RENT_YIELD_STRESS,
  SOURCE_NOTE,
  regionSeries,
  type RegionCompareKey,
} from "@/data/cropland-values-versus-farm-incomes-2026-data";

type Panel =
  | "national-path"
  | "regional-bars"
  | "decouple-scatter"
  | "yield-stress"
  | "rate-bands";

type SpecFilter = "all" | "row-crop" | "cattle" | "specialty-urban" | "mixed";

const COLORS = {
  cropland: "#0f766e",
  income: "#b45309",
  accent: "#dc2626",
  muted: "#94a3b8",
  navy: "#1e3a5f",
  bar: "#15803d",
  stress: "#7c2d12",
  rowCrop: "#166534",
  cattle: "#a16207",
  specialty: "#1d4ed8",
  mixed: "#6d28d9",
};

const PANEL_LABELS: { id: Panel; label: string }[] = [
  { id: "national-path", label: "National path" },
  { id: "regional-bars", label: "Regional cropland" },
  { id: "decouple-scatter", label: "Decoupling scatter" },
  { id: "yield-stress", label: "Rent-yield stress" },
  { id: "rate-bands", label: "Rate bands" },
];

function specColor(spec: string) {
  if (spec === "row-crop") return COLORS.rowCrop;
  if (spec === "cattle") return COLORS.cattle;
  if (spec === "specialty-urban") return COLORS.specialty;
  return COLORS.mixed;
}

function fmtDollar(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

function fmtPct(n: number, digits = 1) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function CroplandValuesVersusFarmIncomes2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("national-path");
  const [regionId, setRegionId] = useState<RegionCompareKey>("corn-belt");
  const [specFilter, setSpecFilter] = useState<SpecFilter>("all");
  const [metric, setMetric] = useState<"since2021" | "yoy">("since2021");

  const nationalChart = useMemo(
    () =>
      NATIONAL_PATH.map((r) => ({
        year: r.year,
        croplandIndex: r.croplandIndex,
        nfiIndex: r.nfiIndex,
        nfiBn: r.nfiBn,
      })),
    [],
  );

  const regionalBars = useMemo(() => {
    return CROPLAND_BY_REGION.filter((r) => r.regionId !== "united-states")
      .map((r) => ({
        region: r.region.replace(" States", ""),
        full: r.region,
        value: metric === "since2021" ? r.since2021Pct : r.yoy2425Pct,
        level: r.y2025,
      }))
      .sort((a, b) => b.value - a.value);
  }, [metric]);

  const scatterData = useMemo(() => {
    return DECOUPLE_SCATTER.filter(
      (r) => specFilter === "all" || r.specialization === specFilter,
    ).map((r) => ({
      ...r,
      x: r.incomePressurePct,
      y: r.croplandSince2021Pct,
      z: Math.max(40, r.gapPp),
      fill: specColor(r.specialization),
    }));
  }, [specFilter]);

  const regionPath = useMemo(() => {
    const series = regionSeries(regionId);
    const us = regionSeries("united-states");
    return series.map((p, i) => ({
      year: p.year,
      region: p.value,
      us: us[i]?.value ?? null,
    }));
  }, [regionId]);

  const regionLabel =
    REGION_OPTIONS.find((r) => r.id === regionId)?.label ?? regionId;

  return (
    <figure
      className="not-prose my-8"
      data-viz="cropland-values-versus-farm-incomes-2026"
    >
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-gradient-to-b from-stone-50 to-white shadow-sm">
        <div className="border-b border-stone-200 bg-[#0c1a2e] px-4 py-4 text-white sm:px-6">
          <p className="text-xs font-medium uppercase tracking-wider text-teal-300/90">
            Headline — $/acre vs income index
          </p>
          <p className="mt-1 text-lg font-semibold leading-snug sm:text-xl">
            U.S. cropland {fmtDollar(HEADLINE.usCropland2025PerAcre)}/acre in
            2025 — NFI still {Math.abs(HEADLINE.nfiVs2022PeakPct).toFixed(0)}%
            below the 2022 peak
          </p>
          <p className="mt-2 max-w-3xl text-sm text-stone-300">
            Lake States led 2024–25 cropland gains at +{ANALYTICS.maxYoyPct}%;
            Northern Plains shows the widest estimated value–income gap (+
            {ANALYTICS.maxGapPp} pp since 2021).
          </p>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-stone-200 bg-stone-50/80 px-4 py-3 sm:px-6">
          {PANEL_LABELS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPanel(p.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                panel === p.id
                  ? "bg-[#0c1a2e] text-white"
                  : "bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-stone-100"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 px-4 py-3 sm:px-6">
          {panel === "regional-bars" && (
            <>
              <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                Metric
              </span>
              <button
                type="button"
                onClick={() => setMetric("since2021")}
                className={`rounded-md px-2.5 py-1 text-sm ${
                  metric === "since2021"
                    ? "bg-teal-800 text-white"
                    : "bg-stone-100 text-stone-700"
                }`}
              >
                Since 2021
              </button>
              <button
                type="button"
                onClick={() => setMetric("yoy")}
                className={`rounded-md px-2.5 py-1 text-sm ${
                  metric === "yoy"
                    ? "bg-teal-800 text-white"
                    : "bg-stone-100 text-stone-700"
                }`}
              >
                2024–25 YoY
              </button>
            </>
          )}

          {panel === "decouple-scatter" && (
            <>
              <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                Specialization
              </span>
              {(
                [
                  ["all", "All regions"],
                  ["row-crop", "Row-crop"],
                  ["cattle", "Cattle"],
                  ["specialty-urban", "Specialty / urban"],
                  ["mixed", "Mixed"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSpecFilter(id)}
                  className={`rounded-md px-2.5 py-1 text-sm ${
                    specFilter === id
                      ? "bg-teal-800 text-white"
                      : "bg-stone-100 text-stone-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </>
          )}

          {(panel === "national-path" || panel === "yield-stress") && (
            <>
              <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                Focus region
              </span>
              <select
                value={regionId}
                onChange={(e) =>
                  setRegionId(e.target.value as RegionCompareKey)
                }
                className="rounded-md border border-stone-200 bg-white px-2 py-1 text-sm text-stone-800"
                aria-label="Focus region"
              >
                {REGION_OPTIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
              <span className="text-xs text-stone-500">
                Overlay: {regionLabel} vs U.S. cropland path
              </span>
            </>
          )}

          {panel === "rate-bands" && (
            <span className="text-sm text-stone-600">
              Scenario: shift U.S. implied rent yield ({HEADLINE.usImpliedRentYieldPct}
              %) holding 2025 rent at ${HEADLINE.usCroplandRent2025}/acre
            </span>
          )}
        </div>

        <div className="px-2 py-4 sm:px-4 sm:py-6">
          {panel === "national-path" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-[320px] w-full">
                <p className="mb-2 px-2 text-sm font-medium text-stone-700">
                  Index (2021 = 100): cropland $/acre vs net farm income
                </p>
                <ResponsiveContainer width="100%" height="90%">
                  <ComposedChart data={nationalChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[90, 150]} />
                    <Tooltip
                      formatter={(v, name) => [
                        typeof v === "number" ? v.toFixed(1) : v,
                        name === "croplandIndex"
                          ? "Cropland index"
                          : "NFI index",
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="croplandIndex"
                      name="Cropland $/acre"
                      stroke={COLORS.cropland}
                      strokeWidth={2.5}
                      connectNulls={false}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="nfiIndex"
                      name="Net farm income"
                      stroke={COLORS.income}
                      strokeWidth={2.5}
                      strokeDasharray="5 4"
                      dot={{ r: 3 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="h-[320px] w-full">
                <p className="mb-2 px-2 text-sm font-medium text-stone-700">
                  {regionLabel} vs U.S. cropland ($/acre)
                </p>
                <ResponsiveContainer width="100%" height="90%">
                  <ComposedChart data={regionPath}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                    />
                    <Tooltip
                      formatter={(v) =>
                        typeof v === "number" ? fmtDollar(v) : v
                      }
                    />
                    <Legend />
                    <Bar
                      dataKey="region"
                      name={regionLabel}
                      fill={COLORS.navy}
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      type="monotone"
                      dataKey="us"
                      name="U.S. average"
                      stroke={COLORS.accent}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {panel === "regional-bars" && (
            <div className="h-[380px] w-full">
              <p className="mb-2 px-2 text-sm font-medium text-stone-700">
                Cropland value change by NASS region (
                {metric === "since2021" ? "2021→2025" : "2024→2025"})
              </p>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  data={regionalBars}
                  layout="vertical"
                  margin={{ left: 8, right: 24 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="region"
                    width={100}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => [
                      typeof v === "number" ? fmtPct(v) : v,
                      metric === "since2021" ? "Since 2021" : "YoY",
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.full ?? ""
                    }
                  />
                  <Bar dataKey="value" name="Change %" radius={[0, 4, 4, 0]}>
                    {regionalBars.map((row) => (
                      <Cell
                        key={row.full}
                        fill={
                          row.value >= HEADLINE.usCroplandSince2021Pct &&
                          metric === "since2021"
                            ? COLORS.bar
                            : row.value >= HEADLINE.usCroplandYoyPct &&
                                metric === "yoy"
                              ? COLORS.bar
                              : COLORS.navy
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {panel === "decouple-scatter" && (
            <div className="h-[380px] w-full">
              <p className="mb-2 px-2 text-sm font-medium text-stone-700">
                Cropland growth vs estimated income pressure (2021→2024/25) —
                bubble size = gap
              </p>
              <ResponsiveContainer width="100%" height="88%">
                <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Income pressure"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "Est. income pressure %",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                    domain={[-40, 15]}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Cropland growth"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "Cropland +% since 2021",
                      angle: -90,
                      position: "insideLeft",
                      offset: 10,
                      fontSize: 11,
                    }}
                    domain={[15, 50]}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <ReferenceLine x={0} stroke={COLORS.muted} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => {
                      if (name === "y")
                        return [
                          typeof v === "number" ? fmtPct(v) : v,
                          "Cropland since 2021",
                        ];
                      if (name === "x")
                        return [
                          typeof v === "number" ? fmtPct(v) : v,
                          "Income pressure",
                        ];
                      return [v, name];
                    }}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.region ?? ""
                    }
                  />
                  <Scatter name="Regions" data={scatterData}>
                    {scatterData.map((d) => (
                      <Cell key={d.regionId} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              <div className="mt-1 flex flex-wrap gap-3 px-2 text-xs text-stone-500">
                <span className="inline-flex items-center gap-1">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: COLORS.rowCrop }}
                  />
                  Row-crop
                </span>
                <span className="inline-flex items-center gap-1">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: COLORS.cattle }}
                  />
                  Cattle
                </span>
                <span className="inline-flex items-center gap-1">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: COLORS.specialty }}
                  />
                  Specialty / urban
                </span>
                <span className="inline-flex items-center gap-1">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: COLORS.mixed }}
                  />
                  Mixed
                </span>
              </div>
            </div>
          )}

          {panel === "yield-stress" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-[340px] w-full">
                <p className="mb-2 px-2 text-sm font-medium text-stone-700">
                  Implied rent yield (2025 cash rent ÷ cropland value)
                </p>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart
                    data={[...RENT_YIELD_STRESS].sort(
                      (a, b) => a.yieldPct - b.yieldPct,
                    )}
                    layout="vertical"
                    margin={{ left: 8, right: 16 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => `${v}%`}
                      domain={[0, 4.5]}
                    />
                    <YAxis
                      type="category"
                      dataKey="region"
                      width={100}
                      tick={{ fontSize: 11 }}
                    />
                    <ReferenceLine
                      x={3.5}
                      stroke={COLORS.accent}
                      strokeDasharray="4 4"
                      label={{
                        value: "3.5% stress",
                        fill: COLORS.accent,
                        fontSize: 10,
                      }}
                    />
                    <Tooltip
                      formatter={(v) =>
                        typeof v === "number" ? `${v.toFixed(2)}%` : v
                      }
                    />
                    <Bar
                      dataKey="yieldPct"
                      name="Yield %"
                      fill={COLORS.cropland}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-[340px] w-full">
                <p className="mb-2 px-2 text-sm font-medium text-stone-700">
                  Value compression if yields reprice to 3.5%
                </p>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart
                    data={RENT_YIELD_STRESS}
                    layout="vertical"
                    margin={{ left: 8, right: 16 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="region"
                      width={100}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(v) =>
                        typeof v === "number" ? fmtPct(v) : v
                      }
                    />
                    <Bar
                      dataKey="compressionPct"
                      name="Value Δ at 3.5%"
                      fill={COLORS.stress}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {panel === "rate-bands" && (
            <div className="h-[360px] w-full">
              <p className="mb-2 px-2 text-sm font-medium text-stone-700">
                National implied cropland value under rent-yield shifts
              </p>
              <ResponsiveContainer width="100%" height="88%">
                <ComposedChart data={RATE_BANDS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    domain={[50, 170]}
                    tickFormatter={(v) => `${v}`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      typeof v === "number"
                        ? name === "impliedUsValue"
                          ? fmtDollar(v)
                          : v.toFixed(1)
                        : v,
                      name === "impliedUsValue" ? "$/acre" : "Index (base=100)",
                    ]}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="impliedUsValue"
                    name="Implied $/acre"
                    fill={COLORS.navy}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="index"
                    name="Index"
                    stroke={COLORS.accent}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
              <p className="mt-2 px-2 text-xs text-stone-500">
                +100 bp on the implied yield maps to roughly a{" "}
                {ANALYTICS.plus100bpImpliedDropPct}% haircut vs the 2025 survey
                average — a scenario, not a NASS forecast.
              </p>
            </div>
          )}
        </div>

        <figcaption className="border-t border-stone-200 bg-stone-50 px-4 py-3 text-xs leading-relaxed text-stone-500 sm:px-6">
          {SOURCE_NOTE}
        </figcaption>
      </div>
    </figure>
  );
}
