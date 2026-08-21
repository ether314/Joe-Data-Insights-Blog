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
  COUNTRY_RISK_SEATS,
  EQUIPMENT_REGIONS,
  EQUIP_PATH,
  GEO_SCATTER,
  HEADLINE,
  SOURCE_NOTE,
  STAGE_FLIPS,
  STACK_GEO_LAYERS,
  equipBars,
  equipPie,
  fmtBn,
  fmtPct,
  meterBars,
  riskSeatBars,
  stackGeoBars,
  type StackGeoLayer,
} from "@/data/ai-supply-chain-geography-2026-data";

// viz-types: equip bars+pie, stacked area path, stack-geo ladder bars, share×risk scatter, stage flip bars, risk-seat bars, meter compare | layout: default

type ViewId = "equipment" | "stack" | "stages" | "meters";
type EquipMetric = "share" | "billings";
type StackFilter = "all" | "upstream" | "midstream" | "downstream";
type StackMin = "0" | "70";

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
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              value === o.id
                ? "bg-slate-900 text-white"
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

export function AiSupplyChainGeography2026Dashboard() {
  const [view, setView] = useState<ViewId>("equipment");
  const [equipMetric, setEquipMetric] = useState<EquipMetric>("share");
  const [stackFilter, setStackFilter] = useState<StackFilter>("all");
  const [stackMin, setStackMin] = useState<StackMin>("0");

  const eBars = useMemo(() => {
    const rows = equipBars();
    return rows.map((r) => ({
      ...r,
      value: equipMetric === "share" ? r.sharePct : r.billingsBn,
    }));
  }, [equipMetric]);

  const ePie = useMemo(() => equipPie(), []);
  const path = useMemo(() => [...EQUIP_PATH], []);

  const stackBars = useMemo(() => {
    const min = stackMin === "70" ? 70 : 0;
    let rows = stackGeoBars(min);
    if (stackFilter !== "all") {
      rows = rows.filter((r) => r.stage === stackFilter);
    }
    return rows;
  }, [stackFilter, stackMin]);

  const scatter = useMemo(() => {
    if (stackFilter === "all") return GEO_SCATTER;
    return GEO_SCATTER.filter((p) => p.stage === stackFilter);
  }, [stackFilter]);

  const stageRows = useMemo(
    () =>
      STAGE_FLIPS.map((s) => ({
        stage: s.label.replace(/\s*\(.*\)/, ""),
        short: s.stage,
        eastAsia: s.eastAsiaSharePct,
        top1: s.top1SharePct,
        fill: s.fill,
        top1Region: s.top1Region,
      })),
    [],
  );

  const riskBars = useMemo(() => riskSeatBars(), []);
  const meters = useMemo(() => meterBars(), []);

  return (
    <div
      className="space-y-6"
      data-viz="ai-supply-chain-geography-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
          AI semiconductor supply chain — geography lens
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          Where tool dollars, wafer seats, and design HQs land on the map
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          {HEADLINE.equipTop3Label} clear ~{HEADLINE.equipTop3Pct}% of 2025
          equipment billings, with {HEADLINE.equipTop1Label} alone at ~
          {HEADLINE.equipTop1Pct}%. Taiwan still gates leading-edge foundry (~
          {HEADLINE.taiwanFoundryLePct}%) and CoWoS (~{HEADLINE.taiwanCowosPct}
          %), Korea clears ~{HEADLINE.koreaHbmPct}%+ of HBM, and US design HQ
          owns ~{HEADLINE.usGpuHqPct}% of AI GPU revenue — four maps that
          disagree.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "CN+TW+KR equip",
              value: fmtPct(HEADLINE.equipTop3Pct, 1),
            },
            {
              label: "China equip tip",
              value: fmtPct(HEADLINE.equipTop1Pct, 1),
            },
            {
              label: "Taiwan foundry LE",
              value: fmtPct(HEADLINE.taiwanFoundryLePct),
            },
            {
              label: "Taiwan CoWoS",
              value: fmtPct(HEADLINE.taiwanCowosPct),
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-0.5 text-lg font-bold text-white">{k.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "equipment", label: "Equipment" },
            { id: "stack", label: "Stack geo" },
            { id: "stages", label: "Stages" },
            { id: "meters", label: "Meters" },
          ]}
        />
        {view === "equipment" && (
          <ToggleGroup
            label="Metric"
            value={equipMetric}
            onChange={setEquipMetric}
            options={[
              { id: "share", label: "Share %" },
              { id: "billings", label: "Billings $B" },
            ]}
          />
        )}
        {view === "stack" && (
          <>
            <ToggleGroup
              label="Stage"
              value={stackFilter}
              onChange={setStackFilter}
              options={[
                { id: "all", label: "All" },
                { id: "upstream", label: "Upstream" },
                { id: "midstream", label: "Midstream" },
                { id: "downstream", label: "Downstream" },
              ]}
            />
            <ToggleGroup
              label="Tip filter"
              value={stackMin}
              onChange={setStackMin}
              options={[
                { id: "0", label: "All layers" },
                { id: "70", label: "Top-1 ≥70%" },
              ]}
            />
          </>
        )}
      </div>

      {view === "equipment" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Regional equipment billings"
            subtitle={`SEMI 2025 WWSEMS · ${fmtBn(HEADLINE.equipTotalBn2025)} perimeter`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={eBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) =>
                      equipMetric === "share" ? `${v}%` : `$${v}B`
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="region"
                    width={64}
                    tick={{ fontSize: 12, fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      equipMetric === "share"
                        ? fmtPct(Number(v), 1)
                        : fmtBn(Number(v))
                    }
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {eBars.map((r) => (
                      <Cell key={r.region} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Equipment share pie"
            subtitle={`${HEADLINE.equipTop3Label} = ~${fmtPct(HEADLINE.equipTop3Pct, 1)}`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ePie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {ePie.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {EQUIPMENT_REGIONS.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-1.5 text-xs text-slate-600"
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: r.fill }}
                  />
                  {r.short} {fmtPct(r.sharePct, 1)}
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard
            title="East Asia trio path 2022–2025"
            subtitle="Editorial shape check — China / Taiwan / Korea vs other"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={path}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                  <Area
                    type="monotone"
                    dataKey="china"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.85}
                    name="China"
                  />
                  <Area
                    type="monotone"
                    dataKey="taiwan"
                    stackId="1"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.85}
                    name="Taiwan"
                  />
                  <Area
                    type="monotone"
                    dataKey="korea"
                    stackId="1"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.85}
                    name="Korea"
                  />
                  <Area
                    type="monotone"
                    dataKey="other"
                    stackId="1"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.7}
                    name="Other"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Install vs AI-gate role"
            subtitle="China leads dollars; Taiwan / Korea lead AI-relevant seats"
          >
            <div className="space-y-3 p-1">
              {EQUIPMENT_REGIONS.filter((r) =>
                ["china", "taiwan", "korea", "n-america", "japan"].includes(
                  r.id,
                ),
              ).map((r) => (
                <div key={r.id} className="rounded-lg border border-slate-100 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-800">
                      {r.region}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {fmtPct(r.sharePct, 1)} · {fmtBn(r.billingsBn)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{r.role}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {view === "stack" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Stack-layer country tip"
            subtitle="Geographic top-1 share by layer · filterable by stage"
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stackBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={72}
                    tick={{ fontSize: 11, fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(v, _n, ctx) => [
                      fmtPct(Number(v)),
                      (ctx?.payload as { top1Country?: string })?.top1Country ??
                        "Top-1",
                    ]}
                  />
                  <Bar dataKey="top1SharePct" radius={[0, 4, 4, 0]}>
                    {stackBars.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Share × risk scatter"
            subtitle="Country tip vs editorial risk score (bubble = tip size)"
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 12, right: 16, left: 8, bottom: 12 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="top1SharePct"
                    name="Top-1 %"
                    domain={[40, 105]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "Country top-1 share",
                      position: "insideBottom",
                      offset: -4,
                      fontSize: 11,
                      fill: "#94a3b8",
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="riskScore"
                    name="Risk"
                    domain={[4, 11]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    label={{
                      value: "Risk",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                      fill: "#94a3b8",
                    }}
                  />
                  <ZAxis type="number" dataKey="top1SharePct" range={[60, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) =>
                      name === "Top-1 %"
                        ? fmtPct(Number(v))
                        : String(v)
                    }
                    labelFormatter={(_, payload) => {
                      const p = payload?.[0]?.payload as
                        | { short?: string }
                        | undefined;
                      return p?.short ?? "";
                    }}
                  />
                  <Scatter data={scatter}>
                    {scatter.map((p) => (
                      <Cell key={p.id} fill={p.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Layer detail"
            subtitle={`${STACK_GEO_LAYERS.length} layers · country seats, not vendor names alone`}
          >
            <div className="max-h-[380px] space-y-2 overflow-y-auto">
              {(stackFilter === "all"
                ? STACK_GEO_LAYERS
                : STACK_GEO_LAYERS.filter(
                    (l) => l.stage === (stackFilter as StackGeoLayer["stage"]),
                  )
              ).map((l) => (
                <div
                  key={l.id}
                  className="rounded-lg border border-slate-100 px-3 py-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-800">
                      {l.short}
                      <span className="ml-2 text-xs font-normal text-slate-500">
                        {l.stage}
                      </span>
                    </span>
                    <span className="text-sm font-bold" style={{ color: l.fill }}>
                      {l.top1Country} {fmtPct(l.top1SharePct)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{l.note}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {view === "stages" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="East Asia share by stack stage"
            subtitle="Midstream is the geographic choke — upstream/downstream less so"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stageRows}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="short"
                    tick={{ fontSize: 12, fill: "#334155" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Bar dataKey="eastAsia" name="East Asia %" radius={[4, 4, 0, 0]}>
                    {stageRows.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Country risk seats"
            subtitle="Who gates critical layers — risk ≠ equipment-dollar rank"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={riskBars}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 10]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={40}
                    tick={{ fontSize: 12, fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(v, name) =>
                      name === "riskScore"
                        ? [String(v), "Risk score"]
                        : [String(v), String(name)]
                    }
                    labelFormatter={(l) => {
                      const row = COUNTRY_RISK_SEATS.find((c) => c.short === l);
                      return row ? `${row.country} · ${row.peakLayer}` : String(l);
                    }}
                  />
                  <Bar dataKey="riskScore" radius={[0, 4, 4, 0]}>
                    {riskBars.map((r) => (
                      <Cell key={r.short} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Stage flip cards"
            subtitle="Where each stage’s geographic tip sits"
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {STAGE_FLIPS.map((s) => (
                <div
                  key={s.stage}
                  className="rounded-lg border border-slate-100 p-3"
                  style={{ borderTopColor: s.fill, borderTopWidth: 3 }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {s.stage}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {s.top1Region}
                  </p>
                  <p className="mt-1 text-2xl font-bold" style={{ color: s.fill }}>
                    {fmtPct(s.eastAsiaSharePct)}
                  </p>
                  <p className="text-[11px] text-slate-500">East Asia share</p>
                  <p className="mt-2 text-xs text-slate-500">{s.note}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {view === "meters" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Geography meters that disagree"
            subtitle="Do not average these into one “chip geography is X” slogan"
          >
            <div className="h-[380px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={meters}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={140}
                    tick={{ fontSize: 10, fill: "#334155" }}
                  />
                  <Tooltip
                    formatter={(v, _n, ctx) => [
                      fmtPct(Number(v), 1),
                      (ctx?.payload as { top1?: string })?.top1 ?? "Top-1",
                    ]}
                  />
                  <Bar dataKey="sharePct" radius={[0, 4, 4, 0]}>
                    {meters.map((m) => (
                      <Cell key={m.label} fill={m.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Meter callouts"
            subtitle="Tool install ≠ wafer seat ≠ design HQ"
          >
            <div className="space-y-3">
              {meters.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {m.label}
                    </p>
                    <p className="text-xs text-slate-500">{m.top1}</p>
                  </div>
                  <p
                    className="text-xl font-bold tabular-nums"
                    style={{ color: m.fill }}
                  >
                    {fmtPct(m.sharePct, 1)}
                  </p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
