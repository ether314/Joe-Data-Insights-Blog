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
  LineChart,
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
  ANNUAL,
  HEADLINE,
  MONTHLY_RCI,
  QUARTERLY,
  REGIMES,
  SCATTER,
  SOURCE_NOTE,
  VIZ_MARKERS,
  filterAnnualFromYear,
  filterMonthlyFromYear,
  filterQuarterlyFromYear,
  fmtPct,
} from "@/data/first-time-buyer-share-versus-30-year-mortgage-rates-2026-data";

// viz-types: dual-axis composed (share+rate), rate×share scatter, quarterly rate vs HPI YoY area+line, RCI monthly dual-line, regime comparison bars
// | layout: default
// smoke-marker: First-time share 21%

type ViewId = "annual" | "scatter" | "prices" | "monthly" | "regimes";
type FromYear = "2015" | "2019" | "2021";

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const SKY = "#0284c8";
const INDIGO = "#4f46e5";

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

export function FirstTimeBuyerShareVersus30YearMortgageRates2026Dashboard() {
  const [view, setView] = useState<ViewId>("annual");
  const [fromYear, setFromYear] = useState<FromYear>("2019");
  const [showSixLine, setShowSixLine] = useState(true);
  const fromYearN = Number(fromYear);

  const annualData = useMemo(
    () =>
      filterAnnualFromYear(fromYearN).map((r) => ({
        ...r,
        yearLabel: String(r.year),
      })),
    [fromYearN],
  );

  const scatterData = useMemo(
    () => SCATTER.filter((p) => p.year >= fromYearN),
    [fromYearN],
  );

  const priceData = useMemo(
    () =>
      filterQuarterlyFromYear(fromYearN).map((r) => ({
        ...r,
        short: r.label.replace("20", ""),
      })),
    [fromYearN],
  );

  const monthlyData = useMemo(
    () => filterMonthlyFromYear(fromYearN),
    [fromYearN],
  );

  const ageData = useMemo(
    () =>
      filterAnnualFromYear(fromYearN)
        .filter((r) => r.medianFtbAge != null)
        .map((r) => ({
          year: String(r.year),
          age: r.medianFtbAge as number,
          rate: r.rateAvgPct,
        })),
    [fromYearN],
  );

  return (
    <div
      className="space-y-6"
      data-viz="first-time-buyer-share-versus-30-year-mortgage-rates-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
          Real estate · NAR × Freddie Mac × FHFA
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          First-time buyer share vs 30-year fixed rate
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          NAR&apos;s Profile prints first-time buyers at{" "}
          <span className="font-semibold text-white">
            First-time share {HEADLINE.latestFtbSharePct}%
          </span>{" "}
          — a record low — after Freddie Mac&apos;s 30-year average stayed{" "}
          <span className="font-semibold text-white">
            30-year above 6% since late 2022
          </span>
          . The typical first-time buyer is now{" "}
          <span className="font-semibold text-white">
            Median first-time age {HEADLINE.medianFtbAge2025}
          </span>
          , up from {HEADLINE.medianFtbAge2021} in 2021.
        </p>
        <ul className="mt-4 flex flex-wrap gap-3 text-xs text-slate-300">
          {VIZ_MARKERS.map((m) => (
            <li
              key={m}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1"
            >
              {m}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          value={view}
          onChange={setView}
          options={[
            { id: "annual", label: "Share vs rate" },
            { id: "scatter", label: "Rate × share scatter" },
            { id: "prices", label: "Rate vs HPI YoY" },
            { id: "monthly", label: "RCI monthly path" },
            { id: "regimes", label: "Rate regimes" },
          ]}
        />
        <div className="flex flex-wrap items-center gap-3">
          <ToggleGroup
            value={fromYear}
            onChange={setFromYear}
            options={[
              { id: "2015", label: "2015+" },
              { id: "2019", label: "2019+" },
              { id: "2021", label: "2021+" },
            ]}
          />
          <button
            type="button"
            onClick={() => setShowSixLine((v) => !v)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              showSixLine
                ? "bg-rose-700 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {showSixLine ? "6% line on" : "6% line off"}
          </button>
        </div>
      </div>

      {view === "annual" && (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ChartCard
              title="NAR first-time share and Freddie Mac 30-year"
              subtitle="Bars = Profile first-time share · line = calendar-year PMMS average"
            >
              <div className="h-[340px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={annualData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="yearLabel" tick={{ fontSize: 12 }} />
                    <YAxis
                      yAxisId="share"
                      domain={[15, 40]}
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${v}%`}
                      label={{ value: "FTB share", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: SLATE } }}
                    />
                    <YAxis
                      yAxisId="rate"
                      orientation="right"
                      domain={[0, 9]}
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${v}%`}
                      label={{ value: "30-yr rate", angle: 90, position: "insideRight", style: { fontSize: 11, fill: SLATE } }}
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        const n = typeof value === "number" ? value : Number(value);
                        if (name === "ftbSharePct") return [fmtPct(n, 0), "First-time share"];
                        if (name === "rateAvgPct") return [fmtPct(n, 2), "30-year avg"];
                        return [String(value), String(name)];
                      }}
                    />
                    <Legend />
                    <Bar
                      yAxisId="share"
                      dataKey="ftbSharePct"
                      name="First-time share"
                      fill={TEAL}
                      radius={[4, 4, 0, 0]}
                    >
                      {annualData.map((r) => (
                        <Cell
                          key={r.year}
                          fill={r.rateAbove6 ? ROSE : TEAL}
                        />
                      ))}
                    </Bar>
                    <Line
                      yAxisId="rate"
                      type="monotone"
                      dataKey="rateAvgPct"
                      name="30-year avg"
                      stroke={AMBER}
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                    />
                    {showSixLine && (
                      <ReferenceLine
                        yAxisId="rate"
                        y={6}
                        stroke={ROSE}
                        strokeDasharray="4 4"
                        label={{ value: "6%", fill: ROSE, fontSize: 11 }}
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
          <div className="lg:col-span-2">
            <ChartCard
              title="Median first-time buyer age"
              subtitle="NAR Profile · years"
            >
              <div className="h-[340px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ageData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis domain={[28, 42]} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value, name) => {
                        const n = typeof value === "number" ? value : Number(value);
                        if (name === "age") return [`${n}`, "Median age"];
                        if (name === "rate") return [fmtPct(n, 2), "30-year avg"];
                        return [String(value), String(name)];
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="age"
                      name="Median age"
                      stroke={INDIGO}
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Mortgage rate versus first-time share"
          subtitle="Each point is a NAR Profile report year · rose = calendar-year average ≥ 6%"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 20, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="rateAvgPct"
                  name="rate"
                  domain={[2, 8]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  label={{ value: "Freddie Mac 30-year avg", position: "insideBottom", offset: -4, style: { fontSize: 12, fill: SLATE } }}
                />
                <YAxis
                  type="number"
                  dataKey="ftbSharePct"
                  name="share"
                  domain={[18, 38]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  label={{ value: "First-time share", angle: -90, position: "insideLeft", style: { fontSize: 12, fill: SLATE } }}
                />
                <ZAxis range={[80, 80]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    if (name === "rateAvgPct" || name === "rate") return [fmtPct(n, 2), "30-year avg"];
                    if (name === "ftbSharePct" || name === "share") return [fmtPct(n, 0), "First-time share"];
                    return [String(value), String(name)];
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as { year?: number } | undefined;
                    return p?.year ? `Profile ${p.year}` : "";
                  }}
                />
                {showSixLine && (
                  <ReferenceLine x={6} stroke={ROSE} strokeDasharray="4 4" />
                )}
                <Scatter name="Profile years" data={scatterData} fill={TEAL}>
                  {scatterData.map((p) => (
                    <Cell
                      key={p.year}
                      fill={p.rateAbove6 ? ROSE : SKY}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "prices" && (
        <ChartCard
          title="Quarterly 30-year rate versus FHFA house-price YoY"
          subtitle="Area = FHFA purchase-only HPI year-over-year · line = Freddie Mac quarterly average"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={priceData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="short" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis
                  yAxisId="hpi"
                  domain={[0, 24]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  yAxisId="rate"
                  orientation="right"
                  domain={[0, 9]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    if (name === "hpiYoyPct") return [fmtPct(n, 1), "HPI YoY"];
                    if (name === "rateAvgPct") return [fmtPct(n, 2), "30-year avg"];
                    return [String(value), String(name)];
                  }}
                />
                <Legend />
                <Area
                  yAxisId="hpi"
                  type="monotone"
                  dataKey="hpiYoyPct"
                  name="HPI YoY"
                  fill={SKY}
                  fillOpacity={0.25}
                  stroke={SKY}
                  strokeWidth={1.5}
                />
                <Line
                  yAxisId="rate"
                  type="monotone"
                  dataKey="rateAvgPct"
                  name="30-year avg"
                  stroke={AMBER}
                  strokeWidth={2.5}
                  dot={false}
                />
                {showSixLine && (
                  <ReferenceLine
                    yAxisId="rate"
                    y={6}
                    stroke={ROSE}
                    strokeDasharray="4 4"
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "monthly" && (
        <ChartCard
          title="RCI monthly first-time share versus PMMS"
          subtitle="REALTORS® Confidence Index existing-home first-time share (selected months) · different instrument from the annual Profile"
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis
                  yAxisId="share"
                  domain={[20, 36]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  yAxisId="rate"
                  orientation="right"
                  domain={[2, 8]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    if (name === "ftbSharePct") return [fmtPct(n, 0), "RCI first-time share"];
                    if (name === "rateAvgPct") return [fmtPct(n, 2), "30-year avg"];
                    return [String(value), String(name)];
                  }}
                />
                <Legend />
                <Line
                  yAxisId="share"
                  type="monotone"
                  dataKey="ftbSharePct"
                  name="RCI first-time share"
                  stroke={TEAL}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="rate"
                  type="monotone"
                  dataKey="rateAvgPct"
                  name="30-year avg"
                  stroke={AMBER}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                {showSixLine && (
                  <ReferenceLine
                    yAxisId="rate"
                    y={6}
                    stroke={ROSE}
                    strokeDasharray="4 4"
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "regimes" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Average first-time share by rate regime"
            subtitle="Calendar years 2015–2025 bucketed by Freddie Mac annual average"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REGIMES} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 40]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    formatter={(value, name) => {
                      const n = typeof value === "number" ? value : Number(value);
                      if (name === "avgFtbSharePct") return [fmtPct(n, 1), "Avg FTB share"];
                      if (name === "avgRatePct") return [fmtPct(n, 2), "Avg 30-year"];
                      return [String(value), String(name)];
                    }}
                  />
                  <Bar dataKey="avgFtbSharePct" name="Avg FTB share" radius={[4, 4, 0, 0]}>
                    {REGIMES.map((r) => (
                      <Cell
                        key={r.id}
                        fill={r.id === "above6" ? ROSE : r.id === "mid" ? AMBER : TEAL}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard
            title="Regime summary"
            subtitle="Mean Profile share, rate, and first-time age"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[280px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 pr-3 font-medium">Regime</th>
                    <th className="py-2 pr-3 font-medium">Years</th>
                    <th className="py-2 pr-3 font-medium">Avg share</th>
                    <th className="py-2 font-medium">Avg age</th>
                  </tr>
                </thead>
                <tbody>
                  {REGIMES.map((r) => (
                    <tr key={r.id} className="border-b border-slate-100">
                      <td className="py-2.5 pr-3 font-medium text-slate-900">{r.rateBand}</td>
                      <td className="py-2.5 pr-3 text-slate-600">{r.years}</td>
                      <td className="py-2.5 pr-3 text-slate-900">{fmtPct(r.avgFtbSharePct, 1)}</td>
                      <td className="py-2.5 text-slate-900">{r.avgMedianAge.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Above-6% years (2023–25) average a {fmtPct(REGIMES[2].avgFtbSharePct, 1)} first-time
              share versus {fmtPct(REGIMES[0].avgFtbSharePct, 1)} in sub-4% years — a{" "}
              {(REGIMES[0].avgFtbSharePct - REGIMES[2].avgFtbSharePct).toFixed(1)} pp gap while
              median first-time age rises from {REGIMES[0].avgMedianAge.toFixed(1)} to{" "}
              {REGIMES[2].avgMedianAge.toFixed(1)}.
            </p>
          </ChartCard>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
      <p className="sr-only">
        Series length annual {ANNUAL.length}, quarterly {QUARTERLY.length}, monthly RCI{" "}
        {MONTHLY_RCI.length}. Navy {NAVY}.
      </p>
    </div>
  );
}
