"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
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
  FY2024_FUELS,
  HEADLINE,
  SOURCE_NOTE,
  VIZ_MARKERS,
  dualSeries,
  eraSummary,
  fmtM,
  fmtPerAcre,
  scatterPoints,
  treatmentMixForFy,
  wuiNonWuiLadder,
  type EraId,
} from "@/data/forest-service-suppression-spend-versus-fuels-acres-treated-2026-data";

// viz-types: dual composed (bars+line), per-acre line, era group bars,
// treatment-mix pie, WUI/non-WUI stacked area, suppress×fuels scatter
// | layout: default
// smoke-marker: Suppression $ vs fuels acres

type ViewId =
  | "dual"
  | "perAcre"
  | "eras"
  | "mix"
  | "wui"
  | "scatter";

type EraFilter = "all" | EraId;
type DollarLens = "nominal" | "index";

const NAVY = "#0f172a";
const AMBER = "#d97706";
const ROSE = "#e11d48";
const TEAL = "#0d9488";
const INDIGO = "#4f46e5";
const SLATE = "#64748b";
const EMERALD = "#059669";

const ERA_COLORS: Record<EraId, string> = {
  "pre-spike": TEAL,
  "mega-fire": AMBER,
  "crisis-ramp": ROSE,
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

export function ForestServiceSuppressionSpendVersusFuelsAcresTreated2026Dashboard() {
  const [view, setView] = useState<ViewId>("dual");
  const [eraFilter, setEraFilter] = useState<EraFilter>("all");
  const [dollarLens, setDollarLens] = useState<DollarLens>("nominal");
  const [mixFy, setMixFy] = useState(2023);

  const series = useMemo(() => {
    const all = dualSeries();
    if (eraFilter === "all") return all;
    return all.filter((r) => r.era === eraFilter);
  }, [eraFilter]);

  const eras = useMemo(() => eraSummary(), []);
  const mix = useMemo(() => treatmentMixForFy(mixFy), [mixFy]);
  const wuiLadder = useMemo(() => wuiNonWuiLadder(), []);
  const scatter = useMemo(() => {
    const pts = scatterPoints();
    if (eraFilter === "all") return pts;
    return pts.filter((p) => p.era === eraFilter);
  }, [eraFilter]);

  const mixYears = ANNUAL.map((r) => r.fy);

  return (
    <div
      className="mx-auto w-full max-w-5xl space-y-6"
      data-viz="forest-service-suppression-spend-versus-fuels-acres-treated-2026"
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 px-5 py-6 text-white sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-300/90">
          {VIZ_MARKERS[0]}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Suppression dollars climbed {HEADLINE.suppressMultipleVs2010}× while
          fuels acres edged up {HEADLINE.fuelsIndex2023 - 100}%
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
          From FY{HEADLINE.fyStart} to FY{HEADLINE.fyEnd}, USDA Forest Service
          wildfire suppression outlays rose from {fmtM(HEADLINE.fy2010SuppressM)}{" "}
          to {fmtM(HEADLINE.fy2023SuppressM)} (peak{" "}
          {fmtM(HEADLINE.peakSuppressM)} in FY{HEADLINE.peakFy}). Hazardous-fuels
          acres treated moved from {HEADLINE.fy2010FuelsM}M to{" "}
          {HEADLINE.fy2023FuelsM}M — so dollars per treated acre jumped from{" "}
          {fmtPerAcre(HEADLINE.fy2010PerAcre)} to{" "}
          {fmtPerAcre(HEADLINE.fy2023PerAcre)}.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "FY2023 suppression",
              value: fmtM(HEADLINE.fy2023SuppressM),
            },
            {
              label: "FY2023 fuels acres",
              value: `${HEADLINE.fy2023FuelsM}M`,
            },
            {
              label: "$ / fuels acre",
              value: fmtPerAcre(HEADLINE.fy2023PerAcre),
            },
            {
              label: "Peak $ / acre (FY21)",
              value: fmtPerAcre(HEADLINE.peakPerAcre),
            },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-0.5 text-lg font-semibold text-white">{k.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup<ViewId>
          value={view}
          onChange={setView}
          options={[
            { id: "dual", label: "Dual track" },
            { id: "perAcre", label: "$ / acre" },
            { id: "eras", label: "Era averages" },
            { id: "mix", label: "Treatment mix" },
            { id: "wui", label: "WUI share" },
            { id: "scatter", label: "Scatter" },
          ]}
        />
        <div className="flex flex-wrap items-center gap-3">
          <ToggleGroup<EraFilter>
            value={eraFilter}
            onChange={setEraFilter}
            options={[
              { id: "all", label: "All eras" },
              { id: "pre-spike", label: "2010–14" },
              { id: "mega-fire", label: "2015–20" },
              { id: "crisis-ramp", label: "2021–23" },
            ]}
          />
          {(view === "dual" || view === "perAcre") && (
            <ToggleGroup<DollarLens>
              value={dollarLens}
              onChange={setDollarLens}
              options={[
                { id: "nominal", label: "Nominal $" },
                { id: "index", label: "FY2010=100" },
              ]}
            />
          )}
        </div>
      </div>

      {view === "dual" && (
        <ChartCard
          title="Suppression outlays versus fuels acres treated"
          subtitle="Bars = FS suppression ($M, NIFC). Line = FS hazardous-fuels acres (millions)."
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fill: SLATE, fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  tickFormatter={(v) =>
                    dollarLens === "index" ? `${v}` : `$${v}`
                  }
                  label={{
                    value: dollarLens === "index" ? "Index" : "$M",
                    angle: -90,
                    position: "insideLeft",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  tickFormatter={(v) =>
                    dollarLens === "index" ? `${v}` : `${v}M`
                  }
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey={dollarLens === "index" ? "suppressIdx" : "suppressM"}
                  name={
                    dollarLens === "index"
                      ? "Suppression index"
                      : "Suppression ($M)"
                  }
                  fill={NAVY}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey={dollarLens === "index" ? "fuelsIdx" : "fuelsAcresM"}
                  name={
                    dollarLens === "index" ? "Fuels index" : "Fuels acres (M)"
                  }
                  stroke={AMBER}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: AMBER }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {view === "perAcre" && (
        <ChartCard
          title="Suppression dollars per fuels acre treated"
          subtitle="Desk ratio: NIFC FS suppression ÷ HFR FS fuels acres. Not an official index."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fill: SLATE, fontSize: 11 }} />
                <YAxis
                  tick={{ fill: SLATE, fontSize: 11 }}
                  tickFormatter={(v) =>
                    dollarLens === "index"
                      ? `${v}`
                      : `$${Math.round(v / 100) * 100}`
                  }
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }}
                  formatter={(value) =>
                    dollarLens === "index"
                      ? [`${value}`, "Index vs FY2010 per-acre"]
                      : [fmtPerAcre(Number(value)), "$ / acre"]
                  }
                />
                <Line
                  type="monotone"
                  dataKey="perAcre"
                  name="$ / fuels acre"
                  stroke={ROSE}
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: ROSE }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Peak {fmtPerAcre(HEADLINE.peakPerAcre)} in FY{HEADLINE.peakFy}; FY2023
            settled at {fmtPerAcre(HEADLINE.fy2023PerAcre)} — still ~
            {Math.round(HEADLINE.fy2023PerAcre / HEADLINE.fy2010PerAcre)}× the
            FY2010 ratio.
          </p>
        </ChartCard>
      )}

      {view === "eras" && (
        <ChartCard
          title="Era averages: spending intensity versus treatment pace"
          subtitle="Pre-spike (FY2010–14), mega-fire years (FY2015–20), crisis ramp (FY2021–23)."
        >
          <div className="h-[340px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={eras} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fill: SLATE, fontSize: 10 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  tickFormatter={(v) => `$${v}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  tickFormatter={(v) => `${v}M`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="avgSuppressM"
                  name="Avg suppression ($M)"
                  fill={NAVY}
                  radius={[4, 4, 0, 0]}
                >
                  {eras.map((e) => (
                    <Cell key={e.era} fill={ERA_COLORS[e.era as EraId]} />
                  ))}
                </Bar>
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgFuelsM"
                  name="Avg fuels acres (M)"
                  stroke={INDIGO}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: INDIGO }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {eras.map((e) => (
              <div
                key={e.era}
                className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <p className="text-xs font-semibold text-slate-600">{e.label}</p>
                <p className="mt-1 text-sm text-slate-800">
                  Avg {fmtPerAcre(e.avgPerAcre)}
                </p>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {view === "mix" && (
        <ChartCard
          title="How FS fuels acres are typed"
          subtitle="Prescribed fire, mechanical, wildfire counted as treatment, and other methods."
        >
          <div className="mb-4">
            <ToggleGroup
              value={String(mixFy)}
              onChange={(v) => setMixFy(Number(v))}
              options={mixYears.map((y) => ({
                id: String(y),
                label: `FY${y}`,
              }))}
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mix}
                    dataKey="acres"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {mix.map((m) => (
                      <Cell key={m.name} fill={m.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${Math.round(Number(value)).toLocaleString()} ac`,
                      String(name),
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center space-y-2">
              {mix.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
                >
                  <span className="flex items-center gap-2 text-sm text-slate-700">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ background: m.fill }}
                    />
                    {m.name}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {m.sharePct}%
                  </span>
                </div>
              ))}
              <p className="pt-2 text-xs text-slate-500">
                FY2024 fuels acres:{" "}
                {(FY2024_FUELS.fuelsAcres / 1_000_000).toFixed(2)}M (NFS only;
                suppression not yet in NIFC dual panel).
              </p>
            </div>
          </div>
        </ChartCard>
      )}

      {view === "wui" && (
        <ChartCard
          title="WUI versus non-WUI fuels acres"
          subtitle="Wildland–urban interface designation share of Forest Service treatment acres."
        >
          <div className="h-[360px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={
                  eraFilter === "all"
                    ? wuiLadder
                    : wuiLadder.filter((r) => {
                        const row = ANNUAL.find((a) => a.fy === r.fy);
                        return row?.era === eraFilter;
                      })
                }
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fill: SLATE, fontSize: 11 }} />
                <YAxis
                  tick={{ fill: SLATE, fontSize: 11 }}
                  tickFormatter={(v) => `${v}M`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="wuiM"
                  name="WUI (M ac)"
                  stackId="1"
                  fill={EMERALD}
                  stroke={EMERALD}
                  fillOpacity={0.75}
                />
                <Area
                  type="monotone"
                  dataKey="nonWuiM"
                  name="Non-WUI (M ac)"
                  stackId="1"
                  fill={INDIGO}
                  stroke={INDIGO}
                  fillOpacity={0.55}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            FY2023 WUI share ≈ {HEADLINE.wuiShare2023Pct}% of FS designation
            acres — community-edge work remains the majority of the treatment
            ledger.
          </p>
        </ChartCard>
      )}

      {view === "scatter" && (
        <ChartCard
          title="Each fiscal year as a point: acres × suppression"
          subtitle="Bubble size scales with dollars per treated acre. Color = era."
        >
          <div className="h-[380px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="fuelsM"
                  name="Fuels acres (M)"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  unit="M"
                  domain={["auto", "auto"]}
                  label={{
                    value: "Fuels acres (millions)",
                    position: "insideBottom",
                    offset: -2,
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="suppressM"
                  name="Suppression ($M)"
                  tick={{ fill: SLATE, fontSize: 11 }}
                  label={{
                    value: "Suppression ($M)",
                    angle: -90,
                    position: "insideLeft",
                    fill: SLATE,
                    fontSize: 11,
                  }}
                />
                <ZAxis type="number" dataKey="perAcre" range={[60, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    if (name === "suppressM") return [fmtM(Number(value)), "Suppression"];
                    if (name === "fuelsM") return [`${value}M ac`, "Fuels"];
                    if (name === "perAcre") return [fmtPerAcre(Number(value)), "$/ac"];
                    return [String(value), String(name)];
                  }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as { fy?: number } | undefined;
                    return p?.fy ? `FY${p.fy}` : "";
                  }}
                />
                <Scatter data={scatter} name="Fiscal years">
                  {scatter.map((p) => (
                    <Cell key={p.fy} fill={ERA_COLORS[p.era]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      <p className="text-xs leading-relaxed text-slate-500">{SOURCE_NOTE}</p>
    </div>
  );
}
