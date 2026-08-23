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
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  EPISODES,
  HEADLINE,
  LOSS_PRESSURE,
  MONTHLY_SPREAD,
  PASS_THROUGH_DELTAS,
  REGION_QUOTES,
  SOURCE_NOTE,
  UNWIND_2025,
  fmtPct,
  fmtUsd,
  type Confidence,
} from "@/data/egg-price-shocks-and-pass-through-2026-data";

// viz-types: dual-line composed, unwind area, region bars, pass-through scatter, episode ladder | layout: default

type ViewId = "spread" | "unwind" | "regions" | "passThrough" | "episodes";
type WaveFilter = "all" | "wave-2022" | "wave-2024" | "wave-2025" | "post-2025";
type PriceMode = "levels" | "spread" | "ratio";

const NAVY = "#0f172a";
const AMBER = "#d97706";
const TEAL = "#0f766e";
const ROSE = "#be123c";
const SLATE = "#64748b";
const SKY = "#0284c7";

const WAVE_COLORS: Record<string, string> = {
  quiet: SLATE,
  "wave-2022": ROSE,
  "wave-2023-unwind": AMBER,
  "wave-2024": SKY,
  "wave-2025": TEAL,
  "post-2025": NAVY,
  "2022": ROSE,
  "2023 unwind": AMBER,
  "2024": SKY,
  "2025": TEAL,
  "2025 lag": "#a21caf",
  "2025 unwind": "#059669",
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
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ConfidenceChip({ c }: { c: Confidence }) {
  const tone =
    c === "disclosed"
      ? "bg-emerald-50 text-emerald-800"
      : c === "estimated"
        ? "bg-amber-50 text-amber-800"
        : "bg-slate-100 text-slate-600";
  return (
    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${tone}`}>
      {c}
    </span>
  );
}

export function EggPriceShocksAndPassThrough2026Dashboard() {
  const [view, setView] = useState<ViewId>("spread");
  const [wave, setWave] = useState<WaveFilter>("all");
  const [priceMode, setPriceMode] = useState<PriceMode>("levels");

  const monthly = useMemo(() => {
    if (wave === "all") return MONTHLY_SPREAD;
    if (wave === "wave-2022") {
      return MONTHLY_SPREAD.filter(
        (r) =>
          r.hpaiWave === "wave-2022" ||
          r.hpaiWave === "wave-2023-unwind" ||
          r.month.startsWith("2022") ||
          r.month.startsWith("2023"),
      );
    }
    if (wave === "wave-2024") {
      return MONTHLY_SPREAD.filter((r) => r.hpaiWave === "wave-2024");
    }
    if (wave === "wave-2025") {
      return MONTHLY_SPREAD.filter((r) => r.hpaiWave === "wave-2025");
    }
    return MONTHLY_SPREAD.filter((r) => r.hpaiWave === "post-2025");
  }, [wave]);

  const deltas = useMemo(() => {
    if (wave === "all") return PASS_THROUGH_DELTAS;
    if (wave === "wave-2022") {
      return PASS_THROUGH_DELTAS.filter(
        (d) => d.wave.includes("2022") || d.wave.includes("2023"),
      );
    }
    if (wave === "wave-2024") {
      return PASS_THROUGH_DELTAS.filter((d) => d.wave.includes("2024"));
    }
    if (wave === "wave-2025") {
      return PASS_THROUGH_DELTAS.filter((d) => d.wave.includes("2025"));
    }
    return PASS_THROUGH_DELTAS;
  }, [wave]);

  return (
    <div
      className="mx-auto flex w-full max-w-5xl flex-col gap-4"
      data-viz="egg-price-shocks-and-pass-through-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 px-5 py-4 text-white sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-200/90">
          Wholesale-to-retail lag
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-200 sm:text-base">
          BLS retail peaked at {fmtUsd(HEADLINE.retailPeakUsd)}/doz in March 2025 —
          about {HEADLINE.shelfLagWeeks} weeks after AMS national loose wholesale
          printed near {fmtUsd(HEADLINE.wholesalePeakUsd)}. Crest pass-through ~
          {HEADLINE.crestPassThroughPct}%; wholesale fell ~
          {fmtPct(HEADLINE.wholesaleMarToAprDropPct)} Mar→Apr while retail dropped
          only ~{fmtPct(HEADLINE.retailFirstMonthDropPct)}.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="Panel"
          value={view}
          onChange={setView}
          options={[
            { id: "spread", label: "Price path" },
            { id: "unwind", label: "Unwind" },
            { id: "regions", label: "Regions" },
            { id: "passThrough", label: "Δ pass-through" },
            { id: "episodes", label: "Episodes" },
          ]}
        />
        <ToggleGroup
          label="Wave"
          value={wave}
          onChange={setWave}
          options={[
            { id: "all", label: "All" },
            { id: "wave-2022", label: "2022–23" },
            { id: "wave-2024", label: "2024" },
            { id: "wave-2025", label: "2025" },
            { id: "post-2025", label: "Post" },
          ]}
        />
      </div>

      {view === "spread" && (
        <ChartCard
          title="Wholesale vs retail dollars per dozen"
          subtitle="AMS-anchored national loose wholesale vs BLS Grade A large average price"
        >
          <ToggleGroup
            label="Mode"
            value={priceMode}
            onChange={setPriceMode}
            options={[
              { id: "levels", label: "Levels" },
              { id: "spread", label: "Retail − wholesale" },
              { id: "ratio", label: "Retail / wholesale %" },
            ]}
          />
          <div className="mt-4 h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              {priceMode === "levels" ? (
                <ComposedChart data={monthly} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} domain={[0, "auto"]} />
                  <Tooltip
                    formatter={(value, name) => [
                      fmtUsd(Number(value)),
                      name === "wholesaleUsd" ? "Wholesale" : "Retail",
                    ]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="wholesaleUsd"
                    name="Wholesale"
                    fill={TEAL}
                    fillOpacity={0.15}
                    stroke={TEAL}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="retailUsd"
                    name="Retail (BLS)"
                    stroke={AMBER}
                    strokeWidth={2.5}
                    dot={false}
                  />
                </ComposedChart>
              ) : priceMode === "spread" ? (
                <BarChart data={monthly} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                  <ReferenceLine y={0} stroke={SLATE} />
                  <Tooltip formatter={(value) => [fmtUsd(Number(value)), "Spread"]} />
                  <Bar dataKey="spreadUsd" name="Retail − wholesale" radius={[3, 3, 0, 0]}>
                    {monthly.map((r) => (
                      <Cell key={r.month} fill={r.spreadUsd >= 0 ? TEAL : ROSE} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <LineChart data={monthly} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                  <ReferenceLine y={100} stroke={SLATE} strokeDasharray="4 4" />
                  <Tooltip formatter={(value) => [fmtPct(Number(value)), "Retail/wholesale"]} />
                  <Line
                    type="monotone"
                    dataKey="retailToWholesalePct"
                    name="Retail / wholesale %"
                    stroke={NAVY}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "unwind" && (
        <ChartCard
          title="2025 crest unwind (index, peak = 100)"
          subtitle="Wholesale halves in ~6 weeks; retail takes ~14 weeks to cut peak by half"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={UNWIND_2025} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="weeksFromPeak"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Weeks from wholesale peak",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 11,
                  }}
                />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 110]} />
                <Tooltip
                  formatter={(value, name) => [
                    Number(value).toFixed(0),
                    name === "wholesaleIndex" ? "Wholesale index" : "Retail index",
                  ]}
                  labelFormatter={(l) => `Week ${l}`}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="wholesaleIndex"
                  name="Wholesale"
                  stroke={TEAL}
                  fill={TEAL}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="retailIndex"
                  name="Retail"
                  stroke={AMBER}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <ReferenceLine y={50} stroke={ROSE} strokeDasharray="4 4" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "regions" && (
        <ChartCard
          title="Regional wholesale quotes: Feb vs Aug 2025"
          subtitle="AMS report-week Large white conventional — same channels, six months later"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={REGION_QUOTES}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                <YAxis type="category" dataKey="region" width={130} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => fmtUsd(Number(value))} />
                <Legend />
                <Bar dataKey="feb2025Usd" name="Feb 28, 2025" fill={ROSE} radius={[0, 3, 3, 0]} />
                <Bar dataKey="aug2025Usd" name="Aug 22, 2025" fill={TEAL} radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
            {REGION_QUOTES.map((r) => (
              <li
                key={r.region}
                className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2"
              >
                <span>
                  {r.region} · −{r.dropPct}%
                </span>
                <ConfidenceChip c={r.confidence} />
              </li>
            ))}
          </ul>
        </ChartCard>
      )}

      {view === "passThrough" && (
        <ChartCard
          title="Monthly Δ wholesale → lagged Δ retail"
          subtitle="Each point: change in wholesale vs next-month change in BLS retail"
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="dWholesale"
                  name="Δ wholesale"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}`}
                  label={{
                    value: "Δ wholesale ($/doz)",
                    position: "insideBottom",
                    offset: -4,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="dRetailLag1"
                  name="Δ retail +1m"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}`}
                  label={{
                    value: "Δ retail +1m",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                />
                <ReferenceLine x={0} stroke={SLATE} />
                <ReferenceLine y={0} stroke={SLATE} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => [
                    fmtUsd(Number(value)),
                    name === "dWholesale" ? "Δ wholesale" : "Δ retail +1m",
                  ]}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as { label?: string } | undefined;
                    return p?.label ?? "";
                  }}
                />
                <Scatter data={deltas} name="Month pairs">
                  {deltas.map((d) => (
                    <Cell key={d.id} fill={WAVE_COLORS[d.wave] ?? NAVY} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Points in the lower-right (wholesale already falling, retail still rising) mark the
            classic shelf lag — visible in Feb→Mar 2025.
          </p>
        </ChartCard>
      )}

      {view === "episodes" && (
        <>
          <ChartCard
            title="HPAI episode ladder"
            subtitle="Peak dollars, lag weeks, and half-life of the unwind"
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={EPISODES} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="wholesalePeakUsd"
                    name="Wholesale peak"
                    fill={TEAL}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="retailPeakUsd"
                    name="Retail peak"
                    fill={AMBER}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="py-2 pr-3">Episode</th>
                    <th className="py-2 pr-3">Lag</th>
                    <th className="py-2 pr-3">Pass-through</th>
                    <th className="py-2 pr-3">W half-life</th>
                    <th className="py-2 pr-3">R half-life</th>
                    <th className="py-2">Layers lost</th>
                  </tr>
                </thead>
                <tbody>
                  {EPISODES.map((e) => (
                    <tr key={e.id} className="border-b border-slate-100">
                      <td className="py-2 pr-3 font-medium text-slate-800">{e.label}</td>
                      <td className="py-2 pr-3">{e.lagWeeks} wk</td>
                      <td className="py-2 pr-3">{e.passThroughPct}%</td>
                      <td className="py-2 pr-3">{e.wholesaleHalfLifeWeeks} wk</td>
                      <td className="py-2 pr-3">
                        {e.retailHalfLifeWeeks == null ? "—" : `${e.retailHalfLifeWeeks} wk`}
                      </td>
                      <td className="py-2">~{e.layerLossM}M</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
          <ChartCard
            title="Layer losses vs price pressure"
            subtitle="Annual / crest tallies — not a causal regression"
          >
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={LOSS_PRESSURE} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="layersLostM"
                    name="Layers lost (M)"
                    fill={NAVY}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="wholesaleHighUsd"
                    name="Wholesale high"
                    stroke={TEAL}
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="retailAvgUsd"
                    name="Retail avg"
                    stroke={AMBER}
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </>
      )}

      <p className="text-[11px] leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
