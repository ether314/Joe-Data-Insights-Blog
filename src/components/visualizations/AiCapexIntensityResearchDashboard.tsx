"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tooltip, sortTooltipPayload } from "@/components/charts/SortedTooltip";
import {
  COMPANY_COLORS,
  COMPANIES,
  FISCAL_YEARS,
  HEADLINE,
  SECTOR_BENCHMARKS,
  SOURCE_NOTE,
  SOURCES,
  SUSTAINABILITY_BANDS,
  fmtBn,
  fmtPct,
  intensityTrajectory,
  rankedIntensity,
  scatterForYear,
  stackedCapex,
  type CompanyId,
  type FiscalYear,
} from "@/data/ai-capex-intensity-research-2026-data";

// viz-types: multi-line bands, scatter, ranked horizontal bars, stacked area | layout: default
// viz-plan: ratio time series with sustainability bands; intensity×FCF scatter; FY ranked bars; stacked $ capex; company toggles + FY control

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

export function AiCapexIntensityResearchDashboard() {
  const [focusYear, setFocusYear] = useState<FiscalYear>("FY25");
  const [activeCompanies, setActiveCompanies] = useState<CompanyId[]>([...COMPANIES]);

  const toggleCompany = (c: CompanyId) => {
    setActiveCompanies((prev) => {
      if (prev.includes(c)) {
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== c);
      }
      return [...prev, c];
    });
  };

  const trajectory = useMemo(() => intensityTrajectory(activeCompanies), [activeCompanies]);
  const ranked = useMemo(() => rankedIntensity(focusYear, activeCompanies), [focusYear, activeCompanies]);
  const scatter = useMemo(() => scatterForYear(focusYear, activeCompanies), [focusYear, activeCompanies]);
  const stacked = useMemo(() => stackedCapex(activeCompanies), [activeCompanies]);

  const sectorSorted = useMemo(
    () => [...SECTOR_BENCHMARKS].sort((a, b) => b.intensityPct - a.intensityPct),
    [],
  );

  return (
    <div className="space-y-6" data-viz="ai-capex-intensity-research-2026">
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950">
        {SOURCE_NOTE}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Reinvestment intensity — FY25 snapshot
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Meta {fmtPct(HEADLINE.metaFy25, 0)} · Oracle {fmtPct(HEADLINE.oracleFy25, 0)} of revenue into capex
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Big-four revenue-weighted intensity sits near {fmtPct(HEADLINE.weightedIntensityFy25)} — roughly double
          the pre-AI cloud norm ({fmtPct(HEADLINE.preAiCloud, 0)}) and inside the historical wireline telecom band
          ({fmtPct(HEADLINE.telecomNorm, 0)}). Meta still prints {fmtPct(HEADLINE.metaFcfFy25)} free-cash-flow margin;
          Amazon&apos;s FCF cushion is only {fmtPct(HEADLINE.amazonFcfFy25)}.
        </p>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Companies</span>
            {COMPANIES.map((c) => {
              const on = activeCompanies.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCompany(c)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    on ? "text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                  style={on ? { backgroundColor: COMPANY_COLORS[c] } : undefined}
                >
                  {c}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Focus year</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
              {FISCAL_YEARS.filter((y) => y === "FY23" || y === "FY24" || y === "FY25").map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setFocusYear(y)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    focusYear === y ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ChartCard
        title="Capex intensity trajectory — ratio time series"
        subtitle="Capex ÷ revenue (%). Shaded bands: historical cloud (green), elevated (amber), telecom/foundry territory (rose)."
      >
        <div className="h-80 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trajectory} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `${v}%`} domain={[0, 45]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v) => fmtPct(Number(v ?? 0))}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const sorted = sortTooltipPayload(payload);
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
                      <p className="mb-1 font-semibold text-slate-800">{label}</p>
                      {sorted.map((p) => (
                        <p key={String(p.dataKey)} style={{ color: p.color }}>
                          {p.name}: {fmtPct(Number(p.value ?? 0))}
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <ReferenceArea
                y1={SUSTAINABILITY_BANDS.comfortable.low}
                y2={SUSTAINABILITY_BANDS.comfortable.high}
                fill={SUSTAINABILITY_BANDS.comfortable.fill}
                fillOpacity={0.25}
              />
              <ReferenceArea
                y1={SUSTAINABILITY_BANDS.stretched.low}
                y2={SUSTAINABILITY_BANDS.stretched.high}
                fill={SUSTAINABILITY_BANDS.stretched.fill}
                fillOpacity={0.3}
              />
              <ReferenceArea
                y1={SUSTAINABILITY_BANDS.extreme.low}
                y2={SUSTAINABILITY_BANDS.extreme.high}
                fill={SUSTAINABILITY_BANDS.extreme.fill}
                fillOpacity={0.25}
              />
              <ReferenceLine
                y={HEADLINE.telecomNorm}
                stroke="#64748b"
                strokeDasharray="4 4"
                label={{ value: "20% telecom norm", position: "insideTopRight", fontSize: 10 }}
              />
              {activeCompanies.map((company) => (
                <Line
                  key={company}
                  type="monotone"
                  dataKey={company}
                  name={company}
                  stroke={COMPANY_COLORS[company]}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  connectNulls
                />
              ))}
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title={`${focusYear} intensity vs free-cash-flow margin`}
          subtitle="Scatter: how much revenue is reinvested (x) versus cash left after capex (y). Bubble size ≈ absolute capex."
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="intensity"
                  name="Intensity"
                  unit="%"
                  domain={[0, 45]}
                  tick={{ fontSize: 11 }}
                  label={{ value: "Capex / revenue %", position: "insideBottom", offset: -2, fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="fcfMargin"
                  name="FCF margin"
                  unit="%"
                  domain={[-8, 40]}
                  tick={{ fontSize: 11 }}
                  label={{ value: "FCF margin %", angle: -90, position: "insideLeft", fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="capexBn" range={[80, 400]} />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <ReferenceLine x={HEADLINE.telecomNorm} stroke="#64748b" strokeDasharray="4 4" />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload as {
                      company: string;
                      intensity: number;
                      fcfMargin: number;
                      capexBn: number;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
                        <p className="font-semibold text-slate-800">{d.company}</p>
                        <p>Intensity: {fmtPct(d.intensity)}</p>
                        <p>FCF margin: {fmtPct(d.fcfMargin)}</p>
                        <p>Capex: {fmtBn(d.capexBn)}</p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatter} name="Companies">
                  {scatter.map((row) => (
                    <Cell key={row.company} fill={row.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title={`${focusYear} ranked capex intensity`}
          subtitle="Highest → lowest. Amber band = wireline telecom norm (~20%); rose reference = dot-com peak mid (~35%)."
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ranked} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" domain={[0, 45]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="company" width={80} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(v) => fmtPct(Number(v ?? 0))}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload as {
                      company: string;
                      intensity: number;
                      fcfMargin: number;
                      capexBn: number;
                    };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
                        <p className="font-semibold">{d.company}</p>
                        <p>Intensity: {fmtPct(d.intensity)}</p>
                        <p>FCF margin: {fmtPct(d.fcfMargin)}</p>
                        <p>Capex: {fmtBn(d.capexBn)}</p>
                      </div>
                    );
                  }}
                />
                <ReferenceArea x1={18} x2={22} fill="#fde68a" fillOpacity={0.35} />
                <ReferenceLine x={HEADLINE.dotComPeak} stroke="#e11d48" strokeDasharray="6 3" />
                <Bar dataKey="intensity" radius={[0, 4, 4, 0]}>
                  {ranked.map((row) => (
                    <Cell key={row.company} fill={row.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Absolute capex stack — dollars reinvested"
          subtitle="Gross PP&E purchases ($B) by fiscal year. Toggle companies above to reshape the stack."
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stacked} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `$${v}B`} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => fmtBn(Number(v ?? 0))}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const sorted = sortTooltipPayload(payload);
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
                        <p className="mb-1 font-semibold text-slate-800">{label}</p>
                        {sorted.map((p) => (
                          <p key={String(p.dataKey)} style={{ color: p.color }}>
                            {p.name}: {fmtBn(Number(p.value ?? 0))}
                          </p>
                        ))}
                      </div>
                    );
                  }}
                />
                {activeCompanies.map((c) => (
                  <Area
                    key={c}
                    type="monotone"
                    dataKey={c}
                    name={c}
                    stackId="1"
                    stroke={COMPANY_COLORS[c]}
                    fill={COMPANY_COLORS[c]}
                    fillOpacity={0.75}
                  />
                ))}
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Sector capital-intensity benchmarks"
          subtitle="Where hyperscaler ratios sit versus SaaS, energy, telecom, foundry, and the 2000 telecom peak."
        >
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorSorted} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" domain={[0, 50]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="label" width={140} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => fmtPct(Number(v ?? 0))}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload as { label: string; intensityPct: number; note: string };
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
                        <p className="font-semibold">{d.label}</p>
                        <p>{fmtPct(d.intensityPct)}</p>
                        <p className="text-slate-500">{d.note}</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={HEADLINE.weightedIntensityFy25} stroke="#0e7490" strokeWidth={2} />
                <Bar dataKey="intensityPct" radius={[0, 4, 4, 0]}>
                  {sectorSorted.map((row) => (
                    <Cell
                      key={row.id}
                      fill={
                        row.band === "high" ? "#e11d48" : row.band === "mid" ? "#d97706" : "#0d9488"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Vertical cyan line marks FY25 revenue-weighted hyperscaler intensity ({fmtPct(HEADLINE.weightedIntensityFy25)}).
          </p>
        </ChartCard>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Sources</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          {SOURCES.map((s) => (
            <li key={s.label}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-700 underline underline-offset-2 hover:text-cyan-900"
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
