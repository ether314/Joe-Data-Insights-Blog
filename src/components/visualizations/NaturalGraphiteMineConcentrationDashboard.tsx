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
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  COUNTRIES,
  HEADLINE,
  SOURCE_NOTE,
  SOURCES,
  US_IMPORT_SOURCES,
  US_SALIENT,
  WORLD_MINE_2024,
  fmtPct,
  fmtTons,
  mineShare2024,
  rankedProducers2024,
  reservesShare,
  topMovers,
  type GraphiteCountry,
} from "@/data/natural-graphite-mine-concentration-data";

// viz-types: custom-treemap SVG, slope dumbbell, reserves×mine scatter, ranked lollipop, import donut | layout: default

type Tab = "map" | "slope" | "gap" | "us";
type RankMode = "tons" | "share";
type ScatterMode = "tons" | "share";

const COLORS = [
  "#f59e0b",
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

/** Squarified-ish treemap for production shares (custom SVG) */
function TreemapPanel({
  rows,
  highlight,
  onSelect,
}: {
  rows: GraphiteCountry[];
  highlight: string | null;
  onSelect: (c: string) => void;
}) {
  const layout = useMemo(() => {
    const items = rows.map((c, i) => ({
      ...c,
      value: c.mine2024T,
      color: COLORS[i % COLORS.length],
    }));
    const total = items.reduce((s, x) => s + x.value, 0) || 1;
    const W = 1000;
    const H = 520;
    type Rect = {
      x: number;
      y: number;
      w: number;
      h: number;
      country: string;
      shortLabel: string;
      value: number;
      share: number;
      color: string;
    };
    const rects: Rect[] = [];
    let x = 0;
    let remainingW = W;
    let i = 0;
    // Simple strip packing: first item (China) takes full-height strip, rest stack
    if (items.length) {
      const first = items[0];
      const fw = (first.value / total) * W;
      rects.push({
        x: 0,
        y: 0,
        w: fw,
        h: H,
        country: first.country,
        shortLabel: first.shortLabel,
        value: first.value,
        share: (first.value / total) * 100,
        color: first.color,
      });
      x = fw;
      remainingW = W - fw;
      i = 1;
    }
    let cy = 0;
    const rest = items.slice(i);
    const restTotal = rest.reduce((s, r) => s + r.value, 0) || 1;
    for (const it of rest) {
      const h = (it.value / restTotal) * H;
      rects.push({
        x,
        y: cy,
        w: remainingW,
        h: Math.max(h, 18),
        country: it.country,
        shortLabel: it.shortLabel,
        value: it.value,
        share: (it.value / total) * 100,
        color: it.color,
      });
      cy += h;
    }
    // Normalize last heights if overflow
    const overflow = cy - H;
    if (overflow > 0 && rects.length > 1) {
      rects[rects.length - 1].h = Math.max(
        18,
        rects[rects.length - 1].h - overflow,
      );
    }
    return { rects, W, H };
  }, [rows]);

  return (
    <div className="w-full min-h-[280px]">
      <svg
        viewBox={`0 0 ${layout.W} ${layout.H}`}
        className="h-80 w-full min-h-[280px]"
        role="img"
        aria-label="Treemap of 2024 natural graphite mine production by country"
      >
        {layout.rects.map((r) => {
          const active = highlight === r.country;
          const showLabel = r.w > 90 && r.h > 36;
          return (
            <g
              key={r.country}
              className="cursor-pointer"
              onClick={() => onSelect(r.country)}
            >
              <title>{`${r.country}: ${fmtTons(r.value)} (${fmtPct(r.share)})`}</title>
              <rect
                x={r.x + 2}
                y={r.y + 2}
                width={Math.max(0, r.w - 4)}
                height={Math.max(0, r.h - 4)}
                fill={r.color}
                opacity={highlight && !active ? 0.35 : 0.92}
                stroke={active ? "#0f172a" : "#fff"}
                strokeWidth={active ? 3 : 1.5}
                rx={6}
              />
              {showLabel && (
                <>
                  <text
                    x={r.x + 14}
                    y={r.y + 28}
                    fill="#0f172a"
                    fontSize={r.w > 200 ? 22 : 16}
                    fontWeight={700}
                  >
                    {r.shortLabel}
                  </text>
                  <text
                    x={r.x + 14}
                    y={r.y + 52}
                    fill="#1e293b"
                    fontSize={14}
                    fontWeight={600}
                  >
                    {fmtPct(r.share)} · {fmtTons(r.value)}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
      <p className="mt-2 text-xs text-slate-500">
        Click a tile to highlight. Area ∝ 2024 mine tons (USGS).
      </p>
    </div>
  );
}

function SlopePanel({
  rows,
  highlight,
  onSelect,
}: {
  rows: GraphiteCountry[];
  highlight: string | null;
  onSelect: (c: string) => void;
}) {
  const data = useMemo(
    () =>
      rows
        .map((c, i) => ({
          ...c,
          delta: c.mine2024T - c.mine2023T,
          color: COLORS[i % COLORS.length],
        }))
        .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
        .slice(0, 10),
    [rows],
  );
  const maxT = Math.max(...data.flatMap((d) => [d.mine2023T, d.mine2024T]), 1);

  return (
    <div className="space-y-3 min-h-[280px]">
      {data.map((d) => {
        const active = !highlight || highlight === d.country;
        const x0 = 8 + (d.mine2023T / maxT) * 78;
        const x1 = 8 + (d.mine2024T / maxT) * 78;
        return (
          <button
            key={d.country}
            type="button"
            onClick={() => onSelect(d.country)}
            className={`grid w-full grid-cols-[7rem_1fr_5.5rem] items-center gap-2 rounded-lg px-2 py-1.5 text-left transition ${
              active ? "bg-slate-50" : "opacity-40"
            }`}
          >
            <span className="truncate text-sm font-semibold text-slate-800">
              {d.shortLabel}
            </span>
            <svg viewBox="0 0 100 20" className="h-8 w-full min-h-[32px]">
              <title>{`${d.country}: ${fmtTons(d.mine2023T)} → ${fmtTons(d.mine2024T)}`}</title>
              <line
                x1={x0}
                y1={10}
                x2={x1}
                y2={10}
                stroke={d.color}
                strokeWidth={2.5}
              />
              <circle cx={x0} cy={10} r={4} fill="#94a3b8" />
              <circle cx={x1} cy={10} r={4.5} fill={d.color} />
            </svg>
            <span
              className={`text-right text-xs font-bold ${
                d.delta >= 0 ? "text-teal-600" : "text-rose-600"
              }`}
            >
              {d.delta >= 0 ? "+" : ""}
              {fmtTons(d.delta)}
            </span>
          </button>
        );
      })}
      <p className="text-xs text-slate-500">
        Slope: 2023 → 2024 mine tons. Grey = 2023, color = 2024. Sorted by |Δ|.
      </p>
    </div>
  );
}

function LollipopPanel({
  rows,
  mode,
  highlight,
  onSelect,
}: {
  rows: GraphiteCountry[];
  mode: RankMode;
  highlight: string | null;
  onSelect: (c: string) => void;
}) {
  const data = useMemo(() => {
    const list = rankedProducers2024().slice(0, 12);
    return list.map((c, i) => ({
      ...c,
      value: mode === "tons" ? c.mine2024T : mineShare2024(c),
      color: COLORS[i % COLORS.length],
    }));
  }, [mode, rows]);
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-2.5 min-h-[280px]">
      {data.map((d) => {
        const pct = (d.value / max) * 100;
        const active = !highlight || highlight === d.country;
        return (
          <button
            key={d.country}
            type="button"
            onClick={() => onSelect(d.country)}
            className={`grid w-full grid-cols-[7.5rem_1fr_4.5rem] items-center gap-2 ${
              active ? "" : "opacity-35"
            }`}
          >
            <span className="truncate text-left text-sm font-semibold text-slate-800">
              {d.shortLabel}
            </span>
            <div className="relative h-3 rounded-full bg-slate-100">
              <div
                className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2"
                style={{ width: `${pct}%`, background: d.color }}
              />
              <div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white shadow"
                style={{ left: `calc(${pct}% - 7px)`, background: d.color }}
              />
            </div>
            <span className="text-right text-xs font-bold text-slate-700">
              {mode === "tons" ? fmtTons(d.value) : fmtPct(d.value)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ScatterPanel({
  mode,
  highlight,
  onSelect,
}: {
  mode: ScatterMode;
  highlight: string | null;
  onSelect: (c: string) => void;
}) {
  const points = useMemo(() => {
    return COUNTRIES.filter((c) => c.reservesT != null && c.mine2024T > 0).map(
      (c, i) => ({
        ...c,
        x: mode === "tons" ? (c.reservesT as number) / 1_000_000 : reservesShare(c)!,
        y: mode === "tons" ? c.mine2024T / 1_000 : mineShare2024(c),
        z: Math.max(80, Math.sqrt(c.mine2024T)),
        color: COLORS[i % COLORS.length],
      }),
    );
  }, [mode]);

  return (
    <div className="h-80 min-h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={280}>
        <ScatterChart margin={{ top: 12, right: 16, bottom: 28, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            dataKey="x"
            name="Reserves"
            tick={{ fontSize: 11 }}
            label={{
              value: mode === "tons" ? "Reserves (Mt)" : "Reserves share (%)",
              position: "insideBottom",
              offset: -12,
              fontSize: 11,
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Mine"
            tick={{ fontSize: 11 }}
            label={{
              value: mode === "tons" ? "Mine 2024 (kt)" : "Mine share (%)",
              angle: -90,
              position: "insideLeft",
              offset: 4,
              fontSize: 11,
            }}
          />
          <ZAxis type="number" dataKey="z" range={[60, 400]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const sorted = sortTooltipPayload(payload);
              const p = sorted[0]?.payload as (typeof points)[0];
              if (!p) return null;
              return (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
                  <p className="font-bold text-slate-900">{p.country}</p>
                  <p>Mine 2024: {fmtTons(p.mine2024T)} ({fmtPct(mineShare2024(p))})</p>
                  <p>
                    Reserves:{" "}
                    {p.reservesT != null ? fmtTons(p.reservesT) : "n/a"} (
                    {fmtPct(reservesShare(p) ?? 0)})
                  </p>
                </div>
              );
            }}
          />
          <Scatter
            data={points}
            onClick={(d) => {
              const c = (d as { country?: string })?.country;
              if (c) onSelect(c);
            }}
          >
            {points.map((p) => (
              <Cell
                key={p.country}
                fill={p.color}
                fillOpacity={!highlight || highlight === p.country ? 0.9 : 0.25}
                stroke={highlight === p.country ? "#0f172a" : "#fff"}
                strokeWidth={highlight === p.country ? 2 : 1}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

function ImportDonut() {
  const data = US_IMPORT_SOURCES.map((s, i) => ({
    ...s,
    color: COLORS[i % COLORS.length],
  }));
  return (
    <div className="grid gap-4 sm:grid-cols-2 min-h-[280px]">
      <div className="h-72 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={220} minHeight={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="sharePct"
              nameKey="source"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={2}
            >
              {data.map((d) => (
                <Cell key={d.source} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const sorted = sortTooltipPayload(payload);
                return (
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
                    {sorted.map((p) => (
                      <div key={String(p.name)} className="flex justify-between gap-4">
                        <span>{p.name}</span>
                        <span className="font-bold">{fmtPct(Number(p.value))}</span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col justify-center space-y-2">
        {data.map((d) => (
          <div
            key={d.source}
            className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"
          >
            <span className="flex items-center gap-2 font-medium text-slate-800">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: d.color }}
              />
              {d.source}
            </span>
            <span className="font-bold text-slate-900">{fmtPct(d.sharePct, 0)}</span>
          </div>
        ))}
        <p className="pt-2 text-xs text-slate-500">
          USGS 2020–23 average import sources. Apparent consumption 2024e:{" "}
          {fmtTons(US_SALIENT.apparentConsumption2024T)} (−21% vs 2023).
        </p>
      </div>
    </div>
  );
}

export function NaturalGraphiteMineConcentrationDashboard() {
  const [tab, setTab] = useState<Tab>("map");
  const [rankMode, setRankMode] = useState<RankMode>("share");
  const [scatterMode, setScatterMode] = useState<ScatterMode>("share");
  const [highlight, setHighlight] = useState<string | null>(null);

  const treemapRows = useMemo(() => rankedProducers2024().slice(0, 10), []);
  const slopeRows = useMemo(() => topMovers(), []);

  const onSelect = (c: string) =>
    setHighlight((prev) => (prev === c ? null : c));

  return (
    <div data-viz="natural-graphite-mine-concentration" className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Natural graphite mine concentration — USGS MCS 2025
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          China mined {fmtPct(HEADLINE.chinaShare2024Pct, 0)} of world natural
          graphite in 2024
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">
          Top-3 producers (China + Madagascar + Mozambique) supplied{" "}
          {fmtPct(HEADLINE.top3Share2024Pct, 0)} of global mine output. The United
          States mined {HEADLINE.usMineTons} tons — and ran{" "}
          {HEADLINE.usNetImportReliancePct}% net import reliance.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-amber-300 text-xs uppercase">China share</div>
            <div className="text-xl font-bold">
              {fmtPct(HEADLINE.chinaShare2024Pct, 0)}
            </div>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-sky-300 text-xs uppercase">Top-3 share</div>
            <div className="text-xl font-bold">
              {fmtPct(HEADLINE.top3Share2024Pct, 0)}
            </div>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-teal-300 text-xs uppercase">World 2024e</div>
            <div className="text-xl font-bold">
              {fmtTons(WORLD_MINE_2024)}
            </div>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <div className="text-violet-300 text-xs uppercase">Brazil reserves</div>
            <div className="text-xl font-bold">
              {fmtPct(HEADLINE.brazilReservesSharePct, 0)} vs{" "}
              {fmtPct(HEADLINE.brazilMineSharePct, 0)} mine
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          label="View"
          value={tab}
          onChange={setTab}
          options={[
            { id: "map", label: "Treemap" },
            { id: "slope", label: "2023→2024 movers" },
            { id: "gap", label: "Reserves gap" },
            { id: "us", label: "US dependence" },
          ]}
        />
        {tab === "map" && (
          <ToggleGroup
            label="Rank"
            value={rankMode}
            onChange={setRankMode}
            options={[
              { id: "share", label: "Share %" },
              { id: "tons", label: "Tons" },
            ]}
          />
        )}
        {tab === "gap" && (
          <ToggleGroup
            label="Axes"
            value={scatterMode}
            onChange={setScatterMode}
            options={[
              { id: "share", label: "Shares" },
              { id: "tons", label: "Tons" },
            ]}
          />
        )}
        {highlight && (
          <button
            type="button"
            onClick={() => setHighlight(null)}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Clear highlight: {highlight}
          </button>
        )}
      </div>

      {tab === "map" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Treemap: 2024 mine production"
            subtitle="Area ∝ tons — China occupies most of the frame"
          >
            <TreemapPanel
              rows={treemapRows}
              highlight={highlight}
              onSelect={onSelect}
            />
          </ChartCard>
          <ChartCard
            title="Ranked lollipop — top producers"
            subtitle="Highest → lowest (USGS 2024e)"
          >
            <LollipopPanel
              rows={treemapRows}
              mode={rankMode}
              highlight={highlight}
              onSelect={onSelect}
            />
          </ChartCard>
        </div>
      )}

      {tab === "slope" && (
        <ChartCard
          title="Biggest movers 2023 → 2024"
          subtitle="Madagascar and Tanzania ramped; Mozambique slipped"
        >
          <SlopePanel
            rows={slopeRows}
            highlight={highlight}
            onSelect={onSelect}
          />
        </ChartCard>
      )}

      {tab === "gap" && (
        <ChartCard
          title="Reserves vs mine output"
          subtitle="Brazil’s reserve stock rivals China’s — its mine share does not"
        >
          <ScatterPanel
            mode={scatterMode}
            highlight={highlight}
            onSelect={onSelect}
          />
        </ChartCard>
      )}

      {tab === "us" && (
        <ChartCard
          title="US import sources (2020–23 avg)"
          subtitle={`100% net import reliance · 2024e imports ${fmtTons(US_SALIENT.imports2024T)}`}
        >
          <ImportDonut />
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">
        {SOURCE_NOTE}{" "}
        {SOURCES.map((s, i) => (
          <span key={s.url}>
            {i > 0 ? " · " : ""}
            <a
              href={s.url}
              className="underline decoration-slate-300 hover:text-slate-700"
              target="_blank"
              rel="noreferrer"
            >
              {s.label}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}
