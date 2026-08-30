"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  Area,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  BREAK_EVEN_CURVE,
  ELEC_RATE_STEPS,
  EV_HEATMAP,
  EV_KWH_MI_STEPS,
  HEADLINE,
  NATIONAL_SERIES,
  REGION_COMPARE,
  SCENARIOS,
  SOURCE_NOTE,
  VIZ_MARKERS,
  costPair,
  type ScenarioId,
} from "@/data/ev-electricity-cost-per-mile-versus-gasoline-cost-per-mile-2026-data";

// viz-types: dual cents/mi lines, EV sensitivity heatmap, regional scatter,
// break-even mpg contour | layout: default
// smoke-marker: EV vs gasoline cents per mile

type ViewId = "trend" | "heatmap" | "regions" | "breakeven";

const SLUG = "ev-electricity-cost-per-mile-versus-gasoline-cost-per-mile-2026";
const INK = "#0f172a";
const MUTED = "#64748b";
const EV_COLOR = "#0d9488";
const GAS_COLOR = "#c2410c";
const GRID = "#e2e8f0";

const VIEWS: { id: ViewId; label: string; marker: string }[] = [
  { id: "trend", label: "National trend", marker: VIZ_MARKERS[0] },
  { id: "heatmap", label: "EV sensitivity", marker: VIZ_MARKERS[1] },
  { id: "regions", label: "PADD regions", marker: VIZ_MARKERS[2] },
  { id: "breakeven", label: "Break-even mpg", marker: VIZ_MARKERS[3] },
];

function heatColor(cents: number): string {
  // Low cost → teal; high cost → amber/red
  if (cents <= 3) return "#99f6e4";
  if (cents <= 5) return "#5eead4";
  if (cents <= 7) return "#2dd4bf";
  if (cents <= 9) return "#fbbf24";
  if (cents <= 12) return "#f97316";
  return "#dc2626";
}

function fmtCents(n: number, d = 1) {
  return `${n.toFixed(d)}¢`;
}

export function EvElectricityCostPerMileVersusGasolineCostPerMile2026Dashboard() {
  const [view, setView] = useState<ViewId>("trend");
  const [scenarioId, setScenarioId] = useState<ScenarioId>("national-2025");
  const [elecCents, setElecCents] = useState(HEADLINE.residentialCentsPerKwh);
  const [gasDollars, setGasDollars] = useState(HEADLINE.regularGasDollarsPerGal);
  const [kwhPerMile, setKwhPerMile] = useState(HEADLINE.typicalEvKwhPerMile);
  const [mpg, setMpg] = useState(HEADLINE.typicalIceMpg);

  const applyScenario = (id: ScenarioId) => {
    const s = SCENARIOS.find((x) => x.id === id);
    if (!s) return;
    setScenarioId(id);
    setElecCents(s.elecCents);
    setGasDollars(s.gasDollars);
    setKwhPerMile(s.kwhPerMile);
    setMpg(s.mpg);
  };

  const live = useMemo(
    () => costPair(elecCents, gasDollars, kwhPerMile, mpg),
    [elecCents, gasDollars, kwhPerMile, mpg],
  );

  const heatRows = useMemo(() => {
    return [...EV_KWH_MI_STEPS].reverse().map((kwh) => ({
      kwh,
      cells: ELEC_RATE_STEPS.map((rate) => {
        const cell = EV_HEATMAP.find(
          (c) => c.rateCents === rate && c.kwhPerMile === kwh,
        );
        return {
          rate,
          cents: cell?.centsPerMile ?? rate * kwh,
        };
      }),
    }));
  }, []);

  const scatterData = useMemo(
    () =>
      REGION_COMPARE.map((r) => ({
        ...r,
        x: r.evCentsPerMile,
        y: r.iceCentsPerMile,
        z: 120,
      })),
    [],
  );

  const breakEvenLive = useMemo(
    () =>
      [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map((g) => ({
        gasDollars: g,
        mpg:
          Math.round(((g * 100) / (elecCents * kwhPerMile)) * 10) / 10,
      })),
    [elecCents, kwhPerMile],
  );

  return (
    <figure
      className="not-prose my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      data-viz={SLUG}
      data-smoke="EV vs gasoline cents per mile"
    >
      <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-teal-50/40 px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
          EV vs gasoline cents per mile · EIA residential power × pump prices
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
          EV electricity vs gasoline operating cost
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          Fix efficiency assumptions, then watch how EIA residential power and
          regular gasoline prices translate into cents per mile — nationally,
          by PADD region, and across the efficiency map.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-teal-50/80 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-teal-800">
              EV ¢/mi
            </p>
            <p className="text-2xl font-semibold tabular-nums text-teal-900">
              {fmtCents(live.evCentsPerMile, 2)}
            </p>
          </div>
          <div className="rounded-xl bg-orange-50/80 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-orange-800">
              Gasoline ¢/mi
            </p>
            <p className="text-2xl font-semibold tabular-nums text-orange-900">
              {fmtCents(live.iceCentsPerMile, 2)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-100/80 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-600">
              Gas ÷ EV ratio
            </p>
            <p className="text-2xl font-semibold tabular-nums text-slate-900">
              {live.iceOverEvRatio.toFixed(2)}×
            </p>
          </div>
          <div className="rounded-xl bg-slate-100/80 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-600">
              Break-even ICE mpg
            </p>
            <p className="text-2xl font-semibold tabular-nums text-slate-900">
              {live.breakEvenMpg.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3 sm:px-6">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setView(v.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              view === v.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            aria-pressed={view === v.id}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 border-b border-slate-100 px-4 py-4 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Scenario preset</span>
          <select
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900"
            value={scenarioId}
            onChange={(e) => applyScenario(e.target.value as ScenarioId)}
          >
            {SCENARIOS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 flex justify-between text-slate-600">
              <span>Residential ¢/kWh</span>
              <span className="tabular-nums font-medium text-slate-900">
                {elecCents.toFixed(1)}
              </span>
            </span>
            <input
              type="range"
              min={10}
              max={36}
              step={0.1}
              value={elecCents}
              onChange={(e) => {
                setElecCents(Number(e.target.value));
                setScenarioId("national-2025");
              }}
              className="w-full accent-teal-700"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 flex justify-between text-slate-600">
              <span>Gasoline $/gal</span>
              <span className="tabular-nums font-medium text-slate-900">
                ${gasDollars.toFixed(2)}
              </span>
            </span>
            <input
              type="range"
              min={2}
              max={5}
              step={0.01}
              value={gasDollars}
              onChange={(e) => {
                setGasDollars(Number(e.target.value));
                setScenarioId("national-2025");
              }}
              className="w-full accent-orange-700"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 flex justify-between text-slate-600">
              <span>EV kWh/mi</span>
              <span className="tabular-nums font-medium text-slate-900">
                {kwhPerMile.toFixed(2)}
              </span>
            </span>
            <input
              type="range"
              min={0.2}
              max={0.6}
              step={0.01}
              value={kwhPerMile}
              onChange={(e) => {
                setKwhPerMile(Number(e.target.value));
                setScenarioId("national-2025");
              }}
              className="w-full accent-teal-700"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 flex justify-between text-slate-600">
              <span>ICE mpg</span>
              <span className="tabular-nums font-medium text-slate-900">
                {mpg.toFixed(0)}
              </span>
            </span>
            <input
              type="range"
              min={12}
              max={55}
              step={1}
              value={mpg}
              onChange={(e) => {
                setMpg(Number(e.target.value));
                setScenarioId("national-2025");
              }}
              className="w-full accent-orange-700"
            />
          </label>
        </div>
      </div>

      <div className="px-2 py-4 sm:px-4" data-viz-panel={view}>
        <p className="mb-2 px-2 text-sm font-medium text-slate-800" data-panel-marker>
          {VIEWS.find((v) => v.id === view)?.marker}
        </p>
        {view === "trend" && (
          <div className="h-[340px] w-full" data-marker={VIZ_MARKERS[0]}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={NATIONAL_SERIES}
                margin={{ top: 12, right: 16, left: 4, bottom: 8 }}
              >
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  tick={{ fill: MUTED, fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: MUTED, fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  label={{
                    value: "¢ per mile",
                    angle: -90,
                    position: "insideLeft",
                    fill: MUTED,
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${Number(value).toFixed(2)}¢/mi`,
                    String(name),
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="gapCentsPerMile"
                  name="Gap (gas − EV)"
                  fill="#fed7aa"
                  stroke="none"
                  fillOpacity={0.45}
                />
                <Line
                  type="monotone"
                  dataKey="evCentsPerMile"
                  name="EV electricity"
                  stroke={EV_COLOR}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="iceCentsPerMile"
                  name="Gasoline ICE"
                  stroke={GAS_COLOR}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <ReferenceLine
                  y={live.evCentsPerMile}
                  stroke={EV_COLOR}
                  strokeDasharray="4 4"
                  strokeOpacity={0.5}
                />
              </ComposedChart>
            </ResponsiveContainer>
            <p className="mt-2 px-2 text-xs text-slate-500">
              Series holds efficiency fixed at {TYPICAL_NOTE}. Gap shaded in
              amber. Live EV slider shown as dashed reference.
            </p>
          </div>
        )}

        {view === "heatmap" && (
          <div className="overflow-x-auto px-2" data-marker={VIZ_MARKERS[1]}>
            <p className="mb-2 text-sm text-slate-600">
              EV cents per mile = residential ¢/kWh × kWh/mi. Highlighted cell
              matches live sliders (± nearest grid step).
            </p>
            <table className="min-w-full border-collapse text-center text-sm">
              <thead>
                <tr>
                  <th className="border border-slate-200 bg-slate-50 px-2 py-2 text-left text-xs font-semibold text-slate-600">
                    kWh/mi ↓ · ¢/kWh →
                  </th>
                  {ELEC_RATE_STEPS.map((r) => (
                    <th
                      key={r}
                      className="border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-700"
                    >
                      {r}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatRows.map((row) => (
                  <tr key={row.kwh}>
                    <th className="border border-slate-200 bg-slate-50 px-2 py-2 text-left text-xs font-semibold text-slate-700">
                      {row.kwh}
                    </th>
                    {row.cells.map((cell) => {
                      const near =
                        Math.abs(cell.rate - elecCents) < 2.5 &&
                        Math.abs(row.kwh - kwhPerMile) < 0.04;
                      return (
                        <td
                          key={`${row.kwh}-${cell.rate}`}
                          className={`border border-slate-200 px-2 py-2 tabular-nums ${
                            near ? "ring-2 ring-inset ring-slate-900" : ""
                          }`}
                          style={{ backgroundColor: heatColor(cell.cents) }}
                        >
                          <span className="font-medium text-slate-900">
                            {cell.cents.toFixed(1)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === "regions" && (
          <div className="h-[360px] w-full" data-marker={VIZ_MARKERS[2]}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 20, left: 8, bottom: 28 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="EV ¢/mi"
                  tick={{ fill: MUTED, fontSize: 12 }}
                  label={{
                    value: "EV electricity ¢/mi →",
                    position: "insideBottom",
                    offset: -16,
                    fill: MUTED,
                    fontSize: 11,
                  }}
                  domain={[3, 10]}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Gas ¢/mi"
                  tick={{ fill: MUTED, fontSize: 12 }}
                  label={{
                    value: "Gasoline ¢/mi",
                    angle: -90,
                    position: "insideLeft",
                    fill: MUTED,
                    fontSize: 11,
                  }}
                  domain={[8, 16]}
                />
                <ZAxis type="number" dataKey="z" range={[80, 200]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const d = payload[0].payload as (typeof scatterData)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <p className="font-semibold text-slate-900">{d.label}</p>
                        <p className="text-teal-800">
                          EV {fmtCents(d.evCentsPerMile, 2)}/mi
                        </p>
                        <p className="text-orange-800">
                          Gas {fmtCents(d.iceCentsPerMile, 2)}/mi
                        </p>
                        <p className="text-slate-600">
                          Ratio {d.iceOverEvRatio.toFixed(2)}× · gas $
                          {d.gasDollarsPerGal.toFixed(2)} · power{" "}
                          {d.residentialCentsPerKwh.toFixed(1)}¢
                        </p>
                      </div>
                    );
                  }}
                />
                <Scatter name="PADD regions" data={scatterData} fill={INK}>
                  {scatterData.map((r) => (
                    <Cell
                      key={r.id}
                      fill={r.iceOverEvRatio > 2 ? GAS_COLOR : EV_COLOR}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <p className="mt-1 px-2 text-xs text-slate-500">
              Orange points lean toward a wider gasoline premium; teal points
              sit closer on a cents-per-mile basis. Electricity rates are
              regional proxies (derived); gasoline is EIA PADD regular 2025.
              Efficiencies fixed at 0.30 kWh/mi and 28 mpg.
            </p>
          </div>
        )}

        {view === "breakeven" && (
          <div className="h-[340px] w-full" data-marker={VIZ_MARKERS[3]}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={breakEvenLive}
                margin={{ top: 12, right: 16, left: 4, bottom: 8 }}
              >
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis
                  dataKey="gasDollars"
                  tickFormatter={(v) => `$${v}`}
                  tick={{ fill: MUTED, fontSize: 12 }}
                  label={{
                    value: "Gasoline $/gal",
                    position: "insideBottom",
                    offset: -2,
                    fill: MUTED,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  tick={{ fill: MUTED, fontSize: 12 }}
                  label={{
                    value: "Break-even ICE mpg",
                    angle: -90,
                    position: "insideLeft",
                    fill: MUTED,
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toFixed(1)} mpg`,
                    "Break-even",
                  ]}
                  labelFormatter={(l) => `Gas $${l}/gal`}
                />
                <Line
                  type="monotone"
                  dataKey="mpg"
                  name="mpg to match EV ¢/mi"
                  stroke={GAS_COLOR}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <ReferenceLine
                  y={mpg}
                  stroke="#64748b"
                  strokeDasharray="4 4"
                  label={{
                    value: `Your ICE ${mpg} mpg`,
                    fill: MUTED,
                    fontSize: 11,
                    position: "insideTopRight",
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
            <p className="mt-2 px-2 text-xs text-slate-500">
              At {elecCents.toFixed(1)}¢/kWh and {kwhPerMile.toFixed(2)}{" "}
              kWh/mi, gasoline must deliver the plotted mpg to match EV
              electricity cost per mile. National 2025 fixed-efficiency curve
              peaks near {BREAK_EVEN_CURVE.find((p) => p.gasDollars === 3.097)?.mpg ?? "—"}{" "}
              mpg at $3.10/gal.
            </p>
          </div>
        )}
      </div>

      <figcaption className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500 sm:px-6">
        {SOURCE_NOTE}
      </figcaption>
    </figure>
  );
}

const TYPICAL_NOTE = `${HEADLINE.typicalEvKwhPerMile} kWh/mi and ${HEADLINE.typicalIceMpg} mpg`;
