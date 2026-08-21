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
  LineChart,
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
  CLEAN_INV_SHARES,
  CONCENTRATION_CURVE,
  ELEC_DEMAND_LADDER,
  FUEL_EXPORT_STACK,
  GROWTH_ADD_SHARES,
  HEADLINE,
  HHI_BANDS,
  IMPORT_EXPOSURE,
  LENS_LABELS,
  SOURCE_NOTE,
  VINTAGE_SLOPE,
  filterRows,
  fmtHhi,
  fmtPct,
  fmtPp,
  hhiBand,
  lensExposures,
  sortedByMetric,
  type Lens,
} from "@/data/energy-systems-concentration-2026q3-data";

// viz-types: Top-k ladder bars, Lorenz area+line, fuel export stacks, HHI donut, clean-inv pie, growth bars, import×wholesale scatter, vintage multi-line, lens avg bars | layout: default

type ViewId = "ladder" | "lorenz" | "exports" | "investment" | "exposure" | "vintage";
type Metric = "top1" | "top3" | "hhi" | "delta";

const ROSE = "#f43f5e";
const AMBER = "#f59e0b";
const SKY = "#0ea5e9";
const TEAL = "#14b8a6";
const VIOLET = "#8b5cf6";

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

export function EnergySystemsConcentration2026q3Dashboard() {
  const [view, setView] = useState<ViewId>("ladder");
  const [metric, setMetric] = useState<Metric>("top1");
  const [lens, setLens] = useState<Lens | "all">("all");
  const [showEqual, setShowEqual] = useState(true);
  const [minTop1, setMinTop1] = useState(0);
  const [slopeMetric, setSlopeMetric] = useState<
    "elecTop1Pct" | "lngTop1Pct" | "demandTop1Pct" | "solarMfgTop1Pct"
  >("elecTop1Pct");

  const filtered = useMemo(
    () => filterRows({ lens, minTop1 }),
    [lens, minTop1],
  );

  const ladderBars = useMemo(() => {
    const sorted = sortedByMetric(
      filtered,
      metric === "delta" ? "delta" : metric,
    );
    return sorted.map((r) => ({
      ...r,
      value:
        metric === "top1"
          ? r.top1SharePct
          : metric === "top3"
            ? r.top3SharePct
            : metric === "delta"
              ? (r.deltaTop1Pp ?? 0)
              : r.hhi,
    }));
  }, [filtered, metric]);

  const hhiDonut = useMemo(() => {
    return HHI_BANDS.map((b) => ({
      ...b,
      count: filtered.filter((c) => hhiBand(c.hhi).id === b.id).length,
    })).filter((b) => b.count > 0);
  }, [filtered]);

  const lensBars = useMemo(() => lensExposures(filtered), [filtered]);

  const exportStack = useMemo(
    () =>
      FUEL_EXPORT_STACK.map((f) => ({
        fuel: f.fuel,
        top1: f.top1SharePct,
        top2: f.top2SharePct,
        top3: f.top3SharePct,
        rest: Math.max(0, 100 - f.top3BlocPct),
        bloc: f.top3BlocPct,
        fill: f.fill,
        delta: f.deltaTop1Pp,
        labels: `${f.top1Label} / ${f.top2Label} / ${f.top3Label}`,
      })),
    [],
  );

  const exposureScatter = useMemo(
    () =>
      IMPORT_EXPOSURE.filter((r) => r.wholesaleYoyPct != null).map((r) => ({
        ...r,
        x: r.importDependencePct,
        y: r.wholesaleYoyPct as number,
        z: Math.max(40, Math.sqrt(Math.abs(r.primaryEj)) * 18),
      })),
    [],
  );

  const elecBars = useMemo(
    () => ELEC_DEMAND_LADDER.filter((d) => d.label !== "Rest of world"),
    [],
  );

  const metricLabel =
    metric === "top1"
      ? "Top-1 share %"
      : metric === "top3"
        ? "Top-3 share %"
        : metric === "delta"
          ? "Δ Top-1 (pp vs 2026 conc)"
          : "HHI";

  return (
    <div
      className="space-y-6"
      data-viz="energy-systems-concentration-2026q3"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Energy systems — Q3 concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Power Top-1 {HEADLINE.elecTop1Pct}% · Top-3 {HEADLINE.elecTop3Pct}%
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          After Ember GER 2026 and IEA WEI / Mid-Year prints, China clears{" "}
          <span className="text-rose-300">
            ~{HEADLINE.elecTop1Pct}% of world electricity
          </span>
          ; China + US + India{" "}
          <span className="text-amber-300">~{HEADLINE.elecTop3Pct}%</span>. US
          LNG Top-1 thickens to {HEADLINE.lngTop1Pct}% (+
          {HEADLINE.lngTop1Pct - 22} pp). Clean investment Top-1 stays China at{" "}
          <span className="text-teal-300">
            ~{HEADLINE.cleanInvTop1Pct}% of ${HEADLINE.cleanInvTn}T
          </span>
          . Solar modules remain {HEADLINE.solarModuleTop1Pct}% China.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Elec Top-1",
              value: fmtPct(HEADLINE.elecTop1Pct, 1),
              sub: HEADLINE.elecTop1Label,
            },
            {
              label: "Elec Top-3",
              value: fmtPct(HEADLINE.elecTop3Pct, 1),
              sub: HEADLINE.elecTop3Labels,
            },
            {
              label: "LNG Top-1",
              value: fmtPct(HEADLINE.lngTop1Pct),
              sub: HEADLINE.lngTop1Label,
            },
            {
              label: "Clean inv Top-1",
              value: fmtPct(HEADLINE.cleanInvTop1Pct),
              sub: HEADLINE.cleanInvTop1Label,
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-3"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums">{k.value}</p>
              <p className="mt-0.5 text-xs text-slate-400">{k.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={view}
          options={[
            { id: "ladder", label: "Top-k ladder" },
            { id: "lorenz", label: "Power curve" },
            { id: "exports", label: "Fuel exports" },
            { id: "investment", label: "Capex tip" },
            { id: "exposure", label: "Import shock" },
            { id: "vintage", label: "Vintage slope" },
          ]}
          onChange={setView}
        />
        <div className="flex flex-wrap items-center gap-3">
          <ToggleGroup
            label="Metric"
            value={metric}
            options={[
              { id: "top1", label: "Top-1" },
              { id: "top3", label: "Top-3" },
              { id: "hhi", label: "HHI" },
              { id: "delta", label: "Δ pp" },
            ]}
            onChange={setMetric}
          />
          <ToggleGroup
            label="Lens"
            value={lens}
            options={[
              { id: "all", label: "All" },
              { id: "demand", label: "Demand" },
              { id: "export", label: "Export" },
              { id: "production", label: "Produce" },
              { id: "manufacturing", label: "Mfg" },
              { id: "investment", label: "Invest" },
            ]}
            onChange={setLens}
          />
          <ToggleGroup
            label="Floor"
            value={String(minTop1) as "0" | "20" | "40"}
            options={[
              { id: "0", label: "Any" },
              { id: "20", label: "≥20%" },
              { id: "40", label: "≥40%" },
            ]}
            onChange={(v) => setMinTop1(Number(v))}
          />
        </div>
      </div>

      {view === "ladder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={`${metricLabel} by market`}
            subtitle={`${filtered.length} lenses · sorted descending`}
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ladderBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="shortLabel"
                    width={100}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      metric === "hhi"
                        ? fmtHhi(Number(v))
                        : fmtPct(Number(v), 1)
                    }
                  />
                  <Bar dataKey="value" name={metricLabel} radius={[0, 4, 4, 0]}>
                    {ladderBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="HHI band mix"
            subtitle="How many lenses sit in each concentration band"
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hhiDonut}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {hhiDonut.map((b) => (
                      <Cell key={b.id} fill={b.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
              {hhiDonut.map((b) => (
                <li key={b.id} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: b.fill }}
                  />
                  {b.label}: {b.count}
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title="Average Top-1 by lens family"
            subtitle="Demand vs export vs manufacturing tip heaviness"
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lensBars} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="lens"
                    tickFormatter={(v: Lens) => LENS_LABELS[v] ?? v}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) => fmtPct(Number(v), 1)}
                    labelFormatter={(v) =>
                      LENS_LABELS[v as Lens] ?? String(v)
                    }
                  />
                  <Bar dataKey="avgTop1" name="Avg Top-1 %" fill={SKY} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="maxTop1" name="Max Top-1 %" fill={ROSE} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Electricity demand ladder"
            subtitle="Ember 2025 generation shares — cumulative tip"
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={elecBars} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                  <Bar dataKey="sharePct" name="Share %" radius={[4, 4, 0, 0]}>
                    {elecBars.map((d) => (
                      <Cell key={d.label} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "lorenz" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Electricity concentration curve"
            subtitle="Cumulative country share vs equal-share line"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Equal line"
                value={showEqual ? "on" : "off"}
                options={[
                  { id: "on", label: "Show" },
                  { id: "off", label: "Hide" },
                ]}
                onChange={(v) => setShowEqual(v === "on")}
              />
            </div>
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={CONCENTRATION_CURVE}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="sharePct"
                    name="Cumulative %"
                    fill={ROSE}
                    fillOpacity={0.2}
                    stroke={ROSE}
                    strokeWidth={2}
                  />
                  {showEqual && (
                    <Line
                      type="monotone"
                      dataKey="equalPct"
                      name="Equal share"
                      stroke={TEAL}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="2026e demand-growth add shares"
            subtitle={`Who absorbs the ${HEADLINE.demandGrowth2026Pct}% world demand path (IEA MYU)`}
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={GROWTH_ADD_SHARES}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={100}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, name) =>
                      name === "growthPct"
                        ? `${v}% growth`
                        : fmtPct(Number(v))
                    }
                  />
                  <Bar dataKey="sharePct" name="Share of TWh add" radius={[0, 4, 4, 0]}>
                    {GROWTH_ADD_SHARES.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "exports" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Fuel export Top-1 / Top-2 / Top-3 stacks"
            subtitle="Seaborne + pipe trade — Top-3 blocs"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exportStack} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="fuel" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="top1" name="Top-1" stackId="a" fill={ROSE} />
                  <Bar dataKey="top2" name="Top-2" stackId="a" fill={AMBER} />
                  <Bar dataKey="top3" name="Top-3" stackId="a" fill={SKY} />
                  <Bar
                    dataKey="rest"
                    name="Rest"
                    stackId="a"
                    fill="#cbd5e1"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Top-1 delta vs prior concentration print"
            subtitle="US LNG and Indonesia coal thickened; pipe gas eased"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exportStack} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="fuel" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit=" pp" />
                  <Tooltip formatter={(v) => fmtPp(Number(v), 0)} />
                  <Bar dataKey="delta" name="Δ Top-1 pp" radius={[4, 4, 0, 0]}>
                    {exportStack.map((d) => (
                      <Cell
                        key={d.fuel}
                        fill={d.delta >= 0 ? ROSE : TEAL}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-slate-600">
              {FUEL_EXPORT_STACK.map((f) => (
                <li key={f.id}>
                  <span className="font-semibold">{f.fuel}:</span>{" "}
                  {f.top1Label} / {f.top2Label} / {f.top3Label} · Top-3{" "}
                  {fmtPct(f.top3BlocPct)} ({fmtPp(f.deltaTop1Pp, 0)} Top-1)
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      {view === "investment" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Clean energy investment geography"
            subtitle={`IEA WEI 2026e · $${HEADLINE.cleanInvTn}T clean vs $${HEADLINE.fossilInvTn}T fossils`}
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CLEAN_INV_SHARES}
                    dataKey="sharePct"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={(props) => {
                      const name = String(props.name ?? "");
                      const pct = Number(props.value ?? 0);
                      return `${name} ${pct}%`;
                    }}
                  >
                    {CLEAN_INV_SHARES.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Clean vs fossil capital tip"
            subtitle="Investment denominator — not generation shares"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      label: "Clean",
                      tn: HEADLINE.cleanInvTn,
                      fill: TEAL,
                    },
                    {
                      label: "Fossils",
                      tn: HEADLINE.fossilInvTn,
                      fill: AMBER,
                    },
                    {
                      label: "Total",
                      tn: HEADLINE.totalInvTn,
                      fill: VIOLET,
                    },
                  ]}
                  margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} unit=" T" />
                  <Tooltip formatter={(v) => `$${Number(v)}T`} />
                  <Bar dataKey="tn" name="$T" radius={[4, 4, 0, 0]}>
                    {[TEAL, AMBER, VIOLET].map((c, i) => (
                      <Cell key={c} fill={c} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              China alone is ~{HEADLINE.cleanInvTop1Pct}% of clean capital;
              Top-3 (China + US + EU) ~{HEADLINE.cleanInvTop3Pct}%. The renewables
              overtake in power ({HEADLINE.renewPowerSharePct}% vs coal{" "}
              {HEADLINE.coalPowerSharePct}%) does not flatten manufacturing or
              investment geography.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "exposure" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Import dependence × wholesale YoY"
            subtitle="IEA MYU Q2 2026 — LNG importers priced the Hormuz shock"
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Import dep %"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Import dependence %",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Wholesale YoY %"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Wholesale YoY %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) =>
                      name === "z" ? null : `${v}`
                    }
                    labelFormatter={() => ""}
                    content={({ payload }) => {
                      const p = payload?.[0]?.payload;
                      if (!p) return null;
                      return (
                        <div className="rounded border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                          <p className="font-semibold">{p.label}</p>
                          <p>Import dep: {p.importDependencePct}%</p>
                          <p>Wholesale YoY: {p.wholesaleYoyPct}%</p>
                          <p>Fossil primary: {p.fossilPrimaryPct}%</p>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={exposureScatter} name="Systems">
                    {exposureScatter.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Wholesale shock ladder"
            subtitle="EU/Japan >+30% · US flat · Australia −45%"
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={IMPORT_EXPOSURE.filter((r) => r.wholesaleYoyPct != null)}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="shortLabel"
                    width={80}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip formatter={(v) => `${v}% YoY`} />
                  <Bar dataKey="wholesaleYoyPct" name="Wholesale YoY" radius={[0, 4, 4, 0]}>
                    {IMPORT_EXPOSURE.filter((r) => r.wholesaleYoyPct != null).map(
                      (r) => (
                        <Cell
                          key={r.id}
                          fill={(r.wholesaleYoyPct as number) >= 0 ? ROSE : TEAL}
                        />
                      ),
                    )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "vintage" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Top-1 slope across theme vintages"
            subtitle="Research → Conc 2026 → Q3 conc"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Series"
                value={slopeMetric}
                options={[
                  { id: "elecTop1Pct", label: "Elec" },
                  { id: "lngTop1Pct", label: "LNG" },
                  { id: "demandTop1Pct", label: "TPES" },
                  { id: "solarMfgTop1Pct", label: "Solar mfg" },
                ]}
                onChange={setSlopeMetric}
              />
            </div>
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={VINTAGE_SLOPE}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                  <Line
                    type="monotone"
                    dataKey={slopeMetric}
                    name="Top-1 %"
                    stroke={ROSE}
                    strokeWidth={2}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Multi-series vintage tape"
            subtitle="Elec, LNG, and TPES Top-1 on one board"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={VINTAGE_SLOPE}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                  <Line
                    type="monotone"
                    dataKey="elecTop1Pct"
                    name="Elec Top-1"
                    stroke={ROSE}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lngTop1Pct"
                    name="LNG Top-1"
                    stroke={SKY}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="demandTop1Pct"
                    name="TPES Top-1"
                    stroke={AMBER}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="solarMfgTop1Pct"
                    name="Solar mfg"
                    stroke={TEAL}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
