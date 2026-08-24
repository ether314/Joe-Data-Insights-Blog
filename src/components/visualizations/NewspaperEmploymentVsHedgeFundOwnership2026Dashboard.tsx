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
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  ACQUISITION_EVENTS,
  COUNTY_PANEL,
  HEADLINE,
  NATIONAL_EMPLOYMENT,
  OWNER_BUCKET_META,
  OWNER_COHORTS,
  OWNERSHIP_SHARE_TREND,
  REGION_GAPS,
  REGIONS,
  SOURCE_NOTE,
  SOURCES,
  countiesFor,
  fmtJobs,
  fmtPct,
  fmtPp,
  type OwnerBucket,
  type RegionId,
} from "@/data/newspaper-employment-vs-hedge-fund-ownership-2026-data";

// viz-types: national composed, cohort bars, county scatter, acquisition lines, region gap bars | layout: default

type ViewId = "national" | "cohorts" | "counties" | "events" | "regions";

const SLATE = "#64748b";

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
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        ) : null}
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

export function NewspaperEmploymentVsHedgeFundOwnership2026Dashboard() {
  const [view, setView] = useState<ViewId>("cohorts");
  const [region, setRegion] = useState<RegionId | "All">("All");
  const [bucket, setBucket] = useState<OwnerBucket | "All">("All");

  const counties = useMemo(
    () => countiesFor(region, bucket),
    [region, bucket],
  );

  const scatterData = useMemo(
    () =>
      counties.map((c) => ({
        ...c,
        fill: OWNER_BUCKET_META[c.ownerBucket].color,
      })),
    [counties],
  );

  const eventSeries = useMemo(() => {
    const rows = [
      { t: "T−2", key: "indexTminus2" as const },
      { t: "T0", key: "indexT0" as const },
      { t: "T+2", key: "indexTplus2" as const },
      { t: "T+4", key: "indexTplus4" as const },
    ];
    return rows.map((r) => {
      const point: Record<string, string | number> = { t: r.t };
      for (const ev of ACQUISITION_EVENTS) {
        if (bucket !== "All" && ev.ownerBucket !== bucket) continue;
        point[ev.label] = ev[r.key];
      }
      return point;
    });
  }, [bucket]);

  const eventKeys = useMemo(() => {
    return ACQUISITION_EVENTS.filter(
      (e) => bucket === "All" || e.ownerBucket === bucket,
    ).map((e) => ({
      key: e.label,
      color: OWNER_BUCKET_META[e.ownerBucket].color,
    }));
  }, [bucket]);

  const regionBars = useMemo(() => {
    if (region === "All") return REGION_GAPS;
    return REGION_GAPS.filter((r) => r.region === region);
  }, [region]);

  return (
    <div
      className="space-y-4"
      data-viz="newspaper-employment-vs-hedge-fund-ownership-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 px-5 py-4 text-white sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-rose-200">
          Newsroom jobs vs ownership
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {fmtPp(HEADLINE.hedgeVsIndepGapPp)} steeper median cut where the
          last paper is hedge/PE-linked
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Single-paper counties tagged to hedge/PE owners show a{" "}
          {fmtPct(HEADLINE.hedgeCountyMedianDecline2012_24Pct)} median
          newspaper-employment decline (2012→2024) versus{" "}
          {fmtPct(HEADLINE.independentCountyMedianDecline2012_24Pct)} for
          independent/family/nonprofit remnants — against a national industry
          that is already down {fmtPct(HEADLINE.jobsLostSince2005Pct)} since
          2005 ({fmtJobs(HEADLINE.industryJobs2024)} jobs left in 2024).
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={view}
          onChange={setView}
          options={[
            { id: "national", label: "National jobs" },
            { id: "cohorts", label: "Owner cohorts" },
            { id: "counties", label: "County scatter" },
            { id: "events", label: "Post-deal path" },
            { id: "regions", label: "Region gaps" },
          ]}
        />
        <ToggleGroup
          label="Region"
          value={region}
          onChange={setRegion}
          options={[
            { id: "All", label: "All" },
            ...REGIONS.map((r) => ({ id: r, label: r })),
          ]}
        />
        <ToggleGroup
          label="Owner"
          value={bucket}
          onChange={setBucket}
          options={[
            { id: "All", label: "All" },
            { id: "hedge_pe", label: "Hedge/PE" },
            { id: "public_chain", label: "Public" },
            { id: "private_chain", label: "Private" },
            { id: "independent", label: "Indep." },
          ]}
        />
      </div>

      {view === "national" ? (
        <ChartCard
          title="U.S. newspaper publishing employment"
          subtitle="Industry headcount (BLS/Medill) and newsroom subset — thousands of jobs"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={NATIONAL_EMPLOYMENT}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="industryJobsK"
                  name="Industry jobs (k)"
                  fill="#fda4af"
                  stroke="#e11d48"
                  fillOpacity={0.35}
                />
                <Line
                  type="monotone"
                  dataKey="newsroomJobsK"
                  name="Newsroom jobs (k)"
                  stroke="#0f172a"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 h-52 w-full min-w-0">
            <p className="mb-2 text-sm font-medium text-slate-700">
              Share of remaining papers by ownership class
            </p>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={OWNERSHIP_SHARE_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis unit="%" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="hedgePePaperSharePct"
                  name="Hedge/PE share"
                  stroke="#e11d48"
                  fill="#e11d48"
                  fillOpacity={0.25}
                />
                <Line
                  type="monotone"
                  dataKey="top10ChainPaperSharePct"
                  name="Top-10 chain share"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="independentPaperSharePct"
                  name="Independent share"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "cohorts" ? (
        <ChartCard
          title="Median county employment decline by remaining-paper owner"
          subtitle="2012→2024 % decline in newspaper NAICS jobs among single-paper counties (desk-modeled cohorts)"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={OWNER_COHORTS.filter(
                  (c) => bucket === "All" || c.id === bucket,
                )}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" unit="%" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={88}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="medianDeclinePct" name="Median decline %" radius={4}>
                  {OWNER_COHORTS.filter(
                    (c) => bucket === "All" || c.id === bucket,
                  ).map((c) => (
                    <Cell key={c.id} fill={c.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2 pr-3">Cohort</th>
                  <th className="py-2 pr-3">Median ↓</th>
                  <th className="py-2 pr-3">IQR</th>
                  <th className="py-2 pr-3">Counties</th>
                  <th className="py-2">Share of single-paper</th>
                </tr>
              </thead>
              <tbody>
                {OWNER_COHORTS.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100">
                    <td className="py-2 pr-3 font-medium text-slate-800">
                      <span
                        className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                        style={{ background: c.color }}
                      />
                      {c.label}
                    </td>
                    <td className="py-2 pr-3">{fmtPct(c.medianDeclinePct)}</td>
                    <td className="py-2 pr-3 text-slate-600">
                      {fmtPct(c.p25DeclinePct)}–{fmtPct(c.p75DeclinePct)}
                    </td>
                    <td className="py-2 pr-3">{c.countyN}</td>
                    <td className="py-2">
                      {fmtPct(c.shareOfSinglePaperCountiesPct)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      ) : null}

      {view === "counties" ? (
        <ChartCard
          title="County panel: 2012 jobs vs subsequent decline"
          subtitle={`${counties.length} illustrated counties — bubble size = 2024 remaining jobs`}
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="jobs2012"
                  name="Jobs 2012"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Newspaper jobs, 2012",
                    position: "insideBottom",
                    offset: -2,
                    style: { fontSize: 11, fill: SLATE },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="declinePct"
                  name="Decline %"
                  unit="%"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Decline %",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: SLATE },
                  }}
                />
                <ZAxis type="number" dataKey="jobs2024" range={[40, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const d = payload[0].payload as (typeof scatterData)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
                        <p className="font-semibold text-slate-900">
                          {d.county}, {d.state}
                        </p>
                        <p className="text-slate-600">
                          {OWNER_BUCKET_META[d.ownerBucket].label} ·{" "}
                          {d.ownerName}
                        </p>
                        <p className="mt-1 text-slate-700">
                          {d.jobs2012} → {d.jobs2024} jobs (
                          {fmtPct(d.declinePct)} ↓)
                        </p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatterData} name="Counties">
                  {scatterData.map((c) => (
                    <Cell key={c.id} fill={c.fill} fillOpacity={0.85} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
            {Object.entries(OWNER_BUCKET_META).map(([id, m]) => (
              <span key={id} className="inline-flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: m.color }}
                />
                {m.short}
              </span>
            ))}
          </div>
        </ChartCard>
      ) : null}

      {view === "events" ? (
        <ChartCard
          title="Newsroom index after major ownership events"
          subtitle="Indexed staff (deal year = 100). Filter by owner class above."
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={eventSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="t" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[50, 115]} />
                <Tooltip />
                <Legend />
                {eventKeys.map((k) => (
                  <Line
                    key={k.key}
                    type="monotone"
                    dataKey={k.key}
                    stroke={k.color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Published acquisition studies put the typical investment-owner
            relative cut near {fmtPct(HEADLINE.acquisitionRelativeCutPct)} versus
            non-investment peers; paths above are desk reconstructions around
            named waves, not firm-level BLS microdata.
          </p>
        </ChartCard>
      ) : null}

      {view === "regions" ? (
        <ChartCard
          title="Hedge/PE vs independent gap by Census region"
          subtitle="Median % employment decline gap (percentage points) in single-paper counties"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionBars}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" tick={{ fontSize: 12 }} />
                <YAxis unit="%" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="hedgeMedianDeclinePct"
                  name="Hedge/PE median ↓"
                  fill="#e11d48"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="independentMedianDeclinePct"
                  name="Independent median ↓"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {regionBars.map((r) => (
              <div
                key={r.region}
                className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {r.region}
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {fmtPp(r.gapPp)} gap
                </p>
                <p className="text-xs text-slate-500">n≈{r.countyN} counties</p>
              </div>
            ))}
          </div>
        </ChartCard>
      ) : null}

      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
        <p className="font-medium text-slate-800">Sources & method notes</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                className="text-sky-700 underline-offset-2 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-slate-500">
          Panel counties shown: {COUNTY_PANEL.length} illustrative cases for
          interaction; cohort medians use the fuller modeled n in the table.
        </p>
      </div>
    </div>
  );
}
