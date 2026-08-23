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
  BLANK_MIX,
  CAPACITY_TEU,
  CORRIDOR_SUMMARY,
  HEADLINE,
  LANE_SCATTER,
  MONTHLY_TAPE,
  PEAK_BLANK_EVENTS,
  SOURCE_NOTE,
  type TradeLane,
} from "@/data/spot-container-freight-vs-blank-sailings-2026-data";

type SpotMetric = "uswc" | "usec" | "europe" | "med" | "composite";
type Panel = "tape" | "scatter" | "blanks" | "events";

const COLORS = {
  uswc: "#0ea5e9",
  usec: "#2563eb",
  europe: "#059669",
  med: "#d97706",
  blank: "#f59e0b",
  composite: "#64748b",
  accent: "#0f766e",
  muted: "#94a3b8",
};

const LANE_COLORS: Record<TradeLane, string> = {
  uswc: COLORS.uswc,
  usec: COLORS.usec,
  europe: COLORS.europe,
  med: COLORS.med,
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

function spotForMetric(row: (typeof MONTHLY_TAPE)[number], metric: SpotMetric): number {
  if (metric === "uswc") return row.scfiUswc;
  if (metric === "usec") return row.scfiUsec;
  if (metric === "europe") return row.scfiEurope;
  if (metric === "med") return row.scfiMed;
  return row.scfiComposite;
}

function blankForMetric(row: (typeof MONTHLY_TAPE)[number], metric: SpotMetric): number {
  if (metric === "europe") return row.blankEuropePct;
  if (metric === "med") return row.blankMedPct;
  if (metric === "composite") return (row.blankTranspacPct + row.blankEuropePct) / 2;
  return row.blankTranspacPct;
}

const METRIC_LABEL: Record<SpotMetric, string> = {
  uswc: "SCFI USWC $/FEU",
  usec: "SCFI USEC $/FEU",
  europe: "SCFI N. Europe $/TEU",
  med: "SCFI Med $/TEU",
  composite: "SCFI composite",
};

export function SpotContainerFreightVsBlankSailings2026Dashboard() {
  const [metric, setMetric] = useState<SpotMetric>("uswc");
  const [scatterLane, setScatterLane] = useState<TradeLane | "all">("all");
  const [panel, setPanel] = useState<Panel>("tape");
  const [mixWindow, setMixWindow] = useState(BLANK_MIX[1].window);

  const tapeSeries = useMemo(
    () =>
      MONTHLY_TAPE.map((r) => ({
        label: r.label,
        spot: spotForMetric(r, metric),
        blankPct: blankForMetric(r, metric),
      })),
    [metric],
  );

  const scatterData = useMemo(() => {
    const rows =
      scatterLane === "all"
        ? LANE_SCATTER
        : LANE_SCATTER.filter((r) => r.lane === scatterLane);
    return rows.map((r) => ({
      ...r,
      fill: LANE_COLORS[r.lane],
    }));
  }, [scatterLane]);

  const mixRow = BLANK_MIX.find((r) => r.window === mixWindow) ?? BLANK_MIX[0];
  const mixPie = [
    { name: "Transpac EB", value: mixRow.transpacSharePct, fill: COLORS.uswc },
    { name: "Asia–Europe/Med", value: mixRow.asiaEuropeSharePct, fill: COLORS.europe },
    { name: "Transatlantic", value: mixRow.transatlanticSharePct, fill: COLORS.med },
    { name: "Other", value: Math.max(0, mixRow.otherSharePct), fill: COLORS.muted },
  ].filter((d) => d.value > 0);

  const eventBars = [...PEAK_BLANK_EVENTS]
    .sort((a, b) => b.blankPct - a.blankPct)
    .map((e) => ({
      name: e.lane.replace("Asia–", ""),
      blankPct: e.blankPct,
      rateChangePct: e.rateChangePct,
      window: e.window,
    }));

  return (
    <div
      className="space-y-6"
      data-viz="spot-container-freight-vs-blank-sailings-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300/90">
          East–West spot × blank sailings
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          SCFI vs blank-sail %
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Peak Asia–USEC blanks hit ~{HEADLINE.peakBlankUsecPct}% of weekly capacity in the
          May 2025 tariff window; Golden Week FEWB blanks ~{HEADLINE.fewbOctBlankPct}% still
          saw SCFI Europe print near ${HEADLINE.scfiEuropeSoftUsd}/TEU. Blanks buy capacity
          time — they do not lock a rate floor when demand gaps.
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <dt className="text-[11px] uppercase tracking-wide text-slate-400">USEC blank peak</dt>
            <dd className="text-xl font-semibold text-amber-300">{HEADLINE.peakBlankUsecPct}%</dd>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <dt className="text-[11px] uppercase tracking-wide text-slate-400">USWC blank peak</dt>
            <dd className="text-xl font-semibold text-sky-300">{HEADLINE.peakBlankUswcPct}%</dd>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <dt className="text-[11px] uppercase tracking-wide text-slate-400">Europe soft SCFI</dt>
            <dd className="text-xl font-semibold text-emerald-300">${HEADLINE.scfiEuropeSoftUsd}</dd>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <dt className="text-[11px] uppercase tracking-wide text-slate-400">Blank×USWC corr</dt>
            <dd className="text-xl font-semibold text-slate-100">+{ANALYTICS.blankUswcCorr}</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <label className="flex min-w-[10rem] flex-col gap-1 text-xs font-medium text-slate-600">
          Spot metric
          <select
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"
            value={metric}
            onChange={(e) => setMetric(e.target.value as SpotMetric)}
          >
            <option value="uswc">USWC $/FEU</option>
            <option value="usec">USEC $/FEU</option>
            <option value="europe">N. Europe $/TEU</option>
            <option value="med">Med $/TEU</option>
            <option value="composite">SCFI composite</option>
          </select>
        </label>
        <label className="flex min-w-[10rem] flex-col gap-1 text-xs font-medium text-slate-600">
          Scatter lane
          <select
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"
            value={scatterLane}
            onChange={(e) => setScatterLane(e.target.value as TradeLane | "all")}
          >
            <option value="all">All East–West</option>
            <option value="uswc">USWC</option>
            <option value="usec">USEC</option>
            <option value="europe">N. Europe</option>
            <option value="med">Med</option>
          </select>
        </label>
        <label className="flex min-w-[10rem] flex-col gap-1 text-xs font-medium text-slate-600">
          Focus panel
          <select
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"
            value={panel}
            onChange={(e) => setPanel(e.target.value as Panel)}
          >
            <option value="tape">Rate × blank tape</option>
            <option value="scatter">Blank × spot scatter</option>
            <option value="blanks">Blank mix + TEU</option>
            <option value="events">Peak blank events</option>
          </select>
        </label>
        <label className="flex min-w-[12rem] flex-col gap-1 text-xs font-medium text-slate-600">
          Blank-mix window
          <select
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"
            value={mixWindow}
            onChange={(e) => setMixWindow(e.target.value)}
          >
            {BLANK_MIX.map((r) => (
              <option key={r.window} value={r.window}>
                {r.window}
              </option>
            ))}
          </select>
        </label>
      </div>

      {(panel === "tape" || panel === "scatter") && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Spot path with blank share"
            subtitle={`${METRIC_LABEL[metric]} (area) vs blank % of scheduled capacity (line)`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={tapeSeries} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="spot" tick={{ fontSize: 11 }} width={52} />
                  <YAxis
                    yAxisId="blank"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    width={40}
                    unit="%"
                  />
                  <Tooltip />
                  <Legend />
                  <Area
                    yAxisId="spot"
                    type="monotone"
                    dataKey="spot"
                    name="Spot"
                    stroke={COLORS.uswc}
                    fill={COLORS.uswc}
                    fillOpacity={0.25}
                  />
                  <Line
                    yAxisId="blank"
                    type="monotone"
                    dataKey="blankPct"
                    name="Blank %"
                    stroke={COLORS.blank}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Blank share × spot level"
            subtitle="Each point is a month×lane print — high blanks do not always mean high rates"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="blankPct"
                    name="Blank %"
                    unit="%"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis type="number" dataKey="spotUsd" name="Spot $" tick={{ fontSize: 11 }} width={52} />
                  <ZAxis range={[60, 60]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="Lane-months" data={scatterData}>
                    {scatterData.map((d, i) => (
                      <Cell key={`${d.month}-${d.lane}-${i}`} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {(panel === "blanks" || panel === "events") && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Where blanks concentrated"
            subtitle={`${mixWindow} — share of blanked sailings by trade family (scheduled blank ~${mixRow.scheduledBlankPct}%)`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mixPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {mixPie.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Peak blank events vs rate change"
            subtitle="Blank intensity (amber) beside nearby spot % change (teal) — blanks ≠ floor"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventBars} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11 }} width={40} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="blankPct" name="Blank %" fill={COLORS.blank} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="rateChangePct" name="Rate Δ %" fill={COLORS.accent} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Withdrawn capacity (cited windows)"
          subtitle="Tracker-style TEU removals — illustrative scale, not a full year census"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={CAPACITY_TEU}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="lane" width={110} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="blankedTeu" name="TEU blanked" fill={COLORS.usec} radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Corridor soft vs firm spot"
          subtitle="Blank peaks beside soft/firm SCFI-style prints on each East–West leg"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={CORRIDOR_SUMMARY.map((c) => ({
                  corridor: c.corridor.replace("Shanghai → ", ""),
                  soft: c.spotSoftUsd,
                  firm: c.spotFirmUsd,
                  blankPeak: c.blankPeakPct,
                }))}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="corridor" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={48} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="soft" name="Soft spot $" stackId="1" stroke={COLORS.muted} fill={COLORS.muted} fillOpacity={0.35} />
                <Area type="monotone" dataKey="firm" name="Firm spot $" stackId="2" stroke={COLORS.europe} fill={COLORS.europe} fillOpacity={0.35} />
                <Line type="monotone" dataKey="blankPeak" name="Blank peak %" stroke={COLORS.blank} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
