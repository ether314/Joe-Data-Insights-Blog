"use client";

import { useMemo, useState } from "react";
import {
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
  HEADLINE,
  NATIONAL_RAP_TREND,
  SOURCE_NOTE,
  TRADE_FUNNEL,
  fmtInt,
  fmtRatio,
  gapBand,
  regionRollup,
  rowsForTrade,
  type GapBand,
  type TradeId,
} from "@/data/registered-apprenticeships-vs-trades-retirements-2026-data";

// viz-types: ratio scatter, state rank bars, region composed, national RAP trend + funnel | layout: default

type ViewId = "scatter" | "rank" | "regions" | "national";
type GapFilter = "all" | GapBand;

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const EMERALD = "#059669";

const GAP_COLORS: Record<GapBand, string> = {
  surplus: EMERALD,
  thin: AMBER,
  deficit: ROSE,
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
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function RegisteredApprenticeshipsVsTradesRetirements2026Dashboard() {
  const [trade, setTrade] = useState<TradeId>("electrician");
  const [view, setView] = useState<ViewId>("scatter");
  const [gap, setGap] = useState<GapFilter>("all");

  const rows = useMemo(() => {
    const base = rowsForTrade(trade);
    if (gap === "all") return base;
    return base.filter((r) => gapBand(r.entrantsPerRetirement) === gap);
  }, [trade, gap]);

  const funnel = TRADE_FUNNEL.find((t) => t.trade === trade)!;
  const regions = useMemo(() => regionRollup(trade), [trade]);

  const scatterData = useMemo(
    () =>
      rows.map((r) => ({
        ...r,
        x: r.retirements,
        y: r.newEntrants,
        z: Math.max(r.employment / 80, 40),
        band: gapBand(r.entrantsPerRetirement),
      })),
    [rows],
  );

  const rankData = useMemo(
    () =>
      [...rows]
        .sort((a, b) => b.entrantsPerRetirement - a.entrantsPerRetirement)
        .map((r) => ({
          abbr: r.abbr,
          state: r.state,
          ratio: r.entrantsPerRetirement,
          entrants: r.newEntrants,
          retirements: r.retirements,
          band: gapBand(r.entrantsPerRetirement),
        })),
    [rows],
  );

  const regionChart = useMemo(
    () =>
      regions.map((r) => ({
        region: r.region,
        entrants: r.entrants,
        retirements: r.retirements,
        ratio: r.entrantsPerRetirement,
      })),
    [regions],
  );

  const trend = NATIONAL_RAP_TREND.map((r) => ({
    fy: `FY${String(r.fy).slice(2)}`,
    activeK: Math.round(r.active / 1000),
    newK: Math.round(r.neu / 1000),
    completersK: Math.round(r.completers / 1000),
  }));

  const deficitCount = rowsForTrade(trade).filter(
    (r) => gapBand(r.entrantsPerRetirement) === "deficit",
  ).length;

  const tradeLabel =
    trade === "electrician" ? "Electricians" : "Plumbers / pipefitters";

  return (
    <div
      className="space-y-6"
      data-viz="registered-apprenticeships-vs-trades-retirements-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
          Apprenticeship pipelines · entrants per retirement
        </p>
        <p className="mt-2 text-lg font-semibold leading-snug sm:text-xl">
          National RAP starts cover about {fmtRatio(HEADLINE.elecEntrantsPerRetire)}{" "}
          projected electrician retirements and{" "}
          {fmtRatio(HEADLINE.plumbEntrantsPerRetire)} plumber retirements — but{" "}
          {trade === "electrician"
            ? HEADLINE.elecDeficitStates
            : HEADLINE.plumbDeficitStates}{" "}
          states in this panel still sit below 1.0× for {tradeLabel.toLowerCase()}.
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Filtered view shows {rows.length} states · {deficitCount} deficit under
          current trade toggle. BLS openings ({fmtInt(funnel.openings)}/yr) still
          dwarf RAP starts ({fmtInt(funnel.newEntrants)}) because openings include
          occupational transfers, not just retirements.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Trade"
          value={trade}
          onChange={setTrade}
          options={[
            { id: "electrician", label: "Electrician" },
            { id: "plumber", label: "Plumber" },
          ]}
        />
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "scatter", label: "Scatter" },
            { id: "rank", label: "Rank" },
            { id: "regions", label: "Regions" },
            { id: "national", label: "National" },
          ]}
        />
        <ToggleGroup
          label="Gap"
          value={gap}
          onChange={setGap}
          options={[
            { id: "all", label: "All" },
            { id: "surplus", label: "≥1.25×" },
            { id: "thin", label: "1.0–1.25×" },
            { id: "deficit", label: "<1.0×" },
          ]}
        />
      </div>

      {view === "scatter" && (
        <ChartCard
          title={`${tradeLabel}: retirements vs new RAP entrants`}
          subtitle="Each point is a state · bubble ≈ employment · dashed line = 1:1 replacement"
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 20, bottom: 12, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Retirements"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  label={{
                    value: "Projected annual retirements",
                    position: "insideBottom",
                    offset: -2,
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Entrants"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  width={52}
                  label={{
                    value: "New RAP entrants",
                    angle: -90,
                    position: "insideLeft",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[50, 360]} />
                <ReferenceLine
                  segment={[
                    { x: 0, y: 0 },
                    { x: 1600, y: 1600 },
                  ]}
                  stroke={SLATE}
                  strokeDasharray="6 4"
                  ifOverflow="extendDomain"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload as (typeof scatterData)[0];
                    if (!d) return null;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">
                          {d.state} ({d.abbr})
                        </p>
                        <p className="text-slate-600">
                          Entrants {fmtInt(d.newEntrants)} · Retirements{" "}
                          {fmtInt(d.retirements)}
                        </p>
                        <p className="text-slate-600">
                          Ratio {fmtRatio(d.entrantsPerRetirement)}× · Employment{" "}
                          {fmtInt(d.employment)}
                        </p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatterData} name="States">
                  {scatterData.map((d) => (
                    <Cell
                      key={d.abbr}
                      fill={GAP_COLORS[d.band]}
                      fillOpacity={0.88}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
            {(Object.keys(GAP_COLORS) as GapBand[]).map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: GAP_COLORS[b] }}
                />
                {b}
              </span>
            ))}
            <span className="text-slate-400">· dashed = 1 entrant per retirement</span>
          </div>
        </ChartCard>
      )}

      {view === "rank" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Entrants per projected retirement"
            subtitle={`${tradeLabel} · sorted high → low · 1.0 = replacement parity`}
          >
            <div className="h-[440px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={rankData}
                  layout="vertical"
                  margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: SLATE, fontSize: 11 }}
                    domain={[0, "auto"]}
                  />
                  <YAxis
                    type="category"
                    dataKey="abbr"
                    width={36}
                    tick={{ fill: SLATE, fontSize: 11 }}
                  />
                  <ReferenceLine x={1} stroke={NAVY} strokeDasharray="4 3" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload as (typeof rankData)[0];
                      if (!d) return null;
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{d.state}</p>
                          <p className="text-slate-600">
                            {fmtRatio(d.ratio)}× · {fmtInt(d.entrants)} entrants /{" "}
                            {fmtInt(d.retirements)} retirements
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="ratio" name="Ratio" radius={[0, 4, 4, 0]}>
                    {rankData.map((d) => (
                      <Cell key={d.abbr} fill={GAP_COLORS[d.band]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Absolute gap (entrants − retirements)"
            subtitle="Positive = RAP starts exceed desk retirement drain"
          >
            <div className="h-[440px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...rankData]
                    .map((d) => ({
                      ...d,
                      gap: d.entrants - d.retirements,
                    }))
                    .sort((a, b) => b.gap - a.gap)}
                  layout="vertical"
                  margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="abbr"
                    width={36}
                    tick={{ fill: SLATE, fontSize: 11 }}
                  />
                  <ReferenceLine x={0} stroke={NAVY} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload as {
                        state: string;
                        gap: number;
                        ratio: number;
                      };
                      if (!d) return null;
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{d.state}</p>
                          <p className="text-slate-600">
                            Gap {d.gap > 0 ? "+" : ""}
                            {fmtInt(d.gap)} · ratio {fmtRatio(d.ratio)}×
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="gap" name="Gap" radius={[0, 4, 4, 0]}>
                    {[...rankData]
                      .map((d) => ({
                        ...d,
                        gap: d.entrants - d.retirements,
                      }))
                      .sort((a, b) => b.gap - a.gap)
                      .map((d) => (
                        <Cell
                          key={d.abbr}
                          fill={d.gap >= 0 ? TEAL : ROSE}
                        />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "regions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Census region rollup"
            subtitle={`${tradeLabel} · stacked entrants vs retirements`}
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={regionChart}
                  margin={{ top: 12, right: 16, bottom: 8, left: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="region" tick={{ fill: SLATE, fontSize: 12 }} />
                  <YAxis tick={{ fill: SLATE, fontSize: 12 }} width={48} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="entrants" name="New entrants" fill={TEAL} radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="retirements"
                    name="Retirements"
                    fill={ROSE}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="ratio"
                    name="Ratio (×)"
                    stroke={INDIGO}
                    strokeWidth={2}
                    yAxisId={0}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Region ratio scoreboard"
            subtitle="Entrants ÷ projected retirements"
          >
            <div className="space-y-3 p-1">
              {regionChart.map((r) => {
                const band = gapBand(r.ratio);
                const pct = Math.min(r.ratio / 2.5, 1) * 100;
                return (
                  <div key={r.region}>
                    <div className="mb-1 flex items-baseline justify-between text-sm">
                      <span className="font-semibold text-slate-800">{r.region}</span>
                      <span className="tabular-nums text-slate-600">
                        {fmtRatio(r.ratio)}× · {fmtInt(r.entrants)} /{" "}
                        {fmtInt(r.retirements)}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: GAP_COLORS[band],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              <p className="pt-2 text-xs text-slate-500">
                Bar length scaled to 2.5×. National {tradeLabel.toLowerCase()} ratio:{" "}
                {fmtRatio(funnel.entrantsPerRetirement)}×.
              </p>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "national" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="All-occupation RAPIDS trend"
            subtitle="CRS / apprenticeship.gov national totals (not trade-split)"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trend} margin={{ top: 12, right: 16, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="fy" tick={{ fill: SLATE, fontSize: 12 }} />
                  <YAxis
                    tick={{ fill: SLATE, fontSize: 12 }}
                    width={40}
                    label={{
                      value: "Thousands",
                      angle: -90,
                      position: "insideLeft",
                      fill: SLATE,
                      fontSize: 11,
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="activeK" name="Active" fill={NAVY} radius={[3, 3, 0, 0]} />
                  <Line
                    type="monotone"
                    dataKey="newK"
                    name="New"
                    stroke={TEAL}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completersK"
                    name="Completers"
                    stroke={AMBER}
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title={`${tradeLabel} national funnel`}
            subtitle="Employment → 55+ retirements vs RAP starts vs BLS openings"
          >
            <div className="space-y-4">
              {[
                {
                  label: "Employment base",
                  value: funnel.employment,
                  color: NAVY,
                  note: "BLS EP / OEWS scale",
                },
                {
                  label: `55+ share (${funnel.share55}%)`,
                  value: Math.round(funnel.employment * (funnel.share55 / 100)),
                  color: INDIGO,
                  note: "CPS A-11b national age",
                },
                {
                  label: "Projected annual retirements",
                  value: funnel.retirements,
                  color: ROSE,
                  note: "Desk: 55+ ÷ 10-year cohort",
                },
                {
                  label: "New RAP entrants (FY)",
                  value: funnel.newEntrants,
                  color: TEAL,
                  note: `Ratio ${fmtRatio(funnel.entrantsPerRetirement)}× vs retirements`,
                },
                {
                  label: "BLS annual openings",
                  value: funnel.openings,
                  color: AMBER,
                  note: `RAP covers ${fmtRatio(funnel.entrantsPerOpening)}× of openings`,
                },
              ].map((row) => {
                const max = funnel.employment;
                const width = Math.max((row.value / max) * 100, 2);
                return (
                  <div key={row.label}>
                    <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2 text-sm">
                      <span className="font-semibold text-slate-800">{row.label}</span>
                      <span className="tabular-nums font-medium text-slate-700">
                        {fmtInt(row.value)}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${width}%`, background: row.color }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{row.note}</p>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
