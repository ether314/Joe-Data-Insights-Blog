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
  DUAL_INDEX,
  FLOW_PROXY,
  HEADLINE,
  OFFENSE_MIX,
  SHORTFALL_VS_2019,
  SOURCE_NOTE,
  filterDualIndex,
  filterGeography,
  type GeographyFilter,
  type SeriesFilter,
} from "@/data/jail-adp-versus-property-crime-after-2019-2026-data";

type Panel =
  | "dual-index"
  | "shortfall"
  | "offense-mix"
  | "flow-proxy"
  | "geography"
  | "gap-cloud";

type MetricMode = "adp" | "midyear";
type ScaleMode = "index" | "level";

const COLORS = {
  adp: "#0f766e",
  midyear: "#0e7490",
  property: "#b45309",
  admissions: "#7c3aed",
  burglary: "#1e3a5f",
  larceny: "#64748b",
  mvt: "#be123c",
  gap: "#9f1239",
  grid: "#e2e8f0",
  ref: "#94a3b8",
  rural: "#047857",
  urban: "#1d4ed8",
};

const PANEL_LABELS: { id: Panel; label: string }[] = [
  { id: "dual-index", label: "Dual index" },
  { id: "shortfall", label: "2019 shortfall" },
  { id: "offense-mix", label: "Offense mix" },
  { id: "flow-proxy", label: "Admissions vs ADP" },
  { id: "geography", label: "Urban–rural refill" },
  { id: "gap-cloud", label: "Gap cloud" },
];

const SERIES_LABELS: { id: SeriesFilter; label: string }[] = [
  { id: "all", label: "2015–2023" },
  { id: "post2019", label: "From 2019" },
  { id: "recovery", label: "Recovery window" },
];

const GEO_LABELS: { id: GeographyFilter; label: string }[] = [
  { id: "all", label: "All segments" },
  { id: "urban-lean", label: "Urban lean" },
  { id: "rural-lean", label: "Rural lean" },
];

function fmtK(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
  return String(n);
}

function fmtIdx(n: number) {
  return `${n.toFixed(1)}`;
}

export function JailAdpVersusPropertyCrimeAfter20192026Dashboard() {
  const [panel, setPanel] = useState<Panel>("dual-index");
  const [seriesFilter, setSeriesFilter] = useState<SeriesFilter>("post2019");
  const [geoFilter, setGeoFilter] = useState<GeographyFilter>("all");
  const [metricMode, setMetricMode] = useState<MetricMode>("adp");
  const [scaleMode, setScaleMode] = useState<ScaleMode>("index");
  const [showAdmissions, setShowAdmissions] = useState(false);

  const dualRows = useMemo(() => {
    return filterDualIndex(seriesFilter).map((r) => {
      const jailIndex = metricMode === "adp" ? r.adpIndex : r.midyearIndex;
      const jailLevel = metricMode === "adp" ? r.adp : r.midyearConfined;
      const admissionsIndex = Number(
        ((r.admissions / HEADLINE.admissions2019) * 100).toFixed(1),
      );
      return {
        year: r.year,
        label: String(r.year),
        jailIndex,
        propertyIndex: r.propertyIndex,
        jailLevel,
        propertyRate: r.propertyRate,
        admissionsIndex,
        gap:
          r.propertyIndex == null
            ? null
            : Number((jailIndex - r.propertyIndex).toFixed(1)),
        propertySource: r.propertySource,
      };
    });
  }, [seriesFilter, metricMode]);

  const shortfallRows = useMemo(
    () =>
      SHORTFALL_VS_2019.filter((r) =>
        seriesFilter === "recovery" ? r.year >= 2020 : true,
      ).map((r) => ({
        ...r,
        propertyShortfallPct: r.propertyShortfallPct ?? 0,
        propertyMissing: r.propertyShortfallPct == null,
      })),
    [seriesFilter],
  );

  const offenseRows = useMemo(
    () =>
      OFFENSE_MIX.map((r) => ({
        year: String(r.year),
        burglaryIdx: Number(((r.burglaryRate / 340.5) * 100).toFixed(1)),
        larcenyIdx: Number(((r.larcenyRate / 1549.5) * 100).toFixed(1)),
        mvtIdx: Number(((r.mvtRate / 219.9) * 100).toFixed(1)),
        burglary: r.burglaryRate,
        larceny: r.larcenyRate,
        mvt: r.mvtRate,
      })),
    [],
  );

  const flowRows = useMemo(
    () =>
      FLOW_PROXY.filter((r) => {
        if (seriesFilter === "post2019") return r.year >= 2019;
        if (seriesFilter === "recovery") return r.year >= 2020;
        return true;
      }),
    [seriesFilter],
  );

  const geoRows = useMemo(() => filterGeography(geoFilter), [geoFilter]);

  const cloudRows = useMemo(
    () =>
      DUAL_INDEX.filter((r) => r.propertyIndex != null).map((r) => ({
        year: r.year,
        adpIndex: r.adpIndex,
        propertyIndex: r.propertyIndex as number,
        size: Math.max(80, r.adp / 8000),
        label: String(r.year),
      })),
    [],
  );

  const jailKey = scaleMode === "index" ? "jailIndex" : "jailLevel";
  const propKey = scaleMode === "index" ? "propertyIndex" : "propertyRate";
  const jailLabel =
    metricMode === "adp"
      ? scaleMode === "index"
        ? "Jail ADP index (2019=100)"
        : "Jail ADP"
      : scaleMode === "index"
        ? "Midyear confined index (2019=100)"
        : "Midyear confined";

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      data-viz="jail-adp-versus-property-crime-after-2019-2026"
    >
      <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
            Jail ADP vs property index
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
            Headline — ADP still {HEADLINE.adpShortfallVs2019Pct}% below 2019;
            property ~{HEADLINE.propertyShortfallVs2019Pct}% below
          </h3>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            BJS average daily population recovered from the 2021 trough of{" "}
            {fmtK(HEADLINE.adp2021Trough)} to {fmtK(HEADLINE.adp2023)} in 2023 —
            only {ANALYTICS.adpRecoveredFromTroughPct}% of the way back to the
            2019 baseline — while the national property-crime rate sat much
            closer to its pre-pandemic mark after the SRS→NIBRS estimation handoff.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {PANEL_LABELS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPanel(p.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                panel === p.id
                  ? "bg-teal-800 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Window</span>
          {SERIES_LABELS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSeriesFilter(s.id)}
              className={`rounded-md px-2.5 py-1 text-xs ${
                seriesFilter === s.id
                  ? "bg-amber-700 text-white"
                  : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              {s.label}
            </button>
          ))}
          <span className="ml-2 text-xs font-medium text-slate-500">Jail metric</span>
          <button
            type="button"
            onClick={() => setMetricMode("adp")}
            className={`rounded-md px-2.5 py-1 text-xs ${
              metricMode === "adp"
                ? "bg-teal-700 text-white"
                : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            ADP
          </button>
          <button
            type="button"
            onClick={() => setMetricMode("midyear")}
            className={`rounded-md px-2.5 py-1 text-xs ${
              metricMode === "midyear"
                ? "bg-teal-700 text-white"
                : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            Midyear stock
          </button>
          <span className="ml-2 text-xs font-medium text-slate-500">Scale</span>
          <button
            type="button"
            onClick={() => setScaleMode("index")}
            className={`rounded-md px-2.5 py-1 text-xs ${
              scaleMode === "index"
                ? "bg-slate-800 text-white"
                : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            Index 2019=100
          </button>
          <button
            type="button"
            onClick={() => setScaleMode("level")}
            className={`rounded-md px-2.5 py-1 text-xs ${
              scaleMode === "level"
                ? "bg-slate-800 text-white"
                : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            Levels
          </button>
          {(panel === "dual-index" || panel === "shortfall") && (
            <button
              type="button"
              onClick={() => setShowAdmissions((v) => !v)}
              className={`rounded-md px-2.5 py-1 text-xs ${
                showAdmissions
                  ? "bg-violet-700 text-white"
                  : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              {showAdmissions ? "Admissions on" : "Admissions off"}
            </button>
          )}
          {panel === "geography" &&
            GEO_LABELS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGeoFilter(g.id)}
                className={`rounded-md px-2.5 py-1 text-xs ${
                  geoFilter === g.id
                    ? "bg-emerald-800 text-white"
                    : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
                }`}
              >
                {g.label}
              </button>
            ))}
        </div>
      </div>

      <div className="h-[380px] w-full sm:h-[420px]">
        {panel === "dual-index" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dualRows} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11 }}
                domain={scaleMode === "index" ? [70, 120] : ["auto", "auto"]}
                tickFormatter={(v) =>
                  scaleMode === "index" ? fmtIdx(Number(v)) : fmtK(Number(v))
                }
              />
              {scaleMode === "level" && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => Number(v).toFixed(0)}
                />
              )}
              <Tooltip
                formatter={(value, name) => {
                  const n = Number(value);
                  if (scaleMode === "index" || String(name).includes("index"))
                    return [fmtIdx(n), name];
                  if (String(name).includes("Property")) return [n.toFixed(1), name];
                  return [fmtK(n), name];
                }}
              />
              <Legend />
              {scaleMode === "index" && (
                <ReferenceLine yAxisId="left" y={100} stroke={COLORS.ref} strokeDasharray="4 4" />
              )}
              <Area
                yAxisId="left"
                type="monotone"
                dataKey={jailKey}
                name={jailLabel}
                fill={COLORS.adp}
                fillOpacity={0.15}
                stroke={COLORS.adp}
                strokeWidth={2.5}
                connectNulls={false}
              />
              <Line
                yAxisId={scaleMode === "level" ? "right" : "left"}
                type="monotone"
                dataKey={propKey}
                name={
                  scaleMode === "index"
                    ? "Property rate index (2019=100)"
                    : "Property rate per 100k"
                }
                stroke={COLORS.property}
                strokeWidth={2.5}
                dot={{ r: 3 }}
                connectNulls={false}
              />
              {showAdmissions && scaleMode === "index" && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="admissionsIndex"
                  name="Admissions index (2019=100)"
                  stroke={COLORS.admissions}
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "shortfall" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={shortfallRows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                label={{ value: "% below 2019", angle: -90, position: "insideLeft", fontSize: 11 }}
              />
              <Tooltip
                formatter={(v, name) => [`${Number(v).toFixed(1)}%`, name]}
              />
              <Legend />
              <Bar
                dataKey="adpShortfallPct"
                name="ADP shortfall vs 2019"
                fill={COLORS.adp}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="propertyShortfallPct"
                name="Property shortfall vs 2019"
                fill={COLORS.property}
                radius={[4, 4, 0, 0]}
              />
              {showAdmissions && (
                <Bar
                  dataKey="admissionsShortfallPct"
                  name="Admissions shortfall vs 2019"
                  fill={COLORS.admissions}
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "offense-mix" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={offenseRows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                domain={[60, 140]}
                label={{ value: "Index vs 2019", angle: -90, position: "insideLeft", fontSize: 11 }}
              />
              <Tooltip formatter={(v, name) => [fmtIdx(Number(v)), name]} />
              <Legend />
              <ReferenceLine y={100} stroke={COLORS.ref} strokeDasharray="4 4" />
              <Bar dataKey="burglaryIdx" name="Burglary" fill={COLORS.burglary} radius={[3, 3, 0, 0]} />
              <Bar dataKey="larcenyIdx" name="Larceny-theft" fill={COLORS.larceny} radius={[3, 3, 0, 0]} />
              <Line
                type="monotone"
                dataKey="mvtIdx"
                name="Motor vehicle theft"
                stroke={COLORS.mvt}
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "flow-proxy" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={flowRows} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11 }}
                label={{ value: "Admissions (M) / ADP (k)", angle: -90, position: "insideLeft", fontSize: 10 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11 }}
                label={{ value: "Avg days proxy", angle: 90, position: "insideRight", fontSize: 10 }}
              />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="admissionsM"
                name="Admissions (millions)"
                fill={COLORS.admissions}
                radius={[3, 3, 0, 0]}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="adpK"
                name="ADP (thousands)"
                stroke={COLORS.adp}
                strokeWidth={2.5}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgDaysProxy"
                name="Avg days in custody (proxy)"
                stroke={COLORS.property}
                strokeWidth={2}
                strokeDasharray="4 3"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "geography" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={geoRows}
              margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
            >
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis
                type="number"
                domain={[70, 110]}
                tick={{ fontSize: 11 }}
                label={{ value: "% of mid-2019 level (approx.)", position: "insideBottom", offset: -2, fontSize: 11 }}
              />
              <YAxis type="category" dataKey="segment" width={110} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v, name) => [`${Number(v).toFixed(0)}%`, name]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.note
                    ? `${payload[0].payload.segment}: ${payload[0].payload.note}`
                    : String(_)
                }
              />
              <ReferenceLine x={100} stroke={COLORS.ref} strokeDasharray="4 4" />
              <Bar dataKey="recoveryShareOf2019" name="Share of 2019 level" radius={[0, 4, 4, 0]}>
                {geoRows.map((r) => (
                  <Cell
                    key={r.segment}
                    fill={
                      r.segment.includes("Rural") || r.segment.includes("Small")
                        ? COLORS.rural
                        : r.segment.includes("National")
                          ? COLORS.adp
                          : COLORS.urban
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "gap-cloud" && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="propertyIndex"
                name="Property index"
                domain={[88, 120]}
                tick={{ fontSize: 11 }}
                label={{ value: "Property rate index (2019=100)", position: "insideBottom", offset: -2, fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="adpIndex"
                name="ADP index"
                domain={[80, 105]}
                tick={{ fontSize: 11 }}
                label={{ value: "Jail ADP index", angle: -90, position: "insideLeft", fontSize: 11 }}
              />
              <ZAxis type="number" dataKey="size" range={[60, 280]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) => [fmtIdx(Number(v)), name]}
                labelFormatter={(_, p) => (p?.[0]?.payload?.year ? `Year ${p[0].payload.year}` : "")}
              />
              <ReferenceLine x={100} stroke={COLORS.ref} strokeDasharray="3 3" />
              <ReferenceLine y={100} stroke={COLORS.ref} strokeDasharray="3 3" />
              <Scatter name="Year" data={cloudRows} fill={COLORS.gap}>
                {cloudRows.map((r) => (
                  <Cell
                    key={r.year}
                    fill={r.year >= 2020 ? COLORS.gap : COLORS.adp}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
