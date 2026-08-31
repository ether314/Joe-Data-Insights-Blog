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
  ReferenceLine,
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
  ANNUAL_PATH,
  CIVILIAN_QUARTERS,
  DENIAL_SHARE,
  FIELD_OFFICES,
  FLOW_BALANCE,
  HEADLINE,
  MILITARY_QUARTERS,
  REGION_OPTIONS,
  SOURCE_NOTE,
  combineWithMilitary,
  filterOffices,
  type RegionFilter,
} from "@/data/uscis-n-400-pending-forms-versus-completions-2026-data";

type Panel =
  | "dual-path"
  | "flow-balance"
  | "military-stack"
  | "annual-fy"
  | "processing-time"
  | "office-cloud"
  | "denial-share";

type MetricMode = "both" | "pending" | "completions";

const COLORS = {
  pending: "#1e3a5f",
  completions: "#0f766e",
  receipts: "#64748b",
  military: "#7c3aed",
  civilian: "#1d4ed8",
  denied: "#9f1239",
  approved: "#0d9488",
  target: "#94a3b8",
};

const PANEL_LABELS: { id: Panel; label: string }[] = [
  { id: "dual-path", label: "Pending vs completions" },
  { id: "flow-balance", label: "Receipts vs completions" },
  { id: "military-stack", label: "Military stack" },
  { id: "annual-fy", label: "Annual FY path" },
  { id: "processing-time", label: "Processing months" },
  { id: "office-cloud", label: "Office cloud" },
  { id: "denial-share", label: "Denial share" },
];

const METRIC_LABELS: { id: MetricMode; label: string }[] = [
  { id: "both", label: "Both series" },
  { id: "pending", label: "Pending only" },
  { id: "completions", label: "Completions only" },
];

function fmtInt(n: number) {
  return n.toLocaleString("en-US");
}

function fmtK(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return fmtInt(n);
}

export function UscisN400PendingFormsVersusCompletions2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("dual-path");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [metric, setMetric] = useState<MetricMode>("both");
  const [includeMilitary, setIncludeMilitary] = useState(false);

  const pathRows = useMemo(() => {
    return CIVILIAN_QUARTERS.map((c) => {
      const mil = MILITARY_QUARTERS.find((m) => m.period === c.period);
      const combined = combineWithMilitary(c, includeMilitary ? mil : undefined);
      return {
        label: c.label,
        pending: combined.pending,
        completions: combined.completions,
        received: combined.received,
        processingMonths: c.processingMonths,
        clearancePct: c.clearancePct,
      };
    });
  }, [includeMilitary]);

  const flowRows = useMemo(
    () =>
      FLOW_BALANCE.map((r) => ({
        label: r.label,
        received: r.received,
        completions: r.completions,
        netDrain: r.netDrain,
        pending: r.pending,
      })),
    [],
  );

  const stackRows = useMemo(() => {
    return CIVILIAN_QUARTERS.map((c) => {
      const mil = MILITARY_QUARTERS.find((m) => m.period === c.period);
      return {
        label: c.label,
        civilian: c.pending,
        military: mil?.pending ?? 0,
        total: c.pending + (mil?.pending ?? 0),
      };
    });
  }, []);

  const annualRows = ANNUAL_PATH.map((r) => ({
    fy: `FY${r.fy}`,
    receipts: r.receipts,
    completions: r.completions,
    naturalized: r.naturalized,
    clearancePct: r.clearancePct,
  }));

  const scatterRows = useMemo(() => filterOffices(region), [region]);

  const denialRows = DENIAL_SHARE.map((r) => ({
    label: r.label,
    approved: r.approved,
    denied: r.denied,
    denialSharePct: r.denialSharePct,
  }));

  const showPending = metric === "both" || metric === "pending";
  const showCompletions = metric === "both" || metric === "completions";

  return (
    <figure
      className="my-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      data-viz="uscis-n-400-pending-forms-versus-completions-2026"
    >
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
          Interactive — N-400 pending vs quarterly completions
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900">
          Headline — pending {fmtInt(HEADLINE.pendingCivilianFy2024Q1)} →{" "}
          {fmtInt(HEADLINE.pendingCivilianFy2026Q2)} civilian; total{" "}
          {fmtInt(HEADLINE.pendingTotalFy2026Q2)}
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Pending inventory climbed {HEADLINE.pctPendingUpCivilian}% from the series low
          while FY2026 Q2 completions ({fmtK(HEADLINE.completionsFy2026Q2Civilian)}) lagged
          receipts ({fmtK(HEADLINE.receiptsFy2026Q2Civilian)}). Processing time stretched from{" "}
          {HEADLINE.processingMonthsFy2024Q4} to {HEADLINE.processingMonthsFy2026Q2} months.
          Largest office stack: {ANALYTICS.largestOffice}; slowest median clock:{" "}
          {ANALYTICS.slowestOffice}.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">
        {PANEL_LABELS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPanel(p.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              panel === p.id
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">
        {METRIC_LABELS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMetric(m.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              metric === m.id
                ? "bg-teal-800 text-white"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {m.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setIncludeMilitary((v) => !v)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
            includeMilitary
              ? "bg-violet-800 text-white"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          {includeMilitary ? "Include military" : "Civilian only"}
        </button>
        {REGION_OPTIONS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRegion(r.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              region === r.id
                ? "bg-amber-800 text-white"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 sm:px-5">
        {panel === "dual-path" && (
          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart data={pathRows} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => fmtK(v)}
                label={{ value: "Cases", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => fmtK(v)}
                hide={!showCompletions || !showPending}
              />
              <Tooltip
                formatter={(value, name) => {
                  const n = Number(value);
                  return [fmtInt(n), name];
                }}
                labelFormatter={(l) => l}
              />
              <Legend />
              {showPending && (
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="pending"
                  name="Pending inventory"
                  fill={COLORS.pending}
                  stroke={COLORS.pending}
                  fillOpacity={0.35}
                />
              )}
              {showCompletions && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="completions"
                  name="Quarterly completions"
                  stroke={COLORS.completions}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "flow-balance" && (
          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart data={flowRows} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmtK(v)} />
              <Tooltip formatter={(value) => fmtInt(Number(value))} />
              <Legend />
              <Bar dataKey="received" name="Received" fill={COLORS.receipts} barSize={18} />
              <Bar dataKey="completions" name="Completions" fill={COLORS.completions} barSize={18} />
              <Line
                type="monotone"
                dataKey="netDrain"
                name="Net drain (comp − recv)"
                stroke="#b45309"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <ReferenceLine y={0} stroke={COLORS.target} />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "military-stack" && (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={stackRows} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmtK(v)} />
              <Tooltip formatter={(value) => fmtInt(Number(value))} />
              <Legend />
              <Bar dataKey="civilian" stackId="a" name="Civilian pending" fill={COLORS.civilian} />
              <Bar dataKey="military" stackId="a" name="Military pending" fill={COLORS.military} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "annual-fy" && (
          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart data={annualRows} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="fy" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmtK(v)} />
              <Tooltip formatter={(value) => fmtInt(Number(value))} />
              <Legend />
              <Bar dataKey="receipts" name="Annual receipts" fill={COLORS.receipts} barSize={22} />
              <Bar dataKey="completions" name="Annual completions" fill={COLORS.completions} barSize={22} />
              <Line
                type="monotone"
                dataKey="naturalized"
                name="Persons naturalized"
                stroke="#b45309"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "processing-time" && (
          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart data={pathRows} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11 }}
                label={{ value: "Months", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
              />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v) => fmtK(v)} />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="processingMonths"
                name="Median processing (mo)"
                stroke="#b45309"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="pending"
                name="Pending inventory"
                fill={COLORS.pending}
                stroke={COLORS.pending}
                fillOpacity={0.2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "office-cloud" && (
          <ResponsiveContainer width="100%" height={360}>
            <ScatterChart margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="processingMonths"
                name="Processing months"
                tick={{ fontSize: 11 }}
                label={{ value: "Median months", position: "insideBottom", offset: -2, style: { fontSize: 11 } }}
              />
              <YAxis
                type="number"
                dataKey="pending"
                name="Pending"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => fmtK(v)}
                label={{ value: "Pending cases", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
              />
              <ZAxis type="number" dataKey="receivedQ" range={[60, 400]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name) => {
                  const n = Number(value);
                  if (name === "Pending") return [fmtInt(n), name];
                  if (name === "Processing months") return [`${n} mo`, name];
                  return [fmtInt(n), name];
                }}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.office ? `${payload[0].payload.office} (${payload[0].payload.region})` : ""
                }
              />
              <Scatter name="Field offices" data={scatterRows} fill={COLORS.pending}>
                {scatterRows.map((_, i) => (
                  <Cell key={i} fill={COLORS.civilian} fillOpacity={0.75} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}

        {panel === "denial-share" && (
          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart data={denialRows} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v) => fmtK(v)} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11 }}
                domain={[0, 20]}
                label={{ value: "Denial %", angle: 90, position: "insideRight", style: { fontSize: 11 } }}
              />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="approved" name="Approved" fill={COLORS.approved} stackId="s" barSize={20} />
              <Bar yAxisId="left" dataKey="denied" name="Denied" fill={COLORS.denied} stackId="s" barSize={20} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="denialSharePct"
                name="Denial share of completions"
                stroke="#b45309"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <figcaption className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500 sm:px-5">
        {SOURCE_NOTE}
      </figcaption>
    </figure>
  );
}
