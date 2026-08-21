"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  HEADLINE,
  METER_COMPARE,
  REGION_CAPACITY,
  SOURCE_NOTE,
  TOKEN_ORIGINS,
  areaPath,
  fmtGw,
  fmtPct,
  fmtTokensT,
  growthScatter,
  metroBars,
  ownerHqRollup,
  pipelineCompare,
  regionBars,
  tokenBrandBars,
  tokenOriginPie,
} from "@/data/ai-compute-demand-geography-2026-data";

// viz-types: region bars+pie, metro capacity/growth/pipeline bars, capacity×growth scatter, token origin pie+brand bars, pipeline vs live grouped bars, stacked area path, meter compare, owner HQ bars | layout: default

type ViewId = "regions" | "metros" | "tokens" | "pipeline";
type RegionMetric = "share" | "gw";
type MetroMetric = "capacity" | "growth" | "pipeline";
type TokenFilter = "all" | "China" | "United States";
type MetroRegion = "all" | "United States" | "China" | "Europe" | "Other";

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

export function AiComputeDemandGeography2026Dashboard() {
  const [view, setView] = useState<ViewId>("regions");
  const [regionMetric, setRegionMetric] = useState<RegionMetric>("share");
  const [metroMetric, setMetroMetric] = useState<MetroMetric>("capacity");
  const [tokenFilter, setTokenFilter] = useState<TokenFilter>("all");
  const [metroRegion, setMetroRegion] = useState<MetroRegion>("all");

  const bars = useMemo(() => regionBars(regionMetric), [regionMetric]);
  const pie = useMemo(
    () =>
      REGION_CAPACITY.map((r) => ({
        name: r.short,
        value: r.sharePct,
        fill: r.fill,
      })),
    [],
  );
  const path = useMemo(() => areaPath(), []);
  const metros = useMemo(() => metroBars(metroMetric), [metroMetric]);
  const scatter = useMemo(() => growthScatter(metroRegion), [metroRegion]);
  const tokenPie = useMemo(() => tokenOriginPie(), []);
  const tokenBrands = useMemo(
    () => tokenBrandBars(tokenFilter),
    [tokenFilter],
  );
  const pipeline = useMemo(() => pipelineCompare(), []);
  const owners = useMemo(() => ownerHqRollup(), []);

  return (
    <div
      className="space-y-6"
      data-viz="ai-compute-demand-geography-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
          AI compute demand — geography lens
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          Where tokens, sites, and capacity land on the map
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          The {HEADLINE.top1RegionLabel} holds ~{HEADLINE.top1RegionSharePct}% of
          AI DC capacity by power draw, and ~{HEADLINE.usPipelineSharePct}% of
          the {HEADLINE.pipelineSites}-site hyperscale pipeline — while
          China-origin brands clear ~{HEADLINE.tokenChinaOriginPct}% of June
          2026 token throughput.{" "}
          {HEADLINE.dualHubLabel} alone is ~{HEADLINE.dualHubSharePct}% of live
          hyperscale capacity. Capacity geography, token geography, and
          ownership geography are three different maps.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "US capacity share",
              value: fmtPct(HEADLINE.top1RegionSharePct),
            },
            {
              label: "China token origin",
              value: fmtPct(HEADLINE.tokenChinaOriginPct, 1),
            },
            {
              label: "Dual-hub capacity",
              value: fmtPct(HEADLINE.dualHubSharePct),
            },
            {
              label: "US pipeline sites",
              value: fmtPct(HEADLINE.usPipelineSharePct),
            },
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

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "regions", label: "Regions" },
            { id: "metros", label: "Metros" },
            { id: "tokens", label: "Tokens" },
            { id: "pipeline", label: "Pipeline" },
          ]}
        />
        {view === "regions" && (
          <ToggleGroup
            label="Metric"
            value={regionMetric}
            onChange={setRegionMetric}
            options={[
              { id: "share", label: "Share %" },
              { id: "gw", label: "GW draw" },
            ]}
          />
        )}
        {view === "metros" && (
          <>
            <ToggleGroup
              label="Metric"
              value={metroMetric}
              onChange={setMetroMetric}
              options={[
                { id: "capacity", label: "Capacity %" },
                { id: "growth", label: "YoY growth" },
                { id: "pipeline", label: "Pipeline wt" },
              ]}
            />
            <ToggleGroup
              label="Scatter region"
              value={metroRegion}
              onChange={setMetroRegion}
              options={[
                { id: "all", label: "All" },
                { id: "United States", label: "US" },
                { id: "China", label: "China" },
                { id: "Europe", label: "Europe" },
              ]}
            />
          </>
        )}
        {view === "tokens" && (
          <ToggleGroup
            label="Brand origin"
            value={tokenFilter}
            onChange={setTokenFilter}
            options={[
              { id: "all", label: "All" },
              { id: "China", label: "China" },
              { id: "United States", label: "US" },
            ]}
          />
        )}
      </div>

      {view === "regions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Regional AI DC capacity"
            subtitle={`Power-draw synthesis · ~${fmtGw(HEADLINE.worldAiDcGw)} perimeter`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) =>
                      regionMetric === "share" ? `${v}%` : `${v} GW`
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={56}
                    tick={{ fontSize: 12, fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      regionMetric === "share"
                        ? fmtPct(Number(v))
                        : fmtGw(Number(v))
                    }
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {bars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Capacity share pie"
            subtitle="US · China · Europe = ~77% top-3"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {pie.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {REGION_CAPACITY.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-1.5 text-xs text-slate-600"
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: r.fill }}
                  />
                  {r.short} {fmtPct(r.sharePct)}
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard
            title="Capacity-share path 2022–2026"
            subtitle="Editorial regional path — not a new microdata extract"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={path}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Area
                    type="monotone"
                    dataKey="US"
                    stackId="1"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.85}
                  />
                  <Area
                    type="monotone"
                    dataKey="China"
                    stackId="1"
                    stroke="#f43f5e"
                    fill="#f43f5e"
                    fillOpacity={0.85}
                  />
                  <Area
                    type="monotone"
                    dataKey="Europe"
                    stackId="1"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.85}
                  />
                  <Area
                    type="monotone"
                    dataKey="MEA"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.85}
                  />
                  <Area
                    type="monotone"
                    dataKey="APAC"
                    stackId="1"
                    stroke="#14b8a6"
                    fill="#14b8a6"
                    fillOpacity={0.85}
                  />
                  <Area
                    type="monotone"
                    dataKey="Other"
                    stackId="1"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.7}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Five geography meters"
            subtitle="Capacity ≠ tokens ≠ pipeline ≠ ownership"
          >
            <div className="space-y-4">
              {METER_COMPARE.map((m) => (
                <div key={m.id}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-slate-800">
                      {m.label}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {fmtPct(m.topSharePct, m.id === "tokens" ? 1 : 0)} ·{" "}
                      {m.topLabel}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(m.topSharePct, 100)}%`,
                        background: m.fill,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {m.map}: {m.note}
                  </p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {view === "metros" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Metro / market ladder"
            subtitle="Synergy Aug 19 bands — capacity hints illustrative within disclosed ranks"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metros}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) =>
                      metroMetric === "growth" ? `${v}%` : `${v}`
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={64}
                    tick={{ fontSize: 12, fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      metroMetric === "growth"
                        ? fmtPct(Number(v))
                        : metroMetric === "capacity"
                          ? fmtPct(Number(v), 1)
                          : String(v)
                    }
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {metros.map((m) => (
                      <Cell key={m.id} fill={m.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Capacity × growth scatter"
            subtitle="Bubble size ∝ pipeline weight · Texas sits high-growth / mid-capacity"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 12, right: 16, left: 8, bottom: 12 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Capacity %"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "Capacity hint %",
                      position: "insideBottom",
                      offset: -4,
                      fontSize: 11,
                      fill: "#94a3b8",
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="YoY %"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "Ops YoY %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                      fill: "#94a3b8",
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => {
                      if (name === "Capacity %") return fmtPct(Number(v), 1);
                      if (name === "YoY %") return fmtPct(Number(v));
                      return String(v);
                    }}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.label ?? ""
                    }
                  />
                  <Scatter data={scatter}>
                    {scatter.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "tokens" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Token origin geography"
            subtitle={`June 2026 major-brands series · ${fmtTokensT(HEADLINE.tokenTotalT)}/mo perimeter`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tokenPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {tokenPie.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {TOKEN_ORIGINS.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-1.5 text-xs text-slate-600"
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: t.fill }}
                  />
                  {t.short} {fmtPct(t.sharePct, 1)}
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard
            title="Brand ladder by origin"
            subtitle="Ownership ≠ routed tokens — ByteDance tops usage without chip scale"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={tokenBrands}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={100}
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                  <Bar dataKey="sharePct" radius={[0, 4, 4, 0]}>
                    {tokenBrands.map((b) => (
                      <Cell key={b.id} fill={b.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Chip ownership by HQ"
            subtitle="US Big-5 ~71% of world H100e — opposite of China token lead"
          >
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={owners}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="region"
                    tick={{ fontSize: 12, fill: "#334155" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                  <Bar dataKey="sharePct" radius={[4, 4, 0, 0]}>
                    {owners.map((o) => (
                      <Cell key={o.region} fill={o.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Why the maps disagree"
            subtitle={SOURCE_NOTE.slice(0, 180) + "…"}
          >
            <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
              <li>
                <span className="font-semibold text-slate-800">Capacity</span> —
                US ~{fmtPct(HEADLINE.top1RegionSharePct)} of AI DC power draw.
              </li>
              <li>
                <span className="font-semibold text-slate-800">Tokens</span> —
                China-origin brands ~{fmtPct(HEADLINE.tokenChinaOriginPct, 1)}{" "}
                of June throughput ({HEADLINE.tokenTop1Brand} alone ~
                {fmtPct(HEADLINE.tokenTop1BrandPct, 1)}).
              </li>
              <li>
                <span className="font-semibold text-slate-800">Ownership</span> —
                US hyperscalers ~{fmtPct(HEADLINE.ownerUsHqSharePct, 1)} of
                H100e stock; China owners ~{fmtPct(HEADLINE.ownerChinaSharePct)}.
              </li>
              <li>
                <span className="font-semibold text-slate-800">Sites</span> —{" "}
                {HEADLINE.dualHubLabel} = {fmtPct(HEADLINE.dualHubSharePct)} of
                live hyperscale; top-20 markets = {fmtPct(HEADLINE.marketTop20Pct)}.
              </li>
            </ul>
          </ChartCard>
        </div>
      )}

      {view === "pipeline" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Pipeline sites vs live capacity"
            subtitle={`${HEADLINE.pipelineSites} known hyperscale pipeline sites (+${HEADLINE.pipelineDelta} vs Q3 ${HEADLINE.pipelinePriorSites})`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pipeline}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="short"
                    tick={{ fontSize: 12, fill: "#334155" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Bar
                    dataKey="sites"
                    name="Pipeline sites %"
                    fill="#38bdf8"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="live"
                    name="Live capacity %"
                    fill="#64748b"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Growth premium callouts"
            subtitle="Texas ops +71% YoY vs world +36% — inland US pulling share"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: "World pipeline sites",
                  value: String(HEADLINE.pipelineSites),
                  sub: `+${HEADLINE.pipelineDelta} vs Q3 ledger`,
                },
                {
                  label: "US pipeline share",
                  value: fmtPct(HEADLINE.usPipelineSharePct),
                  sub: `${HEADLINE.top20UsSeats}/${HEADLINE.top20TotalSeats} top-20 seats`,
                },
                {
                  label: "Texas ops YoY",
                  value: fmtPct(HEADLINE.texasOpsYoyPct),
                  sub: `vs world ${fmtPct(HEADLINE.worldOpsYoyPct)}`,
                },
                {
                  label: "Top-20 market share",
                  value: fmtPct(HEADLINE.marketTop20Pct),
                  sub: `Top-40 ≈ ${fmtPct(HEADLINE.marketTop40Pct)}`,
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    {c.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {c.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{c.sub}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              {SOURCE_NOTE}
            </p>
          </ChartCard>
        </div>
      )}
    </div>
  );
}
