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
  BURDEN_ASYMMETRY,
  BURDEN_ROWS,
  DONOR_CUMULATIVE,
  DONOR_LADDER,
  GHO_CASH_PATH,
  HEADLINE,
  HEAL_ATTRIBUTION,
  HOSTING_INCOME,
  PLAN_COVERAGE,
  SOURCE_NOTE,
  SOURCES,
  STOCK_VS_CASH,
  VINTAGE_METERS,
  fmtBn,
  fmtDelta,
  fmtM,
  fmtPct,
  type BurdenLane,
  type BurdenRow,
  type VintageMeter,
} from "@/data/migration-humanitarian-update-202608-data";

// viz-types: donor ladder bars, cumulative concentration area, dual stock×cash+Top-1 compose, heal waterfall, diverging burden, plan scatter | layout: default
// viz-plan: August donor unpack of Q3 coverage heal; hosts still carry people; plan inequality; view + lane + sort controls

type ViewMode = "donors" | "asymmetry" | "plans";
type LaneFilter = "All" | BurdenLane;
type SortMode = "share" | "delta" | "name";

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
        Q3: <strong>{meterDisplay(row, row.prior)}</strong> → Aug:{" "}
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

export function MigrationHumanitarianUpdate202608Dashboard() {
  const [view, setView] = useState<ViewMode>("donors");
  const [lane, setLane] = useState<LaneFilter>("All");
  const [sortMode, setSortMode] = useState<SortMode>("share");

  const meters = useMemo(() => {
    return [...VINTAGE_METERS]
      .sort((a, b) => {
        if (sortMode === "name") return a.label.localeCompare(b.label);
        if (sortMode === "delta") return Math.abs(b.delta) - Math.abs(a.delta);
        return b.newest - a.newest;
      })
      .map((m) => ({
        ...m,
        fill:
          m.confidence === "carried"
            ? COLORS.carried
            : m.id === "top1" || m.id === "top3"
              ? COLORS.newest
              : m.betterWhen === "up"
                ? COLORS.newest
                : m.betterWhen === "down"
                  ? COLORS.down
                  : COLORS.amber,
      }));
  }, [sortMode]);

  const donors = useMemo(() => {
    return [...DONOR_LADDER]
      .sort((a, b) => {
        if (sortMode === "name") return a.short.localeCompare(b.short);
        return b.sharePct - a.sharePct;
      })
      .map((d, i) => ({
        ...d,
        fill: i === 0 ? COLORS.newest : i < 3 ? COLORS.violet : COLORS.prior,
      }));
  }, [sortMode]);

  const burdens = useMemo(() => {
    const rows = BURDEN_ROWS.filter((r) => lane === "All" || r.lane === lane);
    return [...rows]
      .sort((a, b) => {
        if (sortMode === "name") return a.short.localeCompare(b.short);
        if (sortMode === "delta") return Math.abs(b.delta) - Math.abs(a.delta);
        return b.newest - a.newest;
      })
      .map((r) => ({
        ...r,
        signed: r.delta,
        fill:
          r.confidence === "carried"
            ? COLORS.carried
            : r.lane === "donors"
              ? COLORS.newest
              : r.delta !== 0
                ? COLORS.up
                : COLORS.carried,
      }));
  }, [lane, sortMode]);

  const plans = useMemo(() => {
    return [...PLAN_COVERAGE]
      .sort((a, b) => {
        if (sortMode === "name") return a.short.localeCompare(b.short);
        if (sortMode === "delta") return a.coveragePct - b.coveragePct;
        return b.coveragePct - a.coveragePct;
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
    return HEAL_ATTRIBUTION.map((s) => {
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
        fill: COLORS.violet,
      };
    });
  }, []);

  const asymmetryBars = BURDEN_ASYMMETRY.map((r) => ({
    ...r,
    short: r.meter.length > 28 ? `${r.meter.slice(0, 26)}…` : r.meter,
    fill: r.side.startsWith("People") ? COLORS.amber : COLORS.newest,
  }));

  const incomeScatter = HOSTING_INCOME.map((r, i) => ({
    ...r,
    x: i + 1,
    y: r.pct,
    z: r.pct * 6,
  }));

  return (
    <div
      className="space-y-6"
      data-viz="migration-humanitarian-update-202608"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">
          Vintage update · 202608 · donor unpack of Q3 coverage heal
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          FTS Top-1 is 23% — hosts still hold 68%
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">
          GHO coverage sits flat at{" "}
          <strong className="text-teal-300">
            {fmtPct(HEADLINE.ghoCoverageNewPct)}
          </strong>{" "}
          after the Q3{" "}
          <strong className="text-white">
            {fmtDelta(HEADLINE.coverageHealPp, "pp", 0)}
          </strong>{" "}
          heal. The August lens asks who paid it: FTS Top-1 (US) is{" "}
          <strong className="text-teal-300">
            {fmtPct(HEADLINE.ftsTop1SharePct)}
          </strong>
          , Top-3{" "}
          <strong className="text-teal-300">
            {fmtPct(HEADLINE.ftsTop3SharePct)}
          </strong>
          , while LMIC hosts remain at{" "}
          <strong className="text-amber-300">
            {fmtPct(HEADLINE.lmicHostPct, 0)}
          </strong>{" "}
          of refugees and displacement stays{" "}
          <strong className="text-amber-300">
            {fmtM(HEADLINE.displacedNewM)}
          </strong>{" "}
          (carried).
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "FTS Top-1 share",
              value: fmtPct(HEADLINE.ftsTop1SharePct),
            },
            {
              label: "FTS Top-3 share",
              value: fmtPct(HEADLINE.ftsTop3SharePct),
            },
            {
              label: "GHO coverage",
              value: fmtPct(HEADLINE.ghoCoverageNewPct),
            },
            {
              label: "LMIC host share",
              value: fmtPct(HEADLINE.lmicHostPct, 0),
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
            { id: "donors", label: "Donor ladder" },
            { id: "asymmetry", label: "Hosts vs cash" },
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
            { id: "plans", label: "Plans" },
          ]}
        />
        <ToggleGroup
          label="Sort"
          value={sortMode}
          onChange={setSortMode}
          options={[
            { id: "share", label: "Share / level" },
            { id: "delta", label: "Largest Δ" },
            { id: "name", label: "A–Z" },
          ]}
        />
      </div>

      {view === "donors" && (
        <>
          <ChartCard
            title="FTS 2026 donor ladder (Top-10)"
            subtitle="Who booked the cash behind the Q3 coverage heal"
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={donors}
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 28]}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={72}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      name === "sharePct"
                        ? fmtPct(Number(v))
                        : `$${Number(v).toFixed(0)}M`,
                      String(name),
                    ]}
                    labelFormatter={(_, p) =>
                      (p?.[0]?.payload as { donor?: string })?.donor ?? ""
                    }
                  />
                  <Bar dataKey="sharePct" radius={[0, 4, 4, 0]} name="sharePct">
                    {donors.map((d) => (
                      <Cell key={d.short} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Cumulative donor concentration"
              subtitle="Top-1 23% → Top-3 45% → Top-10 ~82% of tracked FTS"
            >
              <div className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={DONOR_CUMULATIVE}
                    margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${v}%`}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      formatter={(v) => [fmtPct(Number(v)), "Cumulative share"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="sharePct"
                      stroke={COLORS.newest}
                      fill={COLORS.newest}
                      fillOpacity={0.25}
                      strokeWidth={3}
                      name="sharePct"
                    />
                    <ReferenceLine
                      y={50}
                      stroke={COLORS.amber}
                      strokeDasharray="4 4"
                      label={{
                        value: "Half of FTS",
                        position: "insideTopLeft",
                        fontSize: 10,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Illustrative heal attribution (+16pp)"
              subtitle="Editorial split of May→Aug coverage rise by donor scale"
            >
              <div className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={waterfallChart}
                    margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="step" tick={{ fontSize: 9 }} interval={0} />
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
              <p className="mt-2 text-xs text-slate-500">
                Attribution steps are editorial geometry scaled to the disclosed
                +16pp heal — not an official FTS allocation of the coverage
                delta.
              </p>
            </ChartCard>
          </div>

          <ChartCard
            title="Q3 → August vintage meters"
            subtitle="Donor shares are the new print; cash coverage and people meters are flat/carried"
          >
            <div className="h-[360px] w-full min-w-0">
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
                    width={140}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip content={<MeterTooltip />} />
                  <Bar
                    dataKey="prior"
                    barSize={6}
                    fill={COLORS.prior}
                    radius={[2, 2, 2, 2]}
                    name="Q3"
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
        </>
      )}

      {view === "asymmetry" && (
        <>
          <ChartCard
            title="Hosts still carry people — donors concentrate cash"
            subtitle="LMIC 68% hosting vs FTS Top-3 ~45% of tracked funding"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={asymmetryBars}
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={160}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => {
                      const row = item?.payload as (typeof asymmetryBars)[0];
                      if (!row) return [v, ""];
                      const display =
                        row.unit === "bn"
                          ? fmtBn(Number(v), 2)
                          : fmtPct(Number(v), row.value % 1 === 0 ? 0 : 1);
                      return [display, row.side];
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {asymmetryBars.map((r) => (
                      <Cell key={r.meter} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Who-bears-it scoreboard (Δ)"
              subtitle="Donor shares are the August move; host and agency meters mostly flat"
            >
              <div className="h-[320px] w-full min-w-0">
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
                      width={88}
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

            <ChartCard
              title="People stock vs coverage (+ Top-1 donor)"
              subtitle="Displacement carried; coverage healed in Q3; Top-1 printed in August"
            >
              <div className="h-[320px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={STOCK_VS_CASH}
                    margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="vintage" tick={{ fontSize: 9 }} />
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
                      dot={{ r: 4 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="top1DonorPct"
                      stroke={COLORS.violet}
                      strokeWidth={3}
                      strokeDasharray="4 4"
                      name="FTS Top-1 %"
                      connectNulls={false}
                      dot={{ r: 5 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="GHO cash path (context from Q3)"
              subtitle="Requirements, funded, gap — coverage heal already booked"
            >
              <div className="h-[260px] w-full min-w-0">
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
                    <Tooltip formatter={(v) => fmtBn(Number(v), 2)} />
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

            <ChartCard
              title="Host income mix (carried GT 2025)"
              subtitle="Upper-middle + high still leave LMIC majority hosting"
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
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) =>
                        HOSTING_INCOME[Number(v) - 1]?.group ?? ""
                      }
                      domain={[0.5, 4.5]}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${v}%`}
                      domain={[0, 40]}
                    />
                    <ZAxis type="number" dataKey="z" range={[80, 400]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      formatter={(v, name) => [
                        name === "y" ? fmtPct(Number(v), 0) : v,
                        String(name),
                      ]}
                    />
                    <Scatter data={incomeScatter} fill={COLORS.amber} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </>
      )}

      {view === "plans" && (
        <ChartCard
          title="Crisis-plan coverage scatter (editorial mix)"
          subtitle="X = requirements ($B), Y = coverage %, bubble ≈ people in need"
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 24, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
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
            Plan-level points are an editorial mix scaled to the Aug GHO total —
            not official FTS plan extracts. Use for relative burden geometry.
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
