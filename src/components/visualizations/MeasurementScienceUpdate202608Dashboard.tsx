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
  CET_PATENTS,
  CHINA_FLOW,
  COMPOSITION,
  CONCENTRATION_METERS,
  HEADLINE,
  INTENSITY_PATH,
  KTI_SPLIT,
  SCOREBOARD,
  SOURCE_NOTE,
  SOURCES,
  fmtPct,
  fmtPp,
  fmtYoy,
  fmtYuanTn,
  intensityGapToUs,
  rankedCetPatents,
} from "@/data/measurement-science-update-202608-data";

// viz-types: intensity race area+line, China flow dumbbell, composition stacked, CET patent bars, KTI pie + services bar, volume-vs-impact scatter
// viz-plan: panel + intensity/patent controls; vintage delta first; no KPI+bar clone

type Panel =
  | "intensity"
  | "flow"
  | "composition"
  | "patents"
  | "kti"
  | "scoreboard";
type IntensityView = "levels" | "gap";
type PatentView = "volume" | "ranked";

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
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              value === o.id
                ? "bg-slate-800 text-white"
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

export function MeasurementScienceUpdate202608Dashboard() {
  const [panel, setPanel] = useState<Panel>("intensity");
  const [intensityView, setIntensityView] = useState<IntensityView>("levels");
  const [patentView, setPatentView] = useState<PatentView>("volume");

  const intensityData = useMemo(
    () =>
      INTENSITY_PATH.map((r) => ({
        year: r.year,
        china: r.chinaPct,
        us: r.usPct,
        oecd: r.oecdPct,
        gap: intensityGapToUs(r),
      })),
    [],
  );

  const flowData = useMemo(
    () =>
      CHINA_FLOW.map((r) => ({
        short: r.short,
        prior: r.prior,
        neu: r.neu,
        yoy: r.yoyPct,
        color: r.color,
        unit: r.unit,
      })),
    [],
  );

  const patentData = useMemo(() => {
    const rows =
      patentView === "ranked" ? rankedCetPatents() : [...CET_PATENTS];
    return rows.map((r) => ({
      short: r.short,
      china: r.chinaSharePct,
      color: r.color,
      impact: r.usLeadsCitations ? "US cites" : "CN cites",
    }));
  }, [patentView]);

  const ktiShareData = useMemo(
    () =>
      KTI_SPLIT.filter((r) => r.unit === "sharePct" && r.id.includes("share")).map(
        (r) => ({
          name: r.short,
          value: r.value,
          color: r.color,
        }),
      ),
    [],
  );

  const scoreboardScatter = useMemo(
    () =>
      SCOREBOARD.map((r, i) => ({
        x: i + 1,
        y:
          r.volumeLeader === "China"
            ? r.impactLeader === "United States"
              ? 2
              : r.impactLeader === "Split"
                ? 1.5
                : 1
            : r.impactLeader === "United States"
              ? 3
              : 2.5,
        z: 120,
        label: r.label,
        color: r.color,
        volume: r.volumeLeader,
        impact: r.impactLeader,
      })),
    [],
  );

  return (
    <div
      className="w-full min-w-0 space-y-6"
      data-viz="measurement-science-update-202608"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-6 text-white shadow-sm sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
          Vintage delta — Q3 OECD/AAAS 2024 restatement → China NBS 2025 + NSF CET
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          China domestic R&D +8.1%; intensity 2.80%; AI patents ~75%
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Versus our Q3 knife-edge PPP overtake ({HEADLINE.priorChinaSharePct}% vs{" "}
          {HEADLINE.priorUsSharePct}%), August adds the first post-2024 China flow
          year (¥{HEADLINE.china2025GerdTnYuan}T, intensity {fmtPct(HEADLINE.china2025IntensityPct)},
          basic research {fmtPct(HEADLINE.basicResearchSharePct)}) and NSF CET patent
          concentration (AI priority families ~{HEADLINE.aiPriorityPatentChinaSharePct}% China).
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-white/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              China 2025 YoY
            </p>
            <p className="mt-1 text-xl font-bold text-rose-300">
              {fmtYoy(HEADLINE.china2025YoyPct)}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Intensity vs US (2024)
            </p>
            <p className="mt-1 text-xl font-bold text-sky-300">
              {fmtPct(HEADLINE.china2025IntensityPct)} vs{" "}
              {fmtPct(HEADLINE.us2024IntensityPct)}
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              AI priority patents (CN)
            </p>
            <p className="mt-1 text-xl font-bold text-violet-300">
              ~{HEADLINE.aiPriorityPatentChinaSharePct}%
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={panel}
          onChange={setPanel}
          options={[
            { id: "intensity", label: "Intensity race" },
            { id: "flow", label: "China 2025 flow" },
            { id: "composition", label: "Composition" },
            { id: "patents", label: "CET patents" },
            { id: "kti", label: "KTI split" },
            { id: "scoreboard", label: "Scoreboard" },
          ]}
        />
        {panel === "intensity" && (
          <ToggleGroup
            label="Intensity view"
            value={intensityView}
            onChange={setIntensityView}
            options={[
              { id: "levels", label: "Levels" },
              { id: "gap", label: "Gap to US" },
            ]}
          />
        )}
        {panel === "patents" && (
          <ToggleGroup
            label="Patent view"
            value={patentView}
            onChange={setPatentView}
            options={[
              { id: "volume", label: "As listed" },
              { id: "ranked", label: "Ranked by CN share" },
            ]}
          />
        )}
      </div>

      {panel === "intensity" && (
        <ChartCard
          title="Intensity race — China climbs; OECD plateaus; US stays ahead"
          subtitle="China domestic path through 2025 NBS; US / OECD international meters through 2024"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              {intensityView === "levels" ? (
                <ComposedChart data={intensityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={[2.2, 3.7]}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(value) => [
                      typeof value === "number" ? fmtPct(value) : String(value ?? ""),
                      "",
                    ]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="china"
                    name="China"
                    stroke="#f43f5e"
                    fill="#f43f5e33"
                    strokeWidth={2}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="us"
                    name="United States"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="oecd"
                    name="OECD area"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                    connectNulls
                  />
                  <ReferenceLine
                    y={2.8}
                    stroke="#f43f5e88"
                    strokeDasharray="3 3"
                    label={{
                      value: "CN 2025 2.8%",
                      position: "insideTopRight",
                      fill: "#f43f5e",
                      fontSize: 11,
                    }}
                  />
                </ComposedChart>
              ) : (
                <AreaChart
                  data={intensityData.filter((d) => d.gap != null)}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={[0, 1.2]}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${v} pp`}
                  />
                  <Tooltip
                    formatter={(value) => [
                      typeof value === "number" ? fmtPp(value) : String(value ?? ""),
                      "US − China gap",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="gap"
                    name="US − China intensity gap"
                    stroke="#0ea5e9"
                    fill="#0ea5e933"
                    strokeWidth={2}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            2025 US/OECD intensity not yet in this vintage — gap panel stops at
            2024 international meters. China 2025 is the NBS domestic print.
          </p>
        </ChartCard>
      )}

      {panel === "flow" && (
        <ChartCard
          title="China 2025 flow — first post-2024 ledger on this theme"
          subtitle="Dumbbell prior → newest for GERD, intensity, and basic research"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                layout="vertical"
                data={flowData}
                margin={{ left: 8, right: 24 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={72}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="prior" name="Prior" fill="#94a3b8" barSize={10} />
                <Bar dataKey="neu" name="Newest" fill="#f43f5e" barSize={10} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="py-2 pr-4">Meter</th>
                  <th className="py-2 pr-4">Prior</th>
                  <th className="py-2 pr-4">2025</th>
                  <th className="py-2">YoY</th>
                </tr>
              </thead>
              <tbody>
                {CHINA_FLOW.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100">
                    <td className="py-2 pr-4 font-medium text-slate-800">
                      {r.label}
                    </td>
                    <td className="py-2 pr-4 text-slate-600">
                      {r.unit === "tnYuan"
                        ? fmtYuanTn(r.prior)
                        : r.unit === "bnYuan"
                          ? `¥${r.prior.toLocaleString()}亿`
                          : fmtPct(r.prior)}
                    </td>
                    <td className="py-2 pr-4 font-semibold text-slate-900">
                      {r.unit === "tnYuan"
                        ? fmtYuanTn(r.neu)
                        : r.unit === "bnYuan"
                          ? `¥${r.neu.toLocaleString()}亿`
                          : fmtPct(r.neu)}
                    </td>
                    <td className="py-2 text-slate-600">
                      {r.yoyPct != null ? fmtYoy(r.yoyPct) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}

      {panel === "composition" && (
        <ChartCard
          title="Composition — basic research crosses 7%"
          subtitle="Stacked share of China R&D by research type (basic disclosed; applied/experimental estimated residual)"
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    year: "2024",
                    experimental: COMPOSITION[0].share2024Pct,
                    applied: COMPOSITION[1].share2024Pct,
                    basic: COMPOSITION[2].share2024Pct,
                  },
                  {
                    year: "2025",
                    experimental: COMPOSITION[0].share2025Pct,
                    applied: COMPOSITION[1].share2025Pct,
                    basic: COMPOSITION[2].share2025Pct,
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value) => [
                    typeof value === "number" ? fmtPct(value) : String(value ?? ""),
                    "",
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="experimental"
                  name="Experimental development"
                  stackId="a"
                  fill="#f43f5e"
                />
                <Bar
                  dataKey="applied"
                  name="Applied research"
                  stackId="a"
                  fill="#f59e0b"
                />
                <Bar
                  dataKey="basic"
                  name="Basic research"
                  stackId="a"
                  fill="#8b5cf6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Basic research spend rose {fmtYoy(HEADLINE.basicResearchYoyPct)} to ¥
            {HEADLINE.basicResearchBnYuan.toLocaleString()}亿 — faster than total
            R&D — and its share printed {fmtPct(HEADLINE.basicResearchSharePct)} for
            the first disclosed year above 7%.
          </p>
        </ChartCard>
      )}

      {panel === "patents" && (
        <ChartCard
          title="CET priority patents — volume concentrates in China"
          subtitle="International priority patent families, 2024 (NSF Indicators Translation). US still leads highly cited CET patents."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={patentData}
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="short"
                  width={64}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [
                    typeof value === "number" ? fmtPct(value, 0) : String(value ?? ""),
                    "China share",
                  ]}
                />
                <Bar dataKey="china" name="China share" radius={[0, 4, 4, 0]}>
                  {patentData.map((d) => (
                    <Cell key={d.short} fill={d.color} />
                  ))}
                </Bar>
                <ReferenceLine
                  x={50}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  label={{
                    value: "50%",
                    position: "top",
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            AI share (~75%) is disclosed in NSF State of S&E / Translation prose.
            Other CET shares are estimated midpoints of “China leads volume”
            statements — labeled estimated in the data module. USPTO awarded{" "}
            {HEADLINE.usptoUtilityPatentsK}k utility patents in 2024 (
            {HEADLINE.usptoUsApplicantSharePct}% to US applicants).
          </p>
        </ChartCard>
      )}

      {panel === "kti" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="World KTI value-added shares"
            subtitle={`$${HEADLINE.ktiWorldTn}T global KTI VA in 2024 — near-duopoly`}
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ktiShareData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {ktiShareData.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      typeof value === "number" ? fmtPct(value, 0) : String(value ?? ""),
                      "KTI share",
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Where the duopoly splits"
            subtitle="China leads KTI manufacturing; US dominates KTI services"
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      label: "CN KTI mfg ($T)",
                      value: HEADLINE.ktiCnMfgTn,
                      color: "#f43f5e",
                    },
                    {
                      label: "US KTI svc share %",
                      value: HEADLINE.ktiUsServicesSharePct,
                      color: "#0ea5e9",
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    <Cell fill="#f43f5e" />
                    <Cell fill="#0ea5e9" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Different units on purpose: manufacturing is absolute VA ($
              {HEADLINE.ktiCnMfgTn}T); services is US world share (
              {HEADLINE.ktiUsServicesSharePct}%).
            </p>
          </ChartCard>
        </div>
      )}

      {panel === "scoreboard" && (
        <ChartCard
          title="Volume vs impact — concentration is not the same as citation lead"
          subtitle="Scatter encodes volume leader (China vs US) against impact / citation stance"
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ bottom: 8, left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Meter"
                  domain={[0.5, 6.5]}
                  ticks={[1, 2, 3, 4, 5, 6]}
                  tickFormatter={(v) =>
                    ["", "GERD", "Int.", "Basic", "CET", "KTI", "Pubs"][v] ?? ""
                  }
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Stance"
                  domain={[0.5, 3.5]}
                  ticks={[1, 1.5, 2, 2.5, 3]}
                  tickFormatter={(v) =>
                    ({
                      1: "CN both",
                      1.5: "CN vol / split",
                      2: "CN vol / US impact",
                      2.5: "US vol / split",
                      3: "US both",
                    })[v as 1 | 1.5 | 2 | 2.5 | 3] ?? ""
                  }
                  width={110}
                  tick={{ fontSize: 10 }}
                />
                <ZAxis type="number" dataKey="z" range={[80, 200]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(_v, _n, item) => {
                    const p = item?.payload as {
                      label?: string;
                      volume?: string;
                      impact?: string;
                    };
                    return [
                      `${p?.volume ?? ""} volume · ${p?.impact ?? ""} impact`,
                      p?.label ?? "",
                    ];
                  }}
                />
                <Scatter data={scoreboardScatter}>
                  {scoreboardScatter.map((d) => (
                    <Cell key={d.label} fill={d.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {SCOREBOARD.map((r) => (
              <div
                key={r.id}
                className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs"
              >
                <p className="font-semibold text-slate-800">{r.label}</p>
                <p className="mt-0.5 text-slate-500">Q3: {r.priorQ3}</p>
                <p className="text-slate-700">Aug: {r.neuAug}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Concentration meters — Q3 → August
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="py-2 pr-3">Meter</th>
                <th className="py-2 pr-3">Prior (Q3)</th>
                <th className="py-2 pr-3">Newest</th>
                <th className="py-2 pr-3">Δ</th>
                <th className="py-2">Detail</th>
              </tr>
            </thead>
            <tbody>
              {CONCENTRATION_METERS.map((m) => (
                <tr key={m.label} className="border-b border-slate-100">
                  <td className="py-2 pr-3 font-medium text-slate-800">
                    {m.label}
                  </td>
                  <td className="py-2 pr-3 text-slate-600">{m.prior}</td>
                  <td className="py-2 pr-3 font-semibold text-slate-900">
                    {m.neu}
                  </td>
                  <td className="py-2 pr-3 text-sky-700">{m.delta}</td>
                  <td className="py-2 text-slate-500">{m.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          {SOURCE_NOTE}
        </p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-sky-700">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} className="underline-offset-2 hover:underline">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
