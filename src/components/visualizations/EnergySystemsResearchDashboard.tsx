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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  COUNTRIES,
  FUEL_TRADES,
  HEADLINE,
  MIX_COLORS,
  MIX_LABELS,
  MIX_ORDER,
  SOURCE_NOTE,
  filterCountries,
  fmtImportDep,
  fmtPct,
  fossilPrimaryShare,
  importScatter,
  primaryVsElecSlopes,
  rankedByImport,
  stackedMixRows,
  type Region,
  type TradeStance,
} from "@/data/energy-systems-research-2026-data";

// viz-types: stacked primary mix, primary↔electricity slope, import×fossil scatter, fuel-trade bars, import scoreboard | layout: default

type Panel = "mix" | "slope" | "scatter" | "trade" | "imports";

const REGION_OPTS: { id: Region | "all"; label: string }[] = [
  { id: "all", label: "All regions" },
  { id: "Asia-Pacific", label: "Asia-Pacific" },
  { id: "Europe", label: "Europe" },
  { id: "North America", label: "N. America" },
  { id: "Middle East", label: "Middle East" },
  { id: "Latin America", label: "LatAm" },
  { id: "Eurasia", label: "Eurasia" },
];

const STANCE_OPTS: { id: TradeStance | "all"; label: string }[] = [
  { id: "all", label: "All stances" },
  { id: "net-importer", label: "Net importers" },
  { id: "net-exporter", label: "Net exporters" },
  { id: "balanced", label: "Balanced" },
];

const PANEL_OPTS: { id: Panel; label: string }[] = [
  { id: "mix", label: "Primary mix" },
  { id: "slope", label: "Primary ↔ power" },
  { id: "scatter", label: "Import map" },
  { id: "trade", label: "Fuel trade" },
  { id: "imports", label: "Dependence rank" },
];

const SCATTER_COLORS = [
  "#0ea5e9",
  "#ea580c",
  "#14b8a6",
  "#a78bfa",
  "#f43f5e",
  "#84cc16",
  "#e879f9",
  "#64748b",
];

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

function MixPanel({ rows }: { rows: ReturnType<typeof stackedMixRows> }) {
  return (
    <div className="h-[440px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
          stackOffset="expand"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickFormatter={(v) => `${Math.round(Number(v) * 100)}%`}
            domain={[0, 1]}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={72}
            tick={{ fontSize: 11, fill: "#334155" }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const sorted = sortTooltipPayload(payload);
              const row = sorted[0]?.payload as {
                label: string;
                fossil: number;
              };
              return (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                  <p className="font-semibold text-slate-900">{row.label}</p>
                  {sorted.map((p) => (
                    <p key={String(p.dataKey)} className="text-slate-600">
                      <span
                        className="mr-1 inline-block h-2 w-2 rounded-sm"
                        style={{ background: String(p.color) }}
                      />
                      {MIX_LABELS[p.dataKey as keyof typeof MIX_LABELS] ??
                        p.dataKey}
                      :{" "}
                      <span className="font-mono font-semibold">
                        {fmtPct(Number(p.value), 1)}
                      </span>
                    </p>
                  ))}
                  <p className="mt-1 text-slate-500">
                    Fossil primary: {fmtPct(row.fossil, 1)}
                  </p>
                </div>
              );
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
            formatter={(v) => MIX_LABELS[v as keyof typeof MIX_LABELS] ?? v}
          />
          {MIX_ORDER.map((k) => (
            <Bar
              key={k}
              dataKey={k}
              stackId="mix"
              fill={MIX_COLORS[k]}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function SlopePanel({
  rows,
}: {
  rows: ReturnType<typeof primaryVsElecSlopes>;
}) {
  const data = useMemo(
    () =>
      [...rows].sort((a, b) => b.primaryFossil - a.primaryFossil),
    [rows],
  );

  return (
    <div className="h-[440px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 12, right: 16, left: 8, bottom: 48 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "#64748b" }}
            interval={0}
            angle={-35}
            textAnchor="end"
            height={56}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            label={{
              value: "Fossil share (%)",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#64748b", fontSize: 11 },
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0]?.payload as (typeof data)[0];
              return (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                  <p className="font-semibold text-slate-900">{row.label}</p>
                  <p className="text-slate-600">
                    Primary fossil:{" "}
                    <span className="font-mono font-semibold">
                      {fmtPct(row.primaryFossil, 1)}
                    </span>
                  </p>
                  <p className="text-slate-600">
                    Electricity fossil:{" "}
                    <span className="font-mono font-semibold">
                      {fmtPct(row.elecFossil, 0)}
                    </span>
                  </p>
                  <p className="text-slate-500">
                    Δ (power − primary): {row.delta > 0 ? "+" : ""}
                    {row.delta.toFixed(1)} pp
                  </p>
                </div>
              );
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar
            dataKey="primaryFossil"
            name="Primary fossil"
            fill="#92400e"
            radius={[3, 3, 0, 0]}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="elecFossil"
            name="Electricity fossil"
            stroke="#0ea5e9"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#0ea5e9" }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function ScatterPanel({
  rows,
  highlight,
  onSelect,
}: {
  rows: ReturnType<typeof importScatter>;
  highlight: string | null;
  onSelect: (id: string) => void;
}) {
  const data = useMemo(
    () =>
      rows.map((r, i) => ({
        ...r,
        x: r.importDep,
        y: r.fossilPrimary,
        z: Math.max(40, r.primaryEj * 2.2),
        color: SCATTER_COLORS[i % SCATTER_COLORS.length],
      })),
    [rows],
  );

  return (
    <div className="h-[440px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 36 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            dataKey="x"
            tick={{ fontSize: 11, fill: "#64748b" }}
            label={{
              value: "Net energy import dependence (%)",
              position: "insideBottom",
              offset: -18,
              style: { fill: "#64748b", fontSize: 11 },
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[40, 100]}
            tick={{ fontSize: 11, fill: "#64748b" }}
            label={{
              value: "Fossil share of primary (%)",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#64748b", fontSize: 11 },
            }}
          />
          <ZAxis type="number" dataKey="z" range={[60, 280]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0]?.payload as (typeof data)[0];
              return (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                  <p className="font-semibold text-slate-900">{row.label}</p>
                  <p className="text-slate-600">
                    Import dependence:{" "}
                    <span className="font-mono font-semibold">
                      {fmtImportDep(row.importDep)}
                    </span>
                  </p>
                  <p className="text-slate-600">
                    Fossil primary: {fmtPct(row.fossilPrimary, 1)}
                  </p>
                  <p className="text-slate-500">
                    {row.region} · {row.stance}
                  </p>
                </div>
              );
            }}
          />
          <Scatter
            data={data}
            isAnimationActive={false}
            cursor="pointer"
            onClick={(d) => {
              const id = (d as { id?: string })?.id;
              if (id) onSelect(id);
            }}
          >
            {data.map((d) => (
              <Cell
                key={d.id}
                fill={d.color}
                opacity={!highlight || highlight === d.id ? 0.9 : 0.25}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

function TradePanel() {
  const data = FUEL_TRADES.map((t, i) => ({
    ...t,
    color: SCATTER_COLORS[i % SCATTER_COLORS.length],
  }));

  return (
    <div className="h-[440px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 12, right: 24, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#64748b" }}
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0]?.payload as (typeof data)[0];
              return (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                  <p className="font-semibold text-slate-900">{row.label}</p>
                  <p className="text-slate-600">
                    Top-1 ({row.top1Label}):{" "}
                    <span className="font-mono font-semibold">
                      {fmtPct(row.top1SharePct, 0)}
                    </span>
                  </p>
                  <p className="text-slate-600">
                    Top-3 ({row.top3Labels}):{" "}
                    <span className="font-mono font-semibold">
                      {fmtPct(row.top3SharePct, 0)}
                    </span>
                  </p>
                  <p className="text-slate-500">{row.unit}</p>
                </div>
              );
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar
            dataKey="top1SharePct"
            name="Top-1 exporter share"
            fill="#ea580c"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="top3SharePct"
            name="Top-3 exporter share"
            fill="#0ea5e9"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ImportsPanel({
  rows,
  highlight,
  onSelect,
}: {
  rows: ReturnType<typeof rankedByImport>;
  highlight: string | null;
  onSelect: (id: string) => void;
}) {
  const data = useMemo(
    () =>
      rankedByImport(rows).map((c, i) => ({
        ...c,
        color: SCATTER_COLORS[i % SCATTER_COLORS.length],
      })),
    [rows],
  );

  return (
    <div className="h-[440px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="shortLabel"
            width={72}
            tick={{ fontSize: 11, fill: "#334155" }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0]?.payload as (typeof data)[0];
              return (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                  <p className="font-semibold text-slate-900">{row.label}</p>
                  <p className="text-slate-600">
                    Import dependence:{" "}
                    <span className="font-mono font-semibold">
                      {fmtImportDep(row.importDependencePct)}
                    </span>
                  </p>
                  <p className="text-slate-500">
                    Fossil primary {fmtPct(fossilPrimaryShare(row), 1)} ·{" "}
                    {row.tradeStance}
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="importDependencePct" radius={[0, 4, 4, 0]} cursor="pointer">
            {data.map((d) => (
              <Cell
                key={d.id}
                fill={d.importDependencePct < 0 ? "#14b8a6" : d.color}
                opacity={!highlight || highlight === d.id ? 1 : 0.28}
                onClick={() => onSelect(d.id)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EnergySystemsResearchDashboard() {
  const [panel, setPanel] = useState<Panel>("mix");
  const [region, setRegion] = useState<Region | "all">("all");
  const [stance, setStance] = useState<TradeStance | "all">("all");
  const [highlight, setHighlight] = useState<string | null>(null);

  const filtered = useMemo(
    () => filterCountries({ region, stance, excludeWorld: true }),
    [region, stance],
  );

  const mixRows = useMemo(() => stackedMixRows(filtered), [filtered]);
  const slopeRows = useMemo(() => primaryVsElecSlopes(filtered), [filtered]);
  const scatterRows = useMemo(() => importScatter(filtered), [filtered]);

  const selected = highlight
    ? COUNTRIES.find((c) => c.id === highlight)
    : null;

  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="rounded-xl border border-amber-200/80 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-200/90">
          Energy systems — source, mix, and trade
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          How countries source, mix, and trade energy
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          EU-27 imports ~{HEADLINE.euImportDependencePct}% of its energy; Japan
          ~{HEADLINE.japanImportDependencePct}%. The US is a net exporter. LNG
          top-3 exporters hold ~{HEADLINE.lngTop3SharePct}% of traded volumes.
          Primary mix ≠ electricity mix — France and Brazil prove the gap.
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <dt className="text-[10px] uppercase tracking-wide text-slate-400">
              EU import dependence
            </dt>
            <dd className="text-lg font-bold text-amber-300">
              {HEADLINE.euImportDependencePct}%
            </dd>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <dt className="text-[10px] uppercase tracking-wide text-slate-400">
              Japan import dependence
            </dt>
            <dd className="text-lg font-bold text-white">
              {HEADLINE.japanImportDependencePct}%
            </dd>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <dt className="text-[10px] uppercase tracking-wide text-slate-400">
              LNG top-3 share
            </dt>
            <dd className="text-lg font-bold text-sky-300">
              {HEADLINE.lngTop3SharePct}%
            </dd>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2">
            <dt className="text-[10px] uppercase tracking-wide text-slate-400">
              Systems tracked
            </dt>
            <dd className="text-lg font-bold text-white">
              {HEADLINE.countriesTracked}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
        <ToggleGroup label="Panel" value={panel} options={PANEL_OPTS} onChange={setPanel} />
        <ToggleGroup
          label="Region"
          value={region}
          options={REGION_OPTS}
          onChange={setRegion}
        />
        <ToggleGroup
          label="Trade stance"
          value={stance}
          options={STANCE_OPTS}
          onChange={setStance}
        />
      </div>

      {selected && (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">{selected.label}</span>
          {" · "}
          fossil primary {fmtPct(fossilPrimaryShare(selected), 1)}
          {" · "}
          electricity fossil {fmtPct(selected.elecFossilSharePct, 0)}
          {" · "}
          import dependence {fmtImportDep(selected.importDependencePct)}
          <button
            type="button"
            className="ml-3 text-xs font-semibold text-sky-700 hover:underline"
            onClick={() => setHighlight(null)}
          >
            Clear
          </button>
        </div>
      )}

      {panel === "mix" && (
        <ChartCard
          title="Primary energy mix by source"
          subtitle="Share of total primary energy supply (oil, gas, coal, nuclear, hydro, other renewables). Filter by region or trade stance."
        >
          <MixPanel rows={mixRows} />
        </ChartCard>
      )}

      {panel === "slope" && (
        <ChartCard
          title="Primary fossil share vs electricity fossil share"
          subtitle="Bars = fossil share of primary energy; line = fossil share of electricity generation. France and Brazil show the largest ‘power is cleaner than primary’ gaps."
        >
          <SlopePanel rows={slopeRows} />
        </ChartCard>
      )}

      {panel === "scatter" && (
        <ChartCard
          title="Import dependence × fossil intensity"
          subtitle="X = net energy import dependence (negative = net exporter). Y = fossil share of primary. Bubble size ≈ primary energy scale (EJ)."
        >
          <ScatterPanel
            rows={scatterRows}
            highlight={highlight}
            onSelect={setHighlight}
          />
        </ChartCard>
      )}

      {panel === "trade" && (
        <ChartCard
          title="Who sells the fuels that cross borders"
          subtitle="Top-1 and top-3 exporter shares for LNG, crude oil, hard coal, and pipeline gas — the trade layer behind domestic mixes."
        >
          <TradePanel />
        </ChartCard>
      )}

      {panel === "imports" && (
        <ChartCard
          title="Net energy import dependence rank"
          subtitle="Positive = share of energy imported; negative (teal) = net export surplus relative to domestic supply."
        >
          <ImportsPanel
            rows={filtered}
            highlight={highlight}
            onSelect={setHighlight}
          />
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}

export default EnergySystemsResearchDashboard;
