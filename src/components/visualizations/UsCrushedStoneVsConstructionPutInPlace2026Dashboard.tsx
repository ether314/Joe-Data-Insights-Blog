"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
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
  ANNUAL_PANEL,
  CRUSHED_USE_MIX,
  DIVISION_CRUSHED_2024,
  HEADLINE,
  INDEX_GAP,
  INTENSITY_PATH,
  SOURCE_NOTE,
  UNIT_VALUES,
} from "@/data/us-crushed-stone-vs-construction-put-in-place-2026-data";

type Panel =
  | "dual-index"
  | "intensity"
  | "division"
  | "use-mix"
  | "unit-scatter";

type IndexMode = "real" | "nominal" | "both";
type RegionFilter = "all" | "Northeast" | "Midwest" | "South" | "West";
type CommodityFocus = "total" | "crushed" | "sand";

const C = {
  crushed: "#b45309",
  sand: "#0f766e",
  aggregates: "#1e3a5f",
  realCip: "#2563eb",
  nominalCip: "#94a3b8",
  intensity: "#dc2626",
  gap: "#7c3aed",
  pie: ["#b45309", "#1e3a5f", "#0f766e", "#64748b", "#d97706"],
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
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        ) : null}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

export function UsCrushedStoneVsConstructionPutInPlace2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("dual-index");
  const [indexMode, setIndexMode] = useState<IndexMode>("real");
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all");
  const [commodityFocus, setCommodityFocus] =
    useState<CommodityFocus>("total");

  const indexSeries = useMemo(
    () =>
      ANNUAL_PANEL.map((r) => ({
        year: r.year,
        commodity:
          commodityFocus === "crushed"
            ? r.crushedIndex2019
            : commodityFocus === "sand"
              ? r.sandIndex2019
              : r.aggregatesIndex2019,
        realCip: r.realCipIndex2019,
        nominalCip: r.nominalCipIndex2019,
      })),
    [commodityFocus],
  );

  const divisionData = useMemo(
    () =>
      DIVISION_CRUSHED_2024.filter(
        (d) => regionFilter === "all" || d.region === regionFilter,
      ),
    [regionFilter],
  );

  const radarData = useMemo(() => {
    const regions: Exclude<RegionFilter, "all">[] = [
      "Northeast",
      "Midwest",
      "South",
      "West",
    ];
    return regions.map((region) => {
      const rows = DIVISION_CRUSHED_2024.filter((d) => d.region === region);
      const mt = rows.reduce((s, r) => s + r.crushed2024Mt, 0);
      const yoy =
        rows.reduce((s, r) => s + r.yoyPct * r.crushed2024Mt, 0) / (mt || 1);
      return {
        region,
        share:
          Math.round((mt / HEADLINE.crushedStone2024Mt) * 1000) / 10,
        yoyAbs: Math.round(Math.abs(yoy) * 10) / 10,
      };
    });
  }, []);

  const scatterData = useMemo(
    () =>
      UNIT_VALUES.map((u) => {
        const yr = ANNUAL_PANEL.find((a) => a.year === u.year);
        return {
          year: u.year,
          crushedPrice: u.crushedUsdPerMt,
          intensity: yr?.intensityMtPerRealBn ?? 0,
          crushedMt: yr?.crushedStoneMt ?? 0,
        };
      }),
    [],
  );

  const commodityLabel =
    commodityFocus === "crushed"
      ? "Crushed stone"
      : commodityFocus === "sand"
        ? "Sand & gravel"
        : "Total aggregates";

  return (
    <div
      className="w-full space-y-4"
      data-viz="us-crushed-stone-vs-construction-put-in-place-2026"
    >
      <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-slate-50 px-5 py-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-900">
          Headline — tonnage vs real CIP
        </p>
        <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          {HEADLINE.intensity2024} Mt per $B real CIP in 2024 — down from{" "}
          {HEADLINE.intensity2019} in 2019
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          USGS aggregates fell ~{Math.abs(HEADLINE.aggregatesYoYPct)}% in 2024
          (to {HEADLINE.totalAggregates2024Gt} Gt) while constructed real CIP
          still rose ~{HEADLINE.realCipVs2019Pct}% vs 2019. Nominal CIP is up ~
          {HEADLINE.nominalCipVs2019Pct}% — most of that is price, not tons.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["dual-index", "Tonnage vs CIP index"],
            ["intensity", "Intensity + gap"],
            ["division", "Division map"],
            ["use-mix", "Crushed-stone uses"],
            ["unit-scatter", "Price vs intensity"],
          ] as const
        ).map(([id, label]) => (
          <Chip key={id} active={panel === id} onClick={() => setPanel(id)}>
            {label}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Controls
        </span>
        {(panel === "dual-index" || panel === "intensity") && (
          <>
            <Chip
              active={commodityFocus === "total"}
              onClick={() => setCommodityFocus("total")}
            >
              Total aggregates
            </Chip>
            <Chip
              active={commodityFocus === "crushed"}
              onClick={() => setCommodityFocus("crushed")}
            >
              Crushed stone
            </Chip>
            <Chip
              active={commodityFocus === "sand"}
              onClick={() => setCommodityFocus("sand")}
            >
              Sand & gravel
            </Chip>
          </>
        )}
        {panel === "dual-index" && (
          <>
            <Chip
              active={indexMode === "real"}
              onClick={() => setIndexMode("real")}
            >
              Real CIP
            </Chip>
            <Chip
              active={indexMode === "nominal"}
              onClick={() => setIndexMode("nominal")}
            >
              Nominal CIP
            </Chip>
            <Chip
              active={indexMode === "both"}
              onClick={() => setIndexMode("both")}
            >
              Both CIP
            </Chip>
          </>
        )}
        {panel === "division" &&
          (["all", "Northeast", "Midwest", "South", "West"] as const).map(
            (r) => (
              <Chip
                key={r}
                active={regionFilter === r}
                onClick={() => setRegionFilter(r)}
              >
                {r === "all" ? "All regions" : r}
              </Chip>
            ),
          )}
      </div>

      {panel === "dual-index" ? (
        <ChartCard
          title={`${commodityLabel} vs construction put-in-place`}
          subtitle="Indexed to 2019 = 100. Toggle real vs nominal CIP — nominal alone invents a boom that tonnage never delivered."
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={indexSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis
                  domain={[75, 170]}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="commodity"
                  name={commodityLabel}
                  fill={C.aggregates}
                  fillOpacity={0.12}
                  stroke={C.aggregates}
                  strokeWidth={2.5}
                />
                {(indexMode === "real" || indexMode === "both") && (
                  <Line
                    type="monotone"
                    dataKey="realCip"
                    name="Real CIP (constructed)"
                    stroke={C.realCip}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                )}
                {(indexMode === "nominal" || indexMode === "both") && (
                  <Line
                    type="monotone"
                    dataKey="nominalCip"
                    name="Nominal CIP"
                    stroke={C.nominalCip}
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={{ r: 2 }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "intensity" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Aggregate intensity"
            subtitle="Million metric tons of aggregates per $1B of constructed real CIP"
          >
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={INTENSITY_PATH}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis
                    domain={[1.3, 1.9]}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="intensity"
                    name="Mt / $B real CIP"
                    fill={C.intensity}
                    fillOpacity={0.15}
                    stroke={C.intensity}
                    strokeWidth={2.5}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Index gap (real CIP − aggregates)"
            subtitle="Positive and rising means put-in-place outruns tonnage"
          >
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={INDEX_GAP}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip />
                  <Bar
                    dataKey="gapPts"
                    name="Gap (index pts)"
                    fill={C.gap}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {panel === "division" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Crushed stone by Census division (2024)"
            subtitle="MIS production-for-consumption estimates — filter by Census region"
          >
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={divisionData}
                  layout="vertical"
                  margin={{ left: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="division"
                    width={120}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="crushed2024Mt"
                    name="Mt"
                    fill={C.crushed}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Regional share vs |YoY| drop"
            subtitle="South still dominates tons; Midwest took sharper 2024 cuts"
          >
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="region"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <PolarRadiusAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <Radar
                    name="Share of US crushed (%)"
                    dataKey="share"
                    stroke={C.crushed}
                    fill={C.crushed}
                    fillOpacity={0.35}
                  />
                  <Radar
                    name="|YoY %|"
                    dataKey="yoyAbs"
                    stroke={C.realCip}
                    fill={C.realCip}
                    fillOpacity={0.2}
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {panel === "use-mix" ? (
        <ChartCard
          title="Where crushed stone goes (2024e MCS use mix)"
          subtitle="Only ~72% is construction aggregate — cement and lime claim a material share of the same quarry ledger"
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CRUSHED_USE_MIX}
                    dataKey="sharePct"
                    nameKey="use"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={(props) => {
                      const v = Number(
                        (props as { sharePct?: number }).sharePct ??
                          props.value ??
                          0,
                      );
                      return `${v}%`;
                    }}
                  >
                    {CRUSHED_USE_MIX.map((row, i) => (
                      <Cell
                        key={row.use}
                        fill={C.pie[i % C.pie.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-3 self-center text-sm text-slate-700">
              {CRUSHED_USE_MIX.map((u) => (
                <li
                  key={u.use}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <span className="font-semibold text-slate-900">
                    {u.sharePct}% — {u.use}
                  </span>
                  <p className="mt-0.5 text-slate-500">{u.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </ChartCard>
      ) : null}

      {panel === "unit-scatter" ? (
        <ChartCard
          title="Unit value vs intensity"
          subtitle="As quarry prices rose, Mt per real CIP dollar fell — dollars and tons diverged"
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 12, right: 12, bottom: 20, left: 12 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="crushedPrice"
                  name="Crushed $/t"
                  unit="$"
                  domain={[12, 19]}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  type="number"
                  dataKey="intensity"
                  name="Intensity"
                  domain={[1.4, 1.8]}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <ZAxis type="number" dataKey="crushedMt" range={[80, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => [
                    typeof value === "number" ? value.toFixed(2) : String(value),
                    String(name),
                  ]}
                />
                <Scatter
                  name="Year (bubble = crushed Mt)"
                  data={scatterData}
                  fill={C.crushed}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <p className="text-xs text-slate-500">{ANALYTICS.story}</p>
    </div>
  );
}
