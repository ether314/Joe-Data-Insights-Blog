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
  BBA_STATUS,
  CONSENT_PATH,
  GAP_DUMBBELLS,
  GAP_STACK,
  HEADLINE,
  REFORM_LEVERS,
  REGION_COLORS,
  SHAREHOLDERS,
  SOURCE_NOTE,
  fmtPct,
  fmtPp,
  vintageBars,
  type Region,
} from "@/data/geopolitics-institutions-update-2026q3-data";

// viz-types: grouped vintage bars, consent path+threshold, stacked gap area, BBA donut, gap×consent scatter, lever outcome bars
// viz-plan: Oct→Apr delta; path to Nov 2026; remaining shortfall stack; BBA bridge; frozen gaps; moved vs stuck levers

type TrackFilter = "both" | "quota" | "nab";
type RegionFilter = "All" | Region;
type ViewMode = "delta" | "levels";

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

export function GeopoliticsInstitutionsUpdate2026q3Dashboard() {
  const [track, setTrack] = useState<TrackFilter>("both");
  const [region, setRegion] = useState<RegionFilter>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("delta");

  const grouped = useMemo(() => {
    const rows = vintageBars(track);
    if (viewMode === "delta") {
      return rows.map((r) => ({
        label: r.label,
        prior: r.prior,
        latest: r.latest,
        threshold: r.threshold,
        delta: r.deltaPp,
      }));
    }
    return rows.map((r) => ({
      label: r.label,
      prior: r.prior,
      latest: r.latest,
      threshold: r.threshold,
      delta: r.deltaPp,
    }));
  }, [track, viewMode]);

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

  const bbaDonut = BBA_STATUS.map((b) => ({
    name: b.label,
    value: b.sharePct,
    creditors: b.creditors,
    fill: b.fill,
  }));

  const scatterPts = useMemo(() => {
    const rows =
      region === "All"
        ? SHAREHOLDERS
        : SHAREHOLDERS.filter((s) => s.region === region);
    return rows.map((s) => ({
      short: s.short,
      name: s.name,
      gap: s.imfGapPp,
      quota: s.quotaSharePct,
      consented: s.consentedLatest ? 1 : 0,
      fill: s.consentedLatest ? REGION_COLORS[s.region] : "#0f172a",
      z: s.consentedLatest ? 90 : 160,
    }));
  }, [region]);

  const gapBars = useMemo(() => {
    const rows =
      region === "All"
        ? GAP_DUMBBELLS
        : GAP_DUMBBELLS.filter((g) => g.region === region);
    return [...rows]
      .sort((a, b) => a.gapPp - b.gapPp)
      .map((g) => ({
        short: g.short,
        gap: g.gapPp,
        fill: g.consentedLatest ? "#0f766e" : "#be123c",
        name: g.name,
      }));
  }, [region]);

  const leverBars = useMemo(() => {
    const rows =
      viewMode === "delta"
        ? REFORM_LEVERS.filter((r) => r.moved || !r.moved)
        : REFORM_LEVERS;
    return rows.map((r) => ({
      short: r.label.length > 26 ? `${r.label.slice(0, 24)}…` : r.label,
      full: r.label,
      score: r.moved ? 1 : -1,
      fill: r.moved ? "#0f766e" : "#be123c",
      institution: r.institution,
      note: r.deltaNote,
    }));
  }, [viewMode]);

  return (
    <div className="space-y-6" data-viz="geopolitics-institutions-update-2026q3">
      <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Q3 vintage delta — Oct 2025 (prior post) → Apr 2026 (PP 2026/017)
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-teal-50 px-3 py-2">
            <p className="text-xs text-teal-700">Quota consent Δ</p>
            <p className="text-xl font-bold text-teal-950">
              {fmtPp(HEADLINE.quotaDeltaPp)}
            </p>
            <p className="text-xs text-teal-600">
              {fmtPct(HEADLINE.priorQuotaConsentPct)} → {fmtPct(HEADLINE.quotaConsentPct)}
            </p>
          </div>
          <div className="rounded-lg bg-rose-50 px-3 py-2">
            <p className="text-xs text-rose-700">Still short of 85%</p>
            <p className="text-xl font-bold text-rose-950">
              {fmtPp(HEADLINE.quotaGapPp)}
            </p>
            <p className="text-xs text-rose-600">
              was {fmtPp(HEADLINE.priorQuotaGapPp)} in Oct print
            </p>
          </div>
          <div className="rounded-lg bg-amber-50 px-3 py-2">
            <p className="text-xs text-amber-700">NAB rollback Δ</p>
            <p className="text-xl font-bold text-amber-950">
              {fmtPp(HEADLINE.nabDeltaPp)}
            </p>
            <p className="text-xs text-amber-600">
              stuck at {fmtPct(HEADLINE.nabConsentPct)} (need 90%)
            </p>
          </div>
          <div className="rounded-lg bg-indigo-50 px-3 py-2">
            <p className="text-xs text-indigo-700">New deadline</p>
            <p className="text-xl font-bold text-indigo-950">15 Nov 2026</p>
            <p className="text-xs text-indigo-600">
              was 15 May · US still not filed
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
          label="Lever view"
          value={viewMode}
          options={[
            { id: "delta", label: "Show all levers" },
            { id: "levels", label: "Levels focus" },
          ]}
          onChange={setViewMode}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Prior vs latest consent share"
          subtitle="Grouped bars — Oct 2025 update vs Apr 2026 print, with threshold marks"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={grouped} margin={{ left: 4, right: 12, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} width={40} />
                <Tooltip
                  formatter={(v, name) => [
                    typeof v === "number" ? fmtPct(v) : String(v),
                    String(name),
                  ]}
                />
                <Legend />
                <Bar dataKey="prior" name="Oct 2025" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="latest" name="Apr 2026" fill="#0f766e" radius={[4, 4, 0, 0]} />
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

        <ChartCard
          title="Quota consent path to Nov 2026"
          subtitle="85% line — Apr print at 76.66% (+3.88 pp vs prior post)"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={pathData} margin={{ left: 4, right: 12, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} width={40} />
                <Tooltip
                  formatter={(v, name) => [
                    v == null ? "n/a" : typeof v === "number" ? fmtPct(v) : String(v),
                    String(name),
                  ]}
                />
                <ReferenceLine y={85} stroke="#be123c" strokeDasharray="4 4" label="85%" />
                <Line
                  type="monotone"
                  dataKey="consent"
                  name="Quota consent %"
                  stroke="#0f766e"
                  strokeWidth={2.5}
                  connectNulls={false}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="threshold"
                  name="Effectiveness threshold"
                  stroke="#94a3b8"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Shortfall closed vs remaining"
          subtitle="Stacked area — how much of the 85% gate is still open"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stackData} margin={{ left: 4, right: 12, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} width={40} />
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
          title="BBA bridge: transitional lending capacity"
          subtitle="PP 2026/017 Annex II — 39 creditors / 95.92% of 2020 BBAs extended"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bbaDonut}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={92}
                  paddingAngle={2}
                >
                  {bbaDonut.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, _n, item) => {
                    const p = item?.payload as { creditors?: number };
                    return [
                      `${typeof v === "number" ? fmtPct(v) : v} (${p?.creditors ?? "?"} creditors)`,
                      "Share",
                    ];
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-center text-xs text-slate-500">
            Soft bridge while hard quota effectiveness remains unfinished.
          </p>
        </ChartCard>
      </div>

      <ChartCard
        title="Frozen IMF vote−GDP gaps × Apr 2026 consent"
        subtitle="Dark = still not consented; geometry unchanged — only the consent clock moved"
      >
        <div className="h-80 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="quota"
                name="Quota share"
                unit="%"
                tick={{ fontSize: 11 }}
                label={{ value: "Quota share %", position: "insideBottom", offset: -2 }}
              />
              <YAxis
                type="number"
                dataKey="gap"
                name="Vote−GDP gap"
                unit=" pp"
                tick={{ fontSize: 11 }}
                label={{
                  value: "IMF vote − PPP GDP (pp)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <ZAxis type="number" dataKey="z" range={[60, 280]} />
              <ReferenceLine y={0} stroke="#94a3b8" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) => [
                  typeof v === "number"
                    ? name === "gap"
                      ? fmtPp(v)
                      : fmtPct(v)
                    : String(v),
                  String(name),
                ]}
                labelFormatter={(_, payload) => {
                  const p = payload?.[0]?.payload as {
                    name?: string;
                    consented?: number;
                  };
                  return `${p?.name ?? ""} · ${p?.consented ? "consented" : "NOT consented"}`;
                }}
              />
              <Scatter data={scatterPts} name="Shareholders">
                {scatterPts.map((p) => (
                  <Cell key={p.short} fill={p.fill} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Vote−GDP gap ranks (still frozen)"
          subtitle="China −12.6 pp · India −5.3 pp — identical to prior update"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gapBars} layout="vertical" margin={{ left: 4, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tickFormatter={(v) => fmtPp(v, 0)} />
                <YAxis type="category" dataKey="short" width={36} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v, _n, item) => {
                    const p = item?.payload as { name?: string };
                    return [typeof v === "number" ? fmtPp(v) : String(v), p?.name ?? "Gap"];
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="gap" name="IMF vote − PPP GDP" radius={[0, 4, 4, 0]}>
                  {gapBars.map((b) => (
                    <Cell key={b.short} fill={b.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="What moved vs stuck since prior post"
          subtitle="+1 moved · −1 stuck — deadline & quota share rose; NAB & US consent did not"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leverBars} layout="vertical" margin={{ left: 4, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[-1.2, 1.2]} ticks={[-1, 0, 1]} />
                <YAxis type="category" dataKey="short" width={128} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(_v, _n, item) => {
                    const p = item?.payload as {
                      full?: string;
                      institution?: string;
                      note?: string;
                      score?: number;
                    };
                    const label = (p?.score ?? 0) > 0 ? "Moved" : "Stuck";
                    return [`${label} — ${p?.note ?? ""}`, `${p?.institution} · ${p?.full}`];
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
