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
  CENTER_TIERS,
  DIVISION_AGG,
  DIVISION_OPTIONS,
  DSA_GAP,
  DSA_SAMPLE,
  HEADLINE,
  MIRR_PATH,
  NATIONAL_PATH,
  SOURCE_NOTE,
  filterDsas,
  type DivisionFilter,
  type SortKey,
} from "@/data/kidney-wait-time-versus-dsa-transplant-rates-2026-data";

// viz-types: dual-line national path, grouped center-tier bars, DSA wait bars,
// wait-vs-rate scatter, division mortality bars, MIRR compression bars
// | controls: panel, division filter, sort, era toggle

type Panel =
  | "national-path"
  | "center-tiers"
  | "dsa-waits"
  | "wait-rate-cloud"
  | "division-mortality"
  | "mirr-gap";

const COLORS = {
  wait: "#0f4c5c",
  waitAlt: "#e36414",
  rate: "#1b7f5a",
  nonuse: "#9f1239",
  mortality: "#7c2d12",
  pre: "#64748b",
  post: "#0e7490",
  grid: "#e2e8f0",
  accent: "#c2410c",
};

const PANEL_LABELS: { id: Panel; label: string }[] = [
  { id: "national-path", label: "National path" },
  { id: "center-tiers", label: "Center tiers" },
  { id: "dsa-waits", label: "DSA waits" },
  { id: "wait-rate-cloud", label: "Wait vs rate" },
  { id: "division-mortality", label: "Division mortality" },
  { id: "mirr-gap", label: "MIRR gap" },
];

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "wait", label: "Sort: wait" },
  { id: "rate", label: "Sort: rate" },
  { id: "mortality", label: "Sort: mortality" },
  { id: "drop", label: "Sort: wait drop" },
];

function fmtMo(n: number) {
  return `${n.toFixed(0)} mo`;
}

function fmtRate(n: number) {
  return `${n.toFixed(1)}/100py`;
}

export function KidneyWaitTimeVersusDsaTransplantRates2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("national-path");
  const [division, setDivision] = useState<DivisionFilter>("all");
  const [sort, setSort] = useState<SortKey>("wait");
  const [showPre, setShowPre] = useState(true);

  const pathRows = useMemo(
    () =>
      NATIONAL_PATH.map((r) => ({
        label: r.label,
        year: r.year,
        wait: r.medianWaitMonths,
        rate: r.ddkTRatePer100Py,
        nonuse: r.nonusePct,
        era: r.era,
      })),
    [],
  );

  const tierRows = useMemo(
    () =>
      CENTER_TIERS.map((t) => ({
        tier: t.tier.replace(" centers", "").replace(" median", ""),
        full: t.tier,
        pre: t.waitPre,
        post: t.waitPost,
        gap: t.waitPre - t.waitPost,
      })),
    [],
  );

  const dsaRows = useMemo(() => {
    const rows = filterDsas(division, sort);
    return rows.map((d) => ({
      code: d.code,
      name: d.name,
      wait: d.waitMonthsPost,
      waitPre: d.waitMonthsPre,
      drop: d.waitMonthsPre - d.waitMonthsPost,
      rate: d.ddkTRate,
      mortality: d.mortalityPer100Py,
      division: d.division,
    }));
  }, [division, sort]);

  const scatterRows = useMemo(() => {
    const rows =
      division === "all"
        ? DSA_SAMPLE
        : DSA_SAMPLE.filter((d) => d.division === division);
    return rows.map((d) => ({
      code: d.code,
      wait: d.waitMonthsPost,
      rate: d.ddkTRate,
      mortality: d.mortalityPer100Py,
      candidates: d.candidates,
      division: d.division,
    }));
  }, [division]);

  const divisionRows = useMemo(
    () =>
      DIVISION_AGG.map((d) => ({
        division: d.division,
        wait: d.medianWait,
        rate: d.meanDdkTRate,
        mortality: d.meanMortality,
        n: d.dsaCount,
      })),
    [],
  );

  const mirrRows = MIRR_PATH.map((m) => ({
    era: m.era.includes("Pre") ? "Pre-KAS250" : "Post-KAS250",
    dsaMirr: m.dsaMirr,
    centerMirr: m.centerMirr,
    centerShare: m.centerSharePct,
  }));

  const title =
    panel === "national-path"
      ? "Median wait 61→58 months after KAS250"
      : panel === "center-tiers"
        ? "LWT vs SWT wait gap still ~20 months"
        : panel === "dsa-waits"
          ? "Median wait months by DSA sample"
          : panel === "wait-rate-cloud"
            ? "Wait vs DDKT-rate scatter by DSA"
            : panel === "division-mortality"
              ? "Pretransplant mortality 2.5–7.0 by DSA"
              : "DSA transplant-rate MIRR 1.35→1.17";

  return (
    <figure
      className="not-prose my-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      data-viz="kidney-wait-time-versus-dsa-transplant-rates-2026"
    >
      <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 via-teal-50/40 to-orange-50/30 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-teal-900/70">
          Kidney access · DSA geography after KAS250
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
          {title}
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          National median wait at transplant fell only {HEADLINE.waitDropMonths}{" "}
          months (61→58). Long-wait centers remain ~
          {HEADLINE.remainingCenterGapMonths} months above short-wait peers;
          DSA transplant-rate MIRR compressed to {HEADLINE.dsaMirrPost} while
          sample wait spread stays {DSA_GAP.waitSpread} months.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PANEL_LABELS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPanel(p.id)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                panel === p.id
                  ? "bg-teal-800 text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {DIVISION_OPTIONS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDivision(d.id)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                division === d.id
                  ? "bg-orange-700 text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {d.label}
            </button>
          ))}
          {(panel === "dsa-waits" || panel === "wait-rate-cloud") &&
            SORT_OPTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSort(s.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  sort === s.id
                    ? "bg-slate-800 text-white"
                    : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {s.label}
              </button>
            ))}
          {(panel === "center-tiers" || panel === "dsa-waits") && (
            <button
              type="button"
              onClick={() => setShowPre((v) => !v)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                showPre
                  ? "bg-slate-700 text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {showPre ? "Pre+post waits" : "Post waits only"}
            </button>
          )}
        </div>
      </div>

      <div className="px-2 py-4 sm:px-4">
        <div className="h-[360px] w-full sm:h-[400px]">
          {panel === "national-path" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={pathRows}
                margin={{ top: 12, right: 16, left: 4, bottom: 8 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  domain={[50, 70]}
                  label={{
                    value: "Median wait (mo)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11 },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  domain={[15, 35]}
                  label={{
                    value: "Rate / nonuse",
                    angle: 90,
                    position: "insideRight",
                    style: { fontSize: 11 },
                  }}
                />
                <Tooltip
                  formatter={(v, name) => {
                    const n = typeof v === "number" ? v : Number(v);
                    const key = String(name);
                    if (key === "wait") return [fmtMo(n), "Median wait"];
                    if (key === "rate") return [fmtRate(n), "DDKT rate"];
                    return [`${n}%`, "Nonuse"];
                  }}
                />
                <Legend />
                <ReferenceLine
                  yAxisId="left"
                  x="2021"
                  stroke={COLORS.accent}
                  strokeDasharray="4 4"
                  label={{ value: "KAS250", position: "top", fontSize: 10 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="wait"
                  name="Median wait"
                  stroke={COLORS.wait}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="rate"
                  name="DDKT rate"
                  stroke={COLORS.rate}
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  dot={{ r: 2 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="nonuse"
                  name="Nonuse %"
                  stroke={COLORS.nonuse}
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {panel === "center-tiers" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tierRows}
                margin={{ top: 12, right: 12, left: 4, bottom: 8 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="tier" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  domain={[40, 80]}
                  label={{
                    value: "Median wait (months)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11 },
                  }}
                />
                <Tooltip
                  formatter={(v, name) => {
                    const n = typeof v === "number" ? v : Number(v);
                    return [
                      fmtMo(n),
                      String(name) === "pre" ? "Pre-KAS250" : "Post-KAS250",
                    ];
                  }}
                />
                <Legend />
                {showPre && (
                  <Bar dataKey="pre" name="Pre-KAS250" fill={COLORS.pre} />
                )}
                <Bar dataKey="post" name="Post-KAS250" fill={COLORS.post} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {panel === "dsa-waits" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dsaRows}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  domain={[30, 90]}
                  label={{
                    value: "Median wait months",
                    position: "insideBottom",
                    offset: -2,
                    style: { fontSize: 11 },
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="code"
                  width={48}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  formatter={(v, name) => {
                    const n = typeof v === "number" ? v : Number(v);
                    return [
                      fmtMo(n),
                      String(name) === "waitPre" ? "Pre estimate" : "Post estimate",
                    ];
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as
                      | { name?: string; code?: string }
                      | undefined;
                    return p ? `${p.code} — ${p.name}` : "";
                  }}
                />
                <Legend />
                {showPre && (
                  <Bar
                    dataKey="waitPre"
                    name="Pre estimate"
                    fill={COLORS.pre}
                    opacity={0.55}
                  />
                )}
                <Bar dataKey="wait" name="Post estimate" fill={COLORS.wait}>
                  {dsaRows.map((r) => (
                    <Cell
                      key={r.code}
                      fill={
                        r.wait >= 60
                          ? COLORS.accent
                          : r.wait >= 50
                            ? COLORS.wait
                            : COLORS.rate
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {panel === "wait-rate-cloud" && (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="wait"
                  name="Wait"
                  tick={{ fontSize: 11 }}
                  domain={[35, 75]}
                  label={{
                    value: "Median wait months (post)",
                    position: "insideBottom",
                    offset: -4,
                    style: { fontSize: 11 },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="rate"
                  name="Rate"
                  tick={{ fontSize: 11 }}
                  domain={[12, 34]}
                  label={{
                    value: "DDKT rate / 100 py",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11 },
                  }}
                />
                <ZAxis type="number" dataKey="candidates" range={[60, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => {
                    const n = typeof v === "number" ? v : Number(v);
                    const key = String(name);
                    if (key === "wait") return [fmtMo(n), "Wait"];
                    if (key === "rate") return [fmtRate(n), "DDKT rate"];
                    return [n, key];
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as
                      | { code?: string; division?: string }
                      | undefined;
                    return p ? `${p.code} (${p.division})` : "";
                  }}
                />
                <Scatter
                  name="DSA sample"
                  data={scatterRows}
                  fill={COLORS.wait}
                >
                  {scatterRows.map((r) => (
                    <Cell
                      key={r.code}
                      fill={
                        r.division === "West"
                          ? "#0f766e"
                          : r.division === "Northeast"
                            ? "#c2410c"
                            : r.division === "South"
                              ? "#1d4ed8"
                              : "#854d0e"
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          )}

          {panel === "division-mortality" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={divisionRows}
                margin={{ top: 12, right: 16, left: 4, bottom: 8 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="division" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  domain={[2, 7]}
                  label={{
                    value: "Mortality / 100 py",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11 },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  domain={[35, 70]}
                  label={{
                    value: "Median wait (mo)",
                    angle: 90,
                    position: "insideRight",
                    style: { fontSize: 11 },
                  }}
                />
                <Tooltip />
                <Legend />
                <ReferenceLine
                  yAxisId="left"
                  y={HEADLINE.mortalityNational}
                  stroke={COLORS.pre}
                  strokeDasharray="4 4"
                  label={{
                    value: "Natl 4.7",
                    position: "insideTopRight",
                    fontSize: 10,
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="mortality"
                  name="Mean DSA mortality"
                  fill={COLORS.mortality}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="wait"
                  name="Median wait"
                  stroke={COLORS.wait}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {panel === "mirr-gap" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mirrRows}
                margin={{ top: 12, right: 12, left: 4, bottom: 8 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="era" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  domain={[1, 2.1]}
                  label={{
                    value: "Median incidence rate ratio",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11 },
                  }}
                />
                <Tooltip
                  formatter={(v, name) => {
                    const n = typeof v === "number" ? v : Number(v);
                    const key = String(name);
                    if (key === "centerShare")
                      return [`${n}%`, "Center share of geo var"];
                    return [
                      n.toFixed(2),
                      key === "dsaMirr" ? "DSA MIRR" : "Center MIRR",
                    ];
                  }}
                />
                <Legend />
                <Bar dataKey="dsaMirr" name="DSA MIRR" fill={COLORS.post} />
                <Bar
                  dataKey="centerMirr"
                  name="Center MIRR"
                  fill={COLORS.accent}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <figcaption className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600 sm:px-5">
        {SOURCE_NOTE}
      </figcaption>
    </figure>
  );
}
