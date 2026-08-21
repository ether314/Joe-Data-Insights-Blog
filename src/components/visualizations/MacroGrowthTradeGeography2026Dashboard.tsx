"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  COUNTRY_GEO,
  HEADLINE,
  PRICE_REGIMES,
  REGION_METERS,
  REGION_SHARES,
  SOURCE_NOTE,
  TRADE_CORRIDORS,
  countryScatter,
  fmtPct,
  regionMetricValue,
} from "@/data/macro-growth-trade-geography-2026-data";

// viz-types: region bars+pie, growth×CPI scatter, trade corridor bars+donut, Asia split stacked, price-regime pie+bars, meter compare | layout: default

type ViewId = "regions" | "scatter" | "trade" | "prices";
type RegionMetric = "ppp" | "growth" | "trade" | "export";
type AsiaLens = "growth" | "ppp" | "export";
type ScatterFilter = "all" | "Asia" | "North America" | "Europe" | "Latin America" | "MENA";

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

export function MacroGrowthTradeGeography2026Dashboard() {
  const [view, setView] = useState<ViewId>("regions");
  const [regionMetric, setRegionMetric] = useState<RegionMetric>("growth");
  const [asiaLens, setAsiaLens] = useState<AsiaLens>("growth");
  const [scatterFilter, setScatterFilter] = useState<ScatterFilter>("all");

  const regionBars = useMemo(() => {
    return [...REGION_SHARES].sort(
      (a, b) =>
        regionMetricValue(b, regionMetric) - regionMetricValue(a, regionMetric),
    );
  }, [regionMetric]);

  const regionPie = useMemo(
    () =>
      REGION_SHARES.map((r) => ({
        name: r.short,
        value: regionMetricValue(r, regionMetric),
        fill: r.fill,
      })),
    [regionMetric],
  );

  const scatter = useMemo(() => {
    const base = countryScatter(true);
    if (scatterFilter === "all") return base;
    return base.filter((d) => d.region === scatterFilter);
  }, [scatterFilter]);

  const asiaBars = useMemo(() => {
    const key =
      asiaLens === "growth"
        ? "growthContribPct"
        : asiaLens === "ppp"
          ? "pppSharePct"
          : "exportSharePct";
    return [...ASIA_SPLIT].sort(
      (a, b) =>
        (b[key as keyof typeof b] as number) -
        (a[key as keyof typeof a] as number),
    );
  }, [asiaLens]);

  const asiaKey =
    asiaLens === "growth"
      ? "growthContribPct"
      : asiaLens === "ppp"
        ? "pppSharePct"
        : "exportSharePct";

  const meterStack = useMemo(
    () =>
      REGION_METERS.map((m) => ({
        label: m.label,
        Asia: m.asia,
        "N. Am.": m.nAmerica,
        Europe: m.europe,
        Other: m.other,
      })),
    [],
  );

  const tradeBars = useMemo(
    () => [...TRADE_CORRIDORS].sort((a, b) => b.sharePct - a.sharePct),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="macro-growth-trade-geography-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Growth, trade & prices — geography lens
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          Where growth, trade, and prices land on the map
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          Asia owns ~{HEADLINE.asiaGrowthContribPct}% of world PPP growth
          contribution and {HEADLINE.asiaTradeGrowthSharePct}% of merchandise
          trade-volume gains — while North America still holds ~
          {HEADLINE.nAmericaPppSharePct}% of PPP stock with only ~
          {HEADLINE.nAmericaGrowthContribPct}% of growth. Toggle{" "}
          <strong className="text-white">Regions</strong>,{" "}
          <strong className="text-white">Scatter</strong>,{" "}
          <strong className="text-white">Trade</strong>, and{" "}
          <strong className="text-white">Prices</strong> to read the map.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Asia growth
            </p>
            <p className="text-lg font-bold text-amber-300">
              {fmtPct(HEADLINE.asiaGrowthContribPct)}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Asia trade Δ
            </p>
            <p className="text-lg font-bold text-sky-300">
              {fmtPct(HEADLINE.asiaTradeGrowthSharePct)}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Top-3 regions
            </p>
            <p className="text-lg font-bold text-violet-300">
              {fmtPct(HEADLINE.top3RegionGrowthPct)}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Elevated CPI GDP
            </p>
            <p className="text-lg font-bold text-rose-300">
              {fmtPct(HEADLINE.elevatedCpiGdpSharePct)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "regions", label: "Regions" },
            { id: "scatter", label: "Scatter" },
            { id: "trade", label: "Trade" },
            { id: "prices", label: "Prices" },
          ]}
        />
      </div>

      {view === "regions" && (
        <>
          <div className="flex flex-wrap gap-3">
            <ToggleGroup
              label="Metric"
              value={regionMetric}
              onChange={setRegionMetric}
              options={[
                { id: "growth", label: "Growth" },
                { id: "ppp", label: "PPP stock" },
                { id: "trade", label: "Trade Δ" },
                { id: "export", label: "Export $" },
              ]}
            />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Regional share ladder"
              subtitle="Continental buckets — switch metric above"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={regionBars}
                    layout="vertical"
                    margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                    <YAxis
                      type="category"
                      dataKey="short"
                      width={64}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(v) => [
                        `${Number(v).toFixed(1)}%`,
                        regionMetric === "growth"
                          ? "Growth contrib."
                          : regionMetric === "ppp"
                            ? "PPP stock"
                            : regionMetric === "trade"
                              ? "Trade-growth"
                              : "Export value",
                      ]}
                    />
                    <Bar
                      dataKey={
                        regionMetric === "growth"
                          ? "growthContribPct"
                          : regionMetric === "ppp"
                            ? "pppSharePct"
                            : regionMetric === "trade"
                              ? "tradeGrowthSharePct"
                              : "exportSharePct"
                      }
                      radius={[0, 4, 4, 0]}
                    >
                      {regionBars.map((r) => (
                        <Cell key={r.region} fill={r.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard
              title="Share pie"
              subtitle="Same metric as the ladder"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionPie}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={100}
                      paddingAngle={2}
                      label={({ name, value }) =>
                        `${name} ${Number(value).toFixed(0)}%`
                      }
                    >
                      {regionPie.map((d) => (
                        <Cell key={d.name} fill={d.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [`${Number(v).toFixed(1)}%`, "Share"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
          <ChartCard
            title="Four-meter regional compare"
            subtitle="Asia vs N. America vs Europe vs Other — stacked % of world"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={meterStack}
                  margin={{ top: 8, right: 12, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Bar dataKey="Asia" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="N. Am." stackId="a" fill="#0ea5e9" />
                  <Bar dataKey="Europe" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="Other" stackId="a" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </>
      )}

      {view === "scatter" && (
        <>
          <div className="flex flex-wrap gap-3">
            <ToggleGroup
              label="Region filter"
              value={scatterFilter}
              onChange={setScatterFilter}
              options={[
                { id: "all", label: "All" },
                { id: "Asia", label: "Asia" },
                { id: "North America", label: "N. America" },
                { id: "Europe", label: "Europe" },
                { id: "Latin America", label: "LatAm" },
                { id: "MENA", label: "MENA" },
              ]}
            />
            <ToggleGroup
              label="Asia lens"
              value={asiaLens}
              onChange={setAsiaLens}
              options={[
                { id: "growth", label: "Growth" },
                { id: "ppp", label: "PPP" },
                { id: "export", label: "Export $" },
              ]}
            />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Growth contribution × CPI"
              subtitle="Bubble size = PPP stock share (Türkiye CPI outlier hidden)"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name="CPI"
                      unit="%"
                      tick={{ fontSize: 11 }}
                      label={{
                        value: "CPI YoY %",
                        position: "insideBottom",
                        offset: -2,
                        fontSize: 11,
                      }}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="Growth"
                      unit="%"
                      tick={{ fontSize: 11 }}
                      label={{
                        value: "Growth contrib. %",
                        angle: -90,
                        position: "insideLeft",
                        fontSize: 11,
                      }}
                    />
                    <ZAxis type="number" dataKey="z" range={[60, 400]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      formatter={(v, name) => {
                        if (name === "x") return [`${Number(v).toFixed(1)}%`, "CPI"];
                        if (name === "y")
                          return [`${Number(v).toFixed(1)}%`, "Growth contrib."];
                        return [`${Number(v).toFixed(1)}%`, "PPP share"];
                      }}
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.name ?? ""
                      }
                    />
                    <Scatter data={scatter} name="Economies">
                      {scatter.map((d) => (
                        <Cell key={d.name} fill={d.fill} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard
              title="Asia internal split"
              subtitle="Who drives Asia’s regional engine"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={asiaBars}
                    layout="vertical"
                    margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                    <YAxis
                      type="category"
                      dataKey="short"
                      width={56}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(v) => [
                        `${Number(v).toFixed(1)}%`,
                        asiaLens === "growth"
                          ? "Growth contrib."
                          : asiaLens === "ppp"
                            ? "PPP stock"
                            : "Export value",
                      ]}
                    />
                    <Bar dataKey={asiaKey} radius={[0, 4, 4, 0]}>
                      {asiaBars.map((r) => (
                        <Cell key={r.id} fill={r.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
          <ChartCard
            title="Country geography table"
            subtitle="PPP · growth · export · CPI by region"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3">Economy</th>
                    <th className="py-2 pr-3">Region</th>
                    <th className="py-2 pr-3 text-right">PPP %</th>
                    <th className="py-2 pr-3 text-right">Growth %</th>
                    <th className="py-2 pr-3 text-right">Export %</th>
                    <th className="py-2 text-right">CPI</th>
                  </tr>
                </thead>
                <tbody>
                  {COUNTRY_GEO.filter(
                    (c) =>
                      scatterFilter === "all" || c.region === scatterFilter,
                  ).map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-slate-100 text-slate-700"
                    >
                      <td className="py-2 pr-3 font-medium">{c.label}</td>
                      <td className="py-2 pr-3 text-slate-500">{c.region}</td>
                      <td className="py-2 pr-3 text-right">
                        {c.pppSharePct.toFixed(1)}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {c.growthContribPct.toFixed(1)}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {c.exportSharePct.toFixed(1)}
                      </td>
                      <td className="py-2 text-right">
                        {c.cpiYoy.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </>
      )}

      {view === "trade" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Merchandise trade-growth corridors"
            subtitle="WTO 2025 volume-growth contribution (Asia 71% disclosed)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={tradeBars}
                  margin={{ top: 8, right: 12, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}${name === "pp2025" ? " pp" : "%"}`,
                      name === "pp2025" ? "Contribution pp" : "Share of Δ",
                    ]}
                  />
                  <Bar dataKey="sharePct" name="sharePct" radius={[4, 4, 0, 0]}>
                    {tradeBars.map((t) => (
                      <Cell key={t.id} fill={t.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Export-value geography"
            subtitle="Share of ~$26.3T merchandise exports (2025)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TRADE_CORRIDORS.map((t) => ({
                      name: t.short,
                      value: t.exportValueSharePct,
                      fill: t.fill,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={95}
                    paddingAngle={2}
                    label={({ name, value }) =>
                      `${name} ${Number(value).toFixed(0)}%`
                    }
                  >
                    {TRADE_CORRIDORS.map((t) => (
                      <Cell key={t.id} fill={t.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [
                      `${Number(v).toFixed(1)}%`,
                      "Export $ share",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Volume pp vs import forecast"
            subtitle="2025 contribution pp · 2026 merchandise import growth f"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={TRADE_CORRIDORS}
                  margin={{ top: 8, right: 12, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar
                    dataKey="pp2025"
                    name="2025 pp"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="merchImport2026f"
                    name="2026 import f %"
                    fill="#0ea5e9"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Corridor scoreboard"
            subtitle="Volume share · export $ · 2026 import path"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3">Corridor</th>
                    <th className="py-2 pr-3 text-right">Vol. Δ %</th>
                    <th className="py-2 pr-3 text-right">pp</th>
                    <th className="py-2 pr-3 text-right">Export $ %</th>
                    <th className="py-2 text-right">Imp. 26f</th>
                  </tr>
                </thead>
                <tbody>
                  {TRADE_CORRIDORS.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-slate-100 text-slate-700"
                    >
                      <td className="py-2 pr-3 font-medium">{t.label}</td>
                      <td className="py-2 pr-3 text-right">{t.sharePct}</td>
                      <td className="py-2 pr-3 text-right">
                        {t.pp2025.toFixed(1)}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {t.exportValueSharePct.toFixed(1)}
                      </td>
                      <td className="py-2 text-right">
                        {t.merchImport2026f.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "prices" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="CPI-regime geography"
            subtitle="Share of world PPP GDP in each inflation band"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PRICE_REGIMES.map((p) => ({
                      name: p.short,
                      value: p.gdpSharePct,
                      fill: p.fill,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {PRICE_REGIMES.map((p) => (
                      <Cell key={p.regime} fill={p.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [`${v}%`, "PPP GDP share"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Regime vs growth contribution"
            subtitle="GDP weight of each CPI band vs share of world growth"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={PRICE_REGIMES}
                  margin={{ top: 8, right: 12, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Bar
                    dataKey="gdpSharePct"
                    name="PPP GDP %"
                    fill="#64748b"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="growthContribPct"
                    name="Growth contrib. %"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Regional median CPI"
            subtitle="Cross-section medians by continental bucket"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...REGION_SHARES].sort(
                    (a, b) => b.medianCpi - a.medianCpi,
                  )}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={64}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [
                      `${Number(v).toFixed(1)}%`,
                      "Median CPI",
                    ]}
                  />
                  <Bar dataKey="medianCpi" radius={[0, 4, 4, 0]}>
                    {REGION_SHARES.map((r) => (
                      <Cell key={r.region} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Price geography notes"
            subtitle="Soft Asia growth vs elevated US/EM burden"
          >
            <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
              <li>
                <span className="font-semibold text-slate-900">Soft CPI</span>{" "}
                (~{PRICE_REGIMES[0].gdpSharePct}% of PPP GDP) still delivers ~
                {PRICE_REGIMES[0].growthContribPct}% of world growth —
                China-led.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Elevated band</span>{" "}
                (~{HEADLINE.elevatedCpiGdpSharePct}% of PPP) is
                geographically thick in North America (~
                {HEADLINE.nAmericaElevatedShareOfElevatedPct}% of the elevated
                perimeter) and parts of South Asia / LatAm.
              </li>
              <li>
                US CPI {HEADLINE.usCpiJulYoy}% · EA HICP {HEADLINE.eaHicpJulYoy}%
                · China CPI ~{HEADLINE.chinaCpi2025}% — the growth leader is
                not the price leader.
              </li>
              <li className="text-xs text-slate-400">{SOURCE_NOTE}</li>
            </ul>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-400">{SOURCE_NOTE}</p>
    </div>
  );
}
