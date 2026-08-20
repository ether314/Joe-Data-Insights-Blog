"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  HEADLINE,
  SOURCE_NOTE,
  STAGE_FLIP_DELTAS,
  VINTAGE_ROWS,
  deltaBuckets,
  filterVintage,
  fmtPct,
  fmtPp,
  rankedByAbsDelta,
  relianceSpikes,
  type Direction,
  type Sector,
  type Stage,
} from "@/data/chokepoint-commodities-update-2026-data";

// viz-types: delta waterfall bars, prior→new dumbbell, reliance spike bars, direction pie-proxy bars, stage-flip composed | layout: default
// viz-plan: top-1 Δ ranking; prior vs new levels; US reliance spikes; mine→midstream flips; direction filter counts

type Panel = "deltas" | "levels" | "reliance" | "flips" | "directions";

const DIRECTION_COLORS: Record<Direction, string> = {
  tighter: "#ea580c",
  easier: "#14b8a6",
  flat: "#64748b",
  revised: "#a78bfa",
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
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
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

export function ChokepointCommoditiesUpdateDashboard() {
  const [panel, setPanel] = useState<Panel>("deltas");
  const [stage, setStage] = useState<Stage | "all">("all");
  const [direction, setDirection] = useState<Direction | "all">("all");
  const [sector, setSector] = useState<Sector | "all">("all");

  const filtered = useMemo(
    () => filterVintage(VINTAGE_ROWS, { stage, direction, sector }),
    [stage, direction, sector],
  );

  const deltaBars = useMemo(
    () =>
      rankedByAbsDelta(filtered).map((r) => ({
        name: r.shortLabel,
        delta: r.deltaPp,
        fill: DIRECTION_COLORS[r.direction],
        prior: r.priorTop1Pct,
        neu: r.newTop1Pct,
      })),
    [filtered],
  );

  const levelDumbbell = useMemo(
    () =>
      [...filtered]
        .sort((a, b) => b.newTop1Pct - a.newTop1Pct)
        .map((r) => ({
          name: r.shortLabel,
          prior: r.priorTop1Pct,
          neu: r.newTop1Pct,
          fill: DIRECTION_COLORS[r.direction],
        })),
    [filtered],
  );

  const reliance = useMemo(() => relianceSpikes(0).filter((s) => {
    const row = filtered.find((r) => r.id === s.id);
    return Boolean(row);
  }), [filtered]);

  const flips = useMemo(
    () =>
      STAGE_FLIP_DELTAS.map((f) => ({
        family: f.family,
        mineNew: f.mineNew,
        midNew: f.midNew,
        mineDelta: f.mineNew - f.minePrior,
        midDelta: f.midNew - f.midPrior,
        mineLeader: f.mineLeader,
        midLeader: f.midLeader,
      })),
    [],
  );

  const buckets = useMemo(() => deltaBuckets(), []);

  const scatter = useMemo(
    () =>
      filtered.map((r) => ({
        name: r.shortLabel,
        prior: r.priorTop1Pct,
        neu: r.newTop1Pct,
        delta: r.deltaPp,
        z: Math.abs(r.deltaPp) * 40 + 60,
        fill: DIRECTION_COLORS[r.direction],
      })),
    [filtered],
  );

  return (
    <div className="space-y-6" data-viz="chokepoint-commodities-update-2026">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — {HEADLINE.priorVintage} → {HEADLINE.newVintage}
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Copper refine {fmtPct(HEADLINE.copperRefinePriorPct, 0)} →{" "}
          {fmtPct(HEADLINE.copperRefineNewPct, 1)} ({fmtPp(HEADLINE.copperRefineDeltaPp)}) · US Cu
          reliance {fmtPct(HEADLINE.usCopperReliancePriorPct, 0)} →{" "}
          {fmtPct(HEADLINE.usCopperRelianceNewPct, 0)} ({fmtPp(HEADLINE.usCopperRelianceDeltaPp, 0)})
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Against the research ledger (MCS 2025 / 2024e), MCS 2026 tightens the copper midstream story and
          leaves gallium near {fmtPct(HEADLINE.galliumNewPct, 0)}. Graphite mine share eases slightly (
          {fmtPp(HEADLINE.graphiteMineDeltaPp)}) even as China tons rise; tungsten dilutes on Kazakhstan
          supply; lithium pit concentration falls as world output jumps 31%.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <ToggleGroup
            label="Panel"
            value={panel}
            onChange={setPanel}
            options={[
              { id: "deltas", label: "Top-1 Δ" },
              { id: "levels", label: "Prior → new" },
              { id: "reliance", label: "US reliance" },
              { id: "flips", label: "Mine → mid" },
              { id: "directions", label: "Direction map" },
            ]}
          />
          <div className="flex flex-wrap gap-4">
            <ToggleGroup
              label="Stage"
              value={stage}
              onChange={setStage}
              options={[
                { id: "all", label: "All" },
                { id: "mine", label: "Mine" },
                { id: "midstream", label: "Midstream" },
                { id: "export", label: "Export" },
              ]}
            />
            <ToggleGroup
              label="Direction"
              value={direction}
              onChange={setDirection}
              options={[
                { id: "all", label: "All" },
                { id: "tighter", label: "Tighter" },
                { id: "easier", label: "Easier" },
                { id: "flat", label: "Flat" },
                { id: "revised", label: "Revised" },
              ]}
            />
            <ToggleGroup
              label="Sector"
              value={sector}
              onChange={setSector}
              options={[
                { id: "all", label: "All" },
                { id: "batteries", label: "Batteries" },
                { id: "semiconductors", label: "Chips" },
                { id: "structural", label: "Structural" },
                { id: "magnets", label: "Magnets" },
                { id: "fertilizers", label: "Fertilizer" },
              ]}
            />
          </div>
        </div>
      </div>

      {panel === "deltas" && (
        <ChartCard
          title="Largest top-1 share deltas (pp)"
          subtitle="Signed change vs research baseline — orange = tighter, teal = easier"
        >
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deltaBars} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" unit=" pp" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={88}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value, _n, item) => {
                    const p = item?.payload as { prior?: number; neu?: number };
                    return [
                      `${fmtPp(Number(value))} (${fmtPct(p?.prior ?? 0)} → ${fmtPct(p?.neu ?? 0)})`,
                      "Δ top-1",
                    ];
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="delta" radius={[0, 4, 4, 0]}>
                  {deltaBars.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "levels" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Prior vs new top-1 share"
            subtitle="Grouped bars — research MCS 2025 vs MCS 2026"
          >
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={levelDumbbell} margin={{ left: 4, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-35} textAnchor="end" height={70} />
                  <YAxis unit="%" tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="prior" name="Prior (MCS 2025)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="neu" name="New (MCS 2026)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Prior × new scatter"
            subtitle="Above diagonal = concentration rose; bubble size ∝ |Δ|"
          >
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: 8, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="prior"
                    name="Prior %"
                    unit="%"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="neu"
                    name="New %"
                    unit="%"
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(value, name) => [
                      typeof value === "number" ? value.toFixed(1) : value,
                      String(name),
                    ]}
                    labelFormatter={(_, payload) => {
                      const sorted = sortTooltipPayload(payload);
                      const row = sorted[0]?.payload as { name?: string } | undefined;
                      return row?.name ?? "";
                    }}
                  />
                  <ReferenceLine
                    segment={[
                      { x: 0, y: 0 },
                      { x: 100, y: 100 },
                    ]}
                    stroke="#cbd5e1"
                    strokeDasharray="4 4"
                  />
                  <Scatter data={scatter}>
                    {scatter.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "reliance" && (
        <ChartCard
          title="US net import reliance — vintage move"
          subtitle="MCS salient statistics 2024e → 2025e (filtered stages)"
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={
                  reliance.length
                    ? reliance
                    : [
                        {
                          id: "none",
                          shortLabel: "—",
                          priorPct: 0,
                          newPct: 0,
                          deltaPp: 0,
                        },
                      ]
                }
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="shortLabel" tick={{ fontSize: 11 }} />
                <YAxis unit="%" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="priorPct" name="Prior reliance" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="newPct" name="New reliance" fill="#ea580c" radius={[4, 4, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="deltaPp"
                  name="Δ pp"
                  stroke="#0f172a"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Copper (+12 pp to 57%) and lithium (&gt;50% from ~25%) are the material US-exposure moves in this
            vintage; gallium and graphite remain pinned at 100%.
          </p>
        </ChartCard>
      )}

      {panel === "flips" && (
        <ChartCard
          title="Mine → midstream family flips"
          subtitle="New top-1 shares (bars) with mine/mid Δ markers (lines)"
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={flips} margin={{ left: 4, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="family" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" unit="%" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  unit=" pp"
                  tick={{ fontSize: 11 }}
                  domain={[-10, 10]}
                />
                <Tooltip />
                <Bar yAxisId="left" dataKey="mineNew" name="Mine top-1 %" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="left" dataKey="midNew" name="Midstream top-1 %" fill="#ea580c" radius={[4, 4, 0, 0]} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="mineDelta"
                  name="Mine Δ pp"
                  stroke="#0369a1"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="midDelta"
                  name="Mid Δ pp"
                  stroke="#9a3412"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Copper is the vintage outlier: mine share flat at Chile ~23% while China refining climbs to ~48%.
            Lithium pits pluralize; midstream chemistry labels stay China-heavy.
          </p>
        </ChartCard>
      )}

      {panel === "directions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard title="Direction counts" subtitle="How many tracked stages moved which way">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={buckets}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {buckets.map((b) => (
                      <Cell key={b.id} fill={b.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Still extreme"
            subtitle={`Stages ≥70% top-1: ${HEADLINE.stagesAbove70Prior} → ${HEADLINE.stagesAbove70New}`}
          >
            <ul className="space-y-2 text-sm text-slate-700">
              {VINTAGE_ROWS.filter((r) => r.newTop1Pct >= 70)
                .sort((a, b) => b.newTop1Pct - a.newTop1Pct)
                .map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                  >
                    <span className="font-medium">
                      {r.shortLabel}{" "}
                      <span className="text-slate-500">({r.top1Label})</span>
                    </span>
                    <span className="tabular-nums font-semibold">
                      {fmtPct(r.newTop1Pct)}{" "}
                      <span className="text-xs font-normal text-slate-500">
                        {fmtPp(r.deltaPp)}
                      </span>
                    </span>
                  </li>
                ))}
            </ul>
          </ChartCard>
        </div>
      )}
    </div>
  );
}
