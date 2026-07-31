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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  BOTTLENECK_LAYERS,
  COWOS_CAPACITY,
  EQUIPMENT_CYCLE,
  HEADLINE,
  REGION_COLORS,
  SEGMENT_GROWTH,
  SOURCE_NOTE,
  SOURCES,
  fmtBn,
  fmtPct,
  fmtWpm,
  regionalForYear,
} from "@/data/ai-supply-chain-research-2026-data";

// viz-types: composed area+line equipment cycle, regional bars, segment growth bars, bottleneck scatter, CoWoS capacity|demand | layout: default

type FocusYear = 2024 | 2025 | 2026;
type PanelMode = "cycle" | "regions" | "segments" | "bottlenecks" | "cowos";
type SegmentMetric = "y2026" | "yoy2026Pct" | "path";

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
              value === o.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AiSupplyChainResearchDashboard() {
  const [focusYear, setFocusYear] = useState<FocusYear>(2025);
  const [panel, setPanel] = useState<PanelMode>("cycle");
  const [segmentMetric, setSegmentMetric] = useState<SegmentMetric>("y2026");
  const [regionFilter, setRegionFilter] = useState<"all" | "asia3">("all");

  const regions = useMemo(() => {
    const rows = regionalForYear(focusYear);
    if (regionFilter === "asia3") {
      return rows.filter((r) => ["China", "Taiwan", "Korea"].includes(r.region));
    }
    return rows;
  }, [focusYear, regionFilter]);

  const segmentPathBars = useMemo(
    () =>
      SEGMENT_GROWTH.filter((s) => !("indexBase" in s && s.indexBase)).map((s) => ({
        label: s.label,
        y2025: s.y2025,
        y2026: s.y2026,
        y2028: s.y2028,
        color: s.color,
      })),
    [],
  );

  const segmentLevelBars = useMemo(
    () =>
      SEGMENT_GROWTH.map((s) => ({
        label: s.label.replace(" (index)", ""),
        value: segmentMetric === "yoy2026Pct" ? s.yoy2026Pct : s.y2026,
        color: s.color,
      })),
    [segmentMetric],
  );

  const scatterData = useMemo(
    () =>
      BOTTLENECK_LAYERS.map((l) => ({
        name: l.label,
        x: l.leadWeeks,
        y: l.tightness,
        z: l.concentrationPct,
        fill: l.color,
        note: l.note,
      })),
    [],
  );

  const cowosRows = useMemo(
    () =>
      COWOS_CAPACITY.map((r) => ({
        year: String(r.year),
        capacityAnnual: Math.round((r.capacityWpm * 12) / 1000),
        demand: Math.round(r.demandWafers / 1000),
      })),
    [],
  );

  const asiaShare = useMemo(() => {
    const rows = regionalForYear(focusYear);
    const total = rows.reduce((s, r) => s + r.value, 0);
    const asia = rows
      .filter((r) => ["China", "Taiwan", "Korea", "Japan"].includes(r.region))
      .reduce((s, r) => s + r.value, 0);
    return total > 0 ? Math.round((asia / total) * 100) : 0;
  }, [focusYear]);

  return (
    <div className="space-y-6" data-viz="ai-supply-chain-research">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 p-5 text-white shadow-sm sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
          Semiconductor supply chain — equipment cycle & bottlenecks
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-2xl font-bold tabular-nums sm:text-3xl">
              {fmtBn(HEADLINE.totalEquip2026)}
            </p>
            <p className="mt-1 text-sm text-slate-300">SEMI total equipment forecast · 2026</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums sm:text-3xl">
              {fmtPct(HEADLINE.taiwanYoyPct)}
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Taiwan equipment billings YoY · 2025 ({fmtBn(HEADLINE.taiwan2025)})
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums sm:text-3xl">
              {fmtPct(HEADLINE.dramYoyPct)}
            </p>
            <p className="mt-1 text-sm text-slate-300">
              DRAM equipment sales YoY · 2026 ({fmtBn(HEADLINE.dramEquip2026)})
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <ToggleGroup
          label="Panel"
          value={panel}
          onChange={setPanel}
          options={[
            { id: "cycle", label: "Equipment cycle" },
            { id: "regions", label: "Regions" },
            { id: "segments", label: "Segments" },
            { id: "bottlenecks", label: "Bottlenecks" },
            { id: "cowos", label: "CoWoS" },
          ]}
        />
        {(panel === "regions" || panel === "cycle") && (
          <ToggleGroup
            label="Focus year"
            value={focusYear}
            onChange={setFocusYear}
            options={[
              { id: 2024, label: "2024" },
              { id: 2025, label: "2025" },
              { id: 2026, label: "2026" },
            ]}
          />
        )}
        {panel === "regions" && (
          <ToggleGroup
            label="Filter"
            value={regionFilter}
            onChange={setRegionFilter}
            options={[
              { id: "all", label: "All regions" },
              { id: "asia3", label: "CN / TW / KR" },
            ]}
          />
        )}
        {panel === "segments" && (
          <ToggleGroup
            label="Metric"
            value={segmentMetric}
            onChange={setSegmentMetric}
            options={[
              { id: "y2026", label: "2026 $ / index" },
              { id: "yoy2026Pct", label: "YoY %" },
              { id: "path", label: "2025→2028 path" },
            ]}
          />
        )}
      </div>

      {panel === "cycle" && (
        <ChartCard
          title="Equipment cycle: total OEM sales vs wafer fab equipment"
          subtitle={`SEMI path through 2028 · focus marker on ${focusYear} · Asia share of ${focusYear} billings ≈ ${asiaShare}%`}
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={EQUIPMENT_CYCLE} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `$${v}`}
                  label={{ value: "USD bn", angle: -90, position: "insideLeft", offset: 10 }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const sorted = sortTooltipPayload(payload);
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow">
                        <p className="font-semibold text-slate-900">{label}</p>
                        {sorted.map((p) => (
                          <p key={String(p.dataKey)} style={{ color: p.color }}>
                            {p.name}: {fmtBn(Number(p.value))}
                          </p>
                        ))}
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Total equipment"
                  fill="#0ea5e933"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="wfe"
                  name="WFE"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            2026 total {fmtBn(HEADLINE.totalEquip2026)} (+23.2% YoY) · WFE {fmtBn(HEADLINE.wfe2026)} ·
            2028 total {fmtBn(HEADLINE.totalEquip2028)}
          </p>
        </ChartCard>
      )}

      {panel === "regions" && (
        <ChartCard
          title="Regional equipment billings"
          subtitle={
            focusYear === 2026
              ? "2026 bars are directional shares scaled to SEMI’s $165.9B total — not an official regional release"
              : `SEMI WWSEMS · ${focusYear}`
          }
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regions} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}B`} />
                <YAxis type="category" dataKey="region" width={88} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(v) => fmtBn(Number(v))}
                  contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }}
                />
                <Bar dataKey="value" name="Billings" radius={[0, 4, 4, 0]}>
                  {regions.map((r) => (
                    <Cell key={r.region} fill={REGION_COLORS[r.region] ?? "#64748b"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {focusYear === 2025 && (
            <p className="mt-2 text-xs text-slate-500">
              Standout: Taiwan {fmtBn(31.5)} ({fmtPct(90)} YoY) on TSMC 2nm + CoWoS; China still #1 at{" "}
              {fmtBn(49.3)} but flat.
            </p>
          )}
        </ChartCard>
      )}

      {panel === "segments" && (
        <ChartCard
          title="Segment pressure: memory, WFE, and back-end"
          subtitle={
            segmentMetric === "yoy2026Pct"
              ? "2026 YoY % (test/assembly show 2025 SEMI growth rates as the latest disclosed)"
              : segmentMetric === "path"
                ? "USD bn path for DRAM, NAND, and total WFE"
                : "2026 levels — index series for test & assembly (2024=100)"
          }
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              {segmentMetric === "path" ? (
                <BarChart data={segmentPathBars} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} angle={-18} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ borderRadius: 8 }} />
                  <Bar dataKey="y2025" name="2025" fill="#94a3b8" />
                  <Bar dataKey="y2026" name="2026" fill="#0ea5e9" />
                  <Bar dataKey="y2028" name="2028" fill="#6366f1" />
                </BarChart>
              ) : (
                <BarChart data={segmentLevelBars} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} angle={-18} textAnchor="end" height={60} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) =>
                      segmentMetric === "yoy2026Pct" ? `${v}%` : String(v)
                    }
                  />
                  <Tooltip
                    formatter={(v) =>
                      segmentMetric === "yoy2026Pct" ? fmtPct(Number(v)) : String(v)
                    }
                    contentStyle={{ borderRadius: 8 }}
                  />
                  <Bar dataKey="value" name={segmentMetric === "yoy2026Pct" ? "YoY %" : "Level"} radius={[4, 4, 0, 0]}>
                    {segmentLevelBars.map((r) => (
                      <Cell key={r.label} fill={r.color} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "bottlenecks" && (
        <ChartCard
          title="Stack bottleneck map"
          subtitle="X = typical lead time (weeks) · Y = tightness (1–10) · bubble = supplier concentration %"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Lead weeks"
                  tick={{ fontSize: 12 }}
                  domain={[20, 80]}
                  label={{ value: "Lead time (weeks)", position: "insideBottom", offset: -2 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Tightness"
                  tick={{ fontSize: 12 }}
                  domain={[4, 11]}
                  label={{ value: "Tightness", angle: -90, position: "insideLeft" }}
                />
                <ZAxis type="number" dataKey="z" range={[80, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload as (typeof scatterData)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow">
                        <p className="font-semibold text-slate-900">{d.name}</p>
                        <p>Tightness: {d.y}/10</p>
                        <p>Lead: {d.x} weeks</p>
                        <p>Concentration: {d.z}%</p>
                        <p className="mt-1 text-xs text-slate-500">{d.note}</p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatterData} name="Layers">
                  {scatterData.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
            {BOTTLENECK_LAYERS.map((l) => (
              <li key={l.id} className="flex items-start gap-2">
                <span
                  className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: l.color }}
                />
                <span>
                  <strong className="text-slate-800">{l.label}</strong> — {l.note}
                </span>
              </li>
            ))}
          </ul>
        </ChartCard>
      )}

      {panel === "cowos" && (
        <ChartCard
          title="CoWoS capacity vs accelerator demand"
          subtitle="Annualized capacity (k wafers) vs estimated demand — packaging remains the binding AI GPU gate"
        >
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cowosRows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}k`} />
                <Tooltip
                  formatter={(v) => `${v}k wafers/yr`}
                  contentStyle={{ borderRadius: 8 }}
                />
                <Bar dataKey="capacityAnnual" name="Capacity (annualized)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="demand"
                  name="Demand"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            End-2025 ~{fmtWpm(HEADLINE.cowosWpm2025)} · 2026 target ~{fmtWpm(HEADLINE.cowosWpm2026Target)}{" "}
            (TSMC / TrendForce trackers)
          </p>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">
        {SOURCE_NOTE}{" "}
        {SOURCES.map((s, i) => (
          <span key={s.url}>
            {i > 0 ? " · " : ""}
            <a className="underline decoration-slate-300 hover:text-slate-700" href={s.url} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}
