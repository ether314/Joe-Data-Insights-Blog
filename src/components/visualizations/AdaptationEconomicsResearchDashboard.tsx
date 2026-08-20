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
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  CLIMATE_FINANCE_BY_USE,
  HEADLINE,
  INTL_PUBLIC_ADAPT_FLOWS,
  RESIDUAL_BEARERS,
  SOURCE_NOTE,
  SOURCES,
  fmtBn,
  fmtPct,
  fmtTn,
  gapBn,
  glasgowTargetBn,
  natCatWithGap,
  needsBn,
  rankedRegionsBy,
  type NeedsScenario,
} from "@/data/adaptation-economics-research-2026-data";

// viz-types: needs-vs-flows bars, area+line flows, stacked mitigation/adaptation, pie residual bearers, scatter resilience×gap | layout: canvas

type Tab = "gap" | "flows" | "mix" | "who-pays" | "regions";
type FlowRange = "full" | "paris";

const NEED = "#0ea5e9";
const FLOW = "#14b8a6";
const GAP = "#f43f5e";
const MIT = "#64748b";
const ADAPT = "#f59e0b";
const DUAL = "#a78bfa";
const ECON = "#94a3b8";
const INS = "#14b8a6";

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
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              value === o.id
                ? "bg-sky-900 text-white"
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

export function AdaptationEconomicsResearchDashboard() {
  const [tab, setTab] = useState<Tab>("gap");
  const [scenario, setScenario] = useState<NeedsScenario>("mid");
  const [flowRange, setFlowRange] = useState<FlowRange>("full");
  const [regionMetric, setRegionMetric] = useState<"gap" | "resilience">("gap");

  const needs = needsBn(scenario);
  const gap = gapBn(scenario);
  const glasgow = glasgowTargetBn();

  const gapBars = useMemo(
    () => [
      { id: "needs", label: "Needs (scenario)", value: needs, fill: NEED },
      {
        id: "flows",
        label: "Intl public 2022",
        value: HEADLINE.intlPublicAdapt2022Bn,
        fill: FLOW,
      },
      { id: "gap", label: "Finance gap", value: gap, fill: GAP },
      {
        id: "glasgow",
        label: "Glasgow 2× target",
        value: glasgow,
        fill: "#64748b",
      },
    ],
    [needs, gap, glasgow],
  );

  const flowPath = useMemo(() => {
    const rows =
      flowRange === "paris"
        ? INTL_PUBLIC_ADAPT_FLOWS.filter((d) => d.year >= 2019)
        : INTL_PUBLIC_ADAPT_FLOWS;
    return rows.map((d) => ({
      ...d,
      glasgowLine: glasgow,
      needsMid: Math.round((HEADLINE.needsLowBn + HEADLINE.needsHighBn) / 2),
    }));
  }, [flowRange, glasgow]);

  const mixRows = useMemo(
    () =>
      CLIMATE_FINANCE_BY_USE.map((d) => ({
        year: String(d.year),
        Mitigation: d.mitigationBn,
        Adaptation: d.adaptationBn,
        Dual: d.dualBn,
        adaptSharePct:
          Math.round(
            (1000 * d.adaptationBn) /
              (d.mitigationBn + d.adaptationBn + d.dualBn),
          ) / 10,
      })),
    [],
  );

  const natCat = useMemo(() => natCatWithGap(), []);
  const pieData = useMemo(
    () =>
      RESIDUAL_BEARERS.map((b) => ({
        name: b.shortLabel,
        value: b.sharePct,
        fill: b.color,
        mechanism: b.mechanism,
      })),
    [],
  );

  const regionRows = useMemo(
    () => rankedRegionsBy(regionMetric),
    [regionMetric],
  );

  const scatterRows = useMemo(
    () =>
      REGION_RESILIENCE_FOR_SCATTER().map((r) => ({
        ...r,
        x: r.resiliencePct,
        y: r.protectionGapBn,
        z: 120,
      })),
    [],
  );

  return (
    <div
      data-viz="adaptation-economics-research-2026"
      className="mx-auto w-full max-w-6xl space-y-6"
    >
      <header className="rounded-xl border border-sky-900/20 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300/90">
          Adaptation economics — who pays before policy catches up
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {fmtBn(HEADLINE.gapLowBn)}–{fmtBn(HEADLINE.gapHighBn)} adaptation gap
          vs {fmtBn(HEADLINE.intlPublicAdapt2022Bn)} in public flows
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          UNEP puts developing-country adaptation needs at{" "}
          <strong className="text-white">
            {fmtBn(HEADLINE.needsLowBn)}–{fmtBn(HEADLINE.needsHighBn)}
          </strong>{" "}
          per year. International public adaptation finance reached only{" "}
          <strong className="text-white">
            {fmtBn(HEADLINE.intlPublicAdapt2022Bn)}
          </strong>{" "}
          in 2022. Meanwhile CPI tracks ~{fmtTn(HEADLINE.climateFinance2024Tn)}{" "}
          in total climate finance — and adaptation plateaued near{" "}
          <strong className="text-white">
            {fmtBn(HEADLINE.trackedAdapt2024Bn)}
          </strong>
          . Swiss Re&apos;s nat-cat protection gap hit{" "}
          <strong className="text-white">
            {fmtBn(HEADLINE.protectionGap2025Bn)}
          </strong>{" "}
          in 2025 with only ~{fmtPct(HEADLINE.resilienceIndex2025Pct)} insured.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          label="Panel"
          value={tab}
          onChange={setTab}
          options={[
            { id: "gap", label: "Needs vs flows" },
            { id: "flows", label: "Public flows" },
            { id: "mix", label: "Mitigation vs adapt" },
            { id: "who-pays", label: "Who pays" },
            { id: "regions", label: "Protection map" },
          ]}
        />
        {(tab === "gap" || tab === "flows") && (
          <ToggleGroup
            label="Needs scenario"
            value={scenario}
            onChange={setScenario}
            options={[
              { id: "low", label: "Low $215B" },
              { id: "mid", label: "Midpoint" },
              { id: "high", label: "High $387B" },
            ]}
          />
        )}
        {tab === "flows" && (
          <ToggleGroup
            label="Range"
            value={flowRange}
            onChange={setFlowRange}
            options={[
              { id: "full", label: "2016–2022" },
              { id: "paris", label: "Since 2019" },
            ]}
          />
        )}
        {tab === "regions" && (
          <ToggleGroup
            label="Rank by"
            value={regionMetric}
            onChange={setRegionMetric}
            options={[
              { id: "gap", label: "Protection gap $" },
              { id: "resilience", label: "Lowest coverage" },
            ]}
          />
        )}
      </div>

      {tab === "gap" && (
        <ChartCard
          title="Adaptation finance gap — needs vs international public flows"
          subtitle={`Scenario needs ${fmtBn(needs)} − 2022 flows ${fmtBn(HEADLINE.intlPublicAdapt2022Bn)} = gap ${fmtBn(gap)}. Glasgow 2× (${fmtBn(glasgow)}) closes ~${HEADLINE.glasgowGapClosePct}% of the gap.`}
        >
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={gapBars}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `$${v}B`}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={120}
                  tick={{ fontSize: 11, fill: "#334155" }}
                />
                <Tooltip
                  formatter={(v) => fmtBn(Number(v))}
                  labelFormatter={(l) => String(l)}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={36}>
                  {gapBars.map((d) => (
                    <Cell key={d.id} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {tab === "flows" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="International public adaptation finance"
            subtitle="UNEP AGR series to developing countries; dashed = Glasgow 2× target"
          >
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={flowPath}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    tickFormatter={(v) => `$${v}B`}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      fmtBn(Number(v)),
                      String(name),
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="intlPublicBn"
                    name="Intl public"
                    fill={FLOW}
                    fillOpacity={0.25}
                    stroke={FLOW}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="glasgowLine"
                    name="Glasgow 2×"
                    stroke="#94a3b8"
                    strokeDasharray="6 4"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="needsMid"
                    name="Needs midpoint"
                    stroke={GAP}
                    strokeDasharray="4 4"
                    dot={false}
                    strokeWidth={1.5}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Nat-cat economic vs insured losses"
            subtitle="Swiss Re-style global path — uninsured residual is the adaptation bill"
          >
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={natCat}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    tickFormatter={(v) => `$${v}B`}
                    tick={{ fontSize: 11, fill: "#64748b" }}
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
                    dataKey="economicBn"
                    name="Economic"
                    stackId="1"
                    stroke={ECON}
                    fill={ECON}
                    fillOpacity={0.35}
                  />
                  <Area
                    type="monotone"
                    dataKey="insuredBn"
                    name="Insured"
                    stroke={INS}
                    fill={INS}
                    fillOpacity={0.55}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "mix" && (
        <ChartCard
          title="Climate finance composition — mitigation dwarfs adaptation"
          subtitle={`CPI landscape shape: total ~${fmtTn(HEADLINE.climateFinance2024Tn)} in 2024; adaptation plateau ~${fmtBn(HEADLINE.trackedAdapt2024Bn)}`}
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mixRows}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis
                  tickFormatter={(v) => `$${v}B`}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <Tooltip
                  formatter={(v, name) => [fmtBn(Number(v)), String(name)]}
                />
                <Legend />
                <Bar
                  dataKey="Mitigation"
                  stackId="a"
                  fill={MIT}
                  radius={[0, 0, 0, 0]}
                />
                <Bar dataKey="Dual" stackId="a" fill={DUAL} />
                <Bar
                  dataKey="Adaptation"
                  stackId="a"
                  fill={ADAPT}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Adaptation share of tracked flows stayed in the low-single digits
            even as mitigation scaled — the commercial pipeline favors energy
            systems over resilience.
          </p>
        </ChartCard>
      )}

      {tab === "who-pays" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Who absorbs residual climate damage?"
            subtitle="Editorial split of residual burden — insurance covers ~27% globally"
          >
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {pieData.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, name) => [`${v}%`, String(name)]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Bearer mechanisms"
            subtitle="Same residual map as text — click panel tabs to compare ledgers"
          >
            <ul className="space-y-3">
              {RESIDUAL_BEARERS.map((b) => (
                <li
                  key={b.id}
                  className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
                >
                  <span
                    className="mt-1 h-3 w-3 shrink-0 rounded-full"
                    style={{ background: b.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-800">
                        {b.label}
                      </p>
                      <span className="text-sm font-bold tabular-nums text-slate-900">
                        {fmtPct(b.sharePct)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {b.mechanism}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      {tab === "regions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={
              regionMetric === "gap"
                ? "Regional protection gap (USD bn)"
                : "Lowest insurance resilience"
            }
            subtitle="Swiss Re–style regional snapshot — developing regions sit at single-digit coverage"
          >
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionRows}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tickFormatter={(v) =>
                      regionMetric === "gap" ? `$${v}B` : `${v}%`
                    }
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="shortLabel"
                    width={100}
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      regionMetric === "gap"
                        ? fmtBn(Number(v))
                        : fmtPct(Number(v))
                    }
                  />
                  <Bar
                    dataKey={
                      regionMetric === "gap"
                        ? "protectionGapBn"
                        : "resiliencePct"
                    }
                    fill={regionMetric === "gap" ? GAP : NEED}
                    radius={[0, 6, 6, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Coverage vs gap scatter"
            subtitle="X = resilience % · Y = protection gap $B — low coverage + large gap = unpaid damage"
          >
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 12, right: 16, left: 0, bottom: 12 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Resilience"
                    unit="%"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    label={{
                      value: "Insurance resilience %",
                      position: "insideBottom",
                      offset: -4,
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Gap"
                    tickFormatter={(v) => `$${v}B`}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 200]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => {
                      if (name === "Resilience") return [`${v}%`, name];
                      return [fmtBn(Number(v)), "Protection gap"];
                    }}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.shortLabel ?? ""
                    }
                  />
                  <Scatter data={scatterRows} fill={NEED}>
                    {scatterRows.map((r) => (
                      <Cell
                        key={r.id}
                        fill={
                          r.income === "developing"
                            ? GAP
                            : r.income === "emerging"
                              ? ADAPT
                              : NEED
                        }
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <footer className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs leading-relaxed text-slate-600">
        <p>{SOURCE_NOTE}</p>
        <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {SOURCES.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sky-800 underline-offset-2 hover:underline"
            >
              {s.label}
            </a>
          ))}
        </p>
      </footer>
    </div>
  );
}

function REGION_RESILIENCE_FOR_SCATTER() {
  return rankedRegionsBy("gap");
}
