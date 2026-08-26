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
  FLOOR_GAP_ROWS,
  FLOORS,
  GAP_BANDS,
  HEADLINE,
  OWNERSHIP_COMPLIANCE,
  QUARTERLY_PATH,
  SIZE_BAND_ROWS,
  SOURCE_NOTE,
  STATE_PANEL,
  URBAN_RURAL,
  fmtHprd,
  fmtInt,
  fmtPct,
  regionSummary,
  stateLadder,
  type RegionId,
} from "@/data/cms-pbj-hours-per-resident-day-versus-the-federal-floor-2026-data";

// viz-types: floor-gap bars, state scatter, quarterly area+line,
// gap-band pie, ownership grouped bars, size ladder, urban-rural
// | layout: default
// smoke-marker: Share below HPRD floor

type ViewId =
  | "floors"
  | "states"
  | "path"
  | "bands"
  | "ownership"
  | "size";

type RegionFilter = "all" | RegionId;
type LadderMetric = "below348Pct" | "meanTotalHprd" | "atOrAbove41Pct";
type ScatterAxis = "below" | "contract";

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const SKY = "#0284c8";
const EMERALD = "#059669";

const REGION_COLORS: Record<RegionId, string> = {
  Northeast: INDIGO,
  Midwest: TEAL,
  South: ROSE,
  West: AMBER,
};

const BAND_COLORS = [ROSE, AMBER, "#f59e0b", SKY, TEAL, EMERALD];

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
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            value === o.id
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function CmsPbjHoursPerResidentDayVersusTheFederalFloor2026Dashboard() {
  const [view, setView] = useState<ViewId>("floors");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [ladderMetric, setLadderMetric] = useState<LadderMetric>("below348Pct");
  const [scatterAxis, setScatterAxis] = useState<ScatterAxis>("below");

  const ladder = useMemo(
    () => stateLadder(ladderMetric, region, 18),
    [ladderMetric, region],
  );

  const scatterData = useMemo(() => {
    const rows = region === "all" ? STATE_PANEL : STATE_PANEL.filter((s) => s.region === region);
    return rows.map((s) => ({
      ...s,
      y: scatterAxis === "below" ? s.below348Pct : s.contractPct,
      fill: REGION_COLORS[s.region],
    }));
  }, [region, scatterAxis]);

  const regions = useMemo(() => regionSummary(), []);

  const gapBarData = FLOOR_GAP_ROWS.map((r) => ({
    name: r.label,
    below: r.belowPct,
    atOrAbove: r.atOrAbovePct,
    floor: r.floor,
    mean: r.meanValue,
  }));

  const ownershipGrouped = OWNERSHIP_COMPLIANCE.map((o) => ({
    name: o.label,
    "Below total 3.48": o.belowTotalPct,
    "At/above NA 2.45": o.atOrAboveNaPct,
    "At/above RN 0.55": o.atOrAboveRnPct,
  }));

  const sizeBars = SIZE_BAND_ROWS.map((s) => ({
    band: s.band,
    below: s.belowTotalPct,
    mean: s.meanTotalHprd,
  }));

  return (
    <div
      className="space-y-6"
      data-viz="cms-pbj-hours-per-resident-day-versus-the-federal-floor-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
          Share below HPRD floor
        </p>
        <p className="mt-2 max-w-3xl text-2xl font-bold leading-snug sm:text-3xl">
          {fmtPct(HEADLINE.below348Pct, 1)} of reporting nursing homes still
          sit below the {fmtHprd(HEADLINE.floorTotal)} total-nurse HPRD
          benchmark in Q4 2024 PBJ
        </p>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Floor gap by staff type · {fmtInt(HEADLINE.reportingHomes)} homes ·
          national mean {fmtHprd(HEADLINE.meanTotalHprd)} HPRD · nurse-aide gap
          remains the widest ({fmtPct(HEADLINE.belowNaPct, 0)} below 2.45)
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup<ViewId>
          value={view}
          onChange={setView}
          options={[
            { id: "floors", label: "Floor gaps" },
            { id: "states", label: "State HPRD map" },
            { id: "path", label: "Quarterly path" },
            { id: "bands", label: "Distance bands" },
            { id: "ownership", label: "Ownership" },
            { id: "size", label: "Size & rural" },
          ]}
        />
        <ToggleGroup<RegionFilter>
          value={region}
          onChange={setRegion}
          options={[
            { id: "all", label: "All regions" },
            { id: "Northeast", label: "Northeast" },
            { id: "Midwest", label: "Midwest" },
            { id: "South", label: "South" },
            { id: "West", label: "West" },
          ]}
        />
      </div>

      {view === "floors" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Floor gap by staff type"
            subtitle="% of homes below each CMS-3442-F numerical standard"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={gapBarData}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 80]} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) => fmtPct(Number(v), 1)}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="below" name="% below floor" radius={[0, 4, 4, 0]}>
                    {gapBarData.map((_, i) => (
                      <Cell key={i} fill={[ROSE, AMBER, TEAL, INDIGO][i % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Mean HPRD vs floor line"
            subtitle="National means (ASPE / PBJ) against the published floors"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={[
                    { label: "Total", mean: 3.75, floor: 3.48 },
                    { label: "RN", mean: 0.65, floor: 0.55 },
                    { label: "NA", mean: 2.26, floor: 2.45 },
                  ]}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" />
                  <YAxis tickFormatter={(v) => fmtHprd(Number(v), 1)} />
                  <Tooltip formatter={(v) => fmtHprd(Number(v), 2)} />
                  <Legend />
                  <Bar dataKey="mean" name="Mean HPRD" fill={TEAL} radius={[4, 4, 0, 0]} />
                  <Line
                    type="monotone"
                    dataKey="floor"
                    name="Floor"
                    stroke={ROSE}
                    strokeWidth={2}
                    dot={{ r: 5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "states" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="State HPRD vs 3.48 line"
            subtitle={
              scatterAxis === "below"
                ? "X = mean total nurse HPRD; Y = estimated % below 3.48"
                : "X = mean total nurse HPRD; Y = % contract nurse hours"
            }
          >
            <div className="mb-3">
              <ToggleGroup<ScatterAxis>
                value={scatterAxis}
                onChange={setScatterAxis}
                options={[
                  { id: "below", label: "Y: % below floor" },
                  { id: "contract", label: "Y: % contract" },
                ]}
              />
            </div>
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="meanTotalHprd"
                    name="Mean HPRD"
                    domain={[3, 6.5]}
                    tickFormatter={(v) => fmtHprd(Number(v), 1)}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name={scatterAxis === "below" ? "% below" : "% contract"}
                    tickFormatter={(v) => `${v}`}
                  />
                  <ZAxis type="number" dataKey="census" range={[40, 280]} />
                  <ReferenceLine
                    x={FLOORS.total}
                    stroke={ROSE}
                    strokeDasharray="4 4"
                    label={{ value: "3.48", fill: ROSE, fontSize: 11 }}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload as (typeof scatterData)[0];
                      return (
                        <div className="rounded border border-slate-200 bg-white px-3 py-2 text-xs shadow">
                          <p className="font-semibold">{d.state}</p>
                          <p>Mean HPRD: {fmtHprd(d.meanTotalHprd)}</p>
                          <p>Below 3.48: {fmtPct(d.below348Pct, 0)}</p>
                          <p>Contract: {fmtPct(d.contractPct, 1)}</p>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={scatterData} name="States">
                    {scatterData.map((s) => (
                      <Cell key={s.state} fill={s.fill} fillOpacity={0.85} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="State ladder"
            subtitle="Sortable ranking for the active region filter"
          >
            <div className="mb-3">
              <ToggleGroup<LadderMetric>
                value={ladderMetric}
                onChange={setLadderMetric}
                options={[
                  { id: "below348Pct", label: "Sort: % below" },
                  { id: "meanTotalHprd", label: "Sort: mean HPRD" },
                  { id: "atOrAbove41Pct", label: "Sort: ≥4.1%" },
                ]}
              />
            </div>
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...ladder].reverse()}
                  layout="vertical"
                  margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="state" width={36} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar
                    dataKey={ladderMetric}
                    name={
                      ladderMetric === "below348Pct"
                        ? "% below 3.48"
                        : ladderMetric === "meanTotalHprd"
                          ? "Mean HPRD"
                          : "% ≥ 4.1"
                    }
                    fill={NAVY}
                    radius={[0, 3, 3, 0]}
                  >
                    {ladder.map((s) => (
                      <Cell key={s.state} fill={REGION_COLORS[s.region]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "path" && (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ChartCard
              title="Share below HPRD floor — quarterly path"
              subtitle="% of providers below 3.48 total nurse HPRD (Q3–Q4 2024 disclosed)"
            >
              <div className="h-96 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={QUARTERLY_PATH}
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 10 }} />
                    <YAxis
                      yAxisId="left"
                      domain={[30, 50]}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[3.5, 3.9]}
                      tickFormatter={(v) => fmtHprd(Number(v), 2)}
                    />
                    <Tooltip />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="below348Pct"
                      name="% below 3.48"
                      fill={ROSE}
                      fillOpacity={0.2}
                      stroke={ROSE}
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="meanTotalHprd"
                      name="Mean total HPRD"
                      stroke={TEAL}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
          <div className="lg:col-span-2">
            <ChartCard
              title="Census-weighted region means"
              subtitle="Desk roll-up of state panel"
            >
              <div className="h-96 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={regions}
                    margin={{ top: 8, right: 12, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `${v}%`} />
                    <Tooltip />
                    <Bar dataKey="below348Pct" name="% below 3.48" radius={[4, 4, 0, 0]}>
                      {regions.map((r) => (
                        <Cell key={r.region} fill={REGION_COLORS[r.region]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {view === "bands" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Distance from the 3.48 floor"
            subtitle="Estimated share of homes by total-nurse HPRD band"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={GAP_BANDS}
                    dataKey="sharePct"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={110}
                    paddingAngle={2}
                    label={(props) => {
                      const p = props as { label?: string; sharePct?: number; name?: string };
                      const name = p.label ?? p.name ?? "";
                      const pct = p.sharePct ?? 0;
                      return `${name}: ${pct}%`;
                    }}
                  >
                    {GAP_BANDS.map((_, i) => (
                      <Cell key={i} fill={BAND_COLORS[i % BAND_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtPct(Number(v), 1)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Band home counts"
            subtitle={`~${fmtInt(HEADLINE.homesBelowFloor)} homes below 3.48 nationally`}
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={GAP_BANDS}
                  margin={{ top: 8, right: 12, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="homes" name="Homes" radius={[4, 4, 0, 0]}>
                    {GAP_BANDS.map((_, i) => (
                      <Cell key={i} fill={BAND_COLORS[i % BAND_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "ownership" && (
        <ChartCard
          title="Ownership: below-floor vs component compliance"
          subtitle="ASPE May 2024 Care Compare — for-profit gap is nearly 30 pp wider on total HPRD"
        >
          <div className="h-96 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ownershipGrouped}
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(v) => `${v}%`} domain={[0, 90]} />
                <Tooltip formatter={(v) => fmtPct(Number(v), 0)} />
                <Legend />
                <Bar dataKey="Below total 3.48" fill={ROSE} radius={[4, 4, 0, 0]} />
                <Bar dataKey="At/above RN 0.55" fill={SKY} radius={[4, 4, 0, 0]} />
                <Bar dataKey="At/above NA 2.45" fill={TEAL} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "size" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Below-floor share by bed-size band"
            subtitle="Smaller homes clear the total floor more often (ASPE-informed)"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={sizeBars}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="band" />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 70]}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[3, 5]}
                    tickFormatter={(v) => fmtHprd(Number(v), 1)}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="below"
                    name="% below 3.48"
                    fill={INDIGO}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="mean"
                    name="Mean HPRD"
                    stroke={AMBER}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <ReferenceLine
                    yAxisId="right"
                    y={FLOORS.total}
                    stroke={ROSE}
                    strokeDasharray="4 4"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Urban vs rural compliance"
            subtitle="Rural homes more often clear NA/RN floors; urban more often clear 24 RN hrs/day"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={URBAN_RURAL.map((u) => ({
                    name: u.label,
                    "Below total": u.belowTotalPct,
                    "At/above RN": u.atOrAboveRnPct,
                    "At/above NA": u.atOrAboveNaPct,
                    "≥24 RN hrs": u.atOrAboveRn24Pct,
                  }))}
                  margin={{ top: 8, right: 12, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v) => fmtPct(Number(v), 0)} />
                  <Legend />
                  <Bar dataKey="Below total" fill={ROSE} />
                  <Bar dataKey="At/above RN" fill={SKY} />
                  <Bar dataKey="At/above NA" fill={TEAL} />
                  <Bar dataKey="≥24 RN hrs" fill={EMERALD} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
