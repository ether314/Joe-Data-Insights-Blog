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
  DEBT_PRODUCTS,
  DEBT_STRESS_SLEEVES,
  HEADLINE,
  ISSUER_CUMULATIVE,
  ISSUER_SHARES,
  LIQUID_PARKING_AUG,
  LIQUID_PATH,
  SAVE_BORROW_MIRROR,
  SOURCE_NOTE,
  SOURCES,
  TIP_SCATTER,
  TOP_SHARE_SCOREBOARD,
  VINTAGE_DELTAS,
  WEALTH_CONCENTRATION_CURVE,
  WEALTH_SHARES,
  fmtPct,
  fmtTn,
} from "@/data/consumer-finance-markets-concentration-202608-data";

// viz-types: top-1/top-3 grouped bars, tip scatter, liquid path+donut, save-borrow grouped+mirror, issuer cumulative area, debt stress dual bars, vintage delta bars | layout: default

type ViewId = "scoreboard" | "liquid" | "mirror" | "firms";
type ScoreMetric = "top1Pct" | "top3Pct" | "thickTopPct";
type MirrorMetric = "equitySharePct" | "revolvingSharePct" | "depositSharePct";
type DeltaFilter = "all" | "moved" | "sticky";

const SKY = "#0ea5e9";
const ROSE = "#f43f5e";
const VIOLET = "#8b5cf6";
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

export function ConsumerFinanceMarketsConcentration202608Dashboard() {
  const [view, setView] = useState<ViewId>("scoreboard");
  const [scoreMetric, setScoreMetric] = useState<ScoreMetric>("top1Pct");
  const [mirrorMetric, setMirrorMetric] = useState<MirrorMetric>("equitySharePct");
  const [deltaFilter, setDeltaFilter] = useState<DeltaFilter>("all");
  const [productMode, setProductMode] = useState<"share" | "stock">("share");
  const [showEqual, setShowEqual] = useState(true);

  const scoreBars = useMemo(() => {
    const rows = [...TOP_SHARE_SCOREBOARD];
    return rows.sort((a, b) => b[scoreMetric] - a[scoreMetric]);
  }, [scoreMetric]);

  const pairedBars = useMemo(
    () =>
      [...TOP_SHARE_SCOREBOARD]
        .map((r) => ({
          short: r.short,
          top1: r.top1Pct,
          top3: r.top3Pct,
          fill: r.fill,
        }))
        .sort((a, b) => b.top1 - a.top1),
    [],
  );

  const liquidPie = useMemo(
    () =>
      LIQUID_PARKING_AUG.map((r) => ({
        name: r.short,
        value: r.sharePct,
        fill: r.fill,
        tn: r.tn,
      })),
    [],
  );

  const mirrorBars = useMemo(() => {
    const rows = [...SAVE_BORROW_MIRROR];
    return rows.sort((a, b) => b[mirrorMetric] - a[mirrorMetric]);
  }, [mirrorMetric]);

  const deltaBars = useMemo(() => {
    let rows = VINTAGE_DELTAS.map((d) => ({
      ...d,
      delta: d.augValue - d.q3Value,
    }));
    if (deltaFilter === "moved") rows = rows.filter((d) => d.moved);
    if (deltaFilter === "sticky") rows = rows.filter((d) => !d.moved);
    return rows;
  }, [deltaFilter]);

  const debtBars = useMemo(() => {
    const rows = [...DEBT_PRODUCTS];
    if (productMode === "share") return rows.sort((a, b) => b.sharePct - a.sharePct);
    return rows.sort((a, b) => b.stockTn - a.stockTn);
  }, [productMode]);

  const issuerPie = useMemo(
    () =>
      ISSUER_SHARES.map((r) => ({
        name: r.short,
        value: r.sharePct,
        fill: r.fill,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="consumer-finance-markets-concentration-202608"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
          Consumer finance — Aug 202608 concentration lens
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          Top-1 wealth {fmtPct(HEADLINE.top1WealthSharePct, 1)} · Top-1 equities{" "}
          {fmtPct(HEADLINE.top1EquitySharePct, 0)} · Top-3 issuers{" "}
          {fmtPct(HEADLINE.top3IssuerSharePct, 0)}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Official ICI MMF {fmtTn(HEADLINE.mmfTn)} (−$92B vs Q3 restatement) while
          people-side tip shares stay sticky. Mortgage remains{" "}
          {fmtPct(HEADLINE.top1DebtProductSharePct, 1)} of {fmtTn(HEADLINE.totalDebtTn)}{" "}
          household debt; G.19 revolving prints {fmtTn(HEADLINE.g19RevolvingTn)}.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "scoreboard", label: "Top-1 / top-3" },
            { id: "liquid", label: "Liquid tape" },
            { id: "mirror", label: "Save vs borrow" },
            { id: "firms", label: "Firms & products" },
          ]}
        />
      </div>

      {view === "scoreboard" && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <ToggleGroup
              label="Rank by"
              value={scoreMetric}
              onChange={setScoreMetric}
              options={[
                { id: "top1Pct", label: "Top 1%" },
                { id: "top3Pct", label: "Top 3" },
                { id: "thickTopPct", label: "Thick top" },
              ]}
            />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Concentration scoreboard"
              subtitle="Top-1 / top-3 market shares across people, products, and firms"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={scoreBars}
                    layout="vertical"
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" tickFormatter={(v) => `${v}%`} />
                    <YAxis
                      type="category"
                      dataKey="short"
                      width={88}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(v) =>
                        typeof v === "number" ? fmtPct(v, 1) : String(v)
                      }
                    />
                    <Bar
                      dataKey={scoreMetric}
                      name={
                        scoreMetric === "top1Pct"
                          ? "Top 1%"
                          : scoreMetric === "top3Pct"
                            ? "Top 3"
                            : "Thick top"
                      }
                      radius={[0, 4, 4, 0]}
                    >
                      {scoreBars.map((r) => (
                        <Cell key={r.id} fill={r.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Top-1 vs top-3 paired"
              subtitle="Same ledgers — tip vs thick tip on one axis"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={pairedBars}
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      formatter={(v) =>
                        typeof v === "number" ? fmtPct(v, 1) : String(v)
                      }
                    />
                    <Bar dataKey="top1" name="Top 1%" fill={ROSE} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="top3" name="Top 3" fill={SKY} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Top-1 vs thick-top scatter"
              subtitle="People (circle), product (diamond via size), firm cluster"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      dataKey="top1Pct"
                      name="Top 1%"
                      unit="%"
                      domain={[0, 80]}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                      type="number"
                      dataKey="thickTopPct"
                      name="Thick top"
                      unit="%"
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <ZAxis range={[80, 280]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      formatter={(v) =>
                        typeof v === "number" ? fmtPct(v, 1) : String(v)
                      }
                    />
                    <Scatter data={TIP_SCATTER} name="Lenses">
                      {TIP_SCATTER.map((p) => (
                        <Cell key={p.id} fill={p.fill} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Wealth Lorenz (sticky tip)"
              subtitle={`Bottom 50% holds ~${fmtPct(HEADLINE.bottom50WealthSharePct, 1)} of ~${fmtTn(HEADLINE.householdNetWorthTn, 0)} net worth`}
            >
              <div className="mb-3">
                <ToggleGroup
                  label="Equality line"
                  value={showEqual ? "show" : "hide"}
                  onChange={(v) => setShowEqual(v === "show")}
                  options={[
                    { id: "show", label: "Show" },
                    { id: "hide", label: "Hide" },
                  ]}
                />
              </div>
              <div className="h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={WEALTH_CONCENTRATION_CURVE}
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                    <Tooltip
                      formatter={(v) =>
                        typeof v === "number" ? fmtPct(v, 1) : String(v)
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="sharePct"
                      name="Cumulative share"
                      fill={SKY}
                      fillOpacity={0.2}
                      stroke={SKY}
                      strokeWidth={2}
                    />
                    {showEqual && (
                      <Line
                        type="monotone"
                        dataKey="equalPct"
                        name="Equality"
                        stroke="#94a3b8"
                        strokeDasharray="4 4"
                        dot={false}
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {view === "liquid" && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <ToggleGroup
              label="Delta filter"
              value={deltaFilter}
              onChange={setDeltaFilter}
              options={[
                { id: "all", label: "All meters" },
                { id: "moved", label: "Moved" },
                { id: "sticky", label: "Sticky tip" },
              ]}
            />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Liquid parking after official MMF print"
              subtitle={`Deposits still ~${fmtPct(HEADLINE.depositsShareOfLiquidPct, 1)} of the pair vs ICI ${fmtTn(HEADLINE.mmfTn)}`}
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={liquidPie}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={100}
                      paddingAngle={2}
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {liquidPie.map((s) => (
                        <Cell key={s.name} fill={s.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v, _n, item) => {
                        const tn = (item?.payload as { tn?: number })?.tn;
                        return typeof v === "number"
                          ? `${fmtPct(v, 1)}${tn != null ? ` (${fmtTn(tn)})` : ""}`
                          : String(v);
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="MMF path into the Aug correction"
              subtitle="Q3 theme restatement → official Aug 19 week ($7.928T)"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={LIQUID_PATH}
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis
                      yAxisId="left"
                      domain={[7.8, 8.1]}
                      tickFormatter={(v) => `$${v}T`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[34, 36]}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="mmfTn"
                      name="MMF $T"
                      fill={VIOLET}
                      fillOpacity={0.25}
                      stroke={VIOLET}
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="mmfSharePct"
                      name="MMF liquid %"
                      stroke={AMBER}
                      strokeWidth={2}
                      dot
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Q3 → Aug vintage deltas"
              subtitle="Tip shares sticky; cash sleeve and disclosed saving moved"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={deltaBars}
                    layout="vertical"
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" />
                    <YAxis
                      type="category"
                      dataKey="short"
                      width={100}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(v, name) => {
                        if (typeof v !== "number") return String(v);
                        if (name === "delta") {
                          const sign = v > 0 ? "+" : "";
                          return `${sign}${v.toFixed(3)}`;
                        }
                        return String(v);
                      }}
                    />
                    <Bar dataKey="delta" name="delta" radius={[0, 4, 4, 0]}>
                      {deltaBars.map((d) => (
                        <Cell
                          key={d.id}
                          fill={d.moved ? d.fill : "#94a3b8"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Wealth buckets (unchanged tip)"
              subtitle="DFA-style stock still ~$52T in the top 1%"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={WEALTH_SHARES}
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      formatter={(v) =>
                        typeof v === "number" ? fmtPct(v, 1) : String(v)
                      }
                    />
                    <Bar dataKey="sharePct" name="Share %" radius={[4, 4, 0, 0]}>
                      {WEALTH_SHARES.map((r) => (
                        <Cell key={r.id} fill={r.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {view === "mirror" && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <ToggleGroup
              label="Sort mirror"
              value={mirrorMetric}
              onChange={setMirrorMetric}
              options={[
                { id: "equitySharePct", label: "By equities" },
                { id: "revolvingSharePct", label: "By revolving" },
                { id: "depositSharePct", label: "By deposits" },
              ]}
            />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Save vs borrow mirror"
              subtitle="Top 1% owns ~54% of equities and ~5% of revolving"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={SAVE_BORROW_MIRROR}
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      formatter={(v) =>
                        typeof v === "number" ? fmtPct(v, 0) : String(v)
                      }
                    />
                    <Bar
                      dataKey="equitySharePct"
                      name="Equities"
                      fill={VIOLET}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="revolvingSharePct"
                      name="Revolving"
                      fill={AMBER}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="depositSharePct"
                      name="Deposits"
                      fill={SKY}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Single-lens rank"
              subtitle="Toggle sort to flip who looks 'democratic'"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mirrorBars}
                    layout="vertical"
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" tickFormatter={(v) => `${v}%`} />
                    <YAxis
                      type="category"
                      dataKey="short"
                      width={72}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(v) =>
                        typeof v === "number" ? fmtPct(v, 0) : String(v)
                      }
                    />
                    <Bar dataKey={mirrorMetric} radius={[0, 4, 4, 0]}>
                      {mirrorBars.map((r) => (
                        <Cell key={r.bucket} fill={r.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Debt share vs stress clock"
              subtitle="High-stress products are small sleeves of $18.93T"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={DEBT_STRESS_SLEEVES}
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                    <YAxis
                      yAxisId="left"
                      tickFormatter={(v) => `${v}%`}
                      domain={[0, 80]}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tickFormatter={(v) => `${v}%`}
                      domain={[0, 14]}
                    />
                    <Tooltip />
                    <Bar
                      yAxisId="left"
                      dataKey="debtSharePct"
                      name="Debt share %"
                      fill={SKY}
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="stressPct"
                      name="Stress %"
                      stroke={ROSE}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Equity tip vs revolving invert"
              subtitle="Same households, opposite Lorenz geometry"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      dataKey="equitySharePct"
                      name="Equity %"
                      unit="%"
                      domain={[0, 60]}
                    />
                    <YAxis
                      type="number"
                      dataKey="revolvingSharePct"
                      name="Revolving %"
                      unit="%"
                      domain={[0, 50]}
                    />
                    <ZAxis range={[100, 260]} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter data={SAVE_BORROW_MIRROR} name="Buckets">
                      {SAVE_BORROW_MIRROR.map((p) => (
                        <Cell key={p.bucket} fill={p.fill} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {view === "firms" && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <ToggleGroup
              label="Debt products"
              value={productMode}
              onChange={setProductMode}
              options={[
                { id: "share", label: "Share %" },
                { id: "stock", label: "$ trillions" },
              ]}
            />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Issuer cumulative ladder"
              subtitle={`Top-1 ${fmtPct(HEADLINE.top1IssuerSharePct, 0)} · Top-3 ${fmtPct(HEADLINE.top3IssuerSharePct, 0)} · Top-5 ${fmtPct(HEADLINE.top5IssuerSharePct, 0)}`}
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={ISSUER_CUMULATIVE}
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" />
                    <YAxis tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                    <Tooltip
                      formatter={(v) =>
                        typeof v === "number" ? fmtPct(v, 0) : String(v)
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="sharePct"
                      name="Cumulative purchase $"
                      fill={TEAL}
                      fillOpacity={0.25}
                      stroke={TEAL}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="sharePct"
                      stroke={TEAL}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Issuer purchase-volume mix"
              subtitle="Nilson-style general-purpose ranks — moderate firm HHI story"
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
                      outerRadius={100}
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {issuerPie.map((s) => (
                        <Cell key={s.name} fill={s.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) =>
                        typeof v === "number" ? fmtPct(v, 0) : String(v)
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Debt-product concentration"
              subtitle={`Mortgage ${fmtPct(HEADLINE.top1DebtProductSharePct, 1)} of NY Fed ${fmtTn(HEADLINE.totalDebtTn)}`}
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={debtBars}
                    layout="vertical"
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      tickFormatter={(v) =>
                        productMode === "share" ? `${v}%` : `$${v}T`
                      }
                    />
                    <YAxis
                      type="category"
                      dataKey="short"
                      width={72}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(v) => {
                        if (typeof v !== "number") return String(v);
                        return productMode === "share"
                          ? fmtPct(v, 1)
                          : fmtTn(v);
                      }}
                    />
                    <Bar
                      dataKey={productMode === "share" ? "sharePct" : "stockTn"}
                      radius={[0, 4, 4, 0]}
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
              title="Issuer ranked bars"
              subtitle="Chase leads; long tail still ~29%"
            >
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ISSUER_SHARES}
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      formatter={(v) =>
                        typeof v === "number" ? fmtPct(v, 0) : String(v)
                      }
                    />
                    <Bar dataKey="sharePct" name="Purchase $" radius={[4, 4, 0, 0]}>
                      {ISSUER_SHARES.map((r) => (
                        <Cell key={r.issuer} fill={r.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
        <p className="font-medium text-slate-800">Sources & methodology</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                className="text-sky-700 underline-offset-2 hover:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
