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
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ANALYTICS,
  COMPLEXITY_NONUSE_2024,
  DISCARD_REASON_SHIFT,
  DISCARD_VS_FILTERS,
  HEADLINE,
  HIGH_KDPI_WILLINGNESS,
  SOURCE_NOTE,
  filterOverallByEra,
  kdpiBandSeries,
  latestBandSnapshot,
  type BandFilter,
  type EraFilter,
} from "@/data/deceased-donor-kidney-discard-versus-offer-filters-2026-data";

type Panel =
  | "kdpi-bands"
  | "overall-trend"
  | "discard-vs-filters"
  | "complexity"
  | "willingness"
  | "reason-shift"
  | "filter-scatter";

const COLORS = {
  navy: "#0f2744",
  teal: "#0e7490",
  amber: "#b45309",
  rose: "#9f1239",
  slate: "#64748b",
  low: "#0e7490",
  mid: "#0369a1",
  high: "#b45309",
  veryHigh: "#9f1239",
  filter: "#7c3aed",
  grid: "#e2e8f0",
  area: "#bae6fd",
};

const PANEL_LABELS: { id: Panel; label: string }[] = [
  { id: "kdpi-bands", label: "KDPI band discard" },
  { id: "overall-trend", label: "Overall nonuse path" },
  { id: "discard-vs-filters", label: "Discard vs filters" },
  { id: "filter-scatter", label: "Filter uptake scatter" },
  { id: "complexity", label: "Complexity correlates" },
  { id: "willingness", label: "High-KDPI willingness" },
  { id: "reason-shift", label: "Reason shift" },
];

const ERA_OPTS: { id: EraFilter; label: string }[] = [
  { id: "all", label: "All years" },
  { id: "pre-kas250", label: "Pre-KAS250" },
  { id: "post-kas250", label: "Post-KAS250" },
  { id: "offer-filters", label: "Offer-filter era" },
];

const BAND_OPTS: { id: BandFilter; label: string }[] = [
  { id: "all", label: "All KDPI bands" },
  { id: "0-20", label: "KDPI 0–20" },
  { id: "21-34", label: "KDPI 21–34" },
  { id: "35-84", label: "KDPI 35–84" },
  { id: "85-100", label: "KDPI ≥85" },
];

const YEAR_OPTS = [2019, 2021, 2023, 2024] as const;

function bandColor(band: string) {
  if (band === "0-20") return COLORS.low;
  if (band === "21-34") return COLORS.mid;
  if (band === "35-84") return COLORS.high;
  return COLORS.veryHigh;
}

function fmtPct(n: number) {
  return `${n.toFixed(1)}%`;
}

export function DeceasedDonorKidneyDiscardVersusOfferFilters2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("kdpi-bands");
  const [era, setEra] = useState<EraFilter>("all");
  const [band, setBand] = useState<BandFilter>("all");
  const [willYear, setWillYear] = useState<(typeof YEAR_OPTS)[number]>(2024);

  const overall = useMemo(() => filterOverallByEra(era), [era]);

  const bandBars = useMemo(() => {
    return kdpiBandSeries(band === "all" ? "85-100" : band).map((r) => ({
      name: String(r.year),
      nonusePct: r.nonusePct,
      fill: bandColor(r.band),
    }));
  }, [band]);

  const bandGrouped = useMemo(() => {
    const years = [2019, 2021, 2022, 2023, 2024];
    return years.map((y) => {
      const rows = kdpiBandSeries("all", [y]);
      const get = (b: string) =>
        rows.find((r) => r.band === b)?.nonusePct ?? null;
      return {
        year: String(y),
        low: get("0-20"),
        midLow: get("21-34"),
        mid: get("35-84"),
        high: get("85-100"),
      };
    });
  }, []);

  const snapshot2024 = useMemo(() => latestBandSnapshot(2024), []);

  const dual = useMemo(() => {
    let rows = DISCARD_VS_FILTERS;
    if (era === "pre-kas250") rows = rows.filter((r) => r.year < 2021);
    if (era === "post-kas250") rows = rows.filter((r) => r.year >= 2021);
    if (era === "offer-filters") rows = rows.filter((r) => r.year >= 2022);
    return rows.map((r) => ({
      year: String(r.year),
      overall: r.overallNonusePct,
      highKdpi: r.highKdpiNonusePct,
      filters: r.filterAdoptionPct,
    }));
  }, [era]);

  const willingness = useMemo(
    () =>
      HIGH_KDPI_WILLINGNESS.filter((r) => r.year === willYear).map((r) => ({
        age: r.ageGroup,
        pct: r.willingHighKdpiPct,
        fill:
          r.ageGroup === "65+"
            ? COLORS.teal
            : r.ageGroup === "50-64"
              ? COLORS.mid
              : COLORS.slate,
      })),
    [willYear],
  );

  const reasonCompare = useMemo(() => {
    const reasons = [
      "Biopsy / organ quality",
      "No recipient located / list exhausted",
      "Other / operational",
    ];
    return reasons.map((reason) => {
      const pre = DISCARD_REASON_SHIFT.find(
        (r) => r.era === "pre-kas250" && r.reason === reason,
      );
      const post = DISCARD_REASON_SHIFT.find(
        (r) => r.era === "post-kas250" && r.reason === reason,
      );
      return {
        short: reason.split(" / ")[0],
        pre: pre?.sharePct ?? 0,
        post: post?.sharePct ?? 0,
      };
    });
  }, []);

  const scatterPoints = useMemo(
    () =>
      DISCARD_VS_FILTERS.filter((r) => r.filterAdoptionPct != null).map(
        (r) => ({
          filters: r.filterAdoptionPct as number,
          highKdpi: r.highKdpiNonusePct,
          overall: r.overallNonusePct,
          year: String(r.year),
          z: r.overallNonusePct,
        }),
      ),
    [],
  );

  return (
    <figure
      className="not-prose my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      data-viz="deceased-donor-kidney-discard-versus-offer-filters-2026"
    >
      <div className="border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">
          OPTN / SRTR · deceased-donor kidney utilization
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
          Headline — overall nonuse 29.3% in 2024; KDPI ≥85% still ~69.5%
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Offer filters reached roughly {HEADLINE.programsWithFilterPct}% of
          kidney programs, yet recovered-not-transplanted rates kept climbing
          after KAS250. High-KDPI kidneys remain the utilization bottleneck —
          about {ANALYTICS.highVsOverallRatio2024.toFixed(1)}× the overall
          nonuse rate in 2024.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="rounded-full bg-rose-50 px-2.5 py-1 text-rose-900">
            +{ANALYTICS.overallRisePp} pp overall since 2012
          </span>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-900">
            High-KDPI peak 72.5% (2023)
          </span>
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-violet-900">
            Filters national 2022 · defaults 2024
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Panels">
          {PANEL_LABELS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={panel === p.id}
              onClick={() => setPanel(p.id)}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                panel === p.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {ERA_OPTS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setEra(o.id)}
              className={`rounded-md px-2.5 py-1 text-xs transition ${
                era === o.id
                  ? "bg-cyan-800 text-white"
                  : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
              }`}
            >
              {o.label}
            </button>
          ))}
          {(panel === "kdpi-bands" || panel === "overall-trend") &&
            BAND_OPTS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setBand(o.id)}
                className={`rounded-md px-2.5 py-1 text-xs transition ${
                  band === o.id
                    ? "bg-amber-800 text-white"
                    : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                }`}
              >
                {o.label}
              </button>
            ))}
          {panel === "willingness" &&
            YEAR_OPTS.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setWillYear(y)}
                className={`rounded-md px-2.5 py-1 text-xs transition ${
                  willYear === y
                    ? "bg-teal-800 text-white"
                    : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                }`}
              >
                {y}
              </button>
            ))}
        </div>
      </div>

      <div className="px-2 py-4 sm:px-4">
        <div className="h-[360px] w-full sm:h-[400px]">
          {panel === "kdpi-bands" && band === "all" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bandGrouped}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 80]}
                />
                <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                <Legend />
                <Bar dataKey="low" name="KDPI 0–20" fill={COLORS.low} />
                <Bar dataKey="midLow" name="KDPI 21–34" fill={COLORS.mid} />
                <Bar dataKey="mid" name="KDPI 35–84" fill={COLORS.high} />
                <Bar dataKey="high" name="KDPI ≥85" fill={COLORS.veryHigh} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {panel === "kdpi-bands" && band !== "all" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={bandBars}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 80]}
                />
                <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                <Bar dataKey="nonusePct" name="Nonuse %" radius={[4, 4, 0, 0]}>
                  {bandBars.map((d, i) => (
                    <Cell key={i} fill={d.fill} />
                  ))}
                </Bar>
                <Line
                  type="monotone"
                  dataKey="nonusePct"
                  stroke={COLORS.navy}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Path"
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {panel === "overall-trend" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={overall}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[15, 32]}
                />
                <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                <Area
                  type="monotone"
                  dataKey="nonusePct"
                  fill={COLORS.area}
                  stroke="none"
                  name="Nonuse band"
                />
                <Line
                  type="monotone"
                  dataKey="nonusePct"
                  stroke={COLORS.rose}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  name="Overall nonuse %"
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {panel === "discard-vs-filters" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={dual}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 80]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 80]}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="highKdpi"
                  name="KDPI ≥85 nonuse %"
                  fill={COLORS.veryHigh}
                  opacity={0.85}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="overall"
                  stroke={COLORS.amber}
                  strokeWidth={2.5}
                  name="Overall nonuse %"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="filters"
                  stroke={COLORS.filter}
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  connectNulls={false}
                  name="Programs with filter %"
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {panel === "filter-scatter" && (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="filters"
                  name="Filter adoption %"
                  domain={[0, 70]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="number"
                  dataKey="highKdpi"
                  name="High-KDPI nonuse %"
                  domain={[60, 80]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <ZAxis type="number" dataKey="z" range={[120, 360]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => [
                    fmtPct(Number(v ?? 0)),
                    name === "filters"
                      ? "Filter adoption"
                      : name === "highKdpi"
                        ? "KDPI ≥85 nonuse"
                        : String(name ?? ""),
                  ]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.year
                      ? `Year ${payload[0].payload.year}`
                      : ""
                  }
                />
                <Scatter
                  name="Years with filter data"
                  data={scatterPoints}
                  fill={COLORS.filter}
                />
              </ScatterChart>
            </ResponsiveContainer>
          )}

          {panel === "complexity" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={COMPLEXITY_NONUSE_2024}
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 80]}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={128}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                <Bar
                  dataKey="nonusePct"
                  name="2024 nonuse %"
                  radius={[0, 4, 4, 0]}
                >
                  {COMPLEXITY_NONUSE_2024.map((d, i) => (
                    <Cell
                      key={i}
                      fill={
                        d.nonusePct >= 60
                          ? COLORS.veryHigh
                          : d.nonusePct >= 35
                            ? COLORS.high
                            : COLORS.teal
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {panel === "willingness" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={willingness}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="age" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 80]}
                />
                <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                <Bar
                  dataKey="pct"
                  name={`Willing to accept KDPI ≥85% (${willYear})`}
                  radius={[4, 4, 0, 0]}
                >
                  {willingness.map((d, i) => (
                    <Cell key={i} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {panel === "reason-shift" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reasonCompare}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 50]}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="pre"
                  name="Pre-KAS250 share"
                  fill={COLORS.slate}
                />
                <Bar
                  dataKey="post"
                  name="Post-KAS250 share"
                  fill={COLORS.rose}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {panel === "kdpi-bands" && band === "all" && (
        <div className="grid grid-cols-2 gap-2 border-t border-slate-100 px-4 py-3 text-xs text-slate-600 sm:grid-cols-4 sm:px-6">
          {snapshot2024.map((r) => (
            <div key={r.band} className="rounded-lg bg-slate-50 px-3 py-2">
              <div className="font-medium text-slate-800">{r.label}</div>
              <div className="text-lg font-semibold tabular-nums text-slate-900">
                {fmtPct(r.nonusePct)}
              </div>
              <div className="text-[11px] uppercase tracking-wide text-slate-400">
                2024 nonuse
              </div>
            </div>
          ))}
        </div>
      )}

      <figcaption className="space-y-2 border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600 sm:px-6">
        <p>
          Chart types: grouped bars, area+line path, dual-axis composed, scatter,
          horizontal bars. Controls: era window, KDPI band, willingness year.
          Offer-filter uptake rose while high-KDPI nonuse stayed near 70%.
        </p>
        <p className="text-slate-500">{SOURCE_NOTE}</p>
      </figcaption>
    </figure>
  );
}
