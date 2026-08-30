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
  COHORT_YEARS,
  COMPLETER_EXTENSION,
  GAP_ANCHORS,
  HEADLINE,
  IMMEDIATE_PATH,
  LEVEL_SPLIT,
  SOURCE_NOTE,
} from "@/data/undergraduate-enrollment-versus-high-school-graduate-cohorts-2026-data";

type Panel =
  | "dual-track"
  | "ratio-path"
  | "level-split"
  | "immediate-mix"
  | "gap-bars"
  | "index-scatter";

type IndexBase = "2010" | "2019";
type LevelView = "both" | "twoYear" | "fourYear";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "dual-track": {
    title: "Undergrad headcount versus HS completer cohort",
    subtitle: `Fall undergrad fell ${HEADLINE.undergradDropFromPeakPct}% from the 2010 peak while completer counts stayed within a few percent of 3.0–3.2 million`,
  },
  "ratio-path": {
    title: "Undergrads per high-school completer",
    subtitle: `Ratio slid from ${HEADLINE.ratio2010} in 2010 to ${HEADLINE.ratio2022} in 2022 — a ${HEADLINE.ratioDropPct}% compression`,
  },
  "level-split": {
    title: "Where the headcount left: 2-year vs 4-year",
    subtitle: `2-year undergrad −${HEADLINE.twoYearDropPct}% from 2010; 4-year +${HEADLINE.fourYearChangePct}%`,
  },
  "immediate-mix": {
    title: "Immediate college enrollment of recent completers",
    subtitle: `Total rate ${HEADLINE.immediateRate2010Pct}% → ${HEADLINE.immediateRate2024Pct}% (2024); 2-year path drove most of the softening`,
  },
  "gap-bars": {
    title: "Peak, counterfactual, and actual undergrad stock",
    subtitle: `Holding the 2010 ratio on 2022 completers implies ~${HEADLINE.counterfactual2022M}M undergrads — ${HEADLINE.enrollmentGapVsCounterfactualM}M above the observed ${HEADLINE.troughUndergradM}M`,
  },
  "index-scatter": {
    title: "Indexed co-movement (scatter)",
    subtitle: "Each year as a point in completer-index × undergrad-index space",
  },
};

const fmtM = (n: number) => `${n.toFixed(2)}M`;
const fmtPct = (n: number) => `${n.toFixed(1)}%`;
const asNum = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);

export function UndergraduateEnrollmentVersusHighSchoolGraduateCohorts2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("dual-track");
  const [indexBase, setIndexBase] = useState<IndexBase>("2010");
  const [levelView, setLevelView] = useState<LevelView>("both");

  const dualData = useMemo(() => {
    const baseU =
      indexBase === "2010"
        ? HEADLINE.peakUndergradM
        : COHORT_YEARS.find((y) => y.year === 2019)!.undergradM;
    const baseC =
      indexBase === "2010"
        ? HEADLINE.hsCompleters2010K
        : COHORT_YEARS.find((y) => y.year === 2019)!.hsCompletersK;
    return COHORT_YEARS.map((y) => ({
      year: y.year,
      undergradM: y.undergradM,
      completersM: y.hsCompletersK / 1000,
      undergradIndex: (y.undergradM / baseU) * 100,
      completerIndex: (y.hsCompletersK / baseC) * 100,
      ratio: y.ratio,
    }));
  }, [indexBase]);

  const levelSeries = useMemo(() => {
    return COHORT_YEARS.map((y) => ({
      year: y.year,
      twoYear: y.twoYearM,
      fourYear: y.fourYearM,
      total: y.undergradM,
    }));
  }, []);

  const scatterData = useMemo(
    () =>
      dualData.map((d) => ({
        year: d.year,
        completerIndex: d.completerIndex,
        undergradIndex: d.undergradIndex,
        ratio: d.ratio,
        undergradM: d.undergradM,
      })),
    [dualData],
  );

  const immediateFiltered = useMemo(() => {
    if (levelView === "twoYear") {
      return IMMEDIATE_PATH.map((r) => ({
        year: r.year,
        primary: r.twoYear,
        label: "2-year immediate %",
      }));
    }
    if (levelView === "fourYear") {
      return IMMEDIATE_PATH.map((r) => ({
        year: r.year,
        primary: r.fourYear,
        label: "4-year immediate %",
      }));
    }
    return IMMEDIATE_PATH;
  }, [levelView]);

  const meta = PANEL_META[panel];

  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white"
      data-viz="undergraduate-enrollment-versus-high-school-graduate-cohorts-2026"
    >
      <div className="border-b border-slate-200 bg-slate-900 px-4 py-3 text-slate-100 sm:px-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-300">
          {ANALYTICS.categoryLabel} · {ANALYTICS.smokeMarker}
        </p>
        <h3 className="mt-1 text-base font-semibold leading-snug sm:text-lg">
          Undergrad headcount −{HEADLINE.undergradDropFromPeakPct}% from 2010
          while HS completer cohorts barely shrank
        </h3>
        <p className="mt-1 text-sm text-slate-300">
          {HEADLINE.peakUndergradM}M → {HEADLINE.troughUndergradM}M undergrads ·
          ratio {HEADLINE.ratio2010} → {HEADLINE.ratio2022} · immediate rate{" "}
          {HEADLINE.immediateRate2010Pct}% → {HEADLINE.immediateRate2024Pct}%
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 px-4 py-3 sm:px-5">
        {(
          [
            ["dual-track", "Dual track"],
            ["ratio-path", "Ratio"],
            ["level-split", "2yr vs 4yr"],
            ["immediate-mix", "Immediate rate"],
            ["gap-bars", "Gap"],
            ["index-scatter", "Scatter"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPanel(id)}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
              panel === id
                ? "bg-amber-800 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-2.5 text-xs sm:px-5">
        <span className="font-medium text-slate-500">Index base</span>
        {(
          [
            ["2010", "2010 = 100"],
            ["2019", "2019 = 100"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setIndexBase(id)}
            className={`rounded-md px-2 py-1 font-medium ${
              indexBase === id
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-2 font-medium text-slate-500">Level filter</span>
        {(
          [
            ["both", "Both levels"],
            ["twoYear", "2-year"],
            ["fourYear", "4-year"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setLevelView(id)}
            className={`rounded-md px-2 py-1 font-medium ${
              levelView === id
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 py-3 sm:px-5">
        <h4 className="text-sm font-semibold text-slate-900">{meta.title}</h4>
        <p className="mt-0.5 text-xs text-slate-500">{meta.subtitle}</p>
      </div>

      <div className="h-[340px] px-2 pb-2 sm:px-4">
        {panel === "dual-track" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dualData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="idx"
                tick={{ fontSize: 11 }}
                domain={["auto", "auto"]}
                label={{ value: "Index", angle: -90, position: "insideLeft", fontSize: 10 }}
              />
              <YAxis
                yAxisId="m"
                orientation="right"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${asNum(v).toFixed(0)}M`}
              />
              <Tooltip
                formatter={(value, name) => {
                  const n = asNum(value);
                  if (String(name).includes("Index")) return [n.toFixed(1), String(name)];
                  return [fmtM(n), String(name)];
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                yAxisId="idx"
                type="monotone"
                dataKey="undergradIndex"
                name="Undergrad index"
                fill="#0f766e33"
                stroke="#0f766e"
                strokeWidth={2}
              />
              <Line
                yAxisId="idx"
                type="monotone"
                dataKey="completerIndex"
                name="Completer index"
                stroke="#c2410c"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Bar
                yAxisId="m"
                dataKey="undergradM"
                name="Undergrad (M)"
                fill="#94a3b888"
                barSize={10}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "ratio-path" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dualData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                domain={[4.8, 6.2]}
                tickFormatter={(v) => asNum(v).toFixed(1)}
              />
              <Tooltip formatter={(v) => [asNum(v).toFixed(2), "Undergrads / completer"]} />
              <Line
                type="monotone"
                dataKey="ratio"
                stroke="#7c2d12"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: "#c2410c" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {panel === "level-split" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={levelSeries} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${asNum(v).toFixed(0)}M`} />
              <Tooltip formatter={(v, name) => [fmtM(asNum(v)), String(name)]} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {(levelView === "both" || levelView === "twoYear") && (
                <Area
                  type="monotone"
                  dataKey="twoYear"
                  name="2-year"
                  stackId={levelView === "both" ? "lvl" : undefined}
                  fill="#c2410c55"
                  stroke="#c2410c"
                  strokeWidth={2}
                />
              )}
              {(levelView === "both" || levelView === "fourYear") && (
                <Area
                  type="monotone"
                  dataKey="fourYear"
                  name="4-year"
                  stackId={levelView === "both" ? "lvl" : undefined}
                  fill="#0f766e55"
                  stroke="#0f766e"
                  strokeWidth={2}
                />
              )}
              {levelView === "both" && (
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke="#1e293b"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "immediate-mix" && (
          <ResponsiveContainer width="100%" height="100%">
            {levelView === "both" ? (
              <ComposedChart
                data={IMMEDIATE_PATH}
                margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  domain={[10, 75]}
                  tickFormatter={(v) => `${asNum(v)}%`}
                />
                <Tooltip formatter={(v, name) => [fmtPct(asNum(v)), String(name)]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="twoYear" name="2-year %" fill="#c2410c" barSize={14} />
                <Bar dataKey="fourYear" name="4-year %" fill="#0f766e" barSize={14} />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total %"
                  stroke="#1e293b"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            ) : (
              <LineChart
                data={immediateFiltered as { year: number; primary: number }[]}
                margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  domain={[10, 55]}
                  tickFormatter={(v) => `${asNum(v)}%`}
                />
                <Tooltip formatter={(v) => [fmtPct(asNum(v)), "Immediate %"]} />
                <Line
                  type="monotone"
                  dataKey="primary"
                  stroke={levelView === "twoYear" ? "#c2410c" : "#0f766e"}
                  strokeWidth={2.5}
                  dot={{ r: 3.5 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}

        {panel === "gap-bars" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[...GAP_ANCHORS]}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 8, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                domain={[14, 19]}
                tickFormatter={(v) => `${asNum(v).toFixed(0)}M`}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={140}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(v) => [fmtM(asNum(v)), "Undergrad"]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.note ?? ""
                }
              />
              <Bar dataKey="undergradM" radius={[0, 4, 4, 0]}>
                {GAP_ANCHORS.map((g) => (
                  <Cell
                    key={g.id}
                    fill={
                      g.id === "peak"
                        ? "#64748b"
                        : g.id === "counterfactual"
                          ? "#b45309"
                          : "#0f766e"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "index-scatter" && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="completerIndex"
                name="Completer index"
                tick={{ fontSize: 11 }}
                domain={["auto", "auto"]}
                label={{ value: "Completer index", position: "insideBottom", offset: -2, fontSize: 10 }}
              />
              <YAxis
                type="number"
                dataKey="undergradIndex"
                name="Undergrad index"
                tick={{ fontSize: 11 }}
                domain={["auto", "auto"]}
                label={{ value: "Undergrad index", angle: -90, position: "insideLeft", fontSize: 10 }}
              />
              <ZAxis type="number" dataKey="undergradM" range={[60, 220]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) => {
                  if (name === "undergradIndex" || name === "completerIndex")
                    return [asNum(v).toFixed(1), String(name)];
                  return [fmtM(asNum(v)), "Undergrad"];
                }}
                labelFormatter={(_, p) => `Year ${p?.[0]?.payload?.year ?? ""}`}
              />
              <Scatter name="Year" data={scatterData} fill="#0f766e">
                {scatterData.map((d) => (
                  <Cell
                    key={d.year}
                    fill={d.year >= 2020 ? "#c2410c" : "#0f766e"}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid gap-2 border-t border-slate-100 px-4 py-3 sm:grid-cols-3 sm:px-5">
        {LEVEL_SPLIT.map((lvl) => (
          <div key={lvl.id} className="rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              {lvl.short}
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {fmtM(lvl.peakM)} → {fmtM(lvl.latestM)}
            </p>
            <p className="text-xs" style={{ color: lvl.color }}>
              {lvl.changePct > 0 ? "+" : "−"}
              {Math.abs(lvl.changePct).toFixed(1)}% vs 2010
            </p>
          </div>
        ))}
        <div className="rounded-lg bg-slate-50 px-3 py-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Completers (CPS)
          </p>
          <p className="text-sm font-semibold text-slate-900">
            {(HEADLINE.hsCompleters2010K / 1000).toFixed(2)}M →{" "}
            {(HEADLINE.hsCompleters2024K / 1000).toFixed(2)}M
          </p>
          <p className="text-xs text-slate-600">
            2010 → 2024 · extension years after IPEDS actual
          </p>
        </div>
      </div>

      <p className="border-t border-slate-100 px-4 py-2.5 text-[10px] leading-relaxed text-slate-500 sm:px-5">
        {SOURCE_NOTE} Completer extension through{" "}
        {COMPLETER_EXTENSION.at(-1)?.year}.
      </p>
    </div>
  );
}
