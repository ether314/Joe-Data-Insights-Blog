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
  CLEARANCE_SCENARIOS,
  DENVER_PATH,
  HEADLINE,
  INVENTORY_REVISIONS,
  PACE_BAND_COLORS,
  PACE_SCATTER,
  REQUIRED_RATE_BANDS,
  SOURCE_NOTE,
  UTILITY_PACE,
  type PaceBand,
} from "@/data/lead-pipe-replacement-pace-versus-inventory-2026-data";

type Panel =
  | "clearance"
  | "utility-years"
  | "pace-scatter"
  | "inventory-revision"
  | "required-rates"
  | "denver-path";

type ScenarioFocus = "all" | "lcri" | "slow" | "mid";
type BandFilter = "all" | PaceBand;

const COLORS = {
  slow: "#f97316",
  mid: "#0ea5e9",
  lcri: "#14b8a6",
  accent: "#38bdf8",
  muted: "#94a3b8",
  grid: "#e2e8f0",
  denver: "#6366f1",
};

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  clearance: {
    title: "National stock under 2% / 5% / 10% annual clearance",
    subtitle:
      "Starting from EPA’s ~4M lead+GRR lines — linear share of starting stock each year (illustrative)",
  },
  "utility-years": {
    title: "Years to clear at disclosed city paces",
    subtitle:
      "Remaining inventory ÷ latest annual replacements — crash programs finish; mega-inventories stretch decades",
  },
  "pace-scatter": {
    title: "Remaining inventory vs annual replacements",
    subtitle:
      "Bubble size ≈ years-to-clear — Chicago sits far right; Denver/Pittsburgh closer to the LCRI diagonal",
  },
  "inventory-revision": {
    title: "National inventory estimates revised downward",
    subtitle:
      "DWINSA LSL need (~9M) → LCRR inventory synthesis (~4M lead+GRR requiring replacement)",
  },
  "required-rates": {
    title: "What each national pace band actually means",
    subtitle:
      "Lines per year at 4M stock and calendar years to clear if the rate holds",
  },
  "denver-path": {
    title: "Denver Water: replacements and annual rate",
    subtitle:
      "Program years 2020–2024 — bars = lines replaced; line = annual replacement rate %",
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
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function ControlChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function fmtLines(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 100) / 10}k`;
  return String(n);
}

export function LeadPipeReplacementPaceVersusInventory2026Dashboard({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const [panel, setPanel] = useState<Panel>("clearance");
  const [scenarioFocus, setScenarioFocus] = useState<ScenarioFocus>("all");
  const [bandFilter, setBandFilter] = useState<BandFilter>("all");

  const meta = PANEL_META[panel];

  const utilityRows = useMemo(() => {
    const base = UTILITY_PACE.filter((r) => r.remainingLines > 0 || r.paceBand === "crash");
    const filtered =
      bandFilter === "all" ? base : base.filter((r) => r.paceBand === bandFilter);
    return [...filtered].sort((a, b) => b.yearsAtPace - a.yearsAtPace);
  }, [bandFilter]);

  const scatterRows = useMemo(() => {
    if (bandFilter === "all") return PACE_SCATTER;
    return PACE_SCATTER.filter((r) => r.paceBand === bandFilter);
  }, [bandFilter]);

  const clearanceRows = CLEARANCE_SCENARIOS;

  return (
    <div
      className={embedded ? "space-y-4" : "space-y-6"}
      data-viz="lead-pipe-replacement-pace-versus-inventory-2026"
    >
      <div className="flex flex-wrap gap-2">
        <ControlChip active={panel === "clearance"} onClick={() => setPanel("clearance")}>
          Clearance paths
        </ControlChip>
        <ControlChip
          active={panel === "utility-years"}
          onClick={() => setPanel("utility-years")}
        >
          City years-to-clear
        </ControlChip>
        <ControlChip
          active={panel === "pace-scatter"}
          onClick={() => setPanel("pace-scatter")}
        >
          Pace scatter
        </ControlChip>
        <ControlChip
          active={panel === "inventory-revision"}
          onClick={() => setPanel("inventory-revision")}
        >
          Inventory revision
        </ControlChip>
        <ControlChip
          active={panel === "required-rates"}
          onClick={() => setPanel("required-rates")}
        >
          Required rate bands
        </ControlChip>
        <ControlChip
          active={panel === "denver-path"}
          onClick={() => setPanel("denver-path")}
        >
          Denver path
        </ControlChip>
      </div>

      {(panel === "clearance" || panel === "required-rates") && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Scenario focus
          </span>
          <ControlChip
            active={scenarioFocus === "all"}
            onClick={() => setScenarioFocus("all")}
          >
            All paces
          </ControlChip>
          <ControlChip
            active={scenarioFocus === "slow"}
            onClick={() => setScenarioFocus("slow")}
          >
            2% slow
          </ControlChip>
          <ControlChip
            active={scenarioFocus === "mid"}
            onClick={() => setScenarioFocus("mid")}
          >
            5% mid
          </ControlChip>
          <ControlChip
            active={scenarioFocus === "lcri"}
            onClick={() => setScenarioFocus("lcri")}
          >
            10% LCRI
          </ControlChip>
        </div>
      )}

      {(panel === "utility-years" || panel === "pace-scatter") && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Pace band
          </span>
          <ControlChip active={bandFilter === "all"} onClick={() => setBandFilter("all")}>
            All bands
          </ControlChip>
          <ControlChip
            active={bandFilter === "crash"}
            onClick={() => setBandFilter("crash")}
          >
            Crash
          </ControlChip>
          <ControlChip
            active={bandFilter === "on-track"}
            onClick={() => setBandFilter("on-track")}
          >
            On-track
          </ControlChip>
          <ControlChip
            active={bandFilter === "behind"}
            onClick={() => setBandFilter("behind")}
          >
            Behind
          </ControlChip>
          <ControlChip
            active={bandFilter === "multi-decade"}
            onClick={() => setBandFilter("multi-decade")}
          >
            Multi-decade
          </ControlChip>
        </div>
      )}

      <ChartCard title={meta.title} subtitle={meta.subtitle}>
        {panel === "clearance" && (
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={clearanceRows} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(v) => fmtLines(Number(v))}
                  tick={{ fontSize: 12 }}
                  width={48}
                />
                <Tooltip
                  formatter={(value) => fmtLines(Number(value ?? 0))}
                />
                <Legend />
                {(scenarioFocus === "all" || scenarioFocus === "slow") && (
                  <Area
                    type="monotone"
                    dataKey="remainingAt2Pct"
                    name="2% / year"
                    stroke={COLORS.slow}
                    fill={COLORS.slow}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                )}
                {(scenarioFocus === "all" || scenarioFocus === "mid") && (
                  <Line
                    type="monotone"
                    dataKey="remainingAt5Pct"
                    name="5% / year"
                    stroke={COLORS.mid}
                    strokeWidth={2.5}
                    dot={false}
                  />
                )}
                {(scenarioFocus === "all" || scenarioFocus === "lcri") && (
                  <Line
                    type="monotone"
                    dataKey="remainingAt10Pct"
                    name="10% LCRI-like"
                    stroke={COLORS.lcri}
                    strokeWidth={2.5}
                    dot={false}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "utility-years" && (
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={utilityRows}
                margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Years at current / planned annual pace",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="metro"
                  width={110}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value) => [`${value} years at current / planned pace`, "Years to clear"]}
                />
                <Bar dataKey="yearsAtPace" name="Years to clear" radius={[0, 4, 4, 0]}>
                  {utilityRows.map((row) => (
                    <Cell key={row.metro} fill={PACE_BAND_COLORS[row.paceBand]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "pace-scatter" && (
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="remainingLines"
                  name="Remaining"
                  tickFormatter={(v) => fmtLines(Number(v))}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Remaining lead+GRR lines",
                    position: "insideBottom",
                    offset: -4,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="annualReplacements"
                  name="Annual"
                  tickFormatter={(v) => fmtLines(Number(v))}
                  tick={{ fontSize: 11 }}
                  width={48}
                  label={{
                    value: "Annual replacements",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="yearsAtPace" range={[60, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    const n = String(name);
                    if (n === "remainingLines" || n === "Remaining")
                      return [fmtLines(Number(value ?? 0)), "Remaining"];
                    if (n === "annualReplacements" || n === "Annual")
                      return [fmtLines(Number(value ?? 0)), "Annual pace"];
                    return [value as number | string, n];
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as (typeof scatterRows)[0] | undefined;
                    return p
                      ? `${p.utility} · ~${p.yearsAtPace} years`
                      : "";
                  }}
                />
                <Scatter data={scatterRows} name="Utilities">
                  {scatterRows.map((row) => (
                    <Cell key={row.utility} fill={PACE_BAND_COLORS[row.paceBand]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "inventory-revision" && (
          <div className="h-[340px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={INVENTORY_REVISIONS}
                margin={{ top: 8, right: 12, left: 0, bottom: 40 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Millions of lines",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  formatter={(value) => [
                    `${value}M lead+GRR (est.)`,
                    "Inventory",
                  ]}
                />
                <Bar
                  dataKey="leadGrrMillions"
                  name="Lead+GRR millions"
                  fill={COLORS.accent}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "required-rates" && (
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={
                  scenarioFocus === "all"
                    ? REQUIRED_RATE_BANDS
                    : REQUIRED_RATE_BANDS.filter((r) => {
                        if (scenarioFocus === "slow") return r.sharePct === 2;
                        if (scenarioFocus === "mid") return r.sharePct === 5;
                        if (scenarioFocus === "lcri") return r.sharePct === 10;
                        return true;
                      })
                }
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="band" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="lines"
                  tickFormatter={(v) => fmtLines(Number(v))}
                  tick={{ fontSize: 11 }}
                  width={48}
                />
                <YAxis
                  yAxisId="years"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  width={40}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="lines"
                  dataKey="linesPerYearAt4M"
                  name="Lines / year @ 4M"
                  fill={COLORS.mid}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="years"
                  type="monotone"
                  dataKey="yearsToClear"
                  name="Years to clear"
                  stroke={COLORS.slow}
                  strokeWidth={2.5}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {panel === "denver-path" && (
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={DENVER_PATH} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="count"
                  tickFormatter={(v) => fmtLines(Number(v))}
                  tick={{ fontSize: 11 }}
                  width={44}
                />
                <YAxis
                  yAxisId="rate"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  unit="%"
                  width={44}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="count"
                  dataKey="replacements"
                  name="Replacements"
                  fill={COLORS.denver}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="rate"
                  type="monotone"
                  dataKey="annualRatePct"
                  name="Annual rate %"
                  stroke={COLORS.lcri}
                  strokeWidth={2.5}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      <p className="text-xs leading-relaxed text-slate-500">
        Headline stock: ~{HEADLINE.nationalLeadGrrMillions}M lead+GRR lines (EPA 2025
        inventory synthesis). LCRI-like 10% implies ~{fmtLines(HEADLINE.lcriImpliedAnnualLines)}{" "}
        lines/year (~{HEADLINE.lcriImpliedMilesPerYear} mi/yr at {HEADLINE.meanLineFeet} ft mean).{" "}
        {SOURCE_NOTE}
      </p>
    </div>
  );
}
