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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ANALYTICS,
  HEADLINE,
  MONTHLY_PATH,
  NATIONAL_ANNUAL,
  PARENT_LFP_2024,
  PRICE_GAP_PATH,
  SOURCE_NOTE,
  STATE_PRICES,
  type RegionId,
} from "@/data/us-childcare-price-vs-women-s-prime-age-lfp-2026-data";

type Panel =
  | "dual-index"
  | "yoy-diverge"
  | "monthly-path"
  | "parent-gap"
  | "state-ladder"
  | "price-lfp-scatter";

type SortMode = "price-desc" | "afford-desc" | "lfp-asc";

const COLORS = {
  childcare: "#b45309",
  allItems: "#64748b",
  lfp: "#0f766e",
  mothers: "#c2410c",
  fathers: "#1e40af",
  gapPos: "#dc2626",
  gapNeg: "#15803d",
  accent: "#1e3a5f",
  ne: "#1e40af",
  mw: "#64748b",
  south: "#ea580c",
  west: "#0d9488",
};

const REGION_COLOR: Record<RegionId, string> = {
  Northeast: COLORS.ne,
  Midwest: COLORS.mw,
  South: COLORS.south,
  West: COLORS.west,
};

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
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

export function UsChildcarePriceVsWomenSPrimeAgeLfp2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("dual-index");
  const [region, setRegion] = useState<RegionId | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("price-desc");
  const [yearFrom, setYearFrom] = useState<2015 | 2019>(2019);

  const nationalSlice = useMemo(
    () => NATIONAL_ANNUAL.filter((r) => r.year >= yearFrom),
    [yearFrom],
  );

  const yoySlice = useMemo(
    () =>
      NATIONAL_ANNUAL.filter(
        (r) => r.year >= Math.max(yearFrom, 2016) && r.childcareYoy != null,
      ).map((r) => ({
        year: r.year,
        childcareYoy: r.childcareYoy!,
        allItemsYoy: r.allItemsYoy!,
        lead: Number((r.childcareYoy! - r.allItemsYoy!).toFixed(1)),
      })),
    [yearFrom],
  );

  const states = useMemo(() => {
    const filtered =
      region === "all"
        ? [...STATE_PRICES]
        : STATE_PRICES.filter((s) => s.region === region);
    return filtered.sort((a, b) => {
      if (sortMode === "afford-desc")
        return b.marriedCoupleAffordPct - a.marriedCoupleAffordPct;
      if (sortMode === "lfp-asc")
        return a.femalePrimeLfpProxy - b.femalePrimeLfpProxy;
      return b.infantCenterAnnual - a.infantCenterAnnual;
    });
  }, [region, sortMode]);

  const scatterData = useMemo(
    () =>
      (region === "all"
        ? STATE_PRICES
        : STATE_PRICES.filter((s) => s.region === region)
      ).map((s) => ({
        ...s,
        x: s.infantCenterAnnual / 1000,
        y: s.femalePrimeLfpProxy,
        z: s.marriedCoupleAffordPct,
      })),
    [region],
  );

  const panels: { id: Panel; label: string }[] = [
    { id: "dual-index", label: "CPI vs LFP" },
    { id: "yoy-diverge", label: "YoY diverge" },
    { id: "monthly-path", label: "Recovery path" },
    { id: "parent-gap", label: "Parent gap" },
    { id: "state-ladder", label: "State prices" },
    { id: "price-lfp-scatter", label: "Price × LFP" },
  ];

  return (
    <div
      className="w-full min-w-0 space-y-4"
      data-viz="us-childcare-price-vs-women-s-prime-age-lfp-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-amber-50/50 p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          CPI childcare vs LFP
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          +{HEADLINE.childcareCpiPct2019_2024}% daycare CPI{" "}
          <span className="text-lg font-semibold text-slate-600 sm:text-xl">
            (2019–2024) — prime-age women&apos;s LFP rose to{" "}
            {HEADLINE.primeAgeFemaleLfp2024}%, not a stall
          </span>
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          After 2022, daycare YoY stayed near {HEADLINE.childcareYoy2024}% while
          all-items cooled to {HEADLINE.allItemsYoy2024}%. Mothers with children
          under 6 edged {ANALYTICS.mothersUnder6DropPp2023_2024} pp lower in
          2023–24 even as the broad 25–54 female rate gained{" "}
          {ANALYTICS.primeAgeLfpGainPp2019_2024} pp since 2019.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {panels.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPanel(p.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              panel === p.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-2 text-slate-600">
          <span className="font-medium">Series from</span>
          <select
            value={yearFrom}
            onChange={(e) => setYearFrom(Number(e.target.value) as 2015 | 2019)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1"
          >
            <option value={2019}>2019 (brief window)</option>
            <option value={2015}>2015 (longer path)</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-slate-600">
          <span className="font-medium">Census region</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as RegionId | "all")}
            className="rounded-md border border-slate-300 bg-white px-2 py-1"
          >
            <option value="all">All regions</option>
            <option value="Northeast">Northeast</option>
            <option value="Midwest">Midwest</option>
            <option value="South">South</option>
            <option value="West">West</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-slate-600">
          <span className="font-medium">Sort states</span>
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1"
          >
            <option value="price-desc">Highest infant price</option>
            <option value="afford-desc">Least affordable (married %)</option>
            <option value="lfp-asc">Lowest female LFP proxy</option>
          </select>
        </label>
      </div>

      {panel === "dual-index" && (
        <ChartCard
          title="Daycare & all-items CPI (2019=100) vs prime-age female LFP"
          subtitle="Amber/slate indexes on left; teal LFP % on right. Cumulative CPI rises look similar — the story is path and composition."
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={nationalSlice}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="idx"
                  domain={[88, 130]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Index 2019=100",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  yAxisId="lfp"
                  orientation="right"
                  domain={[72, 80]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "LFP %",
                    angle: 90,
                    position: "insideRight",
                    fontSize: 11,
                  }}
                />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="idx"
                  type="monotone"
                  dataKey="childcareIndex2019"
                  name="Daycare CPI"
                  fill={COLORS.childcare}
                  fillOpacity={0.15}
                  stroke={COLORS.childcare}
                  strokeWidth={2.5}
                />
                <Line
                  yAxisId="idx"
                  type="monotone"
                  dataKey="allItemsIndex2019"
                  name="All-items CPI"
                  stroke={COLORS.allItems}
                  strokeWidth={2}
                  strokeDasharray="4 3"
                  dot={false}
                />
                <Line
                  yAxisId="lfp"
                  type="monotone"
                  dataKey="primeAgeFemaleLfp"
                  name="Women 25–54 LFP"
                  stroke={COLORS.lfp}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "yoy-diverge" && (
        <ChartCard
          title="Year-over-year: daycare CPI vs all-items"
          subtitle="Bars = YoY %. Line = daycare minus all-items (pp). After 2022 the daycare lead flips positive and stays there."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={yoySlice}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="yoy"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "YoY %",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  yAxisId="lead"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Lead pp",
                    angle: 90,
                    position: "insideRight",
                    fontSize: 11,
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="yoy"
                  dataKey="childcareYoy"
                  name="Daycare YoY"
                  fill={COLORS.childcare}
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  yAxisId="yoy"
                  dataKey="allItemsYoy"
                  name="All-items YoY"
                  fill={COLORS.allItems}
                  radius={[3, 3, 0, 0]}
                />
                <Line
                  yAxisId="lead"
                  type="monotone"
                  dataKey="lead"
                  name="Daycare lead (pp)"
                  stroke={COLORS.gapPos}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Gap path (index points, childcare − all-items, 2019=100):{" "}
            {PRICE_GAP_PATH.map((g) => `${g.year}: ${g.childcareMinusAllItems}`).join(
              " · ",
            )}
          </p>
        </ChartCard>
      )}

      {panel === "monthly-path" && (
        <ChartCard
          title="Selected months: LFP recovery vs daycare price index"
          subtitle="Apr 2020 trough at 73.5% SA; LFP reclaimed and exceeded 2019 while daycare prices kept climbing."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={MONTHLY_PATH}
                margin={{ top: 8, right: 12, left: 0, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  yAxisId="lfp"
                  domain={[72, 80]}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  yAxisId="idx"
                  orientation="right"
                  domain={[95, 135]}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="lfp"
                  type="monotone"
                  dataKey="primeAgeFemaleLfp"
                  name="Women 25–54 LFP %"
                  fill={COLORS.lfp}
                  fillOpacity={0.2}
                  stroke={COLORS.lfp}
                  strokeWidth={2.5}
                />
                <Line
                  yAxisId="idx"
                  type="monotone"
                  dataKey="childcareIndex2019"
                  name="Daycare index 2019=100"
                  stroke={COLORS.childcare}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "parent-gap" && (
        <ChartCard
          title="2024 parental LFP by age of youngest child"
          subtitle={`Mother–father gap under 6: ${ANALYTICS.motherFatherGapUnder6Pp2024} pp. School-age mothers sit ~10 pp higher than mothers of young children.`}
        >
          <div className="h-[340px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={PARENT_LFP_2024}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="group" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="mothers"
                  name="Mothers"
                  fill={COLORS.mothers}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="fathers"
                  name="Fathers"
                  fill={COLORS.fathers}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-3 font-medium">Year</th>
                  <th className="py-2 pr-3 font-medium">Mothers &lt;6</th>
                  <th className="py-2 pr-3 font-medium">Mothers 6–17</th>
                  <th className="py-2 font-medium">Women 25–54</th>
                </tr>
              </thead>
              <tbody>
                {NATIONAL_ANNUAL.filter(
                  (r) => r.year >= 2019 && r.mothersUnder6Lfp != null,
                ).map((r) => (
                  <tr key={r.year} className="border-b border-slate-100">
                    <td className="py-1.5 pr-3 font-medium text-slate-800">
                      {r.year}
                    </td>
                    <td className="py-1.5 pr-3">{r.mothersUnder6Lfp}%</td>
                    <td className="py-1.5 pr-3">{r.mothers6to17Lfp}%</td>
                    <td className="py-1.5">{r.primeAgeFemaleLfp}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}

      {panel === "state-ladder" && (
        <ChartCard
          title="Infant center price ladder (CCAoA 2024)"
          subtitle="State market averages as metro proxies. Filter by Census region; sort by price, married-couple affordability share, or female LFP proxy."
        >
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={states}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="abbr"
                  width={36}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    if (String(name).includes("infant") || name === "infantCenterAnnual") {
                      return [`$${n.toLocaleString()}`, "Infant center / yr"];
                    }
                    return [n, String(name)];
                  }}
                />
                <Bar dataKey="infantCenterAnnual" name="Infant center $/yr" radius={[0, 4, 4, 0]}>
                  {states.map((s) => (
                    <Cell key={s.abbr} fill={REGION_COLOR[s.region]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "price-lfp-scatter" && (
        <ChartCard
          title="Infant price vs female prime-age LFP proxy"
          subtitle={`Bubble size ≈ married-couple affordability %. Panel r ≈ ${ANALYTICS.pearsonPriceVsFemaleLfp} — price levels alone do not sort state LFP.`}
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Infant $/k"
                  unit="k"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Infant center price ($000)",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="LFP"
                  domain={[70, 84]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Female 25–54 LFP proxy %",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    if (name === "x" || name === "Infant $/k")
                      return [`$${n.toFixed(1)}k`, "Infant price"];
                    if (name === "y" || name === "LFP")
                      return [`${n.toFixed(1)}%`, "Female LFP proxy"];
                    return [n, String(name)];
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as
                      | { state?: string }
                      | undefined;
                    return p?.state ?? "";
                  }}
                />
                <Scatter name="States" data={scatterData}>
                  {scatterData.map((s) => (
                    <Cell key={s.abbr} fill={REGION_COLOR[s.region]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
