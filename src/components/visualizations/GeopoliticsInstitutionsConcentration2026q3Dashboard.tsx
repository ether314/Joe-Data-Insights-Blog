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
  CONCENTRATION_DELTAS,
  CONSENT_METERS,
  CONSENT_PATH,
  GAP_SCATTER,
  HEADLINE,
  HHI_BY_LENS,
  INSTITUTION_COMPARE,
  REGION_BUCKETS,
  SCOREBOARD,
  SOURCE_NOTE,
  TOP_K_LADDER,
  VETO_SERIES,
  VOTE_SHARES,
  fmtPct,
  fmtPp,
  fmtHhi,
} from "@/data/geopolitics-institutions-concentration-2026q3-data";

// viz-types: HHI bars, delta dumbbells, Lorenz area+line, ranked share bars, consent path lines, institution compare bars, region donut, veto stacked area, vote×GDP scatter, blocking bars | layout: default

type ViewId = "scoreboard" | "ladder" | "consent" | "power";
type LadderMetric = "imfVotePct" | "ibrdVotePct" | "cumulativeImfPct";
type CompareMetric = "top1Pct" | "top3Pct" | "top5Pct" | "hhiProxy";

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

export function GeopoliticsInstitutionsConcentration2026q3Dashboard() {
  const [view, setView] = useState<ViewId>("scoreboard");
  const [ladderMetric, setLadderMetric] =
    useState<LadderMetric>("imfVotePct");
  const [compareMetric, setCompareMetric] =
    useState<CompareMetric>("top3Pct");
  const [showEqualLine, setShowEqualLine] = useState(true);
  const [regionFilter, setRegionFilter] = useState<
    "all" | "Americas" | "Europe" | "Asia-Pacific"
  >("all");
  const [pathMetric, setPathMetric] = useState<"quota" | "nab">("quota");

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

  const hhiBars = useMemo(
    () => [...HHI_BY_LENS].sort((a, b) => b.hhi - a.hhi),
    [],
  );

  const deltaBars = useMemo(
    () =>
      CONCENTRATION_DELTAS.map((d) => ({
        ...d,
        low: Math.min(d.prior, d.current),
        high: Math.max(d.prior, d.current),
        span: Math.abs(d.current - d.prior),
      })),
    [],
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
      z: Math.max(60, Math.abs(p.gapPp) * 12),
    }));
  }, [regionFilter]);

  const pathData = useMemo(
    () =>
      CONSENT_PATH.map((p) => ({
        ...p,
        value: pathMetric === "quota" ? p.quotaPct : p.nabPct,
        gate: pathMetric === "quota" ? 85 : 90,
      })),
    [pathMetric],
  );

  const consentGapBars = useMemo(
    () =>
      CONSENT_METERS.map((m) => ({
        name: m.short,
        consented: m.consentedPct,
        gap: Math.abs(m.gapPp),
        threshold: m.thresholdPct,
        fill: m.fill,
      })),
    [],
  );

  const topKBars = useMemo(
    () =>
      TOP_K_LADDER.map((r) => ({
        ...r,
        value: r.imfSharePct,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="geopolitics-institutions-concentration-2026q3"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">
          Institutions &amp; governance — Q3 2026 concentration lens
        </p>
        <p className="mt-2 text-lg font-bold leading-snug sm:text-xl">
          IMF Top-1 still {fmtPct(HEADLINE.imfTop1Pct)} / Top-3{" "}
          {fmtPct(HEADLINE.imfTop3Pct)} — shares frozen while quota consent
          climbs to {fmtPct(HEADLINE.quotaConsentPct)} (
          {fmtPp(HEADLINE.quotaDeltaPp)})
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          The tip did not move. The gate did. US alone remains above the{" "}
          {HEADLINE.imfBlockThresholdPct}% special-majority block line — and is
          still the pivotal 16th GRQ consent holdout ahead of the{" "}
          {HEADLINE.consentDeadline} effectiveness deadline.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "scoreboard", label: "Scoreboard" },
            { id: "ladder", label: "Vote ladder" },
            { id: "consent", label: "Consent gate" },
            { id: "power", label: "Block & veto" },
          ]}
        />
      </div>

      {view === "scoreboard" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Cross-perimeter HHI map"
            subtitle="Analytical concentration proxies — veto equality vs continuous vote weights"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hhiBars} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={56}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtHhi(Number(v)), "HHI"]}
                    labelFormatter={(label) => {
                      const row = hhiBars.find((r) => r.short === label);
                      return row?.label ?? String(label);
                    }}
                  />
                  <Bar dataKey="hhi" radius={[0, 4, 4, 0]}>
                    {hhiBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Prior → Q3 concentration deltas"
            subtitle="Vote tip frozen at 0 pp; consent meters move toward the gate"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deltaBars} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={120}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      typeof v === "number" ? v.toFixed(2) : String(v),
                      String(name),
                    ]}
                  />
                  <Bar dataKey="prior" fill="#94a3b8" name="Prior" radius={[0, 2, 2, 0]} />
                  <Bar dataKey="current" name="Q3" radius={[0, 2, 2, 0]}>
                    {deltaBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Q3 scoreboard — Top-1 / Top-3"
            subtitle="Four perimeters; do not average into one concentration index"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[28rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="py-2 pr-3">Perimeter</th>
                    <th className="py-2 pr-3">Top-1</th>
                    <th className="py-2 pr-3">Top-3</th>
                    <th className="py-2">Extra</th>
                  </tr>
                </thead>
                <tbody>
                  {SCOREBOARD.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100">
                      <td className="py-2.5 pr-3 font-medium text-slate-800">
                        <span
                          className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                          style={{ background: row.color }}
                        />
                        {row.label}
                      </td>
                      <td className="py-2.5 pr-3 text-slate-700">
                        {fmtPct(row.top1Pct)} · {row.top1Label}
                      </td>
                      <td className="py-2.5 pr-3 text-slate-700">
                        {fmtPct(row.top3Pct)}
                      </td>
                      <td className="py-2.5 text-slate-500">
                        {row.extraMetric}: {row.extraValue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>

          <ChartCard
            title="Institutions Top-k compare"
            subtitle="Toggle Top-1 / Top-3 / Top-5 / HHI proxy"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Cut"
                value={compareMetric}
                onChange={setCompareMetric}
                options={[
                  { id: "top1Pct", label: "Top-1" },
                  { id: "top3Pct", label: "Top-3" },
                  { id: "top5Pct", label: "Top-5" },
                  { id: "hhiProxy", label: "HHI" },
                ]}
              />
            </div>
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compareBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) => [
                      compareMetric === "hhiProxy"
                        ? fmtHhi(Number(v))
                        : fmtPct(Number(v)),
                      compareMetric === "hhiProxy" ? "HHI" : "Share",
                    ]}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {compareBars.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "ladder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Lorenz-style cumulative IMF votes"
            subtitle="Top-10 cumulative vs equal-split diagonal across ten chairs"
          >
            <div className="mb-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowEqualLine((v) => !v)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  showEqualLine
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 text-slate-600"
                }`}
              >
                Equal-split line
              </button>
            </div>
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
                    formatter={(v) => [fmtPct(Number(v)), ""]}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativeVotePct"
                    fill="#0ea5e933"
                    stroke="#0ea5e9"
                    name="Cumulative IMF %"
                  />
                  {showEqualLine && (
                    <Line
                      type="monotone"
                      dataKey="equalSplitPct"
                      stroke="#94a3b8"
                      strokeDasharray="4 4"
                      dot={false}
                      name="Equal split"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Ranked member shares"
            subtitle="IMF / IBRD / cumulative — consent flag on major chairs"
          >
            <div className="mb-3">
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
            </div>
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ladderBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v)), "Share"]}
                    labelFormatter={(l) => {
                      const row = VOTE_SHARES.find((m) => m.short === l);
                      const flag =
                        row?.consented16th === false
                          ? " · NOT consented"
                          : row?.consented16th === true
                            ? " · consented"
                            : "";
                      return `${l}${flag}`;
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {ladderBars.map((r) => (
                      <Cell
                        key={r.id}
                        fill={
                          r.consented16th === false ? "#f43f5e" : r.fill
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Top-k IMF ladder"
            subtitle="Top-1 clears the 15% block line; Top-5 only reaches 40%"
          >
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topKBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 60]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [fmtPct(Number(v)), "IMF share"]} />
                  <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Regions & representation gaps"
            subtitle="Vote weight donut + vote×GDP scatter"
          >
            <div className="mb-3">
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
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-56 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionDonut}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                    >
                      {regionDonut.map((r) => (
                        <Cell key={r.name} fill={r.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [fmtPct(Number(v)), "IMF vote"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-56 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ left: 4, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name="GDP PPP %"
                      tick={{ fontSize: 10 }}
                      unit="%"
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="IMF %"
                      tick={{ fontSize: 10 }}
                      unit="%"
                    />
                    <ZAxis type="number" dataKey="z" range={[40, 200]} />
                    <Tooltip
                      formatter={(v, name) => [
                        fmtPct(Number(v)),
                        name === "x" ? "GDP PPP" : name === "y" ? "IMF vote" : "",
                      ]}
                      labelFormatter={(label) => String(label ?? "")}
                    />
                    <Scatter data={scatterData}>
                      {scatterData.map((p) => (
                        <Cell key={p.id} fill={p.fill} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "consent" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Consent path to the November gate"
            subtitle="Quota climbed +3.88 pp; NAB flat — threshold lines held"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Track"
                value={pathMetric}
                onChange={setPathMetric}
                options={[
                  { id: "quota", label: "Quota (→85%)" },
                  { id: "nab", label: "NAB (→90%)" },
                ]}
              />
            </div>
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={pathData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[70, 95]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip formatter={(v) => [fmtPct(Number(v), 2), ""]} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={pathMetric === "quota" ? "#f59e0b" : "#0ea5e9"}
                    strokeWidth={2.5}
                    name="Consented %"
                  />
                  <Line
                    type="monotone"
                    dataKey="gate"
                    stroke="#f43f5e"
                    strokeDasharray="5 5"
                    dot={false}
                    name="Threshold"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Residual gap to effectiveness"
            subtitle={`Quota gap ${HEADLINE.quotaGapPp} pp · NAB gap ${HEADLINE.nabGapPp} pp`}
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consentGapBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v, name) => [
                      fmtPct(Number(v), 2),
                      String(name),
                    ]}
                  />
                  <Bar
                    dataKey="consented"
                    name="Consented %"
                    radius={[4, 4, 0, 0]}
                  >
                    {consentGapBars.map((r) => (
                      <Cell key={r.name} fill={r.fill} />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="gap"
                    name="|Gap| pp"
                    fill="#94a3b8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Why concentration and consent couple"
            subtitle="Top-1 vote weight = pivotal holdout arithmetic"
          >
            <ul className="space-y-3 text-sm text-slate-700">
              <li>
                <span className="font-semibold text-slate-900">Frozen tip:</span>{" "}
                IMF Top-1 / Top-3 still {fmtPct(HEADLINE.imfTop1Pct)} /{" "}
                {fmtPct(HEADLINE.imfTop3Pct)} — relative shares did not move in
                Q3.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Moving gate:</span>{" "}
                Quota consents {fmtPct(HEADLINE.priorQuotaConsentPct, 2)} →{" "}
                {fmtPct(HEADLINE.quotaConsentPct, 2)} (
                {fmtPp(HEADLINE.quotaDeltaPp)}); residual to 85% narrowed to{" "}
                {HEADLINE.quotaGapPp} pp.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Pivot:</span> The
                sole shareholder above the {HEADLINE.imfBlockThresholdPct}% block
                line (US) has not consented; China has. Concentration without
                consent still blocks effectiveness.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Deadline:</span>{" "}
                Board-extended consent window runs to {HEADLINE.consentDeadline}.
              </li>
            </ul>
          </ChartCard>

          <ChartCard
            title="Member consent flags on the tip"
            subtitle="Red = disclosed non-consent among top-10 majors"
          >
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={VOTE_SHARES.map((m) => ({
                    short: m.short,
                    vote: m.imfVotePct,
                    fill:
                      m.consented16th === false
                        ? "#f43f5e"
                        : m.consented16th === true
                          ? "#14b8a6"
                          : "#94a3b8",
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [fmtPct(Number(v)), "IMF vote"]} />
                  <Bar dataKey="vote" radius={[4, 4, 0, 0]}>
                    {VOTE_SHARES.map((m) => (
                      <Cell
                        key={m.id}
                        fill={
                          m.consented16th === false
                            ? "#f43f5e"
                            : m.consented16th === true
                              ? "#14b8a6"
                              : "#94a3b8"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "power" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Who can block an 85% special majority"
            subtitle="Solo vs coalition arithmetic under the Fund’s hardest rule"
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
                    dataKey="short"
                    width={48}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v)), "Vote weight"]}
                    labelFormatter={(label) => {
                      const row = BLOCKING_POWER.find((r) => r.short === label);
                      return row?.label ?? String(label);
                    }}
                  />
                  <Bar dataKey="votePct" radius={[0, 4, 4, 0]}>
                    {BLOCKING_POWER.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Dashed mental line at {HEADLINE.imfBlockThresholdPct}% — only US
              and the EU-5 cluster clear it alone in this panel.
            </p>
          </ChartCard>

          <ChartCard
            title="UNSC veto use (practice concentration)"
            subtitle="Charter already concentrates 100% of vetoes in five seats"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={VETO_SERIES}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="ru"
                    stackId="v"
                    fill="#e11d48"
                    stroke="#e11d48"
                    name="Russia"
                  />
                  <Area
                    type="monotone"
                    dataKey="us"
                    stackId="v"
                    fill="#0ea5e9"
                    stroke="#0ea5e9"
                    name="US"
                  />
                  <Area
                    type="monotone"
                    dataKey="cn"
                    stackId="v"
                    fill="#f59e0b"
                    stroke="#f59e0b"
                    name="China"
                  />
                  <Area
                    type="monotone"
                    dataKey="uk"
                    stackId="v"
                    fill="#64748b"
                    stroke="#64748b"
                    name="UK"
                  />
                  <Area
                    type="monotone"
                    dataKey="fr"
                    stackId="v"
                    fill="#14b8a6"
                    stroke="#14b8a6"
                    name="France"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Seat share vs veto share"
            subtitle="P5 are 33% of seats and 100% of negative rights"
          >
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      label: "P5 seat share",
                      value: HEADLINE.unscSeatSharePct,
                      fill: "#8b5cf6",
                    },
                    {
                      label: "P5 veto share",
                      value: HEADLINE.unscVetoTop5Pct,
                      fill: "#f43f5e",
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [fmtPct(Number(v)), "Share"]} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    <Cell fill="#8b5cf6" />
                    <Cell fill="#f43f5e" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Coalition notes"
            subtitle="Consent status among blocking clusters"
          >
            <ul className="space-y-2 text-sm text-slate-700">
              {BLOCKING_POWER.map((b) => (
                <li key={b.id} className="flex gap-2">
                  <span
                    className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: b.fill }}
                  />
                  <span>
                    <span className="font-semibold text-slate-900">
                      {b.label}
                    </span>{" "}
                    ({fmtPct(b.votePct)})
                    {b.canBlockAlone ? " — can block alone" : " — needs partners"}
                    . {b.note}
                  </span>
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
