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
  ADOPTION_WAVE,
  ANALYTICS,
  COHORT_AGG,
  HEADLINE,
  NATIONAL_SERIES,
  SOURCE_NOTE,
  TRIGGER_MIX,
  filterStates,
  type CohortFilter,
  type RegionFilter,
  type SortKey,
} from "@/data/dormancy-periods-versus-escheat-inflows-2026-data";

// smoke-marker: Inflow change vs reunification

type Panel =
  | "national-path"
  | "cohort-gap"
  | "delta-scatter"
  | "state-ladder"
  | "trigger-mix"
  | "adoption-wave";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "national-path": {
    title: "National remittances vs owner returns",
    subtitle: `Inflows climb with the dormancy-cut wave; FY2024 reunification ratio is ~${NATIONAL_SERIES[NATIONAL_SERIES.length - 1]!.reunifPct}%`,
  },
  "cohort-gap": {
    title: "Shortened vs 5-year holdouts",
    subtitle: `Median inflow Δ +${HEADLINE.medianInflowDeltaPct}% after cuts vs +${HEADLINE.medianHoldoutInflowDeltaPct}% for holdouts; reunification barely moves`,
  },
  "delta-scatter": {
    title: "Inflow change vs reunification change",
    subtitle: `${HEADLINE.inflowUpReunifFlat} of ${HEADLINE.panelShorteners} shorteners show ≥20% inflow rise with reunification flat or down`,
  },
  "state-ladder": {
    title: "State remittance change after statute windows",
    subtitle: "Shorteners dominate the upper rungs; holdouts cluster near single-digit gains",
  },
  "trigger-mix": {
    title: "How dormancy clocks start",
    subtitle: "Inactivity triggers dominate the short-dormancy panel",
  },
  "adoption-wave": {
    title: "Cumulative banking dormancy cuts",
    subtitle: `${HEADLINE.jurisdictionsShortened} jurisdictions shortened banking clocks between 2004 and 2020`,
  },
};

const PANEL_BTNS: { id: Panel; label: string }[] = [
  { id: "national-path", label: "National path" },
  { id: "cohort-gap", label: "Cohort gap" },
  { id: "delta-scatter", label: "Δ scatter" },
  { id: "state-ladder", label: "State ladder" },
  { id: "trigger-mix", label: "Trigger mix" },
  { id: "adoption-wave", label: "Adoption wave" },
];

const REGION_OPTS: { id: RegionFilter; label: string }[] = [
  { id: "all", label: "All regions" },
  { id: "northeast", label: "Northeast" },
  { id: "midwest", label: "Midwest" },
  { id: "south", label: "South" },
  { id: "west", label: "West" },
];

const COHORT_OPTS: { id: CohortFilter; label: string }[] = [
  { id: "all", label: "All cohorts" },
  { id: "shortened", label: "Shortened to 3y" },
  { id: "holdout", label: "5y holdouts" },
];

const SORT_OPTS: { id: SortKey; label: string }[] = [
  { id: "inflowDelta", label: "Inflow Δ %" },
  { id: "reunifDelta", label: "Reunif Δ pp" },
  { id: "latestInflow", label: "Latest inflow $" },
  { id: "dormancy", label: "Dormancy years" },
  { id: "alpha", label: "A–Z" },
];

const TRIGGER_COLORS: Record<string, string> = {
  inactivity: "#0f766e",
  hybrid: "#b45309",
  rpo: "#0369a1",
};

const fmtPct = (n: number) => `${n.toFixed(1)}%`;
const fmtPp = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)} pp`;
const fmtB = (n: number) => `$${n.toFixed(1)}B`;
const fmtM = (n: number) => `$${Math.round(n)}M`;

export function DormancyPeriodsVersusEscheatInflows2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("national-path");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [cohort, setCohort] = useState<CohortFilter>("all");
  const [sort, setSort] = useState<SortKey>("inflowDelta");
  const [pathMode, setPathMode] = useState<"flows" | "reunif">("flows");

  const meta = PANEL_META[panel];
  const states = useMemo(
    () => filterStates(region, cohort, sort),
    [region, cohort, sort],
  );

  const ladderData = useMemo(
    () =>
      states.map((s) => ({
        abbr: s.abbr,
        delta: s.inflowDeltaPct,
        color: s.cohort === "shortened" ? "#0f766e" : "#64748b",
      })),
    [states],
  );

  const scatterData = useMemo(
    () =>
      states.map((s) => ({
        abbr: s.abbr,
        inflow: s.inflowDeltaPct,
        reunif: s.reunifDeltaPp,
        size: Math.max(40, Math.sqrt(s.latestInflowM) * 3),
        fill: s.cohort === "shortened" ? "#0f766e" : "#94a3b8",
      })),
    [states],
  );

  const cohortBars = useMemo(
    () =>
      COHORT_AGG.map((c) => ({
        label: c.label,
        inflow: c.medianInflowDeltaPct,
        reunif: c.medianReunifDeltaPp,
        flatShare: c.shareInflowUpReunifFlat,
      })),
    [],
  );

  const triggerPie = useMemo(
    () =>
      TRIGGER_MIX.map((t) => ({
        ...t,
        color: TRIGGER_COLORS[t.trigger] ?? "#64748b",
      })),
    [],
  );

  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      data-viz="dormancy-periods-versus-escheat-inflows-2026"
    >
      <div className="border-b border-slate-200 bg-slate-950 px-4 py-4 text-white sm:px-6">
        <p className="text-xs font-medium uppercase tracking-wider text-amber-300/90">
          Finance · {ANALYTICS.smokeMarker}
        </p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
          Dormancy cuts lift remittances — not reunification
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-slate-300">
          {ANALYTICS.headlineLabel}: {ANALYTICS.headlineValue} for the
          shortening cohort versus +{HEADLINE.medianHoldoutInflowDeltaPct}% for
          5-year holdouts. Median reunification change after cuts:{" "}
          {fmtPp(HEADLINE.medianReunificationDeltaPp)}.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-6">
        {PANEL_BTNS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setPanel(id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              panel === id
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3 sm:px-6">
        <label className="flex items-center gap-2 text-xs text-slate-600">
          Region
          <select
            className="rounded border border-slate-200 bg-white px-2 py-1 text-xs"
            value={region}
            onChange={(e) => setRegion(e.target.value as RegionFilter)}
          >
            {REGION_OPTS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-600">
          Cohort
          <select
            className="rounded border border-slate-200 bg-white px-2 py-1 text-xs"
            value={cohort}
            onChange={(e) => setCohort(e.target.value as CohortFilter)}
          >
            {COHORT_OPTS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-600">
          Sort
          <select
            className="rounded border border-slate-200 bg-white px-2 py-1 text-xs"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            {SORT_OPTS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        {panel === "national-path" && (
          <div className="flex gap-1">
            {(
              [
                ["flows", "Inflows + returns"],
                ["reunif", "Reunification %"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setPathMode(id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                  pathMode === id
                    ? "bg-amber-700 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-4 sm:px-6">
        <h4 className="text-sm font-semibold text-slate-900">{meta.title}</h4>
        <p className="mt-0.5 text-xs text-slate-500">{meta.subtitle}</p>

        <div className="mt-4 h-80 w-full">
          {panel === "national-path" && pathMode === "flows" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={NATIONAL_SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                />
                <Tooltip formatter={(v) => fmtB(Number(v))} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="inflowsB"
                  name="Remittances $B"
                  stroke="#0f766e"
                  fill="#5eead4"
                  fillOpacity={0.55}
                />
                <Line
                  type="monotone"
                  dataKey="returnsB"
                  name="Owner returns $B"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {panel === "national-path" && pathMode === "reunif" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={NATIONAL_SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="reunifPct"
                  name="Returns / remittances %"
                  stroke="#b45309"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Bar
                  yAxisId="right"
                  dataKey="shortDormancyStates"
                  name="States ≤3y dormancy"
                  fill="#0f766e"
                  opacity={0.45}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {panel === "cohort-gap" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cohortBars} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="inflow"
                  name="Median inflow Δ %"
                  fill="#0f766e"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="reunif"
                  name="Median reunif Δ pp"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}

          {panel === "delta-scatter" && (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="inflow"
                  name="Inflow Δ %"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Inflow Δ %",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="reunif"
                  name="Reunif Δ pp"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Reunif Δ pp",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="size" range={[60, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => {
                    const n = Number(v);
                    if (String(name).includes("Inflow")) return fmtPct(n);
                    if (String(name).includes("Reunif")) return fmtPp(n);
                    return n;
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as
                      | { abbr?: string }
                      | undefined;
                    return p?.abbr ?? "";
                  }}
                />
                <Scatter data={scatterData} fill="#0f766e">
                  {scatterData.map((d) => (
                    <Cell key={d.abbr} fill={d.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          )}

          {panel === "state-ladder" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ladderData} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="abbr"
                  width={36}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip formatter={(v) => fmtPct(Number(v))} />
                <Bar dataKey="delta" name="Inflow Δ %" radius={[0, 4, 4, 0]}>
                  {ladderData.map((d) => (
                    <Cell key={d.abbr} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {panel === "trigger-mix" && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={triggerPie}
                  dataKey="states"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={98}
                  paddingAngle={2}
                  label={(props) => {
                    const p = props as {
                      label?: string;
                      states?: number;
                      name?: string;
                    };
                    return `${String(p.label ?? p.name ?? "")} (${p.states ?? 0})`;
                  }}
                >
                  {triggerPie.map((t) => (
                    <Cell key={t.trigger} fill={t.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, _n, item) => {
                    const row = item?.payload as
                      | { medianInflowDeltaPct?: number }
                      | undefined;
                    return [
                      `${v} states · median inflow Δ ${row?.medianInflowDeltaPct ?? "—"}%`,
                      "Count",
                    ];
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}

          {panel === "adoption-wave" && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADOPTION_WAVE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Area
                  type="stepAfter"
                  dataKey="cumulative"
                  name="Cumulative cuts"
                  stroke="#0f766e"
                  fill="#99f6e4"
                  fillOpacity={0.6}
                />
                <Bar dataKey="newCuts" name="New cuts in window" fill="#b45309" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {(panel === "state-ladder" || panel === "delta-scatter") && (
          <p className="mt-2 text-xs text-slate-500">
            Showing {states.length} states
            {region !== "all" ? ` · ${region}` : ""}
            {cohort !== "all" ? ` · ${cohort}` : ""}. Teal = shortened cohort;
            slate = 5-year holdouts. Latest remittance marker:{" "}
            {states[0] ? fmtM(states[0].latestInflowM) : "—"}.
          </p>
        )}
      </div>

      <p className="border-t border-slate-100 px-4 py-3 text-[11px] leading-relaxed text-slate-500 sm:px-6">
        {SOURCE_NOTE}
      </p>
    </div>
  );
}
