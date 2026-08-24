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
  ANALYTICS,
  COUNTY_DRIVES,
  DRIVE_BANDS,
  HEADLINE,
  MARGIN_STRESS,
  PAYMENT_MIX,
  REGION_SUMMARY,
  SOURCE_NOTE,
  STATE_LADDER,
  VINTAGE_PATH,
  countiesByKind,
  countiesByRegion,
  fmtInt,
  fmtMin,
  fmtPct,
  fmtPopK,
  statesByRegion,
  type ClosureKind,
  type RegionId,
} from "@/data/rural-hospital-closures-and-drive-times-2026-data";

// viz-types: vintage stacked area+cumulative line, state ladder bars,
// county before/after scatter, drive-band bars, region summary,
// margin-stress composed | layout: default
// smoke-marker: Added drive minutes post-closure

type ViewId = "vintage" | "states" | "counties" | "bands" | "stress";
type RegionFilter = "all" | RegionId;
type KindFilter = "all" | ClosureKind;
type ScatterLens = "added" | "after" | "pop";

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const SKY = "#0284c8";

const REGION_COLORS: Record<string, string> = {
  South: ROSE,
  Midwest: TEAL,
  West: AMBER,
  Northeast: INDIGO,
};

const BAND_COLORS = [SKY, TEAL, AMBER, ROSE];

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
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            value === o.id
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function RuralHospitalClosuresAndDriveTimes2026Dashboard() {
  const [view, setView] = useState<ViewId>("counties");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [kind, setKind] = useState<KindFilter>("all");
  const [lens, setLens] = useState<ScatterLens>("added");

  const counties = useMemo(() => {
    const byRegion = countiesByRegion(region);
    if (kind === "all") return byRegion;
    return byRegion.filter((c) => c.kind === kind);
  }, [region, kind]);

  const states = useMemo(() => statesByRegion(region), [region]);

  const scatterData = useMemo(
    () =>
      counties.map((c) => ({
        ...c,
        x: c.beforeMin,
        y: lens === "after" ? c.afterMin : lens === "pop" ? c.popK : c.addedMin,
        z: Math.max(40, Math.min(280, c.popK * 2)),
        fill: REGION_COLORS[c.region] || TEAL,
      })),
    [counties, lens],
  );

  const yLabel =
    lens === "after"
      ? "Minutes after closure"
      : lens === "pop"
        ? "County population (thousands)"
        : "Added drive minutes";

  return (
    <div
      className="space-y-6"
      data-viz="rural-hospital-closures-and-drive-times-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
          Added drive minutes post-closure
        </p>
        <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          +{HEADLINE.medianAddedDriveMin} minutes
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Median added road minutes to the nearest open emergency department
          across mapped counties that lost a rural hospital since 2005 — on a
          Sheps Center base of {fmtInt(HEADLINE.totalClosuresConversions)}{" "}
          closures and conversions in {HEADLINE.statesAffected} states.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <p className="text-xs text-slate-400">Sheps events</p>
            <p className="text-lg font-semibold">
              {fmtInt(HEADLINE.totalClosuresConversions)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Complete / converted</p>
            <p className="text-lg font-semibold">
              {HEADLINE.completeClosures} / {HEADLINE.convertedClosures}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">≥30 min added</p>
            <p className="text-lg font-semibold">
              {fmtPct(HEADLINE.shareAddedGe30Pct)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Pop. exposed</p>
            <p className="text-lg font-semibold">{HEADLINE.popExposedM}M</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup<ViewId>
          value={view}
          onChange={setView}
          options={[
            { id: "counties", label: "County drive times" },
            { id: "vintage", label: "Closure vintage" },
            { id: "states", label: "State ladder" },
            { id: "bands", label: "Added-minute bands" },
            { id: "stress", label: "Margin stress" },
          ]}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div>
          <p className="mb-1 text-xs font-medium text-slate-500">Region</p>
          <ToggleGroup<RegionFilter>
            value={region}
            onChange={setRegion}
            options={[
              { id: "all", label: "All regions" },
              { id: "South", label: "South" },
              { id: "Midwest", label: "Midwest" },
              { id: "West", label: "West" },
              { id: "Northeast", label: "Northeast" },
            ]}
          />
        </div>
        {(view === "counties" || view === "states") && (
          <div>
            <p className="mb-1 text-xs font-medium text-slate-500">
              Closure kind
            </p>
            <ToggleGroup<KindFilter>
              value={kind}
              onChange={setKind}
              options={[
                { id: "all", label: "All kinds" },
                { id: "complete", label: "Complete" },
                { id: "converted", label: "Converted" },
              ]}
            />
          </div>
        )}
        {view === "counties" && (
          <div>
            <p className="mb-1 text-xs font-medium text-slate-500">
              Scatter lens
            </p>
            <ToggleGroup<ScatterLens>
              value={lens}
              onChange={setLens}
              options={[
                { id: "added", label: "Added minutes" },
                { id: "after", label: "After minutes" },
                { id: "pop", label: "Population" },
              ]}
            />
          </div>
        )}
      </div>

      {view === "counties" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="County drive-time scatter"
            subtitle="Nearest-ED minutes before vs after · bubble ≈ county population"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Before"
                    unit=" min"
                    tick={{ fontSize: 11, fill: SLATE }}
                    label={{
                      value: "Minutes before closure",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                      fill: SLATE,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Y"
                    tick={{ fontSize: 11, fill: SLATE }}
                    label={{
                      value: yLabel,
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                      fill: SLATE,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[40, 280]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const d = payload[0].payload as (typeof scatterData)[0];
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                          <p className="font-semibold text-slate-900">
                            {d.county} County, {d.abbr}
                          </p>
                          <p className="text-slate-600">
                            {d.hospitalName} · {d.year} · {d.kind}
                          </p>
                          <p className="mt-1 text-slate-700">
                            Before {fmtMin(d.beforeMin)} → after{" "}
                            {fmtMin(d.afterMin)} (+{d.addedMin})
                          </p>
                          <p className="text-slate-500">
                            Pop. {fmtPopK(d.popK)}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={scatterData} name="Counties">
                    {scatterData.map((d) => (
                      <Cell key={d.id} fill={d.fill} fillOpacity={0.85} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Nearest-ED minutes before vs after"
            subtitle={`${counties.length} mapped counties · sorted by added minutes`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...counties]
                    .sort((a, b) => b.addedMin - a.addedMin)
                    .slice(0, 12)
                    .map((c) => ({
                      name: `${c.county}, ${c.abbr}`,
                      before: c.beforeMin,
                      after: c.afterMin,
                      added: c.addedMin,
                    }))}
                  layout="vertical"
                  margin={{ top: 4, right: 12, bottom: 4, left: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: SLATE }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fontSize: 10, fill: SLATE }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="before" name="Before" fill={SKY} stackId="a" />
                  <Bar
                    dataKey="added"
                    name="Added"
                    fill={ROSE}
                    stackId="a"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "vintage" && (
        <ChartCard
          title="Closure vintage path"
          subtitle="Annual complete vs converted · cumulative Sheps-aligned tally"
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={VINTAGE_PATH}
                margin={{ top: 8, right: 16, bottom: 8, left: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: SLATE }} />
                <YAxis
                  yAxisId="flow"
                  tick={{ fontSize: 11, fill: SLATE }}
                  label={{
                    value: "Annual events",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                    fill: SLATE,
                  }}
                />
                <YAxis
                  yAxisId="cum"
                  orientation="right"
                  tick={{ fontSize: 11, fill: SLATE }}
                  label={{
                    value: "Cumulative",
                    angle: 90,
                    position: "insideRight",
                    fontSize: 11,
                    fill: SLATE,
                  }}
                />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="flow"
                  type="monotone"
                  dataKey="complete"
                  name="Complete"
                  stackId="1"
                  fill={ROSE}
                  stroke={ROSE}
                  fillOpacity={0.55}
                />
                <Area
                  yAxisId="flow"
                  type="monotone"
                  dataKey="converted"
                  name="Converted"
                  stackId="1"
                  fill={AMBER}
                  stroke={AMBER}
                  fillOpacity={0.55}
                />
                <Line
                  yAxisId="cum"
                  type="monotone"
                  dataKey="cumulative"
                  name="Cumulative"
                  stroke={NAVY}
                  strokeWidth={2.5}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "states" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="State closure ladder"
            subtitle="Sheps rural closures + conversions · filtered by region"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={states}
                  layout="vertical"
                  margin={{ top: 4, right: 12, bottom: 4, left: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: SLATE }} />
                  <YAxis
                    type="category"
                    dataKey="abbr"
                    width={36}
                    tick={{ fontSize: 11, fill: SLATE }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const d = payload[0].payload as (typeof states)[0];
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                          <p className="font-semibold">{d.state}</p>
                          <p>
                            {d.closures} events · {d.complete} complete /{" "}
                            {d.converted} converted
                          </p>
                          <p>Beds lost ≈ {fmtInt(d.bedsLost)}</p>
                          <p>Median +{d.medianAddedMin} min · pop {fmtPopK(d.popExposedK)}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="closures" name="Closures" radius={[0, 4, 4, 0]}>
                    {states.map((s) => (
                      <Cell
                        key={s.abbr}
                        fill={REGION_COLORS[s.region] || TEAL}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Median added minutes by state"
            subtitle="Desk GIS medians for mapped closure counties"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...states].sort(
                    (a, b) => b.medianAddedMin - a.medianAddedMin,
                  )}
                  margin={{ top: 8, right: 12, bottom: 40, left: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="abbr"
                    tick={{ fontSize: 10, fill: SLATE }}
                    angle={-35}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis tick={{ fontSize: 11, fill: SLATE }} />
                  <Tooltip />
                  <Bar
                    dataKey="medianAddedMin"
                    name="Median added min"
                    fill={TEAL}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "bands" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Added-minute bands"
            subtitle="Share of mapped closure counties and ACS population"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={DRIVE_BANDS}
                  margin={{ top: 8, right: 12, bottom: 8, left: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: SLATE }} />
                  <YAxis tick={{ fontSize: 11, fill: SLATE }} unit="%" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="countySharePct"
                    name="County share"
                    fill={INDIGO}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="popSharePct"
                    name="Population share"
                    fill={TEAL}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Region exposure"
            subtitle="Closures, median added minutes, share ≥30 min"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={REGION_SUMMARY}
                  margin={{ top: 8, right: 16, bottom: 8, left: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="region" tick={{ fontSize: 11, fill: SLATE }} />
                  <YAxis
                    yAxisId="n"
                    tick={{ fontSize: 11, fill: SLATE }}
                  />
                  <YAxis
                    yAxisId="m"
                    orientation="right"
                    tick={{ fontSize: 11, fill: SLATE }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="n"
                    dataKey="closures"
                    name="Closures"
                    fill={NAVY}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="m"
                    type="monotone"
                    dataKey="medianAddedMin"
                    name="Median +min"
                    stroke={ROSE}
                    strokeWidth={2.5}
                  />
                  <Line
                    yAxisId="m"
                    type="monotone"
                    dataKey="shareGe30Pct"
                    name="Share ≥30 min %"
                    stroke={AMBER}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Payment class mix"
            subtitle="CAH vs PPS vs MDH among mapped events"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={PAYMENT_MIX}
                  margin={{ top: 8, right: 12, bottom: 8, left: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="class" tick={{ fontSize: 11, fill: SLATE }} />
                  <YAxis tick={{ fontSize: 11, fill: SLATE }} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="closures"
                    name="Closures"
                    fill={SKY}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="medianAddedMin"
                    name="Median +min"
                    fill={AMBER}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "stress" && (
        <ChartCard
          title="Margin stress vs closure flow"
          subtitle="Rural hospitals with negative operating margins (Cost Report desk) vs Sheps annual events"
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={MARGIN_STRESS}
                margin={{ top: 8, right: 16, bottom: 8, left: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: SLATE }} />
                <YAxis
                  yAxisId="pct"
                  tick={{ fontSize: 11, fill: SLATE }}
                  domain={[30, 55]}
                  label={{
                    value: "Neg. margin share %",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                    fill: SLATE,
                  }}
                />
                <YAxis
                  yAxisId="n"
                  orientation="right"
                  tick={{ fontSize: 11, fill: SLATE }}
                  label={{
                    value: "Closures",
                    angle: 90,
                    position: "insideRight",
                    fontSize: 11,
                    fill: SLATE,
                  }}
                />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="pct"
                  type="monotone"
                  dataKey="negMarginSharePct"
                  name="Neg. margin %"
                  fill={INDIGO}
                  stroke={INDIGO}
                  fillOpacity={0.25}
                />
                <Bar
                  yAxisId="n"
                  dataKey="closures"
                  name="Closures"
                  fill={ROSE}
                  radius={[4, 4, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Desk correlation (closures vs neg-margin share):{" "}
            {ANALYTICS.corrClosuresVsNegMargin.toFixed(2)}. Not causal — both
            series track the same rural financial cycle.
          </p>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <p className="sr-only">
        {countiesByKind("complete").length} complete-kind rows in full panel;{" "}
        {STATE_LADDER.length} state ladder rows; {COUNTY_DRIVES.length} county
        drive rows.
      </p>
    </div>
  );
}
