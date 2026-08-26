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
  BACKLOG_SCATTER,
  HEADLINE,
  NATIONAL_PATH,
  REGION_AGG,
  REGION_OPTIONS,
  REGIONAL_YEAR_PATH,
  SLOWDOWN_LADDER,
  SOURCE_NOTE,
  filterStates,
  sortStates,
  type RegionFilter,
  type SortKey,
} from "@/data/time-to-disposition-for-civil-jury-cases-2026-data";

type Panel =
  | "disposition-band"
  | "state-ladder"
  | "clearance-scatter"
  | "slowdown-diverge"
  | "regional-years";

const COLORS = {
  median: "#1e3a5f",
  peak: "#9f1239",
  band: "#93c5fd",
  clear: "#0f766e",
  slower: "#dc2626",
  faster: "#059669",
  muted: "#94a3b8",
  region: {
    northeast: "#1d4ed8",
    midwest: "#0f766e",
    south: "#c2410c",
    west: "#7c3aed",
  } as Record<string, string>,
};

const PANEL_LABELS: { id: Panel; label: string }[] = [
  { id: "disposition-band", label: "Disposition band" },
  { id: "state-ladder", label: "State ladder" },
  { id: "clearance-scatter", label: "Clearance scatter" },
  { id: "slowdown-diverge", label: "Slowdown delta" },
  { id: "regional-years", label: "Regional years" },
];

const SORT_LABELS: { id: SortKey; label: string }[] = [
  { id: "medianDays2023", label: "2023 median days" },
  { id: "medianDays2021", label: "2021 peak" },
  { id: "deltaVs2019", label: "Delta vs 2019" },
  { id: "clearance2023Pct", label: "Clearance rate" },
  { id: "juryTrials2023", label: "Jury trials" },
];

function fmtDays(n: number) {
  return `${Math.round(n).toLocaleString("en-US")} days`;
}

function fmtSigned(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${Math.round(n)} days`;
}

export function TimeToDispositionForCivilJuryCases2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("disposition-band");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("medianDays2023");
  const [disclosedOnly, setDisclosedOnly] = useState(false);
  const [slowerOnly, setSlowerOnly] = useState(false);

  const ladderRows = useMemo(() => {
    let rows = filterStates(region);
    if (disclosedOnly) rows = rows.filter((r) => r.confidence === "disclosed");
    if (slowerOnly) rows = rows.filter((r) => r.gotSlower);
    return sortStates(rows, sortKey).slice(0, 18);
  }, [region, sortKey, disclosedOnly, slowerOnly]);

  const scatterRows = useMemo(() => {
    let rows = BACKLOG_SCATTER;
    if (region !== "all") rows = rows.filter((r) => r.region === region);
    if (disclosedOnly) rows = rows.filter((r) => r.confidence === "disclosed");
    return rows;
  }, [region, disclosedOnly]);

  const bandChart = useMemo(
    () =>
      NATIONAL_PATH.map((r) => ({
        year: r.year,
        median: r.medianDays,
        p25: r.p25,
        p75: r.p75,
        bandBase: r.p25,
        bandHeight: r.p75 - r.p25,
        clearance: r.medianClearancePct,
      })),
    [],
  );

  const regionalChart = useMemo(() => {
    const years = [2019, 2021, 2023];
    return REGION_AGG.map((r) => {
      const row: Record<string, string | number> = { label: r.label };
      for (const y of years) {
        const match = REGIONAL_YEAR_PATH.find(
          (p) => p.region === r.region && p.year === y,
        );
        row[`y${y}`] = match?.medianDays ?? 0;
      }
      return row;
    });
  }, []);

  const slowdownRows = useMemo(() => {
    let rows = SLOWDOWN_LADDER;
    if (slowerOnly) rows = rows.filter((r) => r.gotSlower);
    return rows.slice(0, 18);
  }, [slowerOnly]);

  return (
    <figure
      className="my-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      data-viz="time-to-disposition-for-civil-jury-cases-2026"
    >
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
          Interactive — civil jury disposition time
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900">
          Headline — median {HEADLINE.medianDays2023} days to disposition in{" "}
          {HEADLINE.latestYear}
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          {HEADLINE.pctAbove2019}% above 2019&apos;s {HEADLINE.medianDays2019}-day
          baseline and {HEADLINE.pctDownFromPeak}% below the {HEADLINE.peakYear}{" "}
          peak of {HEADLINE.medianDays2021} days. {ANALYTICS.statesGotSlower} of{" "}
          {HEADLINE.statesInPanel} panel states got slower;{" "}
          {ANALYTICS.slowest2023.state} leads at{" "}
          {fmtDays(ANALYTICS.slowest2023.medianDays2023)}.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">
        {PANEL_LABELS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPanel(p.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              panel === p.id
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
        <span className="text-xs font-medium uppercase text-slate-500">Region</span>
        {REGION_OPTIONS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRegion(r.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              region === r.id
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {(panel === "state-ladder" || panel === "clearance-scatter") && (
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-2 sm:px-5">
          <span className="text-xs font-medium uppercase text-slate-500">Sort</span>
          {SORT_LABELS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSortKey(s.id)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                sortKey === s.id
                  ? "bg-teal-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-2 sm:px-5">
        <button
          type="button"
          onClick={() => setDisclosedOnly((v) => !v)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
            disclosedOnly
              ? "bg-amber-700 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {disclosedOnly ? "Disclosed only" : "Include estimates"}
        </button>
        <button
          type="button"
          onClick={() => setSlowerOnly((v) => !v)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
            slowerOnly
              ? "bg-red-700 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {slowerOnly ? "Slower vs 2019 only" : "All panel states"}
        </button>
      </div>

      <div className="p-4 sm:p-5">
        {panel === "disposition-band" && (
          <div>
            <p className="mb-3 text-sm text-slate-600">
              Median days from filing to disposition for civil jury-track cases
              across the reporting panel, with interquartile band (p25–p75).
            </p>
            <ResponsiveContainer width="100%" height={340}>
              <ComposedChart data={bandChart} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="days"
                  tick={{ fontSize: 12 }}
                  label={{ value: "Days", angle: -90, position: "insideLeft", offset: 8 }}
                />
                <YAxis
                  yAxisId="clear"
                  orientation="right"
                  domain={[70, 120]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Clearance %",
                    angle: 90,
                    position: "insideRight",
                    offset: 8,
                  }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const v = Number(value);
                    if (name === "clearance") return [`${v}%`, "Clearance"];
                    return [fmtDays(v), String(name)];
                  }}
                />
                <Legend />
                <Area
                  yAxisId="days"
                  type="monotone"
                  dataKey="p75"
                  stackId="band"
                  fill="transparent"
                  stroke="none"
                  legendType="none"
                />
                <Area
                  yAxisId="days"
                  type="monotone"
                  dataKey="bandHeight"
                  stackId="band"
                  fill={COLORS.band}
                  fillOpacity={0.35}
                  stroke="none"
                  name="p25–p75 band"
                />
                <Line
                  yAxisId="days"
                  type="monotone"
                  dataKey="median"
                  stroke={COLORS.median}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  name="Median days"
                />
                <Line
                  yAxisId="clear"
                  type="monotone"
                  dataKey="clearance"
                  stroke={COLORS.clear}
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  dot={{ r: 3 }}
                  name="Clearance %"
                />
                <ReferenceLine
                  yAxisId="days"
                  y={HEADLINE.medianDays2019}
                  stroke={COLORS.muted}
                  strokeDasharray="5 5"
                  label={{ value: "2019 baseline", position: "insideTopRight", fontSize: 11 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "state-ladder" && (
          <div>
            <p className="mb-3 text-sm text-slate-600">
              State median disposition days in {HEADLINE.latestYear} — longest
              dockets at top.
            </p>
            <ResponsiveContainer width="100%" height={Math.max(320, ladderRows.length * 28)}>
              <BarChart
                data={ladderRows}
                layout="vertical"
                margin={{ top: 4, right: 48, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="abbr"
                  width={36}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value) => [fmtDays(Number(value)), "Median days"]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.state ?? ""
                  }
                />
                <Bar dataKey="medianDays2023" name="2023 median" radius={[0, 4, 4, 0]}>
                  {ladderRows.map((row) => (
                    <Cell
                      key={row.abbr}
                      fill={
                        row.gotSlower
                          ? COLORS.slower
                          : COLORS.faster
                      }
                    />
                  ))}
                </Bar>
                <ReferenceLine
                  x={HEADLINE.medianDays2023}
                  stroke={COLORS.median}
                  strokeDasharray="4 4"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "clearance-scatter" && (
          <div>
            <p className="mb-3 text-sm text-slate-600">
              Clearance rate vs median disposition days — bubble size = jury
              trials disposed in {HEADLINE.latestYear}.
            </p>
            <ResponsiveContainer width="100%" height={360}>
              <ScatterChart margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="clearance2023Pct"
                  name="Clearance"
                  domain={[85, 115]}
                  tick={{ fontSize: 11 }}
                  label={{ value: "Clearance rate (%)", position: "insideBottom", offset: -4 }}
                />
                <YAxis
                  type="number"
                  dataKey="medianDays2023"
                  name="Median days"
                  tick={{ fontSize: 11 }}
                  label={{ value: "Median days", angle: -90, position: "insideLeft", offset: 8 }}
                />
                <ZAxis type="number" dataKey="juryTrials2023" range={[60, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const d = payload[0].payload as (typeof scatterRows)[0];
                    return (
                      <div className="rounded border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <p className="font-semibold">{d.state}</p>
                        <p>{fmtDays(d.medianDays2023)}</p>
                        <p>Clearance: {d.clearance2023Pct}%</p>
                        <p>{fmtSigned(d.deltaVs2019)} vs 2019</p>
                        <p>{d.juryTrials2023.toLocaleString()} jury trials</p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatterRows} fill={COLORS.median}>
                  {scatterRows.map((row) => (
                    <Cell
                      key={row.abbr}
                      fill={COLORS.region[row.region] ?? COLORS.median}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "slowdown-diverge" && (
          <div>
            <p className="mb-3 text-sm text-slate-600">
              Change in median disposition days from 2019 to{" "}
              {HEADLINE.latestYear} — red = slower, green = faster.
            </p>
            <ResponsiveContainer width="100%" height={Math.max(320, slowdownRows.length * 28)}>
              <BarChart
                data={slowdownRows}
                layout="vertical"
                margin={{ top: 4, right: 48, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  domain={["dataMin - 20", "dataMax + 20"]}
                  tickFormatter={(v) => fmtSigned(v)}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="abbr"
                  width={36}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value) => [fmtSigned(Number(value)), "Delta vs 2019"]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.state ?? ""
                  }
                />
                <ReferenceLine x={0} stroke="#64748b" />
                <Bar dataKey="deltaVs2019" name="Delta vs 2019" radius={[0, 4, 4, 0]}>
                  {slowdownRows.map((row) => (
                    <Cell
                      key={row.abbr}
                      fill={row.deltaVs2019 >= 0 ? COLORS.slower : COLORS.faster}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "regional-years" && (
          <div>
            <p className="mb-3 text-sm text-slate-600">
              Regional median jury-disposition days at three anchor years — 2019
              baseline, {HEADLINE.peakYear} peak, and {HEADLINE.latestYear}.
            </p>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={regionalChart} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} label={{ value: "Days", angle: -90, position: "insideLeft", offset: 8 }} />
                <Tooltip formatter={(value) => [fmtDays(Number(value)), "Median days"]} />
                <Legend />
                <Bar dataKey="y2019" name="2019" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="y2021" name="2021" fill={COLORS.peak} radius={[4, 4, 0, 0]} />
                <Bar dataKey="y2023" name="2023" fill={COLORS.median} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <figcaption className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600 sm:px-5">
        {SOURCE_NOTE}
      </figcaption>
    </figure>
  );
}
