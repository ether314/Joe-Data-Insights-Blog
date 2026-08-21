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
  CAPEX_PATH,
  COMPANIONS,
  DEMAND_ATTRIB,
  DUAL_LEDGER,
  HEADLINE,
  POWER_MIX,
  SOURCE_NOTE,
  SOURCES,
  fmtBn,
  fmtPct,
  fmtPp,
  fmtTn,
  fmtTwh,
  rankedCapex,
  tradeByMeter,
  type CapexRow,
  type TradeRow,
} from "@/data/energy-systems-update-2026q3-data";

// viz-types: power-mix overtake bars, demand-attrib diverging, dual-ledger dumbbell, capex stack, trade exposure, capex path + companion scatter | layout: default
// viz-plan: panel + capex-bucket / trade-meter controls; electricity+capital vintage first; no KPI+bar clone

type Panel = "power" | "demand" | "ledger" | "capex" | "trade" | "path";
type CapexBucket = CapexRow["bucket"] | "all";
type TradeMeter = TradeRow["meter"] | "all";

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
  { id: "power", label: "RE vs coal" },
  { id: "demand", label: "Demand growth" },
  { id: "ledger", label: "Dual ledger" },
  { id: "capex", label: "Capex stack" },
  { id: "trade", label: "Trade & LNG" },
  { id: "path", label: "Capex path" },
];

const CAPEX_OPTS: { id: CapexBucket; label: string }[] = [
  { id: "all", label: "All lines" },
  { id: "clean", label: "Clean" },
  { id: "fossil", label: "Fossil supply" },
  { id: "fuel", label: "Oil & gas" },
  { id: "power", label: "Power gen" },
];

const TRADE_OPTS: { id: TradeMeter; label: string }[] = [
  { id: "all", label: "All meters" },
  { id: "oil-import", label: "Oil import %" },
  { id: "lng", label: "LNG pipeline" },
  { id: "manufacturing", label: "Clean mfg" },
  { id: "security", label: "Locked-in" },
];

export function EnergySystemsUpdate2026q3Dashboard() {
  const [panel, setPanel] = useState<Panel>("power");
  const [capexBucket, setCapexBucket] = useState<CapexBucket>("all");
  const [tradeMeter, setTradeMeter] = useState<TradeMeter>("all");

  const powerRows = useMemo(
    () =>
      POWER_MIX.map((r) => ({
        ...r,
        highlight: r.id === "renewables" || r.id === "coal",
      })),
    [],
  );

  const demandRows = useMemo(
    () =>
      DEMAND_ATTRIB.map((r) => ({
        ...r,
        isNeg: r.twh < 0,
      })),
    [],
  );

  const ledgerDumbbell = useMemo(
    () =>
      DUAL_LEDGER.filter(
        (r) => r.primarySharePct != null || r.elecSharePct != null,
      ).map((r) => ({
        short: r.short,
        label: r.label,
        color: r.color,
        primary: r.primarySharePct,
        elec: r.elecSharePct,
        note: r.note,
      })),
    [],
  );

  const capexRows = useMemo(() => rankedCapex(capexBucket), [capexBucket]);
  const tradeRows = useMemo(() => tradeByMeter(tradeMeter), [tradeMeter]);

  const pathData = useMemo(
    () =>
      CAPEX_PATH.map((r) => ({
        year: r.year,
        totalTn: r.totalTn,
        cleanTn: r.cleanTn,
        fossilTn: r.fossilTn,
        ratio: Math.round((r.cleanTn / r.fossilTn) * 100) / 100,
      })),
    [],
  );

  const companionScatter = useMemo(
    () =>
      COMPANIONS.map((c) => ({
        short: c.short,
        label: c.label,
        color: c.color,
        x: c.x,
        y: c.y,
        z: c.z,
        xLabel: c.xLabel,
        yLabel: c.yLabel,
        note: c.note,
      })),
    [],
  );

  return (
    <div className="space-y-6" data-viz="energy-systems-update-2026q3">
      <div className="rounded-xl border border-teal-200 bg-teal-50 px-5 py-4">
        <p className="text-sm font-semibold text-teal-950">
          Renewables overtake coal in electricity ({fmtPct(HEADLINE.renewPowerSharePct)}{" "}
          vs {fmtPct(HEADLINE.coalPowerSharePct)}) while clean investment prints{" "}
          {fmtTn(HEADLINE.cleanInv2026Tn)} — almost 2× fossils at{" "}
          {fmtTn(HEADLINE.fossilInv2026Tn)} — inside a {fmtTn(HEADLINE.totalInv2026Tn)}{" "}
          energy-capex year (+{HEADLINE.totalInvGrowthPct}%).
        </p>
        <p className="mt-1 text-xs text-teal-800">
          Ember Global Electricity Review 2026 + IEA World Energy Investment 2026 vs
          prior EI Statistical Review print · solar met {HEADLINE.solarDemandGrowthSharePct}
          % of demand growth · LNG investment doubles in 2026e
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={panel}
          options={PANEL_OPTS}
          onChange={setPanel}
        />
        {panel === "capex" && (
          <ToggleGroup
            label="Capex bucket"
            value={capexBucket}
            options={CAPEX_OPTS}
            onChange={setCapexBucket}
          />
        )}
        {panel === "trade" && (
          <ToggleGroup
            label="Trade meter"
            value={tradeMeter}
            options={TRADE_OPTS}
            onChange={setTradeMeter}
          />
        )}
      </div>

      {panel === "power" && (
        <ChartCard
          title="Renewables overtake coal in the power mix"
          subtitle="Ember 2025 generation shares — first modern year all-RE > coal"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={powerRows}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  domain={[0, 40]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={72}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(v) => [fmtPct(Number(v)), "Share"]}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.label ?? "")
                  }
                />
                <ReferenceLine
                  x={HEADLINE.coalPowerSharePct}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  label={{ value: "coal", position: "top", fontSize: 10 }}
                />
                <Bar dataKey="sharePct" radius={[0, 4, 4, 0]}>
                  {powerRows.map((r) => (
                    <Cell
                      key={r.id}
                      fill={r.color}
                      opacity={r.highlight ? 1 : 0.75}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            All renewables {fmtTwh(HEADLINE.renewPowerTwh)} vs coal{" "}
            {fmtTwh(HEADLINE.coalPowerTwh)} — lead {fmtPp(HEADLINE.renewOvertakeCoalPp)}.
            Solar share ({fmtPct(HEADLINE.priorSolarPowerSharePct)}) matches the prior EI
            power print; the new story is the all-RE vs coal crossover.
          </p>
        </ChartCard>
      )}

      {panel === "demand" && (
        <ChartCard
          title="Who met 2025 electricity demand growth"
          subtitle="TWh contribution — clean sources outpaced demand; fossils fell"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={demandRows}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={72}
                  tick={{ fontSize: 12 }}
                />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Tooltip
                  formatter={(v) => [fmtTwh(Number(v)), "Δ generation"]}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.label ?? "")
                  }
                />
                <Bar dataKey="twh" radius={[0, 4, 4, 0]}>
                  {demandRows.map((r) => (
                    <Cell key={r.id} fill={r.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Demand +{HEADLINE.demandGrowthTwh} TWh (+{fmtPct(HEADLINE.demandGrowthPct)}).
            Low-carbon +{HEADLINE.lowCarbonGrowthTwh} TWh. Fossil generation{" "}
            {fmtTwh(HEADLINE.fossilGenDeltaTwh)} ({fmtPct(HEADLINE.fossilGenDeltaPct)}) —
            first fall since 2020.
          </p>
        </ChartCard>
      )}

      {panel === "ledger" && (
        <ChartCard
          title="Primary vs electricity — do not average the ledgers"
          subtitle="EI primary TES shares (left dots) vs Ember electricity shares (right)"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 24, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="primary"
                  name="Primary %"
                  domain={[0, 90]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  label={{
                    value: "EI primary share %",
                    position: "insideBottom",
                    offset: -4,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="elec"
                  name="Elec %"
                  domain={[0, 40]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  label={{
                    value: "Ember elec %",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  formatter={(v, name) => [
                    v == null ? "n/a" : fmtPct(Number(v)),
                    String(name),
                  ]}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.label ?? "")
                  }
                />
                <Scatter data={ledgerDumbbell} fill="#64748b">
                  {ledgerDumbbell.map((r) => (
                    <Cell key={r.short} fill={r.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {ledgerDumbbell.map((r) => (
              <div
                key={r.short}
                className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-xs"
              >
                <span className="font-semibold text-slate-800">{r.short}</span>
                <span className="tabular-nums text-slate-600">
                  {r.primary != null ? `P ${fmtPct(r.primary)}` : "P —"} ·{" "}
                  {r.elec != null ? `E ${fmtPct(r.elec)}` : "E —"}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Fossils still {fmtPct(HEADLINE.priorFossilPrimaryPct)} of primary TES in the
            prior EI print even as all-renewables cross coal in electricity. Different
            denominators — treat as companion meters, not a single mix.
          </p>
        </ChartCard>
      )}

      {panel === "capex" && (
        <ChartCard
          title="Where 2026e energy capital actually goes"
          subtitle="IEA World Energy Investment 2026 — USD billions by line"
        >
          <div className="h-[400px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={capexRows}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => (v >= 1000 ? `$${v / 1000}T` : `$${v}B`)}
                />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={78}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v) => [fmtBn(Number(v)), "2026e"]}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.label ?? "")
                  }
                />
                <Bar dataKey="usdBn" radius={[0, 4, 4, 0]}>
                  {capexRows.map((r) => (
                    <Cell key={r.id} fill={r.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Clean {fmtTn(HEADLINE.cleanInv2026Tn)} ≈ {HEADLINE.cleanToFossilRatio}× fossil
            supply {fmtTn(HEADLINE.fossilInv2026Tn)}. Oil supply below {fmtBn(HEADLINE.oilInv2026Bn)}{" "}
            (third decline); gas supply {fmtBn(HEADLINE.gasInv2026Bn)} (decade high). Solar
            alone {fmtBn(HEADLINE.solarInvBn)} (~$1B/day).
          </p>
        </ChartCard>
      )}

      {panel === "trade" && (
        <ChartCard
          title="Trade exposure and the LNG / manufacturing overlay"
          subtitle="EI import shares carried + IEA FID / locked-in / China manufacturing meters"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tradeRows}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={78}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v, _n, item) => {
                    const unit = String(
                      (item?.payload as TradeRow | undefined)?.unit ?? "",
                    );
                    return [`${Number(v)} ${unit}`, "Value"];
                  }}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.label ?? "")
                  }
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {tradeRows.map((r) => (
                    <Cell key={r.id} fill={r.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Record LNG FIDs (~{HEADLINE.lngFid2025Bcm} bcm in 2025, ~{HEADLINE.lngUsShareOfFidPct}%
            US) collide with oil-import dependence still at India 86% / Europe 75% / China 73%.
            China still hosts ~{HEADLINE.chinaCleanMfgSharePct}% of clean-energy manufacturing
            investment.
          </p>
        </ChartCard>
      )}

      {panel === "path" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Energy investment path"
            subtitle="Total / clean / fossil supply — USD trillions (IEA path + 2026e)"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={pathData}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}T`}
                    domain={[0, 4]}
                  />
                  <Tooltip
                    formatter={(v, name) => [fmtTn(Number(v)), String(name)]}
                  />
                  <Bar dataKey="fossilTn" name="Fossil" fill="#64748b" stackId="a" />
                  <Bar dataKey="cleanTn" name="Clean" fill="#14b8a6" stackId="a" />
                  <Line
                    type="monotone"
                    dataKey="totalTn"
                    name="Total"
                    stroke="#0f172a"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Companion meters"
            subtitle="Batteries, CO₂, gas orders, nuclear UC — bubble size = secondary scale"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 16, left: 0, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" dataKey="x" tick={{ fontSize: 10 }} name="x" />
                  <YAxis type="number" dataKey="y" tick={{ fontSize: 10 }} name="y" />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip
                    formatter={(v, name) => [Number(v), String(name)]}
                    labelFormatter={(_, payload) =>
                      String(payload?.[0]?.payload?.label ?? "")
                    }
                  />
                  <Scatter data={companionScatter}>
                    {companionScatter.map((c) => (
                      <Cell key={c.short} fill={c.color} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-1 text-xs text-slate-500">
              {companionScatter.map((c) => (
                <li key={c.short}>
                  <span className="font-semibold text-slate-700">{c.short}</span>:{" "}
                  {c.xLabel}={c.x} · {c.yLabel}={c.y}
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs text-slate-600">
        <p className="font-semibold text-slate-800">Sources & caveats</p>
        <p className="mt-1">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                className="text-teal-700 underline-offset-2 hover:underline"
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
