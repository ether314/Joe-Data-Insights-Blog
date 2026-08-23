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
  CUMULATIVE_GAP,
  HEADLINE,
  METRO_LADDER,
  NATIONAL_ANNUAL,
  REGION_PERMITS,
  SOURCE_NOTE,
  STRUCTURE_MIX,
  type RegionId,
} from "@/data/us-housing-permits-vs-household-formation-2026-data";

type Panel =
  | "national-ratio"
  | "cumulative-gap"
  | "metro-ladder"
  | "metro-scatter"
  | "structure-mix"
  | "region-stack";

type SortMode = "ratio-asc" | "gap-desc" | "permits-desc";

const COLORS = {
  permits: "#1e3a5f",
  households: "#b45309",
  ratio: "#0f766e",
  gap: "#dc2626",
  surplus: "#15803d",
  sf: "#0369a1",
  mid: "#ca8a04",
  mf: "#7c3aed",
  ne: "#1e40af",
  mw: "#64748b",
  south: "#ea580c",
  west: "#0d9488",
  accent: "#c2410c",
};

const REGION_LABEL: Record<Exclude<RegionId, "all">, string> = {
  northeast: "Northeast",
  midwest: "Midwest",
  south: "South",
  west: "West",
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

function ratioColor(ratio: number): string {
  if (ratio < 0.7) return "#b91c1c";
  if (ratio < 1.0) return "#c2410c";
  if (ratio < HEADLINE.replacementBenchmarkRatio) return "#ca8a04";
  return "#15803d";
}

export function UsHousingPermitsVsHouseholdFormation2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("national-ratio");
  const [region, setRegion] = useState<RegionId>("all");
  const [sortMode, setSortMode] = useState<SortMode>("ratio-asc");
  const [yearFrom, setYearFrom] = useState<2015 | 2019>(2019);

  const nationalSlice = useMemo(
    () => NATIONAL_ANNUAL.filter((r) => r.year >= yearFrom),
    [yearFrom],
  );

  const gapSlice = useMemo(() => {
    if (yearFrom === 2019) return CUMULATIVE_GAP;
    let run = 0;
    return NATIONAL_ANNUAL.map((r) => {
      const annual = r.permitsThousands - r.householdGrowthThousands;
      run += annual;
      return {
        year: r.year,
        annualGapThousands: annual,
        cumulativeGapThousands: run,
      };
    });
  }, [yearFrom]);

  const metros = useMemo(() => {
    const filtered =
      region === "all"
        ? [...METRO_LADDER]
        : METRO_LADDER.filter((m) => m.region === region);
    return filtered.sort((a, b) => {
      if (sortMode === "ratio-asc") return a.ratio - b.ratio;
      if (sortMode === "permits-desc") return b.permitsThousands - a.permitsThousands;
      const gapA = a.householdGrowthThousands - a.permitsThousands;
      const gapB = b.householdGrowthThousands - b.permitsThousands;
      return gapB - gapA;
    });
  }, [region, sortMode]);

  const structureLatest = STRUCTURE_MIX[STRUCTURE_MIX.length - 1]!;
  const pieData = [
    { name: "1-unit", value: structureLatest.singleFamilyPct, fill: COLORS.sf },
    { name: "2–4 unit", value: structureLatest.twoToFourPct, fill: COLORS.mid },
    { name: "5+ unit", value: structureLatest.fivePlusPct, fill: COLORS.mf },
  ];

  const regionLatest = REGION_PERMITS[REGION_PERMITS.length - 1]!;

  const panels: { id: Panel; label: string }[] = [
    { id: "national-ratio", label: "National ratio" },
    { id: "cumulative-gap", label: "Cumulative gap" },
    { id: "metro-ladder", label: "Metro ladder" },
    { id: "metro-scatter", label: "Metro scatter" },
    { id: "structure-mix", label: "Structure mix" },
    { id: "region-stack", label: "Region stack" },
  ];

  return (
    <div
      className="w-full min-w-0 space-y-4"
      data-viz="us-housing-permits-vs-household-formation-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-amber-50/40 p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Permits per net household
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          {HEADLINE.permitsPerHousehold2024.toFixed(2)}{" "}
          <span className="text-lg font-semibold text-slate-600 sm:text-xl">
            units authorized per net new household (2024)
          </span>
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Census BPS authorized ~{HEADLINE.permits2024Thousands.toLocaleString()}k
          units while HVS/JCHS household growth ran ~
          {HEADLINE.householdGrowth2024Thousands.toLocaleString()}k.{" "}
          {ANALYTICS.metrosBelowOne} of {METRO_LADDER.length} sample metros sit
          below 1.0; {HEADLINE.lowestMetroLabel} is lowest at{" "}
          {HEADLINE.lowestMetroRatio.toFixed(2)}. South issued ~
          {ANALYTICS.southShareOf2024PermitsPct}% of 2024 permits.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {panels.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPanel(p.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              panel === p.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-2 text-slate-600">
          <span className="font-medium">Series from</span>
          <select
            value={yearFrom}
            onChange={(e) => setYearFrom(Number(e.target.value) as 2015 | 2019)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1"
          >
            <option value={2019}>2019 (surge window)</option>
            <option value={2015}>2015 (longer path)</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-slate-600">
          <span className="font-medium">Metro region</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as RegionId)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1"
          >
            <option value="all">All regions</option>
            <option value="northeast">Northeast</option>
            <option value="midwest">Midwest</option>
            <option value="south">South</option>
            <option value="west">West</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-slate-600">
          <span className="font-medium">Sort metros</span>
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1"
          >
            <option value="ratio-asc">Lowest ratio first</option>
            <option value="gap-desc">Largest unit gap first</option>
            <option value="permits-desc">Most permits first</option>
          </select>
        </label>
      </div>

      {panel === "national-ratio" && (
        <ChartCard
          title="Authorized units vs net household growth"
          subtitle={`Bars in thousands; teal line = permits per net household. Replacement benchmark ≈ ${HEADLINE.replacementBenchmarkRatio}.`}
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={nationalSlice} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="vol"
                  tick={{ fontSize: 11 }}
                  label={{ value: "Thousands", angle: -90, position: "insideLeft", fontSize: 11 }}
                />
                <YAxis
                  yAxisId="ratio"
                  orientation="right"
                  domain={[0.5, 1.4]}
                  tick={{ fontSize: 11 }}
                  label={{ value: "Ratio", angle: 90, position: "insideRight", fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    const label = String(name);
                    if (label === "ratio" || label === "Permits / HH") {
                      return [n.toFixed(2), "Permits / HH"];
                    }
                    return [n.toLocaleString(), label];
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="vol"
                  dataKey="permitsThousands"
                  name="Permits"
                  fill={COLORS.permits}
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  yAxisId="vol"
                  dataKey="householdGrowthThousands"
                  name="Net households"
                  fill={COLORS.households}
                  radius={[3, 3, 0, 0]}
                />
                <Line
                  yAxisId="ratio"
                  type="monotone"
                  dataKey="ratio"
                  name="Permits / HH"
                  stroke={COLORS.ratio}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "cumulative-gap" && (
        <ChartCard
          title="Running gap: permits minus household growth"
          subtitle="Negative cumulative values mean authorized units lagged net new households over the window (before demolitions)."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={gapSlice} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="cumulativeGapThousands"
                  name="Cumulative gap (k)"
                  fill="#fecaca"
                  stroke={COLORS.gap}
                  strokeWidth={2}
                />
                <Bar
                  dataKey="annualGapThousands"
                  name="Annual gap (k)"
                  fill={COLORS.permits}
                  opacity={0.55}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "metro-ladder" && (
        <ChartCard
          title="Metro permits per net household"
          subtitle={`${metros.length} metros · sorted by control · red/amber = below 1.0 · gold = below ${HEADLINE.replacementBenchmarkRatio} replacement benchmark`}
        >
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metros}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" domain={[0, 1.4]} tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="shortLabel"
                  width={88}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v) => [
                    typeof v === "number" ? v.toFixed(2) : String(v),
                    "Permits / HH",
                  ]}
                  labelFormatter={(_, payload) =>
                    (payload?.[0]?.payload as { metro?: string } | undefined)?.metro ??
                    ""
                  }
                />
                <Bar dataKey="ratio" name="Permits / HH" radius={[0, 4, 4, 0]}>
                  {metros.map((m) => (
                    <Cell key={m.metro} fill={ratioColor(m.ratio)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "metro-scatter" && (
        <ChartCard
          title="Household growth vs authorized units"
          subtitle="Bubble size ≈ rental vacancy. Points below the 1:1 diagonal under-permit relative to net household change."
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="householdGrowthThousands"
                  name="HH growth"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Net households (k / yr)",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="permitsThousands"
                  name="Permits"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Permits (k / yr)",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="rentalVacancyPct" range={[60, 280]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    const label = String(name);
                    if (label === "HH growth" || label === "Permits") {
                      return [`${n.toFixed(1)}k`, label];
                    }
                    return [value, label];
                  }}
                  labelFormatter={(_, payload) =>
                    (payload?.[0]?.payload as { shortLabel?: string } | undefined)
                      ?.shortLabel ?? ""
                  }
                />
                <Scatter data={metros} name="Metro">
                  {metros.map((m) => (
                    <Cell key={m.metro} fill={ratioColor(m.ratio)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {panel === "structure-mix" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Authorized units by structure type"
            subtitle="Share of annual BPS permits — multifamily share rose into 2022–23 then eased."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={STRUCTURE_MIX.filter((r) => r.year >= yearFrom || yearFrom === 2015)}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip
                    formatter={(v) => [
                      `${typeof v === "number" ? v : Number(v)}%`,
                      "",
                    ]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="singleFamilyPct"
                    name="1-unit"
                    stackId="1"
                    fill={COLORS.sf}
                    stroke={COLORS.sf}
                  />
                  <Area
                    type="monotone"
                    dataKey="twoToFourPct"
                    name="2–4"
                    stackId="1"
                    fill={COLORS.mid}
                    stroke={COLORS.mid}
                  />
                  <Area
                    type="monotone"
                    dataKey="fivePlusPct"
                    name="5+"
                    stackId="1"
                    fill={COLORS.mf}
                    stroke={COLORS.mf}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title={`Structure mix ${structureLatest.year}`}
            subtitle="Latest-year pie — same BPS structure shares."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {pieData.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [
                      `${typeof v === "number" ? v : Number(v)}%`,
                      "Share",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {panel === "region-stack" && (
        <ChartCard
          title="Regional permit volumes"
          subtitle={`Stacked authorized units (thousands). ${REGION_LABEL.south} still accounts for ~${ANALYTICS.southShareOf2024PermitsPct}% of the ${regionLatest.year} total.`}
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={REGION_PERMITS.filter((r) => r.year >= yearFrom)}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="northeast" name="Northeast" stackId="a" fill={COLORS.ne} />
                <Bar dataKey="midwest" name="Midwest" stackId="a" fill={COLORS.mw} />
                <Bar dataKey="south" name="South" stackId="a" fill={COLORS.south} />
                <Bar dataKey="west" name="West" stackId="a" fill={COLORS.west} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
