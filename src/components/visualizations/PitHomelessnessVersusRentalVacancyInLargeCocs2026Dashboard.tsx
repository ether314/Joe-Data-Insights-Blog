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
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ASSISTED_HOUSING_CONTEXT,
  COCS,
  FORMULA,
  HEADLINE,
  NATIONAL_VACANCY_TREND,
  REGION_AVG,
  SOURCE_NOTE,
  VACANCY_BINS,
  VIZ_MARKERS,
  filterCocs,
  sortCocs,
  type CocRow,
  type RegionFilter,
  type SortMetric,
} from "@/data/pit-homelessness-versus-rental-vacancy-in-large-cocs-2026-data";

// viz-types: PIT×vacancy scatter, dual-rank bars, national vacancy area,
// vacancy-bin avg PIT, assisted-housing pie, regional dual metrics | layout: default
// smoke-marker: PIT count vs home-state rental vacancy

type ViewId = "scatter" | "dual" | "trend" | "bins" | "assisted" | "regions";

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SKY = "#0284c7";
const VIOLET = "#7c3aed";
const SLATE = "#64748b";

const REGION_COLORS: Record<string, string> = {
  Northeast: SKY,
  South: ROSE,
  Midwest: AMBER,
  West: TEAL,
};

const PIE_COLORS = [TEAL, AMBER, VIOLET];

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

function formatPit(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}

export function PitHomelessnessVersusRentalVacancyInLargeCocs2026Dashboard() {
  const [view, setView] = useState<ViewId>("scatter");
  const [region, setRegion] = useState<RegionFilter>("All");
  const [sortMetric, setSortMetric] = useState<SortMetric>("pitTotal");
  const [includeMegacocs, setIncludeMegacocs] = useState(true);
  const [descending, setDescending] = useState(true);

  const rows = useMemo(() => {
    let list = filterCocs(region);
    if (!includeMegacocs) {
      list = list.filter((c) => c.id !== "nyc" && c.id !== "la");
    }
    return sortCocs(list, sortMetric, descending);
  }, [region, includeMegacocs, sortMetric, descending]);

  const scatterData = useMemo(
    () =>
      rows.map((c) => ({
        x: c.stateVacancyPct,
        y: c.pitTotal,
        z: c.shelteredSharePct ?? 55,
        name: c.shortName,
        region: c.region,
        fill: REGION_COLORS[c.region],
      })),
    [rows],
  );

  const dualData = useMemo(
    () =>
      rows.slice(0, 14).map((c) => ({
        label: c.shortName,
        pitK: +(c.pitTotal / 1000).toFixed(1),
        vacancy: c.stateVacancyPct,
        region: c.region,
      })),
    [rows],
  );

  const regionData = useMemo(
    () =>
      REGION_AVG.map((r) => ({
        region: r.region,
        avgPitK: +(r.avgPit / 1000).toFixed(1),
        avgVacancy: r.avgVacancyPct,
        cocs: r.cocCount,
      })),
    [],
  );

  const binData = useMemo(
    () =>
      VACANCY_BINS.map((b) => ({
        bin: b.label,
        avgPitK: +(b.avgPit / 1000).toFixed(1),
        cocs: b.count,
      })),
    [],
  );

  const pieData = useMemo(
    () =>
      ASSISTED_HOUSING_CONTEXT.map((p) => ({
        name: p.program,
        value: p.shareOfAssistedPct,
      })),
    [],
  );

  const tableRows: CocRow[] = useMemo(() => rows.slice(0, 12), [rows]);

  return (
    <div
      className="space-y-6"
      data-viz="pit-homelessness-versus-rental-vacancy-in-large-cocs-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 p-5 text-white sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
          HUD PIT × Census HVS
        </p>
        <h2 className="mt-1 text-xl font-bold sm:text-2xl">
          {VIZ_MARKERS[0]}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          {HEADLINE.topCoc} prints the largest January 2025 PIT (
          {HEADLINE.topPit.toLocaleString()}) while its home-state HVS rental
          vacancy sits at {HEADLINE.topStateVacancyPct}% — not the tightest
          reading among large-CoC states. California CoCs stack high PIT totals
          against a {HEADLINE.caVacancyPct}% state vacancy; Texas metros sit
          lower on the PIT ladder with ~11% vacancy.{" "}
          {VIZ_MARKERS[1]}.
        </p>
        <p className="mt-3 font-mono text-xs text-slate-400">{FORMULA}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup<ViewId>
          value={view}
          onChange={setView}
          options={[
            { id: "scatter", label: "PIT × vacancy" },
            { id: "dual", label: "Dual ranks" },
            { id: "trend", label: "National vacancy" },
            { id: "bins", label: "Vacancy bins" },
            { id: "assisted", label: "Assisted mix" },
            { id: "regions", label: "Regional avg" },
          ]}
        />
        <div className="flex flex-wrap gap-2">
          <ToggleGroup<RegionFilter>
            value={region}
            onChange={setRegion}
            options={[
              { id: "All", label: "All regions" },
              { id: "West", label: "West" },
              { id: "Northeast", label: "Northeast" },
              { id: "South", label: "South" },
              { id: "Midwest", label: "Midwest" },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup<SortMetric>
          value={sortMetric}
          onChange={setSortMetric}
          options={[
            { id: "pitTotal", label: "Sort by PIT" },
            { id: "stateVacancyPct", label: "Sort by vacancy" },
            { id: "pitPerVacancyPoint", label: "Sort by PIT/vacancy" },
          ]}
        />
        <button
          type="button"
          onClick={() => setDescending((d) => !d)}
          className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          {descending ? "High→low" : "Low→high"}
        </button>
        <button
          type="button"
          onClick={() => setIncludeMegacocs((v) => !v)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            includeMegacocs
              ? "bg-teal-700 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {includeMegacocs ? "NYC + LA on" : "NYC + LA off"}
        </button>
      </div>

      {view === "scatter" && (
        <ChartCard
          title="PIT count vs home-state rental vacancy"
          subtitle="Bubble size ≈ sheltered share when disclosed; color by Census region"
        >
          <div className="h-[420px] w-full">
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 12, right: 16, bottom: 12, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Vacancy"
                  unit="%"
                  domain={["dataMin - 0.5", "dataMax + 0.5"]}
                  tick={{ fill: SLATE, fontSize: 12 }}
                  label={{
                    value: "Primary-state HVS rental vacancy (%)",
                    position: "insideBottom",
                    offset: -4,
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="PIT"
                  tickFormatter={formatPit}
                  tick={{ fill: SLATE, fontSize: 12 }}
                  label={{
                    value: "January 2025 PIT",
                    angle: -90,
                    position: "insideLeft",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 320]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ payload }) => {
                    const p = payload?.[0]?.payload;
                    if (!p) return null;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow">
                        <p className="font-semibold text-slate-900">{p.name}</p>
                        <p className="text-slate-600">
                          PIT {p.y.toLocaleString()} · vacancy {p.x}%
                        </p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatterData} name="CoCs">
                  {scatterData.map((d) => (
                    <Cell key={d.name} fill={d.fill} fillOpacity={0.85} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "dual" && (
        <ChartCard
          title="PIT scale beside vacancy tightness"
          subtitle="Bars = PIT (thousands); line = home-state rental vacancy %"
        >
          <div className="h-[420px] w-full">
            <ResponsiveContainer>
              <ComposedChart
                data={dualData}
                margin={{ top: 12, right: 16, bottom: 48, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  interval={0}
                  angle={-32}
                  textAnchor="end"
                  height={70}
                  tick={{ fill: SLATE, fontSize: 11 }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  label={{
                    value: "PIT (000s)",
                    angle: -90,
                    position: "insideLeft",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  unit="%"
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="pitK"
                  name="PIT (000s)"
                  fill={NAVY}
                  radius={[4, 4, 0, 0]}
                >
                  {dualData.map((d) => (
                    <Cell key={d.label} fill={REGION_COLORS[d.region]} />
                  ))}
                </Bar>
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="vacancy"
                  name="Vacancy %"
                  stroke={AMBER}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: AMBER }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "trend" && (
        <ChartCard
          title="U.S. rental vacancy climbed into the mid-7s"
          subtitle="Census HVS national quarterly rental vacancy (FRED RRVRUSQ156N)"
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer>
              <AreaChart
                data={NATIONAL_VACANCY_TREND}
                margin={{ top: 12, right: 16, bottom: 8, left: 8 }}
              >
                <defs>
                  <linearGradient id="vacFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TEAL} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={TEAL} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="period"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  interval={2}
                />
                <YAxis
                  domain={[5, 8]}
                  unit="%"
                  tick={{ fill: SLATE, fontSize: 12 }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="vacancyPct"
                  name="Rental vacancy %"
                  stroke={TEAL}
                  fill="url(#vacFill)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "bins" && (
        <ChartCard
          title="Average PIT by vacancy band"
          subtitle="Large CoCs grouped by primary-state HVS rental vacancy"
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer>
              <BarChart
                data={binData}
                margin={{ top: 12, right: 16, bottom: 8, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="bin" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis tick={{ fill: SLATE, fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="avgPitK"
                  name="Avg PIT (000s)"
                  fill={VIOLET}
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="cocs"
                  name="CoC count"
                  fill={SKY}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "assisted" && (
        <ChartCard
          title="HUD assisted-housing program mix"
          subtitle="Picture of Subsidized Households framing — national structure, not CoC microdata"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-[340px] w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={110}
                    paddingAngle={3}
                    label={({ name, value }) => `${value}%`}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-3 self-center text-sm text-slate-600">
              {ASSISTED_HOUSING_CONTEXT.map((p) => (
                <li
                  key={p.program}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <p className="font-semibold text-slate-900">{p.program}</p>
                  <p className="mt-1">{p.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </ChartCard>
      )}

      {view === "regions" && (
        <ChartCard
          title="Regional average PIT and vacancy"
          subtitle="Panel of large CoCs only — West dominates both count and CA-tight vacancy"
        >
          <div className="h-[380px] w-full">
            <ResponsiveContainer>
              <BarChart
                data={regionData}
                margin={{ top: 12, right: 16, bottom: 8, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fill: SLATE, fontSize: 12 }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: SLATE, fontSize: 12 }}
                  unit="%"
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="avgPitK"
                  name="Avg PIT (000s)"
                  fill={NAVY}
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="avgVacancy"
                  name="Avg vacancy %"
                  fill={AMBER}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <ChartCard
        title="Large CoC panel"
        subtitle={`${rows.length} of ${COCS.length} Continuums · sort = ${sortMetric}`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">CoC</th>
                <th className="px-3 py-2">State</th>
                <th className="px-3 py-2 text-right">PIT</th>
                <th className="px-3 py-2 text-right">Vacancy %</th>
                <th className="px-3 py-2 text-right">PIT / vac. pt</th>
                <th className="px-3 py-2 text-right">Sheltered %</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((c) => (
                <tr key={c.id} className="border-b border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-900">
                    {c.shortName}
                  </td>
                  <td className="px-3 py-2 text-slate-600">{c.state}</td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {c.pitTotal.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {c.stateVacancyPct.toFixed(1)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {c.pitPerVacancyPoint.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-600">
                    {c.shelteredSharePct != null
                      ? c.shelteredSharePct.toFixed(1)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
