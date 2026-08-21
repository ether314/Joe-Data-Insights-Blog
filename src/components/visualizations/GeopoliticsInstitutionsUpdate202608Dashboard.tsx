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
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
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
  AUTHORITY_LAYERS,
  CONSENT_CLOCK,
  CONSENT_PATH,
  DIRIYAH_PRINCIPLES,
  GAP_STACK,
  HEADLINE,
  REGION_COLORS,
  SHAREHOLDERS,
  SOURCE_NOTE,
  STATUS_COLORS,
  fmtPct,
  fmtPp,
  ibrdByRegion,
  vintageBars,
  type Region,
} from "@/data/geopolitics-institutions-update-202608-data";

// viz-types: dual-axis clock+consent, flat vintage bars, Diriyah radar, stacked gap, IMF↔IBRD scatter, IBRD concentration, lever bars
// viz-plan: Aug clock compression; flat consent; Principle 8 open; Bank vote stock freeze; dual-gap scatter

type TrackFilter = "both" | "quota" | "nab";
type RegionFilter = "All" | Region;
type FocusMode = "clock" | "principles" | "bank";

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
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              on
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function GeopoliticsInstitutionsUpdate202608Dashboard() {
  const [track, setTrack] = useState<TrackFilter>("both");
  const [region, setRegion] = useState<RegionFilter>("All");
  const [focus, setFocus] = useState<FocusMode>("clock");

  const grouped = useMemo(() => {
    return vintageBars(track).map((r) => ({
      label: r.label,
      prior: r.prior,
      latest: r.latest,
      threshold: r.threshold,
      delta: r.deltaPp,
    }));
  }, [track]);

  const clockData = useMemo(
    () =>
      CONSENT_CLOCK.map((p) => ({
        label: p.label,
        days: p.daysRemaining,
        consent: p.quotaConsentPct,
        event: p.event,
      })),
    [],
  );

  const pathData = useMemo(
    () =>
      CONSENT_PATH.map((p) => ({
        label: p.label,
        consent: p.quotaConsentPct,
        threshold: 85,
        event: p.event,
      })),
    [],
  );

  const stackData = GAP_STACK.map((g) => ({
    label: g.label,
    closed: g.closedPp,
    remaining: g.remainingPp,
  }));

  const diriyahRadar = DIRIYAH_PRINCIPLES.map((p) => ({
    principle: `P${p.num}`,
    short: p.short,
    score: p.score,
    status: p.status,
    note: p.note,
  }));

  const diriyahBars = [...DIRIYAH_PRINCIPLES]
    .sort((a, b) => a.score - b.score)
    .map((p) => ({
      label: `P${p.num}`,
      full: p.short,
      score: p.score,
      fill: STATUS_COLORS[p.status],
      note: p.note,
    }));

  const ibrdBars = useMemo(() => {
    return ibrdByRegion(region).map((r) => ({
      short: r.short,
      vote: r.votePct,
      gdp: r.gdpPppPct,
      gap: r.gapPp,
      fill: REGION_COLORS[r.region],
      name: r.name,
    }));
  }, [region]);

  const dualGapScatter = useMemo(() => {
    const rows =
      region === "All"
        ? SHAREHOLDERS
        : SHAREHOLDERS.filter((s) => s.region === region);
    return rows.map((s) => ({
      short: s.short,
      name: s.name,
      imfGap: s.imfGapPp,
      ibrdGap: s.ibrdGapPp,
      fill: s.consentedLatest ? REGION_COLORS[s.region] : "#0f172a",
      z: s.consentedLatest ? 90 : 160,
      consented: s.consentedLatest,
    }));
  }, [region]);

  const leverBars = useMemo(() => {
    const rows =
      focus === "clock"
        ? AUTHORITY_LAYERS.filter((l) =>
            ["clock", "consent-ledger", "nab", "us"].includes(l.id),
          )
        : focus === "principles"
          ? AUTHORITY_LAYERS.filter((l) =>
              ["diriyah", "shares", "consent-ledger"].includes(l.id),
            )
          : AUTHORITY_LAYERS.filter((l) =>
              ["ibrd-sci", "bba", "shares"].includes(l.id),
            );
    return (rows.length ? rows : AUTHORITY_LAYERS).map((r) => ({
      short: r.label.length > 28 ? `${r.label.slice(0, 26)}…` : r.label,
      full: r.label,
      score: r.moved ? 1 : -1,
      fill: r.moved ? "#0f766e" : "#be123c",
      note: r.deltaNote,
      institution: r.institution,
    }));
  }, [focus]);

  return (
    <div className="space-y-6" data-viz="geopolitics-institutions-update-202608">
      <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          August vintage delta — Apr 2026 (Q3 post) → Aug 20 2026 mid-window
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-indigo-50 px-3 py-2">
            <p className="text-xs text-indigo-700">Days to Nov 15</p>
            <p className="text-xl font-bold text-indigo-950">
              {HEADLINE.daysRemaining}
            </p>
            <p className="text-xs text-indigo-600">
              was ~191 on May 8 · {fmtPct(HEADLINE.windowElapsedPct, 0)} of window
              gone
            </p>
          </div>
          <div className="rounded-lg bg-slate-100 px-3 py-2">
            <p className="text-xs text-slate-600">Quota consent Δ</p>
            <p className="text-xl font-bold text-slate-900">
              {fmtPp(HEADLINE.quotaDeltaPp)}
            </p>
            <p className="text-xs text-slate-500">
              flat at {fmtPct(HEADLINE.quotaConsentPct)} (no new PP)
            </p>
          </div>
          <div className="rounded-lg bg-rose-50 px-3 py-2">
            <p className="text-xs text-rose-700">Still short of 85%</p>
            <p className="text-xl font-bold text-rose-950">
              {fmtPp(HEADLINE.quotaGapPp)}
            </p>
            <p className="text-xs text-rose-600">identical to Apr shortfall</p>
          </div>
          <div className="rounded-lg bg-amber-50 px-3 py-2">
            <p className="text-xs text-amber-700">Diriyah Principle 8</p>
            <p className="text-xl font-bold text-amber-950">Open</p>
            <p className="text-xs text-amber-600">
              16th GRQ still not effective
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <ToggleGroup
          label="Consent track"
          value={track}
          options={[
            { id: "both", label: "Both" },
            { id: "quota", label: "Quota" },
            { id: "nab", label: "NAB" },
          ]}
          onChange={setTrack}
        />
        <ToggleGroup
          label="Region"
          value={region}
          options={[
            { id: "All", label: "All" },
            { id: "Americas", label: "Americas" },
            { id: "Europe", label: "Europe" },
            { id: "Asia-Pacific", label: "Asia-Pacific" },
            { id: "Middle East", label: "Middle East" },
          ]}
          onChange={setRegion}
        />
        <ToggleGroup
          label="Focus"
          value={focus}
          options={[
            { id: "clock", label: "Clock" },
            { id: "principles", label: "Diriyah" },
            { id: "bank", label: "IBRD" },
          ]}
          onChange={setFocus}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Consent clock: days remaining to Nov 15"
          subtitle="Dual axis — calendar compression while consent % stays flat at 76.66%"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={clockData} margin={{ left: 4, right: 12, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="days"
                  domain={[0, 220]}
                  tick={{ fontSize: 11 }}
                  width={40}
                  label={{
                    value: "Days left",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 10 },
                  }}
                />
                <YAxis
                  yAxisId="pct"
                  orientation="right"
                  domain={[70, 90]}
                  tickFormatter={(v) => `${v}%`}
                  width={40}
                />
                <Tooltip
                  formatter={(v, name) => [
                    typeof v === "number"
                      ? String(name).includes("consent")
                        ? fmtPct(v)
                        : `${v} days`
                      : String(v),
                    String(name),
                  ]}
                />
                <Legend />
                <Area
                  yAxisId="days"
                  type="monotone"
                  dataKey="days"
                  name="Days remaining"
                  stroke="#4f46e5"
                  fill="#c7d2fe"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="pct"
                  type="monotone"
                  dataKey="consent"
                  name="Quota consent %"
                  stroke="#0f766e"
                  strokeWidth={2.5}
                  connectNulls={false}
                  dot={{ r: 4 }}
                />
                <ReferenceLine
                  yAxisId="pct"
                  y={85}
                  stroke="#be123c"
                  strokeDasharray="4 4"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Q3 → Aug consent levels (flat)"
          subtitle="Grouped bars — Apr 2026 print vs Aug mid-window; thresholds still unmet"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={grouped} margin={{ left: 4, right: 12, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  width={40}
                />
                <Tooltip
                  formatter={(v, name) => [
                    typeof v === "number" ? fmtPct(v) : String(v),
                    String(name),
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="prior"
                  name="Apr 2026 (Q3)"
                  fill="#94a3b8"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="latest"
                  name="Aug 2026"
                  fill="#0f766e"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="threshold"
                  name="Threshold"
                  fill="#be123c"
                  radius={[4, 4, 0, 0]}
                  opacity={0.35}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Diriyah principles radar (PP 2026/013)"
          subtitle="Principle 8 (implement completed reforms) scores lowest — 16th GRQ still pending"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={diriyahRadar} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="principle" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Implementation score"
                  dataKey="score"
                  stroke="#0f766e"
                  fill="#5eead4"
                  fillOpacity={0.45}
                />
                <Tooltip
                  formatter={(v, _n, item) => {
                    const p = item?.payload as {
                      short?: string;
                      note?: string;
                      status?: string;
                    };
                    return [
                      typeof v === "number"
                        ? `${v}/100 (${p?.status ?? ""})`
                        : String(v),
                      p?.short ?? "Score",
                    ];
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Diriyah scorecard ranks"
          subtitle="Horizontal bars — open principles in crimson; anchored in teal"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={diriyahBars}
                layout="vertical"
                margin={{ left: 4, right: 12 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={36}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v, _n, item) => {
                    const p = item?.payload as { full?: string; note?: string };
                    return [
                      typeof v === "number" ? `${v}/100` : String(v),
                      p?.full ?? "Score",
                    ];
                  }}
                />
                <Bar dataKey="score" name="Score" radius={[0, 4, 4, 0]}>
                  {diriyahBars.map((b) => (
                    <Cell key={b.label} fill={b.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Shortfall closed vs remaining"
          subtitle="Stacked area — Aug checkpoint identical to Apr; only the calendar moved"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stackData} margin={{ left: 4, right: 12, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  width={40}
                />
                <Tooltip
                  formatter={(v, name) => [
                    typeof v === "number" ? fmtPct(v) : String(v),
                    String(name),
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="closed"
                  name="Consented"
                  stackId="1"
                  stroke="#0f766e"
                  fill="#5eead4"
                />
                <Area
                  type="monotone"
                  dataKey="remaining"
                  name="Shortfall to 85%"
                  stackId="1"
                  stroke="#be123c"
                  fill="#fecdd3"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Quota consent path (flat mid-window)"
          subtitle="85% line — Aug marker sits on the Apr 76.66% plateau"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={pathData} margin={{ left: 4, right: 12, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  width={40}
                />
                <Tooltip
                  formatter={(v, name) => [
                    v == null
                      ? "n/a"
                      : typeof v === "number"
                        ? fmtPct(v)
                        : String(v),
                    String(name),
                  ]}
                />
                <ReferenceLine y={85} stroke="#be123c" strokeDasharray="4 4" />
                <Line
                  type="monotone"
                  dataKey="consent"
                  name="Quota consent %"
                  stroke="#0f766e"
                  strokeWidth={2.5}
                  connectNulls={false}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="IMF vs IBRD vote−GDP gaps (still dual-frozen)"
        subtitle="Scatter — dark = not consented on 16th GRQ; China deep underweight on both axes"
      >
        <div className="h-80 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="imfGap"
                name="IMF gap"
                unit=" pp"
                tick={{ fontSize: 11 }}
                label={{
                  value: "IMF vote − PPP GDP (pp)",
                  position: "insideBottom",
                  offset: -2,
                }}
              />
              <YAxis
                type="number"
                dataKey="ibrdGap"
                name="IBRD gap"
                unit=" pp"
                tick={{ fontSize: 11 }}
                label={{
                  value: "IBRD vote − PPP GDP (pp)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <ZAxis type="number" dataKey="z" range={[60, 280]} />
              <ReferenceLine x={0} stroke="#94a3b8" />
              <ReferenceLine y={0} stroke="#94a3b8" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) => [
                  typeof v === "number" ? fmtPp(v) : String(v),
                  String(name),
                ]}
                labelFormatter={(_, payload) => {
                  const p = payload?.[0]?.payload as {
                    name?: string;
                    consented?: boolean;
                  };
                  return `${p?.name ?? ""} · ${p?.consented ? "consented" : "NOT consented"}`;
                }}
              />
              <Scatter data={dualGapScatter} name="Shareholders">
                {dualGapScatter.map((p) => (
                  <Cell key={p.short} fill={p.fill} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="IBRD voting-power stock (Jun 30 2026)"
          subtitle="Top shareholders — SCI/Basic Votes still frozen; WBG Finances refresh Aug 18"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ibrdBars} margin={{ left: 4, right: 12, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                <YAxis
                  tickFormatter={(v) => `${v}%`}
                  width={40}
                  domain={[0, 18]}
                />
                <Tooltip
                  formatter={(v, name) => [
                    typeof v === "number" ? fmtPct(v) : String(v),
                    String(name),
                  ]}
                />
                <Legend />
                <Bar dataKey="vote" name="IBRD vote %" radius={[4, 4, 0, 0]}>
                  {ibrdBars.map((b) => (
                    <Cell key={b.short} fill={b.fill} />
                  ))}
                </Bar>
                <Bar
                  dataKey="gdp"
                  name="PPP GDP %"
                  fill="#94a3b8"
                  radius={[4, 4, 0, 0]}
                  opacity={0.55}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="What moved vs stuck since Q3"
          subtitle="Focus control filters the lever set — clock moved; hard shares did not"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={leverBars}
                layout="vertical"
                margin={{ left: 4, right: 12 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  domain={[-1.2, 1.2]}
                  ticks={[-1, 0, 1]}
                  tickFormatter={(v) =>
                    v === 1 ? "Moved" : v === -1 ? "Stuck" : ""
                  }
                />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={120}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  formatter={(_v, _n, item) => {
                    const p = item?.payload as {
                      full?: string;
                      note?: string;
                      score?: number;
                    };
                    return [
                      p?.score === 1 ? `Moved — ${p?.note}` : `Stuck — ${p?.note}`,
                      p?.full ?? "Lever",
                    ];
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="score" name="Outcome" radius={[0, 4, 4, 0]}>
                  {leverBars.map((b) => (
                    <Cell key={b.short} fill={b.fill} />
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
