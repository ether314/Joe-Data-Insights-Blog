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
  CET_FIELDS,
  CONCENTRATION_PATH,
  HEADLINE,
  SCOREBOARD,
  SOURCE_NOTE,
  SOURCES,
  VOLUME_IMPACT,
  curveFor,
  donutFor,
  fmtPct,
  ladderFor,
  type PerimeterId,
} from "@/data/measurement-science-concentration-2026-data";

// viz-types: scoreboard bars, Lorenz area+line, ranked ladder bars, CET field bars, path multi-line, donut, volume×impact scatter | layout: default

type ViewId = "scoreboard" | "ladder" | "patents" | "impact";
type LadderMetric = "sharePct" | "cumulativePct";

const ROSE = "#f43f5e";
const AMBER = "#f59e0b";
const SKY = "#0ea5e9";
const VIOLET = "#8b5cf6";
const SLATE = "#94a3b8";

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
                : "bg-transparent text-slate-700 hover:bg-slate-100"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MeasurementScienceConcentrationDashboard() {
  const [view, setView] = useState<ViewId>("scoreboard");
  const [perimeter, setPerimeter] = useState<PerimeterId>("gerd");
  const [ladderMetric, setLadderMetric] = useState<LadderMetric>("sharePct");
  const [showEqualLine, setShowEqualLine] = useState(true);
  const [pathMetric, setPathMetric] = useState<"gerd" | "pubs">("gerd");

  const ladder = useMemo(() => {
    const rows = [...ladderFor(perimeter)];
    if (ladderMetric === "sharePct") {
      return rows.sort((a, b) => b.sharePct - a.sharePct);
    }
    return rows.sort((a, b) => b.cumulativePct - a.cumulativePct);
  }, [perimeter, ladderMetric]);

  const curve = useMemo(() => curveFor(perimeter), [perimeter]);
  const donut = useMemo(() => donutFor(perimeter), [perimeter]);

  const scoreboardBars = useMemo(
    () =>
      SCOREBOARD.map((r) => ({
        ...r,
        short: r.label.replace(" (PPP)", "").replace(" priority patents", ""),
      })),
    [],
  );

  const scatter = useMemo(
    () =>
      VOLUME_IMPACT.map((r) => ({
        ...r,
        x: r.pubSharePct,
        y: r.hcaRatePct,
        z: Math.max(40, (r.gerdSharePct ?? 4) * 6),
      })),
    [],
  );

  const perimeterLabel =
    SCOREBOARD.find((s) => s.id === perimeter)?.label ?? perimeter;

  return (
    <div
      className="space-y-6"
      data-viz="measurement-science-concentration-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Measurement &amp; science — concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          GERD Top-1 is {fmtPct(HEADLINE.gerdTop1Pct, 1)} · Top-3 clears{" "}
          {fmtPct(HEADLINE.gerdTop3Pct, 1)}; AI patents Top-1 hits{" "}
          {fmtPct(HEADLINE.cetAiTop1Pct)}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Funding and papers keep concentrating at the top of the distribution.
          China alone is{" "}
          <span className="text-rose-300">
            {fmtPct(HEADLINE.gerdTop1Pct, 1)} of world GERD
          </span>{" "}
          and{" "}
          <span className="text-amber-200">
            {fmtPct(HEADLINE.pubsTop1Pct)} of S&amp;E articles
          </span>
          ; China–US–India print half of world papers. Critical-tech IP is
          harsher still: China holds roughly{" "}
          <span className="text-violet-300">
            {fmtPct(HEADLINE.cetAiTop1Pct)} of AI priority patent families
          </span>
          . Citation impact and KTI value-added do not fully follow volume.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "GERD Top-1",
              value: fmtPct(HEADLINE.gerdTop1Pct, 1),
              sub: HEADLINE.gerdTop1Label,
            },
            {
              label: "GERD Top-3",
              value: fmtPct(HEADLINE.gerdTop3Pct, 1),
              sub: "CN · US · JP",
            },
            {
              label: "Pubs Top-3",
              value: fmtPct(HEADLINE.pubsTop3Pct),
              sub: "CN · US · IN",
            },
            {
              label: "AI patents Top-1",
              value: fmtPct(HEADLINE.cetAiTop1Pct),
              sub: HEADLINE.cetAiTop1Label,
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-3"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums">{k.value}</p>
              <p className="text-xs text-slate-400">{k.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "scoreboard", label: "Scoreboard" },
            { id: "ladder", label: "Concentration ladder" },
            { id: "patents", label: "CET patents" },
            { id: "impact", label: "Volume vs impact" },
          ]}
        />
      </div>

      {view === "scoreboard" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Top-1 vs Top-3 by perimeter"
            subtitle="Same theme, four different tops — funding, papers, CET IP, and KTI output"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={scoreboardBars}
                  margin={{ top: 8, right: 12, left: 0, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="id"
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={50}
                    tickFormatter={(id) =>
                      SCOREBOARD.find((s) => s.id === id)?.label.split(" ")[0] ??
                      id
                    }
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
                      name === "top1Pct" ? "Top-1" : "Top-3",
                    ]}
                    labelFormatter={(id) =>
                      SCOREBOARD.find((s) => s.id === id)?.label ?? String(id)
                    }
                  />
                  <Bar dataKey="top1Pct" name="top1Pct" fill={ROSE} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="top3Pct" name="top3Pct" fill={SKY} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Concentration path since 2000"
            subtitle="GERD Top-1 fell as China rose — but US+China and publication Top-3 tightened"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Series"
                value={pathMetric}
                onChange={setPathMetric}
                options={[
                  { id: "gerd", label: "GERD shares" },
                  { id: "pubs", label: "Publication shares" },
                ]}
              />
            </div>
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={CONCENTRATION_PATH}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[20, 80]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
                      String(name),
                    ]}
                  />
                  {pathMetric === "gerd" ? (
                    <>
                      <Line
                        type="monotone"
                        dataKey="top1Pct"
                        name="GERD Top-1"
                        stroke={ROSE}
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="top3Pct"
                        name="GERD Top-3"
                        stroke={AMBER}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="usChinaPct"
                        name="US+China"
                        stroke={SKY}
                        strokeWidth={2}
                        strokeDasharray="4 3"
                        dot={{ r: 3 }}
                      />
                    </>
                  ) : (
                    <>
                      <Line
                        type="monotone"
                        dataKey="pubsTop1Pct"
                        name="Pubs Top-1"
                        stroke={ROSE}
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="pubsTop3Pct"
                        name="Pubs Top-3"
                        stroke={AMBER}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Perimeter scoreboard"
            subtitle="Disclosed Top-1 / Top-3 labels and extra meters"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[28rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3 font-semibold">Perimeter</th>
                    <th className="py-2 pr-3 font-semibold">Top-1</th>
                    <th className="py-2 pr-3 font-semibold">Top-3</th>
                    <th className="py-2 font-semibold">Extra</th>
                  </tr>
                </thead>
                <tbody>
                  {SCOREBOARD.map((r) => (
                    <tr key={r.id} className="border-b border-slate-100">
                      <td className="py-2.5 pr-3 font-medium text-slate-800">
                        <span
                          className="mr-2 inline-block h-2 w-2 rounded-full"
                          style={{ background: r.color }}
                        />
                        {r.label}
                      </td>
                      <td className="py-2.5 pr-3 tabular-nums text-slate-700">
                        {fmtPct(r.top1Pct, r.top1Pct % 1 ? 1 : 0)}{" "}
                        <span className="text-slate-400">({r.top1Label})</span>
                      </td>
                      <td className="py-2.5 pr-3 tabular-nums text-slate-700">
                        {fmtPct(r.top3Pct, r.top3Pct % 1 ? 1 : 0)}
                      </td>
                      <td className="py-2.5 text-slate-600">
                        {r.extraMetric}: {r.extraValue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>

          <ChartCard
            title="Top-1 vs Top-3 scatter"
            subtitle="Each point is a perimeter — CET AI is the extreme outlier"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="top1Pct"
                    name="Top-1"
                    domain={[20, 80]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "Top-1 share",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="top3Pct"
                    name="Top-3"
                    domain={[40, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "Top-3",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                  />
                  <ZAxis type="number" dataKey="top3Pct" range={[80, 320]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
                      name === "top1Pct" ? "Top-1" : "Top-3",
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.label ?? ""
                    }
                  />
                  <Scatter data={SCOREBOARD} fill={AMBER}>
                    {SCOREBOARD.map((p) => (
                      <Cell key={p.id} fill={p.color} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "ladder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <ToggleGroup
              label="Perimeter"
              value={perimeter}
              onChange={setPerimeter}
              options={[
                { id: "gerd", label: "GERD" },
                { id: "pubs", label: "Publications" },
                { id: "cet", label: "CET AI patents" },
                { id: "kti", label: "KTI VA" },
              ]}
            />
          </div>

          <ChartCard
            title="Cumulative share vs equal split"
            subtitle={`How fast ${perimeterLabel} accumulates at the top`}
          >
            <div className="mb-3">
              <ToggleGroup
                label="Equal line"
                value={showEqualLine ? "on" : "off"}
                onChange={(v) => setShowEqualLine(v === "on")}
                options={[
                  { id: "on", label: "Show" },
                  { id: "off", label: "Hide" },
                ]}
              />
            </div>
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={curve}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      `${Number(v).toFixed(1)}%`,
                      name === "sharePct" ? "Actual cumulative" : "Equal split",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="sharePct"
                    fill={ROSE}
                    fillOpacity={0.25}
                    stroke={ROSE}
                    strokeWidth={2.5}
                    name="sharePct"
                  />
                  {showEqualLine && (
                    <Line
                      type="monotone"
                      dataKey="equalPct"
                      stroke={SLATE}
                      strokeDasharray="6 4"
                      strokeWidth={1.5}
                      dot={false}
                      name="equalPct"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Ranked share ladder"
            subtitle="Toggle between share of perimeter and cumulative share at each rank"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Metric"
                value={ladderMetric}
                onChange={setLadderMetric}
                options={[
                  { id: "sharePct", label: "Share" },
                  { id: "cumulativePct", label: "Cumulative" },
                ]}
              />
            </div>
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ladder}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={56}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [`${Number(v).toFixed(1)}%`, "Value"]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.name ?? ""
                    }
                  />
                  <Bar
                    dataKey={ladderMetric}
                    radius={[0, 4, 4, 0]}
                  >
                    {ladder.map((r) => (
                      <Cell key={r.id} fill={r.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Share composition"
            subtitle={`${perimeterLabel} — residual closes the universe`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donut}
                    dataKey="sharePct"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {donut.map((d) => (
                      <Cell key={d.id} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${Number(v).toFixed(1)}%`,
                      item?.payload?.name ?? "",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              {donut.map((d) => (
                <li key={d.id}>
                  <span
                    className="mr-1 inline-block h-2 w-2 rounded-full"
                    style={{ background: d.color }}
                  />
                  {d.name}: {fmtPct(d.sharePct, d.sharePct % 1 ? 1 : 0)}
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title="What the ladder says"
            subtitle="Read as a family of market shares, not one number"
          >
            <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
              <li>
                <span className="font-semibold text-slate-800">GERD:</span>{" "}
                Knife-edge Top-1 ({fmtPct(HEADLINE.gerdTop1Pct, 1)} China) with
                US+China at {fmtPct(HEADLINE.gerdUsChinaPct, 1)} — a duopoly
                thicker than any single lead.
              </li>
              <li>
                <span className="font-semibold text-slate-800">
                  Publications:
                </span>{" "}
                China {fmtPct(HEADLINE.pubsTop1Pct)} alone; China–US–India{" "}
                {fmtPct(HEADLINE.pubsTop3Pct)}. Volume concentrates faster than
                GERD Top-1.
              </li>
              <li>
                <span className="font-semibold text-slate-800">CET AI:</span>{" "}
                Top-1 at {fmtPct(HEADLINE.cetAiTop1Pct)} is the extreme
                perimeter — volume IP, not citation dominance.
              </li>
              <li>
                <span className="font-semibold text-slate-800">KTI VA:</span> US
                still Top-1 at {fmtPct(HEADLINE.ktiTop1Pct)}; Top-3{" "}
                {fmtPct(HEADLINE.ktiTop3Pct)} on a ${HEADLINE.ktiWorldTn}T
                ledger.
              </li>
            </ul>
          </ChartCard>
        </div>
      )}

      {view === "patents" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="China share of CET priority patent families"
            subtitle="NSF Translation meters — AI is the concentration outlier"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...CET_FIELDS].sort(
                    (a, b) => b.chinaSharePct - a.chinaSharePct,
                  )}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={64}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [
                      `${Number(v).toFixed(0)}%`,
                      "China volume share",
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.label ?? ""
                    }
                  />
                  <Bar dataKey="chinaSharePct" radius={[0, 4, 4, 0]}>
                    {CET_FIELDS.map((r) => (
                      <Cell key={r.id} fill={r.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Every field still shows US citation lead in NSF framing — volume
              concentration ≠ influence concentration.
            </p>
          </ChartCard>

          <ChartCard
            title="CET AI residual ladder"
            subtitle="China disclosed at ~75%; US / EU / RoW estimated to close the universe"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutFor("cet")}
                    dataKey="sharePct"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {donutFor("cet").map((d) => (
                      <Cell key={d.id} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${Number(v).toFixed(0)}%`,
                      item?.payload?.name ?? "",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="CET field table"
            subtitle="Volume share vs citation-lead flag"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[24rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3 font-semibold">Field</th>
                    <th className="py-2 pr-3 font-semibold">China %</th>
                    <th className="py-2 font-semibold">Citation lead</th>
                  </tr>
                </thead>
                <tbody>
                  {[...CET_FIELDS]
                    .sort((a, b) => b.chinaSharePct - a.chinaSharePct)
                    .map((r) => (
                      <tr key={r.id} className="border-b border-slate-100">
                        <td className="py-2.5 pr-3 font-medium text-slate-800">
                          {r.label}
                        </td>
                        <td className="py-2.5 pr-3 tabular-nums">
                          {fmtPct(r.chinaSharePct)}
                        </td>
                        <td className="py-2.5 text-slate-600">
                          {r.usCitationLead ? "United States" : "—"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </ChartCard>

          <ChartCard
            title="Why patents matter for the concentration story"
            subtitle="The theme’s volume–impact asymmetry, sharpened"
          >
            <p className="text-sm leading-relaxed text-slate-600">
              GERD Top-1 at {fmtPct(HEADLINE.gerdTop1Pct, 1)} looks moderate
              next to CET AI at {fmtPct(HEADLINE.cetAiTop1Pct)}. Publication
              Top-3 at {fmtPct(HEADLINE.pubsTop3Pct)} sits between them. The
              system is concentrating — but{" "}
              <span className="font-semibold text-slate-800">
                which meter you pick
              </span>{" "}
              changes whether you see a knife-edge duopoly, a half-world paper
              oligopoly, or a three-quarter AI patent monopoly.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Pair with the{" "}
              <a
                className="font-medium text-sky-700 underline-offset-2 hover:underline"
                href="/blog/measurement-science-update-202608"
              >
                August 202608 update
              </a>{" "}
              for China domestic intensity and basic-research share context.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "impact" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Publication volume vs HCA rate"
            subtitle="Bubble size ≈ GERD share where known — US punches above volume"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Pub share"
                    domain={[0, 35]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "Publication share",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="HCA rate"
                    domain={[0.8, 2]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "HCA rate",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[50, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => {
                      if (name === "x")
                        return [`${Number(v).toFixed(0)}%`, "Pub share"];
                      if (name === "y")
                        return [`${Number(v).toFixed(1)}%`, "HCA rate"];
                      return [String(v), String(name)];
                    }}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.name ?? ""
                    }
                  />
                  <Scatter data={scatter} fill={VIOLET}>
                    {scatter.map((p) => (
                      <Cell key={p.id} fill={p.color} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              HCA rate = share of that economy&apos;s articles in the world top
              1% cited (NSF framing) — not world HCA market share.
            </p>
          </ChartCard>

          <ChartCard
            title="KTI vs GERD Top-1 contrast"
            subtitle="Output leadership can diverge from funding leadership"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      label: "GERD Top-1",
                      value: HEADLINE.gerdTop1Pct,
                      who: "China",
                      fill: ROSE,
                    },
                    {
                      label: "KTI Top-1",
                      value: HEADLINE.ktiTop1Pct,
                      who: "United States",
                      fill: SKY,
                    },
                    {
                      label: "Pubs Top-1",
                      value: HEADLINE.pubsTop1Pct,
                      who: "China",
                      fill: AMBER,
                    },
                    {
                      label: "AI patents",
                      value: HEADLINE.cetAiTop1Pct,
                      who: "China",
                      fill: VIOLET,
                    },
                  ]}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => [
                      `${Number(v).toFixed(1)}% (${item?.payload?.who ?? ""})`,
                      "Top-1",
                    ]}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {[ROSE, SKY, AMBER, VIOLET].map((c, i) => (
                      <Cell key={i} fill={c} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs leading-relaxed text-slate-600">
        <p className="font-semibold text-slate-800">Sources &amp; notes</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                className="font-medium text-sky-700 underline-offset-2 hover:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
