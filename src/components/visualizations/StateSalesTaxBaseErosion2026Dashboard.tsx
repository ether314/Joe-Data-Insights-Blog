"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
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
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ANALYTICS,
  DECADE_DELTAS,
  EROSION_SERIES,
  HEADLINE,
  LEAK_COMPOSITION,
  SERVICE_CATEGORIES,
  SOURCE_NOTE,
  filterStates,
  type RegionFilter,
  type SortKey,
} from "@/data/state-sales-tax-base-erosion-2026-data";

type Panel =
  | "erosion-path"
  | "leak-mix"
  | "state-ladder"
  | "rate-breadth"
  | "service-leaks"
  | "decade-deltas";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "erosion-path": {
    title: "Taxable vs escaped share of potential base",
    subtitle: `Escaped share rose from ${HEADLINE.escapedShare1970Pct}% (1970) to ${HEADLINE.escapedSharePct}% — ${HEADLINE.escapeRisePp} pp, mostly mix shift`,
  },
  "leak-mix": {
    title: "Where the potential base sits today",
    subtitle: `Untaxed services alone are ${HEADLINE.untaxedServicesOfEscapePct}% of total escape`,
  },
  "state-ladder": {
    title: "Escaped share by state",
    subtitle: "Broad-base peers (HI/NM/SD) sit far below the narrow-base GST pack",
  },
  "rate-breadth": {
    title: "Combined rate vs FTA services taxed",
    subtitle: "High rates on narrow bases cluster opposite broad low-rate peers",
  },
  "service-leaks": {
    title: "Service-category leak scores",
    subtitle: "Health, housing, and finance dominate PCE weight and under-taxation",
  },
  "decade-deltas": {
    title: "Decade-by-decade escape acceleration",
    subtitle: "Fastest mix-driven leak in the 1970s–90s; slower but still positive since 2010",
  },
};

const REGION_OPTS: { id: RegionFilter; label: string }[] = [
  { id: "all", label: "All regions" },
  { id: "northeast", label: "Northeast" },
  { id: "midwest", label: "Midwest" },
  { id: "south", label: "South" },
  { id: "west", label: "West" },
];

const SORT_OPTS: { id: SortKey; label: string }[] = [
  { id: "escaped", label: "Escaped %" },
  { id: "services", label: "FTA services" },
  { id: "sales-share", label: "Sales/tax share" },
  { id: "mix-shift", label: "Mix-shift pp" },
];

const fmtPct = (n: number) => `${n.toFixed(1)}%`;
const tipPct = (v: unknown) =>
  typeof v === "number" ? fmtPct(v) : String(v);

export function StateSalesTaxBaseErosion2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("erosion-path");
  const [region, setRegion] = useState<RegionFilter>(ANALYTICS.defaultRegion);
  const [sort, setSort] = useState<SortKey>(ANALYTICS.defaultSort);

  const meta = PANEL_META[panel];
  const states = useMemo(() => filterStates(region, sort), [region, sort]);

  const ladderData = useMemo(
    () =>
      states.map((s) => ({
        abbr: s.abbr,
        escaped: s.escapedSharePct,
        mix: s.mixShiftPp,
        color: s.broadBase ? "#0f766e" : "#c2410c",
      })),
    [states],
  );

  const scatterData = useMemo(
    () =>
      states.map((s) => ({
        abbr: s.abbr,
        services: s.servicesTaxed,
        rate: s.combinedRatePct,
        escaped: s.escapedSharePct,
        broad: s.broadBase,
      })),
    [states],
  );

  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      data-viz="state-sales-tax-base-erosion-2026"
    >
      <div className="border-b border-slate-200 bg-slate-950 px-4 py-4 text-white sm:px-6">
        <p className="text-xs font-medium uppercase tracking-wider text-amber-300/90">
          Economics · Base leak to services
        </p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
          State sales-tax base erosion
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-slate-300">
          About {HEADLINE.escapedSharePct}% of the potential household consumption
          base sits outside a typical GST — up {HEADLINE.escapeRisePp} pp since
          1970, with {HEADLINE.mixShiftContributionPp} pp from the goods→services
          mix alone.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              Escaped share (2024)
            </div>
            <div className="font-semibold text-amber-200">
              {fmtPct(HEADLINE.escapedSharePct)}
            </div>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              Rise since 1970
            </div>
            <div className="font-semibold text-rose-200">
              +{HEADLINE.escapeRisePp} pp
            </div>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              Mix-shift contribution
            </div>
            <div className="font-semibold text-teal-300">
              +{HEADLINE.mixShiftContributionPp} pp
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-6">
        {(
          [
            ["erosion-path", "Erosion path"],
            ["leak-mix", "Leak mix"],
            ["state-ladder", "State ladder"],
            ["rate-breadth", "Rate vs breadth"],
            ["service-leaks", "Service leaks"],
            ["decade-deltas", "Decade deltas"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPanel(id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              panel === id
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3 sm:px-6">
        <span className="text-xs font-medium text-slate-500">Region</span>
        {REGION_OPTS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRegion(r.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              region === r.id
                ? "bg-amber-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {r.label}
          </button>
        ))}
        <span className="ml-2 text-xs font-medium text-slate-500">Sort</span>
        {SORT_OPTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSort(s.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              sort === s.id
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 sm:px-6">
        <h4 className="text-sm font-semibold text-slate-900">{meta.title}</h4>
        <p className="mt-0.5 text-xs text-slate-500">{meta.subtitle}</p>

        <div className="mt-4 h-[360px] w-full">
          {panel === "erosion-path" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={EROSION_SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  domain={[30, 70]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip formatter={tipPct} contentStyle={{ fontSize: 12 }} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="escapedSharePct"
                  name="Escaped share"
                  stroke="#c2410c"
                  fill="#c2410c33"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="taxableSharePct"
                  name="Taxable share"
                  stroke="#0f766e"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="servicesSharePct"
                  name="Services % of PCE"
                  stroke="#64748b"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {panel === "leak-mix" && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={LEAK_COMPOSITION}
                  dataKey="sharePct"
                  nameKey="shortLabel"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={2}
                  label={(props) => {
                    const name = String(props.name ?? "");
                    const value = Number(props.value ?? 0);
                    return `${name} ${value}%`;
                  }}
                >
                  {LEAK_COMPOSITION.map((b) => (
                    <Cell key={b.id} fill={b.color} />
                  ))}
                </Pie>
                <Tooltip formatter={tipPct} contentStyle={{ fontSize: 12 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}

          {panel === "state-ladder" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ladderData}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[20, 65]}
                />
                <YAxis
                  type="category"
                  dataKey="abbr"
                  width={36}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip formatter={tipPct} contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="escaped" name="Escaped share" radius={[0, 4, 4, 0]}>
                  {ladderData.map((d) => (
                    <Cell key={d.abbr} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {panel === "rate-breadth" && (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: 8, right: 16, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="services"
                  name="FTA services taxed"
                  tick={{ fontSize: 11 }}
                  domain={[0, 180]}
                  label={{
                    value: "FTA services taxed (of 176)",
                    position: "insideBottom",
                    offset: -2,
                    style: { fontSize: 11 },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="rate"
                  name="Combined rate"
                  tick={{ fontSize: 11 }}
                  unit="%"
                  domain={[4, 10]}
                />
                <ZAxis type="number" dataKey="escaped" range={[60, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{ fontSize: 12 }}
                  formatter={(value, name) => {
                    if (name === "Combined rate") return [`${value}%`, name];
                    if (name === "FTA services taxed") return [value, name];
                    return [value, name];
                  }}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.abbr ?? ""
                  }
                />
                <Scatter
                  name="GST states"
                  data={scatterData.filter((d) => !d.broad)}
                  fill="#c2410c"
                />
                <Scatter
                  name="Broad-base peers"
                  data={scatterData.filter((d) => d.broad)}
                  fill="#0f766e"
                />
                <Legend />
              </ScatterChart>
            </ResponsiveContainer>
          )}

          {panel === "service-leaks" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[...SERVICE_CATEGORIES].sort(
                  (a, b) => b.leakScore - a.leakScore,
                )}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={150}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="leakScore" name="Leak score" radius={[0, 4, 4, 0]}>
                  {SERVICE_CATEGORIES.map((c) => (
                    <Cell key={c.id} fill={c.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {panel === "decade-deltas" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={DECADE_DELTAS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="decade" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v} pp`} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend />
                <Bar
                  dataKey="escapeRisePp"
                  name="Escape rise"
                  fill="#c2410c"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="mixShiftPp"
                  name="Mix-shift contribution"
                  fill="#0f766e"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="servicesRisePp"
                  name="Services PCE rise"
                  stroke="#64748b"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
          {SOURCE_NOTE}
        </p>
      </div>
    </div>
  );
}
