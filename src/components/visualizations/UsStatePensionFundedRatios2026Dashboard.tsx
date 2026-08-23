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
  BEST_FUNDED,
  CRR_FUNDED_PATH,
  CRR_TERCILES,
  EQUABLE_NATIONAL_PATH,
  FUNDED_BINS,
  FUNDED_VS_UAAL,
  HEADLINE,
  REGION_OPTIONS,
  SOURCE_NOTE,
  TOP_UAAL,
  UAAL_CONCENTRATION,
  WORST_FUNDED,
  fmt1,
  fmtB,
  fmtPct,
  statesByRegion,
  type RegionId,
} from "@/data/us-state-pension-funded-ratios-2026-data";

// viz-types: funded histogram bars, UAAL concentration area, top-UAAL bars, funded×UAAL scatter, CRR/Equable path lines, tercile bars | layout: default

type ViewId = "distribution" | "concentration" | "scatter" | "path";
type SortMetric = "funded" | "uaal";

const NAVY = "#0f172a";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const SLATE = "#64748b";
const INDIGO = "#4f46e5";
const EMERALD = "#059669";

const BAND_COLORS: Record<string, string> = {
  resilient: EMERALD,
  fragile: AMBER,
  distressed: ROSE,
};

const REGION_COLORS: Record<string, string> = {
  Northeast: INDIGO,
  Midwest: TEAL,
  South: ROSE,
  West: AMBER,
  DC: SLATE,
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

function StatChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "rose" | "teal" | "amber";
}) {
  const toneCls =
    tone === "rose"
      ? "text-rose-700"
      : tone === "teal"
        ? "text-teal-700"
        : tone === "amber"
          ? "text-amber-700"
          : "text-slate-900";
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className={`mt-0.5 text-lg font-bold tabular-nums ${toneCls}`}>
        {value}
      </div>
    </div>
  );
}

export function UsStatePensionFundedRatios2026Dashboard() {
  const [view, setView] = useState<ViewId>("concentration");
  const [region, setRegion] = useState<RegionId | "all">("all");
  const [sortMetric, setSortMetric] = useState<SortMetric>("uaal");

  const regionStates = useMemo(() => statesByRegion(region), [region]);

  const rankRows = useMemo(() => {
    const rows = [...regionStates];
    if (sortMetric === "funded") {
      rows.sort((a, b) => a.fundedPct - b.fundedPct);
    } else {
      rows.sort((a, b) => b.uaalB - a.uaalB);
    }
    return rows.slice(0, 15).map((s) => ({
      ...s,
      short: s.label.replace("District of Columbia", "D.C."),
      metric: sortMetric === "funded" ? s.fundedPct : Math.max(s.uaalB, 0),
    }));
  }, [regionStates, sortMetric]);

  const scatterData = useMemo(() => {
    if (region === "all") return FUNDED_VS_UAAL;
    return FUNDED_VS_UAAL.filter((d) => d.region === region);
  }, [region]);

  return (
    <div
      className="space-y-4"
      data-viz="us-state-pension-funded-ratios-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
              State pensions · funded ratios &amp; UAAL
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
              Top 5 states hold {fmt1(HEADLINE.top5UaalSharePct)}% of U.S.
              pension UAAL
            </h2>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              Equable end-2025 estimates: national funded ratio{" "}
              {fmtPct(HEADLINE.nationalFundedRatioPct)} with{" "}
              ${HEADLINE.nationalUaalTrillion}T unfunded. California and
              Illinois alone account for {fmt1(HEADLINE.top2UaalSharePct)}% of
              the shortfall — while seven jurisdictions sit at or above full
              funding.
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatChip
            label="National funded"
            value={fmtPct(HEADLINE.nationalFundedRatioPct)}
            tone="teal"
          />
          <StatChip
            label="National UAAL"
            value={`$${HEADLINE.nationalUaalTrillion}T`}
            tone="amber"
          />
          <StatChip
            label="Top-5 UAAL share"
            value={fmtPct(HEADLINE.top5UaalSharePct)}
            tone="rose"
          />
          <StatChip
            label="CA + IL share"
            value={fmtPct(HEADLINE.top2UaalSharePct)}
            tone="rose"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <ToggleGroup
          label="View"
          value={view}
          onChange={setView}
          options={[
            { id: "concentration", label: "UAAL share" },
            { id: "distribution", label: "Funded bins" },
            { id: "scatter", label: "Funded × UAAL" },
            { id: "path", label: "National path" },
          ]}
        />
        <ToggleGroup
          label="Region"
          value={region}
          onChange={setRegion}
          options={REGION_OPTIONS.map((r) => ({ id: r.id, label: r.label }))}
        />
        {(view === "distribution" || view === "concentration") && (
          <ToggleGroup
            label="Rank by"
            value={sortMetric}
            onChange={setSortMetric}
            options={[
              { id: "uaal", label: "UAAL $" },
              { id: "funded", label: "Funded %" },
            ]}
          />
        )}
      </div>

      {view === "concentration" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Cumulative UAAL concentration"
            subtitle="Largest positive-UAAL states first vs Equable $1.27T national shortfall"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={UAAL_CONCENTRATION.slice(0, 25)}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="rank"
                    tick={{ fontSize: 11, fill: SLATE }}
                    label={{
                      value: "State rank by UAAL",
                      position: "insideBottom",
                      offset: -2,
                      fontSize: 11,
                      fill: SLATE,
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: SLATE }}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      typeof v === "number" ? fmtPct(v) : String(v),
                      name === "cumSharePct" ? "Cumulative share" : "State share",
                    ]}
                    labelFormatter={(_, payload) => {
                      const p = payload?.[0]?.payload as
                        | { label?: string }
                        | undefined;
                      return p?.label ?? "";
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumSharePct"
                    name="cumSharePct"
                    fill={ROSE}
                    fillOpacity={0.15}
                    stroke={ROSE}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="sharePct"
                    name="sharePct"
                    stroke={NAVY}
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <ReferenceLine
                    y={HEADLINE.top5UaalSharePct}
                    stroke={AMBER}
                    strokeDasharray="4 4"
                    label={{
                      value: `Top 5 = ${fmt1(HEADLINE.top5UaalSharePct)}%`,
                      fill: AMBER,
                      fontSize: 11,
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Largest UAAL states"
            subtitle="Dollar shortfall and share of national $1.27T"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={TOP_UAAL}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: SLATE }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={88}
                    tick={{ fontSize: 11, fill: SLATE }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      name === "uaalB"
                        ? fmtB(Number(v))
                        : fmtPct(Number(v)),
                      name === "uaalB" ? "UAAL" : "Share of national",
                    ]}
                  />
                  <Bar dataKey="uaalB" name="uaalB" radius={[0, 4, 4, 0]}>
                    {TOP_UAAL.map((s) => (
                      <Cell
                        key={s.id}
                        fill={BAND_COLORS[s.band] ?? TEAL}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "distribution" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Funded-ratio distribution"
            subtitle="Count of states + D.C. by Equable 2025 funded-ratio bin"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={FUNDED_BINS}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="bin" tick={{ fontSize: 11, fill: SLATE }} />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: SLATE }}
                  />
                  <Tooltip />
                  <Bar dataKey="count" name="States" radius={[4, 4, 0, 0]}>
                    {FUNDED_BINS.map((b) => (
                      <Cell
                        key={b.bin}
                        fill={
                          b.bin === "<60%"
                            ? ROSE
                            : b.bin === "≥100%" || b.bin === "90–100%"
                              ? EMERALD
                              : TEAL
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title={
              sortMetric === "funded"
                ? "Lowest funded ratios"
                : "Highest UAAL (region filter)"
            }
            subtitle={
              region === "all"
                ? "Toggle Rank by · region filter applies"
                : `Filtered: ${region}`
            }
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={rankRows}
                  layout="vertical"
                  margin={{ top: 4, right: 12, left: 4, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: SLATE }}
                    tickFormatter={(v) =>
                      sortMetric === "funded" ? `${v}%` : `$${v}B`
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={80}
                    tick={{ fontSize: 11, fill: SLATE }}
                  />
                  <Tooltip
                    formatter={(v) =>
                      sortMetric === "funded"
                        ? fmtPct(Number(v))
                        : fmtB(Number(v))
                    }
                  />
                  <Bar dataKey="metric" radius={[0, 4, 4, 0]}>
                    {rankRows.map((s) => (
                      <Cell
                        key={s.id}
                        fill={BAND_COLORS[s.band] ?? TEAL}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "scatter" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Funded ratio vs UAAL"
            subtitle="Bubble size ∝ |UAAL|; color by census region"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="fundedPct"
                    name="Funded %"
                    domain={[50, 120]}
                    tick={{ fontSize: 11, fill: SLATE }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: "Funded ratio",
                      position: "insideBottom",
                      offset: -4,
                      fontSize: 11,
                      fill: SLATE,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="uaalB"
                    name="UAAL $B"
                    tick={{ fontSize: 11, fill: SLATE }}
                    tickFormatter={(v) => `$${v}B`}
                  />
                  <ZAxis type="number" dataKey="absUaalB" range={[40, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v, name) => {
                      if (name === "Funded %") return [fmtPct(Number(v)), name];
                      if (name === "UAAL $B") return [fmtB(Number(v)), name];
                      return [String(v), String(name)];
                    }}
                    labelFormatter={(_, payload) => {
                      const p = payload?.[0]?.payload as
                        | { label?: string }
                        | undefined;
                      return p?.label ?? "";
                    }}
                  />
                  <ReferenceLine y={0} stroke={SLATE} strokeDasharray="3 3" />
                  <Scatter data={scatterData} name="States">
                    {scatterData.map((d) => (
                      <Cell
                        key={d.id}
                        fill={REGION_COLORS[d.region] ?? TEAL}
                        fillOpacity={0.75}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="CRR plan terciles (FY 2025)"
            subtitle="Boston College CRR PPD: aggregate funded ratio within each third of plans"
          >
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...CRR_TERCILES]}
                  margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: SLATE }} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: SLATE }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Bar dataKey="fundedPct" name="Funded %" radius={[4, 4, 0, 0]}>
                    <Cell fill={EMERALD} />
                    <Cell fill={AMBER} />
                    <Cell fill={ROSE} />
                  </Bar>
                  <ReferenceLine
                    y={HEADLINE.crrActuarialFundedPct}
                    stroke={NAVY}
                    strokeDasharray="4 4"
                    label={{
                      value: `CRR agg ${HEADLINE.crrActuarialFundedPct}%`,
                      fill: NAVY,
                      fontSize: 11,
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {view === "path" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="National funded-ratio path"
            subtitle="Equable market/estimated vs CRR PPD actuarial (different bases)"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="year"
                    type="number"
                    domain={[2000, 2026]}
                    tick={{ fontSize: 11, fill: SLATE }}
                    allowDecimals={false}
                  />
                  <YAxis
                    domain={[65, 110]}
                    tick={{ fontSize: 11, fill: SLATE }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip formatter={(v) => fmtPct(Number(v))} />
                  <Legend />
                  <Line
                    data={[...CRR_FUNDED_PATH]}
                    type="monotone"
                    dataKey="fundedPct"
                    name="CRR actuarial"
                    stroke={INDIGO}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    data={[...EQUABLE_NATIONAL_PATH]}
                    type="monotone"
                    dataKey="fundedPct"
                    name="Equable est."
                    stroke={TEAL}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Equable national UAAL path"
            subtitle="Unfunded liability ($T) — still stuck above $1T since the GFC era"
          >
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={[...EQUABLE_NATIONAL_PATH]}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11, fill: SLATE }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: SLATE }}
                    tickFormatter={(v) => `$${v}T`}
                    domain={[0.8, 1.7]}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      name === "uaalT"
                        ? `$${Number(v).toFixed(2)}T`
                        : fmtPct(Number(v)),
                      name === "uaalT" ? "UAAL" : "Funded %",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="uaalT"
                    name="uaalT"
                    fill={ROSE}
                    fillOpacity={0.2}
                    stroke={ROSE}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="fundedPct"
                    name="fundedPct"
                    stroke={TEAL}
                    strokeWidth={2}
                    yAxisId={0}
                    hide
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Best-funded statewide averages" subtitle="Equable 2025">
          <ul className="divide-y divide-slate-100 text-sm">
            {BEST_FUNDED.slice(0, 6).map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between py-2"
              >
                <span className="font-medium text-slate-800">{s.label}</span>
                <span className="tabular-nums text-emerald-700">
                  {fmtPct(s.fundedPct)} · {fmtB(s.uaalB)}
                </span>
              </li>
            ))}
          </ul>
        </ChartCard>
        <ChartCard title="Worst-funded statewide averages" subtitle="Equable 2025">
          <ul className="divide-y divide-slate-100 text-sm">
            {WORST_FUNDED.slice(0, 6).map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between py-2"
              >
                <span className="font-medium text-slate-800">{s.label}</span>
                <span className="tabular-nums text-rose-700">
                  {fmtPct(s.fundedPct)} · {fmtB(s.uaalB)}
                </span>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
