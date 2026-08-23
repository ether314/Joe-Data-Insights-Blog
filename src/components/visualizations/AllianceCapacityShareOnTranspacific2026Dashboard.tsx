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
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ALLIANCE_SHARES,
  ANALYTICS,
  CARRIER_LADDER,
  COAST_SPLIT,
  CONCENTRATION_PATH,
  FLEET_CONTEXT,
  HEADLINE,
  SOURCE_NOTE,
  VIZ_MARKERS,
  allianceSharesForVintage,
  type AllianceShareRow,
} from "@/data/alliance-capacity-share-on-transpacific-2026-data";

type Panel = "ladder" | "coast" | "carriers" | "path" | "fleet";
type Vintage = AllianceShareRow["vintage"];
type CarrierSort = "share" | "yoy" | "teu";

const COLORS = {
  ocean: "#0ea5e9",
  premier: "#2563eb",
  gemini: "#059669",
  msc: "#d97706",
  other: "#94a3b8",
  the_alliance: "#7c3aed",
  two_m: "#dc2626",
  accent: "#0f766e",
  muted: "#64748b",
  up: "#059669",
  down: "#dc2626",
};

const ALLIANCE_COLOR: Record<string, string> = {
  ocean: COLORS.ocean,
  premier: COLORS.premier,
  gemini: COLORS.gemini,
  msc: COLORS.msc,
  other: COLORS.other,
  the_alliance: COLORS.the_alliance,
  two_m: COLORS.two_m,
  independent: COLORS.other,
};

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
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function fmtTeu(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

export function AllianceCapacityShareOnTranspacific2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("ladder");
  const [vintage, setVintage] = useState<Vintage>("2026-01");
  const [carrierSort, setCarrierSort] = useState<CarrierSort>("share");

  const allianceRows = useMemo(
    () =>
      [...allianceSharesForVintage(vintage)].sort(
        (a, b) => b.sharePct - a.sharePct,
      ),
    [vintage],
  );

  const pieData = useMemo(
    () =>
      allianceRows.map((r) => ({
        name: r.label,
        value: r.sharePct,
        teu: r.teu,
        fill: ALLIANCE_COLOR[r.id] ?? COLORS.muted,
      })),
    [allianceRows],
  );

  const coastChart = useMemo(
    () =>
      COAST_SPLIT.map((c) => ({
        coast: c.label.replace("Asia → ", ""),
        Ocean: c.oceanPct,
        Premier: c.premierPct,
        Gemini: c.geminiPct,
        MSC: c.mscPct,
        Other: c.otherPct,
      })),
    [],
  );

  const carrierChart = useMemo(() => {
    const rows = [...CARRIER_LADDER].filter((c) => c.carrier !== "ZIM + other");
    rows.sort((a, b) => {
      if (carrierSort === "yoy") return b.yoyPct - a.yoyPct;
      if (carrierSort === "teu") return b.teu - a.teu;
      return b.sharePct - a.sharePct;
    });
    return rows.map((c) => ({
      name: c.carrier.replace(" Shipping Group", "").replace("-Lloyd", ""),
      sharePct: c.sharePct,
      yoyPct: c.yoyPct,
      teu: c.teu,
      fill: ALLIANCE_COLOR[c.allianceId] ?? COLORS.muted,
      alliance: c.alliance,
    }));
  }, [carrierSort]);

  const scatterData = useMemo(
    () =>
      CARRIER_LADDER.filter((c) => c.carrier !== "ZIM + other").map((c) => ({
        x: c.sharePct,
        y: c.yoyPct,
        z: Math.max(80, c.teu / 8_000),
        name: c.carrier.replace(" Shipping Group", ""),
        fill: ALLIANCE_COLOR[c.allianceId] ?? COLORS.muted,
      })),
    [],
  );

  const pathChart = useMemo(
    () =>
      CONCENTRATION_PATH.map((p) => ({
        label: p.label.split(" · ")[0],
        top1: p.top1Pct,
        top3: p.top3Pct,
        hhi: p.hhi / 100,
      })),
    [],
  );

  return (
    <div
      className="w-full space-y-4"
      data-viz="alliance-capacity-share-on-transpacific-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-4 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
          {VIZ_MARKERS[0]}
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Ocean Alliance {HEADLINE.oceanSharePct}% · top-3 alliances{" "}
          {HEADLINE.top3AlliancePct}%
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Alphaliner early-2026 Asia–NA deployed capacity: {HEADLINE.totalMteu}{" "}
          Mteu across {HEADLINE.shipCount} ships ({HEADLINE.yoyCapacityPct}%
          YoY). Gemini ≈{fmtTeu(HEADLINE.geminiTeu)} teu (
          {HEADLINE.geminiSharePct}%) — nearly identical to Maersk&apos;s old 2M
          offer. Three-alliance tip slipped only {Math.abs(ANALYTICS.top3DeltaPp)}{" "}
          pp vs Jan 2025.
        </p>
        <p className="mt-3 text-[11px] text-slate-400">
          Panels: {VIZ_MARKERS.slice(1).join(" · ")}
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="flex min-w-[10rem] flex-col gap-1 text-xs font-medium text-slate-600">
          Panel
          <select
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            value={panel}
            onChange={(e) => setPanel(e.target.value as Panel)}
          >
            <option value="ladder">Alliance ladder</option>
            <option value="coast">Coast split</option>
            <option value="carriers">Carrier YoY Δ</option>
            <option value="path">Concentration path</option>
            <option value="fleet">Fleet backdrop</option>
          </select>
        </label>
        <label className="flex min-w-[10rem] flex-col gap-1 text-xs font-medium text-slate-600">
          Vintage
          <select
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            value={vintage}
            onChange={(e) => setVintage(e.target.value as Vintage)}
          >
            <option value="2025-01">Jan 2025 · pre-reshuffle</option>
            <option value="2025-03">Mar 2025 · early Gemini</option>
            <option value="2026-01">Jan 2026 · Alphaliner</option>
          </select>
        </label>
        <label className="flex min-w-[10rem] flex-col gap-1 text-xs font-medium text-slate-600">
          Carrier sort
          <select
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            value={carrierSort}
            onChange={(e) => setCarrierSort(e.target.value as CarrierSort)}
            disabled={panel !== "carriers"}
          >
            <option value="share">By TEU share</option>
            <option value="yoy">By YoY %</option>
            <option value="teu">By absolute TEU</option>
          </select>
        </label>
      </div>

      {panel === "ladder" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title={VIZ_MARKERS[1]}
            subtitle={`Share of scheduled Asia–NA TEU · ${vintage}`}
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart
                  data={allianceRows}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" unit="%" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={110}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, p) => [
                      `${Number(v)}% · ${fmtTeu((p.payload as AllianceShareRow).teu)} teu`,
                      "Share",
                    ]}
                  />
                  <Bar dataKey="sharePct" radius={[0, 4, 4, 0]}>
                    {allianceRows.map((r) => (
                      <Cell
                        key={r.id + r.vintage}
                        fill={ALLIANCE_COLOR[r.id] ?? COLORS.muted}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Mix donut"
            subtitle="Same vintage · click legend to isolate"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, value }) =>
                      `${String(name).split(" ")[0]} ${value}%`
                    }
                  >
                    {pieData.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _n, p) => [
                      `${Number(v)}% (${fmtTeu((p.payload as { teu: number }).teu)} teu)`,
                      "Share",
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {panel === "coast" ? (
        <ChartCard
          title={VIZ_MARKERS[2]}
          subtitle="Sea-Intelligence-style coast lens (carried) — Ocean still leads both gates"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart
                data={coastChart}
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="coast" tick={{ fontSize: 12 }} />
                <YAxis unit="%" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Ocean" stackId="a" fill={COLORS.ocean} />
                <Bar dataKey="Premier" stackId="a" fill={COLORS.premier} />
                <Bar dataKey="Gemini" stackId="a" fill={COLORS.gemini} />
                <Bar dataKey="MSC" stackId="a" fill={COLORS.msc} />
                <Bar dataKey="Other" stackId="a" fill={COLORS.other} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "carriers" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title={VIZ_MARKERS[3]}
            subtitle={`Sorted by ${carrierSort} · color = alliance`}
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart
                  data={carrierChart}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    domain={
                      carrierSort === "yoy" ? ["dataMin - 5", "dataMax + 5"] : [0, "auto"]
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={88}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      String(name) === "yoyPct"
                        ? `${Number(v)}% YoY`
                        : String(name) === "sharePct"
                          ? `${Number(v)}%`
                          : fmtTeu(Number(v)),
                      String(name) === "yoyPct"
                        ? "YoY"
                        : String(name) === "sharePct"
                          ? "Share"
                          : "TEU",
                    ]}
                  />
                  <Bar
                    dataKey={
                      carrierSort === "yoy"
                        ? "yoyPct"
                        : carrierSort === "teu"
                          ? "teu"
                          : "sharePct"
                    }
                    radius={[0, 4, 4, 0]}
                  >
                    {carrierChart.map((r) => (
                      <Cell
                        key={r.name}
                        fill={
                          carrierSort === "yoy"
                            ? r.yoyPct >= 0
                              ? COLORS.up
                              : COLORS.down
                            : r.fill
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Share × YoY scatter"
            subtitle="Bubble size ≈ absolute TEU · Yang Ming −30% is pooling, not exit"
          >
            <div className="h-[360px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Share %"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "TEU share %",
                      position: "insideBottom",
                      offset: -4,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="YoY %"
                    unit="%"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "YoY %",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => [
                      `${Number(v)}${String(name) === "x" || String(name) === "y" ? "%" : ""}`,
                      String(name) === "x"
                        ? "Share"
                        : String(name) === "y"
                          ? "YoY"
                          : "Size",
                    ]}
                    labelFormatter={(_, payload) =>
                      (payload?.[0]?.payload as { name?: string })?.name ?? ""
                    }
                  />
                  <Scatter data={scatterData}>
                    {scatterData.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {panel === "path" ? (
        <ChartCard
          title={VIZ_MARKERS[4]}
          subtitle="Top-1 / top-3 alliance share and HHI/100 across the reshuffle"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <ComposedChart
                data={pathChart}
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  unit="%"
                  domain={[30, 80]}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[20, 30]}
                  tick={{ fontSize: 11 }}
                  label={{ value: "HHI/100", angle: 90, position: "insideRight", fontSize: 10 }}
                />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="top1" name="Top-1 %" fill={COLORS.ocean} />
                <Bar yAxisId="left" dataKey="top3" name="Top-3 %" fill={COLORS.premier} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="hhi"
                  name="HHI/100"
                  stroke={COLORS.accent}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "fleet" ? (
        <ChartCard
          title="UNCTAD-style fleet backdrop"
          subtitle="Global fleet index (2020=100) vs schedule reliability — context only, not the share ladder"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <ComposedChart
                data={FLEET_CONTEXT}
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  unit="%"
                  domain={[0, 80]}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="fleetIndex"
                  name="Fleet index"
                  fill={COLORS.ocean}
                  opacity={0.85}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="reliabilityPct"
                  name="Reliability %"
                  stroke={COLORS.gemini}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      {/* Keep ALLIANCE_SHARES referenced for tree-shake safety in QA imports */}
      <span className="hidden">{ALLIANCE_SHARES.length}</span>
    </div>
  );
}
