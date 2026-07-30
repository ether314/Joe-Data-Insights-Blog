"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BOTTLENECK_COLORS,
  COWOS_CAPACITY,
  CUSTOMER_DEMAND,
  DATA_YEAR,
  GLOBAL_SUMMARY,
  HBM_SUPPLIERS,
  LAYER_LABELS,
  SOURCE_NOTE,
  STATS,
  SUPPLY_CHAIN,
  fmtPct,
  fmtUsdB,
  fmtWafers,
  fmtWeeks,
  fmtWpm,
  type BottleneckLayer,
  type SupplyChainRecord,
} from "@/data/ai-packaging-bottleneck-data";

const CHART_COLORS = {
  primary: "#0891b2",
  accent: "#6366f1",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#dc2626",
};

type LayerFilter = BottleneckLayer | "All";

const LAYERS: LayerFilter[] = ["All", "hbm", "cowos", "osat", "demand", "market"];

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

function StatusPill({ status }: { status: SupplyChainRecord["status"] }) {
  const styles =
    status === "sold_out"
      ? "bg-red-100 text-red-800"
      : status === "tight"
        ? "bg-amber-100 text-amber-800"
        : status === "ramping"
          ? "bg-sky-100 text-sky-800"
          : status === "expanding"
            ? "bg-emerald-100 text-emerald-800"
            : "bg-slate-100 text-slate-600";
  const label =
    status === "sold_out"
      ? "Sold out"
      : status === "tight"
        ? "Tight"
        : status === "ramping"
          ? "Ramping"
          : status === "expanding"
            ? "Expanding"
            : "Benchmark";
  return (
    <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold ${styles}`}>
      {label}
    </span>
  );
}

function fmtValue(record: SupplyChainRecord): string {
  if (record.unit === "wpm") return fmtWpm(record.value);
  if (record.unit === "wafers/yr") return fmtWafers(record.value);
  if (record.unit === "USD B") return fmtUsdB(record.value);
  if (record.unit === "%") return fmtPct(record.value);
  if (record.unit === "weeks") return fmtWeeks(record.value);
  return `${record.value.toLocaleString("en-US")} ${record.unit}`;
}

export function AiPackagingBottleneckDashboard() {
  const [layer, setLayer] = useState<LayerFilter>("All");

  const filtered = useMemo(() => {
    if (layer === "All") return SUPPLY_CHAIN;
    return SUPPLY_CHAIN.filter((r) => r.layer === layer);
  }, [layer]);

  const hbmShare = useMemo(
    () =>
      HBM_SUPPLIERS.map((r) => ({
        name: r.entity,
        value: r.value,
        fill: BOTTLENECK_COLORS.hbm,
      })),
    [],
  );

  const cowosTrend = useMemo(
    () =>
      COWOS_CAPACITY.filter((r) => r.metric.includes("capacity") && !r.metric.includes("CAGR"))
        .sort((a, b) => a.year - b.year)
        .map((r) => ({
          year: String(r.year),
          wpm: r.value / 1000,
          label: fmtWpm(r.value),
        })),
    [],
  );

  const demandTrend = useMemo(
    () =>
      SUPPLY_CHAIN.filter((r) => r.id.startsWith("cowos-demand-"))
        .sort((a, b) => a.year - b.year)
        .map((r) => ({
          year: String(r.year),
          wafers: r.value / 1000,
          label: fmtWafers(r.value),
        })),
    [],
  );

  const customerAlloc2025 = useMemo(
    () =>
      CUSTOMER_DEMAND.filter(
        (r) => r.year === 2025 && r.metric.includes("allocation") && r.unit === "wafers/yr",
      )
        .sort((a, b) => b.value - a.value)
        .map((r) => ({
          name: r.entity,
          wafers: r.value / 1000,
          fill: BOTTLENECK_COLORS.demand,
        })),
    [],
  );

  const selectClass =
    "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200";

  return (
    <div className="site-content w-full min-w-0 space-y-6" data-viz="ai-packaging-bottleneck">
      <p className="text-sm text-slate-400">
        {STATS.recordCount} sourced supply-chain records · {DATA_YEAR} primary · HBM + CoWoS packaging
        bottleneck · {SOURCE_NOTE}
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "HBM market 2025",
            value: STATS.hbmMarketLabel,
            sub: "+156% YoY from 2024",
            color: BOTTLENECK_COLORS.hbm,
          },
          {
            label: "CoWoS capacity",
            value: STATS.cowosCapacityLabel,
            sub: "TSMC end-2025 target",
            color: BOTTLENECK_COLORS.cowos,
          },
          {
            label: "CoWoS demand",
            value: STATS.cowosDemandLabel,
            sub: "Global wafer demand 2025",
            color: CHART_COLORS.danger,
          },
          {
            label: "SK hynix HBM share",
            value: STATS.skHynixShareLabel,
            sub: "Sold out through 2025",
            color: CHART_COLORS.success,
          },
          {
            label: "CoWoS lead time",
            value: STATS.cowosLeadTimeLabel,
            sub: `NVIDIA ~${STATS.nvidiaCowosShareLabel} of TSMC slots`,
            color: CHART_COLORS.warning,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            style={{ borderLeft: `4px solid ${s.color}` }}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="mt-1 text-sm text-slate-600">{s.sub}</p>
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="pack-layer" className="mb-1 block text-sm font-medium text-slate-700">
          Supply-chain layer
        </label>
        <select
          id="pack-layer"
          value={layer}
          onChange={(e) => setLayer(e.target.value as LayerFilter)}
          className={`${selectClass} min-w-[200px]`}
        >
          {LAYERS.map((l) => (
            <option key={l} value={l}>
              {l === "All" ? "All layers" : LAYER_LABELS[l]}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-slate-500" id="pack-record-count">
        Showing {filtered.length} of {STATS.recordCount} records
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="HBM supplier market share" subtitle="Revenue-based · TrendForce Aug 2025">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={hbmShare}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={2}
              >
                {hbmShare.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={[BOTTLENECK_COLORS.hbm, "#6366f1", "#22c55e"][i % 3]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [fmtPct(Number(value ?? 0)), "Share"]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="CoWoS capacity ramp" subtitle="TSMC wpm · end-year targets">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cowosTrend} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}K`} />
              <Tooltip formatter={(v) => [`${Number(v ?? 0).toFixed(0)}K wpm`, "Capacity"]} />
              <Bar dataKey="wpm" fill={BOTTLENECK_COLORS.cowos} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="CoWoS wafer demand vs capacity gap" subtitle="Demand growth outpaces wpm doubling">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={demandTrend} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}K`} />
              <Tooltip formatter={(v) => [`${Number(v ?? 0).toFixed(0)}K wafers/yr`, "Demand"]} />
              <Line
                type="monotone"
                dataKey="wafers"
                stroke={CHART_COLORS.danger}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="2025 CoWoS customer allocation" subtitle="Wafer starts per year · top hyperscaler & GPU buyers">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={customerAlloc2025}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}K`} />
              <YAxis type="category" dataKey="name" width={72} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => [`${Number(v ?? 0).toFixed(0)}K wafers/yr`, "Allocation"]} />
              <Bar dataKey="wafers" fill={BOTTLENECK_COLORS.demand} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full min-w-[960px] table-fixed text-[11px]">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50">
              <tr>
                {["Entity", "Layer", "Metric", "Year", "Value", "Status", "Source"].map((h) => (
                  <th
                    key={h}
                    className="whitespace-normal break-words px-2 py-2 text-left text-[10px] font-semibold text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="odd:bg-white even:bg-slate-50/50 hover:bg-cyan-50/30">
                  <td className="whitespace-normal break-words px-2 py-2 font-semibold text-slate-900">
                    {r.entity}
                  </td>
                  <td className="px-2 py-2">
                    <span
                      className="inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold text-white"
                      style={{ backgroundColor: BOTTLENECK_COLORS[r.layer] }}
                    >
                      {LAYER_LABELS[r.layer]}
                    </span>
                  </td>
                  <td className="whitespace-normal break-words px-2 py-2 text-slate-700">
                    {r.metric}
                    {r.product && (
                      <span className="mt-0.5 block text-[10px] text-slate-400">{r.product}</span>
                    )}
                  </td>
                  <td className="px-2 py-2 text-slate-600">{r.year}</td>
                  <td className="whitespace-normal break-words px-2 py-2 font-medium text-slate-800">
                    {fmtValue(r)}
                    {r.notes && (
                      <span className="mt-0.5 block text-[10px] font-normal text-slate-400">
                        {r.notes}
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="whitespace-normal break-words px-2 py-2 text-slate-500">{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <details className="rounded border border-sky-200 bg-sky-50 text-xs text-sky-900">
        <summary className="cursor-pointer px-3 py-2 font-semibold text-sky-800">
          Methodology &amp; context
        </summary>
        <div className="space-y-2 border-t border-sky-200 px-3 py-2 leading-relaxed text-sky-800">
          <p>
            <strong>HBM:</strong> High Bandwidth Memory stacked beside GPU logic dies. Market sizing and
            supplier share from TrendForce (Aug 2025). SK hynix leads at {fmtPct(GLOBAL_SUMMARY.skHynixHbmSharePct2025)}.
          </p>
          <p>
            <strong>CoWoS:</strong> TSMC Chip-on-Wafer-on-Substrate — the dominant 2.5D packaging path for
            NVIDIA Blackwell, AMD MI300, and Google TPU. Capacity in wafer starts per month (wpm); annualized
            demand in wafers/year from Silicon Analysts.
          </p>
          <p>
            <strong>OSAT:</strong> Amkor and SPIL/ASE absorb outsourced CoWoS-S volume as TSMC prioritizes
            CoWoS-L for NVIDIA. Figures trace to GlobalSemiResearch sell-side models.
          </p>
          <p>
            <strong>Counter-narrative:</strong> Leading-edge fab output is tight but predictable; packaging
            and HBM require specialized bays, TSV stacking, and substrate supply chains that cannot scale in
            12 months — making them the binding constraint on AI GPU shipments in 2025–2026.
          </p>
        </div>
      </details>

      <p className="text-center text-xs text-slate-400">
        TrendForce · TSMC · SK hynix · Silicon Analysts · GlobalSemiResearch · {DATA_YEAR}–2026
      </p>
    </div>
  );
}
