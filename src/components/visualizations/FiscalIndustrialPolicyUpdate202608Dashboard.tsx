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
  Pie,
  PieChart,
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
  ANNUAL_DISTORTIVE,
  EU_STEEL_REGIME,
  HEADLINE,
  JUNE_BLOC_SPLIT,
  MIX_ANCHORS,
  OWNERSHIP_STAKES,
  SOURCE_NOTE,
  SOURCES,
  TOOLKIT_2025,
  deltasFor,
  fmtInt,
  fmtPct,
  fmtPp,
  monthlyFor,
  type DeltaBarRow,
} from "@/data/fiscal-industrial-policy-update-202608-data";

// viz-types: diverging-delta-bar, annual-flow-line, toolkit-pie, monthly-area, june-bloc-bar, steel-dumbbell, ownership-hbar, mix-scatter | layout: default
// viz-plan: vintage Δ; 2009→2025 flow; 2025 toolkit pie; May–Jul monthly; June geography; EU steel; ownership stakes; barrier×subsidy scatter; scope + delta-group controls

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

type FlowScope = "All" | "BigThree" | "Rest";
type DeltaGroup = DeltaBarRow["group"] | "All";

const COLORS = {
  prior: "#94a3b8",
  neu: "#0f766e",
  up: "#be123c",
  down: "#0369a1",
  barrier: "#c2410c",
  subsidy: "#4f46e5",
  finance: "#0891b2",
  other: "#64748b",
  us: "#7c3aed",
  eu: "#2563eb",
  china: "#dc2626",
  rest: "#0d9488",
  steel: "#b45309",
  ownership: "#a21caf",
};

const PIE_COLORS = [COLORS.barrier, COLORS.subsidy, COLORS.finance, COLORS.other];

export function FiscalIndustrialPolicyUpdate202608Dashboard() {
  const [flowScope, setFlowScope] = useState<FlowScope>("All");
  const [deltaGroup, setDeltaGroup] = useState<DeltaGroup>("All");

  const deltas = useMemo(() => deltasFor(deltaGroup), [deltaGroup]);
  const monthly = useMemo(() => monthlyFor(flowScope), [flowScope]);

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
        .sort((a, b) => Math.abs(b.value) - Math.abs(a.value)),
    [deltas]
  );

  const annualChart = useMemo(
    () =>
      ANNUAL_DISTORTIVE.map((r) => ({
        year: String(r.year),
        actions: r.distortiveActions,
      })),
    []
  );

  const toolkitPie = useMemo(
    () =>
      TOOLKIT_2025.map((r) => ({
        name: r.shortLabel,
        value: r.sharePct,
        count: r.count,
      })),
    []
  );

  const monthlyChart = useMemo(
    () =>
      monthly.map((m) => ({
        month: m.month.replace(" 2026", ""),
        total: m.total,
      })),
    [monthly]
  );

  const juneBloc = useMemo(
    () =>
      JUNE_BLOC_SPLIT.map((r) => ({
        bloc: r.shortLabel,
        interventions: r.interventions,
        share: r.sharePct,
      })),
    []
  );

  const steelChart = useMemo(
    () =>
      EU_STEEL_REGIME.map((r) => ({
        label: r.shortLabel,
        prior: r.priorValue,
        neu: r.newValue,
      })),
    []
  );

  const ownershipChart = useMemo(
    () =>
      [...OWNERSHIP_STAKES]
        .map((r) => ({
          label: r.shortLabel,
          usd: r.usdMillions,
          geography: r.geography,
        }))
        .sort((a, b) => b.usd - a.usd),
    []
  );

  return (
    <div className="space-y-6" data-viz="fiscal-industrial-policy-update-202608">
      <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — Q3 chokepoint print → 2025 toolkit mix + mid-2026 monthly flow
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Distortive IP {fmtInt(HEADLINE.annualDistortive2009)} →{" "}
          {fmtInt(HEADLINE.annualDistortive2025)} in 2025 (+
          {fmtInt(HEADLINE.annualDistortiveDelta)}); toolkit now{" "}
          {fmtPct(HEADLINE.importBarrierPct2025)} /{" "}
          {fmtPct(HEADLINE.domesticSubsidyPct2025)} /{" "}
          {fmtPct(HEADLINE.financeInvestControlPct2025)}
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Q3 showed strategic subsidy targeting at {fmtPct(HEADLINE.priorQ3UsStrategicPct)} US /{" "}
          {fmtPct(HEADLINE.priorQ3EuStrategicPct)} EU / {fmtPct(HEADLINE.priorQ3CnStrategicPct)}{" "}
          China. This print answers the instrument question: import barriers, domestic
          subsidies, and finance/FDI controls are co-equal in the 2025 global mix, while GTA
          monthly developments jump May→Jul {fmtInt(HEADLINE.may2026Total)} →{" "}
          {fmtInt(HEADLINE.jul2026Total)} ({fmtPp(HEADLINE.julVsMayDeltaPct)} on the flow).
        </p>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Monthly scope
            </span>
            {(
              [
                ["All", "All"],
                ["BigThree", "US+EU+CN"],
                ["Rest", "Rest of world"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFlowScope(id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  flowScope === id
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
                ["flow", "Flow"],
                ["toolkit", "Toolkit"],
                ["coercion", "Coercion"],
                ["ownership", "Ownership"],
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
        title="Vintage change (counts / percentage points)"
        subtitle="Filter by delta group — flow, toolkit mix, coercive steel/301, ownership stakes"
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
              <YAxis type="category" dataKey="label" width={180} tick={{ fontSize: 10 }} />
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
          title="Annual distortive IP: 2009 → 2025"
          subtitle="Teneo–NIPO endpoints disclosed; mid-path points estimated"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={annualChart} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis domain={[1000, 2100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => [fmtInt(Number(v ?? 0)), "Distortive actions"]}
                />
                <ReferenceLine
                  y={HEADLINE.priorQ3SelectivePlateau}
                  stroke={COLORS.prior}
                  strokeDasharray="4 4"
                  label={{ value: "Q3 selective ~1,900", fontSize: 10, fill: "#64748b" }}
                />
                <Line
                  type="monotone"
                  dataKey="actions"
                  stroke={COLORS.neu}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  name="Annual distortive"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="2025 distortive toolkit mix"
          subtitle="Import barriers ≈ subsidies ≈ finance/FDI controls — three co-equal pillars"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={toolkitPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={90}
                  paddingAngle={2}
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {toolkitPie.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, _n, item) => {
                    const count = (item?.payload as { count?: number } | undefined)?.count;
                    return [
                      count != null
                        ? `${v}% (${fmtInt(count)} actions)`
                        : `${v}%`,
                      "Share",
                    ];
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Mid-2026 monthly flow (GTA Roundups)"
          subtitle="Use Monthly scope control — All / Big Three / Rest"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyChart} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [fmtInt(Number(v ?? 0)), "Developments"]} />
                <Area
                  type="monotone"
                  dataKey="total"
                  fill={COLORS.rest}
                  fillOpacity={0.25}
                  stroke={COLORS.neu}
                  strokeWidth={2.5}
                  name="Documented developments"
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke={COLORS.neu}
                  strokeWidth={2}
                  dot={{ r: 5 }}
                  legendType="none"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="June 2026 geography split"
          subtitle="Rest of world still supplies most of the monthly flow (62%)"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={juneBloc} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="bloc" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v, _n, item) => [
                    `${fmtInt(Number(v ?? 0))} (${(item?.payload as { share?: number })?.share ?? ""}%)`,
                    "Interventions",
                  ]}
                />
                <Bar dataKey="interventions" radius={[4, 4, 0, 0]}>
                  {juneBloc.map((r) => (
                    <Cell
                      key={r.bloc}
                      fill={
                        r.bloc === "US"
                          ? COLORS.us
                          : r.bloc === "EU"
                            ? COLORS.eu
                            : r.bloc === "China"
                              ? COLORS.china
                              : COLORS.rest
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="EU steel reverse TRQ: prior → new"
          subtitle="In-quota volume cut ~47%; out-of-quota duty 25% → 50%"
        >
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={steelChart}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 60]} tick={{ fontSize: 11 }} unit="%" />
                <YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="prior" fill={COLORS.prior} barSize={8} name="Prior regime" />
                <Bar dataKey="neu" fill={COLORS.steel} barSize={8} name="Reverse TRQ" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Ownership as industrial policy (Jun–Jul)"
          subtitle="CHIPS equity LOIs, Canada Growth Fund, Chinese subnational funds"
        >
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ownershipChart}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="label" width={120} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(v, _n, item) => [
                    `$${fmtInt(Number(v ?? 0))}m — ${(item?.payload as { geography?: string })?.geography ?? ""}`,
                    "USD millions",
                  ]}
                />
                <Bar dataKey="usd" fill={COLORS.ownership} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Barrier × subsidy mix anchors"
        subtitle="Global 2025 mix sits near the diagonal; Q3 CN/EU stock intuition was subsidy-heavy"
      >
        <div className="h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 24, left: 8, bottom: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="barrierPct"
                name="Import barrier %"
                domain={[0, 50]}
                tick={{ fontSize: 11 }}
                label={{
                  value: "Import-barrier share %",
                  position: "insideBottom",
                  offset: -4,
                  fontSize: 11,
                }}
              />
              <YAxis
                type="number"
                dataKey="subsidyPct"
                name="Subsidy %"
                domain={[0, 100]}
                tick={{ fontSize: 11 }}
                label={{
                  value: "Domestic-subsidy share %",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 11,
                }}
              />
              <ZAxis range={[140, 140]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) => [`${v}%`, String(name)]}
                labelFormatter={(_, payload) =>
                  String(
                    (payload?.[0]?.payload as { label?: string } | undefined)?.label ?? ""
                  )
                }
              />
              <Scatter data={MIX_ANCHORS} fill={COLORS.neu}>
                {MIX_ANCHORS.map((p) => (
                  <Cell
                    key={p.label}
                    fill={
                      p.label.startsWith("Global")
                        ? COLORS.neu
                        : p.label.startsWith("US")
                          ? COLORS.us
                          : COLORS.china
                    }
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {MIX_ANCHORS.map(
            (p) => `${p.label}: barriers ${p.barrierPct}% / subsidies ${p.subsidyPct}%`
          ).join(" · ")}
        </p>
      </ChartCard>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <span className="font-semibold text-slate-700">Sources: </span>
        {SOURCES.map((s, i) => (
          <span key={s.url}>
            {i > 0 && " · "}
            <a
              href={s.url}
              className="text-teal-800 underline-offset-2 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {s.label}
            </a>
          </span>
        ))}
      </div>
    </div>
  );
}
