"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
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
  CORRIDOR_VINTAGE_DELTA,
  DEPENDENCE_CONCENTRATION_CURVE,
  DEPENDENCE_SHARES,
  DUAL_LEDGER,
  DUAL_PULSE_SERIES,
  HEADLINE,
  LENS_COMPARE,
  MEXICO_SHARE_PATH,
  NOMINAL_VS_REAL,
  PENSION_BURDENS,
  SOURCE_NOTE,
  TOP3_COMPOSITION,
  VINTAGE_DELTA_ROWS,
  type VintageId,
  fmtBn,
  fmtPct,
  namedRecipients,
  recipientCurve,
} from "@/data/demographic-cash-flows-concentration-202608-data";

// viz-types: triple vintage bars, Lorenz area+line, top-3 donut, dual-pulse bars, Mexico share path, corridor delta, dual-ledger scatter | layout: default

type ViewId = "delta" | "recipients" | "corridors" | "dependence";
type CurveLens = "recipients" | "corridors" | "dependence";

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

export function DemographicCashFlowsConcentration202608Dashboard() {
  const [view, setView] = useState<ViewId>("delta");
  const [vintage, setVintage] = useState<VintageId>("t12m");
  const [curveLens, setCurveLens] = useState<CurveLens>("recipients");
  const [showEqualLine, setShowEqualLine] = useState(true);

  const recipients = useMemo(() => namedRecipients(vintage), [vintage]);

  const recipientBars = useMemo(
    () => [...recipients].sort((a, b) => b.sharePct - a.sharePct),
    [recipients],
  );

  const curve = useMemo(() => {
    if (curveLens === "corridors") return CORRIDOR_CONCENTRATION_CURVE;
    if (curveLens === "dependence") return DEPENDENCE_CONCENTRATION_CURVE;
    return recipientCurve(vintage);
  }, [curveLens, vintage]);

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

  const dependenceBars = useMemo(
    () =>
      [...DEPENDENCE_SHARES].sort(
        (a, b) => b.remittanceGdpPct - a.remittanceGdpPct,
      ),
    [],
  );

  const pensionBars = useMemo(
    () =>
      [...PENSION_BURDENS].sort((a, b) => b.pensionGdpPct - a.pensionGdpPct),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="demographic-cash-flows-concentration-202608"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-300">
          Demographic cash flows — Aug 202608 concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          T12M soft print lifts Mexico to ~9.3% of LMIC dollars — top-3 holds
          ~35%, while real purchasing power falls 8.3%
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Aug vintage on the concentration question: India stays ~19% top-1 of
          the ${HEADLINE.lmicUniverseBn}B LMIC perimeter; Banxico’s T12M Mexico
          print ({fmtBn(HEADLINE.mexicoT12mBn, 1)}) nudges top-2 from FY{" "}
          {fmtPct(HEADLINE.mexicoBanxicoSharePct, 1)} to{" "}
          {fmtPct(HEADLINE.mexicoT12mSharePct, 1)}; BBVA’s real June hit (
          {HEADLINE.mexicoRealJuneYoyPct}%) splits nominal share from household
          purchasing power. Toggle vintages and lenses below.
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
              Top-3 (T12M MX)
            </p>
            <p className="mt-1 text-xl font-bold text-sky-300">
              {fmtPct(HEADLINE.top3RecipientShareT12mPct, 1)}
            </p>
            <p className="text-xs text-slate-400">
              vs ~{HEADLINE.top3RecipientShareBrief41Pct}% Brief 41
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-3 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Mexico T12M share
            </p>
            <p className="mt-1 text-xl font-bold text-rose-300">
              {fmtPct(HEADLINE.mexicoT12mSharePct, 1)}
            </p>
            <p className="text-xs text-slate-400">
              {fmtPct(HEADLINE.mexicoBanxicoSharePct, 1)} FY →{" "}
              {fmtPct(HEADLINE.mexicoT12mSharePct, 1)} T12M
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-3 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Real June YoY
            </p>
            <p className="mt-1 text-xl font-bold text-teal-300">
              {HEADLINE.mexicoRealJuneYoyPct}%
            </p>
            <p className="text-xs text-slate-400">
              Implied share ~{fmtPct(HEADLINE.mexicoRealImpliedSharePct, 1)}
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
            { id: "delta", label: "Vintage delta" },
            { id: "recipients", label: "Recipient ladder" },
            { id: "corridors", label: "Corridor pipes" },
            { id: "dependence", label: "Dependence + pensions" },
          ]}
        />
        {(view === "recipients" || view === "delta") && (
          <ToggleGroup
            label="Vintage"
            value={vintage}
            onChange={setVintage}
            options={[
              { id: "t12m", label: "T12M Jun’26" },
              { id: "banxico", label: "Banxico FY" },
              { id: "brief41", label: "Brief 41" },
            ]}
          />
        )}
      </div>

      {view === "delta" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Brief 41 → Banxico FY → T12M"
            subtitle="Top-k recipient shares and US→MX perimeter share — triple vintage bars"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={VINTAGE_DELTA_ROWS}
                  margin={{ top: 8, right: 16, left: 8, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    unit="%"
                    domain={[0, 50]}
                  />
                  <Tooltip
                    formatter={(v) => fmtPct(Number(v), 1)}
                    labelFormatter={(l) => String(l)}
                  />
                  <Legend />
                  <Bar
                    dataKey="brief41Pct"
                    name="Brief 41"
                    fill="#64748b"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="banxicoPct"
                    name="Banxico FY"
                    fill="#0ea5e9"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="t12mPct"
                    name="T12M Jun’26"
                    fill="#38bdf8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Top-3 vs residual (T12M Mexico)"
            subtitle="India · Mexico · China clear ~35% of LMIC remittance dollars"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TOP3_COMPOSITION}
                    dataKey="sharePct"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {TOP3_COMPOSITION.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, p) => [
                      fmtPct(Number(v), 1),
                      p.payload.label,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
              {TOP3_COMPOSITION.map((d) => (
                <span key={d.id} className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: d.fill }}
                  />
                  {d.label} {fmtPct(d.sharePct, 1)}
                </span>
              ))}
            </div>
          </ChartCard>

          <ChartCard
            title="Dual pulse: H1 rebound vs T12M soft vs real"
            subtitle="Same corridor, three growth meters — concentration pressure ≠ purchasing power"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={DUAL_PULSE_SERIES}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip
                    formatter={(v, _n, p) => [
                      `${Number(v).toFixed(1)}%`,
                      p.payload.note,
                    ]}
                  />
                  <Bar dataKey="valuePct" radius={[4, 4, 0, 0]}>
                    {DUAL_PULSE_SERIES.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Mexico share path across vintages"
            subtitle="Brief 41 → FY → H1 ann. → T12M → real-adj. illustrative"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={MEXICO_SHARE_PATH}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="vintage" tick={{ fontSize: 10 }} />
                  <YAxis
                    yAxisId="share"
                    tick={{ fontSize: 11 }}
                    unit="%"
                    domain={[7, 11]}
                  />
                  <YAxis
                    yAxisId="bn"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    domain={[50, 75]}
                  />
                  <Tooltip
                    formatter={(v, name) =>
                      String(name).includes("share")
                        ? [fmtPct(Number(v), 1), "Share"]
                        : [fmtBn(Number(v), 1), "Amount"]
                    }
                  />
                  <Bar
                    yAxisId="bn"
                    dataKey="amountBn"
                    name="Amount $B"
                    radius={[4, 4, 0, 0]}
                  >
                    {MEXICO_SHARE_PATH.map((r) => (
                      <Cell key={r.vintage} fill={r.fill} />
                    ))}
                  </Bar>
                  <Line
                    yAxisId="share"
                    type="monotone"
                    dataKey="sharePct"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#f59e0b" }}
                    name="Share %"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Nominal vs real Mexico share"
            subtitle="BBVA −8.3% real June hit applied illustratively to T12M dollars"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={NOMINAL_VS_REAL}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={130}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v, _n, p) => [
                      `${fmtPct(Number(v), 1)} · ${fmtBn(p.payload.amountBn, 1)}`,
                      p.payload.label,
                    ]}
                  />
                  <Bar dataKey="sharePct" radius={[0, 4, 4, 0]}>
                    {NOMINAL_VS_REAL.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Cross-lens top-1 vs top-3"
            subtitle="Recipient dollars sit mid-band; GDP dependence is the extreme outlier"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Top-1"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    domain={[0, 50]}
                    label={{
                      value: "Top-1 %",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Top-3"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    domain={[0, 50]}
                    label={{
                      value: "Top-3 %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      fmtPct(Number(v), 1),
                      name === "x" ? "Top-1" : name === "y" ? "Top-3" : name,
                    ]}
                    labelFormatter={(_l, payload) =>
                      payload?.[0]?.payload?.label ?? ""
                    }
                  />
                  <Scatter data={lensScatter}>
                    {lensScatter.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "recipients" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={
              vintage === "t12m"
                ? "T12M recipient ladder (Jun’26)"
                : vintage === "banxico"
                  ? "Banxico FY2025 recipient ladder"
                  : "Brief 41 recipient ladder"
            }
            subtitle={`Named recipients vs $${HEADLINE.lmicUniverseBn}B LMIC universe — share %`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={recipientBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={56}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, p) => [
                      `${fmtPct(Number(v), 1)} · ${fmtBn(p.payload.amountBn, 1)}`,
                      p.payload.label,
                    ]}
                  />
                  <Bar dataKey="sharePct" radius={[0, 4, 4, 0]}>
                    {recipientBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Cumulative concentration curve"
            subtitle="Toggle lens · equal-share line shows how far the ladder bends"
          >
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <ToggleGroup
                label="Curve"
                value={curveLens}
                onChange={setCurveLens}
                options={[
                  { id: "recipients", label: "Recipients" },
                  { id: "corridors", label: "Corridors" },
                  { id: "dependence", label: "Dependence" },
                ]}
              />
              <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={showEqualLine}
                  onChange={(e) => setShowEqualLine(e.target.checked)}
                />
                Equal-share line
              </label>
            </div>
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={curve}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                  <Area
                    type="monotone"
                    dataKey="cumulativeSharePct"
                    fill="#0ea5e933"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    name="Cumulative"
                  />
                  {showEqualLine && (
                    <Line
                      type="monotone"
                      dataKey="equalSharePct"
                      stroke="#94a3b8"
                      strokeDasharray="4 4"
                      dot={false}
                      name="Equal share"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "corridors" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Bilateral corridor ladder"
            subtitle={`Share of $${HEADLINE.lmicUniverseBn}B perimeter (matrix dollars)`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={CORRIDOR_SHARES}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={110}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v, _n, p) => [
                      `${fmtPct(Number(v), 1)} · ${fmtBn(p.payload.amountBn, 1)}`,
                      p.payload.label,
                    ]}
                  />
                  <Bar dataKey="shareOfLmicPct" radius={[0, 4, 4, 0]}>
                    {CORRIDOR_SHARES.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="US→Mexico pipe: matrix → FY → T12M → real"
            subtitle="Disclosed corridor print understates Banxico Mexico-total share; real hit qualifies purchasing power"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={CORRIDOR_VINTAGE_DELTA}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v, name, p) =>
                      name === "amountBn" || String(name).includes("amount")
                        ? [
                            fmtBn(Number(v), 1),
                            `Share ${fmtPct(p.payload.sharePct, 1)}`,
                          ]
                        : [fmtBn(Number(v), 1), "Amount"]
                    }
                  />
                  <Bar dataKey="amountBn" radius={[4, 4, 0, 0]}>
                    {CORRIDOR_VINTAGE_DELTA.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Matrix {fmtBn(HEADLINE.top1CorridorBn)} (
              {fmtPct(HEADLINE.top1CorridorSharePct)}) vs Banxico-implied{" "}
              {fmtBn(HEADLINE.top1CorridorBanxicoImpliedBn, 1)} (
              {fmtPct(HEADLINE.top1CorridorBanxicoImpliedSharePct)}) of the
              LMIC perimeter.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "dependence" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="GDP-dependence ladder"
            subtitle="Small dollars, extreme tops — Tajikistan ~45% of GDP"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dependenceBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={36}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, p) => [
                      `${fmtPct(Number(v), 1)} of GDP · ${fmtBn(p.payload.amountBn, 1)}`,
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
            title="Host public-pension burdens"
            subtitle={`Italy ${fmtPct(HEADLINE.top1PensionGdpPct, 1)} of GDP ≈ ${HEADLINE.italyVsOecdMultiple}× OECD avg`}
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
                    width={36}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, p) => [
                      `${fmtPct(Number(v), 1)} of GDP`,
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
            title="Dual ledger: age × remittance GDP share"
            subtitle="Aging hosts (low remittance %) vs remittance origins (high remittance %)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Old-age dep."
                    tick={{ fontSize: 11 }}
                    domain={[0, 60]}
                    label={{
                      value: "Old-age dependency",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Remit % GDP"
                    tick={{ fontSize: 11 }}
                    domain={[0, 50]}
                    label={{
                      value: "Remittance % GDP",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => {
                      if (name === "x") return [Number(v), "Old-age dep."];
                      if (name === "y") return [fmtPct(Number(v), 1), "Remit % GDP"];
                      return [v, name];
                    }}
                    labelFormatter={(_l, payload) =>
                      payload?.[0]?.payload?.label ?? ""
                    }
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

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
