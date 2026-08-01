"use client";

import { useMemo, useState } from "react";
import {
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
  Bar,
  BarChart,
  ReferenceLine,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  COUNTRIES,
  HEADLINE,
  SOURCE_NOTE,
  US_REFINED_IMPORT_SOURCES,
  US_SALIENT,
  fmtKt,
  fmtPct,
  gapPp2024,
  mineShare2024,
  rankedGaps2024,
  rankedMiners2024,
  rankedRefiners2024,
  refineShare2024,
  type CopperCountry,
} from "@/data/copper-mine-vs-refinery-geography-2026-data";

// viz-types: mine↔refine dumbbell, gap diverging bars, mine×refine scatter, US import donut | layout: default

type Tab = "split" | "gap" | "scatter" | "us";
type RankMode = "mine" | "refine";
type GapSort = "abs" | "refineHeavy" | "mineHeavy";

const COLORS = [
  "#ea580c",
  "#0ea5e9",
  "#14b8a6",
  "#a78bfa",
  "#f43f5e",
  "#64748b",
  "#84cc16",
  "#e879f9",
  "#38bdf8",
  "#fb923c",
  "#fbbf24",
  "#22d3ee",
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

/** Horizontal dumbbell: mine share (copper) vs refine share (teal) */
function DumbbellPanel({
  rows,
  mode,
  highlight,
  onSelect,
}: {
  rows: CopperCountry[];
  mode: RankMode;
  highlight: string | null;
  onSelect: (c: string) => void;
}) {
  const data = useMemo(() => {
    const ranked =
      mode === "mine" ? rankedMiners2024() : rankedRefiners2024();
    return ranked.slice(0, 12).map((c, i) => ({
      ...c,
      minePct: mineShare2024(c),
      refinePct: refineShare2024(c),
      color: COLORS[i % COLORS.length],
    }));
  }, [mode, rows]);

  const maxPct = Math.max(
    ...data.flatMap((d) => [d.minePct, d.refinePct]),
    1,
  );

  return (
    <div className="space-y-2.5 min-h-[320px]">
      <div className="mb-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-orange-600" />
          Mine share
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-teal-600" />
          Refine share
        </span>
      </div>
      {data.map((d) => {
        const active = !highlight || highlight === d.country;
        const xM = 4 + (d.minePct / maxPct) * 88;
        const xR = 4 + (d.refinePct / maxPct) * 88;
        return (
          <button
            key={d.country}
            type="button"
            onClick={() => onSelect(d.country)}
            className={`grid w-full grid-cols-[6.5rem_1fr_7rem] items-center gap-2 rounded-lg px-2 py-1 text-left transition ${
              active ? "bg-slate-50" : "opacity-35"
            }`}
          >
            <span className="truncate text-sm font-semibold text-slate-800">
              {d.shortLabel}
            </span>
            <svg viewBox="0 0 100 22" className="h-7 w-full min-h-[28px]">
              <title>{`${d.country}: mine ${fmtPct(d.minePct)} · refine ${fmtPct(d.refinePct)}`}</title>
              <line
                x1={xM}
                y1={11}
                x2={xR}
                y2={11}
                stroke="#94a3b8"
                strokeWidth={2}
              />
              <circle cx={xM} cy={11} r={4.5} fill="#ea580c" />
              <circle cx={xR} cy={11} r={4.5} fill="#0d9488" />
            </svg>
            <span className="text-right font-mono text-[11px] text-slate-600">
              {fmtPct(d.minePct, 0)}→{fmtPct(d.refinePct, 0)}
            </span>
          </button>
        );
      })}
      <p className="mt-2 text-xs text-slate-500">
        Click a country to highlight. Orange = mine share of world; teal = refine
        share. China’s teal dot sits far right of its orange.
      </p>
    </div>
  );
}

function GapPanel({
  sort,
  highlight,
  onSelect,
}: {
  sort: GapSort;
  highlight: string | null;
  onSelect: (c: string) => void;
}) {
  const data = useMemo(() => {
    let rows = rankedGaps2024().map((c) => ({
      label: c.shortLabel,
      country: c.country,
      gap: gapPp2024(c),
      minePct: mineShare2024(c),
      refinePct: refineShare2024(c),
    }));
    if (sort === "refineHeavy") rows = rows.sort((a, b) => b.gap - a.gap);
    else if (sort === "mineHeavy") rows = rows.sort((a, b) => a.gap - b.gap);
    else rows = rows.sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));
    return rows.slice(0, 14);
  }, [sort]);

  return (
    <div className="h-[420px] w-full min-h-[280px]">
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
            tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}pp`}
            domain={["dataMin - 2", "dataMax + 2"]}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={72}
            tick={{ fontSize: 12, fill: "#334155", fontWeight: 600 }}
          />
          <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1.5} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const sorted = sortTooltipPayload(payload);
              const row = sorted[0]?.payload as (typeof data)[0];
              return (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                  <p className="font-bold text-slate-900">{row.country}</p>
                  <p className="text-slate-600">
                    Gap: {row.gap > 0 ? "+" : ""}
                    {fmtPct(row.gap)} refine − mine
                  </p>
                  <p className="text-xs text-slate-500">
                    Mine {fmtPct(row.minePct)} · Refine {fmtPct(row.refinePct)}
                  </p>
                </div>
              );
            }}
          />
          <Bar
            dataKey="gap"
            name="Refine − mine (pp)"
            radius={[0, 4, 4, 0]}
            cursor="pointer"
            onClick={(d) => {
              const p = d as unknown as { country?: string };
              if (p?.country) onSelect(p.country);
            }}
          >
            {data.map((d) => (
              <Cell
                key={d.country}
                fill={d.gap >= 0 ? "#0d9488" : "#ea580c"}
                opacity={
                  highlight && highlight !== d.country ? 0.3 : 0.9
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-1 text-xs text-slate-500">
        Positive (teal) = refine share exceeds mine share. China leads; Chile and
        Peru lead the mine-heavy (orange) side.
      </p>
    </div>
  );
}

function ScatterPanel({
  highlight,
  onSelect,
}: {
  highlight: string | null;
  onSelect: (c: string) => void;
}) {
  const points = useMemo(
    () =>
      COUNTRIES.filter((c) => c.mine2024Kt > 0 || c.refine2024Kt > 0).map(
        (c, i) => ({
          ...c,
          x: mineShare2024(c),
          y: refineShare2024(c),
          z: Math.max(c.mine2024Kt, c.refine2024Kt),
          color: COLORS[i % COLORS.length],
        }),
      ),
    [],
  );

  return (
    <div className="h-[400px] w-full min-h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 12, right: 20, bottom: 28, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            dataKey="x"
            name="Mine %"
            unit="%"
            tick={{ fontSize: 11, fill: "#64748b" }}
            label={{
              value: "Mine share of world (%)",
              position: "insideBottom",
              offset: -16,
              style: { fill: "#64748b", fontSize: 12 },
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Refine %"
            unit="%"
            tick={{ fontSize: 11, fill: "#64748b" }}
            label={{
              value: "Refine share (%)",
              angle: -90,
              position: "insideLeft",
              offset: 8,
              style: { fill: "#64748b", fontSize: 12 },
            }}
          />
          <ZAxis type="number" dataKey="z" range={[60, 400]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0]?.payload as (typeof points)[0];
              return (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
                  <p className="font-bold text-slate-900">{row.country}</p>
                  <p className="text-slate-600">
                    Mine {fmtPct(row.x)} · {fmtKt(row.mine2024Kt)}
                  </p>
                  <p className="text-slate-600">
                    Refine {fmtPct(row.y)} · {fmtKt(row.refine2024Kt)}
                  </p>
                </div>
              );
            }}
          />
          {/* Equality line y = x */}
          <ReferenceLine
            segment={[
              { x: 0, y: 0 },
              { x: 25, y: 25 },
            ]}
            stroke="#94a3b8"
            strokeDasharray="4 4"
          />
          <Scatter
            data={points}
            onClick={(d) => {
              const p = d as unknown as { country?: string };
              if (p?.country) onSelect(p.country);
            }}
          >
            {points.map((p) => (
              <Cell
                key={p.country}
                fill={p.color}
                opacity={
                  highlight && highlight !== p.country ? 0.25 : 0.9
                }
                stroke={highlight === p.country ? "#0f172a" : "#fff"}
                strokeWidth={highlight === p.country ? 2 : 1}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <p className="mt-1 text-xs text-slate-500">
        Dashed line = equal mine and refine shares. China sits high-left (refine
        giant, mid-tier miner). Chile sits mid-right (mine giant, modest refiner).
      </p>
    </div>
  );
}

function UsPanel() {
  const pieData = US_REFINED_IMPORT_SOURCES.map((s, i) => ({
    name: s.source,
    value: s.sharePct,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2 min-h-[280px]">
      <div>
        <p className="mb-3 text-sm text-slate-600">
          US mined <strong>{fmtKt(US_SALIENT.mine2024Kt)}</strong> and refined{" "}
          <strong>{fmtKt(US_SALIENT.refine2024Kt)}</strong> in 2024e. Net import
          reliance: <strong>{US_SALIENT.netImportReliancePct}%</strong> of apparent
          consumption (~{fmtKt(US_SALIENT.apparentConsumption2024Kt)}).
        </p>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>
            Mine share of world:{" "}
            <span className="font-semibold">
              {fmtPct(mineShare2024(COUNTRIES.find((c) => c.iso === "US")!))}
            </span>
          </li>
          <li>
            Refine share of world:{" "}
            <span className="font-semibold">
              {fmtPct(refineShare2024(COUNTRIES.find((c) => c.iso === "US")!))}
            </span>
          </li>
          <li>
            COMEX avg 2024e:{" "}
            <span className="font-semibold">
              ${US_SALIENT.priceComex2024Cpl / 100}/lb
            </span>
          </li>
        </ul>
      </div>
      <div className="h-64">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
          US refined copper import sources (2020–23 avg)
        </p>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={80}
              paddingAngle={2}
            >
              {pieData.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => [`${v}%`, "Share"]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 13,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CopperMineVsRefineryGeographyDashboard() {
  const [tab, setTab] = useState<Tab>("split");
  const [rankMode, setRankMode] = useState<RankMode>("mine");
  const [gapSort, setGapSort] = useState<GapSort>("abs");
  const [highlight, setHighlight] = useState<string | null>(null);

  const onSelect = (c: string) =>
    setHighlight((prev) => (prev === c ? null : c));

  return (
    <div className="not-prose mx-auto w-full max-w-5xl space-y-4">
      <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-teal-50 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-orange-800">
          Copper mine vs refinery geography
        </p>
        <p className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
          China refines {HEADLINE.chinaRefineSharePct}% of world copper — and
          mines only {HEADLINE.chinaMineSharePct}%
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Refine share is ~{HEADLINE.chinaRefineOverMineRatio}× mine share (+
          {HEADLINE.chinaRefineMinusMinePp} pp gap). Chile digs{" "}
          {HEADLINE.chileMineSharePct}% but refines {HEADLINE.chileRefineSharePct}
          %. USGS MCS 2025 · 2024e.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          label="View"
          value={tab}
          onChange={setTab}
          options={[
            { id: "split", label: "Mine ↔ refine" },
            { id: "gap", label: "Share gap" },
            { id: "scatter", label: "Scatter" },
            { id: "us", label: "US exposure" },
          ]}
        />
        {tab === "split" && (
          <ToggleGroup
            label="Rank by"
            value={rankMode}
            onChange={setRankMode}
            options={[
              { id: "mine", label: "Mine tons" },
              { id: "refine", label: "Refine tons" },
            ]}
          />
        )}
        {tab === "gap" && (
          <ToggleGroup
            label="Sort"
            value={gapSort}
            onChange={setGapSort}
            options={[
              { id: "abs", label: "|Gap|" },
              { id: "refineHeavy", label: "Refine-heavy" },
              { id: "mineHeavy", label: "Mine-heavy" },
            ]}
          />
        )}
        {highlight && (
          <button
            type="button"
            onClick={() => setHighlight(null)}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Clear highlight
          </button>
        )}
      </div>

      {tab === "split" && (
        <ChartCard
          title="Who digs vs who refines"
          subtitle="Dumbbell of world mine share (orange) vs refine share (teal), 2024e"
        >
          <DumbbellPanel
            rows={COUNTRIES}
            mode={rankMode}
            highlight={highlight}
            onSelect={onSelect}
          />
        </ChartCard>
      )}
      {tab === "gap" && (
        <ChartCard
          title="Refine share − mine share"
          subtitle="Percentage-point gap: positive = refining hub, negative = concentrate exporter"
        >
          <GapPanel sort={gapSort} highlight={highlight} onSelect={onSelect} />
        </ChartCard>
      )}
      {tab === "scatter" && (
        <ChartCard
          title="Mine share × refine share"
          subtitle="Bubble size ∝ max(mine, refine) tons. Equality line for balanced producers."
        >
          <ScatterPanel highlight={highlight} onSelect={onSelect} />
        </ChartCard>
      )}
      {tab === "us" && (
        <ChartCard
          title="United States: mine, refine, and import sources"
          subtitle="Domestic output vs refined-copper import geography (USGS)"
        >
          <UsPanel />
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
