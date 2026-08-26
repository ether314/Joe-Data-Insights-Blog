"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
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
  BOOK_SPLIT,
  ERA_COMPARE,
  FISCAL_CONTEXT,
  HEADLINE,
  MITIGATION_METHODS,
  MITIGATION_TOTAL,
  NATIONAL_ML_INVENTORY,
  RL_INSURED_VS_STOCK,
  RL_STOCK,
  SOURCE_NOTE,
  STATE_MULTIPLE_LOSS,
  VIZ_MARKERS,
  dualEraSeries,
  fmtCount,
  fmtPct,
  stateScatter,
} from "@/data/nfip-repetitive-loss-properties-versus-policies-in-force-2026-data";

// viz-types: paired horizontal bars (policy vs claim share), stock area,
// era dual composed, mitigation pie, state group bars, ML×SRL scatter
// | layout: default
// smoke-marker: RL share of policies and of paid losses

type ViewId =
  | "book"
  | "stock"
  | "era"
  | "mitigation"
  | "states"
  | "scatter";

type SegmentFilter = "all" | "repetitive-loss" | "rest-of-book";
type StateMetric = "multipleLoss" | "severeRepetitiveLoss";

const NAVY = "#0f172a";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const TEAL = "#0d9488";
const SLATE = "#64748b";
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

export function NfipRepetitiveLossPropertiesVersusPoliciesInForce2026Dashboard() {
  const [view, setView] = useState<ViewId>("book");
  const [segment, setSegment] = useState<SegmentFilter>("all");
  const [stateMetric, setStateMetric] = useState<StateMetric>("multipleLoss");

  const bookRows = useMemo(() => {
    if (segment === "all") return BOOK_SPLIT;
    return BOOK_SPLIT.filter((r) => r.segment === segment);
  }, [segment]);

  const pairedBars = useMemo(
    () =>
      bookRows.flatMap((r) => [
        {
          name: `${r.label} · policies`,
          value: r.policySharePct,
          kind: "policy",
          fill: r.segment === "repetitive-loss" ? ROSE : TEAL,
        },
        {
          name: `${r.label} · claim $`,
          value: r.claimSharePct,
          kind: "claim",
          fill: r.segment === "repetitive-loss" ? AMBER : SLATE,
        },
      ]),
    [bookRows],
  );

  const stockSeries = useMemo(
    () =>
      RL_STOCK.map((r) => ({
        year: String(r.year),
        unmitigatedRl: r.unmitigatedRl,
        insuredSlice:
          r.year === 2026 ? RL_INSURED_VS_STOCK.nfipInsuredRlJan2026 : null,
      })),
    [],
  );

  const eraDual = useMemo(() => dualEraSeries(), []);
  const scatter = useMemo(() => stateScatter(), []);
  const stateBars = useMemo(() => {
    const rows = [...STATE_MULTIPLE_LOSS].sort(
      (a, b) => b[stateMetric] - a[stateMetric],
    );
    return rows.map((s) => ({
      abbr: s.abbr,
      value: s[stateMetric],
      fill: stateMetric === "multipleLoss" ? SKY : AMBER,
    }));
  }, [stateMetric]);

  return (
    <div
      className="mx-auto w-full max-w-5xl space-y-6"
      data-viz="nfip-repetitive-loss-properties-versus-policies-in-force-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-300/90">
          {VIZ_MARKERS[0]}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {fmtPct(HEADLINE.rlPolicySharePct)} of policies ·{" "}
          {fmtPct(HEADLINE.multiLossClaimSharePct, 0)} of claim dollars
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
          FEMA and GAO put unmitigated repetitive-loss properties at about{" "}
          {fmtPct(HEADLINE.rlPolicySharePct)} of the {HEADLINE.policiesInForceM}
          M policies in force, while properties with two or more losses have
          absorbed {fmtPct(HEADLINE.multiLossClaimSharePct, 0)} of cumulative
          NFIP claim dollars — roughly a {HEADLINE.claimVsPolicyRatio}×
          overweight versus their policy share.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "RL policy share",
              value: fmtPct(HEADLINE.rlPolicySharePct),
            },
            {
              label: "Multi-loss claim $",
              value: fmtPct(HEADLINE.multiLossClaimSharePct, 0),
            },
            {
              label: "RL policies insured",
              value: fmtCount(HEADLINE.rlInsuredCount),
            },
            {
              label: "Policies in force",
              value: `${HEADLINE.policiesInForceM}M`,
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-0.5 text-lg font-semibold text-white">
                {k.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup
          value={view}
          onChange={setView}
          options={[
            { id: "book", label: "Book split" },
            { id: "stock", label: "RL stock growth" },
            { id: "era", label: "Era comparison" },
            { id: "mitigation", label: "Mitigation mix" },
            { id: "states", label: "State inventory" },
            { id: "scatter", label: "ML × SRL scatter" },
          ]}
        />
      </div>

      {view === "book" && (
        <ChartCard
          title="Policy share versus claim-dollar share"
          subtitle="Unmitigated RL ≈ 2.5% of policies; ≥2-loss properties ≈ 48% of claim $"
        >
          <div className="mb-4">
            <ToggleGroup
              value={segment}
              onChange={setSegment}
              options={[
                { id: "all", label: "Full book" },
                { id: "repetitive-loss", label: "RL only" },
                { id: "rest-of-book", label: "Rest of book" },
              ]}
            />
          </div>
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                layout="vertical"
                data={pairedBars}
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fill: SLATE, fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={168}
                  tick={{ fill: NAVY, fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v) => [`${Number(v).toFixed(1)}%`, "Share"]}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
                  {pairedBars.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "stock" && (
        <ChartCard
          title="Unmitigated repetitive-loss stock"
          subtitle="GAO: ~131k (2009) → 176k (2018) → 227k (2026); ~113k still NFIP-insured"
        >
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={stockSeries}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis
                  tickFormatter={(v) => fmtCount(Number(v))}
                  tick={{ fill: SLATE, fontSize: 12 }}
                />
                <Tooltip
                  formatter={(v, name) => [
                    fmtCount(Number(v)),
                    name === "insuredSlice"
                      ? "NFIP-insured RL (2026)"
                      : "Unmitigated RL",
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="unmitigatedRl"
                  name="Unmitigated RL"
                  stroke={ROSE}
                  fill={ROSE}
                  fillOpacity={0.18}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="insuredSlice"
                  name="NFIP-insured RL (2026)"
                  stroke={SKY}
                  strokeWidth={2}
                  connectNulls={false}
                  dot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            FEMA mitigated {fmtCount(RL_INSURED_VS_STOCK.mitigatedRl1989to2025)}{" "}
            repetitive-loss properties from 1989–2025 — far below the growth in
            the unmitigated stock.
          </p>
        </ChartCard>
      )}

      {view === "era" && (
        <ChartCard
          title="How the imbalance widened"
          subtitle="From ~1% / 25–30% claims (GAO ~2010) to 2.5% / 48% claim $ (2021–2026)"
        >
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={eraDual}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fill: SLATE, fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  domain={[0, 5]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fill: TEAL, fontSize: 12 }}
                  label={{
                    value: "Policy share",
                    angle: -90,
                    position: "insideLeft",
                    fill: TEAL,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 60]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fill: AMBER, fontSize: 12 }}
                  label={{
                    value: "Claim share",
                    angle: 90,
                    position: "insideRight",
                    fill: AMBER,
                    fontSize: 11,
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="policySharePct"
                  name="Policy share %"
                  fill={TEAL}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="claimSharePct"
                  name="Claim $ share %"
                  stroke={AMBER}
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-1 text-sm text-slate-600">
            {ERA_COMPARE.map((e) => (
              <li key={e.era}>
                <span className="font-medium text-slate-800">{e.era}</span> (
                {e.source}): {e.note}
              </li>
            ))}
          </ul>
        </ChartCard>
      )}

      {view === "mitigation" && (
        <ChartCard
          title="How FEMA mitigates flood risk"
          subtitle={`${fmtCount(MITIGATION_TOTAL.properties)} properties mitigated FY1989–2025; HMGP funded ${MITIGATION_TOTAL.hmgpSharePct}%`}
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MITIGATION_METHODS}
                    dataKey="count"
                    nameKey="method"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {MITIGATION_METHODS.map((m, i) => (
                      <Cell
                        key={m.method}
                        fill={[ROSE, SKY, SLATE][i] ?? SLATE}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, name) => [fmtCount(Number(v)), String(name)]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 self-center">
              {MITIGATION_METHODS.map((m) => (
                <div
                  key={m.method}
                  className="flex items-baseline justify-between gap-3 border-b border-slate-100 pb-2"
                >
                  <span className="text-sm text-slate-700">{m.method}</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {fmtCount(m.count)} · {fmtPct(m.sharePct)}
                  </span>
                </div>
              ))}
              <p className="text-sm text-slate-600">
                Average federal cost (2008–2014 FEMA data cited by GAO): ~
                ${MITIGATION_TOTAL.avgAcquisitionCostK}k acquisition vs ~$
                {MITIGATION_TOTAL.avgElevationCostK}k elevation.
              </p>
            </div>
          </div>
        </ChartCard>
      )}

      {view === "states" && (
        <ChartCard
          title="Where multiple-loss inventory concentrates"
          subtitle={`National inventory ≈ ${fmtCount(NATIONAL_ML_INVENTORY.multipleLossProperties)} multiple-loss · ${fmtCount(NATIONAL_ML_INVENTORY.severeRepetitiveLoss)} SRL (OpenFEMA-derived)`}
        >
          <div className="mb-4">
            <ToggleGroup
              value={stateMetric}
              onChange={setStateMetric}
              options={[
                { id: "multipleLoss", label: "Multiple loss" },
                { id: "severeRepetitiveLoss", label: "Severe RL" },
              ]}
            />
          </div>
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={stateBars}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="abbr" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis
                  tickFormatter={(v) => fmtCount(Number(v))}
                  tick={{ fill: SLATE, fontSize: 12 }}
                />
                <Tooltip
                  formatter={(v) => [
                    fmtCount(Number(v)),
                    stateMetric === "multipleLoss"
                      ? "Multiple-loss properties"
                      : "Severe repetitive loss",
                  ]}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={36}>
                  {stateBars.map((d) => (
                    <Cell key={d.abbr} fill={d.fill} />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Multiple-loss stock versus severe repetitive loss"
          subtitle="Top-10 states by multiple-loss inventory; bubble size tracks SRL share of ML"
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="multipleLoss"
                  name="Multiple loss"
                  tickFormatter={(v) => fmtCount(Number(v))}
                  tick={{ fill: SLATE, fontSize: 12 }}
                  label={{
                    value: "Multiple-loss properties",
                    position: "insideBottom",
                    offset: -2,
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="severeRepetitiveLoss"
                  name="SRL"
                  tickFormatter={(v) => fmtCount(Number(v))}
                  tick={{ fill: SLATE, fontSize: 12 }}
                  label={{
                    value: "Severe RL",
                    angle: -90,
                    position: "insideLeft",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <ZAxis
                  type="number"
                  dataKey="srlSharePct"
                  range={[60, 280]}
                  name="SRL share %"
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => {
                    if (name === "SRL share %") return [`${v}%`, name];
                    return [fmtCount(Number(v)), String(name)];
                  }}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.abbr
                      ? String(payload[0].payload.abbr)
                      : ""
                  }
                />
                <Scatter name="States" data={scatter} fill={ROSE}>
                  {scatter.map((p) => (
                    <Cell key={p.abbr} fill={ROSE} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
        <p className="font-medium text-slate-800">Fiscal context</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {FISCAL_CONTEXT.map((f) => (
            <div key={f.label} className="flex justify-between gap-3">
              <span>{f.label}</span>
              <span className="font-semibold text-slate-900">
                {f.unit === "billionUsd"
                  ? `$${f.value}B`
                  : f.unit === "pct"
                    ? `${f.value}%`
                    : fmtCount(f.value)}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          {SOURCE_NOTE}
        </p>
      </div>
    </div>
  );
}
