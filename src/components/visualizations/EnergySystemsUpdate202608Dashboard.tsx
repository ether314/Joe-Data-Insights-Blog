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
  CHINA_FUEL,
  DEMAND_PATH,
  FLEX_BUBBLES,
  FUEL_OUTLOOK,
  HEADLINE,
  REGION_DEMAND,
  SHARE_PATH,
  SOURCE_NOTE,
  SOURCES,
  WHOLESALE,
  fmtPct,
  fmtPp,
  fmtTwh,
  vintageByLens,
  wholesaleByExposure,
  type RegionId,
  type VintageDeltaRow,
  type WholesaleRow,
} from "@/data/energy-systems-update-202608-data";

// viz-types: demand path composed, regional grouped bars, fuel outlook diverging, share area, wholesale bars, flex scatter | layout: default
// viz-plan: IEA MYU vs Ember/WEI vintage; coal rebound + demand accel; panel + region + lens + exposure controls; no KPI+bar clone

type Panel = "demand" | "regions" | "fuels" | "shares" | "prices" | "flex";
type RegionFilter = RegionId | "all";
type LensFilter = VintageDeltaRow["lens"] | "all";
type ExposureFilter = WholesaleRow["lngExposure"] | "all";

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
                ? "bg-slate-800 text-white"
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

export function EnergySystemsUpdate202608Dashboard() {
  const [panel, setPanel] = useState<Panel>("demand");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [lens, setLens] = useState<LensFilter>("all");
  const [exposure, setExposure] = useState<ExposureFilter>("all");

  const regionRows = useMemo(() => {
    if (region === "all") return REGION_DEMAND.filter((r) => r.id !== "world");
    return REGION_DEMAND.filter((r) => r.id === region);
  }, [region]);

  const wholesaleRows = useMemo(
    () => wholesaleByExposure(exposure),
    [exposure],
  );

  const deltaRows = useMemo(() => vintageByLens(lens), [lens]);

  const fuelChart = useMemo(
    () =>
      FUEL_OUTLOOK.map((f) => ({
        ...f,
        g26: f.growth2026Pct,
        g27: f.growth2027Pct,
      })),
    [],
  );

  const demandChart = useMemo(
    () =>
      DEMAND_PATH.map((d) => ({
        year: String(d.year),
        growthPct: d.growthPct,
        twh: d.twh,
      })),
    [],
  );

  const shareChart = useMemo(
    () =>
      SHARE_PATH.map((s) => ({
        year: String(s.year),
        renewPct: s.renewPct,
        vrePct: s.vrePct,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="energy-systems-update-202608"
      data-testid="energy-systems-update-202608-dashboard"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-300/90">
          August 2026 vintage · IEA Electricity Mid-Year Update vs Ember/WEI lens
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200">
          Demand accelerates to{" "}
          <span className="font-semibold text-white">
            {HEADLINE.demandGrowth2026Pct}% / {HEADLINE.demandGrowth2027Pct}%
          </span>{" "}
          while renewables widen to{" "}
          <span className="font-semibold text-emerald-300">
            {HEADLINE.renewShare2027Pct}%
          </span>{" "}
          by 2027 — but coal generation rebounds{" "}
          <span className="font-semibold text-amber-300">
            {fmtPct(HEADLINE.coalGenGrowth2026Pct)}
          </span>{" "}
          on Hormuz-driven gas-to-coal switching (vs Ember&apos;s 2025 fossil halt).
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-300">
          <span className="rounded-full bg-white/10 px-3 py-1">
            World demand → {fmtTwh(HEADLINE.demandTwh2027)} (2027e)
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1">
            VRE share {HEADLINE.vreShare2025Pct}% → {HEADLINE.vreShare2027Pct}%
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1">
            Solar +{HEADLINE.solarAdd2026Twh} TWh (2026e)
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1">
            Power CO₂ {fmtPct(HEADLINE.powerCo2Growth2026Pct)} then flat
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={panel}
          onChange={setPanel}
          options={[
            { id: "demand", label: "Demand path" },
            { id: "regions", label: "Regions" },
            { id: "fuels", label: "Fuel outlook" },
            { id: "shares", label: "RE / VRE shares" },
            { id: "prices", label: "Wholesale" },
            { id: "flex", label: "Flexibility" },
          ]}
        />
        <div className="flex flex-wrap gap-3">
          {(panel === "regions" || panel === "demand") && (
            <ToggleGroup
              label="Region"
              value={region}
              onChange={setRegion}
              options={[
                { id: "all", label: "All majors" },
                { id: "china", label: "China" },
                { id: "india", label: "India" },
                { id: "us", label: "US" },
                { id: "eu", label: "EU" },
              ]}
            />
          )}
          {(panel === "fuels" || panel === "shares") && (
            <ToggleGroup
              label="Delta lens"
              value={lens}
              onChange={setLens}
              options={[
                { id: "all", label: "All meters" },
                { id: "demand", label: "Demand" },
                { id: "mix", label: "Mix" },
                { id: "fossil", label: "Fossil" },
                { id: "emissions", label: "CO₂" },
                { id: "price", label: "Price" },
              ]}
            />
          )}
          {(panel === "prices" || panel === "flex") && (
            <ToggleGroup
              label="LNG exposure"
              value={exposure}
              onChange={setExposure}
              options={[
                { id: "all", label: "All markets" },
                { id: "high", label: "High" },
                { id: "low", label: "Low" },
                { id: "buffered", label: "Buffered" },
              ]}
            />
          )}
        </div>
      </div>

      {panel === "demand" && (
        <ChartCard
          title="Demand path — growth accelerates through 2027"
          subtitle="IEA MYU: 3% (2025) → 3.6% (2026e) → 3.8% (2027e); consumption to 30,700 TWh"
        >
          <div className="h-[340px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={demandChart} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis
                  yAxisId="g"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 5]}
                />
                <YAxis
                  yAxisId="t"
                  orientation="right"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "growthPct") return [`${value}%`, "YoY growth"];
                    if (name === "twh" && value != null)
                      return [fmtTwh(Number(value)), "Consumption"];
                    return [String(value ?? "—"), String(name)];
                  }}
                />
                <Bar
                  yAxisId="g"
                  dataKey="growthPct"
                  name="growthPct"
                  fill="#0d9488"
                  radius={[6, 6, 0, 0]}
                  barSize={48}
                />
                <Line
                  yAxisId="t"
                  type="monotone"
                  dataKey="twh"
                  name="twh"
                  stroke="#f8fafc"
                  strokeWidth={0}
                  dot={false}
                  connectNulls={false}
                />
                <Line
                  yAxisId="t"
                  type="monotone"
                  dataKey="twh"
                  name="twh"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 5, fill: "#f59e0b" }}
                  connectNulls
                />
                <ReferenceLine
                  yAxisId="g"
                  y={HEADLINE.demandGrowth2025Pct}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  label={{ value: "2025 base", fill: "#94a3b8", fontSize: 11 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Amber markers show disclosed TWh levels (2025 and 2027e). Growth bars
            are the live vintage signal versus the Q3 Ember census year.
          </p>
        </ChartCard>
      )}

      {panel === "regions" && (
        <ChartCard
          title="Regional demand — India rebound, China accelerates"
          subtitle="Grouped YoY: 2025 actual vs 2026e (and 2027e where disclosed)"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={regionRows}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="short" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${Number(value).toFixed(1)}%`,
                    name === "growth2025Pct"
                      ? "2025"
                      : name === "growth2026Pct"
                        ? "2026e"
                        : "2027e",
                  ]}
                />
                <Bar dataKey="growth2025Pct" name="growth2025Pct" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="growth2026Pct" name="growth2026Pct" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="growth2027Pct" name="growth2027Pct" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {region === "china" && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-slate-800">
                China fuel generation growth (IEA MYU)
              </p>
              <div className="h-[220px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={CHINA_FUEL}
                    layout="vertical"
                    margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="short" width={56} tick={{ fill: "#64748b", fontSize: 11 }} />
                    <Tooltip formatter={(v) => [`${Number(v).toFixed(1)}%`, "2026e"]} />
                    <Bar dataKey="growth2026Pct" radius={[0, 4, 4, 0]}>
                      {CHINA_FUEL.map((r) => (
                        <Cell key={r.id} fill={r.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </ChartCard>
      )}

      {panel === "fuels" && (
        <ChartCard
          title="Fuel outlook — coal rebound vs renewables surge"
          subtitle="2026e vs 2027e generation growth; coal +1.4% rewrites Ember’s 2025 fossil halt"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={fuelChart}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[-5, 30]}
                />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={64}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Tooltip
                  formatter={(value, name) => [
                    `${Number(value).toFixed(1)}%`,
                    name === "g26" ? "2026e" : "2027e",
                  ]}
                />
                <Bar dataKey="g26" name="g26" fill="#0f766e" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="g27" name="g27" fill="#fbbf24" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-xs text-slate-700">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2 pr-3 font-semibold">Meter</th>
                  <th className="py-2 pr-3 font-semibold">Prior (Q3)</th>
                  <th className="py-2 pr-3 font-semibold">IEA MYU</th>
                  <th className="py-2 font-semibold">Δ</th>
                </tr>
              </thead>
              <tbody>
                {deltaRows.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100">
                    <td className="py-2 pr-3 font-medium">{r.meter}</td>
                    <td className="py-2 pr-3">{r.prior}</td>
                    <td className="py-2 pr-3">{r.newest}</td>
                    <td className="py-2 text-teal-800">{r.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}

      {panel === "shares" && (
        <ChartCard
          title="Renewables & VRE shares — lead widens through 2027"
          subtitle="All-RE 33%→37%; solar+wind 17%→21% (IEA MYU disclosed endpoints)"
        >
          <div className="h-[340px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={shareChart} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[10, 40]}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${value}%`,
                    name === "renewPct" ? "All renewables" : "VRE (solar+wind)",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="renewPct"
                  name="renewPct"
                  stroke="#22c55e"
                  fill="#22c55e33"
                  strokeWidth={2.5}
                />
                <Area
                  type="monotone"
                  dataKey="vrePct"
                  name="vrePct"
                  stroke="#14b8a6"
                  fill="#14b8a633"
                  strokeWidth={2}
                />
                <ReferenceLine
                  y={33}
                  stroke="#374151"
                  strokeDasharray="4 4"
                  label={{ value: "Coal ~33% (2025 parity)", fill: "#64748b", fontSize: 11 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Ember&apos;s 2025 census refined the crossover to{" "}
            {HEADLINE.priorRenewSharePct}% vs {HEADLINE.priorCoalSharePct}%. IEA
            MYU keeps the parity framing at ~33% and projects the renewables lead
            widening {fmtPp(HEADLINE.renewShare2027Pct - HEADLINE.renewShare2025Pct)}{" "}
            by 2027.
          </p>
        </ChartCard>
      )}

      {panel === "prices" && (
        <ChartCard
          title="Wholesale electricity — LNG exposure splits the shock"
          subtitle="Q2 2026 spot YoY; Hormuz cut ~20% of global LNG supply"
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={wholesaleRows}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[-50, 40]}
                />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={56}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Tooltip
                  formatter={(value) => [fmtPct(Number(value), 0), "Q2 wholesale YoY"]}
                />
                <Bar dataKey="yoyPct" radius={[0, 4, 4, 0]}>
                  {wholesaleRows.map((r) => (
                    <Cell
                      key={r.id}
                      fill={r.yoyPct >= 0 ? "#dc2626" : "#16a34a"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-1 text-xs text-slate-600">
            {wholesaleRows.map((r) => (
              <li key={r.id}>
                <span className="font-semibold text-slate-800">{r.label}:</span>{" "}
                {r.note}
              </li>
            ))}
          </ul>
        </ChartCard>
      )}

      {panel === "flex" && (
        <ChartCard
          title="Flexibility stress — negative-price hours vs wholesale shock"
          subtitle="Bubble size ≈ market weight; X = H1 2026 negative-price share; Y = AU/EU wholesale context"
        >
          <div className="h-[340px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Neg-price %"
                  unit="%"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  label={{
                    value: "Negative-price hours (H1 2026, %)",
                    position: "insideBottom",
                    offset: -4,
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Wholesale proxy"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  label={{
                    value: "Wholesale YoY context (%)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[80, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    if (name === "x") return [`${value}%`, "Neg-price share"];
                    if (name === "y") return [`${value}%`, "Wholesale context"];
                    return [String(value), String(name)];
                  }}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.label ?? "Market"
                  }
                />
                <Scatter data={FLEX_BUBBLES} name="markets">
                  {FLEX_BUBBLES.map((b) => (
                    <Cell key={b.id} fill={b.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Spain&apos;s negative-price hours rose to 17% (from 10%); Nordics fell to
            2% as flexibility improved. June EU heatwaves saw midday–evening spreads
            near $600/MWh — the storage / demand-response value signal.
          </p>
        </ChartCard>
      )}

      <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
        <p className="font-semibold text-slate-800">Sources & methodology</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                className="text-teal-800 underline-offset-2 hover:underline"
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
