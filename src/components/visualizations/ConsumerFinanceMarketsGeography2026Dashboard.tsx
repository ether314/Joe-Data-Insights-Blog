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
  CASH_PARKING,
  CENSUS_REGIONS,
  HEADLINE,
  METER_COMPARE,
  PRODUCT_GEO,
  SOURCE_NOTE,
  TOP_STATES,
  cashCapacityScatter,
  debtRiskScatter,
  fmtPct,
  fmtTn,
  productStackedRows,
} from "@/data/consumer-finance-markets-geography-2026-data";

// viz-types: region bars+pie, state ladder, product stacked, debt×risk scatter, cash capacity scatter, meter compare | layout: default

type ViewId = "regions" | "states" | "products" | "risk";
type RegionMetric = "share" | "dollars" | "vsPop";
type StateFilter = "all" | "West" | "South" | "Northeast" | "Midwest";
type ProductMetric = "stack" | "top1";

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

export function ConsumerFinanceMarketsGeography2026Dashboard() {
  const [view, setView] = useState<ViewId>("regions");
  const [regionMetric, setRegionMetric] = useState<RegionMetric>("share");
  const [stateFilter, setStateFilter] = useState<StateFilter>("all");
  const [productMetric, setProductMetric] = useState<ProductMetric>("stack");

  const regionBars = useMemo(() => {
    const rows = [...CENSUS_REGIONS];
    if (regionMetric === "dollars") {
      return rows.sort((a, b) => b.debtTn - a.debtTn);
    }
    if (regionMetric === "vsPop") {
      return rows
        .map((r) => ({
          ...r,
          vsPopPp: Number((r.sharePct - r.popSharePct).toFixed(1)),
        }))
        .sort((a, b) => b.vsPopPp - a.vsPopPp);
    }
    return rows.sort((a, b) => b.sharePct - a.sharePct);
  }, [regionMetric]);

  const regionPie = useMemo(
    () =>
      CENSUS_REGIONS.map((r) => ({
        name: r.short,
        value: r.sharePct,
        fill: r.fill,
      })),
    [],
  );

  const stateBars = useMemo(() => {
    let rows = [...TOP_STATES];
    if (stateFilter !== "all") {
      rows = rows.filter((s) => s.region === stateFilter);
    }
    return rows.sort((a, b) => b.sharePct - a.sharePct);
  }, [stateFilter]);

  const productStack = useMemo(() => productStackedRows(), []);
  const productTop1 = useMemo(
    () => [...PRODUCT_GEO].sort((a, b) => b.top1SharePct - a.top1SharePct),
    [],
  );

  const riskScatter = useMemo(() => debtRiskScatter(), []);
  const cashScatter = useMemo(() => cashCapacityScatter(), []);
  const meters = useMemo(() => METER_COMPARE.filter((m) => m.id !== "delinq"), []);
  const delinqMeters = useMemo(
    () => CENSUS_REGIONS.map((r) => ({
      region: r.short,
      rate: r.cardDelinq90Pct,
      fill: r.fill,
    })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="consumer-finance-markets-geography-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Consumer finance — geography lens
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          Where household debt, cash, and card stress sit on the US map
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          The {HEADLINE.top1RegionLabel} holds ~{HEADLINE.top1RegionSharePct}% of
          the ${HEADLINE.totalDebtTn}T household-debt perimeter;{" "}
          {HEADLINE.top1StateLabel} alone is ~{HEADLINE.top1StateSharePct}%;
          revolving tip and serious card stress lean {HEADLINE.top1DelinqRegion};
          bank-deposit capacity still thickens in the{" "}
          {HEADLINE.top1DepositRegionLabel} (~{HEADLINE.top1DepositRegionSharePct}
          %). Debt activity, cash parking, and delinquency are three different maps.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "West debt share",
              value: fmtPct(HEADLINE.top1RegionSharePct, 0),
            },
            {
              label: "CA state tip",
              value: fmtPct(HEADLINE.top1StateSharePct),
            },
            {
              label: "South card 90+",
              value: fmtPct(HEADLINE.top1CardDelinqPct),
            },
            {
              label: "NE deposit share",
              value: fmtPct(HEADLINE.top1DepositRegionSharePct, 0),
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
            { id: "states", label: "States" },
            { id: "products", label: "Products" },
            { id: "risk", label: "Risk & cash" },
          ]}
        />
        {view === "regions" && (
          <ToggleGroup
            label="Metric"
            value={regionMetric}
            onChange={setRegionMetric}
            options={[
              { id: "share", label: "Share %" },
              { id: "dollars", label: "Debt $" },
              { id: "vsPop", label: "vs Pop" },
            ]}
          />
        )}
        {view === "states" && (
          <ToggleGroup
            label="Region"
            value={stateFilter}
            onChange={setStateFilter}
            options={[
              { id: "all", label: "All" },
              { id: "West", label: "West" },
              { id: "South", label: "South" },
              { id: "Northeast", label: "Northeast" },
              { id: "Midwest", label: "Midwest" },
            ]}
          />
        )}
        {view === "products" && (
          <ToggleGroup
            label="Lens"
            value={productMetric}
            onChange={setProductMetric}
            options={[
              { id: "stack", label: "Regional stack" },
              { id: "top1", label: "Top-1 by product" },
            ]}
          />
        )}
      </div>

      {view === "regions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Census-region debt ladder"
            subtitle={
              regionMetric === "dollars"
                ? "Household debt stock by Census region ($T)"
                : regionMetric === "vsPop"
                  ? "Debt share minus population share (pp)"
                  : `Share of ${fmtTn(HEADLINE.totalDebtTn)} NY Fed perimeter`
            }
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tickFormatter={(v) =>
                      regionMetric === "dollars"
                        ? `$${v}T`
                        : regionMetric === "vsPop"
                          ? `${v}pp`
                          : `${v}%`
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={72}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) =>
                      regionMetric === "dollars"
                        ? fmtTn(Number(value))
                        : regionMetric === "vsPop"
                          ? `${Number(value)} pp`
                          : fmtPct(Number(value))
                    }
                  />
                  <Bar
                    dataKey={
                      regionMetric === "dollars"
                        ? "debtTn"
                        : regionMetric === "vsPop"
                          ? "vsPopPp"
                          : "sharePct"
                    }
                    radius={[0, 4, 4, 0]}
                  >
                    {regionBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Debt-share pie"
            subtitle="West + South clear ~55% of national household debt"
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {regionPie.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "states" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Top-state debt ladder"
            subtitle={
              stateFilter === "all"
                ? "Largest state shares of national household debt"
                : `${stateFilter} states in the top-10 ladder`
            }
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stateBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 18]}
                  />
                  <YAxis
                    type="category"
                    dataKey="abbrev"
                    width={40}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => [
                      fmtPct(Number(v)),
                      `${item?.payload?.state ?? ""} debt share`,
                    ]}
                  />
                  <Bar dataKey="sharePct" radius={[0, 4, 4, 0]}>
                    {stateBars.map((s) => (
                      <Cell key={s.abbrev} fill={s.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="State tip vs revolving stress"
            subtitle="Bubble size = revolving balances ($B); Y = card 90+ %"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="sharePct"
                    name="Debt share"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Debt share %",
                      position: "insideBottom",
                      offset: -4,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="cardDelinq90Pct"
                    name="Card 90+"
                    unit="%"
                    domain={[5, 10]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Card 90+ %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="revolvingBn" range={[60, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) =>
                      String(name).includes("share") || String(name).includes("Debt")
                        ? fmtPct(Number(v))
                        : String(name).includes("90")
                          ? fmtPct(Number(v))
                          : `${v}`
                    }
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.state ?? "")
                    }
                  />
                  <Scatter data={stateBars}>
                    {stateBars.map((s) => (
                      <Cell key={s.abbrev} fill={s.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "products" && (
        <div className="grid gap-6">
          {productMetric === "stack" ? (
            <ChartCard
              title="Liability geography by product"
              subtitle="Same Census regions, different tips — mortgage ≠ cards ≠ autos"
            >
              <div className="h-[340px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productStack}
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="product" tick={{ fontSize: 12 }} />
                    <YAxis
                      tickFormatter={(v) => `${v}%`}
                      domain={[0, 100]}
                    />
                    <Tooltip formatter={(v) => fmtPct(Number(v))} />
                    <Legend />
                    <Bar dataKey="West" stackId="a" fill="#0ea5e9" />
                    <Bar dataKey="South" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="Northeast" stackId="a" fill="#8b5cf6" />
                    <Bar dataKey="Midwest" stackId="a" fill="#14b8a6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          ) : (
            <ChartCard
              title="Top-1 region by product"
              subtitle="Which Census region owns the tip of each liability book"
            >
              <div className="h-[320px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={productTop1}
                    layout="vertical"
                    margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      domain={[0, 40]}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="short"
                      width={72}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(v, _n, item) => [
                        fmtPct(Number(v)),
                        `${item?.payload?.top1Region ?? ""} tip`,
                      ]}
                    />
                    <Bar dataKey="top1SharePct" radius={[0, 4, 4, 0]}>
                      {productTop1.map((p) => (
                        <Cell key={p.short} fill={p.fill} />
                      ))}
                    </Bar>
                    <Line
                      type="monotone"
                      dataKey="top1SharePct"
                      stroke="#0f172a"
                      strokeWidth={0}
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-3 grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
                {productTop1.map((p) => (
                  <li key={p.product}>
                    <span className="font-semibold text-slate-800">
                      {p.short}:
                    </span>{" "}
                    {p.top1Region} {fmtPct(p.top1SharePct)}
                  </li>
                ))}
              </ul>
            </ChartCard>
          )}
        </div>
      )}

      {view === "risk" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Debt share × card stress"
            subtitle="Bubble size = regional debt stock ($T)"
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Debt share"
                    unit="%"
                    domain={[18, 32]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Debt share %",
                      position: "insideBottom",
                      offset: -4,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Card 90+"
                    unit="%"
                    domain={[5, 9.5]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Card 90+ %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[120, 420]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.region ?? "")
                    }
                    formatter={(v, name) =>
                      String(name).includes("share") || name === "Debt share"
                        ? fmtPct(Number(v))
                        : String(name).includes("90") || name === "Card 90+"
                          ? fmtPct(Number(v))
                          : fmtTn(Number(v))
                    }
                  />
                  <Scatter data={riskScatter}>
                    {riskScatter.map((d) => (
                      <Cell key={d.region} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Debt activity vs deposit capacity"
            subtitle="X = debt share; Y = FDIC deposit share; bubble = wealth proxy"
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    domain={[18, 32]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Debt share %",
                      position: "insideBottom",
                      offset: -4,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    domain={[12, 36]}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Deposit share %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 360]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.region ?? "")
                    }
                    formatter={(v) => fmtPct(Number(v))}
                  />
                  <Scatter data={cashScatter}>
                    {cashScatter.map((d) => (
                      <Cell key={d.region} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Meter compare — Top-1 shares"
            subtitle="Different ledgers, different geographic tips"
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={meters}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 40]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={110}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => [
                      fmtPct(Number(v)),
                      item?.payload?.top1Label ?? "Top-1",
                    ]}
                  />
                  <Bar dataKey="top1SharePct" radius={[0, 4, 4, 0]}>
                    {meters.map((m) => (
                      <Cell key={m.id} fill={m.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Card 90+ by region"
            subtitle={`National theme anchor ~${fmtPct(HEADLINE.nationalCardDelinqPct)}`}
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={delinqMeters}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="region" tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={[0, 10]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                    {delinqMeters.map((d) => (
                      <Cell key={d.region} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <div className="lg:col-span-2">
            <ChartCard title="Cash parking mix" subtitle="Deposit $T vs debt share by region">
              <div className="h-[260px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={CASH_PARKING}
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="short" tick={{ fontSize: 12 }} />
                    <YAxis
                      yAxisId="left"
                      tickFormatter={(v) => `$${v}T`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tickFormatter={(v) => `${v}%`}
                      domain={[0, 40]}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="depositTn"
                      name="Deposits $T"
                      radius={[4, 4, 0, 0]}
                    >
                      {CASH_PARKING.map((r) => (
                        <Cell key={r.id} fill={r.fill} />
                      ))}
                    </Bar>
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="debtSharePct"
                      name="Debt share %"
                      stroke="#0f172a"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
