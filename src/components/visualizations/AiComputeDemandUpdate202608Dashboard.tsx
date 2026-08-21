"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  GEO_METRICS,
  GROWTH_COMPARE,
  HEADLINE,
  MARKET_RANKS,
  OWNER_COLORS,
  OWNER_IDS,
  RANK_CHURN,
  SITE_LEDGER,
  SOURCE_NOTE,
  SOURCES,
  TOKEN_VS_OWNERSHIP,
  TOP20_STACK,
  fmtPct,
  fmtPp,
  ownerDeltas,
  rankedMarkets,
  type OwnerId,
} from "@/data/ai-compute-demand-update-202608-data";

// viz-types: top-20 stacked seats, market capacity bars, TX vs world growth, geo Δ, rank churn, token×ownership scatter | layout: default
// viz-plan: location concentration; named markets; Texas premium; geography deltas; entered/exited churn; tokens vs ownership; owner + region + churn controls

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

type RegionFilter =
  | "all"
  | "United States"
  | "China"
  | "Europe"
  | "APAC";

type ChurnFilter = "all" | "entered" | "exited";

const REGIONS: RegionFilter[] = ["all", "United States", "China", "Europe", "APAC"];

export function AiComputeDemandUpdate202608Dashboard() {
  const [activeOwners, setActiveOwners] = useState<OwnerId[]>([...OWNER_IDS]);
  const [region, setRegion] = useState<RegionFilter>("all");
  const [churn, setChurn] = useState<ChurnFilter>("all");

  const toggleOwner = (id: OwnerId) => {
    setActiveOwners((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== id);
      }
      return [...prev, id];
    });
  };

  const deltas = useMemo(() => ownerDeltas(activeOwners), [activeOwners]);

  const ownershipCarry = useMemo(
    () =>
      deltas.map((d) => ({
        label: d.label,
        share: d.newShare,
        fill: d.fill,
        delta: d.deltaPp,
      })),
    [deltas],
  );

  const markets = useMemo(() => rankedMarkets(region), [region]);

  const marketBars = useMemo(
    () =>
      markets.map((m) => ({
        label: m.label.length > 22 ? `${m.label.slice(0, 20)}…` : m.label,
        full: m.label,
        share: m.capacityHintPct,
        fill: m.color,
        note: m.note,
        growth: m.yoyGrowthPct,
      })),
    [markets],
  );

  const geoBars = useMemo(
    () =>
      [...GEO_METRICS]
        .map((g) => ({
          label: g.label.length > 34 ? `${g.label.slice(0, 32)}…` : g.label,
          full: g.label,
          value: g.deltaPp,
          fill: g.color,
        }))
        .sort((a, b) => Math.abs(b.value) - Math.abs(a.value)),
    [],
  );

  const churnRows = useMemo(() => {
    const rows = churn === "all" ? RANK_CHURN : RANK_CHURN.filter((r) => r.direction === churn);
    return rows.map((r) => ({
      label: r.label,
      value: r.direction === "entered" ? 1 : r.direction === "exited" ? -1 : 0,
      fill: r.color,
      direction: r.direction,
      note: r.note,
      region: r.region,
    }));
  }, [churn]);

  const ledgerCards = useMemo(
    () =>
      SITE_LEDGER.filter((s) =>
        ["pipeline-sites", "top3-share", "top20-capacity", "texas-yoy"].includes(s.id),
      ),
    [],
  );

  const pipelineDelta = useMemo(
    () => [
      {
        label: "Pipeline sites",
        Q3: HEADLINE.priorPipelineSites,
        "Aug 19": HEADLINE.newPipelineSites,
      },
    ],
    [],
  );

  return (
    <div className="space-y-6" data-viz="ai-compute-demand-update-202608">
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — Q3 2026 site ledger → Aug 19, 2026 location rankings
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Pipeline {HEADLINE.priorPipelineSites}→{HEADLINE.newPipelineSites} sites (+
          {HEADLINE.pipelineSitesDelta}) · Top-3 {HEADLINE.priorTop3SharePct}→
          {HEADLINE.newTop3SharePct}% · Texas ops +{HEADLINE.texasOpsGrowthYoYPct}% YoY
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Ownership Big-5 shares stay carried near {HEADLINE.newBig5SharePct}%. The new vintage is
          Synergy&apos;s Aug 19 location rankings: top-20 markets = {HEADLINE.top20CapacitySharePct}%
          of hyperscale capacity, N. Virginia + Greater Beijing alone{" "}
          {HEADLINE.nvaBeijingSharePct}%, and {HEADLINE.top20UsCount} of 20 largest markets in the US
          (non-US seats down to {HEADLINE.nonUsInTop20}).
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ledgerCards.map((c) => (
            <div key={c.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {c.label}
              </p>
              <p className="mt-0.5 text-xl font-bold text-slate-900">
                {c.newValue}
                <span className="ml-1 text-sm font-semibold text-slate-500">{c.unit}</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Δ {c.delta > 0 ? "+" : ""}
                {c.delta}
                {c.unit === "%" || c.unit === "pp" ? " pp" : c.unit === "sites" || c.unit === "markets" ? "" : ""}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Owners</span>
            {OWNER_IDS.map((id) => {
              const on = activeOwners.includes(id);
              const label = id.charAt(0).toUpperCase() + id.slice(1);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleOwner(id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    on ? "text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                  style={on ? { backgroundColor: OWNER_COLORS[id] } : undefined}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Churn</span>
            {(
              [
                ["all", "All"],
                ["entered", "Entered"],
                ["exited", "Exited"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setChurn(id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  churn === id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Top-20 market seats — US vs China+APAC vs Europe"
          subtitle={`${HEADLINE.top20UsCount} US / ${HEADLINE.top20ApacCount} APAC / ${HEADLINE.top20EuropeCount} Europe · top-20 = ${HEADLINE.top20CapacitySharePct}% of capacity`}
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={TOP20_STACK} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }} />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  domain={[0, 20]}
                  label={{ value: "Markets", angle: -90, position: "insideLeft", fill: "#64748b" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const sorted = sortTooltipPayload(payload);
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">Global top-20</p>
                        {sorted.map((p) => (
                          <p key={String(p.dataKey)} className="text-slate-600">
                            {p.name}: {Number(p.value)} markets
                          </p>
                        ))}
                      </div>
                    );
                  }}
                />
                <Legend />
                <Bar dataKey="US" stackId="a" fill="#0ea5e9" />
                <Bar dataKey="China + APAC" stackId="a" fill="#a855f7" />
                <Bar dataKey="Europe" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Pipeline sites — Q3 → Aug 19 vintage"
          subtitle={`Hyperscale known pipeline ${HEADLINE.priorPipelineSites} → ${HEADLINE.newPipelineSites} (+${HEADLINE.pipelineSitesDelta})`}
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={pipelineDelta} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const sorted = sortTooltipPayload(payload);
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">Hyperscale pipeline</p>
                        {sorted.map((p) => (
                          <p key={String(p.dataKey)} className="text-slate-600">
                            {p.name}: {Number(p.value).toLocaleString()} sites
                          </p>
                        ))}
                        <p className="mt-1 text-xs text-slate-500">
                          Δ +{HEADLINE.pipelineSitesDelta} facilities since Q3 print
                        </p>
                      </div>
                    );
                  }}
                />
                <Legend />
                <Bar dataKey="Q3" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Aug 19" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Named markets — capacity concentration hints"
          subtitle="Illustrative shares within Synergy’s disclosed ranking bands (not full MW print)"
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Region</span>
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  region === r
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {r === "all" ? "All" : r}
              </button>
            ))}
          </div>
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart
                data={marketBars}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={110}
                  tick={{ fill: "#334155", fontSize: 11, fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as {
                      full: string;
                      share: number;
                      note: string;
                      growth: number | null;
                    };
                    return (
                      <div className="max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.full}</p>
                        <p className="text-slate-600">Hint share {fmtPct(row.share)}</p>
                        {row.growth != null && (
                          <p className="text-slate-600">YoY ops +{row.growth}%</p>
                        )}
                        <p className="mt-1 text-xs text-slate-500">{row.note}</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="share" radius={[0, 4, 4, 0]} maxBarSize={22}>
                  {marketBars.map((d) => (
                    <Cell key={d.full} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Texas ops growth vs world average"
          subtitle={`Texas +${HEADLINE.texasOpsGrowthYoYPct}% YoY · world +${HEADLINE.worldOpsGrowthYoYPct}% · premium ${HEADLINE.texasGrowthPremiumPp} pp`}
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={GROWTH_COMPARE} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="market" tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }} />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 80]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as (typeof GROWTH_COMPARE)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.market}</p>
                        <p className="text-slate-600">+{row.growthPct}% YoY</p>
                        <p className="mt-1 text-xs text-slate-500">{row.note}</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="growthPct" radius={[4, 4, 0, 0]} maxBarSize={64}>
                  {GROWTH_COMPARE.map((d) => (
                    <Cell key={d.market} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Geography concentration deltas"
          subtitle="Aug 19 location print vs Q3 framing"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={geoBars} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={130}
                  tick={{ fill: "#334155", fontSize: 10, fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as { full: string; value: number };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.full}</p>
                        <p className="text-slate-600">{fmtPp(row.value)}</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={26}>
                  {geoBars.map((d) => (
                    <Cell key={d.full} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Top-20 rank churn — entered vs exited"
          subtitle="Indiana, Tennessee, Guangdong in · Tokyo, Sydney, South Carolina out"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart
                data={churnRows}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[-1.5, 1.5]}
                  ticks={[-1, 0, 1]}
                  tickFormatter={(v) => (v > 0 ? "Entered" : v < 0 ? "Exited" : "")}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={100}
                  tick={{ fill: "#334155", fontSize: 11, fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as {
                      label: string;
                      direction: string;
                      note: string;
                      region: string;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.label}</p>
                        <p className="text-slate-600">
                          {row.direction} · {row.region}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{row.note}</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={26}>
                  {churnRows.map((d) => (
                    <Cell key={d.label} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Ownership carry (Q3 → Aug 202608)"
          subtitle="Big-5 shares held flat — no new Epoch period print; filter owners above"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart
                data={ownershipCarry}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 30]}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={78}
                  tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as { label: string; share: number; delta: number };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.label}</p>
                        <p className="text-slate-600">{fmtPct(row.share)} of world AI compute</p>
                        <p className="text-xs text-slate-500">Δ vs Q3: {fmtPp(row.delta)}</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="share" radius={[0, 4, 4, 0]} maxBarSize={28}>
                  {ownershipCarry.map((d) => (
                    <Cell key={d.label} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Tokens vs ownership (scatter)"
          subtitle="Brand token cohort vs carried ownership — usage ≠ silicon; location is the moving meter"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="ownerSharePct"
                  name="Ownership"
                  unit="%"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  label={{ value: "Ownership %", position: "insideBottom", offset: -4, fill: "#64748b" }}
                />
                <YAxis
                  type="number"
                  dataKey="tokenSharePct"
                  name="Tokens"
                  unit="%"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  label={{ value: "Token %", angle: -90, position: "insideLeft", fill: "#64748b" }}
                />
                <ZAxis range={[80, 80]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as (typeof TOKEN_VS_OWNERSHIP)[0];
                    return (
                      <div className="max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.label}</p>
                        <p className="text-slate-600">Tokens {fmtPct(row.tokenSharePct)}</p>
                        <p className="text-slate-600">Ownership {fmtPct(row.ownerSharePct)}</p>
                        <p className="mt-1 text-xs text-slate-500">{row.note}</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine
                  segment={[
                    { x: 0, y: 0 },
                    { x: 30, y: 30 },
                  ]}
                  stroke="#cbd5e1"
                  strokeDasharray="4 4"
                />
                <Scatter data={TOKEN_VS_OWNERSHIP} fill="#0ea5e9">
                  {TOKEN_VS_OWNERSHIP.map((d) => (
                    <Cell key={d.id} fill={d.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} className="text-cyan-700 underline-offset-2 hover:underline">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] text-slate-500">
          Named-market capacity hints are illustrative placements inside disclosed concentration
          bands ({MARKET_RANKS.length} markets tracked); Synergy does not publish a full
          market-by-market MW table in the Aug 19 release.
        </p>
      </div>
    </div>
  );
}
