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
  DEBT_PRODUCTS,
  DEBT_PRODUCT_CURVE,
  DEPOSIT_SHARES,
  EQUITY_SHARES,
  HEADLINE,
  HHI_BY_LENS,
  ISSUER_SHARES,
  LENS_COMPARE,
  LIQUID_PARKING,
  REVOLVING_SHARES,
  SOURCE_NOTE,
  SOURCES,
  VINTAGE_CHECKS,
  VINTAGE_SLOPE,
  WEALTH_CONCENTRATION_CURVE,
  WEALTH_SHARES,
  fmtHhi,
  fmtPct,
  fmtTn,
} from "@/data/consumer-finance-markets-concentration-2026q3-data";

// viz-types: HHI bars, Lorenz area+line, debt-product stacked+pie, vintage slope lines, lens scatter, liquid donut | layout: default

type ViewId = "hhi" | "ladder" | "products" | "vintage";
type LadderMetric = "sharePct" | "netWorthTn";
type CurveLens = "wealth" | "debtProducts";
type SlopeMetric = "top1WealthPct" | "top1EquityPct" | "top10WealthPct";
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

export function ConsumerFinanceMarketsConcentration2026q3Dashboard() {
  const [view, setView] = useState<ViewId>("hhi");
  const [ladderMetric, setLadderMetric] = useState<LadderMetric>("sharePct");
  const [curveLens, setCurveLens] = useState<CurveLens>("wealth");
  const [showEqualLine, setShowEqualLine] = useState(true);
  const [slopeMetric, setSlopeMetric] = useState<SlopeMetric>("top1EquityPct");
  const [assetMetric, setAssetMetric] = useState<AssetMetric>("top1Pct");
  const [productMode, setProductMode] = useState<"share" | "stock">("share");

  const curve =
    curveLens === "wealth" ? WEALTH_CONCENTRATION_CURVE : DEBT_PRODUCT_CURVE;

  const hhiBars = useMemo(
    () => [...HHI_BY_LENS].sort((a, b) => b.hhi - a.hhi),
    [],
  );

  const wealthBars = useMemo(() => {
    const rows = [...WEALTH_SHARES];
    if (ladderMetric === "sharePct") {
      return rows.sort((a, b) => b.sharePct - a.sharePct);
    }
    return rows.sort((a, b) => b.netWorthTn - a.netWorthTn);
  }, [ladderMetric]);

  const assetBars = useMemo(() => {
    const rows = [...ASSET_LENS];
    return rows.sort((a, b) => b[assetMetric] - a[assetMetric]);
  }, [assetMetric]);

  const debtBars = useMemo(() => {
    const rows = [...DEBT_PRODUCTS];
    if (productMode === "share") {
      return rows.sort((a, b) => b.sharePct - a.sharePct);
    }
    return rows.sort((a, b) => b.stockTn - a.stockTn);
  }, [productMode]);

  const debtPie = useMemo(
    () =>
      DEBT_PRODUCTS.map((r) => ({
        name: r.short,
        value: r.sharePct,
        fill: r.fill,
      })),
    [],
  );

  const liquidPie = useMemo(
    () =>
      LIQUID_PARKING.map((r) => ({
        name: r.short,
        value: r.sharePct,
        fill: r.fill,
        tn: r.tn,
      })),
    [],
  );

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
        y: l.thickTopPct,
        z: Math.max(8, l.thickTopPct / 4),
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

  const slopeLabel =
    slopeMetric === "top1WealthPct"
      ? "Top-1 wealth %"
      : slopeMetric === "top1EquityPct"
        ? "Top-1 equity %"
        : "Top-10 wealth %";

  return (
    <div
      className="space-y-6"
      data-viz="consumer-finance-markets-concentration-2026q3"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Consumer finance — Q3 concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Equity HHI {fmtHhi(HEADLINE.equityHhi)} · Mortgage takes{" "}
          {fmtPct(HEADLINE.top1DebtProductSharePct, 1)} of household debt ·
          Top-1 wealth {fmtPct(HEADLINE.top1WealthSharePct, 1)}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Q3 vintage adds HHI across ledgers and a liability-side product split
          on NY Fed{" "}
          <span className="text-sky-300">{fmtTn(HEADLINE.totalDebtTn, 3)}</span>{" "}
          debt. People-side equities remain the thick tip (top 1% ~{" "}
          {fmtPct(HEADLINE.top1EquitySharePct)}); debt products are mortgage-
          dominated (top-3 products ~{fmtPct(HEADLINE.top3DebtProductSharePct, 1)}
          ). Liquid parking: deposits ~{fmtPct(HEADLINE.depositsShareOfLiquidPct, 1)}{" "}
          vs MMF {fmtTn(HEADLINE.mmfTn, 2)}.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Equity HHI",
              value: fmtHhi(HEADLINE.equityHhi),
              sub: "People-side thick tip",
            },
            {
              label: "Mortgage share",
              value: fmtPct(HEADLINE.top1DebtProductSharePct, 1),
              sub: "Of $18.93T HH debt",
            },
            {
              label: "Top-1 wealth",
              value: fmtPct(HEADLINE.top1WealthSharePct, 1),
              sub: HEADLINE.top1WealthLabel,
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
            { id: "hhi", label: "HHI map" },
            { id: "ladder", label: "Wealth ladder" },
            { id: "products", label: "Debt products" },
            { id: "vintage", label: "Vintage slope" },
          ]}
        />
      </div>

      {view === "hhi" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Concentration index by ledger"
            subtitle="Analytical HHI on stated bucket shares (0–10,000)"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hhiBars} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 5500]} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={88}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtHhi(Number(v)), "HHI"]}
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.label ?? "")
                    }
                  />
                  <Bar dataKey="hhi" radius={[0, 4, 4, 0]}>
                    {hhiBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Top-1 vs thick-top scatter"
            subtitle="Each lens plotted by tip share vs thick-top share"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Top-1"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    domain={[0, 80]}
                    label={{
                      value: "Top-1 %",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Thick top"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    domain={[0, 100]}
                    label={{
                      value: "Thick top %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
                      name === "x" ? "Top-1" : name === "y" ? "Thick top" : name,
                    ]}
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.label ?? "")
                    }
                  />
                  <Scatter data={lensScatter} fill={VIOLET}>
                    {lensScatter.map((r) => (
                      <Cell
                        key={r.id}
                        fill={
                          r.id === "equities"
                            ? VIOLET
                            : r.id === "debtProducts"
                              ? ROSE
                              : r.id === "revolving"
                                ? AMBER
                                : r.id === "issuers"
                                  ? SLATE
                                  : SKY
                        }
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Asset-lens tip shares"
            subtitle="Same percentile cuts, different ledgers"
          >
            <div className="mb-4">
              <ToggleGroup
                label="Metric"
                value={assetMetric}
                onChange={setAssetMetric}
                options={[
                  { id: "top1Pct", label: "Top 1%" },
                  { id: "top10Pct", label: "Top 10%" },
                  { id: "bottom50Pct", label: "Bottom 50%" },
                ]}
              />
            </div>
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assetBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} angle={-18} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v) => [`${Number(v).toFixed(1)}%`, "Share"]} />
                  <Bar dataKey={assetMetric} radius={[4, 4, 0, 0]}>
                    {assetBars.map((r) => (
                      <Cell key={r.lens} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Save vs borrow contrast"
            subtitle="Equity / deposit ownership vs estimated revolving shares"
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contrastRows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v) => [`${Number(v)}%`, ""]} />
                  <Bar dataKey="equities" name="Equities" fill={VIOLET} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="deposits" name="Deposits" fill={SKY} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="revolving" name="Revolving" fill={AMBER} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "ladder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Cumulative share vs equal split"
            subtitle="Lorenz-style curve — toggle equal-share reference"
          >
            <div className="mb-4 flex flex-wrap gap-3">
              <ToggleGroup
                label="Curve"
                value={curveLens}
                onChange={setCurveLens}
                options={[
                  { id: "wealth", label: "Net worth" },
                  { id: "debtProducts", label: "Debt products" },
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
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={curve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
                  <Tooltip formatter={(v) => [`${Number(v)}%`, ""]} />
                  <Area
                    type="monotone"
                    dataKey="sharePct"
                    name="Cumulative"
                    fill={curveLens === "wealth" ? "#0ea5e933" : "#f43f5e33"}
                    stroke={curveLens === "wealth" ? SKY : ROSE}
                    strokeWidth={2}
                  />
                  {showEqualLine && (
                    <Line
                      type="monotone"
                      dataKey="equalPct"
                      name="Equal"
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
            subtitle="Toggle share % vs $ trillions"
          >
            <div className="mb-4">
              <ToggleGroup
                label="Metric"
                value={ladderMetric}
                onChange={setLadderMetric}
                options={[
                  { id: "sharePct", label: "Share %" },
                  { id: "netWorthTn", label: "$ trillions" },
                ]}
              />
            </div>
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wealthBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) => [
                      ladderMetric === "sharePct"
                        ? `${Number(v)}%`
                        : fmtTn(Number(v), 1),
                      ladderMetric === "sharePct" ? "Share" : "Net worth",
                    ]}
                  />
                  <Bar dataKey={ladderMetric} radius={[4, 4, 0, 0]}>
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

      {view === "products" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Household debt by product"
            subtitle="NY Fed 2026Q2 stock — mortgage dominates the stack"
          >
            <div className="mb-4">
              <ToggleGroup
                label="Show"
                value={productMode}
                onChange={setProductMode}
                options={[
                  { id: "share", label: "Share %" },
                  { id: "stock", label: "$ trillions" },
                ]}
              />
            </div>
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={debtBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) => [
                      productMode === "share"
                        ? `${Number(v).toFixed(1)}%`
                        : fmtTn(Number(v), 3),
                      productMode === "share" ? "Share" : "Stock",
                    ]}
                  />
                  <Bar
                    dataKey={productMode === "share" ? "sharePct" : "stockTn"}
                    radius={[4, 4, 0, 0]}
                  >
                    {debtBars.map((r) => (
                      <Cell key={r.product} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Debt-product mix"
            subtitle={`Top-1 mortgage ${fmtPct(HEADLINE.top1DebtProductSharePct, 1)} · Top-3 ${fmtPct(HEADLINE.top3DebtProductSharePct, 1)}`}
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={debtPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {debtPie.map((r) => (
                      <Cell key={r.name} fill={r.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${Number(v).toFixed(1)}%`, "Share"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
              {debtPie.map((r) => (
                <span key={r.name} className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: r.fill }}
                  />
                  {r.name} {r.value.toFixed(1)}%
                </span>
              ))}
            </div>
          </ChartCard>

          <ChartCard
            title="Liquid parking: deposits vs MMF"
            subtitle={`Deposits ${fmtTn(HEADLINE.depositsTn, 2)} · MMF ${fmtTn(HEADLINE.mmfTn, 2)}`}
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={liquidPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                  >
                    {liquidPie.map((r) => (
                      <Cell key={r.name} fill={r.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${Number(v).toFixed(1)}% (${fmtTn(Number(item?.payload?.tn ?? 0), 2)})`,
                      "Share of liquid pair",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Card issuer purchase volume"
            subtitle={`Top-3 clears ~${fmtPct(HEADLINE.top3IssuerSharePct)} · HHI ${fmtHhi(HEADLINE.issuerHhi)}`}
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={issuerPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    paddingAngle={1}
                  >
                    {issuerPie.map((r) => (
                      <Cell key={r.name} fill={r.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${Number(v)}%`, "Share"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "vintage" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Top-share vintage slope"
            subtitle="DFA-consistent rounds — equity tip stays thicker than wealth tip"
          >
            <div className="mb-4">
              <ToggleGroup
                label="Series"
                value={slopeMetric}
                onChange={setSlopeMetric}
                options={[
                  { id: "top1EquityPct", label: "Top-1 equity" },
                  { id: "top1WealthPct", label: "Top-1 wealth" },
                  { id: "top10WealthPct", label: "Top-10 wealth" },
                ]}
              />
            </div>
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={VINTAGE_SLOPE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" domain={[20, 60]} />
                  <Tooltip
                    formatter={(v) => [`${Number(v)}%`, slopeLabel]}
                  />
                  <Area
                    type="monotone"
                    dataKey={slopeMetric}
                    fill="#8b5cf622"
                    stroke={VIOLET}
                    strokeWidth={2}
                    name={slopeLabel}
                  />
                  <Line
                    type="monotone"
                    dataKey={slopeMetric}
                    stroke={VIOLET}
                    strokeWidth={2}
                    dot={{ r: 4, fill: VIOLET }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Wealth vs equity tip path"
            subtitle="Both series — equity top-1 stays near mid-50s"
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={VINTAGE_SLOPE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" domain={[25, 60]} />
                  <Tooltip formatter={(v) => [`${Number(v)}%`, ""]} />
                  <Line
                    type="monotone"
                    dataKey="top1WealthPct"
                    name="Top-1 wealth"
                    stroke={SKY}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="top1EquityPct"
                    name="Top-1 equity"
                    stroke={VIOLET}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Q3 vintage checks"
            subtitle="Tape anchors carried into the concentration lens"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3 font-semibold">Print</th>
                    <th className="py-2 pr-3 font-semibold">Value</th>
                    <th className="py-2 pr-3 font-semibold">Source</th>
                    <th className="py-2 font-semibold">Conf.</th>
                  </tr>
                </thead>
                <tbody>
                  {VINTAGE_CHECKS.map((r) => (
                    <tr key={r.id} className="border-b border-slate-100">
                      <td className="py-2.5 pr-3 font-medium text-slate-800">
                        {r.label}
                      </td>
                      <td className="py-2.5 pr-3 tabular-nums text-slate-900">
                        {r.value}
                      </td>
                      <td className="py-2.5 pr-3 text-slate-500">{r.source}</td>
                      <td className="py-2.5 text-slate-500">{r.confidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>

          <ChartCard
            title="How to read the Q3 lens"
            subtitle="People skew ≠ product skew ≠ firm skew"
          >
            <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
              <li>
                <span className="font-semibold text-slate-900">People:</span>{" "}
                equities HHI {fmtHhi(HEADLINE.equityHhi)} with top-1 ~{" "}
                {fmtPct(HEADLINE.top1EquitySharePct)}; wealth tip ~{" "}
                {fmtPct(HEADLINE.top1WealthSharePct, 1)}.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Products:</span>{" "}
                mortgage alone is {fmtPct(HEADLINE.top1DebtProductSharePct, 1)}{" "}
                of {fmtTn(HEADLINE.totalDebtTn, 3)} HH debt — HHI{" "}
                {fmtHhi(HEADLINE.debtProductHhi)}.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Firms:</span>{" "}
                top-3 card issuers ~{fmtPct(HEADLINE.top3IssuerSharePct)} of
                purchase volume (HHI {fmtHhi(HEADLINE.issuerHhi)}) — moderate
                vs equity ownership.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Cash:</span>{" "}
                deposits still dominate the liquid pair (~
                {fmtPct(HEADLINE.depositsShareOfLiquidPct, 1)}) even with MMF at{" "}
                {fmtTn(HEADLINE.mmfTn, 2)}.
              </li>
            </ul>
          </ChartCard>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs leading-relaxed text-slate-600">
        <p className="font-semibold text-slate-800">Sources & methodology</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {SOURCES.map((s) => (
            <a
              key={s.url}
              href={s.url}
              className="text-sky-700 underline-offset-2 hover:underline"
            >
              {s.label}
            </a>
          ))}
        </p>
        <p className="mt-2 text-slate-500">
          Accent: equity HHI {fmtHhi(HEADLINE.equityHhi)} · mortgage{" "}
          {fmtPct(HEADLINE.top1DebtProductSharePct, 1)} · July saving{" "}
          {fmtPct(HEADLINE.savingJulyPct, 1)} · APR−funds gap ~
          {HEADLINE.cardAprFundsGapPp} pp · teal {TEAL}
        </p>
      </div>
    </div>
  );
}
