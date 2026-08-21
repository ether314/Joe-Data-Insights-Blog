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
  HHI_BY_LENS,
  INSURED_VINTAGE,
  INSTRUMENT_MIX,
  MDB_BANK_SHARES,
  REGION_GAPS,
  RESIDUAL_BEARERS,
  RESIDUAL_CONCENTRATION_CURVE,
  SOURCE_NOTE,
  SOURCES,
  TOP_K_LADDER,
  VINTAGE_SLOPE,
  fmtBn,
  fmtHhi,
  fmtMultiple,
  fmtPct,
  rankedRegionsBy,
} from "@/data/adaptation-economics-concentration-2026q3-data";

// viz-types: HHI bars, Lorenz area+line, residual bars, MDB bank bars, instrument donut, vintage multi-line, insured composed, resilience×gap scatter, scarcity bars | layout: default

type ViewId = "hhi" | "residual" | "mdb" | "vintage" | "gaps";
type LadderMetric = "sharePct" | "cumulativePct" | "deltaPp";
type GapMetric = "gapBn" | "gapSharePct" | "resiliencePct";
type IncomeFilter = "all" | "advanced" | "emerging" | "developing";
type SlopeMetric = "residualTop1Pct" | "residualTop3Pct" | "residualHhi" | "gapTop3Pct";
type ScarcityFilter = "all" | "needs" | "flow" | "gap" | "micro";

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

export function AdaptationEconomicsConcentration2026q3Dashboard() {
  const [view, setView] = useState<ViewId>("hhi");
  const [ladderMetric, setLadderMetric] = useState<LadderMetric>("sharePct");
  const [showEqualLine, setShowEqualLine] = useState(true);
  const [gapMetric, setGapMetric] = useState<GapMetric>("gapBn");
  const [incomeFilter, setIncomeFilter] = useState<IncomeFilter>("all");
  const [slopeMetric, setSlopeMetric] =
    useState<SlopeMetric>("residualTop1Pct");
  const [scarcityFilter, setScarcityFilter] = useState<ScarcityFilter>("all");
  const [showMdbOnSlope, setShowMdbOnSlope] = useState(true);

  const hhiBars = useMemo(
    () => [...HHI_BY_LENS].sort((a, b) => b.hhi - a.hhi),
    [],
  );

  const residualBars = useMemo(() => {
    return [...RESIDUAL_BEARERS]
      .map((b) => ({
        ...b,
        value:
          ladderMetric === "sharePct"
            ? b.sharePct
            : ladderMetric === "cumulativePct"
              ? b.cumulativePct
              : b.sharePct - b.priorSharePct,
      }))
      .sort((a, b) =>
        ladderMetric === "deltaPp" ? a.value - b.value : b.value - a.value,
      );
  }, [ladderMetric]);

  const mdbBars = useMemo(
    () => [...MDB_BANK_SHARES].sort((a, b) => b.sharePct - a.sharePct),
    [],
  );

  const donorBars = useMemo(
    () => [...DONOR_SHARES].sort((a, b) => b.sharePct - a.sharePct),
    [],
  );

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

  const scarcityBars = useMemo(() => {
    if (scarcityFilter === "all") return FLOW_LEDGERS;
    return FLOW_LEDGERS.filter((r) => r.role === scarcityFilter);
  }, [scarcityFilter]);

  const slopeData = useMemo(
    () =>
      VINTAGE_SLOPE.map((r) => ({
        ...r,
        mdbTop1Plot: r.mdbTop1Pct ?? undefined,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="adaptation-economics-concentration-2026q3"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300/90">
          Adaptation economics — Q3 concentration lens
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
          After the MDB Joint Summary and a benign H1, residual Top-1 (
          {HEADLINE.top1BearerLabel}) still holds{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.top1BearerSharePct)}
          </span>
          {" "}(−2 pp vs FY framing); Top-3 reaches{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.top3BearerSharePct)}
          </span>
          . WBG alone is{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.top1MdbSharePct)}
          </span>{" "}
          of the {fmtBn(HEADLINE.mdbLmicAdapt2025Bn)} LMIC adaptation tip; gap
          geography Top-3 stays{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.top3GapRegionSharePct, 1)}
          </span>
          .
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Residual Top-1
            </p>
            <p className="text-xl font-bold tabular-nums text-white">
              {fmtPct(HEADLINE.top1BearerSharePct)}
            </p>
            <p className="text-[11px] text-slate-400">−2 pp vs FY frame</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              MDB bank Top-1
            </p>
            <p className="text-xl font-bold tabular-nums text-white">
              {fmtPct(HEADLINE.top1MdbSharePct)}
            </p>
            <p className="text-[11px] text-slate-400">{HEADLINE.top1MdbLabel}</p>
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
            { id: "hhi", label: "HHI scoreboard" },
            { id: "residual", label: "Residual ladder" },
            { id: "mdb", label: "MDB & donors" },
            { id: "vintage", label: "Vintage slope" },
            { id: "gaps", label: "Gaps & scarcity" },
          ]}
        />
        {view === "residual" && (
          <>
            <ToggleGroup
              label="Metric"
              value={ladderMetric}
              onChange={setLadderMetric}
              options={[
                { id: "sharePct", label: "Share %" },
                { id: "cumulativePct", label: "Cumulative %" },
                { id: "deltaPp", label: "Δ vs FY pp" },
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
        {view === "vintage" && (
          <>
            <ToggleGroup
              label="Slope"
              value={slopeMetric}
              onChange={setSlopeMetric}
              options={[
                { id: "residualTop1Pct", label: "Residual Top-1" },
                { id: "residualTop3Pct", label: "Residual Top-3" },
                { id: "residualHhi", label: "Residual HHI" },
                { id: "gapTop3Pct", label: "Gap Top-3" },
              ]}
            />
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={showMdbOnSlope}
                onChange={(e) => setShowMdbOnSlope(e.target.checked)}
                className="rounded border-slate-300"
              />
              MDB Top-1 overlay
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
            <ToggleGroup
              label="Ledger"
              value={scarcityFilter}
              onChange={setScarcityFilter}
              options={[
                { id: "all", label: "All" },
                { id: "needs", label: "Needs" },
                { id: "flow", label: "Flows" },
                { id: "gap", label: "Gaps" },
                { id: "micro", label: "Micro" },
              ]}
            />
          </>
        )}
      </div>

      {view === "hhi" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="HHI by concentration lens"
            subtitle="0–10,000 scale — residual and MDB banks sit in the high band; donors stay plural"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hhiBars} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    domain={[0, 5500]}
                    tickFormatter={(v) => fmtHhi(Number(v))}
                  />
                  <YAxis
                    type="category"
                    dataKey="shortLabel"
                    width={88}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => {
                      const band = (item?.payload as { band?: string })?.band;
                      return band
                        ? `${fmtHhi(Number(v))} (${band})`
                        : fmtHhi(Number(v));
                    }}
                  />
                  <Bar dataKey="hhi" name="HHI" radius={[0, 4, 4, 0]}>
                    {hhiBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Top-1 vs Top-3 by lens"
            subtitle="Paired shares — instruments are loan-dominated; residual Top-3 clears 86%"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hhiBars} margin={{ bottom: 36 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="shortLabel"
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Bar
                    dataKey="top1Pct"
                    name="Top-1"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="top3Pct"
                    name="Top-3"
                    fill="#0ea5e9"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "residual" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Cumulative share vs equal split"
            subtitle="H1-adjusted residual incidence Lorenz — five bearer buckets"
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
              ladderMetric === "deltaPp"
                ? "Δ percentage points vs FY 2025 framing (H1 insurance lift)"
                : ladderMetric === "sharePct"
                  ? "Share of residual incidence by bearer"
                  : "Cumulative share walking down the ladder"
            }
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={residualBars}
                  layout="vertical"
                  margin={{ left: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    domain={
                      ladderMetric === "deltaPp" ? [-4, 4] : [0, 100]
                    }
                    tickFormatter={(v) =>
                      ladderMetric === "deltaPp" ? `${v} pp` : `${v}%`
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="shortLabel"
                    width={88}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      ladderMetric === "deltaPp"
                        ? `${Number(v) > 0 ? "+" : ""}${Number(v)} pp`
                        : fmtPct(Number(v))
                    }
                  />
                  <Bar dataKey="value" name="Value" radius={[0, 4, 4, 0]}>
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

      {view === "mdb" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="MDB LMIC adaptation bank tip"
            subtitle={`Estimated shares of ${fmtBn(HEADLINE.mdbLmicAdapt2025Bn)} (2025) — Top-3 = ${fmtPct(HEADLINE.top3MdbSharePct)}`}
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mdbBars} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    domain={[0, 40]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="shortLabel"
                    width={56}
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
                    {mdbBars.map((r) => (
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
            <div className="h-64 w-full min-w-0">
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

          <ChartCard
            title="OECD adaptation donor tip"
            subtitle={`Estimated shares of ${fmtBn(HEADLINE.oecdAdapt2024Bn)} — Top-3 = ${fmtPct(HEADLINE.top3DonorSharePct)}`}
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={donorBars}
                  layout="vertical"
                  margin={{ left: 8 }}
                >
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
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Bar dataKey="sharePct" name="Share" radius={[0, 4, 4, 0]}>
                    {donorBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "vintage" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Concentration vintage slope"
            subtitle="Research → 2026 concentration → Q3/Aug — residual tip eases slightly; gap Top-3 stuck"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={slopeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="shortLabel" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11 }}
                    domain={
                      slopeMetric === "residualHhi" ? [2400, 3200] : [30, 100]
                    }
                    tickFormatter={(v) =>
                      slopeMetric === "residualHhi" ? fmtHhi(Number(v)) : `${v}%`
                    }
                  />
                  {showMdbOnSlope && (
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 11 }}
                      domain={[0, 50]}
                      tickFormatter={(v) => `${v}%`}
                    />
                  )}
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey={slopeMetric}
                    name={slopeMetric}
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  {showMdbOnSlope && (
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="mdbTop1Plot"
                      name="MDB Top-1 %"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3 }}
                      connectNulls={false}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Insured share by damage vintage"
            subtitle="Benign H1 2026 lifts covered share to 42% — does not close the $424B gap"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={INSURED_VINTAGE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="shortLabel" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="bn"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <YAxis
                    yAxisId="pct"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    domain={[0, 50]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip />
                  <Bar
                    yAxisId="bn"
                    dataKey="insuredBn"
                    name="Insured $B"
                    fill="#14b8a6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="bn"
                    dataKey="economicBn"
                    name="Economic $B"
                    fill="#94a3b833"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="pct"
                    type="monotone"
                    dataKey="insuredSharePct"
                    name="Insured share %"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
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
                <BarChart
                  data={regionBars}
                  layout="vertical"
                  margin={{ left: 8 }}
                >
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
                    formatter={(v) =>
                      gapMetric === "gapBn"
                        ? fmtBn(Number(v))
                        : fmtPct(Number(v), 1)
                    }
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
            subtitle="Bubble size ∝ regional share of the $424B gap"
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
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Gap"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
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

          <ChartCard
            title="Needs, flows, and residual gaps"
            subtitle="Do not sum across ledgers — OECD, UNEP, MDB, CPI, and FRLD are different universes"
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
                    tickFormatter={(v) => (v < 1 ? `$${v}B` : `$${v}B`)}
                    scale="log"
                    domain={[0.1, 500]}
                    allowDataOverflow
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
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Lens</th>
              <th className="px-4 py-3 font-semibold">Top-1</th>
              <th className="px-4 py-3 font-semibold">Top-3</th>
              <th className="px-4 py-3 font-semibold">HHI</th>
              <th className="px-4 py-3 font-semibold">Δ Top-1</th>
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
                  {fmtPct(row.top1Pct, row.top1Pct % 1 ? 1 : 0)} ·{" "}
                  {row.top1Label}
                </td>
                <td className="px-4 py-3 tabular-nums text-slate-700">
                  {fmtPct(row.top3Pct, row.top3Pct % 1 ? 1 : 0)} ·{" "}
                  {row.top3Label}
                </td>
                <td className="px-4 py-3 tabular-nums text-slate-700">
                  {row.hhi.toLocaleString("en-US")}
                </td>
                <td className="px-4 py-3 tabular-nums text-slate-700">
                  {row.deltaTop1Pp == null
                    ? "—"
                    : `${row.deltaTop1Pp > 0 ? "+" : ""}${row.deltaTop1Pp} pp`}
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
