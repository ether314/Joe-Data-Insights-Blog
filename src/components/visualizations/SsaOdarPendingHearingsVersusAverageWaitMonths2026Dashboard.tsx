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
  BACKLOG_SHARE,
  FLOW_BALANCE,
  HEADLINE,
  NATIONAL_PATH,
  OFFICE_SCATTER,
  PROGRAM_MIX,
  REGION_OPTIONS,
  REGION_WAIT,
  SOURCE_NOTE,
  filterOffices,
  type RegionFilter,
} from "@/data/ssa-odar-pending-hearings-versus-average-wait-months-2026-data";

type Panel =
  | "dual-path"
  | "flow-balance"
  | "region-waits"
  | "office-cloud"
  | "program-mix"
  | "backlog-share";

type MetricMode = "both" | "pending" | "wait";

const COLORS = {
  pending: "#1e3a5f",
  wait: "#b45309",
  receipts: "#64748b",
  dispositions: "#0f766e",
  backlog: "#9f1239",
  target: "#94a3b8",
  di: "#1d4ed8",
  ssi: "#7c3aed",
  concurrent: "#0e7490",
  oasi: "#a16207",
};

const PANEL_LABELS: { id: Panel; label: string }[] = [
  { id: "dual-path", label: "Pending vs wait" },
  { id: "flow-balance", label: "Receipts vs dispositions" },
  { id: "region-waits", label: "Region waits" },
  { id: "office-cloud", label: "Office cloud" },
  { id: "program-mix", label: "Program mix" },
  { id: "backlog-share", label: "Backlog share" },
];

const METRIC_LABELS: { id: MetricMode; label: string }[] = [
  { id: "both", label: "Both series" },
  { id: "pending", label: "Pending only" },
  { id: "wait", label: "Wait months only" },
];

function fmtInt(n: number) {
  return n.toLocaleString("en-US");
}

function fmtMonths(n: number) {
  return `${n.toFixed(1)} mo`;
}

function fmtK(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return fmtInt(n);
}

export function SsaOdarPendingHearingsVersusAverageWaitMonths2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("dual-path");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [metric, setMetric] = useState<MetricMode>("both");
  const [disclosedOnly, setDisclosedOnly] = useState(false);

  const pathRows = useMemo(() => {
    let rows = NATIONAL_PATH;
    if (disclosedOnly) rows = rows.filter((r) => r.confidence === "disclosed");
    return rows.map((r) => ({
      fy: `FY${r.fy}`,
      year: r.fy,
      pending: r.pending,
      waitMonths: r.waitMonths,
      clearancePct: r.clearancePct,
      aptDays: r.aptDays,
    }));
  }, [disclosedOnly]);

  const flowRows = useMemo(() => {
    let rows = FLOW_BALANCE;
    if (disclosedOnly) {
      const disclosedFys = new Set(
        NATIONAL_PATH.filter((r) => r.confidence === "disclosed").map((r) => r.fy),
      );
      rows = rows.filter((r) => disclosedFys.has(r.fy));
    }
    return rows.map((r) => ({
      fy: `FY${r.fy}`,
      receipts: r.receipts,
      dispositions: r.dispositions,
      netDrain: r.netDrain,
    }));
  }, [disclosedOnly]);

  const regionRows = useMemo(() => {
    const rows = region === "all" ? REGION_WAIT : REGION_WAIT.filter((r) => r.region === region);
    return [...rows].sort((a, b) => b.waitMonths - a.waitMonths);
  }, [region]);

  const scatterRows = useMemo(() => {
    let rows = filterOffices(region);
    if (disclosedOnly) rows = rows.filter((r) => r.confidence === "disclosed");
    return rows;
  }, [region, disclosedOnly]);

  const backlogRows = useMemo(() => {
    let rows = BACKLOG_SHARE;
    if (disclosedOnly) {
      // keep all years but mark; filter only FY2024 estimated pending path years
      rows = rows.filter((r) => r.fy <= 2023);
    }
    return rows.map((r) => ({
      fy: `FY${r.fy}`,
      pending: r.pending,
      backlogSharePct: r.backlogSharePct,
      backlogCases: Math.round((r.pending * r.backlogSharePct) / 100),
    }));
  }, [disclosedOnly]);

  const programRows = PROGRAM_MIX.map((p) => ({
    label: p.label,
    pending2021: p.pending2021,
    pending2022: p.pending2022,
    pending2023: p.pending2023,
  }));

  return (
    <figure
      className="my-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      data-viz="ssa-odar-pending-hearings-versus-average-wait-months-2026"
    >
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
          Interactive — OHO pending & wait months
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900">
          Headline — pending hearings {fmtK(HEADLINE.pendingFy2016)} →{" "}
          {fmtK(HEADLINE.pendingFy2024)}; wait {HEADLINE.aptPeakMonths} →{" "}
          {HEADLINE.aptFy2024Months} months
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Inventory fell {HEADLINE.pctPendingDownFrom2016}% from the FY2016 peak, but average
          wait months still sit {ANALYTICS.targetGapMonths2024} months above SSA&apos;s 270-day
          target. FY2023 briefly lifted wait months to {HEADLINE.aptFy2023Months} as oldest cases
          were prioritized even while pending kept falling. Slowest region sample:{" "}
          {ANALYTICS.slowestRegion}; fastest: {ANALYTICS.fastestRegion} (
          {ANALYTICS.regionWaitSpreadMonths} mo spread).
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
        {REGION_OPTIONS.slice(0, 6).map((r) => (
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
        {REGION_OPTIONS.slice(6).map((r) => (
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
        <span className="mx-1 hidden h-6 w-px bg-slate-200 sm:inline-block" />
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
          onClick={() => setDisclosedOnly((v) => !v)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
            disclosedOnly
              ? "bg-indigo-800 text-white"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          {disclosedOnly ? "Disclosed only" : "Include FY2024 est."}
        </button>
      </div>

      <div className="px-2 py-4 sm:px-4">
        {panel === "dual-path" && (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={pathRows} margin={{ top: 8, right: 48, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fy" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  tickFormatter={fmtK}
                  hide={metric === "wait"}
                  label={{
                    value: "Pending hearings",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[8, 22]}
                  tick={{ fontSize: 11 }}
                  hide={metric === "pending"}
                  label={{
                    value: "Wait months",
                    angle: 90,
                    position: "insideRight",
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    const key = String(name);
                    if (key === "waitMonths") return [fmtMonths(n), "Avg wait months"];
                    if (key === "pending") return [fmtInt(n), "Pending hearings"];
                    if (key === "clearancePct") return [`${n.toFixed(1)}%`, "Clearance"];
                    return [fmtInt(n), key];
                  }}
                />
                <Legend />
                <ReferenceLine
                  yAxisId="right"
                  y={HEADLINE.targetWaitMonths}
                  stroke={COLORS.target}
                  strokeDasharray="4 4"
                  label={{ value: "270-day target", position: "insideTopRight", fontSize: 10 }}
                />
                {(metric === "both" || metric === "pending") && (
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="pending"
                    name="Pending hearings"
                    fill={COLORS.pending}
                    fillOpacity={0.18}
                    stroke={COLORS.pending}
                    strokeWidth={2.5}
                  />
                )}
                {(metric === "both" || metric === "wait") && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="waitMonths"
                    name="Avg wait months"
                    stroke={COLORS.wait}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "flow-balance" && (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={flowRows} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fy" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={fmtK} />
                <Tooltip
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    return [fmtInt(n), String(name)];
                  }}
                />
                <Legend />
                <Bar dataKey="receipts" name="Receipts" fill={COLORS.receipts} />
                <Bar dataKey="dispositions" name="Dispositions" fill={COLORS.dispositions} />
                <Line
                  type="monotone"
                  dataKey="netDrain"
                  name="Net drain (disp − receipts)"
                  stroke={COLORS.wait}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "region-waits" && (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={regionRows}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  domain={[0, 16]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}`}
                />
                <YAxis type="category" dataKey="label" width={100} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    if (String(name) === "waitMonths") return [fmtMonths(n), "Wait months"];
                    if (String(name) === "pending") return [fmtInt(n), "Pending (est.)"];
                    return [fmtInt(n), String(name)];
                  }}
                />
                <Legend />
                <ReferenceLine
                  x={HEADLINE.targetWaitMonths}
                  stroke={COLORS.target}
                  strokeDasharray="4 4"
                />
                <Bar dataKey="waitMonths" name="Wait months" fill={COLORS.wait} radius={[0, 4, 4, 0]}>
                  {regionRows.map((r) => (
                    <Cell
                      key={r.region}
                      fill={r.waitMonths > HEADLINE.targetWaitMonths + 3 ? COLORS.backlog : COLORS.wait}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "office-cloud" && (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 24, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="pending"
                  name="Pending"
                  tick={{ fontSize: 11 }}
                  tickFormatter={fmtK}
                  label={{ value: "Cases pending", position: "insideBottom", offset: -4, fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="waitMonths"
                  name="Wait"
                  domain={[8, 17]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Wait months",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <ZAxis type="number" dataKey="aptDays" range={[60, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    if (String(name) === "Wait") return [fmtMonths(n), "Wait months"];
                    if (String(name) === "Pending") return [fmtInt(n), "Pending"];
                    return [fmtInt(n), String(name)];
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as { office?: string } | undefined;
                    return p?.office ?? "";
                  }}
                />
                <ReferenceLine
                  y={HEADLINE.targetWaitMonths}
                  stroke={COLORS.target}
                  strokeDasharray="4 4"
                />
                <Scatter name="Hearing offices" data={scatterRows} fill={COLORS.pending}>
                  {scatterRows.map((o) => (
                    <Cell
                      key={o.office}
                      fill={o.waitMonths >= 14 ? COLORS.backlog : COLORS.pending}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "program-mix" && (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={programRows} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={fmtK} />
                <Tooltip
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    return [fmtInt(n), String(name)];
                  }}
                />
                <Legend />
                <Bar dataKey="pending2021" name="FY2021 pending" fill={COLORS.di} />
                <Bar dataKey="pending2022" name="FY2022 pending" fill={COLORS.concurrent} />
                <Bar dataKey="pending2023" name="FY2023 pending" fill={COLORS.ssi} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "backlog-share" && (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={backlogRows} margin={{ top: 8, right: 48, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fy" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  tickFormatter={fmtK}
                  label={{
                    value: "Pending / backlog cases",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 80]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Backlog share %",
                    angle: 90,
                    position: "insideRight",
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    if (String(name).includes("share")) return [`${n}%`, "Backlog share"];
                    return [fmtInt(n), String(name)];
                  }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="pending"
                  name="Total pending"
                  fill={COLORS.pending}
                  fillOpacity={0.15}
                  stroke={COLORS.pending}
                  strokeWidth={2}
                />
                <Bar
                  yAxisId="left"
                  dataKey="backlogCases"
                  name="Est. backlog cases"
                  fill={COLORS.backlog}
                  opacity={0.75}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="backlogSharePct"
                  name="Backlog share %"
                  stroke={COLORS.wait}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <figcaption className="border-t border-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-500 sm:px-5">
        {SOURCE_NOTE} Offices in cloud: {OFFICE_SCATTER.length}
        {region !== "all" ? ` · filter ${region}` : ""}. Scatter uses estimated office-level
        NetStat samples; national path through FY2023 is Supplement-disclosed.
      </figcaption>
    </figure>
  );
}
