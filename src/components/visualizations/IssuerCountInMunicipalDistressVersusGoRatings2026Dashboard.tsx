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
  ANNUAL_SERIES,
  CUMULATIVE_PATH,
  ERA_COMPARE,
  EVENT_MIX,
  HEADLINE,
  SCATTER_POINTS,
  SECTOR_MIX,
  SOURCE_NOTE,
  filterAnnualByEra,
  filterSectorByPledge,
  ratioSeries,
  type EraFilter,
  type MetricMode,
  type PledgeFilter,
} from "@/data/issuer-count-in-municipal-distress-versus-go-ratings-2026-data";

// smoke-marker: Defaulted issuers vs IG-to-junk GOs

type Panel =
  | "dual-track"
  | "sector-wedge"
  | "cum-path"
  | "scatter-gap"
  | "event-split"
  | "era-ratio";

const PANEL_META: Record<Panel, { title: string; subtitle: string }> = {
  "dual-track": {
    title: "Annual unique issuers — distress vs GO IG→junk",
    subtitle: `${HEADLINE.distressIssuers2015_2025} distress vs ${HEADLINE.goIgToJunk2015_2025} GO junk crossings (2015–2025)`,
  },
  "sector-wedge": {
    title: "Where distress issuers sit by pledge family",
    subtitle: `Housing + healthcare = ${HEADLINE.housingHealthcareSharePct}% of distress names; GO = ${HEADLINE.goDistressSharePct}%`,
  },
  "cum-path": {
    title: "Cumulative issuer path — two clocks",
    subtitle: `Ratio settles near ${HEADLINE.distressPerGoJunk}× distress per GO IG→junk crossing`,
  },
  "scatter-gap": {
    title: "Year dots — distress count vs GO junk count",
    subtitle: "Bubble size ≈ payment-default share of that year’s distress set",
  },
  "event-split": {
    title: "Distress event mix — payment vs exchange",
    subtitle: "Most unique issuers are payment-only; exchanges are the minority path",
  },
  "era-ratio": {
    title: "Era blocks — ratio stability",
    subtitle: "Pre-2020 and post-2020 both clear 5×; the gap is structural, not a single vintage",
  },
};

const PANEL_BTNS: { id: Panel; label: string }[] = [
  { id: "dual-track", label: "Dual track" },
  { id: "sector-wedge", label: "Sector mix" },
  { id: "cum-path", label: "Cumulative" },
  { id: "scatter-gap", label: "Scatter gap" },
  { id: "event-split", label: "Event split" },
  { id: "era-ratio", label: "Era ratio" },
];

const ERA_OPTS: { id: EraFilter; label: string }[] = [
  { id: "all", label: "2015–2025" },
  { id: "pre2020", label: "Pre-2020" },
  { id: "post2020", label: "2020–2025" },
];

const METRIC_OPTS: { id: MetricMode; label: string }[] = [
  { id: "issuers", label: "Issuer counts" },
  { id: "ratio", label: "Distress / junk" },
  { id: "share", label: "Payment share" },
];

const PLEDGE_OPTS: { id: PledgeFilter; label: string }[] = [
  { id: "all", label: "All pledges" },
  { id: "enterprise", label: "Enterprise" },
  { id: "go", label: "GO only" },
  { id: "appropriation", label: "Appropriation" },
];

const tipStyle = {
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: 8,
  fontSize: 12,
};

export function IssuerCountInMunicipalDistressVersusGoRatings2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("dual-track");
  const [era, setEra] = useState<EraFilter>("all");
  const [metric, setMetric] = useState<MetricMode>("issuers");
  const [pledge, setPledge] = useState<PledgeFilter>("all");

  const annual = useMemo(() => filterAnnualByEra(era), [era]);
  const sectors = useMemo(() => filterSectorByPledge(pledge), [pledge]);
  const ratios = useMemo(() => ratioSeries(era), [era]);
  const cum = useMemo(() => {
    if (era === "all") return CUMULATIVE_PATH;
    const years = new Set(annual.map((r) => r.year));
    return CUMULATIVE_PATH.filter((r) => years.has(r.year));
  }, [era, annual]);
  const scatter = useMemo(() => {
    const years = new Set(annual.map((r) => r.year));
    return SCATTER_POINTS.filter((p) => years.has(p.year));
  }, [annual]);

  const dualData = useMemo(() => {
    if (metric === "ratio") {
      return ratios.map((r) => ({
        year: r.year,
        ratio: r.ratio,
        distressUnique: r.distressUnique,
        goIgToJunk: r.goIgToJunk,
      }));
    }
    if (metric === "share") {
      return annual.map((r) => ({
        year: r.year,
        paymentShare:
          r.distressUnique === 0
            ? 0
            : Math.round((100 * r.paymentDefault) / r.distressUnique),
        exchangeShare:
          r.distressUnique === 0
            ? 0
            : Math.round((100 * r.distressedExchange) / r.distressUnique),
        distressUnique: r.distressUnique,
        goIgToJunk: r.goIgToJunk,
      }));
    }
    return annual.map((r) => ({
      year: r.year,
      distressUnique: r.distressUnique,
      goIgToJunk: r.goIgToJunk,
      paymentDefault: r.paymentDefault,
      distressedExchange: r.distressedExchange,
    }));
  }, [annual, metric, ratios]) as Record<string, number>[];

  const meta = PANEL_META[panel];

  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950 text-slate-100 shadow-sm"
      data-viz="issuer-count-in-municipal-distress-versus-go-ratings-2026"
    >
      <div className="border-b border-slate-800 px-4 py-3 sm:px-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-cyan-400/90">
          {ANALYTICS.categoryLabel} · {ANALYTICS.smokeMarker}
        </p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl">
          {meta.title}
        </h3>
        <p className="mt-0.5 text-sm text-slate-400">{meta.subtitle}</p>
        <p className="mt-2 text-xs text-emerald-300/90">
          Headline: {HEADLINE.distressPerGoJunk}× distress issuers per GO
          IG→junk crossing ({HEADLINE.distressIssuers2015_2025} vs{" "}
          {HEADLINE.goIgToJunk2015_2025}, 2015–2025)
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-800 px-4 py-2.5 sm:px-5">
        {PANEL_BTNS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setPanel(b.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              panel === b.id
                ? "bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/40"
                : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 border-b border-slate-800 px-4 py-2.5 sm:px-5">
        <label className="flex items-center gap-1.5 text-xs text-slate-400">
          Era
          <select
            value={era}
            onChange={(e) => setEra(e.target.value as EraFilter)}
            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-200"
          >
            {ERA_OPTS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1.5 text-xs text-slate-400">
          Metric
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as MetricMode)}
            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-200"
          >
            {METRIC_OPTS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1.5 text-xs text-slate-400">
          Pledge
          <select
            value={pledge}
            onChange={(e) => setPledge(e.target.value as PledgeFilter)}
            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-200"
          >
            {PLEDGE_OPTS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="h-[380px] w-full px-2 py-3 sm:px-4">
        <ResponsiveContainer width="100%" height="100%">
          {panel === "dual-track" && metric === "ratio" ? (
            <ComposedChart data={dualData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tipStyle} />
              <Legend />
              <Bar
                dataKey="ratio"
                name="Distress / GO junk"
                fill="#22d3ee"
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="distressUnique"
                name="Distress issuers"
                stroke="#f87171"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          ) : panel === "dual-track" && metric === "share" ? (
            <AreaChart data={dualData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
              <Tooltip contentStyle={tipStyle} />
              <Legend />
              <Area
                type="monotone"
                dataKey="paymentShare"
                name="Payment share %"
                stackId="1"
                stroke="#f87171"
                fill="#f87171"
                fillOpacity={0.55}
              />
              <Area
                type="monotone"
                dataKey="exchangeShare"
                name="Exchange share %"
                stackId="1"
                stroke="#c084fc"
                fill="#c084fc"
                fillOpacity={0.45}
              />
            </AreaChart>
          ) : panel === "dual-track" ? (
            <ComposedChart data={dualData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tipStyle} />
              <Legend />
              <Bar
                dataKey="distressUnique"
                name="Distress issuers"
                fill="#f87171"
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="goIgToJunk"
                name="GO IG→junk"
                stroke="#34d399"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          ) : panel === "sector-wedge" ? (
            <BarChart
              data={sectors}
              layout="vertical"
              margin={{ left: 16, right: 12 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="short"
                width={88}
                stroke="#64748b"
                tick={{ fontSize: 11 }}
              />
              <Tooltip contentStyle={tipStyle} />
              <Bar dataKey="issuers" name="Distress issuers" radius={[0, 4, 4, 0]}>
                {sectors.map((s) => (
                  <Cell key={s.id} fill={s.color} />
                ))}
              </Bar>
            </BarChart>
          ) : panel === "cum-path" ? (
            <ComposedChart data={cum}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="left"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
              />
              <Tooltip contentStyle={tipStyle} />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="distressCumulative"
                name="Cum. distress"
                stroke="#f87171"
                fill="#f87171"
                fillOpacity={0.25}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="goJunkCumulative"
                name="Cum. GO junk"
                stroke="#34d399"
                fill="#34d399"
                fillOpacity={0.2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="ratio"
                name="Running ratio"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          ) : panel === "scatter-gap" ? (
            <ScatterChart margin={{ left: 8, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                type="number"
                dataKey="goIgToJunk"
                name="GO IG→junk"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                domain={[0, "dataMax + 1"]}
                label={{
                  value: "GO IG→junk issuers",
                  position: "insideBottom",
                  offset: -2,
                  fill: "#64748b",
                  fontSize: 11,
                }}
              />
              <YAxis
                type="number"
                dataKey="distressUnique"
                name="Distress"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                label={{
                  value: "Distress issuers",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#64748b",
                  fontSize: 11,
                }}
              />
              <ZAxis
                type="number"
                dataKey="paymentSharePct"
                range={[60, 280]}
              />
              <Tooltip
                contentStyle={tipStyle}
                cursor={{ strokeDasharray: "3 3" }}
              />
              <Scatter name="Year" data={scatter} fill="#22d3ee">
                {scatter.map((p) => (
                  <Cell
                    key={p.year}
                    fill={p.year >= 2020 ? "#fbbf24" : "#22d3ee"}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          ) : panel === "event-split" ? (
            <BarChart data={EVENT_MIX}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="type" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tipStyle} />
              <Bar dataKey="issuers" name="Unique issuers" radius={[4, 4, 0, 0]}>
                {EVENT_MIX.map((e) => (
                  <Cell key={e.type} fill={e.color} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <ComposedChart data={ERA_COMPARE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="era" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="left"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
              />
              <Tooltip contentStyle={tipStyle} />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="distressIssuers"
                name="Distress issuers"
                fill="#f87171"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="goIgToJunk"
                name="GO IG→junk"
                fill="#34d399"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="ratio"
                name="Ratio"
                stroke="#22d3ee"
                strokeWidth={2.5}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="border-t border-slate-800 px-4 py-2.5 sm:px-5">
        <p className="text-[10px] leading-relaxed text-slate-500">
          {SOURCE_NOTE} Series length: {ANNUAL_SERIES.length} years; sector rows:{" "}
          {SECTOR_MIX.length}.
        </p>
      </div>
    </div>
  );
}
