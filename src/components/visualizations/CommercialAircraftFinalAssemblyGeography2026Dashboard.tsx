"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  A320_RATE_PATH,
  ASSEMBLY_SITES,
  CONCENTRATION_CURVE,
  DUAL_FRAMING,
  HEADLINE,
  LARGE_JET_DELIVERIES,
  REGION_ROLLUP,
  SITE_HHI,
  SOURCE_NOTE,
  SOURCES,
  fmtN,
  fmtPct,
  rankedSites,
  siteThroughput,
  type JetClass,
  type OemId,
} from "@/data/commercial-aircraft-final-assembly-geography-2026-data";

// viz-types: site-share bars, concentration Lorenz area+line, region donut, throughput scatter, dual-frame bars, rate area | layout: default

type Tab = "sites" | "concentration" | "geography" | "throughput";
type UnitMode = "deliveries" | "share";
type OemFilter = "all" | OemId;
type ClassFilter = "all" | JetClass;

const OEM_COLOR: Record<OemId, string> = {
  airbus: "#0ea5e9",
  boeing: "#f59e0b",
  comac: "#f43f5e",
  embraer: "#a78bfa",
};

const REGION_COLOR: Record<string, string> = {
  "North America": "#f59e0b",
  Europe: "#0ea5e9",
  Asia: "#f43f5e",
  "South America": "#a78bfa",
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
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              value === o.id
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function project(lon: number, lat: number) {
  const x = 4 + ((lon + 180) / 360) * 92;
  const y = 4 + ((90 - lat) / 180) * 48;
  return { x, y };
}

const LAND_PATHS = [
  "M12 16c2-3 6-5 11-5 4 0 8 1 11 4 2 2 3 5 2 8-1 3-3 5-6 7-3 2-7 3-11 2-4-1-7-3-9-7-1-2-1-5 2-9z",
  "M24 34c3-1 6 0 8 3 2 3 2 7 1 11-1 3-3 6-6 7-3 1-5-1-6-4-1-4 0-8 1-12 0-2 1-4 2-5z",
  "M48 14c3-1 6 0 8 2 2 2 2 5 1 7-1 2-3 3-5 3-3 0-5-1-6-4-1-2 0-5 2-8z",
  "M50 28c2-1 5 0 7 3 2 3 2 7 0 10-2 3-5 5-8 5-2 0-4-2-5-5-1-3 0-7 2-10 1-1 2-2 4-3z",
  "M62 18c4-2 9-2 14 0 4 2 7 5 8 9 1 4-1 8-4 11-4 3-9 4-14 3-4-1-8-4-10-8-2-4-1-9 2-12 1-1 2-2 4-3z",
  "M78 36c3-1 6 1 7 4 1 3 0 6-2 8-2 2-5 2-7 0-2-2-2-5-1-7 1-2 2-4 3-5z",
  "M28 48c2 0 4 1 5 3 1 2 0 4-2 5-2 1-4 0-5-2-1-2 0-4 2-5z",
];

function SiteBubbleMap({
  oem,
  jetClass,
}: {
  oem: OemFilter;
  jetClass: ClassFilter;
}) {
  const sites = rankedSites({
    includeRegional: jetClass === "regional" || jetClass === "all",
    oem,
    jetClass,
  }).filter((s) => (jetClass === "all" ? s.jetClass !== "regional" : true));

  const maxD = Math.max(...sites.map((s) => s.deliveries2025), 1);

  return (
    <svg viewBox="0 0 100 56" className="h-auto w-full" role="img">
      <rect width="100" height="56" fill="#f8fafc" rx="1" />
      {LAND_PATHS.map((d, i) => (
        <path key={i} d={d} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.2" />
      ))}
      {sites.map((s) => {
        const { x, y } = project(s.lon, s.lat);
        const r = 1.2 + (s.deliveries2025 / maxD) * 4.5;
        return (
          <g key={s.id}>
            <circle
              cx={x}
              cy={y}
              r={r}
              fill={OEM_COLOR[s.oem]}
              fillOpacity={0.85}
              stroke="#0f172a"
              strokeWidth={0.25}
            />
            <text
              x={x}
              y={y - r - 0.8}
              textAnchor="middle"
              fontSize="2.2"
              fill="#334155"
              fontWeight={600}
            >
              {s.short}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function CommercialAircraftFinalAssemblyGeography2026Dashboard() {
  const [tab, setTab] = useState<Tab>("sites");
  const [unit, setUnit] = useState<UnitMode>("share");
  const [oem, setOem] = useState<OemFilter>("all");
  const [jetClass, setJetClass] = useState<ClassFilter>("all");

  const sites = useMemo(
    () =>
      rankedSites({
        includeRegional: jetClass === "regional",
        oem,
        jetClass: jetClass === "regional" ? "regional" : jetClass,
      }).filter((s) => {
        if (jetClass === "all") return s.jetClass !== "regional";
        return true;
      }),
    [oem, jetClass],
  );

  const denom = useMemo(
    () => sites.reduce((s, r) => s + r.deliveries2025, 0) || 1,
    [sites],
  );

  const barData = useMemo(
    () =>
      sites.map((s) => ({
        name: s.short,
        value:
          unit === "share"
            ? Math.round((1000 * s.deliveries2025) / denom) / 10
            : s.deliveries2025,
        fill: OEM_COLOR[s.oem],
        full: s.site,
        oem: s.oemLabel,
      })),
    [sites, unit, denom],
  );

  const scatterData = useMemo(() => siteThroughput(sites), [sites]);

  return (
    <div
      className="space-y-6"
      data-viz="commercial-aircraft-final-assembly-geography-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
          Heavy industrial capacity · site lens
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          Assembly-line share by final-assembly site
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          {fmtN(HEADLINE.largeJetDeliveries)} large-jet deliveries in 2025
          attributed across {HEADLINE.siteCount} FAL campuses. Renton alone is{" "}
          {fmtPct(HEADLINE.topSiteSharePct)}; the top three sites hold{" "}
          {fmtPct(HEADLINE.top3SharePct)}. Site HHI ≈ {fmtN(SITE_HHI)}.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Top site (Renton)", value: fmtPct(HEADLINE.topSiteSharePct) },
            { label: "Top-3 site share", value: fmtPct(HEADLINE.top3SharePct) },
            { label: "US FAL share", value: fmtPct(HEADLINE.usSiteSharePct) },
            { label: "COMAC site share", value: fmtPct(HEADLINE.nonDuopolySharePct) },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-0.5 text-lg font-bold text-white">{k.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={tab}
          onChange={setTab}
          options={[
            { id: "sites", label: "Site share" },
            { id: "concentration", label: "Concentration" },
            { id: "geography", label: "Geography" },
            { id: "throughput", label: "Throughput" },
          ]}
        />
        <div className="flex flex-wrap gap-3">
          <ToggleGroup
            label="OEM"
            value={oem}
            onChange={setOem}
            options={[
              { id: "all", label: "All" },
              { id: "airbus", label: "Airbus" },
              { id: "boeing", label: "Boeing" },
              { id: "comac", label: "COMAC" },
            ]}
          />
          <ToggleGroup
            label="Class"
            value={jetClass}
            onChange={setJetClass}
            options={[
              { id: "all", label: "Large jets" },
              { id: "narrowbody", label: "Narrowbody" },
              { id: "widebody", label: "Widebody" },
            ]}
          />
        </div>
      </div>

      {tab === "sites" && (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ChartCard
              title="2025 deliveries by final-assembly site"
              subtitle="Share of filtered pool — A320 multi-FAL splits are line-estimated"
            >
              <ToggleGroup
                label="Units"
                value={unit}
                onChange={setUnit}
                options={[
                  { id: "share", label: "Share %" },
                  { id: "deliveries", label: "Aircraft" },
                ]}
              />
              <div className="mt-4 h-[380px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    layout="vertical"
                    margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      tickFormatter={(v) =>
                        unit === "share" ? `${v}%` : fmtN(Number(v))
                      }
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={78}
                      tick={{ fontSize: 11, fill: "#334155" }}
                    />
                    <Tooltip
                      formatter={(v) =>
                        unit === "share"
                          ? fmtPct(Number(v))
                          : `${fmtN(Number(v))} aircraft`
                      }
                      labelFormatter={(_, payload) => {
                        const row = payload?.[0]?.payload as
                          | { full?: string; oem?: string }
                          | undefined;
                        return row?.full
                          ? `${row.full} · ${row.oem}`
                          : String(_);
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {barData.map((d) => (
                        <Cell key={d.name} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
          <div className="lg:col-span-2">
            <ChartCard
              title="OEM vs site framing"
              subtitle="Same 2025 large-jet pool, different cut"
            >
              <div className="h-[380px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={DUAL_FRAMING}
                    layout="vertical"
                    margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      domain={[0, 60]}
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="frame"
                      width={100}
                      tick={{ fontSize: 10, fill: "#334155" }}
                    />
                    <Tooltip
                      formatter={(v) => fmtPct(Number(v))}
                    />
                    <Bar
                      dataKey="sharePct"
                      fill="#0f172a"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {tab === "concentration" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Cumulative share vs equal split"
            subtitle={`Lorenz-style ladder · site HHI ${fmtN(SITE_HHI)} (10,000 = monopoly)`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={CONCENTRATION_CURVE}
                  margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="rank"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    label={{
                      value: "Sites ranked by deliveries",
                      position: "insideBottom",
                      offset: -2,
                      style: { fontSize: 11, fill: "#94a3b8" },
                    }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      fmtPct(Number(v)),
                      name === "cumSharePct" ? "Cumulative" : "Equal split",
                    ]}
                    labelFormatter={(r) => {
                      const row = CONCENTRATION_CURVE.find((c) => c.rank === r);
                      return row ? `#${r} ${row.site}` : `Rank ${r}`;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumSharePct"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.25}
                    strokeWidth={2}
                    name="cumSharePct"
                  />
                  <Line
                    type="monotone"
                    dataKey="equalSharePct"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    dot={false}
                    name="equalSharePct"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="A320 family monthly rate path"
            subtitle="Disclosed 2027 target 75/mo — multi-FAL network under one rate"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={A320_RATE_PATH}
                  margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    domain={[40, 80]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `${v}/mo`}
                  />
                  <Tooltip
                    formatter={(v, _, item) => [
                      `${v}/mo`,
                      (item?.payload as { quality?: string })?.quality ===
                      "disclosed"
                        ? "Disclosed target"
                        : "Approx waypoint",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="#0284c7"
                    fill="#38bdf8"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "geography" && (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ChartCard
              title="Final-assembly bubble map"
              subtitle="Bubble area ∝ 2025 site deliveries · color = OEM"
            >
              <SiteBubbleMap oem={oem} jetClass={jetClass} />
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
                {(Object.keys(OEM_COLOR) as OemId[])
                  .filter((k) => k !== "embraer")
                  .map((k) => (
                    <span key={k} className="inline-flex items-center gap-1.5">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ background: OEM_COLOR[k] }}
                      />
                      {k === "airbus"
                        ? "Airbus"
                        : k === "boeing"
                          ? "Boeing"
                          : "COMAC"}
                    </span>
                  ))}
              </div>
            </ChartCard>
          </div>
          <div className="lg:col-span-2">
            <ChartCard
              title="Deliveries by region"
              subtitle={`${fmtN(LARGE_JET_DELIVERIES)} large-jet handovers`}
            >
              <div className="h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={REGION_ROLLUP}
                      dataKey="deliveries"
                      nameKey="region"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={88}
                      paddingAngle={2}
                    >
                      {REGION_ROLLUP.map((r) => (
                        <Cell
                          key={r.region}
                          fill={REGION_COLOR[r.region] ?? "#64748b"}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v, name) => [
                        `${fmtN(Number(v))} (${fmtPct(
                          (100 * Number(v)) / LARGE_JET_DELIVERIES,
                        )})`,
                        String(name),
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="space-y-1.5 text-sm text-slate-600">
                {REGION_ROLLUP.map((r) => (
                  <li
                    key={r.region}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{
                          background: REGION_COLOR[r.region] ?? "#64748b",
                        }}
                      />
                      {r.region}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {fmtPct((100 * r.deliveries) / LARGE_JET_DELIVERIES)}
                    </span>
                  </li>
                ))}
              </ul>
            </ChartCard>
          </div>
        </div>
      )}

      {tab === "throughput" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="FAL lines vs 2025 deliveries"
            subtitle="Bubble size ∝ deliveries per line · filter with OEM / class"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 12, right: 16, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="falLines"
                    name="FAL lines"
                    domain={[0, 5]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    label={{
                      value: "Disclosed FAL lines",
                      position: "insideBottom",
                      offset: -2,
                      style: { fontSize: 11, fill: "#94a3b8" },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="deliveries2025"
                    name="Deliveries"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => fmtN(Number(v))}
                  />
                  <ZAxis type="number" dataKey="perLine" range={[60, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => {
                      if (name === "deliveries2025")
                        return [fmtN(Number(v)), "Deliveries"];
                      if (name === "falLines")
                        return [String(v), "FAL lines"];
                      if (name === "perLine")
                        return [fmtN(Number(v)), "Per line"];
                      return [String(v), String(name)];
                    }}
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | { short?: string; site?: string }
                        | undefined;
                      return row?.site ?? row?.short ?? "";
                    }}
                  />
                  <Scatter data={scatterData}>
                    {scatterData.map((s) => (
                      <Cell key={s.id} fill={OEM_COLOR[s.oem]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Campus scoreboard"
            subtitle="Sorted by deliveries · confidence tag from data module"
          >
            <div className="max-h-80 overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-white text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="py-2 pr-2">Site</th>
                    <th className="py-2 pr-2">OEM</th>
                    <th className="py-2 pr-2 text-right">Del.</th>
                    <th className="py-2 text-right">/line</th>
                  </tr>
                </thead>
                <tbody>
                  {scatterData.map((s) => (
                    <tr
                      key={s.id}
                      className="border-t border-slate-100 text-slate-700"
                    >
                      <td className="py-2 pr-2 font-medium text-slate-900">
                        {s.short}
                      </td>
                      <td className="py-2 pr-2">{s.oemLabel}</td>
                      <td className="py-2 pr-2 text-right tabular-nums">
                        {fmtN(s.deliveries2025)}
                      </td>
                      <td className="py-2 text-right tabular-nums">
                        {fmtN(s.perLine)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      )}

      <details className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <summary className="cursor-pointer font-semibold text-slate-800">
          Sources & methodology
        </summary>
        <p className="mt-2">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {SOURCES.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-slate-500">
          Sites in module: {ASSEMBLY_SITES.length} · large-jet core{" "}
          {fmtN(LARGE_JET_DELIVERIES)} aircraft
        </p>
      </details>
    </div>
  );
}
