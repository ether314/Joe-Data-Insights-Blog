"use client";

import { useMemo, useState } from "react";
import {
  Area,
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
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  AIRCRAFT_MONTHLY_2026,
  AIRCRAFT_YTD,
  CAPACITY_RADAR,
  FORGE_SHOPS,
  HEADLINE,
  SECTOR_LEADER_DELTAS,
  SHIP_FLOW_2025,
  SOURCE_NOTE,
  SOURCES,
  STEEL_H1_LEADERS,
  STEEL_REGIONS_H1,
  VLCC_DOCK_HELD,
  VINTAGE_DELTAS,
  fmtMt,
  fmtPct,
  fmtPp,
  type Confidence,
} from "@/data/heavy-industrial-capacity-update-2026q3-data";

// viz-types: diverging Δ bars, ship completions-vs-orders grouped, steel H1 dual, aircraft monthly composed, capacity radar, dock+forge strip | layout: default
// viz-plan: China H1 steel −1.3 pp YoY share; JSEA orders 66% CN; Airbus duo YTD Jul 53.2%; docks/forges held

type Tab = "deltas" | "ships" | "steel" | "aircraft" | "radar" | "held";
type DeltaFilter = "all" | "moved" | "held";
type SteelMode = "share" | "yoy" | "mt" | "regions";
type ShipMode = "both" | "completions" | "orders" | "gap";

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

export function HeavyIndustrialCapacityUpdate2026q3Dashboard() {
  const [tab, setTab] = useState<Tab>("deltas");
  const [deltaFilter, setDeltaFilter] = useState<DeltaFilter>("all");
  const [steelMode, setSteelMode] = useState<SteelMode>("share");
  const [shipMode, setShipMode] = useState<ShipMode>("both");

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

  const shipRows = useMemo(() => {
    return SHIP_FLOW_2025.map((r) => {
      if (shipMode === "completions") {
        return { ...r, a: r.completionsPct, b: 0, labelA: "Completions" };
      }
      if (shipMode === "orders") {
        return { ...r, a: r.ordersPct, b: 0, labelA: "Orders" };
      }
      if (shipMode === "gap") {
        return {
          ...r,
          a: r.gapPp,
          b: 0,
          fill: r.gapPp >= 0 ? "#be123c" : "#0369a1",
          labelA: "Orders − completions (pp)",
        };
      }
      return {
        ...r,
        a: r.completionsPct,
        b: r.ordersPct,
        labelA: "Completions",
        labelB: "Orders",
      };
    });
  }, [shipMode]);

  const steelBars = useMemo(() => {
    type SteelBar = {
      label: string;
      value: number;
      fill: string;
      color: string;
      prior?: number;
      mt?: number;
    };
    if (steelMode === "regions") {
      return STEEL_REGIONS_H1.map(
        (s): SteelBar => ({
          label: s.short,
          value: s.yoyPct,
          fill: s.yoyPct >= 0 ? "#be123c" : "#0369a1",
          color: s.color,
          mt: s.mtH1,
        }),
      );
    }
    return STEEL_H1_LEADERS.map((s): SteelBar => {
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
          value: s.mtH1,
          fill: s.color,
          color: s.color,
        };
      }
      return {
        label: s.short,
        value: s.sharePct,
        prior: s.priorH1SharePct,
        fill: s.color,
        color: s.color,
      };
    });
  }, [steelMode]);

  const radarRows = useMemo(
    () =>
      CAPACITY_RADAR.map((r) => ({
        axis: r.short,
        prior: r.prior,
        neu: r.neu,
        full: r.axis,
        unit: r.unit,
      })),
    [],
  );

  const sectorCompare = useMemo(
    () =>
      SECTOR_LEADER_DELTAS.map((s) => ({
        label: s.short,
        prior: s.prior,
        neu: s.neu,
        delta: s.deltaPp,
        fill: s.color,
        status: s.status,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="heavy-industrial-capacity-update-2026q3"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Vintage delta · Q3 2026
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          China H1 steel share {fmtPct(HEADLINE.chinaSteelH1SharePct)}
          <span className="ml-2 text-lg font-semibold text-sky-300">
            ({fmtPp(HEADLINE.chinaSteelH1ShareDeltaPp)} YoY)
          </span>
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Versus the Aug update: World Steel H1 2026 print (
          {fmtMt(HEADLINE.chinaSteelH1Mt)} China, {fmtPct(HEADLINE.chinaSteelH1YoyPct, 1)}{" "}
          YoY). JSEA 2025 new orders put China at{" "}
          {fmtPct(HEADLINE.chinaOrdersGtPct, 0)} of GT booked —{" "}
          {fmtPp(HEADLINE.chinaOrdersVsCompletionsGapPp)} above same-year
          completions. Airbus duo YTD July: {fmtPct(HEADLINE.airbusDuoYtdJulPct)}{" "}
          ({fmtPp(HEADLINE.airbusDuoDeltaPp)} vs Cirium H1).
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["deltas", "Vintage Δ"],
            ["ships", "Yard flow"],
            ["steel", "Steel H1"],
            ["aircraft", "Aircraft YTD"],
            ["radar", "Capacity radar"],
            ["held", "Docks & forges"],
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
            title="Aug update → Q3 official print"
            subtitle="Diverging percentage-point change. Blue = down; rose = up; gray = held."
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
                    width={96}
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
            title="Sector leader scoreboard"
            subtitle="Prior → new leader share (or shop count for forges)."
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sectorCompare}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="prior" name="Prior" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="neu" name="Q3 print" fill="#0f172a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "ships" && (
        <div className="space-y-4">
          <ToggleGroup
            label="View"
            value={shipMode}
            options={[
              { id: "both", label: "Completions vs orders" },
              { id: "completions", label: "Completions only" },
              { id: "orders", label: "Orders only" },
              { id: "gap", label: "Order gap (pp)" },
            ]}
            onChange={setShipMode}
          />
          <ChartCard
            title="JSEA 2025 GT — completions vs new orders"
            subtitle="China books 66% of new GT while completing 52.6%. Korea/Japan complete more than they order."
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={shipRows}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}`}
                  />
                  <Tooltip
                    formatter={(value) => [
                      shipMode === "gap"
                        ? fmtPp(Number(value))
                        : fmtPct(Number(value)),
                      shipMode === "gap" ? "Gap" : "% GT",
                    ]}
                  />
                  {shipMode === "gap" ? (
                    <>
                      <ReferenceLine y={0} stroke="#64748b" />
                      <Bar dataKey="a" name="Orders − completions" radius={[4, 4, 0, 0]}>
                        {shipRows.map((r) => (
                          <Cell
                            key={r.id}
                            fill={
                              "fill" in r && r.fill
                                ? String(r.fill)
                                : r.gapPp >= 0
                                  ? "#be123c"
                                  : "#0369a1"
                            }
                          />
                        ))}
                      </Bar>
                    </>
                  ) : shipMode === "both" ? (
                    <>
                      <Bar
                        dataKey="a"
                        name="Completions %"
                        fill="#64748b"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="b"
                        name="Orders %"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                      />
                      <Legend />
                    </>
                  ) : (
                    <Bar dataKey="a" name="% GT" radius={[4, 4, 0, 0]}>
                      {shipRows.map((r) => (
                        <Cell key={r.id} fill={r.color} />
                      ))}
                    </Bar>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              UNCTAD still prints Asia trio completions at{" "}
              {fmtPct(HEADLINE.asiaTrioUnctadPct, 0)} — JSEA country splits are a
              parallel scope, not a replacement for the UNCTAD vintage.
            </p>
          </ChartCard>
        </div>
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
              { id: "regions", label: "Region YoY" },
            ]}
            onChange={setSteelMode}
          />
          <ChartCard
            title={
              steelMode === "regions"
                ? "H1 2026 crude steel by region (YoY %)"
                : "H1 2026 top producers — World Steel June release"
            }
            subtitle={`70-country pool: ${fmtMt(HEADLINE.worldSteelH1Mt)} (${fmtPct(HEADLINE.worldSteelH1YoyPct, 1)} YoY).`}
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                {steelMode === "share" ? (
                  <ComposedChart
                    data={steelBars}
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="prior"
                      name="H1'25 share (derived)"
                      fill="#94a3b8"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="value"
                      name="H1'26 share"
                      fill="#0f172a"
                      radius={[4, 4, 0, 0]}
                    />
                  </ComposedChart>
                ) : (
                  <BarChart
                    data={steelBars}
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value) =>
                        steelMode === "mt"
                          ? fmtMt(Number(value))
                          : fmtPct(Number(value), 1)
                      }
                    />
                    {(steelMode === "yoy" || steelMode === "regions") && (
                      <ReferenceLine y={0} stroke="#64748b" />
                    )}
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {steelBars.map((r, i) => (
                        <Cell key={`${r.label}-${i}`} fill={r.fill || r.color} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {tab === "aircraft" && (
        <ChartCard
          title="Airbus vs Boeing monthly deliveries, 2026 YTD"
          subtitle={`Through July: Airbus ${AIRCRAFT_YTD.airbus} / Boeing ${AIRCRAFT_YTD.boeing} = ${AIRCRAFT_YTD.duo} duo (${fmtPct(AIRCRAFT_YTD.airbusSharePct)} Airbus).`}
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={AIRCRAFT_MONTHLY_2026}
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="short" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Deliveries",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: "#64748b" },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[40, 65]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="duo"
                  name="Duo total"
                  fill="#e2e8f0"
                  stroke="#94a3b8"
                  fillOpacity={0.5}
                />
                <Bar
                  yAxisId="left"
                  dataKey="airbus"
                  name="Airbus"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="left"
                  dataKey="boeing"
                  name="Boeing"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="airbusSharePct"
                  name="Airbus % of duo"
                  stroke="#0f172a"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {tab === "radar" && (
        <ChartCard
          title="Cross-sector capacity intensity"
          subtitle="Prior (Aug update / H1) vs Q3 print. Forge axis is shop count; others are % shares."
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarRows} cx="50%" cy="52%" outerRadius="70%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fontSize: 11, fill: "#475569" }}
                />
                <PolarRadiusAxis tick={{ fontSize: 10 }} />
                <Radar
                  name="Prior"
                  dataKey="prior"
                  stroke="#94a3b8"
                  fill="#94a3b8"
                  fillOpacity={0.25}
                />
                <Radar
                  name="Q3 print"
                  dataKey="neu"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.35}
                />
                <Legend />
                <Tooltip
                  formatter={(value, name, item) => {
                    const row = item?.payload as (typeof radarRows)[0];
                    return [`${Number(value).toFixed(1)} ${row?.unit ?? ""}`, String(name)];
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {tab === "held" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="VLCC-capable dry docks (held)"
            subtitle="No new audited global registry — carried from research / Aug update."
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={VLCC_DOCK_HELD}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 70]} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={72}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v), 0)} />
                  <Bar dataKey="sharePct" radius={[0, 4, 4, 0]}>
                    {VLCC_DOCK_HELD.map((d) => (
                      <Cell key={d.id} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Ultra-heavy RPV-class forge shops (held)"
            subtitle={`${HEADLINE.ultraHeavyForgeShops}-shop club; still zero US members.`}
          >
            <ul className="grid gap-2 sm:grid-cols-2">
              {FORGE_SHOPS.map((f) => (
                <li
                  key={f.id}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <p className="text-sm font-semibold text-slate-900">{f.label}</p>
                  <p className="text-xs text-slate-500">
                    {f.country} · {f.note}
                  </p>
                  <span
                    className="mt-1 inline-block h-1.5 w-8 rounded-full"
                    style={{ backgroundColor: f.color }}
                  />
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-medium text-slate-800">Sources & caveats</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
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
