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
  ANALYTICS,
  BLOC_COMPARE,
  COUNTRY_SITES,
  HEADLINE,
  PHASE3_INITIATION_RANKS,
  REGION_PATH,
  SOURCE_NOTE,
  THERAPY_MIX,
  type CountrySiteRow,
} from "@/data/pivotal-trial-sites-by-country-2026-data";

type Metric = "countryUsePct" | "facilityPct";

const COLORS = {
  us: "#1d4ed8",
  china: "#dc2626",
  europe: "#059669",
  row: "#64748b",
  accent: "#0f766e",
  muted: "#94a3b8",
  top3: "#f59e0b",
};

const REGION_COLORS: Record<string, string> = {
  "North America": "#1d4ed8",
  "East Asia": "#dc2626",
  "Western Europe": "#059669",
  "Eastern Europe": "#10b981",
  "Latin America": "#d97706",
  Oceania: "#7c3aed",
  "South Asia": "#db2777",
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

function metricValue(row: CountrySiteRow, metric: Metric): number {
  if (metric === "facilityPct") return row.facilityPct ?? 0;
  return row.countryUsePct;
}

export function PivotalTrialSitesByCountry2026Dashboard() {
  const [metric, setMetric] = useState<Metric>("countryUsePct");
  const [region, setRegion] = useState("All");
  const [therapy, setTherapy] = useState(THERAPY_MIX[0].therapy);
  const [initYear, setInitYear] = useState<2023 | 2024>(2024);

  const regions = useMemo(
    () => ["All", ...Array.from(new Set(COUNTRY_SITES.map((r) => r.region)))],
    [],
  );

  const filtered = useMemo(() => {
    return COUNTRY_SITES.filter((r) => region === "All" || r.region === region)
      .map((r) => ({
        ...r,
        value: metricValue(r, metric),
        label: r.country.replace("United States", "US").replace("United Kingdom", "UK"),
      }))
      .filter((r) => r.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [metric, region]);

  const top3Share = useMemo(() => {
    const top = filtered.slice(0, 3);
    return {
      share: top.reduce((s, r) => s + r.value, 0),
      labels: top.map((t) => t.label).join(" · "),
    };
  }, [filtered]);

  const pieData = useMemo(() => {
    const top = filtered.slice(0, 3);
    const topShare = top.reduce((s, r) => s + r.value, 0);
    return [
      ...top.map((t, i) => ({
        name: t.label,
        value: t.value,
        fill: [COLORS.us, COLORS.china, COLORS.europe][i] ?? COLORS.accent,
      })),
      { name: "Rest of world", value: Math.max(0, 100 - topShare), fill: COLORS.muted },
    ];
  }, [filtered]);

  const scatterData = useMemo(
    () =>
      COUNTRY_SITES.filter((r) => region === "All" || r.region === region).map((r) => ({
        country: r.country,
        site: r.countryUsePct,
        daly: r.dalyPct,
        gap: r.gapRatio,
        fill: REGION_COLORS[r.region] ?? COLORS.muted,
      })),
    [region],
  );

  const therapyRow = THERAPY_MIX.find((t) => t.therapy === therapy) ?? THERAPY_MIX[0];
  const therapyBars = [
    { bloc: "US", pct: therapyRow.usPct, fill: COLORS.us },
    { bloc: "China", pct: therapyRow.chinaPct, fill: COLORS.china },
    { bloc: "Europe", pct: therapyRow.europePct, fill: COLORS.europe },
    { bloc: "RoW", pct: therapyRow.rowPct, fill: COLORS.row },
  ];

  const initiation = PHASE3_INITIATION_RANKS.filter((r) => r.year === initYear);

  const blocBars = BLOC_COMPARE.map((b) => ({
    bloc: b.bloc
      .replace("Western Europe", "W. Europe")
      .replace("Eastern Europe", "E. Europe")
      .replace("Sub-Saharan Africa", "SS Africa"),
    sites: b.siteSharePct,
    dalys: b.dalySharePct,
  }));

  return (
    <div className="space-y-6" data-viz="pivotal-trial-sites-by-country-2026">
      <div className="rounded-xl border border-teal-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-5 text-white shadow-sm sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
          Clinical development — site geography lens
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Top-3 country site share: {HEADLINE.top3CountryUsePct}% country-uses ·{" "}
          {HEADLINE.top3FacilityPct}% oncology facilities
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          US ({HEADLINE.usCountryUsePct}%) + China ({HEADLINE.chinaCountryUsePct}%) + Spain (
          {HEADLINE.spainCountryUsePct}%) on IQVIA-style country-uses; US + China + Germany on
          Phase III oncology facility census. Western Europe still leads as a bloc (
          {HEADLINE.westEuropePct}%) even after a {HEADLINE.westEuropeShareDeclinePct}% relative
          share decline since 2019.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-300">
          <span className="rounded-md bg-white/10 px-2.5 py-1">
            Top-10 uses {ANALYTICS.top10Use.toFixed(0)}%
          </span>
          <span className="rounded-md bg-white/10 px-2.5 py-1">HHI (uses) {ANALYTICS.hhiUse}</span>
          <span className="rounded-md bg-white/10 px-2.5 py-1">
            Africa gap ×{HEADLINE.africaGapRatio}
          </span>
          <span className="rounded-md bg-white/10 px-2.5 py-1">US gap ×{HEADLINE.usGapRatio}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Site metric
          <select
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900"
            value={metric}
            onChange={(e) => setMetric(e.target.value as Metric)}
          >
            <option value="countryUsePct">Country-use share (IQVIA)</option>
            <option value="facilityPct">Phase III oncology facilities</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Region filter
          <select
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Therapy lens
          <select
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900"
            value={therapy}
            onChange={(e) => setTherapy(e.target.value)}
          >
            {THERAPY_MIX.map((t) => (
              <option key={t.therapy} value={t.therapy}>
                {t.therapy}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Phase III initiation year
          <select
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900"
            value={initYear}
            onChange={(e) => setInitYear(Number(e.target.value) as 2023 | 2024)}
          >
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
          </select>
        </label>
        <p className="ml-auto text-xs text-slate-500">
          Filtered Top-3:{" "}
          <strong className="text-slate-800">{top3Share.share.toFixed(1)}%</strong> (
          {top3Share.labels || "—"})
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Country ladder — late-stage site share"
          subtitle={
            metric === "countryUsePct"
              ? "IQVIA-style pipeline country-use %"
              : "Unique Phase III oncology research facilities %"
          }
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filtered.slice(0, 12)} layout="vertical" margin={{ left: 8, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                <YAxis type="category" dataKey="label" width={72} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => [`${Number(v).toFixed(1)}%`, "Share"]}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {filtered.slice(0, 12).map((r) => (
                    <Cell
                      key={r.country}
                      fill={
                        ["United States", "China", "Spain"].includes(r.country)
                          ? COLORS.top3
                          : (REGION_COLORS[r.region] ?? COLORS.accent)
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Top-3 vs rest"
          subtitle="Concentration of the filtered metric in the three largest countries"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={100}
                  paddingAngle={2}
                  label={({ name, value }) => `${name} ${Number(value).toFixed(0)}%`}
                >
                  {pieData.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Regional country-use path (2019–2023)"
          subtitle="IQVIA regional utilization shares — Europe down, China and North America up"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REGION_PATH} margin={{ left: 0, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="westernEurope"
                  name="W. Europe"
                  stackId="1"
                  stroke="#059669"
                  fill="#059669"
                  fillOpacity={0.75}
                />
                <Area
                  type="monotone"
                  dataKey="easternEurope"
                  name="E. Europe"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.65}
                />
                <Area
                  type="monotone"
                  dataKey="northAmerica"
                  name="N. America"
                  stackId="1"
                  stroke="#1d4ed8"
                  fill="#1d4ed8"
                  fillOpacity={0.75}
                />
                <Area
                  type="monotone"
                  dataKey="china"
                  name="China"
                  stackId="1"
                  stroke="#dc2626"
                  fill="#dc2626"
                  fillOpacity={0.75}
                />
                <Area
                  type="monotone"
                  dataKey="restOfWorld"
                  name="RoW"
                  stackId="1"
                  stroke="#64748b"
                  fill="#64748b"
                  fillOpacity={0.55}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Site share vs disease burden"
          subtitle="Country-use % (x) against WHO-style DALY share % (y)"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: 4, right: 12, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" dataKey="site" name="Site %" unit="%" tick={{ fontSize: 11 }} />
                <YAxis type="number" dataKey="daly" name="DALY %" unit="%" tick={{ fontSize: 11 }} />
                <ZAxis type="number" dataKey="gap" range={[60, 200]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => [`${Number(v).toFixed(1)}`, String(name)]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.country ? String(payload[0].payload.country) : ""
                  }
                />
                <Scatter data={scatterData} name="Countries">
                  {scatterData.map((p) => (
                    <Cell key={p.country} fill={p.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Bloc mismatch — sites vs DALYs"
          subtitle="Grouped bars: trial country-use share versus disease-burden share"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={blocBars} margin={{ left: 0, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="bloc"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={56}
                />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip />
                <Legend />
                <Bar dataKey="sites" name="Site share" fill={COLORS.accent} radius={[4, 4, 0, 0]} />
                <Bar dataKey="dalys" name="DALY share" fill={COLORS.muted} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title={`Therapy geography — ${therapy}`}
          subtitle="Illustrative Phase III site mix by major bloc (desk roll-up)"
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={therapyBars}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="bloc" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip formatter={(v) => `${Number(v).toFixed(0)}%`} />
                <Bar dataKey="pct" name="Site mix %" radius={[6, 6, 0, 0]}>
                  {therapyBars.map((b) => (
                    <Cell key={b.bloc} fill={b.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title={`Phase III industry initiation ranks — ${initYear}`}
        subtitle="ABPI/Citeline stylized counts: China overtook the US on Phase III starts in 2024"
      >
        <div className="h-64 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={initiation} margin={{ left: 8, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="country" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="initiations" name="Initiations" fill={COLORS.us} radius={[6, 6, 0, 0]} />
              <Line type="monotone" dataKey="rank" name="Rank" stroke={COLORS.top3} hide />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Rank order: {initiation.map((r) => `#${r.rank} ${r.country}`).join(" · ")}
        </p>
      </ChartCard>

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
