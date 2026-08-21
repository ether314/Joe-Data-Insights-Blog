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
  DONOR_SHARES,
  FLOW_LEDGERS,
  HEADLINE,
  INSTRUMENT_MIX,
  REGION_GAPS,
  RESIDUAL_BEARERS,
  RESIDUAL_CONCENTRATION_CURVE,
  SOURCE_NOTE,
  SOURCES,
  TOP_K_LADDER,
  fmtBn,
  fmtMultiple,
  fmtPct,
  rankedRegionsBy,
} from "@/data/adaptation-economics-concentration-2026-data";

// viz-types: Lorenz area+line, ranked residual bars, region gap bars, resilience×gap scatter, donor bars, instrument donut, scarcity ledgers | layout: default

type ViewId = "ladder" | "gaps" | "donors" | "scarcity";
type LadderMetric = "sharePct" | "cumulativePct";
type GapMetric = "gapBn" | "gapSharePct" | "resiliencePct";
type IncomeFilter = "all" | "advanced" | "emerging" | "developing";
type ScarcityFilter = "all" | "needs" | "flow" | "gap";

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

export function AdaptationEconomicsConcentrationDashboard() {
  const [view, setView] = useState<ViewId>("ladder");
  const [ladderMetric, setLadderMetric] = useState<LadderMetric>("sharePct");
  const [showEqualLine, setShowEqualLine] = useState(true);
  const [gapMetric, setGapMetric] = useState<GapMetric>("gapBn");
  const [incomeFilter, setIncomeFilter] = useState<IncomeFilter>("all");
  const [scarcityFilter, setScarcityFilter] = useState<ScarcityFilter>("all");

  const residualBars = useMemo(() => {
    return [...RESIDUAL_BEARERS]
      .map((b) => ({
        ...b,
        value: ladderMetric === "sharePct" ? b.sharePct : b.cumulativePct,
      }))
      .sort((a, b) => b.value - a.value);
  }, [ladderMetric]);

  const regionBars = useMemo(() => {
    const sortKey =
      gapMetric === "resiliencePct"
        ? "resilience"
        : gapMetric === "gapSharePct"
          ? "share"
          : "gap";
    let rows = rankedRegionsBy(sortKey);
    if (incomeFilter !== "all") {
      rows = rows.filter((r) => r.income === incomeFilter);
    }
    return rows.map((r) => ({
      ...r,
      value:
        gapMetric === "gapBn"
          ? r.gapBn
          : gapMetric === "gapSharePct"
            ? r.gapSharePct
            : r.resiliencePct,
    }));
  }, [gapMetric, incomeFilter]);

  const scatterData = useMemo(() => {
    const rows =
      incomeFilter === "all"
        ? REGION_GAPS
        : REGION_GAPS.filter((r) => r.income === incomeFilter);
    return rows.map((r) => ({
      ...r,
      x: r.resiliencePct,
      y: r.gapBn,
      z: Math.max(80, r.gapSharePct * 12),
    }));
  }, [incomeFilter]);

  const donorBars = useMemo(
    () => [...DONOR_SHARES].sort((a, b) => b.sharePct - a.sharePct),
    [],
  );

  const scarcityBars = useMemo(() => {
    if (scarcityFilter === "all") return FLOW_LEDGERS;
    return FLOW_LEDGERS.filter((r) => r.role === scarcityFilter);
  }, [scarcityFilter]);

  return (
    <div
      className="space-y-6"
      data-viz="adaptation-economics-concentration-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300/90">
          Adaptation economics — concentration lens
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
          Residual climate damage still concentrates at the tip: Top-1 (
          {HEADLINE.top1BearerLabel}) holds{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.top1BearerSharePct)}
          </span>
          ; Top-3 reaches{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.top3BearerSharePct)}
          </span>
          . The ${HEADLINE.protectionGapBn}B protection gap&apos;s Top-3
          regions hold{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.top3GapRegionSharePct, 1)}
          </span>
          , while OECD adaptation donors Top-3 clear only{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.top3DonorSharePct)}
          </span>{" "}
          of a {fmtBn(HEADLINE.oecdAdapt2024Bn)} tip.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Residual Top-1
            </p>
            <p className="text-xl font-bold tabular-nums text-white">
              {fmtPct(HEADLINE.top1BearerSharePct)}
            </p>
            <p className="text-[11px] text-slate-400">Households &amp; SMEs</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Residual Top-3
            </p>
            <p className="text-xl font-bold tabular-nums text-white">
              {fmtPct(HEADLINE.top3BearerSharePct)}
            </p>
            <p className="text-[11px] text-slate-400">
              HHI {HEADLINE.residualHhi.toLocaleString("en-US")}
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Gap Top-3 regions
            </p>
            <p className="text-xl font-bold tabular-nums text-white">
              {fmtPct(HEADLINE.top3GapRegionSharePct, 1)}
            </p>
            <p className="text-[11px] text-slate-400">of $424B gap stock</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Needs / MDB mid
            </p>
            <p className="text-xl font-bold tabular-nums text-white">
              {fmtMultiple(HEADLINE.needsVsMdbMultipleMid)}
            </p>
            <p className="text-[11px] text-slate-400">
              {fmtBn(HEADLINE.mdbLmicAdapt2025Bn)} LMIC adapt 2025
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "ladder", label: "Residual ladder" },
            { id: "gaps", label: "Protection gaps" },
            { id: "donors", label: "Donors & instruments" },
            { id: "scarcity", label: "Scarcity stack" },
          ]}
        />
        {view === "ladder" && (
          <>
            <ToggleGroup
              label="Metric"
              value={ladderMetric}
              onChange={setLadderMetric}
              options={[
                { id: "sharePct", label: "Share %" },
                { id: "cumulativePct", label: "Cumulative %" },
              ]}
            />
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={showEqualLine}
                onChange={(e) => setShowEqualLine(e.target.checked)}
                className="rounded border-slate-300"
              />
              Equal-split line
            </label>
          </>
        )}
        {view === "gaps" && (
          <>
            <ToggleGroup
              label="Metric"
              value={gapMetric}
              onChange={setGapMetric}
              options={[
                { id: "gapBn", label: "Gap $" },
                { id: "gapSharePct", label: "Gap share %" },
                { id: "resiliencePct", label: "Resilience %" },
              ]}
            />
            <ToggleGroup
              label="Income"
              value={incomeFilter}
              onChange={setIncomeFilter}
              options={[
                { id: "all", label: "All" },
                { id: "advanced", label: "Advanced" },
                { id: "emerging", label: "Emerging" },
                { id: "developing", label: "Developing" },
              ]}
            />
          </>
        )}
        {view === "scarcity" && (
          <ToggleGroup
            label="Ledger"
            value={scarcityFilter}
            onChange={setScarcityFilter}
            options={[
              { id: "all", label: "All" },
              { id: "needs", label: "Needs" },
              { id: "flow", label: "Flows" },
              { id: "gap", label: "Gaps" },
            ]}
          />
        )}
      </div>

      {view === "ladder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Cumulative share vs equal split"
            subtitle="Residual incidence Lorenz — five bearer buckets"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={RESIDUAL_CONCENTRATION_CURVE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v) => fmtPct(Number(v), 1)}
                    labelFormatter={(l) => String(l)}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativeSharePct"
                    name="Cumulative burden"
                    fill="#0ea5e933"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                  />
                  {showEqualLine && (
                    <Line
                      type="monotone"
                      dataKey="equalSharePct"
                      name="Equal split"
                      stroke="#94a3b8"
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Who absorbs residual damage"
            subtitle={
              ladderMetric === "sharePct"
                ? "Share of residual incidence by bearer"
                : "Cumulative share walking down the ladder"
            }
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={residualBars} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="shortLabel"
                    width={88}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Bar dataKey="value" name="Share" radius={[0, 4, 4, 0]}>
                    {residualBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "gaps" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Protection-gap geography"
            subtitle="Swiss Re-style $424B gap stock — where uninsured exposure sits"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionBars} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) =>
                      gapMetric === "gapBn" ? `$${v}B` : `${v}%`
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="shortLabel"
                    width={80}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => gapMetric === "gapBn" ? fmtBn(Number(v)) : fmtPct(Number(v), 1)}
                  />
                  <Bar dataKey="value" name="Value" radius={[0, 4, 4, 0]}>
                    {regionBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Resilience vs gap dollars"
            subtitle="Bubble size ∝ regional share of the $424B gap — low resilience + large gap = stress"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Resilience"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    domain={[0, 50]}
                    label={{
                      value: "Resilience %",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Gap"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                    label={{
                      value: "Gap $B",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => {
                      if (name === "Resilience") return fmtPct(Number(v));
                      if (name === "Gap") return fmtBn(Number(v));
                      return String(v);
                    }}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.region ?? ""
                    }
                  />
                  <Scatter name="Regions" data={scatterData}>
                    {scatterData.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "donors" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="OECD adaptation donor tip"
            subtitle={`Estimated shares of ${fmtBn(HEADLINE.oecdAdapt2024Bn)} provided/mobilised (2024) — Top-3 = ${fmtPct(HEADLINE.top3DonorSharePct)}`}
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={donorBars} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    domain={[0, 35]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="shortLabel"
                    width={88}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => {
                      const bn = (item?.payload as { approxBn?: number })
                        ?.approxBn;
                      return bn != null
                        ? `${fmtPct(Number(v))} (~${fmtBn(bn)})`
                        : fmtPct(Number(v));
                    }}
                  />
                  <Bar dataKey="sharePct" name="Share" radius={[0, 4, 4, 0]}>
                    {donorBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Public adaptation instruments"
            subtitle="OECD public adaptation 2024 — loans dominate the tip"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={INSTRUMENT_MIX}
                    dataKey="sharePct"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {INSTRUMENT_MIX.map((s) => (
                      <Cell key={s.id} fill={s.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
              {INSTRUMENT_MIX.map((s) => (
                <li key={s.id} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: s.fill }}
                  />
                  {s.label} ({fmtPct(s.sharePct)})
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      {view === "scarcity" && (
        <ChartCard
          title="Needs, flows, and residual gaps"
          subtitle="Do not sum across ledgers — OECD, UNEP, MDB, and CPI numerators are different universes"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scarcityBars} margin={{ left: 8, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="shortLabel"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}B`}
                />
                <Tooltip formatter={(v) => fmtBn(Number(v))} />
                <Bar dataKey="bn" name="USD bn" radius={[4, 4, 0, 0]}>
                  {scarcityBars.map((r) => (
                    <Cell key={r.id} fill={r.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Lens</th>
              <th className="px-4 py-3 font-semibold">Top-1</th>
              <th className="px-4 py-3 font-semibold">Top-3</th>
              <th className="px-4 py-3 font-semibold">HHI</th>
              <th className="px-4 py-3 font-semibold">Unit</th>
            </tr>
          </thead>
          <tbody>
            {TOP_K_LADDER.map((row) => (
              <tr key={row.id} className="border-b border-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {row.lens}
                </td>
                <td className="px-4 py-3 tabular-nums text-slate-700">
                  {fmtPct(row.top1Pct, row.top1Pct % 1 ? 1 : 0)} · {row.top1Label}
                </td>
                <td className="px-4 py-3 tabular-nums text-slate-700">
                  {fmtPct(row.top3Pct, row.top3Pct % 1 ? 1 : 0)} · {row.top3Label}
                </td>
                <td className="px-4 py-3 tabular-nums text-slate-700">
                  {row.hhi.toLocaleString("en-US")}
                </td>
                <td className="px-4 py-3 text-slate-500">{row.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        {SOURCES.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
