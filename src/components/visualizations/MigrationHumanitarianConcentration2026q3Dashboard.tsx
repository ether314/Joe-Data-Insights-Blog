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
  DELTA_SCOREBOARD,
  DONOR_SHARES,
  HEAL_ATTRIBUTION,
  HEAL_SHARE_PIE,
  HEADLINE,
  HHI_BANDS,
  LENS_COMPARE,
  PLAN_LEVERAGE,
  ROLE_SCATTER,
  SCISSORS,
  SOURCE_NOTE,
  STICKINESS_PATH,
  UNHCR_TIP,
  VINTAGE_SLOPE,
  fmtBn,
  fmtHhi,
  fmtM,
  fmtPct,
  fmtPp,
  hhiBand,
  sharesForLens,
  type LensId,
} from "@/data/migration-humanitarian-concentration-2026q3-data";

// viz-types: Δ scoreboard bars, stickiness dual-line, heal waterfall+pie, HHI bars, scissors bars, UNHCR tip bars, plan leverage scatter, role scatter, vintage multi-line | layout: default

type ViewId = "scoreboard" | "stickiness" | "heal" | "agency" | "leverage";
type SlopeMetric = "donorTop1Pct" | "donorTop3Pct" | "hostTop3Pct" | "coveragePct";
type TipMetric = "top1" | "top3" | "hhi";

const SKY = "#0ea5e9";
const ROSE = "#f43f5e";
const AMBER = "#f59e0b";

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

export function MigrationHumanitarianConcentration2026q3Dashboard() {
  const [view, setView] = useState<ViewId>("scoreboard");
  const [tipMetric, setTipMetric] = useState<TipMetric>("top3");
  const [slopeMetric, setSlopeMetric] = useState<SlopeMetric>("coveragePct");
  const [lens, setLens] = useState<LensId>("donors");
  const [scatterMode, setScatterMode] = useState<"plans" | "roles">("plans");
  const [movedOnly, setMovedOnly] = useState(false);

  const scoreboardBars = useMemo(() => {
    const rows = movedOnly
      ? DELTA_SCOREBOARD.filter((r) => r.moved)
      : DELTA_SCOREBOARD;
    return rows.map((r) => ({
      ...r,
      name: r.meter,
      delta: r.deltaPp,
    }));
  }, [movedOnly]);

  const tipLadder = useMemo(() => {
    return [...LENS_COMPARE].sort((a, b) => {
      const av =
        tipMetric === "top1" ? a.top1Pct : tipMetric === "top3" ? a.top3Pct : a.hhi;
      const bv =
        tipMetric === "top1" ? b.top1Pct : tipMetric === "top3" ? b.top3Pct : b.hhi;
      return bv - av;
    });
  }, [tipMetric]);

  const tipValue = (row: (typeof tipLadder)[0]) =>
    tipMetric === "top1"
      ? row.top1Pct
      : tipMetric === "top3"
        ? row.top3Pct
        : row.hhi;

  const shareRows = useMemo(() => {
    return sharesForLens(lens).filter((r) => !r.id.startsWith("rest"));
  }, [lens]);

  const healWaterfall = useMemo(() => {
    let running = 0;
    return HEAL_ATTRIBUTION.map((step) => {
      if (step.kind === "base" || step.kind === "end") {
        running = step.value;
        return { ...step, name: step.label, display: step.value, base: 0 };
      }
      const base = step.value >= 0 ? running : running + step.value;
      const display = Math.abs(step.value);
      running += step.value;
      return { ...step, name: step.label, display, base };
    });
  }, []);

  const healPie = useMemo(
    () => HEAL_SHARE_PIE.filter((r) => r.sharePct > 0),
    [],
  );

  const planScatter = useMemo(
    () =>
      PLAN_LEVERAGE.map((r) => ({
        ...r,
        x: r.reqSharePct,
        y: r.coveragePct,
        z: Math.max(80, Math.sqrt(r.pinM) * 28),
      })),
    [],
  );

  const roleScatter = useMemo(
    () =>
      ROLE_SCATTER.map((r) => ({
        ...r,
        x: r.hostedM,
        y: r.donorSharePct,
        z: Math.max(70, (r.hostedM + 0.5) * 40 + r.donorSharePct * 2),
      })),
    [],
  );

  const tipLabel =
    tipMetric === "top1"
      ? "Top-1 share %"
      : tipMetric === "top3"
        ? "Top-3 share %"
        : "HHI";

  return (
    <div
      className="space-y-6"
      data-viz="migration-humanitarian-concentration-2026q3"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Migration &amp; humanitarian — Q3 concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Coverage +{HEADLINE.ghoCoverageDeltaPp} pp · FTS Top-1 still{" "}
          {HEADLINE.donorTop1Pct}%
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          May→Aug GHO coverage healed from{" "}
          <span className="text-amber-300">
            {HEADLINE.ghoCoverageMayPct}% → {HEADLINE.ghoCoverageAugPct}%
          </span>
          , but FTS Top-1 stayed at{" "}
          <span className="text-sky-300">~{HEADLINE.donorTop1Pct}%</span> and
          Top-3 at{" "}
          <span className="text-sky-300">~{HEADLINE.donorTop3Pct}%</span>. Host
          Top-3 (~{HEADLINE.hostTop3Pct}%) and LMIC hosting (~
          {HEADLINE.incomeLmicPct}%) did not move. The narrative meter changed;
          the tip did not.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Coverage Δ",
              value: fmtPp(HEADLINE.ghoCoverageDeltaPp, 0),
              sub: "May MYR → Aug FTS",
            },
            {
              label: "Donor Top-1 Δ",
              value: fmtPp(HEADLINE.donorTop1DeltaPp, 0),
              sub: `${HEADLINE.donorTop1Label} still ${fmtPct(HEADLINE.donorTop1Pct)}`,
            },
            {
              label: "Donor Top-3",
              value: fmtPct(HEADLINE.donorTop3Pct),
              sub: "Tip flat vs conc. print",
            },
            {
              label: "Heal Top-3 share",
              value: fmtPct(HEADLINE.healTop3SharePct, 0),
              sub: "of +16 pp (constructed)",
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-3"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums">{k.value}</p>
              <p className="mt-0.5 text-xs text-slate-400">{k.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={view}
          options={[
            { id: "scoreboard", label: "Δ scoreboard" },
            { id: "stickiness", label: "Tip stickiness" },
            { id: "heal", label: "Heal attribution" },
            { id: "agency", label: "Agency tip" },
            { id: "leverage", label: "Plan leverage" },
          ]}
          onChange={setView}
        />
        <div className="flex flex-wrap items-center gap-3">
          {(view === "scoreboard" || view === "stickiness") && (
            <ToggleGroup
              label="Tip metric"
              value={tipMetric}
              options={[
                { id: "top1", label: "Top-1" },
                { id: "top3", label: "Top-3" },
                { id: "hhi", label: "HHI" },
              ]}
              onChange={setTipMetric}
            />
          )}
          {view === "stickiness" && (
            <ToggleGroup
              label="Slope"
              value={slopeMetric}
              options={[
                { id: "coveragePct", label: "Coverage" },
                { id: "donorTop1Pct", label: "Donor Top-1" },
                { id: "donorTop3Pct", label: "Donor Top-3" },
                { id: "hostTop3Pct", label: "Host Top-3" },
              ]}
              onChange={setSlopeMetric}
            />
          )}
          {view === "scoreboard" && (
            <ToggleGroup
              label="Filter"
              value={movedOnly ? "moved" : "all"}
              options={[
                { id: "all", label: "All meters" },
                { id: "moved", label: "Moved only" },
              ]}
              onChange={(v) => setMovedOnly(v === "moved")}
            />
          )}
          {view === "heal" && (
            <ToggleGroup
              label="Lens"
              value={lens}
              options={[
                { id: "donors", label: "Donors" },
                { id: "hosts", label: "Hosts" },
                { id: "appeals", label: "Appeals" },
                { id: "income", label: "Income" },
              ]}
              onChange={setLens}
            />
          )}
          {view === "leverage" && (
            <ToggleGroup
              label="Scatter"
              value={scatterMode}
              options={[
                { id: "plans", label: "Plans" },
                { id: "roles", label: "Host/donor roles" },
              ]}
              onChange={setScatterMode}
            />
          )}
        </div>
      </div>

      {view === "scoreboard" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="What moved vs what stuck"
            subtitle="Δ pp from May / prior framing · coverage healed; tips flat"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={scoreboardBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    domain={[-25, 20]}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={140}
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(v) => fmtPp(Number(v ?? 0))}
                    labelFormatter={(l) => String(l)}
                  />
                  <Bar dataKey="delta" radius={[0, 4, 4, 0]}>
                    {scoreboardBars.map((r) => (
                      <Cell key={r.meter} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title={`${tipLabel} across burden lenses`}
            subtitle="Four systems · sorted descending · not one shared denominator"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={tipLadder.map((r) => ({
                    ...r,
                    value: tipValue(r),
                    name: r.label,
                  }))}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    domain={tipMetric === "hhi" ? [0, "auto"] : [0, 100]}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={130}
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      tipMetric === "hhi"
                        ? fmtHhi(Number(v ?? 0))
                        : fmtPct(Number(v ?? 0))
                    }
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {tipLadder.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "stickiness" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Coverage rises; tip lines stay flat"
            subtitle="May MYR → Aug FTS dual path · narrative vs cash/people tips"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={STICKINESS_PATH}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#334155" }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    domain={[0, 80]}
                    unit="%"
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                  <Line
                    type="monotone"
                    dataKey="coveragePct"
                    name="GHO coverage"
                    stroke={AMBER}
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="donorTop1Pct"
                    name="FTS Top-1"
                    stroke={SKY}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="donorTop3Pct"
                    name="FTS Top-3"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    strokeDasharray="2 4"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="hostTop3Pct"
                    name="Host Top-3"
                    stroke={ROSE}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lmicPct"
                    name="LMIC hosts"
                    stroke="#fb7185"
                    strokeWidth={2}
                    strokeDasharray="6 3"
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Vintage slope"
            subtitle="Research → concentration print → Q3/Aug · pick a meter"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={VINTAGE_SLOPE}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="vintage"
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    domain={[0, 80]}
                    unit="%"
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                  <Area
                    type="monotone"
                    dataKey={slopeMetric}
                    fill={slopeMetric === "coveragePct" ? "#fef3c7" : "#e0f2fe"}
                    stroke={slopeMetric === "coveragePct" ? AMBER : SKY}
                    strokeWidth={3}
                    name={slopeMetric}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Burden scissors"
            subtitle="Cash tip · people tip · narrative meters on one ladder"
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={SCISSORS}
                  margin={{ top: 8, right: 16, left: 8, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "#334155" }}
                    angle={-28}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    domain={[0, 80]}
                    unit="%"
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {SCISSORS.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="HHI by lens"
            subtitle={`Analytical 0–10,000 · income groups ${hhiBand(HEADLINE.incomeHhi)} · hosts ${hhiBand(HEADLINE.hostHhi)}`}
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={HHI_BANDS}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip formatter={(v) => fmtHhi(Number(v ?? 0))} />
                  <Bar dataKey="hhi" radius={[4, 4, 0, 0]}>
                    {HHI_BANDS.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "heal" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Who paid the +16 pp heal"
            subtitle="Constructed waterfall · not an official FTS attribution table"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={healWaterfall}
                  margin={{ top: 8, right: 16, left: 8, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#334155" }}
                    angle={-24}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    domain={[0, 45]}
                    unit="%"
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                  <Bar dataKey="base" stackId="a" fill="transparent" />
                  <Bar dataKey="display" stackId="a" radius={[4, 4, 0, 0]}>
                    {healWaterfall.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Heal share of +16 pp"
            subtitle={`Top-3 donor clusters ~${HEADLINE.healTop3SharePct}% of the heal (constructed)`}
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healPie}
                    dataKey="sharePct"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {healPie.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0), 0)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
              {healPie.map((r) => (
                <li key={r.id} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: r.fill }}
                  />
                  {r.label} ({fmtPct(r.sharePct, 0)})
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title={`Share ladder — ${LENS_COMPARE.find((l) => l.id === lens)?.label ?? lens}`}
            subtitle="Named buckets only · residual omitted for tip readability"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={shareRows}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    domain={[0, "auto"]}
                    unit="%"
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={90}
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(v) => fmtPct(Number(v ?? 0))}
                    labelFormatter={(l) => String(l)}
                  />
                  <Bar dataKey="sharePct" radius={[0, 4, 4, 0]}>
                    {shareRows.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Donor concentration curve"
            subtitle="Cumulative FTS share by rank · oligopoly tip, long residual"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={[
                    { rank: 0, sharePct: 0, equalPct: 0, label: "0" },
                    ...DONOR_SHARES.filter((d) => !d.id.startsWith("rest")).map(
                      (d, i) => ({
                        rank: i + 1,
                        sharePct: d.cumulativeSharePct,
                        equalPct: ((i + 1) / 10) * 100,
                        label: d.short,
                      }),
                    ),
                    { rank: 11, sharePct: 100, equalPct: 100, label: "All" },
                  ]}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
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
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    domain={[0, 100]}
                    unit="%"
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                  <Area
                    type="monotone"
                    dataKey="sharePct"
                    fill="#e0f2fe"
                    stroke={SKY}
                    strokeWidth={3}
                    name="Cumulative share"
                  />
                  <Line
                    type="monotone"
                    dataKey="equalPct"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    name="Equal-share ref"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "agency" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="UNHCR agency tip"
            subtitle="Budget strip-back −19.8% · early pledge 18% · 11.6M at risk"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...UNHCR_TIP]}
                  margin={{ top: 8, right: 16, left: 8, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "#334155" }}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip
                    formatter={(v, _n, item) => {
                      const unit = (item?.payload as { unit?: string })?.unit;
                      if (unit === "bn") return fmtBn(Number(v ?? 0));
                      if (unit === "m") return fmtM(Number(v ?? 0));
                      return fmtPct(Number(v ?? 0), 0);
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {UNHCR_TIP.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Agency scarcity vs GHO gap"
            subtitle="Early pledge thinness beside a still-open ~$21B GHO gap"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      name: "GHO coverage",
                      value: HEADLINE.ghoCoverageAugPct,
                      fill: AMBER,
                    },
                    {
                      name: "UNHCR early pledge",
                      value: HEADLINE.unhcrEarlyPledgePct,
                      fill: "#a78bfa",
                    },
                    {
                      name: "FTS Top-1",
                      value: HEADLINE.donorTop1Pct,
                      fill: SKY,
                    },
                    {
                      name: "Host Top-3",
                      value: HEADLINE.hostTop3Pct,
                      fill: ROSE,
                    },
                  ]}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 50]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={130}
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {[AMBER, "#a78bfa", SKY, ROSE].map((c, i) => (
                      <Cell key={i} fill={c} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Gap still ~{fmtBn(HEADLINE.ghoGapAugBn, 1)} after the heal.
              Early-pledge thinness (−{Math.abs(HEADLINE.unhcrEarlyDeltaPp)} pp
              vs 2025 year-end funded) is a second tip: agency cash arrives later
              and thinner even while GHO coverage narratives look healthier.
            </p>
          </ChartCard>
        </div>
      )}

      {view === "leverage" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {scatterMode === "plans" ? (
            <ChartCard
              title="Plan leverage: ask share × coverage"
              subtitle="Bubble size ∝ people in need · large asks can still sit thin on cash"
            >
              <div className="h-[360px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name="Req share %"
                      unit="%"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      domain={[0, 14]}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="Coverage %"
                      unit="%"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      domain={[20, 65]}
                    />
                    <ZAxis type="number" dataKey="z" range={[80, 400]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      formatter={(v, name) =>
                        name === "z"
                          ? String(v)
                          : fmtPct(Number(v ?? 0))
                      }
                      labelFormatter={() => ""}
                      content={({ payload }) => {
                        const p = payload?.[0]?.payload as
                          | (typeof planScatter)[0]
                          | undefined;
                        if (!p) return null;
                        return (
                          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
                            <p className="font-semibold text-slate-900">
                              {p.short}
                            </p>
                            <p>Req share {fmtPct(p.reqSharePct)}</p>
                            <p>Coverage {fmtPct(p.coveragePct)}</p>
                            <p>PIN ~{fmtM(p.pinM)}</p>
                          </div>
                        );
                      }}
                    />
                    <Scatter data={planScatter}>
                      {planScatter.map((r) => (
                        <Cell key={r.id} fill={r.fill} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          ) : (
            <ChartCard
              title="Host vs donor roles"
              subtitle="People hosted (M) × FTS donor share % · few capitals do both"
            >
              <div className="h-[360px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name="Hosted M"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      domain={[0, 3.2]}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="Donor %"
                      unit="%"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      domain={[0, 26]}
                    />
                    <ZAxis type="number" dataKey="z" range={[70, 350]} />
                    <Tooltip
                      content={({ payload }) => {
                        const p = payload?.[0]?.payload as
                          | (typeof roleScatter)[0]
                          | undefined;
                        if (!p) return null;
                        return (
                          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
                            <p className="font-semibold text-slate-900">
                              {p.short}
                            </p>
                            <p>Hosted {fmtM(p.hostedM)}</p>
                            <p>Donor share {fmtPct(p.donorSharePct)}</p>
                            <p className="capitalize">{p.role}</p>
                          </div>
                        );
                      }}
                    />
                    <Scatter data={roleScatter}>
                      {roleScatter.map((r) => (
                        <Cell key={r.id} fill={r.fill} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          )}

          <ChartCard
            title="Q3 concentration read"
            subtitle="Same tip geometry as the 2026 print — under a healed coverage narrative"
          >
            <div className="space-y-3 text-sm leading-relaxed text-slate-700">
              <p>
                Tracked FTS Top-1 remains{" "}
                <strong>{fmtPct(HEADLINE.donorTop1Pct)}</strong> (
                {HEADLINE.donorTop1Label}) and Top-3{" "}
                <strong>{fmtPct(HEADLINE.donorTop3Pct)}</strong> of ~
                {fmtBn(HEADLINE.donorTrackedBn, 1)} tracked — Δ{" "}
                {fmtPp(HEADLINE.donorTop1DeltaPp, 0)} versus the concentration
                print.
              </p>
              <p>
                Host country Top-3 stays near{" "}
                <strong>{fmtPct(HEADLINE.hostTop3Pct)}</strong>; LMIC hosts still
                carry <strong>{fmtPct(HEADLINE.incomeLmicPct, 0)}</strong> of
                refugees. Coverage can heal on a concentrated donor ladder
                without redistributing who bears people costs.
              </p>
              <p>
                Constructed heal attribution puts roughly{" "}
                <strong>{fmtPct(HEADLINE.healTop3SharePct, 0)}</strong> of the
                +{HEADLINE.ghoCoverageDeltaPp} pp May→Aug lift on Top-3-scale
                donor clusters — oligopoly cash paid for a narrative meter that
                still leaves a ~{fmtBn(HEADLINE.ghoGapAugBn, 1)} gap.
              </p>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
