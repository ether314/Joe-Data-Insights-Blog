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
  CHINA_SUPPLIER_SHARE,
  GLOBAL_INSTALLATIONS,
  HEADLINE,
  INDUSTRIES_2024,
  INDUSTRY_DUEL,
  MARKETS_2024,
  REGION_SERIES,
  REGION_SUMMARY_2024,
  SOURCE_NOTE,
  SOURCES,
  WORLD_INSTALLATIONS_2024,
  fmtPct,
  fmtUnits,
  marketShare,
  rankedMarkets,
  type MarketInstall,
} from "@/data/industrial-robotics-research-2026-data";

// viz-types: composed area+line path, stacked regional area, ranked bars, industry duel lines, flow×stock scatter, supplier slope | layout: default

type PathRange = "hist" | "full";
type RegionFilter = "all" | "Asia" | "Europe" | "Americas";
type Metric = "units" | "share" | "yoy";
type Panel = "path" | "regions" | "markets" | "industry" | "scatter" | "china";

const ASIA_C = "#f59e0b";
const EUR_C = "#8b5cf6";
const AM_C = "#0ea5e9";
const PATH_C = "#14b8a6";
const FC_C = "#94a3b8";
const ELEC_C = "#f43f5e";
const AUTO_C = "#6366f1";

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

function PathTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string; payload: { forecast?: boolean; confidence: string } }>;
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-lg">
      <p className="font-semibold text-slate-900">{label}</p>
      {sortTooltipPayload(payload).map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="mt-1">
          {p.dataKey === "units" ? "Installations" : p.dataKey}: {fmtUnits(Number(p.value))}
        </p>
      ))}
      {row?.forecast && (
        <p className="mt-1 text-slate-500">
          Forecast · {row.confidence}
        </p>
      )}
    </div>
  );
}

function ScatterTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: MarketInstall & { flow: number; stock: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const r = payload[0].payload;
  return (
    <div className="max-w-xs rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-lg">
      <p className="font-semibold text-slate-900">{r.market}</p>
      <p className="mt-1 text-slate-600">2024 flow: {fmtUnits(r.flow)}</p>
      <p className="text-slate-600">Operational stock: {fmtUnits(r.stock)}</p>
      {r.density2024 != null && (
        <p className="text-slate-600">Density: {r.density2024}/10k workers</p>
      )}
      {r.yoyPct != null && <p className="text-slate-600">YoY: {fmtPct(r.yoyPct)}</p>}
    </div>
  );
}

export function IndustrialRoboticsResearchDashboard() {
  const [pathRange, setPathRange] = useState<PathRange>("full");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [metric, setMetric] = useState<Metric>("units");
  const [panel, setPanel] = useState<Panel>("path");

  const pathData = useMemo(() => {
    const rows = GLOBAL_INSTALLATIONS.filter((r) =>
      pathRange === "hist" ? !r.forecast || r.year === 2025 : true,
    );
    return rows.map((r) => ({
      year: r.year,
      units: r.units,
      forecast: r.forecast,
      confidence: r.confidence,
    }));
  }, [pathRange]);

  const regionStack = useMemo(
    () =>
      REGION_SERIES.filter((r) => (pathRange === "hist" ? !r.forecast : true)).map(
        (r) => ({
          year: r.year,
          Asia: r.asia,
          Europe: r.europe,
          Americas: r.americas,
          forecast: r.forecast,
        }),
      ),
    [pathRange],
  );

  const markets = useMemo(() => {
    let list = rankedMarkets();
    if (region !== "all") list = list.filter((m) => m.region === region);
    return list;
  }, [region]);

  const barData = useMemo(
    () =>
      markets.map((m) => ({
        name: m.shortLabel,
        iso: m.iso,
        value:
          metric === "units"
            ? m.units2024
            : metric === "share"
              ? marketShare(m.units2024)
              : (m.yoyPct ?? 0),
        units: m.units2024,
        yoy: m.yoyPct,
        region: m.region,
      })),
    [markets, metric],
  );

  const scatterData = useMemo(
    () =>
      MARKETS_2024.filter((m) => m.stock2024 != null)
        .filter((m) => (region === "all" ? true : m.region === region))
        .map((m) => ({
          ...m,
          flow: m.units2024,
          stock: m.stock2024 as number,
          z: Math.max(m.units2024 / 5000, 40),
        })),
    [region],
  );

  const industryBars = useMemo(
    () =>
      [...INDUSTRIES_2024]
        .sort((a, b) => b.units2024 - a.units2024)
        .map((i) => ({
          name: i.shortLabel,
          units: i.units2024,
          share: i.sharePct,
          yoy: i.yoyPct,
        })),
    [],
  );

  const regionMax = Math.max(...REGION_SUMMARY_2024.map((r) => r.units), 1);

  return (
    <div data-viz className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 p-5 text-white sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Industrial robot installations — IFR World Robotics 2025
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Asia installs {fmtPct(HEADLINE.asiaSharePct)} of factory robots — electronics
          reclaims #1 as the world holds near {fmtUnits(HEADLINE.worldUnits2024)} units
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Global installations leveled at {fmtUnits(WORLD_INSTALLATIONS_2024)} in 2024
          (second-highest year on record). China alone is {fmtPct(HEADLINE.chinaSharePct)}{" "}
          of demand; IFR sees {fmtUnits(HEADLINE.forecast2025)} in 2025 and a path past
          700k by 2028.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "2024 installations", value: fmtUnits(HEADLINE.worldUnits2024) },
            { label: "Asia share", value: fmtPct(HEADLINE.asiaSharePct) },
            { label: "China stock", value: `${HEADLINE.chinaStockM.toFixed(1)}M` },
            { label: "2025 forecast", value: fmtUnits(HEADLINE.forecast2025) },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-0.5 text-lg font-bold text-white">{k.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <ToggleGroup
          label="Panel"
          value={panel}
          onChange={setPanel}
          options={[
            { id: "path", label: "Global path" },
            { id: "regions", label: "Regions" },
            { id: "markets", label: "Markets" },
            { id: "industry", label: "Industry" },
            { id: "scatter", label: "Flow × stock" },
            { id: "china", label: "China suppliers" },
          ]}
        />
        <ToggleGroup
          label="Horizon"
          value={pathRange}
          onChange={setPathRange}
          options={[
            { id: "hist", label: "History" },
            { id: "full", label: "Thru 2028f" },
          ]}
        />
        <ToggleGroup
          label="Region"
          value={region}
          onChange={setRegion}
          options={[
            { id: "all", label: "All" },
            { id: "Asia", label: "Asia" },
            { id: "Europe", label: "Europe" },
            { id: "Americas", label: "Americas" },
          ]}
        />
        <ToggleGroup
          label="Metric"
          value={metric}
          onChange={setMetric}
          options={[
            { id: "units", label: "Units" },
            { id: "share", label: "Share" },
            { id: "yoy", label: "YoY %" },
          ]}
        />
      </div>

      {panel === "path" && (
        <ChartCard
          title="Global installations path, 2018–2028f"
          subtitle="Solid history through 2024; dashed forecast toward 700k+ by 2028 (IFR narrative)"
        >
          <div className="h-[340px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={pathData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => fmtUnits(Number(v))}
                  width={48}
                />
                <Tooltip content={<PathTooltip />} />
                <ReferenceLine x={2024} stroke="#cbd5e1" strokeDasharray="4 4" />
                <Area
                  type="monotone"
                  dataKey="units"
                  fill={`${PATH_C}33`}
                  stroke="none"
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="units"
                  stroke={PATH_C}
                  strokeWidth={2.5}
                  dot={(props) => {
                    const { cx, cy, payload } = props as {
                      cx?: number;
                      cy?: number;
                      payload?: { forecast?: boolean };
                    };
                    if (cx == null || cy == null) return null;
                    return (
                      <circle
                        key={`${cx}-${cy}`}
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill={payload?.forecast ? FC_C : PATH_C}
                        stroke="#fff"
                        strokeWidth={1}
                      />
                    );
                  }}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "regions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Regional installation stack"
            subtitle="Asia carries ~¾ of new deployments; Europe and Americas contracted in 2024"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={regionStack}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => fmtUnits(Number(v))}
                    width={48}
                  />
                  <Tooltip
                    formatter={(value) => fmtUnits(Number(value))}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Asia"
                    stackId="1"
                    stroke={ASIA_C}
                    fill={ASIA_C}
                    fillOpacity={0.85}
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="Europe"
                    stackId="1"
                    stroke={EUR_C}
                    fill={EUR_C}
                    fillOpacity={0.85}
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="Americas"
                    stackId="1"
                    stroke={AM_C}
                    fill={AM_C}
                    fillOpacity={0.85}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="2024 region shares"
            subtitle="Lollipop view of flow concentration"
          >
            <div className="space-y-4 py-2">
              {REGION_SUMMARY_2024.map((r) => (
                <div key={r.region} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-sm font-semibold text-slate-700">
                    {r.region}
                  </span>
                  <div className="relative h-3 flex-1 rounded-full bg-slate-100">
                    <div
                      className="absolute left-0 top-0 h-3 rounded-full"
                      style={{
                        width: `${(r.units / regionMax) * 100}%`,
                        backgroundColor: r.color,
                      }}
                    />
                    <span
                      className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white shadow"
                      style={{
                        left: `calc(${(r.units / regionMax) * 100}% - 7px)`,
                        backgroundColor: r.color,
                      }}
                    />
                  </div>
                  <span className="w-28 shrink-0 text-right text-sm text-slate-600">
                    {fmtUnits(r.units)} · {fmtPct(r.sharePct)}
                    {r.yoyPct != null ? ` · ${fmtPct(r.yoyPct)}` : ""}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "markets" && (
        <ChartCard
          title="Ranked installations by market, 2024"
          subtitle={`Top-5 markets = ${fmtPct(HEADLINE.top5SharePct)} of world flow · toggle metric & region`}
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) =>
                    metric === "units" ? fmtUnits(Number(v)) : `${Number(v).toFixed(0)}`
                  }
                />
                <YAxis type="category" dataKey="name" width={88} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value, _n, item) => {
                    const p = item?.payload as { units: number; yoy: number | null };
                    if (metric === "units") return [fmtUnits(Number(value)), "Units"];
                    if (metric === "share") return [`${Number(value).toFixed(1)}%`, "Share"];
                    return [
                      p.yoy == null ? "n/a" : fmtPct(Number(value)),
                      "YoY",
                    ];
                  }}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                  {barData.map((d) => (
                    <Cell
                      key={d.iso}
                      fill={
                        d.region === "Asia"
                          ? ASIA_C
                          : d.region === "Europe"
                            ? EUR_C
                            : AM_C
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "industry" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Electronics vs automotive share"
            subtitle="Customer-industry duel — electronics reclaims #1 in 2024"
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={INDUSTRY_DUEL}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[20, 28]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    width={40}
                  />
                  <Tooltip
                    formatter={(value) => `${Number(value).toFixed(0)}%`}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="electronicsSharePct"
                    name="Electronics"
                    stroke={ELEC_C}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="automotiveSharePct"
                    name="Automotive"
                    stroke={AUTO_C}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Industry mix, 2024"
            subtitle="Electronics 128.9k · Automotive 126.1k · Metal 16%"
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={industryBars}
                  margin={{ top: 8, right: 8, left: 0, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => fmtUnits(Number(v))}
                    width={48}
                  />
                  <Tooltip
                    formatter={(value) => fmtUnits(Number(value))}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="units" fill="#0f172a" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                    {industryBars.map((d, i) => (
                      <Cell
                        key={d.name}
                        fill={
                          d.name === "Electronics"
                            ? ELEC_C
                            : d.name === "Automotive"
                              ? AUTO_C
                              : ["#14b8a6", "#f59e0b", "#84cc16", "#94a3b8"][i - 2] ??
                                "#94a3b8"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "scatter" && (
        <ChartCard
          title="Flow × operational stock, 2024"
          subtitle="Bubble size scales with annual installations — China is alone in the upper-right"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="stock"
                  name="Stock"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => fmtUnits(Number(v))}
                  label={{
                    value: "Operational stock",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="flow"
                  name="Flow"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => fmtUnits(Number(v))}
                  width={52}
                  label={{
                    value: "2024 installations",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip content={<ScatterTooltip />} />
                <Scatter data={scatterData} isAnimationActive={false}>
                  {scatterData.map((d) => (
                    <Cell
                      key={d.iso}
                      fill={
                        d.region === "Asia"
                          ? ASIA_C
                          : d.region === "Europe"
                            ? EUR_C
                            : AM_C
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "china" && (
        <ChartCard
          title="China domestic supplier share of home installations"
          subtitle="First year Chinese manufacturers outsold foreign brands in China (57% in 2024)"
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={CHINA_SUPPLIER_SHARE}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  domain={[20, 65]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  width={40}
                />
                <Tooltip
                  formatter={(value) => `${Number(value).toFixed(0)}% domestic`}
                  contentStyle={{ fontSize: 12 }}
                />
                <ReferenceLine
                  y={50}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  label={{ value: "50%", fill: "#64748b", fontSize: 11 }}
                />
                <Line
                  type="monotone"
                  dataKey="domesticPct"
                  stroke={ASIA_C}
                  strokeWidth={3}
                  dot={{ r: 5, fill: ASIA_C }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">
        {SOURCE_NOTE}{" "}
        {SOURCES.map((s, i) => (
          <span key={s.url}>
            {i > 0 ? " · " : ""}
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-slate-300 hover:text-slate-700"
            >
              {s.label}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}
