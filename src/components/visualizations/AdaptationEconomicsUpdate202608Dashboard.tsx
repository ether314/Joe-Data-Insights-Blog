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
  LMIC_CLIMATE_MIX,
  RESIDUAL_BEARERS,
  SOURCE_NOTE,
  SOURCES,
  STACK_COMPARE,
  fmtBn,
  fmtDeltaBn,
  fmtPct,
  gapVsMdbBn,
  h1GroupedBars,
  ledgerBars,
  leverBars,
  mdbPathWithTarget,
  vintageDumbbell,
  type NeedsScenario,
} from "@/data/adaptation-economics-update-202608-data";

// viz-types: vintage grouped bars, area+line MDB path w/ 2030 ref, H1 grouped compare, LMIC mix pie, residual pie, stack horizontal | layout: default
// viz-plan: OECD→MDB delta; needs scenario; supply/demand lever filter; ledger filter; H1 damage; who-pays residual

type Tab = "delta" | "mdb-path" | "damage" | "ledgers" | "levers" | "who-pays";
type LeverFilter = "all" | "supply" | "demand";
type LedgerFilter = "all" | "flows" | "damage";

const PRIOR = "#64748b";
const NEWEST = "#0ea5e9";
const FLOW = "#14b8a6";
const TARGET = "#a78bfa";
const DAMAGE = "#f43f5e";

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

export function AdaptationEconomicsUpdate202608Dashboard() {
  const [tab, setTab] = useState<Tab>("delta");
  const [scenario, setScenario] = useState<NeedsScenario>("mid");
  const [leverFilter, setLeverFilter] = useState<LeverFilter>("all");
  const [ledgerFilter, setLedgerFilter] = useState<LedgerFilter>("all");

  const dumbbell = useMemo(() => vintageDumbbell(scenario), [scenario]);
  const mdbPath = useMemo(() => mdbPathWithTarget(), []);
  const levers = useMemo(() => leverBars(leverFilter), [leverFilter]);
  const ledgers = useMemo(() => ledgerBars(ledgerFilter), [ledgerFilter]);
  const h1Bars = useMemo(() => h1GroupedBars(), []);

  const residualPie = RESIDUAL_BEARERS.map((r) => ({
    name: r.shortLabel,
    value: r.sharePct,
    fill: r.color,
    full: r.label,
    note: r.deltaNote,
  }));

  const mixPie = LMIC_CLIMATE_MIX.map((s) => ({
    name: s.label,
    value: s.sharePct,
    bn: s.bn,
    fill: s.color,
  }));

  const gapMid = gapVsMdbBn("mid");

  return (
    <div
      className="space-y-6"
      data-viz="adaptation-economics-update-202608"
    >
      <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — OECD $34.7B (2024) → MDB LMIC $35B (2025, +31% YoY)
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-teal-50 px-3 py-2">
            <p className="text-xs text-teal-700">MDB adapt YoY</p>
            <p className="text-xl font-bold text-teal-950">
              {fmtDeltaBn(HEADLINE.mdbAdaptYoYDeltaBn)}
            </p>
            <p className="text-xs text-teal-600">
              {fmtBn(HEADLINE.mdbLmicAdapt2024Bn)} →{" "}
              {fmtBn(HEADLINE.mdbLmicAdapt2025Bn)} (+{HEADLINE.mdbAdaptYoYPct}%)
            </p>
          </div>
          <div className="rounded-lg bg-sky-50 px-3 py-2">
            <p className="text-xs text-sky-700">OECD → MDB ledger</p>
            <p className="text-xl font-bold text-sky-950">
              {fmtBn(HEADLINE.oecdAdapt2024Bn)} →{" "}
              {fmtBn(HEADLINE.mdbLmicAdapt2025Bn)}
            </p>
            <p className="text-xs text-sky-600">
              Near parity — methods differ
            </p>
          </div>
          <div className="rounded-lg bg-amber-50 px-3 py-2">
            <p className="text-xs text-amber-700">Gap vs MDB 2025</p>
            <p className="text-xl font-bold text-amber-950">
              ~{fmtBn(gapMid, 0)}
            </p>
            <p className="text-xs text-amber-600">
              Still ~{HEADLINE.needsVsMdbMultipleLow}–
              {HEADLINE.needsVsMdbMultipleHigh}× flows
            </p>
          </div>
          <div className="rounded-lg bg-rose-50 px-3 py-2">
            <p className="text-xs text-rose-700">H1 insured nat-cat</p>
            <p className="text-xl font-bold text-rose-950">
              {fmtDeltaBn(HEADLINE.h1InsuredDeltaVsPriorBn, 0)}
            </p>
            <p className="text-xs text-rose-600">
              {fmtBn(HEADLINE.h1InsuredNatCat2025Bn, 0)} →{" "}
              {fmtBn(HEADLINE.h1InsuredNatCat2026Bn, 0)} (benign ≠ closed gap)
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
            { id: "mdb-path", label: "MDB path" },
            { id: "damage", label: "H1 damage" },
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
            { id: "demand", label: "Needs + damage" },
          ]}
          onChange={setLeverFilter}
        />
        <ToggleGroup
          label="Ledger scope"
          value={ledgerFilter}
          options={[
            { id: "all", label: "All" },
            { id: "flows", label: "Flows + goals" },
            { id: "damage", label: "Needs + damage" },
          ]}
          onChange={setLedgerFilter}
        />
      </div>

      {tab === "delta" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Prior vs newest — needs, flows, gap"
            subtitle={`Needs scenario: ${scenario}. Flows: OECD 2024 provided/mobilised → MDB LMIC adaptation 2025.`}
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
                    name="Prior (OECD 2024)"
                    fill={PRIOR}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="newest"
                    name="Newest (MDB 2025)"
                    fill={NEWEST}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="MDB stack vs NCQG vs inflated needs"
            subtitle="Adaptation print is large vs OECD — tiny vs 2035 needs"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={STACK_COMPARE}
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
                    {STACK_COMPARE.map((r) => (
                      <Cell key={r.id} fill={r.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "mdb-path" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="MDB LMIC adaptation path vs 2030 goal"
            subtitle="2025 print $35B; COP29 collective projection $42B by 2030 — $7B remaining"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={mdbPath}
                  margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                    domain={[0, 50]}
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
                    name="MDB LMIC adaptation"
                    fill="#bae6fd"
                    stroke={FLOW}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    name="2030 goal ($42B)"
                    stroke={TARGET}
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={false}
                  />
                  <ReferenceLine
                    x={2025}
                    stroke={NEWEST}
                    strokeDasharray="3 3"
                    label={{ value: "Newest", fill: NEWEST, fontSize: 11 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="LMIC MDB climate mix 2025"
            subtitle={`Mitigation ${fmtBn(HEADLINE.mdbLmicMitig2025Bn, 0)} (+${HEADLINE.mdbLmicMitigYoYPct}%) · Adaptation ${fmtBn(HEADLINE.mdbLmicAdapt2025Bn, 0)} (+${HEADLINE.mdbAdaptYoYPct}%)`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mixPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {mixPie.map((s) => (
                      <Cell key={s.name} fill={s.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${fmtPct(Number(v))} (${fmtBn((item?.payload as { bn?: number })?.bn ?? 0, 0)})`,
                      "Share",
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "damage" && (
        <ChartCard
          title="Swiss Re H1 2026 vs H1 2025 vs 10-year average"
          subtitle="Insured nat-cat −54% YoY — location-driven insurance ratio 42% does not close the $424B protection gap"
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={h1Bars}
                margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                />
                <Tooltip
                  formatter={(v) => fmtBn(Number(v), 0)}
                  labelFormatter={(l) => String(l)}
                />
                <Legend />
                <Bar
                  dataKey="h12026"
                  name="H1 2026"
                  fill={NEWEST}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="h12025"
                  name="H1 2025"
                  fill={DAMAGE}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="avg10y"
                  name="H1 10-y avg"
                  fill={PRIOR}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {tab === "ledgers" && (
        <ChartCard
          title="Multi-ledger comparison"
          subtitle="Filter: AGR needs, MDB/OECD flows, 2030 goal, H1 damage, protection gap"
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
          subtitle="MDB bounce is real; half-year damage still dwarfs annual adaptation books"
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={levers}
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
            title="Who still pays the residual"
            subtitle="Constructed incidence shares after MDB bounce + benign H1 — labeled as interactive, not disclosed"
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
                    innerRadius={50}
                    outerRadius={95}
                    paddingAngle={2}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {residualPie.map((s) => (
                      <Cell key={s.name} fill={s.fill} />
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
            title="Vintage delta table"
            subtitle="Official prints only in leftmost columns; residual pie is constructed"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[28rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3">Metric</th>
                    <th className="py-2 pr-3">Prior</th>
                    <th className="py-2 pr-3">Newest</th>
                    <th className="py-2">Delta</th>
                  </tr>
                </thead>
                <tbody>
                  {DELTA_TABLE.map((row) => (
                    <tr
                      key={row.metric}
                      className="border-b border-slate-100 align-top"
                    >
                      <td className="py-2 pr-3 font-medium text-slate-800">
                        {row.metric}
                      </td>
                      <td className="py-2 pr-3 text-slate-600">{row.prior}</td>
                      <td className="py-2 pr-3 text-slate-600">{row.newest}</td>
                      <td className="py-2 text-slate-800">{row.delta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-700">Sources</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                className="text-sky-700 underline-offset-2 hover:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
