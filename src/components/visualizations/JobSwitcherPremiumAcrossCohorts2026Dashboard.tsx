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
  AGE_COHORTS,
  EDU_COHORTS,
  HEADLINE,
  INDUSTRIES,
  INDUSTRY_PREMIUM_BY_YEAR,
  INDUSTRY_YEARS,
  NATIONAL_PATH,
  SOURCE_NOTE,
  type IndustryId,
} from "@/data/job-switcher-premium-across-cohorts-2026-data";

type Panel =
  | "premium-path"
  | "industry-ladder"
  | "quits-scatter"
  | "industry-heat"
  | "cohort-cut"
  | "peak-vs-now";

type CohortView = "age" | "education";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "premium-path": {
    title: "Switcher−stayer premium path",
    subtitle: `Peak +${HEADLINE.peakPremiumPp} pp in ${HEADLINE.peakMonth}; zeroed in ${HEADLINE.zeroPremiumMonth}; latest +${HEADLINE.latestPremiumPp} pp`,
  },
  "industry-ladder": {
    title: "Industry ladder — latest premium",
    subtitle: `${HEADLINE.industriesStoppedPaying} industries ≤0 pp (educ./finance/ProfBiz/info); ${HEADLINE.industriesStillPaying} still clear ≥1.0 pp`,
  },
  "quits-scatter": {
    title: "JOLTS quits × switcher premium",
    subtitle: "High-quit sectors still pay switchers; low-quit white-collar cuts flipped negative",
  },
  "industry-heat": {
    title: "Industry premium heat — year end",
    subtitle: "Warm = switching still paid; cool/blue = premium compressed or inverted",
  },
  "cohort-cut": {
    title: "Cohort cut — age or education",
    subtitle: "Younger and less-credentialed cohorts still clear the widest switcher premium",
  },
  "peak-vs-now": {
    title: "Peak vs now — compression by industry",
    subtitle: "Every sector compressed; Information and ProfBiz flipped from +2s to negative",
  },
};

const fmtPp = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)} pp`;
const tipPp = (v: unknown) =>
  fmtPp(typeof v === "number" ? v : Number(v));

function heatColor(v: number): string {
  if (v >= 2.5) return "#0f766e";
  if (v >= 1.0) return "#14b8a6";
  if (v >= 0.3) return "#99f6e4";
  if (v >= -0.2) return "#e2e8f0";
  if (v >= -0.6) return "#fdba74";
  return "#9f1239";
}

const TEAL = "#0d9488";
const AMBER = "#d97706";
const NAVY = "#1e3a5f";
const SLATE = "#64748b";

export function JobSwitcherPremiumAcrossCohorts2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("premium-path");
  const [focusIndustry, setFocusIndustry] = useState<IndustryId>("information");
  const [cohortView, setCohortView] = useState<CohortView>("age");

  const meta = PANEL_META[panel];

  const ladderData = useMemo(
    () =>
      [...INDUSTRIES]
        .sort((a, b) => b.premiumPp - a.premiumPp)
        .map((i) => ({
          ...i,
          fill: i.stoppedPaying ? "#9f1239" : i.premiumPp >= 1 ? TEAL : AMBER,
        })),
    [],
  );

  const scatterData = useMemo(
    () =>
      INDUSTRIES.map((i) => ({
        ...i,
        x: i.quitRatePct,
        y: i.premiumPp,
        z: Math.abs(i.adpWageYoYPct) * 40,
      })),
    [],
  );

  const peakNowData = useMemo(
    () =>
      [...INDUSTRIES]
        .sort((a, b) => a.premiumPp - b.premiumPp)
        .map((i) => ({
          short: i.short,
          peak: i.peakPremiumPp,
          now: i.premiumPp,
          compression: +(i.peakPremiumPp - i.premiumPp).toFixed(1),
          stopped: i.stoppedPaying,
        })),
    [],
  );

  const cohortData = useMemo(() => {
    if (cohortView === "age") {
      return AGE_COHORTS.map((c) => ({
        label: c.label,
        premium: c.premiumPp,
        peak: c.peakPremiumPp,
        switcher: c.switcherPct,
        stayer: c.stayerPct,
      }));
    }
    return EDU_COHORTS.map((c) => ({
      label: c.label,
      premium: c.premiumPp,
      peak: c.peakPremiumPp,
      switcher: c.switcherPct,
      stayer: c.stayerPct,
    }));
  }, [cohortView]);

  const focusRow = INDUSTRIES.find((i) => i.id === focusIndustry)!;

  const panels: { id: Panel; label: string }[] = [
    { id: "premium-path", label: "Switcher−stayer premium" },
    { id: "industry-ladder", label: "Industry ladder" },
    { id: "quits-scatter", label: "Quits × premium" },
    { id: "industry-heat", label: "Industry heat" },
    { id: "cohort-cut", label: "Cohort cut" },
    { id: "peak-vs-now", label: "Peak vs now" },
  ];

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      data-viz="job-switcher-premium-across-cohorts-2026"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{meta.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{meta.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="rounded-md bg-teal-50 px-2 py-1 font-medium text-teal-800">
            Latest premium {fmtPp(HEADLINE.latestPremiumPp)}
          </span>
          <span className="rounded-md bg-amber-50 px-2 py-1 font-medium text-amber-900">
            Peak {fmtPp(HEADLINE.peakPremiumPp)}
          </span>
          <span className="rounded-md bg-rose-50 px-2 py-1 font-medium text-rose-900">
            {HEADLINE.industriesStoppedPaying} industries ≤0
          </span>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {panels.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPanel(p.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              panel === p.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <span className="font-medium">Focus industry</span>
          <select
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
            value={focusIndustry}
            onChange={(e) => setFocusIndustry(e.target.value as IndustryId)}
          >
            {INDUSTRIES.map((i) => (
              <option key={i.id} value={i.id}>
                {i.label}
              </option>
            ))}
          </select>
        </label>
        {panel === "cohort-cut" && (
          <div className="flex gap-2">
            {(["age", "education"] as CohortView[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setCohortView(v)}
                className={`rounded-md px-3 py-1 text-sm font-medium ${
                  cohortView === v
                    ? "bg-teal-700 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {v === "age" ? "Age" : "Education"}
              </button>
            ))}
          </div>
        )}
        <p className="text-xs text-slate-500">
          Focus: {focusRow.short} {fmtPp(focusRow.premiumPp)} now · peak{" "}
          {fmtPp(focusRow.peakPremiumPp)}
          {focusRow.stoppedPaying ? " · stopped paying" : ""}
        </p>
      </div>

      <div className="h-[380px] w-full">
        {panel === "premium-path" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={NATIONAL_PATH} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 8]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}`}
                domain={[1.5, 3.5]}
              />
              <Tooltip
                formatter={(value, name) => {
                  const v = typeof value === "number" ? value : Number(value);
                  if (name === "premiumPp") return [fmtPp(v), "Premium"];
                  if (name === "joltsQuitPct") return [`${v.toFixed(1)}%`, "JOLTS quits"];
                  return [`${v.toFixed(1)}%`, String(name)];
                }}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="premiumPp"
                name="Premium (pp)"
                fill="#99f6e4"
                stroke={TEAL}
                fillOpacity={0.45}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="switcherPct"
                name="Switcher %"
                stroke={NAVY}
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="stayerPct"
                name="Stayer %"
                stroke={SLATE}
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="joltsQuitPct"
                name="JOLTS quits %"
                stroke={AMBER}
                strokeWidth={2}
                dot={false}
              />
              <ReferenceLine yAxisId="left" y={0} stroke="#94a3b8" />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "industry-ladder" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ladderData}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={(v) => fmtPp(v)} domain={[-1.2, 2.2]} />
              <YAxis
                type="category"
                dataKey="short"
                width={72}
                tick={{ fontSize: 11 }}
              />
              <Tooltip formatter={(v) => tipPp(v)} />
              <ReferenceLine x={0} stroke="#94a3b8" />
              <Bar dataKey="premiumPp" name="Premium" radius={[0, 4, 4, 0]}>
                {ladderData.map((row) => (
                  <Cell
                    key={row.id}
                    fill={row.id === focusIndustry ? NAVY : row.fill}
                    stroke={row.id === focusIndustry ? "#0f172a" : undefined}
                    strokeWidth={row.id === focusIndustry ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "quits-scatter" && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="x"
                name="Quit rate"
                unit="%"
                domain={[1, 4]}
                tick={{ fontSize: 11 }}
                label={{ value: "JOLTS quit rate %", position: "insideBottom", offset: -2, fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Premium"
                domain={[-1.2, 2.2]}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => fmtPp(v)}
              />
              <ZAxis type="number" dataKey="z" range={[60, 280]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name) => {
                  if (name === "y" || name === "Premium") return [tipPp(value), "Premium"];
                  if (name === "x" || name === "Quit rate")
                    return [`${Number(value).toFixed(1)}%`, "Quit rate"];
                  return [String(value), String(name)];
                }}
                labelFormatter={(_, payload) => {
                  const p = payload?.[0]?.payload as { label?: string } | undefined;
                  return p?.label ?? "";
                }}
              />
              <ReferenceLine y={0} stroke="#94a3b8" />
              <Scatter name="Industry" data={scatterData}>
                {scatterData.map((row) => (
                  <Cell
                    key={row.id}
                    fill={
                      row.id === focusIndustry
                        ? NAVY
                        : row.stoppedPaying
                          ? "#9f1239"
                          : TEAL
                    }
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}

        {panel === "industry-heat" && (
          <div className="flex h-full flex-col overflow-auto">
            <div className="grid grid-cols-[80px_repeat(6,minmax(0,1fr))] gap-1 text-center text-xs font-medium text-slate-600">
              <div />
              {INDUSTRY_YEARS.map((y) => (
                <div key={y}>{y}</div>
              ))}
            </div>
            {INDUSTRIES.map((ind) => (
              <div
                key={ind.id}
                className={`mt-1 grid grid-cols-[80px_repeat(6,minmax(0,1fr))] gap-1 ${
                  ind.id === focusIndustry ? "ring-2 ring-slate-800 rounded" : ""
                }`}
              >
                <div className="flex items-center justify-end pr-2 text-xs font-medium text-slate-700">
                  {ind.short}
                </div>
                {INDUSTRY_YEARS.map((y) => {
                  const v = INDUSTRY_PREMIUM_BY_YEAR[ind.id][y];
                  return (
                    <div
                      key={y}
                      className="flex items-center justify-center rounded py-2 text-xs font-semibold text-slate-900"
                      style={{ backgroundColor: heatColor(v) }}
                      title={`${ind.label} ${y}: ${fmtPp(v)}`}
                    >
                      {fmtPp(v)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {panel === "cohort-cut" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cohortData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} />
              <YAxis tickFormatter={(v) => fmtPp(v)} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => tipPp(v)} />
              <Legend />
              <ReferenceLine y={0} stroke="#94a3b8" />
              <Bar dataKey="peak" name="Peak premium" fill="#fdba74" radius={[4, 4, 0, 0]} />
              <Bar dataKey="premium" name="Latest premium" fill={TEAL} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "peak-vs-now" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={peakNowData}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={(v) => fmtPp(v)} domain={[-1.5, 4]} />
              <YAxis type="category" dataKey="short" width={72} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => tipPp(v)} />
              <Legend />
              <ReferenceLine x={0} stroke="#94a3b8" />
              <Bar dataKey="peak" name="Peak (~2022)" fill="#fdba74" barSize={10} />
              <Bar dataKey="now" name="Latest" fill={TEAL} barSize={10} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
