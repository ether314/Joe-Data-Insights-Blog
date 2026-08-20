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
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  DENSITY_RANKS,
  FORECAST_PATH,
  HEADLINE,
  REGION_COLORS,
  SHARE_SHIFT,
  SOURCE_NOTE,
  deltasFor,
  fmtPct,
  fmtPp,
  fmtUnits,
  industriesFor,
  marketsFor,
  regionsFor,
  type DeltaGroup,
  type IndustryScope,
  type RegionFilter,
  type RegionId,
} from "@/data/industrial-robotics-update-2026q3-data";

// viz-types: forecast-vs-prelim composed, diverging delta bars, share-shift area, industry yoy bars, density×rank scatter | layout: default
// viz-plan: Sep-25 forecast beat; vintage Δ; Asia share grab; industry rebound; density methodology shock; region + group + scope controls

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
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              value === o.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const COLORS = {
  prior: "#94a3b8",
  prelim: "#be123c",
  forecast: "#0f766e",
  up: "#be123c",
  down: "#0369a1",
  density: "#7c3aed",
  path: "#0ea5e9",
};

export function IndustrialRoboticsUpdate2026q3Dashboard() {
  const [region, setRegion] = useState<RegionFilter>("All");
  const [deltaGroup, setDeltaGroup] = useState<DeltaGroup>("All");
  const [industryScope, setIndustryScope] = useState<IndustryScope>("All");

  const deltas = useMemo(() => deltasFor(deltaGroup), [deltaGroup]);
  const industries = useMemo(
    () => industriesFor(industryScope),
    [industryScope],
  );
  const markets = useMemo(() => marketsFor(region), [region]);
  const regions = useMemo(() => regionsFor(region), [region]);

  const forecastSeries = useMemo(
    () =>
      FORECAST_PATH.map((p) => ({
        label: p.label,
        installs: p.actualOrPrelim,
        priorForecast: p.priorForecast,
        kind: p.kind,
      })),
    [],
  );

  const deltaBars = useMemo(
    () =>
      [...deltas]
        .map((d) => ({
          id: d.id,
          label: d.label,
          value:
            d.unit === "units" || d.unit === "k-units"
              ? d.delta / 1000
              : d.delta,
          rawDelta: d.delta,
          unit: d.unit,
          fill: d.delta >= 0 ? COLORS.up : COLORS.down,
          priorValue: d.priorValue,
          newValue: d.newValue,
          priorLabel: d.priorLabel,
          newLabel: d.newLabel,
        }))
        .sort((a, b) => b.value - a.value),
    [deltas],
  );

  const shareArea = useMemo(() => {
    const rows: {
      vintage: string;
      Asia: number;
      Europe: number;
      Americas: number;
    }[] = [
      {
        vintage: "2024 WR",
        Asia: 74,
        Europe: 16,
        Americas: 9,
      },
      {
        vintage: "2025 prelim",
        Asia: 79,
        Europe: 13,
        Americas: 9,
      },
    ];
    if (region === "All") return rows;
    return rows.map((r) => ({
      vintage: r.vintage,
      Asia: region === "Asia" ? r.Asia : 0,
      Europe: region === "Europe" ? r.Europe : 0,
      Americas: region === "Americas" ? r.Americas : 0,
    }));
  }, [region]);

  const industryBars = useMemo(
    () =>
      [...industries]
        .map((i) => ({
          id: i.industry,
          label: i.shortLabel,
          value: i.yoyPct,
          fill: i.yoyPct >= 0 ? COLORS.up : COLORS.down,
          scope: i.scope,
          units: i.units2025Approx,
        }))
        .sort((a, b) => b.value - a.value),
    [industries],
  );

  const regionYoy = useMemo(
    () =>
      regions.map((r) => ({
        region: r.region,
        prior: r.priorYoyPct2024,
        prelim: r.yoyPctEst,
        fill: REGION_COLORS[r.region],
        units2025: r.units2025Est,
        share2025: r.share2025,
      })),
    [regions],
  );

  const marketFlip = useMemo(
    () =>
      markets
        .filter((m) => m.priorYoyPct2024 != null)
        .map((m) => ({
          label: m.shortLabel,
          prior: m.priorYoyPct2024 as number,
          prelim: m.yoyPct,
          fill: REGION_COLORS[m.region],
          units2025: m.units2025,
        })),
    [markets],
  );

  const densityScatter = useMemo(
    () =>
      DENSITY_RANKS.filter((d) => d.rank != null).map((d) => ({
        name: d.shortLabel,
        density: d.density,
        rank: d.rank as number,
        z: Math.max(40, Math.min(200, d.density / 4)),
        note: d.note,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="industrial-robotics-update-2026q3"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Q3 vintage delta — IFR prelim 2025 vs WR 2025 update
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          World installs jump to 621k (+15%) — beating the 575k forecast by 46k
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Prior theme print: flat 542k world flow, West contracting, Asia +5%.
          New IFR April-2026 prelim (Automate Jun 2026): record 621k, Asia share
          79% (+5 pp), US rebound +11% to 38k. Final WR 2026 lands{" "}
          {HEADLINE.finalReportDate}.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              World 2025p
            </p>
            <p className="text-lg font-bold">{fmtUnits(HEADLINE.worldUnits2025Prelim)}</p>
            <p className="text-xs text-rose-300">{fmtPct(HEADLINE.worldYoyPct)}</p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              vs forecast
            </p>
            <p className="text-lg font-bold">+{fmtUnits(HEADLINE.beatForecastUnits)}</p>
            <p className="text-xs text-emerald-300">
              prior path {fmtUnits(HEADLINE.priorForecast2025)}
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Asia share
            </p>
            <p className="text-lg font-bold">{HEADLINE.asiaShare2025}%</p>
            <p className="text-xs text-amber-300">
              {fmtPp(HEADLINE.asiaShareDeltaPp)} vs 2024
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              US installs
            </p>
            <p className="text-lg font-bold">{fmtUnits(HEADLINE.usUnits2025)}</p>
            <p className="text-xs text-sky-300">
              {fmtPct(HEADLINE.usYoyPct)} after {fmtPct(-9)} in 2024
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Region"
          value={region}
          onChange={setRegion}
          options={[
            { id: "All", label: "All" },
            { id: "Asia", label: "Asia" },
            { id: "Europe", label: "Europe" },
            { id: "Americas", label: "Americas" },
          ]}
        />
        <ToggleGroup
          label="Δ group"
          value={deltaGroup}
          onChange={setDeltaGroup}
          options={[
            { id: "All", label: "All" },
            { id: "world", label: "World" },
            { id: "region", label: "Region" },
            { id: "market", label: "Market" },
            { id: "industry", label: "Industry" },
            { id: "forecast", label: "Forecast" },
          ]}
        />
        <ToggleGroup
          label="Industry scope"
          value={industryScope}
          onChange={setIndustryScope}
          options={[
            { id: "All", label: "All" },
            { id: "global", label: "Global" },
            { id: "us", label: "US only" },
          ]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Forecast path vs prelim beat"
          subtitle="WR 2025 printed 575k (+6%) for 2025 — April prelim prints 621k (+15%)"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={forecastSeries}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => fmtUnits(Number(v))}
                  domain={[480000, 640000]}
                />
                <Tooltip
                  formatter={(value, name) => [
                    value == null ? "—" : fmtUnits(Number(value)),
                    name === "priorForecast"
                      ? "Sep-25 forecast"
                      : "Actual / prelim",
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="installs"
                  name="Actual / prelim"
                  fill={COLORS.path}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                />
                <Line
                  type="monotone"
                  dataKey="priorForecast"
                  name="Sep-25 forecast"
                  stroke={COLORS.forecast}
                  strokeWidth={2.5}
                  strokeDasharray="6 4"
                  dot={{ r: 5 }}
                  connectNulls={false}
                />
                <ReferenceLine
                  y={HEADLINE.priorForecast2025}
                  stroke={COLORS.forecast}
                  strokeDasharray="2 2"
                  strokeOpacity={0.35}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Vintage deltas (prior print → prelim)"
          subtitle="Percentage-point flips and the 46k-unit forecast beat (k units when Δ is units)"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={deltaBars}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) =>
                    `${Number(v) > 0 ? "+" : ""}${Number(v).toFixed(0)}`
                  }
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={128}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  formatter={(value, _n, item) => {
                    const row = item?.payload as {
                      unit: string;
                      rawDelta: number;
                      priorLabel: string;
                      newLabel: string;
                      priorValue: number;
                      newValue: number;
                    };
                    const shown =
                      row.unit === "units" || row.unit === "k-units"
                        ? `+${fmtUnits(row.rawDelta)} units`
                        : row.unit === "pp"
                          ? fmtPp(row.rawDelta, 1)
                          : fmtPct(row.rawDelta, 1);
                    return [
                      `${shown} (${row.priorLabel} → ${row.newLabel})`,
                      "Δ",
                    ];
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
                  {deltaBars.map((d) => (
                    <Cell key={d.id} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Regional install share shift"
          subtitle="Asia absorbs +5 pp of the world flow; Europe loses −3 pp; Americas hold 9%"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={shareArea}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="vintage" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 100]}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${Number(value).toFixed(0)}%`,
                    String(name),
                  ]}
                />
                <Legend />
                {(Object.keys(REGION_COLORS) as RegionId[]).map((r) => (
                  <Area
                    key={r}
                    type="monotone"
                    dataKey={r}
                    stackId="1"
                    stroke={REGION_COLORS[r]}
                    fill={REGION_COLORS[r]}
                    fillOpacity={0.75}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Share rows:{" "}
            {SHARE_SHIFT.map((s) => (
              <span key={s.region} className="mr-3 inline-block">
                {s.region} {s.share2024}%→{s.share2025}% ({fmtPp(s.deltaPp)})
              </span>
            ))}
          </p>
        </ChartCard>

        <ChartCard
          title="Industry YoY — global rebound vs US mix"
          subtitle="Electronics +25% leads global; US food +30% and non-mfg +41% while US metal −15%"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={industryBars}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => fmtPct(Number(v))}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={88}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  formatter={(value, _n, item) => {
                    const row = item?.payload as {
                      scope: string;
                      units: number | null;
                    };
                    const extra =
                      row.units != null ? ` · ~${fmtUnits(row.units)}` : "";
                    return [
                      `${fmtPct(Number(value))} (${row.scope}${extra})`,
                      "YoY",
                    ];
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20}>
                  {industryBars.map((d) => (
                    <Cell key={d.id} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Region YoY flip: 2024 print → 2025 prelim"
          subtitle="Grouped bars — Americas swing from −10% to ~+12% (share-implied)"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={regionYoy}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => fmtPct(Number(v))}
                />
                <Tooltip
                  formatter={(value, name) => [
                    fmtPct(Number(value)),
                    name === "prior" ? "2024 YoY (WR)" : "2025 YoY (est.)",
                  ]}
                />
                <Legend />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Bar
                  dataKey="prior"
                  name="2024 YoY"
                  fill={COLORS.prior}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                />
                <Bar
                  dataKey="prelim"
                  name="2025 YoY est."
                  fill={COLORS.prelim}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Density × rank (robots / 10k employees)"
          subtitle="US #8 at 307; China methodology revision drops intensity to 166 / rank #22"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="rank"
                  name="Rank"
                  tick={{ fontSize: 11 }}
                  domain={[0, 25]}
                  label={{
                    value: "Rank (1 = densest)",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="density"
                  name="Density"
                  tick={{ fontSize: 11 }}
                  domain={[0, 1400]}
                />
                <ZAxis type="number" dataKey="z" range={[60, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => [
                    name === "density" ? String(value) : String(value),
                    name === "density" ? "Density" : "Rank",
                  ]}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as
                      | { name: string; note: string }
                      | undefined;
                    return p ? `${p.name} — ${p.note}` : "";
                  }}
                />
                <ReferenceLine
                  y={HEADLINE.densityWorld}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  label={{
                    value: "World 132",
                    position: "insideTopRight",
                    fontSize: 10,
                  }}
                />
                <Scatter name="Markets" data={densityScatter} fill={COLORS.density}>
                  {densityScatter.map((d) => (
                    <Cell
                      key={d.name}
                      fill={
                        d.name === "China*"
                          ? COLORS.prelim
                          : d.name === "US"
                            ? COLORS.path
                            : COLORS.density
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {marketFlip.length > 0 && (
        <ChartCard
          title="Market YoY flip (disclosed / estimated)"
          subtitle="US: −9% → +11%. Mexico still contracting. China 2025 country total estimated from IFR ~10× US."
        >
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={marketFlip}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => fmtPct(Number(v))}
                />
                <Tooltip
                  formatter={(value, name) => [
                    fmtPct(Number(value)),
                    name === "prior" ? "2024 YoY" : "2025 YoY",
                  ]}
                />
                <Legend />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Bar
                  dataKey="prior"
                  name="2024 YoY"
                  fill={COLORS.prior}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Bar
                  dataKey="prelim"
                  name="2025 YoY"
                  fill={COLORS.prelim}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
