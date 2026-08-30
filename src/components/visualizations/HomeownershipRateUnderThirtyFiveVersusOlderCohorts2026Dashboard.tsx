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
  ACS_HVS_CHECK,
  AGE_LADDER,
  ANNUAL_BY_AGE,
  HEADLINE,
  PRICE_VS_YOUNG,
  Q2_SNAPSHOTS,
  QUARTERLY_SINCE_2019,
  REGION_GAPS,
  SOURCE_NOTE,
  VIZ_MARKERS,
} from "@/data/homeownership-rate-under-thirty-five-versus-older-cohorts-2026-data";

type Panel =
  | "ladder"
  | "dual-path"
  | "gap-path"
  | "price-scatter"
  | "acs-check"
  | "region-gap";

type CohortFocus = "both" | "under35" | "age65" | "gap";
type EraFilter = "all" | "since2010" | "since2019";

const PANEL_META: Record<Panel, { title: string; subtitle: string; btn: string }> = {
  ladder: {
    title: VIZ_MARKERS[0],
    subtitle: `2026 Q2: under-35 ${HEADLINE.under35_2026q2}% vs 65+ ${HEADLINE.age65plus_2026q2}% — gap ${HEADLINE.gap_2026q2} pp`,
    btn: "Age ladder",
  },
  "dual-path": {
    title: VIZ_MARKERS[1],
    subtitle: `Q2 path: under-35 down ${Math.abs(HEADLINE.under35DeltaSince2019q2)} pp since 2019 while 65+ up ${HEADLINE.age65DeltaSince2019q2} pp`,
    btn: "Dual path",
  },
  "gap-path": {
    title: VIZ_MARKERS[2],
    subtitle: `65+ minus under-35: ${HEADLINE.gap_2019q2} pp in 2019 Q2 → ${HEADLINE.gap_2026q2} pp in 2026 Q2 (+${HEADLINE.gapWidenPpSince2019q2} pp)`,
    btn: "Ownership gap",
  },
  "price-scatter": {
    title: VIZ_MARKERS[3],
    subtitle: `FHFA purchase-only HPI +${HEADLINE.fhfaCumPctSince2019}% since 2019 as young ownership slipped`,
    btn: "Prices vs young",
  },
  "acs-check": {
    title: VIZ_MARKERS[4],
    subtitle: "ACS tenure-by-age composites track the HVS gap within a few points",
    btn: "ACS vs HVS",
  },
  "region-gap": {
    title: VIZ_MARKERS[5],
    subtitle: "Estimated regional under-35 vs 65+ gaps — West/Northeast young owners thinnest",
    btn: "Regional gap",
  },
};

const NAVY = "#1e3a5f";
const TEAL = "#0d9488";
const ROSE = "#be123c";
const AMBER = "#d97706";
const SLATE = "#64748b";
const INDIGO = "#4338ca";

export function HomeownershipRateUnderThirtyFiveVersusOlderCohorts2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("ladder");
  const [focus, setFocus] = useState<CohortFocus>("both");
  const [era, setEra] = useState<EraFilter>("all");

  const meta = PANEL_META[panel];

  const q2Path = useMemo(() => {
    const minYear = era === "since2019" ? 2019 : era === "since2010" ? 2010 : 1994;
    return Q2_SNAPSHOTS.filter((r) => r.year >= minYear).map((r) => ({
      ...r,
      focusRate:
        focus === "under35"
          ? r.under35
          : focus === "age65"
            ? r.age65plus
            : focus === "gap"
              ? r.gap6535
              : r.under35,
    }));
  }, [era, focus]);

  const gapAnnual = useMemo(() => {
    const minYear = era === "since2019" ? 2019 : era === "since2010" ? 2010 : 1994;
    return ANNUAL_BY_AGE.filter((r) => r.year >= minYear);
  }, [era]);

  const quarterly = useMemo(() => QUARTERLY_SINCE_2019, []);

  const ladderData = useMemo(
    () =>
      AGE_LADDER.map((b) => ({
        band: b.band,
        "2019 Q2": b.rate2019q2,
        "2026 Q2": b.rate2026q2,
        delta: b.deltaPp,
      })),
    [],
  );

  const acsGrouped = useMemo(() => {
    const years = [...new Set(ACS_HVS_CHECK.map((r) => r.year))].sort();
    return years.map((year) => {
      const acs = ACS_HVS_CHECK.find((r) => r.year === year && r.source === "ACS");
      const hvs = ACS_HVS_CHECK.find((r) => r.year === year && r.source === "HVS");
      return {
        year: String(year),
        acsGap: acs?.gap6535 ?? null,
        hvsGap: hvs?.gap6535 ?? null,
        acsU35: acs?.under35 ?? null,
        hvsU35: hvs?.under35 ?? null,
      };
    });
  }, []);

  const regionData = useMemo(
    () =>
      [...REGION_GAPS]
        .sort((a, b) => b.gapLatest - a.gapLatest)
        .map((r) => ({
          region: r.region,
          gapLatest: r.gapLatest,
          gap2019: r.gap2019,
          under35: r.under35_latest,
          age65: r.age65_latest,
        })),
    [],
  );

  const scatterPts = useMemo(
    () =>
      PRICE_VS_YOUNG.map((p) => ({
        ...p,
        x: p.hpiCumPctVs2019,
        y: focus === "age65" ? p.age65plus : focus === "gap" ? p.gap6535 : p.under35,
        z: 140,
      })),
    [focus],
  );

  return (
    <div
      data-viz="homeownership-rate-under-thirty-five-versus-older-cohorts-2026"
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            Census CPS/HVS · age of householder
          </p>
          <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">{meta.title}</h3>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">{meta.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="text-xs text-slate-500">
            Cohort focus
            <select
              className="ml-1 rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-800"
              value={focus}
              onChange={(e) => setFocus(e.target.value as CohortFocus)}
            >
              <option value="both">Both cohorts</option>
              <option value="under35">Under 35</option>
              <option value="age65">65+</option>
              <option value="gap">Gap (65+ − under 35)</option>
            </select>
          </label>
          <label className="text-xs text-slate-500">
            Era
            <select
              className="ml-1 rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-800"
              value={era}
              onChange={(e) => setEra(e.target.value as EraFilter)}
            >
              <option value="all">1994–present</option>
              <option value="since2010">Since 2010</option>
              <option value="since2019">Since 2019</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(PANEL_META) as Panel[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setPanel(key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              panel === key
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {PANEL_META[key].btn}
          </button>
        ))}
      </div>

      <div className="h-[380px] w-full sm:h-[420px]">
        {panel === "ladder" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ladderData} layout="vertical" margin={{ left: 56, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[30, 85]} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="band" width={52} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`${v}%`, ""]} />
              <Legend />
              <Bar dataKey="2019 Q2" fill={SLATE} radius={[0, 4, 4, 0]} />
              <Bar dataKey="2026 Q2" fill={TEAL} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "dual-path" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={era === "since2019" ? quarterly : q2Path}
              margin={{ left: 8, right: 12, top: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey={era === "since2019" ? "label" : "year"}
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis domain={[30, 85]} tickFormatter={(v) => `${v}%`} width={44} />
              <Tooltip />
              <Legend />
              {(focus === "both" || focus === "under35") && (
                <Line type="monotone" dataKey="under35" name="Under 35" stroke={ROSE} strokeWidth={2.5} dot={false} />
              )}
              {(focus === "both" || focus === "age65") && (
                <Line type="monotone" dataKey="age65plus" name="65+" stroke={NAVY} strokeWidth={2.5} dot={false} />
              )}
              {focus === "gap" && (
                <Line type="monotone" dataKey="gap6535" name="Gap pp" stroke={AMBER} strokeWidth={2.5} dot={false} />
              )}
              {focus === "both" && (
                <Area type="monotone" dataKey="us" name="US total" fill="#e2e8f0" stroke={SLATE} strokeWidth={1} />
              )}
              <ReferenceLine y={HEADLINE.under35_2019q2} stroke={ROSE} strokeDasharray="4 4" />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "gap-path" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={gapAnnual} margin={{ left: 8, right: 12, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis domain={[36, 46]} tickFormatter={(v) => `${v}`} width={40} />
              <Tooltip formatter={(v) => [`${v} pp`, "65+ − under 35"]} />
              <Area type="monotone" dataKey="gap6535" name="Gap (pp)" fill="#fef3c7" stroke={AMBER} strokeWidth={2.5} />
              <ReferenceLine y={HEADLINE.gap_2019_annual} stroke={SLATE} strokeDasharray="4 4" label="2019" />
              <ReferenceLine y={HEADLINE.peakGapPp} stroke={ROSE} strokeDasharray="3 3" />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "price-scatter" && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="x"
                name="HPI cum %"
                unit="%"
                tick={{ fontSize: 11 }}
                label={{ value: "FHFA HPI cumulative % vs 2019", position: "insideBottom", offset: -2, fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="rate"
                domain={focus === "gap" ? [38, 46] : focus === "age65" ? [76, 82] : [34, 42]}
                tick={{ fontSize: 11 }}
                width={44}
              />
              <ZAxis type="number" dataKey="z" range={[80, 200]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) => [
                  name === "y" ? `${v}${focus === "gap" ? " pp" : "%"}` : `${v}%`,
                  name === "y" ? (focus === "gap" ? "Gap" : focus === "age65" ? "65+" : "Under 35") : "HPI cum %",
                ]}
                labelFormatter={(_, payload) => {
                  const p = payload?.[0]?.payload as { year?: number } | undefined;
                  return p?.year != null ? String(p.year) : "";
                }}
              />
              <Scatter name="Year" data={scatterPts} fill={INDIGO}>
                {scatterPts.map((p) => (
                  <Cell key={p.year} fill={p.year >= 2024 ? ROSE : INDIGO} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}

        {panel === "acs-check" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={acsGrouped} margin={{ left: 8, right: 12, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" />
              <YAxis domain={[38, 46]} tickFormatter={(v) => `${v}`} width={40} />
              <Tooltip formatter={(v) => [`${v} pp`, ""]} />
              <Legend />
              <Bar dataKey="acsGap" name="ACS gap" fill={TEAL} radius={[4, 4, 0, 0]} />
              <Bar dataKey="hvsGap" name="HVS gap" fill={NAVY} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "region-gap" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionData} layout="vertical" margin={{ left: 72, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[35, 50]} tickFormatter={(v) => `${v}`} />
              <YAxis type="category" dataKey="region" width={68} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v, name) => [
                  `${v}${String(name).includes("under") || String(name).includes("age") ? "%" : " pp"}`,
                  String(name),
                ]}
              />
              <Legend />
              <Bar dataKey="gap2019" name="Gap 2019 (est.)" fill={SLATE} radius={[0, 4, 4, 0]} />
              <Bar dataKey="gapLatest" name="Gap latest (est.)" fill={AMBER} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
