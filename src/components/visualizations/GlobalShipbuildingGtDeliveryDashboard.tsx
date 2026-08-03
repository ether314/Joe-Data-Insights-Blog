"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  BUILD_VS_OWN,
  DELIVERY_BUILDERS,
  HEADLINE,
  SHARE_MILESTONES,
  SOURCE_NOTE,
  SOURCES,
  TOP_OWNERS,
  VESSEL_SEGMENTS,
  fmtKgt,
  fmtPct,
  segmentLeader,
} from "@/data/global-shipbuilding-gt-delivery-concentration-data";

// viz-types: share-treemap SVG, build-vs-own scatter, segment stacked bars, milestone area, ownership lollipop | layout: default

type Tab = "deliveries" | "segments" | "own" | "pipeline";
type UnitMode = "share" | "gt";
type SegmentMetric = "trio" | "world";

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
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Squarified-ish horizontal treemap for builder delivery shares */
function DeliveryTreemap({ unit }: { unit: UnitMode }) {
  const rows = DELIVERY_BUILDERS;
  const total =
    unit === "share"
      ? rows.reduce((s, r) => s + r.share2024Pct, 0)
      : rows.reduce((s, r) => s + r.gt2024K, 0);

  let x = 0;
  const cells = rows.map((r) => {
    const w =
      unit === "share" ? (r.share2024Pct / total) * 100 : (r.gt2024K / total) * 100;
    const cell = { ...r, x, w };
    x += w;
    return cell;
  });

  return (
    <div className="space-y-3">
      <svg viewBox="0 0 100 28" className="h-28 w-full" role="img" aria-label="Delivery share treemap">
        {cells.map((c) => (
          <g key={c.id}>
            <rect
              x={c.x}
              y={0}
              width={Math.max(c.w - 0.15, 0)}
              height={28}
              fill={c.color}
              rx={0.4}
            />
            {c.w > 8 && (
              <text
                x={c.x + c.w / 2}
                y={12}
                textAnchor="middle"
                fill="#fff"
                fontSize={3.2}
                fontWeight={700}
              >
                {c.shortLabel}
              </text>
            )}
            {c.w > 8 && (
              <text
                x={c.x + c.w / 2}
                y={18}
                textAnchor="middle"
                fill="#fff"
                fontSize={2.8}
                opacity={0.95}
              >
                {unit === "share" ? fmtPct(c.share2024Pct) : fmtKgt(c.gt2024K)}
              </text>
            )}
          </g>
        ))}
      </svg>
      <div className="flex flex-wrap gap-3 text-xs text-slate-600">
        {rows.map((r) => (
          <span key={r.id} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ background: r.color }}
            />
            {r.shortLabel}{" "}
            <span className="font-semibold text-slate-800">
              {unit === "share" ? fmtPct(r.share2024Pct) : fmtKgt(r.gt2024K)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function BuildOwnDumbbell() {
  const max = 60;
  return (
    <div className="space-y-4">
      {BUILD_VS_OWN.map((row) => {
        const bx = (row.buildSharePct / max) * 100;
        const ox = (row.ownSharePct / max) * 100;
        const left = Math.min(bx, ox);
        const width = Math.abs(bx - ox);
        return (
          <div key={row.country} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3">
            <span className="text-sm font-semibold text-slate-800">{row.country}</span>
            <div className="relative h-8">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-200" />
              <div
                className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full opacity-40"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  background: row.color,
                }}
              />
              <div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
                style={{ left: `${bx}%`, background: row.color }}
                title={`Build ${fmtPct(row.buildSharePct)}`}
              />
              <div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-700 bg-white shadow"
                style={{ left: `${ox}%` }}
                title={`Own ${fmtPct(row.ownSharePct)}`}
              />
            </div>
            <span className="whitespace-nowrap text-xs tabular-nums text-slate-500">
              <span className="font-semibold" style={{ color: row.color }}>
                {fmtPct(row.buildSharePct)}
              </span>
              {" / "}
              <span className="font-semibold text-slate-800">{fmtPct(row.ownSharePct)}</span>
            </span>
          </div>
        );
      })}
      <p className="text-xs text-slate-500">
        Filled dots = GT delivery share (2024). Hollow dots = beneficial ownership share of fleet
        dwt (1 Jan 2025). Scale to 60%.
      </p>
    </div>
  );
}

export function GlobalShipbuildingGtDeliveryDashboard() {
  const [tab, setTab] = useState<Tab>("deliveries");
  const [unit, setUnit] = useState<UnitMode>("share");
  const [segMetric, setSegMetric] = useState<SegmentMetric>("trio");
  const [hoverSeg, setHoverSeg] = useState<string | null>(null);

  const milestoneSeries = useMemo(
    () =>
      SHARE_MILESTONES.map((m) => ({
        year: String(m.year),
        China: m.china,
        Korea: m.korea,
        Japan: m.japan,
        note: m.note,
      })),
    [],
  );

  const segmentBars = useMemo(() => {
    return VESSEL_SEGMENTS.map((s) => {
      if (segMetric === "world") {
        return {
          name: s.shortLabel,
          full: s.segment,
          China: (s.chinaKgt / s.worldKgt) * 100,
          Korea: (s.koreaKgt / s.worldKgt) * 100,
          Japan: (s.japanKgt / s.worldKgt) * 100,
          leader: segmentLeader(s),
          worldShare: s.worldSharePct,
        };
      }
      const trio = s.chinaKgt + s.koreaKgt + s.japanKgt || 1;
      return {
        name: s.shortLabel,
        full: s.segment,
        China: (s.chinaKgt / trio) * 100,
        Korea: (s.koreaKgt / trio) * 100,
        Japan: (s.japanKgt / trio) * 100,
        leader: segmentLeader(s),
        worldShare: s.worldSharePct,
      };
    });
  }, [segMetric]);

  const scatterData = useMemo(
    () =>
      BUILD_VS_OWN.map((r) => ({
        ...r,
        gap: r.buildSharePct - r.ownSharePct,
        z: Math.max(r.buildSharePct, r.ownSharePct),
      })),
    [],
  );

  const ownerPie = useMemo(
    () =>
      TOP_OWNERS.slice(0, 6).map((o) => ({
        name: o.shortLabel,
        value: o.ownershipPct,
        color: o.color,
      })),
    [],
  );

  return (
    <div
      data-viz="global-shipbuilding-gt-delivery"
      className="space-y-6"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
          Global shipbuilding · GT deliveries
        </p>
        <h2 className="mt-1 text-xl font-bold sm:text-2xl">
          China delivers {fmtPct(HEADLINE.chinaShare2024Pct)} of world GT — and owns{" "}
          {fmtPct(HEADLINE.chinaOwnershipPct)} of the fleet
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          UNCTAD RMT 2025: {fmtKgt(HEADLINE.totalDeliveries2024Kgt)} added in 2024. East Asia&apos;s
          trio (China, Korea, Japan) shipped {fmtPct(HEADLINE.asiaTrioShare2024Pct)} of new capacity.
          Greece still owns more carrying capacity than China.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "China GT share 2024", value: fmtPct(HEADLINE.chinaShare2024Pct) },
            { label: "Asia trio share", value: fmtPct(HEADLINE.asiaTrioShare2024Pct) },
            { label: "China orderbook", value: fmtPct(HEADLINE.chinaOrderbookStart2025Pct) },
            { label: "Greece ownership", value: fmtPct(HEADLINE.greeceOwnershipPct) },
          ].map((k) => (
            <div key={k.label} className="rounded-lg bg-white/5 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-slate-400">{k.label}</p>
              <p className="text-lg font-bold tabular-nums text-white">{k.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToggleGroup
          label="Panel"
          value={tab}
          onChange={setTab}
          options={[
            { id: "deliveries", label: "Deliveries" },
            { id: "segments", label: "By segment" },
            { id: "own", label: "Build vs own" },
            { id: "pipeline", label: "Pipeline" },
          ]}
        />
        {tab === "deliveries" && (
          <ToggleGroup
            label="Units"
            value={unit}
            onChange={setUnit}
            options={[
              { id: "share", label: "% of world GT" },
              { id: "gt", label: "Thousand GT" },
            ]}
          />
        )}
        {tab === "segments" && (
          <ToggleGroup
            label="Stack"
            value={segMetric}
            onChange={setSegMetric}
            options={[
              { id: "trio", label: "Within Asia trio" },
              { id: "world", label: "% of world segment" },
            ]}
          />
        )}
      </div>

      {tab === "deliveries" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Who delivered 2024 merchant-ship GT"
            subtitle="Horizontal share strip — China alone out-delivers Korea + Japan combined"
          >
            <DeliveryTreemap unit={unit} />
          </ChartCard>

          <ChartCard
            title="Share milestones — Japan → Korea → China"
            subtitle="Selected UNCTAD / Clarksons benchmarks (not a continuous annual series)"
          >
            <div className="h-64 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={milestoneSeries} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 60]}
                  />
                  <Tooltip
                    formatter={(v) => fmtPct(Number(v))}
                    labelFormatter={(l, payload) => {
                      const note = payload?.[0]?.payload?.note;
                      return note ? `${l} — ${note}` : String(l);
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Japan"
                    stackId="1"
                    stroke="#14b8a6"
                    fill="#14b8a6"
                    fillOpacity={0.55}
                  />
                  <Area
                    type="monotone"
                    dataKey="Korea"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.55}
                  />
                  <Area
                    type="monotone"
                    dataKey="China"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.7}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "segments" && (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ChartCard
              title="Segment leadership — China vs Korea vs Japan"
              subtitle={
                segMetric === "trio"
                  ? "Share of Asia-trio GT within each vessel type (2024)"
                  : "Each builder’s share of world segment GT (2024)"
              }
            >
              <div className="h-80 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={segmentBars}
                    layout="vertical"
                    margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis type="category" dataKey="name" width={72} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(v) => fmtPct(Number(v))}
                      labelFormatter={(l) => {
                        const row = segmentBars.find((s) => s.name === l);
                        return row
                          ? `${row.full} · leader ${row.leader} · ${fmtPct(row.worldShare)} of world GT`
                          : String(l);
                      }}
                    />
                    <Bar
                      dataKey="China"
                      stackId="a"
                      fill="#ef4444"
                      onMouseEnter={(d) => {
                        const payload = (
                          d as { payload?: { full?: string } }
                        ).payload;
                        setHoverSeg(payload?.full ?? null);
                      }}
                      onMouseLeave={() => setHoverSeg(null)}
                    />
                    <Bar dataKey="Korea" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="Japan" stackId="a" fill="#14b8a6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
          <div className="lg:col-span-2">
            <ChartCard
              title="World GT mix by vessel type"
              subtitle="Containers + bulk = ~68% of 2024 deliveries"
            >
              <div className="h-64 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={VESSEL_SEGMENTS.map((s) => ({
                        name: s.shortLabel,
                        value: s.worldSharePct,
                        full: s.segment,
                      }))}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={48}
                      outerRadius={88}
                      paddingAngle={2}
                    >
                      {VESSEL_SEGMENTS.map((s, i) => (
                        <Cell
                          key={s.segment}
                          fill={
                            ["#0ea5e9", "#f59e0b", "#8b5cf6", "#64748b", "#84cc16", "#f43f5e"][i]
                          }
                          opacity={
                            hoverSeg && hoverSeg !== s.segment ? 0.35 : 1
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 space-y-1 text-xs text-slate-600">
                {VESSEL_SEGMENTS.map((s) => (
                  <li key={s.segment} className="flex justify-between gap-2">
                    <span>{s.segment}</span>
                    <span className="font-semibold tabular-nums text-slate-800">
                      {fmtPct(s.worldSharePct)} · {segmentLeader(s)} leads
                    </span>
                  </li>
                ))}
              </ul>
            </ChartCard>
          </div>
        </div>
      )}

      {tab === "own" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Build vs own — the ownership gap"
            subtitle="Who welds the steel vs who owns the carrying capacity"
          >
            <BuildOwnDumbbell />
          </ChartCard>

          <ChartCard
            title="Ownership gap scatter"
            subtitle="X = GT build share · Y = fleet ownership share · size ∝ max(build, own)"
          >
            <div className="h-72 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="buildSharePct"
                    name="Build"
                    unit="%"
                    domain={[0, 60]}
                    tick={{ fontSize: 11 }}
                    label={{ value: "Build share %", position: "insideBottom", offset: -2, fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="ownSharePct"
                    name="Own"
                    unit="%"
                    domain={[0, 20]}
                    tick={{ fontSize: 11 }}
                    label={{ value: "Own %", angle: -90, position: "insideLeft", fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) =>
                      name === "z" ? null : fmtPct(Number(v))
                    }
                    labelFormatter={() => ""}
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const d = payload[0].payload as (typeof scatterData)[0];
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                          <p className="font-bold text-slate-900">{d.country}</p>
                          <p>Build {fmtPct(d.buildSharePct)}</p>
                          <p>Own {fmtPct(d.ownSharePct)}</p>
                          <p className="text-slate-500">Gap {fmtPct(d.gap)}</p>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={scatterData}>
                    {scatterData.map((d) => (
                      <Cell key={d.country} fill={d.color} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Top fleet owners by dwt"
            subtitle="1 January 2025 · vessels ≥1,000 GT"
          >
            <div className="space-y-2.5">
              {TOP_OWNERS.map((o) => (
                <div key={o.country} className="flex items-center gap-3">
                  <span className="w-5 text-xs tabular-nums text-slate-400">{o.rank}</span>
                  <span className="w-28 text-sm font-medium text-slate-800">{o.shortLabel}</span>
                  <div className="relative h-3 flex-1 rounded-full bg-slate-100">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: `${(o.ownershipPct / HEADLINE.greeceOwnershipPct) * 100}%`,
                        background: o.color,
                      }}
                    />
                  </div>
                  <span className="w-14 text-right text-xs font-semibold tabular-nums text-slate-800">
                    {fmtPct(o.ownershipPct)}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard
            title="Ownership concentration (top 6)"
            subtitle="Greece + China + Japan ≈ 40% of world dwt"
          >
            <div className="h-56 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ownerPie}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {ownerPie.map((o) => (
                      <Cell key={o.name} fill={o.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "pipeline" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="China’s pipeline lock-in"
            subtitle="Deliveries lag contracting — the orderbook is even more concentrated"
          >
            <div className="h-64 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { stage: "Deliveries 2024", China: 54.6, Rest: 45.4 },
                    { stage: "Orderbook start-25", China: 63.7, Rest: 36.3 },
                    { stage: "Contracting 2024", China: 74.4, Rest: 25.6 },
                  ]}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Bar dataKey="China" stackId="a" fill="#ef4444" />
                  <Bar dataKey="Rest" stackId="a" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Capacity context"
            subtitle="348 active yards worldwide in 2024 — half the 2007 peak"
          >
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  k: "China GT deliveries",
                  v: fmtPct(HEADLINE.chinaShare2024Pct),
                  d: "of world 2024 output",
                },
                {
                  k: "China contracting",
                  v: fmtPct(HEADLINE.chinaContracting2024Pct),
                  d: "of GT ordered in 2024",
                },
                {
                  k: "China orderbook",
                  v: fmtPct(HEADLINE.chinaOrderbookStart2025Pct),
                  d: "of global GT on order",
                },
                {
                  k: "US commercial build",
                  v: fmtPct(HEADLINE.usBuildShare2024Pct, 2),
                  d: "of world GT (naval is separate)",
                },
                {
                  k: "Active yards 2024",
                  v: "348",
                  d: "vs ~739 peak in 2007",
                },
                {
                  k: "Chinese yards",
                  v: "120",
                  d: "~45% of yard capacity · ~60% orderbook",
                },
              ].map((row) => (
                <div
                  key={row.k}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3"
                >
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {row.k}
                  </dt>
                  <dd className="mt-1 text-xl font-bold tabular-nums text-slate-900">{row.v}</dd>
                  <dd className="text-xs text-slate-500">{row.d}</dd>
                </div>
              ))}
            </dl>
          </ChartCard>
        </div>
      )}

      <footer className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-800">Sources & notes</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
