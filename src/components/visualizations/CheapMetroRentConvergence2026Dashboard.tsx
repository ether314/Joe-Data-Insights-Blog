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
  COHORT_SERIES,
  CONVERGENCE_SCATTER,
  GAP_CLOSED_ROWS,
  HEADLINE,
  INTERIOR_RISE_LADDER,
  METROS,
  SOURCE_NOTE,
  metroBurdenSeries,
  type Cohort,
  type MetroId,
} from "@/data/cheap-metro-rent-convergence-2026-data";

type Panel =
  | "gap-path"
  | "metro-path"
  | "zori-scatter"
  | "rise-ladder"
  | "gap-closed";

type CohortFilter = "all" | Cohort;
type LadderMetric = "delta" | "zori";

const COLORS = {
  interior: "#0e7490",
  coastal: "#b45309",
  gap: "#7c3aed",
  grid: "#e2e8f0",
  rise: "#c2410c",
  closed: "#15803d",
};

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "gap-path": {
    title: "Coastal vs interior rent-burden gap",
    subtitle:
      "Unweighted median ≥30% ACS burden shares — gap narrowed from 9.2 pp (2019) to 3.1 pp (2024)",
  },
  "metro-path": {
    title: "Metro burden path vs cohort medians",
    subtitle:
      "Pick a metro; dashed lines are coastal and interior cohort medians",
  },
  "zori-scatter": {
    title: "ZORI rent growth vs burden rise",
    subtitle:
      "Jan 2019–Dec 2024 cumulative ZORI % vs ACS ≥30% burden change (pp)",
  },
  "rise-ladder": {
    title: "Interior metros: who climbed fastest",
    subtitle:
      "Burden-share rise (pp) or cumulative ZORI % — once-cheap metros led both",
  },
  "gap-closed": {
    title: "How much of the coastal gap closed",
    subtitle:
      "Each interior metro’s distance to the coastal median — 2019 vs 2024",
  },
};

const fmtPct = (n: number) => `${n.toFixed(1)}%`;
const fmtPp = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)} pp`;

export function CheapMetroRentConvergence2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("gap-path");
  const [metroId, setMetroId] = useState<MetroId>(ANALYTICS.defaultMetroId);
  const [cohortFilter, setCohortFilter] = useState<CohortFilter>("all");
  const [ladderMetric, setLadderMetric] = useState<LadderMetric>("delta");

  const pathData = useMemo(() => metroBurdenSeries(metroId), [metroId]);
  const metroLabel = METROS.find((m) => m.id === metroId)?.label ?? metroId;

  const scatterData = useMemo(() => {
    return CONVERGENCE_SCATTER.filter(
      (r) => cohortFilter === "all" || r.cohort === cohortFilter,
    );
  }, [cohortFilter]);

  const ladderData = useMemo(() => {
    return INTERIOR_RISE_LADDER.map((r) => ({
      label: r.label,
      value: ladderMetric === "delta" ? r.deltaPp : r.zoriCumPct,
    }));
  }, [ladderMetric]);

  const gapClosedData = useMemo(
    () =>
      [...GAP_CLOSED_ROWS]
        .sort((a, b) => b.closedPp - a.closedPp)
        .map((r) => ({
          label: r.label,
          gap2019Pp: r.gap2019Pp,
          gap2024Pp: r.gap2024Pp,
          closedPp: r.closedPp,
        })),
    [],
  );

  const meta = PANEL_META[panel];

  return (
    <div
      data-viz="cheap-metro-rent-convergence-2026"
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-teal-800">
            Real Estate · Burden-share gap narrowing
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            {meta.title}
          </h3>
          <p className="mt-0.5 text-sm text-slate-600">{meta.subtitle}</p>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-right text-sm">
          <p className="font-semibold text-teal-900">
            {fmtPp(-HEADLINE.gapNarrowPp)} gap
          </p>
          <p className="text-xs text-slate-500">
            {HEADLINE.gap2019Pp} → {HEADLINE.gap2024Pp} pp · 2019–2024
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["gap-path", "Gap path"],
            ["metro-path", "Metro paths"],
            ["zori-scatter", "ZORI scatter"],
            ["rise-ladder", "Rise ladder"],
            ["gap-closed", "Gap closed"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPanel(id)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              panel === id
                ? "bg-teal-800 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {panel === "metro-path" && (
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-medium text-slate-500" htmlFor="metro">
            Metro
          </label>
          <select
            id="metro"
            value={metroId}
            onChange={(e) => setMetroId(e.target.value as MetroId)}
            className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm"
          >
            <optgroup label="Interior (once-cheap)">
              {METROS.filter((m) => m.cohort === "interior").map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Coastal">
              {METROS.filter((m) => m.cohort === "coastal").map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      )}

      {panel === "zori-scatter" && (
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "All metros"],
              ["interior", "Interior"],
              ["coastal", "Coastal"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setCohortFilter(id)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                cohortFilter === id
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {panel === "rise-ladder" && (
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["delta", "Burden rise (pp)"],
              ["zori", "ZORI cum %"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setLadderMetric(id)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                ladderMetric === id
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="h-[360px] w-full sm:h-[420px]">
        {panel === "gap-path" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={COHORT_SERIES} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="burden"
                domain={[38, 56]}
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${v}%`}
                label={{ value: "Burden %", angle: -90, position: "insideLeft", fontSize: 11 }}
              />
              <YAxis
                yAxisId="gap"
                orientation="right"
                domain={[0, 12]}
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${v}`}
                label={{ value: "Gap pp", angle: 90, position: "insideRight", fontSize: 11 }}
              />
              <Tooltip
                formatter={(value, name) => {
                  const n = Number(value ?? 0);
                  return name === "gapPp"
                    ? [fmtPp(n), "Gap"]
                    : [fmtPct(n), String(name)];
                }}
              />
              <Legend />
              <Area
                yAxisId="gap"
                type="monotone"
                dataKey="gapPp"
                name="Gap (pp)"
                fill="#ede9fe"
                stroke={COLORS.gap}
                strokeWidth={2}
              />
              <Line
                yAxisId="burden"
                type="monotone"
                dataKey="interior"
                name="Interior median"
                stroke={COLORS.interior}
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                yAxisId="burden"
                type="monotone"
                dataKey="coastal"
                name="Coastal median"
                stroke={COLORS.coastal}
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "metro-path" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={pathData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis
                domain={[35, 65]}
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
              <Legend />
              <Line
                type="monotone"
                dataKey="coastalMedian"
                name="Coastal median"
                stroke={COLORS.coastal}
                strokeDasharray="6 4"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="interiorMedian"
                name="Interior median"
                stroke={COLORS.interior}
                strokeDasharray="6 4"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="burden30"
                name={metroLabel}
                stroke="#0f172a"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "zori-scatter" && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="zoriCumPct"
                name="ZORI %"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${v}%`}
                label={{ value: "ZORI cum %", position: "insideBottom", offset: -2, fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="burdenDeltaPp"
                name="Burden Δ"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => fmtPp(v)}
                label={{ value: "Burden Δ pp", angle: -90, position: "insideLeft", fontSize: 11 }}
              />
              <ZAxis range={[60, 60]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  const p = payload[0].payload as (typeof CONVERGENCE_SCATTER)[0];
                  return (
                    <div className="rounded border border-slate-200 bg-white px-2 py-1.5 text-xs shadow">
                      <p className="font-semibold">{p.label}</p>
                      <p>ZORI {fmtPct(p.zoriCumPct)}</p>
                      <p>Burden {fmtPp(p.burdenDeltaPp)}</p>
                    </div>
                  );
                }}
              />
              <Scatter data={scatterData} name="Metros">
                {scatterData.map((r) => (
                  <Cell
                    key={r.id}
                    fill={r.cohort === "interior" ? COLORS.interior : COLORS.coastal}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}

        {panel === "rise-ladder" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={ladderData}
              margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
            >
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) =>
                  ladderMetric === "delta" ? fmtPp(v) : `${v}%`
                }
              />
              <YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v) => {
                  const n = Number(v ?? 0);
                  return ladderMetric === "delta" ? fmtPp(n) : fmtPct(n);
                }}
              />
              <Bar dataKey="value" name={ladderMetric === "delta" ? "Burden rise" : "ZORI cum"} radius={[0, 4, 4, 0]}>
                {ladderData.map((r) => (
                  <Cell key={r.label} fill={COLORS.rise} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "gap-closed" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={gapClosedData}
              margin={{ top: 8, right: 12, left: 0, bottom: 48 }}
            >
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-35}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}`} />
              <Tooltip
                formatter={(v) => `${Number(v ?? 0).toFixed(1)} pp`}
              />
              <Legend />
              <Bar dataKey="gap2019Pp" name="Gap to coastal 2019" fill="#fdba74" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gap2024Pp" name="Gap to coastal 2024" fill={COLORS.closed} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="text-[11px] leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
