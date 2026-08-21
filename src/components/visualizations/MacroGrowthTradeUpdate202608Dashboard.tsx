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
  ECONOMY_COLORS,
  HEADLINE,
  METER_COLORS,
  PHASE_COLORS,
  PRICE_COMPONENTS,
  PRICE_PATH_NOTE,
  REGION_COLORS,
  SOURCE_NOTE,
  SOURCES,
  TRIAD_TRACK,
  UNIT_BRIDGE,
  US_PRICE_PATH,
  VINTAGE_DELTAS,
  fmtPct,
  fmtPp,
  growthPriceScatter,
  inflationDeltas,
} from "@/data/macro-growth-trade-update-202608-data";

// viz-types: US CPI×PCE composed path, MoM inflation delta bars, SAAR-vs-YoY unit bridge, triad track, energy×core component bars, growth×price scatter | layout: default
// viz-plan: Aug monthly price vintage vs Q3 SAAR; CPI/PCE cooling path; EA divergence; held trade/GDP; region + series + meter + bridge controls

type RegionFilter = "All" | "Americas" | "Europe" | "Asia";
type MeterFocus = "all" | "gdp" | "trade" | "cpi";
type SeriesFocus = "headline" | "core" | "both";
type BridgeMode = "units" | "components";

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

export function MacroGrowthTradeUpdate202608Dashboard() {
  const [region, setRegion] = useState<RegionFilter>("All");
  const [meter, setMeter] = useState<MeterFocus>("all");
  const [series, setSeries] = useState<SeriesFocus>("both");
  const [bridge, setBridge] = useState<BridgeMode>("units");

  const pricePath = useMemo(() => US_PRICE_PATH, []);

  const deltas = useMemo(() => {
    const all = inflationDeltas();
    return region === "All" ? all : all.filter((d) => d.region === region);
  }, [region]);

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

  const vintageRows = useMemo(() => {
    const rows = meter === "all" ? VINTAGE_DELTAS : VINTAGE_DELTAS.filter((v) => v.meter === meter);
    return rows.map((v) => ({
      ...v,
      fill: METER_COLORS[v.meter],
      chartDelta: v.deltaPp ?? 0,
    }));
  }, [meter]);

  const components = useMemo(() => {
    if (region === "Americas") return PRICE_COMPONENTS.filter((c) => c.economy === "US");
    if (region === "Europe") return PRICE_COMPONENTS.filter((c) => c.economy === "EA");
    if (region === "Asia") return PRICE_COMPONENTS.filter((c) => c.economy === "US");
    return PRICE_COMPONENTS;
  }, [region]);

  const scatter = useMemo(() => growthPriceScatter(), []);

  const cpbHeld = useMemo(
    () => CPB_MONTHLY.filter((m) => m.mom != null).map((m) => ({ ...m, mom: m.mom as number })),
    [],
  );

  return (
    <div className="space-y-6" data-viz="macro-growth-trade-update-202608">
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Aug 202608 vintage · vs Q3 hard-data check
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          US CPI {HEADLINE.usCpiJulYoy}% YoY ({fmtPp(HEADLINE.cpiDeltaVsJunPp)}) · PCE{" "}
          {HEADLINE.usPceJunYoy}% YoY ({fmtPp(HEADLINE.pceDeltaVsMayPp)}) · EA HICP{" "}
          {HEADLINE.eaHicpJulYoy}%
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Monthly YoY prices cool toward the July IMF US CPI path of {HEADLINE.imfUsCpi2026}% even as
          the Q3 desk&apos;s Q2 PCE SAAR of {fmtPct(HEADLINE.usPceQ2Saar)} stays hot. Trade and GDP
          meters are held (CPB May {fmtPct(HEADLINE.cpbMayMom)} MoM; US Q2 {fmtPct(HEADLINE.usGdpQ2Saar)}{" "}
          SAAR) pending 25–26 Aug releases.
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
              { id: "cpi" as MeterFocus, label: "Prices" },
              { id: "gdp" as MeterFocus, label: "GDP" },
              { id: "trade" as MeterFocus, label: "Trade" },
            ]}
            onChange={setMeter}
          />
          <ToggleGroup
            label="Series"
            value={series}
            options={[
              { id: "both" as SeriesFocus, label: "CPI+PCE" },
              { id: "headline" as SeriesFocus, label: "Headline" },
              { id: "core" as SeriesFocus, label: "Core" },
            ]}
            onChange={setSeries}
          />
          <ToggleGroup
            label="Bridge"
            value={bridge}
            options={[
              { id: "units" as BridgeMode, label: "SAAR↔YoY" },
              { id: "components" as BridgeMode, label: "Energy/core" },
            ]}
            onChange={setBridge}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="US CPI × PCE — monthly YoY path"
          subtitle="Cooling into July CPI / June PCE after the spring energy pulse"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={pricePath} margin={{ left: 4, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[2, 4.5]} />
                <ReferenceLine
                  y={HEADLINE.imfUsCpi2026}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  label={{ value: "IMF 3.6%", fill: "#64748b", fontSize: 10 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0]?.payload as (typeof US_PRICE_PATH)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <p className="font-semibold text-slate-900">{p.month}</p>
                        <p className="text-slate-600">CPI {p.cpiYoy}% · core {p.cpiCoreYoy}%</p>
                        {p.pceYoy != null && (
                          <p className="text-slate-600">
                            PCE {p.pceYoy}% · core {p.pceCoreYoy}%
                          </p>
                        )}
                        <p className="mt-1 text-slate-500">{p.phase}</p>
                      </div>
                    );
                  }}
                />
                <Legend />
                {(series === "both" || series === "headline") && (
                  <Area
                    type="monotone"
                    dataKey="cpiYoy"
                    name="CPI YoY"
                    stroke="#0ea5e9"
                    fill="#bae6fd"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                )}
                {(series === "both" || series === "headline") && (
                  <Line
                    type="monotone"
                    dataKey="pceYoy"
                    name="PCE YoY"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    connectNulls={false}
                  />
                )}
                {series === "core" && (
                  <Area
                    type="monotone"
                    dataKey="cpiCoreYoy"
                    name="Core CPI"
                    stroke="#14b8a6"
                    fill="#99f6e4"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                )}
                {series === "core" && (
                  <Line
                    type="monotone"
                    dataKey="pceCoreYoy"
                    name="Core PCE"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    connectNulls={false}
                  />
                )}
                {series === "both" && (
                  <Line
                    type="monotone"
                    dataKey="cpiCoreYoy"
                    name="Core CPI"
                    stroke="#64748b"
                    strokeDasharray="4 3"
                    strokeWidth={1.5}
                    dot={false}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">{PRICE_PATH_NOTE}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
            {(Object.keys(PHASE_COLORS) as Array<keyof typeof PHASE_COLORS>).map((k) => (
              <span key={k} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ background: PHASE_COLORS[k] }}
                />
                {k}
              </span>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="July vs June inflation — MoM vintage deltas"
          subtitle="Positive = July YoY hotter than June; US cools, several EA members reheat"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deltas} margin={{ left: 8, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit=" pp" />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = sortTooltipPayload(payload)[0]?.payload as (typeof deltas)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <p className="font-semibold text-slate-900">{p.name}</p>
                        <p className="text-slate-600">
                          Jul {p.jul}% → Jun {p.jun}% · Δ {fmtPp(p.delta)} ({p.measure})
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="delta" name="Jul−Jun pp" radius={[4, 4, 0, 0]}>
                  {deltas.map((d) => (
                    <Cell key={d.short} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
            {(Object.keys(REGION_COLORS) as Array<keyof typeof REGION_COLORS>).map((k) => (
              <span key={k} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ background: REGION_COLORS[k] }}
                />
                {k}
              </span>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title={
            bridge === "units"
              ? "Unit bridge — Q2 SAAR vs monthly YoY"
              : "Energy vs core — US and euro area"
          }
          subtitle={
            bridge === "units"
              ? "Why the Q3 hotter-PCE story and Aug cooler-YoY story can both be true"
              : "Energy still dominates headline; core sits near 2.5% on both sides of the Atlantic"
          }
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {bridge === "units" ? (
                <BarChart data={UNIT_BRIDGE} margin={{ left: 8, right: 12, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} angle={-12} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const p = payload[0]?.payload as (typeof UNIT_BRIDGE)[0];
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                          <p className="font-semibold text-slate-900">{p.label}</p>
                          <p className="text-slate-600">
                            {p.value}
                            {p.unit} · {p.vintage}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="value" name="Level" radius={[4, 4, 0, 0]}>
                    {UNIT_BRIDGE.map((d) => (
                      <Cell key={d.label} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <BarChart data={components} margin={{ left: 8, right: 12, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} angle={-18} textAnchor="end" height={70} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const p = payload[0]?.payload as (typeof components)[0];
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                          <p className="font-semibold text-slate-900">{p.label}</p>
                          <p className="text-slate-600">
                            {p.yoy}% YoY · {p.kind}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="yoy" name="YoY %" radius={[4, 4, 0, 0]}>
                    {components.map((d) => (
                      <Cell
                        key={d.id}
                        fill={
                          d.kind === "energy"
                            ? "#f43f5e"
                            : d.kind === "core"
                              ? "#14b8a6"
                              : "#0ea5e9"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Triad tracking — July IMF path vs Aug hard signal"
          subtitle="Price meter flips cooler on CPI YoY; trade/GDP still the Q3 held prints"
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

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Vintage ledger — what moved since Q3"
          subtitle="Updated price rows vs held growth/trade pending late-August prints"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={vintageRows.filter((v) => v.deltaPp != null)}
                layout="vertical"
                margin={{ left: 8, right: 20, top: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} unit=" pp" />
                <YAxis type="category" dataKey="label" width={100} tick={{ fontSize: 11 }} />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = sortTooltipPayload(payload)[0]?.payload as (typeof vintageRows)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <p className="font-semibold text-slate-900">{p.label}</p>
                        <p className="text-slate-600">Q3: {p.q3Signal}</p>
                        <p className="text-slate-600">Aug: {p.augSignal}</p>
                        <p className="mt-1 text-slate-500">
                          {p.deltaLabel} · {p.status} · {p.tilt}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="chartDelta" name="Δ pp" radius={[0, 4, 4, 0]}>
                  {vintageRows
                    .filter((v) => v.deltaPp != null)
                    .map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-1 text-xs text-slate-600">
            {vintageRows
              .filter((v) => v.deltaPp == null)
              .map((v) => (
                <li key={v.id}>
                  <span className="font-semibold text-slate-800">{v.label}:</span> {v.augSignal} —{" "}
                  {v.deltaLabel}
                </li>
              ))}
          </ul>
        </ChartCard>

        <ChartCard
          title="Growth × July price scatter"
          subtitle="US soft SAAR + cooling CPI YoY; EA sequential rebound + HICP 2.9%"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: 8, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="growth"
                  name="Growth"
                  tick={{ fontSize: 11 }}
                  unit="%"
                  domain={[0, 2]}
                />
                <YAxis
                  type="number"
                  dataKey="price"
                  name="Jul YoY"
                  tick={{ fontSize: 11 }}
                  unit="%"
                  domain={[2, 4]}
                />
                <ZAxis range={[120, 120]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0]?.payload as ReturnType<typeof growthPriceScatter>[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <p className="font-semibold text-slate-900">{p.name}</p>
                        <p className="text-slate-600">
                          Growth {p.growth}% ({p.growthLabel}) · Jul price {p.price}%
                        </p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatter} name="Economies">
                  {scatter.map((d) => (
                    <Cell key={d.id} fill={d.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
            {scatter.map((d) => (
              <span key={d.id} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: ECONOMY_COLORS[d.id] }}
                />
                {d.short}
              </span>
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="CPB merchandise MoM — held through May"
        subtitle="June World Trade Monitor scheduled 25 Aug; path unchanged from Q3 desk"
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cpbHeld} margin={{ left: 4, right: 12, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
              <ReferenceLine y={0} stroke="#94a3b8" />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const p = payload[0]?.payload as (typeof cpbHeld)[0];
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                      <p className="font-semibold text-slate-900">{p.label}</p>
                      <p className="text-slate-600">
                        {fmtPct(p.mom)} MoM · {p.phase}
                      </p>
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
      </ChartCard>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} className="text-cyan-700 underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
