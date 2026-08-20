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
  CONSENT_PATH,
  GAP_DUMBBELLS,
  HEADLINE,
  IBRD_MISALIGN,
  REFORM_LEVERS,
  REGION_COLORS,
  SHAREHOLDERS,
  SOURCE_NOTE,
  VOICE_PACKAGE,
  consentGapBars,
  fmtPct,
  fmtPp,
  type Region,
} from "@/data/geopolitics-institutions-update-2026-data";

// viz-types: consent shortfall bars, path+threshold composed, IBRD misalign donut, gap×consent scatter, reform lever bars | layout: default
// viz-plan: dual-track shortfall; consent path; IBRD under/over donut; frozen gap scatter; lever outcome bars; region + track + lever-scope controls

type TrackFilter = "both" | "quota" | "nab";
type RegionFilter = "All" | Region;
type LeverScope = "all" | "stuck" | "moved";

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

export function GeopoliticsInstitutionsUpdateDashboard() {
  const [track, setTrack] = useState<TrackFilter>("both");
  const [region, setRegion] = useState<RegionFilter>("All");
  const [leverScope, setLeverScope] = useState<LeverScope>("all");

  const shortfallBars = useMemo(() => {
    const all = consentGapBars();
    if (track === "both") return all;
    return all.filter((b) => b.track === track);
  }, [track]);

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

  const donutData = IBRD_MISALIGN.map((b) => ({
    name: b.label,
    value: b.shareholdingPct,
    countries: b.countries,
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
      consented: s.consentedQuota ? 1 : 0,
      fill: s.consentedQuota ? REGION_COLORS[s.region] : "#0f172a",
      z: s.consentedQuota ? 90 : 160,
    }));
  }, [region]);

  const gapBars = useMemo(() => {
    const rows =
      region === "All"
        ? GAP_DUMBBELLS
        : GAP_DUMBBELLS.filter((g) => g.region === region);
    return [...rows]
      .sort((a, b) => a.updateGapPp - b.updateGapPp)
      .map((g) => ({
        short: g.short,
        gap: g.updateGapPp,
        fill: g.consented ? "#0f766e" : "#be123c",
        name: g.name,
      }));
  }, [region]);

  const leverBars = useMemo(() => {
    let rows = REFORM_LEVERS;
    if (leverScope === "stuck") rows = rows.filter((r) => !r.moved);
    if (leverScope === "moved") rows = rows.filter((r) => r.moved);
    return rows.map((r) => ({
      short: r.label.length > 28 ? `${r.label.slice(0, 26)}…` : r.label,
      full: r.label,
      score: r.moved ? 1 : r.supportEnough === false ? -1 : 0,
      fill: r.moved ? "#0f766e" : r.supportEnough === false ? "#be123c" : "#94a3b8",
      institution: r.institution,
    }));
  }, [leverScope]);

  const voiceSplit = useMemo(() => {
    const advancing = VOICE_PACKAGE.filter((v) => v.status === "advancing").length;
    const deferred = VOICE_PACKAGE.filter((v) => v.status === "deferred").length;
    return [
      { name: "Advancing", value: advancing, fill: "#0f766e" },
      { name: "Deferred (need 85%)", value: deferred, fill: "#94a3b8" },
    ];
  }, []);

  return (
    <div className="space-y-6" data-viz="geopolitics-institutions-update-2026">
      <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — research stock → Oct 2025 consent / Apr 2026 WB review
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-rose-50 px-3 py-2">
            <p className="text-xs text-rose-700">Quota consent gap</p>
            <p className="text-xl font-bold text-rose-950">
              {fmtPp(HEADLINE.quotaGapPp)}
            </p>
            <p className="text-xs text-rose-600">
              {fmtPct(HEADLINE.quotaConsentPct)} of {fmtPct(HEADLINE.quotaThresholdPct)}
            </p>
          </div>
          <div className="rounded-lg bg-amber-50 px-3 py-2">
            <p className="text-xs text-amber-700">NAB rollback gap</p>
            <p className="text-xl font-bold text-amber-950">
              {fmtPp(HEADLINE.nabGapPp)}
            </p>
            <p className="text-xs text-amber-600">
              {fmtPct(HEADLINE.nabConsentPct)} of {fmtPct(HEADLINE.nabThresholdPct)}
            </p>
          </div>
          <div className="rounded-lg bg-slate-100 px-3 py-2">
            <p className="text-xs text-slate-600">US quota consent</p>
            <p className="text-xl font-bold text-slate-900">Not filed</p>
            <p className="text-xs text-slate-500">
              Alone &gt; {fmtPct(Math.abs(HEADLINE.quotaGapPp))} still needed
            </p>
          </div>
          <div className="rounded-lg bg-indigo-50 px-3 py-2">
            <p className="text-xs text-indigo-700">IBRD under-represented</p>
            <p className="text-xl font-bold text-indigo-950">
              {HEADLINE.ibrdUnderRepresentedCountries} /{" "}
              {fmtPct(HEADLINE.ibrdUnderRepresentedSharePct, 1)}
            </p>
            <p className="text-xs text-indigo-600">No SCI — shares still frozen</p>
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
          label="Reform levers"
          value={leverScope}
          options={[
            { id: "all", label: "All" },
            { id: "stuck", label: "Stuck" },
            { id: "moved", label: "Moved" },
          ]}
          onChange={setLeverScope}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Consent shortfall vs threshold"
          subtitle="How far each track sits below the effectiveness rule"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shortfallBars} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v, name) => [
                    typeof v === "number" ? fmtPct(v) : String(v),
                    String(name),
                  ]}
                />
                <Legend />
                <Bar dataKey="consented" name="Consented" fill="#0f766e" radius={[0, 4, 4, 0]} />
                <Bar dataKey="gap" name="Shortfall to threshold" fill="#be123c" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Quota consent path to May 2026"
          subtitle="85% threshold line — Oct 2025 print still −12.22 pp short"
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
          title="IBRD misalignment census"
          subtitle="2025 Dynamic Formula — 45 under-represented countries hold 47.5% of shares"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={92}
                  paddingAngle={2}
                >
                  {donutData.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, _n, item) => {
                    const p = item?.payload as { countries?: number };
                    return [
                      `${typeof v === "number" ? fmtPct(v) : v} of shareholding (${p?.countries ?? "?"} countries)`,
                      "Share",
                    ];
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-center text-xs text-slate-500">
            LICs hold ~{fmtPct(HEADLINE.licIbrdVotePct, 0)} of IBRD votes — voice package advances;
            SCI / Basic Votes do not.
          </p>
        </ChartCard>

        <ChartCard
          title="Voice package split"
          subtitle="Non-share reforms that cleared consensus vs Articles-bound deferrals"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={voiceSplit}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {voiceSplit.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Frozen IMF vote−GDP gaps × consent"
        subtitle="Dark markers = not consented; gaps unchanged vs research vintage (Δ = 0)"
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
                label={{ value: "IMF vote − PPP GDP (pp)", angle: -90, position: "insideLeft" }}
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
                  const p = payload?.[0]?.payload as { name?: string; consented?: number };
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
          title="Vote−GDP gap ranks (unchanged)"
          subtitle="China still −12.6 pp; India −5.3 pp — same as research print"
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
          title="Reform lever outcomes"
          subtitle="+1 moved · 0 deferred/unclear · −1 stuck below majority"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leverBars} layout="vertical" margin={{ left: 4, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[-1.2, 1.2]} ticks={[-1, 0, 1]} />
                <YAxis type="category" dataKey="short" width={130} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(v, _n, item) => {
                    const p = item?.payload as { full?: string; institution?: string };
                    const label =
                      typeof v === "number"
                        ? v > 0
                          ? "Moved"
                          : v < 0
                            ? "Stuck"
                            : "Unclear / deferred"
                        : String(v);
                    return [label, `${p?.institution ?? ""} · ${p?.full ?? ""}`];
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
