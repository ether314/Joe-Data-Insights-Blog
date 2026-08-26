"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  COMMUTE_SHARES,
  HEADLINE,
  SOURCE_NOTE,
  VIZ_MARKERS,
  filterAgencies,
  fmtIndex,
  modeRadarRows,
  nationalPathSeries,
  scatterPoints,
  sizeBandBars,
  type SizeBandId,
} from "@/data/ntd-unlinked-trips-versus-2019-by-agency-size-2026-data";

// viz-types: national UPT index multi-line, size-band median bars,
// mode recovery radar, agency size-vs-index scatter, commute-share delta bars
// | layout: default
// smoke-marker: UPT index vs 2019 path

type ViewId = "path" | "bands" | "modes" | "scatter" | "commute";
type SizeFilter = SizeBandId | "all";
type ModeFocus = "all" | "bus-heavy" | "rail-heavy";

const TEAL = "#0d9488";
const AMBER = "#d97706";
const INDIGO = "#4f46e5";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const EMERALD = "#059669";

const BAND_COLORS: Record<SizeBandId, string> = {
  mega: ROSE,
  large: INDIGO,
  mid: TEAL,
  small: EMERALD,
};

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "path", label: "UPT index vs 2019 path" },
  { id: "bands", label: "Size-band recovery bars" },
  { id: "modes", label: "Mode recovery radar" },
  { id: "scatter", label: "Agency scatter by size" },
  { id: "commute", label: "Commute-share deltas" },
];

const SIZES: { id: SizeFilter; label: string }[] = [
  { id: "all", label: "All sizes" },
  { id: "mega", label: "Mega" },
  { id: "large", label: "Large" },
  { id: "mid", label: "Mid" },
  { id: "small", label: "Small" },
];

const MODES: { id: ModeFocus; label: string }[] = [
  { id: "all", label: "All agencies" },
  { id: "bus-heavy", label: "Bus-heavy (≥70%)" },
  { id: "rail-heavy", label: "Rail-heavy (≥40%)" },
];

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
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {subtitle ? (
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      ) : null}
      <div className="mt-3 h-72 w-full">{children}</div>
    </div>
  );
}

function ControlRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function ToggleBtn({
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
      className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

export function NtdUnlinkedTripsVersus2019ByAgencySize2026Dashboard() {
  const [view, setView] = useState<ViewId>("path");
  const [size, setSize] = useState<SizeFilter>("all");
  const [modeFocus, setModeFocus] = useState<ModeFocus>("all");

  const rows = useMemo(
    () => filterAgencies(size, modeFocus),
    [size, modeFocus],
  );
  const path = useMemo(() => nationalPathSeries(), []);
  const bands = useMemo(() => sizeBandBars(rows), [rows]);
  const radar = useMemo(() => modeRadarRows(), []);
  const scatter = useMemo(() => scatterPoints(rows), [rows]);
  const commute = useMemo(
    () =>
      COMMUTE_SHARES.map((c) => ({
        area: c.urbanArea.replace(/–.*/, "").replace(/,.*/, ""),
        full: c.urbanArea,
        delta: c.deltaPts,
        share2019: c.share2019Pct,
        share2023: c.share2023Pct,
      })),
    [],
  );

  const panelMedian = useMemo(() => {
    if (rows.length === 0) return HEADLINE.nationalIndex2024;
    const s = [...rows.map((r) => r.indexVs2019)].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m]! : Math.round((s[m - 1]! + s[m]!) / 2);
  }, [rows]);

  const recoveredN = rows.filter((r) => r.atOrAbove2019).length;

  return (
    <div
      className="space-y-4"
      data-viz="ntd-unlinked-trips-versus-2019-by-agency-size-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-teal-50/40 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-teal-800">
          FTA NTD · UPT index vs 2019
        </p>
        <p className="mt-1 text-lg font-semibold text-slate-900">
          National UPT at {HEADLINE.nationalIndex2024} of 2019 · bus{" "}
          {HEADLINE.busIndexDec2024} vs rail {HEADLINE.railIndexDec2024} · mid-size
          median {HEADLINE.midSizeMedianIndex}
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Filtered panel median index {fmtIndex(panelMedian)} · {recoveredN}/
          {rows.length} agencies at or above 2019 · only ~
          {HEADLINE.agenciesAtOrAbove2019Pct}% of the largest 150 recovered
          industry-wide
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3">
        <ControlRow label="View">
          {VIEWS.map((v) => (
            <ToggleBtn
              key={v.id}
              active={view === v.id}
              onClick={() => setView(v.id)}
            >
              {v.label}
            </ToggleBtn>
          ))}
        </ControlRow>
        <ControlRow label="Size band">
          {SIZES.map((s) => (
            <ToggleBtn
              key={s.id}
              active={size === s.id}
              onClick={() => setSize(s.id)}
            >
              {s.label}
            </ToggleBtn>
          ))}
        </ControlRow>
        <ControlRow label="Mode mix">
          {MODES.map((m) => (
            <ToggleBtn
              key={m.id}
              active={modeFocus === m.id}
              onClick={() => setModeFocus(m.id)}
            >
              {m.label}
            </ToggleBtn>
          ))}
        </ControlRow>
      </div>

      <p className="sr-only">{VIZ_MARKERS.join(" · ")}</p>

      {view === "path" ? (
        <ChartCard
          title="UPT index vs 2019 path"
          subtitle="National unlinked trips, 2019 = 100 (NTD / APTA-aligned)"
        >
          <ResponsiveContainer>
            <LineChart data={path} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis
                domain={[0, 110]}
                tick={{ fontSize: 11 }}
                label={{
                  value: "Index",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 11, fill: SLATE },
                }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="allModes"
                name="All modes"
                stroke={SLATE}
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="bus"
                name="Bus"
                stroke={TEAL}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="rail"
                name="Rail"
                stroke={INDIGO}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="demandResponse"
                name="Demand response"
                stroke={AMBER}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "bands" ? (
        <ChartCard
          title="Size-band recovery bars"
          subtitle="Median UPT index vs 2019 by 2019 agency size (filtered panel)"
        >
          <ResponsiveContainer>
            <BarChart data={bands} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 120]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="medianIndex" name="Median index" radius={[6, 6, 0, 0]}>
                {bands.map((b) => (
                  <Cell key={b.id} fill={BAND_COLORS[b.id as SizeBandId]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "modes" ? (
        <ChartCard
          title="Mode recovery radar"
          subtitle="December 2024 UPT as % of December 2019 (APTA)"
        >
          <ResponsiveContainer>
            <RadarChart data={radar} cx="50%" cy="50%" outerRadius="72%">
              <PolarGrid stroke="#cbd5e1" />
              <PolarAngleAxis dataKey="mode" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
              />
              <Radar
                name="Index vs 2019"
                dataKey="index"
                stroke={TEAL}
                fill={TEAL}
                fillOpacity={0.35}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "scatter" ? (
        <ChartCard
          title="Agency scatter by size"
          subtitle="2019 UPT (millions) vs 2024 index — bubble size = bus share"
        >
          <ResponsiveContainer>
            <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="upt2019M"
                name="2019 UPT (M)"
                tick={{ fontSize: 11 }}
                scale="log"
                domain={["auto", "auto"]}
                label={{
                  value: "2019 UPT (millions, log)",
                  position: "insideBottom",
                  offset: -2,
                  style: { fontSize: 11, fill: SLATE },
                }}
              />
              <YAxis
                type="number"
                dataKey="indexVs2019"
                name="Index"
                domain={[40, 140]}
                tick={{ fontSize: 11 }}
              />
              <ZAxis type="number" dataKey="busShare" range={[40, 280]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="Agencies" data={scatter}>
                {scatter.map((p) => (
                  <Cell
                    key={p.name}
                    fill={
                      p.recovered
                        ? EMERALD
                        : BAND_COLORS[p.sizeBand as SizeBandId]
                    }
                    fillOpacity={0.85}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "commute" ? (
        <ChartCard
          title="Commute-share deltas"
          subtitle="ACS public-transit commute share, 2019 → 2023 (percentage points)"
        >
          <ResponsiveContainer>
            <BarChart
              data={commute}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[-7, 1]} tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="area"
                width={88}
                tick={{ fontSize: 11 }}
              />
              <Tooltip />
              <Bar dataKey="delta" name="Δ pts" radius={[0, 4, 4, 0]}>
                {commute.map((c) => (
                  <Cell
                    key={c.full}
                    fill={c.delta >= 0 ? EMERALD : ROSE}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
