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
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  ANNUAL_SNAPSHOTS,
  FY2025_MILESTONE_LADDER,
  FY2025_NEW_START_LEAD,
  FY2025_PIPELINE,
  FY2025_SPLIT,
  HEADLINE,
  SAA_STATUS,
  SOURCE_NOTE,
  SOURCES,
  VIZ_MARKERS,
  dualAxisSeries,
  fmtInt,
  fmtPct,
  fmtUsdM,
  stackedSplitRows,
} from "@/data/npl-sites-with-construction-complete-versus-remaining-construction-2026-data";

// viz-types: split pie, stacked area CC vs remaining, dual-axis RAPC+sitewide,
// horizontal pipeline bars, scatter remaining vs CC share, lead-mix bars
// | controls: panel, year window

type PanelId =
  | "split"
  | "stack"
  | "pace"
  | "pipeline"
  | "scatter"
  | "leads"
  | "ladder";

const PANEL_OPTIONS: { id: PanelId; label: string }[] = [
  { id: "split", label: "FY25 split" },
  { id: "stack", label: "CC vs remaining" },
  { id: "pace", label: "RAPC vs sitewide" },
  { id: "pipeline", label: "Pipeline bands" },
  { id: "scatter", label: "Remaining vs share" },
  { id: "leads", label: "New-start leads" },
  { id: "ladder", label: "Milestone ladder" },
];

type YearWindow = "all" | "recent";

const YEAR_OPTIONS: { id: YearWindow; label: string }[] = [
  { id: "all", label: "FY2019–FY2025" },
  { id: "recent", label: "FY2022–FY2025" },
];

const GRID = "#e2e8f0";
const NAVY = "#0f172a";

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function ToggleGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = opt.id === value;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={
                active
                  ? "rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white"
                  : "rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GlanceStrip() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border border-teal-200 bg-teal-50/60 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
          On-final CC share
        </p>
        <p className="mt-1 text-2xl font-bold text-teal-950">
          {fmtPct(HEADLINE.onFinalCcSharePct)}
        </p>
        <p className="mt-0.5 text-xs text-teal-800/80">
          {fmtInt(HEADLINE.onFinalCcEst)} of {fmtInt(HEADLINE.finalNplFy2025)} final
        </p>
      </div>
      <div className="rounded-lg border border-orange-200 bg-orange-50/60 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-orange-900">
          Still building
        </p>
        <p className="mt-1 text-2xl font-bold text-orange-950">
          {fmtInt(HEADLINE.remainingConstructionEst)}
        </p>
        <p className="mt-0.5 text-xs text-orange-900/80">
          {fmtPct(HEADLINE.remainingSharePct)} of final NPL
        </p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          Sitewide CC in FY2025
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900">
          {HEADLINE.sitewideCcFy2025}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          vs {HEADLINE.rapcFy2025} RAPC project completions
        </p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          Construction $ obligated
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900">
          {fmtUsdM(HEADLINE.constructionObligationsFy2025UsdM)}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          IIJA + taxes + appropriations + special accounts
        </p>
      </div>
    </div>
  );
}

export function NplSitesWithConstructionCompleteVersusRemainingConstruction2026Dashboard() {
  const [panel, setPanel] = useState<PanelId>("split");
  const [yearWindow, setYearWindow] = useState<YearWindow>("all");

  const fromFy = yearWindow === "recent" ? 2022 : 2019;

  const dual = useMemo(() => dualAxisSeries(fromFy), [fromFy]);
  const stacked = useMemo(() => stackedSplitRows(fromFy), [fromFy]);
  const scatter = useMemo(
    () =>
      ANNUAL_SNAPSHOTS.filter((r) => r.fy >= fromFy).map((r) => ({
        fy: r.fy,
        label: r.label,
        remaining: r.remainingConstructionEst,
        ccSharePct: r.onFinalCcSharePct,
        sitewideCc: r.sitewideCcAnnual,
      })),
    [fromFy],
  );

  return (
    <div
      className="space-y-5"
      data-viz="npl-sites-with-construction-complete-versus-remaining-construction-2026"
    >
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-900">{VIZ_MARKERS[0]}</p>
        <p className="text-sm text-slate-600">
          {VIZ_MARKERS[1]} · {VIZ_MARKERS[3]}
        </p>
      </div>

      <GlanceStrip />

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={panel}
          options={PANEL_OPTIONS}
          onChange={setPanel}
        />
        <ToggleGroup
          label="Year window"
          value={yearWindow}
          options={YEAR_OPTIONS}
          onChange={setYearWindow}
        />
      </div>

      {panel === "split" ? (
        <ChartCard
          title={VIZ_MARKERS[0]}
          subtitle={`Estimated split of ${fmtInt(HEADLINE.finalNplFy2025)} final NPL sites at end FY2025`}
        >
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={FY2025_SPLIT}
                    dataKey="sites"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={96}
                    paddingAngle={2}
                    label={(props) => {
                      const pct = (props as { sharePct?: number }).sharePct;
                      return pct != null ? fmtPct(pct) : "";
                    }}
                  >
                    {FY2025_SPLIT.map((s) => (
                      <Cell key={s.id} fill={s.color} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => fmtInt(Number(v))}
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.label ?? "")
                    }
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-teal-800">
                  {fmtInt(HEADLINE.onFinalCcEst)} sites ({fmtPct(HEADLINE.onFinalCcSharePct)})
                </span>{" "}
                on the final NPL are estimated to have reached sitewide construction
                completion — physical remedies built, even if groundwater treatment
                still runs for years.
              </p>
              <p>
                <span className="font-semibold text-orange-900">
                  {fmtInt(HEADLINE.remainingConstructionEst)} sites (
                  {fmtPct(HEADLINE.remainingSharePct)})
                </span>{" "}
                still have unfinished remedial construction somewhere on the property.
                That is the backlog the headline asks about.
              </p>
              <p className="text-xs text-slate-500">
                Cumulative NPL CC {fmtInt(HEADLINE.cumulativeCcNplFy2025)} − deleted{" "}
                {fmtInt(HEADLINE.deletedNplFy2025)} ≈ on-final CC. SAA sites (
                {SAA_STATUS[0].sites} active / {SAA_STATUS[1].sites} CC) sit outside
                the final-NPL split.
              </p>
            </div>
          </div>
        </ChartCard>
      ) : null}

      {panel === "stack" ? (
        <ChartCard
          title="Construction-complete vs remaining on the final NPL"
          subtitle="Stacked site counts; line = on-final CC share"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={stacked} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: NAVY, fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: NAVY, fontSize: 12 }}
                  tickFormatter={(v) => fmtInt(Number(v))}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[55, 62]}
                  tick={{ fill: NAVY, fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="constructionComplete"
                  name="Construction complete"
                  stackId="a"
                  fill="#99f6e4"
                  stroke="#0d9488"
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="remainingConstruction"
                  name="Remaining construction"
                  stackId="a"
                  fill="#fed7aa"
                  stroke="#c2410c"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ccSharePct"
                  name="CC share %"
                  stroke="#0f172a"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-500">{VIZ_MARKERS[3]}</p>
        </ChartCard>
      ) : null}

      {panel === "pace" ? (
        <ChartCard
          title={VIZ_MARKERS[2]}
          subtitle="Bars = RAPC project completions; line = sitewide construction completions"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dual} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: NAVY, fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: NAVY, fontSize: 12 }}
                  tickFormatter={(v) => fmtInt(Number(v))}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: NAVY, fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="rapc"
                  name="RAPC projects completed"
                  fill="#0369a1"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="sitewideCc"
                  name="Sitewide CC (sites)"
                  stroke="#c2410c"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            FY2025 finished{" "}
            <span className="font-semibold">{HEADLINE.rapcFy2025} remedial construction
            projects</span>{" "}
            but only{" "}
            <span className="font-semibold">
              {HEADLINE.sitewideCcFy2025} sitewide construction completion
            </span>
            . Many NPL sites need multiple RAPCs before the entire property clears the
            construction-complete milestone.
          </p>
        </ChartCard>
      ) : null}

      {panel === "pipeline" ? (
        <ChartCard
          title="FY2025 construction pipeline bands"
          subtitle="Sites and projects on different scales — read labels carefully"
        >
          <div className="h-[22rem] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={FY2025_PIPELINE}
                margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
              >
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fill: NAVY, fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={168}
                  tick={{ fill: NAVY, fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v, _n, item) => {
                    const unit = (item?.payload as { unit?: string })?.unit;
                    const n = Number(v);
                    if (unit === "usdM") return fmtUsdM(n);
                    return fmtInt(n);
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {FY2025_PIPELINE.map((b) => (
                    <Cell key={b.id} fill={b.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "scatter" ? (
        <ChartCard
          title="Remaining construction vs on-final CC share"
          subtitle="Bubble size ≈ annual sitewide completions"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="remaining"
                  name="Remaining"
                  tick={{ fill: NAVY, fontSize: 12 }}
                  domain={["dataMin - 5", "dataMax + 5"]}
                  label={{
                    value: "Remaining construction (sites)",
                    position: "insideBottom",
                    offset: -2,
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="ccSharePct"
                  name="CC share"
                  domain={[58, 60]}
                  tick={{ fill: NAVY, fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  label={{
                    value: "On-final CC share",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="sitewideCc" range={[60, 220]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => {
                    if (name === "ccSharePct") return fmtPct(Number(v));
                    return fmtInt(Number(v));
                  }}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.label ?? "")
                  }
                />
                <Scatter data={scatter} fill="#0d9488" name="Fiscal years" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Remaining construction has hovered near 540–555 final sites while the
            construction-complete share stayed within about one percentage point of 59%.
          </p>
        </ChartCard>
      ) : null}

      {panel === "leads" ? (
        <ChartCard
          title="Who started remedial construction in FY2025"
          subtitle={`${HEADLINE.newConstructionStartsFy2025} new project starts by lead type`}
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FY2025_NEW_START_LEAD}>
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fill: NAVY, fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fill: NAVY, fontSize: 12 }} />
                  <Tooltip formatter={(v) => fmtInt(Number(v))} />
                  <Bar dataKey="starts" name="New starts" radius={[4, 4, 0, 0]}>
                    {FY2025_NEW_START_LEAD.map((r) => (
                      <Cell key={r.id} fill={r.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SAA_STATUS}
                    dataKey="sites"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={(props) => {
                      const sites = (props as { sites?: number }).sites;
                      return sites != null ? fmtInt(sites) : "";
                    }}
                  >
                    {SAA_STATUS.map((s) => (
                      <Cell key={s.id} fill={s.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtInt(Number(v))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Right: Superfund Alternative Approach agreements (outside classic NPL
            listing) — {SAA_STATUS[0].sites} still remediating, {SAA_STATUS[1].sites}{" "}
            already construction complete.
          </p>
        </ChartCard>
      ) : null}

      {panel === "ladder" ? (
        <ChartCard
          title="FY2025 milestone ladder"
          subtitle="From proposed listing through deletion — construction sits in the middle"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={FY2025_MILESTONE_LADDER}
                margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
              >
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fill: NAVY, fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="stage"
                  width={200}
                  tick={{ fill: NAVY, fontSize: 11 }}
                />
                <Tooltip formatter={(v) => fmtInt(Number(v))} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {FY2025_MILESTONE_LADDER.map((r) => (
                    <Cell key={r.stage} fill={r.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      <footer className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <p>{SOURCE_NOTE}</p>
        <ul className="flex flex-wrap gap-x-3 gap-y-1">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-700 underline-offset-2 hover:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
