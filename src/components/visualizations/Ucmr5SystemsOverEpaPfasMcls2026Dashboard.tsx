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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  CO_OCCURRENCE,
  CO_OCCURRENCE_MIXTURE_SHARE_PCT,
  CONTAMINANT_OVER_MCL,
  DETECTION_CONCENTRATION,
  HEADLINE,
  SIZE_TIER_OVER_MCL,
  SOURCE_NOTE,
  STATE_OCCURRENCE,
} from "@/data/ucmr5-systems-over-epa-pfas-mcls-2026-data";

type Panel =
  | "size-tiers"
  | "by-contaminant"
  | "state-occurrence"
  | "co-occurrence"
  | "detection-concentration"
  | "size-vs-rate";

type SizeFocus = "all" | "large" | "medium" | "small";
type StateBand = "all" | "high" | "mid" | "low";

const COLORS = {
  large: "#0ea5e9",
  medium: "#14b8a6",
  small: "#f59e0b",
  national: "#6366f1",
  pfoa: "#38bdf8",
  pfos: "#f97316",
  other: "#94a3b8",
  mix: "#a78bfa",
  grid: "#e2e8f0",
  accent: "#0284c7",
};

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "size-tiers": {
    title: "Share of systems over MCL",
    subtitle:
      "Unique PWSs with ≥1 location average above any April 2024 PFAS NPDWR MCL — EPA UCMR 5 Table 4 (Jan 2026)",
  },
  "by-contaminant": {
    title: "MCL exceedance rates by compound and system size",
    subtitle:
      "PFOA and PFOS dominate; GenX / PFNA / HI remain rare in the reporting set",
  },
  "state-occurrence": {
    title: "State PFAS detection rates (≥UCMR MRL)",
    subtitle:
      "Share of tested systems with any of 29 PFAS at or above the UCMR minimum reporting level — occurrence concentration, not MCL compliance",
  },
  "co-occurrence": {
    title: "PFAS mixtures at sampling locations",
    subtitle: `${CO_OCCURRENCE_MIXTURE_SHARE_PCT}% of locations with ≥1 PFAS ≥ MRL also show multiple PFAS — cumulative N-or-more counts`,
  },
  "detection-concentration": {
    title: "How concentrated are detections among large states?",
    subtitle:
      "Cumulative share of detections vs share of systems tested (states with ≥100 UCMR5 systems in the tracker cut)",
  },
  "size-vs-rate": {
    title: "System size vs any-MCL exceedance rate",
    subtitle:
      "Bubble size ≈ systems with full result sets — large systems sit higher on the exceedance axis",
  },
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
        {subtitle ? (
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{subtitle}</p>
        ) : null}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

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
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
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

export function Ucmr5SystemsOverEpaPfasMcls2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("size-tiers");
  const [sizeFocus, setSizeFocus] = useState<SizeFocus>("all");
  const [stateBand, setStateBand] = useState<StateBand>("all");

  const contaminantBars = useMemo(() => {
    return CONTAMINANT_OVER_MCL.map((row) => {
      let pct = row.overallPct;
      if (sizeFocus === "large") pct = row.largePct;
      if (sizeFocus === "medium") pct = row.mediumPct;
      if (sizeFocus === "small") pct = row.smallPct;
      return {
        name: row.contaminant,
        pct,
        mcl: row.mclLabel,
        fill:
          row.contaminant === "PFOS"
            ? COLORS.pfos
            : row.contaminant === "PFOA"
              ? COLORS.pfoa
              : COLORS.other,
      };
    });
  }, [sizeFocus]);

  const stateRows = useMemo(() => {
    return STATE_OCCURRENCE.filter((s) => {
      if (stateBand === "high") return s.detectionRatePct >= 45;
      if (stateBand === "mid")
        return s.detectionRatePct >= 25 && s.detectionRatePct < 45;
      if (stateBand === "low") return s.detectionRatePct < 25;
      return true;
    }).sort((a, b) => b.detectionRatePct - a.detectionRatePct);
  }, [stateBand]);

  const sizeScatter = useMemo(
    () =>
      SIZE_TIER_OVER_MCL.filter((r) => r.withFullResults != null).map((r) => ({
        name: r.shortLabel,
        rate: r.overMclPct,
        n: r.withFullResults!,
        over: r.overMclCount ?? 0,
      })),
    [],
  );

  const meta = PANEL_META[panel];

  return (
    <div
      data-viz="ucmr5-systems-over-epa-pfas-mcls-2026"
      className="w-full space-y-4"
    >
      <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 px-5 py-4 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-200">
          UCMR 5 × April 2024 PFAS MCLs
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Weighted national: {HEADLINE.weightedNationalOverMclPct}% of systems
          over a PFAS MCL
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200">
          Large systems ({HEADLINE.largeOverMclPct}%) run roughly double the
          small-system rate ({HEADLINE.smallOverMclPct}%). PFOS ~
          {HEADLINE.pfosOverallOverMclPct}% and PFOA ~
          {HEADLINE.pfoaOverallOverMclPct}% drive the footprint; state detection
          rates (≥MRL) stretch from the mid-60s in New Jersey/Connecticut to
          single digits in Mississippi and Hawaii.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <ToggleRow
          label="Panel"
          value={panel}
          onChange={setPanel}
          options={[
            { id: "size-tiers", label: "Size tiers over MCL" },
            { id: "by-contaminant", label: "By contaminant" },
            { id: "state-occurrence", label: "State occurrence" },
            { id: "co-occurrence", label: "Co-occurrence" },
            { id: "detection-concentration", label: "Detection concentration" },
            { id: "size-vs-rate", label: "Size vs rate" },
          ]}
        />
        {panel === "by-contaminant" ? (
          <ToggleRow
            label="Size focus"
            value={sizeFocus}
            onChange={setSizeFocus}
            options={[
              { id: "all", label: "All sizes (overall)" },
              { id: "large", label: "Large only" },
              { id: "medium", label: "Medium only" },
              { id: "small", label: "Small only" },
            ]}
          />
        ) : null}
        {panel === "state-occurrence" ? (
          <ToggleRow
            label="Detection band"
            value={stateBand}
            onChange={setStateBand}
            options={[
              { id: "all", label: "All bands" },
              { id: "high", label: "High (≥45%)" },
              { id: "mid", label: "Mid (25–45%)" },
              { id: "low", label: "Low (<25%)" },
            ]}
          />
        ) : null}
      </div>

      <ChartCard title={meta.title} subtitle={meta.subtitle}>
        {panel === "size-tiers" ? (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={SIZE_TIER_OVER_MCL}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                <XAxis
                  type="number"
                  domain={[0, 18]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="shortLabel"
                  width={78}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(v) => [`${Number(v)}%`, "Over any MCL"]}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="overMclPct" radius={[0, 6, 6, 0]} maxBarSize={36}>
                  {SIZE_TIER_OVER_MCL.map((row) => (
                    <Cell
                      key={row.size}
                      fill={
                        row.shortLabel === "Large"
                          ? COLORS.large
                          : row.shortLabel === "Medium"
                            ? COLORS.medium
                            : row.shortLabel === "Small"
                              ? COLORS.small
                              : COLORS.national
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "by-contaminant" ? (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={contaminantBars}
                margin={{ top: 8, right: 16, left: 0, bottom: 48 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-28}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 12 }}
                  domain={[0, "auto"]}
                />
                <Tooltip
                  formatter={(v, _n, item) => [
                    `${Number(v)}%`,
                    `Over MCL (${(item?.payload as { mcl?: string } | undefined)?.mcl ?? ""})`,
                  ]}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="pct" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {contaminantBars.map((row) => (
                    <Cell key={row.name} fill={row.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "state-occurrence" ? (
          <div className="h-[440px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stateRows}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                <XAxis
                  type="number"
                  domain={[0, 70]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="abbr"
                  width={40}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v, _n, item) => {
                    const p = item?.payload as {
                      detected?: number;
                      tested?: number;
                      state?: string;
                    };
                    return [
                      `${Number(v)}% (${p.detected}/${p.tested} systems)`,
                      p.state ?? "Detection rate",
                    ];
                  }}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar
                  dataKey="detectionRatePct"
                  fill={COLORS.accent}
                  radius={[0, 4, 4, 0]}
                  maxBarSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "co-occurrence" ? (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={CO_OCCURRENCE}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                <XAxis
                  dataKey="minUniquePfas"
                  label={{
                    value: "N or more unique PFAS ≥ MRL",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 11,
                  }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  yAxisId="loc"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Locations",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  yAxisId="pws"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Unique PWSs",
                    angle: 90,
                    position: "insideRight",
                    fontSize: 11,
                  }}
                />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend />
                <Area
                  yAxisId="loc"
                  type="monotone"
                  dataKey="samplingLocations"
                  name="Sampling locations"
                  fill={COLORS.mix}
                  fillOpacity={0.25}
                  stroke={COLORS.mix}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="pws"
                  type="monotone"
                  dataKey="uniquePws"
                  name="Unique PWSs"
                  stroke={COLORS.pfos}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "detection-concentration" ? (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={DETECTION_CONCENTRATION}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(v, name) => [
                    `${Number(v)}%`,
                    name === "cumulativeDetectedSharePct"
                      ? "Cumulative detections"
                      : "Cumulative systems tested",
                  ]}
                  contentStyle={{ fontSize: 12 }}
                />
                <Legend />
                <Area
                  type="stepAfter"
                  dataKey="cumulativeDetectedSharePct"
                  name="Cumulative detections"
                  fill={COLORS.large}
                  fillOpacity={0.2}
                  stroke={COLORS.large}
                  strokeWidth={2}
                />
                <Line
                  type="stepAfter"
                  dataKey="cumulativeTestedSharePct"
                  name="Cumulative systems tested"
                  stroke={COLORS.small}
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {panel === "size-vs-rate" ? (
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 24, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                <XAxis
                  type="number"
                  dataKey="n"
                  name="Systems with full results"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Systems with full UCMR5 results",
                    position: "insideBottom",
                    offset: -4,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="rate"
                  name="Over MCL %"
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 12 }}
                  domain={[0, 18]}
                />
                <ZAxis type="number" dataKey="over" range={[80, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => {
                    if (name === "rate") return [`${Number(v)}%`, "Over any MCL"];
                    if (name === "n")
                      return [Number(v).toLocaleString(), "Full results"];
                    return [String(v), String(name)];
                  }}
                  labelFormatter={(_, payload) =>
                    (payload?.[0]?.payload as { name?: string } | undefined)
                      ?.name ?? ""
                  }
                  contentStyle={{ fontSize: 12 }}
                />
                <Scatter data={sizeScatter} fill={COLORS.national}>
                  {sizeScatter.map((row) => (
                    <Cell
                      key={row.name}
                      fill={
                        row.name === "Large"
                          ? COLORS.large
                          : row.name === "Medium"
                            ? COLORS.medium
                            : COLORS.small
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </ChartCard>

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
