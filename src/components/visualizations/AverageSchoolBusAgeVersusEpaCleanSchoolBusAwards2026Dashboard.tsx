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
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  AGE_BANDS,
  AGE_VS_AWARDS,
  AWARD_ROUND_INCREMENTS,
  FUEL_MIX_BASELINE,
  HEADLINE,
  SOURCE_NOTE,
  VIZ_MARKERS,
  buildCounterfactual,
  filterStates,
  fleetSharePct,
  fmtAge,
  fmtBuses,
  fmtDollarsB,
  fmtPct,
  stateAwardSharePct,
  type RegionId,
} from "@/data/average-school-bus-age-versus-epa-clean-school-bus-awards-2026-data";

// viz-types: dual-axis age vs CSB composed, counterfactual area,
// state award horizontal bars, fuel-mix pie, award-round bars,
// age-band diesel-tail bars
// | layout: default
// smoke-marker: Mean age vs CSB units dual axis

type ViewId =
  | "dual"
  | "counterfactual"
  | "states"
  | "fuel"
  | "rounds"
  | "bands";

const AMBER = "#f59e0b";
const SKY = "#0ea5e9";
const EMERALD = "#059669";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#6366f1";
const DIESEL = "#78350f";

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "dual", label: "Age vs awards" },
  { id: "counterfactual", label: "CSB drag" },
  { id: "states", label: "State concentration" },
  { id: "fuel", label: "Fuel mix" },
  { id: "rounds", label: "Award rounds" },
  { id: "bands", label: "Age bands" },
];

const REGIONS: { id: RegionId; label: string }[] = [
  { id: "all", label: "All regions" },
  { id: "northeast", label: "Northeast" },
  { id: "midwest", label: "Midwest" },
  { id: "south", label: "South" },
  { id: "west", label: "West" },
];

const MIN_AWARD_OPTS = [
  { value: 0, label: "Any awards" },
  { value: 250, label: "≥250 buses" },
  { value: 500, label: "≥500 buses" },
  { value: 1000, label: "≥1,000 buses" },
];

const FUEL_COLORS: Record<string, string> = {
  diesel: DIESEL,
  propane: AMBER,
  cng: SLATE,
  electric: EMERALD,
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
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {subtitle ? (
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      ) : null}
      <div className="mt-3 h-72 w-full">{children}</div>
    </div>
  );
}

function ControlRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function ToggleBtn({
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
      className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

export function AverageSchoolBusAgeVersusEpaCleanSchoolBusAwards2026Dashboard() {
  const [view, setView] = useState<ViewId>("dual");
  const [region, setRegion] = useState<RegionId>("all");
  const [minAwarded, setMinAwarded] = useState(0);

  const dualData = useMemo(
    () =>
      AGE_VS_AWARDS.map((r) => ({
        year: String(r.surveyYear),
        meanAge: r.meanAgeYrs,
        csbBuses: r.csbCumulativeBuses,
        sharePct: fleetSharePct(r.csbCumulativeBuses),
      })),
    [],
  );

  const counterfactual = useMemo(() => buildCounterfactual(), []);

  const stateRows = useMemo(
    () =>
      filterStates(region, minAwarded).map((s) => ({
        ...s,
        short: s.stateCode,
        shareOfFleet: stateAwardSharePct(s),
      })),
    [region, minAwarded],
  );

  const roundBars = useMemo(
    () =>
      AWARD_ROUND_INCREMENTS.map((r) => ({
        label: r.label,
        buses: r.buses,
        dollarsM: r.dollarsM,
        electricSharePct: r.electricSharePct,
      })),
    [],
  );

  const bandBars = useMemo(
    () =>
      AGE_BANDS.map((b) => ({
        label: b.label,
        sharePct: b.sharePct,
        fill: b.csbTarget ? ROSE : SKY,
      })),
    [],
  );

  return (
    <div
      className="space-y-4"
      data-viz="average-school-bus-age-versus-epa-clean-school-bus-awards-2026"
    >
      <div className="rounded-xl border border-amber-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 p-4 text-white shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wider text-amber-200/90">
          Headline
        </p>
        <p className="mt-1 text-lg font-semibold leading-snug sm:text-xl">
          Mean yellow-fleet age fell from {HEADLINE.meanAgePeak} to{" "}
          {HEADLINE.meanAge2026} years — while EPA CSB awards cover only ~
          {HEADLINE.csbShareOfFleetPct}% of the {fmtBuses(HEADLINE.fleetYellowBuses)}{" "}
          -bus national stock
        </p>
        <p className="mt-2 text-xs text-slate-300">
          {fmtDollarsB(HEADLINE.csbDollarsB)} / ~{fmtBuses(HEADLINE.csbBusesAwarded)}{" "}
          replacements by end of FY2024 · diesel still ~{HEADLINE.dieselSharePct}% of
          the fleet
        </p>
        <ul className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400">
          {VIZ_MARKERS.map((m) => (
            <li
              key={m}
              className="rounded-full border border-slate-600/80 px-2 py-0.5"
            >
              {m}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <ControlRow label="View">
          {VIEWS.map((v) => (
            <ToggleBtn
              key={v.id}
              active={view === v.id}
              onClick={() => setView(v.id)}
            >
              {v.label}
            </ToggleBtn>
          ))}
        </ControlRow>
        {(view === "states" || view === "dual") && (
          <ControlRow label="Region">
            {REGIONS.map((r) => (
              <ToggleBtn
                key={r.id}
                active={region === r.id}
                onClick={() => setRegion(r.id)}
              >
                {r.label}
              </ToggleBtn>
            ))}
          </ControlRow>
        )}
        {view === "states" && (
          <ControlRow label="Min awards">
            {MIN_AWARD_OPTS.map((o) => (
              <ToggleBtn
                key={o.value}
                active={minAwarded === o.value}
                onClick={() => setMinAwarded(o.value)}
              >
                {o.label}
              </ToggleBtn>
            ))}
          </ControlRow>
        )}
      </div>

      {view === "dual" && (
        <ChartCard
          title="Mean age vs CSB units dual axis"
          subtitle="SBF survey mean age (left) against cumulative EPA Clean School Bus awards (right)"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dualData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="age"
                domain={[7.5, 10]}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}`}
                label={{
                  value: "Mean age (yrs)",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 10, fill: SLATE },
                }}
              />
              <YAxis
                yAxisId="buses"
                orientation="right"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value, name) => {
                  const n = Number(value);
                  if (name === "meanAge") return [fmtAge(n), "Mean fleet age"];
                  if (name === "csbBuses") return [fmtBuses(n), "Cumulative CSB buses"];
                  return [String(value), String(name)];
                }}
              />
              <Legend />
              <Bar
                yAxisId="buses"
                dataKey="csbBuses"
                name="Cumulative CSB buses"
                fill={AMBER}
                opacity={0.85}
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="age"
                type="monotone"
                dataKey="meanAge"
                name="Mean fleet age"
                stroke={SKY}
                strokeWidth={2.5}
                dot={{ r: 4, fill: SKY }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {view === "counterfactual" && (
        <ChartCard
          title="Observed mean age vs desk ‘without CSB’ path"
          subtitle="Adds back share × 16-year service life — illustrative arithmetic, not an EPA scenario"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={counterfactual}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="surveyYear" tick={{ fontSize: 11 }} />
              <YAxis domain={[7.5, 10.5]} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value, name) => {
                  const n = Number(value);
                  if (name === "observedMeanAge")
                    return [fmtAge(n), "Observed (SBF)"];
                  if (name === "withoutCsbMeanAge")
                    return [fmtAge(n), "Without CSB (desk)"];
                  if (name === "csbShareOfFleetPct")
                    return [fmtPct(n), "CSB share of fleet"];
                  return [String(value), String(name)];
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="withoutCsbMeanAge"
                name="Without CSB (desk)"
                stroke={ROSE}
                fill={ROSE}
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="observedMeanAge"
                name="Observed (SBF)"
                stroke={EMERALD}
                fill={EMERALD}
                fillOpacity={0.2}
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {view === "states" && (
        <ChartCard
          title="State award concentration"
          subtitle={`${stateRows.length} states in panel · awarded clean buses (horizontal)`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={stateRows}
              margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="short"
                width={36}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value, name) => {
                  const n = Number(value);
                  if (name === "awardedBuses")
                    return [fmtBuses(n), "Awarded buses"];
                  if (name === "shareOfFleet")
                    return [fmtPct(n), "Share of state fleet"];
                  return [String(value), String(name)];
                }}
                labelFormatter={(_, payload) => {
                  const row = payload?.[0]?.payload as
                    | (typeof stateRows)[number]
                    | undefined;
                  return row ? row.state : "";
                }}
              />
              <Bar
                dataKey="awardedBuses"
                name="Awarded buses"
                radius={[0, 4, 4, 0]}
              >
                {stateRows.map((s) => (
                  <Cell
                    key={s.stateCode}
                    fill={s.awardedBuses >= 1000 ? AMBER : INDIGO}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {view === "fuel" && (
        <div className="grid gap-4 md:grid-cols-2">
          <ChartCard
            title="National fuel mix (baseline)"
            subtitle="~90% diesel stock entering the CSB era — electric still a thin wedge"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={FUEL_MIX_BASELINE}
                  dataKey="sharePct"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={88}
                  paddingAngle={2}
                >
                  {FUEL_MIX_BASELINE.map((s) => (
                    <Cell
                      key={s.id}
                      fill={FUEL_COLORS[s.id] ?? SLATE}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [fmtPct(Number(value)), "Share"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="Cumulative award share of fleet"
            subtitle="Even at ~8,500 CSB units, replacements are &lt;2% of yellow stock"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dualData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 2.5]}
                />
                <Tooltip
                  formatter={(value) => [
                    fmtPct(Number(value)),
                    "CSB share of national fleet",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="sharePct"
                  name="CSB % of fleet"
                  stroke={AMBER}
                  fill={AMBER}
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {view === "rounds" && (
        <ChartCard
          title="EPA CSB award rounds (incremental buses)"
          subtitle="2022 rebates → 2023 grants → 2023 rebates; FY2024 closeout totals ~8,500"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={roundBars}
              margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} />
              <YAxis
                yAxisId="buses"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
              />
              <YAxis
                yAxisId="elec"
                orientation="right"
                domain={[80, 100]}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(value, name) => {
                  const n = Number(value);
                  if (name === "buses") return [fmtBuses(n), "Buses funded"];
                  if (name === "electricSharePct")
                    return [fmtPct(n), "Electric share"];
                  if (name === "dollarsM") return [`$${n}M`, "Award dollars"];
                  return [String(value), String(name)];
                }}
              />
              <Legend />
              <Bar
                yAxisId="buses"
                dataKey="buses"
                name="Buses funded"
                fill={INDIGO}
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="elec"
                type="monotone"
                dataKey="electricSharePct"
                name="Electric share %"
                stroke={EMERALD}
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {view === "bands" && (
        <ChartCard
          title="Illustrative age-band shares"
          subtitle="Rose bars mark the diesel tail CSB scrappage typically targets (MY2010-or-older)"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={bandBars}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(value) => [fmtPct(Number(value)), "Share of stock"]}
              />
              <Bar dataKey="sharePct" name="Share of stock" radius={[4, 4, 0, 0]}>
                {bandBars.map((b) => (
                  <Cell key={b.label} fill={b.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      <p className="text-[11px] leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
