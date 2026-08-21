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
  ASIA_SPLIT,
  CPB_FLOW_PATH,
  HEADLINE,
  METER_COMPARE,
  PRICE_REGIMES,
  REGION_SHARES,
  SOURCE_NOTE,
  TRADE_CORRIDORS,
  VINTAGE_SLOPE,
  countryScatter,
  fmtPct,
  fmtPp,
  mismatchBars,
  regionMetricValue,
} from "@/data/macro-growth-trade-geography-2026q3-data";

// viz-types: mismatch bars+meters, region dual+pie, GDP×growth scatter, CPB area+line, trade bars+donut, Asia base-vs-sens stacked, price-regime pie+bars, vintage slope | layout: default

type ViewId = "mismatch" | "regions" | "trade" | "prices";
type RegionMetric = "ppp" | "growth" | "growthSens" | "trade" | "export";
type AsiaLens = "growth" | "growthSens" | "ppp" | "export";
type SlopeMetric =
  | "asiaGrowthPct"
  | "asiaTradePct"
  | "asiaPppPct"
  | "nAmericaMismatchPp"
  | "softCpiGrowthPct";
type ScatterFilter =
  | "all"
  | "Asia"
  | "North America"
  | "Europe"
  | "Latin America"
  | "MENA";

const AMBER = "#f59e0b";
const SKY = "#0ea5e9";
const VIOLET = "#8b5cf6";
const SLATE = "#64748b";

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

export function MacroGrowthTradeGeography2026q3Dashboard() {
  const [view, setView] = useState<ViewId>("mismatch");
  const [regionMetric, setRegionMetric] = useState<RegionMetric>("growthSens");
  const [asiaLens, setAsiaLens] = useState<AsiaLens>("growthSens");
  const [scatterFilter, setScatterFilter] = useState<ScatterFilter>("all");
  const [slopeMetric, setSlopeMetric] = useState<SlopeMetric>("asiaGrowthPct");

  const mismatch = useMemo(() => mismatchBars(), []);
  const scatter = useMemo(() => {
    const rows = countryScatter(true);
    if (scatterFilter === "all") return rows;
    return rows.filter((r) => r.region === scatterFilter);
  }, [scatterFilter]);

  const regionBars = useMemo(
    () =>
      REGION_SHARES.map((r) => ({
        short: r.short,
        value: regionMetricValue(r, regionMetric),
        fill: r.fill,
      })),
    [regionMetric],
  );

  const asiaBars = useMemo(
    () =>
      ASIA_SPLIT.map((a) => ({
        short: a.short,
        value:
          asiaLens === "growth"
            ? a.growthContribPct
            : asiaLens === "growthSens"
              ? a.growthSensPct
              : asiaLens === "ppp"
                ? a.pppSharePct
                : a.exportSharePct,
        fill: a.fill,
      })),
    [asiaLens],
  );

  const asiaStacked = useMemo(
    () =>
      ASIA_SPLIT.map((a) => ({
        short: a.short,
        base: a.growthContribPct,
        sens: a.growthSensPct,
        fill: a.fill,
      })),
    [],
  );

  const meterStack = useMemo(() => {
    const m = METER_COMPARE.find((x) => x.id === regionMetric) ?? METER_COMPARE[2];
    return [
      { name: "Asia", value: m.asia, fill: AMBER },
      { name: "N. Am.", value: m.nAmerica, fill: SKY },
      { name: "Europe", value: m.europe, fill: VIOLET },
      { name: "Other", value: m.other, fill: SLATE },
    ];
  }, [regionMetric]);

  const slopeData = useMemo(
    () =>
      VINTAGE_SLOPE.map((v) => ({
        vintage: v.vintage,
        value: v[slopeMetric],
      })),
    [slopeMetric],
  );

  const tradePie = TRADE_CORRIDORS.map((t) => ({
    name: t.short,
    value: t.sharePct,
    fill: t.fill,
  }));

  const pricePie = PRICE_REGIMES.map((p) => ({
    name: p.short,
    value: p.gdpSharePct,
    fill: p.fill,
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-4 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Q3 2026 geography lens · growth · trade · prices
        </p>
        <p className="mt-1 text-sm text-slate-200">
          Asia still owns ~{HEADLINE.asiaGrowthContribPct}% of base growth contribution and{" "}
          {HEADLINE.asiaTradeGrowthSharePct}% of merchandise trade-volume gains — but Q2
          sensitivity softens Asia growth share to ~{HEADLINE.asiaGrowthSensPct}% (
          {fmtPp(HEADLINE.asiaGrowthSensDeltaPp)}) as China prints {HEADLINE.chinaGdpQ2Yoy}%
          YoY. Stock–growth mismatch and CPB flow overlays sit beside carried WTO corridors.
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{SOURCE_NOTE}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "mismatch", label: "Mismatch" },
            { id: "regions", label: "Regions" },
            { id: "trade", label: "Trade + flow" },
            { id: "prices", label: "Prices + Asia" },
          ]}
        />
      </div>

      {view === "mismatch" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Stock–growth mismatch by region"
            subtitle="mismatch pp = growth contribution − PPP stock share (base ladder)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mismatch} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${v}`}
                    label={{ value: "pp", angle: -90, position: "insideLeft", fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtPp(Number(v)), "Mismatch"]}
                    labelFormatter={(_, p) => (p?.[0]?.payload?.region as string) ?? ""}
                  />
                  <Bar dataKey="mismatchPp" radius={[6, 6, 0, 0]}>
                    {mismatch.map((d) => (
                      <Cell key={d.short} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Asia +{HEADLINE.asiaMismatchPp} pp (growth &gt; stock). N. America{" "}
              {fmtPp(HEADLINE.nAmericaMismatchPp)} and Europe {fmtPp(HEADLINE.europeMismatchPp)}{" "}
              (stock thick, growth thin).
            </p>
          </ChartCard>

          <ChartCard
            title="Vintage slope"
            subtitle="Prior geography print → Q3 sensitivity on selected meter"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Meter"
                value={slopeMetric}
                onChange={setSlopeMetric}
                options={[
                  { id: "asiaGrowthPct", label: "Asia growth" },
                  { id: "asiaTradePct", label: "Asia trade" },
                  { id: "asiaPppPct", label: "Asia PPP" },
                  { id: "nAmericaMismatchPp", label: "NA mismatch" },
                  { id: "softCpiGrowthPct", label: "Soft-CPI growth" },
                ]}
              />
            </div>
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={slopeData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="vintage" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => [Number(v).toFixed(1), "Value"]} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    fill={AMBER}
                    fillOpacity={0.15}
                    stroke="none"
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={AMBER}
                    strokeWidth={3}
                    dot={{ r: 5, fill: AMBER }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Q2 GDP print × growth sensitivity"
            subtitle="Bubble = PPP stock share; filter by region"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Region"
                value={scatterFilter}
                onChange={setScatterFilter}
                options={[
                  { id: "all", label: "All" },
                  { id: "Asia", label: "Asia" },
                  { id: "North America", label: "N. Am." },
                  { id: "Europe", label: "Europe" },
                  { id: "Latin America", label: "LatAm" },
                  { id: "MENA", label: "MENA" },
                ]}
              />
            </div>
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="GDP print"
                    tick={{ fontSize: 12 }}
                    unit="%"
                    label={{
                      value: "Q2 / proxy GDP %",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Growth sens."
                    tick={{ fontSize: 12 }}
                    unit="%"
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => {
                      if (name === "GDP print") return [`${Number(v).toFixed(1)}%`, "GDP print"];
                      if (name === "Growth sens.")
                        return [`${Number(v).toFixed(1)}%`, "Growth sens. share"];
                      return [String(v), String(name)];
                    }}
                    labelFormatter={(_, p) => {
                      const row = p?.[0]?.payload as { name?: string; cpi?: number } | undefined;
                      return row?.name
                        ? `${row.name} · CPI ${row.cpi?.toFixed(1)}%`
                        : "";
                    }}
                  />
                  <Scatter data={scatter}>
                    {scatter.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Meter compare (stacked shares)"
            subtitle="Flip region metric — pie shows the same four-bucket roll-up"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Metric"
                value={regionMetric}
                onChange={setRegionMetric}
                options={[
                  { id: "ppp", label: "PPP" },
                  { id: "growth", label: "Growth" },
                  { id: "growthSens", label: "Q2 sens." },
                  { id: "trade", label: "Trade" },
                  { id: "export", label: "Export $" },
                ]}
              />
            </div>
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={meterStack}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {meterStack.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [fmtPct(Number(v), 1), String(n)]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "regions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Regional share ladder"
            subtitle="Toggle PPP / base growth / Q2 sensitivity / trade / export value"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Metric"
                value={regionMetric}
                onChange={setRegionMetric}
                options={[
                  { id: "ppp", label: "PPP" },
                  { id: "growth", label: "Growth" },
                  { id: "growthSens", label: "Q2 sens." },
                  { id: "trade", label: "Trade" },
                  { id: "export", label: "Export $" },
                ]}
              />
            </div>
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionBars} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} unit="%" />
                  <Tooltip formatter={(v) => [fmtPct(Number(v), 1), "Share"]} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {regionBars.map((d) => (
                      <Cell key={d.short} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Base vs Q2 sensitivity (Asia internal)"
            subtitle="China soft YoY pulls regional growth share; India/ASEAN hold or gain"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={asiaStacked} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} unit="%" />
                  <Tooltip />
                  <Bar dataKey="base" name="Base growth %" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sens" name="Q2 sens. %" fill={AMBER} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "trade" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Merchandise trade-growth corridors"
            subtitle="WTO 2025 volume-growth shares (carried) — Asia 3.2 pp / 71%"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={TRADE_CORRIDORS}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} unit="%" />
                  <YAxis type="category" dataKey="short" width={56} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(v, name) => {
                      if (name === "sharePct") return [fmtPct(Number(v), 0), "Vol. growth share"];
                      return [String(v), String(name)];
                    }}
                  />
                  <Bar dataKey="sharePct" radius={[0, 6, 6, 0]}>
                    {TRADE_CORRIDORS.map((t) => (
                      <Cell key={t.id} fill={t.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Corridor share donut"
            subtitle="Same WTO decomposition — Asia dominates flow gains, not just stock"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tradePie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={88}
                    paddingAngle={2}
                  >
                    {tradePie.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [fmtPct(Number(v), 0), String(n)]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="CPB merchandise MoM path"
            subtitle="Mar–May 2026 flow overlay — not a re-rank of 2025 contribution shares"
            >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={[...CPB_FLOW_PATH]}
                  margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} unit="%" />
                  <Tooltip
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
                      name === "mom" ? "MoM" : "Cum. from Mar",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumFromMar"
                    name="cumFromMar"
                    fill={SKY}
                    fillOpacity={0.2}
                    stroke="none"
                  />
                  <Bar dataKey="mom" name="mom" fill={VIOLET} radius={[4, 4, 0, 0]} />
                  <Line
                    type="monotone"
                    dataKey="cumFromMar"
                    name="cumFromMar"
                    stroke={SKY}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              May +{HEADLINE.cpbMayMom}% MoM after March −{Math.abs(HEADLINE.cpbMarMom)}%; Mar–May
              chain still ~{HEADLINE.cpbMarMayCum}% — rebound without rewriting Asia&apos;s 71%
              corridor.
            </p>
          </ChartCard>

          <ChartCard
            title="Export-value vs trade-growth"
            subtitle="Europe thick on $ exports; Asia thick on volume-growth contribution"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TRADE_CORRIDORS} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} unit="%" />
                  <Tooltip />
                  <Bar
                    dataKey="exportValueSharePct"
                    name="Export $ share"
                    fill={SLATE}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="sharePct"
                    name="Vol. growth share"
                    fill={AMBER}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "prices" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Price-regime geography (PPP GDP)"
            subtitle="~38% of world PPP GDP sits in elevated 3–6% CPI band (US · IN · LatAm)"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pricePie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={88}
                    paddingAngle={2}
                  >
                    {pricePie.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [fmtPct(Number(v), 0), String(n)]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Regime: GDP share vs growth contribution"
            subtitle="Soft-CPI band punches above its stock weight on growth"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PRICE_REGIMES} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} unit="%" />
                  <Tooltip />
                  <Bar dataKey="gdpSharePct" name="PPP GDP %" fill={SLATE} radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="growthContribPct"
                    name="Growth contrib. %"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Asia internal geography"
            subtitle="Who drives the regional engine — toggle base / sens / PPP / export"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Lens"
                value={asiaLens}
                onChange={setAsiaLens}
                options={[
                  { id: "growth", label: "Base growth" },
                  { id: "growthSens", label: "Q2 sens." },
                  { id: "ppp", label: "PPP" },
                  { id: "export", label: "Export $" },
                ]}
              />
            </div>
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={asiaBars} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} unit="%" />
                  <Tooltip formatter={(v) => [fmtPct(Number(v), 1), "Share"]} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {asiaBars.map((d) => (
                      <Cell key={d.short} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Headline price prints (July vintage)"
            subtitle="US CPI / EA HICP elevated; China near-zero — soft-growth paradox intact"
          >
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "US CPI YoY", value: HEADLINE.usCpiJulYoy, fill: SKY },
                { label: "EA HICP YoY", value: HEADLINE.eaHicpJulYoy, fill: VIOLET },
                { label: "China CPI", value: HEADLINE.chinaCpi2025, fill: "#10b981" },
              ].map((k) => (
                <div
                  key={k.label}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-4 text-center"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {k.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold" style={{ color: k.fill }}>
                    {fmtPct(k.value, 1)}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Soft-CPI GDP share ~{HEADLINE.softCpiGdpSharePct}% still delivers ~
              {HEADLINE.softCpiGrowthContribPct}% of growth contribution. Elevated CPI band holds ~
              {HEADLINE.elevatedCpiGdpSharePct}% of world PPP GDP.
            </p>
          </ChartCard>
        </div>
      )}
    </div>
  );
}
