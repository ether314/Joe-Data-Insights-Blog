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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
// chart types: composed, bar, line, pie, scatter
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  BRAND_LADDER,
  ENROLLEE_PATH,
  GROSS_NET,
  HEADLINE,
  INTENSITY,
  KFF_GROSS_MIX,
  PLAN_CARRIER,
  SHARE_PATH,
  SOURCE_NOTE,
  fmtB,
  fmtDollar,
  fmtPct,
  type BrandId,
  type PlanBucket,
} from "@/data/medicare-part-d-glp-1-diabetes-spending-2026-data";

// viz-types: share-path composed (area+line), brand horizontal bars,
// enrollee dual lines, plan-carrier bars + pie, intensity scatter,
// gross-vs-net waterfall bars | layout: default
// controls: view + brand focus + plan metric
// smoke-marker: GLP-1 share of Part D spend

type ViewId = "share" | "brands" | "enrollees" | "plans" | "grossnet";
type PlanMetric = "spend" | "enrollment";

const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const SKY = "#0284c8";

const BRAND_COLORS: Record<BrandId, string> = {
  ozempic: TEAL,
  mounjaro: AMBER,
  trulicity: INDIGO,
  rybelsus: SKY,
  other: SLATE,
};

const PLAN_COLORS: Record<PlanBucket, string> = {
  ma_pd: TEAL,
  pdp: AMBER,
  egwp: INDIGO,
};

function ToggleRow<T extends string>({
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
      <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
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

export function MedicarePartDGlp1DiabetesSpending2026Dashboard() {
  const [view, setView] = useState<ViewId>("share");
  const [brandFocus, setBrandFocus] = useState<BrandId | "all">("all");
  const [planMetric, setPlanMetric] = useState<PlanMetric>("spend");

  const shareComposed = useMemo(
    () =>
      SHARE_PATH.map((r) => ({
        year: String(r.year),
        costB: r.grossCostB,
        sharePct: r.costSharePct,
        claimsM: r.claimsM,
      })),
    [],
  );

  const brandBars = useMemo(() => {
    const rows =
      brandFocus === "all"
        ? BRAND_LADDER
        : BRAND_LADDER.filter((b) => b.id === brandFocus);
    return rows.map((b) => ({
      name: b.brand,
      costB: b.costB,
      claimsM: b.claimsM,
      perClaim: b.costPerClaim,
      fill: BRAND_COLORS[b.id],
      share: b.costShareOfClassPct,
    }));
  }, [brandFocus]);

  const enrolleeLines = useMemo(
    () =>
      ENROLLEE_PATH.map((r) => ({
        year: String(r.year),
        ozempic: r.ozempicEnrolleesK,
        mounjaro: r.mounjaroEnrolleesK,
      })),
    [],
  );

  const planBars = useMemo(
    () =>
      PLAN_CARRIER.map((p) => ({
        name: p.label.replace(" (non-EGWP)", "").replace("Stand-alone ", ""),
        full: p.label,
        value: planMetric === "spend" ? p.glp1SpendSharePct : p.enrollmentSharePct,
        costB: p.glp1CostB,
        fill: PLAN_COLORS[p.id],
        note: p.note,
      })),
    [planMetric],
  );

  const planPie = useMemo(
    () =>
      PLAN_CARRIER.map((p) => ({
        name: p.label.split(" ")[0],
        value: p.glp1SpendSharePct,
        fill: PLAN_COLORS[p.id],
      })),
    [],
  );

  const grossNetBars = useMemo(
    () =>
      GROSS_NET.map((r) => ({
        name: r.label,
        amount: Math.abs(r.amountB),
        signed: r.amountB,
        fill: r.kind === "gross" ? TEAL : r.kind === "rebate" ? ROSE : AMBER,
      })),
    [],
  );

  const mixPie = useMemo(
    () =>
      KFF_GROSS_MIX.map((m, i) => ({
        name: m.product,
        value: m.shareOfGrossPct,
        fill: [TEAL, AMBER, SKY, INDIGO, SLATE][i] ?? SLATE,
      })),
    [],
  );

  return (
    <div
      className="w-full space-y-6"
      data-viz="medicare-part-d-glp-1-diabetes-spending-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">
          GLP-1 share of Part D spend
        </p>
        <p className="mt-2 max-w-3xl text-2xl font-bold leading-snug sm:text-3xl">
          Diabetes-indicated GLP-1s:{" "}
          <span className="text-amber-300">{fmtB(HEADLINE.glp1GrossCost2024B)}</span>{" "}
          —{" "}
          <span className="text-teal-300">{fmtPct(HEADLINE.glp1CostSharePct)}</span>{" "}
          of Part D drug cost on just{" "}
          <span className="text-rose-300">{fmtPct(HEADLINE.glp1ClaimSharePct)}</span>{" "}
          of claims (CMS 2024)
        </p>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          Gross point-of-sale dollars before confidential rebates. Toggle share
          path, brands, enrollees, plan carriers, and gross-vs-net. MA–PD vs PDP
          spend shares are desk estimates on MedPAC enrollment structure.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Class gross (2024)",
              value: fmtB(HEADLINE.glp1GrossCost2024B),
            },
            {
              label: "Share of Part D $",
              value: fmtPct(HEADLINE.glp1CostSharePct),
            },
            {
              label: "Ozempic alone",
              value: fmtB(HEADLINE.ozempicCost2024B),
            },
            {
              label: "Cost / GLP-1 claim",
              value: fmtDollar(HEADLINE.glp1CostPerClaim),
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-0.5 text-lg font-bold text-white">{k.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleRow
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "share", label: "Share path" },
            { id: "brands", label: "Brands" },
            { id: "enrollees", label: "Enrollees" },
            { id: "plans", label: "Plan carriers" },
            { id: "grossnet", label: "Gross vs net" },
          ]}
        />
        {view === "brands" && (
          <ToggleRow
            label="Brand"
            value={brandFocus}
            onChange={setBrandFocus}
            options={[
              { id: "all", label: "All" },
              { id: "ozempic", label: "Ozempic" },
              { id: "mounjaro", label: "Mounjaro" },
              { id: "trulicity", label: "Trulicity" },
              { id: "rybelsus", label: "Rybelsus" },
            ]}
          />
        )}
        {view === "plans" && (
          <ToggleRow
            label="Metric"
            value={planMetric}
            onChange={setPlanMetric}
            options={[
              { id: "spend", label: "GLP-1 $ share" },
              { id: "enrollment", label: "Enrollment share" },
            ]}
          />
        )}
      </div>

      {view === "share" && (
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Gross cost and share of Part D dollars
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Area = class gross ($B); line = cost share (%). 2024 disclosed;
              earlier years carried from KFF/OIG path.
            </p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={shareComposed}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="costB"
                    name="Gross cost ($B)"
                    fill={TEAL}
                    fillOpacity={0.25}
                    stroke={TEAL}
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="sharePct"
                    name="Share of Part D $"
                    stroke={AMBER}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Claims vs dollars (intensity)
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {fmtPct(HEADLINE.glp1ClaimSharePct)} of claims →{" "}
              {fmtPct(HEADLINE.glp1CostSharePct)} of dollars.
            </p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={INTENSITY.filter((i) => i.unit === "%").map((i) => ({
                    name: i.metric.replace("Share of Part D ", ""),
                    glp1: i.glp1,
                  }))}
                  layout="vertical"
                  margin={{ left: 8, right: 12 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={72}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="glp1" name="GLP-1 %" radius={[0, 4, 4, 0]}>
                    <Cell fill={SKY} />
                    <Cell fill={TEAL} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {view === "brands" && (
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Brand ladder — 2024 gross cost
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Top four brands = {fmtPct(HEADLINE.top4BrandSharePct)} of the
              diabetes GLP-1 class.
            </p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={brandBars}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={88}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar dataKey="costB" name="Gross ($B)" radius={[0, 4, 4, 0]}>
                    {brandBars.map((b) => (
                      <Cell key={b.name} fill={b.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Cost per claim ($)
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Program average {fmtDollar(HEADLINE.programCostPerClaim)}.
            </p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: 8, right: 12, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="claimsM"
                    name="Claims (M)"
                    tick={{ fontSize: 11 }}
                    unit="M"
                  />
                  <YAxis
                    type="number"
                    dataKey="perClaim"
                    name="$ / claim"
                    tick={{ fontSize: 11 }}
                    domain={[1000, 1600]}
                  />
                  <ZAxis type="number" dataKey="costB" range={[80, 400]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={brandBars} name="Brand">
                    {brandBars.map((b) => (
                      <Cell key={b.name} fill={b.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {view === "enrollees" && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Part D enrollees on Ozempic / Mounjaro (thousands)
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            KFF CMS claims: Ozempic ~2.0M enrollees in 2024; Mounjaro ~1.0M.
          </p>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrolleeLines}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ozempic"
                  name="Ozempic (k)"
                  stroke={TEAL}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="mounjaro"
                  name="Mounjaro (k)"
                  stroke={AMBER}
                  strokeWidth={2.5}
                  connectNulls={false}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {view === "plans" && (
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-3">
            <h3 className="text-sm font-semibold text-slate-900">
              {planMetric === "spend"
                ? "Estimated GLP-1 spend share by plan type"
                : "MedPAC enrollment share by plan type"}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Enrollment disclosed (MedPAC). Spend shares estimated — MA–PD
              carries more LIS.
            </p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={planBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Bar dataKey="value" name="Share %" radius={[4, 4, 0, 0]}>
                    {planBars.map((p) => (
                      <Cell key={p.name} fill={p.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Est. spend mix
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              On {fmtB(HEADLINE.glp1GrossCost2024B)} class total.
            </p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={88}
                    paddingAngle={2}
                  >
                    {planPie.map((p) => (
                      <Cell key={p.name} fill={p.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {view === "grossnet" && (
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Gross POS vs illustrative net
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              MedPAC: diabetic-therapy rebates ≥50% in 2023. Illustration only —
              CMS cannot publish drug-level net.
            </p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={grossNetBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <Tooltip />
                  <Bar dataKey="amount" name="$B" radius={[4, 4, 0, 0]}>
                    {grossNetBars.map((r) => (
                      <Cell key={r.name} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900">
              KFF broader class mix (2024)
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Share of KFF {fmtB(HEADLINE.kffGrossGlp12024B)} gross GLP-1 total.
            </p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mixPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    paddingAngle={1}
                  >
                    {mixPie.map((m) => (
                      <Cell key={m.name} fill={m.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
