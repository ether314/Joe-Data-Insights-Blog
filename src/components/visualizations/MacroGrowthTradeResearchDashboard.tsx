"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
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
  ECONOMIES,
  GDP_TRAJECTORIES,
  GLOBAL_PATH,
  HEADLINE,
  REGION_COLORS,
  SOURCE_NOTE,
  SOURCES,
  TRADE_MODE_PATH,
  economiesForYear,
  fmtPct,
  rankedContributions,
  type EconomyId,
} from "@/data/macro-growth-trade-research-2026-data";

// viz-types: triad composed (area+dual lines), multi-country GDP trajectories, growth×CPI scatter, regional contribution lollipop, goods-vs-services grouped bars | layout: default

type PanelMode = "triad" | "trajectories" | "scatter" | "regions" | "modes";
type YearMode = 2025 | 2026;
type PathRange = "full" | "post22";

const GDP_C = "#0ea5e9";
const TRADE_C = "#14b8a6";
const CPI_C = "#f59e0b";
const MERCH_C = "#6366f1";
const SVC_C = "#ec4899";

const TRAJ_COLORS: Record<Exclude<EconomyId, "gbr" | "bra" | "mex" | "sau" | "zaf">, string> = {
  usa: "#0ea5e9",
  eur: "#8b5cf6",
  chn: "#f43f5e",
  ind: "#f59e0b",
  jpn: "#14b8a6",
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

function ToggleGroup<T extends string | number>({
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
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <div className="inline-flex flex-wrap rounded-lg border border-slate-200 bg-white p-0.5">
        {options.map((o) => (
          <button
            key={String(o.id)}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              value === o.id ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PctTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string; dataKey?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const sorted = sortTooltipPayload(payload);
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-semibold text-slate-800">{label}</p>
      {sorted.map((p) => (
        <p key={String(p.dataKey ?? p.name)} style={{ color: p.color }} className="font-medium">
          {p.name}: {fmtPct(Number(p.value ?? 0))}
        </p>
      ))}
    </div>
  );
}

export function MacroGrowthTradeResearchDashboard() {
  const [panel, setPanel] = useState<PanelMode>("triad");
  const [year, setYear] = useState<YearMode>(2025);
  const [range, setRange] = useState<PathRange>("full");

  const path = useMemo(() => {
    return range === "post22" ? GLOBAL_PATH.filter((d) => d.year >= 2022) : GLOBAL_PATH;
  }, [range]);

  const scatter = useMemo(() => {
    return economiesForYear(year).map((e) => ({
      ...e,
      fill: REGION_COLORS[e.region] ?? "#64748b",
      size: Math.abs(e.gdp) * 40 + 80,
    }));
  }, [year]);

  const contributions = useMemo(() => rankedContributions(), []);

  const tradeModes = useMemo(() => {
    return TRADE_MODE_PATH.map((r) => ({
      ...r,
      merchAbs: r.merchandise,
      svcAbs: r.services,
    }));
  }, []);

  return (
    <div
      className="site-content w-full min-w-0 space-y-6"
      data-viz="macro-growth-trade-research-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
          Growth, trade &amp; prices — IMF WEO Apr 2026 · WTO GTOS Mar 2026
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200">
          World merchandise trade volume rose{" "}
          <span className="font-semibold text-cyan-300">{fmtPct(HEADLINE.wtoMerch2025)}</span> in
          2025 — Asia alone contributed{" "}
          <span className="font-semibold text-amber-300">
            {HEADLINE.asiaShareOfTradeGrowthPct}%
          </span>{" "}
          of that lift — while PPP GDP grew {fmtPct(HEADLINE.worldGdp2025)}. Into 2026 the
          reference path slows trade to {fmtPct(HEADLINE.wtoMerch2026)} and ticks CPI up to{" "}
          {fmtPct(HEADLINE.worldCpi2026)}.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "2025 merch volume",
              value: fmtPct(HEADLINE.wtoMerch2025),
              sub: "WTO outturn",
            },
            {
              label: "Asia share of lift",
              value: `${HEADLINE.asiaShareOfTradeGrowthPct}%`,
              sub: `${HEADLINE.asiaContributionPp2025} pp of ${HEADLINE.wtoMerch2025}`,
            },
            {
              label: "2026 world GDP (PPP)",
              value: fmtPct(HEADLINE.worldGdp2026),
              sub: "IMF reference forecast",
            },
            {
              label: "2026 world CPI",
              value: fmtPct(HEADLINE.worldCpi2026),
              sub: "Up from 4.1% in 2025",
            },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {s.label}
              </p>
              <p className="mt-0.5 text-xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          label="Panel"
          value={panel}
          onChange={setPanel}
          options={[
            { id: "triad", label: "Global triad" },
            { id: "trajectories", label: "GDP paths" },
            { id: "scatter", label: "Growth × CPI" },
            { id: "regions", label: "Trade regions" },
            { id: "modes", label: "Goods vs services" },
          ]}
        />
        {(panel === "triad" || panel === "trajectories") && (
          <ToggleGroup
            label="Range"
            value={range}
            onChange={setRange}
            options={[
              { id: "full", label: "2019–27" },
              { id: "post22", label: "Post-2022" },
            ]}
          />
        )}
        {panel === "scatter" && (
          <ToggleGroup
            label="Year"
            value={year}
            onChange={setYear}
            options={[
              { id: 2025, label: "2025" },
              { id: 2026, label: "2026f" },
            ]}
          />
        )}
      </div>

      {panel === "triad" && (
        <ChartCard
          title="Global triad: GDP, merchandise trade volume, and CPI"
          subtitle="IMF PPP GDP & CPI · WTO merchandise volume · dashed = forecast years"
        >
          <div className="h-[340px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={220}>
              <ComposedChart data={path} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={["auto", "auto"]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<PctTooltip />} />
                <ReferenceLine yAxisId="left" y={0} stroke="#94a3b8" />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="merchVolume"
                  name="Merch. trade vol."
                  fill={TRADE_C}
                  fillOpacity={0.18}
                  stroke={TRADE_C}
                  strokeWidth={2}
                  strokeDasharray={undefined}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="worldGdpPpp"
                  name="World GDP (PPP)"
                  stroke={GDP_C}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="worldCpi"
                  name="World CPI"
                  stroke={CPI_C}
                  strokeWidth={2.5}
                  strokeDasharray="5 4"
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            2025: trade {fmtPct(HEADLINE.wtoMerch2025)} vs GDP {fmtPct(HEADLINE.worldGdp2025)}{" "}
            (PPP) / {fmtPct(HEADLINE.worldGdpMarket2025)} (market). 2026f: trade slows while CPI
            rises — the soft-landing triangle tilts.
          </p>
        </ChartCard>
      )}

      {panel === "trajectories" && (
        <ChartCard
          title="Multi-country real GDP trajectories"
          subtitle="IMF WEO Apr 2026 reference path for five major economies"
        >
          <div className="h-[340px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={220}>
              <LineChart
                data={
                  range === "post22"
                    ? GDP_TRAJECTORIES.filter((d) => d.year >= 2022)
                    : GDP_TRAJECTORIES
                }
                margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<PctTooltip />} />
                <ReferenceLine y={0} stroke="#94a3b8" />
                {(
                  [
                    ["usa", "United States"],
                    ["eur", "Euro area"],
                    ["chn", "China"],
                    ["ind", "India"],
                    ["jpn", "Japan"],
                  ] as const
                ).map(([key, name]) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={name}
                    stroke={TRAJ_COLORS[key]}
                    strokeWidth={2.25}
                    dot={{ r: 3 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium">
            {(
              [
                ["usa", "US"],
                ["eur", "Euro"],
                ["chn", "China"],
                ["ind", "India"],
                ["jpn", "Japan"],
              ] as const
            ).map(([k, label]) => (
              <span key={k} className="inline-flex items-center gap-1.5 text-slate-600">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: TRAJ_COLORS[k] }}
                />
                {label}
              </span>
            ))}
          </div>
        </ChartCard>
      )}

      {panel === "scatter" && (
        <ChartCard
          title={`Growth × CPI scatter — ${year === 2025 ? "2025 outturns" : "2026 reference forecast"}`}
          subtitle="Bubble size scales with |GDP growth|. Colors by region. Toggle year above."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={220}>
              <ScatterChart margin={{ top: 12, right: 20, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="cpi"
                  name="CPI"
                  unit="%"
                  tick={{ fontSize: 11 }}
                  label={{ value: "CPI YoY %", position: "insideBottom", offset: -4, fontSize: 11 }}
                  domain={[-1, "auto"]}
                />
                <YAxis
                  type="number"
                  dataKey="gdp"
                  name="GDP"
                  unit="%"
                  tick={{ fontSize: 11 }}
                  label={{ value: "Real GDP %", angle: -90, position: "insideLeft", fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="size" range={[60, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const r = payload[0].payload as (typeof scatter)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
                        <p className="font-bold text-slate-900">{r.name}</p>
                        <p className="text-slate-600">
                          GDP {fmtPct(r.gdp)} · CPI {fmtPct(r.cpi)}
                        </p>
                        <p className="text-slate-400">
                          {r.region} · {r.cpiConfidence}
                        </p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={2} stroke="#cbd5e1" strokeDasharray="4 4" />
                <ReferenceLine y={2} stroke="#cbd5e1" strokeDasharray="4 4" />
                <Scatter data={scatter} name="Economies">
                  {scatter.map((e) => (
                    <Cell key={e.id} fill={e.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
            {Object.entries(REGION_COLORS).map(([region, color]) => (
              <span key={region} className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                {region}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            China sits near the low-CPI / mid-growth quadrant; India anchors the high-growth edge;
            the US remains above-target on prices into 2026f ({fmtPct(3.2)} assumed CPI).
          </p>
        </ChartCard>
      )}

      {panel === "regions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Who drove 2025 merchandise volume growth?"
            subtitle="WTO: contribution in percentage points of the +4.6% world total (ranked)"
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={220}>
                <BarChart
                  layout="vertical"
                  data={contributions}
                  margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v} pp`}
                    domain={[0, 3.5]}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={78}
                    tick={{ fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0]?.payload as (typeof contributions)[0];
                      if (!row) return null;
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
                          <p className="font-semibold text-slate-800">{row.region}</p>
                          <p className="font-medium text-amber-700">
                            Contribution: {row.pp2025.toFixed(1)} pp
                          </p>
                          <p className="text-slate-500">
                            Share of 2025 lift: {row.sharePct} of 100
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="pp2025" name="Contribution (pp)" radius={[0, 6, 6, 0]}>
                    {contributions.map((r) => (
                      <Cell
                        key={r.region}
                        fill={r.region === "Asia" ? "#f59e0b" : "#64748b"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="2026f merchandise import volume by region"
            subtitle="WTO baseline regional import growth (ranked high → low)"
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={220}>
                <BarChart
                  layout="vertical"
                  data={[...contributions].sort(
                    (a, b) => b.merchImport2026f - a.merchImport2026f,
                  )}
                  margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 4]}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={78}
                    tick={{ fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const sorted = sortTooltipPayload(payload);
                      const row = sorted[0]?.payload as (typeof contributions)[0];
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
                          <p className="font-semibold text-slate-800">{row.region}</p>
                          <p className="font-medium text-indigo-600">
                            Import vol. 2026f: {fmtPct(row.merchImport2026f)}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="merchImport2026f" name="Import vol. 2026f" fill={MERCH_C} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              China&apos;s export volume rose {fmtPct(HEADLINE.chinaExportVolume2025)} in 2025 —
              about 30% of global export growth — even as US-bound shipments fell ~20% in value.
            </p>
          </ChartCard>
        </div>
      )}

      {panel === "modes" && (
        <ChartCard
          title="Goods vs services trade volume — and GDP"
          subtitle="WTO merchandise & commercial services volume vs world GDP at market rates"
        >
          <div className="h-[340px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={220}>
              <ComposedChart data={tradeModes} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<PctTooltip />} />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Bar dataKey="merchandise" name="Merchandise vol." fill={MERCH_C} radius={[4, 4, 0, 0]} />
                <Bar dataKey="services" name="Services vol." fill={SVC_C} radius={[4, 4, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="gdpMarket"
                  name="World GDP (market)"
                  stroke={GDP_C}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            In 2025 combined goods+services volume (~4.7%) outran market-rate GDP (2.9%). By 2026f
            they converge near ~2.7–2.8% — services stay firmer than goods as merchandise cools to{" "}
            {fmtPct(HEADLINE.wtoMerch2026)}.
          </p>
        </ChartCard>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-medium text-slate-700">{SOURCE_NOTE}</p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-700 underline-offset-2 hover:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-slate-500">
          Economies in scatter: {ECONOMIES.map((e) => e.short).join(", ")}.
        </p>
      </div>
    </div>
  );
}
