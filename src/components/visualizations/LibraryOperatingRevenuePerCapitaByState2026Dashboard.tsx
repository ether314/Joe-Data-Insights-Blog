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
  DELTA_LAGGARDS,
  DELTA_LEADERS,
  HEADLINE,
  NATIONAL_SPREAD,
  REGION_SUMMARY_2019,
  REGION_SUMMARY_2022,
  REVENUE_LADDER,
  SOURCE_NOTE,
  STATE_PANEL,
  type RegionId,
  type StateRow,
} from "@/data/library-operating-revenue-per-capita-by-state-2026-data";

// viz-types: spread composed area+line, horizontal revenue ladder, 2019×2022 scatter,
// stacked source-mix bars, diverging delta bars, region comparison bars
// | layout: default
// smoke-marker: Revenue per capita spread

type ViewId =
  | "spread"
  | "ladder"
  | "scatter"
  | "sources"
  | "deltas"
  | "regions";

type RegionFilter = "all" | RegionId;
type SortMode = "revenue" | "delta" | "localShare";

const SLUG = "library-operating-revenue-per-capita-by-state-2026";
const INK = "#0f172a";
const TEAL = "#0f766e";
const AMBER = "#b45309";
const ROSE = "#be123c";
const SLATE = "#64748b";
const INDIGO = "#4338ca";
const SKY = "#0369a1";

const REGION_COLOR: Record<RegionId, string> = {
  Northeast: INDIGO,
  Midwest: TEAL,
  South: AMBER,
  West: SKY,
};

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "spread", label: "Gap over time" },
  { id: "ladder", label: "State ladder" },
  { id: "scatter", label: "2019 → 2022" },
  { id: "sources", label: "Revenue mix" },
  { id: "deltas", label: "Dollar deltas" },
  { id: "regions", label: "Regions" },
];

function fmtUsd(n: number, digits = 0) {
  return `$${n.toFixed(digits)}`;
}

function ChartCard({
  title,
  subtitle,
  children,
  tall,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  tall?: boolean;
}) {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        ) : null}
      </div>
      <div className={`w-full px-2 pb-3 pt-2 ${tall ? "h-[28rem]" : "h-80"}`}>
        {children}
      </div>
    </div>
  );
}

function filterStates(
  rows: StateRow[],
  region: RegionFilter,
  includeDc: boolean,
): StateRow[] {
  return rows.filter((r) => {
    if (!includeDc && r.abbr === "DC") return false;
    if (region !== "all" && r.region !== region) return false;
    return true;
  });
}

function sortStates(rows: StateRow[], mode: SortMode): StateRow[] {
  const copy = [...rows];
  if (mode === "delta") return copy.sort((a, b) => b.delta - a.delta);
  if (mode === "localShare")
    return copy.sort((a, b) => b.localShare - a.localShare);
  return copy.sort((a, b) => b.total2022 - a.total2022);
}

export function LibraryOperatingRevenuePerCapitaByState2026Dashboard() {
  const [view, setView] = useState<ViewId>("spread");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [includeDc, setIncludeDc] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>("revenue");

  const filtered = useMemo(
    () => filterStates(STATE_PANEL, region, includeDc),
    [region, includeDc],
  );

  const ladder = useMemo(
    () => sortStates(filtered, sortMode),
    [filtered, sortMode],
  );

  const scatterData = useMemo(
    () =>
      filtered.map((r) => ({
        abbr: r.abbr,
        region: r.region,
        x: r.total2019,
        y: r.total2022,
        delta: r.delta,
        z: Math.max(40, Math.min(180, r.libs / 2)),
      })),
    [filtered],
  );

  const sourceRows = useMemo(() => {
    const ranked = [...filtered].sort((a, b) => b.total2022 - a.total2022);
    const pick =
      ranked.length <= 14
        ? ranked
        : [...ranked.slice(0, 7), ...ranked.slice(-7)];
    return pick.map((r) => ({
      abbr: r.abbr,
      Local: +r.local.toFixed(2),
      State: +r.stateRev.toFixed(2),
      Federal: +r.fed.toFixed(2),
      Other: +r.other.toFixed(2),
      total: r.total2022,
    }));
  }, [filtered]);

  const deltaRows = useMemo(() => {
    const pool =
      region === "all" && includeDc
        ? [...DELTA_LEADERS, ...DELTA_LAGGARDS]
        : [...filtered].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, 16);
    const uniq = new Map<string, StateRow>();
    for (const r of pool) {
      if (!includeDc && r.abbr === "DC") continue;
      if (region !== "all" && r.region !== region) continue;
      uniq.set(r.abbr, r);
    }
    return [...uniq.values()].sort((a, b) => a.delta - b.delta);
  }, [filtered, region, includeDc]);

  const regionCompare = useMemo(() => {
    return REGION_SUMMARY_2022.map((r2022) => {
      const r2019 = REGION_SUMMARY_2019.find((x) => x.region === r2022.region)!;
      return {
        region: r2022.region,
        mean2019: r2019.mean,
        mean2022: r2022.mean,
        ratio2019: r2019.ratio,
        ratio2022: r2022.ratio,
      };
    });
  }, []);

  return (
    <div
      className="space-y-4"
      data-viz={SLUG}
      data-smoke="Revenue per capita spread"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-5 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-200/90">
          IMLS PLS · Table 8 · FY 2018–2022
        </p>
        <p className="mt-2 max-w-3xl text-2xl font-semibold leading-snug tracking-tight">
          Revenue per capita spread:{" "}
          <span className="text-teal-300">{HEADLINE.ratio2022}×</span> from{" "}
          {fmtUsd(HEADLINE.max2022, 0)} (DC) to {fmtUsd(HEADLINE.min2022, 0)}{" "}
          (MS) — range widened from {fmtUsd(HEADLINE.range2019, 0)} to{" "}
          {fmtUsd(HEADLINE.range2022, 0)} after 2020.
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          State mean rose from {fmtUsd(HEADLINE.mean2019, 2)} to{" "}
          {fmtUsd(HEADLINE.mean2022, 2)}. {HEADLINE.statesUp} jurisdictions
          gained dollars per person vs FY 2019; {HEADLINE.statesDown} lost
          ground.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setView(v.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              view === v.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Region
          <select
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"
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
          Ladder sort
          <select
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
          >
            <option value="revenue">FY 2022 revenue</option>
            <option value="delta">$ change since 2019</option>
            <option value="localShare">Local share</option>
          </select>
        </label>
        <label className="flex items-center gap-2 pb-1 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={includeDc}
            onChange={(e) => setIncludeDc(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Include D.C.
        </label>
        <p className="ml-auto pb-1 text-xs text-slate-500">
          Showing {filtered.length} of {HEADLINE.stateN} jurisdictions
        </p>
      </div>

      {view === "spread" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Max–min dollar range"
            subtitle="Highest state minus lowest ($ per person). Climbed after FY 2019."
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={NATIONAL_SPREAD}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fy" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `$${v}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  domain={[4.5, 6.5]}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = Number(value);
                    if (name === "ratio") return [`${n.toFixed(2)}×`, "Max/min"];
                    return [fmtUsd(n, 2), String(name)];
                  }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="range"
                  name="Dollar range"
                  fill={TEAL}
                  fillOpacity={0.25}
                  stroke={TEAL}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ratio"
                  name="Max/min ratio"
                  stroke={ROSE}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="P90–P10 middle-band spread"
            subtitle="Gap between 90th and 10th percentile states ($)."
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={NATIONAL_SPREAD}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fy" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(value, name) => [
                    fmtUsd(Number(value), 2),
                    String(name),
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="p90p10"
                  name="P90–P10"
                  fill={INDIGO}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="mean"
                  name="State mean"
                  stroke={AMBER}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      {view === "ladder" ? (
        <ChartCard
          title="Operating revenue per capita ladder"
          subtitle="FY 2022 total $ per legal-service-area person. Color = Census region."
          tall
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ladder}
              layout="vertical"
              margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `$${v}`}
              />
              <YAxis
                type="category"
                dataKey="abbr"
                width={36}
                tick={{ fontSize: 10 }}
                interval={0}
              />
              <Tooltip
                formatter={(value, _n, item) => {
                  const row = item?.payload as StateRow | undefined;
                  return [
                    `${fmtUsd(Number(value), 2)} (Δ ${fmtUsd(row?.delta ?? 0, 2)} vs 2019)`,
                    row?.state ?? "Revenue",
                  ];
                }}
              />
              <Bar dataKey="total2022" name="FY 2022 $" radius={[0, 3, 3, 0]}>
                {ladder.map((r) => (
                  <Cell key={r.abbr} fill={REGION_COLOR[r.region]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "scatter" ? (
        <ChartCard
          title="Did high-revenue states pull further ahead?"
          subtitle="Each point is a state. Diagonal = no change. Above = higher FY 2022 revenue."
          tall
        >
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="x"
                name="FY 2019"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `$${v}`}
                domain={[10, "dataMax + 5"]}
                label={{
                  value: "FY 2019 $ per capita",
                  position: "insideBottom",
                  offset: -2,
                  style: { fontSize: 11, fill: SLATE },
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="FY 2022"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `$${v}`}
                domain={[10, "dataMax + 5"]}
                label={{
                  value: "FY 2022 $",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 11, fill: SLATE },
                }}
              />
              <ZAxis type="number" dataKey="z" range={[40, 200]} />
              <ReferenceLine
                segment={[
                  { x: 15, y: 15 },
                  { x: 115, y: 115 },
                ]}
                stroke={SLATE}
                strokeDasharray="4 4"
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name) => [
                  fmtUsd(Number(value), 2),
                  name === "x" ? "FY 2019" : name === "y" ? "FY 2022" : String(name),
                ]}
                labelFormatter={(_, payload) => {
                  const p = payload?.[0]?.payload as
                    | { abbr?: string; region?: string; delta?: number }
                    | undefined;
                  if (!p?.abbr) return "";
                  return `${p.abbr} · ${p.region} · Δ ${fmtUsd(p.delta ?? 0, 2)}`;
                }}
              />
              {(Object.keys(REGION_COLOR) as RegionId[]).map((reg) => (
                <Scatter
                  key={reg}
                  name={reg}
                  data={scatterData.filter((d) => d.region === reg)}
                  fill={REGION_COLOR[reg]}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "sources" ? (
        <ChartCard
          title="Who pays: local, state, federal, other"
          subtitle="Stacked $ per capita (FY 2022). Top and bottom of the filtered ladder shown when many states."
          tall
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sourceRows}
              layout="vertical"
              margin={{ left: 8, right: 12, top: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `$${v}`}
              />
              <YAxis
                type="category"
                dataKey="abbr"
                width={36}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value, name) => [
                  fmtUsd(Number(value), 2),
                  String(name),
                ]}
              />
              <Legend />
              <Bar dataKey="Local" stackId="a" fill={TEAL} />
              <Bar dataKey="State" stackId="a" fill={INDIGO} />
              <Bar dataKey="Federal" stackId="a" fill={AMBER} />
              <Bar dataKey="Other" stackId="a" fill={SLATE} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "deltas" ? (
        <ChartCard
          title="Dollar change FY 2019 → FY 2022"
          subtitle="Absolute $ per person. Positive bars pulled the top of the distribution higher."
          tall
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={deltaRows}
              layout="vertical"
              margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `$${v}`}
              />
              <YAxis
                type="category"
                dataKey="abbr"
                width={36}
                tick={{ fontSize: 11 }}
              />
              <ReferenceLine x={0} stroke={INK} />
              <Tooltip
                formatter={(value, _n, item) => {
                  const row = item?.payload as StateRow | undefined;
                  return [
                    `${fmtUsd(Number(value), 2)} (${row?.pctChange ?? 0}%)`,
                    row?.state ?? "Δ $",
                  ];
                }}
              />
              <Bar dataKey="delta" name="Δ $ per capita" radius={[0, 3, 3, 0]}>
                {deltaRows.map((r) => (
                  <Cell
                    key={r.abbr}
                    fill={r.delta >= 0 ? TEAL : ROSE}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "regions" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Regional means"
            subtitle="Average state per-capita revenue by Census region."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionCompare}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(value, name) => [
                    fmtUsd(Number(value), 2),
                    String(name),
                  ]}
                />
                <Legend />
                <Bar dataKey="mean2019" name="FY 2019 mean" fill={SLATE} />
                <Bar dataKey="mean2022" name="FY 2022 mean" fill={TEAL} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Within-region max/min ratios"
            subtitle="How stretched each region is internally."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionCompare}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value, name) => [
                    `${Number(value).toFixed(2)}×`,
                    String(name),
                  ]}
                />
                <Legend />
                <Bar dataKey="ratio2019" name="FY 2019 ratio" fill={SLATE} />
                <Bar dataKey="ratio2022" name="FY 2022 ratio" fill={ROSE} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
