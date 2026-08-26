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
  BULGE_INDEX,
  CLEARANCE_SCATTER,
  HEADLINE,
  NATIONAL_PATH,
  REGION_AGG,
  REGION_OPTIONS,
  SOURCE_NOTE,
  filterStates,
  sortStates,
  type RegionFilter,
  type SortKey,
} from "@/data/ncsc-civil-pending-caseload-per-judge-2026-data";

type Panel =
  | "national-path"
  | "pending-ladder"
  | "clearance-scatter"
  | "region-bulge"
  | "bulge-index";

const COLORS = {
  pending: "#1e3a5f",
  peak: "#9f1239",
  clear: "#0f766e",
  muted: "#94a3b8",
  accent: "#b45309",
  region: {
    northeast: "#1d4ed8",
    midwest: "#0f766e",
    south: "#c2410c",
    west: "#7c3aed",
  } as Record<string, string>,
};

const PANEL_LABELS: { id: Panel; label: string }[] = [
  { id: "national-path", label: "National path" },
  { id: "pending-ladder", label: "Pending ladder" },
  { id: "clearance-scatter", label: "Clearance scatter" },
  { id: "region-bulge", label: "Region bulge" },
  { id: "bulge-index", label: "Bulge index" },
];

const SORT_LABELS: { id: SortKey; label: string }[] = [
  { id: "pendingPerJudge2023", label: "2023 pending/judge" },
  { id: "pendingPerJudge2021", label: "2021 peak" },
  { id: "bulgeClearedPct", label: "Bulge cleared" },
  { id: "clearance2023Pct", label: "Clearance rate" },
  { id: "deltaFrom2019", label: "Gap vs 2019" },
];

function fmtInt(n: number) {
  return n.toLocaleString("en-US");
}

function fmtPct(n: number, digits = 0) {
  return `${n.toFixed(digits)}%`;
}

export function NcscCivilPendingCaseloadPerJudge2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("national-path");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("pendingPerJudge2023");
  const [disclosedOnly, setDisclosedOnly] = useState(false);
  const [above2019Only, setAbove2019Only] = useState(false);

  const ladderRows = useMemo(() => {
    let rows = filterStates(region);
    if (disclosedOnly) rows = rows.filter((r) => r.confidence === "disclosed");
    if (above2019Only) rows = rows.filter((r) => r.stillAbove2019);
    return sortStates(rows, sortKey).slice(0, 18);
  }, [region, sortKey, disclosedOnly, above2019Only]);

  const scatterRows = useMemo(() => {
    let rows = CLEARANCE_SCATTER;
    if (region !== "all") rows = rows.filter((r) => r.region === region);
    if (disclosedOnly) rows = rows.filter((r) => r.confidence === "disclosed");
    return rows;
  }, [region, disclosedOnly]);

  const pathChart = useMemo(
    () =>
      NATIONAL_PATH.map((r) => ({
        year: r.year,
        median: r.medianPendingPerJudge,
        p25: r.p25,
        p75: r.p75,
        clearance: r.medianClearancePct,
      })),
    [],
  );

  return (
    <figure
      className="my-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      data-viz="ncsc-civil-pending-caseload-per-judge-2026"
    >
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
          Interactive — pending civil per judge
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900">
          Headline — median {HEADLINE.medianPendingPerJudge2023} pending civil
          per judge in {HEADLINE.latestYear}
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Down {HEADLINE.pctDownFromPeak}% from the {HEADLINE.peakYear} peak of{" "}
          {HEADLINE.medianPendingPerJudge2021}, yet still {HEADLINE.pctAbove2019}%
          above 2019&apos;s {HEADLINE.medianPendingPerJudge2019}.{" "}
          {ANALYTICS.statesStillAbove2019} of {HEADLINE.statesInPanel} panel
          states remain above their pre-pandemic baseline; {ANALYTICS.topState2023.state}{" "}
          leads at {fmtInt(ANALYTICS.topState2023.pendingPerJudge2023)} pending
          per authorized GJ judge.
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
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">
        {REGION_OPTIONS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRegion(r.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              region === r.id
                ? "bg-amber-800 text-white"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {r.label}
          </button>
        ))}
        <span className="mx-1 hidden h-6 w-px bg-slate-200 sm:inline-block" />
        {SORT_LABELS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSortKey(s.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              sortKey === s.id
                ? "bg-teal-800 text-white"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {s.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setDisclosedOnly((v) => !v)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
            disclosedOnly
              ? "bg-indigo-800 text-white"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          {disclosedOnly ? "Disclosed only" : "Include estimates"}
        </button>
        <button
          type="button"
          onClick={() => setAbove2019Only((v) => !v)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
            above2019Only
              ? "bg-rose-800 text-white"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          {above2019Only ? "Above 2019 only" : "All panel states"}
        </button>
      </div>

      <div className="px-2 py-4 sm:px-4">
        {panel === "national-path" && (
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={pathChart} margin={{ top: 8, right: 48, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Pending / judge",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[80, 120]}
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Clearance %",
                    angle: 90,
                    position: "insideRight",
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    const key = String(name);
                    return [
                      key === "clearance" ? fmtPct(n) : fmtInt(n),
                      key === "clearance"
                        ? "Median clearance"
                        : key === "median"
                          ? "Median pending/judge"
                          : key,
                    ];
                  }}
                />
                <Legend />
                <ReferenceLine
                  yAxisId="left"
                  y={HEADLINE.medianPendingPerJudge2019}
                  stroke={COLORS.muted}
                  strokeDasharray="4 4"
                  label={{ value: "2019 baseline", position: "insideTopRight", fontSize: 10 }}
                />
                <Bar yAxisId="left" dataKey="p75" name="P75 band" fill="#cbd5e1" opacity={0.45} />
                <Bar yAxisId="left" dataKey="p25" name="P25 floor" fill="#f1f5f9" />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="median"
                  name="Median pending/judge"
                  stroke={COLORS.pending}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="clearance"
                  name="Median clearance %"
                  stroke={COLORS.clear}
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "pending-ladder" && (
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ladderRows}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="abbr"
                  width={36}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = Number(value);
                    const key = String(name);
                    return [
                      fmtInt(n),
                      key === "pendingPerJudge2023"
                        ? "2023 pending/judge"
                        : key === "pendingPerJudge2021"
                          ? "2021 peak"
                          : key === "pendingPerJudge2019"
                            ? "2019 baseline"
                            : key,
                    ];
                  }}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.state ?? ""
                  }
                />
                <Legend />
                <Bar
                  dataKey="pendingPerJudge2019"
                  name="2019"
                  fill={COLORS.muted}
                  radius={[0, 2, 2, 0]}
                />
                <Bar
                  dataKey="pendingPerJudge2021"
                  name="2021 peak"
                  fill={COLORS.peak}
                  radius={[0, 2, 2, 0]}
                />
                <Bar
                  dataKey="pendingPerJudge2023"
                  name="2023"
                  fill={COLORS.pending}
                  radius={[0, 4, 4, 0]}
                >
                  {ladderRows.map((row) => (
                    <Cell
                      key={row.abbr}
                      fill={
                        row.stillAbove2019 ? COLORS.pending : COLORS.clear
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "clearance-scatter" && (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 24, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="clearance2023Pct"
                  name="Clearance %"
                  domain={[90, 115]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "2023 civil clearance %",
                    position: "insideBottom",
                    offset: -4,
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="pendingPerJudge2023"
                  name="Pending/judge"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "2023 pending / judge",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <ZAxis type="number" dataKey="bulgeClearedPct" range={[60, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    const n = Number(value);
                    const key = String(name);
                    if (key === "clearance2023Pct") return [fmtPct(n), "Clearance"];
                    if (key === "pendingPerJudge2023") return [fmtInt(n), "Pending/judge"];
                    if (key === "bulgeClearedPct") return [fmtPct(n), "Bulge cleared"];
                    return [String(value), key];
                  }}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.state ?? ""
                  }
                />
                <ReferenceLine x={100} stroke={COLORS.muted} strokeDasharray="4 4" />
                <Scatter name="States" data={scatterRows}>
                  {scatterRows.map((row) => (
                    <Cell
                      key={row.abbr}
                      fill={COLORS.region[row.region] ?? COLORS.pending}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <p className="mt-1 px-2 text-center text-xs text-slate-500">
              Bubble size ∝ bulge cleared %. Left of 100% clearance = still accumulating.
            </p>
          </div>
        )}

        {panel === "region-bulge" && (
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={REGION_AGG}
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Median pending/judge",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Bulge cleared %",
                    angle: 90,
                    position: "insideRight",
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = Number(value);
                    const key = String(name);
                    return [
                      key.includes("Cleared") || key.includes("bulge")
                        ? fmtPct(n)
                        : fmtInt(n),
                      key,
                    ];
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="medianPendingPerJudge2023"
                  name="Median pending/judge (2023)"
                  radius={[4, 4, 0, 0]}
                >
                  {REGION_AGG.map((r) => (
                    <Cell key={r.region} fill={COLORS.region[r.region]} />
                  ))}
                </Bar>
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="medianBulgeClearedPct"
                  name="Median bulge cleared %"
                  stroke={COLORS.accent}
                  strokeWidth={2.5}
                  dot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "bulge-index" && (
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={BULGE_INDEX}
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[80, 180]}
                  label={{
                    value: "Index (2019 = 100)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <Tooltip
                  formatter={(value) => [`${Number(value)}`, "Index vs 2019"]}
                />
                <ReferenceLine y={100} stroke={COLORS.muted} strokeDasharray="4 4" />
                <ReferenceLine
                  y={168}
                  stroke={COLORS.peak}
                  strokeDasharray="3 3"
                  label={{ value: "2021 peak", position: "insideTopLeft", fontSize: 10 }}
                />
                <Bar
                  dataKey="indexVs2019"
                  name="Pending/judge index"
                  fill={COLORS.pending}
                  radius={[4, 4, 0, 0]}
                >
                  {BULGE_INDEX.map((r) => (
                    <Cell
                      key={r.year}
                      fill={
                        r.year === 2021
                          ? COLORS.peak
                          : r.indexVs2019 > 100
                            ? COLORS.pending
                            : COLORS.clear
                      }
                    />
                  ))}
                </Bar>
                <Line
                  type="monotone"
                  dataKey="indexVs2019"
                  stroke={COLORS.accent}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Path"
                />
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
