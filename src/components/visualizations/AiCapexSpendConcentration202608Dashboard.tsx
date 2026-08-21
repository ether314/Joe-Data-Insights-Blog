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
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  CONCENTRATION_PATH,
  HEADLINE,
  MSFT_SENSITIVITY,
  PERIMETER_STACKS,
  POSITIVE_RAISE_SLICES,
  RAISE_ROWS,
  SHARE_LADDER_202608,
  SOURCE_NOTE,
  SOURCES,
  YEAR_LABELS,
  companyShares,
  concentrationCurve,
  concentrationMetrics,
  fmtBn,
  fmtHhi,
  fmtPct,
  type CapexYearKey,
} from "@/data/ai-capex-spend-concentration-202608-data";

// viz-types: Lorenz area+line, ranked share bars, raise donut, path multi-line, perimeter bars, share-dollar scatter | layout: default

type ViewId = "ladder" | "path" | "raises" | "perimeters";

const TEAL = "#0d9488";
const AMBER = "#f59e0b";
const SKY = "#0ea5e9";
const VIOLET = "#8b5cf6";
const SLATE = "#64748b";

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
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              value === o.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AiCapexSpendConcentration202608Dashboard() {
  const [view, setView] = useState<ViewId>("ladder");
  const [year, setYear] = useState<CapexYearKey>("2026-202608");
  const [aiOnly, setAiOnly] = useState(false);
  const [msftMode, setMsftMode] = useState<"accounting" | "economic">(
    "accounting",
  );

  const metrics = useMemo(() => concentrationMetrics(year), [year]);
  const curve = useMemo(() => concentrationCurve(year), [year]);
  const shares = useMemo(() => companyShares(year, aiOnly), [year, aiOnly]);
  const scatterData = useMemo(
    () =>
      shares.map((s) => ({
        company: s.company,
        bn: s.bn,
        sharePct: s.sharePct,
        fill: s.fill,
      })),
    [shares],
  );

  const sensitivity = MSFT_SENSITIVITY.find((s) => s.id === msftMode)!;
  const useSensitivity = year === "2026-202608";

  return (
    <div
      className="space-y-6"
      data-viz="ai-capex-spend-concentration-202608"
    >
      <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-5 py-4">
        <p className="text-sm font-semibold text-amber-950">
          AI capex & spend — 202608 concentration lens
        </p>
        <p className="mt-1 text-sm text-amber-900/80">
          Top-1 holds {fmtPct(HEADLINE.top1SharePct)} ({HEADLINE.top1Label},{" "}
          {fmtBn(HEADLINE.top1Bn)}); top-3 holds {fmtPct(HEADLINE.top3SharePct)}{" "}
          of the late-Aug Big-5 stack ({fmtBn(HEADLINE.big5TotalBn)}). HHI ≈{" "}
          {fmtHhi(HEADLINE.hhi)}.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={view}
          options={[
            { id: "ladder", label: "Concentration ladder" },
            { id: "path", label: "Multi-year path" },
            { id: "raises", label: "Raise concentration" },
            { id: "perimeters", label: "Perimeters" },
          ]}
          onChange={setView}
        />
        <ToggleGroup
          label="Vintage"
          value={year}
          options={[
            { id: "2024", label: "2024" },
            { id: "2025", label: "2025" },
            { id: "2026-jul", label: "Jul research" },
            { id: "2026-aug", label: "Aug post-Q2" },
            { id: "2026-q3", label: "Mid-Q3" },
            { id: "2026-202608", label: "Late-Aug 202608" },
          ]}
          onChange={setYear}
        />
      </div>

      {view === "ladder" && (
        <>
          <div className="flex flex-wrap gap-3">
            <ToggleGroup
              label="Perimeter"
              value={aiOnly ? "ai" : "gross"}
              options={[
                { id: "gross", label: "Gross capex" },
                { id: "ai", label: "~75% AI-attributed" },
              ]}
              onChange={(v) => setAiOnly(v === "ai")}
            />
            <ToggleGroup
              label="Microsoft"
              value={msftMode}
              options={[
                { id: "accounting", label: "Accounting CY" },
                { id: "economic", label: "Economic CY" },
              ]}
              onChange={setMsftMode}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Top-1 share
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {fmtPct(useSensitivity ? sensitivity.top1Pct : metrics.top1)}
              </p>
              <p className="text-sm text-slate-600">
                {useSensitivity && msftMode === "economic"
                  ? "Amazon (economic stack)"
                  : metrics.top1Label}{" "}
                · {YEAR_LABELS[year]}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Top-3 share
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {fmtPct(useSensitivity ? sensitivity.top3Pct : metrics.top3)}
              </p>
              <p className="text-sm text-slate-600">
                Amazon + Alphabet + Microsoft
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                HHI (0–10,000)
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {fmtHhi(useSensitivity ? sensitivity.hhi : metrics.hhi)}
              </p>
              <p className="text-sm text-slate-600">
                Equal five-way ≈ {fmtHhi(HEADLINE.equalShareHhi)}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Cumulative share vs equal split"
              subtitle="Lorenz-style ladder — how fast the Big-5 stack accumulates"
            >
              <div className="h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={curve}
                    margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      formatter={(v, name) => [
                        fmtPct(Number(v)),
                        name === "cumulativeSharePct"
                          ? "Actual cumulative"
                          : "Equal split",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulativeSharePct"
                      fill={AMBER}
                      fillOpacity={0.25}
                      stroke={AMBER}
                      strokeWidth={2}
                      name="cumulativeSharePct"
                    />
                    <Line
                      type="monotone"
                      dataKey="equalPct"
                      stroke={SLATE}
                      strokeDasharray="4 4"
                      strokeWidth={2}
                      dot={false}
                      name="equalPct"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Ranked company shares"
              subtitle={
                aiOnly
                  ? `~75% AI-attributed · ${YEAR_LABELS[year]}`
                  : `Gross midpoints · ${YEAR_LABELS[year]}`
              }
            >
              <div className="h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={shares}
                    layout="vertical"
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="company"
                      width={80}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(v, _n, p) => [
                        `${fmtPct(Number(v))} · ${fmtBn((p?.payload as { bn: number })?.bn ?? 0)}`,
                        "Share",
                      ]}
                    />
                    <Bar dataKey="sharePct" radius={[0, 4, 4, 0]}>
                      {shares.map((s) => (
                        <Cell key={s.company} fill={s.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <ChartCard
            title="Share vs absolute dollars"
            subtitle="Bubble size scales with program size — concentration in two dimensions"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="bn"
                    name="Capex"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <YAxis
                    type="number"
                    dataKey="sharePct"
                    name="Share"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <ZAxis type="number" dataKey="bn" range={[80, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      name === "sharePct"
                        ? fmtPct(Number(v))
                        : fmtBn(Number(v)),
                      name === "sharePct" ? "Share" : "Capex",
                    ]}
                    labelFormatter={(_, payload) =>
                      (payload?.[0]?.payload as { company?: string })
                        ?.company ?? ""
                    }
                  />
                  <Scatter data={scatterData} name="Companies">
                    {scatterData.map((d) => (
                      <Cell key={d.company} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </>
      )}

      {view === "path" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Top-1 and top-3 share path"
            subtitle="How concentration moved as the stack grew from $231B → $858B"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={CONCENTRATION_PATH}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    domain={[20, 90]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      fmtPct(Number(v)),
                      name === "top1Pct" ? "Top-1" : "Top-3",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="top1Pct"
                    stroke={AMBER}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    name="top1Pct"
                  />
                  <Line
                    type="monotone"
                    dataKey="top3Pct"
                    stroke={TEAL}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    name="top3Pct"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="HHI path"
            subtitle="Herfindahl–Hirschman index on Big-5 shares (higher = more concentrated)"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={CONCENTRATION_PATH}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[2000, 2600]} />
                  <Tooltip formatter={(v) => [fmtHhi(Number(v)), "HHI"]} />
                  <Area
                    type="monotone"
                    dataKey="hhi"
                    fill={VIOLET}
                    fillOpacity={0.2}
                    stroke={VIOLET}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="hhi"
                    stroke={VIOLET}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Stack size vs concentration"
            subtitle="Absolute dollars rose faster than equalisation — HHI stayed elevated"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={CONCENTRATION_PATH}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[20, 40]}
                  />
                  <Tooltip />
                  <Bar
                    yAxisId="left"
                    dataKey="totalBn"
                    fill={SKY}
                    fillOpacity={0.7}
                    name="Big-5 total"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="top1Pct"
                    stroke={AMBER}
                    strokeWidth={2.5}
                    name="Top-1 %"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Late-Aug 202608 ladder snapshot"
            subtitle="Fixed 202608 ranks for quick reference"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[280px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="py-2 pr-2">Company</th>
                    <th className="py-2 pr-2 text-right">$B</th>
                    <th className="py-2 pr-2 text-right">Share</th>
                    <th className="py-2 text-right">Cum.</th>
                  </tr>
                </thead>
                <tbody>
                  {SHARE_LADDER_202608.map((r) => (
                    <tr key={r.company} className="border-b border-slate-100">
                      <td
                        className="py-2 pr-2 font-medium"
                        style={{ color: r.fill }}
                      >
                        {r.company}
                      </td>
                      <td className="py-2 pr-2 text-right tabular-nums">
                        {r.bn}
                      </td>
                      <td className="py-2 pr-2 text-right tabular-nums">
                        {fmtPct(r.sharePct)}
                      </td>
                      <td className="py-2 text-right tabular-nums">
                        {fmtPct(r.cumulativeSharePct)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "raises" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Who captured the Q3→202608 raises"
            subtitle={`Positive dollar raises sum to $${POSITIVE_RAISE_SLICES.reduce((s, r) => s + r.deltaBn, 0)}B; Amazon+Alphabet = ${fmtPct(HEADLINE.top2RaiseSharePct)}`}
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={POSITIVE_RAISE_SLICES}
                    dataKey="deltaBn"
                    nameKey="company"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {POSITIVE_RAISE_SLICES.map((s) => (
                      <Cell key={s.company} fill={s.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, p) => [
                      `${fmtBn(Number(v))} (${fmtPct((p?.payload as { sharePct: number })?.sharePct ?? 0)})`,
                      "Raise",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Company Δ mid-Q3 → late-Aug 202608"
            subtitle="Microsoft and Oracle flat on accounting / net prints — Amazon still leads"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={RAISE_ROWS}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="company" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`}
                  />
                  <Tooltip
                    formatter={(v) => {
                      const n = Number(v);
                      return [`${n > 0 ? "+" : ""}${fmtBn(n)}`, "Δ"];
                    }}
                  />
                  <Bar dataKey="deltaBn" radius={[4, 4, 0, 0]}>
                    {RAISE_ROWS.map((r) => (
                      <Cell
                        key={r.company}
                        fill={r.deltaBn > 0 ? r.fill : SLATE}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "perimeters" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="2026 stacks by research perimeter"
            subtitle="Do not mix scopes — company shares only apply inside Big-5 gross"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={PERIMETER_STACKS}
                  margin={{ top: 8, right: 12, left: 0, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <Tooltip
                    formatter={(v) => [fmtBn(Number(v)), "2026"]}
                    labelFormatter={(_, p) =>
                      (p?.[0]?.payload as { scope?: string })?.scope ?? ""
                    }
                  />
                  <Bar dataKey="bn2026" radius={[4, 4, 0, 0]}>
                    {PERIMETER_STACKS.map((r) => (
                      <Cell key={r.id} fill={r.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Microsoft accounting vs economic sensitivity"
            subtitle="Lease reclass shifts share math without changing campus spend"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...MSFT_SENSITIVITY]}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[20, 80]}
                  />
                  <Tooltip formatter={(v) => [fmtPct(Number(v)), ""]} />
                  <Bar
                    dataKey="top1Pct"
                    fill={AMBER}
                    name="Top-1 %"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="top3Pct"
                    fill={TEAL}
                    name="Top-3 %"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <p className="text-xs text-slate-500">
        Sources:{" "}
        {SOURCES.map((s, i) => (
          <span key={s.url}>
            {i > 0 && " · "}
            <a href={s.url} className="underline hover:text-slate-700">
              {s.label}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}
