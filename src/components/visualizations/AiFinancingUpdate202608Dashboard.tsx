"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  ETF_CHANNELS,
  HEADLINE,
  SOURCE_NOTE,
  fmtBn,
  fmtPct,
  fmtTn,
  flowVsStockCompare,
  fundedChannelBars,
  issuancePathBars,
  lossBearerPie,
  newMetricBars,
  stressScatter,
  structureBars,
} from "@/data/ai-financing-update-202608-data";

// viz-types: flow-vs-stock bars, channel stock bars, issuance line, stress scatter, structure bars, loss-bearer pie | layout: default
// viz-plan: Q3 flow→Aug stock map; $1.07T funded + $675B leases; HS issuance path; equity→credit stress; SPV/GPU structures; first-loss pie

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

type Lens = "stock" | "stress" | "structures";
type Focus = "all" | "funded" | "overhang" | "junior";

export function AiFinancingUpdate202608Dashboard() {
  const [lens, setLens] = useState<Lens>("stock");
  const [focus, setFocus] = useState<Focus>("all");

  const flowStock = useMemo(() => flowVsStockCompare(), []);
  const channels = useMemo(() => {
    const all = fundedChannelBars("all");
    if (focus === "funded") return all.filter((c) => c.layer === "funded");
    if (focus === "overhang") return all.filter((c) => c.layer === "overhang");
    if (focus === "junior")
      return all.filter((c) => c.seniority === "junior" || c.id === "gpu-secured");
    return all;
  }, [focus]);
  const newMetrics = useMemo(() => {
    const all = newMetricBars();
    if (focus === "overhang") return all.filter((m) => m.id === "leases");
    if (focus === "junior") return all.filter((m) => m.id === "gpu" || m.id === "stress-high");
    if (focus === "funded")
      return all.filter((m) =>
        ["funded-stock", "hs-stock", "project-stock"].includes(m.id),
      );
    return all;
  }, [focus]);
  const issuance = useMemo(() => issuancePathBars(), []);
  const stress = useMemo(() => stressScatter(), []);
  const structures = useMemo(() => structureBars(), []);
  const bearers = useMemo(() => lossBearerPie(), []);
  const etfBars = useMemo(
    () =>
      ETF_CHANNELS.map((e) => ({
        ticker: e.ticker,
        flows: e.flows2025Bn,
        fill: e.color,
        name: e.name,
      })),
    [],
  );

  return (
    <div className="space-y-6" data-viz="ai-financing-update-202608">
      <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — Q3 2026 flow print → Aug 202608 stock map
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Funded AI-infra credit stock ~{fmtBn(HEADLINE.fundedStockTotalBn)} — plus{" "}
          {fmtBn(HEADLINE.uncommencedLeasesBn)} lease overhang
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Q3 answered theme weight inside credit <em>supply</em> (~{fmtPct(HEADLINE.aiIgSharePct)} of
          USD IG). August’s Booth / Hepp map answers where the <em>stock</em> sits: ~{fmtBn(HEADLINE.hsSeniorStockBn)}{" "}
          HS senior unsecured, ~{fmtBn(HEADLINE.projectDcStockBn)} project/DC, ABS, private credit, and
          GPU-secured — about {HEADLINE.stockVsFlowMultiple.toFixed(1)}× the carried{" "}
          {fmtBn(HEADLINE.priorFlowPerimeterBn)} YTD flow perimeter. Stress band: {fmtBn(HEADLINE.stressLossLowBn)}–
          {fmtBn(HEADLINE.stressLossHighBn)} credit loss under a severe equity re-rating.
        </p>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Lens</span>
            {(
              [
                ["stock", "Stock map"],
                ["stress", "Stress & loss"],
                ["structures", "Structures / ETFs"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setLens(id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  lens === id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Focus</span>
            {(
              [
                ["all", "All channels"],
                ["funded", "Funded only"],
                ["overhang", "Lease overhang"],
                ["junior", "Junior / GPU"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFocus(id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  focus === id
                    ? "bg-indigo-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {lens === "stock" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Flow perimeter vs funded stock vs lease overhang"
            subtitle="Q3 $489B YTD flow is not the same object as Aug’s outstanding channel map"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={flowStock} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} interval={0} />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as {
                        label: string;
                        amount: number;
                        note: string;
                      };
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{row.label}</p>
                          <p className="text-slate-700">{fmtBn(row.amount)}</p>
                          <p className="text-xs text-slate-500">{row.note}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="amount" name="USD bn" radius={[6, 6, 0, 0]}>
                    {flowStock.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Aug funded + overhang channels"
            subtitle={
              focus === "junior"
                ? "Junior / GPU sleeves — private credit + chip-secured"
                : focus === "overhang"
                  ? "S&P signed-but-not-commenced leases only"
                  : "Booth / Hepp map — toggle Focus to isolate funded vs overhang"
            }
          >
            {channels.length === 0 ? (
              <div className="flex h-80 items-center justify-center text-sm text-slate-500">
                No channels for this focus.
              </div>
            ) : (
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart
                    data={channels}
                    layout="vertical"
                    margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      tickFormatter={(v) => `$${v}B`}
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      width={140}
                      tick={{ fill: "#334155", fontSize: 11, fontWeight: 600 }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const sorted = sortTooltipPayload(payload);
                        const row = sorted[0]?.payload as {
                          label: string;
                          amount: number;
                          note: string;
                          layer: string;
                        };
                        return (
                          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                            <p className="font-semibold text-slate-900">{row.label}</p>
                            <p className="text-slate-700">{fmtBn(row.amount)}</p>
                            <p className="text-xs text-slate-500">
                              {row.layer} · {row.note}
                            </p>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="amount" name="USD bn" radius={[0, 6, 6, 0]}>
                      {channels.map((c) => (
                        <Cell key={c.id} fill={c.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>

          <ChartCard
            title="Hyperscaler bond issuance path"
            subtitle="Booth frame: 2020–24 avg → 2025 → H1’26 already above full-year 2025"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <LineChart data={issuance} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                    domain={[0, 280]}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as {
                        period: string;
                        amount: number;
                        note: string;
                      };
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{row.period}</p>
                          <p className="text-slate-700">{fmtBn(row.amount)}</p>
                          <p className="text-xs text-slate-500">{row.note}</p>
                        </div>
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#6366f1" }}
                    name="HS issuance"
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="New Aug disclosures (vs Q3)"
            subtitle="Stock, lease overhang, GPU sleeve, and stress high — not restated IG share"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart
                  data={newMetrics}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => (v >= 100 ? `$${v}B` : `${v}`)}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={155}
                    tick={{ fill: "#334155", fontSize: 10, fontWeight: 600 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as {
                        label: string;
                        value: number;
                        unit: string;
                        note: string;
                      };
                      const display =
                        row.unit === "pct" ? fmtPct(row.value) : fmtBn(row.value);
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{row.label}</p>
                          <p className="text-slate-700">{display}</p>
                          <p className="text-xs text-slate-500">{row.note}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="value" name="Value" radius={[0, 6, 6, 0]}>
                    {newMetrics.map((m) => (
                      <Cell key={m.id} fill={m.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {lens === "stress" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Equity shock → credit loss"
            subtitle="Illustrative Booth stress — not a base-case forecast"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="equity"
                    name="Equity loss"
                    unit="T"
                    domain={[8, 16]}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => `$${v}T`}
                    label={{
                      value: "Illustrative equity loss",
                      position: "insideBottom",
                      offset: -4,
                      fill: "#64748b",
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="credit"
                    name="Credit loss"
                    unit="B"
                    domain={[40, 160]}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                    label={{
                      value: "Credit loss",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#64748b",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis range={[120, 280]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as {
                        name: string;
                        equity: number;
                        credit: number;
                        note: string;
                      };
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{row.name}</p>
                          <p className="text-slate-700">
                            Equity {fmtTn(row.equity)} → credit {fmtBn(row.credit)}
                          </p>
                          <p className="text-xs text-slate-500">{row.note}</p>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={stress} name="Stress cases">
                    {stress.map((s) => (
                      <Cell key={s.name} fill={s.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Where first-loss sits"
            subtitle="Directional shares under Booth assumptions — not a binding allocation"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={bearers}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="48%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {bearers.map((b) => (
                      <Cell key={b.id} fill={b.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as {
                        name: string;
                        value: number;
                        note: string;
                      };
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{row.name}</p>
                          <p className="text-slate-700">{fmtPct(row.value)}</p>
                          <p className="text-xs text-slate-500">{row.note}</p>
                        </div>
                      );
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {lens === "structures" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Named structures on the margin"
            subtitle="SPV / GPU / vendor residual — how debt leaves the hyperscaler balance sheet"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={structures} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} interval={0} />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as {
                        label: string;
                        amount: number;
                        structure: string;
                        note: string;
                      };
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{row.label}</p>
                          <p className="text-slate-700">{fmtBn(row.amount)}</p>
                          <p className="text-xs text-slate-500">{row.structure}</p>
                          <p className="text-xs text-slate-500">{row.note}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="amount" name="USD bn" radius={[6, 6, 0, 0]}>
                    {structures.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Equity channel (2025 ETF flows)"
            subtitle="Carried sentiment capacity — secondary ownership, not issuer proceeds"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={etfBars} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="ticker" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as {
                        ticker: string;
                        flows: number;
                        name: string;
                      };
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{row.name}</p>
                          <p className="text-slate-700">{fmtBn(row.flows)} (2025 flows)</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="flows" name="2025 flows" radius={[6, 6, 0, 0]}>
                    {etfBars.map((e) => (
                      <Cell key={e.ticker} fill={e.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}
    </div>
  );
}
