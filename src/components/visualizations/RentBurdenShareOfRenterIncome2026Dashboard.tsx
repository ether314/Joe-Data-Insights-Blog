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
  GEO_TIERS,
  HEADLINE,
  INCOME_BANDS,
  METRO_ROWS,
  NATIONAL_PATH,
  REGION_ROWS,
  SOURCE_NOTE,
  STATE_LADDER,
  burdenDelta,
  type Region,
} from "@/data/rent-burden-share-of-renter-income-2026-data";

type Panel = "ladder" | "vintage" | "path" | "income" | "geo";
type RegionFilter = "all" | Region;
type SortLens = "burden" | "severe" | "delta";

const COLORS = {
  burden: "#1d4ed8",
  severe: "#b91c1c",
  prior: "#94a3b8",
  path: "#0f766e",
  deltaPos: "#c2410c",
  deltaNeg: "#0f766e",
  pie: ["#1d4ed8", "#0f766e", "#c2410c", "#64748b"],
  region: {
    South: "#c2410c",
    West: "#1d4ed8",
    Northeast: "#7c3aed",
    Midwest: "#0f766e",
  } as Record<Region, string>,
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

export function RentBurdenShareOfRenterIncome2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("ladder");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [sortLens, setSortLens] = useState<SortLens>("burden");

  const filtered = useMemo(() => {
    return METRO_ROWS.filter((m) => (region === "all" ? true : m.region === region));
  }, [region]);

  const ladderData = useMemo(() => {
    const rows = filtered.map((m) => ({
      metro: m.metro.replace(", FL", "").replace(", CA", "").replace(", NV", "").replace(", LA", "").replace(", NY", "").replace(", MA", "").replace(", WA", "").replace(", GA", "").replace(", AZ", "").replace(", CO", "").replace(", TX", "").replace(", IL", "").replace(", PA", "").replace(", IA", "").replace(", KS", ""),
      full: m.metro,
      burden: m.burdenPct2023,
      severe: m.severePct2023,
      delta: burdenDelta(m),
      region: m.region,
    }));
    rows.sort((a, b) => {
      if (sortLens === "severe") return b.severe - a.severe;
      if (sortLens === "delta") return b.delta - a.delta;
      return b.burden - a.burden;
    });
    return rows;
  }, [filtered, sortLens]);

  const scatterData = useMemo(
    () =>
      filtered.map((m) => ({
        id: m.id,
        metro: m.metro,
        x: m.burdenPct2015,
        y: m.burdenPct2023,
        z: Math.max(40, Math.min(200, m.renterHhK / 8)),
        region: m.region,
        delta: burdenDelta(m),
      })),
    [filtered],
  );

  const pathData = useMemo(
    () =>
      NATIONAL_PATH.map((r) => ({
        year: String(r.year),
        burden: r.burdenPct,
        severe: r.severePct,
        households: r.burdenedM,
      })),
    [],
  );

  const incomeData = useMemo(
    () =>
      INCOME_BANDS.map((b) => ({
        band: b.band,
        moderate: Math.max(0, b.burdenPct - b.severePct),
        severe: b.severePct,
        total: b.burdenPct,
      })),
    [],
  );

  const regionDeltaData = useMemo(
    () =>
      REGION_ROWS.map((r) => ({
        region: r.region,
        pct2019: r.burdenPct2019,
        pct2023: r.burdenPct2023,
        delta: r.deltaPp,
      })),
    [],
  );

  const tierPie = useMemo(
    () => GEO_TIERS.map((t) => ({ name: t.tier, value: t.burdenPct })),
    [],
  );

  const stateData = useMemo(() => {
    const rows = [...STATE_LADDER].sort((a, b) => b.burdenPct - a.burdenPct);
    return rows.map((s) => ({
      state: s.state,
      burden: s.burdenPct,
      delta: s.deltaVs2019Pp,
    }));
  }, []);

  const panels: { id: Panel; label: string }[] = [
    { id: "ladder", label: "Metro ladder" },
    { id: "vintage", label: "2015 → 2023" },
    { id: "path", label: "National path" },
    { id: "income", label: "By income" },
    { id: "geo", label: "Regions & tiers" },
  ];

  return (
    <div
      className="not-prose my-8 w-full space-y-4"
      data-viz="rent-burden-share-of-renter-income-2026"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">
            Renters above 30% of income
          </p>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            ACS / JCHS gross-rent burden shares — toggle panels, filter by Census
            region, and re-rank metros by burden, severe burden, or 2015→2023 delta.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
            Region
            <select
              className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"
              value={region}
              onChange={(e) => setRegion(e.target.value as RegionFilter)}
              aria-label="Region filter"
            >
              <option value="all">All regions</option>
              <option value="South">South</option>
              <option value="West">West</option>
              <option value="Northeast">Northeast</option>
              <option value="Midwest">Midwest</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
            Sort metros by
            <select
              className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"
              value={sortLens}
              onChange={(e) => setSortLens(e.target.value as SortLens)}
              aria-label="Sort lens"
            >
              <option value="burden">Burden &gt;30%</option>
              <option value="severe">Severe &gt;50%</option>
              <option value="delta">2015→2023 Δ</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Dashboard panels">
        {panels.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={panel === p.id}
            onClick={() => setPanel(p.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              panel === p.id
                ? "bg-blue-700 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-blue-800">
            U.S. burden 2023
          </p>
          <p className="text-2xl font-bold text-blue-950">
            {HEADLINE.nationalBurdenPct2023}%
            <span className="text-sm font-medium text-blue-700">
              {" "}
              · {HEADLINE.burdenedHouseholdsM}M hh
            </span>
          </p>
        </div>
        <div className="rounded-lg border border-red-100 bg-red-50/60 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-red-800">
            Severe (&gt;50%)
          </p>
          <p className="text-2xl font-bold text-red-950">
            {HEADLINE.nationalSeverePct2023}%
            <span className="text-sm font-medium text-red-700">
              {" "}
              · {HEADLINE.severeHouseholdsM}M hh
            </span>
          </p>
        </div>
        <div className="rounded-lg border border-orange-100 bg-orange-50/60 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-orange-800">
            Top metro (Cape Coral)
          </p>
          <p className="text-2xl font-bold text-orange-950">
            {HEADLINE.capeCoralBurdenPct}%
            <span className="text-sm font-medium text-orange-700">
              {" "}
              · Miami {HEADLINE.miamiBurdenPct}%
            </span>
          </p>
        </div>
      </div>

      {panel === "ladder" ? (
        <ChartCard
          title="Metro cost-burden ladder"
          subtitle="Share of renter households spending >30% (and >50%) of income on rent + utilities · filters apply"
        >
          <div className="h-[480px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={ladderData}
                margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 70]} tick={{ fontSize: 11 }} unit="%" />
                <YAxis type="category" dataKey="metro" width={100} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v, name) => [
                    typeof v === "number" ? `${v}%` : String(v ?? ""),
                    String(name),
                  ]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.full ?? ""
                  }
                />
                <Legend />
                <Bar dataKey="burden" name="Burden >30%" fill={COLORS.burden} radius={[0, 4, 4, 0]} />
                <Bar dataKey="severe" name="Severe >50%" fill={COLORS.severe} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "vintage" ? (
        <ChartCard
          title="2015 → 2023 vintage scatter"
          subtitle="Points above the diagonal worsened · bubble size ≈ renter households · color by region"
        >
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="2015"
                  domain={[38, 68]}
                  tick={{ fontSize: 11 }}
                  label={{ value: "2015 burden %", position: "insideBottom", offset: -2, fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="2023"
                  domain={[38, 68]}
                  tick={{ fontSize: 11 }}
                  label={{ value: "2023 burden %", angle: -90, position: "insideLeft", fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => [
                    typeof v === "number" ? `${v}%` : String(v ?? ""),
                    String(name),
                  ]}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.metro ?? ""}
                />
                <Scatter name="Metros" data={scatterData}>
                  {scatterData.map((d) => (
                    <Cell key={d.id} fill={COLORS.region[d.region as Region]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Median panel delta {ANALYTICS.medianMetroDeltaPp} pp · max +{ANALYTICS.maxMetroDeltaPp} pp
            (Cape Coral).
          </p>
        </ChartCard>
      ) : null}

      {panel === "path" ? (
        <ChartCard
          title="National renter burden path"
          subtitle="ACS/JCHS series · 2020 omitted · area = burden share, line = severe share"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={pathData} margin={{ top: 8, right: 16, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis domain={[20, 55]} tick={{ fontSize: 11 }} unit="%" />
                <Tooltip
                  formatter={(v, name) => [
                    typeof v === "number" ? `${v}%` : String(v ?? ""),
                    String(name),
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="burden"
                  name="Burden >30%"
                  fill={COLORS.path}
                  stroke={COLORS.path}
                  fillOpacity={0.25}
                />
                <Line
                  type="monotone"
                  dataKey="severe"
                  name="Severe >50%"
                  stroke={COLORS.severe}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "income" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Burden by income band (2023)"
            subtitle="Stacked moderate (30–50%) + severe (>50%) as share of renters in band"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeData} margin={{ top: 8, right: 8, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="band" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip
                    formatter={(v, name) => [
                      typeof v === "number" ? `${v}%` : String(v ?? ""),
                      String(name),
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="moderate" stackId="a" name="Moderate 30–50%" fill={COLORS.burden} />
                  <Bar
                    dataKey="severe"
                    stackId="a"
                    name="Severe >50%"
                    fill={COLORS.severe}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="State burden ladder (selected)"
            subtitle="Highest and lowest state rates · bar = 2023 share"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={stateData}
                  margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[30, 65]} tick={{ fontSize: 11 }} unit="%" />
                  <YAxis type="category" dataKey="state" width={100} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v, name) => [
                      typeof v === "number" ? `${v}${name === "Δ vs 2019" ? " pp" : "%"}` : String(v ?? ""),
                      String(name),
                    ]}
                  />
                  <Bar dataKey="burden" name="Burden 2023" radius={[0, 4, 4, 0]}>
                    {stateData.map((d) => (
                      <Cell
                        key={d.state}
                        fill={d.delta >= 0 ? COLORS.deltaPos : COLORS.deltaNeg}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {panel === "geo" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Census region: 2019 vs 2023"
            subtitle="South posted the largest pandemic-era jump (+4.2 pp)"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionDeltaData} margin={{ top: 8, right: 8, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                  <YAxis domain={[35, 55]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip
                    formatter={(v, name) => [
                      typeof v === "number" ? `${v}%` : String(v ?? ""),
                      String(name),
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="pct2019" name="2019" fill={COLORS.prior} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pct2023" name="2023" fill={COLORS.burden} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Geography-tier burden rates"
            subtitle="Largest metros 51% · rural 39% — still nearly two-in-five rural renters"
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tierPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={110}
                    paddingAngle={2}
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {tierPie.map((_, i) => (
                      <Cell key={i} fill={COLORS.pie[i % COLORS.pie.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, "Burden share"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
