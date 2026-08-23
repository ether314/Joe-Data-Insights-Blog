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
} from "recharts";
import {
  ANALYTICS,
  CONCENTRATION_PATH,
  EXIT_REASONS,
  FLEET_TIERS,
  HEADLINE,
  LAG_SCATTER,
  QUARTERLY_TAPE,
  REGION_EXITS,
  SOURCE_NOTE,
  spotForEquipment,
  type EquipmentId,
} from "@/data/trucking-spot-rates-versus-carrier-exits-2026-data";

type Panel = "tape" | "lag" | "tiers" | "regions";
type EraFilter = "all" | "pre-boom" | "boom" | "bust" | "stabilizing";

const COLORS = {
  van: "#0ea5e9",
  reefer: "#06b6d4",
  flatbed: "#6366f1",
  exit: "#ef4444",
  turnover: "#f59e0b",
  top1: "#dc2626",
  top10: "#f97316",
  bottom: "#94a3b8",
  muted: "#64748b",
  pre: "#64748b",
  boom: "#059669",
  bust: "#dc2626",
  stabilizing: "#2563eb",
};

const ERA_COLOR: Record<string, string> = {
  "pre-boom": COLORS.pre,
  boom: COLORS.boom,
  bust: COLORS.bust,
  stabilizing: COLORS.stabilizing,
};

const PIE_COLORS = ["#0ea5e9", "#f59e0b", "#ef4444", "#8b5cf6"];

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

export function TruckingSpotRatesVersusCarrierExits2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("tape");
  const [equipment, setEquipment] = useState<EquipmentId>("van");
  const [eraFilter, setEraFilter] = useState<EraFilter>("all");

  const tapeData = useMemo(
    () =>
      QUARTERLY_TAPE.map((r) => ({
        ...r,
        spot: spotForEquipment(r, equipment),
      })),
    [equipment],
  );

  const lagData = useMemo(() => {
    if (eraFilter === "all") return LAG_SCATTER;
    return LAG_SCATTER.filter((p) => p.era === eraFilter);
  }, [eraFilter]);

  const tierBars = useMemo(
    () =>
      [...FLEET_TIERS].map((t) => ({
        ...t,
        puDelta: Number((t.puShare2026 - t.puShare2021).toFixed(1)),
        authDelta: Number((t.authShare2026 - t.authShare2021).toFixed(1)),
      })),
    [],
  );

  const regionSorted = useMemo(
    () => [...REGION_EXITS].sort((a, b) => b.revocationIndex2023 - a.revocationIndex2023),
    [],
  );

  const exitPie = useMemo(
    () =>
      EXIT_REASONS.map((r) => ({
        name: r.label,
        value: r.share2023,
      })),
    [],
  );

  const eqLabel =
    equipment === "van" ? "Dry van" : equipment === "reefer" ? "Reefer" : "Flatbed";

  return (
    <div
      className="not-prose my-8 w-full space-y-4"
      data-viz="trucking-spot-rates-versus-carrier-exits-2026"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Revocations per rate trough
          </p>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Spot linehaul · FMCSA exits · survivor capacity
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            National {eqLabel.toLowerCase()} spot fell ~{HEADLINE.vanSpotDropPct}% peak-to-trough
            while quarterly authority exits roughly ×{HEADLINE.revocationMultiple} within{" "}
            {HEADLINE.lagQuarters} quarters. Top 1% of fleets hold ~{HEADLINE.top1PctPowerShare}% of
            power units among survivors.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
            Focus panel
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              value={panel}
              onChange={(e) => setPanel(e.target.value as Panel)}
              aria-label="Focus panel"
            >
              <option value="tape">Spot × exits tape</option>
              <option value="lag">Lag-2 scatter</option>
              <option value="tiers">Survivor tiers</option>
              <option value="regions">Regional exits</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
            Equipment
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value as EquipmentId)}
              aria-label="Equipment type"
            >
              <option value="van">Dry van</option>
              <option value="reefer">Reefer</option>
              <option value="flatbed">Flatbed</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
            Lag scatter era
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              value={eraFilter}
              onChange={(e) => setEraFilter(e.target.value as EraFilter)}
              aria-label="Lag scatter era filter"
            >
              <option value="all">All eras</option>
              <option value="pre-boom">Pre-boom</option>
              <option value="boom">2021–22 boom</option>
              <option value="bust">2022–24 bust</option>
              <option value="stabilizing">2024–26 stabilizing</option>
            </select>
          </label>
        </div>
      </div>

      {panel === "tape" ? (
        <ChartCard
          title={`${eqLabel} spot vs authority exits`}
          subtitle="Left: spot $/mi · Right: quarterly FMCSA exits and ATA-style turnover %"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={tapeData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={2} />
                <YAxis
                  yAxisId="spot"
                  tick={{ fontSize: 11 }}
                  domain={[1.2, 3.6]}
                  label={{ value: "$/mi", angle: -90, position: "insideLeft", fontSize: 11 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  domain={[0, 10000]}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="right"
                  dataKey="revocations"
                  name="Authority exits"
                  fill={COLORS.exit}
                  opacity={0.4}
                  barSize={10}
                />
                <Line
                  yAxisId="spot"
                  type="monotone"
                  dataKey="spot"
                  name={`${eqLabel} spot $/mi`}
                  stroke={COLORS.van}
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="turnoverPct"
                  name="Large-fleet turnover %"
                  stroke={COLORS.turnover}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "lag" ? (
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ChartCard
              title="Spot at t vs exits at t+2"
              subtitle={`Lag-2 quarters · corr ≈ ${HEADLINE.spotRevCorrLag2} · filter via Lag scatter era`}
            >
              <div className="h-[360px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      dataKey="vanSpot"
                      name="Van spot"
                      unit=" $/mi"
                      domain={[1.3, 3.0]}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="revocationsLagged"
                      name="Exits t+2"
                      domain={[2500, 9500]}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter name="Quarters" data={lagData}>
                      {lagData.map((p) => (
                        <Cell key={p.quarter} fill={ERA_COLOR[p.era]} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLORS.pre }} />
                  Pre-boom
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLORS.boom }} />
                  Boom
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLORS.bust }} />
                  Bust
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLORS.stabilizing }} />
                  Stabilizing
                </span>
              </div>
            </ChartCard>
          </div>
          <div className="lg:col-span-2">
            <ChartCard
              title="2023 exit-channel mix"
              subtitle="Insurance lapses dominate the bust-year exit stack"
            >
              <div className="h-[280px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={exitPie}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {exitPie.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      ) : null}

      {panel === "tiers" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Power-unit share by fleet tier"
            subtitle="2021 vs 2026 — micro fleets shed share; mega fleets gain"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tierBars} margin={{ top: 8, right: 12, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="puShare2021" name="PU share 2021" fill={COLORS.muted} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="puShare2026" name="PU share 2026" fill={COLORS.van} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Survivor concentration path"
            subtitle="Top 1% / top 10% / bottom 50% of fleets — share of power units"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CONCENTRATION_PATH} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 80]} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="top1Pct"
                    name="Top 1%"
                    stroke={COLORS.top1}
                    fill={COLORS.top1}
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="top10Pct"
                    name="Top 10%"
                    stroke={COLORS.top10}
                    fill={COLORS.top10}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="bottom50Pct"
                    name="Bottom 50%"
                    stroke={COLORS.bottom}
                    fill={COLORS.bottom}
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Top 1% power-unit share: {ANALYTICS.top1Pct2021}% (2021) → {ANALYTICS.top1Pct2026}% (2026).
              Owner-op authority share down ~{ANALYTICS.ownerOpAuthLossPp} pp.
            </p>
          </ChartCard>
        </div>
      ) : null}

      {panel === "regions" ? (
        <ChartCard
          title="Regional exit intensity vs spot drop"
          subtitle="2023 revocation index (2021=100) ordered highest → lowest; bars show van peak-to-trough drop"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                layout="vertical"
                data={regionSorted}
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="region" width={100} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="revocationIndex2023"
                  name="2023 revocation index"
                  fill={COLORS.exit}
                  opacity={0.75}
                  radius={[0, 4, 4, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="vanDropPct"
                  name="Van spot drop %"
                  stroke={COLORS.van}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Hottest exit corridor: {ANALYTICS.worstRegion} (revocation index{" "}
            {ANALYTICS.worstRegionRevocationIndex}). Net active authorities down mid-teens % in the
            Southwest and Southeast since 2021.
          </p>
        </ChartCard>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
