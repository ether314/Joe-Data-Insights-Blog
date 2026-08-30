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
  AGE_BAND_NEVER_MARRIED,
  DUAL_TRACK,
  EDUCATION_CUTS,
  HEADLINE,
  MEDIAN_AGE_SERIES,
  NEVER_MARRIED_25_34,
  SEX_GAP_SERIES,
  SOURCE_NOTE,
  STATE_MEDIAN_AGES,
  VIZ_MARKERS,
} from "@/data/median-age-at-first-marriage-versus-never-married-share-2026-data";

type Panel =
  | "dual-track"
  | "age-path"
  | "never-married"
  | "age-share-scatter"
  | "state-ladder"
  | "gap-education";

type SexFocus = "both" | "men" | "women";
type RegionFilter = "All" | "Northeast" | "Midwest" | "South" | "West";

const PANEL_META: Record<Panel, { title: string; subtitle: string; btn: string }> = {
  "dual-track": {
    title: VIZ_MARKERS[0],
    subtitle: `Men ${HEADLINE.medianAgeMen2025} / women ${HEADLINE.medianAgeWomen2025} in ${HEADLINE.latestYear}; never-married 25–34 ~${HEADLINE.neverMarried2534LatestPct}%`,
    btn: "Dual track",
  },
  "age-path": {
    title: VIZ_MARKERS[1],
    subtitle: `+${HEADLINE.riseMenYears} years for men and women since the 1956 trough (${HEADLINE.troughMen1956} / ${HEADLINE.troughWomen1956})`,
    btn: "Median age path",
  },
  "never-married": {
    title: VIZ_MARKERS[2],
    subtitle: `From ~${HEADLINE.neverMarried2534_1960Pct}% in 1960 to ~${HEADLINE.neverMarried2534LatestPct}% — men ${HEADLINE.neverMarriedMenLatestPct}%, women ${HEADLINE.neverMarriedWomenLatestPct}%`,
    btn: "Never-married 25–34",
  },
  "age-share-scatter": {
    title: VIZ_MARKERS[3],
    subtitle: "Later first marriage and higher never-married shares move together across decades",
    btn: "Age × share scatter",
  },
  "state-ladder": {
    title: VIZ_MARKERS[4],
    subtitle: "ACS 2024 state medians — Northeast high, Mountain West low",
    btn: "State marriage-age ladder",
  },
  "gap-education": {
    title: VIZ_MARKERS[5],
    subtitle: `Sex gap ${HEADLINE.sexGap2025} years in 2025; bachelor+ cohorts marry later with higher never-married shares`,
    btn: "Sex gap & first birth",
  },
};

const TEAL = "#0d9488";
const ROSE = "#be123c";
const NAVY = "#1e3a5f";
const AMBER = "#d97706";
const SLATE = "#64748b";

export function MedianAgeAtFirstMarriageVersusNeverMarriedShare2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("dual-track");
  const [sexFocus, setSexFocus] = useState<SexFocus>("both");
  const [region, setRegion] = useState<RegionFilter>("All");

  const meta = PANEL_META[panel];

  const dualData = useMemo(() => {
    return DUAL_TRACK.map((d) => ({
      ...d,
      median:
        sexFocus === "men" ? d.medianMen : sexFocus === "women" ? d.medianWomen : (d.medianMen + d.medianWomen) / 2,
      neverPct:
        sexFocus === "men"
          ? d.neverMenPct
          : sexFocus === "women"
            ? d.neverWomenPct
            : d.neverBothPct,
    }));
  }, [sexFocus]);

  const agePath = useMemo(
    () =>
      MEDIAN_AGE_SERIES.map((r) => ({
        year: r.year,
        men: r.men,
        women: r.women,
        age: sexFocus === "women" ? r.women : r.men,
      })),
    [sexFocus],
  );

  const neverBars = useMemo(() => {
    return NEVER_MARRIED_25_34.map((r) => ({
      year: String(r.year),
      men: r.menPct,
      women: r.womenPct,
      both: r.bothPct,
      focus:
        sexFocus === "men" ? r.menPct : sexFocus === "women" ? r.womenPct : r.bothPct,
    }));
  }, [sexFocus]);

  const scatterData = useMemo(
    () =>
      DUAL_TRACK.map((d) => ({
        ...d,
        x: sexFocus === "men" ? d.medianMen : sexFocus === "women" ? d.medianWomen : (d.medianMen + d.medianWomen) / 2,
        y:
          sexFocus === "men"
            ? d.neverMenPct
            : sexFocus === "women"
              ? d.neverWomenPct
              : d.neverBothPct,
        z: 120,
      })),
    [sexFocus],
  );

  const stateLadder = useMemo(() => {
    const rows = STATE_MEDIAN_AGES.filter(
      (s) => s.state !== "United States" && (region === "All" || s.region === region),
    )
      .map((s) => ({
        ...s,
        age: sexFocus === "women" ? s.women : sexFocus === "men" ? s.men : (s.men + s.women) / 2,
        short: s.state.replace("New Hampshire", "N.H.").replace("West Virginia", "W.Va.").replace("Massachusetts", "Mass."),
      }))
      .sort((a, b) => b.age - a.age);
    return rows;
  }, [region, sexFocus]);

  const ageBandBars = useMemo(() => {
    const years = [1970, 1992, 2023] as const;
    return years.map((y) => {
      const b25 = AGE_BAND_NEVER_MARRIED.find((r) => r.year === y && r.band === "25–29");
      const b30 = AGE_BAND_NEVER_MARRIED.find((r) => r.year === y && r.band === "30–34");
      const pick = (row: typeof b25) =>
        !row
          ? 0
          : sexFocus === "men"
            ? row.menPct
            : sexFocus === "women"
              ? row.womenPct
              : (row.menPct + row.womenPct) / 2;
      return {
        year: String(y),
        "25–29": pick(b25),
        "30–34": pick(b30),
      };
    });
  }, [sexFocus]);

  const usRef =
    sexFocus === "women"
      ? 28.8
      : sexFocus === "men"
        ? 30.8
        : (30.8 + 28.8) / 2;

  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      data-viz="median-age-at-first-marriage-versus-never-married-share-2026"
    >
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-900 px-4 py-3 text-white sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-teal-200">
          First-marriage timing · Census MS-2 × ACS
        </p>
        <h3 className="mt-0.5 text-lg font-semibold leading-snug sm:text-xl">{meta.title}</h3>
        <p className="mt-1 text-sm text-slate-300">{meta.subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 px-3 py-3 sm:px-4">
        {(Object.keys(PANEL_META) as Panel[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPanel(p)}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium sm:text-sm ${
              panel === p ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {PANEL_META[p].btn}
          </button>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-3 px-3 pt-3 sm:px-4">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <span className="font-medium">Sex</span>
          <select
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
            value={sexFocus}
            onChange={(e) => setSexFocus(e.target.value as SexFocus)}
          >
            <option value="both">Both (avg / combined)</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
        </label>
        {panel === "state-ladder" && (
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <span className="font-medium">Region</span>
            <select
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
              value={region}
              onChange={(e) => setRegion(e.target.value as RegionFilter)}
            >
              {(["All", "Northeast", "Midwest", "South", "West"] as RegionFilter[]).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
        )}
        <p className="text-xs text-slate-500">
          Focus: {sexFocus} · trough→now +{HEADLINE.riseMenYears}y · never-married{" "}
          {HEADLINE.neverMarried2534_1960Pct}%→{HEADLINE.neverMarried2534LatestPct}%
        </p>
      </div>

      <div className="h-[400px] w-full px-2 pb-2 sm:px-3">
        {panel === "dual-track" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dualData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="age"
                tick={{ fontSize: 11 }}
                domain={[20, 32]}
                label={{ value: "Median age", angle: -90, position: "insideLeft", fontSize: 11 }}
              />
              <YAxis
                yAxisId="share"
                orientation="right"
                tick={{ fontSize: 11 }}
                domain={[0, 60]}
                tickFormatter={(v) => `${v}%`}
                label={{ value: "Never married %", angle: 90, position: "insideRight", fontSize: 11 }}
              />
              <Tooltip
                formatter={(value, name) => {
                  const v = typeof value === "number" ? value : Number(value);
                  if (String(name).includes("never") || name === "neverPct")
                    return [`${v.toFixed(1)}%`, "Never married 25–34"];
                  return [`${v.toFixed(1)} yrs`, "Median age"];
                }}
              />
              <Legend />
              <Bar yAxisId="share" dataKey="neverPct" name="Never married %" fill="#99f6e4" radius={[3, 3, 0, 0]} />
              <Line
                yAxisId="age"
                type="monotone"
                dataKey="median"
                name="Median age"
                stroke={NAVY}
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "age-path" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={agePath} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[19, 32]} />
              <Tooltip formatter={(v) => [`${Number(v).toFixed(1)} yrs`, "Age"]} />
              <Legend />
              <ReferenceLine y={HEADLINE.troughMen1956} stroke="#94a3b8" strokeDasharray="4 4" />
              {sexFocus === "both" ? (
                <>
                  <Line type="monotone" dataKey="men" name="Men" stroke={NAVY} strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="women" name="Women" stroke={ROSE} strokeWidth={2.5} dot={false} />
                </>
              ) : (
                <Line
                  type="monotone"
                  dataKey="age"
                  name={sexFocus === "men" ? "Men" : "Women"}
                  stroke={sexFocus === "men" ? NAVY : ROSE}
                  strokeWidth={2.5}
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "never-married" && (
          <ResponsiveContainer width="100%" height="100%">
            {sexFocus === "both" ? (
              <BarChart data={neverBars} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[0, 65]} />
                <Tooltip formatter={(v) => [`${Number(v).toFixed(1)}%`, ""]} />
                <Legend />
                <Bar dataKey="men" name="Men" fill={NAVY} radius={[3, 3, 0, 0]} />
                <Bar dataKey="women" name="Women" fill={ROSE} radius={[3, 3, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={ageBandBars} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[0, 75]} />
                <Tooltip formatter={(v) => [`${Number(v).toFixed(1)}%`, ""]} />
                <Legend />
                <Bar dataKey="25–29" name="Ages 25–29" fill={TEAL} radius={[3, 3, 0, 0]} />
                <Bar dataKey="30–34" name="Ages 30–34" fill={AMBER} radius={[3, 3, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}

        {panel === "age-share-scatter" && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 16, left: 8, bottom: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="x"
                name="Median age"
                domain={[21, 32]}
                tick={{ fontSize: 11 }}
                label={{ value: "Median age at first marriage", position: "insideBottom", offset: -4, fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Never married"
                domain={[0, 60]}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
                label={{ value: "Never married 25–34 %", angle: -90, position: "insideLeft", fontSize: 11 }}
              />
              <ZAxis type="number" dataKey="z" range={[80, 200]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name) => {
                  if (name === "y" || name === "Never married")
                    return [`${Number(value).toFixed(1)}%`, "Never married"];
                  if (name === "x" || name === "Median age")
                    return [`${Number(value).toFixed(1)} yrs`, "Median age"];
                  return [String(value), String(name)];
                }}
                labelFormatter={(_, payload) => {
                  const p = payload?.[0]?.payload as { year?: number } | undefined;
                  return p?.year ? String(p.year) : "";
                }}
              />
              <Scatter name="Decade" data={scatterData}>
                {scatterData.map((row) => (
                  <Cell
                    key={row.year}
                    fill={row.year >= 2010 ? TEAL : row.year >= 1990 ? AMBER : SLATE}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}

        {panel === "state-ladder" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stateLadder}
              layout="vertical"
              margin={{ top: 4, right: 24, left: 4, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[24, 34]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="short" width={72} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${Number(v).toFixed(1)} yrs`, "Median age"]} />
              <ReferenceLine x={usRef} stroke={AMBER} strokeDasharray="4 4" label="US" />
              <Bar dataKey="age" name="Median age" radius={[0, 4, 4, 0]}>
                {stateLadder.map((row) => (
                  <Cell
                    key={row.state}
                    fill={row.age >= usRef ? TEAL : row.age < usRef - 2 ? ROSE : NAVY}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "gap-education" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={EDUCATION_CUTS.map((e) => ({
                ...e,
                medianAge: sexFocus === "women" ? e.womenAge : e.menAge,
              }))}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="age"
                tick={{ fontSize: 11 }}
                domain={[24, 33]}
                label={{ value: "Median age", angle: -90, position: "insideLeft", fontSize: 11 }}
              />
              <YAxis
                yAxisId="share"
                orientation="right"
                tick={{ fontSize: 11 }}
                domain={[35, 65]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="share"
                dataKey="neverMarried2534Pct"
                name="Never married 25–34 %"
                fill="#fda4af"
                radius={[3, 3, 0, 0]}
              />
              <Line
                yAxisId="age"
                type="monotone"
                dataKey="medianAge"
                name={sexFocus === "women" ? "Women median age" : "Men median age"}
                stroke={NAVY}
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {panel === "gap-education" && (
        <div className="mx-3 mb-3 overflow-x-auto rounded-lg border border-slate-200 sm:mx-4">
          <table className="min-w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 font-medium">Year</th>
                <th className="px-3 py-2 font-medium">Sex gap (yrs)</th>
                <th className="px-3 py-2 font-medium">Men age</th>
                <th className="px-3 py-2 font-medium">Women age</th>
              </tr>
            </thead>
            <tbody>
              {SEX_GAP_SERIES.filter((r) =>
                [1956, 1970, 1990, 2010, 2020, 2025].includes(r.year),
              ).map((r) => (
                <tr key={r.year} className="border-t border-slate-100">
                  <td className="px-3 py-1.5">{r.year}</td>
                  <td className="px-3 py-1.5">{r.gapYears}</td>
                  <td className="px-3 py-1.5">{r.men}</td>
                  <td className="px-3 py-1.5">{r.women}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-slate-100 px-3 py-2 text-[11px] text-slate-500">
            NCHS mean age at first birth: {HEADLINE.meanAgeFirstBirth1970} (1970) →{" "}
            {HEADLINE.meanAgeFirstBirth2023} (2023). Education cuts are modeled ACS patterns.
          </p>
        </div>
      )}

      <p className="border-t border-slate-100 px-4 py-2 text-[11px] leading-relaxed text-slate-500">
        {SOURCE_NOTE}
      </p>
    </div>
  );
}
