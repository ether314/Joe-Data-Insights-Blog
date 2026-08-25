"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  BUFFER_VINTAGE,
  DELINQ_VINTAGE,
  HEADLINE,
  OUTCOME_TABLE,
  PRODUCT_GAPS,
  RELIANCE_LADDER,
  SEGMENT_COLORS,
  SEGMENTS,
  SOURCE_NOTE,
  VOLATILITY_CELLS,
  fmtPp,
  fmtPct,
  type ProductId,
  type SegmentId,
  type ViewId,
} from "@/data/credit-outcomes-of-gig-dependent-households-2026-data";

// viz-types: product gap grouped bars, buffer area+line vintage,
// volatility scatter, reliance ladder bars, delinquency gap vintage,
// outcome table | layout: default
// smoke-marker: Delinquency gap vs W-2 — 2.8 pp

const NAVY = "#0f172a";
const SLATE = "#64748b";

type SegmentFilter = "all" | SegmentId;

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
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            value === o.id
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function CreditOutcomesOfGigDependentHouseholds2026Dashboard() {
  const [view, setView] = useState<ViewId>("gap");
  const [product, setProduct] = useState<ProductId | "all">("all");
  const [segmentFilter, setSegmentFilter] = useState<SegmentFilter>("all");
  const [ladderMetric, setLadderMetric] = useState<"dpd" | "buffer" | "util">(
    "dpd",
  );

  const gapData = useMemo(() => {
    const rows =
      product === "all"
        ? PRODUCT_GAPS
        : PRODUCT_GAPS.filter((r) => r.product === product);
    return rows.map((r) => ({
      ...r,
      name: r.label.replace(" 60+ DPD", ""),
    }));
  }, [product]);

  const scatterData = useMemo(() => {
    return VOLATILITY_CELLS.filter(
      (c) => segmentFilter === "all" || c.segment === segmentFilter,
    ).map((c) => ({
      ...c,
      fill: SEGMENT_COLORS[c.segment],
      name: `${c.segment} ${c.incomeBand}`,
    }));
  }, [segmentFilter]);

  const ladderData = useMemo(() => {
    return RELIANCE_LADDER.map((r) => ({
      ...r,
      value:
        ladderMetric === "dpd"
          ? r.card60DpdPct
          : ladderMetric === "buffer"
            ? r.canCover400Pct
            : r.revolvingUtilPct,
      fill:
        r.platformShareMinPct >= 50
          ? SEGMENT_COLORS["gig-primary"]
          : r.platformShareMinPct >= 1
            ? SEGMENT_COLORS["gig-secondary"]
            : SEGMENT_COLORS["w2-only"],
    }));
  }, [ladderMetric]);

  const ladderLabel =
    ladderMetric === "dpd"
      ? "Card 60+ DPD %"
      : ladderMetric === "buffer"
        ? "Can cover $400 %"
        : "Revolving util %";

  return (
    <div
      className="space-y-6"
      data-viz="credit-outcomes-of-gig-dependent-households-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
          Consumer Finance · Gig income volatility
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Delinquency gap vs W-2 — {HEADLINE.delinquencyGapPp} pp
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">
          Gig-primary households show card 60+ DPD at{" "}
          <span className="font-semibold text-rose-300">
            {fmtPct(HEADLINE.gigPrimaryCard60DpdPct)}
          </span>{" "}
          versus{" "}
          <span className="font-semibold text-teal-300">
            {fmtPct(HEADLINE.w2Card60DpdPct)}
          </span>{" "}
          for matched W-2-only peers. Buffer gap on a $400 expense:{" "}
          {HEADLINE.bufferGapPp} pp.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-xs text-slate-400">Gig-primary card 60+</p>
            <p className="text-lg font-bold text-rose-300">
              Gig-primary card 60+ DPD {fmtPct(HEADLINE.gigPrimaryCard60DpdPct)}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-xs text-slate-400">Matched W-2 card 60+</p>
            <p className="text-lg font-bold text-teal-300">
              {fmtPct(HEADLINE.w2Card60DpdPct)}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-xs text-slate-400">Buffer gap $400 expense</p>
            <p className="text-lg font-bold text-amber-300">
              Buffer gap $400 expense — {HEADLINE.bufferGapPp} pp
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <p className="text-xs text-slate-400">Median MoM swing (gig)</p>
            <p className="text-lg font-bold">
              {fmtPct(HEADLINE.medianMoMSwingGigPrimaryPct, 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup<ViewId>
          value={view}
          onChange={setView}
          options={[
            { id: "gap", label: "Product gaps" },
            { id: "buffers", label: "Cash buffers" },
            { id: "scatter", label: "Volatility map" },
            { id: "ladder", label: "Reliance ladder" },
            { id: "vintage", label: "Gap vintage" },
            { id: "table", label: "Outcome table" },
          ]}
        />
      </div>

      {view === "gap" && (
        <ChartCard
          title="Product delinquency gaps vs matched W-2"
          subtitle="60+ day past-due rates by credit product · CFPB CCP desk synthesis"
        >
          <div className="mb-4">
            <ToggleGroup<ProductId | "all">
              value={product}
              onChange={setProduct}
              options={[
                { id: "all", label: "All products" },
                { id: "card", label: "Card" },
                { id: "auto", label: "Auto" },
                { id: "personal", label: "Personal" },
                { id: "mortgage", label: "Mortgage" },
              ]}
            />
          </div>
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={gapData}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis
                  tick={{ fill: SLATE, fontSize: 12 }}
                  unit="%"
                  domain={[0, "auto"]}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="gigPrimaryPct"
                  name="Gig-primary"
                  fill={SEGMENT_COLORS["gig-primary"]}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="gigSecondaryPct"
                  name="Gig-secondary"
                  fill={SEGMENT_COLORS["gig-secondary"]}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="w2OnlyPct"
                  name="W-2 only"
                  fill={SEGMENT_COLORS["w2-only"]}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Largest gap: personal loans ({fmtPp(3.1)}); mortgage gap stays under
            1 pp — secured credit compresses the differential.
          </p>
        </ChartCard>
      )}

      {view === "buffers" && (
        <ChartCard
          title="Cash-buffer path — can cover a $400 expense"
          subtitle="SHED-aligned shares by segment · 2019–2024"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={BUFFER_VINTAGE}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis
                  tick={{ fill: SLATE, fontSize: 12 }}
                  unit="%"
                  domain={[35, 80]}
                />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="w2OnlyCanCoverPct"
                  name="W-2 only"
                  fill={SEGMENT_COLORS["w2-only"]}
                  fillOpacity={0.15}
                  stroke={SEGMENT_COLORS["w2-only"]}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="gigSecondaryCanCoverPct"
                  name="Gig-secondary"
                  stroke={SEGMENT_COLORS["gig-secondary"]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="gigPrimaryCanCoverPct"
                  name="Gig-primary"
                  stroke={SEGMENT_COLORS["gig-primary"]}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Stimulus-era buffers lifted every segment in 2020–21; the gig-primary
            recovery stalled earlier and never closed the gap.
          </p>
        </ChartCard>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Income volatility vs card delinquency"
          subtitle="Bubble size ≈ cell weight · color by segment"
        >
          <div className="mb-4">
            <ToggleGroup<SegmentFilter>
              value={segmentFilter}
              onChange={setSegmentFilter}
              options={[
                { id: "all", label: "All segments" },
                { id: "gig-primary", label: "Gig-primary" },
                { id: "gig-secondary", label: "Gig-secondary" },
                { id: "w2-only", label: "W-2 only" },
              ]}
            />
          </div>
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="medianSwingPct"
                  name="MoM swing %"
                  unit="%"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  label={{
                    value: "Median MoM income swing %",
                    position: "insideBottom",
                    offset: -2,
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="card60DpdPct"
                  name="Card 60+"
                  unit="%"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  label={{
                    value: "Card 60+ DPD %",
                    angle: -90,
                    position: "insideLeft",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="nWeight" range={[60, 280]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={scatterData} name="Cells">
                  {scatterData.map((d) => (
                    <Cell key={d.id} fill={d.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
            {SEGMENTS.map((s) => (
              <span key={s.id} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: SEGMENT_COLORS[s.id] }}
                />
                {s.label}
              </span>
            ))}
          </div>
        </ChartCard>
      )}

      {view === "ladder" && (
        <ChartCard
          title="Reliance ladder — platform share of earnings"
          subtitle="Outcomes step up as platform income becomes the paycheck"
        >
          <div className="mb-4">
            <ToggleGroup<"dpd" | "buffer" | "util">
              value={ladderMetric}
              onChange={setLadderMetric}
              options={[
                { id: "dpd", label: "Card 60+ DPD" },
                { id: "buffer", label: "$400 buffer" },
                { id: "util", label: "Revolving util" },
              ]}
            />
          </div>
          <div className="h-[340px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ladderData}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  unit="%"
                />
                <YAxis
                  type="category"
                  dataKey="band"
                  width={100}
                  tick={{ fill: NAVY, fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="value" name={ladderLabel} radius={[0, 4, 4, 0]}>
                  {ladderData.map((d) => (
                    <Cell key={d.band} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "vintage" && (
        <ChartCard
          title="Card delinquency gap vintage"
          subtitle="Gig-primary minus matched W-2 · 60+ DPD percentage points"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={DELINQ_VINTAGE}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis
                  yAxisId="rate"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  unit="%"
                />
                <YAxis
                  yAxisId="gap"
                  orientation="right"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  unit=" pp"
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="gap"
                  dataKey="gapPp"
                  name="Gap (pp)"
                  fill="#94a3b8"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="rate"
                  type="monotone"
                  dataKey="gigPrimaryCard60Pct"
                  name="Gig-primary %"
                  stroke={SEGMENT_COLORS["gig-primary"]}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="rate"
                  type="monotone"
                  dataKey="w2Card60Pct"
                  name="W-2 only %"
                  stroke={SEGMENT_COLORS["w2-only"]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            The gap compressed in 2020–21, then widened each year through 2024
            as revolving stress returned without gig buffers catching up.
          </p>
        </ChartCard>
      )}

      {view === "table" && (
        <ChartCard
          title="Outcome comparison table"
          subtitle="Desk-harmonized rates · matched income and age bands"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-3 font-semibold">Metric</th>
                  <th className="py-2 pr-3 font-semibold text-rose-700">
                    Gig-primary
                  </th>
                  <th className="py-2 pr-3 font-semibold text-amber-700">
                    Gig-secondary
                  </th>
                  <th className="py-2 pr-3 font-semibold text-teal-700">
                    W-2 only
                  </th>
                  <th className="py-2 font-semibold">Note</th>
                </tr>
              </thead>
              <tbody>
                {OUTCOME_TABLE.map((row) => (
                  <tr
                    key={row.metric}
                    className="border-b border-slate-100 text-slate-800"
                  >
                    <td className="py-2.5 pr-3 font-medium">{row.metric}</td>
                    <td className="py-2.5 pr-3">{row.gigPrimary}</td>
                    <td className="py-2.5 pr-3">{row.gigSecondary}</td>
                    <td className="py-2.5 pr-3">{row.w2Only}</td>
                    <td className="py-2.5 text-slate-500">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
