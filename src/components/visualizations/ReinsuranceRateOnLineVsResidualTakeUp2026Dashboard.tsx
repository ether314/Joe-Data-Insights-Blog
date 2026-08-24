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
  CA_RESIDUAL,
  COINCIDENCE_SERIES,
  FL_RESIDUAL,
  HARD_MARKET_GROWTH_MIX,
  HEADLINE,
  LA_RESIDUAL,
  PHASE_BANDS,
  RESIDUAL_BY_STATE,
  ROL_SERIES,
  SCATTER_POINTS,
  SOURCE_NOTE,
  SOURCES,
  STATE_META,
  TX_RESIDUAL,
  fmtPct,
  type PanelId,
  type StateId,
} from "@/data/reinsurance-rate-on-line-vs-residual-take-up-2026-data";

// viz-types: dual-axis coincidence composed, RoL area+YoY bars, residual multi-line, growth scatter, hard-market pie, phase grouped bars | layout: default

const CYAN = "#22d3ee";
const AMBER = "#fbbf24";
const ROSE = "#fb7185";
const SLATE = "#94a3b8";
const VIOLET = "#a78bfa";

const PANEL_OPTS: { id: PanelId; label: string }[] = [
  { id: "coincidence", label: "RoL vs residual" },
  { id: "rol-path", label: "RoL path" },
  { id: "residual-ladder", label: "Residual paths" },
  { id: "scatter", label: "Growth scatter" },
  { id: "state-mix", label: "Hard-market mix" },
  { id: "phase", label: "Phase bands" },
];

const STATE_OPTS: { id: StateId | "ALL"; label: string }[] = [
  { id: "ALL", label: "All states" },
  { id: "FL", label: "Florida" },
  { id: "CA", label: "California" },
  { id: "TX", label: "Texas" },
  { id: "LA", label: "Louisiana" },
];

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

export function ReinsuranceRateOnLineVsResidualTakeUp2026Dashboard() {
  const [panel, setPanel] = useState<PanelId>("coincidence");
  const [stateFilter, setStateFilter] = useState<StateId | "ALL">("ALL");
  const [indexMode, setIndexMode] = useState<"index" | "yoy">("index");

  const residualLines = useMemo(() => {
    const years = Array.from(
      new Set(
        [...FL_RESIDUAL, ...CA_RESIDUAL, ...TX_RESIDUAL, ...LA_RESIDUAL].map(
          (r) => r.year,
        ),
      ),
    ).sort((a, b) => a - b);
    return years.map((year) => {
      const row: Record<string, number | string> = { year };
      (["FL", "CA", "TX", "LA"] as StateId[]).forEach((s) => {
        const hit = RESIDUAL_BY_STATE[s].find((r) => r.year === year);
        if (hit) row[s] = hit.policyIndex;
      });
      return row;
    });
  }, []);

  const ladderData = useMemo(() => {
    const states: StateId[] =
      stateFilter === "ALL" ? ["FL", "CA", "TX", "LA"] : [stateFilter];
    return states.map((s) => {
      const rows = RESIDUAL_BY_STATE[s];
      const first = rows[0];
      const peak = rows.reduce((a, b) => (b.policies > a.policies ? b : a));
      const last = rows[rows.length - 1];
      return {
        state: STATE_META[s].label,
        residual: STATE_META[s].residualName,
        startK: Math.round(first.policies / 1000),
        peakK: Math.round(peak.policies / 1000),
        latestK: Math.round(last.policies / 1000),
        growthPct: Math.round(
          ((peak.policies - first.policies) / first.policies) * 100,
        ),
        fill: STATE_META[s].color,
      };
    });
  }, [stateFilter]);

  return (
    <div
      className="space-y-4"
      data-viz="reinsurance-rate-on-line-vs-residual-take-up-2026"
    >
      <div className="flex flex-wrap gap-3">
        <ToggleGroup
          label="Panel"
          value={panel}
          options={PANEL_OPTS}
          onChange={setPanel}
        />
        <ToggleGroup
          label="State"
          value={stateFilter}
          options={STATE_OPTS}
          onChange={setStateFilter}
        />
        {(panel === "coincidence" || panel === "rol-path") && (
          <ToggleGroup
            label="RoL lens"
            value={indexMode}
            options={[
              { id: "index", label: "Index (2017=100)" },
              { id: "yoy", label: "YoY %" },
            ]}
            onChange={setIndexMode}
          />
        )}
      </div>

      {panel === "coincidence" && (
        <ChartCard
          title="RoL vs residual take-up"
          subtitle="Guy Carpenter US property-cat RoL (rebased) against equal-weight residual policy index — hard-market coincidence"
        >
          <p className="mb-3 text-sm text-slate-600">
            From 2018→2024 the desk-rebased RoL index rose{" "}
            <span className="font-semibold text-slate-900">
              {HEADLINE.rolRise2017To2024Pct}% from the 2017 trough
            </span>{" "}
            while Florida Citizens policies jumped{" "}
            <span className="font-semibold text-slate-900">
              {HEADLINE.flPolicyGrowth2018To2023Pct}%
            </span>{" "}
            to a ~1.4M peak. Softening after 2024 breaks the coincidence in FL
            but not in California FAIR.
          </p>
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={COINCIDENCE_SERIES} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: indexMode === "index" ? "RoL index" : "RoL YoY %",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: SLATE },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Residual basket idx",
                    angle: 90,
                    position: "insideRight",
                    style: { fontSize: 11, fill: SLATE },
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="right"
                  dataKey="residualBasketIndex"
                  name="Residual basket (2018=100)"
                  fill={AMBER}
                  opacity={0.75}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey={indexMode === "index" ? "rolIndex" : "rolYoyPct"}
                  name={indexMode === "index" ? "US RoL index" : "US RoL YoY %"}
                  stroke={CYAN}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "rol-path" && (
        <ChartCard
          title="US property-cat rate-on-line path"
          subtitle="Desk-rebased Guy Carpenter US RoL index (2017=100) with YoY bars — disclosed declines in 2025–26"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={ROL_SERIES} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="idx" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="yoy" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="idx"
                  type="monotone"
                  dataKey="rolIndex"
                  name="RoL index (2017=100)"
                  fill={CYAN}
                  fillOpacity={0.2}
                  stroke={CYAN}
                  strokeWidth={2}
                />
                <Bar
                  yAxisId="yoy"
                  dataKey="yoyPct"
                  name="YoY %"
                  radius={[3, 3, 0, 0]}
                >
                  {ROL_SERIES.map((r) => (
                    <Cell
                      key={r.year}
                      fill={r.yoyPct >= 0 ? ROSE : "#34d399"}
                    />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            1/1/2025 {fmtPct(-HEADLINE.rolDropFull2025Pct, 1)} full-year after
            mid-year; 1/1/2026 {fmtPct(-HEADLINE.rolDropJan2026Pct)} (GC
            disclosed). Cumulative from 2024 peak ≈{" "}
            {fmtPct(-HEADLINE.rolDropFrom2024PeakPct)}.
          </p>
        </ChartCard>
      )}

      {panel === "residual-ladder" && (
        <ChartCard
          title="Residual policy paths"
          subtitle="Indexed policies in force (each state 2018≈100) — filter by state; ladder shows start / peak / latest"
        >
          <div className="mb-4 h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={residualLines} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                {(stateFilter === "ALL"
                  ? (["FL", "CA", "TX", "LA"] as StateId[])
                  : [stateFilter]
                ).map((s) => (
                  <Line
                    key={s}
                    type="monotone"
                    dataKey={s}
                    name={`${STATE_META[s].label} (${STATE_META[s].residualName})`}
                    stroke={STATE_META[s].color}
                    strokeWidth={2.2}
                    dot={{ r: 2.5 }}
                    connectNulls
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="h-[220px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={ladderData}
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} unit="k" />
                <YAxis
                  type="category"
                  dataKey="state"
                  width={88}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="startK" name="Start PIF (k)" fill={SLATE} radius={[0, 3, 3, 0]} />
                <Bar dataKey="peakK" name="Peak PIF (k)" fill={AMBER} radius={[0, 3, 3, 0]} />
                <Bar dataKey="latestK" name="Latest PIF (k)" fill={CYAN} radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "scatter" && (
        <ChartCard
          title="Hard-market growth scatter"
          subtitle="Same national RoL climb (2018→2024) vs residual policy growth — take-up intensity differs by state"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="rolDeltaPts"
                  name="RoL Δ pts"
                  domain={[70, 100]}
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "US RoL index pts (2018→2024)",
                    position: "insideBottom",
                    offset: -2,
                    style: { fontSize: 11, fill: SLATE },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="policyGrowthPct"
                  name="Policy growth %"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Residual PIF growth %",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: SLATE },
                  }}
                />
                <ZAxis type="number" dataKey="peakPoliciesK" range={[80, 400]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={SCATTER_POINTS} name="States">
                  {SCATTER_POINTS.map((p) => (
                    <Cell key={p.state} fill={p.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
            {SCATTER_POINTS.map((p) => (
              <li key={p.state}>
                <span className="font-semibold" style={{ color: p.color }}>
                  {p.label}
                </span>
                : +{p.policyGrowthPct}% PIF · peak ~{p.peakPoliciesK}k
              </li>
            ))}
          </ul>
        </ChartCard>
      )}

      {panel === "state-mix" && (
        <ChartCard
          title="Hard-market residual policy adds"
          subtitle="Approximate net PIF added during the hardening window (thousands) — Florida dominates absolute take-up"
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={HARD_MARKET_GROWTH_MIX}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, percent }) =>
                      `${String(name).split(" ")[0]} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {HARD_MARKET_GROWTH_MIX.map((s) => (
                      <Cell key={s.name} fill={s.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={HARD_MARKET_GROWTH_MIX}
                  margin={{ top: 8, right: 8, left: 0, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 12 }} unit="k" />
                  <Tooltip />
                  <Bar dataKey="value" name="Net PIF adds (k)" radius={[4, 4, 0, 0]}>
                    {HARD_MARKET_GROWTH_MIX.map((s) => (
                      <Cell key={s.name} fill={s.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartCard>
      )}

      {panel === "phase" && (
        <ChartCard
          title="Phase bands: RoL vs residual pace"
          subtitle="Average annual RoL YoY versus residual-basket pace by market phase"
        >
          <div className="h-[340px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={PHASE_BANDS}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} unit="%" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="rolAvgYoy"
                  name="Avg RoL YoY %"
                  fill={CYAN}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="residualBasketAvgYoy"
                  name="Avg residual basket YoY %"
                  fill={VIOLET}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {PHASE_BANDS.map((b) => (
              <li key={b.id}>
                <span className="font-semibold text-slate-800">{b.label}:</span>{" "}
                {b.note}
              </li>
            ))}
          </ul>
        </ChartCard>
      )}

      <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500">
        <p className="font-medium text-slate-600">Sources & caveats</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-700 underline-offset-2 hover:underline"
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
