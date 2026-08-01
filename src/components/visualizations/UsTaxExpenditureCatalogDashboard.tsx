"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Tooltip } from "@/components/charts/SortedTooltip";
import {
  BUDGET_YARDSTICKS,
  GDP_YARDSTICK,
  HEADLINE,
  INSTRUMENT_COLORS,
  INSTRUMENT_LABELS,
  INSTRUMENT_MIX,
  PCT_GDP_SERIES,
  SOURCE_NOTE,
  SOURCES,
  catalogFor,
  filterCatalog,
  fmtBn,
  fmtPct,
  instrumentTotals,
  toPctGdp,
  type Instrument,
} from "@/data/us-tax-expenditure-catalog-2026-data";

// viz-types: area %GDP path, horizontal catalog bars, instrument donut, stacked mix lines, radar vs budget | layout: default

type SourceScope = "jct" | "treasury";
type InstrumentFilter = Instrument | "all";
type UnitMode = "dollars" | "pctGdp";

const FILTER_OPTIONS: { key: InstrumentFilter; label: string }[] = [
  { key: "all", label: "All instruments" },
  { key: "credit", label: "Credits only" },
  { key: "exclusion", label: "Exclusions" },
  { key: "preferential_rate", label: "Preferential rates" },
  { key: "deduction", label: "Deductions" },
  { key: "deferral", label: "Deferrals" },
];

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

function TogglePill<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { key: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onChange(o.key)}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
            value === o.key
              ? "bg-slate-900 text-white shadow"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function UsTaxExpenditureCatalogDashboard() {
  const [scope, setScope] = useState<SourceScope>("jct");
  const [instrument, setInstrument] = useState<InstrumentFilter>("all");
  const [unit, setUnit] = useState<UnitMode>("pctGdp");

  const items = useMemo(
    () => filterCatalog(catalogFor(scope), instrument),
    [scope, instrument],
  );

  const catalogBars = useMemo(
    () =>
      items.map((i) => ({
        name: i.shortLabel,
        value: unit === "dollars" ? i.fy2026Bn : toPctGdp(i.fy2026Bn),
        fill: INSTRUMENT_COLORS[i.instrument],
        instrument: INSTRUMENT_LABELS[i.instrument],
        rawBn: i.fy2026Bn,
      })),
    [items, unit],
  );

  const donut = useMemo(() => instrumentTotals(catalogFor(scope)), [scope]);

  const mixLines = useMemo(
    () =>
      INSTRUMENT_MIX.map((r) => ({
        year: r.year,
        Exclusions: r.exclusionPct,
        Credits: r.creditPct,
        "Preferential rates": r.preferentialPct,
        Deductions: r.deductionPct,
      })),
    [],
  );

  const radarData = useMemo(() => {
    const max = Math.max(...BUDGET_YARDSTICKS.map((b) => b.fy2026Bn));
    return BUDGET_YARDSTICKS.map((b) => ({
      label: b.label.replace(" (approx)", "").replace("JCT ", ""),
      score: (b.fy2026Bn / max) * 100,
      bn: b.fy2026Bn,
      kind: b.kind,
    }));
  }, []);

  const headlinePct = HEADLINE.jctFy2026PctGdp;

  return (
    <div className="space-y-6" data-viz="us-tax-expenditure-catalog-2026">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        {SOURCE_NOTE}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Catalog scope</p>
          <TogglePill
            value={scope}
            onChange={setScope}
            options={[
              { key: "jct", label: "JCT top-10 catalog" },
              { key: "treasury", label: "Treasury headlines" },
            ]}
          />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Display unit</p>
          <TogglePill
            value={unit}
            onChange={setUnit}
            options={[
              { key: "pctGdp", label: "% of GDP" },
              { key: "dollars", label: "$ billions" },
            ]}
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Instrument filter
        </p>
        <TogglePill value={instrument} onChange={setInstrument} options={FILTER_OPTIONS} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
          Tax expenditures % GDP
        </p>
        <p className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          {fmtPct(headlinePct)} of GDP in FY2026
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          JCT projects {fmtBn(2300)} in individual and corporate tax expenditures for FY2026 — about{" "}
          {fmtPct(headlinePct)} of a ${GDP_YARDSTICK.fy2026Tn.toFixed(1)}T GDP yardstick. That is larger
          than Social Security, larger than all discretionary spending, and more than four times
          corporate income-tax receipts. Credits alone in the JCT top-10 (CTC, ACA, EITC) sum to{" "}
          {fmtBn(HEADLINE.creditsTopBn)}.
        </p>
      </div>

      <ChartCard
        title="Tax expenditures as % of GDP"
        subtitle="Urban Institute anchors (2017 peak, 2024 trough, 2029 rebound) + JCT $/GDP for 2025–26"
      >
        <div className="h-80 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PCT_GDP_SERIES} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="teGdpFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis
                domain={[5, 9]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 12 }}
                width={42}
              />
              <Tooltip
                formatter={(v, _n, ctx) => {
                  const row = ctx?.payload;
                  const conf = row?.confidence === "estimated" ? " (est.)" : "";
                  return [`${Number(v).toFixed(1)}%${conf}`, "% of GDP"];
                }}
                labelFormatter={(y) => `FY${y}`}
              />
              <Area
                type="monotone"
                dataKey="pctGdp"
                stroke="#0284c7"
                fill="url(#teGdpFill)"
                strokeWidth={2.5}
                name="% of GDP"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title={scope === "jct" ? "JCT largest tax expenditures (FY2026)" : "Treasury largest items (FY2026)"}
          subtitle={
            unit === "pctGdp"
              ? `Filtered catalog · values as % of $${GDP_YARDSTICK.fy2026Tn.toFixed(1)}T GDP`
              : "Filtered catalog · revenue-loss estimates ($B)"
          }
        >
          <div className="h-[420px] w-full min-w-0">
            {catalogBars.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-slate-500">
                No items match this instrument filter in the selected catalog.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={catalogBars}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) =>
                      unit === "dollars" ? `$${v}` : `${Number(v).toFixed(1)}%`
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={118}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, _n, ctx) => {
                      const raw = ctx?.payload?.rawBn;
                      const inst = ctx?.payload?.instrument;
                      if (unit === "dollars") {
                        return [`${fmtBn(Number(v))} · ${inst}`, "FY2026"];
                      }
                      return [`${fmtPct(Number(v))} of GDP (${fmtBn(raw)}) · ${inst}`, "FY2026"];
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {catalogBars.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>

        <ChartCard
          title="Instrument mix inside the catalog"
          subtitle={`${scope === "jct" ? "JCT top-10" : "Treasury headlines"} — donut by instrument type`}
        >
          <div className="h-[420px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donut}
                  dataKey="bn"
                  nameKey="label"
                  cx="50%"
                  cy="48%"
                  innerRadius={68}
                  outerRadius={118}
                  paddingAngle={2}
                >
                  {donut.map((d) => (
                    <Cell key={d.instrument} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, name) => [fmtBn(Number(v)), String(name)]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-[-8px] flex flex-wrap justify-center gap-3 text-xs text-slate-600">
              {donut.map((d) => (
                <span key={d.instrument} className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: d.color }}
                  />
                  {d.label} ({fmtPct(d.sharePct, 0)})
                </span>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Credits are the rising slice of the catalog"
        subtitle="Estimated share of summed tax expenditures by instrument family (editorial packaging of JCT/Treasury families)"
      >
        <div className="h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mixLines} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} width={42} />
              <Tooltip formatter={(v, name) => [`${v}%`, String(name)]} />
              <Line
                type="monotone"
                dataKey="Exclusions"
                stroke={INSTRUMENT_COLORS.exclusion}
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="Credits"
                stroke={INSTRUMENT_COLORS.credit}
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="Preferential rates"
                stroke={INSTRUMENT_COLORS.preferential_rate}
                strokeWidth={2}
                strokeDasharray="4 3"
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="Deductions"
                stroke={INSTRUMENT_COLORS.deduction}
                strokeWidth={2}
                strokeDasharray="4 3"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard
        title="If tax expenditures were a budget radar"
        subtitle="FY2026 scale: each spoke is relative size vs the largest item (JCT tax expenditures = 100)"
      >
        <div className="h-80 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="52%" outerRadius="70%">
              <PolarGrid stroke="#cbd5e1" />
              <PolarAngleAxis dataKey="label" tick={{ fontSize: 11, fill: "#475569" }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Relative size"
                dataKey="score"
                stroke="#0f172a"
                fill="#0ea5e9"
                fillOpacity={0.35}
              />
              <Tooltip
                formatter={(_v, _n, ctx) => [fmtBn(ctx?.payload?.bn ?? 0), "Approx FY2026"]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <p className="text-xs text-slate-500">
        Sources: {SOURCES.join(" · ")}
      </p>
    </div>
  );
}
