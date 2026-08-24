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
  ReferenceLine,
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
  CAREER_TRACKS,
  COST_AMORT_ROWS,
  CUMULATIVE_NET,
  EXPERIENCE_YEARS,
  GAP_PAIRS,
  HEADLINE,
  REGION_PREMIUMS,
  SOURCE_NOTE,
  type ExperienceYear,
} from "@/data/trade-wages-versus-college-majors-2026-data";

type Panel =
  | "wage-paths"
  | "gap-ladder"
  | "cost-scatter"
  | "cumulative"
  | "region-edge";

type WageMode = "gross" | "net";

const COLORS = {
  trade: "#0f766e",
  major: "#1e3a5f",
  gapPos: "#0f766e",
  gapNeg: "#be123c",
  grid: "#e2e8f0",
  amort: "#c2410c",
};

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "wage-paths": {
    title: "Wage gap at 10 years — experience paths",
    subtitle:
      "Modeled annual wages by years on the job; toggle net of 10-year cost amortization",
  },
  "gap-ladder": {
    title: "Trade − major wage gaps by experience year",
    subtitle:
      "Positive = trade ahead. Electrician clears biology/psych/education by year 10",
  },
  "cost-scatter": {
    title: "Upfront cost vs net wage at year 10",
    subtitle:
      "Trades cluster low-cost / mid-wage; BA fields pay tuition for wider outcomes",
  },
  cumulative: {
    title: "Cumulative net earnings from career start",
    subtitle:
      "Electrician cumulative net passes biology around year 6; trails mechanical engineering",
  },
  "region-edge": {
    title: "Regional trade edge vs biology at year 10",
    subtitle:
      "OEWS-style premiums applied to national paths — Midwest edge widest",
  },
};

const fmtUsd = (n: number) =>
  n < 0
    ? `-$${Math.abs(n).toLocaleString()}`
    : `$${n.toLocaleString()}`;

const fmtK = (n: number) => {
  const sign = n < 0 ? "-" : "";
  const v = Math.abs(n);
  if (v >= 1_000_000) return `${sign}$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${sign}$${Math.round(v / 1_000)}k`;
  return `${sign}$${v}`;
};

export function TradeWagesVersusCollegeMajors2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("wage-paths");
  const [tradeId, setTradeId] = useState(ANALYTICS.defaultTradeId);
  const [majorId, setMajorId] = useState(ANALYTICS.defaultMajorId);
  const [year, setYear] = useState<ExperienceYear>(ANALYTICS.defaultYear);
  const [mode, setMode] = useState<WageMode>("net");

  const trades = useMemo(
    () => CAREER_TRACKS.filter((t) => t.kind === "trade"),
    []
  );
  const majors = useMemo(
    () => CAREER_TRACKS.filter((t) => t.kind === "major"),
    []
  );

  const trade = CAREER_TRACKS.find((t) => t.id === tradeId)!;
  const major = CAREER_TRACKS.find((t) => t.id === majorId)!;

  const pathData = useMemo(() => {
    const tAmort = Math.round(trade.upfrontCost / 10);
    const mAmort = Math.round(major.upfrontCost / 10);
    return EXPERIENCE_YEARS.map((y) => {
      const tw = trade.wageByYear[String(y)];
      const mw = major.wageByYear[String(y)];
      const tAdj = mode === "net" && y <= 10 ? tw - tAmort : tw;
      const mAdj = mode === "net" && y <= 10 ? mw - mAmort : mw;
      return {
        year: y,
        trade: tAdj,
        major: mAdj,
        gap: tAdj - mAdj,
      };
    });
  }, [trade, major, mode]);

  const gapAtSelected = useMemo(() => {
    const row = pathData.find((r) => r.year === year);
    return row?.gap ?? 0;
  }, [pathData, year]);

  const gapLadderData = useMemo(() => {
    return GAP_PAIRS.map((p) => ({
      label: `${p.tradeLabel} − ${p.majorLabel}`,
      gap: p.gapByYear[String(year)] ?? 0,
      net10: p.netGapAt10,
    })).sort((a, b) => b.gap - a.gap);
  }, [year]);

  const scatterData = useMemo(
    () =>
      COST_AMORT_ROWS.map((r) => ({
        id: r.id,
        label: r.label,
        kind: r.kind,
        upfrontCost: r.upfrontCost,
        netAt10: r.netAt10,
        wageAt10: r.wageAt10,
        z: r.kind === "trade" ? 120 : 80,
        fill: r.color,
      })),
    []
  );

  const meta = PANEL_META[panel];

  return (
    <div
      className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      data-viz="trade-wages-versus-college-majors-2026"
    >
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
          Labor & Skills · Trade vs degree earnings
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
          Trade wages versus college majors
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          After license and tuition costs, how do skilled-trade earnings stack
          against bachelor&apos;s fields at the same experience years?{" "}
          <span className="font-medium text-slate-800">
            Wage gap at 10 years: electrician clears biology by{" "}
            {fmtUsd(HEADLINE.gapAt10ElecVsBio)} gross ·{" "}
            {fmtUsd(HEADLINE.netGapAt10ElecVsBio)} net of amortization
          </span>
          .
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["wage-paths", "Wage paths"],
            ["gap-ladder", "Gap ladder"],
            ["cost-scatter", "Cost scatter"],
            ["cumulative", "Cumulative net"],
            ["region-edge", "Region edge"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPanel(id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              panel === id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Trade
        </span>
        {trades.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTradeId(t.id)}
            className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition ${
              tradeId === t.id
                ? "bg-teal-800 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
        <span className="ml-2 text-xs font-medium uppercase tracking-wide text-slate-500">
          Major
        </span>
        {majors.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMajorId(m.id)}
            className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition ${
              majorId === m.id
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Experience
        </span>
        {EXPERIENCE_YEARS.map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => setYear(y)}
            className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition ${
              year === y
                ? "bg-rose-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {y}y
          </button>
        ))}
        <span className="ml-2 text-xs font-medium uppercase tracking-wide text-slate-500">
          Wage basis
        </span>
        {(
          [
            ["gross", "Gross"],
            ["net", "Net of cost"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition ${
              mode === id
                ? "bg-amber-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-lg bg-teal-50 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-teal-800">
            Selected gap @ {year}y
          </p>
          <p className="text-lg font-semibold text-teal-950">
            {fmtK(gapAtSelected)}
          </p>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Headline @ 10y (gross)
          </p>
          <p className="text-lg font-semibold text-slate-900">
            {fmtK(HEADLINE.gapAt10ElecVsBio)}
          </p>
        </div>
        <div className="rounded-lg bg-amber-50 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-900">
            Net gap @ 10y
          </p>
          <p className="text-lg font-semibold text-amber-950">
            {fmtK(HEADLINE.netGapAt10ElecVsBio)}
          </p>
        </div>
        <div className="rounded-lg bg-rose-50 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-900">
            Cumulative crossover
          </p>
          <p className="text-lg font-semibold text-rose-950">
            ~{HEADLINE.crossoverYearsElecBio} years
          </p>
        </div>
      </div>

      <div className="mb-2">
        <h4 className="text-base font-semibold text-slate-900">{meta.title}</h4>
        <p className="text-sm text-slate-600">{meta.subtitle}</p>
      </div>

      <div className="h-[380px] w-full sm:h-[420px]">
        {panel === "wage-paths" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={pathData}
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11 }}
                label={{
                  value: "Years of experience",
                  position: "insideBottom",
                  offset: -2,
                  fontSize: 11,
                }}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => fmtK(v)}
                width={52}
              />
              <Tooltip
                formatter={(v, name) => [
                  fmtUsd(Number(v)),
                  name === "trade"
                    ? trade.label
                    : name === "major"
                      ? major.label
                      : "Gap",
                ]}
                labelFormatter={(l) => `Year ${l}`}
              />
              <Legend />
              <ReferenceLine x={10} stroke="#94a3b8" strokeDasharray="4 4" />
              <Bar
                dataKey="gap"
                name="Gap"
                fill="#cbd5e1"
                opacity={0.45}
                radius={[3, 3, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="trade"
                name={trade.label}
                stroke={trade.color}
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="major"
                name={major.label}
                stroke={major.color}
                strokeWidth={2.5}
                strokeDasharray="5 4"
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "gap-ladder" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={gapLadderData}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => fmtK(v)}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={150}
                tick={{ fontSize: 10 }}
              />
              <Tooltip
                formatter={(v, name) => [
                  fmtUsd(Number(v)),
                  name === "gap" ? `Gap @ ${year}y` : "Net @ 10y",
                ]}
              />
              <Legend />
              <ReferenceLine x={0} stroke="#64748b" />
              <Bar dataKey="gap" name={`Gap @ ${year}y`} radius={[0, 3, 3, 0]}>
                {gapLadderData.map((row) => (
                  <Cell
                    key={row.label}
                    fill={row.gap >= 0 ? COLORS.gapPos : COLORS.gapNeg}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "cost-scatter" && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis
                type="number"
                dataKey="upfrontCost"
                name="Upfront"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => fmtK(v)}
                label={{
                  value: "Upfront training cost",
                  position: "insideBottom",
                  offset: -4,
                  fontSize: 11,
                }}
              />
              <YAxis
                type="number"
                dataKey="netAt10"
                name="Net @ 10y"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => fmtK(v)}
                width={52}
              />
              <ZAxis type="number" dataKey="z" range={[60, 200]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) => [
                  fmtUsd(Number(v)),
                  name === "upfrontCost"
                    ? "Upfront"
                    : name === "netAt10"
                      ? "Net wage @ 10y"
                      : String(name),
                ]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.label ?? ""
                }
              />
              <Scatter name="Tracks" data={scatterData}>
                {scatterData.map((d) => (
                  <Cell key={d.id} fill={d.fill} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}

        {panel === "cumulative" && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={CUMULATIVE_NET}
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => fmtK(v)}
                width={56}
              />
              <Tooltip
                formatter={(v, name) => [fmtUsd(Number(v)), String(name)]}
                labelFormatter={(l) => `Year ${l}`}
              />
              <Legend />
              <ReferenceLine
                x={HEADLINE.crossoverYearsElecBio}
                stroke="#94a3b8"
                strokeDasharray="4 4"
                label={{
                  value: "≈ crossover",
                  fontSize: 10,
                  fill: "#64748b",
                }}
              />
              <Area
                type="monotone"
                dataKey="electrician"
                name="Electrician"
                stroke="#0f766e"
                fill="#0f766e"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="biology"
                name="Biology"
                stroke="#15803d"
                fill="#15803d"
                fillOpacity={0.08}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="psychology"
                name="Psychology"
                stroke="#a21caf"
                fill="#a21caf"
                fillOpacity={0.06}
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="mechEng"
                name="Mech. eng."
                stroke="#1e3a5f"
                fill="#1e3a5f"
                fillOpacity={0.05}
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {panel === "region-edge" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={REGION_PREMIUMS}
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis dataKey="region" tick={{ fontSize: 10 }} interval={0} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                width={52}
                domain={[0, 18000]}
              />
              <Tooltip
                formatter={(v, name) => [
                  name === "tradeEdgeAt10"
                    ? `$${Math.round(Number(v) / 1000)}k`
                    : `${(Number(v) * 100).toFixed(0)}% of national`,
                  name === "tradeEdgeAt10"
                    ? "Trade edge @ 10y"
                    : name === "electricianPremium"
                      ? "Elec. premium"
                      : "Bio premium",
                ]}
              />
              <Legend />
              <Bar
                dataKey="tradeEdgeAt10"
                name="Trade edge @ 10y"
                fill={COLORS.trade}
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        {SOURCE_NOTE}
      </p>
    </div>
  );
}
