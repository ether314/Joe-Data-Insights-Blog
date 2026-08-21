"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
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
  CURRENCY_BOOKS,
  ETF_DOMICILES,
  FACILITY_REGIONS,
  HEADLINE,
  METER_COMPARE,
  REGION_BY_YEAR,
  REGION_ROWS,
  SOURCE_NOTE,
  corridorBars,
  currencyBars,
  facilityBars,
  fmtPct,
  fmtUsdBn,
  hqAssetGapBars,
  meterBars,
  regionBars,
  riskScatter,
} from "@/data/ai-financing-geography-2026-data";

// viz-types: region bars+pie, facility ladder, stacked area path, HQ×asset gap, currency books, ETF domicile, credit×risk scatter, meter compare | layout: default

type ViewId = "regions" | "facilities" | "books" | "mismatch";
type Metric = "share" | "dollars";
type CorridorMetric = "global" | "us" | "growth" | "risk";
type RiskRegion = "all" | "US" | "Europe" | "APAC" | "Other";
type BookLens = "currency" | "etf";

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

export function AiFinancingGeography2026Dashboard() {
  const [view, setView] = useState<ViewId>("regions");
  const [metric, setMetric] = useState<Metric>("share");
  const [facilityMetric, setFacilityMetric] = useState<Metric>("share");
  const [corridorMetric, setCorridorMetric] =
    useState<CorridorMetric>("global");
  const [bookLens, setBookLens] = useState<BookLens>("currency");
  const [bookMetric, setBookMetric] = useState<Metric>("share");
  const [riskRegion, setRiskRegion] = useState<RiskRegion>("all");

  const bars = useMemo(() => regionBars(metric), [metric]);
  const pie = useMemo(
    () =>
      REGION_ROWS.map((r) => ({
        name: r.short,
        value: r.amountBn,
        fill: r.fill,
      })),
    [],
  );
  const facilities = useMemo(
    () => facilityBars(facilityMetric),
    [facilityMetric],
  );
  const corridors = useMemo(
    () => corridorBars(corridorMetric),
    [corridorMetric],
  );
  const books = useMemo(() => currencyBars(bookMetric), [bookMetric]);
  const gaps = useMemo(() => hqAssetGapBars(), []);
  const meters = useMemo(() => meterBars(), []);
  const risk = useMemo(() => riskScatter(riskRegion), [riskRegion]);

  return (
    <div
      className="space-y-6"
      data-viz="ai-financing-geography-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
          AI financing — geography lens
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          Where AI credit, books, and ETF flows sit on the map
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          Booth/Hepp funded AI-infra credit is ~{fmtUsdBn(HEADLINE.fundedStockBn)}.
          The {HEADLINE.top1RegionLabel} absorbs ~{HEADLINE.top1RegionSharePct}% of
          that stock — while hyperscaler IG issuer HQ is {HEADLINE.hsIgUsHqSharePct}%
          US and project/DC collateral is only ~{HEADLINE.projectUsSharePct}% US.
          Funding HQ, facility geography, and listing domicile are three different maps.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "US funded share",
              value: fmtPct(HEADLINE.top1RegionSharePct),
            },
            {
              label: "Top-3 regions",
              value: fmtPct(HEADLINE.top3RegionSharePct),
            },
            {
              label: "USD book share",
              value: fmtPct(HEADLINE.usdBookSharePct),
            },
            {
              label: "US ETF domicile",
              value: fmtPct(HEADLINE.etfUsListingSharePct),
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
            { id: "facilities", label: "Facilities" },
            { id: "books", label: "Books & ETFs" },
            { id: "mismatch", label: "HQ vs assets" },
          ]}
        />
        {view === "regions" && (
          <ToggleGroup
            label="Metric"
            value={metric}
            onChange={setMetric}
            options={[
              { id: "share", label: "Share %" },
              { id: "dollars", label: "Dollars" },
            ]}
          />
        )}
        {view === "facilities" && (
          <>
            <ToggleGroup
              label="Facility metric"
              value={facilityMetric}
              onChange={setFacilityMetric}
              options={[
                { id: "share", label: "Share %" },
                { id: "dollars", label: "Dollars" },
              ]}
            />
            <ToggleGroup
              label="US corridors"
              value={corridorMetric}
              onChange={setCorridorMetric}
              options={[
                { id: "global", label: "Global %" },
                { id: "us", label: "Of US %" },
                { id: "growth", label: "YoY growth" },
                { id: "risk", label: "Risk score" },
              ]}
            />
          </>
        )}
        {view === "books" && (
          <>
            <ToggleGroup
              label="Lens"
              value={bookLens}
              onChange={setBookLens}
              options={[
                { id: "currency", label: "Currency books" },
                { id: "etf", label: "ETF domicile" },
              ]}
            />
            {bookLens === "currency" && (
              <ToggleGroup
                label="Metric"
                value={bookMetric}
                onChange={setBookMetric}
                options={[
                  { id: "share", label: "Share %" },
                  { id: "dollars", label: "Dollars" },
                ]}
              />
            )}
          </>
        )}
        {view === "mismatch" && (
          <ToggleGroup
            label="Risk region"
            value={riskRegion}
            onChange={setRiskRegion}
            options={[
              { id: "all", label: "All" },
              { id: "US", label: "US" },
              { id: "Europe", label: "Europe" },
              { id: "APAC", label: "APAC" },
              { id: "Other", label: "Other" },
            ]}
          />
        )}
      </div>

      {view === "regions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Funded credit by region"
            subtitle={`Booth/Hepp perimeter ~${fmtUsdBn(HEADLINE.fundedStockBn)}`}
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
                    dataKey="name"
                    width={64}
                    tick={{ fontSize: 12, fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      metric === "share"
                        ? fmtPct(Number(v))
                        : fmtUsdBn(Number(v))
                    }
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.full ?? "")
                    }
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {bars.map((r) => (
                      <Cell key={r.name} fill={r.fill} />
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
            title="Regional funded-stock path"
            subtitle="Desk geography path 2024 → 2026 YTD ($B)"
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
                    dataKey="Other"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Six geography meters"
            subtitle="Funded stock ≠ HQ ≠ collateral ≠ book ≠ ETF domicile"
          >
            <div className="space-y-4">
              {METER_COMPARE.map((m) => (
                <div key={m.id}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-slate-800">
                      {m.label}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {fmtPct(m.top1SharePct)} · {m.top1Label}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(m.top1SharePct, 100)}%`,
                        background: m.fill,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {view === "facilities" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Project / DC collateral by region"
            subtitle={`Facility-tied finance ~${fmtUsdBn(HEADLINE.projectDcBn)}`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={facilities}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) =>
                      facilityMetric === "share" ? `${v}%` : `$${v}B`
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={64}
                    tick={{ fontSize: 12, fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      facilityMetric === "share"
                        ? fmtPct(Number(v))
                        : fmtUsdBn(Number(v))
                    }
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.full ?? "")
                    }
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {facilities.map((r) => (
                      <Cell key={r.name} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              {FACILITY_REGIONS.map((r) => (
                <span key={r.short} className="text-xs text-slate-500">
                  {r.short}: risk {r.powerRisk} · {r.topCorridor}
                </span>
              ))}
            </div>
          </ChartCard>

          <ChartCard
            title="US corridor ladder"
            subtitle={
              corridorMetric === "growth"
                ? "YoY growth in disclosed campus / credit tips"
                : corridorMetric === "us"
                  ? `Share of US project slice (~${fmtUsdBn(130)})`
                  : corridorMetric === "risk"
                    ? "Ordinal interconnect / densification risk"
                    : `Share of global project finance (~${fmtUsdBn(HEADLINE.projectDcBn)})`
            }
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={corridors}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) =>
                      corridorMetric === "risk" ? String(v) : `${v}%`
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={72}
                    tick={{ fontSize: 12, fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      corridorMetric === "risk"
                        ? String(v)
                        : fmtPct(Number(v))
                    }
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.full ?? "")
                    }
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {corridors.map((c) => (
                      <Cell key={c.name} fill={c.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "books" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {bookLens === "currency" ? (
            <>
              <ChartCard
                title="HS IG currency / primary book"
                subtitle={`Five-name YTD spine ~${fmtUsdBn(HEADLINE.hsIgUniverseBn)}`}
              >
                <div className="h-80 w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={books}
                      margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12, fill: "#334155" }}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        tickFormatter={(v) =>
                          bookMetric === "share" ? `${v}%` : `$${v}B`
                        }
                      />
                      <Tooltip
                        formatter={(v) =>
                          bookMetric === "share"
                            ? fmtPct(Number(v))
                            : fmtUsdBn(Number(v))
                        }
                        labelFormatter={(_, payload) =>
                          String(payload?.[0]?.payload?.full ?? "")
                        }
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {books.map((b) => (
                          <Cell key={b.name} fill={b.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-3 space-y-1 text-xs text-slate-500">
                  {CURRENCY_BOOKS.map((c) => (
                    <li key={c.short}>
                      <span className="font-medium text-slate-700">
                        {c.short}
                      </span>
                      : {c.primaryBook}
                      {c.note ? ` — ${c.note}` : ""}
                    </li>
                  ))}
                </ul>
              </ChartCard>

              <ChartCard
                title="Currency share donut"
                subtitle="USD still clears most Mag-7 AI notes"
              >
                <div className="h-80 w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={CURRENCY_BOOKS.map((c) => ({
                          name: c.short,
                          value: c.amountBn,
                          fill: c.fill,
                        }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={100}
                        paddingAngle={2}
                      >
                        {CURRENCY_BOOKS.map((c) => (
                          <Cell key={c.short} fill={c.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => fmtUsdBn(Number(v))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </>
          ) : (
            <>
              <ChartCard
                title="ETF listing domicile"
                subtitle={`2025 thematic + mega-tech flows ~${fmtUsdBn(HEADLINE.etfFlowsBn)}`}
              >
                <div className="h-80 w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ETF_DOMICILES.map((e) => ({
                        name: e.short,
                        full: e.domicile,
                        value: e.sharePct,
                        fill: e.fill,
                      }))}
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
                        dataKey="name"
                        width={48}
                        tick={{ fontSize: 12, fill: "#334155" }}
                      />
                      <Tooltip
                        formatter={(v) => fmtPct(Number(v))}
                        labelFormatter={(_, payload) =>
                          String(payload?.[0]?.payload?.full ?? "")
                        }
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {ETF_DOMICILES.map((e) => (
                          <Cell key={e.short} fill={e.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <ChartCard
                title="Domicile flow dollars"
                subtitle={`QQQ alone ~${fmtUsdBn(HEADLINE.qqqFlowsBn)} of the US tip`}
              >
                <div className="h-80 w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ETF_DOMICILES.map((e) => ({
                          name: e.short,
                          value: e.flowsBn,
                          fill: e.fill,
                        }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={95}
                        paddingAngle={2}
                      >
                        {ETF_DOMICILES.map((e) => (
                          <Cell key={e.short} fill={e.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => fmtUsdBn(Number(v))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-3 space-y-1 text-xs text-slate-500">
                  {ETF_DOMICILES.map((e) => (
                    <li key={e.short}>
                      <span className="font-medium text-slate-700">
                        {e.short}
                      </span>
                      : {e.flagship}
                    </li>
                  ))}
                </ul>
              </ChartCard>
            </>
          )}
        </div>
      )}

      {view === "mismatch" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="US HQ share vs US asset share"
            subtitle="Positive gap = funding HQ more US-heavy than collateral"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={gaps}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Legend />
                  <Bar
                    dataKey="hq"
                    name="US HQ %"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="asset"
                    name="US asset %"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Corridor credit × interconnect risk"
            subtitle="Bubble size ∝ project credit $; filter by region"
          >
            <div className="h-96 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 12, right: 16, left: 8, bottom: 12 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="creditBn"
                    name="Credit $B"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `$${v}B`}
                    label={{
                      value: "Project credit ($B)",
                      position: "insideBottom",
                      offset: -4,
                      style: { fill: "#64748b", fontSize: 11 },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="riskScore"
                    name="Risk"
                    domain={[40, 100]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    label={{
                      value: "Interconnect risk",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#64748b", fontSize: 11 },
                    }}
                  />
                  <ZAxis
                    type="number"
                    dataKey="growthYoYPct"
                    range={[60, 360]}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) =>
                      name === "Credit $B"
                        ? fmtUsdBn(Number(v))
                        : name === "Risk"
                          ? String(v)
                          : `${v}%`
                    }
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.label ?? "")
                    }
                  />
                  <Scatter data={risk} fill="#3b82f6">
                    {risk.map((p) => (
                      <Cell key={p.id} fill={p.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Top-1 share ladder across maps"
            subtitle="Same theme, six different geographic tips"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={meters}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={72}
                    tick={{ fontSize: 12, fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(v) => fmtPct(Number(v))}
                    labelFormatter={(_, payload) =>
                      `${payload?.[0]?.payload?.full ?? ""} · tip ${payload?.[0]?.payload?.tip ?? ""}`
                    }
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {meters.map((m) => (
                      <Cell key={m.name} fill={m.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
