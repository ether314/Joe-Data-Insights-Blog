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
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  DELTA_TABLE,
  HEADLINE,
  INSTRUMENT_MIX,
  NCQG_COMPARE,
  NEEDS_BANDS,
  RESIDUAL_BEARERS,
  SOURCE_NOTE,
  SOURCES,
  flowPathWithTarget,
  fmtBn,
  fmtDeltaBn,
  fmtPct,
  leverBars,
  vintageDumbbell,
  type NeedsScenario,
} from "@/data/adaptation-economics-update-2026-data";

// viz-types: vintage dumbbell bars, area+line flows w/ Glasgow ref, gap-lever bars, residual pie, NCQG compare bars | layout: default
// viz-plan: prior→AGR2025 delta meters; needs scenario; supply/demand lever filter; instrument mix; who-pays residual

type Tab = "delta" | "flows" | "levers" | "who-pays" | "ncqg";
type LeverFilter = "all" | "supply" | "demand";

const PRIOR = "#64748b";
const NEWEST = "#0ea5e9";
const FLOW = "#14b8a6";
const GAP = "#f43f5e";
const GLASGOW = "#a78bfa";

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
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              on
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function AdaptationEconomicsUpdateDashboard() {
  const [tab, setTab] = useState<Tab>("delta");
  const [scenario, setScenario] = useState<NeedsScenario>("mid");
  const [leverFilter, setLeverFilter] = useState<LeverFilter>("all");

  const dumbbell = useMemo(() => vintageDumbbell(scenario), [scenario]);
  const flowPath = useMemo(() => flowPathWithTarget(), []);
  const levers = useMemo(() => leverBars(leverFilter), [leverFilter]);

  const needsRangeBars = useMemo(
    () =>
      NEEDS_BANDS.map((b) => ({
        vintage: b.vintage,
        low: b.lowBn,
        mid: b.midBn,
        high: b.highBn,
        span: b.highBn - b.lowBn,
        fill: b.fill,
        horizon: b.horizon,
      })),
    [],
  );

  const residualPie = RESIDUAL_BEARERS.map((r) => ({
    name: r.shortLabel,
    value: r.sharePct,
    fill: r.color,
    full: r.label,
    note: r.deltaNote,
  }));

  const instrumentPie = INSTRUMENT_MIX.map((s) => ({
    name: s.label,
    value: s.sharePct,
    fill: s.color,
  }));

  return (
    <div
      className="space-y-6"
      data-viz="adaptation-economics-update-2026"
    >
      <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — AGR 2024 research → AGR 2025 Running on Empty
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-rose-50 px-3 py-2">
            <p className="text-xs text-rose-700">Flows YoY</p>
            <p className="text-xl font-bold text-rose-950">
              {fmtDeltaBn(HEADLINE.flowsYoYDeltaBn)}
            </p>
            <p className="text-xs text-rose-600">
              {fmtBn(HEADLINE.flows2022Bn)} → {fmtBn(HEADLINE.flows2023Bn)} (
              {HEADLINE.flowsYoYPct}%)
            </p>
          </div>
          <div className="rounded-lg bg-sky-50 px-3 py-2">
            <p className="text-xs text-sky-700">Needs (2035 band)</p>
            <p className="text-xl font-bold text-sky-950">
              {fmtBn(HEADLINE.needsLowBn)}–{fmtBn(HEADLINE.needsHighBn)}
            </p>
            <p className="text-xs text-sky-600">
              Was {fmtBn(HEADLINE.priorNeedsLowBn)}–
              {fmtBn(HEADLINE.priorNeedsHighBn)} (decade)
            </p>
          </div>
          <div className="rounded-lg bg-amber-50 px-3 py-2">
            <p className="text-xs text-amber-700">Finance gap</p>
            <p className="text-xl font-bold text-amber-950">
              {fmtBn(HEADLINE.gapLowBn)}–{fmtBn(HEADLINE.gapHighBn)}
            </p>
            <p className="text-xs text-amber-600">
              {HEADLINE.needsVsFlowsMultipleLow}–
              {HEADLINE.needsVsFlowsMultipleHigh}× current flows
            </p>
          </div>
          <div className="rounded-lg bg-violet-50 px-3 py-2">
            <p className="text-xs text-violet-700">Private upside</p>
            <p className="text-xl font-bold text-violet-950">
              {fmtBn(HEADLINE.privateCurrentBn)} →{" "}
              {fmtBn(HEADLINE.privatePotentialBn)}
            </p>
            <p className="text-xs text-violet-600">
              Tracked now vs realistic potential
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <ToggleGroup
          label="Panel"
          value={tab}
          options={[
            { id: "delta", label: "Vintage delta" },
            { id: "flows", label: "Public flows" },
            { id: "levers", label: "Gap levers" },
            { id: "who-pays", label: "Who pays" },
            { id: "ncqg", label: "NCQG arithmetic" },
          ]}
          onChange={setTab}
        />
        <ToggleGroup
          label="Needs scenario"
          value={scenario}
          options={[
            { id: "low", label: `Low ${fmtBn(HEADLINE.needsLowBn)}` },
            { id: "mid", label: "Mid" },
            { id: "high", label: `High ${fmtBn(HEADLINE.needsHighBn)}` },
          ]}
          onChange={setScenario}
        />
        <ToggleGroup
          label="Lever scope"
          value={leverFilter}
          options={[
            { id: "all", label: "All" },
            { id: "supply", label: "Supply side" },
            { id: "demand", label: "Needs + flows" },
          ]}
          onChange={setLeverFilter}
        />
      </div>

      {tab === "delta" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Prior vs newest — needs, flows, gap"
            subtitle={`Needs scenario: ${scenario}. Horizons differ (decade vs 2035).`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dumbbell}
                  margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <Tooltip
                    formatter={(v) => fmtBn(Number(v))}
                    labelFormatter={(l) => String(l)}
                  />
                  <Legend />
                  <Bar
                    dataKey="prior"
                    name="Research / AGR 2024"
                    fill={PRIOR}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="newest"
                    name="AGR 2025"
                    fill={NEWEST}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Needs band shape by vintage"
            subtitle="Low–high span; midpoints marked"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={needsRangeBars}
                  margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="vintage" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      fmtBn(Number(v)),
                      String(name),
                    ]}
                  />
                  <Legend />
                  <Bar
                    dataKey="low"
                    name="Low"
                    fill="#94a3b8"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="high"
                    name="High"
                    fill="#0ea5e9"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="mid"
                    name="Midpoint"
                    stroke={GAP}
                    strokeWidth={2}
                    dot={{ r: 5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "flows" && (
        <ChartCard
          title="International public adaptation finance path"
          subtitle="Glasgow ~$40B target line; 2023 is the first drop since 2020"
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={flowPath}
                margin={{ top: 8, right: 16, left: 4, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                  domain={[0, 45]}
                />
                <Tooltip formatter={(v) => fmtBn(Number(v))} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="flows"
                  name="Intl public flows"
                  stroke={FLOW}
                  fill={FLOW}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="glasgow"
                  name="Glasgow 2× target"
                  stroke={GLASGOW}
                  strokeDasharray="6 4"
                  strokeWidth={2}
                  dot={false}
                />
                <ReferenceLine
                  x={2023}
                  stroke={GAP}
                  strokeDasharray="3 3"
                  label={{
                    value: "−$2B",
                    position: "insideTopRight",
                    fill: GAP,
                    fontSize: 11,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {tab === "levers" && (
        <ChartCard
          title="Closing-the-gap levers vs needs"
          subtitle="Filter with Lever scope. Private potential is still 1/6 of high needs."
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={levers.map((l) => ({
                  short: l.shortLabel,
                  bn: l.bn,
                  fill: l.color,
                  full: l.label,
                  note: l.note,
                }))}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={88}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v) => fmtBn(Number(v))}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.full ?? "")
                  }
                />
                <Bar dataKey="bn" name="USD bn" radius={[0, 4, 4, 0]}>
                  {levers.map((l) => (
                    <Cell key={l.id} fill={l.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {tab === "who-pays" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Residual risk when public flows stall"
            subtitle="Editorial incidence shares — update framing after the 2023 drop"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={residualPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={({ name, value }) =>
                      `${name} ${fmtPct(Number(value))}`
                    }
                  >
                    {residualPie.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, item) => [
                      fmtPct(Number(v)),
                      String(item?.payload?.full ?? ""),
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Instrument mix (2022–2023 flows)"
            subtitle={`${fmtPct(HEADLINE.debtInstrumentSharePct)} debt; ${fmtPct(HEADLINE.concessionalSharePct)} concessional overall`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={instrumentPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={110}
                    label={({ name, value }) =>
                      `${name} ${fmtPct(Number(value))}`
                    }
                  >
                    {instrumentPie.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "ncqg" && (
        <ChartCard
          title="NCQG vs adaptation needs arithmetic"
          subtitle="Dual-purpose $300B goal vs adaptation-only needs — inflation widens the miss"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={NCQG_COMPARE.map((r) => ({
                  short: r.shortLabel,
                  bn: r.bn,
                  fill: r.color,
                  full: r.label,
                  note: r.note,
                }))}
                margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="short" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                />
                <Tooltip
                  formatter={(v) => fmtBn(Number(v))}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.full ?? "")
                  }
                />
                <Bar dataKey="bn" name="USD bn" radius={[4, 4, 0, 0]}>
                  {NCQG_COMPARE.map((r) => (
                    <Cell key={r.id} fill={r.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Metric</th>
              <th className="px-4 py-3 font-semibold">Research / AGR 2024</th>
              <th className="px-4 py-3 font-semibold">AGR 2025</th>
              <th className="px-4 py-3 font-semibold">Delta</th>
            </tr>
          </thead>
          <tbody>
            {DELTA_TABLE.map((row) => (
              <tr key={row.metric} className="border-t border-slate-100">
                <td className="px-4 py-2.5 font-medium text-slate-900">
                  {row.metric}
                </td>
                <td className="px-4 py-2.5 text-slate-600">{row.prior}</td>
                <td className="px-4 py-2.5 text-slate-900">{row.newest}</td>
                <td className="px-4 py-2.5 text-rose-700">{row.delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500">
        Sources:{" "}
        {SOURCES.map((s, i) => (
          <span key={s.url}>
            {i > 0 && " · "}
            <a
              href={s.url}
              className="underline decoration-slate-300 hover:text-slate-800"
            >
              {s.label}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}
