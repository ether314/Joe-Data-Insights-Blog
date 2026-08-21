"use client";

import { useMemo, useState } from "react";
import {
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
  CLUSTER_COLORS,
  FLEX_MARKETS,
  HEADLINE,
  QUEUE_METERS,
  SOURCE_NOTE,
  STANCE_SHIFT,
  US_H1_SECTORS,
  demandGrowthBars,
  dualLedgerDumbbell,
  priceDumbbell,
  queueStack,
  type PacePoint,
  PACE_SCATTER,
} from "@/data/ai-power-grid-update-202608-data";

// viz-types: demand path bars, price-shock dumbbell, US H1 sector bars, queue stack + yoy, queue Δ meters, flex hours, dual-ledger carry, pace scatter | layout: default
// viz-plan: panel + region/tech/pace controls; Mid-Year demand+price + LBNL queue first; no KPI+bar clone

type Panel =
  | "demand"
  | "prices"
  | "h1"
  | "queues"
  | "flex"
  | "ledger"
  | "pace";

type RegionFilter = "all" | "us" | "shock" | "cheap";
type TechFilter = "all" | "rising" | "falling";
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
  demand: "Demand path",
  prices: "Price shock",
  h1: "US H1 sectors",
  queues: "LBNL queues",
  flex: "Flexibility",
  ledger: "Dual ledger",
  pace: "Pace mismatch",
};

export function AiPowerGridUpdate202608Dashboard() {
  const [panel, setPanel] = useState<Panel>("demand");
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all");
  const [techFilter, setTechFilter] = useState<TechFilter>("all");
  const [paceFilter, setPaceFilter] = useState<PaceFilter>("all");

  const demandBars = useMemo(() => demandGrowthBars(), []);

  const priceRows = useMemo(() => {
    const all = priceDumbbell();
    if (regionFilter === "us") return all.filter((r) => r.region === "US");
    if (regionFilter === "shock")
      return all.filter((r) => r.q2 >= 20);
    if (regionFilter === "cheap")
      return all.filter((r) => r.q2 <= 0);
    return all;
  }, [regionFilter]);

  const h1Bars = useMemo(
    () =>
      US_H1_SECTORS.map((s) => ({
        label: s.label,
        yoyPct: s.yoyPct,
        fill:
          s.id === "services"
            ? "#22d3ee"
            : s.yoyPct < 0
              ? "#f97316"
              : "#6366f1",
      })),
    [],
  );

  const queueBars = useMemo(() => {
    const all = queueStack();
    if (techFilter === "rising") return all.filter((q) => q.yoyPct > 0);
    if (techFilter === "falling") return all.filter((q) => q.yoyPct < 0);
    return all;
  }, [techFilter]);

  const queueDeltas = useMemo(
    () =>
      QUEUE_METERS.filter(
        (r) =>
          r.id === "active-total" ||
          r.id === "gas-surge" ||
          r.id === "ia-backlog" ||
          r.id === "completion",
      )
        .map((r) => ({
          metric:
            r.id === "active-total"
              ? "Active gen+storage"
              : r.id === "gas-surge"
                ? "Gas in queue"
                : r.id === "ia-backlog"
                  ? "IA not yet COD"
                  : "COD hit-rate %",
          value: r.valueNew,
          delta: r.valueNew - r.valuePrior,
          fill:
            r.id === "gas-surge"
              ? "#a78bfa"
              : r.id === "active-total"
                ? "#f59e0b"
                : "#22d3ee",
        }))
        .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)),
    [],
  );

  const flexBars = useMemo(
    () =>
      FLEX_MARKETS.map((m) => ({
        market: m.market.replace("S. Australia & California", "SA & CA"),
        now: m.negativeSharePct,
        prior: m.priorSharePct ?? m.negativeSharePct,
        fill:
          m.negativeSharePct > (m.priorSharePct ?? 0)
            ? "#f59e0b"
            : m.negativeSharePct < (m.priorSharePct ?? 0)
              ? "#34d399"
              : "#94a3b8",
      })),
    [],
  );

  const dumbbell = useMemo(() => dualLedgerDumbbell(), []);

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
                ? "#fb7185"
                : "#94a3b8",
      })),
    [],
  );

  return (
    <div className="space-y-6" data-viz="ai-power-grid-update-202608">
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — Q3 Gartner/Electricity → Mid-Year Update + LBNL Queued Up
        </p>
        <p className="mt-2 text-sm text-slate-700">
          Mid-Year locks US electricity at{" "}
          <span className="font-semibold text-cyan-700">
            +{HEADLINE.usYoy2026Pct}% in 2026
          </span>{" "}
          and{" "}
          <span className="font-semibold text-cyan-700">
            +{HEADLINE.usYoy2027Pct}% in 2027
          </span>
          , with data centres still the main growth driver and H1 services at{" "}
          <span className="font-semibold">+{HEADLINE.usServicesH1YoyPct}%</span>.
          Wholesale prices: US{" "}
          <span className="font-semibold">flat</span> in Q2 vs EU/Japan{" "}
          <span className="font-semibold text-rose-600">
            +{HEADLINE.euJapanQ2PriceYoyPct}%+
          </span>
          . LBNL restates active queues at{" "}
          <span className="font-semibold">
            {HEADLINE.usActiveTotalGw.toLocaleString("en-US")} GW
          </span>{" "}
          (
          <span className="font-semibold text-amber-700">
            {HEADLINE.usQueueYoyPct}%
          </span>
          ) while gas in queue jumps{" "}
          <span className="font-semibold text-violet-700">
            +{HEADLINE.usGasQueueYoyPct}% to {HEADLINE.usGasQueueGw} GW
          </span>
          . Dual-ledger Gartner{" "}
          {HEADLINE.gartnerTwh2026}/&gt;{HEADLINE.gartner2030Twh} vs IEA ~
          {HEADLINE.ieaCentral2030Twh} carried.
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

      {panel === "demand" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="World vs US electricity demand growth"
            subtitle="Mid-Year path: global accelerates; US dips then rebounds — DC still #1 US driver"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandBars} margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis unit="%" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="yoyPct" name="YoY %" radius={[4, 4, 0, 0]}>
                    {demandBars.map((d) => (
                      <Cell key={d.label} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Stance shift scores"
            subtitle="What Mid-Year + LBNL reweight vs the Q3 Gartner/Electricity print"
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
          </ChartCard>
        </div>
      )}

      {panel === "prices" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Region filter
            </span>
            {(
              [
                ["all", "All regions"],
                ["us", "US only"],
                ["shock", "Shocked (+20%+)"],
                ["cheap", "Flat / down"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setRegionFilter(id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  regionFilter === id
                    ? "bg-rose-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <ChartCard
            title="Wholesale price shock — Q2 y/y vs H2 futures"
            subtitle="Hormuz LNG asymmetry: US insulated while EU/Japan print +30%+ — AI power-cost geography"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={priceRows}
                  layout="vertical"
                  margin={{ left: 8, right: 24 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    unit="%"
                    tick={{ fontSize: 12 }}
                    domain={[-50, 45]}
                  />
                  <YAxis
                    type="category"
                    dataKey="region"
                    width={90}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <ReferenceLine x={0} stroke="#94a3b8" />
                  <Bar
                    dataKey="q2"
                    name="Q2 2026 y/y %"
                    fill="#fb7185"
                    radius={[0, 4, 4, 0]}
                    barSize={14}
                  />
                  <Line
                    type="monotone"
                    dataKey="h2"
                    name="H2 futures y/y %"
                    stroke="#0f172a"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#0f172a" }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "h1" && (
        <ChartCard
          title="US H1 2026 sector electricity growth"
          subtitle="Mild winter hid the AI load: residential −1.7%, services (incl. DCs) +3%"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={h1Bars}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" unit="%" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={140}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="yoyPct" name="H1 YoY %" radius={[0, 4, 4, 0]}>
                  {h1Bars.map((d) => (
                    <Cell key={d.label} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "queues" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Tech filter
            </span>
            {(
              [
                ["all", "All techs"],
                ["rising", "Rising only"],
                ["falling", "Falling only"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTechFilter(id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  techFilter === id
                    ? "bg-violet-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="US active queue by technology"
              subtitle="LBNL Queued Up 2026: gas is the only major tech rising (+86%)"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={queueBars} margin={{ left: 8, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="tech" tick={{ fontSize: 11 }} />
                    <YAxis
                      yAxisId="gw"
                      tick={{ fontSize: 12 }}
                      label={{
                        value: "GW",
                        angle: -90,
                        position: "insideLeft",
                        style: { fontSize: 11 },
                      }}
                    />
                    <YAxis
                      yAxisId="yoy"
                      orientation="right"
                      unit="%"
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip />
                    <Bar
                      yAxisId="gw"
                      dataKey="gw"
                      name="Active GW"
                      radius={[4, 4, 0, 0]}
                    >
                      {queueBars.map((d) => (
                        <Cell key={d.tech} fill={d.fill} />
                      ))}
                    </Bar>
                    <Line
                      yAxisId="yoy"
                      type="monotone"
                      dataKey="yoyPct"
                      name="YoY %"
                      stroke="#0f172a"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Queue Δ meters vs Q3 featured stock"
              subtitle="Full 2,061 GW stock, gas surge, and 549 GW IA backlog are the new lead meters"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={queueDeltas}
                    layout="vertical"
                    margin={{ left: 8, right: 16 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="metric"
                      width={120}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip />
                    <Bar dataKey="value" name="New print" radius={[0, 4, 4, 0]}>
                      {queueDeltas.map((d) => (
                        <Cell key={d.metric} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {panel === "flex" && (
        <ChartCard
          title="Negative wholesale-price hours (H1 2026)"
          subtitle="Flexibility scarcity shows up as negatives; Spain jumped 10% → 17% of hours"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={flexBars} margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="market" tick={{ fontSize: 11 }} />
                <YAxis unit="%" tick={{ fontSize: 12 }} domain={[0, 25]} />
                <Tooltip />
                <Bar dataKey="prior" name="2025 share %" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="now" name="H1 2026 share %" radius={[4, 4, 0, 0]}>
                  {flexBars.map((d) => (
                    <Cell key={d.market} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "ledger" && (
        <ChartCard
          title="Dual ledger carried — IEA central vs Gartner path"
          subtitle="Mid-Year did not restate DC TWh; keep the Q3 +250 TWh 2030 gap intact"
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dumbbell} margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "TWh",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11 },
                  }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="iea"
                  name="IEA central"
                  stroke="#6366f1"
                  strokeWidth={2}
                  connectNulls={false}
                  dot={{ r: 5, fill: "#6366f1" }}
                />
                <Line
                  type="monotone"
                  dataKey="gartner"
                  name="Gartner"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  connectNulls={false}
                  dot={{ r: 5, fill: "#22d3ee" }}
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
              Pace cluster
            </span>
            {(
              [
                ["all", "All"],
                ["campus", "Campus"],
                ["wires", "Wires"],
                ["fuel", "Fuel"],
                ["price", "Price"],
                ["unlock", "Unlock"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setPaceFilter(id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  paceFilter === id
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <ChartCard
            title="Pace mismatch — campuses vs wires, fuel, and price"
            subtitle="LBNL timelines + Mid-Year price geography added to the race clock"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="campusYears"
                    name="Campus years"
                    unit="y"
                    tick={{ fontSize: 11 }}
                    domain={[1, 7]}
                    label={{
                      value: "Campus / project years",
                      position: "insideBottom",
                      offset: -2,
                      style: { fontSize: 11 },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="interconnectYears"
                    name="Interconnect years"
                    unit="y"
                    tick={{ fontSize: 11 }}
                    domain={[0.5, 7]}
                    label={{
                      value: "Wires / constraint years",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 11 },
                    }}
                  />
                  <ZAxis range={[80, 200]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <ReferenceLine
                    segment={[
                      { x: 1, y: 1 },
                      { x: 7, y: 7 },
                    ]}
                    stroke="#cbd5e1"
                    strokeDasharray="4 4"
                  />
                  {(["campus", "wires", "fuel", "price", "unlock"] as const).map(
                    (cluster) => {
                      const pts = pacePoints.filter((p) => p.cluster === cluster);
                      if (!pts.length) return null;
                      return (
                        <Scatter
                          key={cluster}
                          name={cluster}
                          data={pts}
                          fill={CLUSTER_COLORS[cluster]}
                        />
                      );
                    },
                  )}
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}
    </div>
  );
}
