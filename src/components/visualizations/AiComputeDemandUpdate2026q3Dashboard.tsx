"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
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
  GEO_METRICS,
  HEADLINE,
  OWNER_COLORS,
  OWNER_IDS,
  PIPELINE_STACK,
  POWER_SPLIT,
  SITE_LEDGER,
  SOURCE_NOTE,
  SOURCES,
  TOKEN_VS_OWNERSHIP,
  fmtMw,
  fmtPct,
  fmtPp,
  ownerDeltas,
  rankedHubDeltas,
  type OwnerId,
} from "@/data/ai-compute-demand-update-2026q3-data";

// viz-types: stacked site bars, power-split area, hub delta bars, token×ownership scatter, geo Δ | layout: default
// viz-plan: US vs ROW site stack; AI vs conventional crossover; hub MW Δ; tokens vs ownership; geo concentration; owner + region + power-mode controls

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

type PowerMode = "twh" | "gw";
type RegionFilter =
  | "all"
  | "United States"
  | "Europe"
  | "Middle East"
  | "China"
  | "Rest of Asia-Pacific";

const REGIONS: RegionFilter[] = [
  "all",
  "United States",
  "Europe",
  "Middle East",
  "China",
  "Rest of Asia-Pacific",
];

export function AiComputeDemandUpdate2026q3Dashboard() {
  const [activeOwners, setActiveOwners] = useState<OwnerId[]>([...OWNER_IDS]);
  const [region, setRegion] = useState<RegionFilter>("all");
  const [powerMode, setPowerMode] = useState<PowerMode>("twh");

  const toggleOwner = (id: OwnerId) => {
    setActiveOwners((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== id);
      }
      return [...prev, id];
    });
  };

  const deltas = useMemo(() => ownerDeltas(activeOwners), [activeOwners]);

  const ownershipCarry = useMemo(
    () =>
      deltas.map((d) => ({
        label: d.label,
        share: d.newShare,
        fill: d.fill,
        delta: d.deltaPp,
      })),
    [deltas],
  );

  const siteStack = useMemo(
    () =>
      PIPELINE_STACK.map((r) => ({
        label: r.label,
        US: r.us,
        "Rest of world": r.row,
        note: r.note,
      })),
    [],
  );

  const hubs = useMemo(() => rankedHubDeltas(region), [region]);

  const hubBars = useMemo(
    () =>
      hubs.map((h) => ({
        hub: h.hub.length > 28 ? `${h.hub.slice(0, 26)}…` : h.hub,
        full: h.hub,
        delta: h.deltaMw,
        fill:
          h.deltaMw > 1000 ? "#0ea5e9" : h.deltaMw > 0 ? "#38bdf8" : h.deltaMw < 0 ? "#f43f5e" : "#94a3b8",
      })),
    [hubs],
  );

  const geoBars = useMemo(
    () =>
      [...GEO_METRICS]
        .map((g) => ({
          label: g.label.length > 34 ? `${g.label.slice(0, 32)}…` : g.label,
          full: g.label,
          value: g.deltaPp,
          fill: g.color,
        }))
        .sort((a, b) => Math.abs(b.value) - Math.abs(a.value)),
    [],
  );

  const powerData = useMemo(
    () =>
      POWER_SPLIT.map((p) =>
        powerMode === "twh"
          ? {
              year: String(p.year),
              AI: p.aiTwh,
              Conventional: p.conventionalTwh,
              Cooling: p.coolingTwh,
            }
          : {
              year: String(p.year),
              Capacity: p.capacityGw,
            },
      ),
    [powerMode],
  );

  const ledgerCards = useMemo(
    () =>
      SITE_LEDGER.filter((s) =>
        ["us-pipeline-sites", "top3-share", "campus-size-mult", "us-pipeline-gw"].includes(s.id),
      ),
    [],
  );

  return (
    <div className="space-y-6" data-viz="ai-compute-demand-update-2026q3">
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — Aug 2026 update → Q3 2026 site & power print
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          US {HEADLINE.usPipelineSites} of {HEADLINE.worldPipelineSites} hyperscale pipeline sites ·
          Top-3 cloud {HEADLINE.top3HyperscaleSharePct}% of hyperscale
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Ownership Big-5 shares are carried from the Aug explorer restatement (Epoch Q1/Q2 2026
          period print still open). The new vintage is Synergy&apos;s hyperscale site ledger —{" "}
          {HEADLINE.usPipelineSites} US of {HEADLINE.worldPipelineSites} world pipeline sites (
          {fmtPct(HEADLINE.usPipelineSiteSharePct)}) — plus Top-3 cloud at{" "}
          {HEADLINE.top3HyperscaleSharePct}% of hyperscale capacity, new campuses ≈
          {HEADLINE.newCampusSizeMultiple}× ops average size, and Gartner&apos;s US electricity slice
          ({HEADLINE.usDcTwh2026} TWh / {HEADLINE.usDcShareOfWorldPct}% of world DC power).
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ledgerCards.map((c) => (
            <div key={c.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {c.label}
              </p>
              <p className="mt-0.5 text-xl font-bold text-slate-900">
                {c.newValue}
                <span className="ml-1 text-sm font-semibold text-slate-500">{c.unit}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Owners</span>
            {OWNER_IDS.map((id) => {
              const on = activeOwners.includes(id);
              const label = id.charAt(0).toUpperCase() + id.slice(1);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleOwner(id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    on ? "text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                  style={on ? { backgroundColor: OWNER_COLORS[id] } : undefined}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Power</span>
            {(
              [
                ["twh", "TWh split"],
                ["gw", "Capacity GW"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setPowerMode(id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  powerMode === id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Hyperscale sites — US vs rest of world"
          subtitle="Synergy end-2025 ops (1,360) and pipeline (803); US 437 of 803 pipeline"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={siteStack} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const sorted = sortTooltipPayload(payload);
                    const row = sorted[0]?.payload as {
                      label: string;
                      US: number;
                      "Rest of world": number;
                      note: string;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.label}</p>
                        <p className="text-slate-600">US: {row.US}</p>
                        <p className="text-slate-600">Rest of world: {row["Rest of world"]}</p>
                        <p className="mt-1 text-xs text-slate-500">{row.note}</p>
                      </div>
                    );
                  }}
                />
                <Legend />
                <Bar dataKey="US" stackId="a" fill="#0ea5e9" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Rest of world" stackId="a" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title={
            powerMode === "twh"
              ? "Gartner power split — AI crosses conventional in 2027"
              : "Gartner capacity path (GW)"
          }
          subtitle={
            powerMode === "twh"
              ? "AI-optimised servers 175→258 TWh; conventional ~flat at ~200 TWh"
              : "104 → 132 → ~165 GW (2025–2027)"
          }
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              {powerMode === "twh" ? (
                <AreaChart data={powerData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fill: "#334155", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const sorted = sortTooltipPayload(payload);
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{label}</p>
                          {sorted.map((p) => (
                            <p key={String(p.dataKey)} className="text-slate-600">
                              {p.name}: {Number(p.value).toLocaleString()} TWh
                            </p>
                          ))}
                        </div>
                      );
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="AI"
                    stackId="1"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.75}
                  />
                  <Area
                    type="monotone"
                    dataKey="Conventional"
                    stackId="1"
                    stroke="#64748b"
                    fill="#94a3b8"
                    fillOpacity={0.7}
                  />
                  <Area
                    type="monotone"
                    dataKey="Cooling"
                    stackId="1"
                    stroke="#0ea5e9"
                    fill="#38bdf8"
                    fillOpacity={0.55}
                  />
                </AreaChart>
              ) : (
                <AreaChart data={powerData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fill: "#334155", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                          <p className="font-semibold text-slate-900">{label}</p>
                          <p className="text-slate-600">
                            Capacity: {Number(payload[0]?.value).toLocaleString()} GW
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Capacity"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.35}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Hub IT-MW revisions (Aug → Q3)"
          subtitle="Largest inland adds: Midwest + Indiana 2.4 GW narrative; Texas named markets"
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Region</span>
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  region === r
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {r === "all" ? "All" : r}
              </button>
            ))}
          </div>
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={hubBars} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v) => `${v}`} />
                <YAxis
                  type="category"
                  dataKey="hub"
                  width={110}
                  tick={{ fill: "#334155", fontSize: 11, fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as { full: string; delta: number };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.full}</p>
                        <p className="text-slate-600">{fmtMw(row.delta)} Δ</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="delta" radius={[0, 4, 4, 0]} maxBarSize={26}>
                  {hubBars.map((d) => (
                    <Cell key={d.full} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Geography concentration deltas"
          subtitle="Site-share and electricity composition vs Aug framing"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={geoBars} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={130}
                  tick={{ fill: "#334155", fontSize: 10, fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as { full: string; value: number };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.full}</p>
                        <p className="text-slate-600">{fmtPp(row.value)}</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={26}>
                  {geoBars.map((d) => (
                    <Cell key={d.full} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Ownership carry (Aug explorer → Q3)"
          subtitle="Big-5 shares held flat — no new Epoch period print; filter owners above"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart
                data={ownershipCarry}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 30]}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={78}
                  tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as { label: string; share: number; delta: number };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.label}</p>
                        <p className="text-slate-600">{fmtPct(row.share)} of world AI compute</p>
                        <p className="text-xs text-slate-500">Δ vs Aug: {fmtPp(row.delta)}</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="share" radius={[0, 4, 4, 0]} maxBarSize={28}>
                  {ownershipCarry.map((d) => (
                    <Cell key={d.label} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Tokens vs ownership (scatter)"
          subtitle="Q3 brand token cohort vs Aug-carried ownership shares — usage ≠ silicon"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="ownerSharePct"
                  name="Ownership"
                  unit="%"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  label={{ value: "Ownership %", position: "insideBottom", offset: -4, fill: "#64748b" }}
                />
                <YAxis
                  type="number"
                  dataKey="tokenSharePct"
                  name="Tokens"
                  unit="%"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  label={{ value: "Token %", angle: -90, position: "insideLeft", fill: "#64748b" }}
                />
                <ZAxis range={[80, 80]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as (typeof TOKEN_VS_OWNERSHIP)[0];
                    return (
                      <div className="max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                        <p className="font-semibold text-slate-900">{row.label}</p>
                        <p className="text-slate-600">Tokens {fmtPct(row.tokenSharePct)}</p>
                        <p className="text-slate-600">Ownership {fmtPct(row.ownerSharePct)}</p>
                        <p className="mt-1 text-xs text-slate-500">{row.note}</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine
                  segment={[
                    { x: 0, y: 0 },
                    { x: 30, y: 30 },
                  ]}
                  stroke="#cbd5e1"
                  strokeDasharray="4 4"
                />
                <Scatter data={TOKEN_VS_OWNERSHIP} fill="#0ea5e9">
                  {TOKEN_VS_OWNERSHIP.map((d) => (
                    <Cell key={d.id} fill={d.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} className="text-cyan-700 underline-offset-2 hover:underline">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
