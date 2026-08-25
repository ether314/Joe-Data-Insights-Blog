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
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  COHORT_CURVES,
  DIVISION_COMPARE,
  DIVISIONS,
  HEADLINE,
  NATIONAL_ONE_YEAR,
  RELIEF_MARKERS,
  SECTOR_ONE_YEAR,
  SOURCE_NOTE,
  fmtPct,
  fmtPp,
  type DivisionId,
} from "@/data/survival-curves-of-pandemic-era-startups-2026-data";

// viz-types: survival curves, national path line, division delta bars, 2020×2022 scatter, sector ladder | layout: default
// smoke-marker: One-year survival share

type ViewId = "curves" | "path" | "deltas" | "scatter" | "sectors";
type MetricMode = "survival" | "exit";
type EraFilter = "all" | "pre" | "relief" | "post-relief";

const NAVY = "#0f172a";
const TEAL = "#0f766e";
const AMBER = "#d97706";
const ROSE = "#be123c";
const SLATE = "#64748b";
const SKY = "#0284c7";
const VIOLET = "#7c3aed";

const ERA_COLOR: Record<string, string> = {
  pre: SLATE,
  relief: TEAL,
  "post-relief": ROSE,
};

const CURVE_COLORS: Record<number, string> = {
  2018: SLATE,
  2019: SKY,
  2020: TEAL,
  2021: AMBER,
  2022: ROSE,
};

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
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="inline-flex flex-wrap rounded-lg border border-slate-200 bg-white p-0.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              value === o.id
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SurvivalCurvesOfPandemicEraStartups2026Dashboard() {
  const [view, setView] = useState<ViewId>("curves");
  const [metric, setMetric] = useState<MetricMode>("survival");
  const [era, setEra] = useState<EraFilter>("all");
  const [focusDivision, setFocusDivision] = useState<DivisionId | "ALL">("ALL");
  const [curveYears, setCurveYears] = useState<number[]>([2018, 2020, 2022]);

  const pathData = useMemo(() => {
    return NATIONAL_ONE_YEAR.filter((r) => era === "all" || r.era === era).map(
      (r) => ({
        ...r,
        value: metric === "survival" ? r.survivalPct : r.exitPct,
      }),
    );
  }, [era, metric]);

  const curveRows = useMemo(() => {
    const ages = [0, 1, 2, 3, 4, 5];
    return ages.map((ageYears) => {
      const row: Record<string, number | string> = { ageYears };
      for (const c of COHORT_CURVES) {
        if (!curveYears.includes(c.birthYear)) continue;
        const pt = c.points.find((p) => p.ageYears === ageYears);
        if (!pt) continue;
        row[`y${c.birthYear}`] =
          metric === "survival" ? pt.survivalPct : 100 - pt.survivalPct;
      }
      return row;
    });
  }, [curveYears, metric]);

  const deltaRows = useMemo(() => {
    let rows = [...DIVISION_COMPARE];
    if (focusDivision !== "ALL") {
      rows = rows.filter((r) => r.id === focusDivision);
    }
    return rows
      .map((r) => ({
        ...r,
        delta:
          metric === "survival"
            ? r.delta2022Vs2020
            : -r.delta2022Vs2020,
      }))
      .sort((a, b) => a.delta - b.delta);
  }, [focusDivision, metric]);

  const scatterData = useMemo(() => {
    return DIVISION_COMPARE.map((r) => ({
      ...r,
      x: r.y2020,
      y: r.y2022,
      z: Math.abs(r.delta2022Vs2020) * 40 + 40,
    }));
  }, []);

  const sectorRows = useMemo(() => {
    return SECTOR_ONE_YEAR.map((s) => ({
      ...s,
      drop: Math.round((s.y2020 - s.y2022) * 10) / 10,
      display2020: metric === "survival" ? s.y2020 : 100 - s.y2020,
      display2022: metric === "survival" ? s.y2022 : 100 - s.y2022,
    })).sort((a, b) => b.drop - a.drop);
  }, [metric]);

  function toggleCurveYear(y: number) {
    setCurveYears((prev) => {
      if (prev.includes(y)) {
        if (prev.length <= 1) return prev;
        return prev.filter((x) => x !== y);
      }
      return [...prev, y].sort();
    });
  }

  const yDomain: [number, number] =
    metric === "survival" ? [70, 102] : [0, 30];

  return (
    <div
      className="space-y-4"
      data-viz="survival-curves-of-pandemic-era-startups-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-4 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-200/90">
          One-year survival share
        </p>
        <p className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          {fmtPct(HEADLINE.oneYear2020Pct)} → {fmtPct(HEADLINE.oneYear2022Pct)}
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          National desk mean of Census-division 1-year establishment survival
          (BLS BED / TED). The 2020 birth cohort cleared{" "}
          {fmtPp(HEADLINE.lift2020VsBaselinePp)} above the 2017–19 baseline;
          the 2022 cohort sat {fmtPp(-HEADLINE.shortfall2022VsBaselinePp)}{" "}
          below it after the relief window closed.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
        <ToggleGroup
          label="Panel"
          value={view}
          onChange={setView}
          options={[
            { id: "curves", label: "Survival curves" },
            { id: "path", label: "National path" },
            { id: "deltas", label: "Division deltas" },
            { id: "scatter", label: "2020 × 2022" },
            { id: "sectors", label: "Sector ladder" },
          ]}
        />
        <ToggleGroup
          label="Metric"
          value={metric}
          onChange={setMetric}
          options={[
            { id: "survival", label: "Survival %" },
            { id: "exit", label: "Exit %" },
          ]}
        />
        {view === "path" ? (
          <ToggleGroup
            label="Era"
            value={era}
            onChange={setEra}
            options={[
              { id: "all", label: "All years" },
              { id: "pre", label: "Pre-pandemic" },
              { id: "relief", label: "Relief" },
              { id: "post-relief", label: "Post-relief" },
            ]}
          />
        ) : null}
        {view === "curves" ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Cohorts
            </span>
            {[2018, 2019, 2020, 2021, 2022].map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => toggleCurveYear(y)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  curveYears.includes(y)
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        ) : null}
        {view === "deltas" ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Division
            </span>
            <select
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm"
              value={focusDivision}
              onChange={(e) =>
                setFocusDivision(e.target.value as DivisionId | "ALL")
              }
            >
              <option value="ALL">All divisions</option>
              {DIVISIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {view === "curves" ? (
        <ChartCard
          title="Survival curves by birth cohort"
          subtitle="Age 0 = 100%. Age 1 uses BED/TED national desk means; ages 2–5 apply historical conditional survival (modeled)."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={curveRows} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="ageYears"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  label={{
                    value: "Years since birth",
                    position: "insideBottom",
                    offset: -2,
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  domain={metric === "survival" ? [40, 100] : [0, 60]}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(v) => fmtPct(Number(v))}
                  labelFormatter={(l) => `Age ${l}`}
                />
                <Legend />
                {curveYears.map((y) => (
                  <Line
                    key={y}
                    type="monotone"
                    dataKey={`y${y}`}
                    name={`${y}`}
                    stroke={CURVE_COLORS[y]}
                    strokeWidth={y === 2020 || y === 2022 ? 2.75 : 1.75}
                    dot={{ r: 3 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "path" ? (
        <ChartCard
          title="National one-year path"
          subtitle="Unweighted mean of nine Census divisions. Vertical markers flag PPP/ERC relief milestones."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={pathData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="birthYear" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis
                  domain={yDomain}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(v) => fmtPct(Number(v))}
                  labelFormatter={(l) => `${l} births`}
                />
                <ReferenceLine
                  y={
                    metric === "survival"
                      ? HEADLINE.oneYearBaseline2017_19Pct
                      : 100 - HEADLINE.oneYearBaseline2017_19Pct
                  }
                  stroke={VIOLET}
                  strokeDasharray="4 4"
                  label={{
                    value: "2017–19 baseline",
                    fill: VIOLET,
                    fontSize: 11,
                    position: "insideTopRight",
                  }}
                />
                {RELIEF_MARKERS.map((m) => (
                  <ReferenceLine
                    key={m.label}
                    x={m.year}
                    stroke={m.kind === "end" ? ROSE : TEAL}
                    strokeDasharray="3 3"
                  />
                ))}
                <Bar dataKey="value" name={metric === "survival" ? "1-yr survival" : "1-yr exit"} radius={[4, 4, 0, 0]}>
                  {pathData.map((r) => (
                    <Cell key={r.birthYear} fill={ERA_COLOR[r.era]} />
                  ))}
                </Bar>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={NAVY}
                  strokeWidth={2}
                  dot={false}
                  legendType="none"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
            {RELIEF_MARKERS.map((m) => (
              <li key={m.label}>
                <span className="font-semibold text-slate-800">{m.year}:</span>{" "}
                {m.label}
              </li>
            ))}
          </ul>
        </ChartCard>
      ) : null}

      {view === "deltas" ? (
        <ChartCard
          title="Division deltas: 2022 minus 2020"
          subtitle="Most divisions lost ground after the relief-elevated 2020 cohort. Pacific’s 2021 spike is the main outlier on the path."
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={deltaRows}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(v) => `${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={72}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v) => fmtPp(Number(v))}
                  labelFormatter={(l) => String(l)}
                />
                <ReferenceLine x={0} stroke={NAVY} />
                <Bar dataKey="delta" name="2022 − 2020 (pp)" radius={[0, 4, 4, 0]}>
                  {deltaRows.map((r) => (
                    <Cell
                      key={r.id}
                      fill={r.delta < 0 ? ROSE : TEAL}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "scatter" ? (
        <ChartCard
          title="2020 × 2022 one-year survival by division"
          subtitle="Points below the diagonal lost survival share after the relief cohort. Bubble size scales with |Δ|."
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="2020"
                  domain={[74, 86]}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  label={{
                    value: "2020 one-year survival %",
                    position: "insideBottom",
                    offset: -4,
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="2022"
                  domain={[72, 86]}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  label={{
                    value: "2022 %",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload as (typeof scatterData)[0];
                    if (!d) return null;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
                        <p className="font-semibold text-slate-900">{d.name}</p>
                        <p>2020: {fmtPct(d.y2020)}</p>
                        <p>2022: {fmtPct(d.y2022)}</p>
                        <p>Δ: {fmtPp(d.delta2022Vs2020)}</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine
                  segment={[
                    { x: 74, y: 74 },
                    { x: 86, y: 86 },
                  ]}
                  stroke={SLATE}
                  strokeDasharray="4 4"
                />
                <Scatter data={scatterData} fill={TEAL}>
                  {scatterData.map((r) => (
                    <Cell
                      key={r.id}
                      fill={r.delta2022Vs2020 < 0 ? ROSE : TEAL}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "sectors" ? (
        <ChartCard
          title="Sector ladder — relief lift then post-relief drop"
          subtitle="All-private row is the TED desk mean. Sector rows are modeled spreads around that path (not microdata)."
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sectorRows}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  domain={metric === "survival" ? [70, 86] : [14, 30]}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="sector"
                  width={120}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                />
                <Tooltip formatter={(v) => fmtPct(Number(v))} />
                <Legend />
                <Bar
                  dataKey="display2020"
                  name="2020"
                  fill={TEAL}
                  radius={[0, 2, 2, 0]}
                />
                <Bar
                  dataKey="display2022"
                  name="2022"
                  fill={ROSE}
                  radius={[0, 2, 2, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
