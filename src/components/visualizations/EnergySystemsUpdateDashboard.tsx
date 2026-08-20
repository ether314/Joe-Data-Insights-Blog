"use client";

import { useMemo, useState } from "react";
import {
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
  COMPANION_METERS,
  HEADLINE,
  POWER_SHARE_VINTAGE,
  PRIMARY_MIX_VINTAGE,
  SOURCE_NOTE,
  SOURCES,
  SYSTEM_DELTAS,
  TES_PATH,
  fmtEj,
  fmtNum,
  fmtPct,
  fmtPp,
  mixShareDeltas,
  powerShareDeltas,
  rankedGrowth,
  tradeByMeter,
  type TradeExposureRow,
} from "@/data/energy-systems-update-2026-data";

// viz-types: TES growth bars, primary-mix Δ diverging, power-share dumbbell, trade exposure bars, TES×fossil path, companion scatter | layout: default
// viz-plan: panel + trade-meter controls; vintage delta first; no KPI+bar clone

type Panel = "growth" | "mix" | "power" | "trade" | "path" | "companions";
type TradeMeter = TradeExposureRow["meter"] | "all";

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
                ? "bg-slate-800 text-white"
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

const PANEL_OPTS: { id: Panel; label: string }[] = [
  { id: "growth", label: "TES growth" },
  { id: "mix", label: "Mix Δ" },
  { id: "power", label: "Power vintage" },
  { id: "trade", label: "Trade exposure" },
  { id: "path", label: "TES path" },
  { id: "companions", label: "CO₂ & storage" },
];

const TRADE_OPTS: { id: TradeMeter; label: string }[] = [
  { id: "all", label: "All meters" },
  { id: "oil-import", label: "Oil import %" },
  { id: "gas-import", label: "Gas import %" },
  { id: "lng-export-growth", label: "LNG growth" },
  { id: "coal-demand", label: "Coal demand" },
];

export function EnergySystemsUpdateDashboard() {
  const [panel, setPanel] = useState<Panel>("growth");
  const [tradeMeter, setTradeMeter] = useState<TradeMeter>("all");

  const growth = useMemo(() => rankedGrowth(), []);
  const mixDeltas = useMemo(() => mixShareDeltas(), []);
  const powerDeltas = useMemo(() => powerShareDeltas(), []);
  const tradeRows = useMemo(() => tradeByMeter(tradeMeter), [tradeMeter]);

  const pathData = useMemo(
    () =>
      TES_PATH.map((r) => ({
        year: r.year,
        tesEj: r.tesEj,
        fossilSharePct: r.fossilSharePct,
        renewSharePct: r.renewSharePct,
        confidence: r.confidence,
      })),
    [],
  );

  const companionScatter = useMemo(
    () =>
      COMPANION_METERS.map((m) => ({
        short: m.short,
        label: m.label,
        color: m.color,
        growth: m.growthPct ?? 0,
        index: m.value,
        prior: m.prior,
        unit: m.unit,
      })),
    [],
  );

  const dumbbell = useMemo(
    () =>
      SYSTEM_DELTAS.filter((r) =>
        ["world-tes", "world-fossil", "solar-power", "us-lng"].includes(r.id),
      ).map((r) => ({
        short: r.short,
        color: r.color,
        prior: r.researchValue,
        neu: r.updateValue,
        delta: Math.round((r.updateValue - r.researchValue) * 10) / 10,
        unit: r.unit,
      })),
    [],
  );

  return (
    <div className="space-y-6" data-viz="energy-systems-update-2026">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <p className="text-sm font-semibold text-amber-950">
          Renewables lead TES growth outside a recession (+
          {HEADLINE.renewGrowthEj} EJ) while fossils still supply{" "}
          {fmtPct(HEADLINE.fossilShare2025Pct)} of primary energy — and solar
          overtakes wind in the power mix (
          {fmtPct(HEADLINE.solarPowerShare2025Pct)} vs{" "}
          {fmtPct(HEADLINE.windPowerShare2025Pct)}).
        </p>
        <p className="mt-1 text-xs text-amber-800">
          EI Statistical Review 2026 (2025 year) vs research post&apos;s 2024
          vintage · TES {HEADLINE.tes2025Ej} EJ (+{HEADLINE.tesGrowthPct}%) · US
          LNG exports +{HEADLINE.usLngExportGrowthPct}%
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={panel}
          options={PANEL_OPTS}
          onChange={setPanel}
        />
        {panel === "trade" && (
          <ToggleGroup
            label="Trade meter"
            value={tradeMeter}
            options={TRADE_OPTS}
            onChange={setTradeMeter}
          />
        )}
      </div>

      {panel === "growth" && (
        <ChartCard
          title="Who added energy in 2025"
          subtitle="Absolute contribution to TES growth (EJ) — renewables largest outside a recession"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={growth}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v} EJ`}
                />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={72}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(v) => [`${Number(v).toFixed(1)} EJ`, "Δ TES"]}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.label ?? "")
                  }
                />
                <Bar dataKey="deltaEj" radius={[0, 4, 4, 0]}>
                  {growth.map((r) => (
                    <Cell key={r.id} fill={r.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Solar alone supplied ~{HEADLINE.solarShareOfRenewGrowthPct}% of the
            renewables increment. Oil still added {fmtEj(HEADLINE.oilGrowthEj)}{" "}
            and gas {fmtEj(HEADLINE.gasGrowthEj)}.
          </p>
        </ChartCard>
      )}

      {panel === "mix" && (
        <ChartCard
          title="Primary mix share change, 2024 → 2025"
          subtitle="Percentage-point deltas in world TES shares (EI framing)"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mixDeltas}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`}
                  domain={["dataMin - 0.1", "dataMax + 0.1"]}
                />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={72}
                  tick={{ fontSize: 12 }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Tooltip
                  formatter={(v) => [fmtPp(Number(v)), "Share Δ"]}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.label ?? "")
                  }
                />
                <Bar dataKey="deltaPp" radius={[0, 4, 4, 0]}>
                  {mixDeltas.map((r) => (
                    <Cell
                      key={r.id}
                      fill={r.deltaPp >= 0 ? r.color : "#94a3b8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Fossils ease {fmtPp(HEADLINE.fossilShareDeltaPp)} to{" "}
            {fmtPct(HEADLINE.fossilShare2025Pct)} — a record-low share that still
            leaves oil, gas, and coal dominant in absolute EJ.
          </p>
        </ChartCard>
      )}

      {panel === "power" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Solar overtakes wind"
            subtitle="Share of world electricity generation"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={POWER_SHARE_VINTAGE.map((r) => ({
                    short: r.short,
                    color: r.color,
                    "2024e": r.share2024Pct,
                    "2025": r.share2025Pct,
                  }))}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="short" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 12]}
                  />
                  <Tooltip
                    formatter={(v) => [fmtPct(Number(v)), "Share"]}
                  />
                  <Bar dataKey="2024e" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="2025" fill="#eab308" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Prior → new bridges"
            subtitle="Selected research → update meters"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={dumbbell}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={80}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      Number(v).toFixed(1),
                      String(name),
                    ]}
                  />
                  <Bar dataKey="prior" fill="#cbd5e1" barSize={10} />
                  <Bar dataKey="neu" fill="#0ea5e9" barSize={10} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-1 text-xs text-slate-500">
              {powerDeltas.map((r) => (
                <li key={r.id}>
                  <span className="font-semibold text-slate-700">{r.short}</span>
                  : {r.prior == null ? "—" : fmtPct(r.prior)} →{" "}
                  {fmtPct(r.neu)}
                  {r.deltaPp != null ? ` (${fmtPp(r.deltaPp)})` : ""}
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      {panel === "trade" && (
        <ChartCard
          title="Import dependence and export growth"
          subtitle="EI 2026 trade-year highlights — filter by meter"
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tradeRows}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={72}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v) => [`${Number(v).toFixed(0)}%`, "Value"]}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.label ?? "")
                  }
                />
                <Bar dataKey="valuePct" radius={[0, 4, 4, 0]}>
                  {tradeRows.map((r) => (
                    <Cell key={r.id} fill={r.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Research post stock: EU energy import dependence ~
            {HEADLINE.priorResearchEuImportPct}%, Japan ~
            {HEADLINE.priorResearchJapanImportPct}%. This panel adds fuel-specific
            2025 trade shares and US LNG flow growth.
          </p>
        </ChartCard>
      )}

      {panel === "path" && (
        <ChartCard
          title="TES and fossil share path"
          subtitle="World total energy supply (EJ) with fossil share overlay"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={pathData}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="ej"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}`}
                  domain={[520, 620]}
                />
                <YAxis
                  yAxisId="share"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[80, 90]}
                />
                <Tooltip
                  formatter={(v, name) => [
                    name === "fossilSharePct" || name === "renewSharePct"
                      ? fmtPct(Number(v))
                      : `${Number(v)} EJ`,
                    String(name),
                  ]}
                />
                <Bar
                  yAxisId="ej"
                  dataKey="tesEj"
                  fill="#94a3b8"
                  radius={[4, 4, 0, 0]}
                  name="TES (EJ)"
                />
                <Line
                  yAxisId="share"
                  type="monotone"
                  dataKey="fossilSharePct"
                  stroke="#92400e"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  name="Fossil share"
                />
                <Line
                  yAxisId="share"
                  type="monotone"
                  dataKey="renewSharePct"
                  stroke="#22c55e"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3 }}
                  name="Renew share"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            2024–2025 anchors are EI-disclosed; earlier years are estimated path
            points for context only.
          </p>
        </ChartCard>
      )}

      {panel === "companions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="CO₂, oil, and batteries"
            subtitle="YoY growth vs scale (index = latest print)"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="growth"
                    name="YoY %"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "YoY growth %",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="index"
                    name="Level"
                    tick={{ fontSize: 11 }}
                    scale="log"
                    domain={["auto", "auto"]}
                  />
                  <ZAxis range={[120, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      name === "growth"
                        ? fmtPct(Number(v))
                        : fmtNum(Number(v)),
                      String(name),
                    ]}
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.label ?? "")
                    }
                  />
                  <Scatter data={companionScatter}>
                    {companionScatter.map((r) => (
                      <Cell key={r.short} fill={r.color} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Companion scoreboard"
            subtitle="Disclosed EI 2026 companion meters"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[280px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3">Meter</th>
                    <th className="py-2 pr-3 text-right">Latest</th>
                    <th className="py-2 text-right">YoY</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPANION_METERS.map((m) => (
                    <tr key={m.id} className="border-b border-slate-100">
                      <td className="py-2.5 pr-3 font-medium text-slate-800">
                        {m.label}
                      </td>
                      <td className="py-2.5 pr-3 text-right tabular-nums text-slate-700">
                        {fmtNum(m.value, m.unit === "mb/d" ? 1 : 0)} {m.unit}
                      </td>
                      <td className="py-2.5 text-right tabular-nums text-slate-700">
                        {m.growthPct == null
                          ? "—"
                          : `+${m.growthPct.toFixed(1)}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Batteries hit {HEADLINE.batteryGw2025} GW (+{HEADLINE.batteryGrowthPct}
              %); China alone ~{HEADLINE.chinaBatteryGw} GW.
            </p>
          </ChartCard>
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
        <p>{SOURCE_NOTE}</p>
        <p className="mt-2">
          Sources:{" "}
          {SOURCES.map((s, i) => (
            <span key={s.url}>
              {i > 0 && " · "}
              <a
                href={s.url}
                className="font-medium text-sky-700 underline-offset-2 hover:underline"
              >
                {s.label}
              </a>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
