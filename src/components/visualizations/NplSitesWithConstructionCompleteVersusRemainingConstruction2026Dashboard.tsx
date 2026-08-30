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
  ANNUAL_SITEWIDE_CC,
  CONSTRUCTION_ACTIVITY,
  DENOMINATOR_OPTIONS,
  HEADLINE,
  IIJA_CONTEXT,
  MILESTONE_COMPARE,
  PIPELINE_STAGES,
  SAA_STATUS,
  SOURCE_NOTE,
  SPLIT_ROWS,
  VIEW_OPTIONS,
  shareUnderDenominator,
  type DenominatorMode,
  type ViewMode,
} from "@/data/npl-sites-with-construction-complete-versus-remaining-construction-2026-data";

const COLORS = {
  cc: "#0f766e",
  remaining: "#c2410c",
  project: "#0369a1",
  sitewide: "#7c2d12",
  heuc: "#4f46e5",
  gmi: "#0891b2",
  swrau: "#ca8a04",
  deleted: "#64748b",
  grid: "#e2e8f0",
  saaActive: "#b45309",
  saaCc: "#0d9488",
  area: "#134e4a",
};

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      <div className="mt-3 h-72 w-full">{children}</div>
    </div>
  );
}

export function NplSitesWithConstructionCompleteVersusRemainingConstruction2026Dashboard() {
  const [view, setView] = useState<ViewMode>("final-split");
  const [denom, setDenom] = useState<DenominatorMode>("final");
  const [showProjects, setShowProjects] = useState(true);
  const [yearFrom, setYearFrom] = useState(2015);

  const share = useMemo(() => shareUnderDenominator(denom), [denom]);

  const annualFiltered = useMemo(
    () => ANNUAL_SITEWIDE_CC.filter((r) => r.fiscalYear >= yearFrom),
    [yearFrom],
  );

  const activityScatter = useMemo(
    () =>
      CONSTRUCTION_ACTIVITY.filter((r) => r.fiscalYear >= yearFrom).map((r) => ({
        ...r,
        x: r.projectCompletions,
        y: r.siteWideCc,
        z: r.starts || 40,
      })),
    [yearFrom],
  );

  const pieData = useMemo(() => {
    const complete = Math.max(0, share.complete);
    const remaining = Math.max(0, share.remaining);
    return [
      { name: "Construction complete", value: complete, fill: COLORS.cc },
      { name: "Remaining / unfinished", value: remaining, fill: COLORS.remaining },
    ];
  }, [share]);

  const funnelData = useMemo(
    () =>
      PIPELINE_STAGES.map((s) => ({
        name: s.label,
        value: s.value,
        fill:
          s.id === "remaining"
            ? COLORS.remaining
            : s.id === "sitewide-cc-fy"
              ? COLORS.sitewide
              : s.id === "project-complete-fy"
                ? COLORS.project
                : COLORS.cc,
      })),
    [],
  );

  return (
    <div
      className="space-y-4"
      data-viz="npl-sites-with-construction-complete-versus-remaining-construction-2026"
    >
      <div className="rounded-xl border border-teal-800/20 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-5 text-slate-100">
        <p className="text-xs font-medium uppercase tracking-wide text-teal-300/90">
          Construction-complete share of NPL
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          {HEADLINE.constructionCompleteSharePct}% of final NPL sites are
          construction-complete
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          {HEADLINE.constructionCompleteOnFinal.toLocaleString()} sites on the
          final list have finished physical construction;{" "}
          {HEADLINE.remainingConstruction.toLocaleString()} still have unfinished
          construction. FY 2025 added only {HEADLINE.fy2025SiteWideCc} site-wide
          completion against {HEADLINE.fy2025ProjectCompletions} remedial project
          completions.
        </p>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
          {/* smoke-marker: Construction-complete share of final NPL */}
          Construction-complete share of final NPL · derived from EPA cumulative
          CC stock minus deleted sites
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500">Panel</span>
        {VIEW_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setView(opt.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              view === opt.id
                ? "bg-teal-800 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500">Denominator</span>
        {DENOMINATOR_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setDenom(opt.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              denom === opt.id
                ? "bg-orange-700 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
        <label className="ml-2 flex items-center gap-1.5 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={showProjects}
            onChange={(e) => setShowProjects(e.target.checked)}
            className="rounded border-slate-300"
          />
          Show project completions on annual chart
        </label>
        <label className="flex items-center gap-1.5 text-xs text-slate-600">
          From FY
          <select
            value={yearFrom}
            onChange={(e) => setYearFrom(Number(e.target.value))}
            className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-xs"
          >
            {[2015, 2018, 2020, 2022].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-xs text-slate-500">
        Active frame: {share.note} →{" "}
        <span className="font-semibold text-teal-800">
          {share.completePct.toFixed(1)}%
        </span>{" "}
        complete ({share.complete.toLocaleString()} / {share.denom.toLocaleString()}
        ).
      </p>

      {view === "final-split" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Final NPL construction status"
            subtitle="Donut of construction-complete vs remaining under the selected denominator"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={95}
                  paddingAngle={2}
                  label={({ name, percent }) =>
                    `${name?.split(" ")[0]} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) =>
                    typeof v === "number" ? v.toLocaleString() : String(v)
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Absolute site counts"
            subtitle="Paired horizontal bars — complete vs unfinished under selected frame"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={pieData}
                margin={{ left: 24, right: 16 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={130}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {pieData.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {view === "pipeline" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Cleanup pipeline stages"
            subtitle="Final roster → CC-on-final → remaining → FY25 project vs site-wide completions"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ bottom: 48 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-28}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 10 }}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {funnelData.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="IIJA construction funding context"
            subtitle={`$${IIJA_CONTEXT.authorizationBb}B authorization; $${IIJA_CONTEXT.obligatedThroughFy2024Bb}B obligated through FY24 at ${IIJA_CONTEXT.sitesFundedThroughFy2024} sites`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    label: "IIJA authorization",
                    bb: IIJA_CONTEXT.authorizationBb,
                  },
                  {
                    label: "Obligated thru FY24",
                    bb: IIJA_CONTEXT.obligatedThroughFy2024Bb,
                  },
                  {
                    label: "FY25 construction $ (B)",
                    bb: IIJA_CONTEXT.fy2025ConstructionObligatedM / 1000,
                  },
                ]}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "$ billions",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 10 },
                  }}
                />
                <Tooltip
                  formatter={(v) =>
                    typeof v === "number" ? `$${v.toFixed(2)}B` : String(v)
                  }
                />
                <Bar dataKey="bb" fill={COLORS.project} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {view === "annual" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Annual site-wide construction completions"
            subtitle="EPA accomplishment metrics — site-wide CC has slowed even as project completions stay high"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={annualFiltered}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="fiscalYear" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                {showProjects && (
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                  />
                )}
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="annualCc"
                  name="Site-wide CC"
                  fill={COLORS.sitewide}
                  radius={[3, 3, 0, 0]}
                />
                {showProjects && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="projectCompletions"
                    name="Project completions"
                    stroke={COLORS.project}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Cumulative construction-complete stock"
            subtitle="Running total of NPL sites that ever reached site-wide construction completion"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={annualFiltered}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="fiscalYear" tick={{ fontSize: 11 }} />
                <YAxis
                  domain={["dataMin - 20", "dataMax + 10"]}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="cumulativeCc"
                  name="Cumulative CC"
                  stroke={COLORS.area}
                  fill={COLORS.cc}
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {view === "activity" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Project completions vs site-wide CC"
            subtitle="Scatter: many OU-level project finishes buy few whole-site construction completions"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Project completions"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Remedial project completions",
                    position: "insideBottom",
                    offset: -2,
                    style: { fontSize: 10 },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Site-wide CC"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Site-wide CC",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 10 },
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => [v, String(name)]}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload;
                    return p ? `FY ${p.fiscalYear}` : "";
                  }}
                />
                <Scatter data={activityScatter} fill={COLORS.project}>
                  {activityScatter.map((d) => (
                    <Cell
                      key={d.fiscalYear}
                      fill={d.siteWideCc <= 2 ? COLORS.remaining : COLORS.cc}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Starts, oversight, and completions"
            subtitle="Recent FY construction activity (null starts omitted from bar)"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={CONSTRUCTION_ACTIVITY.filter((r) => r.fiscalYear >= yearFrom)}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="fiscalYear" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="starts"
                  name="New starts"
                  fill={COLORS.project}
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="priorYearOversight"
                  name="Prior-year oversight"
                  fill={COLORS.gmi}
                  radius={[3, 3, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="projectCompletions"
                  name="Project completions"
                  stroke={COLORS.sitewide}
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {view === "milestones" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Protection milestones vs construction stock"
            subtitle="Human exposure / groundwater control can precede or diverge from construction complete"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={[...MILESTONE_COMPARE]}
                margin={{ left: 8, right: 12 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={160}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {MILESTONE_COMPARE.map((m) => (
                    <Cell
                      key={m.id}
                      fill={
                        m.id === "cum-cc"
                          ? COLORS.cc
                          : m.id === "heuc"
                            ? COLORS.heuc
                            : m.id === "gmi"
                              ? COLORS.gmi
                              : m.id === "swrau"
                                ? COLORS.swrau
                                : COLORS.deleted
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Roster composition (end FY 2025)"
            subtitle="Proposed, final, and deleted — deletion is a later gate than construction complete"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Final", value: 1343, fill: COLORS.project },
                    { name: "Deleted", value: 459, fill: COLORS.deleted },
                    { name: "Proposed", value: 38, fill: COLORS.swrau },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  label
                >
                  <Cell fill={COLORS.project} />
                  <Cell fill={COLORS.deleted} />
                  <Cell fill={COLORS.swrau} />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {view === "saa" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Superfund Alternative Approach status"
            subtitle="SAA sites sit outside classic NPL listing but track the same construction-complete gate"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...SAA_STATUS]}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="sites" radius={[4, 4, 0, 0]}>
                  {SAA_STATUS.map((s) => (
                    <Cell
                      key={s.id}
                      fill={s.id === "active" ? COLORS.saaActive : COLORS.saaCc}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Headline split (fixed final-NPL frame)"
            subtitle="Reference bars that ignore the denominator control — always final-NPL derived"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...SPLIT_ROWS]}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="sites" radius={[4, 4, 0, 0]}>
                  {SPLIT_ROWS.map((r) => (
                    <Cell key={r.id} fill={r.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      <p className="text-[11px] leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
