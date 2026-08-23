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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  DEFINITION_LADDER,
  HEADLINE,
  METRO_SFR_SHARES,
  OPERATOR_LADDER,
  REGION_ROLLUP,
  SHARE_PATH,
  SHARE_SCATTER,
  SOURCE_NOTE,
  ZIP_TIPS,
  fmtNum,
  fmtPct,
  type OwnerDef,
} from "@/data/institutional-share-of-single-family-rentals-2026-data";

// viz-types: metro horizontal bars, share path multi-line, SFR vs all-SF scatter, ZIP tip bars, operator ladder, region rollup | layout: default

type ViewId = "metros" | "path" | "zips" | "operators" | "defs";
type DefFilter = OwnerDef | "all";
type PathMetro =
  | "jacksonville"
  | "phoenix"
  | "dallas"
  | "nashville"
  | "cincinnati"
  | "seattle"
  | "all";
type ZipSort = "share" | "year" | "beds";

const NAVY = "#1e3a5f";
const TEAL = "#0f766e";
const AMBER = "#b45309";
const ROSE = "#be123c";
const SLATE = "#64748b";
const SKY = "#0369a1";
const PATH_COLORS: Record<Exclude<PathMetro, "all">, string> = {
  jacksonville: ROSE,
  phoenix: AMBER,
  dallas: TEAL,
  nashville: SKY,
  cincinnati: SLATE,
  seattle: NAVY,
};

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

export function InstitutionalShareOfSingleFamilyRentals2026Dashboard() {
  const [view, setView] = useState<ViewId>("metros");
  const [defFilter, setDefFilter] = useState<DefFilter>("all");
  const [pathMetro, setPathMetro] = useState<PathMetro>("all");
  const [zipSort, setZipSort] = useState<ZipSort>("share");
  const [zipMetro, setZipMetro] = useState<string>("all");

  const metroBars = useMemo(() => {
    const rows =
      defFilter === "all"
        ? METRO_SFR_SHARES
        : METRO_SFR_SHARES.filter((m) => m.def === defFilter);
    return [...rows].sort((a, b) => b.sfrSharePct - a.sfrSharePct);
  }, [defFilter]);

  const zipBars = useMemo(() => {
    let rows =
      zipMetro === "all"
        ? ZIP_TIPS
        : ZIP_TIPS.filter((z) => z.metro === zipMetro);
    rows = [...rows];
    if (zipSort === "share") rows.sort((a, b) => b.sfrSharePct - a.sfrSharePct);
    else if (zipSort === "year")
      rows.sort((a, b) => b.medianYearBuilt - a.medianYearBuilt);
    else rows.sort((a, b) => b.bed3SharePct - a.bed3SharePct);
    return rows.map((z) => ({
      ...z,
      label: `${z.zip} · ${z.place}`,
    }));
  }, [zipMetro, zipSort]);

  const operatorBars = useMemo(
    () =>
      [...OPERATOR_LADDER].sort((a, b) => b.homesApprox - a.homesApprox),
    [],
  );

  const zipMetroOptions = useMemo(() => {
    const set = new Set(ZIP_TIPS.map((z) => z.metro));
    return [
      { id: "all", label: "All tip metros" },
      ...[...set].map((m) => ({ id: m, label: m })),
    ];
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-200/90">
          Institutional SFR ownership · metro & ZIP lens
        </p>
        <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Atlanta · {fmtPct(HEADLINE.topMetroSfrSharePct)} of SFR stock
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">
          John Burns (≥100 properties, Jul 2025) puts Atlanta at{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.topMetroSfrSharePct)}
          </span>{" "}
          of single-family rental stock — about{" "}
          {HEADLINE.atlantaVsNationalMultiple}× the national average under that
          cut. GAO’s stricter ≥5,000-home panel still shows Jacksonville at{" "}
          {fmtPct(HEADLINE.jacksonvilleGao5kSfrPct2024, 0)} of SFR in 2024.
          Tip ZIP {HEADLINE.tipZip.split(" ")[0]} carries an estimated{" "}
          {fmtPct(HEADLINE.tipZipSharePct, 0)} local SFR share.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={view}
          onChange={setView}
          options={[
            { id: "metros", label: "Metro shares" },
            { id: "path", label: "2018–24 path" },
            { id: "zips", label: "ZIP tips" },
            { id: "operators", label: "Operators" },
            { id: "defs", label: "Definitions" },
          ]}
        />
        {view === "metros" && (
          <ToggleGroup
            label="Owner cut"
            value={defFilter}
            onChange={setDefFilter}
            options={[
              { id: "all", label: "All cuts" },
              { id: "jb_100plus", label: "JB ≥100" },
              { id: "gao_1000plus", label: "GAO ≥1k" },
              { id: "gao_5000plus", label: "GAO ≥5k" },
            ]}
          />
        )}
        {view === "path" && (
          <ToggleGroup
            label="Highlight"
            value={pathMetro}
            onChange={setPathMetro}
            options={[
              { id: "all", label: "All six" },
              { id: "jacksonville", label: "Jacksonville" },
              { id: "phoenix", label: "Phoenix" },
              { id: "dallas", label: "Dallas" },
              { id: "nashville", label: "Nashville" },
              { id: "cincinnati", label: "Cincinnati" },
              { id: "seattle", label: "Seattle" },
            ]}
          />
        )}
        {view === "zips" && (
          <>
            <ToggleGroup
              label="Sort"
              value={zipSort}
              onChange={setZipSort}
              options={[
                { id: "share", label: "SFR share" },
                { id: "year", label: "Year built" },
                { id: "beds", label: "3-bed share" },
              ]}
            />
            <ToggleGroup
              label="Metro"
              value={zipMetro}
              onChange={setZipMetro}
              options={zipMetroOptions}
            />
          </>
        )}
      </div>

      {view === "metros" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Institutional share of single-family rentals"
            subtitle="Percent of SFR stock — mixed definitions; filter by owner cut"
          >
            <div className="h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metroBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 32]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="metro"
                    width={110}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [
                      fmtPct(Number(v)),
                      "SFR institutional share",
                    ]}
                  />
                  <Bar dataKey="sfrSharePct" radius={[0, 4, 4, 0]}>
                    {metroBars.map((m) => (
                      <Cell
                        key={m.id}
                        fill={
                          m.metro === "Atlanta"
                            ? ROSE
                            : m.region === "Southeast"
                              ? TEAL
                              : NAVY
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="SFR share vs all single-family stock"
            subtitle="Same metros: rental-stock share (x) vs all-SF share (y)"
          >
            <div className="h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="sfrSharePct"
                    name="SFR %"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Share of SFR stock",
                      position: "insideBottom",
                      offset: -4,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="allSfSharePct"
                    name="All SF %"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Share of all SF",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis
                    type="number"
                    dataKey="unitsApprox"
                    range={[60, 280]}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      typeof v === "number" ? fmtPct(v) : String(v),
                      String(name),
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.metro ?? ""
                    }
                  />
                  <Scatter data={SHARE_SCATTER} fill={TEAL}>
                    {SHARE_SCATTER.map((p) => (
                      <Cell
                        key={p.metro}
                        fill={p.metro === "Atlanta" ? ROSE : TEAL}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "path" && (
        <ChartCard
          title="GAO ≥5,000-home operators — SFR share path"
          subtitle="Six-metro panel, 2018–2024 (desk-smoothed to disclosed endpoints)"
        >
          <div className="h-[440px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={SHARE_PATH}
                margin={{ top: 12, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 26]}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v, name) => [
                    fmtPct(Number(v), 0),
                    String(name),
                  ]}
                />
                <Legend />
                {(
                  [
                    "jacksonville",
                    "phoenix",
                    "dallas",
                    "nashville",
                    "cincinnati",
                    "seattle",
                  ] as const
                ).map((key) => {
                  const show = pathMetro === "all" || pathMetro === key;
                  if (!show) return null;
                  return (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      name={key.charAt(0).toUpperCase() + key.slice(1)}
                      stroke={PATH_COLORS[key]}
                      strokeWidth={key === "jacksonville" ? 3 : 2}
                      dot={{ r: 3 }}
                    />
                  );
                })}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "zips" && (
        <ChartCard
          title="Highest-tip ZIPs — estimated institutional SFR share"
          subtitle="Local rental-stock concentration; estimated from deed / investor-share patterns"
        >
          <div className="h-[440px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={zipBars}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  domain={[0, 50]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={160}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  formatter={(v) => [
                    fmtPct(Number(v), 0),
                    "Est. institutional SFR share",
                  ]}
                />
                <Bar dataKey="sfrSharePct" fill={AMBER} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "operators" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Large SFR operator ladder"
            subtitle="Approximate homes under management (carried from filings / desk tallies)"
          >
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={operatorBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => fmtNum(v)}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={140}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtNum(Number(v)), "Homes (approx)"]}
                  />
                  <Bar
                    dataKey="homesApprox"
                    fill={NAVY}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Regional mean SFR institutional share"
            subtitle="Simple mean across metros in this desk panel"
          >
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={REGION_ROLLUP}
                  margin={{ top: 12, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      fmtPct(Number(v)),
                      String(name),
                    ]}
                  />
                  <Legend />
                  <Bar
                    dataKey="meanSfrSharePct"
                    name="Mean SFR %"
                    fill={TEAL}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="maxSfrSharePct"
                    name="Max SFR %"
                    fill={ROSE}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "defs" && (
        <ChartCard
          title="Why the percentages disagree"
          subtitle="Same metros, different owner thresholds — read the cut before the chart"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-4">Definition</th>
                  <th className="py-2 pr-4">Threshold</th>
                  <th className="py-2 pr-4">Benchmark share</th>
                  <th className="py-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {DEFINITION_LADDER.map((d) => (
                  <tr key={d.id} className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-medium text-slate-900">
                      {d.label}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{d.threshold}</td>
                    <td className="py-3 pr-4 font-semibold text-slate-900">
                      {fmtPct(d.typicalNationalSfrSharePct)}
                    </td>
                    <td className="py-3 text-slate-600">{d.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            {SOURCE_NOTE}
          </p>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
