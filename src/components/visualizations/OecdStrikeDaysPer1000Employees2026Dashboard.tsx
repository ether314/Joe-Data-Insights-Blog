"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  BAND_COUNTS,
  COUNTRY_LATEST,
  ETUI_DECADE,
  HEADLINE,
  SOURCE_NOTE,
  TREND_SERIES,
  VIZ_MARKERS,
  bumpRows,
  filterByRegion,
  scatterPairs,
  type IntensityBand,
  type Region,
} from "@/data/oecd-strike-days-per-1-000-employees-2026-data";

// viz-types: horizontal intensity ladder, multi-line trend, diverging bump bars, baseline-vs-recent scatter, intensity-band donut | layout: default

type PanelId = "ladder" | "trend" | "bump" | "scatter" | "bands";

type Horizon = "latest" | "avg2015_19" | "avg2020_21" | "avg2022_24";

type RegionFilter = "all" | Region;

const COLORS = {
  high: "#b91c1c",
  elevated: "#c2410c",
  moderate: "#0369a1",
  low: "#0f766e",
  minimal: "#94a3b8",
  bumpUp: "#b91c1c",
  bumpDown: "#0f766e",
  navy: "#0f172a",
  grid: "#e2e8f0",
  can: "#dc2626",
  fin: "#2563eb",
  fra: "#7c3aed",
  gbr: "#0891b2",
  deu: "#64748b",
  esp: "#ea580c",
  nor: "#0d9488",
  chl: "#ca8a04",
  kor: "#4f46e5",
  aus: "#059669",
  swe: "#db2777",
  usa: "#1e3a8a",
};

const TREND_COLOR: Record<string, string> = {
  CAN: COLORS.can,
  FIN: COLORS.fin,
  FRA: COLORS.fra,
  GBR: COLORS.gbr,
  DEU: COLORS.deu,
  ESP: COLORS.esp,
  NOR: COLORS.nor,
  CHL: COLORS.chl,
  KOR: COLORS.kor,
  AUS: COLORS.aus,
  SWE: COLORS.swe,
  USA: COLORS.usa,
};

const PANEL_OPTIONS: { id: PanelId; label: string }[] = [
  { id: "ladder", label: "Intensity ladder" },
  { id: "trend", label: "Country trends" },
  { id: "bump", label: "Post-2022 bump" },
  { id: "scatter", label: "Baseline vs recent" },
  { id: "bands", label: "Intensity bands" },
];

const REGION_OPTIONS: { id: RegionFilter; label: string }[] = [
  { id: "all", label: "All regions" },
  { id: "europe", label: "Europe" },
  { id: "north-america", label: "N. America" },
  { id: "latam", label: "LatAm" },
  { id: "asia-pacific", label: "Asia-Pacific" },
  { id: "other", label: "Other" },
];

const HORIZON_OPTIONS: { id: Horizon; label: string }[] = [
  { id: "latest", label: "Latest year" },
  { id: "avg2015_19", label: "2015–19 avg" },
  { id: "avg2020_21", label: "2020–21 avg" },
  { id: "avg2022_24", label: "2022–24 avg" },
];

function bandColor(band: IntensityBand): string {
  return COLORS[band];
}

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

function ToggleGroup<T extends string>({
  label,
  value,
  options,
  onChange,
  testId,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  testId?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2" data-testid={testId}>
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

function rateForHorizon(
  row: (typeof COUNTRY_LATEST)[number],
  horizon: Horizon,
): number | null {
  if (horizon === "latest") return row.latestRate;
  if (horizon === "avg2015_19") return row.avg2015_19;
  if (horizon === "avg2020_21") return row.avg2020_21;
  return row.avg2022_24;
}

function shortName(country: string): string {
  return country
    .replace("United Kingdom", "UK")
    .replace("United States", "U.S.")
    .replace("Slovak Republic", "Slovakia");
}

export function OecdStrikeDaysPer1000Employees2026Dashboard() {
  const [panel, setPanel] = useState<PanelId>("ladder");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [horizon, setHorizon] = useState<Horizon>("latest");
  const [hideCaution, setHideCaution] = useState(false);
  const [trendFocus, setTrendFocus] = useState<string[]>([
    "CAN",
    "FIN",
    "FRA",
    "GBR",
    "DEU",
    "USA",
  ]);

  const pool = useMemo(() => {
    let rows = filterByRegion(region);
    if (hideCaution) rows = rows.filter((r) => !r.caution);
    return rows;
  }, [region, hideCaution]);

  const ladderData = useMemo(() => {
    return pool
      .map((r) => {
        const rate = rateForHorizon(r, horizon);
        if (rate == null) return null;
        return {
          name: shortName(r.country),
          full: r.country,
          rate: Number(rate.toFixed(1)),
          year: horizon === "latest" ? r.latestYear : null,
          band: r.band,
          fill: bandColor(r.band),
          source: r.source,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x != null)
      .sort((a, b) => b.rate - a.rate);
  }, [pool, horizon]);

  const bumpData = useMemo(() => {
    const allowed = new Set(pool.map((r) => r.iso3));
    return bumpRows()
      .filter((r) => allowed.has(r.iso3))
      .map((r) => ({
        name: shortName(r.country),
        delta: r.delta,
        fill: r.delta >= 0 ? COLORS.bumpUp : COLORS.bumpDown,
        reversed: r.reversedIn2024,
      }));
  }, [pool]);

  const scatterData = useMemo(() => {
    const allowed = new Set(pool.map((r) => r.iso3));
    return scatterPairs()
      .filter((r) => allowed.has(r.iso3))
      .map((r) => ({
        ...r,
        name: shortName(r.country),
        fill: bandColor(r.band),
      }));
  }, [pool]);

  const bandPie = useMemo(() => {
    const counts: Record<IntensityBand, number> = {
      high: 0,
      elevated: 0,
      moderate: 0,
      low: 0,
      minimal: 0,
    };
    for (const r of pool) counts[r.band] += 1;
    return (Object.keys(counts) as IntensityBand[]).map((b) => ({
      name: b,
      value: counts[b],
      fill: bandColor(b),
    }));
  }, [pool]);

  const trendChartData = useMemo(() => {
    const years = [
      ...new Set(
        TREND_SERIES.filter((p) => trendFocus.includes(p.iso3)).map((p) => p.year),
      ),
    ].sort((a, b) => a - b);
    return years.map((year) => {
      const row: Record<string, number | string> = { year };
      for (const iso of trendFocus) {
        const hit = TREND_SERIES.find((p) => p.iso3 === iso && p.year === year);
        if (hit) row[iso] = hit.rate;
      }
      return row;
    });
  }, [trendFocus]);

  const etuiContext = useMemo(() => {
    return ETUI_DECADE.filter((d) => d.avg2020_21 != null || d.avg2010_19 != null)
      .map((d) => ({
        name: shortName(d.country),
        a00: d.avg2000_09,
        a10: d.avg2010_19,
        a20: d.avg2020_21,
      }))
      .slice(0, 8);
  }, []);

  const ladderHeight = Math.max(320, ladderData.length * 28);

  function toggleTrend(iso: string) {
    setTrendFocus((prev) =>
      prev.includes(iso) ? prev.filter((x) => x !== iso) : [...prev, iso],
    );
  }

  return (
    <div
      className="space-y-4"
      data-viz={VIZ_MARKERS.root}
      id={VIZ_MARKERS.root}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <ToggleGroup
          label="Panel"
          value={panel}
          options={PANEL_OPTIONS}
          onChange={setPanel}
        />
        <p className="max-w-xl text-xs text-slate-500">
          Days not worked per 1,000 employees. Canada’s 2023 peak ({HEADLINE.canada2023})
          and Finland’s 2022 spike ({HEADLINE.finland2022}) dominate the recent tail;
          UK 2024 ({HEADLINE.uk2024}) shows a sharp post-wave cool-down.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <ToggleGroup
          label="Region"
          value={region}
          options={REGION_OPTIONS}
          onChange={setRegion}
          testId={VIZ_MARKERS.controlRegion}
        />
        {panel === "ladder" ? (
          <ToggleGroup
            label="Horizon"
            value={horizon}
            options={HORIZON_OPTIONS}
            onChange={setHorizon}
            testId={VIZ_MARKERS.controlHorizon}
          />
        ) : null}
        <label
          className="flex items-center gap-2 text-sm text-slate-700"
          data-testid={VIZ_MARKERS.controlBand}
        >
          <input
            type="checkbox"
            checked={hideCaution}
            onChange={(e) => setHideCaution(e.target.checked)}
            className="rounded border-slate-300"
          />
          Hide caution / gap-fill rows
        </label>
      </div>

      {panel === "ladder" ? (
        <div data-viz={VIZ_MARKERS.panelLadder}>
          <ChartCard
            title="Strike intensity ladder"
            subtitle="Days not worked per 1,000 employees — toggle horizon to compare period averages"
          >
            <ResponsiveContainer width="100%" height={ladderHeight}>
              <BarChart
                data={ladderData}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={88}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v) => [`${Number(v)} days / 1,000`, "Intensity"]}
                  labelFormatter={(l) => String(l)}
                />
                <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                  {ladderData.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      {panel === "trend" ? (
        <div data-viz={VIZ_MARKERS.panelTrend} className="space-y-3">
          <ChartCard
            title="Country trajectories"
            subtitle="Annual rates — spikes are the story; multi-year averages smooth them"
          >
            <div className="mb-3 flex flex-wrap gap-2">
              {Object.keys(TREND_COLOR).map((iso) => {
                const label =
                  COUNTRY_LATEST.find((c) => c.iso3 === iso)?.country ?? iso;
                const on = trendFocus.includes(iso);
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => toggleTrend(iso)}
                    className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
                      on
                        ? "border-slate-800 text-white"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                    style={on ? { backgroundColor: TREND_COLOR[iso] } : undefined}
                  >
                    {shortName(label)}
                  </button>
                );
              })}
            </div>
            <ResponsiveContainer width="100%" height={380}>
              <ComposedChart
                data={trendChartData}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                {trendFocus.map((iso) => (
                  <Line
                    key={iso}
                    type="monotone"
                    dataKey={iso}
                    name={shortName(
                      COUNTRY_LATEST.find((c) => c.iso3 === iso)?.country ?? iso,
                    )}
                    stroke={TREND_COLOR[iso]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      {panel === "bump" ? (
        <div data-viz={VIZ_MARKERS.panelBump}>
          <ChartCard
            title="Did 2022–24 exceed 2015–19?"
            subtitle="Δ days per 1,000 (recent avg − baseline avg). Red = hotter than late-2010s baseline."
          >
            <ResponsiveContainer width="100%" height={Math.max(320, bumpData.length * 30)}>
              <BarChart
                data={bumpData}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={88} tick={{ fontSize: 11 }} />
                <ReferenceLine x={0} stroke={COLORS.navy} />
                <Tooltip
                  formatter={(v) => {
                    const n = Number(v);
                    return [`${n > 0 ? "+" : ""}${n}`, "Δ days/1,000"];
                  }}
                />
                <Bar dataKey="delta" radius={[0, 4, 4, 0]}>
                  {bumpData.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      {panel === "scatter" ? (
        <div data-viz={VIZ_MARKERS.panelScatter}>
          <ChartCard
            title="Baseline vs recent intensity"
            subtitle="2015–19 average (x) against 2022–24 average (y). Points above the diagonal heated up."
          >
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                <XAxis
                  type="number"
                  dataKey="baseline"
                  name="2015–19 avg"
                  tick={{ fontSize: 11 }}
                  label={{ value: "2015–19 avg", position: "insideBottom", offset: -4, fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="recent"
                  name="2022–24 avg"
                  tick={{ fontSize: 11 }}
                  label={{ value: "2022–24 avg", angle: -90, position: "insideLeft", fontSize: 11 }}
                />
                <ZAxis range={[60, 60]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => [v, String(name)]}
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as { name?: string } | undefined;
                    return row?.name ? String(row.name) : "";
                  }}
                />
                <ReferenceLine x={0} y={0} stroke="transparent" />
                <ReferenceLine
                  ifOverflow="extendDomain"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  segment={[
                    { x: 0, y: 0 },
                    { x: 400, y: 400 },
                  ]}
                />
                <Scatter data={scatterData} name="Countries">
                  {scatterData.map((d) => (
                    <Cell key={d.iso3} fill={d.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      {panel === "bands" ? (
        <div data-viz={VIZ_MARKERS.panelBands} className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Latest-year intensity bands"
            subtitle={`High ≥100 · Elevated ≥40 · Moderate ≥15 · Low ≥5 · Minimal <5 (n=${pool.length})`}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bandPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={100}
                  paddingAngle={2}
                  label={({ name, value }) =>
                    value > 0 ? `${name}: ${value}` : ""
                  }
                >
                  {bandPie.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <p className="mt-2 text-xs text-slate-500">
              Full panel counts (unfiltered): high {BAND_COUNTS.high}, elevated{" "}
              {BAND_COUNTS.elevated}, moderate {BAND_COUNTS.moderate}, low{" "}
              {BAND_COUNTS.low}, minimal {BAND_COUNTS.minimal}.
            </p>
          </ChartCard>
          <ChartCard
            title="ETUI Europe context (decade avgs)"
            subtitle="Gap-fill / long-run context where ILOSTAT totals are thin"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={etuiContext} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="a00" name="2000–09" fill="#64748b" />
                <Bar dataKey="a10" name="2010–19" fill="#0369a1" />
                <Bar dataKey="a20" name="2020–21" fill="#b91c1c" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
