"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
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
  CATEGORY_VINTAGE,
  CHARGEOFF_DUMBBELL,
  CRE_MULTIPLE_PATH,
  HEADLINE,
  LOAN_BOOK_LATEST,
  QUARTERLY_PATH,
  SLOOS_PATH,
  SOURCE_NOTE,
  SOURCES,
  VINTAGE_METERS,
  categoryDeltasSorted,
  fmtPct,
  fmtPp,
  meterDeltasSorted,
} from "@/data/bank-commercial-credit-update-2026-data";

// viz-types: YoY Δ bars, charge-off dumbbell, CRE dual-line path, multiple area-line, stress scatter, SLOOS composed | layout: canvas
// viz-plan: Δ meters; prior→new dumbbell; CRE/cards path; multiple; delinq×charge scatter; SLOOS; panel + metric + window controls

type Panel = "meters" | "dumbbell" | "path" | "multiple" | "map" | "sloos";
type DeltaMode = "yoy" | "qoq";
type PathFocus = "cre" | "cards" | "ci" | "all";

const CRE = "#0ea5e9";
const CARDS = "#f59e0b";
const CI = "#a78bfa";
const COOL = "#14b8a6";
const HEAT = "#f43f5e";
const PRIOR = "#94a3b8";
const NEW = "#0f172a";
const TIGHTEN = "#0f766e";

const CAT_COLORS: Record<string, string> = {
  Cards: CARDS,
  "Other cons.": "#fb7185",
  Resi: "#64748b",
  CRE,
  "C&I": CI,
  Leases: "#94a3b8",
  Ag: "#84cc16",
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

export function BankCommercialCreditUpdateDashboard() {
  const [panel, setPanel] = useState<Panel>("meters");
  const [deltaMode, setDeltaMode] = useState<DeltaMode>("yoy");
  const [pathFocus, setPathFocus] = useState<PathFocus>("all");

  const meterRows = useMemo(() => {
    return meterDeltasSorted(deltaMode).map((m) => ({
      ...m,
      fill: m.delta < -0.02 ? COOL : m.delta > 0.02 ? HEAT : PRIOR,
    }));
  }, [deltaMode]);

  const categoryDeltaRows = useMemo(
    () => categoryDeltasSorted("chargeOff", deltaMode),
    [deltaMode],
  );

  const dumbbellRows = useMemo(
    () =>
      CHARGEOFF_DUMBBELL.map((d) => ({
        ...d,
        fill: d.delta < 0 ? COOL : d.delta > 0 ? HEAT : PRIOR,
      })),
    [],
  );

  const pathData = useMemo(() => QUARTERLY_PATH, []);

  return (
    <div className="space-y-6" data-viz="bank-commercial-credit-update-2026">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-4 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
          Vintage update · YoY vs research map
        </p>
        <p className="mt-1 text-lg font-bold sm:text-xl">
          Card charge-offs {fmtPct(HEADLINE.cardsChargeOffNew)} ({fmtPp(HEADLINE.cardsChargeOffYoyDelta)}) ·
          CRE delinq {fmtPct(HEADLINE.creDelinqNew)} ({fmtPp(HEADLINE.creDelinqYoyDelta)}) · CRE charge-offs{" "}
          {fmtPct(HEADLINE.creChargeOffNew)} (QoQ {fmtPp(HEADLINE.creChargeOffQoqDelta)})
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Fed SA {HEADLINE.newAsOf} · {HEADLINE.yoyAsOf} · CRE multiple still ~{HEADLINE.creDelinqToChargeMultiple}×
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={panel}
          onChange={setPanel}
          options={[
            { id: "meters", label: "Δ meters" },
            { id: "dumbbell", label: "Charge-offs" },
            { id: "path", label: "CRE path" },
            { id: "multiple", label: "Multiple" },
            { id: "map", label: "Stress map" },
            { id: "sloos", label: "SLOOS" },
          ]}
        />
        {(panel === "meters" || panel === "dumbbell") && (
          <ToggleGroup
            label="Delta"
            value={deltaMode}
            onChange={setDeltaMode}
            options={[
              { id: "yoy", label: "YoY" },
              { id: "qoq", label: "QoQ" },
            ]}
          />
        )}
        {panel === "path" && (
          <ToggleGroup
            label="Series"
            value={pathFocus}
            onChange={setPathFocus}
            options={[
              { id: "all", label: "All" },
              { id: "cre", label: "CRE" },
              { id: "cards", label: "Cards" },
              { id: "ci", label: "C&I" },
            ]}
          />
        )}
      </div>

      {panel === "meters" && (
        <ChartCard
          title={deltaMode === "yoy" ? "What changed year over year" : "What changed quarter over quarter"}
          subtitle={
            deltaMode === "yoy"
              ? "Signed pp deltas — card charge-offs are the loudest cooling print"
              : "QoQ lens — CRE charge-offs ticked up even as card losses kept falling"
          }
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={meterRows} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => String(v)} />
                <YAxis type="category" dataKey="label" width={148} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [fmtPp(Number(value)), deltaMode === "yoy" ? "YoY Δ" : "QoQ Δ"]}
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as (typeof meterRows)[0] | undefined;
                    return row ? `${row.label}: ${row.priorYoy}% → ${row.neu}%` : "";
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
                <span className="font-semibold text-slate-800">{m.label}:</span> {m.priorYoy}% → {m.neu}%{" "}
                <span className="text-slate-500">({m.deltaLabel})</span>
              </li>
            ))}
          </ul>
        </ChartCard>
      )}

      {panel === "dumbbell" && (
        <ChartCard
          title="Charge-off levels — year-ago vs 2026Q1"
          subtitle="Prior = 2025Q1 · New = 2026Q1 (toggle Δ bars for YoY/QoQ category moves)"
        >
          <div className="mb-4 h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dumbbellRows} margin={{ left: 4, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  formatter={(value, name) => [
                    fmtPct(Number(value)),
                    name === "prior" ? "2025Q1" : "2026Q1",
                  ]}
                />
                <Bar dataKey="prior" fill={PRIOR} name="prior" radius={[4, 4, 0, 0]} />
                <Bar dataKey="neu" fill={NEW} name="neu" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-[220px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryDeltaRows} layout="vertical" margin={{ left: 8, right: 12, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="label" width={88} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [fmtPp(Number(value)), "Δ"]} />
                <ReferenceLine x={0} stroke="#64748b" />
                <Bar dataKey="delta" radius={[0, 4, 4, 0]}>
                  {categoryDeltaRows.map((r) => (
                    <Cell
                      key={r.id}
                      fill={r.delta < -0.02 ? COOL : r.delta > 0.02 ? HEAT : PRIOR}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "path" && (
        <ChartCard
          title="CRE vs cards — delinquency and charge-off path"
          subtitle="Sticky CRE past-dues vs cooling card losses into 2026Q1"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pathData} margin={{ left: 4, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value, name) => [fmtPct(Number(value)), String(name)]} />
                {(pathFocus === "all" || pathFocus === "cre") && (
                  <>
                    <Line type="monotone" dataKey="creDelinq" name="CRE delinq" stroke={CRE} strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="creChargeOff" name="CRE charge-off" stroke={CRE} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 2 }} />
                  </>
                )}
                {(pathFocus === "all" || pathFocus === "cards") && (
                  <>
                    <Line type="monotone" dataKey="cardsDelinq" name="Cards delinq" stroke={CARDS} strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="cardsChargeOff" name="Cards charge-off" stroke={CARDS} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 2 }} />
                  </>
                )}
                {(pathFocus === "all" || pathFocus === "ci") && (
                  <Line type="monotone" dataKey="ciChargeOff" name="C&I charge-off" stroke={CI} strokeWidth={2} dot={{ r: 2 }} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "multiple" && (
        <ChartCard
          title="CRE delinquency ÷ charge-off multiple"
          subtitle="Past-due stock still ~9× annualized CRE losses — stress on the PDNA line"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={CRE_MULTIPLE_PATH} margin={{ left: 4, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}×`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "multiple") return [`${Number(value)}×`, "Multiple"];
                    return [fmtPct(Number(value)), String(name)];
                  }}
                />
                <Bar yAxisId="left" dataKey="multiple" fill="#bae6fd" name="multiple" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="creDelinq" name="CRE delinq" stroke={CRE} strokeWidth={2.5} />
                <Line yAxisId="right" type="monotone" dataKey="creChargeOff" name="CRE charge-off" stroke={HEAT} strokeWidth={2} strokeDasharray="4 3" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "map" && (
        <ChartCard
          title="2026Q1 stress map — delinquency × charge-off"
          subtitle="Cards still own realized losses; CRE sits high-past-due / low-loss"
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
                  domain={[0.8, 3.2]}
                />
                <YAxis
                  type="number"
                  dataKey="chargeOff"
                  name="Charge-off"
                  unit="%"
                  tick={{ fontSize: 11 }}
                  domain={[-0.1, 4.2]}
                />
                <ZAxis range={[80, 80]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => [fmtPct(Number(value)), String(name)]}
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as (typeof LOAN_BOOK_LATEST)[number] | undefined;
                    return row?.short ?? "";
                  }}
                />
                <Scatter data={[...LOAN_BOOK_LATEST]} fill={CRE}>
                  {LOAN_BOOK_LATEST.map((r) => (
                    <Cell key={r.short} fill={CAT_COLORS[r.short] ?? PRIOR} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
            {LOAN_BOOK_LATEST.map((r) => (
              <li key={r.short} className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: CAT_COLORS[r.short] ?? PRIOR }}
                />
                {r.short}
              </li>
            ))}
          </ul>
        </ChartCard>
      )}

      {panel === "sloos" && (
        <ChartCard
          title="Credit supply — net % of banks tightening"
          subtitle="CRE standards still firmer than C&I into early 2026"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={SLOOS_PATH} margin={{ left: 4, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value, name) => [`${Number(value)}%`, String(name)]} />
                <ReferenceLine y={0} stroke="#64748b" />
                <Bar dataKey="cre" name="CRE tighten" fill={TIGHTEN} radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="ci" name="C&I tighten" stroke={CI} strokeWidth={2.5} dot={{ r: 3 }} />
              </ComposedChart>
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
              <a href={s.url} className="text-sky-700 underline-offset-2 hover:underline">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-slate-500">
          Category table rows: {CATEGORY_VINTAGE.length} · Latest CRE multiple ≈{" "}
          {HEADLINE.creDelinqToChargeMultiple}×
        </p>
      </div>
    </div>
  );
}
