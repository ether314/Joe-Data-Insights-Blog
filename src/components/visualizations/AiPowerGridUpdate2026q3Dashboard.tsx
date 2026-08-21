"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
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
  CAPACITY_PATH,
  CLUSTER_COLORS,
  GRID_METERS,
  HEADLINE,
  SOURCE_NOTE,
  STANCE_SHIFT,
  US_COMPOSITION,
  YOY_GROWTH,
  dualLedgerDumbbell,
  segmentStack,
  type PacePoint,
  PACE_SCATTER,
} from "@/data/ai-power-grid-update-2026q3-data";

// viz-types: YoY bars, dual-ledger dumbbell, stacked segment areas, US composition bars, grid Δ bars, capacity dual-axis, pace scatter | layout: default
// viz-plan: panel + ledger-filter + pace-cluster controls; Gartner near-term + Electricity 2026 queues first; no KPI+bar clone

type Panel =
  | "yoy"
  | "ledger"
  | "segments"
  | "us"
  | "grid"
  | "capacity"
  | "pace";

type LedgerFilter = "all" | "iea" | "gartner";
type PaceFilter = "all" | PacePoint["cluster"];

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

const PANEL_LABELS: Record<Panel, string> = {
  yoy: "YoY growth",
  ledger: "Dual ledger",
  segments: "AI vs conventional",
  us: "US slice",
  grid: "Grid queues",
  capacity: "Capacity path",
  pace: "Pace mismatch",
};

export function AiPowerGridUpdate2026q3Dashboard() {
  const [panel, setPanel] = useState<Panel>("yoy");
  const [ledgerFilter, setLedgerFilter] = useState<LedgerFilter>("all");
  const [paceFilter, setPaceFilter] = useState<PaceFilter>("all");

  const yoyBars = useMemo(() => {
    const rows =
      ledgerFilter === "all"
        ? YOY_GROWTH
        : YOY_GROWTH.filter((g) => g.ledger === ledgerFilter);
    return rows.map((g) => ({
      label: g.label,
      yoyPct: g.yoyPct,
      fill:
        g.id === "gartner-2026" || g.id === "gartner-ai-2026"
          ? "#22d3ee"
          : g.ledger === "iea"
            ? "#6366f1"
            : "#94a3b8",
    }));
  }, [ledgerFilter]);

  const dumbbell = useMemo(() => dualLedgerDumbbell(), []);
  const segments = useMemo(() => segmentStack(), []);

  const usBars = useMemo(
    () =>
      US_COMPOSITION.filter((u) => u.id !== "world").map((u) => ({
        label: u.label,
        twh: u.twh,
        fill:
          u.id === "us-ai" ? "#22d3ee" : u.id === "us" ? "#6366f1" : "#94a3b8",
      })),
    [],
  );

  const gridBars = useMemo(
    () =>
      GRID_METERS.filter(
        (r) =>
          r.valueNew !== r.valuePrior ||
          r.id === "global-queue" ||
          r.id === "us-dc-growth" ||
          r.id === "unlock",
      )
        .map((r) => ({
          metric: r.metric
            .replace("Worldwide stalled connection queue", "Global stalled queue")
            .replace("US DC share of electricity demand growth", "US DC % of demand growth")
            .replace("Unlockable advanced-stage projects", "Unlockable projects (mid)"),
          delta: r.valueNew - r.valuePrior,
          fill: r.valueNew - r.valuePrior > 0 ? "#f59e0b" : "#64748b",
        }))
        .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)),
    [],
  );

  const capacitySeries = useMemo(
    () =>
      CAPACITY_PATH.map((g) => ({
        year: String(g.year),
        capacityGw: g.capacityGw,
        electricityTwh: g.electricityTwh,
        aiShare: g.aiSharePct,
      })),
    [],
  );

  const pacePoints = useMemo(() => {
    if (paceFilter === "all") return PACE_SCATTER;
    return PACE_SCATTER.filter((p) => p.cluster === paceFilter);
  }, [paceFilter]);

  const stanceBars = useMemo(
    () =>
      STANCE_SHIFT.map((s) => ({
        horizon: s.horizon.split(" ")[0],
        full: s.horizon,
        score: s.score,
        fill:
          s.direction === "up"
            ? "#22d3ee"
            : s.direction === "down"
              ? "#f97316"
              : s.direction === "split"
                ? "#a78bfa"
                : "#94a3b8",
      })),
    [],
  );

  return (
    <div className="space-y-6" data-viz="ai-power-grid-update-2026q3">
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — Key Questions Apr 2026 → Gartner Jun 2026 + Electricity 2026
        </p>
        <p className="mt-2 text-sm text-slate-700">
          Near-term path is now the headline: Gartner puts worldwide data-centre
          electricity at{" "}
          <span className="font-semibold text-slate-900">
            {HEADLINE.gartnerTwh2026} TWh in 2026
          </span>{" "}
          (
          <span className="font-semibold text-cyan-700">
            +{HEADLINE.yoy2026Pct}%
          </span>{" "}
          vs {HEADLINE.gartnerTwh2025}), with AI-optimised servers at{" "}
          <span className="font-semibold">{HEADLINE.aiServerShare2026Pct}%</span> of
          power and on track to surpass conventional in{" "}
          {HEADLINE.aiSurpassesConventionalYear}. The dual-ledger 2030 gap widens to{" "}
          <span className="font-semibold">
            IEA ~{HEADLINE.ieaCentral2030Twh} vs Gartner &gt;{HEADLINE.gartner2030Twh}
          </span>{" "}
          (+{HEADLINE.dualLedgerGapTwh} TWh). IEA Electricity 2026 restates queues at{" "}
          <span className="font-semibold">
            &gt;{HEADLINE.globalQueueStalledGw.toLocaleString("en-US")} GW
          </span>{" "}
          stalled worldwide and US data centres at ~{HEADLINE.usDcShareOfGrowthPct}% of
          US demand growth.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Panel
        </span>
        {(Object.keys(PANEL_LABELS) as Panel[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPanel(p)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              panel === p
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {PANEL_LABELS[p]}
          </button>
        ))}
      </div>

      {panel === "yoy" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Ledger filter
            </span>
            {(
              [
                ["all", "All meters"],
                ["gartner", "Gartner only"],
                ["iea", "IEA carried"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setLedgerFilter(id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  ledgerFilter === id
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="YoY growth — prior IEA vs Q3 Gartner"
              subtitle="2026 +26.4% is the new near-term print (scopes differ — do not average)"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={yoyBars}
                    layout="vertical"
                    margin={{ left: 8, right: 16 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" unit="%" tick={{ fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="label"
                      width={150}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip />
                    <Bar dataKey="yoyPct" name="YoY %" radius={[0, 4, 4, 0]}>
                      {yoyBars.map((d) => (
                        <Cell key={d.label} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Stance shift scores"
              subtitle="What the Q3 vintage reweights vs Key Questions"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stanceBars} margin={{ left: 8, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="horizon" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[0, 4]} />
                    <Tooltip />
                    <Bar dataKey="score" name="Stance score" radius={[4, 4, 0, 0]}>
                      {stanceBars.map((d) => (
                        <Cell key={d.full} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-3 space-y-1 text-xs text-slate-600">
                {STANCE_SHIFT.map((s) => (
                  <li key={s.horizon}>
                    <strong>{s.horizon}:</strong> {s.priorStance} → {s.newStance} (
                    {s.deltaLabel})
                  </li>
                ))}
              </ul>
            </ChartCard>
          </div>
        </div>
      )}

      {panel === "ledger" && (
        <ChartCard
          title="Dual ledger dumbbell — IEA central vs Gartner path"
          subtitle={`2030 gap: IEA ~${HEADLINE.ieaCentral2030Twh} vs Gartner >${HEADLINE.gartner2030Twh} (+${HEADLINE.dualLedgerGapTwh} TWh)`}
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={dumbbell}
                layout="vertical"
                margin={{ left: 8, right: 24 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} unit=" TWh" />
                <YAxis
                  type="category"
                  dataKey="year"
                  width={48}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="iea" name="IEA central" fill="#6366f1" barSize={10} />
                <Bar
                  dataKey="gartner"
                  name="Gartner path"
                  fill="#22d3ee"
                  barSize={10}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            2025 already diverges (IEA 485 vs Gartner 447) — different scopes and
            methods. Chart both; never average into a fake consensus.
          </p>
        </ChartCard>
      )}

      {panel === "segments" && (
        <ChartCard
          title="Gartner segment stack — conventional / AI / cooling"
          subtitle="AI-optimised servers roughly double each year through 2027; conventional crawls"
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={segments} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit=" TWh" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="conventional"
                  name="Conventional servers"
                  stackId="1"
                  fill="#94a3b8"
                  stroke="#64748b"
                />
                <Area
                  type="monotone"
                  dataKey="ai"
                  name="AI-optimised servers"
                  stackId="1"
                  fill="#22d3ee"
                  stroke="#0891b2"
                />
                <Area
                  type="monotone"
                  dataKey="cooling"
                  name="Cooling & other infra"
                  stackId="1"
                  fill="#a78bfa"
                  stroke="#7c3aed"
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke="#0f172a"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            AI segment: 95 → 175 → 258 TWh (2025–2027). Surpasses conventional in{" "}
            {HEADLINE.aiSurpassesConventionalYear}.
          </p>
        </ChartCard>
      )}

      {panel === "us" && (
        <ChartCard
          title="US electricity composition (Gartner 2026)"
          subtitle={`${HEADLINE.usTwh2026} TWh = ${HEADLINE.usShare2026Pct}% of world; dedicated AI ${HEADLINE.usAiDedicatedTwh2026} TWh ≈ 1/3 of US DC power`}
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usBars} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} unit=" TWh" />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={160}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Bar dataKey="twh" name="TWh" radius={[0, 4, 4, 0]}>
                  {usBars.map((d) => (
                    <Cell key={d.label} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Pair with Electricity 2026: US data centres drive ~{HEADLINE.usDcShareOfGrowthPct}%
            of US electricity demand growth through 2030 (&gt;{HEADLINE.usDemandAdd5yrTwh}{" "}
            TWh US add).
          </p>
        </ChartCard>
      )}

      {panel === "grid" && (
        <ChartCard
          title="Grid-pace meters (Δ vs prior update)"
          subtitle="Electricity 2026 global queue + US growth share; Key Questions bridges carried"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gridBars} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="metric"
                  width={170}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip />
                <Bar dataKey="delta" name="Δ (new − prior)" radius={[0, 4, 4, 0]}>
                  {gridBars.map((d) => (
                    <Cell key={d.metric} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-xs text-slate-700">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-3 font-semibold">Metric</th>
                  <th className="py-2 pr-3 font-semibold">Prior</th>
                  <th className="py-2 pr-3 font-semibold">New</th>
                  <th className="py-2 font-semibold">Δ</th>
                </tr>
              </thead>
              <tbody>
                {GRID_METERS.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100">
                    <td className="py-2 pr-3">{r.metric}</td>
                    <td className="py-2 pr-3">{r.prior}</td>
                    <td className="py-2 pr-3">{r.neu}</td>
                    <td className="py-2">{r.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}

      {panel === "capacity" && (
        <ChartCard
          title="Companion capacity path (GW) + electricity (TWh)"
          subtitle="Capacity is the interconnection constraint; TWh is the energy bill"
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={capacitySeries} margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="gw"
                  tick={{ fontSize: 12 }}
                  label={{ value: "GW", position: "insideTopLeft", offset: 10 }}
                />
                <YAxis
                  yAxisId="twh"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  label={{ value: "TWh", position: "insideTopRight", offset: 10 }}
                />
                <Tooltip />
                <Bar
                  yAxisId="gw"
                  dataKey="capacityGw"
                  name="Capacity GW"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="twh"
                  type="monotone"
                  dataKey="electricityTwh"
                  name="Electricity TWh"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  connectNulls
                  dot={{ r: 4 }}
                />
                <ReferenceLine
                  yAxisId="twh"
                  y={HEADLINE.ieaCentral2030Twh}
                  stroke="#f97316"
                  strokeDasharray="4 4"
                  label={{ value: "IEA 950", position: "insideBottomRight", fontSize: 10 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "pace" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Cluster
            </span>
            {(
              [
                ["all", "All"],
                ["campus", "Campus"],
                ["wires", "Wires"],
                ["fuel", "Fuel bridge"],
                ["unlock", "Unlock tools"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setPaceFilter(id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  paceFilter === id
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <ChartCard
            title="Pace mismatch scatter"
            subtitle="Campus clocks vs interconnection / unlock clocks (years)"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="campusYears"
                    name="Campus years"
                    tick={{ fontSize: 12 }}
                    domain={[0, 8]}
                    label={{ value: "Campus / project years", position: "insideBottom", offset: -2, fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="interconnectYears"
                    name="Interconnect years"
                    tick={{ fontSize: 12 }}
                    domain={[0, 8]}
                    label={{ value: "Wire / unlock years", angle: -90, position: "insideLeft", fontSize: 11 }}
                  />
                  <ZAxis range={[80, 80]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <ReferenceLine
                    segment={[
                      { x: 0, y: 0 },
                      { x: 8, y: 8 },
                    ]}
                    stroke="#cbd5e1"
                    strokeDasharray="4 4"
                  />
                  <Scatter name="Pace points" data={pacePoints}>
                    {pacePoints.map((p) => (
                      <Cell key={p.name} fill={CLUSTER_COLORS[p.cluster]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Green unlock cluster = flexible non-firm connections + grid-enhancing
              technologies (IEA: 1,200–1,600 GW potentially unlockable).
            </p>
          </ChartCard>
        </div>
      )}
    </div>
  );
}
