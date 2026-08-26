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
  DROP_ATTRIBUTION,
  HEADLINE,
  INDEX_PATH,
  NATIONAL_PATH,
  REGION_SUMMARY,
  SOURCE_NOTE,
  STATE_PANEL,
  fmtM,
  fmtPct,
  fmtPp,
  pathFromYear,
  statesByRegion,
  type RegionId,
} from "@/data/homeschool-and-private-share-of-school-age-kids-2026-data";

// viz-types: stacked non-public area+line, public-drop attribution pie,
// demography-vs-enrollment dual index, waterfall-style stacked bars,
// state non-public ladder, public-vs-school-age scatter
// | layout: default
// smoke-marker: Non-public share of school-age

type ViewId =
  | "shares"
  | "decomp"
  | "indexes"
  | "ladder"
  | "scatter"
  | "regions";

type YearFloor = 2016 | 2019;
type RegionFilter = "all" | RegionId;
type LadderMetric = "nonPublic" | "home" | "private";

const TEAL = "#0d9488";
const INDIGO = "#4f46e5";
const SLATE = "#64748b";
const ROSE = "#e11d48";
const AMBER = "#d97706";
const SKY = "#0284c8";
const NAVY = "#0f172a";

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "shares", label: "Non-public shares" },
  { id: "decomp", label: "Drop decomposition" },
  { id: "indexes", label: "Indexed paths" },
  { id: "ladder", label: "State ladder" },
  { id: "scatter", label: "Public vs school-age" },
  { id: "regions", label: "Regions" },
];

function ChartCard({
  title,
  subtitle,
  children,
  tall,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  tall?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {subtitle ? (
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      ) : null}
      <div className={`mt-3 w-full ${tall ? "h-[28rem]" : "h-72"}`}>
        {children}
      </div>
    </div>
  );
}

function FilterChip({
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
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function buildWaterfall() {
  const steps: {
    label: string;
    delta: number;
    fill: string;
  }[] = [
    { label: "Public 2019", delta: 50.8, fill: NAVY },
    {
      label: "Fewer school-age kids",
      delta: -HEADLINE.schoolAgeDropM,
      fill: SLATE,
    },
    {
      label: "Private uptake",
      delta: -HEADLINE.privateGainM,
      fill: INDIGO,
    },
    {
      label: "Homeschool / other",
      delta: -(
        HEADLINE.publicDropM -
        HEADLINE.schoolAgeDropM -
        HEADLINE.privateGainM -
        0.05
      ),
      fill: TEAL,
    },
    { label: "Grade-mix residual", delta: -0.05, fill: AMBER },
    { label: "Public 2023", delta: 49.5, fill: ROSE },
  ];

  let level = 0;
  return steps.map((s, i) => {
    if (i === 0 || i === steps.length - 1) {
      const value = s.delta;
      level = value;
      return {
        label: s.label,
        base: 0,
        rise: value,
        fill: s.fill,
        value,
        isTotal: true,
      };
    }
    const delta = s.delta;
    const base = delta < 0 ? level + delta : level;
    const rise = Math.abs(delta);
    level = level + delta;
    return {
      label: s.label,
      base,
      rise,
      fill: s.fill,
      value: delta,
      isTotal: false,
    };
  });
}

export function HomeschoolAndPrivateShareOfSchoolAgeKids2026Dashboard() {
  const [view, setView] = useState<ViewId>("shares");
  const [yearFloor, setYearFloor] = useState<YearFloor>(2016);
  const [region, setRegion] = useState<RegionFilter>("all");
  const [ladderMetric, setLadderMetric] =
    useState<LadderMetric>("nonPublic");

  const path = useMemo(() => pathFromYear(yearFloor), [yearFloor]);
  const indexPath = useMemo(
    () => INDEX_PATH.filter((r) => r.year >= yearFloor),
    [yearFloor],
  );
  const states = useMemo(() => {
    const rows = statesByRegion(region);
    const key =
      ladderMetric === "nonPublic"
        ? "nonPublicShare"
        : ladderMetric === "home"
          ? "homeShare"
          : "privateShare";
    return [...rows].sort(
      (a, b) => (b[key] as number) - (a[key] as number),
    );
  }, [region, ladderMetric]);

  const waterfall = useMemo(() => buildWaterfall(), []);
  const shareStack = useMemo(
    () =>
      path.map((r) => ({
        year: r.year,
        privateShare: r.privateShare,
        homeShare: r.homeShare,
        nonPublicShare: r.nonPublicShare,
      })),
    [path],
  );

  return (
    <div
      data-viz="homeschool-and-private-share-of-school-age-kids-2026"
      className="space-y-4"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-teal-50/40 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
          Non-public share of school-age
        </p>
        <p className="mt-1 text-lg font-semibold text-slate-900">
          Private + home rose {fmtPp(HEADLINE.nonPublicSharePp)} of ages
          5–17 (2019→2023) — only ~{HEADLINE.demographyShareOfDropPct}% of
          the {fmtM(HEADLINE.publicDropM)} public drop is fewer kids
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Public enrollment fell {fmtPct(HEADLINE.publicDropPct)} while
          school-age population slipped {fmtM(HEADLINE.schoolAgeDropM)}.
          Homeschool share roughly doubled; private share barely moved.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          View
        </span>
        {VIEWS.map((v) => (
          <FilterChip
            key={v.id}
            active={view === v.id}
            onClick={() => setView(v.id)}
          >
            {v.label}
          </FilterChip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Window
          </span>
          <FilterChip
            active={yearFloor === 2016}
            onClick={() => setYearFloor(2016)}
          >
            From 2016
          </FilterChip>
          <FilterChip
            active={yearFloor === 2019}
            onClick={() => setYearFloor(2019)}
          >
            From 2019
          </FilterChip>
        </div>
        {(view === "ladder" || view === "scatter" || view === "regions") && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Region
            </span>
            {(
              ["all", "Northeast", "Midwest", "South", "West"] as const
            ).map((r) => (
              <FilterChip
                key={r}
                active={region === r}
                onClick={() => setRegion(r)}
              >
                {r === "all" ? "All" : r}
              </FilterChip>
            ))}
          </div>
        )}
        {view === "ladder" && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Metric
            </span>
            <FilterChip
              active={ladderMetric === "nonPublic"}
              onClick={() => setLadderMetric("nonPublic")}
            >
              Private + home
            </FilterChip>
            <FilterChip
              active={ladderMetric === "home"}
              onClick={() => setLadderMetric("home")}
            >
              Homeschool
            </FilterChip>
            <FilterChip
              active={ladderMetric === "private"}
              onClick={() => setLadderMetric("private")}
            >
              Private
            </FilterChip>
          </div>
        )}
      </div>

      {view === "shares" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Private vs home paths"
            subtitle="% of school-age (ages 5–17)"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={shareStack}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  unit="%"
                  domain={[0, "auto"]}
                />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="privateShare"
                  name="Private"
                  stackId="1"
                  fill={INDIGO}
                  stroke={INDIGO}
                  fillOpacity={0.35}
                />
                <Area
                  type="monotone"
                  dataKey="homeShare"
                  name="Homeschool"
                  stackId="1"
                  fill={TEAL}
                  stroke={TEAL}
                  fillOpacity={0.45}
                />
                <Line
                  type="monotone"
                  dataKey="nonPublicShare"
                  name="Combined non-public"
                  stroke={NAVY}
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Headcounts (millions)"
            subtitle="Public CCD vs private PSS vs home desk bridge"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={path}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  domain={[45, 55]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  domain={[0, 6]}
                />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="publicM"
                  name="Public"
                  stroke={ROSE}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="schoolAgeM"
                  name="School-age 5–17"
                  stroke={SLATE}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Bar
                  yAxisId="right"
                  dataKey="privateM"
                  name="Private"
                  fill={INDIGO}
                  opacity={0.7}
                />
                <Bar
                  yAxisId="right"
                  dataKey="homeM"
                  name="Homeschool"
                  fill={TEAL}
                  opacity={0.7}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {view === "decomp" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Public drop decomposition"
            subtitle="How the 1.3M public decline splits"
            tall
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfall} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 55]} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={130}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value, name, item) => {
                    const row = item?.payload as {
                      value: number;
                      isTotal: boolean;
                    };
                    if (name === "base") return [null, null];
                    if (row?.isTotal) return [fmtM(row.value), "Level"];
                    return [fmtM(row.value), "Δ"];
                  }}
                />
                <Bar dataKey="base" stackId="w" fill="transparent" />
                <Bar dataKey="rise" stackId="w" radius={[0, 4, 4, 0]}>
                  {waterfall.map((row) => (
                    <Cell key={row.label} fill={row.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Share of the public drop"
            subtitle="Demography vs sector shift"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DROP_ATTRIBUTION}
                  dataKey="million"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {DROP_ATTRIBUTION.map((d) => (
                    <Cell key={d.id} fill={d.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, _n, item) => {
                    const row = item?.payload as {
                      pct: number;
                      label: string;
                    };
                    return [`${fmtM(Number(v))} (${row.pct}%)`, row.label];
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {view === "indexes" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Indexed paths (2019 = 100)"
            subtitle="School-age barely moved; public fell; home surged"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={indexPath}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[80, 220]} />
                <Tooltip />
                <Legend />
                <ReferenceLine y={100} stroke="#cbd5e1" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="schoolAgeIdx"
                  name="School-age"
                  stroke={SLATE}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="publicIdx"
                  name="Public"
                  stroke={ROSE}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="privateIdx"
                  name="Private"
                  stroke={INDIGO}
                  strokeWidth={2}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="homeIdx"
                  name="Homeschool"
                  stroke={TEAL}
                  fill={TEAL}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Combined non-public share"
            subtitle="Private + home as % of school-age"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={indexPath}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  unit="%"
                  domain={[10, 16]}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="nonPublicShare"
                  name="Non-public share"
                  stroke={NAVY}
                  fill={SKY}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <ReferenceLine
                  y={HEADLINE.nonPublicShare2019}
                  stroke={SLATE}
                  strokeDasharray="4 4"
                  label={{
                    value: "2019",
                    position: "insideTopRight",
                    fontSize: 10,
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {view === "ladder" && (
        <ChartCard
          title="State non-public ladder"
          subtitle="Desk bridge of PSS private + Pulse/state home shares"
          tall
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={states.map((s) => ({
                abbr: s.abbr,
                value:
                  ladderMetric === "nonPublic"
                    ? s.nonPublicShare
                    : ladderMetric === "home"
                      ? s.homeShare
                      : s.privateShare,
                home: s.homeShare,
                private: s.privateShare,
              }))}
              layout="vertical"
              margin={{ left: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
              <YAxis
                type="category"
                dataKey="abbr"
                width={36}
                tick={{ fontSize: 11 }}
              />
              <Tooltip />
              <Bar dataKey="value" name="% of school-age" radius={[0, 4, 4, 0]}>
                {states.map((s) => (
                  <Cell
                    key={s.abbr}
                    fill={
                      ladderMetric === "home"
                        ? TEAL
                        : ladderMetric === "private"
                          ? INDIGO
                          : SKY
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Public enrollment change vs school-age change"
          subtitle="States above the diagonal lost share beyond demography"
          tall
        >
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="schoolAgePctChange2019_23"
                name="School-age %"
                tick={{ fontSize: 11 }}
                unit="%"
                label={{
                  value: "School-age % change 2019–23",
                  position: "insideBottom",
                  offset: -2,
                  fontSize: 11,
                }}
              />
              <YAxis
                type="number"
                dataKey="publicPctChange2019_23"
                name="Public %"
                tick={{ fontSize: 11 }}
                unit="%"
                label={{
                  value: "Public % change",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 11,
                }}
              />
              <ZAxis
                type="number"
                dataKey="nonPublicShare"
                range={[60, 280]}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) => [
                  typeof v === "number" ? `${v.toFixed(1)}` : String(v),
                  String(name),
                ]}
                labelFormatter={(_, payload) => {
                  const row = payload?.[0]?.payload as {
                    state?: string;
                  };
                  return row?.state ?? "";
                }}
              />
              <ReferenceLine
                segment={[
                  { x: -4, y: -4 },
                  { x: 4, y: 4 },
                ]}
                stroke="#cbd5e1"
                strokeDasharray="4 4"
              />
              <Scatter
                data={statesByRegion(region)}
                fill={TEAL}
                name="States"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {view === "regions" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Regional non-public mix"
            subtitle="Average private and home shares in the state panel"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={REGION_SUMMARY.filter(
                  (r) => region === "all" || r.region === region,
                )}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="avgPrivate"
                  name="Private"
                  stackId="a"
                  fill={INDIGO}
                />
                <Bar
                  dataKey="avgHome"
                  name="Homeschool"
                  stackId="a"
                  fill={TEAL}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Public vs school-age % change by region"
            subtitle="Gap = enrollment loss beyond demography"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={REGION_SUMMARY.filter(
                  (r) => region === "all" || r.region === region,
                )}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="avgPublicPct"
                  name="Public % Δ"
                  fill={ROSE}
                  opacity={0.85}
                />
                <Line
                  type="monotone"
                  dataKey="avgSchoolAgePct"
                  name="School-age % Δ"
                  stroke={SLATE}
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <p className="sr-only">
        {STATE_PANEL.length} states in panel; {NATIONAL_PATH.length} national
        years.
      </p>
    </div>
  );
}
