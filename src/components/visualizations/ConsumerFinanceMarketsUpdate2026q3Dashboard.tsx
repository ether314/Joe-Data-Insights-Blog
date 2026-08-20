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
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
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
  APR_GAP_PATH,
  DEBT_DUMBBELL,
  DEBT_STOCK_PATH,
  HEADLINE,
  LIQUID_CASH_VINTAGE,
  SAVING_RATE_PATH,
  SOURCE_NOTE,
  SOURCES,
  STRESS_MIX_NEW,
  STRESS_MIX_PRIOR,
  STRESS_PATH,
  VINTAGE_METERS,
  debtDeltasSorted,
  fmtPct,
  fmtPp,
  fmtTn,
  meterDeltasSorted,
} from "@/data/consumer-finance-markets-update-2026q3-data";

// viz-types: vintage Δ bars, saving area, debt dumbbell scatter, stress multi-line + radar, cash dual bars, APR composed | layout: default
// viz-plan: meter Δ; saving path into July; product dumbbell; stress path/radar; cash sleeve Δ; sticky APR gap; panel + stress + cash controls

type Panel = "meters" | "saving" | "debt" | "stress" | "cash" | "rates";
type StressView = "path" | "radar";
type CashMode = "levels" | "delta";

const SAVE = "#14b8a6";
const DEBT = "#0ea5e9";
const STRESS = "#f43f5e";
const MMF = "#a78bfa";
const FUNDS = "#38bdf8";
const GAP = "#fb7185";
const PRIOR = "#94a3b8";
const NEW = "#0f172a";

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
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              on ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function ConsumerFinanceMarketsUpdate2026q3Dashboard() {
  const [panel, setPanel] = useState<Panel>("meters");
  const [stressView, setStressView] = useState<StressView>("path");
  const [cashMode, setCashMode] = useState<CashMode>("delta");

  const meterRows = useMemo(
    () =>
      meterDeltasSorted().map((m) => ({
        ...m,
        fill: m.direction === "down" ? SAVE : m.direction === "up" ? STRESS : PRIOR,
      })),
    [],
  );

  const debtDeltaRows = useMemo(
    () =>
      debtDeltasSorted().map((d) => ({
        name: d.shortLabel,
        delta: d.deltaTn * 1000,
        fill: d.deltaTn >= 0 ? DEBT : SAVE,
      })),
    [],
  );

  const cashRows = useMemo(() => {
    return LIQUID_CASH_VINTAGE.map((r) => ({
      name: r.label.replace(" (ex-large time)", "").replace(" / short Treasuries (est.)", ""),
      prior: r.priorTn,
      neu: r.newTn,
      delta: r.newTn - r.priorTn,
      yieldPct: r.yieldPct,
    }));
  }, []);

  const debtStockChart = useMemo(
    () =>
      DEBT_STOCK_PATH.map((d) => ({
        label: d.label,
        total: d.totalTn,
        mortgage: d.mortgageTn,
        nonHousing: d.nonHousingTn,
      })),
    [],
  );

  const radarRows = useMemo(() => {
    return STRESS_MIX_PRIOR.map((p, i) => ({
      axis: p.axis,
      prior: p.value,
      neu: STRESS_MIX_NEW[i]?.value ?? p.value,
    }));
  }, []);

  const dumbbellScatter = useMemo(() => {
    const priorPts = DEBT_DUMBBELL.map((d, i) => ({ x: d.prior, y: i, name: d.name, kind: "prior" }));
    const newPts = DEBT_DUMBBELL.map((d, i) => ({ x: d.neu, y: i, name: d.name, kind: "new" }));
    return { priorPts, newPts, labels: DEBT_DUMBBELL.map((d) => d.name) };
  }, []);

  return (
    <div className="space-y-6" data-viz="consumer-finance-markets-update-2026q3">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-4 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
          Q3 vintage update · vs Aug update print
        </p>
        <p className="mt-1 text-lg font-bold sm:text-xl">
          Saving {fmtPct(HEADLINE.savingNewPct)} ({fmtPp(HEADLINE.savingDeltaPp)}) · Debt{" "}
          {fmtTn(HEADLINE.totalDebtNewTn)} (+${(HEADLINE.totalDebtDeltaTn * 1000).toFixed(0)}B) · Student
          90+ {fmtPct(HEADLINE.student90StockNewPct)} ({fmtPp(HEADLINE.student90DeltaPp)})
        </p>
        <p className="mt-2 text-sm text-slate-300">
          NY Fed {HEADLINE.newAsOfDebt} · BEA {HEADLINE.newAsOfSaving} · ICI {HEADLINE.newAsOfMmf}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={panel}
          onChange={setPanel}
          options={[
            { id: "meters", label: "Δ meters" },
            { id: "saving", label: "Saving" },
            { id: "debt", label: "Debt" },
            { id: "stress", label: "Stress" },
            { id: "cash", label: "Cash" },
            { id: "rates", label: "APR gap" },
          ]}
        />
        {panel === "stress" && (
          <ToggleGroup
            label="Stress view"
            value={stressView}
            onChange={setStressView}
            options={[
              { id: "path", label: "QoQ path" },
              { id: "radar", label: "Mix radar" },
            ]}
          />
        )}
        {panel === "cash" && (
          <ToggleGroup
            label="Cash view"
            value={cashMode}
            onChange={setCashMode}
            options={[
              { id: "delta", label: "Δ vs prior" },
              { id: "levels", label: "Prior | New" },
            ]}
          />
        )}
      </div>

      {panel === "meters" && (
        <ChartCard
          title="What changed vs the Aug update print"
          subtitle="Signed vintage deltas — July saving rebound and Q2 debt print lead"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={meterRows} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="label" width={150} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [String(value), "Δ"]}
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as (typeof meterRows)[0] | undefined;
                    return row ? `${row.label}: ${row.prior} → ${row.neu} (${row.deltaLabel})` : "";
                  }}
                />
                <ReferenceLine x={0} stroke="#64748b" />
                <Bar dataKey="delta" radius={[0, 4, 4, 0]}>
                  {meterRows.map((r) => (
                    <Cell key={r.id} fill={r.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
            {VINTAGE_METERS.map((m) => (
              <li key={m.id}>
                <span className="font-semibold text-slate-800">{m.label}:</span> {m.prior} → {m.neu}{" "}
                <span className="text-slate-500">({m.deltaLabel})</span>
              </li>
            ))}
          </ul>
        </ChartCard>
      )}

      {panel === "saving" && (
        <ChartCard
          title="Personal saving rate path into July 2026"
          subtitle="Q2 SAAR printed 2.8%; July monthly PSAVERT rebounded to 3.1%"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SAVING_RATE_PATH} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <defs>
                  <linearGradient id="saveFillQ3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={SAVE} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={SAVE} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[0, 6]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const sorted = sortTooltipPayload(payload);
                    const p = sorted[0]?.payload as (typeof SAVING_RATE_PATH)[0];
                    return (
                      <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <div className="font-semibold">{p.label}</div>
                        <div>
                          {fmtPct(p.savingRatePct)} · {p.confidence}
                        </div>
                      </div>
                    );
                  }}
                />
                <ReferenceLine
                  y={2.8}
                  stroke={PRIOR}
                  strokeDasharray="4 4"
                  label={{ value: "Aug update Q2 2.8%", fill: PRIOR, fontSize: 10 }}
                />
                <Area
                  type="monotone"
                  dataKey="savingRatePct"
                  stroke={SAVE}
                  fill="url(#saveFillQ3)"
                  strokeWidth={2.5}
                  name="Saving rate"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "debt" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Product dumbbell — 2026Q1 → 2026Q2"
            subtitle="Cards rebound; mortgages still do most dollar work"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: 48, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Balance"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}T`}
                    domain={[0, 14]}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Product"
                    tick={{ fontSize: 11 }}
                    ticks={dumbbellScatter.labels.map((_, i) => i)}
                    tickFormatter={(v) => dumbbellScatter.labels[Number(v)] ?? ""}
                    domain={[-0.5, dumbbellScatter.labels.length - 0.5]}
                  />
                  <ZAxis range={[80, 80]} />
                  <Tooltip
                    formatter={(v, name) => [fmtTn(Number(v)), name === "x" ? "Balance" : String(name)]}
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as { name?: string } | undefined;
                      return row?.name ?? "";
                    }}
                  />
                  <Scatter name="Prior (Q1)" data={dumbbellScatter.priorPts} fill={PRIOR} />
                  <Scatter name="New (Q2)" data={dumbbellScatter.newPts} fill={DEBT} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 h-[160px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={debtDeltaRows} margin={{ left: 8, right: 8, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}B`} />
                  <Tooltip formatter={(v) => [`$${Number(v).toFixed(0)}B`, "Δ"]} />
                  <ReferenceLine y={0} stroke="#64748b" />
                  <Bar dataKey="delta" radius={[4, 4, 0, 0]}>
                    {debtDeltaRows.map((r) => (
                      <Cell key={r.name} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Aggregate debt stock path"
            subtitle={`${fmtTn(HEADLINE.totalDebtPriorTn)} → ${fmtTn(HEADLINE.totalDebtNewTn)}`}
          >
            <div className="h-[500px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={debtStockChart} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}T`} />
                  <Tooltip formatter={(v, name) => [fmtTn(Number(v)), String(name)]} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="mortgage"
                    name="Mortgage"
                    stackId="1"
                    fill="#0ea5e9"
                    stroke="#0284c7"
                    fillOpacity={0.55}
                  />
                  <Area
                    type="monotone"
                    dataKey="nonHousing"
                    name="Non-housing"
                    stackId="1"
                    fill="#f59e0b"
                    stroke="#d97706"
                    fillOpacity={0.55}
                  />
                  <Line type="monotone" dataKey="total" name="Total" stroke={NEW} strokeWidth={2} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "stress" && (
        <ChartCard
          title={
            stressView === "path"
              ? "Delinquency path into 2026Q2"
              : "Stress mix — Aug update vs 2026Q2"
          }
          subtitle="Student 90+ +0.3 pp; mortgage serious +0.1 pp; card early −0.2 pp; any-stage 4.9%"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              {stressView === "path" ? (
                <ComposedChart data={STRESS_PATH} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v, name) => [fmtPct(Number(v)), String(name)]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="student90Pct"
                    name="Student 90+ stock"
                    stroke={STRESS}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mortgageSeriousPct"
                    name="Mortgage 90+ transition"
                    stroke={DEBT}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cardEarlyPct"
                    name="Card early (30+) transition"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="aggregateAnyPct"
                    name="Any-stage delinquency"
                    stroke={PRIOR}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              ) : (
                <RadarChart data={radarRows} cx="50%" cy="52%" outerRadius="70%">
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: "#475569" }} />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} domain={[0, 12]} />
                  <Radar name="Aug update" dataKey="prior" stroke={PRIOR} fill={PRIOR} fillOpacity={0.2} />
                  <Radar name="2026Q2" dataKey="neu" stroke={STRESS} fill={STRESS} fillOpacity={0.25} />
                  <Legend />
                  <Tooltip formatter={(v, name) => [fmtPct(Number(v)), String(name)]} />
                </RadarChart>
              )}
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "cash" && (
        <ChartCard
          title="Liquid cash sleeves — Aug update vs ICI / H.8-style Q3 check"
          subtitle="MMFs +$90B to $8.02T; deposits edged −$50B in this estimate"
        >
          <div className="h-[340px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              {cashMode === "delta" ? (
                <BarChart data={cashRows} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}T`} />
                  <Tooltip formatter={(v) => [fmtTn(Number(v), 2), "Δ"]} />
                  <ReferenceLine y={0} stroke="#64748b" />
                  <Bar dataKey="delta" name="Δ vs prior" radius={[4, 4, 0, 0]}>
                    {cashRows.map((r) => (
                      <Cell key={r.name} fill={r.delta >= 0 ? MMF : SAVE} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <BarChart data={cashRows} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}T`} />
                  <Tooltip formatter={(v, name) => [fmtTn(Number(v)), name === "prior" ? "Prior" : "New"]} />
                  <Legend />
                  <Bar dataKey="prior" name="Prior" fill={PRIOR} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="neu" name="New" fill={MMF} radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "rates" && (
        <ChartCard
          title="Card APR − fed funds gap"
          subtitle={`Gap still ~${HEADLINE.aprGapPp.toFixed(1)} pp — funds eased another tenth; card APRs barely moved`}
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={APR_GAP_PATH} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v} pp`}
                />
                <Tooltip
                  formatter={(v, name) => {
                    if (name === "Gap") return [fmtPp(Number(v)).replace("+", ""), "Gap"];
                    return [fmtPct(Number(v)), String(name)];
                  }}
                />
                <Legend />
                <Bar yAxisId="right" dataKey="gapPp" name="Gap" fill={GAP} fillOpacity={0.35} radius={[4, 4, 0, 0]} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="cardAprPct"
                  name="Card APR"
                  stroke={STRESS}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="fedFundsPct"
                  name="Fed funds"
                  stroke={FUNDS}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a className="text-sky-700 underline-offset-2 hover:underline" href={s.url}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
