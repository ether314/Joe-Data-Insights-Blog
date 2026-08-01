"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  BOTTLENECKS,
  GROWTH_DRIVERS,
  HEADLINE,
  INCREMENTAL_SUPPLY,
  QUEUE_STACK,
  REGION_DEMAND,
  SCENARIO_PATH,
  SOURCE_NOTE,
  SOURCES,
  SUPPLY_MIX_2024,
  fmtGw,
  fmtPct,
  fmtTwh,
  type ScenarioId,
} from "@/data/ai-power-grid-research-2026-data";

// viz-types: composed area+multi-line scenarios, ranked horizontal bars, donut pie, waterfall growth drivers, queue stacked bars | layout: default

type ViewId = "path" | "regions" | "supply" | "bottlenecks";
type RegionMetric = "twh2024" | "twh2030" | "deltaTwh";
type SupplyMode = "stock2024" | "incremental";

const TEAL = "#0d9488";
const AMBER = "#f59e0b";
const SKY = "#0ea5e9";
const VIOLET = "#8b5cf6";
const ROSE = "#f43f5e";
const SLATE = "#64748b";

const SCENARIO_META: Record<
  ScenarioId,
  { label: string; stroke: string; key: keyof (typeof SCENARIO_PATH)[0] }
> = {
  base: { label: "Base Case", stroke: SKY, key: "base" },
  liftOff: { label: "Lift-Off", stroke: ROSE, key: "liftOff" },
  highEff: { label: "High Efficiency", stroke: TEAL, key: "highEff" },
  headwinds: { label: "Headwinds", stroke: SLATE, key: "headwinds" },
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
                ? "bg-cyan-800 text-white"
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

/** Cumulative waterfall from growth-driver shares of the 2024→2030 Base increase */
function GrowthWaterfall({ totalIncrease }: { totalIncrease: number }) {
  const steps = useMemo(() => {
    const sorted = [...GROWTH_DRIVERS].sort(
      (a, b) => b.shareOfIncreasePct - a.shareOfIncreasePct,
    );
    let cursor = 0;
    return sorted.map((d) => {
      const mag = (d.shareOfIncreasePct / 100) * totalIncrease;
      const row = {
        name: d.driver,
        base: cursor,
        rise: mag,
        fill: d.fill,
        share: d.shareOfIncreasePct,
      };
      cursor += mag;
      return row;
    });
  }, [totalIncrease]);

  return (
    <div className="h-80 min-h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%" minHeight={280}>
        <BarChart
          data={steps}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => `${Math.round(v)}`}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={150}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(value, name, item) => {
              const p = item?.payload as { rise?: number; share?: number };
              if (name === "rise" || name === "Increase") {
                return [
                  `${fmtTwh(Number(p?.rise ?? value), 0)} (${fmtPct(Number(p?.share ?? 0))})`,
                  "Share of increase",
                ];
              }
              return [null, ""];
            }}
          />
          <Bar dataKey="base" stackId="w" fill="transparent" legendType="none" />
          <Bar dataKey="rise" stackId="w" name="Increase" radius={[0, 4, 4, 0]}>
            {steps.map((s) => (
              <Cell key={s.name} fill={s.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AiPowerGridResearchDashboard() {
  const [view, setView] = useState<ViewId>("path");
  const [focusScenario, setFocusScenario] = useState<ScenarioId>("base");
  const [regionMetric, setRegionMetric] = useState<RegionMetric>("deltaTwh");
  const [supplyMode, setSupplyMode] = useState<SupplyMode>("stock2024");

  const pathData = useMemo(
    () =>
      SCENARIO_PATH.map((r) => ({
        year: String(r.year),
        base: r.base,
        liftOff: r.liftOff,
        highEff: r.highEff,
        headwinds: r.headwinds,
      })),
    [],
  );

  const regionBars = useMemo(() => {
    const key = regionMetric;
    return [...REGION_DEMAND]
      .map((r) => ({
        name: r.short,
        value: r[key],
        confidence: r.confidence,
      }))
      .sort((a, b) => b.value - a.value);
  }, [regionMetric]);

  const supplyPie = useMemo(() => {
    const rows =
      supplyMode === "stock2024" ? SUPPLY_MIX_2024 : INCREMENTAL_SUPPLY;
    return [...rows].sort((a, b) => b.sharePct - a.sharePct);
  }, [supplyMode]);

  const focusMeta = SCENARIO_META[focusScenario];
  const focus2030 = SCENARIO_PATH.find((p) => p.year === 2030)![focusMeta.key] as number;
  const focus2035 = SCENARIO_PATH.find((p) => p.year === 2035)![focusMeta.key] as number;
  const baseIncrease = HEADLINE.dcTwh2030Base - HEADLINE.dcTwh2024;

  return (
    <div
      data-viz="ai-power-grid-research-2026"
      className="mx-auto w-full max-w-6xl space-y-6"
    >
      <header className="rounded-xl border border-cyan-900/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/90">
          AI power &amp; grid — IEA global frame
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {fmtTwh(HEADLINE.dcTwh2024)} in 2024 → {fmtTwh(HEADLINE.dcTwh2030Base)}{" "}
          by 2030 (Base)
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Data centres used about{" "}
          <strong className="text-white">
            {fmtPct(HEADLINE.dcShare2024Pct, 1)}
          </strong>{" "}
          of world electricity in 2024. The IEA Base Case roughly doubles that
          load to{" "}
          <strong className="text-white">
            {fmtTwh(HEADLINE.dcTwh2030Base)}
          </strong>{" "}
          (~{fmtPct(HEADLINE.dcShare2030Pct)}) by 2030 — while renewables meet
          only about half of the incremental megawatt-hours and grid queues keep
          ~{fmtPct(HEADLINE.projectsAtDelayRiskPct)} of planned projects at
          delay risk.
        </p>
      </header>

      <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950">
        {SOURCE_NOTE}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "path", label: "Scenario path" },
            { id: "regions", label: "Regions" },
            { id: "supply", label: "Supply mix" },
            { id: "bottlenecks", label: "Grid bottlenecks" },
          ]}
        />
        {view === "path" && (
          <ToggleGroup
            label="Highlight"
            value={focusScenario}
            onChange={setFocusScenario}
            options={[
              { id: "base", label: "Base" },
              { id: "liftOff", label: "Lift-Off" },
              { id: "highEff", label: "High Eff." },
              { id: "headwinds", label: "Headwinds" },
            ]}
          />
        )}
        {view === "regions" && (
          <ToggleGroup
            label="Metric"
            value={regionMetric}
            onChange={setRegionMetric}
            options={[
              { id: "deltaTwh", label: "2024→30 growth" },
              { id: "twh2030", label: "2030 level" },
              { id: "twh2024", label: "2024 level" },
            ]}
          />
        )}
        {view === "supply" && (
          <ToggleGroup
            label="Mix"
            value={supplyMode}
            onChange={setSupplyMode}
            options={[
              { id: "stock2024", label: "2024 stock mix" },
              { id: "incremental", label: "Incremental to 2030" },
            ]}
          />
        )}
      </div>

      {view === "path" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Global data-centre electricity — scenario band"
            subtitle={`${focusMeta.label} hits ${fmtTwh(focus2030)} in 2030 and ${fmtTwh(focus2035)} in 2035. Band spans Headwinds → Lift-Off.`}
          >
            <div className="h-80 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <ComposedChart
                  data={pathData}
                  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${v}`}
                    label={{
                      value: "TWh",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      v != null ? fmtTwh(Number(v)) : "—",
                      String(name),
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="liftOff"
                    stroke="none"
                    fill={ROSE}
                    fillOpacity={0.08}
                    name="Lift-Off envelope"
                  />
                  <Area
                    type="monotone"
                    dataKey="headwinds"
                    stroke="none"
                    fill="#fff"
                    fillOpacity={1}
                    name="Headwinds floor"
                  />
                  {(Object.keys(SCENARIO_META) as ScenarioId[]).map((id) => {
                    const m = SCENARIO_META[id];
                    const active = id === focusScenario;
                    return (
                      <Line
                        key={id}
                        type="monotone"
                        dataKey={m.key}
                        name={m.label}
                        stroke={m.stroke}
                        strokeWidth={active ? 3.5 : 1.5}
                        strokeOpacity={active ? 1 : 0.45}
                        dot={active ? { r: 4 } : false}
                      />
                    );
                  })}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="What drives the Base Case increase"
            subtitle={`~${fmtTwh(baseIncrease)} added 2024→2030. Accelerated (AI) servers ≈ half.`}
          >
            <GrowthWaterfall totalIncrease={baseIncrease} />
          </ChartCard>
        </div>
      )}

      {view === "regions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={
              regionMetric === "deltaTwh"
                ? "Absolute demand growth to 2030 (TWh)"
                : regionMetric === "twh2030"
                  ? "2030 data-centre electricity (TWh)"
                  : "2024 data-centre electricity (TWh)"
            }
            subtitle="Highest → lowest. US + China ≈ 80% of global growth to 2030."
          >
            <div className="h-80 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <BarChart
                  data={regionBars}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtTwh(Number(v)), "Demand"]}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {regionBars.map((r, i) => (
                      <Cell
                        key={r.name}
                        fill={[SKY, TEAL, AMBER, VIOLET, SLATE][i % 5]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Concentration, not just volume"
            subtitle="Global share stays modest (~3% in 2030 Base) while local grids absorb smelter-scale loads."
          >
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    US share of 2024 DC load
                  </p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    {fmtPct(HEADLINE.usShare2024Pct)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    China share of 2024 DC load
                  </p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    {fmtPct(HEADLINE.chinaShare2024Pct)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Europe share of 2024 DC load
                  </p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    {fmtPct(HEADLINE.europeShare2024Pct)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    US capacity in five clusters
                  </p>
                  <p className="mt-1 text-3xl font-bold text-amber-700">
                    ~{fmtPct(HEADLINE.usFiveClusterSharePct)}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                Accelerated-server electricity grows ~{HEADLINE.accelServerCagrPct}
                %/yr in the Base Case versus ~{HEADLINE.conventionalServerCagrPct}
                %/yr for conventional servers — the AI stack is the wedge inside
                an already-fast sector.
              </p>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "supply" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={
              supplyMode === "stock2024"
                ? "2024 physical supply mix for data centres"
                : "Who meets the incremental TWh to 2030"
            }
            subtitle={
              supplyMode === "stock2024"
                ? "Physical generation mix (grid + onsite), not PPA claims. Coal still leads the stock."
                : "Renewables ~half of growth; gas + coal still >40% of the added load."
            }
          >
            <div className="h-80 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <PieChart>
                  <Pie
                    data={supplyPie}
                    dataKey="sharePct"
                    nameKey="fuel"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {supplyPie.map((s) => (
                      <Cell key={s.fuel} fill={s.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, name) => [
                      fmtPct(Number(v)),
                      String(name),
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
              {supplyPie.map((s) => (
                <li key={s.fuel} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: s.fill }}
                  />
                  {s.fuel} ({fmtPct(s.sharePct)})
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title="Generation dedicated to data centres"
            subtitle="IEA: ~460 TWh of generation in 2024 → >1,000 TWh by 2030 (Base)."
          >
            <div className="h-72 min-h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={240}>
                <BarChart
                  data={[
                    {
                      year: "2024",
                      twh: HEADLINE.genForDcTwh2024,
                      fill: SLATE,
                    },
                    {
                      year: "2030 Base",
                      twh: HEADLINE.genForDcTwh2030,
                      fill: TEAL,
                    },
                  ]}
                  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${v}`}
                    label={{
                      value: "TWh",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <Tooltip formatter={(v) => [fmtTwh(Number(v)), "Generation"]} />
                  <Bar dataKey="twh" radius={[4, 4, 0, 0]}>
                    <Cell fill={SLATE} />
                    <Cell fill={TEAL} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Hyperscalers have publicly backed plans for more than{" "}
              {HEADLINE.smrGwHyperscalerPlans} GW of small modular reactors —
              relevant after 2030, not a 2026 interconnection fix. CO₂ from DC
              electricity peaks near {HEADLINE.co2PeakMt} Mt around 2030 in the
              Base Case.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "bottlenecks" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Grid friction metrics"
            subtitle="Demand can double globally while still failing locally on queues and clusters."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {BOTTLENECKS.map((b) => (
                <div
                  key={b.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {b.label}
                  </p>
                  <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">
                    {b.value}
                    <span className="text-lg font-semibold text-slate-500">
                      {b.unit}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{b.note}</p>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard
            title="US generation & storage still sitting in queues"
            subtitle="LBNL Queued Up 2026 — active capacity seeking interconnection (end-2025)."
          >
            <div className="h-72 min-h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={240}>
                <BarChart
                  data={QUEUE_STACK}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={140}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip formatter={(v) => [fmtGw(Number(v)), "Capacity"]} />
                  <Bar dataKey="gw" radius={[0, 4, 4, 0]}>
                    {QUEUE_STACK.map((r) => (
                      <Cell key={r.label} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Median time from interconnection request to commercial operation
              exceeded {HEADLINE.queueMedianYears} years for projects built in
              2025. That clock is slower than a typical hyperscale shell build.
            </p>
          </ChartCard>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          {SOURCES.map((s) => (
            <li key={s.label}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-700 underline underline-offset-2"
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
