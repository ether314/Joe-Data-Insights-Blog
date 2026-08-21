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
  REGION_BY_YEAR,
  REGION_ROWS,
  SOURCE_NOTE,
  fmtPct,
  fmtUsdBn,
  regionBars,
  riskScatter,
  scenarioStacked,
  usMetroBars,
} from "@/data/ai-capex-spend-geography-2026-data";

// viz-types: region bars+pie, US metro ladder, stacked area by year, scenario stacks, spend×risk scatter, meter compare | layout: default

type ViewId = "regions" | "metros" | "scenarios" | "risk";
type Metric = "share" | "dollars";
type Scope = "gross" | "ai";
type MetroMetric = "us" | "global" | "growth";
type RiskRegion = "all" | "US" | "Europe" | "APAC" | "MEA";

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

export function AiCapexSpendGeography2026Dashboard() {
  const [view, setView] = useState<ViewId>("regions");
  const [metric, setMetric] = useState<Metric>("share");
  const [scope, setScope] = useState<Scope>("gross");
  const [metroMetric, setMetroMetric] = useState<MetroMetric>("global");
  const [riskRegion, setRiskRegion] = useState<RiskRegion>("all");

  const bars = useMemo(() => regionBars(metric, scope), [metric, scope]);
  const pie = useMemo(
    () =>
      REGION_ROWS.map((r) => ({
        name: r.short,
        value: scope === "ai" ? r.aiSliceBn : r.amountBn,
        fill: r.fill,
      })),
    [scope],
  );
  const metros = useMemo(() => usMetroBars(metroMetric), [metroMetric]);
  const scenarios = useMemo(() => scenarioStacked(), []);
  const risk = useMemo(() => riskScatter(riskRegion), [riskRegion]);

  const perimeter =
    scope === "ai" ? HEADLINE.aiSliceBn : HEADLINE.big5GrossBn;

  return (
    <div
      className="space-y-6"
      data-viz="ai-capex-spend-geography-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
          AI capex & spend — geography lens
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          Where AI infrastructure dollars land on the map
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          Late-Aug Big-5 midpoints total ~${HEADLINE.big5GrossBn}B gross (~$
          {HEADLINE.aiSliceBn}B AI-attributed). The {HEADLINE.top1RegionLabel}{" "}
          absorbs ~{HEADLINE.top1RegionSharePct}% of facility geography;
          {HEADLINE.top1MetroLabel} alone is ~{HEADLINE.top1MetroSharePct}% of
          the global perimeter — while interconnect risk peaks in the same
          densified corridors that print the largest dollar shares.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "US region share",
              value: fmtPct(HEADLINE.usSharePct),
            },
            {
              label: "Top-3 regions",
              value: fmtPct(HEADLINE.top3RegionSharePct),
            },
            {
              label: "NoVA global share",
              value: fmtPct(HEADLINE.top1MetroSharePct),
            },
            {
              label: "US share of raise",
              value: fmtPct(HEADLINE.usRaiseSharePct),
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
            { id: "metros", label: "US metros" },
            { id: "scenarios", label: "Scenarios" },
            { id: "risk", label: "Risk map" },
          ]}
        />
        {view === "regions" && (
          <>
            <ToggleGroup
              label="Metric"
              value={metric}
              onChange={setMetric}
              options={[
                { id: "share", label: "Share %" },
                { id: "dollars", label: "Dollars" },
              ]}
            />
            <ToggleGroup
              label="Scope"
              value={scope}
              onChange={setScope}
              options={[
                { id: "gross", label: "Gross" },
                { id: "ai", label: "AI slice" },
              ]}
            />
          </>
        )}
        {view === "metros" && (
          <ToggleGroup
            label="Metric"
            value={metroMetric}
            onChange={setMetroMetric}
            options={[
              { id: "global", label: "Global %" },
              { id: "us", label: "Of US %" },
              { id: "growth", label: "YoY growth" },
            ]}
          />
        )}
        {view === "risk" && (
          <ToggleGroup
            label="Region"
            value={riskRegion}
            onChange={setRiskRegion}
            options={[
              { id: "all", label: "All" },
              { id: "US", label: "US" },
              { id: "Europe", label: "Europe" },
              { id: "APAC", label: "APAC" },
              { id: "MEA", label: "MEA" },
            ]}
          />
        )}
      </div>

      {view === "regions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Regional facility share"
            subtitle={`Late-Aug Big-5 perimeter ~${fmtUsdBn(perimeter)} (${scope === "ai" ? "AI slice" : "gross"})`}
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
                      metric === "share" ? `${v}%` : `$${v}B`
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
                      metric === "share"
                        ? fmtPct(Number(v), 1)
                        : fmtUsdBn(Number(v))
                    }
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {bars.map((r) => (
                      <Cell key={r.region} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Dollar pie by region"
            subtitle="Residual closes the perimeter — not a geographic claim"
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
                  <Tooltip formatter={(v) => fmtUsdBn(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {REGION_ROWS.map((r) => (
                <div
                  key={r.region}
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
            title="Regional path 2024–2027"
            subtitle="Stacked gross Big-5 by facility region (desk geography)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={REGION_BY_YEAR}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <Tooltip formatter={(v) => fmtUsdBn(Number(v))} />
                  <Area
                    type="monotone"
                    dataKey="US"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.85}
                  />
                  <Area
                    type="monotone"
                    dataKey="Europe"
                    stackId="1"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.85}
                  />
                  <Area
                    type="monotone"
                    dataKey="APAC"
                    stackId="1"
                    stroke="#22c55e"
                    fill="#22c55e"
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
                    dataKey="LatAm"
                    stackId="1"
                    stroke="#a855f7"
                    fill="#a855f7"
                    fillOpacity={0.85}
                  />
                  <Area
                    type="monotone"
                    dataKey="Residual"
                    stackId="1"
                    stroke="#64748b"
                    fill="#64748b"
                    fillOpacity={0.7}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Four geography meters"
            subtitle="Region share ≠ metro tip ≠ raise geography"
          >
            <div className="space-y-4">
              {METER_COMPARE.map((m) => (
                <div key={m.id}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-slate-800">
                      {m.label}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {fmtPct(m.valuePct)}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(m.valuePct, 100)}%`,
                        background: m.fill,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{m.sublabel}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {view === "metros" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="US metro / corridor ladder"
            subtitle={
              metroMetric === "growth"
                ? "YoY growth in disclosed campus tips (desk)"
                : metroMetric === "us"
                  ? "Share of US slice (~$498B)"
                  : "Share of global Big-5 (~$858B)"
            }
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
                      metroMetric === "growth" ? `${v}%` : `${v}%`
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={72}
                    tick={{ fontSize: 12, fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(v) => fmtPct(Number(v), 1)}
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.label ?? "")
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
            title="Metro dollars vs power risk"
            subtitle="Bubble size ∝ √spend; risk is ordinal desk rank"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 12, right: 16, left: 8, bottom: 12 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="shareOfGlobalPct"
                    name="Global %"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "Global spend share",
                      position: "insideBottom",
                      offset: -4,
                      style: { fill: "#64748b", fontSize: 11 },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="powerRisk"
                    name="Risk"
                    domain={[30, 100]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    label={{
                      value: "Interconnect risk",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#64748b", fontSize: 11 },
                    }}
                  />
                  <ZAxis type="number" dataKey="amountBn" range={[60, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) =>
                      name === "Global %"
                        ? fmtPct(Number(v), 1)
                        : name === "Risk"
                          ? String(v)
                          : fmtUsdBn(Number(v))
                    }
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.label ?? "")
                    }
                  />
                  <Scatter
                    data={US_METROS_SCATTER}
                    fill="#3b82f6"
                  >
                    {US_METROS_SCATTER.map((m) => (
                      <Cell key={m.id} fill={m.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "scenarios" && (
        <div className="grid gap-6">
          <ChartCard
            title="Scenario geography stacks"
            subtitle="Absolute dollars by region weight — do not mix scopes"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={scenarios}
                  margin={{ top: 8, right: 16, left: 0, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <Tooltip formatter={(v) => fmtUsdBn(Number(v))} />
                  <Bar dataKey="US" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="Europe" stackId="a" fill="#06b6d4" />
                  <Bar dataKey="APAC" stackId="a" fill="#22c55e" />
                  <Bar
                    dataKey="Other"
                    stackId="a"
                    fill="#94a3b8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              GS GI all-in AI infra (~${HEADLINE.gsGi2026Bn}B) is slightly less
              US-skewed (~{HEADLINE.gsGiUsSharePct}% US) than the Big-5 gross
              facility map (~{HEADLINE.usSharePct}% US). Compare shares within a
              scope; do not read stacked heights across houses as identical
              universes.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "risk" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Spend share × interconnect risk"
            subtitle="Filter by region; bubble size ∝ √facility dollars"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 12, right: 16, left: 8, bottom: 12 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="shareOfGlobalPct"
                    name="Global %"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="number"
                    dataKey="powerRisk"
                    name="Risk"
                    domain={[30, 100]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <ZAxis type="number" dataKey="z" range={[40, 360]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) =>
                      name === "Global %"
                        ? fmtPct(Number(v), 1)
                        : String(v)
                    }
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.label ?? "")
                    }
                  />
                  <Scatter data={risk}>
                    {risk.map((p) => (
                      <Cell key={p.id} fill={p.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="High-risk corridors"
            subtitle={`${HEADLINE.topRiskMetro} leads the ordinal risk tip (${HEADLINE.topRiskScore})`}
          >
            <div className="space-y-3">
              {[...risk]
                .sort((a, b) => b.powerRisk - a.powerRisk)
                .slice(0, 6)
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-sm"
                        style={{ background: p.fill }}
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {p.label}
                        </p>
                        <p className="text-xs text-slate-500">
                          {fmtUsdBn(p.amountBn)} · {fmtPct(p.shareOfGlobalPct, 1)}{" "}
                          global
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {p.powerRisk}
                    </span>
                  </div>
                ))}
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}

const US_METROS_SCATTER = [
  {
    id: "nova",
    label: "Northern Virginia",
    shareOfGlobalPct: 11.0,
    powerRisk: 92,
    amountBn: 94,
    fill: "#2563eb",
  },
  {
    id: "texas",
    label: "Texas",
    shareOfGlobalPct: 8.4,
    powerRisk: 78,
    amountBn: 72,
    fill: "#f97316",
  },
  {
    id: "midwest",
    label: "Midwest",
    shareOfGlobalPct: 7.9,
    powerRisk: 71,
    amountBn: 68,
    fill: "#0ea5e9",
  },
  {
    id: "pnw",
    label: "Pacific Northwest",
    shareOfGlobalPct: 5.6,
    powerRisk: 64,
    amountBn: 48,
    fill: "#14b8a6",
  },
  {
    id: "southwest",
    label: "AZ / NV",
    shareOfGlobalPct: 5.1,
    powerRisk: 81,
    amountBn: 44,
    fill: "#eab308",
  },
  {
    id: "southeast",
    label: "Southeast",
    shareOfGlobalPct: 4.7,
    powerRisk: 58,
    amountBn: 40,
    fill: "#84cc16",
  },
];
