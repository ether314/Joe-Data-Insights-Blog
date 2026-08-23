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
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  CLAIM_DRIVER_MIX_2024,
  CLAIMS_OUTCOMES_2024,
  HEADLINE,
  IC3_THREAT_SERIES,
  MARKET_PHASES,
  MARKET_SERIES,
  POLICY_STRUCTURE_2024,
  SOURCE_NOTE,
  SOURCES,
  fmtB,
  fmtM,
  fmtPct,
  indexedSeries,
  type PremiumScope,
} from "@/data/us-cyber-insurance-premiums-vs-incurred-losses-2026-data";

// viz-types: dual-axis composed, loss-ratio area, structure donut, IC3 bars, claim-driver radial, phase scatter | layout: default

type ViewId =
  | "race"
  | "ratio"
  | "structure"
  | "ic3"
  | "drivers"
  | "phase";

const CYAN = "#22d3ee";
const AMBER = "#fbbf24";
const ROSE = "#fb7185";
const EMERALD = "#34d399";
const VIOLET = "#a78bfa";
const SLATE = "#94a3b8";

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

export function UsCyberInsurancePremiumsVsIncurredLosses2026Dashboard() {
  const [view, setView] = useState<ViewId>("race");
  const [scope, setScope] = useState<PremiumScope>("domestic");
  const [ic3Year, setIc3Year] = useState<2022 | 2023 | 2024>(2024);
  const [indexMode, setIndexMode] = useState<"dollars" | "index">("index");

  const raceData = useMemo(() => indexedSeries(scope), [scope]);

  const ratioArea = useMemo(
    () =>
      MARKET_SERIES.filter((r) => r.year >= 2019).map((r) => ({
        year: r.year,
        lossRatio: r.lossRatioPct,
        band: r.lossRatioPct >= 60 ? "stressed" : "cushion",
      })),
    [],
  );

  const structurePie = useMemo(
    () =>
      POLICY_STRUCTURE_2024.map((p, i) => ({
        name: p.label,
        value: p.premiumSharePct,
        fill: [CYAN, AMBER, EMERALD][i],
      })),
    [],
  );

  const ic3Row = useMemo(
    () => IC3_THREAT_SERIES.find((r) => r.year === ic3Year)!,
    [ic3Year],
  );

  const ic3Bars = useMemo(
    () => [
      {
        name: "BEC losses",
        value: ic3Row.becLossesB * 1000,
        fill: ROSE,
        unit: "M",
      },
      {
        name: "Data-breach losses",
        value: ic3Row.personalDataBreachLossesB * 1000,
        fill: VIOLET,
        unit: "M",
      },
      {
        name: "Ransomware losses (IC3 $)",
        value: ic3Row.ransomwareLossesM,
        fill: AMBER,
        unit: "M",
      },
    ],
    [ic3Row],
  );

  const ic3Complaints = useMemo(
    () => [
      {
        name: "Ransomware complaints",
        value: ic3Row.ransomwareComplaints,
        fill: AMBER,
      },
      {
        name: "BEC complaints",
        value: ic3Row.becComplaints,
        fill: ROSE,
      },
    ],
    [ic3Row],
  );

  const driverRadial = useMemo(
    () =>
      CLAIM_DRIVER_MIX_2024.map((d, i) => ({
        name: d.label,
        share: d.severitySharePct,
        fill: [AMBER, ROSE, VIOLET, CYAN][i],
      })),
    [],
  );

  const phaseScatter = useMemo(
    () =>
      MARKET_PHASES.map((p) => ({
        ...p,
        x: p.dwpYoYPct,
        y: p.lossRatioPct,
        z: 120,
        fill:
          p.phase === "hardening"
            ? ROSE
            : p.phase === "peak"
              ? AMBER
              : EMERALD,
      })),
    [],
  );

  const claimsBars = useMemo(
    () =>
      CLAIMS_OUTCOMES_2024.map((c) => ({
        name: c.label.replace("Closed ", ""),
        count: c.count,
        fill: c.id === "with-payment" ? EMERALD : SLATE,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="us-cyber-insurance-premiums-vs-incurred-losses-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
          Finance · cyber risk markets
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Premium raced ahead of losses — until softening
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">
          Domestic cyber DWP rose{" "}
          <span className="font-semibold text-cyan-300">
            {fmtPct(HEADLINE.domesticDwpGrowthPct)}
          </span>{" "}
          from 2020–2024 while estimated incurred loss+DCC rose only{" "}
          <span className="font-semibold text-amber-300">
            {fmtPct(HEADLINE.estimatedIncurredGrowthPct)}
          </span>
          . The calendar-year loss ratio fell from{" "}
          <span className="font-semibold text-white">
            {fmtPct(HEADLINE.lossRatio2020Pct)}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-emerald-300">
            {fmtPct(HEADLINE.lossRatio2023Pct)}
          </span>
          , then rebounded to{" "}
          <span className="font-semibold text-rose-300">
            {fmtPct(HEADLINE.lossRatio2024Pct)}
          </span>{" "}
          as rates softened and claim frequency jumped.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Domestic DWP 2024",
              value: fmtB(HEADLINE.domesticDwp2024B),
            },
            {
              label: "Loss ratio 2024",
              value: fmtPct(HEADLINE.lossRatio2024Pct),
            },
            {
              label: "Total DWP Δ 2023→24",
              value: fmtPct(HEADLINE.totalDwpDeclinePct, 1),
            },
            {
              label: "IC3 BEC losses 2024",
              value: fmtB(HEADLINE.ic3BecLosses2024B),
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-1 text-lg font-bold text-white">{k.value}</p>
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
            { id: "race", label: "Premium vs losses" },
            { id: "ratio", label: "Loss ratio" },
            { id: "structure", label: "Policy stack" },
            { id: "ic3", label: "IC3 threat $" },
            { id: "drivers", label: "Claim drivers" },
            { id: "phase", label: "Hard→soft" },
          ]}
        />
        <div className="flex flex-wrap gap-3">
          <ToggleGroup
            label="Premium scope"
            value={scope}
            onChange={setScope}
            options={[
              { id: "domestic", label: "Domestic" },
              { id: "total", label: "Incl. alien" },
            ]}
          />
          {view === "race" ? (
            <ToggleGroup
              label="Scale"
              value={indexMode}
              onChange={setIndexMode}
              options={[
                { id: "index", label: "2020=100" },
                { id: "dollars", label: "$B" },
              ]}
            />
          ) : null}
          {view === "ic3" ? (
            <ToggleGroup
              label="IC3 year"
              value={String(ic3Year) as "2022" | "2023" | "2024"}
              onChange={(y) => setIc3Year(Number(y) as 2022 | 2023 | 2024)}
              options={[
                { id: "2022", label: "2022" },
                { id: "2023", label: "2023" },
                { id: "2024", label: "2024" },
              ]}
            />
          ) : null}
        </div>
      </div>

      {view === "race" ? (
        <ChartCard
          title="Written premium vs estimated incurred loss+DCC"
          subtitle={
            indexMode === "index"
              ? "Indexed to 2020=100. Premium outran losses through the hard market; the gap narrowed as DWP stalled."
              : "Domestic/total DWP (NAIC) vs estimated incurred (loss ratio × domestic DWP)."
          }
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={raceData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  label={{
                    value: indexMode === "index" ? "Index" : "$B",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey={
                    indexMode === "index" ? "premiumIndex" : "premiumB"
                  }
                  name={
                    indexMode === "index"
                      ? "Premium index"
                      : scope === "domestic"
                        ? "Domestic DWP ($B)"
                        : "Total DWP ($B)"
                  }
                  fill={CYAN}
                  fillOpacity={0.15}
                  stroke={CYAN}
                  strokeWidth={2.5}
                />
                <Line
                  type="monotone"
                  dataKey={
                    indexMode === "index" ? "lossIndex" : "estimatedIncurredB"
                  }
                  name={
                    indexMode === "index"
                      ? "Incurred index"
                      : "Est. incurred ($B)"
                  }
                  stroke={AMBER}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "ratio" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Calendar-year loss + DCC ratio"
            subtitle="Aon compilation of NAIC Cyber Supplement. Sub-50% leaves room for expenses; 2020–21 was the stress peak."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={ratioArea}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis
                    domain={[30, 75]}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="lossRatio"
                    name="Loss + DCC %"
                    stroke={ROSE}
                    fill={ROSE}
                    fillOpacity={0.2}
                    strokeWidth={2.5}
                  />
                  <Line
                    type="monotone"
                    dataKey="lossRatio"
                    stroke={ROSE}
                    strokeWidth={0}
                    legendType="none"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="2024 closed claims: payment vs none"
            subtitle="NAIC: closed-without-payment (~3×) outnumbers paid closures — frequency is not the same as severity."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={claimsBars} layout="vertical" margin={{ left: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar dataKey="count" name="Claims" radius={[0, 6, 6, 0]}>
                    {claimsBars.map((e) => (
                      <Cell key={e.name} fill={e.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {view === "structure" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="2024 premium by policy structure"
            subtitle="Primary still takes ~65% of DWP; endorsement is high-count / low-premium."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={structurePie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {structurePie.map((e) => (
                      <Cell key={e.name} fill={e.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Claim closure rates by structure"
            subtitle="Excess claims stay open longer — lower closure rate than endorsement books."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={POLICY_STRUCTURE_2024.map((p) => ({
                    name: p.label,
                    closure: p.closureRatePct,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis
                    domain={[70, 100]}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="closure"
                    name="Closure rate"
                    fill={CYAN}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {view === "ic3" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={`IC3 reported losses (${ic3Year})`}
            subtitle="Ransomware dominates headlines and critical-infrastructure complaints, but IC3 dollar losses are tiny versus BEC — and exclude BI/remediation."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ic3Bars} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    tickFormatter={(v) => `$${v}M`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={150}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v) => fmtM(Number(v))}
                  />
                  <Bar dataKey="value" name="Losses ($M)" radius={[0, 6, 6, 0]}>
                    {ic3Bars.map((e) => (
                      <Cell key={e.name} fill={e.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title={`Complaint counts (${ic3Year})`}
            subtitle={`Total IC3 losses ${fmtB(ic3Row.totalIc3LossesB)} — fraud-heavy; ransomware complaints ${ic3Row.ransomwareComplaints.toLocaleString()}.`}
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ic3Complaints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" name="Complaints" radius={[6, 6, 0, 0]}>
                    {ic3Complaints.map((e) => (
                      <Cell key={e.name} fill={e.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}

      {view === "drivers" ? (
        <ChartCard
          title="Estimated severity mix of cyber insurance claims (2024)"
          subtitle="Desk estimate — not a NAIC statutory breakout. Ransomware+BI still anchors severity even as IC3 ransom $ falls."
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="95%"
                data={driverRadial}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  dataKey="share"
                  background
                  cornerRadius={6}
                  label={{ position: "insideStart", fill: "#0f172a", fontSize: 11 }}
                >
                  {driverRadial.map((e) => (
                    <Cell key={e.name} fill={e.fill} />
                  ))}
                </RadialBar>
                <Legend
                  formatter={(value) => {
                    const row = driverRadial.find((d) => d.name === value);
                    return row
                      ? `${value} (${fmtPct(row.share)})`
                      : String(value);
                  }}
                />
                <Tooltip formatter={(v) => fmtPct(Number(v))} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      {view === "phase" ? (
        <ChartCard
          title="Hard-market growth vs loss ratio"
          subtitle="X = YoY domestic DWP change; Y = loss + DCC ratio. 2021–22: premium explosion with improving LR; 2023–24: soft rates, LR uptick."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 12, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="DWP YoY %"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  label={{
                    value: "Domestic DWP YoY %",
                    position: "insideBottom",
                    offset: -2,
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Loss ratio"
                  domain={[35, 75]}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <ZAxis type="number" dataKey="z" range={[80, 200]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) =>
                    name === "y" || name === "Loss ratio"
                      ? fmtPct(Number(v))
                      : `${Number(v).toFixed(1)}%`
                  }
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as
                      | { year?: number; phase?: string }
                      | undefined;
                    return p?.year
                      ? `${p.year} (${p.phase})`
                      : "Market year";
                  }}
                />
                <Scatter name="Market year" data={phaseScatter}>
                  {phaseScatter.map((e) => (
                    <Cell key={e.year} fill={e.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      ) : null}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        {SOURCES.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-slate-300 hover:text-slate-800"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
