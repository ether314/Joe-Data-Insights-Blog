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
  HEADLINE,
  JUNE_FLOW,
  JURISDICTION_GEO,
  METER_COMPARE,
  REGION_SHARES,
  SECTOR_REGION,
  SOURCE_NOTE,
  US_STATE_AWARDS,
  fmtPct,
  fmtUsdBn,
  jurisdictionScatter,
} from "@/data/fiscal-industrial-policy-geography-2026-data";

// viz-types: region dual bars, stock pie, count×$ scatter, US state ladder+donut, sector stacked, meter compare | layout: default

type ViewId = "regions" | "scatter" | "states" | "sectors";
type RegionMetric = "stock" | "package" | "june";
type SectorFocus = "all" | "Semis" | "Clean energy" | "EV / battery" | "Dual-use" | "Minerals";

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

export function FiscalIndustrialPolicyGeography2026Dashboard() {
  const [view, setView] = useState<ViewId>("regions");
  const [regionMetric, setRegionMetric] = useState<RegionMetric>("stock");
  const [sectorFocus, setSectorFocus] = useState<SectorFocus>("all");
  const [highlightState, setHighlightState] = useState<string | null>(null);

  const regionBars = useMemo(() => {
    const rows = [...REGION_SHARES];
    if (regionMetric === "stock") {
      return rows.sort((a, b) => b.stockSharePct - a.stockSharePct);
    }
    if (regionMetric === "package") {
      return rows.sort((a, b) => b.packageSharePct - a.packageSharePct);
    }
    return rows.sort((a, b) => b.juneFlowSharePct - a.juneFlowSharePct);
  }, [regionMetric]);

  const regionValueKey =
    regionMetric === "stock"
      ? "stockSharePct"
      : regionMetric === "package"
        ? "packageSharePct"
        : "juneFlowSharePct";

  const scatter = useMemo(() => jurisdictionScatter(), []);

  const sectorStack = useMemo(() => {
    const rows =
      sectorFocus === "all"
        ? SECTOR_REGION
        : SECTOR_REGION.filter((s) => s.short === sectorFocus);
    return rows.map((s) => ({
      sector: s.short,
      "E. Asia": s.eastAsiaPct,
      "N. America": s.northAmericaPct,
      Europe: s.europePct,
      RoW: s.rowPct,
    }));
  }, [sectorFocus]);

  const stateBars = useMemo(
    () => [...US_STATE_AWARDS].sort((a, b) => b.awardUsdBn - a.awardUsdBn),
    [],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
          Fiscal & industrial policy — geography lens
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          Where policy capacity lands on the map
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          East Asia leads cumulative intervention counts (~
          {HEADLINE.eastAsiaStockSharePct}%); North America owns ~{" "}
          {fmtPct(HEADLINE.northAmericaPackageSharePct, 0)} of major package
          dollars; AZ·TX·NY hold ~{HEADLINE.usTop3StateAwardSharePct}% of
          tracked US CHIPS megaproject awards — while June&apos;s monthly tape
          still leaves {HEADLINE.juneRowSharePct}% to the rest of the world.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "E. Asia stock",
              value: fmtPct(HEADLINE.eastAsiaStockSharePct),
            },
            {
              label: "N. America packages",
              value: fmtPct(HEADLINE.northAmericaPackageSharePct, 0),
            },
            {
              label: "US top-3 states",
              value: fmtPct(HEADLINE.usTop3StateAwardSharePct),
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
            { id: "regions", label: "Regions" },
            { id: "scatter", label: "Count × $" },
            { id: "states", label: "US states" },
            { id: "sectors", label: "Sectors" },
          ]}
        />
        {view === "regions" && (
          <ToggleGroup
            label="Metric"
            value={regionMetric}
            onChange={setRegionMetric}
            options={[
              { id: "stock", label: "Stock counts" },
              { id: "package", label: "Package $" },
              { id: "june", label: "June flow" },
            ]}
          />
        )}
        {view === "sectors" && (
          <ToggleGroup
            label="Sector"
            value={sectorFocus}
            onChange={setSectorFocus}
            options={[
              { id: "all", label: "All" },
              { id: "Semis", label: "Semis" },
              { id: "Clean energy", label: "Clean energy" },
              { id: "EV / battery", label: "EV / battery" },
              { id: "Dual-use", label: "Dual-use" },
              { id: "Minerals", label: "Minerals" },
            ]}
          />
        )}
      </div>

      {view === "regions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Regional share ladder"
            subtitle={
              regionMetric === "stock"
                ? "Cumulative industrial-policy stock by region"
                : regionMetric === "package"
                  ? "Major fiscal-package dollars by region"
                  : "June 2026 monthly intervention flow by region"
            }
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, regionMetric === "package" ? 80 : 70]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={72}
                    tick={{ fill: "#334155", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(v) => [
                      fmtPct(Number(v), 1),
                      regionMetric === "stock"
                        ? "Stock share"
                        : regionMetric === "package"
                          ? "Package share"
                          : "June flow share",
                    ]}
                  />
                  <Bar dataKey={regionValueKey} radius={[0, 4, 4, 0]}>
                    {regionBars.map((r) => (
                      <Cell key={r.region} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title={
              regionMetric === "june"
                ? "June 2026 flow pie"
                : "Stock count geography"
            }
            subtitle={
              regionMetric === "june"
                ? `${HEADLINE.juneTotal} interventions · RoW ${HEADLINE.juneRowSharePct}%`
                : `Top-3 regions ≈ ${HEADLINE.top3RegionStockSharePct}% of cumulative stock`
            }
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={
                      regionMetric === "june"
                        ? JUNE_FLOW.map((f) => ({
                            name: f.short,
                            value: f.sharePct,
                            fill: f.fill,
                          }))
                        : REGION_SHARES.map((r) => ({
                            name: r.short,
                            value: r.stockSharePct,
                            fill: r.fill,
                          }))
                    }
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {(regionMetric === "june" ? JUNE_FLOW : REGION_SHARES).map(
                      (r, i) => (
                        <Cell
                          key={`${regionMetric}-${i}-${r.short}`}
                          fill={r.fill}
                        />
                      ),
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v), 0), "Share"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Stock vs package dual meter"
            subtitle="Same regions, two geographies of power"
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={REGION_SHARES}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="short"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      fmtPct(Number(v), 1),
                      name === "stockSharePct" ? "Stock %" : "Package %",
                    ]}
                  />
                  <Bar
                    dataKey="stockSharePct"
                    name="stockSharePct"
                    fill="#f43f5e"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="packageSharePct"
                    name="packageSharePct"
                    fill="#0ea5e9"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Meter comparison"
            subtitle="Which region wins depends on the instrument"
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={METER_COMPARE}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={78}
                    tick={{ fill: "#334155", fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      fmtPct(Number(v), 1),
                      name === "topSharePct" ? "Top region" : "Top-3",
                    ]}
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | (typeof METER_COMPARE)[0]
                        | undefined;
                      return row
                        ? `${row.meter} · top=${row.topRegion}`
                        : "";
                    }}
                  />
                  <Bar
                    dataKey="topSharePct"
                    fill="#0ea5e9"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="top3SharePct"
                    fill="#94a3b8"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "scatter" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Count share × package-dollar share"
            subtitle="US sits high-$ / mid-count; RoW high-count / zero package tip"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 12, right: 16, left: 8, bottom: 12 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Stock %"
                    unit="%"
                    domain={[0, 32]}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    label={{
                      value: "Stock count share %",
                      position: "insideBottom",
                      offset: -4,
                      fill: "#94a3b8",
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Package %"
                    unit="%"
                    domain={[0, 80]}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    label={{
                      value: "Package $ share %",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#94a3b8",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => {
                      if (name === "x") return [fmtPct(Number(v), 0), "Stock"];
                      if (name === "y")
                        return [fmtPct(Number(v), 1), "Package $"];
                      return [String(v), name];
                    }}
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | (typeof scatter)[0]
                        | undefined;
                      return row
                        ? `${row.jurisdiction} · ${row.region}`
                        : "";
                    }}
                  />
                  <Scatter data={scatter}>
                    {scatter.map((d) => (
                      <Cell key={d.short} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Jurisdiction table"
            subtitle="Geography of counts vs war-chest capacity"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3 font-semibold">Jurisdiction</th>
                    <th className="py-2 pr-3 font-semibold">Region</th>
                    <th className="py-2 pr-3 font-semibold text-right">
                      Stock %
                    </th>
                    <th className="py-2 font-semibold text-right">Package $</th>
                  </tr>
                </thead>
                <tbody>
                  {[...JURISDICTION_GEO]
                    .sort((a, b) => b.packageSharePct - a.packageSharePct)
                    .map((j) => (
                      <tr
                        key={j.jurisdiction}
                        className="border-b border-slate-100"
                      >
                        <td className="py-2.5 pr-3 font-medium text-slate-800">
                          <span
                            className="mr-2 inline-block h-2 w-2 rounded-full"
                            style={{ background: j.fill }}
                          />
                          {j.short}
                        </td>
                        <td className="py-2.5 pr-3 text-slate-600">
                          {j.region}
                        </td>
                        <td className="py-2.5 pr-3 text-right tabular-nums text-slate-800">
                          {fmtPct(j.stockSharePct)}
                        </td>
                        <td className="py-2.5 text-right tabular-nums text-slate-800">
                          {j.packageUsdBn > 0
                            ? fmtUsdBn(j.packageUsdBn)
                            : "—"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "states" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="US CHIPS megaproject awards by state"
            subtitle={`Tracked tip ≈ ${fmtUsdBn(HEADLINE.usTrackedAwardsUsdBn)} · top-3 ${HEADLINE.usTop3StatesLabel} ≈ ${HEADLINE.usTop3StateAwardSharePct}%`}
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stateBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => `$${v}B`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={52}
                    tick={{ fill: "#334155", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtUsdBn(Number(v)), "Awards"]}
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | (typeof US_STATE_AWARDS)[0]
                        | undefined;
                      return row ? `${row.state}: ${row.projects}` : "";
                    }}
                  />
                  <Bar
                    dataKey="awardUsdBn"
                    radius={[0, 4, 4, 0]}
                    onClick={(d) => {
                      const row = d as unknown as { state?: string };
                      if (row?.state) setHighlightState(row.state);
                    }}
                  >
                    {stateBars.map((s) => (
                      <Cell
                        key={s.state}
                        fill={s.fill}
                        opacity={
                          !highlightState || highlightState === s.state
                            ? 1
                            : 0.35
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="State share of tracked awards"
            subtitle="Click a bar to highlight · facility geography, not full outlays"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={US_STATE_AWARDS.map((s) => ({
                      name: s.short,
                      value: s.sharePct,
                      fill: s.fill,
                      state: s.state,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={105}
                    paddingAngle={2}
                    label={({ name, value }) => `${name} ${value}%`}
                    onClick={(_, idx) => {
                      const s = US_STATE_AWARDS[idx];
                      if (s) setHighlightState(s.state);
                    }}
                  >
                    {US_STATE_AWARDS.map((s) => (
                      <Cell
                        key={s.state}
                        fill={s.fill}
                        opacity={
                          !highlightState || highlightState === s.state
                            ? 1
                            : 0.35
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v), 1), "Share"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {highlightState && (
              <p className="mt-2 text-center text-xs text-slate-500">
                Highlighted: {highlightState}
                {" · "}
                <button
                  type="button"
                  className="font-semibold text-sky-600 hover:underline"
                  onClick={() => setHighlightState(null)}
                >
                  Clear
                </button>
              </p>
            )}
          </ChartCard>
        </div>
      )}

      {view === "sectors" && (
        <div className="grid gap-6 lg:grid-cols-1">
          <ChartCard
            title="Sector × region intensity"
            subtitle="Estimated share of each sector's industrial-policy geography"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sectorStack}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="sector"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      fmtPct(Number(v), 0),
                      String(name),
                    ]}
                  />
                  <Bar
                    dataKey="E. Asia"
                    stackId="a"
                    fill="#f43f5e"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar dataKey="N. America" stackId="a" fill="#0ea5e9" />
                  <Bar dataKey="Europe" stackId="a" fill="#8b5cf6" />
                  <Bar
                    dataKey="RoW"
                    stackId="a"
                    fill="#64748b"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> E.
                Asia
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-500" /> N.
                America
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />{" "}
                Europe
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-500" /> RoW
              </span>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
