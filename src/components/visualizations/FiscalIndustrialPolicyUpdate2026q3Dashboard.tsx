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
  GREEN_SUBSIDY_SHARE,
  HEADLINE,
  INSTRUMENT_PERSISTENCE,
  SELECTIVE_ACTIVITY,
  SOURCE_NOTE,
  SOURCES,
  STRATEGIC_PATH,
  STRATEGIC_SUBSIDY_SHARE,
  STRATEGIC_VS_GREEN,
  SUBSIDY_FOLLOW_RATES,
  deltasFor,
  fmtInt,
  fmtPct,
  fmtPp,
  strategicFor,
  type DeltaBarRow,
  type StrategicVintageRow,
} from "@/data/fiscal-industrial-policy-update-2026q3-data";

// viz-types: diverging-delta-bar, strategic-path-line, dumbbell-strategic, green-grouped-bar, follow-range-area, strategic-green-scatter | layout: default
// viz-plan: vintage Δ bars; CN/EU/US strategic path; prior→new dumbbell; green catch-up bars; subsidy-follow band; scatter; bloc + delta-group controls

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

type BlocFilter = StrategicVintageRow["bloc"] | "All";
type DeltaGroup = DeltaBarRow["group"] | "All";

const COLORS = {
  prior: "#94a3b8",
  neu: "#0f766e",
  up: "#be123c",
  down: "#0369a1",
  china: "#dc2626",
  eu: "#2563eb",
  us: "#7c3aed",
  green: "#ca8a04",
  band: "#0d9488",
  export: "#c2410c",
  importBar: "#64748b",
  subsidy: "#4f46e5",
};

export function FiscalIndustrialPolicyUpdate2026q3Dashboard() {
  const [bloc, setBloc] = useState<BlocFilter>("All");
  const [deltaGroup, setDeltaGroup] = useState<DeltaGroup>("All");

  const strategicRows = useMemo(() => strategicFor(bloc), [bloc]);
  const deltas = useMemo(() => deltasFor(deltaGroup), [deltaGroup]);

  const deltaBars = useMemo(
    () =>
      [...deltas]
        .map((d) => ({
          id: d.id,
          label: d.label,
          value: d.delta,
          fill: d.delta >= 0 ? COLORS.up : COLORS.down,
          priorValue: d.priorValue,
          newValue: d.newValue,
          priorLabel: d.priorLabel,
          newLabel: d.newLabel,
          unit: d.unit,
        }))
        .sort((a, b) => b.value - a.value),
    [deltas]
  );

  const dumbbell = useMemo(
    () =>
      strategicRows.map((r) => ({
        key: r.shortLabel,
        label: r.shortLabel,
        prior: r.priorPct,
        neu: r.newPct,
      })),
    [strategicRows]
  );

  const pathChart = useMemo(
    () =>
      STRATEGIC_PATH.map((r) => ({
        window: r.window,
        China: r.china,
        EU: r.eu,
        US: r.us,
      })),
    []
  );

  const greenChart = useMemo(
    () =>
      GREEN_SUBSIDY_SHARE.map((r) => ({
        bloc: r.shortLabel,
        early: r.earlyPct,
        late: r.latePct,
      })),
    []
  );

  const followChart = useMemo(
    () =>
      SUBSIDY_FOLLOW_RATES.map((r) => ({
        period: r.period,
        low: r.lowPct,
        high: r.highPct,
        mid: r.midPct,
        span: r.highPct - r.lowPct,
      })),
    []
  );

  const persistChart = useMemo(
    () =>
      INSTRUMENT_PERSISTENCE.map((r) => ({
        instrument: r.shortLabel,
        early: r.earlyPct,
        late: r.latePct,
      })),
    []
  );

  const activityChart = useMemo(
    () =>
      SELECTIVE_ACTIVITY.map((r) => ({
        period: r.period,
        actions: r.annualActions,
        label: r.label,
      })),
    []
  );

  return (
    <div className="space-y-6" data-viz="fiscal-industrial-policy-update-2026q3">
      <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — Aug 2026 update → ZG #88 chokepoint print + Big Three panel
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          US strategic subsidy targeting {fmtPct(HEADLINE.usStrategicPriorPct)} →{" "}
          {fmtPct(HEADLINE.usStrategicNewPct)} ({fmtPp(HEADLINE.usStrategicDeltaPp)})
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          China was already at {fmtPct(HEADLINE.chinaStrategicPriorPct)} in 2009–16 and now sits at{" "}
          {fmtPct(HEADLINE.chinaStrategicNewPct)}. The EU climbs {fmtPp(HEADLINE.euStrategicDeltaPp)}{" "}
          to {fmtPct(HEADLINE.euStrategicNewPct)}. Selective industrial actions plateau near{" "}
          {fmtInt(HEADLINE.annualSelective202224)} per year — roughly {fmtInt(HEADLINE.annualSelectiveDeltaVsPre)}{" "}
          above the 2009–19 mean — while same-product subsidy follow rates push into the{" "}
          {fmtPct(HEADLINE.subsidyFollowNewLowPct)}–{fmtPct(HEADLINE.subsidyFollowNewHighPct)} band.
        </p>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Bloc filter
            </span>
            {(
              [
                ["All", "All"],
                ["China", "China"],
                ["European Union", "EU"],
                ["United States", "US"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setBloc(id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  bloc === id
                    ? "bg-teal-800 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Delta group
            </span>
            {(
              [
                ["All", "All"],
                ["strategic", "Strategic"],
                ["activity", "Activity"],
                ["green", "Green"],
                ["interaction", "Interaction"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setDeltaGroup(id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  deltaGroup === id
                    ? "bg-rose-800 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ChartCard
        title="Vintage change (percentage points / counts)"
        subtitle="Positive = higher strategic targeting, activity, green share, follow rate, or export lock-in"
      >
        <div className="h-80 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={deltaBars}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="label"
                width={168}
                tick={{ fontSize: 10 }}
              />
              <Tooltip
                formatter={(value, _n, item) => {
                  const row = item?.payload as
                    | {
                        unit?: string;
                        priorLabel?: string;
                        priorValue?: number;
                        newLabel?: string;
                        newValue?: number;
                      }
                    | undefined;
                  if (!row) return [String(value ?? ""), "Δ"];
                  const unit = row.unit === "count" ? "" : "%";
                  return [
                    `${row.priorLabel} ${row.priorValue}${unit} → ${row.newLabel} ${row.newValue}${unit} (Δ ${value}${row.unit === "count" ? "" : " pp"})`,
                    "Vintage Δ",
                  ];
                }}
              />
              <ReferenceLine x={0} stroke="#64748b" />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {deltaBars.map((d) => (
                  <Cell key={d.id} fill={d.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Strategic subsidy path: China, EU, US"
          subtitle="Share of subsidy IP covering dual-use / advanced tech (ZG #88 + panel path)"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pathChart} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="window" tick={{ fontSize: 11 }} />
                <YAxis domain={[20, 100]} tick={{ fontSize: 11 }} unit="%" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="China"
                  stroke={COLORS.china}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="EU"
                  stroke={COLORS.eu}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="US"
                  stroke={COLORS.us}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Strategic shares: 2009–16 → 2025–26 (dumbbell)"
          subtitle="Filter by bloc above; endpoints are disclosed ZG #88 windows"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={dumbbell}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[20, 100]} tick={{ fontSize: 11 }} unit="%" />
                <YAxis type="category" dataKey="label" width={56} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="prior" fill={COLORS.prior} barSize={6} name="2009–16" />
                <Bar dataKey="neu" fill={COLORS.neu} barSize={6} name="2025–26" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Green subsidy catch-up: early vs late"
          subtitle="Low-carbon share of subsidy IP — China early; EU/US post-2020 surge"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={greenChart} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="bloc" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 60]} tick={{ fontSize: 11 }} unit="%" />
                <Tooltip />
                <Legend />
                <Bar dataKey="early" fill={COLORS.prior} name="Early window" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" fill={COLORS.green} name="2023–24" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Same-HS6 subsidy follow within 12 months"
          subtitle="Band = disclosed low–high range; line = midpoint used in deltas"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={followChart} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis domain={[20, 90]} tick={{ fontSize: 11 }} unit="%" />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="high"
                  stroke="none"
                  fill={COLORS.band}
                  fillOpacity={0.2}
                  name="High band"
                />
                <Area
                  type="monotone"
                  dataKey="low"
                  stroke="none"
                  fill="#ffffff"
                  fillOpacity={1}
                  name="Low band floor"
                />
                <Line
                  type="monotone"
                  dataKey="mid"
                  stroke={COLORS.band}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  name="Midpoint"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Selective IP activity regime"
          subtitle="Annual selective industrial actions — Market-Shaping Fact 1"
        >
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityChart} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v, _n, item) => [
                    `${fmtInt(Number(v ?? 0))} — ${(item?.payload as { label?: string } | undefined)?.label ?? ""}`,
                    "Annual actions",
                  ]}
                />
                <Bar dataKey="actions" fill={COLORS.neu} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Instrument persistence (12-month retention)"
          subtitle="Export controls harden; import barriers stay contingent; subsidies nearly permanent"
        >
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={persistChart} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="instrument" tick={{ fontSize: 11 }} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} unit="%" />
                <Tooltip />
                <Legend />
                <Bar dataKey="early" fill={COLORS.prior} name="Earlier cohort" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" fill={COLORS.export} name="Recent cohort" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Strategic vs green targeting (late vintage)"
        subtitle="Scatter anchors: strategic share (2025–26) vs green subsidy share (2023–24)"
      >
        <div className="h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 24, left: 8, bottom: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="strategicPct"
                name="Strategic %"
                domain={[65, 100]}
                tick={{ fontSize: 11 }}
                label={{ value: "Strategic subsidy %", position: "insideBottom", offset: -4, fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="greenPct"
                name="Green %"
                domain={[35, 60]}
                tick={{ fontSize: 11 }}
                label={{ value: "Green subsidy %", angle: -90, position: "insideLeft", fontSize: 11 }}
              />
              <ZAxis range={[120, 120]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) => [`${v}%`, String(name)]}
                labelFormatter={(_, payload) =>
                  String(
                    (payload?.[0]?.payload as { bloc?: string } | undefined)?.bloc ??
                      ""
                  )
                }
              />
              <Scatter data={STRATEGIC_VS_GREEN} fill={COLORS.us}>
                {STRATEGIC_VS_GREEN.map((p) => (
                  <Cell
                    key={p.bloc}
                    fill={
                      p.bloc === "China"
                        ? COLORS.china
                        : p.bloc === "EU"
                          ? COLORS.eu
                          : COLORS.us
                    }
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {STRATEGIC_VS_GREEN.map((p) => `${p.bloc}: strategic ${p.strategicPct}% / green ${p.greenPct}%`).join(
            " · "
          )}
        </p>
      </ChartCard>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <span className="font-semibold text-slate-700">Sources: </span>
        {SOURCES.map((s, i) => (
          <span key={s.url}>
            {i > 0 && " · "}
            <a href={s.url} className="text-teal-800 underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
              {s.label}
            </a>
          </span>
        ))}
      </div>
    </div>
  );
}
