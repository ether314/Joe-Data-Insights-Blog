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
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ANALYTICS,
  HEADLINE,
  NCVS_REPORTING,
  OFFENSE_MIX,
  SOURCE_NOTE,
  VOLUME_SERIES,
  filterDualSeries,
  filterRegions,
  filterStates,
  type RegionFilter,
  type SeriesFilter,
} from "@/data/motor-vehicle-theft-rates-versus-violent-crime-rates-2026-data";

type Panel =
  | "dual-index"
  | "gap"
  | "regions"
  | "state-scatter"
  | "offense-mix"
  | "volume-ncvs";

type ScaleMode = "index" | "rate";

const COLORS = {
  mvt: "#be123c",
  violent: "#1d4ed8",
  gap: "#9f1239",
  gapFill: "#fecdd3",
  burglary: "#0f766e",
  larceny: "#64748b",
  volume: "#7c2d12",
  ncvs: "#0e7490",
  grid: "#e2e8f0",
  ref: "#94a3b8",
  west: "#b45309",
  midwest: "#047857",
  south: "#1e40af",
  northeast: "#6d28d9",
};

const PANEL_LABELS: { id: Panel; label: string }[] = [
  { id: "dual-index", label: "Dual index" },
  { id: "gap", label: "Divergence gap" },
  { id: "regions", label: "Regional Δ" },
  { id: "state-scatter", label: "State scatter" },
  { id: "offense-mix", label: "Offense mix" },
  { id: "volume-ncvs", label: "Volume + NCVS" },
];

const SERIES_LABELS: { id: SeriesFilter; label: string }[] = [
  { id: "all", label: "2009–2024" },
  { id: "post2019", label: "From 2019" },
  { id: "peak-window", label: "Peak window" },
];

const REGION_LABELS: { id: RegionFilter; label: string }[] = [
  { id: "all", label: "All regions" },
  { id: "west", label: "West" },
  { id: "midwest", label: "Midwest" },
  { id: "south", label: "South" },
  { id: "northeast", label: "Northeast" },
];

const REGION_COLOR: Record<string, string> = {
  west: COLORS.west,
  midwest: COLORS.midwest,
  south: COLORS.south,
  northeast: COLORS.northeast,
};

function fmtRate(n: number) {
  return n.toFixed(1);
}

function fmtPct(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

export function MotorVehicleTheftRatesVersusViolentCrimeRates2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("dual-index");
  const [seriesFilter, setSeriesFilter] = useState<SeriesFilter>("post2019");
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all");
  const [scaleMode, setScaleMode] = useState<ScaleMode>("index");
  const [showGapFill, setShowGapFill] = useState(true);

  const dualRows = useMemo(() => {
    return filterDualSeries(seriesFilter).map((r) => ({
      ...r,
      label: String(r.year),
      gapPos: Math.max(0, r.gapPoints),
    }));
  }, [seriesFilter]);

  const regionRows = useMemo(() => {
    return filterRegions(regionFilter).map((r) => ({
      ...r,
      name: r.label,
    }));
  }, [regionFilter]);

  const stateRows = useMemo(() => {
    return filterStates(regionFilter).map((s) => ({
      ...s,
      fill: REGION_COLOR[s.region] ?? COLORS.mvt,
      size: Math.max(60, Math.abs(s.divergenceSpread) * 4),
    }));
  }, [regionFilter]);

  const offenseRows = useMemo(
    () =>
      OFFENSE_MIX.map((r) => ({
        year: String(r.year),
        burglary: r.burglaryRate,
        larceny: r.larcenyRate,
        mvt: r.mvtRate,
        burglaryIdx: Number(((r.burglaryRate / 340.5) * 100).toFixed(1)),
        larcenyIdx: Number(((r.larcenyRate / 1549.5) * 100).toFixed(1)),
        mvtIdx: Number(((r.mvtRate / 219.9) * 100).toFixed(1)),
      })),
    [],
  );

  const volumeRows = useMemo(
    () =>
      VOLUME_SERIES.map((v) => {
        const ncvs = NCVS_REPORTING.find((n) => n.year === v.year);
        return {
          year: String(v.year),
          stolenK: Number((v.stolen / 1000).toFixed(0)),
          reportedPct: ncvs?.reportedPct ?? null,
          ucrIndex: ncvs?.ucrMvtIndex ?? null,
        };
      }),
    [],
  );

  const mvtKey = scaleMode === "index" ? "mvtIndex" : "mvtRate";
  const violentKey = scaleMode === "index" ? "violentIndex" : "violentRate";
  const mvtLabel =
    scaleMode === "index" ? "MV theft index (2019=100)" : "MV theft rate / 100k";
  const violentLabel =
    scaleMode === "index"
      ? "Violent index (2019=100)"
      : "Violent rate / 100k";

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      data-viz="motor-vehicle-theft-rates-versus-violent-crime-rates-2026"
    >
      <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-800">
            {ANALYTICS.smokeMarker}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
            MV theft index peaked at {HEADLINE.mvtIndex2023} in{" "}
            {HEADLINE.peakYear} while violent sat at {HEADLINE.violentIndex2023}{" "}
            (2019=100)
          </h3>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            After 2019 the motor-vehicle theft rate climbed much faster than the
            violent-crime rate, opening a {HEADLINE.peakGapPoints}-point index
            gap by 2023. The 2024 retreat closed part of that gap but left MV
            theft still above its 2019 baseline.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {PANEL_LABELS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPanel(p.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                panel === p.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <label className="flex items-center gap-1.5 text-slate-600">
            Window
            <select
              value={seriesFilter}
              onChange={(e) => setSeriesFilter(e.target.value as SeriesFilter)}
              className="rounded border border-slate-200 bg-white px-2 py-1 text-slate-800"
            >
              {SERIES_LABELS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1.5 text-slate-600">
            Region
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value as RegionFilter)}
              className="rounded border border-slate-200 bg-white px-2 py-1 text-slate-800"
            >
              {REGION_LABELS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-1 rounded-md border border-slate-200 p-0.5">
            {(["index", "rate"] as ScaleMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setScaleMode(m)}
                className={`rounded px-2 py-1 capitalize ${
                  scaleMode === m
                    ? "bg-rose-800 text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          {(panel === "dual-index" || panel === "gap") && (
            <label className="flex items-center gap-1.5 text-slate-600">
              <input
                type="checkbox"
                checked={showGapFill}
                onChange={(e) => setShowGapFill(e.target.checked)}
              />
              Gap fill
            </label>
          )}
        </div>
      </div>

      <div className="h-[360px] w-full sm:h-[400px]">
        {panel === "dual-index" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dualRows} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
              <Tooltip
                formatter={(value) => {
                  const n = typeof value === "number" ? value : Number(value);
                  return scaleMode === "index" ? n.toFixed(1) : fmtRate(n);
                }}
              />
              <Legend />
              <ReferenceLine
                y={scaleMode === "index" ? 100 : undefined}
                stroke={COLORS.ref}
                strokeDasharray="4 4"
              />
              {showGapFill && scaleMode === "index" && (
                <Area
                  type="monotone"
                  dataKey="gapPos"
                  name="Gap (MV − violent)"
                  fill={COLORS.gapFill}
                  stroke="none"
                  fillOpacity={0.55}
                />
              )}
              <Line
                type="monotone"
                dataKey={mvtKey}
                name={mvtLabel}
                stroke={COLORS.mvt}
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey={violentKey}
                name={violentLabel}
                stroke={COLORS.violent}
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "gap" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dualRows} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v) => {
                  const n = typeof v === "number" ? v : Number(v);
                  return `${n.toFixed(1)} pts`;
                }}
              />
              <ReferenceLine y={0} stroke={COLORS.ref} />
              {showGapFill && (
                <Area
                  type="monotone"
                  dataKey="gapPoints"
                  name="Index gap (pts)"
                  fill={COLORS.gapFill}
                  stroke={COLORS.gap}
                  strokeWidth={2}
                />
              )}
              {!showGapFill && (
                <Line
                  type="monotone"
                  dataKey="gapPoints"
                  name="Index gap (pts)"
                  stroke={COLORS.gap}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "regions" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={regionRows}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
            >
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(v) =>
                  fmtPct(typeof v === "number" ? v : Number(v))
                }
              />
              <Legend />
              <Bar
                dataKey="mvtDelta2019To2023Pct"
                name="MV theft Δ 2019→2023"
                fill={COLORS.mvt}
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="violentDelta2019To2023Pct"
                name="Violent Δ 2019→2023"
                fill={COLORS.violent}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "state-scatter" && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="violentDeltaPct"
                name="Violent Δ%"
                tick={{ fontSize: 11 }}
                unit="%"
                label={{
                  value: "Violent rate Δ% 2019→2023",
                  position: "insideBottom",
                  offset: -4,
                  fontSize: 11,
                }}
              />
              <YAxis
                type="number"
                dataKey="mvtDeltaPct"
                name="MV theft Δ%"
                tick={{ fontSize: 11 }}
                unit="%"
                label={{
                  value: "MV theft Δ%",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 11,
                }}
              />
              <ZAxis type="number" dataKey="size" range={[60, 280]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v) =>
                  typeof v === "number" ? `${v.toFixed(1)}%` : String(v ?? "")
                }
                labelFormatter={(_, payload) => {
                  const row = payload?.[0]?.payload as
                    | { state?: string; abbr?: string }
                    | undefined;
                  return row?.abbr ? `${row.state} (${row.abbr})` : "";
                }}
              />
              <ReferenceLine x={0} stroke={COLORS.ref} strokeDasharray="4 4" />
              <ReferenceLine y={0} stroke={COLORS.ref} strokeDasharray="4 4" />
              <Scatter name="States" data={stateRows}>
                {stateRows.map((s) => (
                  <Cell key={s.abbr} fill={s.fill} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}

        {panel === "offense-mix" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={offenseRows} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <ReferenceLine y={100} stroke={COLORS.ref} strokeDasharray="4 4" />
              <Bar dataKey="burglaryIdx" name="Burglary idx" fill={COLORS.burglary} />
              <Bar dataKey="larcenyIdx" name="Larceny idx" fill={COLORS.larceny} />
              <Line
                type="monotone"
                dataKey="mvtIdx"
                name="MV theft idx"
                stroke={COLORS.mvt}
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "volume-ncvs" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={volumeRows} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11 }}
                label={{
                  value: "Stolen (000s)",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 11,
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[70, 90]}
                tick={{ fontSize: 11 }}
                label={{
                  value: "NCVS reported %",
                  angle: 90,
                  position: "insideRight",
                  fontSize: 11,
                }}
              />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="stolenK"
                name="Stolen vehicles (000s)"
                fill={COLORS.volume}
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="reportedPct"
                name="NCVS % reported to police"
                stroke={COLORS.ncvs}
                strokeWidth={2.5}
                dot={{ r: 3 }}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
