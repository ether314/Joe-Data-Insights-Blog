"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CHIP_ESTIMATES,
  COMPUTE_BN,
  CROSS_CHECK,
  CUMULATIVE_2026_2031,
  DATACENTERS_BN,
  DC_COST_SCENARIOS,
  GS_REPORT_URL,
  HEADLINE,
  LAYER_COLORS,
  POWER_BN,
  SOURCE_NOTE,
  TOTAL_BN,
  YEARS,
  fmtBn,
} from "@/data/goldman-sachs-ai-capex-data";

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

export function GoldmanSachsAiCapexDashboard() {
  const [focusYear, setFocusYear] = useState<"2027" | "2028">("2027");

  const trajectory = useMemo(
    () =>
      YEARS.map((year, i) => ({
        year,
        compute: COMPUTE_BN[i],
        dataCenters: DATACENTERS_BN[i],
        power: POWER_BN[i],
        total: TOTAL_BN[i],
      })),
    [],
  );

  const dcSensitivity = useMemo(
    () =>
      DC_COST_SCENARIOS.map((s) => ({
        label: s.label.replace(" (baseline)", ""),
        y2027: s.y2027,
        y2028: s.y2028,
      })),
    [],
  );

  const headline = focusYear === "2027" ? HEADLINE.y2027 : HEADLINE.y2028;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950">
        Source:{" "}
        <a
          href={GS_REPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2 hover:text-cyan-800"
        >
          Tracking Trillions: The Assumptions Shaping the Scale of the AI Build-Out
        </a>{" "}
        (Goldman Sachs Global Institute, April 2026). GS describes this as a scenario framework, not a forecast.
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2">
          <div className="mb-3 flex gap-2">
            {(["2027", "2028"] as const).map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setFocusYear(y)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  focusYear === y ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Chips + data centers ({focusYear})
          </p>
          <p className="mt-2 text-4xl font-bold text-slate-900">{fmtBn(headline.chipsPlusDc)}</p>
          <p className="mt-2 text-sm text-slate-600">
            Compute {fmtBn(headline.compute)} · Data centers {fmtBn(headline.dataCenters)} · Total incl. power{" "}
            {fmtBn(headline.total)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-900 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">2026–2031 cumulative</p>
          <p className="mt-2 text-3xl font-bold text-white">{fmtBn(CUMULATIVE_2026_2031.total)}</p>
          <p className="mt-1 text-sm text-slate-400">Compute {fmtBn(CUMULATIVE_2026_2031.compute)}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Hyperscaler cross-check</p>
          <p className="mt-2 text-2xl font-bold text-amber-950">~$1.14T</p>
          <p className="mt-1 text-sm text-amber-900">GS Investment Research 2027 base (narrower scope)</p>
        </div>
      </div>

      <ChartCard
        title="Baseline AI capex by layer, 2026–2031"
        subtitle="Compute = chips & systems · Data centers = shell, cooling, fit-out at $15M/MW"
      >
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={trajectory} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748b" }} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => `$${v}`} />
            <Tooltip formatter={(v) => fmtBn(Number(v ?? 0))} />
            <Legend />
            <Bar dataKey="compute" stackId="a" fill={LAYER_COLORS.compute} name="Compute (chips)" />
            <Bar dataKey="dataCenters" stackId="a" fill={LAYER_COLORS.dataCenters} name="Data centers" />
            <Bar dataKey="power" stackId="a" fill={LAYER_COLORS.power} name="Power" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Data center capex sensitivity to cost per megawatt"
        subtitle="Biggest swing factor on the data center line — legacy cloud ~$10M/MW, next-gen AI $15–20M/MW"
      >
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={dcSensitivity} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#64748b" }} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => `$${v}B`} />
            <Tooltip formatter={(v) => fmtBn(Number(v ?? 0))} />
            <Legend />
            <Line type="monotone" dataKey="y2027" stroke="#06b6d4" strokeWidth={2} name="2027" dot />
            <Line type="monotone" dataKey="y2028" stroke="#3b82f6" strokeWidth={2} name="2028" dot />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Scope cross-check" subtitle="Do not mix Global Institute totals with hyperscaler-only figures">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="pb-3 pr-4">Basis</th>
                  <th className="pb-3 pr-4">2026</th>
                  <th className="pb-3 pr-4">2027</th>
                  <th className="pb-3">2028</th>
                </tr>
              </thead>
              <tbody>
                {CROSS_CHECK.map((row) => (
                  <tr key={row.basis} className="border-b border-slate-100">
                    <td className="py-2.5 pr-4 text-slate-800">{row.basis}</td>
                    <td className="py-2.5 pr-4 tabular-nums text-slate-600">{row.y2026}</td>
                    <td className="py-2.5 pr-4 tabular-nums text-slate-600">{row.y2027}</td>
                    <td className="py-2.5 tabular-nums text-slate-600">{row.y2028}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        <ChartCard title="Chip & component estimates" subtitle="Bottom-up GS equity research pieces for 2027–2028">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="pb-3 pr-4">Line item</th>
                  <th className="pb-3 pr-4">2026</th>
                  <th className="pb-3 pr-4">2027</th>
                  <th className="pb-3">2028</th>
                </tr>
              </thead>
              <tbody>
                {CHIP_ESTIMATES.map((row) => (
                  <tr key={row.lineItem} className="border-b border-slate-100">
                    <td className="py-2.5 pr-4 text-slate-800">{row.lineItem}</td>
                    <td className="py-2.5 pr-4 tabular-nums text-slate-600">{row.y2026}</td>
                    <td className="py-2.5 pr-4 tabular-nums text-slate-600">{row.y2027}</td>
                    <td className="py-2.5 tabular-nums text-slate-600">{row.y2028}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
