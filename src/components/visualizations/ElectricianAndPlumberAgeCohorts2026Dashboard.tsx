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
  HEADLINE,
  LICENSE_TREND,
  NATIONAL_AGE_BANDS,
  REGION_ROLLUP,
  SOURCE_NOTE,
  STATE_COHORTS,
  type Region,
  type TradeId,
} from "@/data/electrician-and-plumber-age-cohorts-2026-data";

type Panel =
  | "age-bands"
  | "state-ladder"
  | "pipeline-scatter"
  | "license-path"
  | "region-compare";

type SortMode = "share55-desc" | "pressure-desc" | "pass-asc";

const COLORS = {
  electrician: "#0f766e",
  plumber: "#b45309",
  accent: "#ea580c",
  grid: "#e2e8f0",
  northeast: "#1e3a5f",
  midwest: "#0f766e",
  south: "#c2410c",
  west: "#7c3aed",
};

const REGION_COLOR: Record<Region, string> = {
  Northeast: COLORS.northeast,
  Midwest: COLORS.midwest,
  South: COLORS.south,
  West: COLORS.west,
};

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "age-bands": {
    title: "National age bands — electricians vs plumbers",
    subtitle:
      "CPS 2024 A-11b — plumbers carry a thicker 55–64 band; both peak in the 25–34 decade",
  },
  "state-ladder": {
    title: "Near-retirement share by state",
    subtitle:
      "Maine / Vermont / West Virginia lead; Sun Belt and Mountain West sit younger",
  },
  "pipeline-scatter": {
    title: "Aging vs licensure pipeline pressure",
    subtitle:
      "X = share 55+ · Y = 55+ headcount per new license · bubble = employment",
  },
  "license-path": {
    title: "New licenses issued (national path)",
    subtitle:
      "Desk consolidation of board issuance — COVID dip, then climb through 2024",
  },
  "region-compare": {
    title: "Regional age vs exam pass rates",
    subtitle:
      "Northeast cohorts oldest; South/West pass rates run higher on average",
  },
};

const REGIONS: Array<Region | "all"> = [
  "all",
  "Northeast",
  "Midwest",
  "South",
  "West",
];

export function ElectricianAndPlumberAgeCohorts2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("state-ladder");
  const [trade, setTrade] = useState<TradeId>("electrician");
  const [region, setRegion] = useState<Region | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("share55-desc");

  const tradeColor =
    trade === "electrician" ? COLORS.electrician : COLORS.plumber;

  const filteredStates = useMemo(() => {
    let rows = STATE_COHORTS.filter((r) => r.trade === trade);
    if (region !== "all") rows = rows.filter((r) => r.region === region);
    const sorted = [...rows];
    if (sortMode === "share55-desc") sorted.sort((a, b) => b.share55 - a.share55);
    else if (sortMode === "pressure-desc")
      sorted.sort((a, b) => b.pipelinePressure - a.pipelinePressure);
    else sorted.sort((a, b) => a.examPassRate - b.examPassRate);
    return sorted;
  }, [trade, region, sortMode]);

  const ladderData = useMemo(
    () =>
      filteredStates.slice(0, 14).map((r) => ({
        label: r.abbr,
        share55: r.share55,
        pass: r.examPassRate,
        region: r.region,
      })),
    [filteredStates]
  );

  const scatterData = useMemo(
    () =>
      filteredStates.map((r) => ({
        abbr: r.abbr,
        state: r.state,
        trade: r.trade,
        region: r.region,
        share55: r.share55,
        pipelinePressure: r.pipelinePressure,
        examPassRate: r.examPassRate,
        z: Math.sqrt(r.employment) / 4,
      })),
    [filteredStates]
  );

  const regionCompare = useMemo(
    () =>
      REGION_ROLLUP.map((r) => ({
        region: r.region,
        share55:
          trade === "electrician" ? r.electricianShare55 : r.plumberShare55,
        passRate:
          trade === "electrician" ? r.electricianPassRate : r.plumberPassRate,
      })),
    [trade]
  );

  const meta = PANEL_META[panel];

  return (
    <div
      className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      data-viz="electrician-and-plumber-age-cohorts-2026"
    >
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
          Labor & Skills · Skilled-trades workforce age
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
          Electrician & plumber age cohorts
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Near-retirement share by state for electricians and plumbers, set
          against licensure issuance and exam gates.{" "}
          <span className="font-medium text-slate-800">
            Plumbers {HEADLINE.plumbShare55}% 55+ · Electricians{" "}
            {HEADLINE.elecShare55}%
          </span>
          {" — "}
          oldest electrician cohort {ANALYTICS.oldestElec} at{" "}
          {ANALYTICS.oldestElecShare55}%.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["age-bands", "Age bands"],
            ["state-ladder", "State ladder"],
            ["pipeline-scatter", "Pipeline scatter"],
            ["license-path", "License path"],
            ["region-compare", "Region compare"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPanel(id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              panel === id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Trade
        </span>
        {(
          [
            ["electrician", "Electricians"],
            ["plumber", "Plumbers"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTrade(id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              trade === id
                ? id === "electrician"
                  ? "bg-teal-800 text-white"
                  : "bg-amber-800 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-2 text-xs font-medium uppercase tracking-wide text-slate-500">
          Region
        </span>
        {REGIONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRegion(r)}
            className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition ${
              region === r
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {r === "all" ? "All" : r}
          </button>
        ))}
        {(panel === "state-ladder" || panel === "pipeline-scatter") && (
          <>
            <span className="ml-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              Sort
            </span>
            {(
              [
                ["share55-desc", "Oldest first"],
                ["pressure-desc", "Pressure"],
                ["pass-asc", "Pass rate"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setSortMode(id)}
                className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition ${
                  sortMode === id
                    ? "bg-rose-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </>
        )}
      </div>

      <div className="mb-2">
        <h4 className="text-base font-semibold text-slate-900">{meta.title}</h4>
        <p className="text-sm text-slate-600">{meta.subtitle}</p>
      </div>

      <div className="h-[380px] w-full sm:h-[420px]">
        {panel === "age-bands" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={NATIONAL_AGE_BANDS}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
              <YAxis
                type="category"
                dataKey="band"
                width={56}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(v, name) => [
                  `${v}%`,
                  name === "electricianPct" ? "Electricians" : "Plumbers",
                ]}
              />
              <Legend />
              <Bar
                dataKey="electricianPct"
                name="Electricians"
                fill={COLORS.electrician}
                radius={[0, 3, 3, 0]}
              />
              <Bar
                dataKey="plumberPct"
                name="Plumbers"
                fill={COLORS.plumber}
                radius={[0, 3, 3, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "state-ladder" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={ladderData}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                domain={[0, 32]}
                unit="%"
              />
              <YAxis
                type="category"
                dataKey="label"
                width={36}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(v, name) => {
                  if (name === "share55") return [`${v}%`, "Share 55+"];
                  if (name === "pass") return [`${v}%`, "Exam pass"];
                  return [v, String(name)];
                }}
              />
              <Legend />
              <Bar dataKey="share55" name="Share 55+" radius={[0, 3, 3, 0]}>
                {ladderData.map((d) => (
                  <Cell
                    key={d.label}
                    fill={REGION_COLOR[d.region] ?? tradeColor}
                  />
                ))}
              </Bar>
              <Line
                type="monotone"
                dataKey="pass"
                name="Exam pass %"
                stroke={COLORS.accent}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "pipeline-scatter" && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis
                type="number"
                dataKey="share55"
                name="Share 55+"
                unit="%"
                tick={{ fontSize: 11 }}
                domain={[10, 30]}
                label={{
                  value: "Share 55+ (%)",
                  position: "insideBottom",
                  offset: -4,
                  fontSize: 11,
                }}
              />
              <YAxis
                type="number"
                dataKey="pipelinePressure"
                name="Pressure"
                tick={{ fontSize: 11 }}
                domain={[0, 12]}
                label={{
                  value: "55+ per new license",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 11,
                }}
              />
              <ZAxis type="number" dataKey="z" range={[40, 280]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) => {
                  if (name === "share55") return [`${v}%`, "Share 55+"];
                  if (name === "pipelinePressure")
                    return [v, "Pipeline pressure"];
                  if (name === "examPassRate") return [`${v}%`, "Exam pass"];
                  return [v, String(name)];
                }}
                labelFormatter={(_, payload) => {
                  const p = payload?.[0]?.payload as
                    | { state?: string; abbr?: string }
                    | undefined;
                  return p?.state ? `${p.state} (${p.abbr})` : "";
                }}
              />
              <Scatter name="States" data={scatterData} fill={tradeColor}>
                {scatterData.map((d) => (
                  <Cell
                    key={`${d.abbr}-${d.trade}`}
                    fill={REGION_COLOR[d.region]}
                    fillOpacity={0.85}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}

        {panel === "license-path" && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={[...LICENSE_TREND]}
              margin={{ top: 12, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
              />
              <Tooltip
                formatter={(v, name) => [
                  Number(v).toLocaleString(),
                  name === "electrician"
                    ? "Electrician licenses"
                    : "Plumber licenses",
                ]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="electrician"
                name="Electrician"
                stroke={COLORS.electrician}
                fill={COLORS.electrician}
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="plumber"
                name="Plumber"
                stroke={COLORS.plumber}
                fill={COLORS.plumber}
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {panel === "region-compare" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={regionCompare}
              margin={{ top: 12, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis dataKey="region" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11 }}
                unit="%"
                domain={[0, 30]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11 }}
                unit="%"
                domain={[40, 80]}
              />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="share55"
                name="Share 55+"
                fill={tradeColor}
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="passRate"
                name="Exam pass %"
                stroke={COLORS.accent}
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
