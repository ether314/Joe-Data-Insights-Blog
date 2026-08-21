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
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  BATTERY_NODES,
  HEADLINE,
  INSTRUMENT_MIX,
  JUNE_FLOW,
  KOREA_SENSITIVITY,
  METER_COMPARE,
  MONTHLY_FLOW_PATH,
  OWNERSHIP_NODES,
  REGION_SHARES,
  SOURCE_NOTE,
  fmtPct,
  fmtPp,
  fmtUsdBn,
  jurisdictionScatter,
  mismatchBars,
  ownershipRegionRollup,
} from "@/data/fiscal-industrial-policy-geography-202608-data";

// viz-types: sensitivity dual+waterfall, ownership ladder+donut, instrument stacked+scatter, battery ladder+monthly area | layout: default

type ViewId = "sensitivity" | "ownership" | "instruments" | "battery";
type Universe = "core" | "alt";
type BatteryFilter = "all" | "US" | "Canada" | "Mexico" | "NA";

const SKY = "#0ea5e9";
const ROSE = "#f43f5e";
const VIOLET = "#8b5cf6";
const SLATE = "#64748b";
const AMBER = "#f59e0b";
const TEAL = "#14b8a6";

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

export function FiscalIndustrialPolicyGeography202608Dashboard() {
  const [view, setView] = useState<ViewId>("sensitivity");
  const [universe, setUniverse] = useState<Universe>("core");
  const [batteryFilter, setBatteryFilter] = useState<BatteryFilter>("all");

  const useAlt = universe === "alt";
  const mismatch = useMemo(() => mismatchBars(useAlt), [useAlt]);
  const scatter = useMemo(() => jurisdictionScatter(), []);
  const ownershipRegion = useMemo(() => ownershipRegionRollup(), []);

  const regionDual = useMemo(
    () =>
      [...REGION_SHARES]
        .sort((a, b) => b.stockSharePct - a.stockSharePct)
        .map((r) => ({
          short: r.short,
          Stock: r.stockSharePct,
          Packages: useAlt ? r.altPackageSharePct : r.packageSharePct,
          fill: r.fill,
        })),
    [useAlt],
  );

  const sensitivityWaterfall = useMemo(() => {
    const core = KOREA_SENSITIVITY[0];
    const alt = KOREA_SENSITIVITY[1];
    return [
      {
        label: "NA core",
        value: core.northAmericaPct,
        fill: SKY,
      },
      {
        label: "E. Asia core",
        value: core.eastAsiaPct,
        fill: ROSE,
      },
      {
        label: "NA after Korea",
        value: alt.northAmericaPct,
        fill: "#38bdf8",
      },
      {
        label: "E. Asia after Korea",
        value: alt.eastAsiaPct,
        fill: "#fb7185",
      },
    ];
  }, []);

  const ownershipBars = useMemo(
    () => [...OWNERSHIP_NODES].sort((a, b) => b.stakeUsdBn - a.stakeUsdBn),
    [],
  );

  const instrumentStack = useMemo(
    () =>
      INSTRUMENT_MIX.map((r) => ({
        region: r.short,
        Subsidies: r.subsidiesPct,
        Barriers: r.importBarriersPct,
        Finance: r.financeControlsPct,
        Other: r.otherPct,
      })),
    [],
  );

  const batteryBars = useMemo(() => {
    const rows =
      batteryFilter === "all"
        ? BATTERY_NODES
        : BATTERY_NODES.filter((n) => n.country === batteryFilter);
    return [...rows].sort((a, b) => b.tipUsdBn - a.tipUsdBn);
  }, [batteryFilter]);

  const flowPath = useMemo(
    () =>
      MONTHLY_FLOW_PATH.map((m) => ({
        month: m.month.replace(" 2026", ""),
        total: m.total,
        RoW: m.rowSharePct,
        US: m.usSharePct,
        EU: m.euSharePct,
        China: m.chinaSharePct,
      })),
    [],
  );

  const junePie = useMemo(() => [...JUNE_FLOW], []);
  const meterBars = useMemo(
    () => [...METER_COMPARE].sort((a, b) => b.topSharePct - a.topSharePct),
    [],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
          Fiscal & industrial policy — Aug 202608 geography lens
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          Regional shares that flip when Korea&apos;s mega-plan enters
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          Core packages still put North America near{" "}
          {fmtPct(HEADLINE.northAmericaPackageSharePct, 0)} of war-chest dollars
          (+{HEADLINE.naMismatchPp.toFixed(0)} pp vs stock). Add Korea&apos;s{" "}
          {fmtUsdBn(HEADLINE.koreaMegaPlanUsdBn, 0)} headline and East Asia jumps
          to ~{fmtPct(HEADLINE.altEastAsiaPackageSharePct, 0)} of the alt
          universe. Ownership stakes and the USMCA battery corridor show where
          fiscal capacity lands below the capital level.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: useAlt ? "E. Asia alt $" : "NA package mismatch",
              value: useAlt
                ? fmtPct(HEADLINE.altEastAsiaPackageSharePct, 0)
                : fmtPp(HEADLINE.naMismatchPp, 0),
            },
            {
              label: "E. Asia stock",
              value: fmtPct(HEADLINE.eastAsiaStockSharePct),
            },
            {
              label: "Ownership top-3",
              value: fmtPct(HEADLINE.ownershipTop3NodeSharePct),
            },
            {
              label: "June RoW flow",
              value: fmtPct(HEADLINE.juneRowSharePct),
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-0.5 text-lg font-bold text-white">{k.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "sensitivity", label: "Sensitivity" },
            { id: "ownership", label: "Ownership" },
            { id: "instruments", label: "Instruments" },
            { id: "battery", label: "Battery / flow" },
          ]}
        />
        {(view === "sensitivity" || view === "instruments") && (
          <ToggleGroup
            label="Universe"
            value={universe}
            onChange={setUniverse}
            options={[
              { id: "core", label: "Core packages" },
              { id: "alt", label: "+Korea mega" },
            ]}
          />
        )}
        {view === "battery" && (
          <ToggleGroup
            label="Nodes"
            value={batteryFilter}
            onChange={setBatteryFilter}
            options={[
              { id: "all", label: "All NA" },
              { id: "US", label: "US" },
              { id: "Canada", label: "Canada" },
              { id: "Mexico", label: "Mexico" },
            ]}
          />
        )}
      </div>

      {view === "sensitivity" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Stock–package mismatch by region"
            subtitle={
              useAlt
                ? "Alt universe: package − stock after Korea mega-plan"
                : "Core universe: package − stock (pp)"
            }
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mismatch} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    unit=" pp"
                    domain={[-40, 60]}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={72}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [
                      fmtPp(Number(v), 1),
                      useAlt ? "Alt mismatch" : "Mismatch",
                    ]}
                  />
                  <Bar dataKey="activeMismatch" radius={[0, 4, 4, 0]}>
                    {mismatch.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Dual ladder: stock vs packages"
            subtitle={
              useAlt
                ? "Rose = stock counts; cyan = alt package $"
                : "Rose = stock counts; cyan = core package $"
            }
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionDual}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                  <Bar dataKey="Stock" fill={ROSE} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Packages" fill={SKY} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Korea sensitivity: who leads on package $"
            subtitle="Core NA ~71% → Alt East Asia ~66% when $951B enters"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sensitivityWaterfall}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {sensitivityWaterfall.map((r) => (
                      <Cell key={r.label} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Count × dollar scatter"
            subtitle="Core jurisdiction package $ vs stock share (bubble ∝ $)"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Stock %"
                    unit="%"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Package %"
                    unit="%"
                    tick={{ fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) =>
                      name === "z"
                        ? [fmtUsdBn(Number(v), 1), "Package $"]
                        : [fmtPct(Number(v), 1), String(name)]
                    }
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.short ?? ""
                    }
                  />
                  <Scatter data={scatter}>
                    {scatter.map((j) => (
                      <Cell key={j.short} fill={j.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "ownership" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Ownership / equity stake nodes"
            subtitle={`Tracked Jun–Jul universe ${fmtUsdBn(HEADLINE.ownershipUniverseUsdBn, 2)} — top-3 ${HEADLINE.ownershipTop3Label}`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ownershipBars}
                  layout="vertical"
                  margin={{ left: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="B" />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={78}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${fmtUsdBn(Number(v), 2)} (${fmtPct(item?.payload?.sharePct ?? 0, 1)})`,
                      "Stake",
                    ]}
                  />
                  <Bar dataKey="stakeUsdBn" radius={[0, 4, 4, 0]}>
                    {ownershipBars.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Ownership geography by region"
            subtitle="China subnational funds dominate the tracked equity tape"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ownershipRegion}
                    dataKey="sharePct"
                    nameKey="short"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {ownershipRegion.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
              {ownershipRegion.map((r) => (
                <span key={r.short} className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: r.fill }}
                  />
                  {r.short} {fmtPct(r.sharePct, 0)}
                </span>
              ))}
            </div>
          </ChartCard>

          <ChartCard
            title="Meter board: which geography leads?"
            subtitle="Top-region share across stock, packages, ownership, flow, battery"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={meterBars} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={78}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${fmtPct(Number(v), 1)} (${item?.payload?.topRegion ?? ""})`,
                      "Top share",
                    ]}
                  />
                  <Bar dataKey="topSharePct" fill={VIOLET} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="June 2026 disclosed flow pie"
            subtitle={`RoW still ${HEADLINE.juneRowSharePct}% of ${HEADLINE.juneTotal} interventions`}
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={junePie}
                    dataKey="sharePct"
                    nameKey="short"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {junePie.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtPct(Number(v), 0)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "instruments" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="2025 instrument mix by region"
            subtitle="Within-region shares: subsidies vs import barriers vs finance controls"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={instrumentStack}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v) => fmtPct(Number(v), 0)} />
                  <Bar
                    dataKey="Subsidies"
                    stackId="a"
                    fill={ROSE}
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar dataKey="Barriers" stackId="a" fill={AMBER} />
                  <Bar dataKey="Finance" stackId="a" fill={TEAL} />
                  <Bar
                    dataKey="Other"
                    stackId="a"
                    fill={SLATE}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Active package share vs stock"
            subtitle={
              useAlt
                ? "Alt package $ after Korea mega vs cumulative stock"
                : "Core package $ vs cumulative stock"
            }
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={regionDual}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                  <Bar dataKey="Stock" fill={ROSE} radius={[4, 4, 0, 0]} />
                  <Line
                    type="monotone"
                    dataKey="Packages"
                    stroke={SKY}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Jurisdiction scatter (core packages)"
            subtitle="US sits far above the stock=package diagonal on dollars"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Stock"
                    unit="%"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Package"
                    unit="%"
                    tick={{ fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.short ?? ""
                    }
                  />
                  <Scatter data={scatter}>
                    {scatter.map((j) => (
                      <Cell key={j.short} fill={j.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Universe size"
            subtitle="Core $626B vs alt $1.58T when Korea mega-plan is included"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      short: "Core",
                      usd: HEADLINE.packageUniverseUsdBn,
                      fill: SKY,
                    },
                    {
                      short: "Alt (+Korea)",
                      usd: HEADLINE.altUniverseUsdBn,
                      fill: ROSE,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="B" />
                  <Tooltip formatter={(v) => fmtUsdBn(Number(v), 0)} />
                  <Bar dataKey="usd" radius={[4, 4, 0, 0]}>
                    <Cell fill={SKY} />
                    <Cell fill={ROSE} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "battery" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="USMCA battery nearshore corridor"
            subtitle={`Tracked tip ~${fmtUsdBn(HEADLINE.batteryCorridorUsdBn, 0)} — top-3 ${HEADLINE.batteryTop3Label} (~${HEADLINE.batteryTop3NodeSharePct}%)`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={batteryBars}
                  layout="vertical"
                  margin={{ left: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="B" />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={56}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${fmtUsdBn(Number(v), 1)} (${fmtPct(item?.payload?.sharePct ?? 0, 1)})`,
                      item?.payload?.node ?? "Tip",
                    ]}
                  />
                  <Bar dataKey="tipUsdBn" radius={[0, 4, 4, 0]}>
                    {batteryBars.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="May→Jul monthly flow path"
            subtitle="Totals disclosed; June geography disclosed; May/Jul shares editorial"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={flowPath}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="share"
                    tick={{ fontSize: 11 }}
                    unit="%"
                    domain={[0, 80]}
                  />
                  <YAxis
                    yAxisId="total"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Area
                    yAxisId="share"
                    type="monotone"
                    dataKey="RoW"
                    stackId="1"
                    fill={SLATE}
                    stroke={SLATE}
                    fillOpacity={0.35}
                  />
                  <Area
                    yAxisId="share"
                    type="monotone"
                    dataKey="US"
                    stackId="1"
                    fill={SKY}
                    stroke={SKY}
                    fillOpacity={0.45}
                  />
                  <Area
                    yAxisId="share"
                    type="monotone"
                    dataKey="EU"
                    stackId="1"
                    fill={VIOLET}
                    stroke={VIOLET}
                    fillOpacity={0.45}
                  />
                  <Area
                    yAxisId="share"
                    type="monotone"
                    dataKey="China"
                    stackId="1"
                    fill={ROSE}
                    stroke={ROSE}
                    fillOpacity={0.45}
                  />
                  <Line
                    yAxisId="total"
                    type="monotone"
                    dataKey="total"
                    stroke={AMBER}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
