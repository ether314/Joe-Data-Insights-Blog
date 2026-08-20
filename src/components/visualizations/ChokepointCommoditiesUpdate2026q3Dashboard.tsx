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
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  HEADLINE,
  INVESTMENT_DELTAS,
  PRICE_STRESS,
  RISK_DOLLARS,
  SMELTER_STRESS,
  SOURCE_NOTE,
  VINTAGE_ROWS,
  deltaBuckets,
  filterVintage,
  fmtPct,
  fmtPp,
  fmtUsdBn,
  rankedByAbsDelta,
  type Direction,
  type Sector,
  type Stage,
} from "@/data/chokepoint-commodities-update-2026q3-data";

// viz-types: midstream Δ bars, prior→new scatter, smelter utilisation composed, investment diverging bars, risk-dollar bars, price-multiple bars | layout: default
// viz-plan: IEA refine tightening; REE exception; Cu smelter stress; capex pullback; export-control $ at risk; EU/China price multiples

type Panel =
  | "deltas"
  | "levels"
  | "smelters"
  | "investment"
  | "risk"
  | "prices";

const DIRECTION_COLORS: Record<Direction, string> = {
  tighter: "#ea580c",
  easier: "#14b8a6",
  flat: "#64748b",
  revised: "#a78bfa",
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
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              value === o.id
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ChokepointCommoditiesUpdate2026q3Dashboard() {
  const [panel, setPanel] = useState<Panel>("deltas");
  const [stage, setStage] = useState<Stage | "all">("all");
  const [direction, setDirection] = useState<Direction | "all">("all");
  const [sector, setSector] = useState<Sector | "all">("all");

  const filtered = useMemo(
    () => filterVintage(VINTAGE_ROWS, { stage, direction, sector }),
    [stage, direction, sector],
  );

  const deltaBars = useMemo(
    () =>
      rankedByAbsDelta(filtered).map((r) => ({
        name: r.shortLabel,
        delta: r.deltaPp,
        fill: DIRECTION_COLORS[r.direction],
      })),
    [filtered],
  );

  const scatter = useMemo(
    () =>
      filtered.map((r) => ({
        name: r.shortLabel,
        prior: r.priorTop1Pct,
        neu: r.newTop1Pct,
        delta: r.deltaPp,
        z: Math.abs(r.deltaPp) * 35 + 50,
        fill: DIRECTION_COLORS[r.direction],
      })),
    [filtered],
  );

  const smelterBars = useMemo(
    () =>
      SMELTER_STRESS.map((r) => ({
        name: r.label.replace("Cu ", ""),
        outside: r.outsideChina,
        china: r.china,
      })),
    [],
  );

  const investBars = useMemo(
    () =>
      INVESTMENT_DELTAS.map((r) => ({
        name: r.label.replace(" spending", "").replace(" company investment", ""),
        yoy: r.yoyPct,
        fill: DIRECTION_COLORS[r.direction],
      })),
    [],
  );

  const riskBars = useMemo(
    () =>
      [...RISK_DOLLARS]
        .sort((a, b) => b.riskUsdBn - a.riskUsdBn)
        .map((r) => ({
          name: r.shortLabel,
          risk: r.riskUsdBn,
          label: fmtUsdBn(r.riskUsdBn),
        })),
    [],
  );

  const priceBars = useMemo(
    () =>
      PRICE_STRESS.map((r) => ({
        name: r.label.split(" (")[0],
        multiple: r.multiple,
      })),
    [],
  );

  const buckets = useMemo(() => deltaBuckets(filtered), [filtered]);

  const pathLine = useMemo(
    () => [
      { year: "2023", avgRefine: HEADLINE.avgRefinePriorPct, ree: HEADLINE.reeRefinePriorPct },
      { year: "2025", avgRefine: HEADLINE.avgRefineNewPct, ree: HEADLINE.reeRefineNewPct },
      { year: "2035e", avgRefine: null, ree: HEADLINE.reeRefine2035PathPct },
    ],
    [],
  );

  return (
    <div className="space-y-6" data-viz="chokepoint-commodities-update-2026q3">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — {HEADLINE.priorVintage} → {HEADLINE.newVintage}
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Avg top refine (ex-REE) {fmtPct(HEADLINE.avgRefinePriorPct, 0)} →{" "}
          {fmtPct(HEADLINE.avgRefineNewPct, 0)} ({fmtPp(HEADLINE.avgRefineDeltaPp, 0)}) · REE refine{" "}
          {fmtPct(HEADLINE.reeRefinePriorPct, 0)} → {fmtPct(HEADLINE.reeRefineNewPct, 0)} (
          {fmtPp(HEADLINE.reeRefineDeltaPp, 0)}) · Cu smelt capacity ~{fmtPct(HEADLINE.cuSmeltCapacity2025Pct, 0)}
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Versus the MCS 2026 update print, IEA GCMO 2026 says midstream concentration kept rising for most
          energy minerals while rare-earth refining is the diversification exception. Copper smelter
          economics cracked (TC/RC settle ${HEADLINE.cuTcRc2026UsdPerT}/t); lithium chemicals tighten on paper;
          graphite anode stays ≥90% with ~{fmtUsdBn(HEADLINE.graphiteDownstreamRiskUsdBn)} downstream at risk.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <ToggleGroup
            label="Panel"
            value={panel}
            onChange={setPanel}
            options={[
              { id: "deltas", label: "Midstream Δ" },
              { id: "levels", label: "Prior → new" },
              { id: "smelters", label: "Smelter stress" },
              { id: "investment", label: "Capex YoY" },
              { id: "risk", label: "Risk $" },
              { id: "prices", label: "Price multiples" },
            ]}
          />
          <ToggleGroup
            label="Stage"
            value={stage}
            onChange={setStage}
            options={[
              { id: "all", label: "All stages" },
              { id: "midstream", label: "Midstream" },
              { id: "smelter", label: "Smelter" },
              { id: "mine", label: "Mine" },
              { id: "policy", label: "Policy" },
            ]}
          />
          <ToggleGroup
            label="Direction"
            value={direction}
            onChange={setDirection}
            options={[
              { id: "all", label: "All" },
              { id: "tighter", label: "Tighter" },
              { id: "easier", label: "Easier" },
              { id: "flat", label: "Flat" },
              { id: "revised", label: "Revised" },
            ]}
          />
          <ToggleGroup
            label="Sector"
            value={sector}
            onChange={setSector}
            options={[
              { id: "all", label: "All sectors" },
              { id: "batteries", label: "Batteries" },
              { id: "magnets", label: "Magnets" },
              { id: "structural", label: "Structural" },
              { id: "semiconductors", label: "Semiconductors" },
              { id: "recycling", label: "Recycling" },
            ]}
          />
        </div>
      </div>

      {panel === "deltas" && (
        <ChartCard
          title="Top-1 / concentration Δ (pp)"
          subtitle="Absolute-ranked moves vs MCS update secondary carries / IEA 2023 anchors"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={deltaBars} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} unit=" pp" />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const sorted = sortTooltipPayload(payload);
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        {sorted.map((p) => (
                          <div key={String(p.dataKey)}>
                            {p.name}: {fmtPp(Number(p.value))}
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="delta" name="Δ pp" radius={[0, 4, 4, 0]}>
                  {deltaBars.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
            {buckets.map((b) => (
              <span key={b.id} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ background: b.color }}
                />
                {b.label}: {b.count}
              </span>
            ))}
          </div>
        </ChartCard>
      )}

      {panel === "levels" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Prior → new concentration"
            subtitle="X = prior print; Y = IEA GCMO 2026 / newest; size ∝ |Δ|"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="prior"
                    name="Prior %"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    domain={[0, 100]}
                  />
                  <YAxis
                    type="number"
                    dataKey="neu"
                    name="New %"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    domain={[0, 100]}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload as {
                        name: string;
                        prior: number;
                        neu: number;
                        delta: number;
                      };
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                          <div className="font-semibold">{d.name}</div>
                          <div>
                            {fmtPct(d.prior)} → {fmtPct(d.neu)} ({fmtPp(d.delta)})
                          </div>
                        </div>
                      );
                    }}
                  />
                  <ReferenceLine
                    segment={[
                      { x: 0, y: 0 },
                      { x: 100, y: 100 },
                    ]}
                    stroke="#cbd5e1"
                    strokeDasharray="4 4"
                  />
                  <Scatter data={scatter}>
                    {scatter.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Refine path: avg vs REE"
            subtitle="IEA: ex-REE average tightened; REE refining is the exception"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <ComposedChart data={pathLine} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[60, 95]} unit="%" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgRefine"
                    name="Avg top refine (ex-REE)"
                    stroke="#ea580c"
                    strokeWidth={2.5}
                    connectNulls={false}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ree"
                    name="REE top refine"
                    stroke="#14b8a6"
                    strokeWidth={2.5}
                    connectNulls
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "smelters" && (
        <ChartCard
          title="Copper smelter stress: China vs rest"
          subtitle={`TC/RC annual settle ${HEADLINE.cuTcRc2026UsdPerT} USD/t (2026) · China >${HEADLINE.cuSmeltGrowthFromChinaPct}% of capacity growth since 2005`}
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={smelterBars} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip />
                <Legend />
                <Bar dataKey="outside" name="Outside China" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="china" name="China" fill="#ea580c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Utilisation below ~{fmtPct(HEADLINE.cuUtilOutsideChinaPct, 0)} outside China vs ~
            {fmtPct(HEADLINE.cuUtilChinaPct, 0)} inside — custom smelters lean harder on volatile by-product
            revenue as treatment charges collapse.
          </p>
        </ChartCard>
      )}

      {panel === "investment" && (
        <ChartCard
          title="Critical-minerals investment YoY (2025)"
          subtitle={`Public finance commitments ~$${HEADLINE.publicFinanceUsdBn}B (~${HEADLINE.publicFinanceVs2023Mult}× vs 2023) even as private capex fell`}
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={investBars} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
                <Tooltip />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="yoy" name="YoY %" radius={[0, 4, 4, 0]}>
                  {investBars.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "risk" && (
        <ChartCard
          title="Downstream value at risk from export-control scenarios"
          subtitle="IEA estimates of annual production outside China exposed to full disruption"
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={riskBars} layout="vertical" margin={{ left: 8, right: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => fmtUsdBn(Number(v))}
                />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => fmtUsdBn(Number(v))}
                  labelFormatter={(_, p) => String(p?.[0]?.payload?.name ?? "")}
                />
                <Bar dataKey="risk" name="At risk" fill="#c2410c" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-1 text-sm text-slate-600">
            {RISK_DOLLARS.map((r) => (
              <li key={r.id}>
                <span className="font-semibold text-slate-800">{r.shortLabel}:</span> {r.trigger}
              </li>
            ))}
          </ul>
        </ChartCard>
      )}

      {panel === "prices" && (
        <ChartCard
          title="Export-control price divergence"
          subtitle="Europe / non-China multiples vs Chinese domestic (gallium, HREE) or trough (tungsten)"
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={priceBars} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="×" />
                <Tooltip />
                <Bar dataKey="multiple" name="Multiple" fill="#a78bfa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}
    </div>
  );
}
