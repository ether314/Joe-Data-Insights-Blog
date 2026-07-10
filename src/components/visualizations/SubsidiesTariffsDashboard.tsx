"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  applyPreset,
  avgRatio,
  buildRows,
  CHART_COLORS,
  COMPONENTS,
  DEFAULT_ENABLED,
  fmtB,
  fmtPct,
  PRESET_OPTIONS,
  sortForStack,
  SUBSIDY_LAST,
  type FilterPreset,
  type YearRow,
} from "@/data/subsidies-tariffs-data";

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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm w-full min-w-0">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function BillionsTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="max-w-sm rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 font-semibold text-slate-900">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm text-slate-800">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm ring-1 ring-slate-200"
              style={{ backgroundColor: entry.color }}
            />
            <span>
              {entry.name}: <strong>${entry.value.toFixed(1)}B</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GapTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-1 font-semibold text-slate-900">{label}</p>
      <p className="text-sm" style={{ color: CHART_COLORS.gap }}>
        Net gap: ${v.toFixed(1)}B
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {v >= 0 ? "Support exceeds tariffs" : "Tariffs exceed support"}
      </p>
    </div>
  );
}

function YearExplorer({ row, enabled }: { row: YearRow; enabled: Record<string, boolean> }) {
  const supportComponents = sortForStack(
    COMPONENTS.filter((c) => enabled[c.id] && c.group !== "tariff"),
  );
  const showTariffs = !!enabled.tariffs;

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Metric</th>
              <th className="px-4 py-3 text-right">Value</th>
              <th className="px-4 py-3 text-right">YoY</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3 font-medium text-slate-700">Direct outlays</td>
              <td className="px-4 py-3 text-right">{fmtB(row.subsidyOutlays)}</td>
              <td className="px-4 py-3 text-right">{fmtPct(row.outlayYoY)}</td>
            </tr>
            <tr className="bg-slate-50/50">
              <td className="px-4 py-3 font-medium text-slate-700">Industrial tax exp.</td>
              <td className="px-4 py-3 text-right">{fmtB(row.industrialTaxExp)}</td>
              <td className="px-4 py-3 text-right">{fmtPct(row.taxExpYoY)}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-slate-700">Total support</td>
              <td className="px-4 py-3 text-right font-semibold">{fmtB(row.totalSupport)}</td>
              <td className="px-4 py-3 text-right">—</td>
            </tr>
            {showTariffs && (
              <tr className="bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-slate-700">Tariff revenue</td>
                <td className="px-4 py-3 text-right">{fmtB(row.tariffRevenue)}</td>
                <td className="px-4 py-3 text-right">{fmtPct(row.tariffYoY)}</td>
              </tr>
            )}
            <tr>
              <td className="px-4 py-3 font-medium text-slate-700">Net gap (support − tariffs)</td>
              <td className="px-4 py-3 text-right">{fmtB(row.netGap)}</td>
              <td className="px-4 py-3 text-right">
                {row.gapYoY !== null ? `${row.gapYoY >= 0 ? "+" : ""}${row.gapYoY.toFixed(1)}B` : "—"}
              </td>
            </tr>
            {showTariffs && (
              <tr className="bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-slate-700">Support / tariff ratio</td>
                <td className="px-4 py-3 text-right" colSpan={2}>
                  {row.supportRatio.toFixed(2)}×
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {row.keyEvent && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Key event</p>
          <p className="mt-1 text-sm text-slate-700">{row.keyEvent}</p>
        </div>
      )}

      <div
        className={`rounded-lg border p-4 ${
          row.isPandemic
            ? "border-amber-200 bg-amber-50"
            : row.netGap < 0
              ? "border-emerald-200 bg-emerald-50"
              : "border-slate-200 bg-slate-50"
        }`}
      >
        <p className="text-sm leading-relaxed text-slate-700">{row.commentary}</p>
      </div>

      {supportComponents.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {supportComponents.map((c) => {
            const idx = row.year - 1996;
            const val = c.data[idx] ?? 0;
            const prev = idx > 0 ? c.data[idx - 1] : null;
            const yoy =
              prev !== null && prev !== 0 ? ((val - prev) / Math.abs(prev)) * 100 : null;
            return (
              <div
                key={c.id}
                className="rounded-lg border border-slate-200 bg-white p-3"
                style={{ borderTopColor: c.color, borderTopWidth: 3 }}
              >
                <p className="text-xs font-semibold text-slate-900">{c.label}</p>
                <p className="mt-1 text-lg font-bold text-slate-800">{fmtB(val)}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {fmtPct(yoy)} YoY · {c.source}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function SubsidiesTariffsDashboard({ compact = false }: { compact?: boolean }) {
  const [enabled, setEnabled] = useState(DEFAULT_ENABLED);
  const [preset, setPreset] = useState<FilterPreset>("all");
  const [selectedYear, setSelectedYear] = useState(SUBSIDY_LAST.year);

  const data = useMemo(() => buildRows(enabled), [enabled]);
  const last = data[data.length - 1];
  const selected = data.find((d) => d.year === selectedYear) ?? last;

  const enabledSupportComponents = useMemo(
    () => sortForStack(COMPONENTS.filter((c) => enabled[c.id] && c.group !== "tariff")),
    [enabled],
  );
  const showTariffs = !!enabled.tariffs;

  const avgRatio30 = avgRatio(data);

  const lineData = useMemo(
    () =>
      data.map((d) => ({
        year: d.year,
        support: d.totalSupport,
        tariffs: d.tariffRevenue,
      })),
    [data],
  );

  const gapData = useMemo(
    () => data.map((d) => ({ year: d.year, gap: d.netGap })),
    [data],
  );

  const stackData = useMemo(() => {
    return data.map((d, i) => {
      const row: Record<string, number | string> = { year: d.year };
      for (const c of enabledSupportComponents) {
        row[c.id] = c.data[i];
      }
      return row;
    });
  }, [data, enabledSupportComponents]);

  const yoyCategories = [
    ...(enabledSupportComponents.some((c) => c.group === "bea_outlay") ? ["Outlays"] : []),
    ...(enabledSupportComponents.some((c) => c.group === "treasury_tax") ? ["Tax exp."] : []),
    ...(showTariffs ? ["Tariffs"] : []),
  ];
  const yoyValues = [
    ...(enabledSupportComponents.some((c) => c.group === "bea_outlay")
      ? [selected.outlayYoY ?? 0]
      : []),
    ...(enabledSupportComponents.some((c) => c.group === "treasury_tax")
      ? [selected.taxExpYoY ?? 0]
      : []),
    ...(showTariffs ? [selected.tariffYoY ?? 0] : []),
  ];
  const yoyData = yoyCategories.map((name, i) => ({ name, value: yoyValues[i] ?? 0 }));

  const setPresetAndApply = (p: FilterPreset) => {
    setPreset(p);
    setEnabled(applyPreset(p));
  };

  const toggleComponent = (id: string, on: boolean) => {
    setEnabled((prev) => ({ ...prev, [id]: on }));
    setPreset("all");
  };

  return (
    <div className="site-content w-full min-w-0 space-y-6">
      {!compact && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: `Total support · ${last.year}${last.isEstimate ? " est." : ""}`,
              value: fmtB(last.totalSupport),
              sub: "Outlays + industrial tax exp.",
              color: CHART_COLORS.support,
            },
            {
              label: `Tariff revenue · ${last.year}${last.isEstimate ? " est." : ""}`,
              value: fmtB(last.tariffRevenue),
              sub: "BEA customs duties",
              color: CHART_COLORS.tariffs,
            },
            {
              label: "Net gap (support − tariffs)",
              value: fmtB(last.netGap),
              sub: last.netGap >= 0 ? "Support exceeds tariffs" : "Tariffs exceed support",
              color: last.netGap >= 0 ? CHART_COLORS.gap : "#10b981",
            },
            {
              label: "30-yr avg support / tariff ratio",
              value: `${avgRatio30.toFixed(1)}×`,
              sub: "1996–2025 average",
              color: "#6366f1",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              style={{ borderLeft: `4px solid ${s.color}` }}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500">{s.sub}</p>
            </div>
          ))}
        </div>
      )}

      {!compact && (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Filter</span>
            <select
              id="preset-select"
              value={preset}
              onChange={(e) => setPresetAndApply(e.target.value as FilterPreset)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-900"
            >
              {PRESET_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                setEnabled(DEFAULT_ENABLED);
                setPreset("all");
              }}
              className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Reset
            </button>
            <span className="hidden h-4 w-px bg-slate-200 sm:inline" aria-hidden />
            {COMPONENTS.map((c) => (
              <label
                key={c.id}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700 hover:bg-slate-100 has-[:checked]:border-cyan-300 has-[:checked]:bg-cyan-50 has-[:checked]:text-cyan-900"
              >
                <input
                  type="checkbox"
                  checked={!!enabled[c.id]}
                  onChange={(e) => toggleComponent(c.id, e.target.checked)}
                  className="size-3 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                {c.label}
              </label>
            ))}
          </div>
        </div>
      )}

      <ChartCard
        title="Total market support vs customs duties"
        subtitle="Billions of real 2025 US dollars · 1996–2025 · hover for values"
      >
        <ResponsiveContainer width="100%" height={compact ? 280 : 380}>
          <LineChart data={lineData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} interval={4} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}B`} />
            <Tooltip content={<BillionsTooltip />} />
            <Legend />
            {enabledSupportComponents.length > 0 && (
              <Line
                type="monotone"
                dataKey="support"
                stroke={CHART_COLORS.support}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6 }}
                name="Total support"
              />
            )}
            {showTariffs && (
              <Line
                type="monotone"
                dataKey="tariffs"
                stroke={CHART_COLORS.tariffs}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6 }}
                name="Customs duties"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {enabledSupportComponents.length > 0 && (
        <ChartCard
          title="Composition of support"
          subtitle="Stacked by subcomponent · orange = BEA outlays, indigo = Treasury tax exp. · real 2025 $B"
        >
          <ResponsiveContainer width="100%" height={compact ? 280 : 360}>
            <BarChart data={stackData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} interval={4} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}B`} />
              <Tooltip content={<BillionsTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {enabledSupportComponents.map((c) => (
                <Bar key={c.id} dataKey={c.id} stackId="support" fill={c.color} name={c.label} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      <ChartCard title="Net gap — support minus tariffs" subtitle="Real 2025 $B · zero = parity">
        <ResponsiveContainer width="100%" height={compact ? 280 : 360}>
          <LineChart data={gapData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} interval={4} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}B`} />
            <Tooltip content={<GapTooltip />} />
            <ReferenceLine
              y={0}
              stroke={CHART_COLORS.parity}
              strokeDasharray="6 4"
              label={{ value: "Parity", fill: CHART_COLORS.parity, fontSize: 11 }}
            />
            <Line
              type="monotone"
              dataKey="gap"
              stroke={CHART_COLORS.gap}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6 }}
              name="Net gap"
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="mt-2 text-xs text-slate-500">
          Positive = subsidies and tax breaks exceed tariff collections · Negative = tariffs exceed support
        </p>
      </ChartCard>

      {!compact && (
        <ChartCard
          title="Explore a year"
          subtitle="Year-over-year change, outlays, tax expenditures, tariffs, and narrative commentary"
        >
          <div className="mb-6">
            <label htmlFor="explore-year" className="mr-3 text-sm font-medium text-slate-700">
              Year
            </label>
            <select
              id="explore-year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
            >
              {data.map((d) => (
                <option key={d.year} value={d.year}>
                  {d.year}
                  {d.isEstimate ? " (est.)" : ""}
                  {d.isPandemic ? " · COVID" : ""}
                </option>
              ))}
            </select>
          </div>

          {yoyData.length > 0 && (
            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold text-slate-800">
                Year-over-year change · {selected.year}
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={yoyData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v) => `${Number(v) >= 0 ? "+" : ""}${Number(v).toFixed(1)}%`} />
                  <ReferenceLine y={0} stroke="#64748b" />
                  <Bar dataKey="value" fill={CHART_COLORS.tariffs} name={String(selected.year)} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="mt-2 text-xs text-slate-500">Real % change vs prior year</p>
            </div>
          )}

          <YearExplorer row={selected} enabled={enabled} />
        </ChartCard>
      )}

      <p className="text-center text-xs text-slate-400">
        Interactive charts · BEA via FRED · U.S. Treasury Tax Expenditure reports · US CPI (World Bank) · Real 2025 US
        dollars
      </p>
    </div>
  );
}
