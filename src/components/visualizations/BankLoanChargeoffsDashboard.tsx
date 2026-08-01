"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  BUMP_RANKS,
  DELINQ_VS_CHARGE,
  HEADLINE,
  HEAT_YEARS,
  LATEST_RANKED,
  QUARTERLY_PATH,
  SLOPE_COMPARE,
  SOURCE_NOTE,
  SOURCES,
  YEAR_END_HEAT,
  fmtMultiple,
  fmtPct,
  heatValue,
  type HeatYear,
} from "@/data/bank-loan-chargeoffs-data";

// viz-types: heatmap matrix, multi-line path, slope dumbbell, delinquency×chargeoff scatter, bump ranks | layout: canvas

type MetricMode = "chargeOff" | "delinquency";
type RangeMode = "full" | "postTrough";
type HighlightCat = "all" | "cards" | "cre" | "ci";

const CARDS = "#f59e0b";
const CRE = "#0ea5e9";
const CI = "#a78bfa";
const OTHER = "#f43f5e";
const RESI = "#64748b";
const TOTAL = "#14b8a6";

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
                ? "bg-amber-700 text-white"
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

function heatColor(v: number): string {
  if (v <= 0) return "#e2e8f0";
  if (v < 0.25) return "#fef3c7";
  if (v < 0.75) return "#fde68a";
  if (v < 1.5) return "#fbbf24";
  if (v < 3) return "#f59e0b";
  if (v < 4) return "#ea580c";
  return "#c2410c";
}

function HeatmapPanel() {
  const maxAbs = Math.max(
    ...YEAR_END_HEAT.flatMap((r) =>
      HEAT_YEARS.map((y) => Math.abs(heatValue(r, y))),
    ),
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="px-2 py-2 text-left font-semibold text-slate-600">
              Category
            </th>
            {HEAT_YEARS.map((y) => (
              <th
                key={y}
                className="px-2 py-2 text-center font-semibold text-slate-600"
              >
                {y}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {YEAR_END_HEAT.map((row) => (
            <tr key={row.short}>
              <td className="px-2 py-1.5 font-medium text-slate-800">
                {row.short}
              </td>
              {HEAT_YEARS.map((y) => {
                const v = heatValue(row, y as HeatYear);
                const intensity = Math.min(1, Math.abs(v) / maxAbs);
                return (
                  <td key={y} className="px-1 py-1">
                    <div
                      className="flex h-12 items-center justify-center rounded-md text-xs font-bold tabular-nums"
                      style={{
                        backgroundColor: heatColor(v),
                        color: intensity > 0.55 ? "#fff" : "#1e293b",
                      }}
                      title={`${row.category} ${y}: ${fmtPct(v)}`}
                    >
                      {fmtPct(v, 2)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-slate-500">
        Year-end net charge-off rates (%). Darker amber = higher realized losses.
      </p>
    </div>
  );
}

function SlopePanel() {
  const data = SLOPE_COMPARE;
  const max = Math.max(...data.flatMap((d) => [d.start, d.end]), 0.5);

  return (
    <div className="space-y-3">
      {data.map((d) => {
        const x0 = (d.start / max) * 100;
        const x1 = (d.end / max) * 100;
        const up = d.deltaPp >= 0;
        return (
          <div key={d.short} className="grid grid-cols-[7rem_1fr_4.5rem] items-center gap-2">
            <span className="truncate text-sm font-medium text-slate-700">
              {d.short}
            </span>
            <div className="relative h-8 rounded bg-slate-50">
              <div
                className="absolute top-1/2 h-0.5 -translate-y-1/2"
                style={{
                  left: `${Math.min(x0, x1)}%`,
                  width: `${Math.abs(x1 - x0)}%`,
                  backgroundColor: up ? OTHER : TOTAL,
                }}
              />
              <div
                className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
                style={{ left: `${x0}%`, backgroundColor: RESI }}
                title={`2019 Q4: ${fmtPct(d.start)}`}
              />
              <div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
                style={{ left: `${x1}%`, backgroundColor: up ? CARDS : CRE }}
                title={`2026 Q1: ${fmtPct(d.end)}`}
              />
            </div>
            <span
              className={`text-right text-xs font-semibold tabular-nums ${
                up ? "text-rose-600" : "text-teal-600"
              }`}
            >
              {up ? "+" : ""}
              {d.deltaPp.toFixed(2)} pp
            </span>
          </div>
        );
      })}
      <p className="text-xs text-slate-500">
        Gray = 2019 Q4 · colored = 2026 Q1. Sorted by latest charge-off rate.
      </p>
    </div>
  );
}

export function BankLoanChargeoffsDashboard() {
  const [metric, setMetric] = useState<MetricMode>("chargeOff");
  const [range, setRange] = useState<RangeMode>("postTrough");
  const [highlight, setHighlight] = useState<HighlightCat>("all");

  const path = useMemo(() => {
    const rows =
      range === "postTrough"
        ? QUARTERLY_PATH.filter((r) => r.quarter >= "2021Q4")
        : QUARTERLY_PATH;
    return rows;
  }, [range]);

  const ranked = useMemo(() => {
    const key = metric === "chargeOff" ? "chargeOff" : "delinquency";
    return [...LATEST_RANKED].sort((a, b) => b[key] - a[key]);
  }, [metric]);

  const lineOpacity = (key: HighlightCat) => {
    if (highlight === "all") return 1;
    return highlight === key ? 1 : 0.18;
  };

  return (
    <div
      data-viz="bank-loan-chargeoffs"
      className="mx-auto w-full max-w-6xl space-y-6"
    >
      <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
          Bank loan charge-offs — Fed SA
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Credit cards write off {fmtMultiple(HEADLINE.cardsOverCre)} what CRE
          does
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          As of {HEADLINE.asOf}, net charge-offs on credit cards hit{" "}
          <span className="font-semibold text-amber-300">
            {fmtPct(HEADLINE.cardsChargeOff)}
          </span>{" "}
          versus{" "}
          <span className="font-semibold text-sky-300">
            {fmtPct(HEADLINE.creChargeOff)}
          </span>{" "}
          on commercial real estate. CRE delinquency headlines miss the loss
          ledger: cards still dominate realized bank credit costs.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Cards charge-off", value: fmtPct(HEADLINE.cardsChargeOff), color: "text-amber-300" },
            { label: "CRE charge-off", value: fmtPct(HEADLINE.creChargeOff), color: "text-sky-300" },
            { label: "Cards ÷ CRE", value: fmtMultiple(HEADLINE.cardsOverCre), color: "text-rose-300" },
            { label: "Cards peak (24Q3)", value: fmtPct(HEADLINE.cardsPeakRecent), color: "text-orange-300" },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-3"
            >
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className={`mt-1 text-xl font-bold tabular-nums ${k.color}`}>
                {k.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <ToggleGroup
          label="Metric"
          value={metric}
          onChange={setMetric}
          options={[
            { id: "chargeOff", label: "Charge-offs" },
            { id: "delinquency", label: "Delinquency" },
          ]}
        />
        <ToggleGroup
          label="Path"
          value={range}
          onChange={setRange}
          options={[
            { id: "postTrough", label: "Post-trough" },
            { id: "full", label: "Since 2019" },
          ]}
        />
        <ToggleGroup
          label="Highlight"
          value={highlight}
          onChange={setHighlight}
          options={[
            { id: "all", label: "All" },
            { id: "cards", label: "Cards" },
            { id: "cre", label: "CRE" },
            { id: "ci", label: "C&I" },
          ]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title={
            metric === "chargeOff"
              ? "Latest charge-off rates"
              : "Latest delinquency rates"
          }
          subtitle={`${HEADLINE.asOf} · ranked highest → lowest · Fed SA`}
        >
          <div className="min-h-[280px] space-y-2.5">
            {ranked.map((r) => {
              const val =
                metric === "chargeOff" ? r.chargeOff : r.delinquency;
              const max =
                metric === "chargeOff"
                  ? ranked[0].chargeOff
                  : ranked[0].delinquency;
              const w = max > 0 ? (val / max) * 100 : 0;
              const color =
                r.short === "Cards"
                  ? CARDS
                  : r.short === "CRE"
                    ? CRE
                    : r.short === "C&I"
                      ? CI
                      : r.short === "Other cons."
                        ? OTHER
                        : RESI;
              return (
                <div
                  key={r.short}
                  className="grid grid-cols-[6.5rem_1fr_3.5rem] items-center gap-2"
                >
                  <span className="truncate text-sm font-medium text-slate-700">
                    {r.short}
                  </span>
                  <div className="h-7 overflow-hidden rounded-md bg-slate-100">
                    <div
                      className="flex h-full items-center rounded-md px-2 text-[10px] font-bold text-white"
                      style={{ width: `${Math.max(w, 4)}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="text-right text-sm font-semibold tabular-nums text-slate-800">
                    {fmtPct(val)}
                  </span>
                </div>
              );
            })}
          </div>
        </ChartCard>

        <ChartCard
          title="Charge-off heatmap"
          subtitle="Year-end net charge-off % by category"
        >
          <div className="min-h-[280px]">
            <HeatmapPanel />
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Loss paths: cards vs CRE vs C&I"
        subtitle="Quarterly net charge-off rates · toggle path range & highlight"
      >
        <div className="h-80 min-h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%" minHeight={280}>
            <ComposedChart data={path} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
                domain={[0, "auto"]}
              />
              <Tooltip
                formatter={(value) => fmtPct(Number(value))}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const sorted = sortTooltipPayload(payload);
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                      <p className="mb-1 font-semibold text-slate-800">{label}</p>
                      {sorted.map((p) => (
                        <p key={String(p.dataKey)} style={{ color: p.color }}>
                          {p.name}: {fmtPct(Number(p.value))}
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="cards"
                name="Credit cards"
                stroke={CARDS}
                strokeWidth={highlight === "all" || highlight === "cards" ? 3 : 1.5}
                strokeOpacity={lineOpacity("cards")}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="cre"
                name="CRE"
                stroke={CRE}
                strokeWidth={highlight === "all" || highlight === "cre" ? 3 : 1.5}
                strokeOpacity={lineOpacity("cre")}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="ci"
                name="C&I"
                stroke={CI}
                strokeWidth={highlight === "all" || highlight === "ci" ? 3 : 1.5}
                strokeOpacity={lineOpacity("ci")}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="otherConsumer"
                name="Other consumer"
                stroke={OTHER}
                strokeWidth={1.5}
                strokeOpacity={highlight === "all" ? 0.7 : 0.15}
                dot={false}
                strokeDasharray="4 3"
              />
              <Line
                type="monotone"
                dataKey="total"
                name="Total loans"
                stroke={TOTAL}
                strokeWidth={1.5}
                strokeOpacity={highlight === "all" ? 0.55 : 0.12}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="2019 Q4 → 2026 Q1 slope"
          subtitle="Charge-off rate start vs end · highest latest first"
        >
          <div className="min-h-[280px]">
            <SlopePanel />
          </div>
        </ChartCard>

        <ChartCard
          title="Delinquency vs charge-offs"
          subtitle="Past-due rates can look high while realized losses stay small"
        >
          <div className="h-80 min-h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={280}>
              <ScatterChart margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="delinquency"
                  name="Delinquency"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  label={{
                    value: "Delinquency %",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="chargeOff"
                  name="Charge-off"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  label={{
                    value: "Charge-off %",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <ZAxis range={[80, 80]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const d = payload[0].payload as (typeof DELINQ_VS_CHARGE)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                        <p className="font-semibold text-slate-800">{d.category}</p>
                        <p>Charge-off: {fmtPct(d.chargeOff)}</p>
                        <p>Delinquency: {fmtPct(d.delinquency)}</p>
                      </div>
                    );
                  }}
                />
                <Scatter data={DELINQ_VS_CHARGE} name="Categories">
                  {DELINQ_VS_CHARGE.map((d) => (
                    <Cell
                      key={d.short}
                      fill={
                        d.short === "Cards"
                          ? CARDS
                          : d.short === "CRE"
                            ? CRE
                            : d.short === "C&I"
                              ? CI
                              : d.short === "Other cons."
                                ? OTHER
                                : RESI
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Charge-off severity ranks over time"
        subtitle="Rank 1 = highest charge-off rate · cards never leave the top"
      >
        <div className="h-72 min-h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%" minHeight={260}>
            <LineChart data={BUMP_RANKS} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis
                reversed
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fontSize: 11 }}
                label={{
                  value: "Rank (1 = worst)",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 11,
                }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const sorted = [...payload].sort(
                    (a, b) => Number(a.value) - Number(b.value),
                  );
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                      <p className="mb-1 font-semibold">{label}</p>
                      {sorted.map((p) => (
                        <p key={String(p.dataKey)} style={{ color: p.color }}>
                          {p.name}: #{p.value}
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <Line type="monotone" dataKey="cards" name="Cards" stroke={CARDS} strokeWidth={3} />
              <Line type="monotone" dataKey="other" name="Other cons." stroke={OTHER} strokeWidth={2} />
              <Line type="monotone" dataKey="ci" name="C&I" stroke={CI} strokeWidth={2} />
              <Line type="monotone" dataKey="cre" name="CRE" stroke={CRE} strokeWidth={2} />
              <Line
                type="monotone"
                dataKey="residential"
                name="Residential"
                stroke={RESI}
                strokeWidth={2}
                strokeDasharray="4 3"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <p className="text-xs leading-relaxed text-slate-500">
        {SOURCE_NOTE}{" "}
        {SOURCES.map((s, i) => (
          <span key={s.href}>
            {i > 0 ? " · " : ""}
            <a
              href={s.href}
              className="text-amber-700 underline-offset-2 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {s.label}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}
