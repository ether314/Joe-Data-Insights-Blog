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
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  DUAL_DECLINE_STATES,
  HEADLINE,
  LOCALE_ROWS,
  NATIONAL_PATH,
  QUADRANT_MIX,
  REGION_SUMMARY,
  SOURCE_NOTE,
  STATE_PANEL,
  TOP_SUBSTITUTION,
  fmtIndex,
  fmtPerCapita,
  fmtPct,
  statesByQuadrant,
  statesByRegion,
  type QuadrantId,
  type RegionId,
} from "@/data/imls-library-visits-versus-electronic-circulation-2026-data";

// viz-types: dual-track composed area+line, state quadrant scatter,
// quadrant pie, dual-decline bars, locale grouped bars, substitution ladder
// | layout: default
// smoke-marker: Visits vs e-circ index

type ViewId =
  | "dual-track"
  | "quadrant"
  | "locales"
  | "dual-decline"
  | "substitution"
  | "regions";

type RegionFilter = "all" | RegionId;
type QuadrantFilter = "all" | QuadrantId;

const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const EMERALD = "#059669";
const SKY = "#0284c8";

const QUAD_COLORS: Record<QuadrantId, string> = {
  "visits-down-ecirc-up": TEAL,
  "both-up": EMERALD,
  "both-down": ROSE,
  "visits-up-ecirc-down": AMBER,
};

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "dual-track", label: "Dual track" },
  { id: "quadrant", label: "State quadrant" },
  { id: "locales", label: "Locale" },
  { id: "dual-decline", label: "Dual decline" },
  { id: "substitution", label: "Substitution" },
  { id: "regions", label: "Regions" },
];

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
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {subtitle ? (
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      ) : null}
      <div className="mt-3 h-72 w-full">{children}</div>
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

export function ImlsLibraryVisitsVersusElectronicCirculation2026Dashboard() {
  const [view, setView] = useState<ViewId>("dual-track");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [quadrant, setQuadrant] = useState<QuadrantFilter>("all");
  const [scatterLens, setScatterLens] = useState<"gap" | "visits" | "ecirc">(
    "gap",
  );

  const filteredStates = useMemo(() => {
    let rows = statesByRegion(region);
    if (quadrant !== "all") {
      rows = rows.filter((s) => s.quadrant === quadrant);
    }
    return rows;
  }, [region, quadrant]);

  const scatterData = useMemo(
    () =>
      filteredStates.map((s) => ({
        ...s,
        gap: s.eCircIndex - s.visitsIndex,
        z: Math.max(40, s.lsaM * 8),
      })),
    [filteredStates],
  );

  const localeChart = useMemo(
    () =>
      LOCALE_ROWS.map((r) => ({
        locale: r.locale,
        visits2018: r.medianVisits2018,
        visits2023: r.medianVisits2023,
        eCirc2018: r.medianECirc2018,
        eCirc2023: r.medianECirc2023,
        growth: r.eCircGrowthPct,
      })),
    [],
  );

  const dualBars = useMemo(
    () =>
      DUAL_DECLINE_STATES.map((s) => ({
        abbr: s.abbr,
        visits: s.visitsIndex,
        eCirc: s.eCircIndex,
        region: s.region,
      })),
    [],
  );

  const subLadder = useMemo(
    () =>
      TOP_SUBSTITUTION.filter(
        (s) => region === "all" || s.region === region,
      ).map((s) => ({
        abbr: s.abbr,
        gap: s.gap,
        visits: s.visitsIndex,
        eCirc: s.eCircIndex,
      })),
    [region],
  );

  const regionBars = useMemo(
    () =>
      REGION_SUMMARY.map((r) => ({
        region: r.region,
        visits: r.medianVisitsIndex,
        eCirc: r.medianECircIndex,
        dual: r.dualDecline,
        sub: r.visitsDownEcircUp,
      })),
    [],
  );

  return (
    <div
      data-viz="imls-library-visits-versus-electronic-circulation-2026"
      className="space-y-4 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 sm:p-6"
    >
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          Visits vs e-circ index
        </p>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Physical visits still trail FY 2019 while electronic circulation runs
          ahead
        </h2>
        <p className="max-w-3xl text-sm text-slate-600">
          National visits recovered from pandemic lows but sit near{" "}
          <span className="font-semibold text-slate-800">
            index {HEADLINE.visitsIndex2023}
          </span>{" "}
          versus FY 2019 (=100). Electronic circulation is at{" "}
          <span className="font-semibold text-slate-800">
            index {HEADLINE.eCircIndex2023}
          </span>
          . In the 51-state desk panel,{" "}
          <span className="font-semibold text-teal-800">
            {HEADLINE.visitsDownEcircUp} states
          </span>{" "}
          show visits down and e-circ up;{" "}
          <span className="font-semibold text-rose-700">
            {HEADLINE.dualDecline} states
          </span>{" "}
          lost ground on both channels.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          {
            label: "Visits index FY23",
            value: fmtIndex(HEADLINE.visitsIndex2023),
            hint: "vs FY19=100",
          },
          {
            label: "E-circ index FY23",
            value: fmtIndex(HEADLINE.eCircIndex2023),
            hint: "vs FY19=100",
          },
          {
            label: "Substitution states",
            value: String(HEADLINE.visitsDownEcircUp),
            hint: "visits↓ e-circ↑",
          },
          {
            label: "Dual decline",
            value: String(HEADLINE.dualDecline),
            hint: "both indexes <100",
          },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2"
          >
            <p className="text-[10px] uppercase tracking-wide text-slate-500">
              {k.label}
            </p>
            <p className="text-lg font-bold text-slate-900">{k.value}</p>
            <p className="text-[10px] text-slate-400">{k.hint}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
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

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        <span className="text-xs font-medium text-slate-500">Region</span>
        {(
          ["all", "Northeast", "Midwest", "South", "West"] as RegionFilter[]
        ).map((r) => (
          <FilterChip
            key={r}
            active={region === r}
            onClick={() => setRegion(r)}
          >
            {r === "all" ? "All" : r}
          </FilterChip>
        ))}
        <span className="ml-2 text-xs font-medium text-slate-500">
          Quadrant
        </span>
        {(
          [
            "all",
            "visits-down-ecirc-up",
            "both-down",
            "both-up",
            "visits-up-ecirc-down",
          ] as QuadrantFilter[]
        ).map((q) => (
          <FilterChip
            key={q}
            active={quadrant === q}
            onClick={() => setQuadrant(q)}
          >
            {q === "all"
              ? "All"
              : q === "visits-down-ecirc-up"
                ? "Sub path"
                : q === "both-down"
                  ? "Dual ↓"
                  : q === "both-up"
                    ? "Both ↑"
                    : "Visits ↑"}
          </FilterChip>
        ))}
      </div>

      {view === "dual-track" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="National dual track"
            subtitle="Visits index vs e-circ index (FY 2019 = 100)"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={NATIONAL_PATH}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fy" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 180]} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="visitsIndex"
                  name="Visits index"
                  fill={SKY}
                  fillOpacity={0.25}
                  stroke={SKY}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="eCircIndex"
                  name="E-circ index"
                  stroke={TEAL}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Median per-person circulation"
            subtitle="Physical rebound vs electronic climb (IMLS medians)"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={NATIONAL_PATH}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="fy" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="medianPhysCirc"
                  name="Physical circ"
                  fill={INDIGO}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="medianECirc"
                  name="E-circ (median)"
                  stroke={TEAL}
                  strokeWidth={2.5}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      {view === "quadrant" ? (
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ChartCard
              title="State quadrant map"
              subtitle="Each point = state; x = visits index, y = e-circ index (FY19=100)"
            >
              <div className="mb-2 flex flex-wrap gap-2">
                <span className="text-xs text-slate-500">Bubble lens</span>
                {(
                  [
                    ["gap", "Gap (e − visits)"],
                    ["visits", "Visits index"],
                    ["ecirc", "E-circ index"],
                  ] as const
                ).map(([id, label]) => (
                  <FilterChip
                    key={id}
                    active={scatterLens === id}
                    onClick={() => setScatterLens(id)}
                  >
                    {label}
                  </FilterChip>
                ))}
              </div>
              <ResponsiveContainer width="100%" height="85%">
                <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="visitsIndex"
                    name="Visits"
                    domain={[40, 120]}
                    tick={{ fontSize: 10 }}
                    label={{
                      value: "Visits index",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 10,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="eCircIndex"
                    name="E-circ"
                    domain={[80, 190]}
                    tick={{ fontSize: 10 }}
                    label={{
                      value: "E-circ index",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 10,
                    }}
                  />
                  <ZAxis
                    type="number"
                    dataKey={
                      scatterLens === "gap"
                        ? "gap"
                        : scatterLens === "visits"
                          ? "visitsIndex"
                          : "eCircIndex"
                    }
                    range={[40, 280]}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload as (typeof scatterData)[0];
                      return (
                        <div className="rounded border border-slate-200 bg-white px-2 py-1 text-xs shadow">
                          <p className="font-semibold">{d.state}</p>
                          <p>Visits idx {fmtIndex(d.visitsIndex)}</p>
                          <p>E-circ idx {fmtIndex(d.eCircIndex)}</p>
                          <p>
                            {fmtPerCapita(d.visitsPerCapita)} visits ·{" "}
                            {fmtPerCapita(d.eCircPerCapita)} e-circ / person
                          </p>
                        </div>
                      );
                    }}
                  />
                  {/* Reference cross at 100,100 */}
                  <Scatter name="States" data={scatterData}>
                    {scatterData.map((s) => (
                      <Cell
                        key={s.abbr}
                        fill={QUAD_COLORS[s.quadrant]}
                        fillOpacity={0.85}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
          <div className="lg:col-span-2">
            <ChartCard
              title="Quadrant mix"
              subtitle={`${filteredStates.length} states in filter`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={QUADRANT_MIX.map((q) => ({
                      ...q,
                      count: statesByQuadrant(q.id).filter(
                        (s) => region === "all" || s.region === region,
                      ).length,
                    })).filter((q) => q.count > 0)}
                    dataKey="count"
                    nameKey="short"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={2}
                    label={(props) => {
                      const short = String(
                        (props as { short?: string }).short ?? "",
                      );
                      const count = Number(
                        (props as { count?: number }).count ?? 0,
                      );
                      return `${short} (${count})`;
                    }}
                  >
                    {QUADRANT_MIX.map((q) => (
                      <Cell key={q.id} fill={q.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      ) : null}

      {view === "locales" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Locale visits recovery"
            subtitle="Median visits per person by NCES locale"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={localeChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="locale" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="visits2018" name="FY 2018" fill={SLATE} />
                <Bar dataKey="visits2023" name="FY 2023" fill={SKY} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Locale e-circ growth"
            subtitle="Median electronic circ per person + growth %"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={localeChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="locale" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  unit="%"
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="eCirc2018"
                  name="E-circ 2018"
                  fill={SLATE}
                />
                <Bar
                  yAxisId="left"
                  dataKey="eCirc2023"
                  name="E-circ 2023"
                  fill={TEAL}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="growth"
                  name="Growth %"
                  stroke={AMBER}
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      {view === "dual-decline" ? (
        <ChartCard
          title="Dual-decline states"
          subtitle="Both visits and e-circ indexes still below FY 2019 (=100)"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dualBars} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 110]} tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="abbr"
                width={36}
                tick={{ fontSize: 11 }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="visits" name="Visits index" fill={SKY} />
              <Bar dataKey="eCirc" name="E-circ index" fill={ROSE} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "substitution" ? (
        <ChartCard
          title="Largest visit–e-circ gaps"
          subtitle="States on the substitution path (visits↓ e-circ↑), ranked by index gap"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subLadder} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="abbr"
                width={36}
                tick={{ fontSize: 11 }}
              />
              <Tooltip />
              <Bar dataKey="gap" name="E-circ − visits (pts)" fill={TEAL}>
                {subLadder.map((s) => (
                  <Cell key={s.abbr} fill={TEAL} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {view === "regions" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Regional median indexes"
            subtitle="Median visits vs e-circ index by Census region"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionBars}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="visits" name="Median visits idx" fill={SKY} />
                <Bar dataKey="eCirc" name="Median e-circ idx" fill={TEAL} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Dual decline vs substitution counts"
            subtitle="How many states in each region land in each path"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionBars}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="sub" name="Substitution path" stackId="a" fill={TEAL} />
                <Bar dataKey="dual" name="Dual decline" stackId="a" fill={ROSE} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      <p className="text-[11px] leading-relaxed text-slate-500">
        {SOURCE_NOTE} Filtered panel: {filteredStates.length} of{" "}
        {STATE_PANEL.length} jurisdictions. Locale growth labels use IMLS median
        e-circ change ({fmtPct(HEADLINE.medianECircGrowthPct)} overall since FY
        2018).
      </p>
    </div>
  );
}
