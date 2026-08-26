"use client";

import { useMemo, useState } from "react";
import {
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
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  AGE_BANDS,
  CHAMBER_SLICES,
  HEADLINE,
  SOURCE_NOTE,
  TRAFFIC_BINS,
  VIZ_MARKERS,
  buildAgeBands,
  buildRiverSummaries,
  buildTrafficBins,
  filterLocks,
  fmtHrs,
  pearsonAgeDelay,
  type AgeBandId,
  type ChamberId,
  type RiverId,
} from "@/data/ohio-and-mississippi-lock-age-versus-delay-hours-2026-data";

// viz-types: age-delay scatter bubbles, median-delay age-band bars,
// river dual-metric composed bars+line, chamber delay pie,
// traffic-bin horizontal bars
// | layout: default
// smoke-marker: Age–delay scatter cloud

type ViewId = "scatter" | "bands" | "rivers" | "chambers" | "traffic";
type RiverFilter = RiverId | "all";
type ChamberFilter = ChamberId | "all";

const OHIO = "#0ea5e9";
const MISS = "#f59e0b";
const SLATE = "#64748b";
const EMERALD = "#059669";
const ROSE = "#e11d48";
const INDIGO = "#6366f1";

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "scatter", label: "Scatter cloud" },
  { id: "bands", label: "Age bands" },
  { id: "rivers", label: "River contrast" },
  { id: "chambers", label: "Chambers" },
  { id: "traffic", label: "Traffic bins" },
];

const RIVERS: { id: RiverFilter; label: string }[] = [
  { id: "all", label: "Both rivers" },
  { id: "ohio", label: "Ohio only" },
  { id: "mississippi", label: "Mississippi only" },
];

const CHAMBERS: { id: ChamberFilter; label: string }[] = [
  { id: "all", label: "All chambers" },
  { id: "single-600", label: "Single 600′" },
  { id: "twin-1200", label: "Twin 1,200′" },
  { id: "mixed", label: "Mixed" },
];

const BAND_COLORS: Record<AgeBandId, string> = {
  "under-40": EMERALD,
  "40-59": OHIO,
  "60-79": ROSE,
  "80-plus": MISS,
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

export function OhioAndMississippiLockAgeVersusDelayHours2026Dashboard() {
  const [view, setView] = useState<ViewId>("scatter");
  const [river, setRiver] = useState<RiverFilter>("all");
  const [chamber, setChamber] = useState<ChamberFilter>("all");

  const rows = useMemo(
    () => filterLocks(river, chamber),
    [river, chamber],
  );

  const scatterOhio = useMemo(
    () =>
      rows
        .filter((r) => r.river === "ohio")
        .map((r) => ({
          name: r.name,
          ageYears: r.ageYears,
          delayHrs: r.delayHrs,
          lockagesK: r.lockagesK,
        })),
    [rows],
  );

  const scatterMiss = useMemo(
    () =>
      rows
        .filter((r) => r.river === "mississippi")
        .map((r) => ({
          name: r.name,
          ageYears: r.ageYears,
          delayHrs: r.delayHrs,
          lockagesK: r.lockagesK,
        })),
    [rows],
  );

  const bands = useMemo(() => buildAgeBands(rows), [rows]);
  const rivers = useMemo(() => buildRiverSummaries(rows), [rows]);
  const traffic = useMemo(() => buildTrafficBins(rows), [rows]);
  const corr = useMemo(() => pearsonAgeDelay(rows), [rows]);

  const chamberPie = useMemo(() => {
    const base =
      river === "all"
        ? CHAMBER_SLICES
        : CHAMBER_SLICES.map((s) => {
            const subset = rows.filter((r) => r.chamber === s.chamber);
            if (subset.length === 0) return { ...s, n: 0, medianDelay: 0 };
            const delays = subset.map((r) => r.delayHrs).sort((a, b) => a - b);
            const m = Math.floor(delays.length / 2);
            const med =
              delays.length % 2
                ? delays[m]!
                : (delays[m - 1]! + delays[m]!) / 2;
            return {
              ...s,
              n: subset.length,
              medianDelay: Math.round(med * 100) / 100,
            };
          }).filter((s) => s.n > 0);
    return base.map((s) => ({
      name: s.label,
      value: s.medianDelay,
      n: s.n,
    }));
  }, [river, rows]);

  const riverChart = rivers.map((r) => ({
    label: r.label,
    medianAge: r.medianAge,
    medianDelay: r.medianDelay,
  }));

  const pieColors = [OHIO, MISS, EMERALD, INDIGO, ROSE];

  return (
    <div
      data-viz="ohio-and-mississippi-lock-age-versus-delay-hours-2026"
      className="space-y-4"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-sky-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
          {VIZ_MARKERS[0]} · CY{HEADLINE.delayYear} LPMS window
        </p>
        <p className="mt-1 text-lg font-semibold text-slate-900">
          Mid-age Ohio chambers out-delay the oldest Mississippi locks: 60–79 yr
          band median {fmtHrs(HEADLINE.band60MedianDelay)} vs 80+ band{" "}
          {fmtHrs(HEADLINE.band80MedianDelay)} ({HEADLINE.midVsOldRatio}×)
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Panel of {rows.length} mainstem locks (filterable). Age–delay Pearson r ={" "}
          {corr.toFixed(2)}. Highest delay: {HEADLINE.highestDelayName} (
          {fmtHrs(HEADLINE.highestDelay)}, age {HEADLINE.highestDelayAge}), not
          the oldest ({HEADLINE.oldestName}, {HEADLINE.oldestAge} yrs →{" "}
          {fmtHrs(HEADLINE.oldestDelay)}).
        </p>
        <p className="mt-2 text-[11px] text-slate-500">
          Markers: {VIZ_MARKERS.join(" · ")}
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
        <ControlRow label="River">
          {RIVERS.map((r) => (
            <ToggleBtn
              key={r.id}
              active={river === r.id}
              onClick={() => setRiver(r.id)}
            >
              {r.label}
            </ToggleBtn>
          ))}
        </ControlRow>
        <ControlRow label="Chamber">
          {CHAMBERS.map((c) => (
            <ToggleBtn
              key={c.id}
              active={chamber === c.id}
              onClick={() => setChamber(c.id)}
            >
              {c.label}
            </ToggleBtn>
          ))}
        </ControlRow>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {(view === "scatter" || view === "bands") && (
          <ChartCard
            title={VIZ_MARKERS[0]}
            subtitle="Bubble size ≈ annual lockages (thousands). Color by river."
          >
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="ageYears"
                  name="Age"
                  unit=" yrs"
                  domain={[0, 120]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Lock age (years)",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 11,
                    fill: SLATE,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="delayHrs"
                  name="Delay"
                  unit=" h"
                  domain={[0, 3.2]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Avg delay hrs / lockage",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    fontSize: 11,
                    fill: SLATE,
                  }}
                />
                <ZAxis type="number" dataKey="lockagesK" range={[40, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload as {
                      name: string;
                      ageYears: number;
                      delayHrs: number;
                      lockagesK: number;
                    };
                    return (
                      <div className="rounded border border-slate-200 bg-white px-2 py-1 text-xs shadow">
                        <div className="font-semibold">{d.name}</div>
                        <div>
                          Age {d.ageYears} · Delay {fmtHrs(d.delayHrs)}
                        </div>
                        <div>{d.lockagesK}k lockages</div>
                      </div>
                    );
                  }}
                />
                <Legend />
                {scatterOhio.length > 0 && (
                  <Scatter name="Ohio" data={scatterOhio} fill={OHIO} />
                )}
                {scatterMiss.length > 0 && (
                  <Scatter name="Mississippi" data={scatterMiss} fill={MISS} />
                )}
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {(view === "scatter" || view === "bands") && (
          <ChartCard
            title={VIZ_MARKERS[1]}
            subtitle="Desk medians of average delay hours per lockage by age band."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bands.length ? bands : AGE_BANDS}
                margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Median delay (h)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    fontSize: 11,
                    fill: SLATE,
                  }}
                />
                <Tooltip
                  formatter={(v) => [
                    typeof v === "number" ? fmtHrs(v) : String(v),
                    "Median delay",
                  ]}
                />
                <Bar dataKey="medianDelay" name="Median delay" radius={[4, 4, 0, 0]}>
                  {(bands.length ? bands : AGE_BANDS).map((b) => (
                    <Cell key={b.id} fill={BAND_COLORS[b.id]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {(view === "rivers" || view === "chambers") && (
          <ChartCard
            title={VIZ_MARKERS[2]}
            subtitle="Median age (bars) vs median delay hours (line) by river."
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={riverChart}
                margin={{ top: 8, right: 12, bottom: 8, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="age"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Median age (yrs)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 8,
                    fontSize: 11,
                    fill: SLATE,
                  }}
                />
                <YAxis
                  yAxisId="delay"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  domain={[0, 3]}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="age"
                  dataKey="medianAge"
                  name="Median age"
                  fill={INDIGO}
                  radius={[4, 4, 0, 0]}
                  barSize={48}
                />
                <Line
                  yAxisId="delay"
                  type="monotone"
                  dataKey="medianDelay"
                  name="Median delay (h)"
                  stroke={ROSE}
                  strokeWidth={2.5}
                  dot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {(view === "rivers" || view === "chambers") && (
          <ChartCard
            title="Median delay by chamber layout"
            subtitle="Pie sized by median delay hours; hover for lock count."
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chamberPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) =>
                    `${name}: ${typeof value === "number" ? value.toFixed(2) : value}h`
                  }
                >
                  {chamberPie.map((_, i) => (
                    <Cell
                      key={`c-${i}`}
                      fill={pieColors[i % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, _n, item) => {
                    const n = (item?.payload as { n?: number })?.n;
                    return [
                      typeof v === "number" ? fmtHrs(v) : String(v),
                      n != null ? `Median delay (n=${n})` : "Median delay",
                    ];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {view === "traffic" && (
          <ChartCard
            title="Median delay by traffic intensity"
            subtitle="Annual lockages (thousands) bins — traffic, not age, sorts delay."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={traffic.length ? traffic : TRAFFIC_BINS}
                margin={{ top: 8, right: 16, bottom: 8, left: 16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={100}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v) => [
                    typeof v === "number" ? fmtHrs(v) : String(v),
                    "Median delay",
                  ]}
                />
                <Bar
                  dataKey="medianDelay"
                  name="Median delay"
                  fill={OHIO}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {view === "traffic" && (
          <ChartCard
            title="Median age inside each traffic bin"
            subtitle="High-traffic bins are not the oldest — Melvin Price is young and busy."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={traffic.length ? traffic : TRAFFIC_BINS}
                margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar
                  dataKey="medianAge"
                  name="Median age (yrs)"
                  fill={MISS}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>

      <p className="text-[11px] leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
