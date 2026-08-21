"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
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
  COHORT_COMPARE,
  DIVERGENCE,
  DY_BANDS,
  FED_SA_PATH,
  HEADLINE,
  MATURITY_MIX,
  SOURCE_NOTE,
  SOURCES,
  STRESS_MAP,
  VINTAGE_METERS,
  divergenceSorted,
  fmtBn,
  fmtBp,
  fmtMn,
  fmtPct,
  meterDeltasSorted,
} from "@/data/bank-commercial-credit-update-202608-data";

// viz-types: signed Δ bars, delinq×SS divergence scatter, maturity mix bars, DY risk pie, Jul↔Aug cohort grouped bars, Fed dual-line, stress scatter | layout: canvas
// viz-plan: Aug meters; divergence scatter; maturity+DY; cohort compare; carried Fed SA; bank×CMBS map; panel + quadrant + book controls

type Panel = "meters" | "diverge" | "maturity" | "cohort" | "fed" | "map";
type Quadrant = "all" | "delinqUpSsDown" | "bothUp" | "ssUp";
type MapBook = "all" | "bank" | "cmbs";

const CRE = "#0ea5e9";
const CARDS = "#f59e0b";
const CI = "#a78bfa";
const COOL = "#14b8a6";
const HEAT = "#f43f5e";
const PRIOR = "#94a3b8";
const CMBS = "#e11d48";
const OFFICE = "#0369a1";
const RETAIL = "#c026d3";
const MF = "#38bdf8";
const LODGE = "#f97316";

const DY_COLORS = ["#0f766e", "#f59e0b", "#e11d48"];

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
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              on
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function fillForMeter(delta: number, unit: string) {
  if (unit === "bn" || unit === "mn") return delta > 0 ? HEAT : COOL;
  if (delta < -0.05) return COOL;
  if (delta > 0.05) return HEAT;
  return PRIOR;
}

function propColor(id: string) {
  if (id === "office") return OFFICE;
  if (id === "retail") return RETAIL;
  if (id === "multifamily") return MF;
  if (id === "lodging") return LODGE;
  if (id === "overall") return CMBS;
  return PRIOR;
}

export function BankCommercialCreditUpdate202608Dashboard() {
  const [panel, setPanel] = useState<Panel>("meters");
  const [quadrant, setQuadrant] = useState<Quadrant>("all");
  const [mapBook, setMapBook] = useState<MapBook>("all");

  const meterRows = useMemo(
    () =>
      meterDeltasSorted().map((m) => ({
        ...m,
        fill: fillForMeter(m.delta, m.unit),
      })),
    [],
  );

  const divergeRows = useMemo(() => {
    return divergenceSorted().filter((r) => {
      if (quadrant === "all") return true;
      if (quadrant === "delinqUpSsDown")
        return r.delinqMomBp > 0 && r.ssMomBp < 0;
      if (quadrant === "bothUp") return r.delinqMomBp > 0 && r.ssMomBp > 0;
      return r.ssMomBp > 0;
    });
  }, [quadrant]);

  const cohortRows = useMemo(
    () =>
      COHORT_COMPARE.map((r) => ({
        metric: r.metric,
        July: r.july,
        August: r.august,
      })),
    [],
  );

  const mapRows = useMemo(() => {
    return STRESS_MAP.filter(
      (r) => mapBook === "all" || r.book === mapBook,
    ).map((r) => ({
      ...r,
      chargeOffPlot: r.chargeOff ?? 0.05,
      isCmbs: r.book === "cmbs",
    }));
  }, [mapBook]);

  return (
    <div
      className="space-y-6"
      data-viz="bank-commercial-credit-update-202608"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-4 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-rose-300">
          Aug vintage · CMBS delinq up / special servicing down · hard maturities
        </p>
        <p className="mt-1 text-lg font-bold sm:text-xl">
          CMBS delinq {fmtPct(HEADLINE.cmbsDelinq)} (
          {fmtBp(HEADLINE.cmbsDelinqMomBp)}) · SS {fmtPct(HEADLINE.cmbsSs)} (
          {fmtBp(HEADLINE.cmbsSsMomBp)}) · Aug maturities{" "}
          {fmtBn(HEADLINE.augMaturityBn)}
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Maturity distress enters the headline rate while workouts cut SS ·{" "}
          {fmtBn(HEADLINE.dyBelow8Bn)} of August cohort below 8% debt yield ·
          bank Fed SA still {HEADLINE.fedSaAsOf}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={panel}
          onChange={setPanel}
          options={[
            { id: "meters", label: "Δ meters" },
            { id: "diverge", label: "Delinq × SS" },
            { id: "maturity", label: "Maturities" },
            { id: "cohort", label: "Jul → Aug" },
            { id: "fed", label: "Fed SA" },
            { id: "map", label: "Stress map" },
          ]}
        />
        {panel === "diverge" && (
          <ToggleGroup
            label="Quadrant"
            value={quadrant}
            onChange={setQuadrant}
            options={[
              { id: "all", label: "All" },
              { id: "delinqUpSsDown", label: "Delinq↑ SS↓" },
              { id: "bothUp", label: "Both ↑" },
              { id: "ssUp", label: "SS ↑" },
            ]}
          />
        )}
        {panel === "map" && (
          <ToggleGroup
            label="Book"
            value={mapBook}
            onChange={setMapBook}
            options={[
              { id: "all", label: "All" },
              { id: "bank", label: "Bank SA" },
              { id: "cmbs", label: "CMBS" },
            ]}
          />
        )}
      </div>

      {panel === "meters" && (
        <ChartCard
          title="What changed versus the Q3 update"
          subtitle="Delinquency and maturity risk rose; special servicing eased; Fed SA / SLOOS carried flat"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={meterRows}
                layout="vertical"
                margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  horizontal={false}
                />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={178}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value) => [
                    Number(value).toFixed(2),
                    "Δ vs prior / MoM",
                  ]}
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as
                      | (typeof meterRows)[0]
                      | undefined;
                    return row ? `${row.label}: ${row.deltaLabel}` : "";
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
                <span className="font-semibold text-slate-800">{m.label}:</span>{" "}
                {m.deltaLabel}{" "}
                <span className="text-slate-500">— {m.note}</span>
              </li>
            ))}
          </ul>
        </ChartCard>
      )}

      {panel === "diverge" && (
        <ChartCard
          title="Property-type divergence — delinquency MoM vs special servicing MoM"
          subtitle="Office & lodging: delinq up, SS down · retail: SS up on mall maturities · overall: +51 bp delinq / −11 bp SS"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: 8, right: 16, top: 12, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="delinqMomBp"
                  name="Delinq MoM"
                  unit=" bp"
                  tick={{ fontSize: 11 }}
                  domain={[-10, 60]}
                  label={{
                    value: "Delinquency MoM (bp)",
                    position: "insideBottom",
                    offset: -2,
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="ssMomBp"
                  name="SS MoM"
                  unit=" bp"
                  tick={{ fontSize: 11 }}
                  domain={[-60, 40]}
                  label={{
                    value: "SS MoM (bp)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <ZAxis range={[120, 120]} />
                <ReferenceLine x={0} stroke="#94a3b8" strokeDasharray="4 3" />
                <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 3" />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => [
                    `${Number(value)} bp`,
                    name === "delinqMomBp" ? "Delinq MoM" : "SS MoM",
                  ]}
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as
                      | (typeof divergeRows)[0]
                      | undefined;
                    return row
                      ? `${row.label}: delinq ${fmtPct(row.delinqPct)} · SS ${fmtPct(row.ssPct)}`
                      : "";
                  }}
                />
                <Scatter data={divergeRows}>
                  {divergeRows.map((r) => (
                    <Cell key={r.id} fill={propColor(r.id)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
            {DIVERGENCE.map((d) => (
              <li key={d.id} className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: propColor(d.id) }}
                />
                {d.short}: delinq {fmtBp(d.delinqMomBp)} · SS{" "}
                {fmtBp(d.ssMomBp)}
              </li>
            ))}
          </ul>
        </ChartCard>
      )}

      {panel === "maturity" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="August hard-maturity mix"
            subtitle={`$${HEADLINE.augMaturityBn}B cohort — office ${HEADLINE.officeMaturityShare}% · all current NP in office`}
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={MATURITY_MIX}
                  margin={{ left: 4, right: 12, top: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      fmtBn(Number(value)),
                      name === "balanceBn" ? "Maturity balance" : String(name),
                    ]}
                  />
                  <Bar dataKey="balanceBn" radius={[4, 4, 0, 0]}>
                    {MATURITY_MIX.map((r) => (
                      <Cell key={r.id} fill={propColor(r.id)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Debt-yield risk bands"
            subtitle={`${fmtBn(HEADLINE.dyBelow8Bn)} below 8% · ${fmtBn(HEADLINE.dyBelow6StillCurrentBn)} of <6% band still current`}
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DY_BANDS}
                    dataKey="balanceBn"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {DY_BANDS.map((b, i) => (
                      <Cell key={b.id} fill={DY_COLORS[i % DY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, _n, item) => {
                      const row = item?.payload as (typeof DY_BANDS)[0];
                      return [
                        `${fmtBn(Number(value))} (${row?.sharePct.toFixed(1)}%)`,
                        row?.label ?? "Band",
                      ];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-1 space-y-1 text-xs text-slate-600">
              {DY_BANDS.map((b, i) => (
                <li key={b.id} className="flex items-start gap-2">
                  <span
                    className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: DY_COLORS[i] }}
                  />
                  <span>
                    <span className="font-semibold text-slate-800">
                      {b.label}:
                    </span>{" "}
                    {fmtBn(b.balanceBn)} — {b.note}
                  </span>
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      {panel === "cohort" && (
        <ChartCard
          title="July → August hard-maturity cohort"
          subtitle={`NP ${fmtMn(HEADLINE.julNpMn)} → ${fmtMn(HEADLINE.augNpMn)} · cohort SS balance ${fmtBn(HEADLINE.julSsBalanceBn)} → ${fmtBn(HEADLINE.augSsBalanceBn)}`}
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cohortRows}
                margin={{ left: 4, right: 12, top: 8, bottom: 48 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="metric"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="July" fill={PRIOR} radius={[4, 4, 0, 0]} />
                <Bar dataKey="August" fill={HEAT} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "fed" && (
        <ChartCard
          title="Bank book still on 2026Q1 Fed SA — carried path"
          subtitle="No newer charge-off/delinquency SA vintage; cards 3.84%, CRE delinq 1.56%, CRE CO 0.17%"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={FED_SA_PATH}
                margin={{ left: 4, right: 12, top: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value, name) => [
                    fmtPct(Number(value)),
                    String(name),
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="creDelinq"
                  name="CRE delinq"
                  stroke={CRE}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="creChargeOff"
                  name="CRE charge-off"
                  stroke={CRE}
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="cardsChargeOff"
                  name="Cards charge-off"
                  stroke={CARDS}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="ciChargeOff"
                  name="C&I charge-off"
                  stroke={CI}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "map" && (
        <ChartCard
          title="Two ledgers — bank SA rates vs CMBS delinquency"
          subtitle="CMBS points sit far right on delinquency; bank CRE stays high-past-due / low-loss"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: 8, right: 16, top: 12, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="delinquency"
                  name="Delinquency"
                  unit="%"
                  tick={{ fontSize: 11 }}
                  domain={[0, 13]}
                />
                <YAxis
                  type="number"
                  dataKey="chargeOffPlot"
                  name="Charge-off"
                  tick={{ fontSize: 11 }}
                  domain={[-0.1, 4.2]}
                  tickFormatter={(v) => `${v}%`}
                />
                <ZAxis range={[90, 90]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name, item) => {
                    const row = item?.payload as (typeof mapRows)[0] | undefined;
                    if (row?.isCmbs && name === "chargeOffPlot")
                      return ["n/a (CMBS)", "Charge-off"];
                    if (name === "delinquency")
                      return [fmtPct(Number(value)), "Delinquency"];
                    return [fmtPct(Number(value)), "Charge-off"];
                  }}
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as
                      | (typeof mapRows)[0]
                      | undefined;
                    return row?.short ?? "";
                  }}
                />
                <Scatter data={mapRows} fill={CRE}>
                  {mapRows.map((r) => (
                    <Cell
                      key={r.short}
                      fill={
                        r.isCmbs
                          ? CMBS
                          : r.short.includes("Cards")
                            ? CARDS
                            : CRE
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-medium text-slate-700">Sources</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                className="text-sky-700 underline-offset-2 hover:underline"
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
