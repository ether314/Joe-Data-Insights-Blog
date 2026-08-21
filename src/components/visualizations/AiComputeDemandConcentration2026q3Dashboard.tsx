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
  CLOUD_SLICES,
  CONCENTRATION_PATH,
  DELTA_METERS,
  ELECTRICITY_SLICES,
  HEADLINE,
  MARKET_BANDS,
  REGIONS,
  SCOREBOARD,
  SITE_LEDGER,
  SOURCE_NOTE,
  SOURCES,
  TOKEN_BRANDS,
  TOKEN_VS_OWNERSHIP,
  fmtHhi,
  fmtPct,
  fmtSites,
  ownerCurve,
  ownerLadderSorted,
  regionCurve,
  sitePipelineHhi,
  tokenCurve,
  type PerimeterId,
} from "@/data/ai-compute-demand-concentration-2026q3-data";

// viz-types: delta dumbbells, site stacked bars, Lorenz area+line, ownership bars, cloud donut, electricity donut, path multi-line, market bands, region bars, token bars, token-vs-owner scatter | layout: default

type ViewId = "scoreboard" | "sites" | "ownership" | "tokens";
type CurveId = "owners" | "regions" | "tokens";
type SiteMeter = "pipeline" | "ops";

const TEAL = "#0d9488";
const AMBER = "#f59e0b";
const SKY = "#0ea5e9";

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

export function AiComputeDemandConcentration2026q3Dashboard() {
  const [view, setView] = useState<ViewId>("scoreboard");
  const [curveId, setCurveId] = useState<CurveId>("owners");
  const [highlight, setHighlight] = useState<PerimeterId | "all">("all");
  const [siteMeter, setSiteMeter] = useState<SiteMeter>("pipeline");

  const owners = useMemo(() => ownerLadderSorted(), []);
  const oCurve = useMemo(() => ownerCurve(), []);
  const rCurve = useMemo(() => regionCurve(), []);
  const tCurve = useMemo(() => tokenCurve(), []);
  const pipelineHhi = useMemo(() => sitePipelineHhi(), []);

  const activeCurve =
    curveId === "owners" ? oCurve : curveId === "regions" ? rCurve : tCurve;
  const curveLabel =
    curveId === "owners"
      ? "Chip ownership"
      : curveId === "regions"
        ? "Regional AI DC"
        : "Token brands";

  const scoreboardBars = useMemo(() => {
    const rows =
      highlight === "all"
        ? SCOREBOARD
        : SCOREBOARD.filter((s) => s.id === highlight);
    return rows.flatMap((s) => [
      {
        key: `${s.id}-t1`,
        perimeter: s.label,
        metric: "Top-1",
        pct: s.top1Pct,
        fill: s.color,
      },
      {
        key: `${s.id}-t3`,
        perimeter: s.label,
        metric: "Top-3 / twin",
        pct: s.top3Pct,
        fill: `${s.color}99`,
      },
    ]);
  }, [highlight]);

  const pathData = useMemo(
    () =>
      CONCENTRATION_PATH.map((p) => ({
        label: p.label,
        ownerTop1: p.ownerTop1Pct,
        ownerTop3: p.ownerTop3Pct,
        cloudTop3: p.cloudTop3Pct,
        usPipeline: p.usPipelineSiteSharePct,
        tokenTop1: p.tokenTop1Pct,
      })),
    [],
  );

  const deltaBars = useMemo(
    () =>
      DELTA_METERS.map((d) => ({
        label: d.label,
        prior: d.prior,
        current: d.current,
        fill: d.color,
      })),
    [],
  );

  const siteStack = useMemo(
    () =>
      SITE_LEDGER.map((s) => ({
        label: s.label,
        share:
          siteMeter === "pipeline" ? s.pipelineSharePct : s.opsSharePct,
        sites: siteMeter === "pipeline" ? s.pipelineSites : s.opsSites,
        fill: s.color,
      })),
    [siteMeter],
  );

  const tokenDelta = useMemo(
    () =>
      TOKEN_BRANDS.filter((t) => t.priorSharePct != null).map((t) => ({
        label: t.label,
        prior: t.priorSharePct as number,
        current: t.sharePct,
        fill: t.color,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="ai-compute-demand-concentration-2026q3"
    >
      <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-5 py-4">
        <p className="text-sm font-semibold text-amber-950">
          AI compute demand — Q3 2026 concentration lens
        </p>
        <p className="mt-1 text-sm text-amber-900/80">
          Ownership tip stuck: Top-1 {fmtPct(HEADLINE.ownerTop1Pct, 0)} (
          {HEADLINE.ownerTop1Label}), Top-3 {fmtPct(HEADLINE.ownerTop3Pct)}.
          Cloud Top-3 {fmtPct(HEADLINE.cloudTop3Pct, 0)} (+
          {HEADLINE.cloudTop3DeltaPp} pp vs Aug). US holds{" "}
          {fmtPct(HEADLINE.usPipelineSiteSharePct)} of hyperscale pipeline
          seats. Token Top-1 flips to {HEADLINE.tokenTop1Label} at{" "}
          {fmtPct(HEADLINE.tokenTop1Pct, 0)}.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={view}
          options={[
            { id: "scoreboard", label: "Scoreboard" },
            { id: "sites", label: "Sites & cloud" },
            { id: "ownership", label: "Ownership" },
            { id: "tokens", label: "Tokens vs chips" },
          ]}
          onChange={setView}
        />
        {view === "scoreboard" && (
          <ToggleGroup
            label="Perimeter"
            value={highlight}
            options={[
              { id: "all", label: "All four" },
              { id: "ownership", label: "Ownership" },
              { id: "cloud", label: "Cloud" },
              { id: "sites", label: "Sites" },
              { id: "tokens", label: "Tokens" },
            ]}
            onChange={setHighlight}
          />
        )}
        {view === "sites" && (
          <ToggleGroup
            label="Site meter"
            value={siteMeter}
            options={[
              { id: "pipeline", label: "Pipeline seats" },
              { id: "ops", label: "Ops seats" },
            ]}
            onChange={setSiteMeter}
          />
        )}
        {view === "ownership" && (
          <ToggleGroup
            label="Lorenz curve"
            value={curveId}
            options={[
              { id: "owners", label: "Owners" },
              { id: "regions", label: "Regions" },
              { id: "tokens", label: "Tokens" },
            ]}
            onChange={setCurveId}
          />
        )}
      </div>

      {view === "scoreboard" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SCOREBOARD.map((s) => (
              <div
                key={s.id}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {s.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {fmtPct(s.top1Pct, s.top1Pct >= 10 ? 0 : 1)}
                </p>
                <p className="text-sm text-slate-600">
                  Top-1 · {s.top1Label}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Twin meter {fmtPct(s.top3Pct, 0)} · {s.extraMetric}{" "}
                  {s.extraValue}
                </p>
              </div>
            ))}
          </div>

          <ChartCard
            title="Top-1 vs twin meter across perimeters"
            subtitle="Ownership / cloud / US site share / tokens — do not average them"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={scoreboardBars}
                  margin={{ top: 8, right: 12, left: 4, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="perimeter"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                    height={56}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                    domain={[0, 100]}
                  />
                  <Tooltip />
                  <Bar dataKey="pct" name="Share %" radius={[4, 4, 0, 0]}>
                    {scoreboardBars.map((d) => (
                      <Cell key={d.key} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Prior → Q3 concentration deltas"
            subtitle="Grouped bars: prior print vs Q3 vintage on each meter"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={deltaBars}
                  margin={{ top: 8, right: 12, left: 4, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    interval={0}
                    angle={-12}
                    textAnchor="end"
                    height={52}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                    domain={[0, 70]}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="prior"
                    name="Prior %"
                    fill="#94a3b8"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="current"
                    name="Q3 %"
                    fill={AMBER}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Concentration path"
            subtitle="Owner tip sticky; cloud Top-3 ticks up; US pipeline + token tip appear in Q3"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={pathData}
                  margin={{ top: 8, right: 16, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                    domain={[15, 80]}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="ownerTop1"
                    name="Owner Top-1"
                    stroke={SKY}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ownerTop3"
                    name="Owner Top-3"
                    stroke={TEAL}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cloudTop3"
                    name="Cloud Top-3"
                    stroke={AMBER}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    connectNulls={false}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="usPipeline"
                    name="US pipeline share"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    connectNulls={false}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tokenTop1"
                    name="Token Top-1"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    connectNulls={false}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </>
      )}

      {view === "sites" && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                US pipeline seats
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {fmtPct(HEADLINE.usPipelineSiteSharePct)}
              </p>
              <p className="text-sm text-slate-600">
                {fmtSites(HEADLINE.usPipelineSites)} /{" "}
                {fmtSites(HEADLINE.worldPipelineSites)}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Cloud Top-3
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {fmtPct(HEADLINE.cloudTop3Pct, 0)}
              </p>
              <p className="text-sm text-slate-600">
                +{HEADLINE.cloudTop3DeltaPp} pp vs Aug{" "}
                {fmtPct(HEADLINE.cloudTop3PriorPct, 0)}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                US vs ROW pipeline HHI
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {fmtHhi(pipelineHhi)}
              </p>
              <p className="text-sm text-slate-600">
                Two-block site perimeter
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              title={`Hyperscale ${siteMeter === "pipeline" ? "pipeline" : "ops"} seats — US vs ROW`}
              subtitle="Synergy hyperscale-only ledger (not the Aug ~915 large-DC mix)"
            >
              <div className="h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={siteStack}
                    margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      unit="%"
                      domain={[0, 70]}
                    />
                    <Tooltip />
                    <Bar dataKey="share" name="Share %" radius={[4, 4, 0, 0]}>
                      {siteStack.map((s) => (
                        <Cell key={s.label} fill={s.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {siteStack.map((s) => (
                  <li key={s.label}>
                    {s.label}: {fmtPct(s.share)} · {fmtSites(s.sites)} seats
                  </li>
                ))}
              </ul>
            </ChartCard>

            <ChartCard
              title="Hyperscale capacity — Top-3 cloud"
              subtitle={`AWS + Azure + Google = ${HEADLINE.cloudTop3Pct}% (Q3)`}
            >
              <div className="h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CLOUD_SLICES}
                      dataKey="sharePct"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {CLOUD_SLICES.map((s) => (
                        <Cell key={s.id} fill={s.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              title="Market capacity bands"
              subtitle="Top-20 = 60%; dual-hub N.VA + Beijing = 17%"
            >
              <div className="h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={MARKET_BANDS}
                    margin={{ top: 8, right: 12, left: 4, bottom: 32 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      height={48}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      unit="%"
                      domain={[0, 50]}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="sharePct"
                      name="Capacity %"
                      radius={[4, 4, 0, 0]}
                    >
                      {MARKET_BANDS.map((b) => (
                        <Cell key={b.id} fill={b.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Gartner 2026 DC electricity — US slice"
              subtitle={`US ${HEADLINE.usDcTwh2026} TWh = ${HEADLINE.usDcShareOfWorldPct}% of world ${HEADLINE.worldDcTwh2026} TWh`}
            >
              <div className="h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ELECTRICITY_SLICES}
                      dataKey="twh"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={88}
                      paddingAngle={2}
                    >
                      {ELECTRICITY_SLICES.map((s) => (
                        <Cell key={s.id} fill={s.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {ELECTRICITY_SLICES.map((s) => (
                  <li key={s.id} className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-sm"
                      style={{ background: s.color }}
                    />
                    {s.label}: {s.twh} TWh ({fmtPct(s.shareOfWorldPct)})
                  </li>
                ))}
              </ul>
            </ChartCard>
          </div>

          <ChartCard
            title="Regional AI DC capacity by power draw"
            subtitle="US Top-1 ~45%; Top-3 regions ≈ 77% (carried synthesis)"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={REGIONS}
                  margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "#64748b" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                    domain={[0, 50]}
                  />
                  <Tooltip />
                  <Bar dataKey="sharePct" name="Share %" radius={[4, 4, 0, 0]}>
                    {REGIONS.map((r) => (
                      <Cell key={r.id} fill={r.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </>
      )}

      {view === "ownership" && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Top-1 ownership
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {fmtPct(HEADLINE.ownerTop1Pct, 0)}
              </p>
              <p className="text-sm text-slate-600">{HEADLINE.ownerTop1Label}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Top-3 ownership
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {fmtPct(HEADLINE.ownerTop3Pct, 1)}
              </p>
              <p className="text-sm text-slate-600">
                {HEADLINE.ownerTop3Labels}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Big-5 HHI
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {fmtHhi(HEADLINE.ownerBig5Hhi)}
              </p>
              <p className="text-sm text-slate-600">
                vs equal-five {fmtHhi(HEADLINE.equalFiveHhi)}
              </p>
            </div>
          </div>

          <ChartCard
            title="Ownership ladder (H100e world share)"
            subtitle="Carried Aug explorer — tip sticky; Big-5 still 71.4%"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={owners}
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                    domain={[0, 30]}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={120}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <Tooltip />
                  <Bar dataKey="sharePct" name="Share %" radius={[0, 4, 4, 0]}>
                    {owners.map((o) => (
                      <Cell key={o.id} fill={o.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title={`Cumulative share vs equal split — ${curveLabel}`}
            subtitle="Lorenz-style curve: how fast mass accumulates down the ranked list"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={activeCurve}
                  margin={{ top: 8, right: 16, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="rank"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    label={{
                      value: "Rank",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                      fill: "#94a3b8",
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                    domain={[0, 100]}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="cumPct"
                    name="Cumulative %"
                    fill={`${TEAL}33`}
                    stroke={TEAL}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="equalPct"
                    name="Equal split"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </>
      )}

      {view === "tokens" && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Token Top-1
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {fmtPct(HEADLINE.tokenTop1Pct, 0)}
              </p>
              <p className="text-sm text-slate-600">
                {HEADLINE.tokenTop1Label} (was{" "}
                {HEADLINE.tokenPriorTop1Label})
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Token Top-3
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {fmtPct(HEADLINE.tokenTop3Pct, 0)}
              </p>
              <p className="text-sm text-slate-600">
                {HEADLINE.tokenTop3Labels}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                US-origin tokens
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {fmtPct(HEADLINE.tokenUsOriginPct, 0)}
              </p>
              <p className="text-sm text-slate-600">
                China-origin {fmtPct(HEADLINE.tokenChinaOriginPct, 0)}
              </p>
            </div>
          </div>

          <ChartCard
            title="Q3 token brand ladder"
            subtitle="Google leads this cohort; ByteDance remains #2 with thin ownership"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={TOKEN_BRANDS}
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                    domain={[0, 35]}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={110}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <Tooltip />
                  <Bar dataKey="sharePct" name="Share %" radius={[0, 4, 4, 0]}>
                    {TOKEN_BRANDS.map((t) => (
                      <Cell key={t.id} fill={t.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Token share — prior June vs Q3 cohort"
            subtitle="Where the tip moved when the brand set and weights refreshed"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={tokenDelta}
                  margin={{ top: 8, right: 12, left: 4, bottom: 32 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                    height={48}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                    domain={[0, 35]}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="prior"
                    name="Prior %"
                    fill="#94a3b8"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="current"
                    name="Q3 %"
                    fill="#f43f5e"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Tokens vs chip ownership"
            subtitle="Upper-left = usage without chips; lower-right = owns more than first-party tokens"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, left: 4, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="ownerSharePct"
                    name="Owner share %"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                    domain={[0, 30]}
                  />
                  <YAxis
                    type="number"
                    dataKey="tokenSharePct"
                    name="Token share %"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                    domain={[0, 35]}
                  />
                  <ZAxis range={[100, 240]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={TOKEN_VS_OWNERSHIP} name="Brand">
                    {TOKEN_VS_OWNERSHIP.map((r) => (
                      <Cell key={r.id} fill={r.color} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs text-slate-600">
        <p className="font-semibold text-slate-800">Sources & method</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                className="text-teal-700 underline-offset-2 hover:underline"
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
