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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  BODY_FUEL_MIX_2023_24,
  BODY_STYLES,
  CYCLE_FUEL,
  CSB_AWARDS,
  FUEL_META,
  HEADLINE,
  OEM_VS_CSB,
  SOURCE_NOTE,
  VIZ_MARKERS,
  type CycleId,
  type FuelId,
} from "@/data/diesel-share-of-new-school-bus-deliveries-2026-data";

// viz-types: stacked fuel-mix bars, diesel-share composed area+line,
// body-style horizontal stacked bars, OEM-vs-CSB scatter, CSB award bars
// | layout: default
// smoke-marker: Diesel share of new deliveries

type ViewId = "mix" | "diesel" | "bodies" | "csb" | "scatter";
type CycleFilter = "all" | CycleId;
type FocusFuel = "all" | "diesel" | "electric" | "propane";

const SLUG = "diesel-share-of-new-school-bus-deliveries-2026";
const INK = "#0f172a";
const MUTED = "#64748b";
const DIESEL = FUEL_META.diesel.color;
const EV = FUEL_META.electric.color;
const LPG = FUEL_META.propane.color;
const GAS = FUEL_META.gasoline.color;

const VIEWS: { id: ViewId; label: string; marker: string }[] = [
  { id: "mix", label: "Fuel mix", marker: VIZ_MARKERS[0] },
  { id: "diesel", label: "Diesel share", marker: VIZ_MARKERS[1] },
  { id: "bodies", label: "By body type", marker: VIZ_MARKERS[2] },
  { id: "csb", label: "CSB awards", marker: VIZ_MARKERS[3] },
  { id: "scatter", label: "OEM vs CSB", marker: "OEM EV vs diesel-share scatter" },
];

const FUELS: FuelId[] = ["diesel", "gasoline", "electric", "propane", "cng"];

function fmtUnits(n: number) {
  return n.toLocaleString("en-US");
}

function fmtPct(n: number, digits = 1) {
  return `${n.toFixed(digits)}%`;
}

export function DieselShareOfNewSchoolBusDeliveries2026Dashboard() {
  const [view, setView] = useState<ViewId>("mix");
  const [cycleFilter, setCycleFilter] = useState<CycleFilter>("all");
  const [focusFuel, setFocusFuel] = useState<FocusFuel>("all");

  const cycles = useMemo(() => {
    if (cycleFilter === "all") return CYCLE_FUEL;
    return CYCLE_FUEL.filter((c) => c.cycle === cycleFilter);
  }, [cycleFilter]);

  const stackData = useMemo(
    () =>
      cycles.map((c) => ({
        cycle: c.cycleLabel,
        diesel: c.diesel,
        gasoline: c.gasoline,
        electric: c.electric,
        propane: c.propane,
        cng: c.cng,
        dieselSharePct: c.dieselSharePct,
        electricSharePct: c.electricSharePct,
        propaneSharePct: c.propaneSharePct,
        total: c.totalUnits,
      })),
    [cycles],
  );

  const dieselTrend = useMemo(
    () =>
      CYCLE_FUEL.map((c) => ({
        cycle: c.cycleLabel,
        dieselSharePct: c.dieselSharePct,
        electricSharePct: c.electricSharePct,
        propaneSharePct: c.propaneSharePct,
        altFuelSharePct: c.altFuelSharePct,
        dieselUnits: c.diesel,
      })),
    [],
  );

  const bodyStack = useMemo(
    () =>
      BODY_FUEL_MIX_2023_24.map((b) => ({
        body: b.bodyLabel,
        diesel: Math.round((b.dieselPct / 100) * b.units),
        gasoline: Math.round((b.gasolinePct / 100) * b.units),
        electric: Math.round((b.electricPct / 100) * b.units),
        propane: Math.round((b.propanePct / 100) * b.units),
        dieselPct: b.dieselPct,
        units: b.units,
      })),
    [],
  );

  const bodyStylesFiltered = useMemo(() => {
    if (cycleFilter === "all") return BODY_STYLES;
    return BODY_STYLES.filter((b) => b.cycle === cycleFilter);
  }, [cycleFilter]);

  const scatterData = useMemo(
    () =>
      OEM_VS_CSB.map((r) => ({
        ...r,
        x: r.oemElectricUnits,
        y: r.oemDieselSharePct,
        z: r.csbElectricishUnits,
      })),
    [],
  );

  const highlightOpacity = (fuel: FuelId) => {
    if (focusFuel === "all") return 1;
    if (focusFuel === fuel) return 1;
    return 0.22;
  };

  return (
    <figure
      className="not-prose my-8"
      data-viz={SLUG}
      data-smoke="Diesel share of new deliveries"
    >
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Diesel share of new deliveries · OEM factory survey · Type A / C / D
            </p>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mt-1">
              Diesel still dominates the factory ledger
            </h3>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Latest cycle ({HEADLINE.latestCycle}):{" "}
              <span className="font-semibold text-slate-900">
                {fmtPct(HEADLINE.dieselSharePct)}
              </span>{" "}
              diesel ({fmtUnits(HEADLINE.dieselUnits)} of{" "}
              {fmtUnits(HEADLINE.totalUnits)} units) — up{" "}
              {HEADLINE.dieselShareDeltaPpVs2022_23.toFixed(1)} pp from
              2022–23 as EV output stayed flat.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3" role="tablist" aria-label="Chart view">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={view === v.id}
              onClick={() => setView(v.id)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition ${
                view === v.id
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <label className="text-xs text-slate-600 flex items-center gap-2">
            Cycle
            <select
              className="text-sm border border-slate-200 rounded-md px-2 py-1 bg-white"
              value={cycleFilter}
              onChange={(e) => setCycleFilter(e.target.value as CycleFilter)}
            >
              <option value="all">All cycles</option>
              {CYCLE_FUEL.map((c) => (
                <option key={c.cycle} value={c.cycle}>
                  {c.cycleLabel}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-slate-600 flex items-center gap-2">
            Highlight fuel
            <select
              className="text-sm border border-slate-200 rounded-md px-2 py-1 bg-white"
              value={focusFuel}
              onChange={(e) => setFocusFuel(e.target.value as FocusFuel)}
            >
              <option value="all">All fuels</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="propane">Propane</option>
            </select>
          </label>
        </div>

        <p className="text-sm font-medium text-slate-800 mb-2" data-panel-marker>
          {VIEWS.find((v) => v.id === view)?.marker}
        </p>

        <div className="h-[340px] w-full sm:h-[380px]">
          {view === "mix" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stackData} margin={{ top: 8, right: 12, left: 4, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="cycle" tick={{ fill: MUTED, fontSize: 12 }} />
                <YAxis
                  tick={{ fill: MUTED, fontSize: 12 }}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  formatter={(value, name) => [
                    fmtUnits(Number(value)),
                    FUEL_META[name as FuelId]?.label ?? String(name),
                  ]}
                />
                <Legend />
                {FUELS.map((fuel) => (
                  <Bar
                    key={fuel}
                    dataKey={fuel}
                    stackId="fuel"
                    fill={FUEL_META[fuel].color}
                    fillOpacity={highlightOpacity(fuel)}
                    name={FUEL_META[fuel].label}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}

          {view === "diesel" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dieselTrend} margin={{ top: 8, right: 12, left: 4, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="cycle" tick={{ fill: MUTED, fontSize: 12 }} />
                <YAxis
                  domain={[0, 80]}
                  tick={{ fill: MUTED, fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip formatter={(value, name) => [fmtPct(Number(value)), String(name)]} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="altFuelSharePct"
                  name="EV + propane + CNG %"
                  fill={EV}
                  stroke={EV}
                  fillOpacity={focusFuel === "diesel" ? 0.08 : 0.25}
                />
                <Line
                  type="monotone"
                  dataKey="dieselSharePct"
                  name="Diesel share %"
                  stroke={DIESEL}
                  strokeWidth={focusFuel === "electric" || focusFuel === "propane" ? 1.5 : 3}
                  dot={{ r: 4, fill: DIESEL }}
                />
                <Line
                  type="monotone"
                  dataKey="electricSharePct"
                  name="Electric share %"
                  stroke={EV}
                  strokeWidth={focusFuel === "electric" ? 3 : 1.5}
                  strokeDasharray="4 4"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="propaneSharePct"
                  name="Propane share %"
                  stroke={LPG}
                  strokeWidth={focusFuel === "propane" ? 3 : 1.5}
                  strokeDasharray="2 3"
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {view === "bodies" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={bodyStack}
                margin={{ top: 8, right: 16, left: 48, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fill: MUTED, fontSize: 12 }}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="body"
                  tick={{ fill: INK, fontSize: 12 }}
                  width={56}
                />
                <Tooltip
                  formatter={(value, name) => [
                    fmtUnits(Number(value)),
                    FUEL_META[name as FuelId]?.label ?? String(name),
                  ]}
                />
                <Legend />
                <Bar dataKey="diesel" stackId="b" fill={DIESEL} fillOpacity={highlightOpacity("diesel")} name="Diesel" />
                <Bar dataKey="gasoline" stackId="b" fill={GAS} fillOpacity={highlightOpacity("gasoline")} name="Gasoline" />
                <Bar dataKey="electric" stackId="b" fill={EV} fillOpacity={highlightOpacity("electric")} name="Electric" />
                <Bar dataKey="propane" stackId="b" fill={LPG} fillOpacity={highlightOpacity("propane")} name="Propane" />
              </BarChart>
            </ResponsiveContainer>
          )}

          {view === "csb" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={CSB_AWARDS} margin={{ top: 8, right: 12, left: 4, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fill: MUTED, fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: MUTED, fontSize: 12 }}
                  tickFormatter={(v) => fmtUnits(v)}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[80, 100]}
                  tick={{ fill: MUTED, fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="busesAwarded"
                  name="Buses awarded"
                  fill={EV}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="electricSharePct"
                  name="Electric share of awards %"
                  stroke={INK}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {view === "scatter" && (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="OEM EV units"
                  tick={{ fill: MUTED, fontSize: 12 }}
                  domain={[2500, 3200]}
                  label={{ value: "OEM electric units", position: "insideBottom", offset: -4, fill: MUTED, fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Diesel %"
                  tick={{ fill: MUTED, fontSize: 12 }}
                  domain={[55, 70]}
                  tickFormatter={(v) => `${v}%`}
                  label={{ value: "OEM diesel share", angle: -90, position: "insideLeft", fill: MUTED, fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="z" range={[80, 280]} name="CSB EV-ish units" />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    if (name === "OEM diesel share" || String(name).includes("Diesel"))
                      return [fmtPct(Number(value)), "OEM diesel share"];
                    return [fmtUnits(Number(value)), String(name)];
                  }}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.label ?? ""
                  }
                />
                <Scatter name="Cycle windows" data={scatterData} fill={DIESEL}>
                  {scatterData.map((d) => (
                    <Cell
                      key={d.id}
                      fill={d.oemDieselSharePct >= 64 ? DIESEL : EV}
                      fillOpacity={0.85}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </div>

        {view === "bodies" && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {bodyStylesFiltered.map((b) => (
              <div
                key={b.cycle}
                className="rounded-lg border border-slate-100 bg-white/80 px-3 py-2 text-xs text-slate-600"
              >
                <span className="font-semibold text-slate-800">{b.cycleLabel}</span>
                {" · "}
                Type C {fmtPct(b.typeCSharePct, 0)} · Type A{" "}
                {fmtPct(b.typeASharePct, 0)} · Type D {fmtPct(b.typeDSharePct, 0)}
              </div>
            ))}
          </div>
        )}

        <p className="mt-4 text-[11px] leading-relaxed text-slate-500 border-t border-slate-100 pt-3">
          {SOURCE_NOTE}
        </p>
      </div>
    </figure>
  );
}
