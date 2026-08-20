"use client";

import { useMemo, useState } from "react";
import {
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
  COMMODITIES,
  HEADLINE,
  SOURCE_NOTE,
  STAGE_SPLITS,
  filterCommodities,
  fmtHhi,
  fmtPct,
  producerScoreboard,
  rankedBy,
  sectorExposures,
  type CommodityRow,
  type Sector,
  type Stage,
} from "@/data/chokepoint-commodities-research-2026-data";

// viz-types: concentration bars, reliance×concentration scatter, mine→midstream slope, sector composed bars, producer scoreboard | layout: default

type Panel = "rank" | "scatter" | "stages" | "sectors" | "producers";
type Metric = "top1" | "top3" | "hhi" | "usReliance" | "substitution";

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

function metricValue(c: CommodityRow, metric: Metric): number {
  if (metric === "top1") return c.top1SharePct;
  if (metric === "top3") return c.top3SharePct;
  if (metric === "hhi") return c.hhi;
  if (metric === "usReliance") return c.usNetImportReliancePct;
  return c.substitutionDifficulty;
}

function metricLabel(metric: Metric): string {
  if (metric === "top1") return "Top-1 country share";
  if (metric === "top3") return "Top-3 country share";
  if (metric === "hhi") return "Approx. HHI";
  if (metric === "usReliance") return "US net import reliance";
  return "Substitution difficulty (1–5)";
}

function RankPanel({
  rows,
  metric,
  highlight,
  onSelect,
}: {
  rows: CommodityRow[];
  metric: Metric;
  highlight: string | null;
  onSelect: (id: string) => void;
}) {
  const data = useMemo(
    () =>
      rankedBy(rows, metric).map((c, i) => ({
        ...c,
        value: metricValue(c, metric),
        color: COLORS[i % COLORS.length],
      })),
    [rows, metric],
  );

  const isHhi = metric === "hhi";
  const isSub = metric === "substitution";

  return (
    <div className="h-[420px] w-full min-w-0">
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
            domain={isSub ? [0, 5] : isHhi ? [0, "auto"] : [0, 100]}
            tickFormatter={(v) => (isHhi ? fmtHhi(Number(v)) : isSub ? String(v) : `${v}%`)}
          />
          <YAxis
            type="category"
            dataKey="shortLabel"
            width={92}
            tick={{ fontSize: 11, fill: "#334155" }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const sorted = sortTooltipPayload(payload);
              const row = sorted[0]?.payload as CommodityRow & { value: number };
              return (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                  <p className="font-semibold text-slate-900">{row.label}</p>
                  <p className="text-slate-600">
                    {metricLabel(metric)}:{" "}
                    <span className="font-mono font-semibold">
                      {isHhi
                        ? fmtHhi(row.value)
                        : isSub
                          ? row.value.toFixed(0)
                          : fmtPct(row.value, 1)}
                    </span>
                  </p>
                  <p className="text-slate-500">
                    Leader: {row.top1Label} · Stage: {row.stage}
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} cursor="pointer">
            {data.map((d) => (
              <Cell
                key={d.id}
                fill={d.color}
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

function ScatterPanel({
  rows,
  highlight,
  onSelect,
}: {
  rows: CommodityRow[];
  highlight: string | null;
  onSelect: (id: string) => void;
}) {
  const data = useMemo(
    () =>
      rows.map((c, i) => ({
        ...c,
        x: c.top1SharePct,
        y: c.usNetImportReliancePct,
        z: c.substitutionDifficulty * 80,
        color: COLORS[i % COLORS.length],
      })),
    [rows],
  );

  return (
    <div className="h-[420px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 28 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            dataKey="x"
            name="Top-1 share"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#64748b" }}
            label={{
              value: "Top-1 country share (%)",
              position: "insideBottom",
              offset: -14,
              style: { fill: "#64748b", fontSize: 11 },
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="US reliance"
            domain={[0, 105]}
            tick={{ fontSize: 11, fill: "#64748b" }}
            label={{
              value: "US net import reliance (%)",
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
              const row = payload[0]?.payload as CommodityRow;
              return (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                  <p className="font-semibold text-slate-900">{row.label}</p>
                  <p>Top-1: {fmtPct(row.top1SharePct, 1)} ({row.top1Label})</p>
                  <p>US reliance: {fmtPct(row.usNetImportReliancePct, 0)}</p>
                  <p>Hard-to-substitute score: {row.substitutionDifficulty}/5</p>
                </div>
              );
            }}
          />
          <Scatter
            data={data}
            onClick={(d) => {
              const id = (d as { id?: string })?.id;
              if (id) onSelect(id);
            }}
          >
            {data.map((d) => (
              <Cell
                key={d.id}
                fill={d.color}
                opacity={!highlight || highlight === d.id ? 0.9 : 0.22}
                cursor="pointer"
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <p className="mt-1 text-xs text-slate-500">
        Bubble size = substitution difficulty. Upper-right = concentrated and
        US-import-dependent.
      </p>
    </div>
  );
}

function StagesPanel() {
  const data = STAGE_SPLITS.map((s) => ({
    ...s,
    delta: s.midstreamTop1Pct - s.mineTop1Pct,
  }));

  return (
    <div className="space-y-4">
      <div className="h-[320px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 12, right: 16, left: 8, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="family" tick={{ fontSize: 11, fill: "#334155" }} />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const sorted = sortTooltipPayload(payload);
                const row = sorted[0]?.payload as (typeof data)[0];
                return (
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                    <p className="font-semibold text-slate-900">{row.family}</p>
                    <p>
                      Mine leader {row.mineLeader}: {fmtPct(row.mineTop1Pct, 1)}
                    </p>
                    <p>
                      Midstream leader {row.midstreamLeader}:{" "}
                      {fmtPct(row.midstreamTop1Pct, 1)}
                    </p>
                    <p className="text-slate-500">
                      Midstream − mine: {row.delta > 0 ? "+" : ""}
                      {row.delta.toFixed(1)} pp
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="mineTop1Pct" name="Mine top-1" fill="#ea580c" radius={[4, 4, 0, 0]} />
            <Bar
              dataKey="midstreamTop1Pct"
              name="Midstream top-1"
              fill="#0d9488"
              radius={[4, 4, 0, 0]}
            />
            <Line
              type="monotone"
              dataKey="midstreamTop1Pct"
              stroke="#0f172a"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Midstream path"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((s) => (
          <div
            key={s.family}
            className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs"
          >
            <p className="font-semibold text-slate-800">{s.family}</p>
            <p className="text-slate-600">
              {s.mineLeader} digs → {s.midstreamLeader} processes
            </p>
            <p className="font-mono text-slate-500">
              {fmtPct(s.mineTop1Pct, 0)} → {fmtPct(s.midstreamTop1Pct, 0)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectorsPanel() {
  const data = sectorExposures();
  return (
    <div className="h-[420px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={120}
            tick={{ fontSize: 11, fill: "#334155" }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0]?.payload as ReturnType<typeof sectorExposures>[0];
              return (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                  <p className="font-semibold text-slate-900">{row.label}</p>
                  <p>Median top-1: {fmtPct(row.medianTop1Pct, 0)}</p>
                  <p>
                    Peak: {row.maxLabel} at {fmtPct(row.maxTop1Pct, 0)}
                  </p>
                  <p className="text-slate-500">{row.commodityCount} tracked stages</p>
                </div>
              );
            }}
          />
          <Bar dataKey="medianTop1Pct" name="Median top-1" fill="#6366f1" radius={[0, 4, 4, 0]} />
          <Bar dataKey="maxTop1Pct" name="Max top-1" fill="#f43f5e" radius={[0, 4, 4, 0]} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function ProducersPanel() {
  const data = producerScoreboard().slice(0, 8);
  return (
    <div className="h-[420px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="shortLabel" tick={{ fontSize: 11, fill: "#334155" }} />
          <YAxis
            yAxisId="left"
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
            label={{
              value: "# of top-1 stages",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#64748b", fontSize: 11 },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0]?.payload as ReturnType<typeof producerScoreboard>[0];
              return (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                  <p className="font-semibold text-slate-900">{row.country}</p>
                  <p>Leads {row.top1Count} tracked stages</p>
                  <p>Avg top-1 share: {fmtPct(row.avgTop1SharePct, 0)}</p>
                </div>
              );
            }}
          />
          <Bar
            yAxisId="left"
            dataKey="top1Count"
            name="Top-1 stages"
            fill="#ea580c"
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgTop1SharePct"
            name="Avg top-1 %"
            stroke="#0f172a"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChokepointCommoditiesResearchDashboard() {
  const [panel, setPanel] = useState<Panel>("rank");
  const [stage, setStage] = useState<Stage | "all">("all");
  const [sector, setSector] = useState<Sector | "all">("all");
  const [metric, setMetric] = useState<Metric>("top1");
  const [highlight, setHighlight] = useState<string | null>(null);

  const rows = useMemo(
    () => filterCommodities({ stage, sector }),
    [stage, sector],
  );

  const selected = highlight
    ? COMMODITIES.find((c) => c.id === highlight) ?? null
    : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-200/90">
          Chokepoint commodities · cross-mineral ledger
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
          Where supply is thin — {HEADLINE.commoditiesTracked} stages tracked
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          China leads{" "}
          <span className="font-semibold text-white">
            {HEADLINE.chinaTop1Count}
          </span>{" "}
          of those stages.{" "}
          <span className="font-semibold text-white">
            {HEADLINE.extremeTop1Count}
          </span>{" "}
          have a single country above 70% of world output. Gallium refined:
          China {fmtPct(HEADLINE.galliumChinaPct, 0)}. Natural graphite mine:
          China {fmtPct(HEADLINE.graphiteChinaPct, 1)}.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <ToggleGroup
          label="Panel"
          value={panel}
          onChange={setPanel}
          options={[
            { id: "rank", label: "Concentration" },
            { id: "scatter", label: "Reliance map" },
            { id: "stages", label: "Mine → midstream" },
            { id: "sectors", label: "By sector" },
            { id: "producers", label: "Who leads" },
          ]}
        />
        <ToggleGroup
          label="Stage"
          value={stage}
          onChange={setStage}
          options={[
            { id: "all", label: "All stages" },
            { id: "mine", label: "Mine" },
            { id: "midstream", label: "Midstream" },
            { id: "export", label: "Export" },
          ]}
        />
        <ToggleGroup
          label="Sector"
          value={sector}
          onChange={setSector}
          options={[
            { id: "all", label: "All sectors" },
            { id: "batteries", label: "Batteries" },
            { id: "semiconductors", label: "Semiconductors" },
            { id: "fertilizers", label: "Fertilizers" },
            { id: "magnets", label: "Magnets" },
            { id: "structural", label: "Structural" },
            { id: "industrial-gases", label: "Gases" },
          ]}
        />
        {panel === "rank" && (
          <ToggleGroup
            label="Metric"
            value={metric}
            onChange={setMetric}
            options={[
              { id: "top1", label: "Top-1 %" },
              { id: "top3", label: "Top-3 %" },
              { id: "hhi", label: "HHI" },
              { id: "usReliance", label: "US reliance" },
              { id: "substitution", label: "Hard to sub" },
            ]}
          />
        )}
      </div>

      <ChartCard
        title={
          panel === "rank"
            ? `${metricLabel(metric)} by commodity`
            : panel === "scatter"
              ? "Concentration vs US import reliance"
              : panel === "stages"
                ? "Mine leadership vs midstream leadership"
                : panel === "sectors"
                  ? "Sector exposure — median vs peak top-1"
                  : "Countries that lead the most stages"
        }
        subtitle={
          panel === "rank"
            ? `${rows.length} stages after filters · click a bar to pin`
            : panel === "scatter"
              ? "Filters apply · bubble size = substitution difficulty"
              : panel === "stages"
                ? "Orange = mine top-1 · teal = midstream top-1 · dark line traces midstream"
                : panel === "sectors"
                  ? "Indigo = median top-1 across tracked stages · rose = peak stage"
                  : "Bars = count of top-1 stages · line = average top-1 share"
        }
      >
        {panel === "rank" && (
          <RankPanel
            rows={rows}
            metric={metric}
            highlight={highlight}
            onSelect={(id) => setHighlight((h) => (h === id ? null : id))}
          />
        )}
        {panel === "scatter" && (
          <ScatterPanel
            rows={rows}
            highlight={highlight}
            onSelect={(id) => setHighlight((h) => (h === id ? null : id))}
          />
        )}
        {panel === "stages" && <StagesPanel />}
        {panel === "sectors" && <SectorsPanel />}
        {panel === "producers" && <ProducersPanel />}
      </ChartCard>

      {selected && (
        <div className="rounded-xl border border-teal-200 bg-teal-50/80 px-4 py-3 text-sm text-teal-950">
          <p className="font-semibold">{selected.label}</p>
          <p className="mt-1 text-teal-900/80">
            {selected.top1Label} holds {fmtPct(selected.top1SharePct, 1)} · top-3{" "}
            {fmtPct(selected.top3SharePct, 1)} ({selected.top3Labels}) · US
            reliance {fmtPct(selected.usNetImportReliancePct, 0)} · HHI{" "}
            {fmtHhi(selected.hhi)}
          </p>
          {selected.note && (
            <p className="mt-1 text-xs text-teal-800/80">{selected.note}</p>
          )}
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
