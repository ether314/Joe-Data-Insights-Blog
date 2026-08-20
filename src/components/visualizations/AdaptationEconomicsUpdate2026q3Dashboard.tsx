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
  RESIDUAL_BEARERS,
  SOURCE_NOTE,
  SOURCES,
  flowPathWithTarget,
  fmtBn,
  fmtDeltaBn,
  fmtPct,
  ledgerBars,
  leverBars,
  vintageDumbbell,
  type NeedsScenario,
} from "@/data/adaptation-economics-update-2026q3-data";

// viz-types: vintage grouped bars, area+line OECD flows w/ Glasgow ref, multi-ledger bars, residual pie, NCQG stacked compare | layout: default
// viz-plan: UNEP→OECD delta; needs scenario; supply/demand lever filter; ledger filter; instrument mix; who-pays residual

type Tab = "delta" | "flows" | "ledgers" | "levers" | "who-pays";
type LeverFilter = "all" | "supply" | "demand";
type LedgerFilter = "all" | "flows" | "damage";

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

export function AdaptationEconomicsUpdate2026q3Dashboard() {
  const [tab, setTab] = useState<Tab>("delta");
  const [scenario, setScenario] = useState<NeedsScenario>("mid");
  const [leverFilter, setLeverFilter] = useState<LeverFilter>("all");
  const [ledgerFilter, setLedgerFilter] = useState<LedgerFilter>("all");

  const dumbbell = useMemo(() => vintageDumbbell(scenario), [scenario]);
  const flowPath = useMemo(() => flowPathWithTarget(), []);
  const levers = useMemo(() => leverBars(leverFilter), [leverFilter]);
  const ledgers = useMemo(() => ledgerBars(ledgerFilter), [ledgerFilter]);

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

  const gapMid = useMemo(() => {
    const mid = HEADLINE.needsMidBn - HEADLINE.oecdAdapt2024Bn;
    return mid;
  }, []);

  return (
    <div
      className="space-y-6"
      data-viz="adaptation-economics-update-2026q3"
    >
      <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — AGR 2025 / UNEP $26B → OECD May 2026 $34.7B
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-teal-50 px-3 py-2">
            <p className="text-xs text-teal-700">OECD adapt YoY</p>
            <p className="text-xl font-bold text-teal-950">
              {fmtDeltaBn(HEADLINE.oecdAdaptYoYDeltaBn)}
            </p>
            <p className="text-xs text-teal-600">
              {fmtBn(HEADLINE.oecdAdapt2023Bn)} →{" "}
              {fmtBn(HEADLINE.oecdAdapt2024Bn)} (+{HEADLINE.oecdAdaptYoYPct}%)
            </p>
          </div>
          <div className="rounded-lg bg-sky-50 px-3 py-2">
            <p className="text-xs text-sky-700">UNEP → OECD ledger</p>
            <p className="text-xl font-bold text-sky-950">
              {fmtBn(HEADLINE.unepFlows2023Bn)} →{" "}
              {fmtBn(HEADLINE.oecdAdapt2024Bn)}
            </p>
            <p className="text-xs text-sky-600">
              Broader OECD numerator (methods differ)
            </p>
          </div>
          <div className="rounded-lg bg-amber-50 px-3 py-2">
            <p className="text-xs text-amber-700">Gap vs OECD 2024</p>
            <p className="text-xl font-bold text-amber-950">
              ~{fmtBn(gapMid, 0)}
            </p>
            <p className="text-xs text-amber-600">
              Still ~{HEADLINE.needsVsOecdMultipleLow}–
              {HEADLINE.needsVsOecdMultipleHigh}× flows
            </p>
          </div>
          <div className="rounded-lg bg-violet-50 px-3 py-2">
            <p className="text-xs text-violet-700">Glasgow public shortfall</p>
            <p className="text-xl font-bold text-violet-950">
              {fmtBn(HEADLINE.glasgowShortfall2025Bn)}
            </p>
            <p className="text-xs text-violet-600">
              Need +{fmtBn(HEADLINE.glasgowShortfall2025Bn)} in 2025 to 2× 2019
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
            { id: "flows", label: "OECD flows" },
            { id: "ledgers", label: "Multi-ledger" },
            { id: "levers", label: "Gap levers" },
            { id: "who-pays", label: "Who pays" },
          ]}
          onChange={setTab}
        />
        <ToggleGroup
          label="Needs scenario"
          value={scenario}
          options={[
            { id: "low", label: `Low ${fmtBn(HEADLINE.needsLowBn, 0)}` },
            { id: "mid", label: "Mid" },
            { id: "high", label: `High ${fmtBn(HEADLINE.needsHighBn, 0)}` },
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
        <ToggleGroup
          label="Ledger scope"
          value={ledgerFilter}
          options={[
            { id: "all", label: "All" },
            { id: "flows", label: "Flows only" },
            { id: "damage", label: "Needs + damage" },
          ]}
          onChange={setLedgerFilter}
        />
      </div>

      {tab === "delta" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Prior vs newest — needs, flows, gap"
            subtitle={`Needs scenario: ${scenario}. Flows: UNEP 2023 intl public → OECD 2024 provided/mobilised.`}
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
                    name="Prior (UNEP / AGR 2025)"
                    fill={PRIOR}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="newest"
                    name="Newest (OECD 2024)"
                    fill={NEWEST}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="NCQG stack vs adaptation"
            subtitle="Total climate finance rose; adaptation share stuck near 25%"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={NCQG_COMPARE}
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
                    dataKey="shortLabel"
                    width={88}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => [
                      fmtBn(Number(v)),
                      (item?.payload as { note?: string })?.note ?? "bn",
                    ]}
                  />
                  <Bar dataKey="bn" name="USD bn" radius={[0, 4, 4, 0]}>
                    {NCQG_COMPARE.map((r) => (
                      <Cell key={r.id} fill={r.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "flows" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="OECD adaptation path vs Glasgow 2×"
            subtitle="Provided & mobilised; Glasgow line = 2× 2019 public baseline (~$37.6B)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={flowPath}
                  margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
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
                  <Area
                    type="monotone"
                    dataKey="flows"
                    name="OECD adaptation"
                    fill="#bae6fd"
                    stroke={FLOW}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="glasgow"
                    name="Glasgow 2× target"
                    stroke={GLASGOW}
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={false}
                  />
                  <ReferenceLine
                    x={2024}
                    stroke={NEWEST}
                    strokeDasharray="3 3"
                    label={{ value: "Newest", fill: NEWEST, fontSize: 11 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="OECD public climate finance instruments (2024)"
            subtitle="Loans still dominate — adaptation debt trap risk persists"
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
                    outerRadius={95}
                    paddingAngle={2}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {instrumentPie.map((s) => (
                      <Cell key={s.name} fill={s.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "ledgers" && (
        <ChartCard
          title="Multi-ledger comparison"
          subtitle="Filter: needs, official flows, CPI track, FRLD, Swiss Re protection gap"
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ledgers}
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
                  dataKey="shortLabel"
                  width={88}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v, _n, item) => [
                    fmtBn(Number(v)),
                    (item?.payload as { note?: string })?.note ?? "bn",
                  ]}
                />
                <Bar dataKey="bn" name="USD bn" radius={[0, 4, 4, 0]}>
                  {ledgers.map((r) => (
                    <Cell key={r.id} fill={r.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {tab === "levers" && (
        <ChartCard
          title="Closing-the-gap levers"
          subtitle="OECD bounce, Glasgow floor, CPI track, FRLD — all still under needs"
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={levers}
                margin={{ top: 8, right: 12, left: 4, bottom: 48 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="shortLabel"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                />
                <Tooltip
                  formatter={(v, _n, item) => [
                    fmtBn(Number(v)),
                    (item?.payload as { note?: string })?.note ?? "bn",
                  ]}
                />
                <Bar dataKey="bn" name="USD bn" radius={[4, 4, 0, 0]}>
                  {levers.map((r) => (
                    <Cell key={r.id} fill={r.color} />
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
            title="Residual who-pays shares"
            subtitle="Editorial incidence after modest OECD bounce — not national accounts"
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
                    outerRadius={100}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {residualPie.map((r) => (
                      <Cell key={r.name} fill={r.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, item) => [
                      fmtPct(Number(v)),
                      (item?.payload as { note?: string })?.note ?? "share",
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Swiss Re secondary ledger"
            subtitle="Below-trend insured year does not close the protection gap"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      label: "Insured 2025",
                      bn: HEADLINE.insuredLosses2025Bn,
                      fill: FLOW,
                    },
                    {
                      label: "Trend 2025",
                      bn: HEADLINE.insuredTrend2025Bn,
                      fill: PRIOR,
                    },
                    {
                      label: "Trend 2026",
                      bn: HEADLINE.insuredTrend2026Bn,
                      fill: NEWEST,
                    },
                    {
                      label: "Peak 2026",
                      bn: HEADLINE.peakYear2026Bn,
                      fill: GAP,
                    },
                    {
                      label: "Prot. gap",
                      bn: HEADLINE.protectionGap2025Bn,
                      fill: "#f59e0b",
                    },
                  ]}
                  margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <Tooltip formatter={(v) => fmtBn(Number(v), 0)} />
                  <Bar dataKey="bn" radius={[4, 4, 0, 0]}>
                    {[
                      FLOW,
                      PRIOR,
                      NEWEST,
                      GAP,
                      "#f59e0b",
                    ].map((c, i) => (
                      <Cell key={i} fill={c} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Metric</th>
              <th className="px-4 py-3">Prior post</th>
              <th className="px-4 py-3">Q3 newest</th>
              <th className="px-4 py-3">Δ</th>
            </tr>
          </thead>
          <tbody>
            {DELTA_TABLE.map((row) => (
              <tr key={row.metric} className="border-t border-slate-100">
                <td className="px-4 py-2.5 font-medium text-slate-800">
                  {row.metric}
                </td>
                <td className="px-4 py-2.5 text-slate-600">{row.prior}</td>
                <td className="px-4 py-2.5 text-slate-600">{row.newest}</td>
                <td className="px-4 py-2.5 text-slate-800">{row.delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-slate-500">
        Sources:{" "}
        {SOURCES.map((s, i) => (
          <span key={s.url}>
            {i > 0 && " · "}
            <a
              href={s.url}
              className="text-sky-700 underline-offset-2 hover:underline"
            >
              {s.label}
            </a>
          </span>
        ))}
      </div>
    </div>
  );
}
