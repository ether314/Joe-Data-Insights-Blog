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
  DEPLETION_PATH,
  FAMILY_COLORS,
  HEADLINE,
  INTEREST_VS_DISC_PATH,
  JCT_WATERFALL,
  LAYER_COLORS,
  LAYER_COMPOSITION,
  OFF_BALANCE_DELTAS,
  SCOPE_GAP,
  SOURCE_NOTE,
  SOURCES,
  TRUST_DELTAS,
  VINTAGE_DELTAS,
  deltaSigned,
  deltasFor,
  fmtBn,
  fmtDeltaBn,
  fmtTn,
  fmtYearDelta,
  jctLinesFor,
  type LayerId,
} from "@/data/fiscal-plumbing-update-2026q3-data";

// viz-types: diverging-delta-bar, jct composed, interest-vs-disc dual area, trust dual-path, layer grouped bar, off-balance scatter, jct waterfall, ESI gap | layout: default
// viz-plan: Q3 vs Aug-update vintage Δ; interest race emphasis; carried trust clocks; JCT waterfall; off-balance leverage

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

type LayerFilter = LayerId | "All";
type FamilyFilter = string | "All";
type ViewMode = "deltas" | "interest-race" | "trust-carry";

const FAMILIES: FamilyFilter[] = [
  "All",
  "retirement",
  "capital",
  "health",
  "income-support",
  "business",
  "charity",
  "other",
];

const LAYER_FILTERS: { id: LayerFilter; label: string }[] = [
  { id: "All", label: "All layers" },
  { id: "tax-code", label: "Tax code" },
  { id: "trust", label: "Trust funds" },
  { id: "off-balance", label: "Off-balance" },
  { id: "interest", label: "Net interest" },
  { id: "discretionary", label: "Discretionary" },
];

const VIEW_MODES: { id: ViewMode; label: string }[] = [
  { id: "deltas", label: "Vintage deltas" },
  { id: "interest-race", label: "Interest race" },
  { id: "trust-carry", label: "Trust carry" },
];

export function FiscalPlumbingUpdate2026q3Dashboard() {
  const [layer, setLayer] = useState<LayerFilter>("All");
  const [family, setFamily] = useState<FamilyFilter>("All");
  const [view, setView] = useState<ViewMode>("deltas");

  const deltaRows = useMemo(() => {
    return deltasFor(layer).map((r) => {
      const d = deltaSigned(r);
      let displayDelta = d;
      let displayLabel = r.shortLabel;
      if (r.unit === "tn") {
        displayDelta = d * 1000;
        displayLabel = `${r.shortLabel} ($B eq.)`;
      } else if (r.unit === "year") {
        displayDelta = d === 0 ? 0 : d * 40;
        displayLabel = `${r.shortLabel} (${fmtYearDelta(d)})`;
      }
      return {
        ...r,
        displayDelta,
        displayLabel,
        fill:
          r.unit === "year"
            ? d === 0
              ? "#64748b"
              : d < 0
                ? "#be123c"
                : "#0369a1"
            : d >= 0
              ? "#be123c"
              : "#0369a1",
      };
    });
  }, [layer]);

  const jctRows = useMemo(() => {
    return jctLinesFor(family).map((r) => ({
      ...r,
      delta: r.newBn - r.priorBn,
      fill: FAMILY_COLORS[r.family] ?? "#64748b",
    }));
  }, [family]);

  const layerBars = useMemo(
    () =>
      LAYER_COMPOSITION.map((r) => ({
        ...r,
        delta: r.newBn - r.priorBn,
      })),
    [],
  );

  const waterfallRows = useMemo(() => {
    let running = 0;
    return JCT_WATERFALL.map((step) => {
      if (step.type === "base" || step.type === "total") {
        running = step.valueBn;
        return {
          ...step,
          start: 0,
          height: step.valueBn,
          fill: step.type === "base" ? "#94a3b8" : "#f59e0b",
        };
      }
      const start = running;
      running += step.valueBn;
      return {
        ...step,
        start: Math.min(start, running),
        height: Math.abs(step.valueBn),
        fill: step.valueBn >= 0 ? "#be123c" : "#0369a1",
      };
    });
  }, []);

  const scatterRows = useMemo(
    () =>
      OFF_BALANCE_DELTAS.map((r) => ({
        ...r,
        deltaTn: r.newTn - r.priorTn,
        size: Math.max(80, r.newTn * 40),
      })),
    [],
  );

  const trustCarry = useMemo(
    () =>
      TRUST_DELTAS.filter((t) => t.priorDepletion != null).map((t) => ({
        name: t.shortLabel,
        year: t.newDepletion as number,
        reserveDelta: Number(((t.newReservesTn - t.priorReservesTn) * 1000).toFixed(0)),
        status: t.status,
      })),
    [],
  );

  return (
    <div
      className="space-y-6"
      data-viz="fiscal-plumbing-update-2026q3"
      data-viz-dashboard
    >
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
          Fiscal plumbing — Q3 vintage delta
        </p>
        <h2 className="mt-1 text-xl font-bold sm:text-2xl">
          Net interest ${HEADLINE.netInterestPriorBn / 1000}T → $
          {(HEADLINE.netInterestNewBn / 1000).toFixed(2)}T · JCT $
          {HEADLINE.jctPriorTn}T → ${HEADLINE.jctNewTn}T · GSE MBS $
          {HEADLINE.gsePriorTn}T → ${HEADLINE.gseNewTn}T
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Versus the Aug update vintage: CBO late-summer net interest adds{" "}
          {fmtDeltaBn(HEADLINE.netInterestDeltaBn)}, the CRFB/JCT fall refresh lifts the
          shadow budget +{HEADLINE.jctDeltaPct}%, and FHFA puts guaranteed GSE MBS up $
          {HEADLINE.gseDeltaTn.toFixed(2)}T. OASDI/HI clocks stay carried at{" "}
          {HEADLINE.oasdiNewYear}/{HEADLINE.hiNewYear}.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-xs text-slate-400">Net interest Δ</p>
            <p className="text-lg font-bold text-violet-300">
              {fmtDeltaBn(HEADLINE.netInterestDeltaBn)}
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-xs text-slate-400">JCT aggregate Δ</p>
            <p className="text-lg font-bold text-amber-300">
              +${HEADLINE.jctDeltaTn.toFixed(2)}T (+{HEADLINE.jctDeltaPct}%)
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-xs text-slate-400">GSE MBS stock</p>
            <p className="text-lg font-bold text-rose-300">
              +${HEADLINE.gseDeltaTn.toFixed(2)}T ({HEADLINE.gseDeltaPct}%)
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="self-center text-xs font-semibold uppercase tracking-wide text-slate-500">
          View
        </span>
        {VIEW_MODES.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setView(f.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              view === f.id
                ? "bg-violet-700 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="self-center text-xs font-semibold uppercase tracking-wide text-slate-500">
          Layer filter
        </span>
        {LAYER_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setLayer(f.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              layer === f.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="self-center text-xs font-semibold uppercase tracking-wide text-slate-500">
          JCT family
        </span>
        {FAMILIES.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFamily(f)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              family === f
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {f === "All" ? "All families" : f}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {(view === "deltas" || view === "interest-race") && (
          <ChartCard
            title="Vintage deltas (normalized)"
            subtitle="Year shifts flat when carried; $T shown as $B equivalents. Red = larger stock/flow."
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={deltaRows}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="displayLabel"
                    width={118}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(_v, _n, item) => {
                      const row = item?.payload as (typeof deltaRows)[0] | undefined;
                      if (!row) return [String(_v ?? ""), "Δ"];
                      if (row.unit === "year") return [fmtYearDelta(deltaSigned(row)), "Δ years"];
                      if (row.unit === "tn") return [fmtTn(deltaSigned(row)), "Δ"];
                      return [fmtDeltaBn(deltaSigned(row)), "Δ"];
                    }}
                  />
                  <ReferenceLine x={0} stroke="#94a3b8" />
                  <Bar dataKey="displayDelta" radius={[0, 4, 4, 0]}>
                    {deltaRows.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        )}

        {(view === "deltas" || view === "interest-race") && (
          <ChartCard
            title="JCT top lines — Aug vs Q3 fall refresh"
            subtitle="Prior update-2026 newest → CRFB/JCT fall path. Filter by tax-expenditure family."
          >
            <div className="h-[340px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={jctRows}
                  margin={{ top: 8, right: 12, left: 0, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="shortLabel"
                    angle={-32}
                    textAnchor="end"
                    interval={0}
                    height={60}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}B`} />
                  <Tooltip
                    formatter={(v, name) => [fmtBn(Number(v ?? 0)), String(name)]}
                  />
                  <Legend />
                  <Bar dataKey="priorBn" name="Aug vintage" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="newBn" name="Q3 fall refresh" radius={[4, 4, 0, 0]}>
                    {jctRows.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                  <Line
                    type="monotone"
                    dataKey="delta"
                    name="Δ $B"
                    stroke="#0f172a"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        )}

        {(view === "interest-race" || view === "deltas") && (
          <ChartCard
            title="Net interest vs discretionary race"
            subtitle="Editorial FY path: interest closes on the appropriation theater line. Ratio 0.61 → 0.65."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={INTEREST_VS_DISC_PATH}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="fy" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}T`} />
                  <Tooltip formatter={(v) => [fmtBn(Number(v ?? 0)), ""]} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="interestBn"
                    name="Net interest"
                    fill="#ddd6fe"
                    stroke="#7c3aed"
                    strokeWidth={2.5}
                  />
                  <Line
                    type="monotone"
                    dataKey="discBn"
                    name="Discretionary"
                    stroke="#64748b"
                    strokeWidth={2.5}
                    strokeDasharray="5 4"
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        )}

        {(view === "deltas" || view === "trust-carry") && (
          <ChartCard
            title="JCT aggregate waterfall (+$90B)"
            subtitle="How the fall refresh rebuilds $2.42T → $2.51T. Floating bars = signed contributions."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={waterfallRows}
                  margin={{ top: 8, right: 12, left: 0, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    angle={-28}
                    textAnchor="end"
                    interval={0}
                    height={60}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(1)}T`}
                    domain={[2300, 2550]}
                  />
                  <Tooltip
                    formatter={(_v, _n, item) => {
                      const row = item?.payload as (typeof waterfallRows)[0] | undefined;
                      if (!row) return ["", ""];
                      if (row.type === "base" || row.type === "total") {
                        return [fmtBn(row.height), row.label];
                      }
                      return [fmtDeltaBn(JCT_WATERFALL.find((j) => j.id === row.id)?.valueBn ?? 0), "Δ"];
                    }}
                  />
                  <Bar dataKey="start" stackId="w" fill="transparent" />
                  <Bar dataKey="height" stackId="w" radius={[4, 4, 0, 0]}>
                    {waterfallRows.map((r) => (
                      <Cell key={r.id} fill={r.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        )}

        {(view === "trust-carry" || view === "deltas") && (
          <ChartCard
            title="Trust-fund clocks — carried years, softer reserves"
            subtitle="Depletion years unchanged vs Aug update. Solid lines = Q3 reserve path; dashed = prior."
          >
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={DEPLETION_PATH} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}T`} />
                  <Tooltip formatter={(v) => [fmtTn(Number(v ?? 0)), ""]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="priorOasdi"
                    name="OASDI Aug"
                    stroke="#94a3b8"
                    strokeDasharray="5 4"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="newOasdi"
                    name="OASDI Q3"
                    stroke="#0ea5e9"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="priorHi"
                    name="HI Aug"
                    stroke="#fbbf24"
                    strokeDasharray="5 4"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="newHi"
                    name="HI Q3"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
              {trustCarry.map((t) => (
                <li key={t.name}>
                  <span className="font-semibold">{t.name}:</span> clock {t.year} (carried);
                  reserves Δ {fmtDeltaBn(t.reserveDelta)}
                </li>
              ))}
            </ul>
          </ChartCard>
        )}

        <ChartCard
          title="Plumbing layers — Aug vs Q3 ($B)"
          subtitle="Editorial composition map. Net interest and tax-code move hardest; discretionary barely."
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={layerBars} margin={{ top: 8, right: 12, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  angle={-22}
                  textAnchor="end"
                  interval={0}
                  height={55}
                  tick={{ fontSize: 10 }}
                />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}T`} />
                <Tooltip formatter={(v) => [fmtBn(Number(v ?? 0)), ""]} />
                <Legend />
                <Bar dataKey="priorBn" name="Aug vintage" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="newBn" name="Q3 newest" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Off-balance leverage scatter"
          subtitle="X = budget visibility, Y = policy leverage, size ∝ newest stock. Violet = larger Δ stock."
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: 8, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="budgetVisibility"
                  name="Budget visibility"
                  domain={[0, 50]}
                  tick={{ fontSize: 11 }}
                  label={{ value: "Budget visibility", position: "insideBottom", offset: -4, fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="policyLeverage"
                  name="Policy leverage"
                  domain={[40, 100]}
                  tick={{ fontSize: 11 }}
                  label={{ value: "Policy leverage", angle: -90, position: "insideLeft", fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="size" range={[80, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v, name) => [String(v ?? ""), String(name)]}
                  labelFormatter={(_l, payload) => {
                    const p = payload?.[0]?.payload as (typeof scatterRows)[0] | undefined;
                    return p
                      ? `${p.shortLabel}: ${fmtTn(p.priorTn)} → ${fmtTn(p.newTn)}`
                      : "";
                  }}
                />
                <Scatter data={scatterRows} name="Vehicles">
                  {scatterRows.map((r) => (
                    <Cell
                      key={r.id}
                      fill={r.deltaTn > 0.1 ? "#8b5cf6" : r.deltaTn > 0 ? "#a78bfa" : "#94a3b8"}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="ESI packaging gap — Treasury vs JCT"
        subtitle="Same employer-health concept, two offices. Gap narrows slightly again (52 → 49)."
      >
        <div className="h-[260px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={SCOPE_GAP} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="vintage" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}B`} />
              <Tooltip formatter={(v) => [fmtBn(Number(v ?? 0)), ""]} />
              <Legend />
              <Area
                type="monotone"
                dataKey="gapBn"
                name="Packaging gap"
                fill="#fecdd3"
                stroke="#be123c"
                strokeWidth={2}
              />
              <Bar dataKey="treasuryBn" name="Treasury ESI" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="jctBn" name="JCT ESI" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-sm text-slate-600">
          Gap: ${HEADLINE.scopeGapEsiPriorBn}B → ${HEADLINE.scopeGapEsiNewBn}B. Methodology,
          not a spreadsheet error — cite one office and you can still cherry-pick a preferred giant.
        </p>
      </ChartCard>

      <details className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <summary className="cursor-pointer font-semibold text-slate-800">
          Sources & caveats
        </summary>
        <p className="mt-2">{SOURCE_NOTE}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {SOURCES.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-slate-500">
          Metrics tracked: {VINTAGE_DELTAS.length} vintage deltas ·{" "}
          {LAYER_COMPOSITION.length} plumbing layers · {OFF_BALANCE_DELTAS.length} off-balance
          vehicles. Colors: tax {LAYER_COLORS["tax-code"]}, interest {LAYER_COLORS.interest}.
        </p>
      </details>
    </div>
  );
}
