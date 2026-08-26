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
  COHORT_GAP,
  FY_ALJ_VS_DDS,
  HEADLINE,
  PROGRAM_MIX_2018,
  REGION_OPTIONS,
  SOURCE_NOTE,
  STAGE_LADDER_FY2024,
  filterRegions,
  type RegionFilter,
} from "@/data/hearing-level-allowance-rates-versus-initial-denials-2026-data";

type Panel =
  | "dual-rates"
  | "gap-bars"
  | "stage-ladder"
  | "region-dds"
  | "program-mix"
  | "gap-cloud";

type SeriesMode = "both" | "rates" | "gap";

const COLORS = {
  initial: "#1e3a5f",
  hearing: "#b45309",
  recon: "#64748b",
  gap: "#9f1239",
  gapSoft: "#fda4af",
  ss: "#1d4ed8",
  concurrent: "#0e7490",
  all: "#a16207",
  grid: "#e2e8f0",
  ref: "#94a3b8",
};

const PANEL_LABELS: { id: Panel; label: string }[] = [
  { id: "dual-rates", label: "Rates over time" },
  { id: "gap-bars", label: "Gap path" },
  { id: "stage-ladder", label: "Stage ladder" },
  { id: "region-dds", label: "Region DDS" },
  { id: "program-mix", label: "Program mix" },
  { id: "gap-cloud", label: "Gap cloud" },
];

const SERIES_LABELS: { id: SeriesMode; label: string }[] = [
  { id: "both", label: "Rates + gap" },
  { id: "rates", label: "Rates only" },
  { id: "gap", label: "Gap only" },
];

function fmtPct(n: number) {
  return `${n.toFixed(1)}%`;
}

function fmtPp(n: number) {
  return `${n.toFixed(1)} pp`;
}

export function HearingLevelAllowanceRatesVersusInitialDenials2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("dual-rates");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [seriesMode, setSeriesMode] = useState<SeriesMode>("both");
  const [matureOnly, setMatureOnly] = useState(true);
  const [useFySeries, setUseFySeries] = useState(false);

  const cohortRows = useMemo(() => {
    let rows = COHORT_GAP;
    if (matureOnly) rows = rows.filter((r) => r.maturity === "mature");
    return rows.map((r) => ({
      label: String(r.year),
      year: r.year,
      initial: r.initialPct,
      recon: r.reconPct,
      hearing: r.hearingPct,
      gap: r.gapPp,
    }));
  }, [matureOnly]);

  const fyRows = useMemo(
    () =>
      FY_ALJ_VS_DDS.filter((r) => (matureOnly ? r.confidence === "disclosed" : true)).map(
        (r) => ({
          label: `FY${r.fy}`,
          year: r.fy,
          initial: r.ddsInitialPct,
          hearing: r.aljPct,
          gap: r.gapPp,
        }),
      ),
    [matureOnly],
  );

  const pathRows = useFySeries ? fyRows : cohortRows;
  const regionRows = useMemo(() => filterRegions(region), [region]);

  const programRows = PROGRAM_MIX_2018.map((r) => ({
    program: r.program,
    initial: r.initialPct,
    hearing: r.hearingPct,
    gap: r.gapPp,
  }));

  const scatterRows = cohortRows.map((r) => ({
    ...r,
    z: Math.max(40, r.gap * 8),
  }));

  return (
    <figure
      className="not-prose my-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      data-viz="hearing-level-allowance-rates-versus-initial-denials-2026"
    >
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Allowance rate gap — ALJ vs DDS
        </p>
        <p className="mt-1 text-sm font-medium text-slate-900 sm:text-base">
          Headline — cohort gap {HEADLINE.gapPp2008} pp → {HEADLINE.gapPp2017} pp trough; FY2024
          operational gap {HEADLINE.gapPpFy2024} pp
        </p>
        <p className="mt-1 text-xs text-slate-600">
          Hearing-or-above still clears initial DDS by double-digit points; the application-year
          gap compressed ~{ANALYTICS.cohortGapCutPp} pp from the 2008 peak before a modest rebound.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">
        {PANEL_LABELS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPanel(p.id)}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
              panel === p.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-2.5 sm:px-5">
        {SERIES_LABELS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSeriesMode(s.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              seriesMode === s.id
                ? "bg-amber-800 text-white"
                : "bg-amber-50 text-amber-900 hover:bg-amber-100"
            }`}
          >
            {s.label}
          </button>
        ))}
        {REGION_OPTIONS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRegion(r.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              region === r.id
                ? "bg-teal-800 text-white"
                : "bg-teal-50 text-teal-900 hover:bg-teal-100"
            }`}
          >
            {r.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setMatureOnly((v) => !v)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
            matureOnly
              ? "bg-rose-800 text-white"
              : "bg-rose-50 text-rose-900 hover:bg-rose-100"
          }`}
        >
          {matureOnly ? "Mature cohorts only" : "Include partial years"}
        </button>
        <button
          type="button"
          onClick={() => setUseFySeries((v) => !v)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
            useFySeries
              ? "bg-indigo-800 text-white"
              : "bg-indigo-50 text-indigo-900 hover:bg-indigo-100"
          }`}
        >
          {useFySeries ? "FY ALJ series on" : "Use FY ALJ series"}
        </button>
      </div>

      <div className="h-[360px] w-full px-2 py-4 sm:px-4">
        {panel === "dual-rates" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={pathRows} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="rate"
                domain={[0, 80]}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
                hide={seriesMode === "gap"}
              />
              <YAxis
                yAxisId="gap"
                orientation="right"
                domain={[0, 35]}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}pp`}
                hide={seriesMode === "rates"}
              />
              <Tooltip
                formatter={(value, name) => {
                  const n = typeof value === "number" ? value : Number(value);
                  if (name === "gap") return [fmtPp(n), "Gap"];
                  return [fmtPct(n), String(name)];
                }}
              />
              <Legend />
              {(seriesMode === "both" || seriesMode === "gap") && (
                <Area
                  yAxisId="gap"
                  type="monotone"
                  dataKey="gap"
                  name="Gap (pp)"
                  fill={COLORS.gapSoft}
                  stroke={COLORS.gap}
                  fillOpacity={0.45}
                />
              )}
              {(seriesMode === "both" || seriesMode === "rates") && (
                <>
                  <Line
                    yAxisId="rate"
                    type="monotone"
                    dataKey="initial"
                    name="Initial DDS"
                    stroke={COLORS.initial}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    yAxisId="rate"
                    type="monotone"
                    dataKey="hearing"
                    name={useFySeries ? "ALJ (FY)" : "Hearing+"}
                    stroke={COLORS.hearing}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </>
              )}
              <ReferenceLine
                yAxisId="gap"
                y={ANALYTICS.troughGapPp}
                stroke={COLORS.ref}
                strokeDasharray="4 4"
                label={{ value: "Trough", fontSize: 10, fill: COLORS.ref }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "gap-bars" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pathRows} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}pp`} />
              <Tooltip formatter={(v) => [fmtPp(Number(v)), "Gap"]} />
              <Bar dataKey="gap" name="Hearing − initial (pp)" radius={[4, 4, 0, 0]}>
                {pathRows.map((r) => (
                  <Cell
                    key={r.year}
                    fill={r.gap <= ANALYTICS.troughGapPp + 1 ? COLORS.hearing : COLORS.gap}
                  />
                ))}
              </Bar>
              <ReferenceLine y={ANALYTICS.peakGapPp} stroke={COLORS.ref} strokeDasharray="3 3" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "stage-ladder" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={STAGE_LADDER_FY2024}
              margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
            >
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 70]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="shortLabel" width={72} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [fmtPct(Number(v)), "Allowance rate"]} />
              <Bar dataKey="ratePct" name="FY2024 rate" radius={[0, 4, 4, 0]}>
                {STAGE_LADDER_FY2024.map((r) => (
                  <Cell
                    key={r.stage}
                    fill={
                      r.shortLabel === "Initial"
                        ? COLORS.initial
                        : r.shortLabel === "Recon"
                          ? COLORS.recon
                          : COLORS.hearing
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "region-dds" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              layout="vertical"
              data={regionRows}
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 50]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="region" width={100} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v, name) => [
                  fmtPct(Number(v)),
                  name === "initialPct" ? "Initial" : "Reconsideration",
                ]}
              />
              <Legend />
              <Bar dataKey="initialPct" name="Initial" fill={COLORS.initial} barSize={10} />
              <Bar dataKey="reconPct" name="Reconsideration" fill={COLORS.recon} barSize={10} />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "program-mix" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={programRows} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="program" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                formatter={(v, name) => {
                  if (name === "gap") return [fmtPp(Number(v)), "Gap"];
                  return [fmtPct(Number(v)), String(name)];
                }}
              />
              <Legend />
              {(seriesMode === "both" || seriesMode === "rates") && (
                <>
                  <Bar dataKey="initial" name="Initial" fill={COLORS.ss} />
                  <Bar dataKey="hearing" name="Hearing+" fill={COLORS.hearing} />
                </>
              )}
              {(seriesMode === "both" || seriesMode === "gap") && (
                <Bar dataKey="gap" name="Gap (pp)" fill={COLORS.gap} />
              )}
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "gap-cloud" && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="initial"
                name="Initial"
                unit="%"
                domain={[32, 42]}
                tick={{ fontSize: 11 }}
                label={{ value: "Initial DDS %", position: "insideBottom", offset: -4, fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="hearing"
                name="Hearing"
                unit="%"
                domain={[45, 75]}
                tick={{ fontSize: 11 }}
                label={{ value: "Hearing+ %", angle: -90, position: "insideLeft", fontSize: 11 }}
              />
              <ZAxis type="number" dataKey="z" range={[60, 400]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) => {
                  if (name === "z") return [null, null];
                  return [fmtPct(Number(v)), String(name)];
                }}
                labelFormatter={(_, payload) => {
                  const p = payload?.[0]?.payload;
                  return p ? `${p.year} · gap ${fmtPp(p.gap)}` : "";
                }}
              />
              <Scatter name="Application cohorts" data={scatterRows} fill={COLORS.gap}>
                {scatterRows.map((r) => (
                  <Cell
                    key={r.year}
                    fill={r.year <= 2012 ? COLORS.gap : COLORS.hearing}
                    fillOpacity={0.85}
                  />
                ))}
              </Scatter>
              <ReferenceLine
                segment={[
                  { x: 34, y: 34 + ANALYTICS.troughGapPp },
                  { x: 40, y: 40 + ANALYTICS.troughGapPp },
                ]}
                stroke={COLORS.ref}
                strokeDasharray="4 4"
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>

      <figcaption className="border-t border-slate-100 px-4 py-3 text-[11px] leading-relaxed text-slate-500 sm:px-5">
        {SOURCE_NOTE}
      </figcaption>
    </figure>
  );
}
