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
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  HEADLINE,
  LAT_VLAT_ANNUAL,
  SOURCE_NOTE,
  VIZ_MARKERS,
  costStackForCy,
  dualStackSeries,
  eraSummary,
  fmtHours,
  fmtPct,
  fmtUsd,
  latVlatDecompose,
  latVlatTotalHours,
  rateCompareBars,
  scatterEfficiency,
  type EraId,
  type1Stack,
} from "@/data/federal-firefighting-contract-aviation-hours-2026-data";

// viz-types: stacked area, share line, grouped rate bars, cost pie, hours×$/hr scatter, Type-1 bars
// | layout: default
// smoke-marker: Exclusive-use vs CWN hours

type ViewId =
  | "stack"
  | "share"
  | "type1"
  | "rates"
  | "costMix"
  | "scatter";

type EraFilter = "all" | EraId;

const INDIGO = "#4f46e5";
const AMBER = "#d97706";
const TEAL = "#0d9488";
const ROSE = "#e11d48";

const ERA_COLORS: Record<EraId, string> = {
  quiet: TEAL,
  surge: AMBER,
  rebalance: INDIGO,
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

export function FederalFirefightingContractAviationHours2026Dashboard() {
  const [view, setView] = useState<ViewId>("stack");
  const [eraFilter, setEraFilter] = useState<EraFilter>("all");
  const [costCy, setCostCy] = useState(2021);
  const [decomposeCy, setDecomposeCy] = useState(2021);

  const series = useMemo(() => {
    const all = dualStackSeries();
    if (eraFilter === "all") return all;
    return all.filter((r) => r.era === eraFilter);
  }, [eraFilter]);

  const eras = useMemo(() => eraSummary(), []);
  const rates = useMemo(() => rateCompareBars(), []);
  const scatter = useMemo(() => {
    const pts = scatterEfficiency();
    if (eraFilter === "all") return pts;
    return pts.filter((p) => p.era === eraFilter);
  }, [eraFilter]);
  const type1 = useMemo(() => type1Stack(), []);
  const costMix = useMemo(() => costStackForCy(costCy), [costCy]);
  const decompose = useMemo(() => latVlatDecompose(decomposeCy), [decomposeCy]);
  const cyOptions = LAT_VLAT_ANNUAL.map((r) => r.cy);

  const PIE_COLORS = ["#4f46e5", "#d97706", "#64748b"];

  return (
    <div
      className="mx-auto w-full max-w-5xl space-y-6"
      data-viz="federal-firefighting-contract-aviation-hours-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-300/90">
          {VIZ_MARKERS[0]}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {HEADLINE.cy2021ExuSharePct}% of LAT/VLAT hours flew on exclusive-use contracts in CY2021 — but CWN daily rates ran {HEADLINE.cwnDailyPremiumPct}% higher
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          USDA Forest Service calendar-year billing on large and very-large airtankers (LAT/VLAT),
          with Type 1 helicopter contract splits and published EU vs call-when-needed tariff spreads.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "CY2021 EXU share", value: fmtPct(HEADLINE.cy2021ExuSharePct) },
            { label: "CY2020 EXU share (surge)", value: fmtPct(HEADLINE.cy2020ExuSharePct) },
            { label: "CY2021 flight $/hr", value: fmtUsd(HEADLINE.cy2021FlightCostPerHour) },
            { label: "CWN hourly premium", value: `+${HEADLINE.cwnHourlyPremiumPct}%` },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                {k.label}
              </p>
              <p className="mt-0.5 text-lg font-bold tabular-nums">{k.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup
          value={view}
          onChange={setView}
          options={[
            { id: "stack", label: "Hour stack" },
            { id: "share", label: "EXU share" },
            { id: "type1", label: "Type 1 helos" },
            { id: "rates", label: "Rate spread" },
            { id: "costMix", label: "Cost mix" },
            { id: "scatter", label: "Hours × $/hr" },
          ]}
        />
        <ToggleGroup
          value={eraFilter}
          onChange={setEraFilter}
          options={[
            { id: "all", label: "All eras" },
            { id: "quiet", label: "2017–19" },
            { id: "surge", label: "2020 surge" },
            { id: "rebalance", label: "2021" },
          ]}
        />
      </div>

      {view === "stack" && (
        <ChartCard
          title="LAT/VLAT flight hours by contract type"
          subtitle="Stacked calendar-year hours — EXU vs CWN (USFS Aviation Reports, Tables 16–22)"
        >
          <div className="mb-4">
            <ToggleGroup
              value={String(decomposeCy)}
              onChange={(v) => setDecomposeCy(Number(v))}
              options={cyOptions.map((cy) => ({ id: String(cy), label: `CY${cy} detail` }))}
            />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="cy" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => fmtHours(v)} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="exuHours"
                  name="Exclusive use"
                  stackId="h"
                  fill={INDIGO}
                  stroke={INDIGO}
                />
                <Area
                  type="monotone"
                  dataKey="cwnHours"
                  name="Call when needed"
                  stackId="h"
                  fill={AMBER}
                  stroke={AMBER}
                />
              </ComposedChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={decompose} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => fmtHours(v)} />
                <YAxis type="category" dataKey="segment" width={90} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
                  {decompose.map((entry) => (
                    <Cell
                      key={entry.segment}
                      fill={entry.kind === "exu" ? INDIGO : AMBER}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "share" && (
        <ChartCard
          title="Exclusive-use share of LAT/VLAT hours"
          subtitle="CY2020 surge pulled the share to 54%; CY2021 rebounded to 81%"
        >
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={series} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="cy" />
              <YAxis domain={[40, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => fmtPct(Number(v))} />
              <Line
                type="monotone"
                dataKey="exuShare"
                name="EXU share"
                stroke={INDIGO}
                strokeWidth={3}
                dot={{ r: 5, fill: INDIGO }}
              />
              <Line
                type="monotone"
                dataKey="cwnShare"
                name="CWN share"
                stroke={AMBER}
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={{ r: 4, fill: AMBER }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {eras.map((e) => (
              <div
                key={e.id}
                className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase" style={{ color: e.color }}>
                  {e.label} ({e.years})
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Avg EXU share{" "}
                  <span className="font-bold text-slate-900">{fmtPct(e.avgExuSharePct)}</span>
                </p>
                <p className="text-sm text-slate-600">
                  Avg hours{" "}
                  <span className="font-bold text-slate-900">{fmtHours(e.avgTotalHours)}</span>
                </p>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {view === "type1" && (
        <ChartCard
          title="Type 1 helicopter hours — contract channel"
          subtitle="CY2020–2021: EU Type 1 gap filled entirely by CWN and surge task orders"
        >
          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart data={type1} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="cy" />
              <YAxis yAxisId="left" tickFormatter={(v) => fmtHours(v)} />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[90, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="exuHours" name="EXU hours" fill={INDIGO} stackId="t1" />
              <Bar yAxisId="left" dataKey="cwnHours" name="CWN hours" fill={AMBER} stackId="t1" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cwnShare"
                name="CWN share"
                stroke={ROSE}
                strokeWidth={2}
                dot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {view === "rates" && (
        <ChartCard
          title="Published EU vs CWN rate spread (large airtankers)"
          subtitle="2018 desk composite — CWN daily +54%, hourly +18% vs exclusive-use"
        >
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={rates} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="metric" />
              <YAxis tickFormatter={(v) => fmtUsd(v)} />
              <Tooltip formatter={(v) => fmtUsd(Number(v))} />
              <Legend />
              <Bar dataKey="exu" name="Exclusive use" fill={INDIGO} radius={[4, 4, 0, 0]} />
              <Bar dataKey="cwn" name="Call when needed" fill={AMBER} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            USFS Large Airtanker Modernization Strategy (2018) states EU LAT all-in costs run roughly
            half of CWN — availability retainer buys capacity before the first drop.
          </p>
        </ChartCard>
      )}

      {view === "costMix" && (
        <ChartCard
          title="LAT/VLAT cost decomposition"
          subtitle="IBS pay codes — availability vs flight time (CY2020–2021 disclosed)"
        >
          <div className="mb-4">
            <ToggleGroup
              value={String(costCy)}
              onChange={(v) => setCostCy(Number(v))}
              options={[
                { id: "2020", label: "CY2020" },
                { id: "2021", label: "CY2021" },
              ]}
            />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costMix}
                  dataKey="millions"
                  nameKey="payCode"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  label={(props) => {
                    const row = props.payload as { payCode?: string; millions?: number };
                    return row.payCode && row.millions != null
                      ? `${row.payCode}: $${row.millions}M`
                      : "";
                  }}
                >
                  {costMix.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(v) => `$${Number(v)}M`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col justify-center space-y-3">
              {costMix.map((c, i) => (
                <div key={c.payCode} className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: PIE_COLORS[i] }}
                  />
                  <span className="text-sm text-slate-700">
                    {c.payCode}: <strong>${c.millions}M</strong>
                  </span>
                </div>
              ))}
              <p className="text-xs text-slate-500">
                Implied flight $/hr CY{costCy}:{" "}
                <strong>
                  {fmtUsd(
                    Math.round(
                      ((LAT_VLAT_ANNUAL.find((r) => r.cy === costCy)?.flightCostM ?? 0) *
                        1_000_000) /
                        latVlatTotalHours(
                          LAT_VLAT_ANNUAL.find((r) => r.cy === costCy)!,
                        ),
                    ),
                  )}
                </strong>
              </p>
            </div>
          </div>
        </ChartCard>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Total hours vs implied flight $/hour"
          subtitle="More CWN-heavy years did not always mean lower blended flight rates"
        >
          <ResponsiveContainer width="100%" height={360}>
            <ScatterChart margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="hours"
                name="Total hours"
                tickFormatter={(v) => fmtHours(v)}
              />
              <YAxis
                type="number"
                dataKey="flightPerHour"
                name="Flight $/hr"
                tickFormatter={(v) => fmtUsd(v)}
              />
              <ZAxis type="number" dataKey="exuShare" range={[80, 400]} name="EXU share" />
              <RechartsTooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) =>
                  name === "EXU share" ? fmtPct(Number(v)) : fmtUsd(Number(v))
                }
              />
              <Scatter data={scatter} fill={INDIGO}>
                {scatter.map((p) => (
                  <Cell key={p.cy} fill={ERA_COLORS[p.era]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
