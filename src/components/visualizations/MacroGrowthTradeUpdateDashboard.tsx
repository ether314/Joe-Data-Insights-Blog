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
  DUAL_PATH,
  ECONOMIES,
  ECONOMY_COLORS,
  EXPOSURE_COLORS,
  EXPOSURE_REVISIONS,
  GLOBAL_METERS,
  HEADLINE,
  OIL_BRIDGE,
  REGION_COLORS,
  SOURCE_NOTE,
  SOURCES,
  economyDeltas,
  fmtPct,
  fmtPp,
} from "@/data/macro-growth-trade-update-2026-data";

// viz-types: vintage Δ bars, prior→new dumbbell, dual-vintage composed path, exposure revision bars, growth×CPI scatter | layout: default
// viz-plan: country GDP Δ; meter dumbbell; Apr vs Jul triad path; war/tech exposure revisions; scatter with vintage toggle; year + region + meter controls

type YearMode = 2026 | 2027;
type RegionFilter = "All" | "Americas" | "Europe" | "Asia" | "EM other";
type PathMeter = "gdp" | "trade" | "cpi" | "all";
type ScatterVintage = "apr" | "jul" | "both";

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
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={String(o.id)}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              on ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function MacroGrowthTradeUpdateDashboard() {
  const [year, setYear] = useState<YearMode>(2026);
  const [region, setRegion] = useState<RegionFilter>("All");
  const [pathMeter, setPathMeter] = useState<PathMeter>("all");
  const [scatterVintage, setScatterVintage] = useState<ScatterVintage>("both");

  const deltas = useMemo(() => {
    const all = economyDeltas();
    return region === "All" ? all : all.filter((d) => d.region === region);
  }, [region]);

  const deltaBars = useMemo(
    () =>
      deltas.map((d) => ({
        short: d.short,
        name: d.name,
        value: year === 2026 ? d.delta2026Pp : d.delta2027Pp,
        fill: ECONOMY_COLORS[d.id],
      })),
    [deltas, year],
  );

  const dumbbell = useMemo(
    () =>
      GLOBAL_METERS.map((m) => ({
        label: m.meter === "gdp" ? "GDP" : m.meter === "trade" ? "Trade" : "CPI",
        full: m.label,
        prior: year === 2026 ? m.apr2026 : m.apr2027,
        neu: year === 2026 ? m.jul2026 : m.jul2027,
        delta: year === 2026 ? m.delta2026Pp : m.delta2027Pp,
        fill: m.meter === "gdp" ? "#0ea5e9" : m.meter === "trade" ? "#14b8a6" : "#f59e0b",
      })),
    [year],
  );

  const pathData = useMemo(() => DUAL_PATH, []);

  const exposureBars = useMemo(
    () =>
      [...EXPOSURE_REVISIONS]
        .sort((a, b) => b.cumDeltaPp - a.cumDeltaPp)
        .map((r) => ({
          short: r.short,
          group: r.group,
          value: r.cumDeltaPp,
          fill: EXPOSURE_COLORS[r.kind],
        })),
    [],
  );

  const scatterPoints = useMemo(() => {
    const rows = ECONOMIES.filter((e) => e.aprCpi2026 != null && e.julCpi2026 != null);
    const pts: {
      name: string;
      short: string;
      gdp: number;
      cpi: number;
      vintage: string;
      fill: string;
      z: number;
    }[] = [];
    for (const e of rows) {
      if (scatterVintage === "apr" || scatterVintage === "both") {
        pts.push({
          name: e.name,
          short: e.short,
          gdp: e.aprGdp2026,
          cpi: e.aprCpi2026!,
          vintage: "Apr",
          fill: REGION_COLORS[e.region],
          z: 80,
        });
      }
      if (scatterVintage === "jul" || scatterVintage === "both") {
        pts.push({
          name: e.name,
          short: e.short,
          gdp: e.julGdp2026,
          cpi: e.julCpi2026!,
          vintage: "Jul",
          fill: scatterVintage === "both" ? "#0f172a" : REGION_COLORS[e.region],
          z: scatterVintage === "both" ? 120 : 80,
        });
      }
    }
    return pts;
  }, [scatterVintage]);

  const oilBars = OIL_BRIDGE.map((o) => ({
    ...o,
    fill: o.vintage === "apr" ? "#94a3b8" : o.vintage === "jul" ? "#f59e0b" : "#14b8a6",
  }));

  return (
    <div className="space-y-6" data-viz="macro-growth-trade-update-2026">
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Vintage delta — Apr 2026 WEO → Jul 2026 Update
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Trade 2026 {fmtPct(HEADLINE.worldTrade2026)} ({fmtPp(HEADLINE.trade2026DeltaPp)}) · GDP{" "}
          {fmtPct(HEADLINE.worldGdp2026)} ({fmtPp(HEADLINE.gdp2026DeltaPp)}) · CPI{" "}
          {fmtPct(HEADLINE.worldCpi2026)} ({fmtPp(HEADLINE.cpi2026DeltaPp)})
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Oil assumption rises to ${HEADLINE.oil2026}/bbl from ${HEADLINE.oilApr2026}. MENA GDP{" "}
          {fmtPct(HEADLINE.menaGdp2026)} ({fmtPp(HEADLINE.menaGdp2026DeltaPp)}). Korea{" "}
          {fmtPct(HEADLINE.koreaGdp2026)} ({fmtPp(HEADLINE.koreaGdp2026DeltaPp)}) on AI hardware.
        </p>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
          <ToggleGroup
            label="Forecast year"
            value={year}
            options={[
              { id: 2026 as YearMode, label: "2026" },
              { id: 2027 as YearMode, label: "2027" },
            ]}
            onChange={setYear}
          />
          <ToggleGroup
            label="Region"
            value={region}
            options={[
              { id: "All" as RegionFilter, label: "All" },
              { id: "Americas" as RegionFilter, label: "Americas" },
              { id: "Europe" as RegionFilter, label: "Europe" },
              { id: "Asia" as RegionFilter, label: "Asia" },
              { id: "EM other" as RegionFilter, label: "EM other" },
            ]}
            onChange={setRegion}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Country GDP vintage change (pp)"
          subtitle={`July minus April for ${year} — filter by region`}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deltaBars} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} unit=" pp" />
                <YAxis type="category" dataKey="short" width={36} tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const sorted = sortTooltipPayload(payload);
                    const p = sorted[0]?.payload as { name: string; value: number };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <p className="font-semibold text-slate-900">{p.name}</p>
                        <p className="text-slate-600">{fmtPp(p.value)}</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {deltaBars.map((d) => (
                    <Cell key={d.short} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Global meters — prior → new (dumbbell)"
          subtitle={`April vs July levels for ${year}`}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dumbbell} layout="vertical" margin={{ left: 8, right: 24, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, "auto"]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="label" width={48} tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0]?.payload as {
                      full: string;
                      prior: number;
                      neu: number;
                      delta: number;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <p className="font-semibold text-slate-900">{p.full}</p>
                        <p className="text-slate-600">
                          Apr {p.prior.toFixed(1)}% → Jul {p.neu.toFixed(1)}% ({fmtPp(p.delta)})
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="prior" name="April" fill="#cbd5e1" radius={[0, 4, 4, 0]} maxBarSize={14} />
                <Bar dataKey="neu" name="July" radius={[0, 4, 4, 0]} maxBarSize={14}>
                  {dumbbell.map((d) => (
                    <Cell key={d.label} fill={d.fill} />
                  ))}
                </Bar>
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Dual-vintage path — growth, trade & prices"
        subtitle="Solid = July 2026 Update · dashed = April 2026 reference"
      >
        <div className="mb-3">
          <ToggleGroup
            label="Series"
            value={pathMeter}
            options={[
              { id: "all" as PathMeter, label: "All three" },
              { id: "gdp" as PathMeter, label: "GDP" },
              { id: "trade" as PathMeter, label: "Trade" },
              { id: "cpi" as PathMeter, label: "CPI" },
            ]}
            onChange={setPathMeter}
          />
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={pathData} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, "auto"]} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const sorted = sortTooltipPayload(payload);
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                      <p className="mb-1 font-semibold text-slate-900">{label}</p>
                      {sorted.map((item) => (
                        <p key={String(item.dataKey)} style={{ color: item.color as string }}>
                          {item.name}: {Number(item.value).toFixed(1)}%
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend />
              {(pathMeter === "all" || pathMeter === "gdp") && (
                <>
                  <Line
                    type="monotone"
                    dataKey="julGdp"
                    name="GDP Jul"
                    stroke="#0ea5e9"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="aprGdp"
                    name="GDP Apr"
                    stroke="#0ea5e9"
                    strokeWidth={1.5}
                    strokeDasharray="5 4"
                    dot={{ r: 3 }}
                    connectNulls
                  />
                </>
              )}
              {(pathMeter === "all" || pathMeter === "trade") && (
                <>
                  <Line
                    type="monotone"
                    dataKey="julTrade"
                    name="Trade Jul"
                    stroke="#14b8a6"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="aprTrade"
                    name="Trade Apr"
                    stroke="#14b8a6"
                    strokeWidth={1.5}
                    strokeDasharray="5 4"
                    dot={{ r: 3 }}
                    connectNulls
                  />
                </>
              )}
              {(pathMeter === "all" || pathMeter === "cpi") && (
                <>
                  <Line
                    type="monotone"
                    dataKey="julCpi"
                    name="CPI Jul"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="aprCpi"
                    name="CPI Apr"
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                    strokeDasharray="5 4"
                    dot={{ r: 3 }}
                    connectNulls
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Exposure revisions (cumulative 2026–27)"
          subtitle="War drag vs tech / energy-exporter upgrades — staff group means"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exposureBars} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} unit=" pp" />
                <YAxis type="category" dataKey="short" width={88} tick={{ fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0]?.payload as { group: string; value: number };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <p className="font-semibold text-slate-900">{p.group}</p>
                        <p className="text-slate-600">{fmtPp(p.value)} vs Jan Update path</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {exposureBars.map((d) => (
                    <Cell key={d.short} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Growth × CPI — disclosed CPI economies"
          subtitle="2026f GDP vs assumed CPI — toggle April / July / both"
        >
          <div className="mb-3">
            <ToggleGroup
              label="Vintage"
              value={scatterVintage}
              options={[
                { id: "both" as ScatterVintage, label: "Both" },
                { id: "apr" as ScatterVintage, label: "April" },
                { id: "jul" as ScatterVintage, label: "July" },
              ]}
              onChange={setScatterVintage}
            />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="cpi"
                  name="CPI"
                  unit="%"
                  tick={{ fontSize: 11 }}
                  domain={[2, 4]}
                  label={{ value: "CPI %", position: "insideBottom", offset: -2, fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="gdp"
                  name="GDP"
                  unit="%"
                  tick={{ fontSize: 11 }}
                  domain={[0, 3]}
                  label={{ value: "GDP %", angle: -90, position: "insideLeft", fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 160]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0]?.payload as {
                      name: string;
                      gdp: number;
                      cpi: number;
                      vintage: string;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                        <p className="font-semibold text-slate-900">
                          {p.name} ({p.vintage})
                        </p>
                        <p className="text-slate-600">
                          GDP {p.gdp.toFixed(1)}% · CPI {p.cpi.toFixed(1)}%
                        </p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatterPoints} fill="#0ea5e9">
                  {scatterPoints.map((p, i) => (
                    <Cell key={`${p.short}-${p.vintage}-${i}`} fill={p.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Oil assumption bridge ($/bbl)" subtitle="April reference → July baseline → 2027 futures">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={oilBars} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[70, 95]} unit="$" />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const p = payload[0]?.payload as { label: string; usd: number };
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                      <p className="font-semibold text-slate-900">{p.label}</p>
                      <p className="text-slate-600">${p.usd.toFixed(2)}/bbl</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="usd" radius={[4, 4, 0, 0]}>
                {oilBars.map((d) => (
                  <Cell key={d.label} fill={d.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} className="text-cyan-700 underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
