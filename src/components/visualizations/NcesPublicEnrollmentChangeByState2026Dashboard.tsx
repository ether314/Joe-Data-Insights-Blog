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
  BAND_MIX,
  GAP_OUTLIERS,
  HEADLINE,
  NATIONAL_PATH,
  REGION_SUMMARY,
  SOURCE_NOTE,
  STATE_PANEL,
  TOP_GAINS,
  TOP_LOSSES,
  fmtEnroll,
  fmtPct,
  fmtPp,
  statesByBand,
  statesByRegion,
  type BandId,
  type RegionId,
} from "@/data/nces-public-enrollment-change-by-state-2026-data";

// viz-types: national path area+line, diverging state bars, enrollment vs
// school-age scatter, band mix pie, regional composed bars, gap ladder
// | layout: default
// smoke-marker: Enrollment % change 2019–24

type ViewId =
  | "losses"
  | "path"
  | "gap"
  | "bands"
  | "regions"
  | "gains";

type RegionFilter = "all" | RegionId;
type BandFilter = "all" | BandId;

const ROSE = "#e11d48";
const AMBER = "#d97706";
const SLATE = "#64748b";
const EMERALD = "#059669";
const INDIGO = "#4f46e5";
const SKY = "#0284c8";
const NAVY = "#0f172a";

const BAND_COLORS: Record<BandId, string> = {
  "deep-loss": ROSE,
  "moderate-loss": AMBER,
  "near-flat": SLATE,
  gain: EMERALD,
};

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "losses", label: "Biggest losses" },
  { id: "path", label: "National path" },
  { id: "gap", label: "Vs school-age" },
  { id: "bands", label: "Loss bands" },
  { id: "regions", label: "Regions" },
  { id: "gains", label: "Gains" },
];

function ChartCard({
  title,
  subtitle,
  children,
  tall,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  tall?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {subtitle ? (
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      ) : null}
      <div className={`mt-3 w-full ${tall ? "h-[28rem]" : "h-72"}`}>
        {children}
      </div>
    </div>
  );
}

function FilterChip({
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
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function bandColor(pct: number): string {
  if (pct <= -5) return ROSE;
  if (pct <= -2) return AMBER;
  if (pct < 2) return SLATE;
  return EMERALD;
}

export function NcesPublicEnrollmentChangeByState2026Dashboard() {
  const [view, setView] = useState<ViewId>("losses");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [band, setBand] = useState<BandFilter>("all");
  const [sortMode, setSortMode] = useState<"pct" | "gap" | "size">("pct");

  const filtered = useMemo(() => {
    let rows = statesByRegion(region);
    rows = statesByBand(band).filter((s) =>
      region === "all" ? true : s.region === region,
    );
    if (band !== "all" && region !== "all") {
      rows = STATE_PANEL.filter(
        (s) => s.region === region && s.band === band,
      );
    } else if (band !== "all") {
      rows = statesByBand(band);
    } else if (region !== "all") {
      rows = statesByRegion(region);
    } else {
      rows = STATE_PANEL;
    }
    const sorted = [...rows];
    if (sortMode === "pct") {
      sorted.sort((a, b) => a.pct2019_24 - b.pct2019_24);
    } else if (sortMode === "gap") {
      sorted.sort((a, b) => a.gapPp - b.gapPp);
    } else {
      sorted.sort((a, b) => b.enroll2019 - a.enroll2019);
    }
    return sorted;
  }, [region, band, sortMode]);

  const scatterData = useMemo(
    () =>
      filtered.map((s) => ({
        ...s,
        x: s.schoolAgePct2019_22,
        y: s.pct2019_24,
        z: Math.max(60, Math.sqrt(s.enroll2019) / 18),
      })),
    [filtered],
  );

  const lossBars = useMemo(() => {
    const base =
      region === "all" && band === "all"
        ? TOP_LOSSES
        : filtered.slice(0, 12);
    return base.map((s) => ({
      name: s.abbr,
      full: s.state,
      pct: s.pct2019_24,
      enroll2024: s.enroll2024,
      fill: bandColor(s.pct2019_24),
    }));
  }, [filtered, region, band]);

  const gainBars = useMemo(() => {
    const base =
      region === "all" && band === "all"
        ? TOP_GAINS
        : [...filtered].sort((a, b) => b.pct2019_24 - a.pct2019_24).slice(0, 8);
    return base.map((s) => ({
      name: s.abbr,
      full: s.state,
      pct: s.pct2019_24,
      fill: bandColor(s.pct2019_24),
    }));
  }, [filtered, region, band]);

  const gapBars = useMemo(() => {
    const base =
      region === "all" && band === "all"
        ? GAP_OUTLIERS
        : [...filtered].sort((a, b) => a.gapPp - b.gapPp).slice(0, 12);
    return base.map((s) => ({
      name: s.abbr,
      full: s.state,
      gap: s.gapPp,
      enrollPct: s.pct2019_24,
      schoolAgePct: s.schoolAgePct2019_22,
      fill: s.gapPp < -4 ? ROSE : s.gapPp < 0 ? AMBER : EMERALD,
    }));
  }, [filtered, region, band]);

  const pieData = BAND_MIX.map((b) => ({
    name: b.label,
    value: b.count,
    fill: BAND_COLORS[b.id],
  }));

  const regionBars = REGION_SUMMARY.map((r) => ({
    region: r.region,
    pct2019_24: r.pct2019_24,
    pct2023_24: r.pct2023_24,
    enroll2024M: Math.round((r.enroll2024 / 1_000_000) * 100) / 100,
  }));

  return (
    <div
      className="space-y-4"
      data-viz="nces-public-enrollment-change-by-state-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 text-white">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-300">
          Enrollment % change 2019–24
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          U.S. public enrollment{" "}
          <span className="text-rose-300">
            {fmtPct(HEADLINE.usPctChange2019_24)}
          </span>{" "}
          · deepest loss{" "}
          <span className="text-amber-300">
            {HEADLINE.deepestState} {fmtPct(HEADLINE.deepestPct)}
          </span>
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Fall {HEADLINE.baseYear} → fall {HEADLINE.latestYear} CCD totals:{" "}
          {fmtEnroll(HEADLINE.usEnroll2019)} →{" "}
          {fmtEnroll(HEADLINE.usEnroll2024)}. {HEADLINE.statesDownOver4} states
          (incl. D.C.) fell more than 4%; {HEADLINE.statesUp} rose. West{" "}
          {fmtPct(HEADLINE.westPct)}; South {fmtPct(HEADLINE.southPct)}.
        </p>
        <p className="mt-3 text-[11px] text-slate-400">
          National path since 2019 · Enrollment vs school-age gap
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {VIEWS.map((v) => (
          <FilterChip
            key={v.id}
            active={view === v.id}
            onClick={() => setView(v.id)}
          >
            {v.label}
          </FilterChip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500">Region</span>
        {(
          ["all", "Northeast", "Midwest", "South", "West"] as RegionFilter[]
        ).map((r) => (
          <FilterChip
            key={r}
            active={region === r}
            onClick={() => setRegion(r)}
          >
            {r === "all" ? "All" : r}
          </FilterChip>
        ))}
        <span className="ml-2 text-xs font-medium text-slate-500">Band</span>
        {(
          [
            "all",
            "deep-loss",
            "moderate-loss",
            "near-flat",
            "gain",
          ] as BandFilter[]
        ).map((b) => (
          <FilterChip key={b} active={band === b} onClick={() => setBand(b)}>
            {b === "all"
              ? "All"
              : b === "deep-loss"
                ? "Deep ≤−5%"
                : b === "moderate-loss"
                  ? "Mod −5/−2"
                  : b === "near-flat"
                    ? "Flat"
                    : "Gain"}
          </FilterChip>
        ))}
        {(view === "losses" || view === "gap") && (
          <>
            <span className="ml-2 text-xs font-medium text-slate-500">
              Sort
            </span>
            {(
              [
                ["pct", "% change"],
                ["gap", "Gap"],
                ["size", "Size"],
              ] as const
            ).map(([id, label]) => (
              <FilterChip
                key={id}
                active={sortMode === id}
                onClick={() => setSortMode(id)}
              >
                {label}
              </FilterChip>
            ))}
          </>
        )}
      </div>

      {view === "losses" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Steepest public enrollment losses"
            subtitle="Fall 2019 → fall 2024 percent change (CCD Table 203.20)"
            tall
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lossBars}
                layout="vertical"
                margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `${v}%`}
                  domain={["dataMin - 1", 1]}
                />
                <YAxis type="category" dataKey="name" width={36} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => [fmtPct(Number(v)), "Enrollment Δ"]}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.full ?? "")
                  }
                />
                <ReferenceLine x={0} stroke={NAVY} />
                <ReferenceLine
                  x={HEADLINE.usPctChange2019_24}
                  stroke={SKY}
                  strokeDasharray="4 4"
                />
                <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                  {lossBars.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Filtered state ladder"
            subtitle={`${filtered.length} jurisdictions · sort by ${sortMode}`}
            tall
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filtered.slice(0, 20).map((s) => ({
                  name: s.abbr,
                  full: s.state,
                  pct: s.pct2019_24,
                  fill: bandColor(s.pct2019_24),
                }))}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" width={36} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => [fmtPct(Number(v)), "Enrollment Δ"]}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.full ?? "")
                  }
                />
                <ReferenceLine x={0} stroke={NAVY} />
                <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                  {filtered.slice(0, 20).map((s) => (
                    <Cell key={s.abbr} fill={bandColor(s.pct2019_24)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {view === "path" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="National path since 2019"
            subtitle="U.S. public enrollment index (fall 2019 = 100)"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={[...NATIONAL_PATH]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" />
                <YAxis domain={[96, 101]} tickFormatter={(v) => String(v)} />
                <Tooltip
                  formatter={(v, name) =>
                    name === "index"
                      ? [Number(v).toFixed(1), "Index"]
                      : [fmtEnroll(Number(v)), "Enrollment"]
                  }
                />
                <Area
                  type="monotone"
                  dataKey="index"
                  fill="#fecdd3"
                  stroke={ROSE}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="enrollment"
                  stroke={INDIGO}
                  strokeWidth={0}
                  hide
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Headcount path"
            subtitle="Total public PK–12 students, 50 states + D.C."
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={[...NATIONAL_PATH]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" />
                <YAxis
                  domain={[49_000_000, 51_000_000]}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(v) => [fmtEnroll(Number(v)), "Enrollment"]}
                />
                <Area
                  type="monotone"
                  dataKey="enrollment"
                  fill="#c7d2fe"
                  stroke={INDIGO}
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {view === "gap" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Enrollment vs school-age gap"
            subtitle="X = Census 5–17 %Δ 2019–22 · Y = CCD enrollment %Δ 2019–24"
            tall
          >
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="School-age %"
                  tickFormatter={(v) => `${v}%`}
                  label={{
                    value: "School-age %Δ",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Enrollment %"
                  tickFormatter={(v) => `${v}%`}
                />
                <ZAxis type="number" dataKey="z" range={[40, 220]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => {
                    if (name === "y") return [fmtPct(Number(v)), "Enrollment"];
                    if (name === "x") return [fmtPct(Number(v)), "School-age"];
                    return [String(v), String(name)];
                  }}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.state ?? "")
                  }
                />
                <ReferenceLine y={0} stroke={NAVY} />
                <ReferenceLine x={0} stroke={NAVY} />
                <ReferenceLine
                  y={HEADLINE.usPctChange2019_24}
                  stroke={SKY}
                  strokeDasharray="4 4"
                />
                <Scatter data={scatterData}>
                  {scatterData.map((s) => (
                    <Cell key={s.abbr} fill={BAND_COLORS[s.band]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Most negative enrollment–population gaps"
            subtitle="Enrollment %Δ minus school-age %Δ (percentage points)"
            tall
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gapBars} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tickFormatter={(v) => `${v} pp`} />
                <YAxis type="category" dataKey="name" width={36} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => [fmtPp(Number(v)), "Gap"]}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload;
                    if (!p) return "";
                    return `${p.full} · enroll ${fmtPct(p.enrollPct)} · ages 5–17 ${fmtPct(p.schoolAgePct)}`;
                  }}
                />
                <ReferenceLine x={0} stroke={NAVY} />
                <Bar dataKey="gap" radius={[0, 4, 4, 0]}>
                  {gapBars.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {view === "bands" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="How many states in each loss band?"
            subtitle="51 jurisdictions · fall 2019–24 enrollment % change"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {pieData.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, name) => [v, String(name)]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Band counts"
            subtitle="Deep loss ≤ −5% · moderate −5% to −2% · near-flat · gain ≥ +2%"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BAND_MIX}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="id" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} />
                <Tooltip
                  formatter={(v) => [v, "States"]}
                  labelFormatter={(l) =>
                    BAND_MIX.find((b) => b.id === l)?.label ?? String(l)
                  }
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {BAND_MIX.map((b) => (
                    <Cell key={b.id} fill={BAND_COLORS[b.id]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {view === "regions" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Census regions — multi-year change"
            subtitle="Digest region rows · 2019–24 vs latest year-over-year"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionBars}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v, name) => [fmtPct(Number(v)), String(name)]} />
                <Legend />
                <ReferenceLine y={0} stroke={NAVY} />
                <Bar
                  dataKey="pct2019_24"
                  name="2019–24"
                  fill={ROSE}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="pct2023_24"
                  name="2023–24"
                  fill={SKY}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="2024 enrollment by region"
            subtitle="Millions of public PK–12 students"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionBars}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" />
                <YAxis tickFormatter={(v) => `${v}M`} />
                <Tooltip
                  formatter={(v) => [`${Number(v).toFixed(2)}M`, "Enrollment"]}
                />
                <Bar
                  dataKey="enroll2024M"
                  fill={INDIGO}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {view === "gains" && (
        <ChartCard
          title="States that gained (or lost least)"
          subtitle="Top gains fall 2019–24 · only D.C. and North Dakota clear +2%"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gainBars}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `${v}%`} />
              <Tooltip
                formatter={(v) => [fmtPct(Number(v)), "Enrollment Δ"]}
                labelFormatter={(_, payload) =>
                  String(payload?.[0]?.payload?.full ?? "")
                }
              />
              <ReferenceLine y={0} stroke={NAVY} />
              <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                {gainBars.map((d) => (
                  <Cell key={d.name} fill={d.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      <p className="text-[11px] leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
