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
  Pie,
  PieChart,
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
  ANNUAL_SITEWIDE_CC,
  FINAL_NPL_SPLIT,
  FUNDING,
  HEADLINE,
  LEAD_MIX,
  MILESTONE_LADDER,
  PROJECT_FLOW,
  SAA_STATUS,
  SOURCE_NOTE,
  filterAnnualCc,
  statusForMode,
  type UniverseMode,
  type YearFilter,
} from "@/data/npl-sites-with-construction-complete-versus-remaining-construction-2026-data";

type Panel =
  | "final-split"
  | "status-pie"
  | "cc-path"
  | "project-flow"
  | "lead-mix"
  | "milestone-ladder"
  | "funding-scatter";

const COLORS = {
  cc: "#0e7490",
  unfinished: "#b45309",
  deleted: "#64748b",
  proposed: "#7c3aed",
  navy: "#0f2744",
  rose: "#9f1239",
  teal: "#0e7490",
  amber: "#b45309",
  grid: "#e2e8f0",
  gov: "#1e3a5f",
  prp: "#0e7490",
  fed: "#b45309",
};

const PANEL_LABELS: { id: Panel; label: string }[] = [
  { id: "final-split", label: "Final NPL split" },
  { id: "status-pie", label: "Status universe" },
  { id: "cc-path", label: "CC cumulative path" },
  { id: "project-flow", label: "Project vs sitewide" },
  { id: "lead-mix", label: "Who leads starts" },
  { id: "milestone-ladder", label: "Milestone ladder" },
  { id: "funding-scatter", label: "Funding vs flow" },
];

const UNIVERSE_OPTS: { id: UniverseMode; label: string }[] = [
  { id: "final-only", label: "Final NPL only" },
  { id: "final-plus-deleted", label: "Final + deleted" },
  { id: "full-book", label: "Full NPL book" },
];

const YEAR_OPTS: { id: YearFilter; label: string }[] = [
  { id: "all", label: "FY2016–2025" },
  { id: "recent", label: "FY2020–2025" },
  { id: "fy2025", label: "FY2025 only" },
];

const PIE_COLORS: Record<string, string> = {
  "cc-on-final": COLORS.cc,
  "unfinished-final": COLORS.unfinished,
  deleted: COLORS.deleted,
  proposed: COLORS.proposed,
};

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

export function NplSitesWithConstructionCompleteVersusRemainingConstruction2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("final-split");
  const [universe, setUniverse] = useState<UniverseMode>("final-only");
  const [years, setYears] = useState<YearFilter>("all");

  const statusSlices = useMemo(() => statusForMode(universe), [universe]);
  const annualCc = useMemo(() => filterAnnualCc(years), [years]);

  const leadChart = useMemo(
    () =>
      LEAD_MIX.map((r) => ({
        fy: `FY${r.fiscalYear}`,
        Government: r.government,
        PRP: r.prp,
        "Federal facility": r.federalFacility,
      })),
    [],
  );

  const flowChart = useMemo(
    () =>
      PROJECT_FLOW.map((r) => ({
        fy: `FY${r.fiscalYear}`,
        Started: r.started,
        Ongoing: r.ongoingPrior,
        "Projects done": r.completedProjects,
        "Sitewide CC": r.sitewideCc,
      })),
    [],
  );

  const fundingScatter = useMemo(
    () =>
      FUNDING.map((f) => {
        const flow = PROJECT_FLOW.find((p) => p.fiscalYear === f.fiscalYear);
        return {
          fy: f.fiscalYear,
          constructionM: f.constructionObligatedM,
          projectsDone: flow?.completedProjects ?? 0,
          sitewideCc: flow?.sitewideCc ?? 0,
          label: `FY${f.fiscalYear}`,
        };
      }),
    [],
  );

  return (
    <div
      data-viz="npl-sites-with-construction-complete-versus-remaining-construction-2026"
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Superfund NPL · construction milestone
          </p>
          <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Headline — {HEADLINE.ccSharePct}% of final NPL construction-complete (
            {fmt(HEADLINE.ccOnFinalNpl)} sites); {fmt(HEADLINE.unfinishedOnFinalNpl)}{" "}
            still unfinished
          </h3>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            End-FY2025 final list: {fmt(HEADLINE.finalNpl)} sites. Cumulative sitewide
            construction complete: {fmt(HEADLINE.cumulativeCc)}. Unfinished share:{" "}
            {HEADLINE.unfinishedSharePct}%.
          </p>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {PANEL_LABELS.map((p) => (
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

      <div className="mb-4 flex flex-wrap gap-2">
        {UNIVERSE_OPTS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setUniverse(o.id)}
            className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
              universe === o.id
                ? "border-teal-700 bg-teal-50 text-teal-900"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {o.label}
          </button>
        ))}
        {YEAR_OPTS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setYears(o.id)}
            className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
              years === o.id
                ? "border-amber-700 bg-amber-50 text-amber-900"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="h-[360px] w-full sm:h-[400px]">
        {panel === "final-split" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={FINAL_NPL_SPLIT}
              margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="label"
                width={160}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(v, name, item) => {
                  const row = item?.payload as { sharePct?: number } | undefined;
                  return [
                    `${fmt(Number(v ?? 0))} sites (${row?.sharePct ?? "—"}%)`,
                    name === "sites" ? "Sites" : String(name),
                  ];
                }}
              />
              <Bar dataKey="sites" radius={[0, 4, 4, 0]}>
                {FINAL_NPL_SPLIT.map((row) => (
                  <Cell
                    key={row.id}
                    fill={
                      row.id === "construction-complete"
                        ? COLORS.cc
                        : COLORS.unfinished
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "status-pie" && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusSlices}
                dataKey="sites"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={2}
                label={(props) => {
                  const name = String(props.name ?? "");
                  const value = Number(props.value ?? 0);
                  return `${name}: ${fmt(value)}`;
                }}
              >
                {statusSlices.map((s) => (
                  <Cell key={s.id} fill={PIE_COLORS[s.id] ?? COLORS.navy} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, _n, item) => {
                  const row = item?.payload as
                    | { shareOfUniversePct?: number; label?: string }
                    | undefined;
                  return [
                    `${fmt(Number(v ?? 0))} (${row?.shareOfUniversePct ?? "—"}% of universe)`,
                    row?.label ?? "Sites",
                  ];
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}

        {panel === "cc-path" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={annualCc} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis dataKey="fiscalYear" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
                label={{ value: "Annual CC", angle: -90, position: "insideLeft", fontSize: 11 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={["dataMin - 20", "dataMax + 10"]}
                tick={{ fontSize: 12 }}
                label={{ value: "Cumulative", angle: 90, position: "insideRight", fontSize: 11 }}
              />
              <Tooltip />
              <Legend />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="cumulativeCc"
                name="Cumulative CC"
                fill="#99f6e4"
                stroke={COLORS.teal}
                fillOpacity={0.35}
              />
              <Bar
                yAxisId="left"
                dataKey="sitewideCc"
                name="Annual sitewide CC"
                fill={COLORS.rose}
                radius={[3, 3, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cumulativeCc"
                name="Cumulative (line)"
                stroke={COLORS.navy}
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "project-flow" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={flowChart} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis dataKey="fy" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="Started" stackId="a" fill={COLORS.gov} />
              <Bar yAxisId="left" dataKey="Ongoing" stackId="a" fill={COLORS.teal} />
              <Bar
                yAxisId="left"
                dataKey="Projects done"
                fill={COLORS.amber}
                radius={[3, 3, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="Sitewide CC"
                stroke={COLORS.rose}
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "lead-mix" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leadChart} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis dataKey="fy" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Government" stackId="lead" fill={COLORS.gov} />
              <Bar dataKey="PRP" stackId="lead" fill={COLORS.prp} />
              <Bar
                dataKey="Federal facility"
                stackId="lead"
                fill={COLORS.fed}
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "milestone-ladder" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={MILESTONE_LADDER}
              margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="label"
                width={200}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(v, _n, item) => {
                  const row = item?.payload as { note?: string } | undefined;
                  return [
                    `${fmt(Number(v ?? 0))} — ${row?.note ?? ""}`,
                    "Cumulative sites",
                  ];
                }}
              />
              <Bar dataKey="sites" fill={COLORS.navy} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "funding-scatter" && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 16, right: 24, left: 8, bottom: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis
                type="number"
                dataKey="constructionM"
                name="Construction $M"
                tick={{ fontSize: 12 }}
                label={{
                  value: "Construction obligations ($M)",
                  position: "insideBottom",
                  offset: -4,
                  fontSize: 11,
                }}
              />
              <YAxis
                type="number"
                dataKey="projectsDone"
                name="Projects done"
                tick={{ fontSize: 12 }}
                label={{
                  value: "Projects completed",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 11,
                }}
              />
              <ZAxis type="number" dataKey="sitewideCc" range={[80, 400]} name="Sitewide CC" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) => [fmt(Number(v ?? 0)), String(name)]}
                labelFormatter={(_, payload) =>
                  (payload?.[0]?.payload as { label?: string } | undefined)
                    ?.label ?? "Fiscal year"
                }
              />
              <Scatter data={fundingScatter} fill={COLORS.teal}>
                {fundingScatter.map((d) => (
                  <Cell key={d.fy} fill={d.fy === 2025 ? COLORS.rose : COLORS.teal} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Unfinished on final NPL</p>
          <p className="text-xl font-semibold text-amber-800">
            {fmt(ANALYTICS.unfinishedSites)}
          </p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">FY2025 project completions / sitewide CC</p>
          <p className="text-xl font-semibold text-slate-900">
            {ANALYTICS.projectsPerSitewideCcFy2025} : 1
          </p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">SAA construction-complete share</p>
          <p className="text-xl font-semibold text-teal-800">
            {ANALYTICS.saaCcSharePct}%
          </p>
          <p className="text-xs text-slate-500">
            {SAA_STATUS[1].sites} of {SAA_STATUS[0].sites + SAA_STATUS[1].sites} SAA
            agreements
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <p className="mt-1 text-[11px] text-slate-400">
        Path rows: {ANNUAL_SITEWIDE_CC.length} fiscal years · Universe mode: {universe} ·
        Year filter: {years}
      </p>
    </div>
  );
}
