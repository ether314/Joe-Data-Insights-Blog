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
  ANNUAL,
  DECADE_BARS,
  DETAIL_TABLE,
  ERA_COMPARE,
  HEADLINE,
  INDEX_1990,
  SCATTER_POINTS,
  SOURCE_NOTE,
  VIZ_MARKERS,
  csdGallonsBest,
  fmtGal,
  fmtIndex,
  fmtLb,
  fmtPct,
  type PriceSeries,
} from "@/data/us-caffeine-drink-disappearance-versus-beverage-cpi-2026-data";

// viz-types: dual-axis volume vs CPI composed, decade grouped bars, volume-price scatter,
// era compare bars, gap area | layout: default
// smoke-marker: Gallons and pounds versus beverage CPI

type Panel = "race" | "decades" | "scatter" | "eras" | "gaps" | "table";

const NAVY = "#0f172a";
const AMBER = "#b45309";
const TEAL = "#0f766e";
const ROSE = "#be123c";
const SLATE = "#64748b";
const GRID = "#e2e8f0";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  race: {
    title: "Volume indexes versus beverage CPI (1990 = 100)",
    subtitle:
      "Coffee green-bean disappearance recovered after 1995; CSD peaked then fell; nonalcoholic beverage CPI kept climbing",
  },
  decades: {
    title: "Decade changes: disappearance vs beverage prices",
    subtitle:
      "Percent change within each decade — volumes and CPI rarely moved together after the soda boom",
  },
  scatter: {
    title: "Price–volume map (1990 = 100)",
    subtitle:
      "Each point is a year: X = beverage CPI index, Y = drink volume index. Points above the 45° line outran prices.",
  },
  eras: {
    title: "Era snapshots: pounds, gallons, and CPI levels",
    subtitle:
      "Coffee trough (1995) → ERS last print (2015) → CPI spike years without new ERS coffee",
  },
  gaps: {
    title: "Volume − price gap (index points, 1990 = 100)",
    subtitle:
      "Negative gap = prices ran ahead of disappearance. Coffee gap deepened as beverage CPI rose.",
  },
  table: {
    title: "Selected years — pounds, gallons, and CPI",
    subtitle: "USDA coffee through 2015; CSD USDA through 1997 then sparse industry extension",
  },
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
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function ControlChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

export function UsCaffeineDrinkDisappearanceVersusBeverageCpi2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("race");
  const [priceSeries, setPriceSeries] = useState<PriceSeries>("bev");
  const [showCoffee, setShowCoffee] = useState(true);
  const [showCsd, setShowCsd] = useState(true);

  const raceData = useMemo(() => {
    return INDEX_1990.map((r) => ({
      year: r.year,
      coffeeVol: r.coffeeVol,
      csdVol: r.csdVol,
      price:
        priceSeries === "bev"
          ? r.bevCpi
          : priceSeries === "coffee"
            ? r.coffeeCpi
            : r.sodaCpi,
      coffeeGapPp: r.coffeeGapPp,
      csdGapPp: r.csdGapPp,
    }));
  }, [priceSeries]);

  const gapData = useMemo(
    () =>
      INDEX_1990.filter((r) => r.year <= 2015 || r.csdVol != null).map((r) => ({
        year: r.year,
        coffeeGapPp: r.coffeeGapPp,
        csdGapPp: r.csdGapPp,
      })),
    [],
  );

  const scatterFiltered = useMemo(
    () =>
      SCATTER_POINTS.filter((p) =>
        p.drink === "coffee" ? showCoffee : showCsd,
      ),
    [showCoffee, showCsd],
  );

  const eraBars = useMemo(
    () =>
      ERA_COMPARE.map((e) => ({
        era: e.era,
        coffee: e.coffeeGreenBean,
        csd: e.csdGallons,
        bevCpiScaled: e.bevCpi != null ? e.bevCpi / 10 : null,
      })),
    [],
  );

  const priceLabel =
    priceSeries === "bev"
      ? "Nonalcoholic beverage CPI"
      : priceSeries === "coffee"
        ? "Coffee CPI"
        : "Carbonated-drink CPI";

  const meta = PANEL_META[panel];

  return (
    <div
      className="space-y-4"
      data-viz="us-caffeine-drink-disappearance-versus-beverage-cpi-2026"
    >
      <p className="sr-only">{VIZ_MARKERS[0]}</p>
      <p className="sr-only">{VIZ_MARKERS[1]}</p>

      <div className="rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-teal-50 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
          Gallons and pounds versus beverage CPI
        </p>
        <p className="mt-1 text-sm text-slate-700">
          Coffee green-bean per capita rose{" "}
          <span className="font-semibold text-slate-900">
            {fmtPct(HEADLINE.coffeeRecoveryPctFrom1995)}
          </span>{" "}
          from the 1995 trough to 2015 — still below 1970 — while CSD gallons peaked at{" "}
          <span className="font-semibold text-slate-900">
            {HEADLINE.csdGallons1997} in 1997
          </span>{" "}
          and the industry extension sits near{" "}
          <span className="font-semibold text-slate-900">
            {HEADLINE.csdGallons2025Ext} gal in 2025
          </span>
          . Nonalcoholic beverage CPI indexed to 1990 reached{" "}
          <span className="font-semibold text-slate-900">
            {fmtIndex(HEADLINE.bevCpiIndex1990_2025)}
          </span>{" "}
          by 2025.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["race", "Volume vs CPI race"],
            ["decades", "Decade changes"],
            ["scatter", "Price–volume scatter"],
            ["eras", "Era snapshots"],
            ["gaps", "Volume−price gaps"],
            ["table", "Detail table"],
          ] as const
        ).map(([id, label]) => (
          <ControlChip
            key={id}
            active={panel === id}
            onClick={() => setPanel(id)}
          >
            {label}
          </ControlChip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Price series
        </span>
        {(
          [
            ["bev", "Beverage CPI"],
            ["coffee", "Coffee CPI"],
            ["soda", "Soda CPI"],
          ] as const
        ).map(([id, label]) => (
          <ControlChip
            key={id}
            active={priceSeries === id}
            onClick={() => setPriceSeries(id)}
          >
            {label}
          </ControlChip>
        ))}
        <span className="ml-2 text-xs font-medium uppercase tracking-wide text-slate-500">
          Show volumes
        </span>
        <ControlChip active={showCoffee} onClick={() => setShowCoffee((v) => !v)}>
          Coffee volume
        </ControlChip>
        <ControlChip active={showCsd} onClick={() => setShowCsd((v) => !v)}>
          CSD volume
        </ControlChip>
      </div>

      <ChartCard title={meta.title} subtitle={meta.subtitle}>
        {panel === "race" ? (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={raceData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: SLATE }} />
                <YAxis
                  tick={{ fontSize: 11, fill: SLATE }}
                  domain={[60, "auto"]}
                  label={{
                    value: "Index (1990=100)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: SLATE, fontSize: 11 },
                  }}
                />
                <Tooltip />
                <Legend />
                <ReferenceLine y={100} stroke={SLATE} strokeDasharray="4 4" />
                {showCoffee ? (
                  <Area
                    type="monotone"
                    dataKey="coffeeVol"
                    name="Coffee volume"
                    stroke={AMBER}
                    fill={AMBER}
                    fillOpacity={0.12}
                    strokeWidth={2}
                    connectNulls
                  />
                ) : null}
                {showCsd ? (
                  <Line
                    type="monotone"
                    dataKey="csdVol"
                    name="CSD volume"
                    stroke={TEAL}
                    strokeWidth={2.5}
                    dot={false}
                    connectNulls
                  />
                ) : null}
                <Line
                  type="monotone"
                  dataKey="price"
                  name={priceLabel}
                  stroke={ROSE}
                  strokeWidth={2.5}
                  dot={false}
                  connectNulls
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "decades" ? (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DECADE_BARS} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="decade" tick={{ fontSize: 12, fill: SLATE }} />
                <YAxis
                  tick={{ fontSize: 11, fill: SLATE }}
                  unit="%"
                  label={{
                    value: "% change in decade",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: SLATE, fontSize: 11 },
                  }}
                />
                <Tooltip />
                <Legend />
                <ReferenceLine y={0} stroke={SLATE} />
                <Bar
                  dataKey="coffeeVolChangePct"
                  name="Coffee volume"
                  fill={AMBER}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="csdVolChangePct"
                  name="CSD volume"
                  fill={TEAL}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="bevCpiChangePct"
                  name="Beverage CPI"
                  fill={ROSE}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-2 text-xs text-slate-500">
              *2020s uses 2020→2025 CPI and 2021→2025 CSD extension; ERS coffee ends 2015.
            </p>
          </div>
        ) : null}

        {panel === "scatter" ? (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="priceIndex"
                  name="Beverage CPI index"
                  tick={{ fontSize: 11, fill: SLATE }}
                  domain={[90, 240]}
                  label={{
                    value: "Beverage CPI index (1990=100)",
                    position: "insideBottom",
                    offset: -2,
                    style: { fill: SLATE, fontSize: 11 },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="volumeIndex"
                  name="Volume index"
                  tick={{ fontSize: 11, fill: SLATE }}
                  domain={[70, 130]}
                  label={{
                    value: "Volume index",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: SLATE, fontSize: 11 },
                  }}
                />
                <ZAxis range={[60, 60]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <ReferenceLine
                  segment={[
                    { x: 90, y: 90 },
                    { x: 230, y: 230 },
                  ]}
                  stroke={SLATE}
                  strokeDasharray="4 4"
                  ifOverflow="extendDomain"
                />
                <Scatter name="Years" data={scatterFiltered}>
                  {scatterFiltered.map((p) => (
                    <Cell
                      key={`${p.drink}-${p.year}`}
                      fill={p.drink === "coffee" ? AMBER : TEAL}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <p className="mt-2 text-xs text-slate-500">
              Amber = coffee (annual); teal = CSD (every 5th year + extension markers).
            </p>
          </div>
        ) : null}

        {panel === "eras" ? (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={eraBars}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
              >
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 11, fill: SLATE }} />
                <YAxis
                  type="category"
                  dataKey="era"
                  width={120}
                  tick={{ fontSize: 11, fill: SLATE }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="coffee" name="Coffee lb/capita" fill={AMBER} />
                <Bar dataKey="csd" name="CSD gal/capita" fill={TEAL} />
                <Bar
                  dataKey="bevCpiScaled"
                  name="Beverage CPI ÷ 10"
                  fill={ROSE}
                  fillOpacity={0.7}
                />
              </BarChart>
            </ResponsiveContainer>
            <ul className="mt-3 space-y-1 text-xs text-slate-600">
              {ERA_COMPARE.map((e) => (
                <li key={e.era}>
                  <span className="font-medium text-slate-800">{e.era}</span> ({e.years}):{" "}
                  {e.note}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {panel === "gaps" ? (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={gapData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: SLATE }} />
                <YAxis
                  tick={{ fontSize: 11, fill: SLATE }}
                  label={{
                    value: "Volume index − beverage CPI index",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: SLATE, fontSize: 11 },
                  }}
                />
                <Tooltip />
                <Legend />
                <ReferenceLine y={0} stroke={NAVY} strokeWidth={1.5} />
                {showCoffee ? (
                  <Area
                    type="monotone"
                    dataKey="coffeeGapPp"
                    name="Coffee gap"
                    stroke={AMBER}
                    fill={AMBER}
                    fillOpacity={0.2}
                    strokeWidth={2}
                    connectNulls
                  />
                ) : null}
                {showCsd ? (
                  <Line
                    type="monotone"
                    dataKey="csdGapPp"
                    name="CSD gap"
                    stroke={TEAL}
                    strokeWidth={2.5}
                    dot={false}
                    connectNulls
                  />
                ) : null}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "table" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-4">Year</th>
                  <th className="py-2 pr-4">Coffee lb (GB)</th>
                  <th className="py-2 pr-4">Coffee gal</th>
                  <th className="py-2 pr-4">CSD gal</th>
                  <th className="py-2 pr-4">CSD source</th>
                  <th className="py-2 pr-4">Bev CPI</th>
                  <th className="py-2 pr-4">Coffee CPI</th>
                  <th className="py-2">Soda CPI</th>
                </tr>
              </thead>
              <tbody>
                {DETAIL_TABLE.map((r) => (
                  <tr key={r.year} className="border-b border-slate-100">
                    <td className="py-2 pr-4 font-medium text-slate-900">{r.year}</td>
                    <td className="py-2 pr-4">{fmtLb(r.coffeeGreenBeanLb)}</td>
                    <td className="py-2 pr-4">{fmtGal(r.coffeeGallons)}</td>
                    <td className="py-2 pr-4">{fmtGal(r.csdGallons)}</td>
                    <td className="py-2 pr-4 text-slate-500">{r.csdSource}</td>
                    <td className="py-2 pr-4">
                      {r.bevCpi != null ? r.bevCpi.toFixed(1) : "—"}
                    </td>
                    <td className="py-2 pr-4">
                      {r.coffeeCpi != null ? r.coffeeCpi.toFixed(1) : "—"}
                    </td>
                    <td className="py-2">
                      {r.sodaCpi != null ? r.sodaCpi.toFixed(1) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </ChartCard>

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <p className="text-xs text-slate-400">
        Series length: {ANNUAL.length} annual rows · latest USDA coffee{" "}
        {fmtLb(HEADLINE.coffeeGreenBean2015)} ({HEADLINE.latestCoffeeYear}) · CSD USDA peak{" "}
        {fmtGal(HEADLINE.csdGallons1997)} · beverage CPI 2025 {HEADLINE.bevCpi2025.toFixed(1)} ·
        best CSD {fmtGal(csdGallonsBest(ANNUAL[ANNUAL.length - 1]!))}
      </p>
    </div>
  );
}
