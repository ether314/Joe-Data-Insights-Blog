"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
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
  EXPORTER_COLORS,
  EXPORTERS,
  EXPORT_VOLUME_HISTORY,
  HEADLINE,
  IMPORTER_CORRIDORS,
  SOURCE_NOTE,
  SOURCES,
  fmtMt,
  fmtPct,
  productionVsExportGap,
  rankedExporters,
  type Exporter,
  type ImporterCorridor,
} from "@/data/phosphate-fertilizer-export-data";

// viz-types: export-share treemap, prod-vs-export scatter, stacked export area, importer origin donut, gap lollipop | layout: default

type Metric = "export" | "production";
type PanelFocus = "exporters" | "importers" | "shock";

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

/** Vertical-strip treemap for export (or production) shares */
function ShareTreemap({
  rows,
  metric,
  highlight,
  onSelect,
}: {
  rows: Exporter[];
  metric: Metric;
  highlight: string | null;
  onSelect: (iso: string) => void;
}) {
  const layout = useMemo(() => {
    const items = rows.map((c) => ({
      ...c,
      value: metric === "export" ? c.exportSharePct : c.productionSharePct,
      color: EXPORTER_COLORS[c.country] ?? "#94a3b8",
    }));
    const total = items.reduce((s, d) => s + d.value, 0) || 1;
    const W = 100;
    const H = 100;
    type Rect = {
      iso: string;
      shortLabel: string;
      value: number;
      color: string;
      x: number;
      y: number;
      w: number;
      h: number;
    };
    const strips: Rect[] = [];
    let cx = 0;
    const sorted = [...items].sort((a, b) => b.value - a.value);
    for (const item of sorted) {
      const w = (item.value / total) * W;
      strips.push({
        iso: item.iso,
        shortLabel: item.shortLabel,
        value: item.value,
        color: item.color,
        x: cx,
        y: 0,
        w,
        h: H,
      });
      cx += w;
    }
    return strips;
  }, [rows, metric]);

  return (
    <div className="w-full" data-viz="export-share-treemap">
      <svg viewBox="0 0 100 56" className="h-auto w-full" role="img">
        {layout.map((r) => {
          const active = highlight === r.iso;
          const showLabel = r.w > 8;
          return (
            <g
              key={r.iso}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(r.iso)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect(r.iso);
              }}
              className="cursor-pointer"
            >
              <rect
                x={r.x + 0.3}
                y={2}
                width={Math.max(r.w - 0.6, 0.5)}
                height={52}
                fill={r.color}
                opacity={active || !highlight ? 1 : 0.35}
                rx={1.2}
              />
              {showLabel && (
                <>
                  <text
                    x={r.x + r.w / 2}
                    y={24}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={3.2}
                    fontWeight={700}
                  >
                    {r.shortLabel}
                  </text>
                  <text
                    x={r.x + r.w / 2}
                    y={30}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={3.6}
                    fontWeight={700}
                    opacity={0.95}
                  >
                    {fmtPct(r.value, 0)}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function GapLollipop({
  rows,
  highlight,
  onSelect,
}: {
  rows: Exporter[];
  highlight: string | null;
  onSelect: (iso: string) => void;
}) {
  const data = useMemo(
    () =>
      [...rows]
        .filter((e) => e.iso !== "XX")
        .map((e) => ({
          ...e,
          gap: productionVsExportGap(e),
          color: EXPORTER_COLORS[e.country] ?? "#94a3b8",
        }))
        .sort((a, b) => b.gap - a.gap),
    [rows],
  );
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.gap)), 1);

  return (
    <div className="space-y-2.5" data-viz="export-prod-gap-lollipop">
      {data.map((d) => {
        const active = highlight === d.iso;
        const mid = 50;
        const tip = mid + (d.gap / maxAbs) * 45;
        return (
          <button
            key={d.iso}
            type="button"
            onClick={() => onSelect(d.iso)}
            className={`grid w-full grid-cols-[7.5rem_1fr_3.5rem] items-center gap-2 rounded-lg px-2 py-1 text-left transition hover:bg-slate-50 ${
              active ? "bg-teal-50 ring-1 ring-teal-300" : ""
            }`}
          >
            <span className="truncate text-sm font-semibold text-slate-800">
              {d.shortLabel}
            </span>
            <div className="relative h-7 w-full">
              <div className="absolute inset-y-[13px] left-0 right-0 rounded bg-slate-100" />
              <div
                className="absolute top-0 bottom-0 w-px bg-slate-400"
                style={{ left: `${mid}%` }}
              />
              <div
                className="absolute inset-y-[13px] rounded"
                style={{
                  left: `${Math.min(mid, tip)}%`,
                  width: `${Math.abs(tip - mid)}%`,
                  background: d.gap >= 0 ? "#0d9488" : "#e11d48",
                  opacity: 0.45,
                }}
              />
              <div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white shadow"
                style={{
                  left: `calc(${tip}% - 7px)`,
                  background: d.color,
                }}
              />
            </div>
            <span
              className={`text-right text-xs font-semibold tabular-nums ${
                d.gap >= 0 ? "text-teal-700" : "text-rose-700"
              }`}
            >
              {d.gap > 0 ? "+" : ""}
              {fmtPct(d.gap, 0)}
            </span>
          </button>
        );
      })}
      <p className="pt-1 text-xs text-slate-500">
        Positive = export share exceeds production share (net trade orientation). Negative =
        produces more than it ships (domestic absorption / export controls).
      </p>
    </div>
  );
}

function ImporterDonut({ corridor }: { corridor: ImporterCorridor }) {
  const data = corridor.origins
    .filter((o) => o.sharePct > 0)
    .map((o) => ({
      name: o.exporter,
      value: o.sharePct,
      fill: EXPORTER_COLORS[o.exporter] ?? "#94a3b8",
    }));

  return (
    <div className="grid gap-4 sm:grid-cols-2" data-viz="importer-origin-donut">
      <div className="h-64 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="48%"
              outerRadius="78%"
              paddingAngle={2}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => fmtPct(Number(v ?? 0), 0)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-col justify-center gap-2 text-sm">
        {data.map((d) => (
          <li key={d.name} className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 font-medium text-slate-800">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: d.fill }}
              />
              {d.name}
            </span>
            <span className="tabular-nums text-slate-600">{fmtPct(d.value, 0)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PhosphateFertilizerExportDashboard() {
  const [metric, setMetric] = useState<Metric>("export");
  const [focus, setFocus] = useState<PanelFocus>("exporters");
  const [highlight, setHighlight] = useState<string | null>("MA");
  const [importerIso, setImporterIso] = useState("IN");

  const exporters = useMemo(() => rankedExporters(), []);
  const treemapRows = useMemo(() => EXPORTERS, []);
  const corridor = useMemo(
    () =>
      IMPORTER_CORRIDORS.find((c) => c.iso === importerIso) ?? IMPORTER_CORRIDORS[0],
    [importerIso],
  );

  const scatterData = useMemo(
    () =>
      exporters.map((e) => ({
        ...e,
        x: e.productionSharePct,
        y: e.exportSharePct,
        z: Math.abs(productionVsExportGap(e)) + 4,
        fill: EXPORTER_COLORS[e.country] ?? "#94a3b8",
      })),
    [exporters],
  );

  const areaData = useMemo(
    () =>
      EXPORT_VOLUME_HISTORY.map((y) => ({
        year: y.year,
        Morocco: y.morocco,
        China: y.china,
        "Saudi Arabia": y.saudi,
        Russia: y.russia,
        Other: y.other,
      })),
    [],
  );

  const selected = EXPORTERS.find((e) => e.iso === highlight);

  return (
    <div className="space-y-6" data-viz="phosphate-fertilizer-export">
      <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950">
        {SOURCE_NOTE}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Top-3 exporter share
          </p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {fmtPct(HEADLINE.top3ExportSharePct, 0)} from {HEADLINE.top3Labels}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Processed phosphate fertilizers (MAP/DAP/TSP) — not raw rock. Top-4 with Russia
            reaches {fmtPct(HEADLINE.top4ExportSharePct, 0)}.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            China export drop
          </p>
          <p className="mt-1 text-2xl font-bold text-rose-700">
            {fmtPct(HEADLINE.chinaExportDropPct, 0)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {fmtMt(HEADLINE.chinaExport2021Mt, 0)} → {fmtMt(HEADLINE.chinaExport2024Mt, 1)}{" "}
            (2021→2024)
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Top-5 production
          </p>
          <p className="mt-1 text-2xl font-bold text-teal-700">
            {fmtPct(HEADLINE.top5ProductionSharePct, 0)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Among ~{HEADLINE.producerCount} producing countries
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <ToggleGroup
          label="Lens"
          value={focus}
          options={[
            { id: "exporters", label: "Exporters" },
            { id: "importers", label: "Food-system importers" },
            { id: "shock", label: "China shock path" },
          ]}
          onChange={setFocus}
        />
        <ToggleGroup
          label="Share metric"
          value={metric}
          options={[
            { id: "export", label: "Export share" },
            { id: "production", label: "Production share" },
          ]}
          onChange={setMetric}
        />
      </div>

      {(focus === "exporters" || focus === "shock") && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={
              metric === "export"
                ? "Export share treemap — processed phosphates"
                : "Production share treemap — MAP/DAP/TSP"
            }
            subtitle="Click a strip to highlight · TFI 2025 shares"
          >
            <ShareTreemap
              rows={treemapRows}
              metric={metric}
              highlight={highlight}
              onSelect={setHighlight}
            />
            {selected && (
              <p className="mt-3 text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{selected.country}</span>
                {" — "}
                export {fmtPct(selected.exportSharePct, 0)}, production{" "}
                {fmtPct(selected.productionSharePct, 0)}
                {selected.note ? `. ${selected.note}` : ""}
              </p>
            )}
          </ChartCard>

          <ChartCard
            title="Production vs export share"
            subtitle="Bubble size ∝ |export − production| gap · diagonal = parity"
          >
            <div className="h-80 w-full min-w-0" data-viz="prod-export-scatter">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Production %"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Production share %",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Export %"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Export share %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip
                    formatter={(v, name) =>
                      name === "x" || name === "y"
                        ? fmtPct(Number(v ?? 0), 0)
                        : String(v)
                    }
                    labelFormatter={() => ""}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const p = payload[0]?.payload as (typeof scatterData)[0];
                      if (!p) return null;
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                          <p className="font-semibold text-slate-900">{p.country}</p>
                          <p>Production {fmtPct(p.productionSharePct, 0)}</p>
                          <p>Export {fmtPct(p.exportSharePct, 0)}</p>
                          <p>
                            Gap {productionVsExportGap(p) > 0 ? "+" : ""}
                            {fmtPct(productionVsExportGap(p), 0)}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Scatter
                    data={scatterData}
                    onClick={(d) => {
                      const iso = (d as { iso?: string })?.iso;
                      if (iso) setHighlight(iso);
                    }}
                  >
                    {scatterData.map((d) => (
                      <Cell
                        key={d.iso}
                        fill={d.fill}
                        stroke={highlight === d.iso ? "#0f172a" : "#fff"}
                        strokeWidth={highlight === d.iso ? 2 : 1}
                        opacity={!highlight || highlight === d.iso ? 1 : 0.35}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {focus === "exporters" && (
        <ChartCard
          title="Export − production gap (lollipop)"
          subtitle="Who punches above their dig-and-process weight in seaborne markets"
        >
          <GapLollipop rows={EXPORTERS} highlight={highlight} onSelect={setHighlight} />
        </ChartCard>
      )}

      {(focus === "shock" || focus === "exporters") && (
        <ChartCard
          title="Major exporter volumes — China shock path"
          subtitle="Approximate DAP/MAP-class export Mt · IFPRI China volumes anchored at 10→6.6 Mt (2021→2024)"
        >
          <div className="h-80 w-full min-w-0" data-viz="export-volume-stack">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}`} />
                <Tooltip
                  formatter={(v, name) => [fmtMt(Number(v ?? 0), 1), String(name)]}
                />
                {(
                  ["Morocco", "China", "Saudi Arabia", "Russia", "Other"] as const
                ).map((key) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stackId="1"
                    stroke={EXPORTER_COLORS[key]}
                    fill={EXPORTER_COLORS[key]}
                    fillOpacity={key === "China" ? 0.85 : 0.55}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {focus === "importers" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Importer DAP origin mix"
            subtitle={`${corridor.importer} · ${corridor.year} · food-system dependence`}
          >
            <div className="mb-4">
              <ToggleGroup
                label="Importer"
                value={importerIso}
                options={IMPORTER_CORRIDORS.map((c) => ({
                  id: c.iso,
                  label: c.shortLabel,
                }))}
                onChange={setImporterIso}
              />
            </div>
            <ImporterDonut corridor={corridor} />
            {corridor.note && (
              <p className="mt-3 text-sm text-slate-600">{corridor.note}</p>
            )}
          </ChartCard>

          <ChartCard
            title="Corridor comparison — top origin share"
            subtitle="Largest single-origin share of DAP imports by buyer"
          >
            <div className="space-y-3" data-viz="importer-top-origin-bars">
              {IMPORTER_CORRIDORS.map((c) => {
                const top = [...c.origins].sort((a, b) => b.sharePct - a.sharePct)[0];
                const active = c.iso === importerIso;
                return (
                  <button
                    key={c.iso}
                    type="button"
                    onClick={() => setImporterIso(c.iso)}
                    className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                      active
                        ? "border-teal-400 bg-teal-50"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-900">{c.shortLabel}</span>
                      <span className="tabular-nums text-slate-600">
                        {top.exporter} {fmtPct(top.sharePct, 0)}
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${top.sharePct}%`,
                          background: EXPORTER_COLORS[top.exporter] ?? "#94a3b8",
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </ChartCard>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
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
