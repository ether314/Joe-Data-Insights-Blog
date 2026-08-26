"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
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
  ANALYTICS,
  HEADLINE,
  NATIONAL_SERIES,
  PROPERTY_TYPE_MIX,
  REGION_SUMMARY,
  RETURN_BANDS,
  SOURCE_NOTE,
  STATE_PANEL,
  byReturnRate,
  fmtB,
  fmtM,
  fmtPct,
  fmtPerCap,
  statesByRegion,
  topHoldings,
  type RegionId,
} from "@/data/state-unclaimed-property-holdings-versus-dollars-returned-2026-data";

// viz-types: holdings ladder bars, holdings×return scatter, national
// area+line path, property-type pie, region composed bars, return-band bars
// | layout: default
// smoke-marker: Holdings vs returned $

type ViewId =
  | "ladder"
  | "scatter"
  | "national"
  | "mix"
  | "regions"
  | "bands";

type RegionFilter = "all" | RegionId;
type SortLens = "holdings" | "returned" | "rate" | "perCapita";

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const SKY = "#0284c8";
const EMERALD = "#059669";

const REGION_COLORS: Record<RegionId, string> = {
  Northeast: INDIGO,
  Midwest: TEAL,
  South: ROSE,
  West: AMBER,
};

const MIX_COLORS = [TEAL, INDIGO, AMBER, ROSE, SKY, EMERALD, SLATE];

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
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            value === o.id
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function StateUnclaimedPropertyHoldingsVersusDollarsReturned2026Dashboard() {
  const [view, setView] = useState<ViewId>("ladder");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [sort, setSort] = useState<SortLens>("holdings");

  const filtered = useMemo(() => {
    const rows = statesByRegion(region);
    const sorted = [...rows];
    if (sort === "holdings") sorted.sort((a, b) => b.holdingsB - a.holdingsB);
    else if (sort === "returned") sorted.sort((a, b) => b.returnedM - a.returnedM);
    else if (sort === "rate") sorted.sort((a, b) => b.returnRatePct - a.returnRatePct);
    else sorted.sort((a, b) => b.holdingsPerCapita - a.holdingsPerCapita);
    return sorted;
  }, [region, sort]);

  const ladderData = useMemo(
    () =>
      filtered.slice(0, 12).map((s) => ({
        abbr: s.abbr,
        holdingsB: s.holdingsB,
        returnedB: Math.round((s.returnedM / 1000) * 100) / 100,
        returnRatePct: s.returnRatePct,
        region: s.region,
        fill: REGION_COLORS[s.region],
      })),
    [filtered],
  );

  const scatterData = useMemo(
    () =>
      filtered.map((s) => ({
        abbr: s.abbr,
        holdingsB: s.holdingsB,
        returnRatePct: s.returnRatePct,
        returnedM: s.returnedM,
        region: s.region,
        fill: REGION_COLORS[s.region],
      })),
    [filtered],
  );

  const nationalPath = useMemo(
    () =>
      NATIONAL_SERIES.map((y) => ({
        year: y.year,
        stockB: y.stockB,
        returnedB: y.returnedB,
        returnRatePct: y.returnRatePct,
      })),
    [],
  );

  const mixData = useMemo(
    () => PROPERTY_TYPE_MIX.map((p) => ({ name: p.type, value: p.sharePct })),
    [],
  );

  const regionBars = useMemo(
    () =>
      REGION_SUMMARY.map((r) => ({
        region: r.region,
        holdingsB: r.holdingsB,
        returnedB: Math.round((r.returnedM / 1000) * 100) / 100,
        returnRatePct: r.returnRatePct,
        fill: REGION_COLORS[r.region],
      })),
    [],
  );

  const bandBars = useMemo(
    () =>
      RETURN_BANDS.map((b) => ({
        band: b.band,
        states: b.states,
        holdingsSharePct: b.holdingsSharePct,
      })),
    [],
  );

  const top3 = topHoldings(3);
  const rateLeaders = byReturnRate(true).slice(0, 3);

  return (
    <div
      className="space-y-6"
      data-viz="state-unclaimed-property-holdings-versus-dollars-returned-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">
          Finance · {ANALYTICS.smokeMarker}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {ANALYTICS.headlineLabel}: {ANALYTICS.headlineValue}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          NAUPA members returned{" "}
          <span className="font-semibold text-white">
            {fmtB(HEADLINE.nationalReturnedFy2024B, 2)}
          </span>{" "}
          to owners in FY2024 against a ~{fmtB(HEADLINE.nationalStockB, 0)}{" "}
          custodial float. Across a 20-state desk panel, dollar-weighted
          return rates cluster near {fmtPct(HEADLINE.panelReturnRatePct)} —
          far below the stock that keeps growing as new dormancy reports
          arrive.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Panel holdings
            </p>
            <p className="text-lg font-bold">{fmtB(HEADLINE.panelHoldingsB)}</p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Panel returned
            </p>
            <p className="text-lg font-bold">{fmtB(HEADLINE.panelReturnedB)}</p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Top stock (NY)
            </p>
            <p className="text-lg font-bold">{fmtB(HEADLINE.topStockB)}</p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Median claim
            </p>
            <p className="text-lg font-bold">
              ${HEADLINE.medianClaimMissingMoney}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <ToggleGroup<ViewId>
          value={view}
          onChange={setView}
          options={[
            { id: "ladder", label: "Holdings ladder" },
            { id: "scatter", label: "Rate scatter" },
            { id: "national", label: "National path" },
            { id: "mix", label: "Property mix" },
            { id: "regions", label: "Region stack" },
            { id: "bands", label: "Return bands" },
          ]}
        />
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
            Region
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800"
              value={region}
              onChange={(e) => setRegion(e.target.value as RegionFilter)}
            >
              <option value="all">All regions</option>
              <option value="Northeast">Northeast</option>
              <option value="Midwest">Midwest</option>
              <option value="South">South</option>
              <option value="West">West</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
            Sort ladder
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortLens)}
            >
              <option value="holdings">Holdings $</option>
              <option value="returned">Returned $</option>
              <option value="rate">Return rate</option>
              <option value="perCapita">Per capita</option>
            </select>
          </label>
        </div>
      </div>

      {view === "ladder" && (
        <ChartCard
          title="Custodial holdings versus dollars returned"
          subtitle="Top panel states by selected sort — dual axis: stock ($B) and returns ($B)"
        >
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={ladderData}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="abbr" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: "Holdings $B",
                    angle: -90,
                    position: "insideLeft",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: "Returned $B",
                    angle: 90,
                    position: "insideRight",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const v = typeof value === "number" ? value : Number(value);
                    if (name === "holdingsB") return [fmtB(v), "Holdings"];
                    if (name === "returnedB") return [fmtB(v, 2), "Returned"];
                    if (name === "returnRatePct") return [fmtPct(v), "Return rate"];
                    return [String(value), String(name)];
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="holdingsB" name="Holdings $B" radius={[4, 4, 0, 0]}>
                  {ladderData.map((d) => (
                    <Cell key={d.abbr} fill={d.fill} />
                  ))}
                </Bar>
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="returnedB"
                  name="Returned $B"
                  stroke={NAVY}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: NAVY }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Leaders by stock: {top3.map((s) => `${s.abbr} ${fmtB(s.holdingsB)}`).join(" · ")}.
            Highest return rates:{" "}
            {rateLeaders.map((s) => `${s.abbr} ${fmtPct(s.returnRatePct)}`).join(" · ")}.
          </p>
        </ChartCard>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Return rate versus custodial stock"
          subtitle="Bubble size ≈ latest-year dollars returned — filter by region"
        >
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="holdingsB"
                  name="Holdings"
                  unit="B"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: "Holdings ($B)",
                    position: "insideBottom",
                    offset: -4,
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="returnRatePct"
                  name="Rate"
                  unit="%"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: "Return rate %",
                    angle: -90,
                    position: "insideLeft",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="returnedM" range={[60, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    const v = typeof value === "number" ? value : Number(value);
                    if (name === "holdingsB") return [fmtB(v), "Holdings"];
                    if (name === "returnRatePct") return [fmtPct(v), "Return rate"];
                    if (name === "returnedM") return [fmtM(v), "Returned"];
                    return [String(value), String(name)];
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as { abbr?: string } | undefined;
                    return p?.abbr ?? "";
                  }}
                />
                <Scatter data={scatterData} name="States">
                  {scatterData.map((d) => (
                    <Cell key={d.abbr} fill={d.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Large holders (NY, CA) sit below a 3% return rate; several mid-size
            West / Midwest programs clear 5%+. Size encodes dollars returned,
            not claim counts.
          </p>
        </ChartCard>
      )}

      {view === "national" && (
        <ChartCard
          title="National stock and owner returns, 2018–2024"
          subtitle="Stock estimate ($B) as area; annual returns ($B) as line"
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={nationalPath} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: "Stock $B",
                    angle: -90,
                    position: "insideLeft",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: "Returned $B",
                    angle: 90,
                    position: "insideRight",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="stockB"
                  name="Stock $B"
                  fill={TEAL}
                  fillOpacity={0.25}
                  stroke={TEAL}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="returnedB"
                  name="Returned $B"
                  stroke={ROSE}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            FY2023 returns ({fmtB(HEADLINE.nationalReturnedFy2023B, 1)}) outpaced
            FY2024 ({fmtB(HEADLINE.nationalReturnedFy2024B, 2)}) even as the
            estimated float climbed toward {fmtB(HEADLINE.nationalStockB, 0)}.
          </p>
        </ChartCard>
      )}

      {view === "mix" && (
        <ChartCard
          title="Property-type mix of reported dollar value"
          subtitle="Desk composition across large-state programs — not a NAUPA ledger line"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mixData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {mixData.map((_, i) => (
                      <Cell key={i} fill={MIX_COLORS[i % MIX_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [fmtPct(Number(v)), "Share"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2 self-center text-sm text-slate-700">
              {PROPERTY_TYPE_MIX.map((p, i) => (
                <li key={p.type} className="flex items-start gap-2">
                  <span
                    className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: MIX_COLORS[i % MIX_COLORS.length] }}
                  />
                  <span>
                    <span className="font-semibold">{p.type}</span> —{" "}
                    {fmtPct(p.sharePct)} · claim band {p.claimBand}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ChartCard>
      )}

      {view === "regions" && (
        <ChartCard
          title="Regional holdings and returns"
          subtitle="Panel aggregates by Census region — holdings bars, return-rate line"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={regionBars} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fill: SLATE, fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: SLATE, fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="holdingsB" name="Holdings $B" radius={[4, 4, 0, 0]}>
                  {regionBars.map((d) => (
                    <Cell key={d.region} fill={d.fill} />
                  ))}
                </Bar>
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="returnRatePct"
                  name="Return rate %"
                  stroke={NAVY}
                  strokeWidth={2.5}
                  dot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Northeast stock is dominated by New York&apos;s {fmtB(19)} OSC
            balance; West per-capita depth is more even across CA and mid-size
            Mountain / Pacific programs.
          </p>
        </ChartCard>
      )}

      {view === "bands" && (
        <ChartCard
          title="States by return-rate band"
          subtitle="Count of panel states and share of panel holdings in each rate bucket"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bandBars} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="band" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fill: SLATE, fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: SLATE, fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="states"
                  name="States"
                  fill={INDIGO}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="holdingsSharePct"
                  name="Holdings share %"
                  fill={TEAL}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Most of the dollar float sits in the &lt;3.5% band because NY and CA
            alone hold {fmtB(34)} — low rates on large stocks dominate the
            weighted average.
          </p>
        </ChartCard>
      )}

      <details className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <summary className="cursor-pointer font-semibold text-slate-800">
          Sources & method notes
        </summary>
        <p className="mt-2 leading-relaxed">{SOURCE_NOTE}</p>
        <p className="mt-2 text-slate-500">
          Per-capita example: NY {fmtPerCap(STATE_PANEL[0].holdingsPerCapita)} vs
          FL {fmtPerCap(STATE_PANEL.find((s) => s.abbr === "FL")!.holdingsPerCapita)}.
        </p>
      </details>
    </div>
  );
}
