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
  OWNER_MODEL_META,
  ROUTE_META,
  SOURCE_NOTE,
  SOURCES,
  capexKmScatter,
  demandAreaRows,
  fiberEconomyBars,
  ownerStackedBars,
  routeStackedFor,
  vintageShareRows,
  type RouteId,
} from "@/data/single-owner-subsea-cable-risk-2026-data";

// viz-types: stacked vintage bars, route 100% bars, owner sole/part bars, capex-vs-km scatter, demand area, fiber economy | layout: default

type ViewId = "vintage" | "routes" | "owners" | "economics";

const SKY = "#0ea5e9";
const INDIGO = "#6366f1";
const SLATE = "#64748b";
const AMBER = "#f59e0b";

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
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        ) : null}
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
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
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

export function SingleOwnerSubseaCableRisk2026Dashboard() {
  const [view, setView] = useState<ViewId>("vintage");
  const [routeFilter, setRouteFilter] = useState<RouteId | "all">("all");
  const [unit, setUnit] = useState<"share" | "km">("share");

  const vintage = useMemo(() => vintageShareRows(), []);
  const routes = useMemo(
    () => routeStackedFor(routeFilter),
    [routeFilter],
  );
  const owners = useMemo(() => ownerStackedBars(), []);
  const scatter = useMemo(() => capexKmScatter(), []);
  const fiber = useMemo(() => fiberEconomyBars(), []);
  const demand = useMemo(() => demandAreaRows(), []);

  const vintageChart = useMemo(() => {
    if (unit === "share") {
      return vintage.map((v) => ({
        vintage: v.vintage,
        Sole: v.solePct,
        Hybrid: v.hybridPct,
        Consortium: v.consortiumPct,
        Other: v.specialistPct,
      }));
    }
    return vintage.map((v) => ({
      vintage: v.vintage,
      Sole: v.soleHyperscalerKm,
      Hybrid: v.hybridCpKm,
      Consortium: v.carrierConsortiumKm,
      Other: v.specialistKm,
    }));
  }, [vintage, unit]);

  return (
    <div
      className="space-y-6"
      data-viz="single-owner-subsea-cable-risk-2026"
    >
      <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
          Single-owner subsea cable risk — ownership of new km
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200">
          Sole-owner hyperscaler systems take{" "}
          <span className="font-semibold text-sky-300">
            {HEADLINE.soleOwnerNewKmSharePct}%
          </span>{" "}
          of new cable-km (RFS 2024–28e), up from{" "}
          {HEADLINE.soleOwnerShare2015_18Pct}% in 2015–18. TeleGeography puts{" "}
          {HEADLINE.privateCpCapexSharePct}% of 2024–29 cable investment in
          private content-provider builds — and another{" "}
          {HEADLINE.hybridCpCapexSharePct}% in hybrids with at least one CP
          investor.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Sole-owner new km",
              value: `${HEADLINE.soleOwnerNewKmSharePct}%`,
            },
            {
              label: "Top-4 control (sole+maj.)",
              value: `${HEADLINE.top4ControlNewKmSharePct}%`,
            },
            {
              label: "Private CP capex",
              value: `${HEADLINE.privateCpCapexSharePct}%`,
            },
            {
              label: "CP bandwidth demand",
              value: `${HEADLINE.cpBandwidthDemandSharePct}%`,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                {s.label}
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums text-white">
                {s.value}
              </p>
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
            { id: "vintage", label: "Vintage mix" },
            { id: "routes", label: "By route" },
            { id: "owners", label: "Owner ladder" },
            { id: "economics", label: "Capex vs km" },
          ]}
        />
        {view === "vintage" ? (
          <ToggleGroup
            label="Units"
            value={unit}
            onChange={setUnit}
            options={[
              { id: "share", label: "% of new km" },
              { id: "km", label: "Thousand km" },
            ]}
          />
        ) : null}
        {view === "routes" ? (
          <ToggleGroup
            label="Route"
            value={routeFilter}
            onChange={setRouteFilter}
            options={[
              { id: "all", label: "All routes" },
              { id: "transpacific", label: "T-Pacific" },
              { id: "transatlantic", label: "T-Atlantic" },
              { id: "intra-asia", label: "Intra-Asia" },
              { id: "us-latam", label: "US–LatAm" },
              { id: "europe-africa", label: "EU–Africa" },
            ]}
          />
        ) : null}
      </div>

      {view === "vintage" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Ownership mix of new cable-km by vintage"
            subtitle="Sole-owner hyperscaler share rose from single digits to ~one-third of the newest cohorts"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vintageChart} stackOffset="none">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="vintage" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    label={{
                      value: unit === "share" ? "% of new km" : "000 km",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 11, fill: "#64748b" },
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="Sole"
                    stackId="a"
                    fill={OWNER_MODEL_META["sole-hyperscaler"].color}
                    name="Sole CP"
                  />
                  <Bar
                    dataKey="Hybrid"
                    stackId="a"
                    fill={OWNER_MODEL_META["hybrid-cp"].color}
                    name="Hybrid"
                  />
                  <Bar
                    dataKey="Consortium"
                    stackId="a"
                    fill={OWNER_MODEL_META["carrier-consortium"].color}
                    name="Consortium"
                  />
                  <Bar
                    dataKey="Other"
                    stackId="a"
                    fill={OWNER_MODEL_META.specialist.color}
                    name="Other"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Content/cloud share of used international bandwidth"
            subtitle="Demand concentration arrived before sole ownership — wet-plant control is catching up"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demand}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "% of used capacity",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 11, fill: "#64748b" },
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="ContentCloud"
                    stackId="1"
                    stroke={SKY}
                    fill={SKY}
                    fillOpacity={0.85}
                    name="Content & cloud"
                  />
                  <Area
                    type="monotone"
                    dataKey="BackboneOther"
                    stackId="1"
                    stroke={SLATE}
                    fill={SLATE}
                    fillOpacity={0.55}
                    name="Backbone & other"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {view === "routes" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="New-km ownership mix by route"
            subtitle={
              routeFilter === "all"
                ? "100% stacked shares — Trans-Pacific leads sole-owner intensity"
                : `${ROUTE_META[routeFilter].label} ownership mix`
            }
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={routes} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    unit="%"
                  />
                  <YAxis
                    type="category"
                    dataKey="route"
                    width={52}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="Sole"
                    stackId="r"
                    fill={OWNER_MODEL_META["sole-hyperscaler"].color}
                  />
                  <Bar
                    dataKey="Hybrid"
                    stackId="r"
                    fill={OWNER_MODEL_META["hybrid-cp"].color}
                  />
                  <Bar
                    dataKey="Consortium"
                    stackId="r"
                    fill={OWNER_MODEL_META["carrier-consortium"].color}
                  />
                  <Bar
                    dataKey="Other"
                    stackId="r"
                    fill={OWNER_MODEL_META.specialist.color}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="New route-km volume by corridor"
            subtitle="Thousand km entering service / planned RFS 2024–28e"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={routes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="route" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar
                    dataKey="newKm000"
                    fill={INDIGO}
                    name="New km (000)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="Sole"
                    stroke={AMBER}
                    strokeWidth={2}
                    name="Sole-owner %"
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {view === "owners" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Attributable new km — sole vs part-owner"
            subtitle="Google leads sole-owned wet plant; Meta’s Waterworth would extend the sole-owner ledger"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={owners}
                  layout="vertical"
                  margin={{ left: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={110}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="soleKm000"
                    stackId="o"
                    fill={SKY}
                    name="Sole-owned km (000)"
                  />
                  <Bar
                    dataKey="partOwnerKm000"
                    stackId="o"
                    fill={INDIGO}
                    name="Part-owner km (000)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Fiber-pair retention on sole-owned systems"
            subtitle="Sole owner ≠ exclusive user — retained vs sold/swapped pair share"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fiber}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="owner" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="Retained"
                    stackId="f"
                    fill={SKY}
                    name="Retained pairs %"
                  />
                  <Bar
                    dataKey="SoldSwapped"
                    stackId="f"
                    fill={AMBER}
                    name="Sold / swapped %"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {view === "economics" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Capex share vs new-km share"
            subtitle="TeleGeography $ mix (x) vs reconstructed km mix (y) — sole builds punch above $ share in km"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="capex"
                    name="Capex %"
                    domain={[0, 50]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Capex share %",
                      position: "insideBottom",
                      offset: -2,
                      style: { fontSize: 11, fill: "#64748b" },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="km"
                    name="Km %"
                    domain={[0, 50]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Km share %",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 11, fill: "#64748b" },
                    }}
                  />
                  <ZAxis range={[120, 120]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(value, name) => [
                      `${Number(value ?? 0)}%`,
                      name === "capex" ? "Capex share" : "Km share",
                    ]}
                    labelFormatter={(_, payload) =>
                      (payload?.[0]?.payload as { name?: string } | undefined)
                        ?.name ?? ""
                    }
                  />
                  <Scatter data={scatter} name="Models">
                    {scatter.map((p) => (
                      <Cell key={p.model} fill={p.color} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
              {scatter.map((p) => (
                <li key={p.model} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: p.color }}
                  />
                  {p.name}: {p.capex}% $ → {p.km}% km
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title="Reading the gap"
            subtitle="Why private CP dollars and private CP kilometers diverge"
          >
            <div className="space-y-3 text-sm leading-relaxed text-slate-700">
              <p>
                TeleGeography’s{" "}
                <strong>{HEADLINE.privateCpCapexSharePct}%</strong> private and{" "}
                <strong>{HEADLINE.hybridCpCapexSharePct}%</strong> hybrid
                investment figures are capital outlays. Long Pacific and
                multi-segment sole builds (Waterworth-scale spans) pull{" "}
                <strong>km share</strong> for sole owners above their dollar
                share when short, high-fiber Atlantic systems dominate the
                remaining consortium ledger.
              </p>
              <p>
                Carrier consortia still account for roughly{" "}
                <strong>{HEADLINE.consortiumNewKmSharePct}%</strong> of new km
                — especially on Europe–Africa and secondary corridors where
                landing rights and spectrum of partners matter more than a
                single hyperscaler’s DC mesh.
              </p>
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-950">
                Caveat: sole ownership of the wet plant does not equal exclusive
                use. Fiber-pair sales and swaps put third-party traffic on
                “private” cables — ownership risk and capacity economics are
                related but not identical.
              </p>
            </div>
          </ChartCard>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">
        {SOURCE_NOTE} Sources: {SOURCES.join("; ")}.
      </p>
    </div>
  );
}
