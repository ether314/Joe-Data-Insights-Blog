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
  AUTHORITY_LAYERS,
  HEADLINE,
  IMF_CHAIR_BUCKETS,
  MEMBERS,
  QUOTA_REFORM_PATH,
  SOURCE_NOTE,
  UNSC_VETO_SERIES,
  fmtPct,
  fmtPp,
  ibrdGapPp,
  imfGapPp,
  type InstitutionMember,
} from "@/data/geopolitics-institutions-research-2026-data";

// viz-types: scatter, diverging-bar, stacked-area, donut, horizontal-bar | layout: default

type VoteMetric = "imf" | "ibrd";
type RegionFilter =
  | "All"
  | "Americas"
  | "Europe"
  | "Asia-Pacific"
  | "Africa"
  | "Middle East";
type GapSort = "gap" | "votes" | "gdp";

const COLORS = {
  imf: "#0f766e",
  ibrd: "#4f46e5",
  gdp: "#d97706",
  us: "#0ea5e9",
  cn: "#dc2626",
  ru: "#7c3aed",
  uk: "#64748b",
  fr: "#6366f1",
  over: "#0f766e",
  under: "#be123c",
  layer: "#1e293b",
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
  tone = "light",
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`text-xs font-semibold uppercase tracking-wide ${
          dark ? "text-teal-100/80" : "text-slate-500"
        }`}
      >
        {label}
      </span>
      <div
        className={`inline-flex flex-wrap rounded-lg border p-0.5 ${
          dark ? "border-slate-600 bg-slate-900/60" : "border-slate-200 bg-white"
        }`}
      >
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              value === o.id
                ? dark
                  ? "bg-teal-500 text-slate-900"
                  : "bg-slate-900 text-white"
                : dark
                  ? "text-slate-200 hover:bg-slate-800"
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

function voteOf(m: InstitutionMember, metric: VoteMetric): number {
  return metric === "imf" ? m.imfVotePct : m.ibrdVotePct;
}

function gapOf(m: InstitutionMember, metric: VoteMetric): number {
  return metric === "imf" ? imfGapPp(m) : ibrdGapPp(m);
}

export function GeopoliticsInstitutionsResearchDashboard() {
  const [voteMetric, setVoteMetric] = useState<VoteMetric>("imf");
  const [region, setRegion] = useState<RegionFilter>("All");
  const [gapSort, setGapSort] = useState<GapSort>("gap");

  const filtered = useMemo(() => {
    return MEMBERS.filter((m) => region === "All" || m.region === region);
  }, [region]);

  const scatterData = useMemo(
    () =>
      filtered.map((m) => ({
        name: m.name,
        gdp: m.gdpPppPct,
        votes: voteOf(m, voteMetric),
        pop: m.populationPct,
        unsc: m.unscPermanent,
        gap: gapOf(m, voteMetric),
      })),
    [filtered, voteMetric],
  );

  const gapBars = useMemo(() => {
    const rows = filtered.map((m) => ({
      name: m.name.length > 14 ? m.name.slice(0, 12) + "…" : m.name,
      full: m.name,
      gap: gapOf(m, voteMetric),
      votes: voteOf(m, voteMetric),
      gdp: m.gdpPppPct,
    }));
    rows.sort((a, b) => {
      if (gapSort === "votes") return b.votes - a.votes;
      if (gapSort === "gdp") return b.gdp - a.gdp;
      return b.gap - a.gap;
    });
    return rows;
  }, [filtered, voteMetric, gapSort]);

  const reformData = useMemo(
    () =>
      QUOTA_REFORM_PATH.map((r) => ({
        year: r.label,
        "US votes": r.usVotePct,
        "China votes": r.chinaVotePct,
        "EMDE bloc (est.)": r.emdeVotePct,
        event: r.event,
      })),
    [],
  );

  const vetoStacked = useMemo(
    () =>
      UNSC_VETO_SERIES.map((y) => ({
        year: String(y.year),
        US: y.us,
        Russia: y.ru,
        China: y.cn,
        UK: y.uk,
        France: y.fr,
      })),
    [],
  );

  const chairPie = useMemo(
    () =>
      IMF_CHAIR_BUCKETS.filter((b) => b.chairs > 0 || b.voteSharePct > 0).map((b) => ({
        name: b.label,
        value: b.voteSharePct,
        chairs: b.chairs,
        members: b.membersApprox,
        color: b.color,
      })),
    [],
  );

  const metricLabel = voteMetric === "imf" ? "IMF vote share" : "IBRD vote share";

  return (
    <div
      className="site-content w-full min-w-0 space-y-6"
      data-viz="geopolitics-institutions-research-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-200/90">
          Institutions & governance
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          Who holds the keys: voting power vs economic weight
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          The US holds {fmtPct(HEADLINE.imfUsVotePct)} of IMF votes — enough alone to block the{" "}
          {HEADLINE.imfSpecialMajorityPct}% special majority. China&apos;s PPP GDP share (~
          {fmtPct(HEADLINE.chinaGdpPppPct)}) still sits far above its ~{fmtPct(HEADLINE.imfChinaVotePct)}{" "}
          IMF vote share. Toggle institution and region below.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <ToggleGroup
            label="Institution"
            value={voteMetric}
            onChange={setVoteMetric}
            tone="dark"
            options={[
              { id: "imf", label: "IMF votes" },
              { id: "ibrd", label: "IBRD votes" },
            ]}
          />
          <ToggleGroup
            label="Region"
            value={region}
            onChange={setRegion}
            tone="dark"
            options={[
              { id: "All", label: "All" },
              { id: "Americas", label: "Americas" },
              { id: "Europe", label: "Europe" },
              { id: "Asia-Pacific", label: "Asia-Pac" },
              { id: "Africa", label: "Africa" },
              { id: "Middle East", label: "Mideast" },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Votes vs GDP: who is over- and under-represented?"
          subtitle={`Scatter of ${metricLabel} against PPP GDP share. Diagonal = proportional representation.`}
        >
          <div className="h-[340px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 16, bottom: 28, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="gdp"
                  name="GDP"
                  unit="%"
                  tick={{ fontSize: 11 }}
                  label={{ value: "PPP GDP share %", position: "insideBottom", offset: -16, fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="votes"
                  name="Votes"
                  unit="%"
                  tick={{ fontSize: 11 }}
                  label={{ value: "Vote share %", angle: -90, position: "insideLeft", fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="pop" range={[60, 280]} />
                <Tooltip
                  formatter={(value, name) => [
                    typeof value === "number" ? fmtPct(value) : String(value ?? ""),
                    name === "gdp" ? "GDP PPP" : name === "votes" ? "Votes" : String(name ?? ""),
                  ]}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as { name?: string; unsc?: boolean } | undefined;
                    return p?.name ? `${p.name}${p.unsc ? " · UNSC P5" : ""}` : "";
                  }}
                />
                <ReferenceLine x={0} y={0} stroke="transparent" />
                <ReferenceLine
                  ifOverflow="extendDomain"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  segment={[
                    { x: 0, y: 0 },
                    { x: 20, y: 20 },
                  ]}
                />
                <Scatter name="Members" data={scatterData} fill={COLORS.imf}>
                  {scatterData.map((d) => (
                    <Cell
                      key={d.name}
                      fill={d.unsc ? COLORS.cn : voteMetric === "imf" ? COLORS.imf : COLORS.ibrd}
                      fillOpacity={0.85}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Bubble size ∝ population share. Red-tinted markers = UNSC permanent members.
          </p>
        </ChartCard>

        <ChartCard
          title="Representation gap: votes minus GDP share"
          subtitle="Positive = more votes than economic weight; negative = under-represented."
        >
          <div className="mb-3">
            <ToggleGroup
              label="Sort"
              value={gapSort}
              onChange={setGapSort}
              options={[
                { id: "gap", label: "By gap" },
                { id: "votes", label: "By votes" },
                { id: "gdp", label: "By GDP" },
              ]}
            />
          </div>
          <div className="h-[340px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={gapBars}
                margin={{ top: 4, right: 24, bottom: 4, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`}
                  label={{ value: "pp gap", position: "insideBottom", offset: -2, fontSize: 11 }}
                />
                <YAxis type="category" dataKey="name" width={88} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value) => [fmtPp(Number(value)), "Vote − GDP"]}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as { full?: string } | undefined;
                    return p?.full ?? "";
                  }}
                />
                <ReferenceLine x={0} stroke="#64748b" />
                <Bar dataKey="gap" name="Gap" radius={[0, 4, 4, 0]}>
                  {gapBars.map((d) => (
                    <Cell key={d.full} fill={d.gap >= 0 ? COLORS.over : COLORS.under} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Authority layers: how decisions are structured"
        subtitle="Formal power is not one ledger — vetoes, special majorities, and one-country-one-vote sit in different layers."
      >
        <div className="space-y-3">
          {AUTHORITY_LAYERS.map((layer) => (
            <div key={layer.id} className="rounded-lg border border-slate-100 bg-slate-50/80 p-3 sm:p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-slate-900">{layer.label}</p>
                  <p className="text-xs text-slate-500">
                    {layer.institution} · {layer.seatsOrChairs} seats/chairs · {layer.membersCovered}{" "}
                    members covered
                  </p>
                </div>
                <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  weight {layer.weight}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-teal-700"
                  style={{ width: `${layer.weight}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-600">
                <span className="font-semibold">Rule:</span> {layer.decisionRule}. {layer.powerNote}
              </p>
            </div>
          ))}
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="IMF quota reform path: shares barely moved"
          subtitle="16th General Review raised quota volume 50% but left relative voting power largely frozen."
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reformData} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="EMDE bloc (est.)"
                  stackId="1"
                  stroke="#94a3b8"
                  fill="#cbd5e1"
                  fillOpacity={0.45}
                />
                <Area
                  type="monotone"
                  dataKey="US votes"
                  stroke={COLORS.us}
                  fill={COLORS.us}
                  fillOpacity={0.35}
                />
                <Area
                  type="monotone"
                  dataKey="China votes"
                  stroke={COLORS.cn}
                  fill={COLORS.cn}
                  fillOpacity={0.35}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="IMF board compression: 190 members → 24 chairs"
          subtitle="Vote share by chair cluster — single-country chairs still dominate the board."
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chairPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {chairPie.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, _n, item) => {
                    const p = item?.payload as { chairs?: number; members?: number } | undefined;
                    return [
                      `${fmtPct(Number(value))} votes · ${p?.chairs ?? "—"} chairs · ~${p?.members ?? "—"} members`,
                      "Cluster",
                    ];
                  }}
                />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{ fontSize: 10, maxWidth: 180 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="UNSC vetoes in practice: negative power used"
        subtitle="Annual veto counts by permanent member — absolute blocks that no vote share can override."
      >
        <div className="h-[300px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vetoStacked} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Russia" stackId="v" fill={COLORS.ru} />
              <Bar dataKey="China" stackId="v" fill={COLORS.cn} />
              <Bar dataKey="US" stackId="v" fill={COLORS.us} />
              <Bar dataKey="UK" stackId="v" fill={COLORS.uk} />
              <Bar dataKey="France" stackId="v" fill={COLORS.fr} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
