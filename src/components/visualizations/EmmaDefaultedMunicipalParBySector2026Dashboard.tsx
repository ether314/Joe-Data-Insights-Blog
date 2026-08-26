"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
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
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ANALYTICS,
  COUNT_VS_PAR,
  EVENT_MIX,
  FLOW_SERIES,
  HEADLINE,
  MIX_COMPARE,
  SECTORS,
  SOURCE_NOTE,
  STOCK_SERIES,
  filterFlowByEra,
  filterStockByEra,
  stockShares,
  type EraFilter,
  type MetricMode,
  type SectorFilter,
  type SectorId,
} from "@/data/emma-defaulted-municipal-par-by-sector-2026-data";

// smoke-marker: Defaulted par share by sector

type Panel =
  | "stock-stack"
  | "mix-slope"
  | "flow-heatmap"
  | "count-vs-par"
  | "event-era"
  | "stock-path";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "stock-stack": {
    title: "Outstanding defaulted par — sector stack",
    subtitle: `YE2025 stock ≈ $${HEADLINE.outstandingPar2025B}B; healthcare + land-secured = ${HEADLINE.riskPairShare2025Pct}%`,
  },
  "mix-slope": {
    title: "Sector share slope — YE2019 → YE2025",
    subtitle: `GO share fell ${Math.abs(HEADLINE.goFallPp)} pp as Puerto Rico exited; healthcare rose +${HEADLINE.healthcareRisePp} pp`,
  },
  "flow-heatmap": {
    title: "New default par by sector × year",
    subtitle: "2020–2025 flows concentrate in healthcare and land-secured pledges",
  },
  "count-vs-par": {
    title: "Event count share vs par share",
    subtitle: "Housing and healthcare dominate counts; GO historically dominated dollars",
  },
  "event-era": {
    title: "New default events — pre-2020 vs 2020–2025",
    subtitle: `${HEADLINE.riskPairNewEventsPct}% of 2020–2025 events sit in healthcare + land-secured`,
  },
  "stock-path": {
    title: "Total outstanding defaulted par path",
    subtitle: `Stock collapsed from $${HEADLINE.outstandingPar2019B}B (YE2019) to $${HEADLINE.outstandingPar2025B}B (YE2025)`,
  },
};

const PANEL_BTNS: { id: Panel; label: string }[] = [
  { id: "stock-stack", label: "Stock stack" },
  { id: "mix-slope", label: "Mix slope" },
  { id: "flow-heatmap", label: "Flow grid" },
  { id: "count-vs-par", label: "Count vs par" },
  { id: "event-era", label: "Era events" },
  { id: "stock-path", label: "Stock path" },
];

const ERA_OPTS: { id: EraFilter; label: string }[] = [
  { id: "all", label: "2015–2025" },
  { id: "pre2020", label: "Pre-2020" },
  { id: "post2020", label: "2020–2025" },
];

const METRIC_OPTS: { id: MetricMode; label: string }[] = [
  { id: "share", label: "Share %" },
  { id: "dollars", label: "Par $" },
  { id: "events", label: "Event count" },
];

const SECTOR_OPTS: { id: SectorFilter; label: string }[] = [
  { id: "all", label: "All sectors" },
  ...SECTORS.map((s) => ({ id: s.id as SectorFilter, label: s.short })),
];

const colorOf = (id: SectorId) => SECTORS.find((s) => s.id === id)!.color;

const fmtB = (m: number) => `$${(m / 1000).toFixed(2)}B`;
const fmtM = (m: number) => `$${m.toLocaleString()}M`;
const fmtPct = (n: number) => `${n.toFixed(1)}%`;

export function EmmaDefaultedMunicipalParBySector2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("stock-stack");
  const [era, setEra] = useState<EraFilter>("all");
  const [metric, setMetric] = useState<MetricMode>("share");
  const [sector, setSector] = useState<SectorFilter>("all");

  const stockRows = useMemo(() => filterStockByEra(era), [era]);
  const flowRows = useMemo(() => filterFlowByEra(era), [era]);

  const stackData = useMemo(() => {
    if (metric === "share") {
      return stockRows.map((r) => {
        const s = stockShares(r);
        return {
          year: r.year,
          healthcare: Math.round(s.healthcare * 10) / 10,
          housing: Math.round(s.housing * 10) / 10,
          landSecured: Math.round(s.landSecured * 10) / 10,
          go: Math.round(s.go * 10) / 10,
          other: Math.round(s.other * 10) / 10,
        };
      });
    }
    return stockRows.map((r) => ({
      year: r.year,
      healthcare: r.healthcareM,
      housing: r.housingM,
      landSecured: r.landSecuredM,
      go: r.goM,
      other: r.otherM,
    }));
  }, [stockRows, metric]);

  const slopeBars = useMemo(() => {
    return MIX_COMPARE.filter((r) => sector === "all" || r.sector === sector).map(
      (r) => ({
        sector: SECTORS.find((s) => s.id === r.sector)!.short,
        share2019: r.share2019Pct,
        share2025: r.share2025Pct,
        fill: colorOf(r.sector),
      }),
    );
  }, [sector]);

  const flowGrid = useMemo(() => {
    const keys: SectorId[] =
      sector === "all"
        ? ["healthcare", "housing", "landSecured", "go", "other"]
        : [sector];
    return flowRows.map((r) => {
      const row: Record<string, number | string> = { year: String(r.year) };
      for (const k of keys) {
        if (metric === "events") {
          const map: Record<SectorId, number> = {
            healthcare: r.healthcareEvents,
            housing: r.housingEvents,
            landSecured: r.landSecuredEvents,
            go: r.goEvents,
            other: r.otherEvents,
          };
          row[k] = map[k];
        } else {
          const map: Record<SectorId, number> = {
            healthcare: r.healthcareM,
            housing: r.housingM,
            landSecured: r.landSecuredM,
            go: r.goM,
            other: r.otherM,
          };
          row[k] = map[k];
        }
      }
      return row;
    });
  }, [flowRows, metric, sector]);

  const scatterData = useMemo(
    () =>
      COUNT_VS_PAR.filter((r) => sector === "all" || r.sector === sector).map(
        (r) => ({
          ...r,
          fill: colorOf(r.sector),
          z: Math.max(r.eventSharePct, r.parSharePct),
        }),
      ),
    [sector],
  );

  const eraBars = useMemo(() => {
    return EVENT_MIX.filter((r) => sector === "all" || r.sector === sector).map(
      (r) => ({
        sector: SECTORS.find((s) => s.id === r.sector)!.short,
        pre: metric === "dollars" ? r.par2015_19M : r.events2015_19,
        post: metric === "dollars" ? r.par2020_25M : r.events2020_25,
        fill: colorOf(r.sector),
      }),
    );
  }, [sector, metric]);

  const pathData = useMemo(
    () =>
      stockRows.map((r) => ({
        year: r.year,
        totalB: Math.round((r.totalM / 1000) * 100) / 100,
        goB: Math.round((r.goM / 1000) * 100) / 100,
        riskPairB:
          Math.round(((r.healthcareM + r.landSecuredM) / 1000) * 100) / 100,
      })),
    [stockRows],
  );

  const meta = PANEL_META[panel];
  const yFmt =
    metric === "share"
      ? (v: number) => `${v}%`
      : metric === "events"
        ? (v: number) => String(v)
        : (v: number) => (v >= 1000 ? fmtB(v) : fmtM(v));

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      data-viz="emma-defaulted-municipal-par-by-sector-2026"
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Capital Markets · {ANALYTICS.smokeMarker}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            {meta.title}
          </h3>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">{meta.subtitle}</p>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-right">
          <p className="text-xs text-slate-500">{ANALYTICS.headlineLabel}</p>
          <p className="text-xl font-semibold text-amber-600">
            {ANALYTICS.headlineValue}
          </p>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {PANEL_BTNS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setPanel(b.id)}
            className={`rounded-md px-3 py-1.5 text-sm ${
              panel === b.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Era
          <select
            className="rounded border border-slate-300 bg-white px-2 py-1 text-sm"
            value={era}
            onChange={(e) => setEra(e.target.value as EraFilter)}
          >
            {ERA_OPTS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Metric
          <select
            className="rounded border border-slate-300 bg-white px-2 py-1 text-sm"
            value={metric}
            onChange={(e) => setMetric(e.target.value as MetricMode)}
          >
            {METRIC_OPTS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Sector
          <select
            className="rounded border border-slate-300 bg-white px-2 py-1 text-sm"
            value={sector}
            onChange={(e) => setSector(e.target.value as SectorFilter)}
          >
            {SECTOR_OPTS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="h-[380px] w-full">
        {panel === "stock-stack" && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stackData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={yFmt} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v, name) => [
                  metric === "share" ? fmtPct(Number(v)) : fmtM(Number(v)),
                  SECTORS.find((s) => s.id === name)?.short ?? String(name),
                ]}
              />
              <Legend />
              {(sector === "all"
                ? (["healthcare", "housing", "landSecured", "go", "other"] as SectorId[])
                : [sector]
              ).map((id) => (
                <Area
                  key={id}
                  type="monotone"
                  dataKey={id}
                  stackId={sector === "all" ? "1" : undefined}
                  stroke={colorOf(id)}
                  fill={colorOf(id)}
                  fillOpacity={0.75}
                  name={SECTORS.find((s) => s.id === id)!.short}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}

        {panel === "mix-slope" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={slopeBars} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" unit="%" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="sector" width={90} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => fmtPct(Number(v))} />
              <Legend />
              <Bar dataKey="share2019" name="YE2019 share" fill="#64748b" barSize={10} />
              <Bar dataKey="share2025" name="YE2025 share" fill="#f59e0b" barSize={10} />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {panel === "flow-heatmap" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={flowGrid}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(v) =>
                  metric === "events" ? String(v) : fmtM(Number(v))
                }
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(v, name) => [
                  metric === "events" ? Number(v) : fmtM(Number(v)),
                  SECTORS.find((s) => s.id === name)?.short ?? String(name),
                ]}
              />
              <Legend />
              {(sector === "all"
                ? (["healthcare", "housing", "landSecured", "go", "other"] as SectorId[])
                : [sector]
              ).map((id) => (
                <Bar
                  key={id}
                  dataKey={id}
                  stackId="f"
                  fill={colorOf(id)}
                  name={SECTORS.find((s) => s.id === id)!.short}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "count-vs-par" && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="eventSharePct"
                name="Event share"
                unit="%"
                tick={{ fontSize: 12 }}
                label={{ value: "Event-count share %", position: "insideBottom", offset: -2 }}
              />
              <YAxis
                type="number"
                dataKey="parSharePct"
                name="Par share"
                unit="%"
                tick={{ fontSize: 12 }}
                label={{ value: "Par share %", angle: -90, position: "insideLeft" }}
              />
              <ZAxis type="number" dataKey="z" range={[80, 280]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) => [
                  fmtPct(Number(v)),
                  name === "eventSharePct" ? "Event share" : "Par share",
                ]}
                labelFormatter={(_, payload) =>
                  (payload?.[0]?.payload as { label?: string })?.label ?? ""
                }
              />
              <Scatter data={scatterData} name="Sectors">
                {scatterData.map((d) => (
                  <Cell key={d.sector} fill={d.fill} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}

        {panel === "event-era" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={eraBars}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="sector" tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(v) =>
                  metric === "dollars" ? fmtM(Number(v)) : String(v)
                }
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(v) =>
                  metric === "dollars" ? fmtM(Number(v)) : Number(v)
                }
              />
              <Legend />
              <Bar dataKey="pre" name="2015–2019" fill="#64748b" />
              <Bar dataKey="post" name="2020–2025" fill="#a78bfa" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {panel === "stock-path" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={pathData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(v) => `$${v}B`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(v) => `$${Number(v)}B`} />
              <Legend />
              <Area
                type="monotone"
                dataKey="totalB"
                name="Total defaulted par"
                stroke="#0f172a"
                fill="#cbd5e1"
                fillOpacity={0.45}
              />
              <Line
                type="monotone"
                dataKey="goB"
                name="GO stock"
                stroke="#34d399"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="riskPairB"
                name="Healthcare + land-secured"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <p className="mt-1 text-[11px] text-slate-400">
        Series length {STOCK_SERIES.length} stock years · {FLOW_SERIES.length}{" "}
        flow years · desk join, not an official EMMA stock extract.
      </p>
    </div>
  );
}
