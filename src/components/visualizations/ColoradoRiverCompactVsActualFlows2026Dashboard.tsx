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
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  ERA_AVERAGES,
  HEADLINE,
  SOURCE_NOTE,
  filterFlows,
  flowVsCompactSeries,
  fmtMaf,
  fmtPct,
  gapByEra,
  lowerBasinBars,
  meanNatural,
  paperClaimBars,
  rolling10yrMeans,
  useVsEntitlementBars,
  type FlowWindow,
} from "@/data/colorado-river-compact-vs-actual-flows-2026-data";

// viz-types: flow vs compact composed, gap bars, paper-claim stack, lower-basin bars, use-vs-entitlement grouped, rolling-10 line | layout: default

type ViewId = "flows" | "gaps" | "claims" | "use";

const RIVER = "#0369a1";
const COMPACT = "#b45309";
const CLAIM = "#7c3aed";
const GAP = "#be123c";
const TEAL = "#0f766e";
const SLATE = "#64748b";

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
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ColoradoRiverCompactVsActualFlows2026Dashboard() {
  const [view, setView] = useState<ViewId>("flows");
  const [window, setWindow] = useState<FlowWindow>("from2000");
  const [showClaimsLine, setShowClaimsLine] = useState(true);

  const series = useMemo(() => flowVsCompactSeries(window), [window]);
  const windowMean = useMemo(() => meanNatural(window), [window]);
  const gaps = useMemo(() => gapByEra(), []);
  const claims = useMemo(() => paperClaimBars(), []);
  const lower = useMemo(() => lowerBasinBars(), []);
  const useBars = useMemo(() => useVsEntitlementBars(), []);
  const rolling = useMemo(() => rolling10yrMeans(window), [window]);
  const eraCompare = useMemo(
    () =>
      ERA_AVERAGES.map((e) => ({
        name: e.label.replace(" compact", "").replace(" natural avg", ""),
        maf: e.maf,
        kind: e.kind,
      })),
    [],
  );

  const gapVsAssumed =
    Math.round((HEADLINE.compactAssumedSupplyMaf - windowMean) * 100) / 100;
  const gapPct =
    Math.round((gapVsAssumed / HEADLINE.compactAssumedSupplyMaf) * 1000) / 10;

  return (
    <div
      className="space-y-6"
      data-viz="colorado-river-compact-vs-actual-flows-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-300">
          Colorado River · compact vs actual flows
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Flow vs compact allocation
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Since 2000, Lees Ferry natural flow averages{" "}
          <span className="font-semibold text-white">
            {fmtMaf(HEADLINE.millennialDroughtAvg2000_2024Maf)}
          </span>{" "}
          —{" "}
          <span className="font-semibold text-amber-300">
            {fmtMaf(HEADLINE.gapVsCompactAssumedMaf)} (
            {fmtPct(HEADLINE.gapVsCompactAssumedPct)})
          </span>{" "}
          below the ~{HEADLINE.compactAssumedSupplyMaf} maf supply the 1922
          Compact still budgets against. Paper claims (Upper + Lower + Mexico)
          total {HEADLINE.paperClaimsMaf} maf.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-xs text-slate-400">Window mean</div>
            <div className="font-semibold">{fmtMaf(windowMean)}</div>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-xs text-slate-400">Gap vs assumed</div>
            <div className="font-semibold text-amber-300">
              {fmtMaf(gapVsAssumed)} ({fmtPct(gapPct)})
            </div>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-xs text-slate-400">Years in window</div>
            <div className="font-semibold">{filterFlows(window).length}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={view}
          onChange={setView}
          options={[
            { id: "flows", label: "Flows" },
            { id: "gaps", label: "Era gaps" },
            { id: "claims", label: "Paper claims" },
            { id: "use", label: "Use vs rights" },
          ]}
        />
        <ToggleGroup
          label="Window"
          value={window}
          onChange={setWindow}
          options={[
            { id: "all", label: "1964+" },
            { id: "from1990", label: "1990+" },
            { id: "from2000", label: "2000+" },
            { id: "from2015", label: "2015+" },
          ]}
        />
      </div>

      {view === "flows" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Natural flow vs compact budget"
            subtitle="Lees Ferry water-year naturalized flow against compact-era assumed supply"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Overlay"
                value={showClaimsLine ? "claims" : "assumed"}
                onChange={(v) => setShowClaimsLine(v === "claims")}
                options={[
                  { id: "assumed", label: "Assumed only" },
                  { id: "claims", label: "Assumed + claims" },
                ]}
              />
            </div>
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    unit=" maf"
                    domain={[0, 28]}
                    width={48}
                  />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="naturalMaf"
                    name="Natural flow"
                    fill={RIVER}
                    fillOpacity={0.18}
                    stroke={RIVER}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="compactAssumedMaf"
                    name="Compact assumed"
                    stroke={COMPACT}
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={false}
                  />
                  {showClaimsLine && (
                    <Line
                      type="monotone"
                      dataKey="paperClaimsMaf"
                      name="Paper claims"
                      stroke={CLAIM}
                      strokeWidth={1.5}
                      strokeDasharray="2 4"
                      dot={false}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Rolling 10-year natural mean"
            subtitle="Compact Art. III(d) non-depletion floor is 75 maf / 10 yr (7.5 maf/yr equiv.) — natural flow is a different metric"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rolling} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit=" maf" domain={[6, 22]} width={48} />
                  <Tooltip />
                  <Legend />
                  <ReferenceLine
                    y={HEADLINE.leeFerry10yrAnnualEquivMaf}
                    stroke={SLATE}
                    strokeDasharray="4 4"
                    label={{ value: "7.5 maf/yr floor equiv.", fill: SLATE, fontSize: 11 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rolling10Maf"
                    name="10-yr mean natural"
                    stroke={TEAL}
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "gaps" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Gap vs compact-assumed supply"
            subtitle={`${HEADLINE.compactAssumedSupplyMaf} maf assumed − era average`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gaps} margin={{ top: 8, right: 12, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 11 }} unit=" maf" width={48} />
                  <Tooltip />
                  <Bar dataKey="gapMaf" name="Gap (maf)" fill={GAP} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Era supply levels"
            subtitle="Assumed / claimed budgets vs observed natural averages"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={eraCompare}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit=" maf" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={150}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip />
                  <Bar dataKey="maf" name="Supply (maf)" radius={[0, 4, 4, 0]}>
                    {eraCompare.map((e) => (
                      <Cell
                        key={e.name}
                        fill={
                          e.kind === "assumed"
                            ? COMPACT
                            : e.kind === "claim"
                              ? CLAIM
                              : RIVER
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-slate-500">
              {gaps.map((g) => (
                <li key={g.label}>
                  {g.label}: actual {fmtMaf(g.actualMaf)} → gap {fmtMaf(g.gapMaf)} (
                  {fmtPct(g.gapPct)})
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      {view === "claims" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Paper claims stack"
            subtitle="Upper 7.5 + Lower 7.5 + Mexico 1.5 = 16.5 maf of legal budget"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={claims} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit=" maf" width={48} />
                  <Tooltip />
                  <Bar dataKey="maf" name="Apportionment" fill={CLAIM} radius={[4, 4, 0, 0]} />
                  <ReferenceLine
                    y={HEADLINE.millennialDroughtAvg2000_2024Maf}
                    stroke={RIVER}
                    strokeDasharray="4 4"
                    label={{
                      value: "2000–24 flow avg",
                      fill: RIVER,
                      fontSize: 11,
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Lower Basin state splits"
            subtitle="Boulder Canyon Project Act fixed shares of the 7.5 maf"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lower} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} unit=" maf" width={48} />
                  <Tooltip />
                  <Bar dataKey="maf" name="Apportionment" fill={COMPACT} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              California 4.4 · Arizona 2.8 · Nevada 0.3 — shortage priority makes Arizona and
              Nevada junior to California on the mainstem.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "use" && (
        <div className="grid gap-6 lg:grid-cols-1">
          <ChartCard
            title="Recent use vs paper entitlement"
            subtitle="Upper Basin under-uses its 7.5 maf while Lower Basin runs near full take"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={useBars} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} unit=" maf" width={48} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="entitlement"
                    name="Entitlement"
                    fill={SLATE}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="recentUse"
                    name="Recent use"
                    fill={RIVER}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
