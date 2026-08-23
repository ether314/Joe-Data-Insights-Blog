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
  CARRIER_ROWS,
  COMMODITY_SHARE,
  HEADLINE,
  QUARTERLY_TAPE,
  SCATTER_POINTS,
  SOURCE_NOTE,
  TERMINAL_ROWS,
  type CarrierId,
} from "@/data/freight-rail-velocity-versus-shipper-rates-2026-data";

type Panel = "tape" | "scatter" | "terminals" | "carriers";
type EraFilter = "all" | "pre-crisis" | "crisis" | "recovery";

const COLORS = {
  speed: "#0ea5e9",
  dwell: "#f59e0b",
  rev: "#10b981",
  lag: "#ef4444",
  recover: "#6366f1",
  muted: "#94a3b8",
  pre: "#64748b",
  crisis: "#dc2626",
  recovery: "#059669",
};

const ERA_COLOR: Record<string, string> = {
  "pre-crisis": COLORS.pre,
  crisis: COLORS.crisis,
  recovery: COLORS.recovery,
};

const CARRIER_COLOR: Record<CarrierId, string> = {
  bnsf: "#ea580c",
  up: "#ca8a04",
  csx: "#2563eb",
  ns: "#7c3aed",
  cn: "#dc2626",
  cpkc: "#0d9488",
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

export function FreightRailVelocityVersusShipperRates2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("tape");
  const [eraFilter, setEraFilter] = useState<EraFilter>("all");

  const scatterData = useMemo(() => {
    if (eraFilter === "all") return SCATTER_POINTS;
    return SCATTER_POINTS.filter((p) => p.era === eraFilter);
  }, [eraFilter]);

  const terminalSorted = useMemo(
    () => [...TERMINAL_ROWS].sort((a, b) => b.lagVs2019Hrs - a.lagVs2019Hrs),
    [],
  );

  const carrierBars = useMemo(
    () =>
      [...CARRIER_ROWS]
        .sort((a, b) => a.speedRecoveryPct - b.speedRecoveryPct)
        .map((c) => ({
          ...c,
          speedGapMph: Number((c.speed2019 - c.speed2026).toFixed(1)),
        })),
    [],
  );

  const commodityPie = useMemo(
    () =>
      COMMODITY_SHARE.map((c) => ({
        name: c.label,
        value: c.share2026,
        intensity: c.revIntensity,
      })),
    [],
  );

  return (
    <div
      className="not-prose my-8 w-full space-y-4"
      data-viz="freight-rail-velocity-versus-shipper-rates-2026"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Velocity vs revenue per carload
          </p>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            System train speed · terminal dwell
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            STB weekly speed/dwell against a Class I revenue-per-carload index
            (2019Q4=100). Peak-to-trough speed −{HEADLINE.speedDropPeakTroughPct}
            % while rev/carload +{HEADLINE.revPerCarRisePct}%; mid-2026 index still{" "}
            {HEADLINE.revPerCar2026Index}.
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
              <option value="tape">Dual-axis tape</option>
              <option value="scatter">Speed × rate scatter</option>
              <option value="terminals">Corridor dwell lag</option>
              <option value="carriers">Class I recovery</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
            Scatter era
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              value={eraFilter}
              onChange={(e) => setEraFilter(e.target.value as EraFilter)}
              aria-label="Scatter era filter"
            >
              <option value="all">All eras</option>
              <option value="pre-crisis">Pre-crisis</option>
              <option value="crisis">2021–22 crisis</option>
              <option value="recovery">2023–26 recovery</option>
            </select>
          </label>
        </div>
      </div>

      {panel === "tape" ? (
        <ChartCard
          title="Speed, dwell, and rev/carload index"
          subtitle="Left: system mph · Right: dwell hours and revenue index (2019Q4=100)"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={QUARTERLY_TAPE} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={2} />
                <YAxis
                  yAxisId="speed"
                  tick={{ fontSize: 11 }}
                  domain={[20, 28]}
                  label={{ value: "mph", angle: -90, position: "insideLeft", fontSize: 11 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  domain={[90, 140]}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="right"
                  dataKey="systemDwellHrs"
                  name="Terminal dwell (hrs)"
                  fill={COLORS.dwell}
                  opacity={0.45}
                  barSize={10}
                />
                <Line
                  yAxisId="speed"
                  type="monotone"
                  dataKey="systemSpeedMph"
                  name="System speed (mph)"
                  stroke={COLORS.speed}
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revPerCarIndex"
                  name="Rev/carload index"
                  stroke={COLORS.rev}
                  strokeWidth={2.5}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "scatter" ? (
        <ChartCard
          title="Speed × revenue-per-carload scatter"
          subtitle={`Quarterly points · corr ≈ ${HEADLINE.speedRevCorr} · filter via Scatter era`}
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="speedMph"
                  name="Speed"
                  unit=" mph"
                  domain={[20, 27]}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="revIndex"
                  name="Rev index"
                  domain={[95, 132]}
                  tick={{ fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="dwellHrs" range={[40, 200]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Quarters" data={scatterData}>
                  {scatterData.map((p) => (
                    <Cell key={p.quarter} fill={ERA_COLOR[p.era]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLORS.pre }} />
              Pre-crisis
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLORS.crisis }} />
              Crisis
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLORS.recovery }} />
              Recovery
            </span>
            <span className="text-slate-400">Bubble size ∝ dwell hours</span>
          </div>
        </ChartCard>
      ) : null}

      {panel === "terminals" ? (
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ChartCard
              title="Corridor dwell lag map"
              subtitle="Hours above (+) or below (−) 2019 baseline — positive = still lagging"
            >
              <div className="h-[380px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={terminalSorted}
                    margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fontSize: 11 }} unit=" hrs" />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={110}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip />
                    <Bar dataKey="lagVs2019Hrs" name="Lag vs 2019 (hrs)" radius={[0, 4, 4, 0]}>
                      {terminalSorted.map((t) => (
                        <Cell
                          key={t.id}
                          fill={t.lagVs2019Hrs >= 1.5 ? COLORS.lag : COLORS.recover}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
          <div className="lg:col-span-2">
            <ChartCard
              title="2026 carload mix"
              subtitle="AAR-style shares — intermodal up, coal down"
            >
              <div className="h-[280px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={commodityPie}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {commodityPie.map((_, i) => (
                        <Cell
                          key={i}
                          fill={
                            [
                              COLORS.speed,
                              COLORS.dwell,
                              COLORS.rev,
                              COLORS.recover,
                              "#ec4899",
                              COLORS.muted,
                            ][i % 6]
                          }
                        />
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

      {panel === "carriers" ? (
        <ChartCard
          title="Class I speed recovery"
          subtitle="% of 2019→trough gap closed by 2026Q2 — NS and CPKC still furthest from baseline"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={carrierBars} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  domain={[0, 100]}
                  unit="%"
                  label={{ value: "Recovery %", angle: -90, position: "insideLeft", fontSize: 11 }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="speedRecoveryPct" name="Speed recovery %" radius={[4, 4, 0, 0]}>
                  {carrierBars.map((c) => (
                    <Cell key={c.id} fill={CARRIER_COLOR[c.id]} />
                  ))}
                </Bar>
                <Bar
                  dataKey="speedGapMph"
                  name="Still short of 2019 (mph)"
                  fill={COLORS.muted}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Worst recovery: {ANALYTICS.worstRecoveryCarrier} at{" "}
            {ANALYTICS.worstRecoveryPct}% of the gap closed. Chicago peak dwell{" "}
            {HEADLINE.chicagoDwellPeakHrs} hrs vs {HEADLINE.chicagoDwell2026Hrs} hrs mid-2026.
          </p>
        </ChartCard>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
