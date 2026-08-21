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
  BENCHMARKS,
  CONCENTRATION_PATH,
  EXCESS_SLICES,
  HEADLINE,
  PERIMETER_COMPARE,
  SOURCE_NOTE,
  SOURCES,
  VINTAGE_LABELS,
  concentrationCurve,
  concentrationMetrics,
  fmtBn,
  fmtHhi,
  fmtPct,
  shareLadder,
  sustainabilityScatter,
  type IntensityVintageKey,
  type MetricMode,
} from "@/data/ai-capex-intensity-concentration-2026-data";

// viz-types: Lorenz area+line, ranked intensity bars, excess donut, path multi-line, perimeter compare bars, intensity-FCF scatter | layout: default

type ViewId = "ladder" | "path" | "excess" | "sustainability";

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

export function AiCapexIntensityConcentrationDashboard() {
  const [view, setView] = useState<ViewId>("ladder");
  const [vintage, setVintage] = useState<IntensityVintageKey>("aug-20");
  const [mode, setMode] = useState<MetricMode>("intensity-sum");

  const metrics = useMemo(
    () => concentrationMetrics(vintage, mode),
    [vintage, mode],
  );
  const curve = useMemo(
    () => concentrationCurve(vintage, mode),
    [vintage, mode],
  );
  const ladder = useMemo(() => shareLadder(vintage, mode), [vintage, mode]);
  const scatter = useMemo(() => sustainabilityScatter(vintage), [vintage]);

  const modeLabel =
    mode === "excess"
      ? "excess above 11% cloud norm"
      : mode === "capex-dollars"
        ? "absolute capex dollars"
        : "intensity-sum shares";

  return (
    <div
      className="space-y-6"
      data-viz="ai-capex-intensity-concentration-2026"
    >
      <div className="rounded-xl border border-rose-200 bg-rose-50/80 px-5 py-4">
        <p className="text-sm font-semibold text-rose-950">
          Capex intensity — concentration lens
        </p>
        <p className="mt-1 text-sm text-rose-900/80">
          Top-1 holds {fmtPct(HEADLINE.top1SharePct)} of the intensity sum (
          {HEADLINE.top1Label} at {fmtPct(HEADLINE.top1IntensityPct)}); top-3
          holds {fmtPct(HEADLINE.top3SharePct)} ({HEADLINE.top3Labels}). HHI ≈{" "}
          {fmtHhi(HEADLINE.hhi)}. Dollar concentration still crowns Amazon (
          {fmtPct(HEADLINE.dollarTop1SharePct)}) — ratios and dollars disagree
          on who sits at the top.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={view}
          options={[
            { id: "ladder", label: "Intensity ladder" },
            { id: "path", label: "Multi-year path" },
            { id: "excess", label: "Excess concentration" },
            { id: "sustainability", label: "Sustainability" },
          ]}
          onChange={setView}
        />
        <ToggleGroup
          label="Vintage"
          value={vintage}
          options={[
            { id: "fy24", label: "FY24" },
            { id: "fy25", label: "FY25" },
            { id: "h1-26", label: "H1’26" },
            { id: "q3-26", label: "Q3 guide" },
            { id: "aug-20", label: "Late-Aug" },
          ]}
          onChange={setVintage}
        />
      </div>

      {(view === "ladder" || view === "path") && (
        <ToggleGroup
          label="Perimeter"
          value={mode}
          options={[
            { id: "intensity-sum", label: "Intensity-sum shares" },
            { id: "excess", label: "Excess vs cloud norm" },
            { id: "capex-dollars", label: "Capex-dollar shares" },
          ]}
          onChange={setMode}
        />
      )}

      {view === "ladder" && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Top-1 share
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {fmtPct(metrics.top1)}
              </p>
              <p className="text-sm text-slate-600">
                {metrics.top1Label} · {fmtPct(metrics.top1Intensity)} intensity
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Top-3 share
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {fmtPct(metrics.top3)}
              </p>
              <p className="text-sm text-slate-600">{metrics.top3Labels}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                HHI / weighted intensity
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {fmtHhi(metrics.hhi)}
              </p>
              <p className="text-sm text-slate-600">
                Rev-weighted {fmtPct(metrics.revenueWeightedPct)} ·{" "}
                {VINTAGE_LABELS[vintage]}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Ranked intensity & concentration share"
              subtitle={`Share of ${modeLabel} · ${VINTAGE_LABELS[vintage]}`}
            >
              <div className="h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ladder}
                    layout="vertical"
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      tickFormatter={(v) => `${v}%`}
                      tick={{ fontSize: 11, fill: "#64748b" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="company"
                      width={78}
                      tick={{ fontSize: 11, fill: "#334155" }}
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        const n = Number(value);
                        if (name === "sharePct") return [fmtPct(n), "Share"];
                        if (name === "intensityPct")
                          return [fmtPct(n), "Intensity"];
                        return [String(value), String(name)];
                      }}
                    />
                    <Bar dataKey="sharePct" name="sharePct" radius={[0, 4, 4, 0]}>
                      {ladder.map((r) => (
                        <Cell key={r.company} fill={r.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Cumulative share vs equal split"
              subtitle="Lorenz-style ladder — how fast the top accumulates"
            >
              <div className="h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={curve}
                    margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="rank"
                      tickFormatter={(v) => (v === 0 ? "0" : `#${v}`)}
                      tick={{ fontSize: 11, fill: "#64748b" }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                      tick={{ fontSize: 11, fill: "#64748b" }}
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        fmtPct(Number(value)),
                        name === "equalPct" ? "Equal split" : "Actual cumulative",
                      ]}
                      labelFormatter={(_, payload) => {
                        const p = payload?.[0]?.payload;
                        return p?.label ? String(p.label) : "";
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulativeSharePct"
                      fill="#fecaca"
                      stroke="#e11d48"
                      strokeWidth={2}
                      name="cumulativeSharePct"
                    />
                    <Line
                      type="monotone"
                      dataKey="equalPct"
                      stroke="#64748b"
                      strokeDasharray="4 4"
                      dot={false}
                      name="equalPct"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </>
      )}

      {view === "path" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Top-1 / top-3 intensity-share path"
            subtitle="How concentration of the intensity sum evolved FY24 → late-Aug"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={CONCENTRATION_PATH}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                    height={56}
                  />
                  <YAxis
                    domain={[20, 80]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      fmtPct(Number(value)),
                      name === "top1Pct" ? "Top-1 share" : "Top-3 share",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="top1Pct"
                    stroke="#e11d48"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    name="top1Pct"
                  />
                  <Line
                    type="monotone"
                    dataKey="top3Pct"
                    stroke="#0f766e"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    name="top3Pct"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="HHI & revenue-weighted intensity"
            subtitle="Distribution tightness vs the Big-5 cash-flow weighted ratio"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={CONCENTRATION_PATH}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                    height={56}
                  />
                  <YAxis
                    yAxisId="hhi"
                    domain={[1800, 2400]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    yAxisId="w"
                    orientation="right"
                    domain={[10, 35]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <Tooltip />
                  <Bar
                    yAxisId="hhi"
                    dataKey="hhi"
                    fill="#fda4af"
                    name="HHI"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="w"
                    type="monotone"
                    dataKey="revenueWeightedPct"
                    stroke="#0369a1"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    name="Rev-weighted intensity"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "excess" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Excess intensity above pre-AI cloud norm"
            subtitle={`Each point above ${BENCHMARKS.preAiCloud}% is “extra” reinvestment vs the cloud decade`}
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={EXCESS_SLICES}
                    dataKey="value"
                    nameKey="company"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={96}
                    paddingAngle={2}
                  >
                    {EXCESS_SLICES.map((s) => (
                      <Cell key={s.company} fill={s.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, _n, item) => {
                      const share = item?.payload?.sharePct;
                      return [
                        `${fmtPct(Number(value))} excess (${fmtPct(Number(share))} of excess pool)`,
                        String(item?.payload?.company ?? ""),
                      ];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-center text-sm text-slate-600">
              Excess top-1 {fmtPct(HEADLINE.excessTop1SharePct)} · excess top-3{" "}
              {fmtPct(HEADLINE.excessTop3SharePct)}
            </p>
          </ChartCard>

          <ChartCard
            title="Intensity share vs dollar share"
            subtitle="Same firms, two rankings — ratios crown Oracle/Meta; dollars crown Amazon"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={PERIMETER_COMPARE}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="company"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      fmtPct(Number(value)),
                      name === "intensitySharePct"
                        ? "Intensity-sum share"
                        : "Capex-dollar share",
                    ]}
                  />
                  <Bar
                    dataKey="intensitySharePct"
                    name="intensitySharePct"
                    fill="#e11d48"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="dollarSharePct"
                    name="dollarSharePct"
                    fill="#0ea5e9"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "sustainability" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Intensity vs free-cash-flow margin"
            subtitle={`${VINTAGE_LABELS[vintage]} — bubble size ∝ capex dollars`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="intensity"
                    name="Intensity"
                    unit="%"
                    domain={[10, 50]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    label={{
                      value: "Capex intensity",
                      position: "insideBottom",
                      offset: -2,
                      style: { fill: "#64748b", fontSize: 11 },
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="fcfMargin"
                    name="FCF margin"
                    unit="%"
                    domain={[-2, 32]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    label={{
                      value: "FCF margin",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#64748b", fontSize: 11 },
                    }}
                  />
                  <ZAxis type="number" dataKey="capexBn" range={[80, 400]} />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "capexBn") return [fmtBn(Number(value)), "Capex"];
                      return [fmtPct(Number(value)), String(name)];
                    }}
                    labelFormatter={(_, payload) => {
                      const p = payload?.[0]?.payload;
                      return p?.company ? String(p.company) : "";
                    }}
                  />
                  <Scatter data={scatter} name="Firms">
                    {scatter.map((p) => (
                      <Cell key={p.company} fill={p.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Reinvestment band map"
            subtitle="Telecom norm 20% · foundry-like zone ≥35%"
          >
            <ul className="space-y-3">
              {scatter
                .slice()
                .sort((a, b) => b.intensity - a.intensity)
                .map((p) => (
                  <li
                    key={p.company}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ background: p.fill }}
                      />
                      <span className="font-medium text-slate-800">
                        {p.company}
                      </span>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">
                        {fmtPct(p.intensity)}
                      </span>
                      {" · FCF "}
                      {fmtPct(p.fcfMargin)}
                      {" · "}
                      <span className="capitalize text-slate-500">{p.band}</span>
                    </div>
                  </li>
                ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              All five print above the {BENCHMARKS.telecomNorm}% telecom
              reference; {HEADLINE.namesAboveFoundry} (Oracle, Meta) sit in the
              foundry-like ≥35% band with thinner FCF cushions than Microsoft.
            </p>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <p className="text-xs text-slate-500">
        Related:{" "}
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
