"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  DECILE_BUFFER,
  HEADLINE,
  INST_TYPE_SUPPORT,
  OPS_SUPPORT_TREND,
  SIZE_BANDS,
  SOURCE_NOTE,
  SOURCES,
  decileGapRows,
  institutionsFiltered,
  scatterPoints,
  sizeBandBars,
  type ControlId,
} from "@/data/endowment-payout-vs-tuition-dependence-2026-data";

// viz-types: size bars, payout-vs-tuition scatter, ops-support trend lines, decile composed | layout: default

type ViewId = "bands" | "scatter" | "trend" | "deciles";
type BandMetric = "share" | "spend";

const TEAL = "#0f766e";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SKY = "#0284c7";

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
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        ) : null}
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
            className={
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors " +
              (value === o.id
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-50")
            }
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function EndowmentPayoutVsTuitionDependence2026Dashboard() {
  const [view, setView] = useState<ViewId>("bands");
  const [control, setControl] = useState<ControlId | "all">("all");
  const [bandMetric, setBandMetric] = useState<BandMetric>("share");

  const bandData = useMemo(() => sizeBandBars(), []);
  const scatter = useMemo(() => scatterPoints(control), [control]);
  const deciles = useMemo(() => decileGapRows(), []);
  const panel = useMemo(() => institutionsFiltered(control), [control]);

  const meanGap = useMemo(() => {
    if (panel.length === 0) return 0;
    return (
      panel.reduce((s, r) => s + r.payoutMinusTuitionPp, 0) / panel.length
    );
  }, [panel]);

  return (
    <div
      className="space-y-6"
      data-viz="endowment-payout-vs-tuition-dependence-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-5 text-white sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-200/90">
          Higher-ed endowments · payout vs tuition
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {HEADLINE.avgEndowmentShareOfOpsPct}% average payout share of
          operations — median only {HEADLINE.medianEndowmentShareOfOpsPct}%
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          FY{HEADLINE.fy} NCSE: {HEADLINE.participants} institutions withdrew $
          {HEADLINE.totalWithdrawalsBn}B. Size-band peak is{" "}
          {HEADLINE.topSizeBandShareOfOpsPct}% ({HEADLINE.topSizeBandLabel});
          least-reliant band sits at {HEADLINE.leastReliantBandShareOfOpsPct}% — a{" "}
          {HEADLINE.bufferTopVsLeastPctPts} pp gap. Mega-endowment financial
          reports (Harvard {HEADLINE.harvardEndowmentSharePct}%, Yale{" "}
          {HEADLINE.yaleEndowmentSharePct}%, Princeton ~
          {HEADLINE.princetonEndowmentSharePct}%) sit far above the NCSE mean.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={view}
          onChange={setView}
          options={[
            { id: "bands", label: "Size bands" },
            { id: "scatter", label: "Payout vs tuition" },
            { id: "trend", label: "Ops-support trend" },
            { id: "deciles", label: "Decile buffer" },
          ]}
        />
        <ToggleGroup
          label="Control"
          value={control}
          onChange={setControl}
          options={[
            { id: "all", label: "All" },
            { id: "private", label: "Private" },
            { id: "public", label: "Public" },
          ]}
        />
        {view === "bands" ? (
          <ToggleGroup
            label="Metric"
            value={bandMetric}
            onChange={setBandMetric}
            options={[
              { id: "share", label: "% of ops" },
              { id: "spend", label: "Spend rate" },
            ]}
          />
        ) : null}
      </div>

      {view === "bands" ? (
        <ChartCard
          title="Endowment support by size band"
          subtitle={
            bandMetric === "share"
              ? "FY25 NCSE — endowment distributions as % of operating budget"
              : "FY25 NCSE — average annual effective spending rate"
          }
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bandData}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  unit="%"
                  domain={[0, bandMetric === "share" ? 24 : 8]}
                />
                <Tooltip />
                <Bar
                  dataKey={bandMetric === "share" ? "share" : "spendRate"}
                  name={
                    bandMetric === "share"
                      ? "Endowment % of ops"
                      : "Effective spend rate"
                  }
                  radius={[4, 4, 0, 0]}
                >
                  {bandData.map((d) => (
                    <Cell key={d.short} fill={d.fill} />
                  ))}
                </Bar>
                {bandMetric === "share" ? (
                  <ReferenceLine
                    y={HEADLINE.avgEndowmentShareOfOpsPct}
                    stroke={ROSE}
                    strokeDasharray="4 4"
                    label={{
                      value: `Mean ${HEADLINE.avgEndowmentShareOfOpsPct}%`,
                      fill: ROSE,
                      fontSize: 11,
                    }}
                  />
                ) : null}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Peak support is the {HEADLINE.topSizeBandLabel} cohort (
            {HEADLINE.topSizeBandShareOfOpsPct}%), not Over $5B (
            {HEADLINE.over5bShareOfOpsPct}%). Under-$100M cohorts already match{" "}
            {HEADLINE.under100mShareOfOpsPct}% — the mid-size trough is{" "}
            {HEADLINE.leastReliantBandLabel} at{" "}
            {HEADLINE.leastReliantBandShareOfOpsPct}%.
          </p>
        </ChartCard>
      ) : null}

      {view === "scatter" ? (
        <ChartCard
          title="Payout share vs net tuition share"
          subtitle={`Institution panel · mean payout−tuition gap ${meanGap.toFixed(0)} pp (${control})`}
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="tuitionShare"
                  name="Net tuition % of ops"
                  unit="%"
                  tick={{ fontSize: 11 }}
                  domain={[0, 40]}
                  label={{
                    value: "Net tuition % of ops",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="endowmentShare"
                  name="Endowment % of ops"
                  unit="%"
                  tick={{ fontSize: 11 }}
                  domain={[0, 75]}
                  label={{
                    value: "Endowment % of ops",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="endowmentBn" range={[60, 280]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <ReferenceLine
                  segment={[
                    { x: 0, y: 0 },
                    { x: 40, y: 40 },
                  ]}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                />
                <Scatter name="Institutions" data={scatter} fill={TEAL}>
                  {scatter.map((p) => (
                    <Cell
                      key={p.name}
                      fill={p.control === "private" ? TEAL : SKY}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-xs text-slate-600">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-1.5 pr-3 font-semibold">Institution</th>
                  <th className="py-1.5 pr-3 font-semibold">Endowment $B</th>
                  <th className="py-1.5 pr-3 font-semibold">Payout %</th>
                  <th className="py-1.5 pr-3 font-semibold">Tuition %</th>
                  <th className="py-1.5 font-semibold">Gap pp</th>
                </tr>
              </thead>
              <tbody>
                {[...panel]
                  .sort(
                    (a, b) =>
                      b.payoutMinusTuitionPp - a.payoutMinusTuitionPp,
                  )
                  .map((r) => (
                    <tr key={r.id} className="border-b border-slate-100">
                      <td className="py-1.5 pr-3 font-medium text-slate-800">
                        {r.short}
                      </td>
                      <td className="py-1.5 pr-3">{r.endowmentBn.toFixed(1)}</td>
                      <td className="py-1.5 pr-3">
                        {r.endowmentShareOfOpsPct}%
                      </td>
                      <td className="py-1.5 pr-3">
                        {r.netTuitionShareOfOpsPct}%
                      </td>
                      <td
                        className={
                          "py-1.5 font-semibold " +
                          (r.payoutMinusTuitionPp >= 0
                            ? "text-teal-700"
                            : "text-rose-600")
                        }
                      >
                        {r.payoutMinusTuitionPp > 0 ? "+" : ""}
                        {r.payoutMinusTuitionPp}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      ) : null}

      {view === "trend" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Mean vs median support of ops"
            subtitle="NCSE FY18–FY25 — mean pulled by a thin right tail"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={OPS_SUPPORT_TREND}
                  margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="fy" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 18]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgSharePct"
                    name="Mean %"
                    stroke={ROSE}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="medianSharePct"
                    name="Median %"
                    stroke={TEAL}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Support by institution type"
            subtitle="FY25 vs FY24 — public and IRF jumped hardest"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={INST_TYPE_SUPPORT}
                  margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="fy24SharePct"
                    name="FY24"
                    fill="#94a3b8"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="fy25SharePct"
                    name="FY25"
                    fill={AMBER}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {view === "deciles" ? (
        <ChartCard
          title="How thin is the buffer below the top decile?"
          subtitle="Anchored profile: endowment vs net-tuition share of ops by size decile"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={deciles}
                margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  unit="%"
                  domain={[0, 60]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  unit=" pp"
                  domain={[-20, 5]}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="endowment"
                  name="Endowment % ops"
                  fill={TEAL}
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  yAxisId="left"
                  dataKey="tuition"
                  name="Net tuition % ops"
                  fill={AMBER}
                  radius={[3, 3, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="buffer"
                  name="vs D10 (pp)"
                  stroke={ROSE}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Top-decile mean endowment support (~
            {DECILE_BUFFER[0].meanEndowmentSharePct}%) sits{" "}
            {Math.abs(DECILE_BUFFER[1].bufferVsTopDecilePp).toFixed(1)} pp above
            D9 and ~{Math.abs(DECILE_BUFFER[3].bufferVsTopDecilePp).toFixed(0)}{" "}
            pp above the mid-pack. Below D8, net tuition overtakes endowment as
            the larger operating pillar in this profile.
          </p>
        </ChartCard>
      ) : null}

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-700">Sources</p>
        <ul className="mt-1 list-disc space-y-0.5 pl-4">
          {SOURCES.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="mt-2 italic">{SOURCE_NOTE}</p>
        <p className="mt-1 text-slate-400">
          Size bands: {SIZE_BANDS.length} · Institutions: {panel.length} ·
          Control filter: {control}
        </p>
      </div>
    </div>
  );
}
