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
  COAL_ADD_SHARES,
  CONCENTRATION_CURVE,
  DEMAND_PATH,
  ELEC_DEMAND_LADDER,
  FUEL_EXPORT_STACK,
  GROWTH_ADD_SHARES,
  GROWTH_CONCENTRATION_CURVE,
  HEADLINE,
  HHI_BANDS,
  IMPORT_EXPOSURE,
  LENS_LABELS,
  MIX_PATH,
  SOLAR_ADD_SHARES,
  SOURCE_NOTE,
  VINTAGE_DELTAS,
  VINTAGE_SLOPE,
  filterRows,
  fmtHhi,
  fmtPct,
  fmtPp,
  hhiBand,
  lensExposures,
  sortedByMetric,
  type Lens,
} from "@/data/energy-systems-concentration-202608-data";

// viz-types: vintage delta bars, Top-k ladder bars, Lorenz area+line (stock+growth), demand path line, coal/solar add pies+bars, mix path multi-line, fuel export stacks, import×wholesale scatter, clean-inv pie, vintage multi-line, lens avg bars | layout: default

type ViewId = "scoreboard" | "curves" | "paths" | "trade" | "capex";
type Metric = "top1" | "top3" | "hhi" | "delta";
type CurveLens = "stock" | "growth";
type PathPanel = "demand" | "coal" | "solar" | "mix";

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

export function EnergySystemsConcentration202608Dashboard() {
  const [view, setView] = useState<ViewId>("scoreboard");
  const [metric, setMetric] = useState<Metric>("top1");
  const [lens, setLens] = useState<Lens | "all">("all");
  const [curveLens, setCurveLens] = useState<CurveLens>("stock");
  const [pathPanel, setPathPanel] = useState<PathPanel>("demand");
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
              ? (r.deltaVsQ3Pp ?? 0)
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

  const curve = curveLens === "stock" ? CONCENTRATION_CURVE : GROWTH_CONCENTRATION_CURVE;
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
          ? "Δ vs Q3 (pp)"
          : "HHI";

  return (
    <div
      className="space-y-6"
      data-viz="energy-systems-concentration-202608"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Energy systems — late-Aug 202608 concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Top-1 still {HEADLINE.elecTop1Pct}% · Top-3 {HEADLINE.elecTop3Pct}%
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Versus the Q3 concentration print, Ember stock tips are{" "}
          <span className="text-teal-300">carried flat</span> (power Top-1{" "}
          {HEADLINE.elecTop1Pct}%, LNG {HEADLINE.lngTop1Pct}%, solar modules{" "}
          {HEADLINE.solarModuleTop1Pct}%). What Mid-Year adds is the{" "}
          <span className="text-amber-300">path tip</span>: China ~{" "}
          {HEADLINE.growthTop1Pct}% of the TWh add on a{" "}
          {HEADLINE.demandGrowth2026Pct}%/{HEADLINE.demandGrowth2027Pct}% demand
          path, ~{HEADLINE.coalAddTop1Pct}% of the coal{" "}
          {fmtPp(HEADLINE.coalGenYoyPct, 1).replace(" pp", "%")} rebound, and ~
          {HEADLINE.solarAddTop1Pct}% of the ~{HEADLINE.solarAddTwh2026} TWh
          solar add — while EU/Japan wholesale prints{" "}
          <span className="text-rose-300">
            &gt;+{HEADLINE.euJapanWholesaleYoyPct}%
          </span>{" "}
          price the unchanged LNG tip.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Elec Top-1",
              value: fmtPct(HEADLINE.elecTop1Pct, 1),
              sub: `${HEADLINE.elecTop1Label} · Δ ${fmtPp(HEADLINE.elecTop1DeltaPp, 0)}`,
            },
            {
              label: "Elec Top-3",
              value: fmtPct(HEADLINE.elecTop3Pct, 1),
              sub: HEADLINE.elecTop3Labels,
            },
            {
              label: "Coal-add Top-1",
              value: fmtPct(HEADLINE.coalAddTop1Pct),
              sub: HEADLINE.coalAddTop1Label,
            },
            {
              label: "Growth-add Top-1",
              value: fmtPct(HEADLINE.growthTop1Pct),
              sub: HEADLINE.growthTop1Label,
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
            { id: "scoreboard", label: "Scoreboard" },
            { id: "curves", label: "Stock vs growth" },
            { id: "paths", label: "Aug path meters" },
            { id: "trade", label: "Trade & shock" },
            { id: "capex", label: "Capex & vintage" },
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
              { id: "delta", label: "Δ vs Q3" },
            ]}
            onChange={setMetric}
          />
          <ToggleGroup
            label="Lens"
            value={lens}
            options={[
              { id: "all", label: "All" },
              { id: "demand", label: "Demand" },
              { id: "path", label: "Path" },
              { id: "export", label: "Export" },
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

      {view === "scoreboard" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Vintage delta — Q3 → Aug"
            subtitle="Carried stock flats vs new path tips"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={VINTAGE_DELTAS}
                  margin={{ top: 8, right: 12, left: 0, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-28}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v, _n, p) => [
                      `${Number(v)}${(p?.payload as { unit?: string })?.unit === "pp growth" ? " pp growth" : " pp"}`,
                      "Δ",
                    ]}
                  />
                  <Bar dataKey="delta" name="Δ vs Q3" radius={[4, 4, 0, 0]}>
                    {VINTAGE_DELTAS.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title={`${metricLabel} by market`}
            subtitle={`${filtered.length} lenses · sorted descending`}
          >
            <div className="h-[360px] w-full min-w-0">
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

          <ChartCard title="HHI band mix" subtitle="Across filtered lenses">
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hhiDonut}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
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
          </ChartCard>

          <ChartCard
            title="Avg Top-1 by lens family"
            subtitle="Path meters sit beside stock demand"
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={lensBars.map((l) => ({
                    ...l,
                    label: LENS_LABELS[l.lens],
                  }))}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                  <Bar dataKey="avgTop1" fill={VIOLET} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "curves" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <ToggleGroup
              label="Curve"
              value={curveLens}
              options={[
                { id: "stock", label: "Stock (Ember TWh)" },
                { id: "growth", label: "Growth add" },
              ]}
              onChange={setCurveLens}
            />
            <label className="ml-4 inline-flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={showEqual}
                onChange={(e) => setShowEqual(e.target.checked)}
              />
              Equal-split diagonal
            </label>
          </div>
          <ChartCard
            title={
              curveLens === "stock"
                ? "Lorenz — electricity stock"
                : "Lorenz — demand-growth add"
            }
            subtitle={
              curveLens === "stock"
                ? `Top-1 ${HEADLINE.elecTop1Pct}% · Top-3 ${HEADLINE.elecTop3Pct}%`
                : `Top-1 ${HEADLINE.growthTop1Pct}% · Top-3 ${HEADLINE.growthTop3Pct}%`
            }
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={curve}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                  <Area
                    type="monotone"
                    dataKey="sharePct"
                    fill={curveLens === "stock" ? ROSE : AMBER}
                    fillOpacity={0.15}
                    stroke={curveLens === "stock" ? ROSE : AMBER}
                    strokeWidth={2}
                    name="Cumulative %"
                  />
                  {showEqual && (
                    <Line
                      type="monotone"
                      dataKey="equalPct"
                      stroke="#94a3b8"
                      strokeDasharray="4 4"
                      dot={false}
                      name="Equal split"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title={
              curveLens === "stock"
                ? "Country power shares"
                : "Who absorbs the TWh add"
            }
            subtitle={
              curveLens === "stock"
                ? "Ember 2025 census — carried"
                : "IEA MYU 2026e growth geography"
            }
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                {curveLens === "stock" ? (
                  <BarChart
                    data={elecBars}
                    margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                    <Bar
                      dataKey="sharePct"
                      radius={[4, 4, 0, 0]}
                      name="Share %"
                    >
                      {elecBars.map((d) => (
                        <Cell key={d.label} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <BarChart
                    data={GROWTH_ADD_SHARES}
                    margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                    <Bar
                      dataKey="sharePct"
                      radius={[4, 4, 0, 0]}
                      name="Share %"
                    >
                      {GROWTH_ADD_SHARES.map((d) => (
                        <Cell key={d.id} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "paths" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <ToggleGroup
              label="Path panel"
              value={pathPanel}
              options={[
                { id: "demand", label: "Demand path" },
                { id: "coal", label: "Coal rebound" },
                { id: "solar", label: "Solar add" },
                { id: "mix", label: "RE / VRE mix" },
              ]}
              onChange={setPathPanel}
            />
          </div>

          {pathPanel === "demand" && (
            <>
              <ChartCard
                title="World electricity demand path"
                subtitle={`${HEADLINE.demandGrowth2026Pct}% (2026e) → ${HEADLINE.demandGrowth2027Pct}% (2027e)`}
              >
                <div className="h-[320px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={DEMAND_PATH}
                      margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis
                        yAxisId="g"
                        tick={{ fontSize: 11 }}
                        domain={[0, 5]}
                      />
                      <YAxis
                        yAxisId="t"
                        orientation="right"
                        tick={{ fontSize: 11 }}
                        domain={[27000, 32000]}
                      />
                      <Tooltip />
                      <Bar
                        yAxisId="g"
                        dataKey="growthPct"
                        fill={SKY}
                        name="Growth %"
                        radius={[4, 4, 0, 0]}
                      />
                      <Line
                        yAxisId="t"
                        type="monotone"
                        dataKey="twh"
                        stroke={AMBER}
                        strokeWidth={2}
                        name="TWh"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
              <ChartCard
                title="Growth-add shares"
                subtitle={`Top-1 ${HEADLINE.growthTop1Pct}% · Top-3 ${HEADLINE.growthTop3Pct}%`}
              >
                <div className="h-[320px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={GROWTH_ADD_SHARES}
                        dataKey="sharePct"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(props) => {
                          const name = String(props.name ?? "");
                          const pct = Number(props.value ?? 0);
                          return `${name} ${pct}%`;
                        }}
                      >
                        {GROWTH_ADD_SHARES.map((d) => (
                          <Cell key={d.id} fill={d.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => fmtPct(Number(v))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </>
          )}

          {pathPanel === "coal" && (
            <>
              <ChartCard
                title="Who owns the +1.4% coal rebound"
                subtitle={`Top-1 ${HEADLINE.coalAddTop1Pct}% · Top-3 ~${HEADLINE.coalAddTop3Pct}%`}
              >
                <div className="h-[320px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={COAL_ADD_SHARES}
                        dataKey="sharePct"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={100}
                      >
                        {COAL_ADD_SHARES.map((d) => (
                          <Cell key={d.id} fill={d.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => fmtPct(Number(v))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
              <ChartCard
                title="Coal-add ladder"
                subtitle="Estimated share of global coal TWh add"
              >
                <div className="h-[320px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={COAL_ADD_SHARES}
                      layout="vertical"
                      margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis
                        type="category"
                        dataKey="label"
                        width={90}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip formatter={(v) => fmtPct(Number(v))} />
                      <Bar dataKey="sharePct" radius={[0, 4, 4, 0]}>
                        {COAL_ADD_SHARES.map((d) => (
                          <Cell key={d.id} fill={d.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </>
          )}

          {pathPanel === "solar" && (
            <>
              <ChartCard
                title="Solar generation add ~610 TWh"
                subtitle={`China ~${HEADLINE.solarAddTop1Pct}% of the increase`}
              >
                <div className="h-[320px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={SOLAR_ADD_SHARES}
                      margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(v, name) =>
                          name === "twh"
                            ? `${Number(v)} TWh`
                            : fmtPct(Number(v))
                        }
                      />
                      <Bar dataKey="sharePct" name="Share %" radius={[4, 4, 0, 0]}>
                        {SOLAR_ADD_SHARES.map((d) => (
                          <Cell key={d.id} fill={d.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
              <ChartCard
                title="Solar add TWh by region"
                subtitle="Near-record repeat after Ember’s +636 TWh 2025"
              >
                <div className="h-[320px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={SOLAR_ADD_SHARES}
                      margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v) => `${Number(v)} TWh`} />
                      <Bar dataKey="twh" name="TWh" fill={TEAL} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </>
          )}

          {pathPanel === "mix" && (
            <div className="lg:col-span-2">
              <ChartCard
                title="Renewables / VRE / coal share path"
                subtitle="Mix greening ≠ geographic deconcentration"
              >
                <div className="h-[360px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={MIX_PATH}
                      margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} domain={[15, 40]} />
                      <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                      <Line
                        type="monotone"
                        dataKey="renewPct"
                        stroke={TEAL}
                        strokeWidth={2}
                        name="Renewables %"
                      />
                      <Line
                        type="monotone"
                        dataKey="vrePct"
                        stroke={SKY}
                        strokeWidth={2}
                        name="VRE %"
                      />
                      <Line
                        type="monotone"
                        dataKey="coalPct"
                        stroke={ROSE}
                        strokeWidth={2}
                        name="Coal %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>
          )}
        </div>
      )}

      {view === "trade" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Fuel export Top-1 / Top-2 / Top-3"
            subtitle="Carried stacks — Mid-Year prices LNG, does not rewrite shares"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={exportStack}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="fuel" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="top1" stackId="a" fill={ROSE} name="Top-1" />
                  <Bar dataKey="top2" stackId="a" fill={AMBER} name="Top-2" />
                  <Bar dataKey="top3" stackId="a" fill={SKY} name="Top-3" />
                  <Bar dataKey="rest" stackId="a" fill="#cbd5e1" name="Rest" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Import dependence × wholesale YoY"
            subtitle="Q2 2026 spot averages — LNG tip priced into bills"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Import dep %"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Wholesale YoY %"
                    tick={{ fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) =>
                      name === "z" ? String(v) : `${Number(v)}%`
                    }
                    labelFormatter={(_, p) =>
                      (p?.[0]?.payload as { shortLabel?: string })?.shortLabel ??
                      ""
                    }
                  />
                  <Scatter data={exposureScatter} fill={VIOLET}>
                    {exposureScatter.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "capex" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Clean investment geography"
            subtitle={`$${HEADLINE.cleanInvTn}T clean · Top-1 ${HEADLINE.cleanInvTop1Pct}% China (carried WEI)`}
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CLEAN_INV_SHARES}
                    dataKey="sharePct"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={100}
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
            title="Vintage slope — Top-1 meters"
            subtitle="Research → Conc 2026 → Q3 → Aug"
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
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={VINTAGE_SLOPE}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                  <Line
                    type="monotone"
                    dataKey={slopeMetric}
                    stroke={ROSE}
                    strokeWidth={2}
                    name="Top-1 %"
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
