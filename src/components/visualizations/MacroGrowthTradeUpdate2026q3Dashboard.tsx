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
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  CPB_MONTHLY,
  CPB_PHASE_COLORS,
  ECONOMIES,
  ECONOMY_COLORS,
  HEADLINE,
  METER_COLORS,
  PRICE_BRIDGE,
  REGION_COLORS,
  SOURCE_NOTE,
  SOURCES,
  TRIAD_TRACK,
  US_DUAL_PATH,
  cpbCumulative,
  economyGaps,
  fmtPct,
  fmtPp,
  growthPriceScatter,
} from "@/data/macro-growth-trade-update-2026q3-data";

// viz-types: CPB MoM area, forecast-vs-print gap bars, US GDP×PCE composed, triad track bars, growth×price scatter | layout: default
// viz-plan: monthly trade rebound path; Q2 print gaps vs July IMF; US dual-axis; triad tracking; scatter; region + meter + window controls

type RegionFilter = "All" | "Americas" | "Europe" | "Asia";
type MeterFocus = "all" | "gdp" | "trade" | "cpi";
type CpbWindow = "all" | "shock" | "rebound";
type GapMode = "gap" | "levels";

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

function ToggleGroup<T extends string | number>({
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
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={String(o.id)}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              on ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function MacroGrowthTradeUpdate2026q3Dashboard() {
  const [region, setRegion] = useState<RegionFilter>("All");
  const [meter, setMeter] = useState<MeterFocus>("all");
  const [cpbWindow, setCpbWindow] = useState<CpbWindow>("all");
  const [gapMode, setGapMode] = useState<GapMode>("gap");

  const cpbData = useMemo(() => {
    if (cpbWindow === "all") return CPB_MONTHLY;
    if (cpbWindow === "shock") return CPB_MONTHLY.filter((m) => m.phase !== "pre-shock");
    return CPB_MONTHLY.filter((m) => m.phase === "rebound");
  }, [cpbWindow]);

  const gaps = useMemo(() => {
    const all = economyGaps();
    return region === "All" ? all : all.filter((g) => g.region === region);
  }, [region]);

  const gapBars = useMemo(
    () =>
      gaps.map((g) => ({
        short: g.short,
        name: g.name,
        value: gapMode === "gap" ? g.gapPp : g.print,
        imprint: g.print,
        imf: g.imf,
        unit: g.imprintUnit,
        fill: g.fill,
      })),
    [gaps, gapMode],
  );

  const triadBars = useMemo(() => {
    const rows = meter === "all" ? TRIAD_TRACK : TRIAD_TRACK.filter((t) => t.meter === meter);
    return rows.map((t) => ({
      label: t.label,
      gap: t.gapPp,
      july: t.julyPath,
      hard: t.hardSignal,
      signal: t.signalLabel,
      fill: METER_COLORS[t.meter],
      tilt: t.tilt,
    }));
  }, [meter]);

  const scatter = useMemo(() => growthPriceScatter(), []);

  const q1q2Slope = useMemo(() => {
    const rows = region === "All" ? ECONOMIES : ECONOMIES.filter((e) => e.region === region);
    return rows.map((e) => ({
      short: e.short,
      name: e.name,
      q1: e.q1Print,
      q2: e.q2Print,
      fill: ECONOMY_COLORS[e.id],
      unit: e.q2Unit.toUpperCase(),
    }));
  }, [region]);

  const marMayCum = cpbCumulative(2);

  return (
    <div className="space-y-6" data-viz="macro-growth-trade-update-2026q3">
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Hard-data check — Jul 2026 IMF baseline → Q3 outturns
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          CPB May trade {fmtPct(HEADLINE.cpbMayMom)} MoM · US Q2 GDP {fmtPct(HEADLINE.usGdpQ2Saar)}{" "}
          SAAR · PCE {fmtPct(HEADLINE.usPceQ2Saar)}
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Merchandise volumes recovered for a second month after March&apos;s {fmtPct(HEADLINE.cpbMarMom)}{" "}
          war shock (Mar–May chain ≈ {fmtPct(marMayCum)}). US growth slips below the July IMF{" "}
          {fmtPct(HEADLINE.imfUsGdp2026)} annual path while headline PCE stays hot; euro-area Q2 rebounds{" "}
          {fmtPct(HEADLINE.eaGdpQ2Qoq)} QoQ after a flat Q1.
        </p>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
          <ToggleGroup
            label="Region"
            value={region}
            options={[
              { id: "All" as RegionFilter, label: "All" },
              { id: "Americas" as RegionFilter, label: "Americas" },
              { id: "Europe" as RegionFilter, label: "Europe" },
              { id: "Asia" as RegionFilter, label: "Asia" },
            ]}
            onChange={setRegion}
          />
          <ToggleGroup
            label="Meter"
            value={meter}
            options={[
              { id: "all" as MeterFocus, label: "All" },
              { id: "trade" as MeterFocus, label: "Trade" },
              { id: "gdp" as MeterFocus, label: "GDP" },
              { id: "cpi" as MeterFocus, label: "Prices" },
            ]}
            onChange={setMeter}
          />
          <ToggleGroup
            label="CPB window"
            value={cpbWindow}
            options={[
              { id: "all" as CpbWindow, label: "Jan–May" },
              { id: "shock" as CpbWindow, label: "Shock+" },
              { id: "rebound" as CpbWindow, label: "Rebound" },
            ]}
            onChange={setCpbWindow}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="CPB merchandise volume — monthly MoM"
          subtitle="World trade monitor path into the May print (post–July IMF)"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpbData} margin={{ left: 4, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={["auto", "auto"]}
                />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0]?.payload as (typeof CPB_MONTHLY)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <p className="font-semibold text-slate-900">{p.month}</p>
                        <p className="text-slate-600">{fmtPct(p.mom)} MoM · {p.phase}</p>
                        {p.note && <p className="mt-1 text-slate-500">{p.note}</p>}
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="mom"
                  name="MoM %"
                  stroke="#0f172a"
                  fill="#99f6e4"
                  fillOpacity={0.45}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
            {(Object.keys(CPB_PHASE_COLORS) as Array<keyof typeof CPB_PHASE_COLORS>).map((k) => (
              <span key={k} className="inline-flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: CPB_PHASE_COLORS[k] }} />
                {k}
              </span>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="Triad tracking — July path vs hard signal"
          subtitle="Positive gap = harder / hotter than the July baseline meter shown"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={triadBars} margin={{ left: 8, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit=" pp" />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = sortTooltipPayload(payload)[0]?.payload as (typeof triadBars)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <p className="font-semibold text-slate-900">{p.label}</p>
                        <p className="text-slate-600">
                          July {p.july}% · {p.signal} {p.hard}% · gap {fmtPp(p.gap)} ({p.tilt})
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="gap" name="Gap vs July" radius={[4, 4, 0, 0]}>
                  {triadBars.map((d) => (
                    <Cell key={d.label} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="US growth × prices — dual path into Q2"
        subtitle="BEA advance: GDP SAAR vs PCE / core PCE SAAR"
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={US_DUAL_PATH} margin={{ left: 4, right: 12, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
                label={{ value: "GDP", angle: -90, position: "insideLeft", fontSize: 10 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
                label={{ value: "PCE", angle: 90, position: "insideRight", fontSize: 10 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const p = payload[0]?.payload as (typeof US_DUAL_PATH)[0];
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                      <p className="font-semibold text-slate-900">{p.quarter}</p>
                      <p className="text-slate-600">GDP {fmtPct(p.gdpSaar)} SAAR</p>
                      <p className="text-slate-600">PCE {fmtPct(p.pceSaar)} · core {fmtPct(p.corePceSaar)}</p>
                    </div>
                  );
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="gdpSaar" name="GDP SAAR" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="pceSaar"
                name="PCE SAAR"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="corePceSaar"
                name="Core PCE SAAR"
                stroke="#f43f5e"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Q2 print vs July IMF annual path"
          subtitle={gapMode === "gap" ? "Print − IMF 2026f (pp); QoQ×4 for sequential economies" : "Comparable print level"}
        >
          <div className="mb-3">
            <ToggleGroup
              label="View"
              value={gapMode}
              options={[
                { id: "gap" as GapMode, label: "Gap pp" },
                { id: "levels" as GapMode, label: "Print level" },
              ]}
              onChange={setGapMode}
            />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gapBars} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} unit={gapMode === "gap" ? " pp" : "%"} />
                <YAxis type="category" dataKey="short" width={36} tick={{ fontSize: 11 }} />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = sortTooltipPayload(payload)[0]?.payload as (typeof gapBars)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <p className="font-semibold text-slate-900">{p.name}</p>
                        <p className="text-slate-600">
                          Print {p.imprint.toFixed(1)}% ({p.unit}) · IMF {p.imf.toFixed(1)}% · gap{" "}
                          {fmtPp(p.imprint - p.imf)}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {gapBars.map((d) => (
                    <Cell key={d.short} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Q1 → Q2 slope (same unit per economy)"
          subtitle="Filter by region — units differ (SAAR / QoQ / YoY)"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={q1q2Slope} margin={{ left: 4, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0]?.payload as (typeof q1q2Slope)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <p className="font-semibold text-slate-900">{p.name}</p>
                        <p className="text-slate-600">
                          Q1 {p.q1.toFixed(1)}% → Q2 {p.q2.toFixed(1)}% ({p.unit})
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="q1" name="Q1" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="q2" name="Q2" radius={[4, 4, 0, 0]} maxBarSize={28}>
                  {q1q2Slope.map((d) => (
                    <Cell key={d.short} fill={d.fill} />
                  ))}
                </Bar>
                <Legend />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Growth × price scatter (disclosed)"
          subtitle="US Q2 GDP SAAR vs PCE SAAR — expand as more CPI vintages clear"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: 8, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="growth"
                  name="Growth"
                  tick={{ fontSize: 11 }}
                  unit="%"
                  domain={[0, "auto"]}
                />
                <YAxis
                  type="number"
                  dataKey="price"
                  name="Price"
                  tick={{ fontSize: 11 }}
                  unit="%"
                  domain={[0, "auto"]}
                />
                <ZAxis type="number" dataKey="growth" range={[120, 280]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0]?.payload as ReturnType<typeof growthPriceScatter>[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <p className="font-semibold text-slate-900">{p.name}</p>
                        <p className="text-slate-600">
                          Growth {p.growth.toFixed(1)}% ({p.growthLabel}) · {p.priceLabel}{" "}
                          {p.price.toFixed(1)}%
                        </p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatter} name="Q2">
                  {scatter.map((d) => (
                    <Cell key={d.id} fill={d.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          {scatter.length < 2 && (
            <p className="mt-2 text-xs text-slate-500">
              Only economies with disclosed Q2 price meters are plotted — currently the US PCE pair.
            </p>
          )}
        </ChartCard>

        <ChartCard title="Price impulse bridge" subtitle="July oil assumption alongside US Q2 deflators">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PRICE_BRIDGE} margin={{ left: 8, right: 12, top: 8, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} angle={-18} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0]?.payload as (typeof PRICE_BRIDGE)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <p className="font-semibold text-slate-900">{p.label}</p>
                        <p className="text-slate-600">
                          {p.value} {p.unit}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {PRICE_BRIDGE.map((d) => (
                    <Cell
                      key={d.label}
                      fill={
                        d.kind === "oil" ? "#f59e0b" : d.kind === "core" ? "#f43f5e" : d.kind === "def" ? "#8b5cf6" : "#0ea5e9"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Oil is $/bbl; PCE meters are % SAAR — compare directionally, not on a shared axis scale.
          </p>
        </ChartCard>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a className="text-cyan-700 underline-offset-2 hover:underline" href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex flex-wrap gap-3">
          {(Object.keys(REGION_COLORS) as Array<keyof typeof REGION_COLORS>).map((r) => (
            <span key={r} className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: REGION_COLORS[r] }} />
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
