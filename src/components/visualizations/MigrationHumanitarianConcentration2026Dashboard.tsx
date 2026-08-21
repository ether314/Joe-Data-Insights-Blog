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
  APPEAL_SHARES,
  BURDEN_ASYMMETRY,
  HEADLINE,
  HHI_BANDS,
  INCOME_SHARES,
  LENS_COMPARE,
  PLAN_LEVERAGE,
  ROLE_SCATTER,
  SOURCE_NOTE,
  curveForLens,
  fmtBn,
  fmtHhi,
  fmtM,
  fmtPct,
  hhiBand,
  sharesForLens,
  type LensId,
} from "@/data/migration-humanitarian-concentration-2026-data";

// viz-types: Lens ladder bars, Lorenz area+line, burden asymmetry bars, HHI donut, plan leverage scatter, host-donor role scatter | layout: default

type ViewId = "ladder" | "curve" | "burden" | "leverage";
type Metric = "top1" | "top3" | "hhi";

const SKY = "#0ea5e9";
const ROSE = "#f43f5e";
const AMBER = "#f59e0b";
const SLATE = "#64748b";

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

export function MigrationHumanitarianConcentration2026Dashboard() {
  const [view, setView] = useState<ViewId>("ladder");
  const [metric, setMetric] = useState<Metric>("top3");
  const [lens, setLens] = useState<LensId>("donors");
  const [showEqual, setShowEqual] = useState(true);
  const [scatterMode, setScatterMode] = useState<"plans" | "roles">("plans");

  const ladderBars = useMemo(() => {
    return [...LENS_COMPARE].sort((a, b) => {
      const av =
        metric === "top1" ? a.top1Pct : metric === "top3" ? a.top3Pct : a.hhi;
      const bv =
        metric === "top1" ? b.top1Pct : metric === "top3" ? b.top3Pct : b.hhi;
      return bv - av;
    });
  }, [metric]);

  const shareRows = useMemo(() => {
    const rows = sharesForLens(lens);
    return rows.filter((r) => !r.id.startsWith("rest") && r.id !== "residual");
  }, [lens]);

  const curve = useMemo(() => curveForLens(lens), [lens]);

  const hhiDonut = useMemo(() => {
    const counts = { Unconcentrated: 0, Moderate: 0, High: 0 };
    for (const row of LENS_COMPARE) {
      counts[hhiBand(row.hhi).band as keyof typeof counts] += 1;
    }
    return HHI_BANDS.map((b) => ({
      ...b,
      label: b.band,
      count: counts[b.band as keyof typeof counts] ?? 0,
    })).filter((b) => b.count > 0);
  }, []);

  const asymmetryBars = useMemo(
    () =>
      BURDEN_ASYMMETRY.filter((r) => r.unit === "pct").map((r) => ({
        name: r.meter,
        value: r.value,
        fill: r.fill,
        side: r.side,
      })),
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

  const metricLabel =
    metric === "top1"
      ? "Top-1 share %"
      : metric === "top3"
        ? "Top-3 share %"
        : "HHI";

  const metricValue = (row: (typeof ladderBars)[0]) =>
    metric === "top1"
      ? row.top1Pct
      : metric === "top3"
        ? row.top3Pct
        : row.hhi;

  const lensTitle =
    LENS_COMPARE.find((l) => l.lens === lens)?.label ?? "Selected lens";

  return (
    <div
      className="space-y-6"
      data-viz="migration-humanitarian-concentration-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Migration &amp; humanitarian — concentration lens
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          FTS Top-1 {HEADLINE.donorTop1Pct}% · Top-3 {HEADLINE.donorTop3Pct}%
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          On tracked 2026 FTS cash, the United States alone is{" "}
          <span className="text-sky-300">~{HEADLINE.donorTop1Pct}%</span> and
          the top three clear{" "}
          <span className="text-amber-300">~{HEADLINE.donorTop3Pct}%</span>.
          Refugee hosts look different: Colombia is only ~{HEADLINE.hostTop1Pct}
          % of the host universe, yet LMIC countries still hold{" "}
          <span className="text-rose-300">~{HEADLINE.incomeLmicPct}%</span> of
          refugees — while GHO coverage narratives sit at{" "}
          {HEADLINE.ghoCoveragePct}% with a ~{fmtBn(HEADLINE.ghoGapBn, 1)} gap.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Donor Top-1",
              value: fmtPct(HEADLINE.donorTop1Pct),
              sub: HEADLINE.donorTop1Label,
            },
            {
              label: "Donor Top-3",
              value: fmtPct(HEADLINE.donorTop3Pct),
              sub: fmtBn(HEADLINE.donorTop3Bn),
            },
            {
              label: "Host Top-3",
              value: fmtPct(HEADLINE.hostTop3Pct),
              sub: "Colombia · DE · Türkiye",
            },
            {
              label: "LMIC host share",
              value: fmtPct(HEADLINE.incomeLmicPct, 0),
              sub: "People stock, not cash",
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
            { id: "ladder", label: "Lens ladder" },
            { id: "curve", label: "Concentration curve" },
            { id: "burden", label: "Burden split" },
            { id: "leverage", label: "Plan leverage" },
          ]}
          onChange={setView}
        />
        <div className="flex flex-wrap items-center gap-3">
          <ToggleGroup
            label="Metric"
            value={metric}
            options={[
              { id: "top1", label: "Top-1" },
              { id: "top3", label: "Top-3" },
              { id: "hhi", label: "HHI" },
            ]}
            onChange={setMetric}
          />
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
        </div>
      </div>

      {view === "ladder" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={`${metricLabel} across burden lenses`}
            subtitle="Four systems · sorted descending · not one shared denominator"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ladderBars.map((r) => ({
                    ...r,
                    value: metricValue(r),
                    name: r.label,
                  }))}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    domain={metric === "hhi" ? [0, "auto"] : [0, 100]}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={130}
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      metric === "hhi"
                        ? fmtHhi(Number(v ?? 0))
                        : fmtPct(Number(v ?? 0))
                    }
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {ladderBars.map((r) => (
                      <Cell key={r.lens} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="HHI band mix"
            subtitle="How many of the four lenses sit in each concentration band"
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hhiDonut}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {hhiDonut.map((b) => (
                      <Cell key={b.band} fill={b.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
              {hhiDonut.map((b) => (
                <li key={b.band} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: b.fill }}
                  />
                  {b.band}: {b.count}
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard
            title={`${lensTitle} — ranked shares`}
            subtitle="Toggle Lens above · residual omitted for readability"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={shareRows.map((r) => ({
                    name: r.short,
                    share: r.sharePct,
                    fill: r.fill,
                  }))}
                  margin={{ top: 8, right: 12, left: 0, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    angle={-28}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    domain={[0, "auto"]}
                    unit="%"
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                  <Bar dataKey="share" radius={[4, 4, 0, 0]}>
                    {shareRows.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Appeal ask spine (Top plans)"
            subtitle="Share of $34.87B GHO requirements — estimated plan geometry"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={APPEAL_SHARES.filter((r) => r.id !== "rest-appeals").map(
                    (r) => ({
                      name: r.short,
                      share: r.sharePct,
                      fill: r.fill,
                    }),
                  )}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={90}
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                  <Bar dataKey="share" radius={[0, 4, 4, 0]}>
                    {APPEAL_SHARES.filter((r) => r.id !== "rest-appeals").map(
                      (r) => (
                        <Cell key={r.id} fill={r.fill} />
                      ),
                    )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "curve" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={`${lensTitle} concentration curve`}
            subtitle="Cumulative top-k share vs equal-share reference"
          >
            <div className="mb-3">
              <ToggleGroup
                label="Equal line"
                value={showEqual ? "on" : "off"}
                options={[
                  { id: "on", label: "Show" },
                  { id: "off", label: "Hide" },
                ]}
                onChange={(v) => setShowEqual(v === "on")}
              />
            </div>
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={curve}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                  <Area
                    type="monotone"
                    dataKey="sharePct"
                    fill={`${SKY}33`}
                    stroke={SKY}
                    strokeWidth={2}
                    name="Cumulative share"
                  />
                  {showEqual && (
                    <Line
                      type="monotone"
                      dataKey="equalPct"
                      stroke={SLATE}
                      strokeDasharray="4 4"
                      dot={false}
                      name="Equal share"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Host income-group composition"
            subtitle="Carried Global Trends 2025 — people stock, not FTS cash"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={INCOME_SHARES.filter((r) => r.id !== "residual")}
                    dataKey="sharePct"
                    nameKey="short"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={(props) => {
                      const name = String(props.name ?? "");
                      const pct = Number(props.value ?? 0);
                      return `${name} ${pct.toFixed(0)}%`;
                    }}
                  >
                    {INCOME_SHARES.filter((r) => r.id !== "residual").map(
                      (r) => (
                        <Cell key={r.id} fill={r.fill} />
                      ),
                    )}
                  </Pie>
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0), 0)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              LMIC combined ≈ {HEADLINE.incomeLmicPct}% · LDC ≈{" "}
              {HEADLINE.incomeLdcPct}%
            </p>
          </ChartCard>
        </div>
      )}

      {view === "burden" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Cash vs people meters"
            subtitle="Same theme, different tops — do not average these rows"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={asymmetryBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 80]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={140}
                    tick={{ fontSize: 10, fill: "#334155" }}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {asymmetryBars.map((r) => (
                      <Cell key={r.name} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Donor ladder vs host ladder"
            subtitle="Top-1 cash share dwarfs Top-1 host share — narratives often collapse them"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={[
                    {
                      label: "Top-1",
                      donors: HEADLINE.donorTop1Pct,
                      hosts: HEADLINE.hostTop1Pct,
                    },
                    {
                      label: "Top-3",
                      donors: HEADLINE.donorTop3Pct,
                      hosts: HEADLINE.hostTop3Pct,
                    },
                    {
                      label: "Top-5",
                      donors: HEADLINE.donorTop5Pct,
                      hosts: HEADLINE.hostTop5Pct,
                    },
                  ]}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    domain={[0, 70]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    unit="%"
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v ?? 0))} />
                  <Bar
                    dataKey="donors"
                    name="FTS donors"
                    fill={SKY}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="hosts"
                    name="Refugee hosts"
                    fill={ROSE}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="donors"
                    stroke={AMBER}
                    strokeWidth={0}
                    legendType="none"
                    hide
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Gap still open: {fmtBn(HEADLINE.ghoGapBn, 1)} on a{" "}
              {HEADLINE.ghoCoveragePct}% coverage print · displaced stock{" "}
              {fmtM(HEADLINE.displacedM)}
            </p>
          </ChartCard>
        </div>
      )}

      {view === "leverage" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={
              scatterMode === "plans"
                ? "Plan ask share vs coverage"
                : "Host people vs donor cash share"
            }
            subtitle={
              scatterMode === "plans"
                ? "Bubble size ∝ people in need · high ask + low coverage = pressure"
                : "Bubble size mixes hosted stock and donor share · roles diverge"
            }
          >
            <div className="mb-3">
              <ToggleGroup
                label="Scatter"
                value={scatterMode}
                options={[
                  { id: "plans", label: "Plans" },
                  { id: "roles", label: "Host/donor roles" },
                ]}
                onChange={setScatterMode}
              />
            </div>
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 12, right: 16, left: 0, bottom: 12 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name={
                      scatterMode === "plans" ? "Req share %" : "Hosted (M)"
                    }
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    label={{
                      value:
                        scatterMode === "plans"
                          ? "Requirement share %"
                          : "People hosted (M)",
                      position: "insideBottom",
                      offset: -4,
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name={
                      scatterMode === "plans"
                        ? "Coverage %"
                        : "Donor share %"
                    }
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    label={{
                      value:
                        scatterMode === "plans"
                          ? "Coverage %"
                          : "FTS donor share %",
                      angle: -90,
                      position: "insideLeft",
                      offset: 10,
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => {
                      const n = Number(v ?? 0);
                      if (name === "z") return [Math.round(n), "size"];
                      return [fmtPct(n), String(name)];
                    }}
                    labelFormatter={(_, payload) => {
                      const p = payload?.[0]?.payload as
                        | { short?: string }
                        | undefined;
                      return p?.short ?? "";
                    }}
                  />
                  <Scatter
                    data={scatterMode === "plans" ? planScatter : roleScatter}
                    fill={SKY}
                  >
                    {(scatterMode === "plans"
                      ? planScatter
                      : roleScatter
                    ).map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Read the asymmetry"
            subtitle="Coverage can heal on a concentrated donor ladder while hosting stays LMIC-heavy"
          >
            <ul className="space-y-3 text-sm leading-relaxed text-slate-700">
              <li>
                <span className="font-semibold text-slate-900">Cash tip:</span>{" "}
                FTS Top-1 {fmtPct(HEADLINE.donorTop1Pct)} · Top-3{" "}
                {fmtPct(HEADLINE.donorTop3Pct)} of tracked funding (
                {fmtBn(HEADLINE.donorTrackedBn)}).
              </li>
              <li>
                <span className="font-semibold text-slate-900">
                  People tip:
                </span>{" "}
                Host Top-3 only {fmtPct(HEADLINE.hostTop3Pct)} of the ~{" "}
                {fmtM(HEADLINE.hostUniverseM)} host universe — but LMIC hosts
                hold {fmtPct(HEADLINE.incomeLmicPct, 0)}.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Ask tip:</span>{" "}
                Sudan / regional alone is ~{fmtPct(HEADLINE.appealTop1Pct)} of
                the {fmtBn(HEADLINE.appealUniverseBn)} GHO ask; Top-3 plans ~
                {fmtPct(HEADLINE.appealTop3Pct)}.
              </li>
              <li>
                <span className="font-semibold text-slate-900">
                  Narrative trap:
                </span>{" "}
                {HEADLINE.ghoCoveragePct}% coverage with a{" "}
                {fmtBn(HEADLINE.ghoGapBn, 1)} gap is not the same story as
                &quot;the system healed.&quot;
              </li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              {SOURCE_NOTE}
            </p>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
