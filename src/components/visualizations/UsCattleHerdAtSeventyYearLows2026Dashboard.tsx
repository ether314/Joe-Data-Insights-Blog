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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  CLASS_STACK,
  DROUGHT_PATH,
  HEADLINE,
  INVENTORY_PRICE_SCATTER,
  PRICE_LADDER,
  REBUILD_SIGNALS,
  SOURCE_NOTE,
  STATE_DROUGHT,
  fmtM,
  fmtPct,
  fmtUsd,
  herdSeries,
  overlaySeries,
  type PriceMode,
  type SeriesMode,
} from "@/data/us-cattle-herd-at-seventy-year-lows-2026-data";

// viz-types: herd×price composed, drought area+bars, rebuild signal bars, inventory×retail scatter, class ladder, price ladder multi-line | layout: default

type ViewId = "overlay" | "drought" | "rebuild" | "ladder";

const NAVY = "#0f172a";
const AMBER = "#d97706";
const TEAL = "#0f766e";
const ROSE = "#be123c";
const SLATE = "#64748b";
const EMERALD = "#059669";
const SEVERITY: Record<string, string> = {
  moderate: "#ca8a04",
  severe: "#ea580c",
  extreme: "#be123c",
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

export function UsCattleHerdAtSeventyYearLows2026Dashboard() {
  const [view, setView] = useState<ViewId>("overlay");
  const [series, setSeries] = useState<SeriesMode>("allCattle");
  const [priceMode, setPriceMode] = useState<PriceMode>("cutout");

  const longHerd = useMemo(() => herdSeries(series), [series]);
  const overlay = useMemo(
    () => overlaySeries(series, priceMode),
    [series, priceMode],
  );
  const drought = useMemo(
    () =>
      DROUGHT_PATH.map((d) => ({
        year: d.year,
        drought: d.droughtSharePct,
        cowDelta: d.beefCowChangeM,
      })),
    [],
  );
  const states = useMemo(
    () =>
      STATE_DROUGHT.map((s) => ({
        name: s.state,
        share: s.beefCowSharePct,
        stress: s.pastureStress,
        severity: s.droughtSeverity,
      })),
    [],
  );
  const rebuild = useMemo(
    () =>
      REBUILD_SIGNALS.map((r) => ({
        name: r.label.replace(/ YoY| change/g, ""),
        value: r.value,
        fill:
          r.direction === "expansion"
            ? EMERALD
            : r.direction === "contraction"
              ? ROSE
              : AMBER,
      })),
    [],
  );
  const classes = useMemo(
    () =>
      CLASS_STACK.map((c) => ({
        name: c.label,
        head: c.mHead,
        yoy: c.yoyPct,
      })),
    [],
  );
  const ladder = useMemo(
    () =>
      PRICE_LADDER.map((p) => ({
        year: p.year,
        steer: p.fedSteerUsdCwt,
        cutout: p.choiceCutoutUsdCwt,
        retail: p.allFreshRetailUsdLb,
      })),
    [],
  );
  const scatter = useMemo(() => INVENTORY_PRICE_SCATTER, []);

  const herdLabel = series === "allCattle" ? "All cattle" : "Beef cows";
  const priceLabel =
    priceMode === "cutout" ? "Choice cutout ($/cwt)" : "All-fresh retail ($/lb)";
  const priceUnit = priceMode === "cutout" ? "$/cwt" : "$/lb";

  return (
    <div
      className="w-full min-w-0 space-y-6"
      data-viz="us-cattle-herd-at-seventy-year-lows-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300/90">
          Food & agriculture · cattle–beef squeeze
        </p>
        <p className="mt-2 text-lg font-bold leading-snug sm:text-xl">
          Jan 1, 2026 herd at {fmtM(HEADLINE.allCattle2026M)} — lowest since{" "}
          {HEADLINE.lowestSinceYear}; Choice cutout carried near{" "}
          {fmtUsd(HEADLINE.choiceCutout2026YtdUsdCwt)}/cwt
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Beef cows {fmtM(HEADLINE.beefCows2026M)} (lowest since{" "}
          {HEADLINE.beefCowsLowestSinceYear}). Replacement heifers{" "}
          {fmtPct(HEADLINE.beefReplacementHeifersYoYPct)} — an early rebuild cue
          while the breeding herd is still contracting. ~{HEADLINE.droughtCattleSharePct}%
          of cattle inventory sits in drought-rated areas.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "overlay", label: "Herd vs price" },
            { id: "drought", label: "Drought" },
            { id: "rebuild", label: "Rebuild signals" },
            { id: "ladder", label: "Price ladder" },
          ]}
        />
        <div className="flex flex-wrap gap-3">
          <ToggleGroup
            label="Herd"
            value={series}
            onChange={setSeries}
            options={[
              { id: "allCattle", label: "All cattle" },
              { id: "beefCows", label: "Beef cows" },
            ]}
          />
          {view === "overlay" && (
            <ToggleGroup
              label="Price"
              value={priceMode}
              onChange={setPriceMode}
              options={[
                { id: "cutout", label: "Cutout" },
                { id: "retail", label: "Retail" },
              ]}
            />
          )}
        </div>
      </div>

      {view === "overlay" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Herd size vs beef price"
            subtitle={`${herdLabel} (left) against ${priceLabel} (right)`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={overlay} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    yAxisId="herd"
                    tick={{ fill: SLATE, fontSize: 11 }}
                    domain={series === "allCattle" ? [84, 98] : [26, 34]}
                    label={{
                      value: "M head",
                      angle: -90,
                      position: "insideLeft",
                      fill: SLATE,
                      fontSize: 10,
                    }}
                  />
                  <YAxis
                    yAxisId="price"
                    orientation="right"
                    tick={{ fill: SLATE, fontSize: 11 }}
                    domain={priceMode === "cutout" ? [180, 380] : [5, 10]}
                    label={{
                      value: priceUnit,
                      angle: 90,
                      position: "insideRight",
                      fill: SLATE,
                      fontSize: 10,
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="herd"
                    dataKey="herd"
                    name={herdLabel}
                    fill={NAVY}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="price"
                    name={priceLabel}
                    stroke={AMBER}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: AMBER }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Long herd path"
            subtitle="Jan-1 inventory back to the 1975 peak (NASS rounded)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChartLike data={longHerd} seriesLabel={herdLabel} />
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Inventory × retail scatter"
            subtitle="Each point is a year — lower herds sit with higher retail values"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="herdM"
                    name="Herd"
                    unit="M"
                    tick={{ fill: SLATE, fontSize: 11 }}
                    domain={[85, 96]}
                  />
                  <YAxis
                    type="number"
                    dataKey="retail"
                    name="Retail"
                    unit="$"
                    tick={{ fill: SLATE, fontSize: 11 }}
                    domain={[5, 10]}
                  />
                  <ZAxis type="number" dataKey="cutout" range={[40, 160]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="Year" data={scatter} fill={TEAL} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="2026 class stack"
            subtitle="Million head — calf crop is 2025 crop; others are Jan 1, 2026"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={classes}
                  layout="vertical"
                  margin={{ top: 8, right: 12, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={128}
                    tick={{ fill: SLATE, fontSize: 10 }}
                  />
                  <Tooltip />
                  <Bar dataKey="head" name="M head" fill={TEAL} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "drought" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Drought share of cattle inventory"
            subtitle="Estimated % of US cattle in drought-rated areas + beef-cow Δ (M head)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={drought} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis
                    yAxisId="d"
                    tick={{ fill: SLATE, fontSize: 11 }}
                    domain={[0, 70]}
                    label={{
                      value: "% in drought",
                      angle: -90,
                      position: "insideLeft",
                      fill: SLATE,
                      fontSize: 10,
                    }}
                  />
                  <YAxis
                    yAxisId="c"
                    orientation="right"
                    tick={{ fill: SLATE, fontSize: 11 }}
                    domain={[-1.5, 1]}
                  />
                  <Tooltip />
                  <Legend />
                  <Area
                    yAxisId="d"
                    type="monotone"
                    dataKey="drought"
                    name="% cattle in drought"
                    fill="#fbbf24"
                    stroke={AMBER}
                    fillOpacity={0.35}
                  />
                  <Bar
                    yAxisId="c"
                    dataKey="cowDelta"
                    name="Beef cow Δ (M)"
                    fill={ROSE}
                    maxBarSize={22}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="State beef-cow share × pasture stress"
            subtitle="Bubble color = drought severity band (analytical)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="share"
                    name="Beef-cow share"
                    unit="%"
                    tick={{ fill: SLATE, fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="stress"
                    name="Pasture stress"
                    tick={{ fill: SLATE, fontSize: 11 }}
                    domain={[30, 80]}
                  />
                  <ZAxis type="number" dataKey="share" range={[60, 280]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="States" data={states}>
                    {states.map((s) => (
                      <Cell key={s.name} fill={SEVERITY[s.severity] ?? AMBER} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "rebuild" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Rebuild vs contraction signals"
            subtitle="Green = expansion cue · red = still contracting · amber = mixed"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={rebuild}
                  layout="vertical"
                  margin={{ top: 8, right: 12, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fill: SLATE, fontSize: 11 }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={150}
                    tick={{ fill: SLATE, fontSize: 10 }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" name="YoY / change %" radius={[0, 4, 4, 0]}>
                    {rebuild.map((r) => (
                      <Cell key={r.name} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Class YoY change"
            subtitle="Same Jan-1 stack, colored by year-over-year direction"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classes} margin={{ top: 8, right: 12, left: 0, bottom: 48 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: SLATE, fontSize: 9 }}
                    interval={0}
                    angle={-28}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fill: SLATE, fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Bar dataKey="yoy" name="YoY %" radius={[4, 4, 0, 0]}>
                    {classes.map((c) => (
                      <Cell
                        key={c.name}
                        fill={c.yoy >= 0 ? EMERALD : ROSE}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "ladder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Farm → wholesale path"
            subtitle="Fed steer and Choice cutout ($/cwt)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ladder} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis tick={{ fill: SLATE, fontSize: 11 }} domain={[90, 380]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="steer"
                    name="Fed steer ($/cwt)"
                    stroke={NAVY}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cutout"
                    name="Choice cutout ($/cwt)"
                    stroke={AMBER}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Retail all-fresh beef"
            subtitle="ERS all-fresh retail value ($/lb); 2025–26 estimated"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={ladder} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 11 }} />
                  <YAxis tick={{ fill: SLATE, fontSize: 11 }} domain={[5, 10]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="retail"
                    name="All-fresh retail ($/lb)"
                    fill="#0f766e"
                    stroke={TEAL}
                    fillOpacity={0.25}
                    strokeWidth={2.5}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}

/** Thin wrapper so Area chart imports stay local to the long-path panel. */
function AreaChartLike({
  data,
  seriesLabel,
}: {
  data: { year: number; head: number }[];
  seriesLabel: string;
}) {
  return (
    <ComposedChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
      <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 11 }} />
      <YAxis tick={{ fill: SLATE, fontSize: 11 }} />
      <Tooltip />
      <Area
        type="monotone"
        dataKey="head"
        name={seriesLabel}
        fill="#1e3a5f"
        stroke={NAVY}
        fillOpacity={0.45}
        strokeWidth={2}
      />
    </ComposedChart>
  );
}
