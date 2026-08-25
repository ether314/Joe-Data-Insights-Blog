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
  ANALYTICS,
  ANNUAL,
  CES_HBA_TRANSITION_PCT,
  HEADLINE,
  QUARTERLY,
  REGIONS,
  SOURCE_NOTE,
  STATES,
  type Region,
  type StateRow,
} from "@/data/high-propensity-applications-vs-employer-firms-2026-data";

type Panel =
  | "state-ladder"
  | "national-dual"
  | "scatter"
  | "region-bars"
  | "annual-path"
  | "conversion-ladder";

type SortKey = "appsPerEmployer" | "conversionPct" | "hba2020_22";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "state-ladder": {
    title: "High-propensity apps per employer formation",
    subtitle: `${HEADLINE.cohortLabel} · US ${HEADLINE.usAppsPerEmployer} apps per BF8Q birth`,
  },
  "national-dual": {
    title: "National HBA vs BF8Q path",
    subtitle: "Quarterly sums — application surge outran eight-quarter formations",
  },
  scatter: {
    title: "HBA volume vs apps-per-employer",
    subtitle: "Bubble size = BF8Q cohort count; color = Census region",
  },
  "region-bars": {
    title: "Region formation intensity",
    subtitle: "South prints more HBA per eventual employer than Midwest/West",
  },
  "annual-path": {
    title: "Annual apps-per-employer & HBA share of BA",
    subtitle: "Pandemic application wave lifted the ratio; HBA share of BA compressed",
  },
  "conversion-ladder": {
    title: "BF8Q / HBA conversion proxy by state",
    subtitle: `US ${HEADLINE.usConversionPct}% vs historical CES HBA transition ~${CES_HBA_TRANSITION_PCT}%`,
  },
};

const REGION_COLORS: Record<Region, string> = {
  Northeast: "#0369a1",
  Midwest: "#0f766e",
  South: "#c2410c",
  West: "#7c3aed",
};

const fmt1 = (n: number) => n.toFixed(1);
const fmt0 = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(0)}k`
      : String(n);

export function HighPropensityApplicationsVsEmployerFirms2026Dashboard() {
  const [panel, setPanel] = useState<Panel>(ANALYTICS.defaultPanel);
  const [region, setRegion] = useState<"All" | Region>("All");
  const [sortKey, setSortKey] = useState<SortKey>("appsPerEmployer");

  const meta = PANEL_META[panel];

  const filtered = useMemo(() => {
    const rows =
      region === "All" ? STATES : STATES.filter((s) => s.region === region);
    const sorted = [...rows].sort((a, b) => {
      if (sortKey === "hba2020_22") return b.hba2020_22 - a.hba2020_22;
      if (sortKey === "conversionPct") return b.conversionPct - a.conversionPct;
      return b.appsPerEmployer - a.appsPerEmployer;
    });
    return sorted;
  }, [region, sortKey]);

  const ladderData = useMemo(() => {
    const slice =
      panel === "conversion-ladder"
        ? [...filtered].sort((a, b) => a.conversionPct - b.conversionPct)
        : filtered;
    return slice.slice(0, 25).map((s) => ({
      label: s.code,
      name: s.name,
      appsPerEmployer: s.appsPerEmployer,
      conversionPct: s.conversionPct,
      fill: REGION_COLORS[s.region],
    }));
  }, [filtered, panel]);

  const scatterData = useMemo(
    () =>
      filtered.map((s: StateRow) => ({
        ...s,
        x: s.hba2020_22 / 1000,
        y: s.appsPerEmployer,
        z: Math.max(40, Math.sqrt(s.bf8q2020_22) / 3),
      })),
    [filtered],
  );

  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      data-viz="high-propensity-applications-vs-employer-firms-2026"
    >
      <div className="border-b border-slate-200 bg-slate-950 px-4 py-4 text-white sm:px-6">
        <p className="text-xs font-medium uppercase tracking-wider text-amber-300/90">
          Economics · Business formation applications
        </p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
          High-propensity applications vs employer firms
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-slate-300">
          For {HEADLINE.cohortLabel}, the U.S. filed{" "}
          {HEADLINE.usAppsPerEmployer} high-propensity applications per
          eight-quarter employer formation — a {HEADLINE.usConversionPct}%
          BF8Q/HBA intensity proxy (CES historical HBA transition ~{CES_HBA_TRANSITION_PCT}%).
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              US apps / employer
            </div>
            <div className="font-semibold text-amber-200">
              {HEADLINE.usAppsPerEmployer}
            </div>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              BF8Q / HBA proxy
            </div>
            <div className="font-semibold text-teal-300">
              {HEADLINE.usConversionPct}%
            </div>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              State range
            </div>
            <div className="font-semibold text-slate-100">
              {HEADLINE.lowestAppsPerEmployer} ({HEADLINE.lowestAppsState}) –{" "}
              {HEADLINE.highestAppsPerEmployer} ({HEADLINE.highestAppsState})
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-6">
        {(
          [
            ["state-ladder", "Apps / employer"],
            ["conversion-ladder", "Conversion proxy"],
            ["national-dual", "National dual"],
            ["scatter", "Volume scatter"],
            ["region-bars", "Regions"],
            ["annual-path", "Annual path"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPanel(id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              panel === id
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3 sm:px-6">
        <span className="text-xs font-medium text-slate-500">Region</span>
        {(["All", "Northeast", "Midwest", "South", "West"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRegion(r)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              region === r
                ? "bg-amber-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {r}
          </button>
        ))}
        <span className="ml-2 text-xs font-medium text-slate-500">Sort</span>
        {(
          [
            ["appsPerEmployer", "Apps/emp"],
            ["conversionPct", "Conversion"],
            ["hba2020_22", "HBA volume"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setSortKey(id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              sortKey === id
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 sm:px-6">
        <h4 className="text-sm font-semibold text-slate-900">{meta.title}</h4>
        <p className="mt-0.5 text-xs text-slate-500">{meta.subtitle}</p>

        <div className="mt-4 h-[380px] w-full">
          {(panel === "state-ladder" || panel === "conversion-ladder") && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ladderData}
                layout="vertical"
                margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  domain={
                    panel === "conversion-ladder" ? [0, 40] : [0, "auto"]
                  }
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={36}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v, name) => [
                    typeof v === "number"
                      ? panel === "conversion-ladder"
                        ? `${fmt1(v)}%`
                        : fmt1(v)
                      : String(v),
                    String(name),
                  ]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.name ?? ""
                  }
                  contentStyle={{ fontSize: 12 }}
                />
                {panel === "state-ladder" && (
                  <ReferenceLine
                    x={HEADLINE.usAppsPerEmployer}
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    label={{
                      value: "US",
                      position: "insideTopRight",
                      fontSize: 10,
                    }}
                  />
                )}
                {panel === "conversion-ladder" && (
                  <ReferenceLine
                    x={CES_HBA_TRANSITION_PCT}
                    stroke="#0f766e"
                    strokeDasharray="4 4"
                    label={{
                      value: "CES ~27%",
                      position: "insideTopRight",
                      fontSize: 10,
                    }}
                  />
                )}
                <Bar
                  dataKey={
                    panel === "conversion-ladder"
                      ? "conversionPct"
                      : "appsPerEmployer"
                  }
                  name={
                    panel === "conversion-ladder"
                      ? "BF8Q/HBA %"
                      : "Apps per employer"
                  }
                  radius={[0, 4, 4, 0]}
                >
                  {ladderData.map((d) => (
                    <Cell key={d.label} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {panel === "national-dual" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={QUARTERLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="q"
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  tickFormatter={fmt0}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  tickFormatter={fmt0}
                />
                <Tooltip
                  formatter={(v, name) => [
                    typeof v === "number" ? v.toLocaleString() : String(v),
                    String(name),
                  ]}
                  contentStyle={{ fontSize: 12 }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="hba"
                  name="HBA"
                  fill="#c2410c"
                  opacity={0.75}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bf8q"
                  name="BF8Q"
                  stroke="#0f766e"
                  strokeWidth={2.5}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {panel === "scatter" && (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="HBA (k)"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "HBA cohort (thousands)",
                    position: "insideBottom",
                    offset: -2,
                    style: { fontSize: 11 },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Apps/emp"
                  tick={{ fontSize: 11 }}
                  domain={[2, 8]}
                />
                <ZAxis type="number" dataKey="z" range={[40, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => [
                    typeof v === "number" ? fmt1(v) : String(v),
                    String(name),
                  ]}
                  labelFormatter={(_, p) => p?.[0]?.payload?.name ?? ""}
                  contentStyle={{ fontSize: 12 }}
                />
                <ReferenceLine
                  y={HEADLINE.usAppsPerEmployer}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                />
                <Scatter name="States" data={scatterData}>
                  {scatterData.map((d) => (
                    <Cell key={d.code} fill={REGION_COLORS[d.region]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          )}

          {panel === "region-bars" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[...REGIONS].sort(
                  (a, b) => b.appsPerEmployer - a.appsPerEmployer,
                )}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v, name) => [
                    typeof v === "number"
                      ? name === "conversionPct"
                        ? `${fmt1(v)}%`
                        : fmt1(v)
                      : String(v),
                    String(name),
                  ]}
                  contentStyle={{ fontSize: 12 }}
                />
                <Legend />
                <Bar
                  dataKey="appsPerEmployer"
                  name="Apps per employer"
                  radius={[4, 4, 0, 0]}
                >
                  {[...REGIONS]
                    .sort((a, b) => b.appsPerEmployer - a.appsPerEmployer)
                    .map((r) => (
                      <Cell
                        key={r.region}
                        fill={REGION_COLORS[r.region as Region]}
                      />
                    ))}
                </Bar>
                <Bar
                  dataKey="conversionPct"
                  name="BF8Q/HBA %"
                  fill="#64748b"
                  radius={[4, 4, 0, 0]}
                  opacity={0.55}
                />
              </BarChart>
            </ResponsiveContainer>
          )}

          {panel === "annual-path" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={[...ANNUAL]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  domain={[2, 6]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  domain={[20, 70]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(v, name) => [
                    typeof v === "number"
                      ? String(name).includes("Share") ||
                        String(name).includes("%")
                        ? `${fmt1(v)}%`
                        : fmt1(v)
                      : String(v),
                    String(name),
                  ]}
                  contentStyle={{ fontSize: 12 }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="appsPerEmployer"
                  name="Apps per employer"
                  stroke="#c2410c"
                  strokeWidth={2.5}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="hbaSharePct"
                  name="HBA share of BA %"
                  stroke="#0369a1"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="conversionPct"
                  name="BF8Q/HBA %"
                  stroke="#0f766e"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          {SOURCE_NOTE}
        </p>
      </div>
    </div>
  );
}
