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
  ACTIVE_REPAY_SPLIT,
  FORBEARANCE_PATH,
  HEADLINE,
  IDR_VINTAGE,
  RECIPIENT_VS_DOLLAR,
  SOURCE_NOTE,
  STATUS_MARCH_2026,
  STATUS_VINTAGE,
  VIZ_MARKERS,
  fmtBn,
  fmtM,
  fmtPct,
} from "@/data/federal-student-loan-balances-versus-borrowers-in-repayment-2026-data";

// viz-types: status stacked area, forbearance path composed, recipient×dollar
// scatter, active-repay pie, IDR dual bars, status ladder bars
// | layout: default
// smoke-marker: 39% of ED-managed dollars in repayment

type ViewId =
  | "mix"
  | "forbearance"
  | "ladder"
  | "scatter"
  | "delinq"
  | "idr";

type MetricMode = "dollars" | "recipients";

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const SKY = "#0284c8";

const STATUS_COLORS: Record<string, string> = {
  repayment: TEAL,
  forbearance: AMBER,
  deferment: SKY,
  default: ROSE,
  inSchoolGraceOther: SLATE,
};

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

export function FederalStudentLoanBalancesVersusBorrowersInRepayment2026Dashboard() {
  const [view, setView] = useState<ViewId>("mix");
  const [metric, setMetric] = useState<MetricMode>("dollars");
  const slug =
    "federal-student-loan-balances-versus-borrowers-in-repayment-2026";

  const stackedVintage = useMemo(
    () =>
      STATUS_VINTAGE.map((v) => {
        const other = Math.max(
          0,
          v.managedBn - v.repaymentBn - v.forbearanceBn - v.defermentBn - v.defaultBn,
        );
        return {
          period: v.period,
          repayment: v.repaymentBn,
          forbearance: v.forbearanceBn,
          deferment: v.defermentBn,
          default: v.defaultBn,
          other,
          repaymentShare: v.repaymentDollarSharePct,
        };
      }),
    [],
  );

  const ladderData = useMemo(() => {
    const rows = [...STATUS_MARCH_2026];
    if (metric === "dollars") {
      return rows
        .sort((a, b) => b.balanceBn - a.balanceBn)
        .map((r) => ({
          name: r.shortLabel,
          value: r.balanceBn,
          share: r.dollarSharePct,
          fill: STATUS_COLORS[r.id],
        }));
    }
    return rows
      .sort((a, b) => b.recipientsM - a.recipientsM)
      .map((r) => ({
        name: r.shortLabel,
        value: r.recipientsM,
        share: r.recipientSharePct,
        fill: STATUS_COLORS[r.id],
      }));
  }, [metric]);

  const scatterData = useMemo(
    () =>
      RECIPIENT_VS_DOLLAR.map((r) => ({
        name: r.status,
        recipients: r.recipientsM,
        dollars: r.balanceBn,
        avgK: r.avgBalanceK,
        dollarShare: r.dollarSharePct,
      })),
    [],
  );

  const delinqPie = useMemo(
    () =>
      ACTIVE_REPAY_SPLIT.map((s) => ({
        name: s.label,
        value: metric === "dollars" ? s.dollarSharePct : s.recipientSharePct,
        recipientsM: s.recipientsM,
      })),
    [metric],
  );

  const forbearanceComposed = useMemo(
    () =>
      FORBEARANCE_PATH.map((f) => {
        const vintage = STATUS_VINTAGE.find((v) => v.sortKey === f.sortKey);
        return {
          period: f.period,
          forbearance: f.balanceBn,
          repaymentShare: vintage?.repaymentDollarSharePct ?? null,
          label: f.label,
        };
      }),
    [],
  );

  return (
    <div
      className="w-full space-y-6"
      data-viz={slug}
      data-viz-markers={VIZ_MARKERS.join(" | ")}
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
          Federally managed portfolio · Mar 31, 2026
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {VIZ_MARKERS[0]}
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Of the ${HEADLINE.managedPortfolioT}T ED-managed book,{" "}
          {fmtBn(HEADLINE.repaymentBalanceBn)} sits with borrowers in current
          repayment or delinquency — while {VIZ_MARKERS[1]} still parks nearly
          three-tenths of the stock outside monthly billing.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span className="rounded-md bg-white/10 px-3 py-1">
            Default {fmtBn(HEADLINE.defaultBn)}
          </span>
          <span className="rounded-md bg-white/10 px-3 py-1">
            {VIZ_MARKERS[2]}
          </span>
          <span className="rounded-md bg-white/10 px-3 py-1">
            IDR {fmtPct(HEADLINE.idrDollarSharePct)} of plan $
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup
          value={view}
          onChange={setView}
          options={[
            { id: "mix", label: "Status mix path" },
            { id: "forbearance", label: "Forbearance path" },
            { id: "ladder", label: "Status ladder" },
            { id: "scatter", label: "Recipients × dollars" },
            { id: "delinq", label: "Active-repay delinq" },
            { id: "idr", label: "IDR share" },
          ]}
        />
        {(view === "ladder" || view === "delinq") && (
          <ToggleGroup
            value={metric}
            onChange={setMetric}
            options={[
              { id: "dollars", label: "By dollars" },
              { id: "recipients", label: "By recipients" },
            ]}
          />
        )}
      </div>

      {view === "mix" && (
        <ChartCard
          title="Status dollars across recent quarters"
          subtitle="Stacked balances ($B) on the ED-managed book; line = repayment dollar share"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={stackedVintage} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  tickFormatter={(v) => `$${v}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[30, 50]}
                  tick={{ fill: SLATE, fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "repaymentShare") return [fmtPct(Number(value)), "Repayment $ share"];
                    return [fmtBn(Number(value)), String(name)];
                  }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="repayment"
                  stackId="1"
                  fill={TEAL}
                  stroke={TEAL}
                  name="Repayment"
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="forbearance"
                  stackId="1"
                  fill={AMBER}
                  stroke={AMBER}
                  name="Forbearance"
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="deferment"
                  stackId="1"
                  fill={SKY}
                  stroke={SKY}
                  name="Deferment"
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="default"
                  stackId="1"
                  fill={ROSE}
                  stroke={ROSE}
                  name="Default"
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="other"
                  stackId="1"
                  fill={SLATE}
                  stroke={SLATE}
                  name="In-school/other"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="repaymentShare"
                  stroke={NAVY}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  name="Repayment $ %"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "forbearance" && (
        <ChartCard
          title="Forbearance stock from pre-pause to SAVE unwind"
          subtitle="Bars: forbearance balances ($B). Line: repayment dollar share where disclosed."
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forbearanceComposed} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  tickFormatter={(v) => `$${v}B`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 50]}
                  tick={{ fill: SLATE, fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "repaymentShare") {
                      return value == null ? ["—", "Repayment $ share"] : [fmtPct(Number(value)), "Repayment $ share"];
                    }
                    return [fmtBn(Number(value)), "Forbearance"];
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="forbearance" fill={AMBER} name="Forbearance $B" radius={[4, 4, 0, 0]} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="repaymentShare"
                  stroke={TEAL}
                  strokeWidth={2.5}
                  connectNulls={false}
                  dot={{ r: 4 }}
                  name="Repayment $ %"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "ladder" && (
        <ChartCard
          title={
            metric === "dollars"
              ? "March 2026 status ladder by outstanding dollars"
              : "March 2026 status ladder by recipient accounts"
          }
          subtitle="Sorted descending. Recipient shares can overlap across statuses."
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ladderData}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  tickFormatter={(v) =>
                    metric === "dollars" ? `$${v}B` : `${v}M`
                  }
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fill: NAVY, fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value, _n, props) => {
                    const share = (props?.payload as { share?: number })?.share;
                    const primary =
                      metric === "dollars"
                        ? fmtBn(Number(value))
                        : fmtM(Number(value));
                    return [
                      share != null ? `${primary} (${fmtPct(share, 1)})` : primary,
                      metric === "dollars" ? "Balance" : "Recipients",
                    ];
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {ladderData.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Recipients versus dollars by status"
          subtitle="Bubble size ≈ average balance per recipient ($k). Diagonal = equal recipient and dollar shares."
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="recipients"
                  name="Recipients"
                  unit="M"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  label={{ value: "Recipients (M)", position: "insideBottom", offset: -2, fill: SLATE }}
                />
                <YAxis
                  type="number"
                  dataKey="dollars"
                  name="Dollars"
                  unit="B"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  label={{ value: "Balance ($B)", angle: -90, position: "insideLeft", fill: SLATE }}
                />
                <ZAxis type="number" dataKey="avgK" range={[80, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    if (name === "recipients") return [fmtM(Number(value)), "Recipients"];
                    if (name === "dollars") return [fmtBn(Number(value)), "Balance"];
                    return [String(value), String(name)];
                  }}
                  labelFormatter={(_, payload) =>
                    (payload?.[0]?.payload as { name?: string })?.name ?? ""
                  }
                />
                <Scatter data={scatterData} fill={INDIGO}>
                  {scatterData.map((d) => {
                    const slice = STATUS_MARCH_2026.find((s) => s.shortLabel === d.name);
                    return (
                      <Cell
                        key={d.name}
                        fill={slice ? STATUS_COLORS[slice.id] : INDIGO}
                      />
                    );
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
            {scatterData.map((d) => (
              <li key={d.name}>
                <span className="font-semibold text-slate-800">{d.name}</span>
                : avg ~${d.avgK}k / recipient
              </li>
            ))}
          </ul>
        </ChartCard>
      )}

      {view === "delinq" && (
        <ChartCard
          title="Inside active repayment: current vs delinquent"
          subtitle="Denominator = borrowers expected to pay (excludes forbearance, deferment, in-school, grace)."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={delinqPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={2}
                    label={({ name, value }) =>
                      `${String(name).split(" ")[0]} ${fmtPct(Number(value), 1)}`
                    }
                  >
                    {delinqPie.map((d) => (
                      <Cell
                        key={d.name}
                        fill={
                          d.name.startsWith("Current")
                            ? TEAL
                            : d.name.startsWith("Late")
                              ? ROSE
                              : AMBER
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      fmtPct(Number(value), 1),
                      metric === "dollars" ? "Dollar share" : "Recipient share",
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center space-y-3 text-sm text-slate-700">
              <p>
                More than <strong>80%</strong> of ED-serviced recipients in
                active repayment are current (&lt;31 days), but that still leaves
                about <strong>{fmtM(3.5)}</strong> recipients 31+ days past due —
                including <strong>{fmtM(HEADLINE.lateStageDelinqM)}</strong> in
                late-stage delinquency.
              </p>
              <p>
                By dollars, the active-repayment 31+ rate is{" "}
                <strong>{fmtPct(HEADLINE.activeDelinqDollarPct, 1)}</strong> —
                above the December 2019 pre-pause print of 12.7%.
              </p>
            </div>
          </div>
        </ChartCard>
      )}

      {view === "idr" && (
        <ChartCard
          title="Income-driven repayment share of the plan universe"
          subtitle="Bars: IDR balances ($B). Line: IDR dollar share of ED-serviced repayment-plan balances."
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={IDR_VINTAGE} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  tickFormatter={(v) => `$${v}B`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[40, 70]}
                  tick={{ fill: SLATE, fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "dollarSharePct") return [fmtPct(Number(value)), "IDR $ share"];
                    if (name === "borrowerSharePct") return [fmtPct(Number(value)), "IDR borrower share"];
                    return [fmtBn(Number(value)), "IDR balance"];
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="balanceBn"
                  fill={INDIGO}
                  name="IDR $B"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="dollarSharePct"
                  stroke={TEAL}
                  strokeWidth={2.5}
                  name="IDR $ %"
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="borrowerSharePct"
                  stroke={AMBER}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  name="IDR borrower %"
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
