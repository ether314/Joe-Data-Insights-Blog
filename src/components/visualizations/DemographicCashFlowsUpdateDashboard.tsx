"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  DUAL_LEDGER,
  FLOW_DUMBBELL,
  HEADLINE,
  LAC_GROWTH,
  MEXICO_SERIES,
  PENSION_PATH,
  ROLE_COLORS,
  SCATTER_POINTS,
  SOURCE_NOTE,
  SOURCES,
  VINTAGE_TABLE,
  fmtBn,
  fmtPct,
  type ScatterPoint,
} from "@/data/demographic-cash-flows-update-2026-data";

// viz-types: Mexico area+YoY composed, LAC YoY bars, prior→new dumbbell, age×remit scatter, pension path lines | layout: default
// viz-plan: vintage KPI strip; MX series; LAC divergence; flow dumbbell; scatter shift; host pension path

type Panel = "mexico" | "lac" | "dumbbell" | "scatter" | "pensions";
type ScatterFilter = "all" | "prior" | "new";
type LacSort = "growth" | "alpha";

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
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              value === o.id
                ? "bg-teal-900 text-white"
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

function GenericTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string; color?: string }>;
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  const sorted = sortTooltipPayload(payload);
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      {label != null && (
        <p className="mb-1 font-semibold text-slate-800">{label}</p>
      )}
      {sorted.map((p, i) => (
        <p key={i} className="text-slate-600" style={{ color: p.color }}>
          {p.name}:{" "}
          <span className="font-semibold text-slate-900">
            {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
          </span>
        </p>
      ))}
    </div>
  );
}

export function DemographicCashFlowsUpdateDashboard() {
  const [panel, setPanel] = useState<Panel>("mexico");
  const [scatterFilter, setScatterFilter] = useState<ScatterFilter>("all");
  const [lacSort, setLacSort] = useState<LacSort>("growth");
  const [showItalyPath, setShowItalyPath] = useState(true);

  const mexicoChart = useMemo(
    () =>
      MEXICO_SERIES.map((d) => ({
        year: d.year,
        bn: d.bn,
        yoyPct: d.yoyPct,
      })),
    [],
  );

  const lacBars = useMemo(() => {
    const rows = [...LAC_GROWTH];
    if (lacSort === "growth") {
      rows.sort((a, b) => b.yoyPct - a.yoyPct);
    } else {
      rows.sort((a, b) => a.label.localeCompare(b.label));
    }
    return rows;
  }, [lacSort]);

  const scatterData = useMemo(() => {
    return SCATTER_POINTS.filter((p) => {
      if (scatterFilter === "all") return true;
      return p.vintage === scatterFilter;
    });
  }, [scatterFilter]);

  const dumbbellChart = useMemo(
    () =>
      FLOW_DUMBBELL.map((d) => ({
        label: d.label,
        prior: d.priorBn,
        neu: d.newBn,
        delta: d.deltaBn,
      })),
    [],
  );

  const pensionChart = useMemo(
    () =>
      PENSION_PATH.map((d) => ({
        year: d.year,
        oecd32: d.oecd32,
        italy: d.italy,
        japan: d.japan,
        unitedStates: d.unitedStates,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="demographic-cash-flows-update-2026"
      data-viz-dashboard
    >
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
        <h2 className="text-lg font-bold text-slate-900">
          Vintage delta — Brief 41 → Banxico 2025
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Mexico remittances break an 11-year streak (−4.6% to $61.8B) while LAC
          peers accelerate and OECD pension paths climb toward 10% of GDP.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-teal-200 bg-teal-50/60 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-800">
            Mexico 2025 YoY
          </p>
          <p className="mt-1 text-2xl font-bold text-teal-950">
            {fmtPct(HEADLINE.mexicoYoyPct)}
          </p>
          <p className="mt-0.5 text-xs text-teal-700">
            {fmtBn(HEADLINE.mexico2025BanxicoBn)} Banxico
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            vs Brief 41 2024e
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {fmtBn(HEADLINE.mexicoRestateVsBriefBn)}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            $68B e → $64.7B actual
          </p>
        </div>
        <div className="rounded-xl border border-orange-200 bg-orange-50/70 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-orange-800">
            LAC ex-Mexico
          </p>
          <p className="mt-1 text-2xl font-bold text-orange-950">
            &gt;{HEADLINE.lacExMexicoAvgGrowthPct}%
          </p>
          <p className="mt-0.5 text-xs text-orange-700">avg growth 2025</p>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50/70 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-800">
            OECD-32 pensions
          </p>
          <p className="mt-1 text-2xl font-bold text-violet-950">
            +{HEADLINE.oecd32DeltaPp} pp
          </p>
          <p className="mt-0.5 text-xs text-violet-700">
            {HEADLINE.oecd32_2023_24Pct}% → {HEADLINE.oecd32_2050Pct}% by 2050
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          label="Panel"
          value={panel}
          options={[
            { id: "mexico", label: "Mexico series" },
            { id: "lac", label: "LAC YoY" },
            { id: "dumbbell", label: "Flow Δ" },
            { id: "scatter", label: "Age × remit" },
            { id: "pensions", label: "Pension path" },
          ]}
          onChange={setPanel}
        />
        {panel === "lac" && (
          <ToggleGroup
            label="Sort"
            value={lacSort}
            options={[
              { id: "growth", label: "By growth" },
              { id: "alpha", label: "A–Z" },
            ]}
            onChange={setLacSort}
          />
        )}
        {panel === "scatter" && (
          <ToggleGroup
            label="Vintage"
            value={scatterFilter}
            options={[
              { id: "all", label: "Both" },
              { id: "prior", label: "Prior" },
              { id: "new", label: "New" },
            ]}
            onChange={setScatterFilter}
          />
        )}
        {panel === "pensions" && (
          <ToggleGroup
            label="Italy line"
            value={showItalyPath ? "on" : "off"}
            options={[
              { id: "on", label: "Show" },
              { id: "off", label: "Hide" },
            ]}
            onChange={(v) => setShowItalyPath(v === "on")}
          />
        )}
      </div>

      {panel === "mexico" && (
        <ChartCard
          title="Mexico remittances: 11-year streak ends"
          subtitle="Banxico annual inflows (USD bn) with YoY % — 2025 is the first decline since 2013"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={mexicoChart}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="bn"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}`}
                  width={48}
                />
                <YAxis
                  yAxisId="yoy"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  width={40}
                />
                <Tooltip content={<GenericTooltip />} />
                <ReferenceLine
                  yAxisId="yoy"
                  y={0}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                />
                <Area
                  yAxisId="bn"
                  type="monotone"
                  dataKey="bn"
                  name="Inflow $bn"
                  fill="#0f766e33"
                  stroke="#0f766e"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="yoy"
                  type="monotone"
                  dataKey="yoyPct"
                  name="YoY %"
                  stroke="#ea580c"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "lac" && (
        <ChartCard
          title="LAC remittance growth diverges in 2025"
          subtitle="Mexico −4.6% while Central America / Andean peers print double-digit gains (BBVA Observatory)"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lacBars}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="shortLabel"
                  width={36}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const row = payload[0].payload as (typeof lacBars)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                        <p className="font-semibold text-slate-800">
                          {row.label}
                        </p>
                        <p className="text-slate-600">
                          YoY:{" "}
                          <span className="font-semibold">
                            {fmtPct(row.yoyPct)}
                          </span>
                        </p>
                        {row.approx2025Bn != null && (
                          <p className="text-slate-600">
                            ~{fmtBn(row.approx2025Bn)} (2025)
                          </p>
                        )}
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="yoyPct" name="YoY %" radius={[0, 4, 4, 0]}>
                  {lacBars.map((r) => (
                    <Cell
                      key={r.id}
                      fill={r.yoyPct < 0 ? "#0f766e" : "#ea580c"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "dumbbell" && (
        <ChartCard
          title="Prior → new dollar levels"
          subtitle="Brief 41 restatement vs Banxico path; peer corridors still expanding"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dumbbellChart}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={150}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip content={<GenericTooltip />} />
                <Bar
                  dataKey="prior"
                  name="Prior $bn"
                  fill="#94a3b8"
                  radius={[0, 2, 2, 0]}
                />
                <Bar
                  dataKey="neu"
                  name="New $bn"
                  fill="#0f766e"
                  radius={[0, 2, 2, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "scatter" && (
        <ChartCard
          title="Age structure × remittance dependence"
          subtitle="Mexico shifts left on remittance/GDP (3.7% → 3.4%); aging hosts still sit on the pension ledge"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="oldAgeDependency"
                  name="Old-age dependency"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Old-age dependency (65+ / 100 aged 15–64)",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 11,
                    fill: "#64748b",
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="remittanceGdpPct"
                  name="Remit/GDP %"
                  tick={{ fontSize: 11 }}
                  width={40}
                  label={{
                    value: "Remittances / GDP %",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                    fill: "#64748b",
                  }}
                />
                <ZAxis range={[80, 200]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const p = payload[0].payload as ScatterPoint;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                        <p className="font-semibold text-slate-800">{p.label}</p>
                        <p className="text-slate-600">
                          Dependency: {p.oldAgeDependency}
                        </p>
                        <p className="text-slate-600">
                          Remit/GDP: {p.remittanceGdpPct}%
                        </p>
                        <p className="text-slate-500">Vintage: {p.vintage}</p>
                      </div>
                    );
                  }}
                />
                <Scatter name="Economies" data={scatterData}>
                  {scatterData.map((p) => (
                    <Cell
                      key={p.id}
                      fill={ROLE_COLORS[p.role]}
                      fillOpacity={p.vintage === "prior" ? 0.45 : 0.9}
                      stroke={p.id.startsWith("mexico") ? "#0f172a" : undefined}
                      strokeWidth={p.id.startsWith("mexico") ? 1.5 : 0}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: ROLE_COLORS["aging-host"] }}
              />
              Aging host
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: ROLE_COLORS["remittance-origin"] }}
              />
              Remittance origin
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: ROLE_COLORS.bridge }}
              />
              Bridge
            </span>
          </div>
        </ChartCard>
      )}

      {panel === "pensions" && (
        <ChartCard
          title="Host-side ledger: public pensions climb toward 10% of GDP"
          subtitle="OECD Pensions at a Glance 2025 — OECD-32 average 8.8% (2023–24) → 10.0% by 2050"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={pensionChart}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  width={40}
                  domain={[5, 18]}
                />
                <Tooltip content={<GenericTooltip />} />
                <Area
                  type="monotone"
                  dataKey="oecd32"
                  name="OECD-32 %"
                  fill="#7c3aed33"
                  stroke="#7c3aed"
                  strokeWidth={2}
                />
                {showItalyPath && (
                  <Line
                    type="monotone"
                    dataKey="italy"
                    name="Italy %"
                    stroke="#0f766e"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="japan"
                  name="Japan %"
                  stroke="#2563eb"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="unitedStates"
                  name="US %"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-3 font-semibold">Economy</th>
                  <th className="py-2 pr-3 font-semibold">Pension % GDP</th>
                  <th className="py-2 pr-3 font-semibold">Remit % GDP</th>
                  <th className="py-2 font-semibold">Old-age dep.</th>
                </tr>
              </thead>
              <tbody>
                {DUAL_LEDGER.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100">
                    <td className="py-2 pr-3 font-medium text-slate-800">
                      {r.label}
                    </td>
                    <td className="py-2 pr-3 text-slate-600">
                      {r.pensionGdpPct != null ? `${r.pensionGdpPct}%` : "—"}
                    </td>
                    <td className="py-2 pr-3 text-slate-600">
                      {r.remittanceGdpPct != null
                        ? `${r.remittanceGdpPct}%`
                        : "—"}
                    </td>
                    <td className="py-2 text-slate-600">
                      {r.oldAgeDependency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}

      <details className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <summary className="cursor-pointer font-semibold text-slate-800">
          Vintage table & sources
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-2 font-semibold">Metric</th>
                <th className="py-2 pr-2 font-semibold">Prior</th>
                <th className="py-2 pr-2 font-semibold">New</th>
                <th className="py-2 font-semibold">Δ</th>
              </tr>
            </thead>
            <tbody>
              {VINTAGE_TABLE.map((r) => (
                <tr key={r.id} className="border-b border-slate-100">
                  <td className="py-2 pr-2 font-medium text-slate-800">
                    {r.metric}
                  </td>
                  <td className="py-2 pr-2">{r.prior}</td>
                  <td className="py-2 pr-2">{r.neu}</td>
                  <td className="py-2 text-teal-800">{r.delta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          {SOURCE_NOTE}
        </p>
        <ul className="mt-2 list-inside list-disc text-xs text-teal-800">
          {SOURCES.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
