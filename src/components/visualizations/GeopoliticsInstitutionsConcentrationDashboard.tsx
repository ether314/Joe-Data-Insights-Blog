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
  BLOCKING_POWER,
  CONCENTRATION_CURVE,
  GAP_SCATTER,
  HEADLINE,
  INSTITUTION_COMPARE,
  REGION_BUCKETS,
  SOURCE_NOTE,
  TOP_K_LADDER,
  VETO_SERIES,
  VOTE_SHARES,
  fmtPct,
  fmtPp,
} from "@/data/geopolitics-institutions-concentration-2026-data";

// viz-types: Lorenz area+line, ranked share bars, institution compare bars, region donut, veto stacked area, vote×GDP scatter | layout: default

type ViewId = "ladder" | "institutions" | "regions" | "veto";
type LadderMetric = "imfVotePct" | "ibrdVotePct" | "cumulativeImfPct";
type CompareMetric = "top1Pct" | "top3Pct" | "top5Pct";

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

export function GeopoliticsInstitutionsConcentrationDashboard() {
  const [view, setView] = useState<ViewId>("ladder");
  const [ladderMetric, setLadderMetric] =
    useState<LadderMetric>("imfVotePct");
  const [compareMetric, setCompareMetric] =
    useState<CompareMetric>("top3Pct");
  const [showEqualLine, setShowEqualLine] = useState(true);
  const [regionFilter, setRegionFilter] = useState<
    "all" | "Americas" | "Europe" | "Asia-Pacific"
  >("all");

  const ladderBars = useMemo(() => {
    return [...VOTE_SHARES]
      .map((m) => ({
        ...m,
        value:
          ladderMetric === "imfVotePct"
            ? m.imfVotePct
            : ladderMetric === "ibrdVotePct"
              ? m.ibrdVotePct
              : m.cumulativeImfPct,
      }))
      .sort((a, b) => b.value - a.value);
  }, [ladderMetric]);

  const compareBars = useMemo(
    () =>
      INSTITUTION_COMPARE.map((row) => ({
        ...row,
        value: row[compareMetric],
      })),
    [compareMetric],
  );

  const regionDonut = useMemo(
    () =>
      REGION_BUCKETS.map((r) => ({
        name: r.short,
        value: r.imfVotePct,
        fill: r.fill,
      })),
    [],
  );

  const scatterData = useMemo(() => {
    const rows =
      regionFilter === "all"
        ? GAP_SCATTER
        : GAP_SCATTER.filter((p) => p.region === regionFilter);
    return rows.map((p) => ({
      ...p,
      x: p.gdpPppPct,
      y: p.imfVotePct,
      z: Math.max(60, Math.abs(p.gapPp) * 18 + 40),
    }));
  }, [regionFilter]);

  const vetoStack = useMemo(
    () =>
      VETO_SERIES.map((y) => ({
        year: String(y.year),
        US: y.us,
        Russia: y.ru,
        China: y.cn,
        UK: y.uk,
        France: y.fr,
        total: y.total,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="geopolitics-institutions-concentration-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300/90">
          Institutions &amp; governance — concentration lens
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
          IMF Top-1 (US) holds{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.imfTop1SharePct)}
          </span>{" "}
          of voting power; Top-3 reaches{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.imfTop3SharePct)}
          </span>
          ; Top-5{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.imfTop5SharePct)}
          </span>
          . The same US share alone clears the{" "}
          {HEADLINE.imfBlockThresholdPct}% threshold that blocks{" "}
          {HEADLINE.imfSpecialMajorityPct}% special majorities. UNSC veto
          authority is 100% concentrated in five permanent members.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TOP_K_LADDER.slice(0, 3).map((row) => (
            <div
              key={row.k}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                IMF {row.label}
              </p>
              <p className="text-xl font-bold tabular-nums text-white">
                {fmtPct(row.imfSharePct)}
              </p>
              <p className="text-[11px] text-slate-400">{row.note}</p>
            </div>
          ))}
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              UNSC veto Top-5
            </p>
            <p className="text-xl font-bold tabular-nums text-white">
              {fmtPct(HEADLINE.unscVetoTop5SharePct, 0)}
            </p>
            <p className="text-[11px] text-slate-400">
              P5 = all negative authority
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "ladder", label: "Concentration ladder" },
            { id: "institutions", label: "Institutions" },
            { id: "regions", label: "Regions & gaps" },
            { id: "veto", label: "UNSC vetoes" },
          ]}
        />
        {view === "ladder" && (
          <>
            <ToggleGroup
              label="Metric"
              value={ladderMetric}
              onChange={setLadderMetric}
              options={[
                { id: "imfVotePct", label: "IMF vote %" },
                { id: "ibrdVotePct", label: "IBRD vote %" },
                { id: "cumulativeImfPct", label: "Cumulative %" },
              ]}
            />
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={showEqualLine}
                onChange={(e) => setShowEqualLine(e.target.checked)}
                className="rounded border-slate-300"
              />
              Equal-split line
            </label>
          </>
        )}
        {view === "institutions" && (
          <ToggleGroup
            label="Cut"
            value={compareMetric}
            onChange={setCompareMetric}
            options={[
              { id: "top1Pct", label: "Top-1" },
              { id: "top3Pct", label: "Top-3" },
              { id: "top5Pct", label: "Top-5" },
            ]}
          />
        )}
        {view === "regions" && (
          <ToggleGroup
            label="Region"
            value={regionFilter}
            onChange={setRegionFilter}
            options={[
              { id: "all", label: "All" },
              { id: "Americas", label: "Americas" },
              { id: "Europe", label: "Europe" },
              { id: "Asia-Pacific", label: "Asia-Pac" },
            ]}
          />
        )}
      </div>

      {view === "ladder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Cumulative share vs equal split"
            subtitle="IMF vote Lorenz among top-10 — equal-split assumes ten equal chairs"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={CONCENTRATION_CURVE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      fmtPct(Number(v)),
                      name === "cumulativeVotePct"
                        ? "Cumulative IMF vote"
                        : "Equal split",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativeVotePct"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.25}
                    name="cumulativeVotePct"
                  />
                  {showEqualLine && (
                    <Line
                      type="monotone"
                      dataKey="equalSplitPct"
                      stroke="#94a3b8"
                      strokeDasharray="4 4"
                      dot={false}
                      name="equalSplitPct"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Ranked vote shares"
            subtitle={
              ladderMetric === "imfVotePct"
                ? "IMF voting power by member"
                : ladderMetric === "ibrdVotePct"
                  ? "IBRD voting power by member"
                  : "Cumulative IMF vote from rank 1"
            }
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ladderBars} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
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
                    formatter={(v) => [fmtPct(Number(v)), "Share"]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.name ?? ""
                    }
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {ladderBars.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "institutions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Cross-institution Top-k share"
            subtitle="Same concentration cut across IMF, IBRD, and UNSC layers"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compareBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v)), "Share"]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.institution ?? ""
                    }
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {compareBars.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Who can block an 85% special majority"
            subtitle="Vote weight vs solo block threshold (15%)"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BLOCKING_POWER} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 22]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={110}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v)), "Vote weight"]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.note ?? ""
                    }
                  />
                  <Bar dataKey="votePct" radius={[0, 4, 4, 0]}>
                    {BLOCKING_POWER.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Crimson rule of thumb: anything ≥{HEADLINE.imfBlockThresholdPct}%
              can veto special majorities alone.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "regions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Regional IMF vote clusters"
            subtitle="Approximate vote share among tracked regional groupings"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionDonut}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {regionDonut.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, name) => [
                      fmtPct(Number(v)),
                      String(name),
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Vote share vs PPP GDP"
            subtitle="Above the diagonal = over-weighted vs economic size"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="GDP PPP %"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "PPP GDP %",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="IMF vote %"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "IMF vote %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => {
                      if (name === "x") return [fmtPct(Number(v)), "PPP GDP"];
                      if (name === "y") return [fmtPct(Number(v)), "IMF vote"];
                      return [String(v), String(name)];
                    }}
                    labelFormatter={(_, payload) => {
                      const p = payload?.[0]?.payload;
                      return p
                        ? `${p.name} (${fmtPp(p.gapPp)} gap)`
                        : "";
                    }}
                  />
                  <Scatter data={scatterData}>
                    {scatterData.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "veto" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="UNSC vetoes by permanent member"
            subtitle="Annual counts — negative authority concentrated in P5 practice"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vetoStack}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="Russia"
                    stackId="1"
                    stroke="#e11d48"
                    fill="#e11d48"
                    fillOpacity={0.85}
                  />
                  <Area
                    type="monotone"
                    dataKey="US"
                    stackId="1"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.85}
                  />
                  <Area
                    type="monotone"
                    dataKey="China"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.85}
                  />
                  <Area
                    type="monotone"
                    dataKey="UK"
                    stackId="1"
                    stroke="#64748b"
                    fill="#64748b"
                    fillOpacity={0.7}
                  />
                  <Area
                    type="monotone"
                    dataKey="France"
                    stackId="1"
                    stroke="#14b8a6"
                    fill="#14b8a6"
                    fillOpacity={0.7}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Authority layers at a glance"
            subtitle="Top-3 share by institution — same concentration meter"
          >
            <div className="space-y-3">
              {INSTITUTION_COMPARE.map((row) => (
                <div key={row.id}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-slate-800">
                      {row.short}
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-slate-900">
                      Top-3 {fmtPct(row.top3Pct, row.id === "unsc-veto" ? 0 : 1)}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, row.top3Pct)}%`,
                        backgroundColor: row.fill,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{row.powerNote}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
