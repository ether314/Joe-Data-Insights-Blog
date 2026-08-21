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
  HEADLINE,
  MARKET_BANDS,
  MARKETS,
  REGIONS,
  SCOREBOARD,
  SOURCE_NOTE,
  SOURCES,
  TOKEN_BRANDS,
  TOKEN_VS_OWNERSHIP,
  fmtHhi,
  fmtPct,
  fmtT,
  ownerCurve,
  ownerLadderSorted,
  regionCurve,
  tokenCurve,
  type PerimeterId,
} from "@/data/ai-compute-demand-concentration-2026-data";

// viz-types: scoreboard bars, Lorenz area+line, ranked ownership bars, cloud donut, market bands, path multi-line, region bars, token bars, token-vs-owner scatter | layout: default

type ViewId = "scoreboard" | "ownership" | "geography" | "tokens";
type CurveId = "owners" | "regions" | "tokens";

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

export function AiComputeDemandConcentrationDashboard() {
  const [view, setView] = useState<ViewId>("scoreboard");
  const [curveId, setCurveId] = useState<CurveId>("owners");
  const [highlight, setHighlight] = useState<PerimeterId | "all">("all");

  const owners = useMemo(() => ownerLadderSorted(), []);
  const oCurve = useMemo(() => ownerCurve(), []);
  const rCurve = useMemo(() => regionCurve(), []);
  const tCurve = useMemo(() => tokenCurve(), []);

  const activeCurve = curveId === "owners" ? oCurve : curveId === "regions" ? rCurve : tCurve;
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
        metric: "Top-3",
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
        ownerBig5: p.ownerBig5Pct,
        cloudTop3: p.cloudTop3Pct,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="ai-compute-demand-concentration-2026"
    >
      <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-5 py-4">
        <p className="text-sm font-semibold text-amber-950">
          AI compute demand — concentration lens
        </p>
        <p className="mt-1 text-sm text-amber-900/80">
          Chip ownership Top-1 is {fmtPct(HEADLINE.ownerTop1Pct)} (
          {HEADLINE.ownerTop1Label}); Top-3 is {fmtPct(HEADLINE.ownerTop3Pct)}.
          Hyperscale Top-3 cloud sits at {fmtPct(HEADLINE.cloudTop3Pct, 0)}.
          Token Top-1 is {fmtPct(HEADLINE.tokenTop1Pct)} (
          {HEADLINE.tokenTop1Label}) — ownership ≠ usage.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={view}
          options={[
            { id: "scoreboard", label: "Scoreboard" },
            { id: "ownership", label: "Ownership ladder" },
            { id: "geography", label: "Sites & regions" },
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
              { id: "cloud", label: "Cloud / sites" },
              { id: "region", label: "Regions" },
              { id: "tokens", label: "Tokens" },
            ]}
            onChange={setHighlight}
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
                  Top-3 {fmtPct(s.top3Pct, 0)} · {s.extraMetric} {s.extraValue}
                </p>
              </div>
            ))}
          </div>

          <ChartCard
            title="Top-1 vs Top-3 across perimeters"
            subtitle="Same concentration question, four market definitions — do not average them"
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
            <p className="mt-2 text-xs text-slate-500">
              Alternating bars are Top-1 then Top-3 within each perimeter filter.
            </p>
          </ChartCard>

          <ChartCard
            title="Concentration path"
            subtitle="Ownership Top-1 / Top-3 / Big-5 and Synergy cloud Top-3 when disclosed"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={pathData}
                  margin={{ top: 8, right: 16, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                    domain={[40, 80]}
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
                    dataKey="ownerBig5"
                    name="Owner Big-5"
                    stroke="#8b5cf6"
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
                </LineChart>
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
              <p className="text-sm text-slate-600">{HEADLINE.ownerTop3Labels}</p>
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
            subtitle="Google alone ≈ one quarter; Big-5 clear 71.4%"
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

      {view === "geography" && (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              title="Hyperscale capacity — Top-3 cloud"
              subtitle={`AWS + Azure + Google = ${HEADLINE.cloudTop3Pct}% (−1 pp vs Q3)`}
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
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {CLOUD_SLICES.map((s) => (
                  <li key={s.id} className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-sm"
                      style={{ background: s.color }}
                    />
                    {s.label}: {fmtPct(s.sharePct, 0)}
                  </li>
                ))}
              </ul>
            </ChartCard>

            <ChartCard
              title="Market capacity bands"
              subtitle="Top-20 markets = 60%; N.VA + Beijing alone = 17%"
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
                    <Bar dataKey="sharePct" name="Capacity %" radius={[4, 4, 0, 0]}>
                      {MARKET_BANDS.map((b) => (
                        <Cell key={b.id} fill={b.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <ChartCard
            title="Regional AI DC capacity by power draw"
            subtitle="US Top-1 at ~45%; Top-3 regions (US + China + Europe) ≈ 77%"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={REGIONS}
                  margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#64748b" }} />
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

          <ChartCard
            title="Named markets — growth vs capacity hint"
            subtitle="Texas ops +71% YoY vs +36% world; dual-hub metros lead capacity"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, left: 4, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="capacityHintPct"
                    name="Capacity hint %"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                  />
                  <YAxis
                    type="number"
                    dataKey="yoyGrowthPct"
                    name="YoY growth %"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                  />
                  <ZAxis range={[80, 200]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter
                    data={MARKETS.filter((m) => m.yoyGrowthPct != null)}
                    name="Market"
                  >
                    {MARKETS.filter((m) => m.yoyGrowthPct != null).map((m) => (
                      <Cell key={m.id} fill={m.color} />
                    ))}
                  </Scatter>
                </ScatterChart>
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
                {fmtPct(HEADLINE.tokenTop1Pct, 1)}
              </p>
              <p className="text-sm text-slate-600">{HEADLINE.tokenTop1Label}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Token Top-3
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {fmtPct(HEADLINE.tokenTop3Pct, 1)}
              </p>
              <p className="text-sm text-slate-600">{HEADLINE.tokenTop3Labels}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                China-origin tokens
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {fmtPct(HEADLINE.tokenChinaOriginPct, 1)}
              </p>
              <p className="text-sm text-slate-600">
                vs US origin {fmtPct(HEADLINE.tokenUsOriginPct, 1)}
              </p>
            </div>
          </div>

          <ChartCard
            title="June 2026 token brand ladder"
            subtitle={`Total ~${fmtT(HEADLINE.tokenTotalT)} tokens/mo across major brands`}
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
            <p className="mt-2 text-xs text-slate-500">
              ByteDance and OpenAI sit high on tokens with near-zero ownership;
              Microsoft / Amazon / Meta sit ownership-heavy vs first-party tokens.
            </p>
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
