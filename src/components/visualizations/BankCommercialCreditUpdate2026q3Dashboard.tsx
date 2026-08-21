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
  CMBS_PROPERTIES,
  FED_SA_PATH,
  HEADLINE,
  SIZE_SPLIT,
  SLOOS_CRE_PATH,
  SOURCE_NOTE,
  SOURCES,
  STRESS_MAP,
  VINTAGE_METERS,
  cmbsDeltasSorted,
  fmtNet,
  fmtPct,
  fmtPp,
  meterDeltasSorted,
} from "@/data/bank-commercial-credit-update-2026q3-data";

// viz-types: signed Δ bars, SLOOS multi-line, CMBS prior→new dumbbell bars, Fed dual-line path, bank×CMBS scatter, size-split cards | layout: canvas
// viz-plan: Q3 meters; SLOOS CRE/C&I/cards path; CMBS dumbbell; carried Fed SA; stress map; size footnote; panel + series + book controls

type Panel = "meters" | "sloos" | "cmbs" | "fed" | "map" | "size";
type SloosFocus = "cre" | "ciCards" | "all";
type MapBook = "all" | "bank" | "cmbs";

const CRE = "#0ea5e9";
const NFNR = "#0284c7";
const MF = "#38bdf8";
const CLD = "#0369a1";
const CARDS = "#f59e0b";
const CI = "#a78bfa";
const COOL = "#14b8a6";
const HEAT = "#f43f5e";
const PRIOR = "#94a3b8";
const NEW = "#0f172a";
const CMBS = "#e11d48";

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

export function BankCommercialCreditUpdate2026q3Dashboard() {
  const [panel, setPanel] = useState<Panel>("meters");
  const [sloosFocus, setSloosFocus] = useState<SloosFocus>("cre");
  const [mapBook, setMapBook] = useState<MapBook>("all");

  const meterRows = useMemo(
    () =>
      meterDeltasSorted().map((m) => ({
        ...m,
        fill: m.delta < -1 ? COOL : m.delta > 0.2 ? HEAT : PRIOR,
      })),
    [],
  );

  const cmbsRows = useMemo(
    () =>
      cmbsDeltasSorted().map((d) => ({
        ...d,
        fill: d.delta > 0.4 ? HEAT : d.delta > 0 ? CARDS : COOL,
      })),
    [],
  );

  const mapRows = useMemo(() => {
    const rows = STRESS_MAP.filter((r) => mapBook === "all" || r.book === mapBook).map((r) => ({
      ...r,
      chargeOffPlot: r.chargeOff ?? 0.05,
      isCmbs: r.book === "cmbs",
    }));
    return rows;
  }, [mapBook]);

  return (
    <div className="space-y-6" data-viz="bank-commercial-credit-update-2026q3">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-4 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
          Q3 vintage · July SLOOS + Trepp CMBS vs Aug update
        </p>
        <p className="mt-1 text-lg font-bold sm:text-xl">
          SLOOS NFNR {fmtNet(HEADLINE.sloosCreNfnrNet)} (ease) · CMBS office{" "}
          {fmtPct(HEADLINE.cmbsOfficeNew)} ({fmtPp(HEADLINE.cmbsOfficeDelta)}) · Fed SA cards still{" "}
          {fmtPct(HEADLINE.cardsChargeOff)}
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Supply flipped toward CRE easing while securitized office/MF stress rose · bank Fed SA still{" "}
          {HEADLINE.fedSaAsOf}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={panel}
          onChange={setPanel}
          options={[
            { id: "meters", label: "Δ meters" },
            { id: "sloos", label: "SLOOS path" },
            { id: "cmbs", label: "CMBS" },
            { id: "fed", label: "Fed SA" },
            { id: "map", label: "Stress map" },
            { id: "size", label: "Size split" },
          ]}
        />
        {panel === "sloos" && (
          <ToggleGroup
            label="Series"
            value={sloosFocus}
            onChange={setSloosFocus}
            options={[
              { id: "cre", label: "CRE types" },
              { id: "ciCards", label: "C&I / cards" },
              { id: "all", label: "All" },
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
          title="What changed versus the August update"
          subtitle="Signed deltas — SLOOS CRE easing dominates; CMBS office/MF delinquency worsened"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={meterRows} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="label" width={168} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [fmtPp(Number(value)), "Δ vs prior post"]}
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as (typeof meterRows)[0] | undefined;
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
                <span className="font-semibold text-slate-800">{m.label}:</span> {m.deltaLabel}{" "}
                <span className="text-slate-500">— {m.note}</span>
              </li>
            ))}
          </ul>
        </ChartCard>
      )}

      {panel === "sloos" && (
        <ChartCard
          title="Credit supply — net % tightening (negative = easing)"
          subtitle="July 2026 survey (26Q3 in Fed chart data) covers 2026Q2 — NFNR −11.3, multifamily −5.7"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SLOOS_CRE_PATH} margin={{ left: 4, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}`} />
                <Tooltip formatter={(value, name) => [fmtNet(Number(value)), String(name)]} />
                <ReferenceLine y={0} stroke="#64748b" strokeDasharray="4 3" />
                {(sloosFocus === "cre" || sloosFocus === "all") && (
                  <>
                    <Line type="monotone" dataKey="nfnr" name="NFNR" stroke={NFNR} strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="mf" name="Multifamily" stroke={MF} strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="cld" name="CLD" stroke={CLD} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 2 }} />
                  </>
                )}
                {(sloosFocus === "ciCards" || sloosFocus === "all") && (
                  <>
                    <Line type="monotone" dataKey="ciLarge" name="C&I large/med" stroke={CI} strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="cards" name="Credit cards" stroke={CARDS} strokeWidth={2.5} dot={{ r: 3 }} />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "cmbs" && (
        <ChartCard
          title="CMBS delinquency — prior post vs Trepp July 2026"
          subtitle="Office +60 bp · multifamily +105 bp · overall +51 bp month-over-month to 7.86%"
        >
          <div className="mb-4 h-[280px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CMBS_PROPERTIES} margin={{ left: 4, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  formatter={(value, name) => [
                    fmtPct(Number(value)),
                    name === "prior" ? "Prior post" : "Trepp July",
                  ]}
                />
                <Bar dataKey="prior" fill={PRIOR} name="prior" radius={[4, 4, 0, 0]} />
                <Bar dataKey="neu" fill={CMBS} name="neu" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-[220px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cmbsRows} layout="vertical" margin={{ left: 8, right: 12, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => fmtPp(v)} />
                <YAxis type="category" dataKey="short" width={88} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [fmtPp(Number(value)), "Δ vs prior"]} />
                <ReferenceLine x={0} stroke="#64748b" />
                <Bar dataKey="delta" radius={[0, 4, 4, 0]}>
                  {cmbsRows.map((r) => (
                    <Cell key={r.id} fill={r.fill} />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "fed" && (
        <ChartCard
          title="Bank book still on 2026Q1 Fed SA — carried path"
          subtitle="No newer charge-off/delinquency SA vintage; cards cooled, CRE past-dues stuck, CRE charge-offs ticked QoQ"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FED_SA_PATH} margin={{ left: 4, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value, name) => [fmtPct(Number(value)), String(name)]} />
                <Line type="monotone" dataKey="creDelinq" name="CRE delinq" stroke={CRE} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="creChargeOff" name="CRE charge-off" stroke={CRE} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 2 }} />
                <Line type="monotone" dataKey="cardsChargeOff" name="Cards charge-off" stroke={CARDS} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="ciChargeOff" name="C&I charge-off" stroke={CI} strokeWidth={2} dot={{ r: 2 }} />
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
                  name="Charge-off (bank) / placeholder"
                  tick={{ fontSize: 11 }}
                  domain={[-0.1, 4.2]}
                  tickFormatter={(v) => `${v}%`}
                />
                <ZAxis range={[90, 90]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name, item) => {
                    const row = item?.payload as (typeof mapRows)[0] | undefined;
                    if (row?.isCmbs && name === "chargeOffPlot") return ["n/a (CMBS)", "Charge-off"];
                    if (name === "delinquency") return [fmtPct(Number(value)), "Delinquency"];
                    return [fmtPct(Number(value)), "Charge-off"];
                  }}
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as (typeof mapRows)[0] | undefined;
                    return row?.short ?? "";
                  }}
                />
                <Scatter data={mapRows} fill={CRE}>
                  {mapRows.map((r) => (
                    <Cell key={r.short} fill={r.isCmbs ? CMBS : r.short.includes("Cards") ? CARDS : CRE} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "size" && (
        <ChartCard
          title="Who eased? Large banks — not the whole panel"
          subtitle="July SLOOS footnote: large (≥$100B) eased all CRE types; other banks flat on MF/CLD; foreign banks tightened"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {SIZE_SPLIT.map((s) => (
              <div
                key={s.id}
                className={`rounded-lg border px-4 py-3 ${
                  s.direction === "ease"
                    ? "border-teal-200 bg-teal-50"
                    : s.direction === "tighten"
                      ? "border-rose-200 bg-rose-50"
                      : "border-slate-200 bg-slate-50"
                }`}
              >
                <p className="text-sm font-bold text-slate-900">{s.label}</p>
                <p className="mt-1 text-xs text-slate-600">{s.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 h-[260px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { label: "NFNR", net: HEADLINE.sloosCreNfnrNet },
                  { label: "Multifamily", net: HEADLINE.sloosCreMfNet },
                  { label: "CLD", net: HEADLINE.sloosCreCldNet },
                  { label: "C&I lg/med", net: HEADLINE.sloosCiLargeNet },
                  { label: "Cards", net: HEADLINE.sloosCardsTightenNet },
                ]}
                margin={{ left: 4, right: 12, top: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [fmtNet(Number(value)), "Net % tighten"]} />
                <ReferenceLine y={0} stroke="#64748b" />
                <Bar dataKey="net" radius={[4, 4, 0, 0]}>
                  {[
                    HEADLINE.sloosCreNfnrNet,
                    HEADLINE.sloosCreMfNet,
                    HEADLINE.sloosCreCldNet,
                    HEADLINE.sloosCiLargeNet,
                    HEADLINE.sloosCardsTightenNet,
                  ].map((v, i) => (
                    <Cell key={i} fill={v < -2 ? COOL : v > 2 ? HEAT : PRIOR} />
                  ))}
                </Bar>
              </BarChart>
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
      </div>
    </div>
  );
}
