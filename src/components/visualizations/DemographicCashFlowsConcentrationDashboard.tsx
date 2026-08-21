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
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  CORRIDOR_CONCENTRATION_CURVE,
  CORRIDOR_SHARES,
  DEPENDENCE_CONCENTRATION_CURVE,
  DEPENDENCE_SHARES,
  DUAL_LEDGER,
  FLOW_COMPARE,
  HEADLINE,
  LENS_COMPARE,
  PENSION_BURDENS,
  RECIPIENT_CONCENTRATION_CURVE,
  SOURCE_NOTE,
  fmtBn,
  fmtPct,
  namedRecipients,
} from "@/data/demographic-cash-flows-concentration-2026-data";

// viz-types: Lorenz area+line, ranked bars, recipient pie, lens scatter, dual-ledger scatter, flow bars | layout: default

type ViewId = "recipients" | "corridors" | "dependence" | "pensions";
type LadderMetric = "sharePct" | "amountBn" | "cumulative";
type CurveLens = "recipients" | "corridors" | "dependence";

const AMBER = "#f59e0b";
const SKY = "#0ea5e9";
const ROSE = "#ef4444";
const TEAL = "#0f766e";
const SLATE = "#64748b";
const VIOLET = "#8b5cf6";

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
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
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

export function DemographicCashFlowsConcentrationDashboard() {
  const [view, setView] = useState<ViewId>("recipients");
  const [ladderMetric, setLadderMetric] = useState<LadderMetric>("sharePct");
  const [curveLens, setCurveLens] = useState<CurveLens>("recipients");
  const [showEqualLine, setShowEqualLine] = useState(true);

  const recipients = useMemo(() => namedRecipients(), []);

  const recipientBars = useMemo(() => {
    const rows = [...recipients];
    if (ladderMetric === "amountBn") {
      return rows.sort((a, b) => b.amountBn - a.amountBn);
    }
    if (ladderMetric === "cumulative") {
      return rows.sort((a, b) => b.cumulativeSharePct - a.cumulativeSharePct);
    }
    return rows.sort((a, b) => b.sharePct - a.sharePct);
  }, [recipients, ladderMetric]);

  const corridorBars = useMemo(() => {
    const rows = [...CORRIDOR_SHARES];
    if (ladderMetric === "amountBn") {
      return rows.sort((a, b) => b.amountBn - a.amountBn);
    }
    if (ladderMetric === "cumulative") {
      return rows.sort((a, b) => b.cumulativeSharePct - a.cumulativeSharePct);
    }
    return rows.sort((a, b) => b.shareOfLmicPct - a.shareOfLmicPct);
  }, [ladderMetric]);

  const dependenceBars = useMemo(() => {
    return [...DEPENDENCE_SHARES].sort(
      (a, b) => b.remittanceGdpPct - a.remittanceGdpPct,
    );
  }, []);

  const pensionBars = useMemo(() => {
    return [...PENSION_BURDENS].sort(
      (a, b) => b.pensionGdpPct - a.pensionGdpPct,
    );
  }, []);

  const curve = useMemo(() => {
    if (curveLens === "corridors") return CORRIDOR_CONCENTRATION_CURVE;
    if (curveLens === "dependence") return DEPENDENCE_CONCENTRATION_CURVE;
    return RECIPIENT_CONCENTRATION_CURVE;
  }, [curveLens]);

  const recipientPie = useMemo(
    () =>
      recipients.slice(0, 5).map((r) => ({
        name: r.short,
        value: r.sharePct,
        fill: r.fill,
        amountBn: r.amountBn,
        label: r.label,
      })),
    [recipients],
  );

  const lensScatter = useMemo(
    () =>
      LENS_COMPARE.map((l) => ({
        ...l,
        x: l.top1Pct,
        y: l.top3Pct,
        z: Math.max(12, l.top3Pct / 2),
      })),
    [],
  );

  const dualScatter = useMemo(
    () =>
      DUAL_LEDGER.map((d) => ({
        ...d,
        x: d.oldAgeDependency,
        y: d.remittanceGdpPct,
        z: Math.max(8, Math.sqrt(d.amountBn) * 4),
      })),
    [],
  );

  const barValue = (row: {
    sharePct?: number;
    shareOfLmicPct?: number;
    amountBn?: number;
    cumulativeSharePct?: number;
  }) => {
    if (ladderMetric === "amountBn") return row.amountBn ?? 0;
    if (ladderMetric === "cumulative") return row.cumulativeSharePct ?? 0;
    return row.sharePct ?? row.shareOfLmicPct ?? 0;
  };

  const barLabel =
    ladderMetric === "amountBn"
      ? "$ billions"
      : ladderMetric === "cumulative"
        ? "Cumulative %"
        : "Share %";

  return (
    <div
      className="space-y-6"
      data-viz="demographic-cash-flows-concentration-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
          Demographic cash flows — concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          India takes ~{HEADLINE.top1RecipientSharePct}% of LMIC remittance
          dollars; top three clear ~{HEADLINE.top3RecipientSharePct}%
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Four market-share lenses on the same dual ledger: recipient dollars
          inside the ${HEADLINE.lmicUniverseBn}B Brief 41 perimeter, bilateral
          corridor pipes, GDP-dependence extremes, and host public-pension
          burdens. Age and migration concentrate money differently depending on
          which top you measure.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/10 px-3 py-3 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Top-1 recipient
            </p>
            <p className="mt-1 text-xl font-bold text-amber-300">
              {fmtPct(HEADLINE.top1RecipientSharePct)}
            </p>
            <p className="text-xs text-slate-400">
              {HEADLINE.top1RecipientLabel} · {fmtBn(HEADLINE.top1RecipientBn)}
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-3 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Top-3 recipients
            </p>
            <p className="mt-1 text-xl font-bold text-sky-300">
              {fmtPct(HEADLINE.top3RecipientSharePct)}
            </p>
            <p className="text-xs text-slate-400">
              {HEADLINE.top3RecipientLabel}
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-3 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Top-1 corridor
            </p>
            <p className="mt-1 text-xl font-bold text-teal-300">
              {fmtPct(HEADLINE.top1CorridorSharePct)}
            </p>
            <p className="text-xs text-slate-400">
              {HEADLINE.top1CorridorLabel} · {fmtBn(HEADLINE.top1CorridorBn)}
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-3 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Top-1 GDP dependence
            </p>
            <p className="mt-1 text-xl font-bold text-rose-300">
              {fmtPct(HEADLINE.top1DependenceGdpPct)}
            </p>
            <p className="text-xs text-slate-400">
              {HEADLINE.top1DependenceLabel} of GDP
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "recipients", label: "Recipient ladder" },
            { id: "corridors", label: "Corridor pipes" },
            { id: "dependence", label: "GDP dependence" },
            { id: "pensions", label: "Host pensions" },
          ]}
        />
        {(view === "recipients" || view === "corridors") && (
          <ToggleGroup
            label="Metric"
            value={ladderMetric}
            onChange={setLadderMetric}
            options={[
              { id: "sharePct", label: "Share %" },
              { id: "amountBn", label: "$ billions" },
              { id: "cumulative", label: "Cumulative" },
            ]}
          />
        )}
      </div>

      {view === "recipients" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="LMIC recipient dollar ladder"
            subtitle={`Named recipients vs $${HEADLINE.lmicUniverseBn}B Brief 41 universe — ${barLabel}`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={recipientBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={56}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      ladderMetric === "amountBn"
                        ? fmtBn(Number(v), 0)
                        : fmtPct(Number(v), 1)
                    }
                  />
                  <Bar dataKey={(r) => barValue(r)} radius={[0, 4, 4, 0]}>
                    {recipientBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Top-5 recipient pie"
            subtitle="India alone is nearly one-fifth of LMIC remittance dollars"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={recipientPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {recipientPie.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, p) => [
                      `${fmtPct(Number(v), 1)} · ${fmtBn(p.payload.amountBn)}`,
                      p.payload.label,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
              {recipientPie.map((d) => (
                <span key={d.name} className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: d.fill }}
                  />
                  {d.name} {fmtPct(d.value, 1)}
                </span>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {view === "corridors" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Bilateral corridor ladder"
            subtitle={`Share of $${HEADLINE.lmicUniverseBn}B perimeter — ${barLabel}`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={corridorBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={110}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      ladderMetric === "amountBn"
                        ? fmtBn(Number(v), 1)
                        : fmtPct(Number(v), 1)
                    }
                  />
                  <Bar
                    dataKey={(r) =>
                      ladderMetric === "amountBn"
                        ? r.amountBn
                        : ladderMetric === "cumulative"
                          ? r.cumulativeSharePct
                          : r.shareOfLmicPct
                    }
                    radius={[0, 4, 4, 0]}
                  >
                    {corridorBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Remittances vs FDI vs ODA"
            subtitle="Private migrant transfers still dwarf official finance into LMICs"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={FLOW_COMPARE}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => fmtBn(Number(v), 0)} />
                  <Bar dataKey="bn" radius={[4, 4, 0, 0]}>
                    {FLOW_COMPARE.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "dependence" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="GDP-dependence ladder"
            subtitle="Small absolute dollars can still own a country's external accounts"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dependenceBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    unit="%"
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={40}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, p) => [
                      `${fmtPct(Number(v), 0)} of GDP · ${fmtBn(p.payload.amountBn, 1)}`,
                      p.payload.label,
                    ]}
                  />
                  <Bar dataKey="remittanceGdpPct" radius={[0, 4, 4, 0]}>
                    {dependenceBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Dual ledger: age × remittance GDP%"
            subtitle="Bubble size ≈ absolute remittance dollars — hosts and origins separate"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Old-age dependency"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Old-age dependency",
                      position: "insideBottom",
                      offset: -2,
                      style: { fontSize: 11, fill: SLATE },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Remittance % GDP"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Remit % GDP",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 11, fill: SLATE },
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[40, 400]} />
                  <Tooltip
                    formatter={(_v, _n, p) => [
                      `${p.payload.label}: dep ${p.payload.oldAgeDependency}, remit ${fmtPct(p.payload.remittanceGdpPct, 1)}, ${fmtBn(p.payload.amountBn, 1)}`,
                      "",
                    ]}
                  />
                  <Scatter data={dualScatter}>
                    {dualScatter.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "pensions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Host public-pension burden ladder"
            subtitle={`Italy ${fmtPct(HEADLINE.top1PensionGdpPct, 1)} of GDP vs OECD avg ~${fmtPct(HEADLINE.oecdPensionAvgGdpPct, 1)}`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pensionBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={40}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, p) => [
                      `${fmtPct(Number(v), 1)} of GDP · dep ${p.payload.oldAgeDependency}`,
                      p.payload.label,
                    ]}
                  />
                  <Bar dataKey="pensionGdpPct" radius={[0, 4, 4, 0]}>
                    {pensionBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Cross-lens top-1 vs top-3"
            subtitle="Same theme, four different tops — dependence is the extreme outlier"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Top-1 %"
                    domain={[0, 50]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Top-1 share / GDP%",
                      position: "insideBottom",
                      offset: -2,
                      style: { fontSize: 11, fill: SLATE },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Top-3 %"
                    domain={[0, 50]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Top-3 / avg GDP%",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 11, fill: SLATE },
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 320]} />
                  <Tooltip
                    formatter={(_v, _n, p) => [
                      `${p.payload.label}: top-1 ${fmtPct(p.payload.top1Pct, 1)}, top-3 ${fmtPct(p.payload.top3Pct, 1)}`,
                      p.payload.universeLabel,
                    ]}
                  />
                  <Scatter data={lensScatter}>
                    {lensScatter.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
              {LENS_COMPARE.map((d) => (
                <span key={d.id} className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: d.fill }}
                  />
                  {d.short}
                </span>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      <ChartCard
        title="Cumulative share vs equal split"
        subtitle="Lorenz-style concentration curve — toggle lens and equal-share reference"
      >
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <ToggleGroup
            label="Curve lens"
            value={curveLens}
            onChange={setCurveLens}
            options={[
              { id: "recipients", label: "Recipients" },
              { id: "corridors", label: "Corridors" },
              { id: "dependence", label: "Dependence" },
            ]}
          />
          <button
            type="button"
            onClick={() => setShowEqualLine((v) => !v)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              showEqualLine
                ? "bg-slate-900 text-white"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Equal split
          </button>
        </div>
        <div className="h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={curve}
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="rank"
                tick={{ fontSize: 11 }}
                label={{
                  value: "Rank",
                  position: "insideBottom",
                  offset: -2,
                  style: { fontSize: 11, fill: SLATE },
                }}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                domain={[0, 100]}
                label={{
                  value: "Cumulative %",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 11, fill: SLATE },
                }}
              />
              <Tooltip
                formatter={(v, name) => [
                  fmtPct(Number(v), 1),
                  name === "cumulativeSharePct"
                    ? "Cumulative"
                    : "Equal split",
                ]}
                labelFormatter={(rank, payload) => {
                  const row = payload?.[0]?.payload;
                  return row?.label
                    ? `Rank ${rank}: ${row.label}`
                    : `Rank ${rank}`;
                }}
              />
              <Area
                type="monotone"
                dataKey="cumulativeSharePct"
                fill={
                  curveLens === "dependence"
                    ? ROSE
                    : curveLens === "corridors"
                      ? SKY
                      : AMBER
                }
                fillOpacity={0.15}
                stroke="none"
              />
              <Line
                type="monotone"
                dataKey="cumulativeSharePct"
                stroke={
                  curveLens === "dependence"
                    ? ROSE
                    : curveLens === "corridors"
                      ? SKY
                      : AMBER
                }
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              {showEqualLine && (
                <Line
                  type="monotone"
                  dataKey="equalSharePct"
                  stroke={SLATE}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <p className="sr-only">
        Accent markers: {AMBER} {SKY} {ROSE} {TEAL} {VIOLET}
      </p>
    </div>
  );
}
