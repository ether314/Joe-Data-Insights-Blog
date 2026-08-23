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
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  DCFC_STOCK_PATH,
  EVS_PER_CHARGER_PATH,
  FAST_SHARE_2025,
  GAP_DELTA_2024_2025,
  HEADLINE,
  HOME_VS_DCFC_SCATTER,
  KW_PER_EV_2025,
  MARKETS_2025,
  SOURCE_NOTE,
  US_AFDC_DCFC_PATH,
  fmt1,
  fmtInt,
  marketsByBevsPerDcfc,
} from "@/data/public-dc-fast-chargers-vs-ev-stock-2026-data";

// viz-types: rank bars, path lines, capacity bars, home×DCFC scatter, DCFC stock areas, AFDC ports line, gap delta bars, fast-share stacked | layout: default

type ViewId = "rank" | "path" | "capacity" | "mix";
type RegionFilter = "all" | "Americas" | "Europe" | "Asia-Pacific" | "Emerging";
type RankMetric = "bevsPerDcfc" | "evsPerPublicCharger" | "kwPerEv";

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const SKY = "#0284c8";

const REGION_COLORS: Record<string, string> = {
  Americas: ROSE,
  Europe: INDIGO,
  "Asia-Pacific": TEAL,
  Emerging: AMBER,
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

export function PublicDcFastChargersVsEvStock2026Dashboard() {
  const [view, setView] = useState<ViewId>("rank");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [rankMetric, setRankMetric] = useState<RankMetric>("bevsPerDcfc");

  const ranked = useMemo(() => {
    let rows = marketsByBevsPerDcfc(rankMetric !== "kwPerEv");
    if (region !== "all") {
      rows = rows.filter((r) => r.region === region);
    }
    if (rankMetric === "kwPerEv") {
      rows = [...rows].sort((a, b) => a.kwPerEv - b.kwPerEv);
    } else if (rankMetric === "evsPerPublicCharger") {
      rows = [...rows].sort(
        (a, b) => b.evsPerPublicCharger - a.evsPerPublicCharger,
      );
    }
    return rows.map((r) => ({
      name: r.label,
      value:
        rankMetric === "bevsPerDcfc"
          ? r.bevsPerDcfc
          : rankMetric === "evsPerPublicCharger"
            ? r.evsPerPublicCharger
            : r.kwPerEv,
      fill: REGION_COLORS[r.region],
      region: r.region,
    }));
  }, [rankMetric, region]);

  const pathSeries = useMemo(() => EVS_PER_CHARGER_PATH, []);
  const dcfcPath = useMemo(
    () =>
      DCFC_STOCK_PATH.map((d) => ({
        year: d.year,
        China: d.chinaK,
        "United States": d.usK,
        "EU fast+ultra": d.euFastPlusUltraK,
        Korea: d.koreaK,
      })),
    [],
  );
  const afdc = useMemo(
    () => US_AFDC_DCFC_PATH.map((d) => ({ label: d.yearLabel, ports: d.ports })),
    [],
  );
  const kwBars = useMemo(() => [...KW_PER_EV_2025].reverse(), []);
  const gapBars = useMemo(
    () =>
      GAP_DELTA_2024_2025.map((g) => ({
        name: g.label,
        delta: g.delta,
        fill:
          g.direction === "worsened"
            ? ROSE
            : g.direction === "improved"
              ? TEAL
              : SLATE,
      })),
    [],
  );
  const fastShare = useMemo(
    () =>
      FAST_SHARE_2025.map((f) => ({
        name: f.label,
        Fast: f.fastSharePct,
        Slow: f.slowSharePct,
      })),
    [],
  );
  const scatter = useMemo(() => {
    let rows = HOME_VS_DCFC_SCATTER;
    if (region !== "all") rows = rows.filter((r) => r.region === region);
    return rows.map((r) => ({
      ...r,
      z: Math.max(40, r.kwPerEv * 18),
    }));
  }, [region]);

  const metricLabel =
    rankMetric === "bevsPerDcfc"
      ? "BEVs per public DCFC"
      : rankMetric === "evsPerPublicCharger"
        ? "EVs per public charger (all speeds)"
        : "Public kW per electric LDV";

  return (
    <div
      className="space-y-6"
      data-viz="public-dc-fast-chargers-vs-ev-stock-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
          Public DC fast chargers · BEV stock coverage
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          ~{HEADLINE.usBevsPerAfdcDcfc2025} BEVs per US DC Fast port vs ~
          {HEADLINE.koreaBevsPerDcfc2025} in Korea — a{" "}
          {fmt1(HEADLINE.usVsKoreaBevPerDcfcMultiple)}× coverage gap
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          IEA puts the United States at {HEADLINE.usEvsPerPublicCharger2025}{" "}
          electric LDVs per public charging point (end-2025) against a world
          average of {HEADLINE.worldEvsPerPublicCharger2025} and Korea near{" "}
          {HEADLINE.koreaEvsPerPublicCharger2025}. Narrowing to DC-class ports
          (AFDC DC Fast / IEA fast+ultra) widens the US shortfall further.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "US EVs / public point",
              value: String(HEADLINE.usEvsPerPublicCharger2025),
            },
            {
              label: "US BEVs / AFDC DCFC",
              value: `~${HEADLINE.usBevsPerAfdcDcfc2025}`,
            },
            {
              label: "Korea kW / EV",
              value: `>${HEADLINE.koreaKwPerEv2025}`,
            },
            {
              label: "China DCFC stock",
              value: `${HEADLINE.chinaDcfcMillion2025}M`,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {s.label}
              </p>
              <p className="mt-0.5 text-lg font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "rank", label: "Coverage rank" },
            { id: "path", label: "Gap path" },
            { id: "capacity", label: "Capacity" },
            { id: "mix", label: "Fast mix" },
          ]}
        />
        <ToggleGroup
          label="Region"
          value={region}
          onChange={setRegion}
          options={[
            { id: "all", label: "All regions" },
            { id: "Americas", label: "Americas" },
            { id: "Europe", label: "Europe" },
            { id: "Asia-Pacific", label: "Asia-Pacific" },
            { id: "Emerging", label: "Emerging" },
          ]}
        />
      </div>

      {view === "rank" && (
        <>
          <ToggleGroup
            label="Metric"
            value={rankMetric}
            onChange={setRankMetric}
            options={[
              { id: "bevsPerDcfc", label: "BEVs / DCFC" },
              { id: "evsPerPublicCharger", label: "EVs / public point" },
              { id: "kwPerEv", label: "kW / EV" },
            ]}
          />
          <ChartCard
            title={metricLabel}
            subtitle={
              rankMetric === "kwPerEv"
                ? "Lower bars = thinner public capacity (worse for drivers without home charging)"
                : "Higher bars = more vehicles competing for each public point (worse coverage)"
            }
          >
            <div className="h-[420px] w-full">
              <ResponsiveContainer>
                <BarChart
                  data={ranked}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" name={metricLabel} radius={[0, 4, 4, 0]}>
                    {ranked.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Home-charging access vs BEVs per DCFC"
            subtitle="Bubble size ∝ public kW per EV — high home access can mask thin DC networks"
          >
            <div className="h-[360px] w-full">
              <ResponsiveContainer>
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="homeScore"
                    name="Home access"
                    domain={[0.5, 3.5]}
                    ticks={[1, 2, 3]}
                    tickFormatter={(v) =>
                      v === 1 ? "Low" : v === 2 ? "Med" : "High"
                    }
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="bevsPerDcfc"
                    name="BEVs / DCFC"
                    tick={{ fontSize: 12 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={scatter} fill={TEAL}>
                    {scatter.map((d) => (
                      <Cell
                        key={d.id}
                        fill={REGION_COLORS[d.region] ?? TEAL}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </>
      )}

      {view === "path" && (
        <>
          <ChartCard
            title="Electric LDVs per public charging point"
            subtitle="Rising series = vehicle stock outrunning charger build-out (gap not closing)"
          >
            <div className="h-[380px] w-full">
              <ResponsiveContainer>
                <ComposedChart
                  data={pathSeries}
                  margin={{ top: 12, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="us"
                    name="United States"
                    stroke={ROSE}
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="china"
                    name="China"
                    stroke={TEAL}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="eu"
                    name="EU"
                    stroke={INDIGO}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="korea"
                    name="Korea"
                    stroke={AMBER}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="world"
                    name="World"
                    stroke={SLATE}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="2024→2025 change in EVs per public point"
              subtitle="Positive = coverage worsened"
            >
              <div className="h-[320px] w-full">
                <ResponsiveContainer>
                  <BarChart
                    data={gapBars}
                    margin={{ top: 8, right: 8, left: 0, bottom: 48 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      interval={0}
                      angle={-32}
                      textAnchor="end"
                      tick={{ fontSize: 10 }}
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="delta" name="Δ EVs / point" radius={[4, 4, 0, 0]}>
                      {gapBars.map((d) => (
                        <Cell key={d.name} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard
              title="US AFDC public DC Fast ports"
              subtitle="DOE Alternative Fuels Data Center stall counts"
            >
              <div className="h-[320px] w-full">
                <ResponsiveContainer>
                  <ComposedChart
                    data={afdc}
                    margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => fmtInt(v)}
                    />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="ports"
                      name="DC Fast ports"
                      stroke={SKY}
                      fill={SKY}
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="ports"
                      stroke={NAVY}
                      strokeWidth={0}
                      dot={{ r: 3, fill: SKY }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </>
      )}

      {view === "capacity" && (
        <>
          <ChartCard
            title="Public charging capacity per electric LDV (kW)"
            subtitle="IEA capacity metric — Korea >9 kW/EV vs US ~1.5 kW/EV"
          >
            <div className="h-[400px] w-full">
              <ResponsiveContainer>
                <BarChart
                  data={kwBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} unit=" kW" />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={110}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="kw" name="kW / EV" fill={TEAL} radius={[0, 4, 4, 0]}>
                    {kwBars.map((d) => (
                      <Cell
                        key={d.id}
                        fill={
                          d.id === "us"
                            ? ROSE
                            : d.id === "korea"
                              ? AMBER
                              : TEAL
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="DC-class public port stock (thousands)"
            subtitle="IEA fast + ultra-fast ports — China’s scale dwarfs peers"
          >
            <div className="h-[360px] w-full">
              <ResponsiveContainer>
                <ComposedChart
                  data={dcfcPath}
                  margin={{ top: 12, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="China"
                    stroke={TEAL}
                    fill={TEAL}
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="EU fast+ultra"
                    stroke={INDIGO}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="United States"
                    stroke={ROSE}
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Korea"
                    stroke={AMBER}
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </>
      )}

      {view === "mix" && (
        <>
          <ChartCard
            title="Share of public points that are fast / ultra-fast"
            subtitle="AC-heavy networks can look dense on point counts while staying thin on DC"
          >
            <div className="h-[380px] w-full">
              <ResponsiveContainer>
                <BarChart
                  data={fastShare}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    unit="%"
                    domain={[0, 100]}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="Fast"
                    stackId="a"
                    fill={AMBER}
                    name="Fast + ultra-fast"
                  />
                  <Bar
                    dataKey="Slow"
                    stackId="a"
                    fill={SLATE}
                    name="Slow (≤22 kW)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Panel snapshot — BEVs per DCFC by market"
            subtitle={`${MARKETS_2025.length} markets · end-2025 desk ratios`}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-4">Market</th>
                    <th className="py-2 pr-4">Region</th>
                    <th className="py-2 pr-4">BEVs / DCFC</th>
                    <th className="py-2 pr-4">EVs / point</th>
                    <th className="py-2">kW / EV</th>
                  </tr>
                </thead>
                <tbody>
                  {marketsByBevsPerDcfc().map((m) => (
                    <tr
                      key={m.id}
                      className="border-b border-slate-100 text-slate-800"
                    >
                      <td className="py-2 pr-4 font-medium">{m.label}</td>
                      <td className="py-2 pr-4 text-slate-500">{m.region}</td>
                      <td className="py-2 pr-4">{fmt1(m.bevsPerDcfc)}</td>
                      <td className="py-2 pr-4">{fmt1(m.evsPerPublicCharger)}</td>
                      <td className="py-2">{fmt1(m.kwPerEv)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
