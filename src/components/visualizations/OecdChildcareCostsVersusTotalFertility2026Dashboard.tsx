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
  COST_BANDS,
  COUNTRIES,
  HEADLINE,
  REGION_AGG,
  REGION_META,
  SOURCE_NOTE,
  SOURCES,
  countriesByRegion,
  decompositionRows,
  type RegionId,
} from "@/data/oecd-childcare-costs-versus-total-fertility-2026-data";

// viz-types: scatter, band composed, region bars, fee/benefit bars | layout: default

type ViewId = "scatter" | "bands" | "regions" | "decomp";
type EarnerLens = "dual" | "single";
type OutlierMode = "all" | "excl";

const NAVY = "#0f172a";
const TEAL = "#0f766e";
const AMBER = "#d97706";
const ROSE = "#e11d48";

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
      <div className="inline-flex flex-wrap rounded-lg border border-slate-200 bg-white p-0.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={"rounded-md px-3 py-1.5 text-sm font-medium transition-colors " + (value === o.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50")}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function OecdChildcareCostsVersusTotalFertility2026Dashboard() {
  const [view, setView] = useState<ViewId>("scatter");
  const [region, setRegion] = useState<RegionId | "All">("All");
  const [earner, setEarner] = useState<EarnerLens>("dual");
  const [outliers, setOutliers] = useState<OutlierMode>("all");

  const filtered = useMemo(() => {
    let rows = countriesByRegion(region);
    if (outliers === "excl") {
      rows = rows.filter((c) => c.iso3 !== "ISR" && c.iso3 !== "KOR");
    }
    return rows;
  }, [region, outliers]);

  const scatterData = useMemo(
    () =>
      filtered.map((c) => ({
        name: c.name,
        iso3: c.iso3,
        cost:
          earner === "dual"
            ? c.netCostPctAW
            : (c.singleNetCostPctAW ?? c.netCostPctAW),
        tfr: c.tfr,
        fill: REGION_META[c.region].color,
      })),
    [filtered, earner],
  );

  const bandBars = useMemo(
    () =>
      COST_BANDS.map((b) => ({
        band: b.label,
        meanTfr: b.meanTfr,
        meanCost: b.meanNetCost,
        n: b.n,
      })),
    [],
  );

  const regionBars = useMemo(
    () =>
      REGION_AGG.map((r) => ({
        region: REGION_META[r.region].short,
        label: REGION_META[r.region].label,
        meanCost: r.meanNetCost,
        meanTfr: r.meanTfr,
        n: r.n,
        fill: REGION_META[r.region].color,
      })),
    [],
  );

  const decomp = useMemo(
    () =>
      decompositionRows().map((d) => ({
        name: d.name,
        fee: d.fee,
        benefitAbs: d.benefitAbs,
        net: d.net,
      })),
    [],
  );

  const regionOptions = useMemo(
    () => [
      { id: "All" as const, label: "All" },
      ...(Object.keys(REGION_META) as RegionId[]).map((id) => ({
        id,
        label: REGION_META[id].short,
      })),
    ],
    [],
  );

  return (
    <div
      data-viz="oecd-childcare-costs-versus-total-fertility-2026"
      className="space-y-4"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-200/90">
          OECD childcare costs vs total fertility - family-policy lens
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200">
          Dual-earner net childcare cost averages{" "}
          <span className="font-semibold text-white">
            {HEADLINE.oecdAvgNetCostPctAW}% of average wage
          </span>{" "}
          (OECD, {HEADLINE.year}). Across {HEADLINE.sampleN} countries the
          Pearson correlation with TFR is only{" "}
          <span className="font-semibold text-white">
            r = {HEADLINE.pearsonR}
          </span>
          - a cloud, not a tidy inverse slope. Low-cost countries average TFR{" "}
          {HEADLINE.lowCostMeanTfr}; high-cost countries average{" "}
          {HEADLINE.highCostMeanTfr}.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center">
        <ToggleGroup
          label="Panel"
          value={view}
          onChange={setView}
          options={[
            { id: "scatter", label: "Scatter" },
            { id: "bands", label: "Cost bands" },
            { id: "regions", label: "Regions" },
            { id: "decomp", label: "Fee vs benefit" },
          ]}
        />
        <ToggleGroup
          label="Earner"
          value={earner}
          onChange={setEarner}
          options={[
            { id: "dual", label: "Dual 100+67" },
            { id: "single", label: "Lone 67%" },
          ]}
        />
        <ToggleGroup
          label="Sample"
          value={outliers}
          onChange={setOutliers}
          options={[
            { id: "all", label: "All 33" },
            { id: "excl", label: "Excl. IL/KR" },
          ]}
        />
        <ToggleGroup
          label="Region"
          value={region}
          onChange={setRegion}
          options={regionOptions}
        />
      </div>

      {view === "scatter" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Net childcare cost vs total fertility"
            subtitle={
              earner === "dual"
                ? "Dual-earner couple, net cost % of average wage (x) vs WDI TFR (y), 2022"
                : "Lone parent at 67% AW, net cost % AW (x) vs WDI TFR (y), 2022"
            }
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 12, bottom: 12, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="cost"
                    name="Net cost % AW"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    type="number"
                    dataKey="tfr"
                    name="TFR"
                    domain={[0.6, 3.1]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <ZAxis range={[70, 70]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(value, name) => {
                      const n = Number(value);
                      if (name === "tfr" || name === "TFR")
                        return [n.toFixed(2), "TFR"];
                      return [`${n}%`, "Net cost"];
                    }}
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.name ?? "")
                    }
                  />
                  <Scatter data={scatterData} name="Countries">
                    {scatterData.map((d) => (
                      <Cell key={d.iso3} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Showing {scatterData.length} countries
              {outliers === "excl" ? " (Israel and Korea removed)" : ""}.
              Colors = region. Full-sample dual-earner Pearson r ={" "}
              {HEADLINE.pearsonR}; excl. IL/KR = {HEADLINE.pearsonRExclOutliers}.
            </p>
          </ChartCard>

          <ChartCard
            title="Where the cloud sits"
            subtitle="Mean TFR by dual-earner net-cost band (full join)"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bandBars} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="band" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis domain={[1.2, 1.7]} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip />
                  <Bar dataKey="meanTfr" name="Mean TFR" radius={[6, 6, 0, 0]}>
                    {bandBars.map((b) => (
                      <Cell
                        key={b.band}
                        fill={
                          b.band.startsWith("Under")
                            ? TEAL
                            : b.band.startsWith("20")
                              ? ROSE
                              : AMBER
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Low-cost band mean TFR {HEADLINE.lowCostMeanTfr} vs high-cost{" "}
              {HEADLINE.highCostMeanTfr} - opposite a simple cheap-care / more-babies
              cross-section story.
            </p>
          </ChartCard>
        </div>
      ) : null}

      {view === "bands" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Mean TFR and mean cost by band"
            subtitle="Bars = mean TFR; line = mean net cost % AW"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={bandBars} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="band" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis yAxisId="tfr" domain={[1.2, 1.7]} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis yAxisId="cost" orientation="right" domain={[0, 30]} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="tfr" dataKey="meanTfr" name="Mean TFR" fill={TEAL} radius={[6, 6, 0, 0]} />
                  <Line yAxisId="cost" type="monotone" dataKey="meanCost" name="Mean net cost % AW" stroke={NAVY} strokeWidth={2} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Country count by band"
            subtitle="How many of the 33 join countries sit in each cost band"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bandBars} layout="vertical" margin={{ top: 8, right: 16, bottom: 8, left: 72 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis type="category" dataKey="band" width={70} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip />
                  <Bar dataKey="n" name="Countries" fill={AMBER} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {view === "regions" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Regional mean net cost"
            subtitle="Dual-earner net childcare cost as % of average wage"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionBars} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="region" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip
                    formatter={(v) => [`${Number(v)}%`, "Mean net cost"]}
                    labelFormatter={(_, p) =>
                      String(p?.[0]?.payload?.label ?? "")
                    }
                  />
                  <Bar dataKey="meanCost" name="Mean net cost" radius={[6, 6, 0, 0]}>
                    {regionBars.map((r) => (
                      <Cell key={r.region} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Regional mean TFR"
            subtitle="Same regional buckets - fertility does not track cost order"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionBars} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="region" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis domain={[0.8, 3]} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip
                    formatter={(v) => [Number(v).toFixed(2), "Mean TFR"]}
                    labelFormatter={(_, p) =>
                      String(p?.[0]?.payload?.label ?? "")
                    }
                  />
                  <Bar dataKey="meanTfr" name="Mean TFR" radius={[6, 6, 0, 0]}>
                    {regionBars.map((r) => (
                      <Cell key={r.region} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {view === "decomp" ? (
        <ChartCard
          title="Fee vs benefit decomposition"
          subtitle="Selected countries: gross fee, benefit offset (absolute), and net cost (% AW)"
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={decomp} margin={{ top: 8, right: 12, bottom: 48, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" interval={0} angle={-28} textAnchor="end" height={60} tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="fee" name="Gross fee" fill={ROSE} />
                <Bar dataKey="benefitAbs" name="Benefit offset (|%|)" fill={TEAL} />
                <Bar dataKey="net" name="Net cost" fill={NAVY} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Italy and Korea show large gross fees nearly fully offset by benefits;
            New Zealand and the US keep high net costs after support.
          </p>
        </ChartCard>
      ) : null}

      <details className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <summary className="cursor-pointer font-medium text-slate-800">
          Sources and method note
        </summary>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {SOURCES.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
        <p className="mt-1 text-xs text-slate-400">
          Sample size {COUNTRIES.length}; OECD average dual-earner net cost{" "}
          {HEADLINE.oecdAvgNetCostPctAW}% AW ({HEADLINE.year}).
        </p>
      </details>
    </div>
  );
}
