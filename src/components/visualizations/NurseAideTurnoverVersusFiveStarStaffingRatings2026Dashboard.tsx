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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  DETAIL_TABLE,
  HEADLINE,
  OWNERSHIP_TURNOVER,
  REGION_AGG,
  REGION_OPTIONS,
  SOURCE_NOTE,
  STAFFING_POINT_BUDGET,
  STAR_BAND_TURNOVER,
  STATE_PANEL,
  filterStates,
  type RegionFilter,
  type SortKey,
} from "@/data/nurse-aide-turnover-versus-five-star-staffing-ratings-2026-data";

// viz-types: star-band grouped bars, turnover-vs-stars scatter, aide-HPRD
// composed chart, region dual bars, ownership bars, staffing-point budget bars
// | controls: panel, region filter, sort

type Panel =
  | "star-bands"
  | "state-scatter"
  | "aide-churn"
  | "regions"
  | "ownership"
  | "point-budget";

const COLORS = {
  nursing: "#0f4c5c",
  rn: "#e36414",
  stars: "#1b7f5a",
  aide: "#7c3aed",
  residualNeg: "#9f1239",
  residualPos: "#0e7490",
  grid: "#e2e8f0",
  muted: "#64748b",
};

const PANEL_LABELS: { id: Panel; label: string }[] = [
  { id: "star-bands", label: "Star bands" },
  { id: "state-scatter", label: "State scatter" },
  { id: "aide-churn", label: "Aide vs churn" },
  { id: "regions", label: "Regions" },
  { id: "ownership", label: "Ownership" },
  { id: "point-budget", label: "Point budget" },
];

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "turnover", label: "Sort: turnover" },
  { id: "stars", label: "Sort: stars" },
  { id: "aide", label: "Sort: aide HPRD" },
  { id: "residual", label: "Sort: residual" },
];

function fmtPct(n: number) {
  return `${n.toFixed(1)}%`;
}

function fmtStars(n: number) {
  return `${n.toFixed(2)}★`;
}

export function NurseAideTurnoverVersusFiveStarStaffingRatings2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("star-bands");
  const [region, setRegion] = useState<RegionFilter>("All");
  const [sort, setSort] = useState<SortKey>("turnover");

  const states = useMemo(
    () => filterStates(region, sort),
    [region, sort],
  );

  const scatterData = useMemo(
    () =>
      states.map((r) => ({
        ...r,
        x: r.nursingTurnoverPct,
        y: r.staffingStars,
        z: r.facilities,
      })),
    [states],
  );

  const aideChurn = useMemo(
    () =>
      [...states]
        .sort((a, b) => b.nursingTurnoverPct - a.nursingTurnoverPct)
        .slice(0, 18)
        .map((r) => ({
          state: r.state,
          turnover: r.nursingTurnoverPct,
          aideHprd: r.aideHprd,
          stars: r.staffingStars,
        })),
    [states],
  );

  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      data-viz="nurse-aide-turnover-versus-five-star-staffing-ratings-2026"
    >
      <div className="border-b border-slate-200 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 px-4 py-5 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-wider text-teal-200/80">
          CMS PBJ · Care Compare staffing domain
        </p>
        <h3 className="mt-1 text-lg font-semibold text-white sm:text-xl">
          Turnover vs staffing stars
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          Nurse-aide–heavy nursing staff turnover averages{" "}
          <span className="font-semibold text-teal-200">
            {HEADLINE.nationalNursingTurnoverPct}%
          </span>{" "}
          nationally. Homes rated 1★ average{" "}
          <span className="font-semibold text-orange-300">
            {HEADLINE.turnoverAt1StarPct}%
          </span>{" "}
          churn versus{" "}
          <span className="font-semibold text-emerald-300">
            {HEADLINE.turnoverAt5StarPct}%
          </span>{" "}
          at 5★ — a {HEADLINE.starSpreadPp} pp gap. State means correlate{" "}
          r={HEADLINE.stateCorrR} with staffing-domain stars.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-300">
          <span className="rounded-md bg-white/10 px-2.5 py-1">
            {HEADLINE.reportingHomes.toLocaleString()} reporting homes
          </span>
          <span className="rounded-md bg-white/10 px-2.5 py-1">
            Aide HPRD ~{HEADLINE.nationalAideHprd}
          </span>
          <span className="rounded-md bg-white/10 px-2.5 py-1">
            {HEADLINE.highTurnoverState} {HEADLINE.highTurnoverPct}% ·{" "}
            {HEADLINE.lowTurnoverState} {HEADLINE.lowTurnoverPct}%
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-wrap gap-1.5">
          {PANEL_LABELS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPanel(p.id)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                panel === p.id
                  ? "bg-teal-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as RegionFilter)}
            className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700"
            aria-label="Region filter"
          >
            {REGION_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r === "All" ? "All regions" : r}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700"
            aria-label="Sort states"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6">
        {panel === "star-bands" && (
          <div>
            <p className="mb-3 text-sm font-medium text-slate-800">
              1★ homes 54.7% vs 5★ 37.5%
            </p>
            <p className="mb-4 text-xs text-slate-500">
              Mean nursing and RN turnover by overall CMS star band (
              {STATE_PANEL.length} states in panel; facility bins from CMS
              Provider Information).
            </p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...STAR_BAND_TURNOVER]}>
                  <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    domain={[30, 60]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      fmtPct(Number(v ?? 0)),
                      name === "nursingTurnoverPct"
                        ? "Nursing turnover"
                        : "RN turnover",
                    ]}
                    labelFormatter={(l) => `${l} homes`}
                  />
                  <Legend />
                  <Bar
                    dataKey="nursingTurnoverPct"
                    name="Nursing turnover"
                    fill={COLORS.nursing}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="rnTurnoverPct"
                    name="RN turnover"
                    fill={COLORS.rn}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {panel === "state-scatter" && (
          <div>
            <p className="mb-3 text-sm font-medium text-slate-800">
              Turnover vs staffing stars
            </p>
            <p className="mb-4 text-xs text-slate-500">
              State means: nursing staff turnover (x) vs mean staffing-domain
              stars (y). Bubble size ≈ facility count. Filter/sort apply.
            </p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 4 }}>
                  <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Turnover"
                    unit="%"
                    domain={[34, 58]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Nursing turnover %",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Stars"
                    domain={[2.1, 3.7]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Staffing ★",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[40, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ payload }) => {
                      const d = payload?.[0]?.payload;
                      if (!d) return null;
                      return (
                        <div className="rounded border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                          <p className="font-semibold text-slate-800">
                            {d.name}
                          </p>
                          <p>Turnover {fmtPct(d.nursingTurnoverPct)}</p>
                          <p>Staffing {fmtStars(d.staffingStars)}</p>
                          <p>Aide HPRD {d.aideHprd.toFixed(2)}</p>
                          <p>Residual {d.residual > 0 ? "+" : ""}
                            {d.residual}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={scatterData} fill={COLORS.nursing}>
                    {scatterData.map((d) => (
                      <Cell
                        key={d.state}
                        fill={
                          d.residual < -0.15
                            ? COLORS.residualNeg
                            : d.residual > 0.15
                              ? COLORS.residualPos
                              : COLORS.nursing
                        }
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              State scatter residual map — teal = stars above turnover
              prediction; crimson = below.
            </p>
          </div>
        )}

        {panel === "aide-churn" && (
          <div>
            <p className="mb-3 text-sm font-medium text-slate-800">
              Aide HPRD vs churn
            </p>
            <p className="mb-4 text-xs text-slate-500">
              Top churn states in the current filter: bars = nursing turnover;
              line = nurse aide HPRD.
            </p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={aideChurn}>
                  <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="state" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11 }}
                    domain={[30, 60]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    domain={[1.5, 3.6]}
                    tickFormatter={(v) => v.toFixed(1)}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="turnover"
                    name="Nursing turnover %"
                    fill={COLORS.nursing}
                    radius={[3, 3, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="aideHprd"
                    name="Aide HPRD"
                    stroke={COLORS.aide}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {panel === "regions" && (
          <div>
            <p className="mb-3 text-sm font-medium text-slate-800">
              Census-weighted regional means
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={REGION_AGG}>
                  <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="region" tick={{ fontSize: 12 }} />
                  <YAxis
                    yAxisId="t"
                    tick={{ fontSize: 11 }}
                    domain={[40, 52]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    yAxisId="s"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    domain={[2.4, 3.4]}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="t"
                    dataKey="nursingTurnoverPct"
                    name="Nursing turnover %"
                    fill={COLORS.nursing}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="s"
                    type="monotone"
                    dataKey="staffingStars"
                    name="Staffing ★"
                    stroke={COLORS.stars}
                    strokeWidth={2.5}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {panel === "ownership" && (
          <div>
            <p className="mb-3 text-sm font-medium text-slate-800">
              Ownership and churn
            </p>
            <p className="mb-4 text-xs text-slate-500">
              For-profit homes average {OWNERSHIP_TURNOVER[0].nursingTurnoverPct}
              % nursing turnover versus {OWNERSHIP_TURNOVER[2].nursingTurnoverPct}
              % at nonprofits (CMS Provider Information).
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...OWNERSHIP_TURNOVER]} layout="vertical">
                  <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    domain={[35, 50]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="ownership"
                    width={90}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                  <Legend />
                  <Bar
                    dataKey="nursingTurnoverPct"
                    name="Nursing turnover"
                    fill={COLORS.nursing}
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="rnTurnoverPct"
                    name="RN turnover"
                    fill={COLORS.rn}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {panel === "point-budget" && (
          <div>
            <p className="mb-3 text-sm font-medium text-slate-800">
              Staffing-domain point budget (380 pts)
            </p>
            <p className="mb-4 text-xs text-slate-500">
              Turnover measures are 130 of 380 staffing points — so star
              alignment with churn is partly by CMS design, not only correlation.
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...STAFFING_POINT_BUDGET]}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="component"
                    width={160}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${Number(v ?? 0)} pts (${(item?.payload as { sharePct?: number })?.sharePct ?? 0}%)`,
                      "Max points",
                    ]}
                  />
                  <Bar dataKey="maxPoints" name="Max points" radius={[0, 4, 4, 0]}>
                    {STAFFING_POINT_BUDGET.map((row) => (
                      <Cell
                        key={row.component}
                        fill={
                          row.component.toLowerCase().includes("turnover")
                            ? COLORS.rn
                            : COLORS.nursing
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 px-4 py-3 sm:px-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-1.5 pr-3 font-medium">State</th>
                <th className="py-1.5 pr-3 font-medium">Turnover</th>
                <th className="py-1.5 pr-3 font-medium">Staffing ★</th>
                <th className="py-1.5 pr-3 font-medium">Aide HPRD</th>
                <th className="py-1.5 font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              {DETAIL_TABLE.map((row) => (
                <tr
                  key={row.state}
                  className="border-b border-slate-50 text-slate-700"
                >
                  <td className="py-1.5 pr-3 font-medium">{row.state}</td>
                  <td className="py-1.5 pr-3">
                    {fmtPct(row.nursingTurnoverPct)}
                  </td>
                  <td className="py-1.5 pr-3">{fmtStars(row.staffingStars)}</td>
                  <td className="py-1.5 pr-3">{row.aideHprd.toFixed(2)}</td>
                  <td className="py-1.5 text-slate-500">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
          {SOURCE_NOTE}
        </p>
      </div>
    </div>
  );
}
