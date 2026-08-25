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
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  AGE_BANDS,
  BIGGEST_MOVES,
  DEMO_GAPS,
  EXPANSION_COMPARE,
  HEADLINE,
  NATIONAL_VINTAGE,
  REGION_SUMMARY,
  SOURCE_NOTE,
  STATE_GAPS,
  VIZ_MARKERS,
  fmtPct,
  fmtPp,
  statesByExpansion,
  statesByRegion,
  type ExpansionStatus,
  type RegionId,
} from "@/data/health-insurance-coverage-gaps-census-2026-data";

// viz-types: national composed area+line, state ladder bars,
// unwinding delta scatter, expansion compare bars, age/demo bars,
// biggest-moves diverging | layout: default
// smoke-marker: Working-age uninsured — Texas 21.6%

type ViewId =
  | "vintage"
  | "ladder"
  | "scatter"
  | "expansion"
  | "ages"
  | "moves";

type RegionFilter = "all" | RegionId;
type ExpansionFilter = "all" | ExpansionStatus;
type LadderSort = "rate" | "delta" | "headcount";

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const SKY = "#0284c8";

const REGION_COLORS: Record<string, string> = {
  South: ROSE,
  Midwest: TEAL,
  West: AMBER,
  Northeast: INDIGO,
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
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            value === o.id
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function HealthInsuranceCoverageGapsCensus2026Dashboard() {
  const [view, setView] = useState<ViewId>("ladder");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [expansion, setExpansion] = useState<ExpansionFilter>("all");
  const [ladderSort, setLadderSort] = useState<LadderSort>("rate");

  const filtered = useMemo(() => {
    const byRegion = statesByRegion(region);
    if (expansion === "all") return byRegion;
    return byRegion.filter((s) => s.expansion === expansion);
  }, [region, expansion]);

  const ladderData = useMemo(() => {
    const rows = [...filtered];
    if (ladderSort === "rate") rows.sort((a, b) => b.rate2024 - a.rate2024);
    else if (ladderSort === "delta")
      rows.sort((a, b) => b.deltaPp - a.deltaPp);
    else rows.sort((a, b) => b.uninsuredM - a.uninsuredM);
    return rows.slice(0, 25).map((s) => ({
      ...s,
      fill:
        s.expansion === "non-expansion"
          ? ROSE
          : REGION_COLORS[s.region] || TEAL,
      label: s.abbr,
    }));
  }, [filtered, ladderSort]);

  const scatterData = useMemo(
    () =>
      filtered.map((s) => ({
        ...s,
        x: s.rate2023,
        y: s.deltaPp,
        z: Math.max(40, Math.min(320, s.uninsuredM * 60)),
        fill:
          s.expansion === "non-expansion"
            ? ROSE
            : REGION_COLORS[s.region] || TEAL,
      })),
    [filtered],
  );

  const movesData = useMemo(
    () =>
      BIGGEST_MOVES.map((m) => ({
        ...m,
        fill: m.direction === "up" ? ROSE : TEAL,
      })),
    [],
  );

  return (
    <div
      className="w-full min-w-0 space-y-4"
      data-viz="health-insurance-coverage-gaps-census-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-4 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
          Census ACS · working-age adults 19–64
        </p>
        <p className="mt-1 text-lg font-bold sm:text-xl">
          {VIZ_MARKERS[0]} · national {fmtPct(HEADLINE.usWorkingAge2024)}
        </p>
        <p className="mt-1 text-sm text-slate-300">
          {VIZ_MARKERS[1]} · {VIZ_MARKERS[2]} ·{" "}
          {HEADLINE.statesSigIncrease} jurisdictions rose significantly after
          Medicaid continuous enrollment ended; {HEADLINE.statesSigDecrease}{" "}
          fell. Non-expansion tape still clears near {fmtPct(16.8)}.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup<ViewId>
          value={view}
          onChange={setView}
          options={[
            { id: "ladder", label: "State ladder" },
            { id: "scatter", label: "Unwinding delta" },
            { id: "vintage", label: "National path" },
            { id: "expansion", label: "Expansion gap" },
            { id: "ages", label: "Age & race" },
            { id: "moves", label: "Biggest movers" },
          ]}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <ToggleGroup<RegionFilter>
          value={region}
          onChange={setRegion}
          options={[
            { id: "all", label: "All regions" },
            { id: "South", label: "South" },
            { id: "Midwest", label: "Midwest" },
            { id: "West", label: "West" },
            { id: "Northeast", label: "Northeast" },
          ]}
        />
        <ToggleGroup<ExpansionFilter>
          value={expansion}
          onChange={setExpansion}
          options={[
            { id: "all", label: "All expansion" },
            { id: "expanded", label: "Expanded" },
            { id: "non-expansion", label: "Non-expansion" },
          ]}
        />
        {view === "ladder" && (
          <ToggleGroup<LadderSort>
            value={ladderSort}
            onChange={setLadderSort}
            options={[
              { id: "rate", label: "Sort by rate" },
              { id: "delta", label: "Sort by delta" },
              { id: "headcount", label: "Sort by headcount" },
            ]}
          />
        )}
      </div>

      {view === "ladder" && (
        <ChartCard
          title="State ladder vs national 11.3%"
          subtitle="ACS working-age (19–64) uninsured rate, 2024. Rose = non-expansion as of Jan 1, 2024."
        >
          <div className="h-[520px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ladderData}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  domain={[0, 24]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fill: SLATE, fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={36}
                  tick={{ fill: NAVY, fontSize: 11 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow">
                        <p className="font-semibold text-slate-900">{d.state}</p>
                        <p>2024: {fmtPct(d.rate2024)}</p>
                        <p>Δ 2023→24: {fmtPp(d.deltaPp)}</p>
                        <p>~{d.uninsuredM.toFixed(2)}M uninsured (est.)</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine
                  x={HEADLINE.usWorkingAge2024}
                  stroke={SKY}
                  strokeDasharray="4 4"
                  label={{
                    value: VIZ_MARKERS[1],
                    position: "insideTopRight",
                    fill: SKY,
                    fontSize: 10,
                  }}
                />
                <Bar dataKey="rate2024" radius={[0, 4, 4, 0]}>
                  {ladderData.map((row) => (
                    <Cell key={row.abbr} fill={row.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Unwinding delta scatter"
          subtitle="X = 2023 working-age rate; Y = 2023→2024 pp change. Bubble size ≈ estimated uninsured headcount."
        >
          <div className="h-[440px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 16, right: 24, left: 8, bottom: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="2023 rate"
                  unit="%"
                  domain={[2, 24]}
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: "2023 uninsured %",
                    position: "insideBottom",
                    offset: -4,
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="delta"
                  domain={[-1.8, 2.6]}
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: "pp change",
                    angle: -90,
                    position: "insideLeft",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[40, 320]} />
                <ReferenceLine y={0} stroke={SLATE} strokeDasharray="3 3" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow">
                        <p className="font-semibold">{d.state}</p>
                        <p>
                          {fmtPct(d.rate2023)} → {fmtPct(d.rate2024)} (
                          {fmtPp(d.deltaPp)})
                        </p>
                        <p>
                          {d.significant ? "Significant" : "Not significant"} @
                          90%
                        </p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatterData} name={VIZ_MARKERS[2]}>
                  {scatterData.map((row) => (
                    <Cell key={row.abbr} fill={row.fill} fillOpacity={0.85} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "vintage" && (
        <ChartCard
          title="National path through continuous enrollment"
          subtitle="Working-age uninsured % (left) vs Medicaid coverage share all ages (right). 2019–22 carried ACS context; 2023–24 disclosed ACSBR-024."
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={NATIONAL_VINTAGE}
                margin={{ top: 16, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  domain={[7, 14]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fill: SLATE, fontSize: 11 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[18, 23]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fill: SLATE, fontSize: 11 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow">
                        <p className="font-semibold">{d.year}</p>
                        <p>Working-age: {fmtPct(d.workingAgePct)}</p>
                        <p>All ages: {fmtPct(d.allAgesPct)}</p>
                        <p>Medicaid: {fmtPct(d.medicaidPct)}</p>
                        <p className="text-slate-500">{d.note}</p>
                      </div>
                    );
                  }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="workingAgePct"
                  name="Working-age uninsured %"
                  fill={TEAL}
                  fillOpacity={0.2}
                  stroke={TEAL}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="medicaidPct"
                  name="Medicaid share %"
                  stroke={AMBER}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "expansion" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Expansion gap"
            subtitle="Population-weighted desk means of ACS working-age rates by Jan 2024 expansion status."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={EXPANSION_COMPARE}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="group"
                    tick={{ fill: SLATE, fontSize: 10 }}
                    interval={0}
                    angle={-12}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis
                    domain={[0, 20]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: SLATE, fontSize: 11 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow">
                          <p className="font-semibold">{d.group}</p>
                          <p>{fmtPct(d.rate2024)}</p>
                          <p>{d.states} jurisdictions</p>
                          <p className="text-slate-500">{d.note}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="rate2024" radius={[6, 6, 0, 0]}>
                    {EXPANSION_COMPARE.map((row) => (
                      <Cell
                        key={row.group}
                        fill={
                          row.group.startsWith("Non")
                            ? ROSE
                            : row.group.startsWith("United")
                              ? SKY
                              : TEAL
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Regional means"
            subtitle="Simple unweighted mean of state working-age rates within Census region."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={REGION_SUMMARY}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="region" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    domain={[0, 16]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: SLATE, fontSize: 11 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow">
                          <p className="font-semibold">{d.region}</p>
                          <p>Mean rate: {fmtPct(d.meanRate2024)}</p>
                          <p>Mean Δ: {fmtPp(d.meanDeltaPp)}</p>
                          <p>
                            Above national: {d.statesAboveNational} · peak{" "}
                            {d.topState} {fmtPct(d.topRate)}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="meanRate2024" radius={[6, 6, 0, 0]}>
                    {REGION_SUMMARY.map((row) => (
                      <Cell
                        key={row.region}
                        fill={REGION_COLORS[row.region]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "ages" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Age bands (CPS ASEC 2024)"
            subtitle="Working-age uninsured falls with age. 26–34 band estimated from adjacent disclosed bands."
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={AGE_BANDS}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="band" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    domain={[0, 16]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: SLATE, fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="rate2024"
                    fill={INDIGO}
                    radius={[6, 6, 0, 0]}
                    name="Uninsured %"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Race & ethnicity (CPS ASEC 2024)"
            subtitle="Working-age adults 19–64. Hispanic rate remains more than triple White non-Hispanic."
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={DEMO_GAPS}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 26]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: SLATE, fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="group"
                    width={120}
                    tick={{ fill: NAVY, fontSize: 10 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="rate2024"
                    fill={AMBER}
                    radius={[0, 6, 6, 0]}
                    name="Uninsured %"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "moves" && (
        <ChartCard
          title="Biggest movers 2023→2024"
          subtitle="Largest absolute working-age pp changes (significant ACS changes or |Δ| ≥ 1.0)."
        >
          <div className="h-[440px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={movesData}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  domain={[-1.6, 2.4]}
                  tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`}
                  tick={{ fill: SLATE, fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="abbr"
                  width={36}
                  tick={{ fill: NAVY, fontSize: 11 }}
                />
                <ReferenceLine x={0} stroke={SLATE} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow">
                        <p className="font-semibold">{d.state}</p>
                        <p>{fmtPp(d.deltaPp)}</p>
                        <p>2024 rate: {fmtPct(d.rate2024)}</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="deltaPp" radius={[0, 4, 4, 0]}>
                  {movesData.map((row) => (
                    <Cell key={row.abbr} fill={row.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <p className="sr-only">
        {statesByExpansion("non-expansion").length} non-expansion states in
        filter set; {STATE_GAPS.length} jurisdictions total.
      </p>
    </div>
  );
}
