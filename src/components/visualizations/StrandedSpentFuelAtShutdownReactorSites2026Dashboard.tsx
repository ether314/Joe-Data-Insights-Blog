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
  Pie,
  PieChart,
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
  LICENSE_MIX,
  REGION_TOTALS,
  SHUTDOWN_COHORTS,
  SOURCE_NOTE,
  STORAGE_SPLIT,
  filterSites,
  siteMtuSum,
  type EraFilter,
  type LicenseFilter,
  type RegionFilter,
} from "@/data/stranded-spent-fuel-at-shutdown-reactor-sites-2026-data";

type Panel =
  | "site-ladder"
  | "region-stack"
  | "license-pie"
  | "strand-scatter"
  | "cohort-path"
  | "storage-split";

const COLORS = {
  navy: "#0f2744",
  teal: "#0e7490",
  amber: "#b45309",
  rose: "#9f1239",
  slate: "#64748b",
  dry: "#1e3a5f",
  wet: "#0284c7",
  isfsi: "#b45309",
  decon: "#0e7490",
  mixed: "#7c3aed",
  grid: "#e2e8f0",
  cum: "#9f1239",
};

const PANEL_LABELS: { id: Panel; label: string }[] = [
  { id: "site-ladder", label: "Site MTU ladder" },
  { id: "region-stack", label: "Region map" },
  { id: "license-pie", label: "License mix" },
  { id: "strand-scatter", label: "Years stranded" },
  { id: "cohort-path", label: "Cohort path" },
  { id: "storage-split", label: "Dry vs wet" },
];

const REGION_OPTS: { id: RegionFilter; label: string }[] = [
  { id: "all", label: "All regions" },
  { id: "Northeast", label: "Northeast" },
  { id: "Midwest", label: "Midwest" },
  { id: "South", label: "South" },
  { id: "West", label: "West" },
];

const LICENSE_OPTS: { id: LicenseFilter; label: string }[] = [
  { id: "all", label: "All licenses" },
  { id: "isfsi-only", label: "ISFSI-only" },
  { id: "decon-with-isfsi", label: "DECON + ISFSI" },
  { id: "mixed-pool", label: "Wet + dry A2" },
];

const ERA_OPTS: { id: EraFilter; label: string }[] = [
  { id: "all", label: "All eras" },
  { id: "pre-2000", label: "Pre-2000 shutdowns" },
  { id: "post-2000", label: "Post-2000 shutdowns" },
];

function fmtMtu(n: number) {
  return `${n.toLocaleString()} MTU`;
}

function licenseColor(license: string) {
  if (license === "isfsi-only") return COLORS.isfsi;
  if (license === "mixed-pool") return COLORS.mixed;
  return COLORS.decon;
}

export function StrandedSpentFuelAtShutdownReactorSites2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("site-ladder");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [license, setLicense] = useState<LicenseFilter>("all");
  const [era, setEra] = useState<EraFilter>("all");
  const [topN, setTopN] = useState<"all" | "10">("all");

  const rows = useMemo(
    () => filterSites(region, license, era),
    [region, license, era],
  );

  const ladder = useMemo(() => {
    const sorted = [...rows].sort((a, b) => b.mtu - a.mtu);
    const sliced = topN === "10" ? sorted.slice(0, 10) : sorted;
    return sliced.map((s) => ({
      name: s.site,
      mtu: Math.round(s.mtu),
      casks: s.snfCasks,
      years: s.yearsStranded,
      license: s.license,
      fill: licenseColor(s.license),
    }));
  }, [rows, topN]);

  const regionBars = useMemo(() => {
    if (region !== "all" || license !== "all" || era !== "all") {
      const map = new Map<
        string,
        { region: string; mtu: number; sites: number }
      >();
      for (const s of rows) {
        const cur = map.get(s.region) ?? {
          region: s.region,
          mtu: 0,
          sites: 0,
        };
        cur.mtu += s.mtu;
        cur.sites += 1;
        map.set(s.region, cur);
      }
      return [...map.values()].map((r) => ({
        ...r,
        mtu: Math.round(r.mtu),
      }));
    }
    return REGION_TOTALS.map((r) => ({
      region: r.region,
      mtu: r.mtu,
      sites: r.sites,
      isfsiOnlySites: r.isfsiOnlySites,
    }));
  }, [rows, region, license, era]);

  const licensePie = useMemo(() => {
    if (region !== "all" || era !== "all") {
      const buckets = new Map<string, { name: string; value: number }>();
      for (const s of rows) {
        const label =
          s.license === "isfsi-only"
            ? "ISFSI-only"
            : s.license === "mixed-pool"
              ? "Wet + dry A2"
              : "DECON + ISFSI";
        const cur = buckets.get(s.license) ?? { name: label, value: 0 };
        cur.value += s.mtu;
        buckets.set(s.license, cur);
      }
      return [...buckets.entries()].map(([key, v]) => ({
        key,
        name: v.name,
        value: Math.round(v.value),
        fill: licenseColor(key),
      }));
    }
    return LICENSE_MIX.map((l) => ({
      key: l.license,
      name: l.label,
      value: l.mtu,
      fill: licenseColor(l.license),
    }));
  }, [rows, region, era]);

  const scatter = useMemo(
    () =>
      rows.map((s) => ({
        site: s.site,
        years: s.yearsStranded,
        mtu: Math.round(s.mtu),
        casks: s.snfCasks,
        license: s.license,
        fill: licenseColor(s.license),
      })),
    [rows],
  );

  const filteredMtu = siteMtuSum(rows);

  return (
    <div
      data-viz="stranded-spent-fuel-at-shutdown-reactor-sites-2026"
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Stranded spent fuel — shutdown sites
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900">
          Headline — {HEADLINE.groupASites} Group A sites,{" "}
          {HEADLINE.groupAMtu.toLocaleString()} MTU onsite
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          {HEADLINE.isfsiOnlyLwrSites} EIA ISFSI-only LWR licenses still hold{" "}
          {HEADLINE.isfsiOnlyLwrMtu.toLocaleString()} MTU; {HEADLINE.a1Sites}{" "}
          dry-only (A1) campuses account for ~{ANALYTICS.a1ShareOfGroupAMtuPct}%
          of Group A mass. Filter below; no offsite repository acceptance path
          yet.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">
        {PANEL_LABELS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPanel(p.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              panel === p.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">
        {REGION_OPTS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setRegion(o.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              region === o.id
                ? "bg-cyan-800 text-white"
                : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            {o.label}
          </button>
        ))}
        {LICENSE_OPTS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setLicense(o.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              license === o.id
                ? "bg-amber-800 text-white"
                : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            {o.label}
          </button>
        ))}
        {ERA_OPTS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setEra(o.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              era === o.id
                ? "bg-rose-900 text-white"
                : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            {o.label}
          </button>
        ))}
        {(panel === "site-ladder" || panel === "strand-scatter") && (
          <>
            <button
              type="button"
              onClick={() => setTopN("all")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                topN === "all"
                  ? "bg-slate-800 text-white"
                  : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              All sites
            </button>
            <button
              type="button"
              onClick={() => setTopN("10")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                topN === "10"
                  ? "bg-slate-800 text-white"
                  : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              Top 10 by MTU
            </button>
          </>
        )}
      </div>

      <div className="px-4 py-2 text-sm text-slate-600 sm:px-5">
        Showing {rows.length} sites · {fmtMtu(filteredMtu)} (filtered)
      </div>

      <div className="h-[420px] px-2 pb-4 sm:px-4">
        {panel === "site-ladder" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ladder}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
            >
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(v) => [fmtMtu(Number(v ?? 0)), "Remaining SNF"]}
              />
              <Bar dataKey="mtu" name="MTU" radius={[0, 4, 4, 0]}>
                {ladder.map((d) => (
                  <Cell key={d.name} fill={d.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "region-stack" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={regionBars}
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="region" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="mtu" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="sites"
                orientation="right"
                tick={{ fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="mtu"
                dataKey="mtu"
                name="MTU"
                fill={COLORS.navy}
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="sites"
                type="monotone"
                dataKey="sites"
                name="Sites"
                stroke={COLORS.amber}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "license-pie" && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={licensePie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={2}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {licensePie.map((d) => (
                  <Cell key={d.key} fill={d.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => fmtMtu(Number(v ?? 0))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}

        {panel === "strand-scatter" && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="years"
                name="Years stranded"
                tick={{ fontSize: 11 }}
                label={{
                  value: "Years since last unit shutdown (to end-2022)",
                  position: "insideBottom",
                  offset: -2,
                  fontSize: 11,
                }}
              />
              <YAxis
                type="number"
                dataKey="mtu"
                name="MTU"
                tick={{ fontSize: 11 }}
              />
              <ZAxis type="number" dataKey="casks" range={[60, 400]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) =>
                  String(name) === "mtu" ? fmtMtu(Number(v ?? 0)) : Number(v ?? 0)
                }
                labelFormatter={(_, payload) =>
                  (payload?.[0]?.payload as { site?: string } | undefined)?.site ??
                  ""
                }
              />
              <Scatter
                data={topN === "10" ? scatter.slice(0, 10) : scatter}
                name="Sites"
              >
                {(topN === "10" ? scatter.slice(0, 10) : scatter).map((d) => (
                  <Cell key={d.site} fill={d.fill} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}

        {panel === "cohort-path" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={SHUTDOWN_COHORTS}
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="cum" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="add"
                orientation="right"
                tick={{ fontSize: 11 }}
              />
              <Tooltip />
              <Legend />
              <Area
                yAxisId="cum"
                type="monotone"
                dataKey="cumulativeMtu"
                name="Cumulative MTU"
                fill="#fecaca"
                stroke={COLORS.cum}
                strokeWidth={2}
              />
              <Bar
                yAxisId="add"
                dataKey="mtuAdded"
                name="MTU added that year"
                fill={COLORS.teal}
                opacity={0.85}
              />
              <Line
                yAxisId="cum"
                type="monotone"
                dataKey="cumulativeSites"
                name="Cumulative sites"
                stroke={COLORS.navy}
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "storage-split" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={STORAGE_SPLIT.map((s) => ({
                label: s.label,
                sites: s.sites,
                mtu: s.mtu,
              }))}
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="mtu" name="MTU" fill={COLORS.dry} radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="sites"
                name="Sites"
                fill={COLORS.wet}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="border-t border-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-500 sm:px-5">
        {SOURCE_NOTE}
      </p>
    </div>
  );
}
