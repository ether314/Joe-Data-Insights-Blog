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
  BUILD_VS_OWN,
  FAL_H1_2026,
  FORGE_SHOPS,
  HEADLINE,
  SECTOR_LEADER_DELTAS,
  SHIP_SHARE_PATH,
  SOURCE_NOTE,
  SOURCES,
  STEEL_LEADERS,
  VINTAGE_DELTAS,
  fmtPct,
  fmtPp,
  type Confidence,
} from "@/data/heavy-industrial-capacity-update-2026-data";

// viz-types: diverging vintage bars, ship trio area+line, steel dual bars, build-own scatter, FAL H1 bars, forge strip | layout: default
// viz-plan: UNCTAD −4.2 pp Asia trio + World Steel China −1.8 pp; docks/forges held; H1 duo Airbus 54%

type Tab = "deltas" | "ships" | "steel" | "own" | "aircraft" | "forges";
type DeltaFilter = "all" | "moved" | "held";
type OwnFilter = "all" | "shipping" | "aviation" | "steel";
type SteelMode = "share" | "yoy" | "mt";

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
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              value === o.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function confidenceTone(c: Confidence): string {
  if (c === "disclosed") return "text-emerald-700 bg-emerald-50";
  if (c === "derived") return "text-amber-700 bg-amber-50";
  if (c === "estimated") return "text-sky-700 bg-sky-50";
  return "text-slate-600 bg-slate-100";
}

export function HeavyIndustrialCapacityUpdate2026Dashboard() {
  const [tab, setTab] = useState<Tab>("deltas");
  const [deltaFilter, setDeltaFilter] = useState<DeltaFilter>("all");
  const [ownFilter, setOwnFilter] = useState<OwnFilter>("all");
  const [steelMode, setSteelMode] = useState<SteelMode>("share");

  const deltaRows = useMemo(() => {
    return VINTAGE_DELTAS.filter((d) => {
      if (deltaFilter === "moved") return d.deltaPp !== 0;
      if (deltaFilter === "held") return d.deltaPp === 0;
      return true;
    }).map((d) => ({
      ...d,
      fill: d.deltaPp > 0 ? "#be123c" : d.deltaPp < 0 ? "#0369a1" : "#94a3b8",
    }));
  }, [deltaFilter]);

  const ownPoints = useMemo(() => {
    return BUILD_VS_OWN.filter(
      (p) => ownFilter === "all" || p.sector === ownFilter,
    );
  }, [ownFilter]);

  const steelBars = useMemo(() => {
    return STEEL_LEADERS.map((s) => {
      if (steelMode === "yoy") {
        return {
          label: s.short,
          value: s.yoyPct,
          fill: s.yoyPct >= 0 ? "#be123c" : "#0369a1",
          color: s.color,
        };
      }
      if (steelMode === "mt") {
        return {
          label: s.short,
          value: s.mt2025,
          prior: s.mt2024,
          fill: s.color,
          color: s.color,
        };
      }
      return {
        label: s.short,
        value: s.share2025Pct,
        prior: s.share2024Pct,
        fill: s.color,
        color: s.color,
      };
    });
  }, [steelMode]);

  const shipSeries = useMemo(
    () =>
      SHIP_SHARE_PATH.map((m) => ({
        label: m.label,
        year: m.year,
        china: m.chinaPct,
        korea: m.koreaPct,
        japan: m.japanPct,
        trio: m.trioPct,
        rest: Math.max(0, 100 - m.trioPct),
      })),
    [],
  );

  const sectorCompare = useMemo(
    () =>
      SECTOR_LEADER_DELTAS.map((s) => ({
        label: s.short,
        prior: s.priorLeaderShare,
        neu: s.newLeaderShare,
        delta: s.deltaPp,
        fill: s.color,
        status: s.status,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="heavy-industrial-capacity-update-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Vintage delta · Aug 2026
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Asia ship trio slips to {fmtPct(HEADLINE.asiaTrioNewPct, 0)} of 2025
          GT
          <span className="ml-2 text-lg font-semibold text-sky-300">
            ({fmtPp(HEADLINE.asiaTrioDeltaPp)})
          </span>
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Versus the research print ({fmtPct(HEADLINE.asiaTrioPriorPct)} on
          2024 deliveries). China crude steel share also eases to{" "}
          {fmtPct(HEADLINE.chinaSteelNewPct)} ({fmtPp(HEADLINE.chinaSteelDeltaPp)}
          ). VLCC docks and the six-shop forge club are unchanged.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["deltas", "Vintage Δ"],
            ["ships", "Ship path"],
            ["steel", "Steel 2025"],
            ["own", "Build vs own"],
            ["aircraft", "Aircraft H1"],
            ["forges", "Forges held"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "deltas" && (
        <div className="space-y-4">
          <ToggleGroup
            label="Show"
            value={deltaFilter}
            options={[
              { id: "all", label: "All metrics" },
              { id: "moved", label: "Moved only" },
              { id: "held", label: "Held / flat" },
            ]}
            onChange={setDeltaFilter}
          />
          <ChartCard
            title="Prior research → newest official print"
            subtitle="Diverging percentage-point change (pp). Blue = down; rose = up; gray = held."
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={deltaRows}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`}
                    domain={["dataMin - 0.5", "dataMax + 0.5"]}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={88}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value, _n, item) => {
                      const row = item?.payload as (typeof deltaRows)[0];
                      return [
                        `${fmtPp(Number(value))}  (${row.prior} → ${row.neu})`,
                        row.label,
                      ];
                    }}
                  />
                  <ReferenceLine x={0} stroke="#64748b" />
                  <Bar dataKey="deltaPp" radius={[0, 4, 4, 0]}>
                    {deltaRows.map((d) => (
                      <Cell key={d.id} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {deltaRows.map((d) => (
                <li
                  key={d.id}
                  className={`rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${confidenceTone(d.confidence)}`}
                >
                  {d.short}: {d.confidence}
                </li>
              ))}
            </ul>
          </ChartCard>
          <ChartCard
            title="Sector leader shares — prior vs new"
            subtitle="Grouped bars: research vintage (slate) vs Aug 2026 print."
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorCompare} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="prior" name="Prior" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="neu" name="New" fill="#0f172a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "ships" && (
        <ChartCard
          title="Asia ship trio GT path — with 2025 UNCTAD print"
          subtitle="Stacked China / Korea / Japan shares; line = trio total. 2025 country splits are derived into the disclosed 91% trio."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={shipSeries} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  formatter={(value, name) => [fmtPct(Number(value)), String(name)]}
                />
                <Area
                  type="monotone"
                  dataKey="china"
                  stackId="1"
                  fill="#ef4444"
                  stroke="#ef4444"
                  name="China"
                  fillOpacity={0.85}
                />
                <Area
                  type="monotone"
                  dataKey="korea"
                  stackId="1"
                  fill="#3b82f6"
                  stroke="#3b82f6"
                  name="Korea"
                  fillOpacity={0.85}
                />
                <Area
                  type="monotone"
                  dataKey="japan"
                  stackId="1"
                  fill="#14b8a6"
                  stroke="#14b8a6"
                  name="Japan"
                  fillOpacity={0.85}
                />
                <Line
                  type="monotone"
                  dataKey="trio"
                  stroke="#0f172a"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  name="Asia trio"
                />
                <ReferenceLine
                  y={91}
                  stroke="#0369a1"
                  strokeDasharray="4 4"
                  label={{ value: "2025 trio 91%", fill: "#0369a1", fontSize: 11 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {tab === "steel" && (
        <div className="space-y-4">
          <ToggleGroup
            label="Metric"
            value={steelMode}
            options={[
              { id: "share", label: "World share %" },
              { id: "yoy", label: "YoY % change" },
              { id: "mt", label: "Million tonnes" },
            ]}
            onChange={setSteelMode}
          />
          <ChartCard
            title={
              steelMode === "yoy"
                ? "2025 crude steel — YoY production change"
                : steelMode === "mt"
                  ? "Crude steel output — 2024 vs 2025 (Mt)"
                  : "Crude steel world share — 2024 vs 2025"
            }
            subtitle="World Steel Association 2025 totals. China −4.4% YoY; India +10.4%."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                {steelMode === "yoy" ? (
                  <BarChart data={steelBars} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(v) => [`${Number(v).toFixed(1)}%`, "YoY"]} />
                    <ReferenceLine y={0} stroke="#64748b" />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {steelBars.map((s) => (
                        <Cell key={s.label} fill={s.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <BarChart data={steelBars} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="prior" name={steelMode === "mt" ? "2024 Mt" : "2024 %"} fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="value" name={steelMode === "mt" ? "2025 Mt" : "2025 %"} fill="#0f172a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "own" && (
        <div className="space-y-4">
          <ToggleGroup
            label="Sector"
            value={ownFilter}
            options={[
              { id: "all", label: "All" },
              { id: "shipping", label: "Shipping" },
              { id: "aviation", label: "Aviation" },
              { id: "steel", label: "Steel" },
            ]}
            onChange={setOwnFilter}
          />
          <ChartCard
            title="Build vs own — updated ownership vintage"
            subtitle="X = build / delivery share; Y = ownership or demand proxy. Diagonal = 1:1. China ownership rises toward Greece."
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="buildSharePct"
                    name="Build"
                    domain={[0, 60]}
                    tick={{ fontSize: 11 }}
                    label={{ value: "Build share %", position: "insideBottom", offset: -4, fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="ownSharePct"
                    name="Own"
                    domain={[0, 55]}
                    tick={{ fontSize: 11 }}
                    label={{ value: "Own / demand %", angle: -90, position: "insideLeft", fontSize: 11 }}
                  />
                  <ZAxis range={[80, 80]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(value, name) => [
                      fmtPct(Number(value)),
                      name === "buildSharePct" ? "Build" : "Own",
                    ]}
                    labelFormatter={(_, payload) => {
                      const p = payload?.[0]?.payload as (typeof ownPoints)[0] | undefined;
                      return p ? `${p.label} — ${p.vintageNote}` : "";
                    }}
                  />
                  <ReferenceLine
                    segment={[
                      { x: 0, y: 0 },
                      { x: 55, y: 55 },
                    ]}
                    stroke="#cbd5e1"
                    strokeDasharray="4 4"
                  />
                  <Scatter data={ownPoints} name="Builders">
                    {ownPoints.map((p) => (
                      <Cell key={p.id} fill={p.color} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "aircraft" && (
        <ChartCard
          title="H1 2026 commercial deliveries — Airbus / Boeing duo"
          subtitle="Cirium: 649 combined (+14% vs prior half). Renton MAX-8 alone still ~31% of the duo."
        >
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={FAL_H1_2026}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="short" width={100} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value, _n, item) => {
                    const row = item?.payload as (typeof FAL_H1_2026)[0];
                    return [`${value} (${fmtPct(row.sharePct)}) — ${row.note}`, row.label];
                  }}
                />
                <Bar dataKey="deliveries" radius={[0, 4, 4, 0]}>
                  {FAL_H1_2026.map((r) => (
                    <Cell key={r.id} fill={r.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {tab === "forges" && (
        <ChartCard
          title="Ultra-heavy forge inventory — held at six shops"
          subtitle="No new Western RPV-class member since the research post. Equal-weight shop strip (not throughput-weighted)."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FORGE_SHOPS.map((f) => (
              <div
                key={f.id}
                className="rounded-lg border border-slate-200 px-4 py-3"
                style={{ borderLeftWidth: 4, borderLeftColor: f.color }}
              >
                <p className="text-sm font-bold text-slate-900">{f.short}</p>
                <p className="text-xs text-slate-500">{f.name}</p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  {f.country} · inventory held
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-600">
            North America still has <strong>zero</strong> shops in this
            RPV-class set. Dry-dock China share remains ~{HEADLINE.vlccDockChinaPct}%
            of the tracked VLCC-capable inventory.
          </p>
        </ChartCard>
      )}

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-medium text-slate-700">Sources</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.label}>
              <a
                href={s.url}
                className="text-sky-700 underline-offset-2 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
