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
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ANALYTICS,
  DELINQUENCY_DETAIL,
  DELINQUENCY_STRIP,
  DOLLAR_VS_RECIPIENT,
  FORBEARANCE_ANCHORS,
  HEADLINE,
  IDR_SPLIT,
  QUARTERS,
  SOURCE_NOTE,
  STATUS_META,
  STATUS_MIX,
} from "@/data/federal-student-loan-balances-versus-borrowers-in-repayment-2026-data";

type Panel =
  | "status-stack"
  | "dollar-vs-heads"
  | "repay-path"
  | "forbear-anchors"
  | "avg-balance"
  | "idr-pie"
  | "delinq-strip";

type Metric = "dollars" | "recipients";
type Window = "full" | "postPause";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "status-stack": {
    title: "Federally managed balances by loan status",
    subtitle: `As of ${HEADLINE.asOfLabel}, only ${HEADLINE.repaymentSharePct}% of the $${HEADLINE.portfolioBn}B portfolio sits in repayment or delinquency`,
  },
  "dollar-vs-heads": {
    title: "Dollar share versus recipient share",
    subtitle:
      "Forbearance holds more dollars than heads; default does the reverse",
  },
  "repay-path": {
    title: "Repayment and forbearance shares of the portfolio",
    subtitle:
      "Payment-pause peak → SAVE forbearance hangover → slow return toward repayment",
  },
  "forbear-anchors": {
    title: "Forbearance balances across policy regimes",
    subtitle: `$${HEADLINE.prePauseForbearanceBn}B pre-pause → $${HEADLINE.peakPauseForbearanceBn}B peak → $${HEADLINE.forbearanceBn}B latest`,
  },
  "avg-balance": {
    title: "Average outstanding balance per status recipient",
    subtitle: `Forbearance averages $${HEADLINE.avgForbearanceBalanceK}k — well above repayment’s $${HEADLINE.avgRepaymentBalanceK}k`,
  },
  "idr-pie": {
    title: "Income-driven plans inside the repay / defer / forbear universe",
    subtitle: `${HEADLINE.idrShareOfRepayPlanDollarsPct}% of those dollars · ${HEADLINE.idrBorrowerSharePct}% of those borrowers`,
  },
  "delinq-strip": {
    title: "Active-repayment currency (ED-serviced)",
    subtitle: `${HEADLINE.activeRepayCurrentSharePct}% current by heads · ${DELINQUENCY_DETAIL.dollarDelinq31Pct}% of dollars are 31+ days late`,
  },
};

const fmtBn = (n: number) => `$${n.toFixed(0)}B`;
const fmtPct = (n: number) => `${n.toFixed(1)}%`;
const asNum = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);

export function FederalStudentLoanBalancesVersusBorrowersInRepayment2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("status-stack");
  const [metric, setMetric] = useState<Metric>("dollars");
  const [window, setWindow] = useState<Window>("full");

  const quarterData = useMemo(
    () =>
      window === "postPause"
        ? QUARTERS.filter((q) => q.sortKey >= "2025-06")
        : QUARTERS,
    [window],
  );

  const stackData = useMemo(() => {
    if (metric === "dollars") {
      return STATUS_MIX.map((s) => ({
        name: STATUS_META[s.id].short,
        value: s.balanceBn as number,
        fill: STATUS_META[s.id].color,
      }));
    }
    return STATUS_MIX.map((s) => ({
      name: STATUS_META[s.id].short,
      value: s.recipientsM as number,
      fill: STATUS_META[s.id].color,
    }));
  }, [metric]);

  const dualData = useMemo(
    () =>
      DOLLAR_VS_RECIPIENT.map((d) => ({
        ...d,
        short: STATUS_META[d.id as keyof typeof STATUS_META].short,
        fill: STATUS_META[d.id as keyof typeof STATUS_META].color,
      })),
    [],
  );

  const avgScatter = useMemo(
    () =>
      STATUS_MIX.map((s) => ({
        short: STATUS_META[s.id].short,
        avgBalanceK: s.avgBalanceK,
        sharePct: metric === "dollars" ? s.sharePct : s.recipientSharePct,
        balanceBn: s.balanceBn,
        fill: STATUS_META[s.id].color,
      })),
    [metric],
  );

  const meta = PANEL_META[panel];

  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white"
      data-viz="federal-student-loan-balances-versus-borrowers-in-repayment-2026"
    >
      <div className="border-b border-slate-200 bg-slate-900 px-4 py-3 text-slate-100 sm:px-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-300">
          {ANALYTICS.categoryLabel} · {ANALYTICS.smokeMarker}
        </p>
        <h3 className="mt-1 text-base font-semibold leading-snug sm:text-lg">
          {HEADLINE.repaymentSharePct}% of ED-managed loan dollars are in
          repayment — {HEADLINE.dollarsNotInActiveRepaymentSharePct}% are not
        </h3>
        <p className="mt-1 text-sm text-slate-300">
          {HEADLINE.asOfLabel}: ${HEADLINE.repaymentBn}B repayment · $
          {HEADLINE.forbearanceBn}B forbearance · ${HEADLINE.defaultBn}B default
          · ${HEADLINE.portfolioBn}B federally managed
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 px-4 py-3 sm:px-5">
        {(
          [
            ["status-stack", "Status mix"],
            ["dollar-vs-heads", "Dollars vs heads"],
            ["repay-path", "Repay path"],
            ["forbear-anchors", "Forbear anchors"],
            ["avg-balance", "Avg balance"],
            ["idr-pie", "IDR split"],
            ["delinq-strip", "Delinquency"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPanel(id)}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
              panel === id
                ? "bg-teal-800 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-2.5 text-xs sm:px-5">
        <span className="font-medium text-slate-500">Metric</span>
        {(
          [
            ["dollars", "Dollars"],
            ["recipients", "Recipients"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMetric(id)}
            className={`rounded-md px-2 py-1 font-medium ${
              metric === id
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-2 font-medium text-slate-500">Window</span>
        {(
          [
            ["full", "Full path"],
            ["postPause", "Since Jun 2025"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setWindow(id)}
            className={`rounded-md px-2 py-1 font-medium ${
              window === id
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 py-3 sm:px-5">
        <h4 className="text-sm font-semibold text-slate-900">{meta.title}</h4>
        <p className="mt-0.5 text-xs text-slate-500">{meta.subtitle}</p>
      </div>

      <div className="h-[340px] px-2 pb-2 sm:px-4">
        {panel === "status-stack" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stackData}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) =>
                  metric === "dollars" ? `$${v}B` : `${v}M`
                }
              />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(v) =>
                  metric === "dollars"
                    ? fmtBn(asNum(v))
                    : `${asNum(v).toFixed(1)}M recipients`
                }
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {stackData.map((d) => (
                  <Cell key={d.name} fill={d.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "dollar-vs-heads" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dualData}
              margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="short" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 50]}
              />
              <Tooltip formatter={(v) => fmtPct(asNum(v))} />
              <Legend />
              <Bar
                dataKey="dollarSharePct"
                name="Dollar share"
                fill="#0f766e"
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="recipientSharePct"
                name="Recipient share"
                fill="#94a3b8"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "repay-path" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={quarterData}
              margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="share"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 80]}
              />
              <YAxis
                yAxisId="bn"
                orientation="right"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `$${v}B`}
              />
              <Tooltip />
              <Legend />
              <Area
                yAxisId="share"
                type="monotone"
                dataKey="forbearanceSharePct"
                name="Forbearance %"
                fill="#fed7aa"
                stroke="#c2410c"
                fillOpacity={0.45}
              />
              <Line
                yAxisId="share"
                type="monotone"
                dataKey="repaymentSharePct"
                name="Repayment %"
                stroke="#0f766e"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Bar
                yAxisId="bn"
                dataKey="defaultBn"
                name="Default $"
                fill="#7f1d1d"
                opacity={0.55}
                barSize={18}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "forbear-anchors" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[...FORBEARANCE_ANCHORS]}
              margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}B`} />
              <Tooltip
                formatter={(v, _n, props) => [
                  fmtBn(asNum(v)),
                  (props?.payload as { tag?: string })?.tag ?? "Forbearance",
                ]}
              />
              <Bar dataKey="bn" name="Forbearance $" radius={[4, 4, 0, 0]}>
                {FORBEARANCE_ANCHORS.map((d) => (
                  <Cell
                    key={d.label}
                    fill={
                      d.bn >= 1000
                        ? "#7f1d1d"
                        : d.bn >= 500
                          ? "#c2410c"
                          : "#ea580c"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "avg-balance" && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 24, left: 8, bottom: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="sharePct"
                name={metric === "dollars" ? "Dollar share %" : "Recipient share %"}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 50]}
              />
              <YAxis
                type="number"
                dataKey="avgBalanceK"
                name="Avg balance $k"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `$${v}k`}
                domain={[0, 70]}
              />
              <ZAxis type="number" dataKey="balanceBn" range={[80, 400]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) => {
                  const n = asNum(v);
                  const key = String(name);
                  if (key === "avgBalanceK") return [`$${n}k`, "Avg balance"];
                  if (key === "sharePct") return [fmtPct(n), "Share"];
                  return [n, key];
                }}
                labelFormatter={(_, payload) =>
                  (payload?.[0]?.payload as { short?: string })?.short ?? ""
                }
              />
              <Scatter data={avgScatter} name="Status">
                {avgScatter.map((d) => (
                  <Cell key={d.short} fill={d.fill} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}

        {panel === "idr-pie" && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[...IDR_SPLIT]}
                dataKey={
                  metric === "dollars" ? "dollarSharePct" : "borrowerSharePct"
                }
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={110}
                paddingAngle={2}
                label={(props) => {
                  const name = String(props.name ?? "");
                  const pct = ((props.percent ?? 0) * 100).toFixed(0);
                  return `${name.split(" ")[0]} ${pct}%`;
                }}
              >
                {IDR_SPLIT.map((d) => (
                  <Cell key={d.id} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, _n, props) => {
                  const n = asNum(v);
                  const row = props?.payload as {
                    balanceBn?: number;
                    borrowersM?: number;
                  };
                  return metric === "dollars"
                    ? [`${n}% · ${fmtBn(row?.balanceBn ?? 0)}`, "Dollar share"]
                    : [
                        `${n}% · ${row?.borrowersM ?? 0}M borrowers`,
                        "Borrower share",
                      ];
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}

        {panel === "delinq-strip" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[...DELINQUENCY_STRIP]}
              layout="vertical"
              margin={{ top: 24, right: 40, left: 8, bottom: 24 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={140}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(v) =>
                  `${asNum(v)}% of active-repay recipients`
                }
              />
              <Bar dataKey="sharePct" radius={[0, 4, 4, 0]} barSize={36}>
                {DELINQUENCY_STRIP.map((d) => (
                  <Cell key={d.id} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="border-t border-slate-100 px-4 py-2.5 text-[10px] leading-relaxed text-slate-400 sm:px-5">
        {SOURCE_NOTE}
      </p>
    </div>
  );
}
