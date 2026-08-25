"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  HEADLINE,
  PARTICIPATION_PATH,
  PLATFORM_TYPES,
  RELIANCE_BANDS,
  SECTOR_INCOME_SHARE,
  SECTOR_MEDIAN_EARN,
  SECTOR_PARTICIPATION,
  SHED_ATTITUDES,
  SHED_MIX,
  SOURCE_NOTE,
  SUB_SUPPLEMENT,
  SWING_SCENARIOS,
} from "@/data/platform-earnings-swings-and-household-reliance-2026-data";

type Panel =
  | "participation"
  | "swings"
  | "reliance"
  | "sectors"
  | "substitute"
  | "shed";

const COLORS = {
  labor: "#0f766e",
  capital: "#b45309",
  monthly: "#1e3a5f",
  trailing: "#64748b",
  transport: "#0d9488",
  nonTransport: "#1e40af",
  selling: "#ea580c",
  leasing: "#7c3aed",
  majority: "#dc2626",
  secondary: "#64748b",
  accent: "#0f172a",
  flex: "#15803d",
  wish: "#c2410c",
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

export function PlatformEarningsSwingsAndHouseholdReliance2026Dashboard() {
  const [panel, setPanel] = useState<Panel>("swings");
  const [platformFilter, setPlatformFilter] = useState<"both" | "labor" | "capital">(
    "both",
  );

  const relianceChart = useMemo(() => {
    return RELIANCE_BANDS.map((r) => ({
      band: r.bandShort,
      Labor: platformFilter === "capital" ? 0 : r.laborPct,
      Capital: platformFilter === "labor" ? 0 : r.capitalPct,
      showLabor: platformFilter !== "capital",
      showCapital: platformFilter !== "labor",
    }));
  }, [platformFilter]);

  const panels: { id: Panel; label: string }[] = [
    { id: "swings", label: "Earnings swings" },
    { id: "reliance", label: "Reliance bands" },
    { id: "participation", label: "Participation path" },
    { id: "sectors", label: "Sector medians" },
    { id: "substitute", label: "Substitute vs supplement" },
    { id: "shed", label: "Fed SHED attitudes" },
  ];

  return (
    <div
      className="w-full min-w-0 space-y-4"
      data-viz="platform-earnings-swings-and-household-reliance-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-teal-50/40 p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Month-over-month platform earnings swing
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Labor platforms active {HEADLINE.laborActiveMonthsPct}% of months
          <span className="text-lg font-semibold text-slate-600 sm:text-xl">
            {" "}
            — ${HEADLINE.laborAvgActiveEarn} avg (
            {HEADLINE.laborShareOfIncomePct}% of income) when working
          </span>
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Labor active months vs reliance tail: {HEADLINE.laborRelianceGt75Pct}% of
          active labor participants earned &gt;75% of income from platforms (Sep
          2015). Household reliance · majority paycheck? Median pandemic-era
          drivers sat near {HEADLINE.medianDriverSharePct}% of family income —
          secondary for the median, majority for a thick left tail.
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

      {panel === "swings" ? (
        <ChartCard
          title="Implied month-to-month platform earnings swings"
          subtitle="Idle months are the main swing: labor participants earn in only 56% of months after first entry (JPMCI 2016). Driver Apr '20 shows within-active volatility."
        >
          <div className="h-[340px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={SWING_SCENARIOS.map((s) => ({
                  name: s.scenario.replace(": ", "\n"),
                  short: s.scenario.split(":")[0],
                  swing: s.absSwingPct,
                  a: s.monthA,
                  b: s.monthB,
                }))}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  domain={[0, 110]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={110}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v) => [`${Number(v)}% abs MoM`, "Swing"]}
                  labelFormatter={(_, payload) =>
                    String(payload?.[0]?.payload?.name ?? "").replace("\n", ": ")
                  }
                />
                <Bar dataKey="swing" name="Abs MoM swing %" radius={[0, 4, 4, 0]}>
                  {SWING_SCENARIOS.map((s, i) => (
                    <Cell
                      key={s.scenario}
                      fill={
                        i < 2
                          ? COLORS.majority
                          : i === 2
                            ? COLORS.transport
                            : COLORS.secondary
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            {SWING_SCENARIOS.map((s) => (
              <li key={s.scenario} className="rounded-lg bg-slate-50 px-3 py-2">
                <span className="font-semibold text-slate-800">{s.scenario}</span>
                <span className="block text-xs text-slate-500">
                  ${s.monthA} → ${s.monthB} · {s.note}
                </span>
              </li>
            ))}
          </ul>
        </ChartCard>
      ) : null}

      {panel === "reliance" ? (
        <>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-medium text-slate-600">Platform filter</span>
            {(
              [
                ["both", "Both"],
                ["labor", "Labor"],
                ["capital", "Capital"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setPlatformFilter(id)}
                className={`rounded-lg px-3 py-1.5 font-medium ${
                  platformFilter === id
                    ? "bg-teal-800 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <ChartCard
            title="Share of active participants by platform income reliance"
            subtitle="Sep 2015 JPMCI: 25% of active labor participants relied on platforms for >75% of total income (majority-paycheck tail)."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={relianceChart} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="band" tick={{ fontSize: 12 }} />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 12 }}
                    domain={[0, 80]}
                  />
                  <Tooltip formatter={(v) => [`${Number(v)}%`, ""]} />
                  <Legend />
                  {platformFilter !== "capital" && (
                    <Bar dataKey="Labor" fill={COLORS.labor} radius={[4, 4, 0, 0]} />
                  )}
                  {platformFilter !== "labor" && (
                    <Bar
                      dataKey="Capital"
                      fill={COLORS.capital}
                      radius={[4, 4, 0, 0]}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {PLATFORM_TYPES.map((p) => (
                <div
                  key={p.platform}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <p className="text-sm font-bold text-slate-900">{p.platform}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    Active {p.activeMonthsPct}% of months · ${p.avgEarnActive} avg (
                    {p.shareOfIncomePct}% of income) · {p.relianceGt75Pct}% at
                    &gt;75% reliance
                  </p>
                </div>
              ))}
            </div>
          </ChartCard>
        </>
      ) : null}

      {panel === "participation" ? (
        <ChartCard
          title="Monthly vs trailing-year Online Platform Economy participation"
          subtitle="JPMCI Chase families Apr 2018–Jun 2021. Peak monthly 2.5%; −25% MoM at pandemic onset (to 1.9%); trailing-year near 7.5%."
        >
          <div className="h-[340px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={PARTICIPATION_PATH}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 12 }}
                  domain={[0, 9]}
                />
                <Tooltip formatter={(v) => [`${Number(v)}%`, ""]} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="monthlyPct"
                  name="Monthly %"
                  stroke={COLORS.monthly}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="trailing12mPct"
                  name="Trailing 12m %"
                  stroke={COLORS.trailing}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 h-[260px] w-full min-w-0">
            <p className="mb-2 text-sm font-semibold text-slate-700">
              Sector monthly participation rates
            </p>
            <ResponsiveContainer width="100%" height="90%">
              <ComposedChart
                data={SECTOR_PARTICIPATION}
                margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${Number(v)}%`, ""]} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="transport"
                  name="Transport"
                  stroke={COLORS.transport}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="selling"
                  name="Selling"
                  stroke={COLORS.selling}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="leasing"
                  name="Leasing"
                  stroke={COLORS.leasing}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="nonTransport"
                  name="Non-transport work"
                  stroke={COLORS.nonTransport}
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {panel === "sectors" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Median monthly platform revenue (actives)"
            subtitle="Drivers ~$400–500 when active; −40% in Apr 2020 among remaining drivers."
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={SECTOR_MEDIAN_EARN}
                  margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`$${Number(v)}`, ""]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="transport"
                    name="Transport"
                    stroke={COLORS.transport}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="nonTransport"
                    name="Non-transport"
                    stroke={COLORS.nonTransport}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="leasing"
                    name="Leasing"
                    stroke={COLORS.leasing}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="selling"
                    name="Selling"
                    stroke={COLORS.selling}
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Median platform share of family income"
            subtitle="Median driver ≈10% — secondary paycheck. Lessors highest share; sellers ~1–2%."
          >
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={SECTOR_INCOME_SHARE}
                  margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11 }}
                    domain={[0, 25]}
                  />
                  <Tooltip formatter={(v) => [`${Number(v)}%`, ""]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="transport"
                    name="Transport"
                    stroke={COLORS.transport}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="leasing"
                    name="Leasing"
                    stroke={COLORS.leasing}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="nonTransport"
                    name="Non-transport"
                    stroke={COLORS.nonTransport}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="selling"
                    name="Selling"
                    stroke={COLORS.selling}
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {panel === "substitute" ? (
        <ChartCard
          title="Labor substitutes; capital supplements"
          subtitle="In months with platform earnings vs months without (JPMCI 2016). Labor offsets a 14% non-platform shortfall; capital adds ~7% on top."
        >
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={SUB_SUPPLEMENT.map((r) => ({
                  platform: r.platform,
                  "Non-platform Δ%": r.nonPlatformIncomeDeltaPct,
                  "Platform contribution %": r.platformContributionPct,
                  "Total income Δ%": r.totalIncomeDeltaPct,
                }))}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="platform" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [`${Number(v)}%`, ""]} />
                <Legend />
                <Bar
                  dataKey="Non-platform Δ%"
                  fill={COLORS.majority}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Platform contribution %"
                  fill={COLORS.labor}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Total income Δ%"
                  fill={COLORS.capital}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            {SUB_SUPPLEMENT.map((r) => `${r.platform}: ${r.note}`).join(" · ")}
          </p>
        </ChartCard>
      ) : null}

      {panel === "shed" ? (
        <div className="space-y-4">
          <ChartCard
            title="Fed SHED 2024 — who does gig activities"
            subtitle="20% of adults did any gig last month; only 4% did platform/app short-term tasks. Among gig adults, 21% say it is their main job."
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={SHED_MIX}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    domain={[0, 25]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="activity"
                    width={140}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip formatter={(v) => [`${Number(v)}% of adults`, ""]} />
                  <Bar
                    dataKey="pctOfAdults"
                    fill={COLORS.monthly}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Attitudes among gig participants"
            subtitle="61% of platform-task adults wish pay were more consistent; 41% would have trouble making ends meet without it."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={SHED_ATTITUDES}
                  margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="metricShort" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 12 }}
                    domain={[0, 85]}
                  />
                  <Tooltip formatter={(v) => [`${Number(v)}%`, ""]} />
                  <Legend />
                  <Bar
                    dataKey="platformPct"
                    name="Platform tasks"
                    fill={COLORS.wish}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="anyGigPct"
                    name="Any gig"
                    fill={COLORS.secondary}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="sellingRentPct"
                    name="Selling / rent"
                    fill={COLORS.flex}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
