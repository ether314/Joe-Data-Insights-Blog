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
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  DEPLETION_SCENARIOS,
  FUND_COLORS,
  HEADLINE,
  PAYABLE_AFTER_DEPLETION,
  SOURCE_NOTE,
  SOURCES,
  type FundKey,
  fmtBn,
  fmtTn,
  getProjections,
} from "@/data/social-security-trust-fund-data";

type TabKey = FundKey;

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

const TABS: { key: TabKey; label: string }[] = [
  { key: "combined", label: "Combined OASDI" },
  { key: "oasi", label: "OASI" },
  { key: "di", label: "DI" },
];

export function SocialSecurityTrustFundDashboard() {
  const [tab, setTab] = useState<TabKey>("combined");
  const [showWaterfall, setShowWaterfall] = useState(false);

  const projections = useMemo(() => getProjections(tab), [tab]);
  const color = FUND_COLORS[tab];

  const areaData = useMemo(
    () =>
      projections.map((p) => ({
        year: p.year,
        reservesTn: p.reservesBn / 1000,
        ratio: p.trustFundRatioPct,
      })),
    [projections],
  );

  const waterfallData = useMemo(() => {
    const rows = projections.filter((p) => p.netChangeBn !== null);
    return rows.map((p, i) => {
      const prev = i === 0 ? p.reservesBn - (p.netChangeBn ?? 0) : rows[i - 1].reservesBn;
      const end = p.reservesBn;
      const change = p.netChangeBn ?? 0;
      return {
        year: String(p.year),
        start: prev,
        change,
        end,
        fill: change < 0 ? "#ef4444" : "#10b981",
      };
    });
  }, [projections]);

  const slopeData = useMemo(
    () =>
      DEPLETION_SCENARIOS.map((s) => ({
        fund: s.label.replace(" (retirement & survivors)", "").replace(" (disability)", ""),
        prior: s.priorReportDepletionYear,
        current: s.depletionYearIntermediate,
        low: s.depletionYearLowCost,
        high: s.depletionYearHighCost,
        payable: s.payablePctAtDepletion,
      })),
    [],
  );

  const depletionYear =
    tab === "combined"
      ? HEADLINE.combinedDepletionYear
      : tab === "oasi"
        ? HEADLINE.oasiDepletionYear
        : null;

  return (
    <div className="space-y-6" data-viz="social-security-trust-fund">
      <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
        {SOURCE_NOTE}
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === t.key
                ? "bg-slate-900 text-white shadow"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Depletion clock moved up
          </p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            Combined OASDI: {HEADLINE.combinedDepletionYear}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            One year sooner than the 2024 report ({HEADLINE.priorCombinedDepletionYear}). Reserves fall from{" "}
            {fmtTn(HEADLINE.reservesStart2025Bn)} at start-2025 to {fmtBn(HEADLINE.reservesStart2034Bn)} at
            start-2034 — then deplete in Q3 2034.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Payable at depletion</p>
          <p className="mt-1 text-2xl font-bold text-rose-700">{HEADLINE.combinedPayablePct}%</p>
          <p className="mt-1 text-xs text-slate-500">OASDI scheduled benefits from continuing income</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">OASI alone</p>
          <p className="mt-1 text-2xl font-bold text-amber-700">
            {HEADLINE.oasiDepletionYear} · {HEADLINE.oasiPayablePct}%
          </p>
          <p className="mt-1 text-xs text-slate-500">DI solvent through 2099 (intermediate)</p>
        </div>
      </div>

      <ChartCard
        title="Trust fund reserves path 2025–2034"
        subtitle={`${TABS.find((t) => t.key === tab)?.label} — beginning-of-year reserves (SSA Table IV.A)`}
      >
        <div className="h-80 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `$${v}T`} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v, name) => [
                  name === "reservesTn" ? fmtTn(Number(v) * 1000) : `${v}%`,
                  name === "reservesTn" ? "Reserves" : "Trust fund ratio",
                ]}
              />
              {depletionYear && (
                <ReferenceLine x={depletionYear} stroke="#ef4444" strokeDasharray="4 4" label="Depletion" />
              )}
              <Area
                type="monotone"
                dataKey="reservesTn"
                stroke={color}
                fill={color}
                fillOpacity={0.3}
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Trust fund ratio — reserves as % of annual cost"
          subtitle="100% = one year of benefits in the bank; combined ratio hits 95% in 2029"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={areaData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} domain={[0, "auto"]} />
                <Tooltip formatter={(v) => [`${v}%`, "Trust fund ratio"]} />
                <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="3 3" label="100%" />
                <Line
                  type="monotone"
                  dataKey="ratio"
                  stroke={color}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: color }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title={showWaterfall ? "Annual reserve drawdown (waterfall)" : "Annual net change in reserves"}
          subtitle="Toggle view — negative bars are deficits covered by redeeming Treasury securities"
        >
          <div className="mb-3">
            <button
              type="button"
              onClick={() => setShowWaterfall((v) => !v)}
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              {showWaterfall ? "Show net-change bars" : "Show waterfall bridge"}
            </button>
          </div>
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              {showWaterfall ? (
                <BarChart data={waterfallData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => fmtBn(v)} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v, _n, item) => {
                      const row = item?.payload as { change: number; end: number };
                      return [fmtBn(Number(v)), row?.change ? "Change" : "End reserves"];
                    }}
                  />
                  <Bar dataKey="change" stackId="wf" radius={[2, 2, 0, 0]}>
                    {waterfallData.map((d) => (
                      <Cell key={d.year} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <BarChart
                  data={projections.filter((p) => p.netChangeBn !== null)}
                  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => fmtBn(v)} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [fmtBn(Number(v)), "Net change"]} />
                  <Bar dataKey="netChangeBn" radius={[4, 4, 0, 0]}>
                    {projections
                      .filter((p) => p.netChangeBn !== null)
                      .map((p) => (
                        <Cell
                          key={p.year}
                          fill={(p.netChangeBn ?? 0) < 0 ? "#ef4444" : "#10b981"}
                        />
                      ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Depletion year by Trustees scenario (slope)"
        subtitle="2025 report vs 2024 report — intermediate, low-cost, and high-cost assumptions"
      >
        <div className="h-80 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={slopeData}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 100, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis
                type="number"
                domain={[2028, 2055]}
                tick={{ fontSize: 11 }}
                label={{ value: "Depletion year", position: "bottom", style: { fontSize: 11 } }}
              />
              <YAxis type="category" dataKey="fund" tick={{ fontSize: 11 }} width={95} />
              <Tooltip
                formatter={(v, name) => [
                  v ?? "Not depleted",
                  name === "prior"
                    ? "2024 report"
                    : name === "current"
                      ? "2025 intermediate"
                      : name === "low"
                        ? "Low-cost"
                        : "High-cost",
                ]}
              />
              <Line
                type="monotone"
                dataKey="high"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 5 }}
                connectNulls={false}
                name="high"
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={{ r: 6 }}
                connectNulls={false}
                name="current"
              />
              <Line
                type="monotone"
                dataKey="low"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 5 }}
                connectNulls={false}
                name="low"
              />
              <Line
                type="monotone"
                dataKey="prior"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 4 }}
                connectNulls={false}
                name="prior"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          DI has no intermediate depletion year — reserves rise to a 777% ratio by 2099 under intermediate assumptions.
        </p>
      </ChartCard>

      <ChartCard
        title="Scheduled benefits payable after combined-fund depletion"
        subtitle="Share of scheduled OASDI benefits fundable from payroll tax + benefit taxation (no interest after depletion)"
      >
        <div className="h-56 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PAYABLE_AFTER_DEPLETION} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis domain={[65, 85]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`${v}%`, "Payable"]} />
              <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="combinedPct"
                stroke="#f59e0b"
                fill="#fbbf24"
                fillOpacity={0.4}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        Sources:{" "}
        {SOURCES.map((s, i) => (
          <span key={s.url}>
            {i > 0 && " · "}
            <a href={s.url} className="text-sky-700 underline" target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          </span>
        ))}
      </div>
    </div>
  );
}
