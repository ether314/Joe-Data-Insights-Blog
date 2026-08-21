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
  BURDEN_ROWS,
  COVERAGE_WATERFALL,
  GHO_CASH_PATH,
  HEADLINE,
  HOSTING_INCOME,
  PLAN_COVERAGE,
  SOLUTIONS_CHANNELS,
  SOURCE_NOTE,
  SOURCES,
  STOCK_VS_CASH,
  UNHCR_BUDGET_PATH,
  VINTAGE_METERS,
  fmtBn,
  fmtDelta,
  fmtM,
  fmtPct,
  type BurdenLane,
  type BurdenRow,
  type VintageMeter,
} from "@/data/migration-humanitarian-update-2026q3-data";

// viz-types: dumbbell vintage meters, coverage waterfall, dual stock×cash path, diverging burden bars, plan coverage scatter, UNHCR budget compose | layout: default
// viz-plan: May→Aug GHO cash delta; people stock carried vs coverage jump; who-bears-burden lanes; crisis-plan scatter; UNHCR budget scissors; view + lane + sort controls

type ViewMode = "cash" | "burden" | "plans";
type LaneFilter = "All" | BurdenLane;
type SortMode = "delta" | "newest" | "name";

const COLORS = {
  prior: "#94a3b8",
  newest: "#0f766e",
  down: "#0369a1",
  up: "#be123c",
  amber: "#d97706",
  violet: "#7c3aed",
  slate: "#334155",
  carried: "#64748b",
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
                ? "bg-teal-800 text-white"
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

function meterDisplay(m: VintageMeter, value: number): string {
  if (m.unit === "millions") return fmtM(value, 1);
  if (m.unit === "bn") return fmtBn(value, 1);
  if (m.unit === "count") return value.toLocaleString();
  return fmtPct(value, value % 1 === 0 ? 0 : 1);
}

function MeterTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload?: VintageMeter & { fill: string } }[];
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  return (
    <div className="max-w-xs rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-1 font-semibold text-slate-900">{row.label}</p>
      <p className="text-sm text-slate-700">
        May: <strong>{meterDisplay(row, row.prior)}</strong> → Aug:{" "}
        <strong>{meterDisplay(row, row.newest)}</strong>
      </p>
      <p className="text-sm text-slate-700">
        Δ {fmtDelta(row.delta, row.deltaUnit)} · {row.confidence}
      </p>
      <p className="mt-1 text-xs text-slate-500">{row.note}</p>
    </div>
  );
}

function BurdenTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload?: BurdenRow & { signed: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  return (
    <div className="max-w-xs rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-1 font-semibold text-slate-900">{row.actor}</p>
      <p className="text-sm text-slate-700">{row.meter}</p>
      <p className="text-sm text-slate-700">
        Δ {fmtDelta(row.delta, row.deltaUnit)} · {row.confidence}
      </p>
      <p className="mt-1 text-xs text-slate-500">{row.note}</p>
    </div>
  );
}

export function MigrationHumanitarianUpdate2026q3Dashboard() {
  const [view, setView] = useState<ViewMode>("cash");
  const [lane, setLane] = useState<LaneFilter>("All");
  const [sortMode, setSortMode] = useState<SortMode>("delta");

  const meters = useMemo(() => {
    return [...VINTAGE_METERS]
      .sort((a, b) => {
        if (sortMode === "name") return a.label.localeCompare(b.label);
        if (sortMode === "newest") return b.newest - a.newest;
        return Math.abs(b.delta) - Math.abs(a.delta);
      })
      .map((m) => ({
        ...m,
        fill:
          m.confidence === "carried"
            ? COLORS.carried
            : m.betterWhen === "up"
              ? m.delta >= 0
                ? COLORS.newest
                : COLORS.up
              : m.betterWhen === "down"
                ? m.delta <= 0
                  ? COLORS.down
                  : COLORS.up
                : COLORS.amber,
      }));
  }, [sortMode]);

  const burdens = useMemo(() => {
    const rows = BURDEN_ROWS.filter((r) => lane === "All" || r.lane === lane);
    return [...rows]
      .sort((a, b) => {
        if (sortMode === "name") return a.short.localeCompare(b.short);
        if (sortMode === "newest") return b.newest - a.newest;
        return Math.abs(b.delta) - Math.abs(a.delta);
      })
      .map((r) => ({
        ...r,
        signed: r.delta,
        fill:
          r.confidence === "carried"
            ? COLORS.carried
            : r.delta > 0
              ? r.lane === "donors"
                ? COLORS.newest
                : COLORS.up
              : r.delta < 0
                ? COLORS.down
                : COLORS.carried,
      }));
  }, [lane, sortMode]);

  const plans = useMemo(() => {
    return [...PLAN_COVERAGE]
      .sort((a, b) => {
        if (sortMode === "name") return a.short.localeCompare(b.short);
        if (sortMode === "newest") return b.coveragePct - a.coveragePct;
        return a.coveragePct - b.coveragePct;
      })
      .map((p) => ({
        ...p,
        x: p.reqBn,
        y: p.coveragePct,
        z: p.pinM * 8,
      }));
  }, [sortMode]);

  const waterfallChart = useMemo(() => {
    let running = 0;
    return COVERAGE_WATERFALL.map((s) => {
      if (s.kind === "base" || s.kind === "end") {
        running = s.value;
        return { ...s, base: 0, rise: s.value, fill: COLORS.newest };
      }
      const base = s.value >= 0 ? running : running + s.value;
      const rise = Math.abs(s.value);
      running += s.value;
      return {
        ...s,
        base,
        rise,
        fill: s.kind === "up" ? COLORS.newest : COLORS.up,
      };
    });
  }, []);

  const incomeScatter = HOSTING_INCOME.map((r, i) => ({
    ...r,
    x: i + 1,
    y: r.pct,
    z: r.pct * 6,
  }));

  return (
    <div
      className="space-y-6"
      data-viz="migration-humanitarian-update-2026q3"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">
          Vintage update · 2026Q3 · May MYR → Aug FTS
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Coverage jumped +16pp — people stock still carried
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">
          GHO appeal coverage rose from{" "}
          <strong className="text-white">
            {fmtPct(HEADLINE.ghoCoveragePriorPct)}
          </strong>{" "}
          to{" "}
          <strong className="text-teal-300">
            {fmtPct(HEADLINE.ghoCoverageNewPct)}
          </strong>{" "}
          (
          <strong className="text-teal-300">
            {fmtDelta(HEADLINE.ghoCoverageDeltaPp, "pp", 0)}
          </strong>
          ) as FTS booked{" "}
          <strong className="text-white">
            {fmtBn(HEADLINE.ghoFundedNewBn)}
          </strong>
          . Forced displacement stays{" "}
          <strong className="text-amber-300">
            {fmtM(HEADLINE.displacedNewM)}
          </strong>{" "}
          (carried). UNHCR&apos;s 2026 ask was cut{" "}
          <strong className="text-amber-300">
            {fmtDelta(HEADLINE.unhcrBudgetDeltaPct, "pct", 0)}
          </strong>{" "}
          while{" "}
          <strong className="text-amber-300">
            {fmtM(HEADLINE.atRiskCutsM)}
          </strong>{" "}
          remain flagged at risk from funding cuts.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "GHO coverage Δ",
              value: fmtDelta(HEADLINE.ghoCoverageDeltaPp, "pp", 0),
            },
            {
              label: "FTS funded",
              value: fmtBn(HEADLINE.ghoFundedNewBn),
            },
            {
              label: "Displaced (carried)",
              value: fmtM(HEADLINE.displacedNewM),
            },
            {
              label: "UNHCR 2026 budget Δ",
              value: fmtDelta(HEADLINE.unhcrBudgetDeltaPct, "pct", 0),
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-3"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-1 text-xl font-bold text-white">{k.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "cash", label: "Cash ledger" },
            { id: "burden", label: "Who bears it" },
            { id: "plans", label: "Crisis plans" },
          ]}
        />
        <ToggleGroup
          label="Burden lane"
          value={lane}
          onChange={setLane}
          options={[
            { id: "All", label: "All" },
            { id: "hosts", label: "Hosts" },
            { id: "donors", label: "Donors" },
            { id: "agency", label: "Agency" },
            { id: "returnees", label: "Returns" },
          ]}
        />
        <ToggleGroup
          label="Sort"
          value={sortMode}
          onChange={setSortMode}
          options={[
            { id: "delta", label: "Largest Δ" },
            { id: "newest", label: "Newest level" },
            { id: "name", label: "A–Z" },
          ]}
        />
      </div>

      {view === "cash" && (
        <>
          <ChartCard
            title="May Mid-Year Review → August FTS vintage meters"
            subtitle="Dumbbells: flat lines are carried people meters; teal/red mark cash moves"
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  layout="vertical"
                  data={meters}
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={128}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip content={<MeterTooltip />} />
                  <Bar
                    dataKey="prior"
                    barSize={6}
                    fill={COLORS.prior}
                    radius={[2, 2, 2, 2]}
                    name="May"
                  />
                  <Bar
                    dataKey="newest"
                    barSize={10}
                    radius={[3, 3, 3, 3]}
                    name="Aug"
                  >
                    {meters.map((m) => (
                      <Cell key={m.id} fill={m.fill} />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="How coverage rose (+16pp)"
              subtitle="Editorial waterfall: funded inflows vs ask creep"
            >
              <div className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={waterfallChart}
                    margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="step" tick={{ fontSize: 10 }} interval={0} />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      formatter={(v, name) => [
                        `${Number(v).toFixed(1)}`,
                        String(name),
                      ]}
                    />
                    <Bar dataKey="base" stackId="a" fill="transparent" />
                    <Bar dataKey="rise" stackId="a" radius={[4, 4, 0, 0]}>
                      {waterfallChart.map((s) => (
                        <Cell key={s.step} fill={s.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="People stock vs appeal coverage"
              subtitle="Displacement carried at 117.8M while GHO coverage healed"
            >
              <div className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={STOCK_VS_CASH}
                    margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="vintage" tick={{ fontSize: 10 }} />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${v}M`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${v}%`}
                      domain={[0, 50]}
                    />
                    <Tooltip />
                    <Bar
                      yAxisId="left"
                      dataKey="displacedM"
                      fill={COLORS.prior}
                      name="Displaced (M)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="coveragePct"
                      stroke={COLORS.newest}
                      strokeWidth={3}
                      name="GHO coverage %"
                      dot={{ r: 5 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <ChartCard
            title="GHO cash path: requirements, funded, gap"
            subtitle="Ask crept +$1.2B even as funded inflows closed part of the gap"
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={GHO_CASH_PATH}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <Tooltip
                    formatter={(v) => fmtBn(Number(v), 2)}
                    labelFormatter={(_, p) =>
                      (p?.[0]?.payload as { asOf?: string })?.asOf ?? ""
                    }
                  />
                  <Bar
                    dataKey="reqBn"
                    fill={COLORS.prior}
                    name="Requirements"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="fundedBn"
                    fill={COLORS.newest}
                    name="Funded"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="gapBn"
                    stroke={COLORS.up}
                    strokeWidth={3}
                    name="Unfunded gap"
                    dot={{ r: 5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </>
      )}

      {view === "burden" && (
        <>
          <ChartCard
            title="Who bears migration & humanitarian costs"
            subtitle="Diverging Δ: donors moved; hosts and people meters are mostly carried"
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={burdens}
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={100}
                    tick={{ fontSize: 11 }}
                  />
                  <ReferenceLine x={0} stroke="#94a3b8" />
                  <Tooltip content={<BurdenTooltip />} />
                  <Bar dataKey="signed" radius={[0, 4, 4, 0]}>
                    {burdens.map((b) => (
                      <Cell key={b.id} fill={b.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="UNHCR budget scissors"
              subtitle="Needs budget cut ~20% while early-pledge share sits near 18%"
            >
              <div className="h-[280px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={UNHCR_BUDGET_PATH}
                    margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `$${v}B`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${v}%`}
                      domain={[0, 60]}
                    />
                    <Tooltip />
                    <Bar
                      yAxisId="left"
                      dataKey="budgetBn"
                      fill={COLORS.violet}
                      name="Budget ($B)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="fundedPct"
                      stroke={COLORS.amber}
                      strokeWidth={3}
                      name="Funded / pledge %"
                      dot={{ r: 5 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Solutions vs cut risk"
              subtitle="Returns still dwarf resettlement; 11.6M flagged at risk"
            >
              <div className="h-[280px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={SOLUTIONS_CHANNELS}
                    margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${v}M`}
                    />
                    <Tooltip
                      formatter={(v) => fmtM(Number(v), 2)}
                      labelFormatter={(_, p) =>
                        (p?.[0]?.payload as { channel?: string })?.channel ?? ""
                      }
                    />
                    <Bar dataKey="valueM" radius={[4, 4, 0, 0]}>
                      {SOLUTIONS_CHANNELS.map((s) => (
                        <Cell
                          key={s.short}
                          fill={
                            s.short === "At-risk"
                              ? COLORS.up
                              : s.short === "Resettle"
                                ? COLORS.amber
                                : COLORS.newest
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <ChartCard
            title="Host income mix (carried Global Trends 2025)"
            subtitle="Upper-middle + high-income still leave LMIC majority hosting"
          >
            <div className="h-[260px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="group"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) =>
                      HOSTING_INCOME[Number(v) - 1]?.group ?? ""
                    }
                    domain={[0.5, 4.5]}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="share"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 40]}
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      name === "share" ? fmtPct(Number(v), 0) : v,
                      String(name),
                    ]}
                  />
                  <Scatter data={incomeScatter} fill={COLORS.newest} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </>
      )}

      {view === "plans" && (
        <ChartCard
          title="Crisis-plan coverage scatter (editorial mix)"
          subtitle="X = requirements ($B), Y = coverage %, bubble ≈ people in need — estimated plan-level mix"
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 24, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Requirements"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                  domain={[1, 5]}
                  label={{
                    value: "Requirements ($B)",
                    position: "insideBottom",
                    offset: -4,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Coverage"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[15, 55]}
                  label={{
                    value: "Coverage %",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <ReferenceLine
                  y={HEADLINE.ghoCoverageNewPct}
                  stroke={COLORS.newest}
                  strokeDasharray="4 4"
                  label={{
                    value: "GHO avg 40.4%",
                    position: "insideTopRight",
                    fontSize: 10,
                  }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as (typeof plans)[0];
                    if (!row) return null;
                    return (
                      <div className="max-w-xs rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
                        <p className="mb-1 font-semibold text-slate-900">
                          {row.plan}
                        </p>
                        <p className="text-sm text-slate-700">
                          Req {fmtBn(row.reqBn)} · Funded {fmtBn(row.fundedBn)} ·{" "}
                          {fmtPct(row.coveragePct)}
                        </p>
                        <p className="text-sm text-slate-700">
                          PiN ~{fmtM(row.pinM)} · {row.region}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          confidence: {row.confidence}
                        </p>
                      </div>
                    );
                  }}
                />
                <Scatter data={plans} fill={COLORS.violet} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Plan-level bars are an editorial mix scaled to the Aug GHO total —
            not official FTS plan extracts. Use for relative burden geometry,
            not citation of a single plan&apos;s coverage.
          </p>
        </ChartCard>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs leading-relaxed text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.label}>
              <a
                href={s.url}
                className="text-teal-800 underline-offset-2 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
