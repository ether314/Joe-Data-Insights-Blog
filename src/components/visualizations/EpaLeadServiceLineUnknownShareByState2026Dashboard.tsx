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
  Legend,
  Line,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  HEADLINE,
  INVENTORY_VINTAGE,
  NATIONAL_MATERIALS,
  SOURCE_NOTE,
  fmtK,
  regionRollup,
  sortedStates,
  unknownConcentration,
  type RegionFilter,
  type SortMetric,
} from "@/data/epa-lead-service-line-unknown-share-by-state-2026-data";

// viz-types: unknown-share bars, material stacked bars, unknown×lead scatter, vintage dual-line, region rollup bars, unknown concentration cumulative | layout: default

type ViewId =
  | "unknown-share"
  | "material-mix"
  | "scatter"
  | "vintage"
  | "regions"
  | "concentration";

const SLUG = "epa-lead-service-line-unknown-share-by-state-2026";
const UNKNOWN = "#b45309";
const LEAD = "#be123c";
const GRR = "#c2410c";
const NONLEAD = "#0e7490";
const PROJECTED = "#7c3aed";
const REGION_COLORS: Record<string, string> = {
  Northeast: "#7c3aed",
  Midwest: "#be123c",
  South: "#b45309",
  West: "#0e7490",
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

export function EpaLeadServiceLineUnknownShareByState2026Dashboard() {
  const [view, setView] = useState<ViewId>("unknown-share");
  const [region, setRegion] = useState<RegionFilter>("All");
  const [metric, setMetric] = useState<SortMetric>("unknownShare");

  const ladder = useMemo(
    () => sortedStates(metric, region, 18),
    [metric, region],
  );
  const mixRows = useMemo(
    () =>
      sortedStates("unknownCount", region, 12).map((s) => ({
        abbr: s.abbr,
        Lead: +s.leadK.toFixed(0),
        GRR: +s.grrK.toFixed(0),
        Unknown: +s.unknownK.toFixed(0),
        "Non-lead": +s.nonLeadK.toFixed(0),
      })),
    [region],
  );
  const scatterRows = useMemo(
    () =>
      sortedStates("projectedLead", region, 40).map((s) => ({
        abbr: s.abbr,
        unknownShare: s.unknownShare,
        confirmed: s.confirmedLeadGrr,
        projected: s.projectedLeadGrrK,
        unknownK: s.unknownK,
        region: s.region,
      })),
    [region],
  );
  const regions = useMemo(() => regionRollup(), []);
  const cumUnknown = useMemo(() => unknownConcentration(), []);

  return (
    <div className="w-full min-w-0 space-y-4" data-viz={SLUG}>
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 px-5 py-5 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300/90">
          EPA LCRR inventories · unknown-material share
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {HEADLINE.unknownLinesM}M lines still unknown —{" "}
          {HEADLINE.unknownSharePct}% of reported inventory
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Confirmed lead + GRR sits near {HEADLINE.confirmedLeadGrrM}M; EPA
          projects ~{HEADLINE.projectedLeadGrrM}M after prorating unknowns.
          Pennsylvania and Texas alone hold ~{HEADLINE.paUnknownM}M and ~
          {HEADLINE.txUnknownM}M unknowns. Top-10 projected states carry{" "}
          {HEADLINE.top10ConfirmedSharePct}% of confirmed lead+GRR.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={view}
          onChange={setView}
          options={[
            { id: "unknown-share", label: "Unknown share" },
            { id: "material-mix", label: "Material mix" },
            { id: "scatter", label: "Unknown × lead" },
            { id: "vintage", label: "Survey→inventory" },
            { id: "regions", label: "Region rollup" },
            { id: "concentration", label: "Unknown stack" },
          ]}
        />
        <ToggleGroup
          label="Region"
          value={region}
          onChange={setRegion}
          options={[
            { id: "All", label: "All regions" },
            { id: "Midwest", label: "Midwest" },
            { id: "Northeast", label: "Northeast" },
            { id: "South", label: "South" },
            { id: "West", label: "West" },
          ]}
        />
      </div>

      {(view === "unknown-share" || view === "material-mix") && (
        <ToggleGroup
          label="Rank by"
          value={metric}
          onChange={setMetric}
          options={[
            { id: "unknownShare", label: "Unknown %" },
            { id: "unknownCount", label: "Unknown count" },
            { id: "projectedLead", label: "Projected LSL+GRR" },
            { id: "confirmedLead", label: "Confirmed LSL+GRR" },
            { id: "leadBurden", label: "Lead burden %" },
          ]}
        />
      )}

      {view === "unknown-share" && (
        <ChartCard
          title="Unknown-material share by state"
          subtitle="Share of reported service lines still classified lead-status unknown (panel)"
        >
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ladder}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  unit="%"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <YAxis
                  type="category"
                  dataKey="abbr"
                  width={36}
                  tick={{ fontSize: 11, fill: "#334155" }}
                />
                <Tooltip
                  formatter={(v) => [`${Number(v).toFixed(1)}%`, "Unknown share"]}
                />
                <Bar dataKey="unknownShare" name="Unknown %" radius={[0, 4, 4, 0]}>
                  {ladder.map((row) => (
                    <Cell
                      key={row.abbr}
                      fill={REGION_COLORS[row.region] ?? UNKNOWN}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "material-mix" && (
        <ChartCard
          title="Material mix — top unknown-count states"
          subtitle="Stacked thousands of lines: lead, GRR, unknown, non-lead"
        >
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mixRows}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="abbr" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Lead" stackId="a" fill={LEAD} />
                <Bar dataKey="GRR" stackId="a" fill={GRR} />
                <Bar dataKey="Unknown" stackId="a" fill={UNKNOWN} />
                <Bar dataKey="Non-lead" stackId="a" fill={NONLEAD} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Unknown share vs confirmed lead + GRR"
          subtitle="Bubble size = unknown count (thousands). Color = census region."
        >
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 20, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="unknownShare"
                  name="Unknown %"
                  unit="%"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  label={{
                    value: "Unknown share (%)",
                    position: "insideBottom",
                    offset: -4,
                    style: { fill: "#64748b", fontSize: 11 },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="confirmed"
                  name="Confirmed LSL+GRR (k)"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  label={{
                    value: "Confirmed LSL+GRR (k)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#64748b", fontSize: 11 },
                  }}
                />
                <ZAxis type="number" dataKey="unknownK" range={[40, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => [
                    typeof v === "number" ? v.toFixed(1) : v,
                    String(name),
                  ]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.abbr
                      ? String(payload[0].payload.abbr)
                      : ""
                  }
                />
                <Scatter data={scatterRows} name="States">
                  {scatterRows.map((row) => (
                    <Cell
                      key={row.abbr}
                      fill={REGION_COLORS[row.region] ?? UNKNOWN}
                      fillOpacity={0.75}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "vintage" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Survey → inventory path"
            subtitle="Reported lead+GRR and EPA/survey projections (millions)"
          >
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={INVENTORY_VINTAGE}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="era" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="reportedLeadGrrM"
                    name="Reported LSL+GRR (M)"
                    fill={LEAD}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="projectedLeadGrrM"
                    name="Projected LSL+GRR (M)"
                    stroke={PROJECTED}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="National material mix"
            subtitle="Late-2025 inventory aggregates (millions of lines)"
          >
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={NATIONAL_MATERIALS}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="material"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip
                    formatter={(v, name) => [
                      `${Number(v).toFixed(2)}${name === "sharePct" ? "%" : "M"}`,
                      name === "sharePct" ? "Share" : "Lines",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="linesM"
                    name="linesM"
                    stroke={NONLEAD}
                    fill={UNKNOWN}
                    fillOpacity={0.35}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600 sm:grid-cols-4">
              {NATIONAL_MATERIALS.map((m) => (
                <li
                  key={m.material}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <div className="font-semibold text-slate-900">{m.material}</div>
                  <div>
                    {m.linesM}M · {m.sharePct}%
                  </div>
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      {view === "regions" && (
        <ChartCard
          title="Census-region rollup"
          subtitle="Unknown share and confirmed vs projected lead+GRR (panel states)"
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={regions}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  unit="%"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="confirmedK"
                  name="Confirmed LSL+GRR (k)"
                  fill={LEAD}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="left"
                  dataKey="projectedK"
                  name="Projected LSL+GRR (k)"
                  fill={PROJECTED}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="unknownShare"
                  name="Unknown share %"
                  stroke={UNKNOWN}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "concentration" && (
        <ChartCard
          title="Where unknowns pile up"
          subtitle="Cumulative share of panel unknown lines by state rank"
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={cumUnknown}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="abbr" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  unit="%"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <Tooltip
                  formatter={(v, name) => [
                    name === "cumSharePct"
                      ? `${Number(v).toFixed(1)}%`
                      : fmtK(Number(v)),
                    String(name),
                  ]}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="unknownK"
                  name="Unknown (k)"
                  fill={UNKNOWN}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cumSharePct"
                  name="Cumulative %"
                  stroke={LEAD}
                  strokeWidth={2.5}
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
