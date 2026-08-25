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
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  HEADLINE,
  NATIONAL_PATH,
  REGIONS,
  SOURCE_NOTE,
  STATE_SPOTLIGHTS,
  croplandPasturePremium,
  croplandPastureRatio,
  fiveYearCroplandCagr,
  fiveYearPastureCagr,
  fmtPct,
  fmtUsd,
  pastureMinusCroplandYoy,
  type RegionId,
  type RegionRow,
} from "@/data/us-farmland-values-usda-nass-2026-data";

// viz-types: dual-axis composed path, regional YoY grouped bars, cropland×pasture scatter,
// premium horizontal bars, lead-share pie, state ladder | layout: default

type ViewId =
  | "nationalPath"
  | "regionalYoy"
  | "growthScatter"
  | "premiumLadder"
  | "leadShare"
  | "stateLadder";

type SortKey = "croplandYoy" | "pastureYoy" | "premium" | "croplandLevel";
type LeadFilter = "all" | "pastureLed" | "croplandLed" | "tied";

const NAVY = "#0f172a";
const AMBER = "#d97706";
const TEAL = "#0f766e";
const ROSE = "#be123c";
const SLATE = "#64748b";
const SKY = "#0284c7";
const LIME = "#65a30d";

const VIEW_OPTIONS: { id: ViewId; label: string }[] = [
  { id: "nationalPath", label: "National path" },
  { id: "regionalYoy", label: "Regional YoY" },
  { id: "growthScatter", label: "Growth scatter" },
  { id: "premiumLadder", label: "Crop–pasture gap" },
  { id: "leadShare", label: "Who leads" },
  { id: "stateLadder", label: "State leaders" },
];

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "pastureYoy", label: "Pasture YoY" },
  { id: "croplandYoy", label: "Cropland YoY" },
  { id: "premium", label: "Crop−pasture $" },
  { id: "croplandLevel", label: "Cropland level" },
];

const LEAD_OPTIONS: { id: LeadFilter; label: string }[] = [
  { id: "all", label: "All regions" },
  { id: "pastureLed", label: "Pasture led" },
  { id: "croplandLed", label: "Cropland led" },
  { id: "tied", label: "Near-tied" },
];

function leadBucket(r: RegionRow): Exclude<LeadFilter, "all"> {
  const d = pastureMinusCroplandYoy(r);
  if (d > 0.4) return "pastureLed";
  if (d < -0.4) return "croplandLed";
  return "tied";
}

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
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
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

function shortRegion(r: RegionId): string {
  const map: Record<RegionId, string> = {
    Northeast: "NE",
    "Lake States": "Lake",
    "Corn Belt": "Corn",
    "Northern Plains": "N.Plains",
    Appalachian: "App",
    Southeast: "SE",
    "Delta States": "Delta",
    "Southern Plains": "S.Plains",
    Mountain: "Mtn",
    Pacific: "Pac",
  };
  return map[r];
}

export function UsFarmlandValuesUsdaNass2026Dashboard() {
  const [view, setView] = useState<ViewId>("nationalPath");
  const [sortKey, setSortKey] = useState<SortKey>("pastureYoy");
  const [leadFilter, setLeadFilter] = useState<LeadFilter>("all");

  const filteredRegions = useMemo(() => {
    let rows = [...REGIONS];
    if (leadFilter !== "all") {
      rows = rows.filter((r) => leadBucket(r) === leadFilter);
    }
    rows.sort((a, b) => {
      if (sortKey === "croplandYoy") return b.croplandYoyPct - a.croplandYoyPct;
      if (sortKey === "pastureYoy") return b.pastureYoyPct - a.pastureYoyPct;
      if (sortKey === "premium")
        return croplandPasturePremium(b) - croplandPasturePremium(a);
      return b.cropland2025 - a.cropland2025;
    });
    return rows;
  }, [sortKey, leadFilter]);

  const pathData = useMemo(
    () =>
      NATIONAL_PATH.map((r) => ({
        ...r,
        croplandIndex: (r.croplandUsd / NATIONAL_PATH[0].croplandUsd) * 100,
        pastureIndex: (r.pastureUsd / NATIONAL_PATH[0].pastureUsd) * 100,
        nfiIndex: (r.nfiBillionUsd / NATIONAL_PATH[0].nfiBillionUsd) * 100,
      })),
    [],
  );

  const scatterData = useMemo(
    () =>
      filteredRegions.map((r) => ({
        region: r.region,
        short: shortRegion(r.region),
        croplandYoy: r.croplandYoyPct,
        pastureYoy: r.pastureYoyPct,
        premium: croplandPasturePremium(r),
        cropLevel: r.cropland2025,
        lead: leadBucket(r),
      })),
    [filteredRegions],
  );

  const premiumData = useMemo(
    () =>
      filteredRegions.map((r) => ({
        region: shortRegion(r.region),
        full: r.region,
        premium: croplandPasturePremium(r),
        ratio: Number(croplandPastureRatio(r).toFixed(2)),
        cropCagr: Number(fiveYearCroplandCagr(r).toFixed(1)),
        pastCagr: Number(fiveYearPastureCagr(r).toFixed(1)),
      })),
    [filteredRegions],
  );

  const leadPie = useMemo(() => {
    const counts = { pastureLed: 0, croplandLed: 0, tied: 0 };
    for (const r of REGIONS) counts[leadBucket(r)] += 1;
    return [
      { name: "Pasture YoY ahead", value: counts.pastureLed, fill: LIME },
      { name: "Cropland YoY ahead", value: counts.croplandLed, fill: TEAL },
      { name: "Near-tied (±0.4 pp)", value: counts.tied, fill: SLATE },
    ];
  }, []);

  const stateData = useMemo(() => {
    const rows = [...STATE_SPOTLIGHTS].filter((s) => s.yoyPct > 0);
    rows.sort((a, b) => b.yoyPct - a.yoyPct);
    return rows.map((s) => ({
      label: `${s.state} (${s.landType === "cropland" ? "crop" : "past"})`,
      yoy: s.yoyPct,
      value: s.value2025,
      landType: s.landType,
      fill: s.landType === "cropland" ? TEAL : LIME,
    }));
  }, []);

  return (
    <div
      className="space-y-4"
      data-viz="us-farmland-values-usda-nass-2026"
      data-smoke="farmland-nass-regional"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-4 text-white sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-200/90">
          USDA NASS Land Values · regional cropland & pasture
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-100 sm:text-base">
          U.S. cropland averaged{" "}
          <span className="font-semibold text-white">
            {fmtUsd(HEADLINE.usCropland2025)}
          </span>{" "}
          per acre in 2025 ({fmtPct(HEADLINE.usCroplandYoyPct)}); pasture{" "}
          <span className="font-semibold text-white">
            {fmtUsd(HEADLINE.usPasture2025)}
          </span>{" "}
          ({fmtPct(HEADLINE.usPastureYoyPct)}). Fastest regional moves:{" "}
          <span className="font-semibold text-amber-300">
            {HEADLINE.fastestPastureRegion} pasture {fmtPct(HEADLINE.fastestPastureYoyPct)}
          </span>
          ;{" "}
          <span className="font-semibold text-teal-200">
            {HEADLINE.fastestCroplandRegion} cropland{" "}
            {fmtPct(HEADLINE.fastestCroplandYoyPct)}
          </span>
          .
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
        <ToggleGroup label="Panel" value={view} options={VIEW_OPTIONS} onChange={setView} />
        <ToggleGroup
          label="Sort regions"
          value={sortKey}
          options={SORT_OPTIONS}
          onChange={setSortKey}
        />
        <ToggleGroup
          label="YoY lead filter"
          value={leadFilter}
          options={LEAD_OPTIONS}
          onChange={setLeadFilter}
        />
      </div>

      {view === "nationalPath" ? (
        <ChartCard
          title="National cropland & pasture vs farm income and loan rates"
          subtitle="Indexed land values (2015=100) with net farm income index and farm loan rate (%)"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={pathData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="idx"
                  tick={{ fontSize: 11 }}
                  label={{ value: "Index", angle: -90, position: "insideLeft", fontSize: 11 }}
                />
                <YAxis
                  yAxisId="rate"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  domain={[0, 10]}
                  label={{ value: "Loan rate %", angle: 90, position: "insideRight", fontSize: 11 }}
                />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="idx"
                  type="monotone"
                  dataKey="croplandIndex"
                  name="Cropland index"
                  fill={TEAL}
                  fillOpacity={0.15}
                  stroke={TEAL}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="idx"
                  type="monotone"
                  dataKey="pastureIndex"
                  name="Pasture index"
                  stroke={LIME}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="idx"
                  type="monotone"
                  dataKey="nfiIndex"
                  name="NFI index"
                  stroke={AMBER}
                  strokeWidth={2}
                  strokeDasharray="4 3"
                  dot={false}
                />
                <Bar
                  yAxisId="rate"
                  dataKey="farmLoanRatePct"
                  name="Farm loan rate %"
                  fill={ROSE}
                  opacity={0.45}
                  barSize={18}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Land values kept rising through 2023–24 even as NFI cooled and loan rates jumped —
            a divergence the regional panels unpack.
          </p>
        </ChartCard>
      ) : null}

      {view === "regionalYoy" ? (
        <ChartCard
          title="2024→2025 regional YoY: cropland vs pasture"
          subtitle="Grouped bars — Northern Plains pasture and Lake States cropland lead"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredRegions.map((r) => ({
                  region: shortRegion(r.region),
                  full: r.region,
                  cropland: r.croplandYoyPct,
                  pasture: r.pastureYoyPct,
                }))}
                margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  label={{ value: "YoY %", angle: -90, position: "insideLeft", fontSize: 11 }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="cropland" name="Cropland YoY" fill={TEAL} radius={[3, 3, 0, 0]} />
                <Bar dataKey="pasture" name="Pasture YoY" fill={LIME} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "growthScatter" ? (
        <ChartCard
          title="Cropland YoY vs pasture YoY by region"
          subtitle="Above the diagonal: pasture appreciated faster than cropland in 2025"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="croplandYoy"
                  name="Cropland YoY"
                  tick={{ fontSize: 11 }}
                  unit="%"
                  domain={[1, 8]}
                  label={{ value: "Cropland YoY %", position: "insideBottom", offset: -2, fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="pastureYoy"
                  name="Pasture YoY"
                  tick={{ fontSize: 11 }}
                  unit="%"
                  domain={[1, 9]}
                  label={{ value: "Pasture YoY %", angle: -90, position: "insideLeft", fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="cropLevel" range={[60, 220]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <ReferenceLine
                  segment={[
                    { x: 1, y: 1 },
                    { x: 8, y: 8 },
                  ]}
                  stroke={SLATE}
                  strokeDasharray="4 4"
                />
                <Scatter name="Regions" data={scatterData}>
                  {scatterData.map((d) => (
                    <Cell
                      key={d.region}
                      fill={
                        d.lead === "pastureLed"
                          ? LIME
                          : d.lead === "croplandLed"
                            ? TEAL
                            : SLATE
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Bubble size scales with 2025 cropland $/acre. Northern Plains sits high on pasture
            YoY; Lake States sits far right on cropland YoY.
          </p>
        </ChartCard>
      ) : null}

      {view === "premiumLadder" ? (
        <ChartCard
          title="Cropland minus pasture premium ($/acre)"
          subtitle="Pacific and Corn Belt show the widest crop–pasture gaps; Southeast nearly flat"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={premiumData}
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                <YAxis type="category" dataKey="region" width={56} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="premium" name="Crop − pasture $" radius={[0, 4, 4, 0]}>
                  {premiumData.map((d) => (
                    <Cell key={d.full} fill={d.premium > 4000 ? NAVY : d.premium > 2000 ? TEAL : SKY} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "leadShare" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Who led on 2025 YoY?"
            subtitle="Count of NASS regions where pasture or cropland rose faster"
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {leadPie.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="2021→2025 CAGR by land type"
            subtitle="Compound annual growth from NASS regional 2021 and 2025 levels"
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={REGIONS.map((r) => ({
                    region: shortRegion(r.region),
                    cropland: Number(fiveYearCroplandCagr(r).toFixed(1)),
                    pasture: Number(fiveYearPastureCagr(r).toFixed(1)),
                  }))}
                  margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="region" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cropland" name="Crop CAGR" fill={TEAL} />
                  <Bar dataKey="pasture" name="Pasture CAGR" fill={LIME} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {view === "stateLadder" ? (
        <ChartCard
          title="State growth leaders (disclosed YoY)"
          subtitle="Utah cropland and North Dakota pasture topped the 2025 state tapes"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={stateData}
                margin={{ top: 4, right: 20, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="label" width={130} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="yoy" name="YoY %" radius={[0, 4, 4, 0]}>
                  {stateData.map((d) => (
                    <Cell key={d.label} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
