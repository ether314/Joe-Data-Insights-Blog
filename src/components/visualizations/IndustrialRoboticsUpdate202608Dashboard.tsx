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
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  ASP_PATH,
  COBOT_SHARE,
  HEADLINE,
  ORDER_BOOK,
  Q2_MIX,
  SOURCE_NOTE,
  deltasFor,
  fmtAsp,
  fmtMoneyM,
  fmtPct,
  fmtPp,
  fmtUnits,
  industriesFor,
  industryYoyForPeriod,
  type DeltaGroup,
  type IndustryGroup,
  type MetricMode,
} from "@/data/industrial-robotics-update-202608-data";

// viz-types: dual-axis units/value composed, diverging sector bars, cobot share area, ASP×volume scatter | layout: default
// viz-plan: A3 NA order-book vintage Δ vs IFR prelim; value>>units; Auto OEM vs breadth; cobot share fade; period + group + metric controls

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
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              value === o.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const COLORS = {
  units: "#0369a1",
  value: "#be123c",
  asp: "#0f766e",
  up: "#be123c",
  down: "#0369a1",
  cobotUnit: "#f59e0b",
  cobotValue: "#7c3aed",
  auto: "#64748b",
  nonAuto: "#0ea5e9",
};

export function IndustrialRoboticsUpdate202608Dashboard() {
  const [period, setPeriod] = useState<"Q2" | "H1">("Q2");
  const [industryGroup, setIndustryGroup] = useState<IndustryGroup>("All");
  const [deltaGroup, setDeltaGroup] = useState<DeltaGroup>("All");
  const [metric, setMetric] = useState<MetricMode>("value");

  const industries = useMemo(
    () => industriesFor(industryGroup),
    [industryGroup],
  );
  const deltas = useMemo(() => deltasFor(deltaGroup), [deltaGroup]);

  const bookSeries = useMemo(
    () =>
      ORDER_BOOK.map((r) => ({
        label: r.label,
        units: r.units,
        valueM: r.valueM,
        asp: r.asp,
        unitsYoy: r.unitsYoyPct,
        valueYoy: r.valueYoyPct,
      })),
    [],
  );

  const sectorBars = useMemo(
    () =>
      industries
        .map((i) => {
          const yoy = industryYoyForPeriod(i, period);
          return {
            id: i.industry,
            label: i.shortLabel,
            value: yoy,
            fill:
              yoy == null ? "#cbd5e1" : yoy >= 0 ? COLORS.up : COLORS.down,
            group: i.group,
            note: i.note,
            missing: yoy == null,
          };
        })
        .filter((r) => !r.missing)
        .sort((a, b) => (b.value ?? 0) - (a.value ?? 0)),
    [industries, period],
  );

  const deltaBars = useMemo(
    () =>
      [...deltas]
        .map((d) => {
          let display = d.delta;
          if (d.unit === "usd") display = d.delta / 1000;
          return {
            id: d.id,
            label: d.label,
            value: display,
            rawDelta: d.delta,
            unit: d.unit,
            fill: d.delta >= 0 ? COLORS.up : COLORS.down,
            priorValue: d.priorValue,
            newValue: d.newValue,
            priorLabel: d.priorLabel,
            newLabel: d.newLabel,
          };
        })
        .sort((a, b) => b.value - a.value),
    [deltas],
  );

  const cobotArea = useMemo(
    () =>
      COBOT_SHARE.map((c) => ({
        period: c.period,
        unitShare: c.unitSharePct,
        valueShare: c.valueSharePct,
        units: c.units,
        valueM: c.valueM,
      })),
    [],
  );

  const aspScatter = useMemo(
    () =>
      ASP_PATH.map((p) => ({
        label: p.label,
        asp: p.asp,
        units: p.units,
        valueM: p.valueM,
        z: Math.max(80, Math.sqrt(p.valueM) * 8),
        kind: p.kind,
      })),
    [],
  );

  const mixBars = useMemo(
    () =>
      Q2_MIX.map((m) => ({
        label: m.label,
        share: m.sharePct,
        fill: m.tone === "auto" ? COLORS.auto : COLORS.nonAuto,
      })),
    [],
  );

  const metricHint =
    metric === "units"
      ? "Unit growth is modest — the story is elsewhere"
      : metric === "value"
        ? "Order value outruns volume by ~5× in Q2"
        : "Implied ASP jumped ~$9.5k in one quarter";

  return (
    <div
      className="space-y-6"
      data-viz="industrial-robotics-update-202608"
    >
      <div className="rounded-xl border border-rose-200 bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-rose-200/90">
          August 2026 vintage · A3 North America orders vs IFR prelim lens
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-3xl font-bold tabular-nums tracking-tight">
              {fmtPct(HEADLINE.q2ValueYoyPct, 1)}
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Q2 order value YoY · units only{" "}
              {fmtPct(HEADLINE.q2UnitsYoyPct, 1)}
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold tabular-nums tracking-tight">
              {fmtPct(HEADLINE.autoOemH1YoyPct, 0)}
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Auto OEM H1 orders · components{" "}
              {fmtPct(HEADLINE.autoComponentH1YoyPct, 0)}
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold tabular-nums tracking-tight">
              {fmtAsp(HEADLINE.q2Asp)}
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Implied Q2 ASP · ~{fmtPct(HEADLINE.q2AspYoyPct, 0)} vs year-ago
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-400">
          {SOURCE_NOTE}
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Sector period"
          value={period}
          options={[
            { id: "Q2", label: "Q2 YoY" },
            { id: "H1", label: "H1 YoY" },
          ]}
          onChange={setPeriod}
        />
        <ToggleGroup
          label="Industry group"
          value={industryGroup}
          options={[
            { id: "All", label: "All" },
            { id: "auto", label: "Auto" },
            { id: "tech", label: "Tech" },
            { id: "general", label: "General" },
          ]}
          onChange={setIndustryGroup}
        />
        <ToggleGroup
          label="Delta lens"
          value={deltaGroup}
          options={[
            { id: "All", label: "All" },
            { id: "price", label: "Price" },
            { id: "sector", label: "Sector" },
            { id: "mix", label: "Mix" },
            { id: "bridge", label: "Bridge" },
          ]}
          onChange={setDeltaGroup}
        />
        <ToggleGroup
          label="Book metric"
          value={metric}
          options={[
            { id: "units", label: "Units" },
            { id: "value", label: "Value" },
            { id: "asp", label: "ASP" },
          ]}
          onChange={setMetric}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Order book: units vs value"
          subtitle={metricHint}
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={bookSeries}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) =>
                    metric === "asp"
                      ? `$${Math.round(Number(v) / 1000)}k`
                      : fmtUnits(Number(v))
                  }
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}M`}
                  hide={metric === "asp"}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = Number(value);
                    if (name === "ASP") return [fmtAsp(n), "Implied ASP"];
                    if (name === "Value ($M)") return [fmtMoneyM(n), "Order value"];
                    return [fmtUnits(n), "Units"];
                  }}
                />
                <Legend />
                {(metric === "units" || metric === "value") && (
                  <Bar
                    yAxisId="left"
                    dataKey="units"
                    name="Units"
                    fill={COLORS.units}
                    radius={[4, 4, 0, 0]}
                    opacity={metric === "units" ? 1 : 0.35}
                  />
                )}
                {(metric === "value" || metric === "units") && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="valueM"
                    name="Value ($M)"
                    stroke={COLORS.value}
                    strokeWidth={metric === "value" ? 3 : 2}
                    dot={{ r: 4 }}
                  />
                )}
                {metric === "asp" && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="asp"
                    name="ASP"
                    stroke={COLORS.asp}
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title={`Sector order YoY (${period})`}
          subtitle="Auto OEM is H1-only; metals/plastics/other omit missing periods"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sectorBars}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={88}
                  tick={{ fontSize: 11 }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Tooltip
                  formatter={(value) => [fmtPct(Number(value), 0), `${period} YoY`]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {sectorBars.map((r) => (
                    <Cell key={r.id} fill={r.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Vintage deltas"
          subtitle="Price-mix, sector split, cobot share fade, IFR→A3 lens bridge"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={deltaBars}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={140}
                  tick={{ fontSize: 10 }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Tooltip
                  formatter={(value, _n, item) => {
                    const p = item?.payload as (typeof deltaBars)[0] | undefined;
                    if (!p) return [String(value), "Δ"];
                    if (p.unit === "usd")
                      return [fmtAsp(p.rawDelta), "ASP Δ"];
                    if (p.unit === "pp") return [fmtPp(p.rawDelta, 1), "Δ"];
                    if (p.unit === "pct")
                      return [fmtPct(p.rawDelta, 1), "Δ"];
                    return [fmtUnits(p.rawDelta), "Δ"];
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as
                      | (typeof deltaBars)[0]
                      | undefined;
                    if (!p) return "";
                    return `${p.priorLabel} → ${p.newLabel}`;
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {deltaBars.map((r) => (
                    <Cell key={r.id} fill={r.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Cobot share fade"
          subtitle="Unit share falling while total order value climbs — low-cost tier losing mix"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={cobotArea}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 24]}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${Number(value).toFixed(1)}%`,
                    name === "unitShare" ? "Unit share" : "Value share",
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="unitShare"
                  name="Unit share"
                  stroke={COLORS.cobotUnit}
                  fill={COLORS.cobotUnit}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="valueShare"
                  name="Value share"
                  stroke={COLORS.cobotValue}
                  fill={COLORS.cobotValue}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="ASP × order volume"
          subtitle="Bubble size ~ order value; Q2 is the price-mix step"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="units"
                  name="Units"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => fmtUnits(Number(v))}
                />
                <YAxis
                  type="number"
                  dataKey="asp"
                  name="ASP"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`}
                  domain={[55_000, 75_000]}
                />
                <ZAxis type="number" dataKey="z" range={[60, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    if (name === "ASP") return [fmtAsp(Number(value)), "ASP"];
                    if (name === "Units")
                      return [fmtUnits(Number(value)), "Units"];
                    return [String(value), String(name)];
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as
                      | (typeof aspScatter)[0]
                      | undefined;
                    return p
                      ? `${p.label} · ${fmtMoneyM(p.valueM)}`
                      : "";
                  }}
                />
                <Scatter data={aspScatter} fill={COLORS.asp}>
                  {aspScatter.map((p) => (
                    <Cell
                      key={p.label}
                      fill={
                        p.kind === "q2"
                          ? COLORS.value
                          : p.kind === "q1-derived"
                            ? "#94a3b8"
                            : COLORS.asp
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Q2 customer mix"
          subtitle={`${HEADLINE.nonAutoShareQ2Pct}% non-automotive — continuation of FY 2025 majority, not a first crossing`}
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mixBars}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 70]}
                />
                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toFixed(0)}% of Q2 units`,
                    "Share",
                  ]}
                />
                <Bar dataKey="share" radius={[6, 6, 0, 0]}>
                  {mixBars.map((m) => (
                    <Cell key={m.label} fill={m.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
