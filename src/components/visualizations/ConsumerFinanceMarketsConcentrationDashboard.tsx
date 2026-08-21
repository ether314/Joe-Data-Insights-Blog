"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
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
  ASSET_LENS,
  DEPOSIT_SHARES,
  EQUITY_SHARES,
  HEADLINE,
  ISSUER_CONCENTRATION_CURVE,
  ISSUER_SHARES,
  LENS_COMPARE,
  REVOLVING_SHARES,
  SOURCE_NOTE,
  SOURCES,
  VINTAGE_CHECKS,
  WEALTH_CONCENTRATION_CURVE,
  WEALTH_SHARES,
  fmtPct,
  fmtTn,
} from "@/data/consumer-finance-markets-concentration-2026-data";

// viz-types: Lorenz area+line, wealth share bars, asset-lens grouped bars, issuer pie, lens scatter, revolving vs equity contrast | layout: default

type ViewId = "wealth" | "assets" | "borrow" | "issuers";
type WealthMetric = "sharePct" | "netWorthTn";
type AssetMetric = "top1Pct" | "top10Pct" | "bottom50Pct";

const SKY = "#0ea5e9";
const ROSE = "#f43f5e";
const VIOLET = "#8b5cf6";
const SLATE = "#64748b";
const AMBER = "#f59e0b";
const TEAL = "#14b8a6";

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

export function ConsumerFinanceMarketsConcentrationDashboard() {
  const [view, setView] = useState<ViewId>("wealth");
  const [wealthMetric, setWealthMetric] = useState<WealthMetric>("sharePct");
  const [assetMetric, setAssetMetric] = useState<AssetMetric>("top1Pct");
  const [showEqualLine, setShowEqualLine] = useState(true);
  const [curveLens, setCurveLens] = useState<"wealth" | "issuers">("wealth");
  const [borrowSide, setBorrowSide] = useState<"equity" | "deposit" | "both">(
    "both",
  );

  const curve =
    curveLens === "wealth"
      ? WEALTH_CONCENTRATION_CURVE
      : ISSUER_CONCENTRATION_CURVE;

  const wealthBars = useMemo(() => {
    const rows = [...WEALTH_SHARES];
    if (wealthMetric === "sharePct") {
      return rows.sort((a, b) => b.sharePct - a.sharePct);
    }
    return rows.sort((a, b) => b.netWorthTn - a.netWorthTn);
  }, [wealthMetric]);

  const assetBars = useMemo(() => {
    const rows = [...ASSET_LENS];
    return rows.sort((a, b) => b[assetMetric] - a[assetMetric]);
  }, [assetMetric]);

  const issuerPie = useMemo(
    () =>
      ISSUER_SHARES.map((r) => ({
        name: r.short,
        value: r.sharePct,
        fill: r.fill,
      })),
    [],
  );

  const lensScatter = useMemo(
    () =>
      LENS_COMPARE.map((l) => ({
        ...l,
        x: l.top1Pct,
        y: l.top3Pct,
        z: Math.max(8, l.top3Pct / 4),
      })),
    [],
  );

  const contrastRows = useMemo(() => {
    const buckets = ["Top 1%", "90–99%", "50–90%", "Bottom 50%"] as const;
    return buckets.map((short, i) => ({
      short,
      equities: EQUITY_SHARES[i]?.sharePct ?? 0,
      deposits: DEPOSIT_SHARES[i]?.sharePct ?? 0,
      revolving: REVOLVING_SHARES[i]?.sharePct ?? 0,
    }));
  }, []);

  return (
    <div
      className="space-y-6"
      data-viz="consumer-finance-markets-concentration-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Consumer finance — concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Top 1% holds {HEADLINE.top1WealthSharePct}% of net worth · Top 10%
          holds {HEADLINE.top10WealthSharePct}%
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Aggregate household wealth near{" "}
          <span className="text-sky-300">
            {fmtTn(HEADLINE.householdNetWorthTn, 0)}
          </span>{" "}
          coexists with a thin bottom half (~
          {fmtPct(HEADLINE.bottom50WealthSharePct, 1)}). Equities are far more
          top-heavy (top 1% ~{fmtPct(HEADLINE.top1EquitySharePct)}); revolving
          balances flip the skew — the bottom 50% hold about{" "}
          {fmtPct(HEADLINE.bottom50CardSharePct)} of card debt. On the issuer
          side, top-3 purchase volume clears ~{fmtPct(HEADLINE.top3IssuerSharePct)}.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Top-1 wealth",
              value: fmtPct(HEADLINE.top1WealthSharePct, 1),
              sub: HEADLINE.top1WealthLabel,
            },
            {
              label: "Top-10 wealth",
              value: fmtPct(HEADLINE.top10WealthSharePct, 1),
              sub: "DFA net worth",
            },
            {
              label: "Top-1 equities",
              value: fmtPct(HEADLINE.top1EquitySharePct),
              sub: "Corporate equities & funds",
            },
            {
              label: "Top-3 issuers",
              value: fmtPct(HEADLINE.top3IssuerSharePct),
              sub: HEADLINE.issuerUniverseLabel,
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-3"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums">{k.value}</p>
              <p className="text-xs text-slate-400">{k.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "wealth", label: "Wealth ladder" },
            { id: "assets", label: "Asset lenses" },
            { id: "borrow", label: "Save vs borrow" },
            { id: "issuers", label: "Card issuers" },
          ]}
        />
      </div>

      {view === "wealth" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Cumulative share vs equal split"
            subtitle="Lorenz-style wealth curve — toggle equal-share reference"
          >
            <div className="mb-4 flex flex-wrap gap-3">
              <ToggleGroup
                label="Curve"
                value={curveLens}
                onChange={setCurveLens}
                options={[
                  { id: "wealth", label: "Net worth" },
                  { id: "issuers", label: "Issuer ranks" },
                ]}
              />
              <ToggleGroup
                label="Equal line"
                value={showEqualLine ? "on" : "off"}
                onChange={(v) => setShowEqualLine(v === "on")}
                options={[
                  { id: "on", label: "Show" },
                  { id: "off", label: "Hide" },
                ]}
              />
            </div>
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={curve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="sharePct"
                    name="Cumulative share"
                    fill={ROSE}
                    fillOpacity={0.25}
                    stroke={ROSE}
                    strokeWidth={2}
                  />
                  {showEqualLine && (
                    <Line
                      type="monotone"
                      dataKey="equalPct"
                      name="Equal split"
                      stroke={SLATE}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Wealth percentile ladder"
            subtitle="DFA-style net worth shares · ~$169T aggregate"
          >
            <div className="mb-4">
              <ToggleGroup
                label="Metric"
                value={wealthMetric}
                onChange={setWealthMetric}
                options={[
                  { id: "sharePct", label: "Share %" },
                  { id: "netWorthTn", label: "$ trillions" },
                ]}
              />
            </div>
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wealthBars} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) =>
                      wealthMetric === "sharePct" ? `${v}%` : `$${v}T`
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={78}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey={wealthMetric}
                    name={
                      wealthMetric === "sharePct" ? "Share %" : "Net worth $T"
                    }
                    radius={[0, 4, 4, 0]}
                  >
                    {wealthBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "assets" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Same percentiles, different ledgers"
            subtitle="Top-1 / top-10 / bottom-50 shares across asset classes"
          >
            <div className="mb-4">
              <ToggleGroup
                label="Sort by"
                value={assetMetric}
                onChange={setAssetMetric}
                options={[
                  { id: "top1Pct", label: "Top 1%" },
                  { id: "top10Pct", label: "Top 10%" },
                  { id: "bottom50Pct", label: "Bottom 50%" },
                ]}
              />
            </div>
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assetBars} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={120}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip />
                  <Bar dataKey={assetMetric} name="Share %" radius={[0, 4, 4, 0]}>
                    {assetBars.map((r) => (
                      <Cell key={r.lens} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Concentration map: top-1 vs thick top"
            subtitle="Scatter of lenses — issuers use literal top-3; wealth lenses use top-10"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Top-1 %"
                    domain={[0, 60]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Top-1 share %",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Thick top %"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Top-10 / top-3 %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="Lens" data={lensScatter} fill={VIOLET}>
                    {lensScatter.map((p) => (
                      <Cell
                        key={p.id}
                        fill={
                          p.id === "equities"
                            ? VIOLET
                            : p.id === "wealth"
                              ? ROSE
                              : p.id === "deposits"
                                ? SKY
                                : p.id === "revolving"
                                  ? AMBER
                                  : TEAL
                        }
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
              {LENS_COMPARE.map((l) => (
                <li key={l.id}>
                  <span className="font-semibold text-slate-800">{l.label}</span>
                  : {fmtPct(l.top1Pct, 1)} / {fmtPct(l.top3Pct, 1)}
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      {view === "borrow" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Who owns assets vs who carries revolving"
            subtitle="Equities and deposits vs estimated card-balance shares"
          >
            <div className="mb-4">
              <ToggleGroup
                label="Asset side"
                value={borrowSide}
                onChange={setBorrowSide}
                options={[
                  { id: "both", label: "Equities + deposits" },
                  { id: "equity", label: "Equities only" },
                  { id: "deposit", label: "Deposits only" },
                ]}
              />
            </div>
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contrastRows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip />
                  {(borrowSide === "both" || borrowSide === "equity") && (
                    <Bar
                      dataKey="equities"
                      name="Equities"
                      fill={VIOLET}
                      radius={[4, 4, 0, 0]}
                    />
                  )}
                  {(borrowSide === "both" || borrowSide === "deposit") && (
                    <Bar
                      dataKey="deposits"
                      name="Deposits"
                      fill={SKY}
                      radius={[4, 4, 0, 0]}
                    />
                  )}
                  <Bar
                    dataKey="revolving"
                    name="Revolving"
                    fill={AMBER}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Revolving balance ladder (estimated)"
            subtitle="Middle- and bottom-heavy — inverse of equity ownership"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={REVOLVING_SHARES}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip />
                  <Bar
                    yAxisId="left"
                    dataKey="sharePct"
                    name="Share of revolving"
                    radius={[4, 4, 0, 0]}
                  >
                    {REVOLVING_SHARES.map((r) => (
                      <Cell key={r.bucket} fill={r.fill} />
                    ))}
                  </Bar>
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cumulativeSharePct"
                    name="Cumulative"
                    stroke={SLATE}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Estimated to sum to G.19 revolving ~{fmtTn(HEADLINE.revolvingTn, 3)}{" "}
              (June 2026). Not a Fed supervisory cell.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "issuers" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Purchase-volume pie"
            subtitle="General-purpose card issuers — top-3 ~52%, top-5 ~71%"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={issuerPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {issuerPie.map((r) => (
                      <Cell key={r.name} fill={r.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Issuer concentration ladder"
            subtitle="Cumulative purchase-volume share by rank"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ISSUER_SHARES} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={64}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="sharePct" name="Share %" radius={[0, 4, 4, 0]}>
                    {ISSUER_SHARES.map((r) => (
                      <Cell key={r.issuer} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Vintage context</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {VINTAGE_CHECKS.map((v) => (
            <div key={v.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {v.label}
              </p>
              <p className="font-bold tabular-nums text-slate-900">{v.value}</p>
              <p className="text-xs text-slate-500">
                {v.source} · {v.confidence}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          {SOURCE_NOTE}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Sources:{" "}
          {SOURCES.map((s, i) => (
            <span key={s.url}>
              {i > 0 && " · "}
              <a
                href={s.url}
                className="text-sky-700 underline-offset-2 hover:underline"
              >
                {s.label}
              </a>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
