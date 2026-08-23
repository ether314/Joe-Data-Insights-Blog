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
  CHANNEL_SPLITS,
  EXIT_PRESSURE,
  HEADLINE,
  NATIONAL_CONTEXT,
  PACE_LADDER,
  SOURCE_NOTE,
  SOURCES,
  STATE_COMPARE,
  fmtM,
  fmtPct,
  fmtPp,
  seriesFor,
  type StateId,
} from "@/data/admitted-homeowners-insurers-exiting-coastal-states-2026-data";

// viz-types: residual share composed, channel stacked bars, exit-pressure scatter, pace horizontal bars, channel pie | layout: default

type ViewId = "timeline" | "channels" | "pressure" | "pace" | "mix";
type SeriesMetric =
  | "residualPremiumSharePct"
  | "admittedPremiumSharePct"
  | "residualPolicies";

const SKY = "#0ea5e9";
const AMBER = "#f59e0b";
const ROSE = "#f43f5e";
const EMERALD = "#10b981";
const SLATE = "#64748b";

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
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
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

export function AdmittedHomeownersInsurersExitingCoastalStates2026Dashboard() {
  const [view, setView] = useState<ViewId>("timeline");
  const [stateId, setStateId] = useState<StateId>("FL");
  const [metric, setMetric] =
    useState<SeriesMetric>("residualPremiumSharePct");
  const [channelYear, setChannelYear] = useState<2018 | 2023>(2023);

  const series = useMemo(() => seriesFor(stateId), [stateId]);
  const stateMeta = STATE_COMPARE.find((s) => s.id === stateId)!;

  const timelineData = useMemo(
    () =>
      series.map((r) => ({
        year: r.year,
        residualShare: r.residualPremiumSharePct,
        admittedShare: r.admittedPremiumSharePct,
        policiesK: Math.round(r.residualPolicies / 1000),
        premiumM: r.residualPremiumM,
      })),
    [series],
  );

  const channelBars = useMemo(
    () =>
      CHANNEL_SPLITS.filter((c) => c.year === channelYear).map((r) => ({
        state: STATE_COMPARE.find((s) => s.id === r.state)?.short ?? r.state,
        Admitted: r.admittedPct,
        Residual: r.residualPct,
        Surplus: r.surplusPct,
      })),
    [channelYear],
  );

  const scatterData = useMemo(
    () =>
      EXIT_PRESSURE.map((e) => ({
        ...e,
        x: e.appetiteIndex,
        y: e.residualSharePct,
        z: e.nonrenewalPressure,
        fill: e.state === "FL" ? SKY : e.state === "CA" ? AMBER : ROSE,
      })),
    [],
  );

  const paceBars = useMemo(
    () =>
      [...PACE_LADDER].sort(
        (a, b) => Math.abs(b.ppPerYear) - Math.abs(a.ppPerYear),
      ),
    [],
  );

  const mixPie = useMemo(() => {
    const row = CHANNEL_SPLITS.find(
      (c) => c.state === stateId && c.year === channelYear,
    );
    if (!row) return [];
    return [
      { name: "Admitted", value: row.admittedPct, fill: EMERALD },
      { name: "Residual", value: row.residualPct, fill: ROSE },
      { name: "Surplus", value: row.surplusPct, fill: AMBER },
    ];
  }, [stateId, channelYear]);

  const yKey =
    metric === "residualPremiumSharePct"
      ? "residualShare"
      : metric === "admittedPremiumSharePct"
        ? "admittedShare"
        : "policiesK";

  const yLabel =
    metric === "residualPolicies"
      ? "Residual policies (thousands)"
      : metric === "admittedPremiumSharePct"
        ? "Admitted premium share (%)"
        : "Residual premium share (%)";

  return (
    <div
      className="space-y-6"
      data-viz="admitted-homeowners-insurers-exiting-coastal-states-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-300">
          Finance · property insurance retreat
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Admitted HO premium → residual markets
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">
          Florida Citizens residual premium share rose from{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.flResidualPremiumShare2018Pct)}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-amber-300">
            {fmtPct(HEADLINE.flResidualPremiumShare2023Pct)}
          </span>{" "}
          ({fmtPp(HEADLINE.flResidualPremiumShareDeltaPp, 0)}) in five years —
          the fastest coastal absorption among the three residual books.
          California FAIR policy share climbed to{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.caFairPolicyShare2023Pct, 1)}
          </span>
          ; Louisiana Citizens reached roughly{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.laCitizensMarketSharePct)}
          </span>{" "}
          of the property market after Laura/Ida.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {NATIONAL_CONTEXT.map((n) => (
            <div
              key={n.metric}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                {n.metric}
              </p>
              <p className="mt-1 text-xl font-bold text-white">
                {n.value}
                {n.unit}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-400">
                {n.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={view}
          onChange={setView}
          options={[
            { id: "timeline", label: "Share path" },
            { id: "channels", label: "Channel mix" },
            { id: "pressure", label: "Exit pressure" },
            { id: "pace", label: "Pace ladder" },
            { id: "mix", label: "State mix" },
          ]}
        />
        <div className="flex flex-wrap gap-3">
          <ToggleGroup
            label="State"
            value={stateId}
            onChange={setStateId}
            options={[
              { id: "FL", label: "Florida" },
              { id: "CA", label: "California" },
              { id: "LA", label: "Louisiana" },
            ]}
          />
          {view === "timeline" ? (
            <ToggleGroup
              label="Metric"
              value={metric}
              onChange={setMetric}
              options={[
                { id: "residualPremiumSharePct", label: "Residual %" },
                { id: "admittedPremiumSharePct", label: "Admitted %" },
                { id: "residualPolicies", label: "Policies" },
              ]}
            />
          ) : null}
          {view === "channels" || view === "mix" ? (
            <ToggleGroup
              label="Year"
              value={String(channelYear) as "2018" | "2023"}
              onChange={(v) => setChannelYear(Number(v) as 2018 | 2023)}
              options={[
                { id: "2018", label: "2018" },
                { id: "2023", label: "2023" },
              ]}
            />
          ) : null}
        </div>
      </div>

      {view === "timeline" ? (
        <ChartCard
          title={`${stateMeta.label} ${stateMeta.residualName} — ${yLabel}`}
          subtitle={`Peak residual premium share ${fmtPct(stateMeta.premiumSharePeakPct, 1)} in ${stateMeta.peakYear}; latest ${fmtPct(stateMeta.premiumShareLatestPct, 1)} (${stateMeta.latestYear}).`}
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={timelineData}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis tick={{ fill: SLATE, fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey={yKey}
                  fill={stateMeta.fill}
                  fillOpacity={0.18}
                  stroke="none"
                />
                <Line
                  type="monotone"
                  dataKey={yKey}
                  stroke={stateMeta.fill}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: stateMeta.fill }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Latest residual premium{" "}
            {fmtM(series[series.length - 1]?.residualPremiumM ?? 0)}. Estimated
            years are labeled in the data module.
          </p>
        </ChartCard>
      ) : null}

      {view === "channels" ? (
        <ChartCard
          title={`Admitted · residual · surplus mix (${channelYear})`}
          subtitle="Surplus shares estimated where DOI reports do not split premium."
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={channelBars}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="state" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: SLATE, fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="Admitted" stackId="a" fill={EMERALD} />
                <Bar dataKey="Residual" stackId="a" fill={ROSE} />
                <Bar
                  dataKey="Surplus"
                  stackId="a"
                  fill={AMBER}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "pressure" ? (
        <ChartCard
          title="Exit pressure: admitted appetite vs residual share"
          subtitle="X = admitted appetite index (2018 = 100). Y = residual share %. Bubble = non-renewal pressure."
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Appetite"
                  domain={[30, 90]}
                  tick={{ fill: SLATE, fontSize: 12 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Residual %"
                  tick={{ fill: SLATE, fontSize: 12 }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const d = payload[0].payload as (typeof scatterData)[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
                        <p className="font-semibold text-slate-900">{d.label}</p>
                        <p className="text-slate-600">
                          Appetite {d.appetiteIndex}
                        </p>
                        <p className="text-slate-600">
                          Residual {fmtPct(d.residualSharePct, 1)}
                        </p>
                        <p className="text-slate-600">
                          Non-renewal pressure {d.nonrenewalPressure}
                        </p>
                        <p className="mt-1 text-slate-500">{d.note}</p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatterData} name="Markets">
                  {scatterData.map((d) => (
                    <Cell key={d.id} fill={d.fill} fillOpacity={0.85} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "pace" ? (
        <ChartCard
          title="How fast residual share moved"
          subtitle="Percentage-point change per year (positive = residual grew)."
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={paceBars}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={170}
                  tick={{ fill: SLATE, fontSize: 11 }}
                />
                <Tooltip />
                <Bar dataKey="ppPerYear" radius={[0, 4, 4, 0]}>
                  {paceBars.map((p) => (
                    <Cell
                      key={p.label}
                      fill={p.ppPerYear >= 0 ? ROSE : EMERALD}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "mix" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={`${stateMeta.label} channel pie · ${channelYear}`}
            subtitle="Toggle state and year above."
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mixPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {mixPie.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Cross-state residual peak comparison"
            subtitle="2018 baseline vs peak residual premium share."
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={STATE_COMPARE.map((s) => ({
                    state: s.short,
                    "2018": s.premiumShare2018Pct,
                    Peak: s.premiumSharePeakPct,
                    Latest: s.premiumShareLatestPct,
                  }))}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="state" tick={{ fill: SLATE, fontSize: 12 }} />
                  <YAxis
                    tick={{ fill: SLATE, fontSize: 12 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="2018" fill={SLATE} />
                  <Bar dataKey="Peak" fill={ROSE} />
                  <Bar dataKey="Latest" fill={SKY} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-800">Sources & caveats</p>
        <p className="mt-1 leading-relaxed">{SOURCE_NOTE}</p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-700 underline-offset-2 hover:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
